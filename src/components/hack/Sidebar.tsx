import { Countdown } from "./Countdown";
import { COORDINATORS } from "./data";

export function Sidebar({ onRegister }: { onRegister: () => void }) {
  return (
    <aside className="flex flex-col gap-4">
      <div className="panel p-8">
        <Countdown />
      </div>

      <div className="panel p-8">
        <p className="label-caps">Timing</p>
        <p className="mt-2 text-foreground/90">Event runs 9:00 AM – 4:45 PM</p>
      </div>

      <div className="panel p-8">
        <p className="label-caps">Awards</p>
        <p className="mt-2 text-foreground/90">7 award categories</p>
      </div>

      <div className="panel border-accent p-8">
        <p className="label-caps">Registration fee</p>
        <p className="mt-2 font-display text-3xl font-bold">₹200 per team</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/45">
          Covers the full-day hackathon, mentoring and awards.
        </p>
        <button
          type="button"
          onClick={onRegister}
          className="btn-accent mt-6 w-full px-6 py-3 text-sm"
        >
          Register your team
        </button>
      </div>

      <div id="contact" className="panel p-8">
        <p className="label-caps">Meet the coordinators</p>
        <div className="mt-5">
          {COORDINATORS.map((c, i) => (
            <div key={c.name} className={i > 0 ? "mt-5 border-t border-border pt-5" : ""}>
              <p className="text-foreground/90">{c.name}</p>
              <p className="mt-1 text-sm text-foreground/45">{c.role}</p>
              <a
                href={`tel:${c.phone}`}
                className="mt-1 inline-block font-mono text-sm text-accent hover:underline"
              >
                {c.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
