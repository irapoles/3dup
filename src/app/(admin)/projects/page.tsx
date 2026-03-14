import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { CreateProjectDialog } from "@/components/custom/create-project-dialog";
import { ProjectsList } from "./projects-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="Your Projects" breadcrumbs={[{ label: "All projects" }]} actions={<CreateProjectDialog />} />
      <Suspense fallback={<div className="grid grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => (<Skeleton key={i} className="h-[120px] rounded-lg" />))}</div>}>
        <ProjectsList />
      </Suspense>
    </>
  );
}
