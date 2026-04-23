import {
Check,
Link2,
Plus,
Search,
ShieldCheck,
X
} from "lucide-react";
import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – EmergencyConfirmation Driver – Follow My Ride Selection (v3)
// Redesigned to match high-fidelity screenshots with map background and contact modal.

export default function EmergencyConfirmation() {
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
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Safety Hub" 
        subtitle="Support" 
        onBack={() => navigate(-1)} 
      />

      <DriverMapSurface
        heightClass="flex-1"
        className="rounded-none border-0"
        defaultLayer="night"
        defaultTrafficOn
        defaultAlertsOn
        markers={[
          {
            id: "vehicle",
            positionClass: "left-1/2 top-[46%] -translate-x-1/2",
            content: (
              <div className="h-32 w-32 rounded-full bg-orange-500/10 flex items-center justify-center animate-pulse">
                <div className="h-24 w-24 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-slate-900 shadow-2xl">
                    <div className="relative h-8 w-4 rounded-sm bg-orange-500">
                      <div className="absolute inset-x-0 top-0 h-2 rounded-t-sm bg-white/50" />
                      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-red-400" />
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />

      {/* Modal Overlay Background */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-30" />

      {/* Follow My Ride Modal */}
      <div className="absolute inset-x-0 bottom-0 z-40 animate-in slide-in-from-bottom duration-500">
        <div className="bg-white rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.2)] pb-12 px-8 pt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
               <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Contact</span>
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
              className="w-full h-16 bg-cream rounded-[2rem] pl-14 pr-6 text-[14px] font-bold text-slate-900 border-2 border-orange-500/10 focus:border-orange-500 focus:outline-none transition-all placeholder:text-slate-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
            />
          </div>

          {/* Contact List */}
          <div className="flex items-start space-x-6 mb-10 overflow-x-auto scrollbar-hide pb-4">
            {/* Add Contact */}
            <button className="flex flex-col items-center space-y-3 flex-shrink-0 active:scale-95 transition-all group">
              <div className="h-18 w-18 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-2xl shadow-orange-500/20 group-hover:scale-105 transition-transform">
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
                      <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-white border-2 border-orange-500 flex items-center justify-center shadow-xl">
                          <Check className="h-4 w-4 text-orange-500 stroke-[4]" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] font-black text-center uppercase tracking-widest leading-tight transition-colors ${isSelected ? 'text-orange-500' : 'text-slate-400'}`}>
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
            <button className="w-full h-16 bg-cream rounded-full flex items-center justify-center space-x-3 text-orange-500 font-black text-[11px] uppercase tracking-widest active:scale-[0.98] transition-all border-2 border-orange-500/10 hover:border-orange-500/30">
              <Link2 className="h-5 w-5 rotate-45" />
              <span>Copy Direct Link</span>
            </button>
            <button
              onClick={() => navigate('/driver/safety/emergency/map')}
              disabled={selectedContacts.length === 0}
              className={`w-full h-18 rounded-full font-black text-[13px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl ${selectedContacts.length > 0
                ? 'bg-orange-500 text-white shadow-orange-500/30'
                : 'bg-slate-100 text-slate-300'
                }`}
            >
              Start Live Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
