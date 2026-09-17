import { motion } from "framer-motion";
import heroImage from "@/assets/hero-students.jpg";
import { OrbitalNav } from "@/components/hack/OrbitalNav";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export function Hero({ onRegister }: { onRegister: () => void }) {
  return (
    <section id="home" className="relative min-h-[90vh]">
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <img
          src={heroImage}
          alt="Students collaborating around laptops during a hackathon"
          width={1920}
          height={1280}
          className="ambient-zoom absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.14 0.008 285 / 15%) 0%, oklch(0.14 0.008 285 / 55%) 55%, oklch(0.14 0.008 285 / 90%) 100%)",
          }}
        />
      </div>

      <OrbitalNav onRegister={onRegister} />

      <div className="relative flex min-h-[90vh] flex-col justify-end gap-6 px-8 pb-14 pt-28 sm:px-12 sm:pb-20">
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7 }}
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent"
        >
          SDG 4 — Quality Education
        </motion.p>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-brand text-[13vw] leading-[0.95] tracking-[0.02em] text-foreground sm:text-[9vw] lg:text-[7.5vw]"
        >
          HACK 2 HUSTLE
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-xl text-lg leading-relaxed text-foreground/70"
        >
          An inter-college mini-hackathon — learn, create, share.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/70"
        >
          <span>26 Sep 2026</span>
          <span className="h-4 w-px bg-border" aria-hidden />
          <span>FLABS Block 2, 1st Floor</span>
          <span className="h-4 w-px bg-border" aria-hidden />
          <span>₹200 per team</span>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.75 }}>
          <button type="button" onClick={onRegister} className="btn-accent px-7 py-3.5 text-sm">
            Register your team
          </button>
        </motion.div>
      </div>
    </section>
  );
}
