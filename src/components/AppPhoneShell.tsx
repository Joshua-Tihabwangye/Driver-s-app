import React, { useState, useEffect } from "react";
import BottomNav from "./BottomNav";
import { useTheme } from "../context/ThemeContext";

interface AppPhoneShellProps {
  children: React.ReactNode;
}

const PHONE_WIDTH_MEDIA = "(max-width: 640px)";
const PHONE_UA_REGEX = /Mobi|iPhone|iPod|Android.*Mobile|BlackBerry|IEMobile|Opera Mini/i;
const TABLET_UA_REGEX = /iPad|Tablet|PlayBook|Silk|Kindle|SM-T|Galaxy Tab|Tab Pro|Tab S|Xoom|SCH-I800|TouchPad|Nexus 7|Nexus 9/i;

function getUserAgent(): string {
  if (typeof navigator === "undefined") return "";
  return navigator.userAgent;
}

function shouldTreatAsPhoneByUA() {
  const ua = getUserAgent();
  return PHONE_UA_REGEX.test(ua) && !TABLET_UA_REGEX.test(ua);
}

export default function AppPhoneShell({ children }: AppPhoneShellProps) {
  const { isDark } = useTheme();
  const [isPhoneView, setIsPhoneView] = useState(() => {
    if (typeof window === "undefined") return true;
    const mediaQuery = window.matchMedia(PHONE_WIDTH_MEDIA);
    return mediaQuery.matches || shouldTreatAsPhoneByUA();
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia(PHONE_WIDTH_MEDIA);
    const handleWidthChange = (event: MediaQueryListEvent) => {
      setIsPhoneView(event.matches || shouldTreatAsPhoneByUA());
    };
    setIsPhoneView(mediaQuery.matches || shouldTreatAsPhoneByUA());

    const listener = (event: MediaQueryListEvent) => handleWidthChange(event);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);

  const isVisible = true;
  const stageBackground = isDark
    ? "radial-gradient(1200px 520px at 85% -10%, rgba(16, 185, 129, 0.2), transparent 58%), radial-gradient(800px 480px at -8% 110%, rgba(30, 64, 175, 0.2), transparent 60%), linear-gradient(180deg, #020617 0%, #0b1120 100%)"
    : "radial-gradient(1100px 500px at 88% -15%, rgba(16, 185, 129, 0.22), transparent 60%), radial-gradient(780px 460px at -10% 110%, rgba(59, 130, 246, 0.16), transparent 62%), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)";

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center"
      style={{ backgroundImage: stageBackground }}
    >
      <div
        className={`pointer-events-none absolute top-[-120px] right-[-80px] h-[320px] w-[320px] rounded-full blur-3xl ${
          isDark ? "bg-emerald-400/20" : "bg-emerald-300/30"
        }`}
      />
      <div
        className={`pointer-events-none absolute bottom-[-150px] left-[-80px] h-[320px] w-[320px] rounded-full blur-3xl ${
          isDark ? "bg-blue-500/20" : "bg-blue-300/30"
        }`}
      />
      <div
        className={`relative isolate flex flex-col overflow-hidden transition-all duration-500 ${
          isPhoneView
            ? `w-full h-full ${isDark ? "bg-[#04201a]" : "bg-[#f8fafc]"}`
            : `rounded-[36px] shadow-[0_32px_120px_rgba(15,23,42,0.36)] ${
                isDark
                  ? "border-none bg-[#04201a]"
                  : "border-none bg-[#f8fafc]"
              }`
        }`}
        style={
          isPhoneView
            ? undefined
            : { width: "min(96vw, 920px)", height: "min(88vh, 860px)" }
        }
      >
        {!isPhoneView && (
          <>
            <div
              className={`pointer-events-none absolute left-1/2 top-3 h-7 w-36 -translate-x-1/2 rounded-full ${
                isDark ? "bg-slate-700/80" : "bg-slate-200/95"
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-20 ${
                isDark
                  ? "bg-gradient-to-b from-white/[0.06] to-transparent"
                  : "bg-gradient-to-b from-white/60 to-transparent"
              }`}
            />
          </>
        )}
        <div
          className="app-shell-scroll flex-1 overflow-y-auto overflow-x-hidden pb-[calc(88px+env(safe-area-inset-bottom))]"
          style={{ WebkitOverflowScrolling: "touch", minHeight: 0 }}
        >
          {children}
        </div>
        <BottomNav isVisible={isVisible} />
      </div>
    </div>
  );
}
