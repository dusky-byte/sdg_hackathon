import { useEffect, useState } from "react";
import { EVENT_DATE } from "./data";

function diff() {
  const ms = EVENT_DATE.getTime() - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function Countdown() {
  const [t, setT] = useState<ReturnType<typeof diff>>(null);

  useEffect(() => {
    setT(diff());
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p className="label-caps">Registration closes in</p>
      <p className="mt-2 font-mono text-2xl tabular-nums text-foreground">
        {t ? `${t.d}d ${t.h}h ${t.m}m ${t.s}s` : "Closed"}
      </p>
    </div>
  );
}
