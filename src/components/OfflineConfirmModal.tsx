import { Wifi, WifiOff } from "lucide-react";

interface OfflineConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function OfflineConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: OfflineConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative mx-6 w-full max-w-sm rounded-xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-[var(--evz-brand-green-border)] space-y-5">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
            <WifiOff className="h-7 w-7 text-amber-500" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white text-center">
            Go Offline?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            Are you sure you want to go offline? You will stop receiving new ride
            and delivery requests.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-amber-500 py-3 text-xs font-bold text-white shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
