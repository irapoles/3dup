"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from "lucide-react";
import { assignFreelancerAction, reassignFreelancerAction, unassignFreelancerAction } from "@/lib/actions/freelancers";
import { toast } from "sonner";
import type { Profile } from "@/types/database";

type Props = {
  projectId: string;
  allFreelancers: Profile[];
  assignedIds: string[];
};

export function AssignFreelancerDialog({ projectId, allFreelancers, assignedIds }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [replace, setReplace] = useState<Record<string, string>>({});
  const router = useRouter();

  async function handleAssign(freelancerId: string) {
    setPending(freelancerId);
    const result = await assignFreelancerAction(projectId, freelancerId);
    if (result.success) { toast.success("Freelancer assigned"); router.refresh(); }
    else toast.error(result.error);
    setPending(null);
  }

  async function handleUnassign(freelancerId: string) {
    setPending(freelancerId);
    const result = await unassignFreelancerAction(projectId, freelancerId);
    if (result.success) { toast.success("Freelancer removed"); router.refresh(); }
    else toast.error(result.error);
    setPending(null);
  }

  async function handleReassign(fromFreelancerId: string) {
    const toFreelancerId = replace[fromFreelancerId];
    if (!toFreelancerId) return;
    setPending(fromFreelancerId);
    const result = await reassignFreelancerAction({ projectId, fromFreelancerId, toFreelancerId });
    if (result.success) {
      toast.success("Freelancer reassigned");
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setPending(null);
  }

  const available = allFreelancers.filter((f) => !assignedIds.includes(f.id));
  const assigned = allFreelancers.filter((f) => assignedIds.includes(f.id));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><UserPlus className="mr-2 h-4 w-4" />Assign Freelancer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>Manage Freelancers</DialogTitle></DialogHeader>
        {assigned.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Assigned</p>
            <div className="space-y-2">
              {assigned.map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                  <div><span className="text-sm font-medium">{f.name}</span><span className="ml-2 text-xs text-muted-foreground">{f.email}</span></div>
                  <div className="flex items-center gap-2">
                    {available.length > 0 && (
                      <div className="flex items-center gap-2">
                        <select
                          className="h-8 rounded-md border bg-background px-2 text-xs"
                          value={replace[f.id] ?? ""}
                          onChange={(e) => setReplace((p) => ({ ...p, [f.id]: e.target.value }))}
                          disabled={pending === f.id}
                        >
                          <option value="">Replace with…</option>
                          {available.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.email})
                            </option>
                          ))}
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pending === f.id || !replace[f.id]}
                          onClick={() => handleReassign(f.id)}
                        >
                          {pending === f.id ? "..." : "Reassign"}
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={pending === f.id}
                      onClick={() => handleUnassign(f.id)}
                      title="Remove from project"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {available.length > 0 ? (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Available</p>
            <div className="space-y-2">
              {available.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div><span className="text-sm font-medium">{f.name}</span><span className="ml-2 text-xs text-muted-foreground">{f.email}</span></div>
                  <Button variant="outline" size="sm" disabled={pending === f.id} onClick={() => handleAssign(f.id)}>{pending === f.id ? "..." : "Assign"}</Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {allFreelancers.length === 0 ? "No freelancers registered." : "All freelancers assigned."}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
