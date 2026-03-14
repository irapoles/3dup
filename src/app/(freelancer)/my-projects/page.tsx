import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { FreelancerProjectsList } from "./projects-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyProjectsPage() {
  return (
    <>
      <PageHeader title="My Projects" breadcrumbs={[{ label: "My Projects" }]} />
      <Suspense fallback={<div className="grid grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-[120px] rounded-lg" />))}</div>}>
        <FreelancerProjectsList />
      </Suspense>
    </>
  );
}
