import { SDG_SIGNIFICANCE } from "./data";

export function Marquee() {
  const items = SDG_SIGNIFICANCE.map((t) => t.label);
  const row = [...items, ...items, ...items];

  return (
    <div className="relative mt-4 overflow-hidden border-y border-border py-3">
      <div className="marquee-track flex w-max gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/45">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 gap-8">
            {row.map((label, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-8">
                {label}
                <span className="text-accent">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
