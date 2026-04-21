import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { setAccessToken } from "../../lib/api";
import { InlineError } from "../../components/ui/ErrorState";
import { requestNotificationPermission, notify } from "../../lib/notifications";
import { Input } from "../../components/ui/Input";
import { PasswordField } from "../../components/ui/PasswordField";
import { ResetPasswordModal } from "../../components/ResetPasswordModal";

type AuthView = "signin" | "signup";

const highlights = [
  "Track pet care, vaccinations, and daily details in one workspace.",
  "Keep expenses tidy without switching between notes, chats, and spreadsheets.",
  "Stay organized on mobile, tablet, and desktop with the same calm flow.",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<AuthView>(() =>
    searchParams.get("mode") === "signup" ? "signup" : "signin"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 1024 : false
  );
  const [leftOpen, setLeftOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const compact = window.innerWidth <= 1024;
      setIsCompact(compact);
      if (!compact) setLeftOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isCompact && leftOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCompact, leftOpen]);

  async function completeSignedInSession(accessToken: string) {
    setAccessToken(accessToken);
    await requestNotificationPermission();
    notify("Welcome to Whisker Diary", "Your pet records are ready whenever you need them.");
    navigate("/dashboard", { replace: true });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === "signup") {
        if (!name.trim()) {
          setError("Please enter your name.");
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name.trim() },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.session?.access_token) {
          await completeSignedInSession(data.session.access_token);
          return;
        }

        setVerificationEmail(email);
        setView("signin");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data.session?.access_token) {
        await completeSignedInSession(data.session.access_token);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (oauthError) setError(oauthError.message);
  }

  function openResetModal() {
    setResetError(null);
    setResetSuccess(null);
    setResetModalOpen(true);
  }

  function closeResetModal() {
    setResetModalOpen(false);
    setResetLoading(false);
    setResetError(null);
    setResetSuccess(null);
  }

  async function handleResetPassword(resetEmail: string) {
    setResetError(null);
    setResetSuccess(null);

    const trimmedEmail = resetEmail.trim();
    if (!trimmedEmail) {
      setResetError("Please enter your email address.");
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setResetError("Enter a valid email address.");
      return;
    }

    setResetLoading(true);
    const { error: resetRequestError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setResetLoading(false);

    if (resetRequestError) {
      setResetError(resetRequestError.message);
      return;
    }

    setResetSuccess("Password reset link sent to your email");
    setEmail(trimmedEmail);
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-4 lg:grid-cols-[minmax(20rem,1.05fr)_minmax(24rem,0.95fr)] lg:items-stretch">

          {/* ── Backdrop overlay (mobile only) ── */}
          {isCompact && leftOpen && (
            <div
              className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm"
              onClick={() => setLeftOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* ── LEFT PANEL ── */}
          <section
            className={[
              "app-panel flex flex-col justify-between overflow-hidden p-5 sm:p-7 lg:p-8",
              isCompact
                ? "fixed top-0 left-0 z-[1001] h-dvh w-[min(88vw,360px)] shadow-2xl transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                : "relative",
              isCompact && !leftOpen ? "-translate-x-full pointer-events-none" : "translate-x-0",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {isCompact && (
              <button
                type="button"
                onClick={() => setLeftOpen(false)}
                aria-label="Close preview panel"
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#f1e3da] text-[#5f4d46] text-sm font-semibold transition-colors hover:bg-[#e8d4c8]"
              >
                ✕
              </button>
            )}

            <div className="space-y-4">
              <Link
                to="/"
                onClick={() => isCompact && setLeftOpen(false)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#8c776f] transition-colors hover:text-[#5f4d46]"
              >
                <span aria-hidden="true">←</span>
                Back to home
              </Link>

              <div className="space-y-3">
                <div className="app-chip">Whisker Diary</div>
                <h1 className="font-display text-3xl font-semibold leading-tight text-[#221a16] sm:text-4xl">
                  Sign in to your pet care workspace
                </h1>
                <p className="max-w-xl text-sm leading-7 text-[#7e6d66]">
                  Access your pet profiles, care reminders, and spending history from one calm, organized dashboard.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {highlights.map((highlight) => (
                <div key={highlight} className="flex items-start gap-3 rounded-2xl bg-[#fff8f4] px-4 py-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#ff7a5c]" />
                  <p className="text-sm leading-6 text-[#5f4d46]">{highlight}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── RIGHT PANEL ── */}
          <section className="app-panel overflow-hidden">

            {/* ── TOPBAR ── */}
            <div className="flex items-center justify-between border-b border-[#f1e3da] px-5 py-2.5 sm:px-7 lg:px-8">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8c776f] transition-colors hover:text-[#5f4d46] lg:hidden"
              >
                <span aria-hidden="true">←</span>
                Back to home
              </Link>

              {isCompact && !leftOpen && (
                <button
                  type="button"
                  onClick={() => setLeftOpen(true)}
                  aria-label="Open preview panel"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#f1e3da] bg-[#fff8f4] shadow-sm transition-colors hover:border-[#e0c9bc] hover:bg-white"
                >
                  <span className="font-serif text-sm font-bold italic leading-none text-[#8c776f]">i</span>
                </button>
              )}
            </div>

            <div className="mx-auto w-full max-w-xl px-5 pt-6 sm:px-7 lg:px-8 pb-5 sm:pb-7 lg:pb-8">

              {/* ── CONTENT HEADER ── */}
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b28d80]">
                    {verificationEmail ? "Verify email" : view === "signin" ? "Sign in" : "Create account"}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-[#221a16]">
                    {verificationEmail
                      ? "Finish verifying your email"
                      : view === "signin"
                        ? "Welcome back"
                        : "Set up your account"}
                  </h2>
                </div>

                {!verificationEmail && (
                  <div className="rounded-full border border-[#f1e3da] bg-[#fff8f4] p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setView("signin");
                        setError(null);
                        setVerificationEmail(null);
                      }}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                        view === "signin" ? "bg-white text-[#221a16] shadow-sm" : "text-[#8c776f]"
                      }`}
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setView("signup");
                        setError(null);
                        setVerificationEmail(null);
                      }}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                        view === "signup" ? "bg-white text-[#221a16] shadow-sm" : "text-[#8c776f]"
                      }`}
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>

              {verificationEmail ? (
                <div className="space-y-4 rounded-[28px] border border-[#f1e3da] bg-[#fff8f4] p-5">
                  <p className="text-sm leading-6 text-[#5f4d46]">
                    We sent a verification email to{" "}
                    <span className="font-semibold text-[#221a16]">{verificationEmail}</span>. Open it,
                    complete the verification step, and then sign in with your password.
                  </p>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationEmail(null);
                        setError(null);
                      }}
                      className="rounded-2xl border border-warm-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#fffdfb]"
                    >
                      Use a different email
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationEmail(null)}
                      className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
                      style={{ background: "#ff7a5c" }}
                    >
                      Back to sign in
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-4 max-w-xl text-sm leading-6 text-[#7e6d66]">
                    {view === "signin"
                      ? "Use your email and password to continue where you left off."
                      : "Create your account with your name, email, and password. We will ask you to verify your email before you continue."}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {view === "signup" && (
                      <Input
                        label="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                      />
                    )}

                    <Input
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />

                    <PasswordField
                      label="Password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete={view === "signup" ? "new-password" : "current-password"}
                      required
                    />

                    {view === "signin" && (
                      <div className="-mt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={openResetModal}
                          className="text-right text-xs font-medium text-gray-400 transition-colors hover:text-[#ff7a5c]"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {view === "signup" && (
                      <PasswordField
                        label="Confirm password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        required
                      />
                    )}

                    {error && <InlineError message={error} />}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
                      style={{ background: "#ff7a5c", boxShadow: "0 12px 24px rgba(255, 122, 92, 0.20)" }}
                    >
                      {loading
                        ? "Please wait..."
                        : view === "signin"
                          ? "Sign in"
                          : "Create account"}
                    </button>
                  </form>

                  <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#ead9cf]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28d80]">or</span>
                    <div className="h-px flex-1 bg-[#ead9cf]" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogle}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#ead9cf] bg-[#fff8f4] py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-white"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      <ResetPasswordModal
        open={resetModalOpen}
        initialEmail={email}
        loading={resetLoading}
        error={resetError}
        success={resetSuccess}
        onClose={closeResetModal}
        onSubmit={handleResetPassword}
      />
    </div>
  );
}