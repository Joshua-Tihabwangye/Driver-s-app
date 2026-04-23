import { Check, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

type SlideToConfirmProps = {
  instruction: string;
  successLabel?: string;
  onConfirm: () => void | boolean | Promise<void | boolean>;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  threshold?: number;
  errorFallback?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function SlideToConfirm({
  instruction,
  successLabel = "Confirmed",
  onConfirm,
  disabled = false,
  loading = false,
  className = "",
  threshold = 0.86,
  errorFallback = "Action failed. Please try again.",
}: SlideToConfirmProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startClientXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const resetTimeoutRef = useRef<number | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const thumbSize = 48;
  const horizontalPadding = 8;
  const maxOffset = Math.max(0, trackWidth - thumbSize - horizontalPadding * 2);
  const effectiveLoading = loading || isConfirming;

  const progressRatio = maxOffset === 0 ? 0 : clamp(offset / maxOffset, 0, 1);
  const fillWidth = horizontalPadding + thumbSize + offset;
  const canInteract = !disabled && !effectiveLoading && !isSuccess;

  const statusLabel = useMemo(() => {
    if (isSuccess) return successLabel;
    if (effectiveLoading) return "Confirming...";
    return instruction;
  }, [effectiveLoading, instruction, isSuccess, successLabel]);

  useEffect(() => {
    const measure = () => {
      setTrackWidth(trackRef.current?.offsetWidth || 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (maxOffset === 0) {
      setOffset(0);
      return;
    }

    if (offset > maxOffset) {
      setOffset(maxOffset);
    }
  }, [maxOffset, offset]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const resetSlider = () => {
    setOffset(0);
    setIsDragging(false);
    pointerIdRef.current = null;
  };

  const finalizeSuccess = () => {
    setIsSuccess(true);
    setError("");
    setOffset(maxOffset);
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = window.setTimeout(() => {
      setIsSuccess(false);
      setOffset(0);
    }, 900);
  };

  const runConfirm = async () => {
    if (!canInteract) return;
    setError("");
    setIsConfirming(true);
    setOffset(maxOffset);

    try {
      const result = await onConfirm();
      if (result === false) {
        throw new Error(errorFallback);
      }
      finalizeSuccess();
    } catch (err) {
      const message = err instanceof Error && err.message ? err.message : errorFallback;
      setError(message);
      resetSlider();
    } finally {
      setIsConfirming(false);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!canInteract) return;
    setError("");
    setIsDragging(true);
    pointerIdRef.current = event.pointerId;
    startClientXRef.current = event.clientX;
    startOffsetRef.current = offset;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId || !canInteract) return;
    const delta = event.clientX - startClientXRef.current;
    setOffset(clamp(startOffsetRef.current + delta, 0, maxOffset));
  };

  const handlePointerEnd = async (event: PointerEvent<HTMLButtonElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) return;
    setIsDragging(false);
    pointerIdRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (progressRatio >= threshold) {
      await runConfirm();
      return;
    }

    setOffset(0);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!canInteract) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    await runConfirm();
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div
        ref={trackRef}
        className={`relative h-[72px] overflow-hidden rounded-[2rem] border p-2 transition-colors sm:h-16 sm:rounded-full ${
          disabled
            ? "border-slate-200 bg-slate-100"
            : isSuccess
            ? "border-emerald-300 bg-emerald-50"
            : error
            ? "border-red-200 bg-red-50"
            : "border-orange-200 bg-orange-50"
        }`}
      >
        <div
          className={`absolute bottom-2 left-2 top-2 rounded-full transition-all ${
            isSuccess
              ? "bg-emerald-500"
              : error
              ? "bg-red-500/20"
              : "bg-orange-500/15"
          }`}
          style={{ width: `${Math.max(thumbSize, fillWidth)}px` }}
          aria-hidden="true"
        />

        <div
          className={`relative flex h-full select-none items-center justify-center px-12 text-center text-[9px] font-black uppercase leading-[1.15] tracking-[0.12em] sm:px-16 sm:text-[10px] sm:leading-none sm:tracking-[0.18em] ${
            isSuccess
              ? "text-emerald-700"
              : disabled
              ? "text-slate-400"
              : error
              ? "text-red-700"
              : "text-orange-700"
          }`}
        >
          {statusLabel}
        </div>

        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onKeyDown={handleKeyDown}
          disabled={!canInteract}
          aria-label={instruction}
          className={`absolute left-2 top-2 flex h-12 w-12 touch-none items-center justify-center rounded-full text-white shadow-lg transition-all ${
            isSuccess
              ? "bg-emerald-500"
              : effectiveLoading
              ? "bg-orange-500"
              : disabled
              ? "bg-slate-300"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          style={{ transform: `translateX(${offset}px)` }}
        >
          {effectiveLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isSuccess ? (
            <Check className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>
      {error ? (
        <p className="px-2 text-[10px] font-bold uppercase tracking-tight text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
