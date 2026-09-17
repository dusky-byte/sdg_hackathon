import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Home, Info, Layers, Calendar, Mail } from "lucide-react";

const NAV = [
  { id: "home", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: Info },
  { id: "tracks", label: "Tracks", Icon: Layers },
  { id: "schedule", label: "Schedule", Icon: Calendar },
  { id: "contact", label: "Contact", Icon: Mail },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function OrbitalNav({ onRegister }: { onRegister: () => void }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const radius = isMobile ? 112 : 150;

  // Quarter arc sweeping down and to the right from the top-left corner.
  const offsets = NAV.map((_, i) => {
    const deg = 8 + (i / (NAV.length - 1)) * 80;
    const rad = (deg * Math.PI) / 180;
    return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
  });

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default"
        />
      )}

      <div className="absolute left-3 top-3 z-50 sm:left-4 sm:top-4" aria-label="Site navigation">
        <div className="relative">
          <AnimatePresence>
            {open &&
              NAV.map(({ id, label, Icon }, i) => (
                <motion.div
                  key={id}
                  className="absolute left-0 top-0"
                  initial={{ x: 0, y: 0, scale: 0.3, opacity: 0 }}
                  animate={{ x: offsets[i]!.x, y: offsets[i]!.y, scale: 1, opacity: 1 }}
                  exit={{ x: 0, y: 0, scale: 0.3, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 24,
                    delay: (open ? i : NAV.length - 1 - i) * 0.04,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      scrollTo(id);
                      setOpen(false);
                    }}
                    aria-label={label}
                    className="group flex h-11 w-11 items-center justify-center rounded-full border border-accent bg-background text-foreground/80 transition-transform hover:scale-[1.15] hover:text-foreground"
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70 opacity-0 transition-opacity group-hover:opacity-100">
                      {label}
                    </span>
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground sm:h-11 sm:w-11"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative block h-4 w-4"
            >
              <span className="absolute left-1/2 top-1/2 h-[2px] w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
              <span className="absolute left-1/2 top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-current" />
            </motion.span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onRegister}
        className="btn-accent absolute right-3 top-3 z-50 inline-flex items-center gap-2 px-6 py-3 text-sm sm:right-4 sm:top-4 sm:px-7 sm:py-3.5"
        style={{ borderRadius: "999px" }}
      >
        <span>Register</span>
        <ArrowUpRight className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>
    </>
  );
}
