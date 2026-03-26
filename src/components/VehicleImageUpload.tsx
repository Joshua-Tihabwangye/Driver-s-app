import React, { useRef, useState } from "react";
import { Camera, Image as ImageIcon, FileText } from "lucide-react";

interface VehicleImageUploadProps {
  label?: string;
  imageUrl: string;
  onChange: (url: string) => void;
}

export default function VehicleImageUpload({ label, imageUrl, onChange }: VehicleImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        setError("Only PDF and Image files are currently supported.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isPdf = imageUrl?.startsWith("data:application/pdf");

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-wrap items-center justify-between mb-1 gap-1">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label || "Vehicle Image"}</span>
        {error && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md">{error}</span>}
      </div>
      <div 
        className="relative h-24 w-full rounded-[2rem] border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-orange-500/50 hover:bg-orange-50/30 transition-all group"
        onClick={() => fileInputRef.current?.click()}
      >
        {imageUrl ? (
          <>
            {isPdf ? (
              <div className="flex flex-col items-center justify-center h-full w-full bg-blue-50/50 text-blue-600">
                <FileText className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold">PDF Uploaded</span>
              </div>
            ) : (
              <img src={imageUrl} alt="Vehicle Upload" className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-1 group-hover:scale-110 transition-transform">
              <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">Tap to upload format</span>
          </>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*,.pdf" 
        className="hidden" 
      />
    </div>
  );
}
