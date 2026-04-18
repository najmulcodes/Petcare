import { FormEvent, useEffect, useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { InlineError } from "./ui/ErrorState";

interface ResetPasswordModalProps {
  open: boolean;
  initialEmail: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export function ResetPasswordModal({
  open,
  initialEmail,
  loading,
  error,
  success,
  onClose,
  onSubmit,
}: ResetPasswordModalProps) {
  const [email, setEmail] = useState(initialEmail);

  useEffect(() => {
    if (!open) return;
    setEmail(initialEmail);
  }, [initialEmail, open]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit(email);
  }

  return (
    <Modal open={open} onClose={onClose} title="Reset password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="max-w-xl text-sm leading-7 text-[#7e6d66]">
          Enter the email address tied to your account and we will send you a password reset link.
        </p>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        {success && (
          <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        )}

        {error && <InlineError message={error} />}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-[#eeddd3] bg-[#f6eee9] py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-[#eeddd3]"
          >
            {success ? "Close" : "Cancel"}
          </button>
          <Button type="submit" loading={loading} className="flex-1" disabled={Boolean(success)}>
            Send Reset Link
          </Button>
        </div>
      </form>
    </Modal>
  );
}
