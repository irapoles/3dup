"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Globe, Phone, Mail, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateFreelancerAction, deleteFreelancerAction } from "@/lib/actions/freelancers";
import { toast } from "sonner";
import type { Profile } from "@/types/database";

type FreelancerCardProps = {
  freelancer: Profile;
  assignedProjects?: { id: string; name: string }[];
};

export function FreelancerCard({ freelancer, assignedProjects = [] }: FreelancerCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateFreelancerAction(freelancer.id, formData);
    if (result.success) {
      toast.success("Freelancer updated");
      setEditOpen(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setPending(false);
  }

  async function handleDelete() {
    setPending(true);
    try {
      const result = await deleteFreelancerAction(freelancer.id);
      if (result?.success) {
        toast.success("Freelancer deleted");
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(result?.error ?? "Failed to delete freelancer");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete freelancer");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-base font-medium">{freelancer.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{freelancer.email}</div>
          {freelancer.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{freelancer.phone}</div>}
          {freelancer.website && <div className="flex items-center gap-2 text-muted-foreground"><Globe className="h-3.5 w-3.5" /><a href={freelancer.website} target="_blank" rel="noreferrer" className="hover:underline">{freelancer.website.replace(/^https?:\/\//, "")}</a></div>}
          {freelancer.price && <div className="flex items-center gap-2 text-muted-foreground"><DollarSign className="h-3.5 w-3.5" />{freelancer.price}</div>}
          {assignedProjects.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {assignedProjects.map((p) => (<Badge key={p.id} variant="secondary" className="text-xs font-normal">{p.name}</Badge>))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle>Edit Freelancer</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Name</Label><Input name="name" defaultValue={freelancer.name} /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Email</Label><Input name="email" type="email" defaultValue={freelancer.email} /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Phone</Label><Input name="phone" defaultValue={freelancer.phone ?? ""} /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Website</Label><Input name="website" defaultValue={freelancer.website ?? ""} /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Price</Label><Input name="price" defaultValue={freelancer.price ?? ""} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Freelancer</DialogTitle>
            <DialogDescription>This will permanently delete {freelancer.name}&apos;s account.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>{pending ? "Deleting..." : "Delete"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
