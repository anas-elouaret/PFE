import { useCallback, useEffect, useState } from "react";

/**
 * The opening animation on the home page.
 *
 * The two halves of the puzzle mark fly in from either side, lock together
 * with a flash along the seam, the name rises — and then the screen itself
 * splits down that seam and the two panels slide apart to reveal the page.
 * The mark is one image shown twice, each copy clipped to its own half, so
 * the approved logo is used as it is rather than redrawn.
 *
 * Built with CSS 3D rather than three.js. three, @react-three/fiber, drei and
 * postprocessing are all already dependencies but nothing reachable imports
 * them, so they are not in the bundle today — pulling them in for an intro
 * would add several hundred kilobytes to the one page whose loading speed
 * matters most for search.
 *
 * There is deliberately no sound. A browser will not play audio before the
 * visitor has interacted with the page, so a split effect on first load would
 * simply be silent; and an agency site that makes noise at a visitor is the
 * behaviour the brand rules already rule out for music.
 */
const SESSION_KEY = "growstack.introSeen";
const DURATION = 2750;

function shouldSkip() {
  try {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export default function HeroIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (shouldSkip()) return undefined;
    setVisible(true);
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const timer = window.setTimeout(dismiss, DURATION);
    const skip = () => dismiss();
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div className="gs-intro" aria-hidden="true" onClick={dismiss}>
      <style>{`
        .gs-intro{position:fixed;inset:0;z-index:9990;overflow:hidden;perspective:900px;cursor:pointer}
        .gs-panel{position:absolute;top:0;bottom:0;width:50.2%;overflow:hidden;
          background:radial-gradient(140% 110% at var(--fx) 55%,#111c33 0%,#0b1120 60%,#070b14 100%)}
        .gs-panel.l{left:0;--fx:100%;animation:gsOpenL 760ms cubic-bezier(.76,0,.24,1) 1950ms both}
        .gs-panel.r{right:0;--fx:0%;animation:gsOpenR 760ms cubic-bezier(.76,0,.24,1) 1950ms both}
        @keyframes gsOpenL{to{transform:translateX(-101%)}}
        @keyframes gsOpenR{to{transform:translateX(101%)}}
        .gs-seam{position:absolute;left:50%;top:0;bottom:0;width:2px;margin-left:-1px;
          animation:gsSeam 900ms ease 1500ms both}
        @keyframes gsSeam{0%{background:rgba(249,115,22,0)}
          40%{background:rgba(249,115,22,.9);box-shadow:0 0 26px 6px rgba(249,115,22,.5)}
          100%{background:rgba(249,115,22,0);box-shadow:none}}
        .gs-floor{position:absolute;top:62%;width:260vw;height:150vh;
          transform:translate(-50%,0) rotateX(72deg);transform-origin:50% 0;
          background-image:
            repeating-linear-gradient(to right, rgba(249,115,22,.55) 0 1.5px, transparent 1.5px 6.5%),
            repeating-linear-gradient(to bottom, rgba(249,115,22,.40) 0 1.5px, transparent 1.5px 5%);
          -webkit-mask-image:linear-gradient(to bottom,#000,rgba(0,0,0,.35) 45%,transparent 78%);
          mask-image:linear-gradient(to bottom,#000,rgba(0,0,0,.35) 45%,transparent 78%);
          animation:gsFloor 2.6s linear infinite}
        .gs-panel.l .gs-floor{left:100%}
        .gs-panel.r .gs-floor{left:0}
        @keyframes gsFloor{to{background-position:0 6vh,0 6vh}}
        .gs-horizon{position:absolute;left:0;right:0;top:62%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(249,115,22,.6),transparent)}
        .gs-stage{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
          justify-content:center;transform-style:preserve-3d;padding:0 16px;
          animation:gsStageOut 420ms ease 1900ms both}
        @keyframes gsStageOut{to{opacity:0;transform:scale(1.06)}}
        .gs-halves{position:relative;width:min(190px,46vw);height:min(190px,46vw);transform-style:preserve-3d}
        .gs-half{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;
          filter:drop-shadow(0 18px 40px rgba(0,0,0,.6))}
        .gs-half.l{clip-path:inset(0 50% 0 0);animation:gsJoinL 950ms cubic-bezier(.16,1,.3,1) both}
        .gs-half.r{clip-path:inset(0 0 0 50%);animation:gsJoinR 950ms cubic-bezier(.16,1,.3,1) both}
        @keyframes gsJoinL{0%{opacity:0;transform:translateX(-58vw) rotateY(-70deg) rotateZ(-16deg) scale(.7)}
          70%{opacity:1}86%{transform:translateX(7px) rotateY(0) rotateZ(0) scale(1)}100%{opacity:1;transform:none}}
        @keyframes gsJoinR{0%{opacity:0;transform:translateX(58vw) rotateY(70deg) rotateZ(16deg) scale(.7)}
          70%{opacity:1}86%{transform:translateX(-7px) rotateY(0) rotateZ(0) scale(1)}100%{opacity:1;transform:none}}
        .gs-flash{position:absolute;left:50%;top:50%;width:3px;height:118%;transform:translate(-50%,-50%);
          background:linear-gradient(to bottom,transparent,#fff,transparent);
          animation:gsFlash 420ms ease-out 820ms both}
        @keyframes gsFlash{0%{opacity:0;transform:translate(-50%,-50%) scaleY(.2)}
          35%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scaleY(1.3)}}
        .gs-ring{position:absolute;left:50%;top:50%;width:100%;height:100%;transform:translate(-50%,-50%);
          border:1px solid rgba(249,115,22,.75);border-radius:50%;
          animation:gsRing 1100ms cubic-bezier(.16,1,.3,1) 880ms both}
        @keyframes gsRing{from{opacity:.9;transform:translate(-50%,-50%) scale(.5)}
          to{opacity:0;transform:translate(-50%,-50%) scale(3.2)}}
        .gs-word{margin-top:26px;display:flex;gap:.06em;flex-wrap:wrap;justify-content:center}
        .gs-word span{color:#fff;font-weight:900;font-size:clamp(20px,5.5vw,32px);letter-spacing:.24em;
          display:inline-block;animation:gsRise 600ms cubic-bezier(.16,1,.3,1) both}
        @keyframes gsRise{from{opacity:0;transform:translateY(16px) rotateX(-55deg)}to{opacity:1;transform:none}}
        .gs-tag{margin-top:12px;color:rgba(255,255,255,.55);font-size:10px;font-weight:600;
          letter-spacing:.3em;text-transform:uppercase;
          animation:gsRise 600ms cubic-bezier(.16,1,.3,1) 1560ms both}
        @media (prefers-reduced-motion: reduce){.gs-intro{display:none}}
      `}</style>

      <div className="gs-panel l">
        <div className="gs-floor" />
        <div className="gs-horizon" />
      </div>
      <div className="gs-panel r">
        <div className="gs-floor" />
        <div className="gs-horizon" />
      </div>
      <div className="gs-seam" />

      <div className="gs-stage">
        <div className="gs-halves">
          <img className="gs-half l" src="/logo.png" alt="" width="190" height="190" />
          <img className="gs-half r" src="/logo.png" alt="" width="190" height="190" />
          <div className="gs-flash" />
          <div className="gs-ring" />
        </div>
        <div className="gs-word">
          {"GROWSTACK".split("").map((letter, i) => (
            <span key={`${letter}-${i}`} style={{ animationDelay: `${1100 + i * 55}ms` }}>
              {letter}
            </span>
          ))}
        </div>
        <p className="gs-tag">Agence digitale · Maroc</p>
      </div>
    </div>
  );
}
