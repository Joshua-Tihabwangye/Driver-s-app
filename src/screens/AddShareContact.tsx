import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  User, 
  Phone, 
  Mail, 
  Heart, 
  MessageSquare, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useJobs } from "../context/JobsContext";

export default function AddShareContact() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { allJobs, addSharedContact } = useJobs();
  
  const ride = allJobs.find(j => j.id === rideId);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
    note: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setSubmitError(null);
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const persisted = rideId ? addSharedContact(rideId, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        relationship: formData.relationship,
        note: formData.note
      }) : false;
      setIsSubmitting(false);

      if (persisted) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate(`/driver/safety/follow-my-ride/${rideId}`);
        }, 2000);
        return;
      }

      setSubmitError("Contact could not be saved. It may already exist for this ride.");
    }, 1500);
  };

  if (!ride) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <PageHeader title="Add Contact" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-slate-500 font-medium">Ride not found or invalid ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader 
        title="Add Secure Contact" 
        subtitle="Ride Sharing · Safety" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-20 overflow-y-auto scrollbar-hide">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Contact Registered!</h2>
            <p className="text-sm text-slate-500 font-medium text-center max-w-[240px]">
              {formData.name} can now follow your trip {ride.from} → {ride.to}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Context Card */}
            <div className="rounded-[2rem] bg-slate-900 p-5 text-white shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active Ride Context</span>
              </div>
              <p className="text-sm font-bold truncate">{ride.from} → {ride.to}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Sharing live location & status</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <label className="block space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Full Name</span>
                  <button 
                    type="button"
                    onClick={() => {
                      const mockContacts = [
                        { name: "Sarah Johnson", phone: "+256 700 123 456", email: "sarah.j@example.com" },
                        { name: "David Wilson", phone: "+256 755 987 654", email: "david.w@example.com" },
                        { name: "Michael Okello", phone: "+256 772 111 222", email: "m.okello@example.com" }
                      ];
                      const contact = mockContacts[Math.floor(Math.random() * mockContacts.length)];
                      setFormData({
                        ...formData,
                        name: contact.name,
                        phone: contact.phone,
                        email: contact.email
                      });
                    }}
                    className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    Select from Contacts
                  </button>
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sarah J."
                    className="w-full rounded-2xl border-2 border-slate-100 bg-white py-4 pl-12 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-emerald-500 focus:outline-none transition-colors shadow-sm"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 ml-1">Phone Number</span>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="tel"
                    placeholder="+256 ..."
                    className="w-full rounded-2xl border-2 border-slate-100 bg-white py-4 pl-12 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-emerald-500 focus:outline-none transition-colors shadow-sm"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 ml-1">Email (Optional)</span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="sarah@example.com"
                    className="w-full rounded-2xl border-2 border-slate-100 bg-white py-4 pl-12 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-emerald-500 focus:outline-none transition-colors shadow-sm"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 ml-1">Relationship</span>
                <div className="relative">
                  <Heart className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    className="w-full rounded-2xl border-2 border-slate-100 bg-white py-4 pl-12 pr-4 text-sm font-bold text-slate-900 appearance-none focus:border-emerald-500 focus:outline-none transition-colors shadow-sm"
                    value={formData.relationship}
                    onChange={e => setFormData({...formData, relationship: e.target.value})}
                  >
                    <option value="">Select Relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="sibling">Sibling</option>
                    <option value="parent">Parent</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90" />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 ml-1">Note (Optional)</span>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                  <textarea
                    rows={3}
                    placeholder="Any special instructions..."
                    className="w-full rounded-2xl border-2 border-slate-100 bg-white py-4 pl-12 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-emerald-500 focus:outline-none transition-colors shadow-sm resize-none"
                    value={formData.note}
                    onChange={e => setFormData({...formData, note: e.target.value})}
                  />
                </div>
              </label>
            </div>

            {submitError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
                  {submitError}
                </p>
              </div>
            )}

            <button
              disabled={isSubmitting || !formData.name || !formData.phone}
              type="submit"
              className={`w-full py-5 rounded-full text-[13px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg flex items-center justify-center space-x-2 ${
                isSubmitting || !formData.name || !formData.phone
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-orange-500 text-white shadow-orange-500/30 hover:bg-emerald-500 hover:shadow-emerald-500/30"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register Contact</span>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
