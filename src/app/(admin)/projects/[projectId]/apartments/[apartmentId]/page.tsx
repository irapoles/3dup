import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Separator } from "@/components/ui/separator";
import { ApartmentAssetsSection } from "./apartment-assets-section";
import { RoomAccordions } from "./room-accordions";
import { ApartmentActions } from "./apartment-actions";

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
      <Separator className="my-8" />
      <section>
        <h2 className="text-xl font-semibold leading-7">Rooms</h2>
        <Separator className="my-4" />
        <RoomAccordions rooms={rooms ?? []} roomAssets={roomAssets ?? []} showReview />
      </section>
    </>
  );
}
