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
      className="relative min-h-screen w-full flex flex-col"
      style={{ backgroundImage: stageBackground }}
    >
      <div
        className={`pointer-events-none fixed top-[10%] right-[-10%] h-[320px] w-[320px] rounded-full blur-3xl ${
          isDark ? "bg-emerald-400/10" : "bg-emerald-300/20"
        }`}
      />
      <div
        className={`pointer-events-none fixed bottom-[10%] left-[-10%] h-[320px] w-[320px] rounded-full blur-3xl ${
          isDark ? "bg-blue-500/10" : "bg-blue-300/20"
        }`}
      />
      <div
        className={`relative isolate flex-1 flex flex-col w-full pb-[calc(88px+env(safe-area-inset-bottom))] ${
          isDark ? "bg-transparent" : "bg-transparent"
        }`}
      >
        {children}
      </div>
      <BottomNav isVisible={isVisible} />
    </div>
  );
}
