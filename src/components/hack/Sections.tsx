import { SCHEDULE, STEPS, TOOLS } from "./data";
import { Reveal } from "./Reveal";

export function AboutSection() {
  return (
    <section id="about" className="border-t border-border pt-16">
      <Reveal>
        <h2 className="label-caps">About the hackathon</h2>
        <p className="mt-6 max-w-3xl font-display text-2xl italic leading-snug text-foreground/80 sm:text-3xl">
          How can we use technology, AI and innovative ideas to make quality education more
          accessible, inclusive and engaging for everyone?
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative mt-14 grid gap-8 sm:grid-cols-4">
          <span
            className="absolute left-0 right-0 top-3 hidden h-px bg-border sm:block"
            aria-hidden
          />
          {STEPS.map(([num, label]) => (
            <div key={num} className="relative">
              <span className="relative block bg-background pr-3 font-mono text-xs text-accent">
                {num}
              </span>
              <p className="mt-3 text-foreground/90">{label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-14 max-w-2xl text-sm leading-relaxed text-foreground/45">
          Build your prototype with {TOOLS}
        </p>
      </Reveal>
    </section>
  );
}

export function ScheduleSection() {
  return (
    <section id="schedule" className="border-t border-border pt-16">
      <Reveal>
        <h2 className="label-caps">Schedule</h2>
        <div className="mt-6">
          {SCHEDULE.map(([time, title], i) => (
            <div
              key={time}
              className={`flex gap-8 py-4 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <span className="w-32 shrink-0 font-mono text-sm text-foreground/45">{time}</span>
              <span className="text-foreground/90">{title}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}



export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border py-10 text-sm text-foreground/45">
      <p>
        SRM Institute of Science and Technology — Dept. of Computer Science &amp; Dept. of Computer
        Applications, in collaboration with REACH.
      </p>
      <p className="mt-3">
        Pranesh —{" "}
        <a className="hover:text-foreground/80" href="tel:9843963338">
          9843963338
        </a>
        <span className="px-3">|</span>
        Smilin Jency —{" "}
        <a className="hover:text-foreground/80" href="tel:9123537640">
          9123537640
        </a>
      </p>
    </footer>
  );
}
