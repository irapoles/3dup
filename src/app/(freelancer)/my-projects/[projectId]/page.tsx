import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AssetThumbnail } from "@/components/custom/asset-thumbnail";
import { ApartmentCard } from "@/components/custom/apartment-card";
import { EmptyState } from "@/components/custom/empty-state";
import { Home } from "lucide-react";
import type { Apartment, ProjectAsset, Room } from "@/types/database";

export default async function FreelancerProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: assets }, { data: apartments }, { data: rooms }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).single(),
    supabase.from("project_assets").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
    supabase.from("apartments").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
    supabase.from("rooms").select("*"),
  ]);

  if (!project) notFound();

  const roomList: Room[] = rooms ?? [];
  const apartmentRoomsMap = new Map<string, Room[]>();
  roomList.forEach((r) => {
    const list = apartmentRoomsMap.get(r.apartment_id) ?? [];
    list.push(r);
    apartmentRoomsMap.set(r.apartment_id, list);
  });

  const assetsList: ProjectAsset[] = assets ?? [];
  const apartmentList: Apartment[] = apartments ?? [];

  return (
    <>
      <PageHeader title={project.name} breadcrumbs={[{ label: "My Projects", href: "/my-projects" }, { label: project.name }]} />

      <Accordion type="multiple" defaultValue={[]} className="w-full space-y-2">
        <AccordionItem value="building-assets" className="rounded-lg border bg-card px-4 last:border-b-0">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-2">
              <span className="text-base font-semibold">Building Assets</span>
              <span className="text-xs text-muted-foreground">
                {assetsList.length > 0 ? "Logo, images, video" : "No assets"}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2">
            {assetsList.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No building assets yet.</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {assetsList.map((a) => (
                  <AssetThumbnail key={a.id} fileName={a.file_name} fileUrl={a.file_url} fileSize={a.file_size} assetType={a.asset_type} showDelete={false} />
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="apartments" className="rounded-lg border bg-card px-4 last:border-b-0">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-2">
              <span className="text-base font-semibold">Apartments</span>
              <span className="text-xs text-muted-foreground">
                {apartmentList.length} total
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2">
            {apartmentList.length === 0 ? (
              <EmptyState icon={Home} title="No apartments" description="No apartments in this project." />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {apartmentList.map((apt) => {
                  const aptRooms = apartmentRoomsMap.get(apt.id) ?? [];
                  return <ApartmentCard key={apt.id} apartment={apt} rooms={aptRooms} href={`/my-projects/${projectId}/apartments/${apt.id}`} />;
                })}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
