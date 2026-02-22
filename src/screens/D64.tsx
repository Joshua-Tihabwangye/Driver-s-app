import React, { useState } from "react";
import {
  Bell,
  ChevronLeft,
  X,
  Plus,
  Link2,
  Search,
  Check,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D64 Driver – Follow My Ride Selection (v3)
// Redesigned to match high-fidelity screenshots with map background and contact modal.

export default function FollowMyRideSelectionScreen() {
  const navigate = useNavigate();
  const [selectedContacts, setSelectedContacts] = useState(["Thomas John", "Anna Maria"]);
  const [currentTime] = useState("16:23");

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
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col relative">

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
              borderRadius: "0 0 32px 32px",
            }}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Driver App</h1>
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
              <Bell className="h-5 w-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white" />
            </button>
          </header>
        </div>

        {/* Map Background (Simulated) */}
        <div className="flex-1 relative bg-[#e5e5e5]">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=800&fit=crop"
            alt="Map"
            className="w-full h-full object-cover opacity-60 grayscale"
          />

          {/* Top Header Mock Interface */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
            <div className="h-10 w-10 bg-white rounded shadow-sm opacity-80" />
            <div className="h-10 px-6 bg-[#242f4b] rounded-full shadow-lg flex items-center space-x-2">
              <div className="h-3 w-3 bg-[#e9b33e] rounded-sm rotate-45" />
              <span className="text-white text-[12px] font-bold uppercase tracking-wider">UGX 0</span>
            </div>
            <div className="h-10 w-10 bg-white rounded shadow-sm opacity-80" />
          </div>

          {/* Vehicle Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-28 w-28 rounded-full bg-[#00a3ff]/10 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-[#00a3ff]/20 flex items-center justify-center">
                <div className="h-14 w-14 bg-[#242f4b] rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                  <div className="h-7 w-3.5 bg-slate-300 rounded-sm relative">
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-slate-100 rounded-t-sm" />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-red-400 rounded-b-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Overlay Background */}
        <div className="absolute inset-0 bg-black/40 z-30" />

        {/* Follow My Ride Modal */}
        <div className="absolute inset-x-0 bottom-0 z-40 animate-in slide-in-from-bottom duration-300">
          <div className="bg-white rounded-t-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.1)] pb-8 px-6 pt-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[19px] font-bold text-slate-800">Follow My Ride</h2>
              <button
                onClick={() => navigate(-1)}
                className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center active:scale-95 transition-all text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Box */}
            <div className="relative mb-8">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full h-14 bg-slate-50 rounded-xl pl-12 pr-4 text-[15px] font-medium text-slate-900 border border-transparent focus:border-[#03cd8c]/20 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Contact List */}
            <div className="flex items-start space-x-4 mb-10 overflow-x-auto scrollbar-hide">
              {/* Add Contact */}
              <button className="flex flex-col items-center space-y-2 flex-shrink-0 active:scale-95 transition-all">
                <div className="h-16 w-16 rounded-full bg-[#03cd8c] flex items-center justify-center text-white shadow-lg shadow-green-500/10">
                  <Plus className="h-8 w-8 stroke-[3]" />
                </div>
                <span className="text-[12px] font-bold text-slate-500 text-center leading-tight">Add<br />Contact</span>
              </button>

              {contacts.map((contact, i) => {
                const isSelected = selectedContacts.includes(contact.name);
                return (
                  <button
                    key={i}
                    onClick={() => toggleContact(contact.name)}
                    className="flex flex-col items-center space-y-2 flex-shrink-0 active:scale-95 transition-all group"
                  >
                    <div className="relative h-16 w-16 rounded-full border border-slate-100 overflow-hidden shadow-sm">
                      <img src={contact.img} alt={contact.name} className="h-full w-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="h-7 w-7 rounded-full bg-white border border-[#03cd8c] flex items-center justify-center">
                            <Check className="h-4 w-4 text-[#03cd8c] stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </div>
                    <span className={`text-[12px] font-bold text-center leading-tight transition-colors ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                      {contact.name.split(' ').join('<br/>').split('<br/>').map((txt, idx) => (
                        <React.Fragment key={idx}>{txt}<br /></React.Fragment>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full h-14 bg-[#e6fff7] rounded-xl flex items-center justify-center space-x-2 text-[#03cd8c] font-bold active:scale-[0.98] transition-all">
                <Link2 className="h-5 w-5 rotate-45" />
                <span>Copy link</span>
              </button>
              <button
                onClick={() => navigate('/driver/safety/emergency/map')}
                disabled={selectedContacts.length === 0}
                className={`w-full h-14 rounded-xl font-bold transition-all active:scale-[0.98] ${selectedContacts.length > 0
                  ? 'bg-[#03cd8c] text-white shadow-lg shadow-green-500/10'
                  : 'bg-[#e0e0e0] text-slate-400'
                  }`}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="bg-white h-7 flex items-center justify-center">
            <div className="w-32 h-1.5 bg-slate-300 rounded-full" />
          </div>
        </div>

      </div>
    </div>
  );
}
