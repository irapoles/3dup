import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Separator } from "@/components/ui/separator";
import { AssetThumbnail } from "@/components/custom/asset-thumbnail";
import { RoomAccordions } from "@/app/(admin)/projects/[projectId]/apartments/[apartmentId]/room-accordions";

export default async function FreelancerApartmentDetailPage({ params }: { params: Promise<{ projectId: string; apartmentId: string }> }) {
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

  const blueprints = (assets ?? []).filter((a) => a.asset_type === "blueprint");
  const moodboards = (assets ?? []).filter((a) => a.asset_type.startsWith("moodboard"));

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

      {blueprints.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-2 text-sm font-medium">Blueprint</h3>
          <div className="max-w-[250px]">
            <AssetThumbnail fileName={blueprints[0].file_name} fileUrl={blueprints[0].file_url} fileSize={blueprints[0].file_size} assetType="blueprint" showDelete={false} />
          </div>
        </section>
      )}

      {moodboards.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-2 text-sm font-medium">Moodboards</h3>
          <div className="grid grid-cols-3 gap-4">
            {moodboards.map((m) => (
              <AssetThumbnail key={m.id} fileName={m.file_name} fileUrl={m.file_url} fileSize={m.file_size} assetType={m.asset_type} showDelete={false} />
            ))}
          </div>
        </section>
      )}

      <Separator className="my-8" />
      <section>
        <h2 className="text-xl font-semibold leading-7">Rooms — Upload Renders</h2>
        <Separator className="my-4" />
        <RoomAccordions rooms={rooms ?? []} roomAssets={roomAssets ?? []} />
      </section>
    </>
  );
}
