import { useCallback, useEffect, useState } from "react";

/**
 * The opening animation on the home page.
 *
 * Built with CSS 3D rather than three.js. three, @react-three/fiber, drei and
 * postprocessing are all already dependencies but nothing reachable imports
 * them, so they are not in the bundle today — pulling them in for an intro
 * would add several hundred kilobytes to the one page whose loading speed
 * matters most for search. A perspective grid and a rotated logo cost nothing.
 *
 * It behaves itself:
 * - once per tab, not on every navigation back to the home page;
 * - skipped outright when the visitor asks for reduced motion;
 * - dismissed by a click, a key or a scroll, and gone on its own after 2.4s;
 * - the page renders underneath the whole time, so nothing is being waited on.
 */
const SESSION_KEY = "growstack.introSeen";
const DURATION = 2400;

function shouldSkip() {
  try {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Blocked storage is not a reason to replay the intro on every view, but
    // it is not a reason to fail either.
    return false;
  }
}

export default function HeroIntro() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (shouldSkip()) return undefined;
    setVisible(true);
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    // Hold the page still while the overlay is up, so a stray scroll does not
    // leave the visitor halfway down the page when it lifts.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const dismiss = useCallback(() => {
    setLeaving(true);
    window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 450);
  }, []);

  useEffect(() => {
    if (!visible || leaving) return undefined;
    const timer = window.setTimeout(dismiss, DURATION);
    const onKey = () => dismiss();
    const onWheel = () => dismiss();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onWheel, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onWheel);
    };
  }, [visible, leaving, dismiss]);

  if (!visible) return null;

  return (
    <div
      // Decorative: the home page below carries every word of this.
      aria-hidden="true"
      onClick={dismiss}
      className={`gs-intro${leaving ? " gs-intro-out" : ""}`}
    >
      <style>{`
        .gs-intro{position:fixed;inset:0;z-index:9990;overflow:hidden;cursor:pointer;
          background:radial-gradient(120% 100% at 50% 55%,#111c33 0%,#0b1120 60%,#070b14 100%);
          display:flex;align-items:center;justify-content:center;perspective:900px}
        .gs-intro-out{animation:gsIntroOut 450ms ease forwards}
        @keyframes gsIntroOut{to{opacity:0;transform:scale(1.04);visibility:hidden}}
        .gs-floor{position:absolute;left:50%;top:62%;width:260vw;height:150vh;
          transform:translate(-50%,0) rotateX(72deg);transform-origin:50% 0;
          background-image:
            repeating-linear-gradient(to right, rgba(249,115,22,.55) 0 1.5px, transparent 1.5px 6.5%),
            repeating-linear-gradient(to bottom, rgba(249,115,22,.40) 0 1.5px, transparent 1.5px 5%);
          -webkit-mask-image:linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,.35) 45%, transparent 78%);
          mask-image:linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,.35) 45%, transparent 78%);
          animation:gsFloor 2.6s linear infinite}
        @keyframes gsFloor{to{background-position:0 6vh,0 6vh}}
        .gs-horizon{position:absolute;left:0;right:0;top:62%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(249,115,22,.65),transparent)}
        .gs-glow{position:absolute;width:520px;height:520px;border-radius:50%;
          background:radial-gradient(circle,rgba(249,115,22,.22) 0%,transparent 62%);filter:blur(12px)}
        .gs-stage{position:relative;text-align:center;transform-style:preserve-3d;padding:0 16px}
        .gs-logo{width:150px;max-width:44vw;height:auto;display:block;margin:0 auto;
          filter:drop-shadow(0 18px 40px rgba(0,0,0,.55));
          animation:gsLand 1000ms cubic-bezier(.16,1,.3,1) both}
        @keyframes gsLand{0%{opacity:0;transform:rotateY(-95deg) translateZ(-260px) scale(.55)}
          60%{opacity:1}100%{opacity:1;transform:rotateY(0) translateZ(0) scale(1)}}
        .gs-ring{position:absolute;left:50%;top:75px;width:180px;height:180px;margin:-90px 0 0 -90px;
          border:1px solid rgba(249,115,22,.75);border-radius:50%;
          animation:gsRing 1100ms cubic-bezier(.16,1,.3,1) 820ms both}
        @keyframes gsRing{from{opacity:.9;transform:scale(.5)}to{opacity:0;transform:scale(3.4)}}
        .gs-word{margin-top:24px;display:flex;justify-content:center;gap:.06em;flex-wrap:wrap}
        .gs-word span{display:inline-block;color:#fff;font-weight:900;font-size:clamp(20px,5vw,32px);
          letter-spacing:.24em;animation:gsRise 620ms cubic-bezier(.16,1,.3,1) both}
        @keyframes gsRise{from{opacity:0;transform:translateY(16px) rotateX(-55deg)}to{opacity:1;transform:none}}
        .gs-tag{margin-top:12px;color:rgba(255,255,255,.55);font-size:10px;font-weight:600;
          letter-spacing:.3em;text-transform:uppercase;
          animation:gsRise 620ms cubic-bezier(.16,1,.3,1) 1500ms both}
        .gs-bar{position:absolute;left:0;bottom:0;height:2px;width:100%;background:rgba(255,255,255,.08)}
        .gs-bar i{display:block;height:100%;background:#f97316;animation:gsFill ${DURATION}ms linear both}
        @keyframes gsFill{from{width:0}to{width:100%}}
        @media (prefers-reduced-motion: reduce){.gs-intro{display:none}}
      `}</style>

      <div className="gs-floor" />
      <div className="gs-horizon" />
      <div className="gs-glow" />

      <div className="gs-stage">
        <img className="gs-logo" src="/logo.png" alt="" width="150" height="150" />
        <div className="gs-ring" />
        <div className="gs-word">
          {"GROWSTACK".split("").map((letter, i) => (
            <span key={`${letter}-${i}`} style={{ animationDelay: `${1050 + i * 55}ms` }}>
              {letter}
            </span>
          ))}
        </div>
        <p className="gs-tag">Agence digitale · Maroc</p>
      </div>

      <div className="gs-bar">
        <i />
      </div>
    </div>
  );
}
