import React, { useState } from "react";
import {
  Bell,
  Map,
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D98 Tour – Today’s Schedule Screen (v1)
// Daily schedule for a multi-day tour.
// - Header: Tour · Day X of Y + Tour job type pill
// - Summary: tour name, date, total segments today, progress indicator
// - Segments list: time window + title + brief description
// - CTA: tap a segment -> open navigation flow (D47 / D55) in the real app
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const SEGMENTS = [
  {
    id: 1,
    time: "09:00–10:00",
    title: "Airport pickup → Hotel",
    description: "Meet guests at arrivals and transfer to City Hotel.",
    status: "completed",
  },
  {
    id: 2,
    time: "11:00–15:00",
    title: "City tour",
    description: "Guided tour of key landmarks and lunch stop.",
    status: "in-progress",
  },
  {
    id: 3,
    time: "16:00–18:00",
    title: "Hotel → Safari lodge",
    description: "Drive guests to the lodge, check-in and handover.",
    status: "upcoming",
  },
];

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function SegmentRow({ segment, onClick }) {
  const { time, title, description, status } = segment;

  const statusLabel =
    status === "completed"
      ? "Completed"
      : status === "in-progress"
      ? "In progress"
      : "Upcoming";

  const statusClasses =
    status === "completed"
      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
      : status === "in-progress"
      ? "bg-blue-50 border-blue-100 text-blue-700"
      : "bg-slate-50 border-slate-100 text-slate-500";

  return (
    <button
      onClick={() => onClick(segment)}
      className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex flex-col space-y-2 text-[11px] text-slate-600 text-left"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center text-[10px] text-slate-500">
          <Clock className="h-3 w-3 mr-1" />
          {time}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${statusClasses}`}
        >
          {status === "completed" && (
            <CheckCircle2 className="h-3 w-3 mr-1" />
          )}
          {statusLabel}
        </span>
      </div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col items-start max-w-[220px]">
          <span className="text-xs font-semibold text-slate-900">
            {title}
          </span>
          <span className="text-[11px] text-slate-600">{description}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-400 mt-1" />
      </div>
    </button>
  );
}

export default function TourTodayScheduleScreen() {
  const [nav] = useState("home");

  const completedCount = SEGMENTS.filter((s) => s.status === "completed").length;
  const totalCount = SEGMENTS.length;

  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleSegmentClick = (segment) => {
    // In the real app, this would navigate to D47 / D55 for the selected segment
    // e.g. navigate(`/driver/tour/segment/${segment.id}`)
    // Here we leave it as a no-op in the preview.
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-start space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7] mt-0.5">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Tour
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Tour · Day 2 of 5
              </h1>
              <span className="mt-0.5 inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                Tour
              </span>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Summary card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                    Today&apos;s schedule
                  </span>
                  <p className="text-sm font-semibold">City Highlights & Airport Day</p>
                </div>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-100">
                <span>Tuesday · 17 March</span>
                <span>{completedCount} of {totalCount} segments completed</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-[#03cd8c] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Follow today&apos;s segments in order to keep guests on time and
              maintain the tour schedule. You can tap any segment to open
              navigation for that part of the day.
            </p>
          </section>

          {/* Segments list */}
          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Today&apos;s segments
            </h2>
            {SEGMENTS.map((segment) => (
              <SegmentRow
                key={segment.id}
                segment={segment}
                onClick={handleSegmentClick}
              />
            ))}
          </section>
        </main>

        {/* Bottom navigation – Home active (tour context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"} />
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
