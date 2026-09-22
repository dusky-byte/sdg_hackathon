import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Cursor } from "@/components/hack/Cursor";
import { Marquee } from "@/components/hack/Marquee";
import { Hero } from "@/components/hack/Hero";
import { StatsBar } from "@/components/hack/StatsBar";
import { SdgSignificance } from "@/components/hack/SdgSignificance";
import { Sidebar } from "@/components/hack/Sidebar";
import { Reveal } from "@/components/hack/Reveal";
import {
  AboutSection,
  ScheduleSection,
  SiteFooter,
} from "@/components/hack/Sections";

const title = "Hack to Hustle — Mini Hackathon | 26 Sep 2026";
const description =
  "Register your team for Hack to Hustle at SRM IST: a one-day SDG 4 hackathon on 26 Sept 2026. ₹200 per team, teams of 2–3, seven award categories.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const goRegister = () => navigate({ to: "/register" });

  return (
    <div className="film-grain relative">
      <Cursor />

      <main className="mx-auto min-w-0 max-w-[1400px] px-5 pb-20 pt-4 sm:px-8">
        <Hero onRegister={goRegister} />
        <Marquee />
        
        <Reveal delay={0.1}>
          <div className="py-6 sm:py-10 text-center">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-2">
              Conducted By
            </p>
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl leading-tight text-foreground/90">
              Department of Computer Applications <span className="text-accent mx-2 sm:mx-4">&amp;</span> Department of Computer Science
            </h2>
          </div>
        </Reveal>

        <StatsBar />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[1fr_20rem] lg:gap-14">
          <div className="min-w-0 space-y-12 lg:space-y-16">
            <AboutSection />
            <SdgSignificance />
            <ScheduleSection />
          </div>
          <Reveal>
            <Sidebar onRegister={goRegister} />
          </Reveal>
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}
