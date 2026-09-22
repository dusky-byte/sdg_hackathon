import { MessageCircle } from "lucide-react";
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
        <p className="mt-2 text-foreground/90">3 award categories</p>
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
        
        <div className="mt-8 border-t border-border pt-6">
          <p className="label-caps mb-4">Event Updates</p>
          <a
            href="https://chat.whatsapp.com/Cv5WDAyFEgrLd7PF05MG2A?s=cl&p=a&mlu=4&ilr=4"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-6 py-3 text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            Join WhatsApp Group
          </a>
        </div>
      </div>
    </aside>
  );
}
