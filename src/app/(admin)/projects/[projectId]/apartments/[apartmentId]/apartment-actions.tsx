"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateApartmentAction, deleteApartmentAction } from "@/lib/actions/apartments";
import { toast } from "sonner";
import type { Apartment } from "@/types/database";

export function ApartmentActions({ apartmentId, projectId, apartment }: { apartmentId: string; projectId: string; apartment: Apartment }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateApartmentAction(apartmentId, formData);
    if (result.success) { toast.success("Apartment updated"); setEditOpen(false); router.refresh(); }
    else toast.error(result.error);
    setPending(false);
  }

  async function handleDelete() {
    setPending(true);
    await deleteApartmentAction(apartmentId, projectId);
    setPending(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent><DialogHeader><DialogTitle>Edit Apartment</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5"><Label>Name</Label><Input name="name" defaultValue={apartment.name} /></div>
            <div className="flex flex-col gap-1.5"><Label>Description</Label><Textarea name="description" defaultValue={apartment.description ?? ""} rows={2} /></div>
            <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button><Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent><DialogHeader><DialogTitle>Delete Apartment</DialogTitle><DialogDescription>This will permanently delete &ldquo;{apartment.name}&rdquo;.</DialogDescription></DialogHeader>
          <div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete} disabled={pending}>{pending ? "Deleting..." : "Delete"}</Button></div>
        </DialogContent>
      </Dialog>
    </>
  );
}
