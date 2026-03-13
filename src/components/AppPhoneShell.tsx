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

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#020617]"
      style={{
        backgroundImage: "radial-gradient(circle at top right, #1E293B 0, #020617 100%)",
      }}
    >
      <div
        className={`relative flex flex-col overflow-hidden shadow-2xl ${
          isPhoneView
            ? `w-full h-full sm:w-[410px] sm:h-[calc(100%-40px)] sm:max-h-[840px]
               md:w-[430px] md:h-[calc(100%-60px)] md:max-h-[900px]
               ${isDark ? "bg-slate-900" : "bg-white"}`
            : `rounded-[36px] border ${isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"}`
        }`}
        style={
          isPhoneView
            ? undefined
            : { width: "min(96vw, 920px)", height: "min(88vh, 860px)" }
        }
      >
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden pb-[70px]"
          style={{ WebkitOverflowScrolling: "touch", minHeight: 0 }}
        >
          {children}
        </div>
        <BottomNav isVisible={isVisible} />
      </div>
    </div>
  );
}
