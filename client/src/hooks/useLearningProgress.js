import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as quizApi from "../api/quizzes";

/**
 * The signed-in reader's best score per guide, for showing progress on the
 * resources hub and on a guide page.
 *
 * Cached at module level so moving between guides does not refetch on every
 * navigation, and invalidated when a quiz is submitted so a fresh result
 * shows up immediately.
 */
let cache = null;
let inFlight = null;
const listeners = new Set();

export function invalidateLearningProgress() {
  cache = null;
  inFlight = null;
  listeners.forEach((fn) => fn());
}

async function fetchProgress() {
  if (cache) return cache;
  if (!inFlight) {
    inFlight = quizApi
      .getMyAttempts()
      .then((data) => {
        cache = new Map((data.summary || []).map((s) => [s.guideSlug, s]));
        return cache;
      })
      .catch(() => {
        inFlight = null;
        return new Map();
      });
  }
  return inFlight;
}

export default function useLearningProgress() {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(cache || new Map());
  const [loading, setLoading] = useState(Boolean(isAuthenticated) && !cache);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setProgress(new Map());
      setLoading(false);
      return;
    }
    setLoading(!cache);
    const result = await fetchProgress();
    setProgress(result);
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    load();
    listeners.add(load);
    return () => listeners.delete(load);
  }, [load]);

  return { progress, loading, isAuthenticated };
}
