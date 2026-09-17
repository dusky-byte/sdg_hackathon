import { STATS } from "./data";

export function StatsBar() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-6 border-t border-border py-6">
      {STATS.map(([value, label], i) => (
        <div key={label} className="flex items-center gap-12">
          {i > 0 && <span className="hidden h-8 w-px bg-border sm:block" aria-hidden />}
          <div>
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="label-caps mt-1">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
