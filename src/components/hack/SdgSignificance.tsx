import { motion } from "framer-motion";

export function SdgSignificance() {
  const cards = [
    {
      title: "Equal Access",
      blurb: "Quality education should reach every learner, regardless of background or circumstance.",
    },
    {
      title: "Lifelong Learning",
      blurb: "Building skills and curiosity that keep working long after graduation.",
    },
    {
      title: "Reduced Inequality",
      blurb: "Education closes gaps in opportunity, income, and access to opportunity.",
    },
    {
      title: "Sustainable Future",
      blurb: "An educated generation is what drives long-term, lasting progress.",
    },
  ];

  return (
    <section id="significance" className="relative pt-16 pb-20">
      <div className="relative mb-12">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 right-0 select-none font-display text-[12rem] font-bold leading-none text-foreground/5 sm:text-[16rem]"
        >
          04
        </span>
        <h2 className="label-caps relative">Significance of SDG 04</h2>
      </div>

      <div className="group mx-auto max-w-4xl flex flex-col gap-12 pb-4">
        {cards.map((t, i) => {
          // Horizontal staircase offset
          const leftOffset = i * 120;
          // ALL cards are tilted down by default
          const rotation = 35;

          return (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`
                panel relative w-full p-8 text-left transition-all duration-500 origin-top-left
                border-border
                lg:w-[480px] lg:translate-x-[var(--x-offset)] lg:rotate-[12deg]
                hover:!opacity-100 lg:hover:rotate-0 lg:hover:-translate-y-2 hover:scale-[1.03] hover:border-accent hover:shadow-[0_0_30px_rgba(225,29,72,0.3)] hover:z-10
                group-hover:opacity-40
              `}
              style={{
                '--x-offset': `${leftOffset}px`,
              } as any}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-2 font-display text-6xl font-bold leading-none text-accent/20"
              >
                0{i + 1}
              </span>
              <span className="relative mt-12 block font-display text-2xl leading-tight text-foreground/90">
                {t.title}
              </span>
              <span className="mt-3 block text-sm leading-relaxed text-foreground/60">
                {t.blurb}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
