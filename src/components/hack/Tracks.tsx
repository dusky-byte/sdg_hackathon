import { motion } from "framer-motion";
import { TRACKS } from "./data";

export function Tracks({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (track: string) => void;
}) {
  return (
    <section id="tracks" className="relative overflow-hidden pt-16">
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 right-0 select-none font-display text-[12rem] font-bold leading-none text-foreground/5 sm:text-[16rem]"
        >
          05
        </span>
        <h2 className="label-caps relative">Choose your track</h2>
      </div>

      <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
        {TRACKS.map((t, i) => {
          const on = selected === t.label;
          return (
            <motion.button
              key={t.label}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              onClick={() => onSelect(t.label)}
              aria-pressed={on}
              className={`panel relative w-[17rem] shrink-0 snap-start p-6 text-left transition-colors ${
                on ? "border-accent" : "hover:border-foreground/25"
              }`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-2 font-display text-6xl font-bold leading-none text-accent/20"
              >
                0{i + 1}
              </span>
              <span className="relative mt-16 block font-display text-2xl leading-tight text-foreground/90">
                {t.label}
              </span>
              <span className="mt-3 block text-sm leading-relaxed text-foreground/45">
                {t.blurb}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
