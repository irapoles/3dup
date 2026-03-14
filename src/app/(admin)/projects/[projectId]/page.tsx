import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Separator } from "@/components/ui/separator";
import { ApartmentCard } from "@/components/custom/apartment-card";
import { CreateApartmentDialog } from "@/components/custom/create-apartment-dialog";
import { AssignFreelancerDialog } from "@/components/custom/assign-freelancer-dialog";
import { EmptyState } from "@/components/custom/empty-state";
import { Badge } from "@/components/ui/badge";
import { Home } from "lucide-react";
import { BuildingAssetsSection } from "./building-assets-section";
import { ProjectActions } from "./project-actions";

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const supabase = await createClient();

  const [
    { data: project },
    { data: assets },
    { data: apartments },
    { data: rooms },
    { data: assignmentRows },
    { data: allFreelancers },
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).single(),
    supabase.from("project_assets").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
    supabase.from("apartments").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
    supabase.from("rooms").select("*"),
    supabase.from("project_freelancers").select("freelancer_id").eq("project_id", projectId),
    supabase.from("profiles").select("*").eq("role", "freelancer"),
  ]);

  if (!project) notFound();

  const assignedIds = (assignmentRows ?? []).map((a) => a.freelancer_id);
  const assignedFreelancers = (allFreelancers ?? []).filter((f) => assignedIds.includes(f.id));

  const apartmentRoomsMap = new Map<string, typeof rooms>();
  (rooms ?? []).forEach((r) => {
    const list = apartmentRoomsMap.get(r.apartment_id) ?? [];
    list.push(r);
    apartmentRoomsMap.set(r.apartment_id, list);
  });

  return (
    <>
      <PageHeader
        title={project.name}
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: project.name }]}
        actions={<ProjectActions projectId={project.id} project={project} />}
      />

      <BuildingAssetsSection projectId={project.id} assets={assets ?? []} />

      <Separator className="my-8" />

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-7">Freelancers</h2>
          <AssignFreelancerDialog projectId={project.id} allFreelancers={allFreelancers ?? []} assignedIds={assignedIds} />
        </div>
        <Separator className="my-4" />
        {assignedFreelancers.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No freelancers assigned.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {assignedFreelancers.map((f) => (<Badge key={f.id} variant="secondary" className="text-sm font-normal">{f.name} — {f.email}</Badge>))}
          </div>
        )}
      </section>

      <Separator className="my-8" />

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-7">Apartments</h2>
          <CreateApartmentDialog projectId={projectId} />
        </div>
        <Separator className="my-4" />
        {!apartments || apartments.length === 0 ? (
          <EmptyState icon={Home} title="No apartments" description="Add apartments to this project." />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {apartments.map((apt) => {
              const aptRooms = apartmentRoomsMap.get(apt.id) ?? [];
              return <ApartmentCard key={apt.id} apartment={apt} rooms={aptRooms} href={`/projects/${projectId}/apartments/${apt.id}`} />;
            })}
          </div>
        )}
      </section>
    </>
  );
}
