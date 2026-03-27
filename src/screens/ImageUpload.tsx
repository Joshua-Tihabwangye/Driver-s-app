import {
Camera,
CheckCircle2,
Eye,
Info,
SunMedium,
UploadCloud
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – ImageUpload Upload Your Image
// Redesigned UI (green curved header, circular preview, green checkmark badge)
// with FULL original functionality restored:
// - TipRow component (well-lit, easy to recognize, recent)
// - handleUpload toggle with hasImage state
// - Dual action buttons (Upload from gallery / Take a photo) with conditional text
// - "Done, back to Driver Personal" button


function TipRow({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start space-x-2 rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
        <Icon className="h-4 w-4 text-slate-700" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-semibold text-slate-900">{title}</span>
        <span className="text-[11px] text-slate-600">{text}</span>
      </div>
    </div>
  );
}

export default function ImageUpload() {
  const { driverProfilePhoto, setDriverProfilePhoto } = useStore();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(driverProfilePhoto);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const hasImage = imagePreviewUrl !== null;

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const closeCameraModal = () => {
    setIsCameraOpen(false);
    setCameraError("");
    stopCameraStream();
  };

  const setPreviewFromBlob = (blob: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        setCameraError("Unable to process selected image.");
        return;
      }
      setImagePreviewUrl(reader.result);
      setDriverProfilePhoto(reader.result);
    };
    reader.readAsDataURL(blob);
  };

  const handleOpenGallery = () => {
    galleryInputRef.current?.click();
  };

  const handleGallerySelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreviewFromBlob(file);
    event.target.value = "";
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    setCameraError("");
  };

  const handleCaptureFromCamera = () => {
    const videoElement = videoRef.current;
    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      setCameraError("Camera feed is not ready. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Unable to capture photo on this device.");
      return;
    }

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Unable to capture photo. Please try again.");
          return;
        }
        setPreviewFromBlob(blob);
        closeCameraModal();
      },
      "image/jpeg",
      0.92
    );
  };

  useEffect(() => {
    if (!isCameraOpen) return;

    let isCancelled = false;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is not supported in this browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setCameraError("");
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
      } catch {
        setCameraError("Camera access denied. Allow permission and try again.");
      }
    };

    startCamera();

    return () => {
      isCancelled = true;
      stopCameraStream();
    };
  }, [isCameraOpen]);

  useEffect(() => {
    setImagePreviewUrl(driverProfilePhoto);
  }, [driverProfilePhoto]);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-full ">

      <PageHeader 
        title="Identity" 
        subtitle="Profile Photo" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleGallerySelection}
          className="hidden"
        />

        {/* Image preview */}
        <section className="flex flex-col items-center py-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div
            className="relative flex h-48 w-48 items-center justify-center rounded-full bg-slate-900 border-[6px] border-orange-500/20 shadow-2xl transition-transform active:scale-95 cursor-pointer overflow-hidden"
            onClick={handleOpenGallery}
          >
            {hasImage ? (
              <img
                src={imagePreviewUrl || undefined}
                alt="Selected profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-800">
                <Camera className="h-12 w-12 text-slate-500" />
              </div>
            )}

            {hasImage && (
              <div className="absolute bottom-4 inset-x-6 flex items-center justify-center rounded-2xl bg-slate-900/90 backdrop-blur-md px-3 py-2 border border-white/10 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="flex items-center text-[10px] font-black text-orange-400 uppercase tracking-tight">
                  <CheckCircle2 className="mr-2 h-3 w-3" /> Ready to Use
                </span>
              </div>
            )}
            
            {/* Visual overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <p className="mt-6 text-[11px] font-medium text-slate-400 text-center max-w-[240px] leading-relaxed">
            Your profile photo helps riders and partners identify you quickly and ensures a safe, personable experience.
          </p>
        </section>

        {/* Tips */}
        <section className="space-y-4">
          <div className="px-1">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Photo Requirements
             </h2>
          </div>
          <div className="space-y-3">
            <TipRow
              icon={SunMedium}
              title="Perfect Lighting"
              text="Natural light ensures you're easily recognizable."
            />
            <TipRow
              icon={Eye}
              title="Clear View"
              text="Remove masks, sunglasses, and keep face centered."
            />
            <TipRow
              icon={Info}
              title="Recent Profile"
              text="Please use a photo taken within the last 6 months."
            />
          </div>
        </section>

        {/* Actions */}
        <section className="pt-4 pb-12 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleOpenGallery}
            className="w-full rounded-2xl py-4 text-xs font-black bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-widest"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            {hasImage ? "Change Photo" : "Upload Gallery"}
          </button>
          <button
            type="button"
            onClick={handleOpenCamera}
            className="w-full rounded-2xl py-4 text-xs font-black text-slate-400 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest"
          >
            <Camera className="h-4 w-4 mr-2" />
            {hasImage ? "Retake Photo" : "Take Photo"}
          </button>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/driver/preferences/identity/face-capture")}
              className="w-full rounded-2xl bg-[#1c2b4d] py-4 text-sm font-black text-white shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all uppercase tracking-widest"
            >
              Confirm & Continue
            </button>
          </div>
          
          <p className="px-6 mt-2 text-[10px] font-medium text-slate-400 text-center leading-relaxed">
            By continuing, you agree that this photo represents you and meets our community guidelines.
          </p>
        </section>

        {isCameraOpen && (
          <section className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-6">
            <div className="w-full max-w-sm rounded-3xl bg-white p-4 shadow-2xl space-y-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                  Capture Profile Photo
                </h3>
                <p className="mt-1 text-[11px] font-medium text-slate-500">
                  Center your face and capture a clear image.
                </p>
              </div>

              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-black">
                {cameraError ? (
                  <div className="flex h-full items-center justify-center px-4 text-center text-[11px] font-semibold text-white/90">
                    {cameraError}
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeCameraModal}
                  className="rounded-xl border border-slate-200 py-3 text-xs font-black uppercase tracking-widest text-slate-600"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleCaptureFromCamera}
                  className="rounded-xl bg-orange-500 py-3 text-xs font-black uppercase tracking-widest text-white"
                >
                  Capture
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
