import { useEffect, useState } from "react";
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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update the time every minute to keep the timeline perfectly in sync
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getEventState = (timeString: string) => {
    // timeString format: "9:00 – 9:15"
    const parts = timeString.split(" – ");
    const startStr = parts[0];
    const endStr = parts[1] || parts[0]; // Fallback if no end time

    const parseTime = (ts: string) => {
      const [h, m] = ts.split(":").map(Number);
      // Fixed to the event date to properly calculate past/present/future
      const d = new Date("2026-09-26T00:00:00+05:30");
      d.setHours(h, m, 0, 0);
      return d;
    };

    const start = parseTime(startStr);
    const end = parseTime(endStr);

    if (now > end) return "past";
    if (now >= start && now <= end) return "active";
    return "future";
  };

  return (
    <section id="schedule" className="border-t border-border pt-16">
      <Reveal>
        <h2 className="label-caps">Schedule</h2>
        <div className="mt-8 relative">
          {SCHEDULE.map(([time, title], i) => {
            const state = getEventState(time);
            return (
              <div
                key={time}
                className="relative flex gap-6 sm:gap-8 py-4 sm:py-6 group"
              >
                {/* Time Column */}
                <div className="w-28 sm:w-32 shrink-0 font-mono text-sm text-foreground/50 text-right pt-0.5">
                  {time}
                </div>
                
                {/* Timeline Nodes */}
                <div className="relative flex flex-col items-center">
                  {/* Vertical connecting line */}
                  {i !== SCHEDULE.length - 1 && (
                    <div className={`absolute top-5 bottom-[-1rem] sm:bottom-[-1.5rem] w-px transition-colors duration-500 ${state === 'past' ? 'bg-accent' : 'bg-border'}`} />
                  )}
                  
                  {/* Bullet (O) Node */}
                  <div className={`
                    relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full mt-1 transition-all duration-500
                    ${state === 'past' ? 'bg-accent border-2 border-accent' : 
                      state === 'active' ? 'bg-background border-[3px] border-accent shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 
                      'bg-background border-2 border-border'}
                  `} />
                </div>
                
                {/* Event Title */}
                <div className={`pt-0.5 sm:pt-0 ${state === 'active' ? 'text-accent font-medium' : 'text-foreground/90'}`}>
                  {title}
                  {state === 'active' && (
                    <span className="ml-3 text-[10px] sm:text-xs uppercase tracking-widest text-accent font-mono animate-pulse">
                      Happening Now
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}



export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border pt-6 pb-2 text-sm text-foreground/45">
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
