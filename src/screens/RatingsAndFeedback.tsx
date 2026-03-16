import { Star, ChevronLeft, MessageSquare, TrendingUp, ThumbsUp, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FEEDBACK = [
  {
    id: 1,
    rating: 5,
    comment: "Very professional driver, the car was clean and the ride was smooth.",
    date: "2 days ago",
    user: "Maria K.",
  },
  {
    id: 2,
    rating: 5,
    comment: "Excellent service! Arrived early and navigated traffic perfectly.",
    date: "4 days ago",
    user: "David O.",
  },
  {
    id: 3,
    rating: 4,
    comment: "Good ride, slightly slow but very safe.",
    date: "1 week ago",
    user: "Robert T.",
  },
];

export default function RatingsAndFeedback() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400 text-center">Performance</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Ratings & Reviews</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-8">
        {/* Main Rating Card */}
        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16 blur-xl" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#03cd8c] mb-4">Overall Rating</p>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h1 className="text-6xl font-black tracking-tighter">4.92</h1>
            <Star className="h-10 w-10 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto leading-relaxed">
            You're in the top 5% of drivers in Kampala this month! Keep it up.
          </p>
        </section>

        {/* Breakdown Stats */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-cream rounded-3xl p-5 border-2 border-orange-500/10 shadow-sm flex flex-col items-center space-y-2 hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.02]">
            <TrendingUp className="h-6 w-6 text-[#03cd8c]" />
            <span className="text-[20px] font-black text-slate-900">98%</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Acceptance</span>
          </div>
          <div className="bg-cream rounded-3xl p-5 border-2 border-orange-500/10 shadow-sm flex flex-col items-center space-y-2 hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.02]">
            <ThumbsUp className="h-6 w-6 text-blue-500" />
            <span className="text-[20px] font-black text-slate-900">4.9★</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Professionalism</span>
          </div>
        </section>

        {/* Feedback List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recent Feedback</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#03cd8c]">View all</button>
          </div>
          <div className="space-y-4">
            {FEEDBACK.map((item) => (
              <div key={item.id} className="bg-cream rounded-3xl p-6 border-2 border-orange-500/10 shadow-sm space-y-3 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center border border-orange-50">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-xs font-black text-slate-900">{item.user}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-black text-slate-900">{item.rating}.0</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                  "{item.comment}"
                </p>
                <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
