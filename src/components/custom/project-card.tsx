import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import type { Project } from "@/types/database";

export function ProjectCard({
  project,
  apartmentCount = 0,
}: {
  project: Project;
  apartmentCount?: number;
}) {
  return (
    <Link href={`/projects/${project.id}`} className="group">
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-medium leading-6">
              {project.name}
            </CardTitle>
          </div>
          <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{apartmentCount} apartments</span>
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
