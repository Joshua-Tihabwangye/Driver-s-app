import { Wifi, WifiOff } from "lucide-react";

interface OfflineConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  mode?: "offline" | "online";
}

export default function OfflineConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  mode = "offline",
}: OfflineConfirmModalProps) {
  if (!isOpen) return null;

  const isOnlineMode = mode === "online";
  const Icon = isOnlineMode ? Wifi : WifiOff;
  const title = isOnlineMode ? "Go Online?" : "Go Offline?";
  const message = isOnlineMode
    ? "Confirm to go online and start receiving new ride and delivery requests."
    : "Are you sure you want to go offline? You will stop receiving new ride and delivery requests.";
  const confirmLabel = isOnlineMode ? "Go Online" : "Confirm";
  const confirmButtonClass = isOnlineMode
    ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
    : "bg-amber-500 shadow-lg shadow-amber-500/20";
  const iconToneClass = isOnlineMode
    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
    : "bg-amber-500/10 border-amber-500/20 text-amber-500";

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
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl border ${iconToneClass}`}>
            <Icon className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white text-center">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            {message}
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
            className={`flex-1 rounded-lg py-3 text-xs font-bold text-white active:scale-95 transition-all ${confirmButtonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
