export default function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="tap-target flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <span>
        <span className="block font-medium" style={{ color: "var(--text)" }}>
          {label}
        </span>
        {description && (
          <span className="block text-sm" style={{ color: "var(--muted)" }}>
            {description}
          </span>
        )}
      </span>
      <span
        className="relative h-7 w-12 shrink-0 rounded-full transition-colors"
        style={{ backgroundColor: checked ? "var(--accent)" : "var(--border)" }}
      >
        <span
          className="absolute top-1 h-5 w-5 rounded-full bg-white transition-transform"
          style={{ transform: checked ? "translateX(22px)" : "translateX(4px)" }}
        />
      </span>
    </button>
  );
}
