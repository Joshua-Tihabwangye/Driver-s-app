import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import type { VehicleDocumentGroup } from "../data/types";

interface CopyRowProps {
  label: string;
  status: string;
  fileName: string;
  error: string;
  onClick: () => void;
}

function CopyRow({ label, status, fileName, error, onClick }: CopyRowProps) {
  const tone =
    status === "Uploaded"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : status === "Missing"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border bg-white px-3 py-2 text-left shadow-sm transition-all hover:border-orange-300 ${status === "Uploaded" ? "border-emerald-100" : "border-slate-200"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-black uppercase tracking-tight text-slate-800">
            {label}
          </span>
          {fileName ? (
            <span className="text-[10px] text-slate-500 truncate max-w-[150px]">Selected: {fileName}</span>
          ) : (
            <span className="text-[10px] text-slate-400">No file selected</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tone}`}>
            {status}
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 bg-white">
            <Upload className="mr-1 h-3 w-3" />
            Upload
          </span>
        </div>
      </div>
      {error && <p className="mt-1 text-[10px] font-medium text-red-600">{error}</p>}
    </button>
  );
}

interface VehicleDocumentCardProps {
  icon: any;
  title: string;
  subtitle: string;
  documentGroup?: VehicleDocumentGroup;
  onChange: (group: VehicleDocumentGroup) => void;
}

export default function VehicleDocumentCard({
  icon: Icon,
  title,
  subtitle,
  documentGroup = {},
  onChange,
}: VehicleDocumentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setFileError("Only PDF and image files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({
        ...documentGroup,
        file: { url: reader.result as string, fileName: file.name },
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border-2 border-brand-secondary/10 bg-cream px-3 py-3 shadow-sm hover:border-brand-secondary/30 transition-all">
      <div className="mb-2 flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-100 bg-white shadow-sm flex-shrink-0">
          <Icon className="h-4 w-4 text-brand-secondary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{subtitle}</span>
        </div>
      </div>

      <CopyRow
        label="Document Copy"
        status={documentGroup.file ? "Uploaded" : "Missing"}
        fileName={documentGroup.file?.fileName || ""}
        error={fileError}
        onClick={() => inputRef.current?.click()}
      />

      <input
        type="file"
        ref={inputRef}
        accept="image/*,.pdf"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
