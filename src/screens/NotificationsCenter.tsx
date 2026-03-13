import { Bell, ChevronLeft, Calendar, Info, Gift, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "promotion",
    title: "Earn $50 Extra Today!",
    description: "Complete 10 rides between 5 PM and 9 PM to unlock your weekend bonus.",
    time: "2h ago",
    icon: Gift,
    color: "text-amber-500",
    bg: "bg-amber-50",
    unread: true,
  },
  {
    id: 2,
    type: "account",
    title: "Document Verified",
    description: "Your updated vehicle insurance has been approved. You're all set!",
    time: "5h ago",
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-50",
    unread: false,
  },
  {
    id: 3,
    type: "safety",
    title: "Safety Reminder",
    description: "Heavy rain reported in Central Kampala. Please drive carefully and maintain safe distances.",
    time: "Yesterday",
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-50",
    unread: false,
  },
  {
    id: 4,
    type: "system",
    title: "System Maintenance",
    description: "App services will be briefly unavailable tonight from 2 AM to 3 AM for scheduled updates.",
    time: "Yesterday",
    icon: Bell,
    color: "text-[#03cd8c]",
    bg: "bg-emerald-50",
    unread: false,
  },
];

export default function NotificationsCenter() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Updates</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Notifications</p>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recent Updates</h2>
          <button className="text-[10px] font-black uppercase tracking-widest text-[#03cd8c]">Mark all read</button>
        </div>

        <div className="space-y-3">
          {NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              className={`relative rounded-3xl p-5 border-2 transition-all active:scale-[0.98] shadow-sm hover:shadow-md hover:scale-[1.01] ${
                notif.unread ? "bg-cream border-orange-500/20" : "bg-white border-slate-50"
              }`}
            >
              {notif.unread && (
                <div className="absolute top-5 right-5 w-2 h-2 bg-[#03cd8c] rounded-full animate-pulse" />
              )}
              <div className="flex items-start space-x-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${notif.bg}`}>
                  <notif.icon className={`h-5 w-5 ${notif.color}`} />
                </div>
                <div className="flex-1 pr-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-black text-slate-900 leading-tight">{notif.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">
                    {notif.description}
                  </p>
                  <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    <Calendar className="h-3 w-3 mr-1" />
                    {notif.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-10 text-center">
            <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest italic">That's all for now!</p>
        </div>
      </main>
    </div>
  );
}
