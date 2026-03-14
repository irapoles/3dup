import { createClient } from "@/lib/supabase/server";
import { FreelancerCard } from "@/components/custom/freelancer-card";
import { EmptyState } from "@/components/custom/empty-state";
import { Users } from "lucide-react";
import type { Profile } from "@/types/database";

type ProjectAssignment = { project_id: string; freelancer_id: string };

export async function FreelancersList() {
  const supabase = await createClient();
  const { data: freelancersData } = await supabase.from("profiles").select("*").eq("role", "freelancer").order("created_at", { ascending: false });
  const freelancers: Profile[] = freelancersData ?? [];

  if (freelancers.length === 0) {
    return <EmptyState icon={Users} title="No freelancers yet" description="Register your first freelancer to get started." />;
  }

  const { data: assignmentsData } = await supabase.from("project_freelancers").select("project_id, freelancer_id");
  const assignments: ProjectAssignment[] = assignmentsData ?? [];
  const { data: projects } = await supabase.from("projects").select("id, name");
  const projectList: { id: string; name: string }[] = projects ?? [];
  const projectMap = new Map(projectList.map((p) => [p.id, p.name]));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {freelancers.map((f) => {
        const assigned = assignments.filter((a) => a.freelancer_id === f.id).map((a) => ({ id: a.project_id, name: projectMap.get(a.project_id) ?? "Unknown" }));
        return <FreelancerCard key={f.id} freelancer={f} assignedProjects={assigned} />;
      })}
    </div>
  );
}
