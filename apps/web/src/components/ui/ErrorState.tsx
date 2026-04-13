import { ReactNode } from "react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  action?: ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 px-6 py-12 text-center">
      <div className="text-4xl">⚠️</div>
      <h3 className="mt-3 text-base font-bold text-red-700">{title}</h3>
      <p className="mt-1 text-sm text-red-400">{message}</p>
      <div className="mt-4 flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            Try again
          </button>
        )}
        {action}
      </div>
    </div>
  );
}

interface InlineErrorProps {
  message: string;
}

export function InlineError({ message }: InlineErrorProps) {
  return (
    <p className="rounded-2xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-500">
      {message}
    </p>
  );
}
