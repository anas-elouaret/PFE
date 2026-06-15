const sceneItems = [
  { id: "sphere-1", type: "sphere", left: "8%", top: "12%", z: "2rem", size: "6.2rem", delay: "0s" },
  { id: "cube-1", type: "cube", left: "18%", top: "68%", z: "4rem", size: "4.8rem", delay: "2.0s" },
  { id: "sphere-2", type: "sphere", left: "48%", top: "8%", z: "5rem", size: "5.4rem", delay: "4.0s" },
  { id: "cube-2", type: "cube", left: "68%", top: "18%", z: "3rem", size: "6.4rem", delay: "1.5s" },
  { id: "sphere-3", type: "sphere", left: "82%", top: "52%", z: "2rem", size: "5.2rem", delay: "3.5s" },
  { id: "cube-3", type: "cube", left: "12%", top: "80%", z: "6rem", size: "4.0rem", delay: "1.0s" },
  { id: "sphere-4", type: "sphere", left: "38%", top: "85%", z: "4rem", size: "3.6rem", delay: "2.5s" },
  { id: "cube-4", type: "cube", left: "62%", top: "75%", z: "5rem", size: "5.4rem", delay: "3.0s" },
];

export default function BackgroundScene() {
  return (
    <div className="bg-scene" aria-hidden="true">
      <div className="scene-grid">
        {sceneItems.map((item) => (
          <div
            key={item.id}
            className={`scene-object scene-object--${item.type}`}
            style={{
              "--size": item.size,
              "--delay": item.delay,
              left: item.left,
              top: item.top,
              transform: `translate3d(0, 0, ${item.z})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
