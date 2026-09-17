export const TRACKS = [
  { label: "AI for Education", blurb: "Tutors, assessment and tools powered by AI." },
  { label: "Education for All", blurb: "Reaching learners with limited access or resources." },
  { label: "Inclusive Education", blurb: "Designing for disability, language and neurodiversity." },
  { label: "Learn Through Play", blurb: "Games, simulations and playful learning experiences." },
  { label: "Future & Career Ready", blurb: "Skills, mentoring and pathways into work." },
] as const;

export const STATS = [
  ["2–3", "Team size"],
  ["7–8 hrs", "Duration"],
  ["3 min", "Pitch time"],
] as const;

export const SCHEDULE = [
  ["9:00 – 9:15", "Registration & Team Formation"],
  ["9:15 – 9:30", "Inauguration & SDG 4 Briefing"],
  ["9:30 – 9:45", "Hackathon Challenge & Rules"],
  ["9:45 – 10:15", "Problem Identification & Ideation"],
  ["10:15 – 12:15", "Build Your Prototype"],
  ["12:15 – 13:15", "Lunch Break"],
  ["13:15 – 15:15", "Testing & Final Preparation"],
  ["15:15 – 16:15", "Team Presentations & Demo"],
  ["16:20 – 16:45", "Evaluation & Awards"],
] as const;

export const CRITERIA = [
  ["Problem Identification", 15],
  ["Innovation & Creativity", 20],
  ["Relevance to SDG 4", 20],
  ["Inclusiveness & Accessibility", 10],
  ["Working Prototype", 10],
  ["Presentation & Pitch", 10],
  ["Business Viability & Scalability", 10],
  ["Overall Impression", 5],
] as const;

export const AWARDS = [
  "SDG 4 Champion",
  "Most Innovative Idea",
  "Best AI Solution",
  "Best Inclusive Education Solution",
  "Best Social Impact Solution",
  "Best UI/UX",
  "Best Prototype",
] as const;

export const STEPS = [
  ["01", "Identify"],
  ["02", "Ideate"],
  ["03", "Build"],
  ["04", "Pitch"],
] as const;

export const TOOLS =
  "Canva, Figma, HTML/CSS/JS, Python, Scratch, MIT App Inventor, no-code tools, or generative AI.";

export const COORDINATORS = [
  { name: "Harshith Jain", role: "Student Coordinator", phone: "7094589284" },
  { name: "Smilin Jency", role: "Student Coordinator", phone: "9123537640" },
] as const;

export const EVENT_DATE = new Date("2026-09-26T09:00:00+05:30");
