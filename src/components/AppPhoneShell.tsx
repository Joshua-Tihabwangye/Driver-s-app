import React from "react";
import BottomNav from "./BottomNav";
import { useTheme } from "../context/ThemeContext";

interface AppPhoneShellProps {
  children: React.ReactNode;
}

export default function AppPhoneShell({ children }: AppPhoneShellProps) {
  const { isDark } = useTheme();

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#020617]"
      style={{
        backgroundImage: "radial-gradient(circle at top right, #1E293B 0, #020617 100%)",
      }}
    >
      <div
        className={`relative flex flex-col overflow-hidden
                    w-full h-full
                    sm:w-[410px] sm:h-[calc(100%-40px)] sm:max-h-[840px] shadow-2xl
                    md:w-[430px] md:h-[calc(100%-60px)] md:max-h-[900px]
                    ${isDark ? "bg-slate-900" : "bg-white"}`}
      >
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden pb-[70px]"
          style={{ WebkitOverflowScrolling: "touch", minHeight: 0 }}
        >
          {children}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
