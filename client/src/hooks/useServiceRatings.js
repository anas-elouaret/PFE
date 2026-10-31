import { useEffect, useState } from "react";
import { getRatingSummary } from "../services/reviewApi";

/**
 * Average rating and count per service.
 *
 * A page can show dozens of service cards, so the summary is fetched once and
 * shared: the first caller starts the request, everyone else waits on the same
 * promise and is notified when it resolves.
 */
let cache = null;
let inFlight = null;
const listeners = new Set();

function load() {
  if (cache) return Promise.resolve(cache);
  if (!inFlight) {
    inFlight = getRatingSummary()
      .then((summary) => {
        cache = summary || {};
        listeners.forEach((fn) => fn(cache));
        return cache;
      })
      .catch(() => {
        // A missing summary must not break a page: cards simply show no rating.
        cache = {};
        listeners.forEach((fn) => fn(cache));
        return cache;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

/** Drop the cache so the next read refetches — used after a rating is accepted. */
export function invalidateServiceRatings() {
  cache = null;
}

export default function useServiceRatings() {
  const [summary, setSummary] = useState(cache || {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let active = true;
    const notify = (next) => {
      if (active) {
        setSummary(next);
        setLoading(false);
      }
    };
    listeners.add(notify);
    load().then(notify);
    return () => {
      active = false;
      listeners.delete(notify);
    };
  }, []);

  /** { average, count } for a service, or null when it has no ratings yet. */
  const getRating = (serviceId) => {
    const entry = serviceId ? summary[serviceId] : null;
    return entry && entry.count > 0 ? entry : null;
  };

  return { summary, loading, getRating };
}
