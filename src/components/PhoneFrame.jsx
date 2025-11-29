import React from "react";

/**
 * PhoneFrame
 * Generic 375x812 phone frame used as a shell for driver screens.
 * Individual detailed canvases can replace this content while keeping
 * a consistent outer frame.
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen flex justify-center bg-evzone-navy py-4">
      <div className="w-[375px] h-[812px] bg-white rounded-phone shadow-2xl overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
