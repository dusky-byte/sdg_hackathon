import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase as externalSupabase } from "@/integrations/supabase/client";

const nameRule = z.string().trim().min(1, "Required").max(100).regex(/^[A-Za-z\s]+$/, "Only alphabetic characters allowed");
const emailRule = z.string().trim().email("Invalid email address").max(255);
const phoneRule = z
  .string()
  .trim()
  .regex(/^\d{10}$/, "Phone number must be exactly 10 digits");

const schema = z.object({
  team_name: z.string().trim().min(1, "Required").max(100).regex(/^[A-Za-z\s]+$/, "Only alphabetic characters allowed"),
  college: z.string().trim().min(1, "Required").max(150).regex(/^[A-Za-z\s]+$/, "Only alphabetic characters allowed"),
  team_size: z.coerce.number().int().min(2, "Minimum 2").max(3, "Maximum 3"),
  member1_name: nameRule,
  member1_email: emailRule,
  member1_phone: phoneRule,
  member2_name: nameRule,
  member2_email: emailRule,
  member2_phone: phoneRule,
  member3_name: z.string().trim().max(100).regex(/^[A-Za-z\s]*$/, "Only alphabetic characters allowed").optional().or(z.literal("")),
  member3_email: z.string().trim().max(255).optional().or(z.literal("")),
  member3_phone: z.string().trim().regex(/^\d{10}$/, "Phone number must be exactly 10 digits").optional().or(z.literal("")),
  transaction_id: z.string().trim().min(1, "Required").max(200),
  payment_screenshot: z.any()
    .refine((val) => val instanceof File && val.size > 0, "Screenshot is required")
    .refine((val) => val instanceof File && val.type.startsWith("image/"), "File must be an image (png, jpg, jpeg, etc)"),
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
    <label className="block group">
      <span className="label-caps font-mono text-foreground/90 transition-colors group-focus-within:text-accent">{label}</span>
      <input id={name} name={name} className="field-underline mt-2" {...rest} />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function CustomSelect({
  value,
  onChange,
  options,
  name,
  placeholder = "Select an option",
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  name: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mt-2">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="field-underline flex w-full items-center justify-between text-left py-2"
      >
        <span className={value ? "" : "text-foreground/45"}>{value || placeholder}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-10 top-full mt-1 max-h-60 w-full overflow-auto border border-border bg-background shadow-lg">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="cursor-pointer px-4 py-3 text-sm transition-colors hover:bg-foreground hover:text-background"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CustomNumberInput({
  label,
  value,
  onChange,
  min,
  max,
  error,
  name,
}: {
  label: string;
  value: number | "";
  onChange: (val: number | "") => void;
  min: number;
  max: number;
  error?: string | undefined;
  name: string;
}) {
  const handleIncrement = () => {
    let curr = typeof value === "number" ? value : min - 1;
    if (curr < max) onChange(curr + 1);
  };

  const handleDecrement = () => {
    let curr = typeof value === "number" ? value : min;
    if (curr > min) onChange(curr - 1);
  };

  return (
    <label className="block group">
      <span className="label-caps font-mono text-foreground/90 transition-colors group-focus-within:text-accent">{label}</span>
      <div className="relative mt-2 flex items-center">
        <input
          id={name}
          name={name}
          type="number"
          className="field-underline w-full pr-10"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            if (e.target.value === "") {
              onChange("");
              return;
            }
            let val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
              if (val > max) val = max;
              onChange(val);
            }
          }}
        />
        <div className="absolute right-0 bottom-0 flex h-full flex-col justify-end space-y-1 pb-1 px-2">
          <button
            type="button"
            onClick={handleIncrement}
            className="text-foreground/45 transition-colors hover:text-accent disabled:opacity-30 disabled:hover:text-foreground/45"
            disabled={value !== "" && value >= max}
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="text-foreground/45 transition-colors hover:text-accent disabled:opacity-30 disabled:hover:text-foreground/45"
            disabled={value !== "" && value <= min}
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" transform="rotate(180 12 12)" />
            </svg>
          </button>
        </div>
      </div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function RulebookDownload() {
  return (
    <div className="shrink-0 flex flex-col items-start">
      <p className="label-caps mb-4">Preparation</p>
      <a
        href="/files/Hack2Hustle_Rule_Book.pdf"
        download="Hack2Hustle_Rule_Book.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-accent px-6 py-3 text-sm text-center inline-flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Rulebook
      </a>
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

export function RegistrationForm() {
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [teamSize, setTeamSize] = useState<number | "">(2);
  const [mounted, setMounted] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");
  const [showQr, setShowQr] = useState(false);

  const [member1Email, setMember1Email] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [otpInput, setOtpInput] = useState("");

  const [cooldown, setCooldown] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    async function init() {
      try {
        const saved = localStorage.getItem("registration_draft");
        if (saved) {
          const parsed = JSON.parse(saved);
          setDraft(parsed);
          if (parsed["team_size"]) {
            setTeamSize(parseInt(parsed["team_size"]));
          }
        }
      } catch { }
      
      try {
        const response = await fetch('/api/registration-status');
        if (response.ok) {
          const data = await response.json();
          if (data && data.isOpen === false) {
            setLimitReached(true);
          }
        }
      } catch (e) {
        console.error("Failed to check registration status", e);
      }
      
      setCheckingLimit(false);
      setMounted(true);
    }
    init();
  }, []);

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    // Don't save the file object to localStorage
    formData.delete("payment_screenshot");
    const data = Object.fromEntries(formData.entries());
    localStorage.setItem("registration_draft", JSON.stringify(data));
  };

  async function handleSendOtp() {
    if (!member1Email) return;

    // Force save draft to ensure no details (like Member 3) are lost before verification
    const form = document.querySelector('form');
    if (form) {
      const formData = new FormData(form);
      formData.delete("payment_screenshot");
      const data = Object.fromEntries(formData.entries());
      localStorage.setItem("registration_draft", JSON.stringify(data));
    }

    setVerifying(true);
    setFormError("");

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: member1Email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
      setOtpInput("");

      const newCount = requestCount + 1;
      setRequestCount(newCount);
      // Exponential backoff: 30s, 60s, 120s, max 5 minutes
      const newCooldown = Math.min(30 * Math.pow(2, newCount - 1), 300);
      setCooldown(newCooldown);
    } catch (error: any) {
      setFormError(error.message);
    }
    setVerifying(false);
  }

  async function handleVerifyOtp() {
    if (!otpInput || otpInput.length !== 6) {
      setFormError("Please enter a valid 6-digit code.");
      return;
    }

    setVerifying(true);
    setFormError("");

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: member1Email, otp: otpInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      setEmailVerified(true);
      setOtpSent(false); // Hide the OTP input UI
    } catch (error: any) {
      setFormError(error.message);
    }
    setVerifying(false);
  }

  async function handleResetVerification() {
    setEmailVerified(false);
    setOtpSent(false);
    setOtpInput("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    if (!emailVerified) {
      setFormError("Please verify the Team Leader's email (Member 1) before submitting.");
      return;
    }

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
      track: "SDG 04",
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
    // Clear draft on successful submission
    localStorage.removeItem("registration_draft");
    setDone(true);
  }

  if (!mounted || checkingLimit) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>; // Wait for client hydration to prevent Error #418
  }

  return (
    <section id="register" className="border-t border-border pt-16">
      <h2 className="label-caps">Register your team</h2>

      <div className="panel mt-6 flex flex-col gap-12 p-8 sm:p-10 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          {limitReached ? (
            <div className="py-16 text-center border border-border bg-foreground/5 p-8 rounded-lg">
              <h3 className="font-display text-2xl text-accent mb-2">Registrations Closed</h3>
              <p className="text-foreground/70">
                We have reached the maximum number of allowed teams for this hackathon.
                Thank you for your interest!
              </p>
            </div>
          ) : done ? (
            <SuccessCheck />
          ) : (
            <form onSubmit={handleSubmit} onChange={handleFormChange} className="space-y-8" noValidate>
              <div className="grid gap-8 sm:grid-cols-2">
                <Field
                  label="Team name"
                  name="team_name"
                  defaultValue={draft["team_name"]}
                  maxLength={100}
                  error={errors["team_name"]}
                  onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "") }}
                />
                <Field
                  label="College / institution"
                  name="college"
                  defaultValue={draft["college"]}
                  maxLength={150}
                  error={errors["college"]}
                  onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "") }}
                />
                <CustomNumberInput
                  label="Team size (2–3)"
                  name="team_size"
                  min={2}
                  max={3}
                  value={teamSize}
                  onChange={(val) => setTeamSize(val)}
                  error={errors["team_size"]}
                />
              </div>

              {Array.from({ length: typeof teamSize === 'number' ? Math.min(Math.max(teamSize, 2), 3) : 2 }, (_, i) => i + 1).map((n) => (
                <div key={n} className="border-t border-border pt-8">
                  <p className="font-mono text-xs text-accent">Member {n}{n === 3 ? " — optional" : ""}</p>
                  <div className="mt-5 grid gap-8 sm:grid-cols-3">
                    <Field
                      label="Name"
                      name={`member${n}_name`}
                      defaultValue={draft[`member${n}_name`]}
                      maxLength={100}
                      error={errors[`member${n}_name`]}
                      onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "") }}
                    />
                    {n === 1 ? (
                      <div className="flex flex-col">
                        <Field
                          label="Email"
                          name="member1_email"
                          type="email"
                          maxLength={255}
                          value={member1Email || draft["member1_email"] || ""}
                          onChange={(e) => setMember1Email(e.target.value)}
                          error={errors["member1_email"]}
                          readOnly={emailVerified || otpSent}
                        />
                        {!emailVerified && (
                          <div className="mt-2 flex flex-col gap-2">
                            {otpSent ? (
                              <div className="p-3 bg-accent/10 border border-accent rounded-md text-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="font-semibold text-accent">Enter 6-digit Code</p>
                                  <button
                                    type="button"
                                    onClick={handleResetVerification}
                                    className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                                  >
                                    Wrong email?
                                  </button>
                                </div>
                                <p className="mb-3 text-muted-foreground">We sent a verification code to your email.</p>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    maxLength={6}
                                    value={otpInput}
                                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="000000"
                                    className="px-3 py-1 bg-background border border-border rounded-md font-mono text-center w-24 focus:outline-none focus:border-accent"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={verifying || otpInput.length !== 6}
                                    className="btn-accent px-4 py-1 text-xs disabled:opacity-50"
                                  >
                                    {verifying ? "Verifying..." : "Verify Code"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={verifying || !member1Email || cooldown > 0}
                                className="btn-accent px-3 py-1 text-xs self-start disabled:opacity-50"
                              >
                                {verifying ? "Sending..." : cooldown > 0 ? `Wait ${cooldown}s` : "Verify Email"}
                              </button>
                            )}
                          </div>
                        )}
                        {emailVerified && (
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-green-500 font-medium">✓ Email verified</span>
                            <button
                              type="button"
                              onClick={handleResetVerification}
                              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                            >
                              Change email
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Field
                        label="Email"
                        name={`member${n}_email`}
                        defaultValue={draft[`member${n}_email`]}
                        type="email"
                        maxLength={255}
                        error={errors[`member${n}_email`]}
                      />
                    )}
                    <Field
                      label="Phone"
                      name={`member${n}_phone`}
                      defaultValue={draft[`member${n}_phone`]}
                      maxLength={10}
                      error={errors[`member${n}_phone`]}
                      onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "") }}
                    />
                  </div>
                </div>
              ))}

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
                      <div className="w-64 h-64 flex items-center justify-center mx-auto sm:mx-0 overflow-hidden rounded-lg border border-border bg-foreground/5 p-2">
                        <img src="/payment/payment_qr.jpg" alt="Payment QR Code" className="w-full h-full object-contain rounded-md" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-8">
                    <Field
                      label="2. Transaction ID"
                      name="transaction_id"
                      defaultValue={draft["transaction_id"]}
                      maxLength={200}
                      error={errors["transaction_id"]}
                    />
                    <label className="block">
                      <span className="label-caps">3. Payment Screenshot</span>
                      <input
                        type="file"
                        accept="image/*"
                        name="payment_screenshot"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && !file.type.startsWith("image/")) {
                            setErrors((prev) => ({ ...prev, payment_screenshot: "Invalid file format. Please upload an image (png, jpg, etc)." }));
                            e.target.value = "";
                          } else {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next["payment_screenshot"];
                              return next;
                            });
                          }
                        }}
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
                  disabled={submitting || !emailVerified}
                  className="btn-accent w-full px-10 py-4 text-sm disabled:opacity-60 sm:w-auto sm:min-w-[18rem]"
                >
                  {submitting ? "Submitting…" : "Submit registration"}
                </button>
              </div>

            </form>
          )}
        </div>

        <RulebookDownload />
      </div>
    </section>
  );
}
