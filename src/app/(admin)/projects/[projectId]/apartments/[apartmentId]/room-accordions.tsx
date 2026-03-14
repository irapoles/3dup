"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TierSlotGroup } from "@/components/custom/tier-slot-group";
import { createRoomAssetAction, deleteRoomAssetAction, setRoomAssetStatusAction, type RoomAssetStatus } from "@/lib/actions/room-assets";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/schemas/file";
import { Check, CircleDot, ListTodo } from "lucide-react";
import { toast } from "sonner";
import type { Room, RoomAsset } from "@/types/database";

const STATUS_LABEL: Record<RoomAssetStatus, string> = { to_do: "To do", in_review: "In review", approved: "Approved" };
const STATUS_VARIANTS: Record<RoomAssetStatus, "secondary" | "default" | "outline"> = {
  to_do: "secondary",
  in_review: "outline",
  approved: "default",
};

function RenderReviewButtons({ asset }: { asset: RoomAsset }) {
  const router = useRouter();
  const setStatus = useCallback(async (status: RoomAssetStatus) => {
    const result = await setRoomAssetStatusAction(asset.id, status);
    if (result.success) { toast.success(STATUS_LABEL[status]); router.refresh(); }
    else toast.error(result.error);
  }, [asset.id, router]);

  return (
    <div className="flex items-center gap-1.5">
      <Badge variant={STATUS_VARIANTS[asset.status]} className="text-[10px]">{STATUS_LABEL[asset.status]}</Badge>
      <div className="flex gap-0.5">
        {asset.status === "to_do" && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setStatus("in_review")} title="Mark in review"><CircleDot className="h-3 w-3" /></Button>
        )}
        {(asset.status === "to_do" || asset.status === "in_review") && (
          <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-600" onClick={() => setStatus("approved")} title="Approve"><Check className="h-3 w-3" /></Button>
        )}
        {asset.status === "in_review" && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setStatus("to_do")} title="Back to to do"><ListTodo className="h-3 w-3" /></Button>
        )}
      </div>
    </div>
  );
}

export function RoomAccordions({
  rooms,
  roomAssets: initialRoomAssets,
  readOnly = false,
  showReview = false,
  roomIds = [],
  highlightAssetId = null,
}: {
  rooms: Room[];
  roomAssets: RoomAsset[];
  readOnly?: boolean;
  showReview?: boolean;
  roomIds?: string[];
  highlightAssetId?: string | null;
}) {
  const [roomAssets, setRoomAssets] = useState<RoomAsset[]>(initialRoomAssets);

  useEffect(() => {
    setRoomAssets(initialRoomAssets);
  }, [initialRoomAssets]);

  useEffect(() => {
    if (roomIds.length === 0) return;
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const channel = supabase
      .channel("room_assets_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "room_assets" }, (payload) => {
        const row = payload.new as RoomAsset;
        if (!roomIds.includes(row.room_id)) return;
        setRoomAssets((prev) => {
          const idx = prev.findIndex((a) => a.id === row.id);
          if (payload.eventType === "DELETE") return prev.filter((a) => a.id !== (payload.old as { id: string }).id);
          if (idx >= 0) return prev.map((a) => (a.id === row.id ? row : a));
          return [...prev, row];
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomIds]);

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
                    assetId: existing?.id,
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
