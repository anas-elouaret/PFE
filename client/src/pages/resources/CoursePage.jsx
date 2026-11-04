import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, GraduationCap, ListTree, Target } from "lucide-react";
import useSeo, { useJsonLd, ORIGIN } from "../../hooks/useSeo";
import { getCourse, courses } from "../../data/academyData";
import GuideQuiz from "../../components/resources/GuideQuiz";
import ReadingProgress from "../../components/resources/ReadingProgress";
import { headingId, rememberLastGuide } from "../../utils/learningProgress";

export default function CoursePage() {
  const { slug } = useParams();
  const course = getCourse(slug);
  if (!course) return <Navigate to="/404" replace />;
  return <CourseView course={course} />;
}

function CourseView({ course }) {
  useSeo({
    title: `Cours ${String(course.number).padStart(2, "0")} — ${course.title}`,
    description: course.objective,
    path: `/ressources/cours/${course.slug}`,
  });

  useJsonLd(
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: course.title,
      description: course.objective,
      inLanguage: "fr",
      educationalLevel: course.level,
      timeRequired: course.duration,
      provider: { "@type": "Organization", name: "GROWSTACK", url: ORIGIN },
      isAccessibleForFree: true,
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: course.duration,
      },
    },
    `course-${course.slug}`
  );

  useEffect(() => {
    rememberLastGuide(`cours/${course.slug}`);
  }, [course.slug]);

  const index = courses.findIndex((c) => c.slug === course.slug);
  const previous = index > 0 ? courses[index - 1] : null;
  const next = index < courses.length - 1 ? courses[index + 1] : null;

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
      <ReadingProgress />

      <Link
        to="/ressources"
        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-orange-600"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        GROWSTACK Academy
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-wider">
          <span className="bg-slate-900 px-2.5 py-1 text-white">
            Cours {String(course.number).padStart(2, "0")} / {courses.length}
          </span>
          <span className="inline-flex items-center gap-1 text-orange-600">
            <GraduationCap size={13} aria-hidden="true" />
            {course.level}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Clock size={12} aria-hidden="true" />
            {course.duration}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          {course.title}
        </h1>

        <div className="mt-6 flex gap-3 border-s-2 border-orange-500 bg-slate-50 p-5">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Objectif pédagogique
            </p>
            <p className="mt-1.5 text-base leading-7 text-slate-700">{course.objective}</p>
          </div>
        </div>
      </header>

      <nav aria-label="Leçons du cours" className="mt-8 border border-slate-200 bg-white p-5">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <ListTree size={13} aria-hidden="true" />
          {course.lessons.length} leçons
        </p>
        <ol className="mt-3 space-y-1.5">
          {course.lessons.map((lesson, i) => (
            <li key={lesson.title} className="flex gap-2.5 text-sm leading-6">
              <span className="shrink-0 font-mono text-xs text-slate-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${headingId(lesson.title)}`}
                className="text-slate-600 underline-offset-2 hover:text-orange-600 hover:underline"
              >
                {lesson.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-12">
        {course.lessons.map((lesson, i) => (
          <section key={lesson.title}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
              Leçon {String(i + 1).padStart(2, "0")}
            </p>
            <h2
              id={headingId(lesson.title)}
              className="mt-2 scroll-mt-24 text-xl font-bold leading-snug text-slate-900 sm:text-2xl"
            >
              {lesson.title}
            </h2>

            {lesson.paragraphs.map((p) => (
              <p key={p} className="mt-4 text-base leading-7 text-slate-600">
                {p}
              </p>
            ))}

            {lesson.practice && (
              <div className="mt-5 border border-slate-200 bg-slate-50 p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Mise en situation
                </p>
                <p className="mt-1.5 text-[15px] leading-7 text-slate-700">{lesson.practice}</p>
              </div>
            )}
          </section>
        ))}
      </div>

      {course.caseStudy && (
        <section className="mt-14 border-s-2 border-slate-900 bg-white ps-5">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            Étude de cas
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">{course.caseStudy}</p>
        </section>
      )}

      {course.assignment && (
        <section className="mt-10 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-base font-bold uppercase tracking-wider text-white">
            Travail pratique à remettre
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-300">{course.assignment}</p>
          {course.deliverable && (
            <p className="mt-5 border-t border-white/10 pt-4 text-sm text-slate-400">
              <span className="font-bold uppercase tracking-wider text-orange-400">Livrable</span>{" "}
              · {course.deliverable}
            </p>
          )}
        </section>
      )}

      <GuideQuiz slug={course.slug} />

      <nav
        aria-label="Navigation dans le parcours"
        className="mt-16 grid gap-4 border-t border-slate-200 pt-10 sm:grid-cols-2"
      >
        {previous ? (
          <Link
            to={`/ressources/cours/${previous.slug}`}
            className="group flex items-start gap-3 border border-slate-200 bg-white p-5 transition-colors hover:border-orange-400"
          >
            <ArrowLeft
              size={18}
              className="mt-1 shrink-0 text-slate-400 group-hover:text-orange-600"
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Cours {String(previous.number).padStart(2, "0")}
              </span>
              <span className="mt-1 block font-bold leading-snug text-slate-900 group-hover:text-orange-600">
                {previous.title}
              </span>
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}

        {next && (
          <Link
            to={`/ressources/cours/${next.slug}`}
            className="group flex items-start justify-between gap-3 border-2 border-slate-900 bg-white p-5 text-right transition-colors hover:border-orange-500 sm:flex-row-reverse sm:text-left"
          >
            <ArrowRight
              size={18}
              className="mt-1 shrink-0 text-slate-400 group-hover:text-orange-600"
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold uppercase tracking-wider text-orange-600">
                Cours {String(next.number).padStart(2, "0")}
              </span>
              <span className="mt-1 block font-bold leading-snug text-slate-900 group-hover:text-orange-600">
                {next.title}
              </span>
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
