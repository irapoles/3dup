"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  const assetsList = assets.filter((a) => a.asset_type === "blueprint");
  const moodboards = assets.filter((a) => ["moodboard_t1", "moodboard_t2", "moodboard_t3"].includes(a.asset_type));
  const { upload, state: uploadState, progress, error: uploadError, reset: uploadReset } = useUploadFile("apartment-assets");
  const router = useRouter();

  const handleUpload = useCallback(async (file: File) => {
    const path = `${apartmentId}/blueprint/${Date.now()}-${file.name}`;
    const p = await upload(file, path);
    if (p) {
      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/apartment-assets/${p}`;
      await createApartmentAssetAction({ apartmentId, fileUrl, fileName: file.name, fileSize: file.size, assetType: "blueprint" });
      toast.success("Asset uploaded");
      uploadReset();
      router.refresh();
    }
  }, [apartmentId, upload, uploadReset, router]);

  const handleDelete = useCallback(async (assetId: string) => {
    await deleteApartmentAssetAction(assetId);
    toast.success("Asset removed");
    router.refresh();
  }, [router]);

  return (
    <Accordion
      type="multiple"
      defaultValue={[]}
      className="w-full space-y-2"
    >
      <AccordionItem value="assets" className="rounded-lg border bg-card px-4 last:border-b-0">
        <AccordionTrigger className="py-4 hover:no-underline">
          <div className="flex w-full items-center justify-between pr-2">
            <span className="text-base font-semibold">Assets</span>
            <span className="text-xs text-muted-foreground">
              {assetsList.length > 0 ? `${assetsList.length} uploaded` : "Drop file to add"}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 pt-2">
          <div className="flex flex-wrap items-start gap-4">
            {assetsList.map((asset) => (
              <div key={asset.id} className="w-[200px] shrink-0">
                <AssetThumbnail
                  fileName={asset.file_name}
                  fileUrl={asset.file_url}
                  fileSize={asset.file_size}
                  assetType={asset.asset_type}
                  onReplace={uploadReset}
                  onDelete={() => handleDelete(asset.id)}
                />
              </div>
            ))}
            <div className="min-h-[120px] w-[200px] shrink-0">
              <FileUploadZone
                state={uploadState}
                progress={progress}
                error={uploadError}
                onFileSelect={handleUpload}
                onRetry={uploadReset}
                accept={ACCEPTED_IMAGE_TYPES}
                compact
                hint="Drop file"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="moodboards" className="rounded-lg border bg-card px-4 last:border-b-0">
        <AccordionTrigger className="py-4 hover:no-underline">
          <div className="flex w-full items-center justify-between pr-2">
            <span className="text-base font-semibold">Moodboards</span>
            <span className="text-xs text-muted-foreground">
              {moodboards.length} uploaded
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-6 pt-2">
          <TierSlotGroup
            slots={([["moodboard_t1", "Tier 1 — Standard"], ["moodboard_t2", "Tier 2 — Affordable luxury"], ["moodboard_t3", "Tier 3 — Luxury premium"]] as const).map(([type, label]) => ({
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
