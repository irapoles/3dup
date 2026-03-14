import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/custom/empty-state";
import { FolderOpen } from "lucide-react";
import Link from "next/link";

export async function FreelancerProjectsList() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: assignments } = await supabase
    .from("project_freelancers")
    .select("project_id")
    .eq("freelancer_id", user.id);

  if (!assignments || assignments.length === 0) {
    return <EmptyState icon={FolderOpen} title="No assigned projects" description="You will see projects here once an admin assigns you." />;
  }

  const projectIds = assignments.map((a) => a.project_id);
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .in("id", projectIds)
    .order("created_at", { ascending: false });

  if (!projects || projects.length === 0) {
    return <EmptyState icon={FolderOpen} title="No projects found" description="Assigned projects may have been deleted." />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((project) => (
        <Link key={project.id} href={`/my-projects/${project.id}`} className="group">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base font-medium leading-6">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-xs text-muted-foreground">{new Date(project.created_at).toLocaleDateString()}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
