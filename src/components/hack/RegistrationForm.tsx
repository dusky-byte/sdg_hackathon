import { useEffect, useState } from "react";
import { z } from "zod";
import { externalSupabase } from "@/lib/external-supabase";
import { TRACKS } from "./data";

const nameRule = z.string().trim().min(1, "Required").max(100);
const emailRule = z.string().trim().email("Invalid email address").max(255);
const phoneRule = z
  .string()
  .trim()
  .min(7, "Too short")
  .max(20)
  .regex(/^[0-9+\-\s()]+$/, "Invalid phone number");

const schema = z.object({
  team_name: z.string().trim().min(1, "Required").max(100),
  college: z.string().trim().min(1, "Required").max(150),
  track: z.string().trim().min(1, "Required").max(100),
  team_size: z.coerce.number().int().min(2, "Minimum 2").max(3, "Maximum 3"),
  member1_name: nameRule,
  member1_email: emailRule,
  member1_phone: phoneRule,
  member2_name: nameRule,
  member2_email: emailRule,
  member2_phone: phoneRule,
  member3_name: z.string().trim().max(100).optional().or(z.literal("")),
  member3_email: z.string().trim().max(255).optional().or(z.literal("")),
  member3_phone: z.string().trim().max(20).optional().or(z.literal("")),
  transaction_id: z.string().trim().min(1, "Required").max(200),
  payment_screenshot: z.any().refine((val) => val instanceof File && val.size > 0, "Screenshot is required"),
});

function Field({
  label,
  name,
  error,
  ...rest
}: {
  label: string;
  name: string;
  error?: string | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="label-caps">{label}</span>
      <input id={name} name={name} className="field-underline mt-2" {...rest} />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function QrBlock() {
  const isFinder = (r: number, c: number) => {
    const box = (r0: number, c0: number) =>
      r >= r0 &&
      r < r0 + 5 &&
      c >= c0 &&
      c < c0 + 5 &&
      (r === r0 || r === r0 + 4 || c === c0 || c === c0 + 4 || (r === r0 + 2 && c === c0 + 2));
    return box(0, 0) || box(0, 8) || box(8, 0);
  };
  const cells = Array.from({ length: 169 }, (_, i) => {
    const r = Math.floor(i / 13);
    const c = i % 13;
    if ((r < 5 && (c < 5 || c > 7)) || (c < 5 && r > 7)) return isFinder(r, c);
    return (r * 31 + c * 17 + r * c * 7) % 5 < 2;
  });

  return (
    <div className="shrink-0">
      <div className="grid w-36 grid-cols-[repeat(13,minmax(0,1fr))] gap-[2px] bg-foreground p-2">
        {cells.map((on, i) => (
          <span key={i} className={`aspect-square ${on ? "bg-background" : "bg-foreground"}`} />
        ))}
      </div>
      <p className="label-caps mt-3">Scan to download rulebook</p>
    </div>
  );
}

function SuccessCheck() {
  return (
    <div className="py-16 text-center">
      <svg
        viewBox="0 0 48 48"
        className="mx-auto h-14 w-14"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path className="draw-check" d="M12 25 l9 9 l16 -18" />
      </svg>
      <p className="mt-6 font-display text-2xl">You&apos;re registered.</p>
      <p className="mt-2 text-foreground/45">
        See you on 26 Sept at FLABS Block 2, 1st Floor.
      </p>
    </div>
  );
}

export function RegistrationForm({ track }: { track: string }) {
  const [selectedTrack, setSelectedTrack] = useState<string>(track || TRACKS[0].label);
  const [showMember3, setShowMember3] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (track) setSelectedTrack(track);
  }, [track]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const d = parsed.data;

    // Upload payment screenshot
    const fileExt = d.payment_screenshot.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await externalSupabase.storage
      .from("payment_screenshots")
      .upload(fileName, d.payment_screenshot);

    if (uploadError) {
      setSubmitting(false);
      console.error("Screenshot upload error:", uploadError);
      setFormError(`Failed to upload screenshot: ${uploadError.message}. Did you create the bucket?`);
      return;
    }

    const { data: publicUrlData } = externalSupabase.storage
      .from("payment_screenshots")
      .getPublicUrl(fileName);

    const { error } = await externalSupabase.from("registrations").insert({
      team_name: d.team_name,
      college: d.college,
      track: d.track,
      team_size: d.team_size,
      member1_name: d.member1_name,
      member1_email: d.member1_email,
      member1_phone: d.member1_phone,
      member2_name: d.member2_name,
      member2_email: d.member2_email,
      member2_phone: d.member2_phone,
      member3_name: d.member3_name || null,
      member3_email: d.member3_email || null,
      member3_phone: d.member3_phone || null,
      transaction_id: d.transaction_id,
      payment_screenshot_url: publicUrlData.publicUrl,
    });

    setSubmitting(false);
    if (error) {
      console.error("Supabase insert error:", error);
      setFormError(`We couldn't save your registration. Error: ${error.message || "Unknown error"}. Please check the console or ensure the database table is created.`);
      return;
    }
    setDone(true);
  }

  return (
    <section id="register" className="border-t border-border pt-16">
      <h2 className="label-caps">Register your team</h2>

      <div className="panel mt-6 flex flex-col gap-12 p-8 sm:p-10 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          {done ? (
            <SuccessCheck />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              <div className="grid gap-8 sm:grid-cols-2">
                <Field
                  label="Team name"
                  name="team_name"
                  maxLength={100}
                  error={errors["team_name"]}
                />
                <Field
                  label="College / institution"
                  name="college"
                  maxLength={150}
                  error={errors["college"]}
                />
                <label className="block">
                  <span className="label-caps">Track</span>
                  <select
                    name="track"
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="field-underline mt-2"
                  >
                    {TRACKS.map((t) => (
                      <option key={t.label} value={t.label} className="bg-card">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Team size (2–3)"
                  name="team_size"
                  type="number"
                  min={2}
                  max={3}
                  defaultValue={2}
                  error={errors["team_size"]}
                />
              </div>

              {[1, 2].map((n) => (
                <div key={n} className="border-t border-border pt-8">
                  <p className="font-mono text-xs text-accent">Member {n}</p>
                  <div className="mt-5 grid gap-8 sm:grid-cols-3">
                    <Field
                      label="Name"
                      name={`member${n}_name`}
                      maxLength={100}
                      error={errors[`member${n}_name`]}
                    />
                    <Field
                      label="Email"
                      name={`member${n}_email`}
                      type="email"
                      maxLength={255}
                      error={errors[`member${n}_email`]}
                    />
                    <Field
                      label="Phone"
                      name={`member${n}_phone`}
                      maxLength={20}
                      error={errors[`member${n}_phone`]}
                    />
                  </div>
                </div>
              ))}

              {showMember3 ? (
                <div className="border-t border-border pt-8">
                  <p className="font-mono text-xs text-accent">Member 3 — optional</p>
                  <div className="mt-5 grid gap-8 sm:grid-cols-3">
                    <Field label="Name" name="member3_name" maxLength={100} />
                    <Field label="Email" name="member3_email" type="email" maxLength={255} />
                    <Field label="Phone" name="member3_phone" maxLength={20} />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowMember3(true)}
                  className="text-sm text-foreground/45 transition-colors hover:text-foreground/90"
                >
                  + Add member
                </button>
              )}

              {/* Payment Section */}
              <div className="border-t border-border pt-8">
                <p className="font-mono text-xs text-accent">Payment Details</p>
                <div className="mt-5 grid gap-8 sm:grid-cols-2">
                  <div className="flex flex-col items-center sm:items-start">
                    <p className="label-caps mb-4 w-full text-left">1. Scan & Pay</p>
                    {!showQr ? (
                      <button
                        type="button"
                        onClick={() => setShowQr(true)}
                        className="btn-accent px-6 py-3 text-sm self-start sm:self-auto"
                      >
                        Show QR Code
                      </button>
                    ) : (
                      <div className="bg-foreground w-64 h-64 flex items-center justify-center p-2 text-background text-xs text-center aspect-square mx-auto sm:mx-0">
                        [Your QR Code Here]
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-8">
                    <Field
                      label="2. Transaction ID"
                      name="transaction_id"
                      maxLength={200}
                      error={errors["transaction_id"]}
                    />
                    <label className="block">
                      <span className="label-caps">3. Payment Screenshot</span>
                      <input
                        type="file"
                        accept="image/*"
                        name="payment_screenshot"
                        className="mt-2 block w-full text-sm text-foreground/70
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-none file:border file:border-border
                          file:text-sm file:font-mono file:bg-transparent file:text-foreground
                          hover:file:bg-foreground hover:file:text-background transition-colors cursor-pointer"
                      />
                      {errors["payment_screenshot"] && <span className="mt-1 block text-xs text-destructive">{errors["payment_screenshot"]}</span>}
                    </label>
                  </div>
                </div>
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <div className="flex justify-center border-t border-border pt-10">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent w-full px-10 py-4 text-sm disabled:opacity-60 sm:w-auto sm:min-w-[18rem]"
                >
                  {submitting ? "Submitting…" : "Submit registration"}
                </button>
              </div>

            </form>
          )}
        </div>

        <QrBlock />
      </div>
    </section>
  );
}
