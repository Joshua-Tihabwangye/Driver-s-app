import {
  ChevronLeft,
  Copy,
  Link2,
  Mail,
  MessageCircle,
  QrCode,
  Share2,
  CheckCircle2
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useJobs } from "../context/JobsContext";

export default function ShareMyRide() {
  const { rideId } = useParams();
  const { allJobs } = useJobs();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const ride = useMemo(() => allJobs.find(j => j.id === rideId), [allJobs, rideId]);
  const shareUrl = `https://evzone.app/follow/${rideId || "ABC123"}`;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ride) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <PageHeader title="Share Ride" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-slate-500 font-medium">Ride not found or invalid ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader 
        title="Share your ride" 
        subtitle="Driver · Safety" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-20 overflow-y-auto scrollbar-hide space-y-6">
        {/* Ride Context Card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Share2 className="h-24 w-24 text-orange-500" />
          </div>
          
          <div className="relative z-10 flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 backdrop-blur-md border border-orange-500/30">
              <Link2 className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] uppercase font-black text-emerald-500">
                Active Tracking
              </span>
              <p className="text-sm font-bold text-white max-w-[200px] truncate">
                {ride.from} → {ride.to}
              </p>
            </div>
          </div>
          <p className="relative z-10 text-[11px] text-slate-400 font-medium leading-relaxed">
            Anyone with this link can see your location and trip status until
            the ride ends. This is a secure one-time link.
          </p>
          
          <div className="relative z-10 flex items-center space-x-2 pt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Live for this trip</span>
          </div>
        </section>

        {/* URL + copy */}
        <section className="space-y-3">
          <div className="rounded-[2rem] border-2 border-slate-100 bg-white shadow-sm p-4 flex items-center justify-between hover:border-emerald-500/20 transition-colors">
            <div className="flex flex-col items-start max-w-[170px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">
                Shareable URL
              </span>
              <span className="truncate text-[11px] font-bold text-slate-900">
                {shareUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center rounded-2xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${copied ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-slate-900 text-white shadow-slate-900/20"}`}
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
              {copied ? "Copied" : "Copy Link"}
            </button>
          </div>
        </section>

        {/* Share options */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Share via
            </h2>
            <div className="h-px flex-1 bg-slate-100 ml-4" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => {
                const text = `Follow my ride: ${shareUrl}`;
                window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank');
              }}
              className="group flex flex-col items-center justify-center rounded-[2rem] border-2 border-orange-500/10 bg-white p-5 active:scale-95 transition-all shadow-sm hover:border-emerald-500/30 hover:bg-emerald-50/10"
            >
              <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                <MessageCircle className="h-5 w-5 text-orange-500 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">SMS</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const subject = "Follow my ride status";
                const body = `Hi, you can follow my real-time ride status here: ${shareUrl}`;
                window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
              }}
              className="group flex flex-col items-center justify-center rounded-[2rem] border-2 border-orange-500/10 bg-white p-5 active:scale-95 transition-all shadow-sm hover:border-emerald-500/30 hover:bg-emerald-50/10"
            >
              <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                <Mail className="h-5 w-5 text-orange-500 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">Email</span>
            </button>

            <div className="group flex flex-col items-center justify-center rounded-[2rem] border-2 border-orange-500/10 bg-white p-2 transition-all shadow-sm">
              <div className="h-20 w-20 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-2 overflow-hidden">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`}
                  alt="QR Code"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">QR Code</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] border-2 border-emerald-500/10 bg-emerald-50/30 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="font-black text-[10px] uppercase tracking-widest text-slate-900">
                Secure Protocol
              </p>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
              This link is encrypted and trip-specific. Contacts cannot access your profile, history, or other account information.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(`/driver/safety/share-my-ride/${rideId}/add-contact`)}
              className="w-full py-5 rounded-[2rem] bg-orange-500 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
            >
              Add Secure Contact
            </button>
            <button
              onClick={() => navigate(`/driver/safety/follow-my-ride/${rideId}`)}
              className="w-full py-5 rounded-[2rem] border-2 border-slate-900 text-[11px] font-black uppercase tracking-[0.1em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
            >
              Manage Trusted
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
