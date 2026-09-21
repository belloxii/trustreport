const DROPS = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 13) % 22) / 10,
  duration: 0.9 + ((i * 7) % 9) / 10,
  height: 10 + ((i * 5) % 18),
}));

/** Decorative gentle rain. Purely visual. */
export function RainOverlay({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {DROPS.map((d, i) => (
        <span
          key={i}
          className="absolute top-0 w-[2px] rounded-full bg-white/45 animate-rain"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
