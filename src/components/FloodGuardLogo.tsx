export function FloodGuardLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="FloodGuard Ilorin logo: a water drop inside a shield shaped like a map pin"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="fg-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.2 250)" />
          <stop offset="100%" stopColor="oklch(0.8 0.14 200)" />
        </linearGradient>
        <linearGradient id="fg-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.97 0.05 200)" />
          <stop offset="100%" stopColor="oklch(0.82 0.14 205)" />
        </linearGradient>
        <linearGradient id="fg-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.9 0.16 95)" />
          <stop offset="100%" stopColor="oklch(0.76 0.17 55)" />
        </linearGradient>
      </defs>
      {/* shield + map pin silhouette */}
      <path
        d="M32 3 55 11v22c0 12-9.5 20.5-23 30C18.5 53.5 9 45 9 33V11L32 3Z"
        fill="url(#fg-shield)"
      />
      {/* water drop */}
      <path
        d="M32 15c6 7.5 10 12.4 10 17.4A10 10 0 0 1 22 32.4C22 27.4 26 22.5 32 15Z"
        fill="url(#fg-drop)"
      />
      {/* Ilorin-inspired sun/arch motif */}
      <circle cx="32" cy="33" r="4.2" fill="url(#fg-sun)" />
      {/* water waves at the base */}
      <path
        d="M14 41c4 0 4 3 8 3s4-3 8-3 4 3 8 3 4-3 8-3"
        stroke="oklch(0.99 0.01 240)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}
