import { createClient } from "@/lib/supabase/server";
import { FreelancerCard } from "@/components/custom/freelancer-card";
import { EmptyState } from "@/components/custom/empty-state";
import { Users } from "lucide-react";

export async function FreelancersList() {
  const supabase = await createClient();
  const { data: freelancers } = await supabase.from("profiles").select("*").eq("role", "freelancer").order("created_at", { ascending: false });

  if (!freelancers || freelancers.length === 0) {
    return <EmptyState icon={Users} title="No freelancers yet" description="Register your first freelancer to get started." />;
  }

  const { data: assignments } = await supabase.from("project_freelancers").select("project_id, freelancer_id");
  const { data: projects } = await supabase.from("projects").select("id, name");
  const projectMap = new Map((projects ?? []).map((p) => [p.id, p.name]));

  return (
    <div className="grid grid-cols-3 gap-4">
      {freelancers.map((f) => {
        const assigned = (assignments ?? []).filter((a) => a.freelancer_id === f.id).map((a) => ({ id: a.project_id, name: projectMap.get(a.project_id) ?? "Unknown" }));
        return <FreelancerCard key={f.id} freelancer={f} assignedProjects={assigned} />;
      })}
    </div>
  );
}
