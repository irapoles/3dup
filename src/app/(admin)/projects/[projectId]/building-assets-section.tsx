"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { FileUploadZone } from "@/components/custom/file-upload-zone";
import { AssetThumbnail } from "@/components/custom/asset-thumbnail";
import { useUploadFile } from "@/hooks/use-upload-file";
import { createProjectAssetAction, deleteProjectAssetAction } from "@/lib/actions/projects";
import { ACCEPTED_IMAGE_TYPES, ACCEPTED_VIDEO_TYPES } from "@/lib/schemas/file";
import { toast } from "sonner";
import type { ProjectAsset } from "@/types/database";

function AssetSlot({ label, bucket, path, asset, assetType, accept, onUploaded, onDeleted }: {
  label: string; bucket: string; path: string; asset?: ProjectAsset;
  assetType: "logo" | "image" | "video"; accept: string[];
  onUploaded: (fileUrl: string, fileName: string, fileSize: number) => Promise<void>;
  onDeleted: (assetId: string) => Promise<void>;
}) {
  const { upload, state, progress, error, reset } = useUploadFile(bucket);
  const router = useRouter();

  const handleFile = useCallback(async (file: File) => {
    const fullPath = `${path}/${Date.now()}-${file.name}`;
    const p = await upload(file, fullPath);
    if (p) {
      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${p}`;
      await onUploaded(fileUrl, file.name, file.size);
      toast.success(`${label} uploaded`);
      router.refresh();
    }
  }, [path, bucket, upload, onUploaded, label, router]);

  const handleDelete = useCallback(async () => {
    if (!asset) return;
    await onDeleted(asset.id);
    toast.success(`${label} removed`);
    router.refresh();
  }, [asset, onDeleted, label, router]);

  if (asset && state !== "uploading") {
    return (
      <div>
        <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</h4>
        <AssetThumbnail fileName={asset.file_name} fileUrl={asset.file_url} fileSize={asset.file_size} assetType={asset.asset_type} onReplace={reset} onDelete={handleDelete} />
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</h4>
      <FileUploadZone state={state} progress={progress} error={error} onFileSelect={handleFile} onRetry={reset} accept={accept} compact hint={`Drop ${label.toLowerCase()}`} />
    </div>
  );
}

export function BuildingAssetsSection({ projectId, assets }: { projectId: string; assets: ProjectAsset[] }) {
  const logo = assets.find((a) => a.asset_type === "logo");
  const images = assets.filter((a) => a.asset_type === "image");
  const video = assets.find((a) => a.asset_type === "video");

  async function handleUploaded(fileUrl: string, fileName: string, fileSize: number, assetType: "logo" | "image" | "video") {
    await createProjectAssetAction({ projectId, fileUrl, fileName, fileSize, assetType });
  }

  async function handleDeleted(assetId: string) {
    await deleteProjectAssetAction(assetId);
  }

  return (
    <section>
      <h2 className="text-xl font-semibold leading-7">Building Assets</h2>
      <Separator className="my-4" />
      <div className="grid grid-cols-4 gap-4">
        <AssetSlot label="Logo" bucket="project-assets" path={`${projectId}/logo`} asset={logo} assetType="logo" accept={ACCEPTED_IMAGE_TYPES} onUploaded={(u, n, s) => handleUploaded(u, n, s, "logo")} onDeleted={handleDeleted} />
        <AssetSlot label="Image 1" bucket="project-assets" path={`${projectId}/images`} asset={images[0]} assetType="image" accept={ACCEPTED_IMAGE_TYPES} onUploaded={(u, n, s) => handleUploaded(u, n, s, "image")} onDeleted={handleDeleted} />
        <AssetSlot label="Image 2" bucket="project-assets" path={`${projectId}/images`} asset={images[1]} assetType="image" accept={ACCEPTED_IMAGE_TYPES} onUploaded={(u, n, s) => handleUploaded(u, n, s, "image")} onDeleted={handleDeleted} />
        <AssetSlot label="Video" bucket="project-assets" path={`${projectId}/video`} asset={video} assetType="video" accept={ACCEPTED_VIDEO_TYPES} onUploaded={(u, n, s) => handleUploaded(u, n, s, "video")} onDeleted={handleDeleted} />
      </div>
    </section>
  );
}
