import { useEffect, useState } from "react";

/**
 * A thin bar at the top of the window showing how far through the article the
 * reader is. On a long guide it answers "how much is left" without scrolling
 * to find out.
 *
 * Hidden from assistive technology and from print: it conveys nothing a
 * screen reader user cannot get from the document itself.
 */
export default function ReadingProgress() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setPercent(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent print:hidden"
    >
      <div
        className="h-full bg-orange-500 transition-[width] duration-150 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
