import { IncidentCategory, CATEGORIES } from "@/lib/floodguard-data";

export function CategoryPill({
  category,
  className = "",
  showIconOnly = false,
}: {
  category: IncidentCategory;
  className?: string;
  showIconOnly?: boolean;
}) {
  const cat = CATEGORIES[category] || CATEGORIES.flooding;

  if (showIconOnly) {
    return (
      <span
        title={cat.label}
        className={`inline-flex size-7 items-center justify-center rounded-xl text-sm ${cat.iconBg} ${className}`}
      >
        {cat.emoji}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${cat.badgeColor} ${className}`}
    >
      <span aria-hidden>{cat.emoji}</span>
      <span>{cat.shortLabel}</span>
    </span>
  );
}
