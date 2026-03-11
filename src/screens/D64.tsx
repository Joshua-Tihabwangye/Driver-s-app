import {
Check,
ChevronLeft,
Link2,
Plus,
Search,
X
} from "lucide-react";
import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D64 Driver – Follow My Ride Selection (v3)
// Redesigned to match high-fidelity screenshots with map background and contact modal.

export default function FollowMyRideSelectionScreen() {
  const navigate = useNavigate();
  const [selectedContacts, setSelectedContacts] = useState(["Thomas John", "Anna Maria"]);
  const [] = useState("16:23");

  const contacts = [
    { name: 'Thomas John', img: 'https://i.pravatar.cc/150?u=tj' },
    { name: 'Emilia Riley', img: 'https://i.pravatar.cc/150?u=er' },
    { name: 'Anna Maria', img: 'https://i.pravatar.cc/150?u=am' },
    { name: 'Daniel Charles', img: 'https://i.pravatar.cc/150?u=dc' },
  ];

  const toggleContact = (name) => {
    setSelectedContacts(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex flex-col items-center">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Protocol</span>
             <p className="text-base font-black text-white tracking-tight leading-tight">Driver App</p>
          </div>
          <div className="w-9" />
        </header>
      </div>

      {/* Map Background (Simulated) */}
      <div className="flex-1 relative bg-[#e5e5e5] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=1200&fit=crop"
          alt="Map"
          className="w-full h-full object-cover opacity-60 grayscale"
        />

        {/* Top Header Mock Interface */}
        <div className="absolute top-6 inset-x-6 flex items-center justify-between pointer-events-none">
          <div className="h-12 w-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center border border-white">
             <div className="h-6 w-6 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          <div className="h-12 px-6 bg-slate-900 rounded-full shadow-2xl flex items-center space-x-3 border border-slate-800">
            <div className="h-3 w-3 bg-[#03cd8c] rounded-full animate-pulse" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">UGX 0.00</span>
          </div>
          <div className="h-12 w-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center border border-white">
             <div className="h-6 w-6 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Vehicle Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-32 w-32 rounded-full bg-[#03cd8c]/10 flex items-center justify-center animate-pulse">
            <div className="h-24 w-24 rounded-full bg-[#03cd8c]/20 flex items-center justify-center">
              <div className="h-16 w-16 bg-slate-900 rounded-full border-4 border-white flex items-center justify-center shadow-2xl">
                <div className="h-8 w-4 bg-[#03cd8c] rounded-sm relative">
                  <div className="absolute inset-x-0 top-0 h-2 bg-white/50 rounded-t-sm" />
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-red-400 rounded-b-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay Background */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-30" />

      {/* Follow My Ride Modal */}
      <div className="absolute inset-x-0 bottom-0 z-40 animate-in slide-in-from-bottom duration-500">
        <div className="bg-white rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.2)] pb-12 px-8 pt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
               <span className="text-[10px] tracking-[0.2em] font-black uppercase text-[#03cd8c]">Safety Hub</span>
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Follow My Ride</h2>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="h-10 w-10 bg-slate-100 rounded-2xl flex items-center justify-center active:scale-95 transition-all text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative mb-8">
            <div className="absolute left-5 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-slate-300" />
            </div>
            <input
              type="text"
              placeholder="Search contact name..."
              className="w-full h-16 bg-slate-50 rounded-[2rem] pl-14 pr-6 text-[14px] font-bold text-slate-900 border-2 border-transparent focus:border-[#03cd8c] focus:outline-none transition-all placeholder:text-slate-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
            />
          </div>

          {/* Contact List */}
          <div className="flex items-start space-x-6 mb-10 overflow-x-auto scrollbar-hide pb-4">
            {/* Add Contact */}
            <button className="flex flex-col items-center space-y-3 flex-shrink-0 active:scale-95 transition-all group">
              <div className="h-18 w-18 rounded-full bg-[#03cd8c] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Plus className="h-8 w-8 stroke-[3]" />
              </div>
              <span className="text-[9px] font-black text-slate-400 text-center uppercase tracking-widest leading-tight">Add<br />New</span>
            </button>

            {contacts.map((contact, i) => {
              const isSelected = selectedContacts.includes(contact.name);
              return (
                <button
                  key={i}
                  onClick={() => toggleContact(contact.name)}
                  className="flex flex-col items-center space-y-3 flex-shrink-0 active:scale-95 transition-all group"
                >
                  <div className="relative h-18 w-18 rounded-full border-2 border-slate-50 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <img src={contact.img} alt={contact.name} className={`h-full w-full object-cover transition-all ${isSelected ? 'scale-110 grayscale-0' : 'grayscale opacity-70'}`} />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#03cd8c]/20 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-white border-2 border-[#03cd8c] flex items-center justify-center shadow-xl">
                          <Check className="h-4 w-4 text-[#03cd8c] stroke-[4]" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] font-black text-center uppercase tracking-widest leading-tight transition-colors ${isSelected ? 'text-[#03cd8c]' : 'text-slate-400'}`}>
                    {contact.name.split(' ').map((txt, idx) => (
                      <React.Fragment key={idx}>{txt}<br /></React.Fragment>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button className="w-full h-16 bg-emerald-50/50 rounded-full flex items-center justify-center space-x-3 text-[#03cd8c] font-black text-[11px] uppercase tracking-widest active:scale-[0.98] transition-all border border-emerald-100/50">
              <Link2 className="h-5 w-5 rotate-45" />
              <span>Copy Link Protocol</span>
            </button>
            <button
              onClick={() => navigate('/driver/safety/emergency/map')}
              disabled={selectedContacts.length === 0}
              className={`w-full h-18 rounded-full font-black text-[13px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl ${selectedContacts.length > 0
                ? 'bg-[#03cd8c] text-white shadow-emerald-500/30'
                : 'bg-slate-100 text-slate-300'
                }`}
            >
              Start Mission Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
