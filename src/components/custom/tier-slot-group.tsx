"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileUploadZone } from "@/components/custom/file-upload-zone";
import { AssetThumbnail } from "@/components/custom/asset-thumbnail";
import { useUploadFile } from "@/hooks/use-upload-file";
import { toast } from "sonner";

type TierAsset = {
  id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  asset_type: string;
};

type TierSlotProps = {
  label: string;
  storageBucket: string;
  storagePath: string;
  existingAsset?: TierAsset;
  onUploaded: (fileUrl: string, fileName: string, fileSize: number) => Promise<void>;
  onDeleted?: (assetId: string) => Promise<void>;
  accept: string[];
  showDelete?: boolean;
};

function TierSlot({
  label,
  storageBucket,
  storagePath,
  existingAsset,
  onUploaded,
  onDeleted,
  accept,
  showDelete = true,
}: TierSlotProps) {
  const { upload, state, progress, error, reset } = useUploadFile(storageBucket);
  const router = useRouter();

  const handleFileSelect = useCallback(
    async (file: File) => {
      const fullPath = `${storagePath}/${Date.now()}-${file.name}`;
      const path = await upload(file, fullPath);
      if (path) {
        const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storageBucket}/${path}`;
        await onUploaded(fileUrl, file.name, file.size);
        toast.success(`${label} uploaded`);
        router.refresh();
      }
    },
    [storagePath, storageBucket, upload, onUploaded, label, router],
  );

  const handleDelete = useCallback(async () => {
    if (!existingAsset || !onDeleted) return;
    await onDeleted(existingAsset.id);
    toast.success(`${label} removed`);
    router.refresh();
  }, [existingAsset, onDeleted, label, router]);

  if (existingAsset && state !== "uploading") {
    return (
      <div>
        <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</h4>
        <AssetThumbnail
          fileName={existingAsset.file_name}
          fileUrl={existingAsset.file_url}
          fileSize={existingAsset.file_size}
          assetType={existingAsset.asset_type}
          onReplace={reset}
          onDelete={handleDelete}
          showDelete={showDelete}
        />
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</h4>
      <FileUploadZone
        state={state}
        progress={progress}
        error={error}
        onFileSelect={handleFileSelect}
        onRetry={reset}
        accept={accept}
        compact
        hint={`Drop ${label.toLowerCase()}`}
      />
    </div>
  );
}

export function TierSlotGroup({ slots }: { slots: Array<TierSlotProps> }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {slots.map((slot) => (
        <TierSlot key={slot.label} {...slot} />
      ))}
    </div>
  );
}
