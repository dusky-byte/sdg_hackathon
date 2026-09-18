import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Cursor } from "@/components/hack/Cursor";
import { Marquee } from "@/components/hack/Marquee";
import { Hero } from "@/components/hack/Hero";
import { StatsBar } from "@/components/hack/StatsBar";
import { SdgSignificance } from "@/components/hack/SdgSignificance";
import { Sidebar } from "@/components/hack/Sidebar";
import { RegistrationForm } from "@/components/hack/RegistrationForm";
import { Reveal } from "@/components/hack/Reveal";
import {
  AboutSection,
  JudgingSection,
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

  const goRegister = () =>
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="film-grain relative">
      <Cursor />


      <main className="mx-auto min-w-0 max-w-[1400px] px-5 pb-28 pt-4 sm:px-8">
        <Hero onRegister={goRegister} />
        <Marquee />
        <StatsBar />

        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-14">
          <div className="min-w-0">
            <SdgSignificance />
          </div>
          <Reveal className="lg:pt-16">
            <Sidebar onRegister={goRegister} />
          </Reveal>
        </div>

        <div className="mt-20 space-y-20">
          <RegistrationForm />
          <AboutSection />
          <ScheduleSection />
          <JudgingSection />
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}
