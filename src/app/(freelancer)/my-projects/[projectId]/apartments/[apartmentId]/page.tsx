import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AssetThumbnail } from "@/components/custom/asset-thumbnail";
import { HighlightRenderOnLoad } from "@/components/custom/highlight-render-on-load";
import { RoomAccordions } from "@/app/(admin)/projects/[projectId]/apartments/[apartmentId]/room-accordions";
import type { ApartmentAsset, Room, RoomAsset } from "@/types/database";

export default async function FreelancerApartmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; apartmentId: string }>;
  searchParams: Promise<{ highlight?: string }>;
}) {
  const { projectId, apartmentId } = await params;
  const { highlight: highlightAssetId } = await searchParams;
  const supabase = await createClient();

  const [{ data: project }, { data: apartment }, { data: assets }, { data: rooms }, { data: roomAssets }] = await Promise.all([
    supabase.from("projects").select("name").eq("id", projectId).single(),
    supabase.from("apartments").select("*").eq("id", apartmentId).single(),
    supabase.from("apartment_assets").select("*").eq("apartment_id", apartmentId).order("created_at", { ascending: true }),
    supabase.from("rooms").select("*").eq("apartment_id", apartmentId).order("created_at", { ascending: true }),
    supabase.from("room_assets").select("*"),
  ]);

  if (!project || !apartment) notFound();

  const assetsList: ApartmentAsset[] = assets ?? [];
  const blueprints = assetsList.filter((a) => a.asset_type === "blueprint");
  const moodboards = assetsList.filter((a) => a.asset_type.startsWith("moodboard"));
  const roomList: Room[] = rooms ?? [];
  const roomAssetsList: RoomAsset[] = roomAssets ?? [];

  return (
    <>
      <PageHeader
        title={apartment.name}
        breadcrumbs={[
          { label: "My Projects", href: "/my-projects" },
          { label: project.name, href: `/my-projects/${projectId}` },
          { label: apartment.name },
        ]}
      />

      <Suspense fallback={null}>
        <HighlightRenderOnLoad />
      </Suspense>
      <Accordion type="multiple" defaultValue={[]} className="w-full space-y-2">
        <AccordionItem value="assets" className="rounded-lg border bg-card px-4 last:border-b-0">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-2">
              <span className="text-base font-semibold">Assets</span>
              <span className="text-xs text-muted-foreground">
                {blueprints.length > 0 ? `${blueprints.length} uploaded` : "No assets"}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2">
            {blueprints.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No assets yet.</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {blueprints.map((a) => (
                  <div key={a.id} className="w-[200px] shrink-0">
                    <AssetThumbnail fileName={a.file_name} fileUrl={a.file_url} fileSize={a.file_size} assetType={a.asset_type} showDelete={false} />
                  </div>
                ))}
              </div>
            )}
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
            {moodboards.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No moodboards yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {([["moodboard_t1", "Tier 1 — Standard"], ["moodboard_t2", "Tier 2 — Affordable luxury"], ["moodboard_t3", "Tier 3 — Luxury premium"]] as const).map(([type, label]) => {
                  const m = moodboards.find((a) => a.asset_type === type);
                  return (
                    <div key={type}>
                      <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</h4>
                      {m ? (
                        <AssetThumbnail fileName={m.file_name} fileUrl={m.file_url} fileSize={m.file_size} assetType={m.asset_type} showDelete={false} />
                      ) : (
                        <p className="rounded-lg border border-dashed bg-muted/30 py-6 text-center text-xs text-muted-foreground">No file</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rooms" className="rounded-lg border bg-card px-4 last:border-b-0">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-2">
              <span className="text-base font-semibold">Rooms — Upload Renders</span>
              <span className="text-xs text-muted-foreground">
                {roomList.length} total
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2">
            <RoomAccordions
              rooms={roomList}
              roomAssets={roomAssetsList}
              roomIds={roomList.map((r) => r.id)}
              highlightAssetId={highlightAssetId ?? null}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
