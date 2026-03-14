import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApartmentCard } from "@/components/custom/apartment-card";
import { CreateApartmentDialog } from "@/components/custom/create-apartment-dialog";
import { AssignFreelancerDialog } from "@/components/custom/assign-freelancer-dialog";
import { EmptyState } from "@/components/custom/empty-state";
import { AssignedFreelancerList } from "@/components/custom/assigned-freelancer-list";
import { Home } from "lucide-react";
import { BuildingAssetsSection } from "./building-assets-section";
import { ProjectActions } from "./project-actions";
import type { Apartment, Profile, Room } from "@/types/database";

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

  const assignments: { freelancer_id: string }[] = assignmentRows ?? [];
  const assignedIds = assignments.map((a) => a.freelancer_id);
  const freelancerList: Profile[] = allFreelancers ?? [];
  const assignedFreelancers = freelancerList.filter((f) => assignedIds.includes(f.id));

  const roomList: Room[] = rooms ?? [];
  const apartmentRoomsMap = new Map<string, Room[]>();
  roomList.forEach((r) => {
    const list = apartmentRoomsMap.get(r.apartment_id) ?? [];
    list.push(r);
    apartmentRoomsMap.set(r.apartment_id, list);
  });

  const apartmentList: Apartment[] = apartments ?? [];

  return (
    <>
      <PageHeader
        title={project.name}
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: project.name }]}
        actions={<ProjectActions projectId={project.id} project={project} />}
      />

      <Accordion
        type="multiple"
        defaultValue={[]}
        className="w-full space-y-2"
      >
        <AccordionItem value="apartments" className="rounded-lg border bg-card px-4">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-2">
              <span className="text-base font-semibold">Apartments</span>
              <span className="text-xs text-muted-foreground">
                {apartmentList.length} total
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2">
            <div className="mb-4 flex items-center justify-end">
              <CreateApartmentDialog projectId={projectId} />
            </div>
            {apartmentList.length === 0 ? (
              <EmptyState icon={Home} title="No apartments" description="Add apartments to this project." />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {apartmentList.map((apt) => {
                  const aptRooms = apartmentRoomsMap.get(apt.id) ?? [];
                  return (
                    <ApartmentCard
                      key={apt.id}
                      apartment={apt}
                      rooms={aptRooms}
                      href={`/projects/${projectId}/apartments/${apt.id}`}
                    />
                  );
                })}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="building-assets" className="rounded-lg border bg-card px-4">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-2">
              <span className="text-base font-semibold">Building Assets</span>
              <span className="text-xs text-muted-foreground">Logo, images, video</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2">
            <BuildingAssetsSection projectId={project.id} assets={assets ?? []} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="freelancers" className="rounded-lg border bg-card px-4">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between pr-2">
              <span className="text-base font-semibold">Freelancers</span>
              <span className="text-xs text-muted-foreground">
                {assignedFreelancers.length} assigned
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2">
            <div className="mb-4 flex items-center justify-end">
              <AssignFreelancerDialog
                projectId={project.id}
                allFreelancers={freelancerList}
                assignedIds={assignedIds}
              />
            </div>
            {assignedFreelancers.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No freelancers assigned.</p>
            ) : (
              <AssignedFreelancerList projectId={project.id} assigned={assignedFreelancers} />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
