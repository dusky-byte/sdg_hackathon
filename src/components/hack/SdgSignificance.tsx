import { motion } from "framer-motion";
import { SDG_SIGNIFICANCE } from "./data";

export function SdgSignificance() {
  return (
    <section id="significance" className="relative overflow-hidden pt-16">
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 right-0 select-none font-display text-[12rem] font-bold leading-none text-foreground/5 sm:text-[16rem]"
        >
          04
        </span>
        <h2 className="label-caps relative">Significance of SDG 04</h2>
      </div>

      <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
        {SDG_SIGNIFICANCE.map((t, i) => {
          return (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`panel relative w-[17rem] shrink-0 snap-start p-6 text-left transition-colors hover:border-foreground/25 border-border`}
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
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
