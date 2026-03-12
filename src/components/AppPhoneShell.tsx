import React from "react";
import BottomNav from "./BottomNav";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect, useRef } from "react";

interface AppPhoneShellProps {
  children: React.ReactNode;
}

export default function AppPhoneShell({ children }: AppPhoneShellProps) {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const scrollTimeoutRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollTop = scrollContainerRef.current.scrollTop;
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Logic: 
      // 1. Hide at the very top
      if (currentScrollTop <= 0) {
        setIsVisible(false);
      } 
      // 2. Show if scrolling up or just started scrolling
      else {
        setIsVisible(true);
        
        // 3. Set timeout to hide after 3 seconds of inactivity
        scrollTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }

      setLastScrollTop(currentScrollTop);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lastScrollTop]);

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
          ref={scrollContainerRef}
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
