import { Suspense } from "react";
import { FreelancerShell } from "./freelancer-shell";

export default function FreelancerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <FreelancerShell>{children}</FreelancerShell>
    </Suspense>
  );
}
