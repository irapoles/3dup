import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { CreateFreelancerDialog } from "@/components/custom/create-freelancer-dialog";
import { FreelancersList } from "./freelancers-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function FreelancersPage() {
  return (
    <>
      <PageHeader title="Freelancers" breadcrumbs={[{ label: "Freelancers" }]} actions={<CreateFreelancerDialog />} />
      <Suspense fallback={<div className="grid grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-[180px] rounded-lg" />))}</div>}>
        <FreelancersList />
      </Suspense>
    </>
  );
}
