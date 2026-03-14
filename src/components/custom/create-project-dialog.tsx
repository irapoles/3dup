"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createProjectAction } from "@/lib/actions/projects";
import { toast } from "sonner";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await createProjectAction(formData);
    if (result.success) {
      toast.success("Project created");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setPending(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" />Add Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>Create Project</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Name <span className="text-destructive">*</span></Label>
            <Input name="name" placeholder="Project name" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Description</Label>
            <Textarea name="description" placeholder="Optional description" rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Creating..." : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
