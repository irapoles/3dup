"use client";

import { Download, Replace, Trash2, FileText, Film } from "lucide-react";
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

export function AssetThumbnail({
  fileName,
  fileUrl,
  fileSize,
  assetType,
  onReplace,
  onDelete,
  showDelete = true,
}: AssetThumbnailProps) {
  const isImage = assetType === "logo" || assetType === "image" || assetType.startsWith("moodboard") || assetType.startsWith("render") || assetType === "blueprint";
  const isVideo = assetType === "video";

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
        <a href={fileUrl} download target="_blank" rel="noreferrer">
          <Button variant="secondary" size="icon" className="h-7 w-7">
            <Download className="h-3 w-3" />
          </Button>
        </a>
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
