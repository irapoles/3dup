"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { unassignFreelancerAction } from "@/lib/actions/freelancers";
import { toast } from "sonner";
import type { Profile } from "@/types/database";

type Props = {
  projectId: string;
  assigned: Profile[];
};

export function AssignedFreelancerList({ projectId, assigned }: Props) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleRemove(freelancerId: string) {
    setPendingId(freelancerId);
    const result = await unassignFreelancerAction(projectId, freelancerId);
    if (result.success) {
      toast.success("Freelancer removed from project");
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setPendingId(null);
  }

  if (assigned.length === 0) return null;

  return (
    <div className="space-y-2">
      {assigned.map((f) => (
        <div
          key={f.id}
          className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
        >
          <div>
            <span className="text-sm font-medium">{f.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">{f.email}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={pendingId === f.id}
            onClick={() => handleRemove(f.id)}
          >
            {pendingId === f.id ? "..." : "Remove freelancer from project"}
          </Button>
        </div>
      ))}
    </div>
  );
}
