"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type FileUploadZoneProps = {
  state: "idle" | "uploading" | "complete" | "error";
  progress: number;
  error: string | null;
  onFileSelect: (file: File) => void;
  onRetry: () => void;
  accept: string[];
  compact?: boolean;
  hint?: string;
};

export function FileUploadZone({
  state,
  progress,
  error,
  onFileSelect,
  onRetry,
  accept,
  compact = false,
  hint = "Drop file here",
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect],
  );

  if (state === "uploading") {
    return (
      <div className={cn("flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border px-3", compact ? "py-4" : "py-8")}>
        <Progress value={progress} className="mb-2 w-full max-w-[200px]" />
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
    );
  }

  if (state === "complete") {
    return (
      <div className={cn("flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50 px-3", compact ? "py-4" : "py-8")}>
        <CheckCircle className="mb-1 h-5 w-5 text-emerald-500" />
        <span className="text-xs text-emerald-600">Uploaded</span>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={cn("flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/30 bg-destructive/5 px-3", compact ? "py-4" : "py-8")}>
        <AlertCircle className="mb-1 h-5 w-5 text-destructive" />
        <span className="mb-2 text-xs text-destructive">{error}</span>
        <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-3 transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        compact ? "py-4" : "py-8",
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <Upload className="mb-1 h-5 w-5 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{hint}</span>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept.join(",")}
        onChange={handleChange}
      />
    </div>
  );
}
