import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Separator } from "@/components/ui/separator";
import { AssetThumbnail } from "@/components/custom/asset-thumbnail";
import { ApartmentCard } from "@/components/custom/apartment-card";
import { EmptyState } from "@/components/custom/empty-state";
import { Home } from "lucide-react";

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

  const apartmentRoomsMap = new Map<string, typeof rooms>();
  (rooms ?? []).forEach((r) => {
    const list = apartmentRoomsMap.get(r.apartment_id) ?? [];
    list.push(r);
    apartmentRoomsMap.set(r.apartment_id, list);
  });

  return (
    <>
      <PageHeader title={project.name} breadcrumbs={[{ label: "My Projects", href: "/my-projects" }, { label: project.name }]} />

      {(assets ?? []).length > 0 && (
        <>
          <section>
            <h2 className="text-xl font-semibold leading-7">Building Assets</h2>
            <Separator className="my-4" />
            <div className="grid grid-cols-4 gap-4">
              {(assets ?? []).map((a) => (
                <AssetThumbnail key={a.id} fileName={a.file_name} fileUrl={a.file_url} fileSize={a.file_size} assetType={a.asset_type} showDelete={false} />
              ))}
            </div>
          </section>
          <Separator className="my-8" />
        </>
      )}

      <section>
        <h2 className="text-xl font-semibold leading-7">Apartments</h2>
        <Separator className="my-4" />
        {!apartments || apartments.length === 0 ? (
          <EmptyState icon={Home} title="No apartments" description="No apartments in this project." />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {apartments.map((apt) => {
              const aptRooms = apartmentRoomsMap.get(apt.id) ?? [];
              return <ApartmentCard key={apt.id} apartment={apt} rooms={aptRooms} href={`/my-projects/${projectId}/apartments/${apt.id}`} />;
            })}
          </div>
        )}
      </section>
    </>
  );
}
