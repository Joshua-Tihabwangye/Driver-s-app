import {
  AlertTriangle,
  PencilLine,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import SlideToConfirm from "../components/SlideToConfirm";
import { useStore } from "../context/StoreContext";

export default function PickupConfirmation() {
  const navigate = useNavigate();
  const {
    confirmDeliveryPickup,
    deliveryStageAtLeast,
    deliveryWorkflow,
    activeDeliveryJob,
  } = useStore();
  const [pickupOtp, setPickupOtp] = useState("");

  useEffect(() => {
    if (!deliveryStageAtLeast("accepted")) {
      navigate("/driver/jobs/incoming", {
        replace: true,
        state: { jobType: "delivery" },
      });
    }
  }, [deliveryStageAtLeast, navigate]);

  const routeId = deliveryWorkflow.routeId || activeDeliveryJob?.routeId || "";
  const jobId = deliveryWorkflow.jobId || deliveryWorkflow.activeJobId || activeDeliveryJob?.id || "N/A";
  const orderId = deliveryWorkflow.orderId || activeDeliveryJob?.orderId || jobId;
  const pickupPoint = activeDeliveryJob?.from || "Pickup point";
  const destination = activeDeliveryJob?.to || "Drop-off point";
  const routeSummary = activeDeliveryJob?.routeSummary || `${pickupPoint} to ${destination}`;
  const recipientName = activeDeliveryJob?.recipientContact?.name || activeDeliveryJob?.riderName || "Recipient";
  const recipientPhone = activeDeliveryJob?.recipientContact?.phone || activeDeliveryJob?.riderPhone || "N/A";
  const packageSummary = activeDeliveryJob?.packageDetails
    ? `${activeDeliveryJob.packageDetails.type || "Package"} · ${activeDeliveryJob.packageDetails.weight || "Size pending"}`
    : "Package details pending";

  return (
    <div className="flex flex-col h-full ">
      <DriverMapSurface
        heightClass="h-[460px]"
        onBack={() => navigate(-1)}
        defaultTrafficOn
        defaultAlertsOn
        infoCard={(
          <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-4 shadow-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Pickup OTP Required
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-tight text-slate-700">
              Enter the pickup OTP body before you confirm collection.
            </p>
          </div>
        )}
        markers={[
          { id: "pickup", positionClass: "left-[34%] top-[44%]", tone: "warning", label: "Pickup" },
        ]}
      />

      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Driver · Deliveries
          </p>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Confirm Pickup
          </h1>
        </section>

        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Delivery Check
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-600 leading-relaxed">
                Confirm the pickup OTP, then continue to the QR scan and route start.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Delivery IDs
              </p>
              <p className="mt-2 text-sm font-black text-slate-900">
                Job #{jobId}
              </p>
              <p className="text-[11px] font-medium text-slate-500">
                Order #{orderId} · Route {routeId || "pending"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Route Summary
              </p>
              <p className="mt-2 text-sm font-black text-slate-900">
                {routeSummary}
              </p>
              <p className="text-[11px] font-medium text-slate-500">
                {pickupPoint} to {destination}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Pickup OTP Body
            </p>
            <p className="mt-1 text-[11px] font-medium text-slate-500 leading-relaxed">
              Enter the code provided for this collection before marking the pickup as complete.
            </p>
          </div>
          <label className="block space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              OTP
            </span>
            <div className="flex items-center rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
              <PencilLine className="h-4 w-4 text-slate-400" />
              <input
                value={pickupOtp}
                onChange={(event) => setPickupOtp(event.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter OTP body"
                className="ml-3 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </label>

          <div className="grid grid-cols-1 gap-2 text-[11px] text-slate-600">
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
              <span className="font-black uppercase tracking-widest text-slate-400">Recipient</span>
              <p className="mt-1 font-semibold text-slate-900">{recipientName}</p>
              <p className="text-slate-500">{recipientPhone}</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
              <span className="font-black uppercase tracking-widest text-slate-400">Package</span>
              <p className="mt-1 font-semibold text-slate-900">{packageSummary}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4 pb-12">
          <SlideToConfirm
            instruction="Slide to confirm pickup"
            successLabel="Pickup confirmed"
            disabled={!pickupOtp.trim()}
            onConfirm={async () => {
              await confirmDeliveryPickup(pickupOtp.trim());
              navigate("/driver/qr/scanner");
              return true;
            }}
          />
          <button
            type="button"
            onClick={() => navigate("/driver/delivery/pickup/confirm-location")}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50 flex items-center justify-center"
          >
            <X className="h-5 w-5 mr-3" />
            No, Keep Original Pin
          </button>
        </section>
      </main>
    </div>
  );
}
