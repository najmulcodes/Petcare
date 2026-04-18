import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const currentCount = Number(document.body.dataset.modalCount ?? "0");
    document.body.dataset.modalCount = String(currentCount + 1);
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);

    return () => {
      const nextCount = Math.max(Number(document.body.dataset.modalCount ?? "1") - 1, 0);
      document.body.dataset.modalCount = String(nextCount);
      if (nextCount === 0) {
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
      }
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-[#2d211c]/35 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[32px] border border-white/70 bg-white shadow-card sm:max-h-[90vh] sm:max-w-xl sm:rounded-[32px]">
        <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-[#e7d5cb] sm:hidden" />
        <div className="flex items-center justify-between border-b border-[#f1e3da] px-5 py-4 sm:px-6">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-300 transition-colors hover:bg-[#f6eee9] hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-5 pt-5 pb-24 pb-[calc(env(safe-area-inset-bottom)+96px)] sm:px-6 sm:pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
