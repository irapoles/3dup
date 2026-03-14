"use client";

import { useCallback, useState } from "react";
import { Download, Replace, Trash2, FileText, Film } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AssetThumbnailProps = {
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  assetType: string;
  onReplace?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
};

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function downloadFile(url: string, fileName: string) {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName || "download";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

export function AssetThumbnail({
  fileName,
  fileUrl,
  fileSize,
  assetType,
  onReplace,
  onDelete,
  showDelete = true,
}: AssetThumbnailProps) {
  const [downloading, setDownloading] = useState(false);
  const isImage = assetType === "logo" || assetType === "image" || assetType.startsWith("moodboard") || assetType.startsWith("render") || assetType === "blueprint";
  const isVideo = assetType === "video";

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadFile(fileUrl, fileName);
    } catch {
      toast.error("Download failed. Try opening the link and saving from the browser.");
    } finally {
      setDownloading(false);
    }
  }, [fileUrl, fileName, downloading]);

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-muted/30">
      <div className="aspect-video w-full overflow-hidden">
        {isImage && (
          <img src={fileUrl} alt={fileName} className="h-full w-full object-cover" />
        )}
        {isVideo && (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {!isImage && !isVideo && (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="truncate text-xs font-medium">{fileName}</p>
        {fileSize && <p className="text-[10px] text-muted-foreground">{formatSize(fileSize)}</p>}
      </div>
      <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="secondary"
          size="icon"
          className="h-7 w-7"
          onClick={handleDownload}
          disabled={downloading}
          aria-label="Download"
        >
          <Download className="h-3 w-3" />
        </Button>
        {onReplace && (
          <Button variant="secondary" size="icon" className="h-7 w-7" onClick={onReplace}>
            <Replace className="h-3 w-3" />
          </Button>
        )}
        {showDelete && onDelete && (
          <Button variant="destructive" size="icon" className="h-7 w-7" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
