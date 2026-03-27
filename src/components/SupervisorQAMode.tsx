import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { SCREENS, getPreviewPath } from "../config/routes";
import { useStore } from "../context/StoreContext";
import { Activity, RotateCcw } from "lucide-react";

const QA_MODE_STORAGE_KEY = "evz_supervisor_qa_mode";
const DEFAULT_SCREEN = SCREENS.find((screen) => screen.id === "OnlineDashboard") || SCREENS[0];

export default function SupervisorQAMode() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetActiveTrip } = useStore();

  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("qa") === "1") {
      return true;
    }

    return window.localStorage.getItem(QA_MODE_STORAGE_KEY) === "open";
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(QA_MODE_STORAGE_KEY, isOpen ? "open" : "closed");
  }, [isOpen]);

  const currentScreen = useMemo(
    () =>
      SCREENS.find((screen) =>
        matchPath({ path: screen.path, end: true }, location.pathname)
      ) || DEFAULT_SCREEN,
    [location.pathname]
  );

  const handleScreenChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedScreen = SCREENS.find((screen) => screen.id === selectedId);
    if (selectedScreen) {
      navigate(getPreviewPath(selectedScreen));
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed top-4 right-4 z-[10000] rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-widest shadow-lg transition-all ${
          isOpen
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-white/95 text-slate-700 hover:bg-white"
        }`}
        title="Toggle Supervisor QA Mode"
      >
        {isOpen ? "QA On" : "QA"}
      </button>

      {isOpen && (
        <section className="fixed left-1/2 top-4 z-[9999] w-[min(760px,calc(100%-1rem))] -translate-x-1/2 rounded-3xl border border-emerald-100 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Supervisor QA Mode
                </p>
                <p className="text-[11px] font-semibold text-slate-500">
                  Screen selector for route parity and flow checks
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
            >
              Hide
            </button>
          </div>

          <label
            htmlFor="qa-screen-select"
            className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-500"
          >
            Screen
          </label>
          <select
            id="qa-screen-select"
            value={currentScreen.id}
            onChange={handleScreenChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-800 shadow-sm focus:border-emerald-400 focus:outline-none"
          >
            {SCREENS.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.id} - {screen.label}
              </option>
            ))}
          </select>

          <div className="mt-4 pt-4 border-t border-emerald-100 flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Activity className="h-3.5 w-3.5 text-emerald-600" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trip State Management</span>
                </div>
                <button
                  type="button"
                  onClick={() => resetActiveTrip()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:bg-orange-100 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Force Clear Active Trip
                </button>
             </div>
             <p className="text-[10px] font-medium text-slate-400">
                Clears the `activeTrip` state in the store. Use this to bypass "Cannot accept new trip while another is active" errors during testing.
             </p>
          </div>
        </section>
      )}
    </>
  );
}
