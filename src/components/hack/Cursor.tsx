import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 35, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 35, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("cursor-hidden");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHovering(Boolean(el?.closest("a, button, select, input, [role='button']")));
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("cursor-hidden");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.span
        className="block rounded-full"
        animate={
          hovering
            ? { width: 40, height: 40, backgroundColor: "rgba(0, 0, 0, 0)", borderWidth: 1 }
            : { width: 8, height: 8, backgroundColor: "var(--accent)", borderWidth: 0 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ borderStyle: "solid", borderColor: "var(--accent)" }}
      />
    </motion.div>
  );
}
