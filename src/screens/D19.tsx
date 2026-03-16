import {
CheckCircle2,
ChevronLeft,
Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D19 Info Session for Driver-Partners
// Redesigned to match Screenshot 0.
// Green header, navy progress card, module list with thumbnails.


function ModuleCard({ title, description, image, completed, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center space-x-4 rounded-3xl border border-slate-100 bg-white p-3 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
    >
      <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
            <Play className="h-3 w-3 fill-slate-900 text-slate-900 ml-0.5" />
          </div>
        </div>
        {/* Completion checkmark */}
        {completed && (
          <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#03cd8c] flex items-center justify-center border border-white">
            <CheckCircle2 className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col items-start overflow-hidden">
        <h3 className="text-[13px] font-bold text-slate-900 leading-tight mb-1">
          {title}
        </h3>
        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function InfoSessionListScreen() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Getting Started with Uber: A Complete Driver's Guide",
      description: "Step-by-step guide for new Uber drivers to start driving and earning.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop",
      completed: true
},
    {
      title: "How to Navigate the Uber Driver App Like a Pro",
      description: "Master the Uber Driver app with pro tips for smooth, efficient rides.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
      completed: true
},
    {
      title: "Top Tips for New Uber Drivers: Boost Your Earnings!",
      description: "Essential tips to help new Uber drivers maximize earnings.",
      image: "https://images.unsplash.com/photo-1549194382-346a188f6159?w=300&h=200&fit=crop",
      completed: false
},
    {
      title: "Essential Safety Tips for Uber Drivers",
      description: "Key safety tips to help Uber drivers ensure a secure driving experience.",
      image: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=300&h=200&fit=crop",
      completed: false
},
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight text-center">Learning Hub</h1>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Navy Progress Section */}
      <section className="bg-[#1c2b4d] px-8 pt-10 pb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/5 rounded-full -mr-16 -mt-16" />
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Mastery Path</h2>
        <p className="text-xs font-medium text-slate-400 mb-6 uppercase tracking-widest">Onboarding Driver-Partners</p>

        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black text-emerald-400 uppercase tracking-widest">
            <span>Progress: 60%</span>
            <span>4 / 9 Modules</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-[#03cd8c] to-[#a8e6cf] shadow-[0_0_15px_rgba(3,205,140,0.5)] transition-all duration-1000" style={{ width: '60%' }} />
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 -mt-8 bg-white rounded-t-[3rem] px-6 pt-10 pb-12 space-y-6 shadow-[0_-20_50px_rgba(0,0,0,0.02)]">
        <div className="px-2">
           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Curriculum</h3>
           <div className="space-y-4 pb-12">
             {modules.map((m, idx) => (
               <ModuleCard
                 key={idx}
                 title={m.title}
                 description={m.description}
                 image={m.image}
                 completed={m.completed}
                 onClick={() => navigate("/driver/training/earnings-tutorial")}
               />
             ))}
           </div>
        </div>
      </main>
    </div>
  );
}
