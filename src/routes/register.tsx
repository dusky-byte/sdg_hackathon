import { createFileRoute, Link } from "@tanstack/react-router";
import { Cursor } from "@/components/hack/Cursor";
import { RegistrationForm } from "@/components/hack/RegistrationForm";
import { SiteFooter } from "@/components/hack/Sections";

export const Route = createFileRoute("/register")({
  component: RegisterRoute,
});

function RegisterRoute() {
  return (
    <div className="film-grain relative min-h-screen">
      <Cursor />

      <main className="mx-auto min-w-0 max-w-[1400px] px-5 pb-20 pt-12 sm:px-8">
        <Link 
          to="/"
          className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-accent transition-colors hover:text-accent-foreground"
        >
          ← Back to home
        </Link>
        <RegistrationForm />
        
        <div className="mt-8">
          <SiteFooter />
        </div>
      </main>
    </div>
  );
}
