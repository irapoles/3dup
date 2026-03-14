import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApartmentAssetsSection } from "./apartment-assets-section";
import { RoomAccordions } from "./room-accordions";
import { ApartmentActions } from "./apartment-actions";
import type { Room } from "@/types/database";

export default async function ApartmentDetailPage({ params }: { params: Promise<{ projectId: string; apartmentId: string }> }) {
  const { projectId, apartmentId } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: apartment }, { data: assets }, { data: rooms }, { data: roomAssets }] = await Promise.all([
    supabase.from("projects").select("name").eq("id", projectId).single(),
    supabase.from("apartments").select("*").eq("id", apartmentId).single(),
    supabase.from("apartment_assets").select("*").eq("apartment_id", apartmentId).order("created_at", { ascending: true }),
    supabase.from("rooms").select("*").eq("apartment_id", apartmentId).order("created_at", { ascending: true }),
    supabase.from("room_assets").select("*"),
  ]);

  if (!project || !apartment) notFound();

  return (
    <>
      <PageHeader
        title={apartment.name}
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: project.name, href: `/projects/${projectId}` }, { label: apartment.name }]}
        actions={<ApartmentActions apartmentId={apartment.id} projectId={projectId} apartment={apartment} />}
      />
      {apartment.description && <p className="mb-6 text-sm text-muted-foreground">{apartment.description}</p>}
      <ApartmentAssetsSection apartmentId={apartment.id} assets={assets ?? []} />
      <Accordion type="multiple" defaultValue={[]} className="mt-4 w-full space-y-2">
        <AccordionItem value="rooms" className="rounded-lg border bg-card px-4 last:border-b-0">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-2">
              <span className="text-base font-semibold">Rooms</span>
              <span className="text-xs text-muted-foreground">
                {(rooms ?? []).length} total
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2">
            <RoomAccordions
              rooms={rooms ?? []}
              roomAssets={roomAssets ?? []}
              showReview
              roomIds={((rooms ?? []) as Room[]).map((r) => r.id)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
