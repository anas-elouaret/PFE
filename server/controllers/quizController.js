const QuizAttempt = require("../models/QuizAttempt");
const { issueForPass } = require("./certificateController");
const quizData = require("../data/quizzes.json");

const PASS_MARK = typeof quizData.passMark === "number" ? quizData.passMark : 60;
const QUIZZES = quizData.quizzes || {};

/**
 * Questions as the browser is allowed to see them: no `correct`, no
 * `explanation`. Both are revealed only in the answer to a submitted attempt,
 * so the quiz cannot be read off the network tab before answering.
 */
function publicQuestions(quiz) {
  return quiz.questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
  }));
}

exports.getQuiz = (req, res) => {
  const quiz = QUIZZES[req.params.slug];
  if (!quiz) return res.status(404).json({ message: "Quiz introuvable." });

  res.json({
    slug: req.params.slug,
    title: quiz.title,
    passMark: PASS_MARK,
    totalQuestions: quiz.questions.length,
    questions: publicQuestions(quiz),
  });
};

/**
 * Grades an attempt.
 *
 * The score is computed here, from the answer key, and never read from the
 * request: a client-supplied score is a client-supplied claim. Anyone may
 * take a quiz and see their result; only a signed-in reader gets it saved,
 * and the response says which happened so the page can offer a sign-in.
 */
exports.submitQuiz = async (req, res) => {
  const { slug } = req.params;
  const quiz = QUIZZES[slug];
  if (!quiz) return res.status(404).json({ message: "Quiz introuvable." });

  const { answers } = req.body || {};
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return res.status(400).json({ message: "Réponses manquantes." });
  }

  const results = quiz.questions.map((q) => {
    const given = answers[q.id];
    const chosen = Number.isInteger(given) ? given : null;
    return {
      id: q.id,
      correct: q.correct,
      chosen,
      isCorrect: chosen === q.correct,
      explanation: q.explanation,
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalQuestions = quiz.questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= PASS_MARK;

  let saved = false;
  let certificateReference = null;
  if (req.userId) {
    try {
      await QuizAttempt.create({
        user: req.userId,
        guideSlug: slug,
        guideTitle: quiz.title,
        score,
        correctCount,
        totalQuestions,
        passed,
      });
      saved = true;
    } catch (err) {
      // A failed write must not lose the reader their result: report the
      // score, and say it was not recorded rather than implying it was.
      console.error("Quiz attempt not saved:", err.message);
    }

    if (passed) {
      try {
        const certificate = await issueForPass({
          userId: req.userId,
          guideSlug: slug,
          guideTitle: quiz.title,
          score,
        });
        certificateReference = certificate?.reference || null;
      } catch (err) {
        // Same reasoning: the reader keeps their score, and the page simply
        // does not offer a certificate it could not issue.
        console.error("Certificate not issued:", err.message);
      }
    }
  }

  res.json({
    score,
    correctCount,
    totalQuestions,
    passed,
    passMark: PASS_MARK,
    results,
    saved,
    certificateReference,
  });
};

/** Every attempt by the signed-in reader, plus their best score per guide. */
exports.getMyAttempts = async (req, res) => {
  const attempts = await QuizAttempt.find({ user: req.userId })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  const byGuide = new Map();
  for (const a of attempts) {
    const current = byGuide.get(a.guideSlug);
    if (!current) {
      byGuide.set(a.guideSlug, {
        guideSlug: a.guideSlug,
        guideTitle: a.guideTitle,
        bestScore: a.score,
        attempts: 1,
        passed: a.passed,
        lastAttemptAt: a.createdAt,
      });
    } else {
      current.attempts += 1;
      if (a.score > current.bestScore) current.bestScore = a.score;
      current.passed = current.passed || a.passed;
    }
  }

  res.json({
    summary: [...byGuide.values()].sort((a, b) =>
      new Date(b.lastAttemptAt) - new Date(a.lastAttemptAt)
    ),
    attempts,
  });
};
