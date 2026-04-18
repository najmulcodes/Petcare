import { useState, useRef, FormEvent, ChangeEvent, ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { uploadImage } from "../../lib/cloudinary";
import { ImageCropper } from "../../components/ImageCropper";
import { InlineError } from "../../components/ui/ErrorState";
import { Input } from "../../components/ui/Input";
import { PasswordField } from "../../components/ui/PasswordField";
import { EntityAvatar } from "../../components/ui/EntityAvatar";
import { getUserAvatarUrl, getUserDisplayName } from "../../lib/user";

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="app-panel p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">{title}</p>
        <p className="mt-2 text-sm leading-7 text-[#7e6d66]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      {message}
    </p>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const meta = user?.user_metadata ?? {};

  const [avatarUrl, setAvatarUrl] = useState<string>(getUserAvatarUrl(user) ?? "");
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>((meta.name as string) ?? "");
  const [birthdate, setBirthdate] = useState<string>((meta.birthdate as string) ?? "");
  const [phone, setPhone] = useState<string>((meta.phone as string) ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const displayName = getUserDisplayName(user);

  function handleAvatarFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setCropSrc(URL.createObjectURL(file));
    setAvatarError(null);
    setAvatarSuccess(false);

    if (avatarInputRef.current) avatarInputRef.current.value = "";
  }

  async function handleCropDone(file: File) {
    setCropSrc(null);
    setAvatarUploading(true);
    setAvatarError(null);

    try {
      const url = await uploadImage(file);
      const { error } = await supabase.auth.updateUser({ data: { avatar_url: url } });
      if (error) throw error;
      setAvatarUrl(url);
      setAvatarSuccess(true);
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleProfileSave(event: FormEvent) {
    event.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(false);

    const { error } = await supabase.auth.updateUser({ data: { name: name.trim(), birthdate, phone } });
    setProfileSaving(false);

    if (error) {
      setProfileError(error.message);
      return;
    }

    setProfileSuccess(true);
  }

  async function handleEmailChange(event: FormEvent) {
    event.preventDefault();
    if (!newEmail) return;

    setEmailSaving(true);
    setEmailError(null);
    setEmailSuccess(false);

    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setEmailSaving(false);

    if (error) {
      setEmailError(error.message);
      return;
    }

    setEmailSuccess(true);
    setNewEmail("");
  }

  async function handlePasswordChange(event: FormEvent) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }

    setPwSaving(true);
    setPwError(null);
    setPwSuccess(false);

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);

    if (error) {
      setPwError(error.message);
      return;
    }

    setPwSuccess(true);
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="space-y-6">
      {cropSrc && <ImageCropper imageSrc={cropSrc} onDone={handleCropDone} onCancel={() => setCropSrc(null)} />}

      <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/92 p-6 shadow-card sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.28fr)] lg:items-center">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="group relative"
            >
              <EntityAvatar
                src={avatarUrl}
                name={displayName}
                kind="user"
                className="h-24 w-24 rounded-[28px] border border-[#f1e3da]"
                textClassName="text-xl"
              />
              <span className="absolute inset-x-0 bottom-0 rounded-b-[28px] bg-black/45 px-3 py-2 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {avatarUploading ? "Uploading..." : "Change photo"}
              </span>
            </button>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b28d80]">Profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#221a16]">{displayName}</h1>
              <p className="mt-2 text-sm leading-7 text-[#7e6d66]">
                Keep your account details up to date so your dashboard and shared records feel personal and easy to use.
              </p>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="mt-3 inline-flex rounded-2xl border border-warm-200 bg-[#fff8f4] px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-white"
              >
                {avatarUploading ? "Uploading..." : "Update photo"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[24px] bg-[#fff8f4] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28d80]">Email</p>
              <p className="mt-2 truncate text-sm font-semibold text-[#221a16]">{user?.email}</p>
            </div>
            <div className="rounded-[24px] bg-[#fff8f4] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28d80]">Phone</p>
              <p className="mt-2 text-sm font-semibold text-[#221a16]">{phone || "Add a number"}</p>
            </div>
            <div className="rounded-[24px] bg-[#fff8f4] px-4 py-4 sm:col-span-2 xl:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28d80]">Birthdate</p>
              <p className="mt-2 text-sm font-semibold text-[#221a16]">{birthdate || "Not set"}</p>
            </div>
          </div>
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFileChange}
        />

        <div className="mt-5 space-y-3">
          {avatarError && <InlineError message={avatarError} />}
          {avatarSuccess && <SuccessMessage message="Avatar updated successfully." />}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
        <div className="space-y-6">
          <Section title="Personal details" description="These fields power the name and profile details shown across the app.">
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Display name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+880 1700 000000"
                />
              </div>
              <Input
                label="Birthdate"
                type="date"
                value={birthdate}
                onChange={(event) => setBirthdate(event.target.value)}
              />
              {profileError && <InlineError message={profileError} />}
              {profileSuccess && <SuccessMessage message="Profile details saved." />}
              <button
                type="submit"
                disabled={profileSaving}
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
                style={{ background: "#ff7a5c" }}
              >
                {profileSaving ? "Saving..." : "Save profile"}
              </button>
            </form>
          </Section>

          <Section title="Security" description="Use a strong password and update it whenever you need to.">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <PasswordField
                label="New password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter a new password"
                autoComplete="new-password"
                required
              />
              <PasswordField
                label="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                required
              />
              {pwError && <InlineError message={pwError} />}
              {pwSuccess && <SuccessMessage message="Password updated." />}
              <button
                type="submit"
                disabled={pwSaving}
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
                style={{ background: "#ff7a5c" }}
              >
                {pwSaving ? "Updating..." : "Update password"}
              </button>
            </form>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Email address" description="Change the email tied to your account when you need to move to a new inbox.">
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div className="rounded-[24px] bg-[#fff8f4] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28d80]">Current email</p>
                <p className="mt-2 text-sm font-semibold text-[#221a16]">{user?.email}</p>
              </div>
              <Input
                label="New email"
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                placeholder="new@example.com"
                required
              />
              {emailError && <InlineError message={emailError} />}
              {emailSuccess && <SuccessMessage message="Confirmation sent to your new email." />}
              <button
                type="submit"
                disabled={emailSaving}
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
                style={{ background: "#ff7a5c" }}
              >
                {emailSaving ? "Updating..." : "Update email"}
              </button>
            </form>
          </Section>

          <Section title="Account" description="Sign out here when you are done on a shared or temporary device.">
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
              }}
              className="rounded-2xl border border-warm-200 bg-[#fff8f4] px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-white"
            >
              Sign out
            </button>
          </Section>
        </div>
      </div>
    </div>
  );
}
