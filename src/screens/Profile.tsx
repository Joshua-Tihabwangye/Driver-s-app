import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Star,
  Car,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Check,
  ShieldCheck,
  User,
} from "lucide-react";
import PhoneFrame from "../components/PhoneFrame";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Driver",
    phone: "+256 700 123 456",
    email: "john@evzone.com",
    city: "Kampala",
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <PhoneFrame>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-6 pb-4 bg-white sticky top-0 z-20">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 mr-4 active:scale-90 transition-transform shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#03cd8c]">
              Personal Hub
            </span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
               Driver Profile
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`flex items-center rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-[0.97] shadow-sm ${
            isEditing
              ? "bg-[#03cd8c] text-white shadow-[#03cd8c]/20"
              : "bg-slate-900 text-white shadow-slate-900/20"
          }`}
        >
          {isEditing ? (
            <><Check className="h-3.5 w-3.5 mr-1.5" /> Save</>
          ) : (
            <><Edit3 className="h-3.5 w-3.5 mr-1.5" /> Edit</>
          )}
        </button>
      </header>

      <div className="flex-1 px-4 pb-10 space-y-6 overflow-y-auto no-scrollbar">
        {/* Avatar + name */}
        <div className="flex flex-col items-center pt-4 mb-2">
          <div className="relative group">
            <div className="flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-gradient-to-tr from-[#03cd8c] to-emerald-300 text-4xl font-bold text-white shadow-xl group-hover:rotate-3 transition-transform">
              JD
            </div>
            <div className="absolute -top-1 -right-1 bg-white p-1.5 rounded-full shadow-md">
                 <ShieldCheck className="h-5 w-5 text-[#03cd8c] fill-[#03cd8c]/10" />
            </div>
            <button
              type="button"
              className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white border-4 border-white shadow-lg active:scale-95 transition-transform"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            {profile.name}
          </h2>
          <div className="flex items-center space-x-1.5 mt-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-700 tracking-tight">4.92 Rating</span>
            <span className="text-[10px] text-slate-400 font-medium ml-1">
              (324 Global Trips)
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total KM", value: "2.4k", icon: Car, color: "#03cd8c" },
            { label: "On Time", value: "98%", icon: Star, color: "#f59e0b" },
            { label: "City", value: "Kampala", icon: MapPin, color: "#0ea5e9" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl border border-slate-50 bg-white px-1 py-4 shadow-sm"
            >
              <stat.icon className="h-4 w-4 mb-2" style={{ color: stat.color }} />
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                {stat.value}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Personal Details */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">
             Core Information
          </h3>
          <div className="space-y-2">
            {[
                { label: "Full Identity", value: profile.name, key: "name", icon: User },
                { label: "Primary Phone", value: profile.phone, key: "phone", icon: Phone },
                { label: "Official Email", value: profile.email, key: "email", icon: Mail },
                { label: "Operational City", value: profile.city, key: "city", icon: MapPin },
            ].map((field) => (
                <div
                key={field.key}
                className={`rounded-2xl border transition-all duration-300 ${isEditing ? 'bg-slate-50 border-[#03cd8c]/30' : 'bg-white border-slate-50'} px-5 py-4 shadow-sm`}
                >
                <div className="flex items-center justify-between mb-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                        <field.icon className="h-3 w-3 mr-1.5" />
                        {field.label}
                    </label>
                    {isEditing && <span className="text-[8px] bg-[#03cd8c]/10 text-[#03cd8c] px-1.5 py-0.5 rounded font-bold">EDITABLE</span>}
                </div>
                {isEditing ? (
                    <input
                    type="text"
                    value={field.value as string}
                    onChange={(e) =>
                        setProfile((p) => ({ ...p, [field.key]: e.target.value }))
                    }
                    className="w-full text-[13px] font-bold text-slate-900 bg-transparent outline-none focus:ring-0 placeholder:text-slate-300"
                    autoFocus={field.key === 'name'}
                    />
                ) : (
                    <p className="text-[13px] font-bold text-slate-800 tracking-tight">
                    {field.value as string}
                    </p>
                )}
                </div>
            ))}
          </div>
        </section>

        {/* Identity & Secondary actions */}
        <section className="space-y-3 pt-2">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">
             Security & Identity
          </h3>
          <button
            type="button"
            onClick={() => navigate("/driver/preferences/identity")}
            className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/20 px-5 py-5 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-[#03cd8c] transition-colors">
                    <ShieldCheck className="h-5 w-5 text-[#03cd8c] group-hover:text-white" />
                 </div>
                 <div className="flex flex-col items-start text-left">
                    <p className="text-sm font-bold text-slate-800">Identity Verification</p>
                    <p className="text-[11px] text-slate-500 font-medium">Verify your face and documents</p>
                 </div>
            </div>
            <div className="bg-[#03cd8c] rounded-full px-2.5 py-1">
                <span className="text-[9px] font-bold text-white uppercase">Active</span>
            </div>
          </button>
        </section>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
