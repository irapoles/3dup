"use client";

import { Separator } from "@/components/ui/separator";
import { TierSlotGroup } from "@/components/custom/tier-slot-group";
import { FileUploadZone } from "@/components/custom/file-upload-zone";
import { AssetThumbnail } from "@/components/custom/asset-thumbnail";
import { useUploadFile } from "@/hooks/use-upload-file";
import { createApartmentAssetAction, deleteApartmentAssetAction } from "@/lib/actions/apartments";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/schemas/file";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ApartmentAsset } from "@/types/database";

export function ApartmentAssetsSection({ apartmentId, assets }: { apartmentId: string; assets: ApartmentAsset[] }) {
  const blueprint = assets.find((a) => a.asset_type === "blueprint");
  const { upload: uploadBp, state: bpState, progress: bpProgress, error: bpError, reset: bpReset } = useUploadFile("apartment-assets");
  const router = useRouter();

  const handleBpUpload = useCallback(async (file: File) => {
    const path = `${apartmentId}/blueprint/${Date.now()}-${file.name}`;
    const p = await uploadBp(file, path);
    if (p) {
      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/apartment-assets/${p}`;
      await createApartmentAssetAction({ apartmentId, fileUrl, fileName: file.name, fileSize: file.size, assetType: "blueprint" });
      toast.success("Blueprint uploaded");
      router.refresh();
    }
  }, [apartmentId, uploadBp, router]);

  const handleBpDelete = useCallback(async () => {
    if (!blueprint) return;
    await deleteApartmentAssetAction(blueprint.id);
    toast.success("Blueprint removed");
    router.refresh();
  }, [blueprint, router]);

  return (
    <section>
      <h2 className="text-xl font-semibold leading-7">Assets</h2>
      <Separator className="my-4" />

      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium">Blueprint</h3>
        {blueprint && bpState !== "uploading" ? (
          <div className="max-w-[250px]">
            <AssetThumbnail fileName={blueprint.file_name} fileUrl={blueprint.file_url} fileSize={blueprint.file_size} assetType={blueprint.asset_type} onReplace={bpReset} onDelete={handleBpDelete} />
          </div>
        ) : (
          <div className="max-w-[250px]">
            <FileUploadZone state={bpState} progress={bpProgress} error={bpError} onFileSelect={handleBpUpload} onRetry={bpReset} accept={ACCEPTED_IMAGE_TYPES} compact hint="Drop blueprint" />
          </div>
        )}
      </div>

      <h3 className="mb-2 text-sm font-medium">Moodboards</h3>
      <TierSlotGroup
        slots={([["moodboard_t1", "Tier 1"], ["moodboard_t2", "Tier 2"], ["moodboard_t3", "Tier 3"]] as const).map(([type, label]) => ({
          label,
          storageBucket: "apartment-assets",
          storagePath: `${apartmentId}/${type}`,
          existingAsset: (() => { const a = assets.find((x) => x.asset_type === type); return a ? { id: a.id, file_url: a.file_url, file_name: a.file_name, file_size: a.file_size, asset_type: type } : undefined; })(),
          onUploaded: async (fileUrl: string, fileName: string, fileSize: number) => {
            await createApartmentAssetAction({ apartmentId, fileUrl, fileName, fileSize, assetType: type });
          },
          onDeleted: async (assetId: string) => {
            await deleteApartmentAssetAction(assetId);
          },
          accept: ACCEPTED_IMAGE_TYPES,
        }))}
      />
    </section>
  );
}
