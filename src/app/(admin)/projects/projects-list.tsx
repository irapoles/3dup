import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/custom/project-card";
import { EmptyState } from "@/components/custom/empty-state";
import { FolderOpen } from "lucide-react";
import type { Project } from "@/types/database";

export async function ProjectsList() {
  const supabase = await createClient();
  const { data: projectsData } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  const projects: Project[] = projectsData ?? [];
  const { data: apartmentsData } = await supabase.from("apartments").select("project_id");
  const apartments: { project_id: string }[] = apartmentsData ?? [];

  if (projects.length === 0) {
    return <EmptyState icon={FolderOpen} title="No projects yet" description="Create your first project to get started." />;
  }

  const countMap = new Map<string, number>();
  apartments.forEach((a) => countMap.set(a.project_id, (countMap.get(a.project_id) ?? 0) + 1));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (<ProjectCard key={p.id} project={p} apartmentCount={countMap.get(p.id) ?? 0} />))}
    </div>
  );
}
