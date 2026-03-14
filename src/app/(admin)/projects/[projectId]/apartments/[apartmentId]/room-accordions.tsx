"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TierSlotGroup } from "@/components/custom/tier-slot-group";
import { createRoomAssetAction, deleteRoomAssetAction, reviewRoomAssetAction } from "@/lib/actions/room-assets";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/schemas/file";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import type { Room, RoomAsset } from "@/types/database";

function RenderReviewButtons({ asset }: { asset: RoomAsset }) {
  const router = useRouter();
  const handleReview = useCallback(async (status: "approved" | "rejected") => {
    const result = await reviewRoomAssetAction(asset.id, status);
    if (result.success) { toast.success(`Render ${status}`); router.refresh(); }
    else toast.error(result.error);
  }, [asset.id, router]);

  if (asset.status !== "pending") {
    return <Badge variant={asset.status === "approved" ? "default" : "destructive"} className="text-[10px]">{asset.status}</Badge>;
  }
  return (
    <div className="flex gap-1">
      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleReview("approved")} title="Approve"><Check className="h-3 w-3 text-emerald-600" /></Button>
      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleReview("rejected")} title="Reject"><X className="h-3 w-3 text-destructive" /></Button>
    </div>
  );
}

export function RoomAccordions({ rooms, roomAssets, readOnly = false, showReview = false }: { rooms: Room[]; roomAssets: RoomAsset[]; readOnly?: boolean; showReview?: boolean }) {
  if (rooms.length === 0) return <p className="py-8 text-center text-sm text-muted-foreground">No rooms defined.</p>;

  return (
    <Accordion type="multiple" className="w-full">
      {rooms.map((room) => {
        const assets = roomAssets.filter((a) => a.room_id === room.id);
        return (
          <AccordionItem key={room.id} value={room.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{room.name}</span>
                <Badge variant={assets.length === 3 ? "default" : "secondary"} className="text-xs font-normal">{assets.length}/3 Renders</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {showReview && assets.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {assets.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 rounded border px-2 py-1">
                      <span className="text-xs text-muted-foreground">{a.asset_type.replace("render_t", "T")}</span>
                      <RenderReviewButtons asset={a} />
                    </div>
                  ))}
                </div>
              )}
              <TierSlotGroup
                slots={(["render_t1", "render_t2", "render_t3"] as const).map((type, i) => {
                  const existing = assets.find((a) => a.asset_type === type);
                  return {
                    label: `Tier ${i + 1}`,
                    storageBucket: "room-assets",
                    storagePath: `${room.id}/${type}`,
                    existingAsset: existing ? { id: existing.id, file_url: existing.file_url, file_name: existing.file_name, file_size: existing.file_size, asset_type: type } : undefined,
                    onUploaded: async (fileUrl: string, fileName: string, fileSize: number) => { await createRoomAssetAction({ roomId: room.id, fileUrl, fileName, fileSize, assetType: type }); },
                    onDeleted: async (assetId: string) => { await deleteRoomAssetAction(assetId); },
                    accept: ACCEPTED_IMAGE_TYPES,
                    showDelete: !readOnly,
                  };
                })}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
