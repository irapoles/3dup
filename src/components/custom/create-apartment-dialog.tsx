"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { createApartmentAction } from "@/lib/actions/apartments";
import { toast } from "sonner";

export function CreateApartmentDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [rooms, setRooms] = useState<string[]>([""]);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const validRooms = rooms.filter((r) => r.trim());
    formData.set("rooms", JSON.stringify(validRooms));
    const result = await createApartmentAction(projectId, formData);
    if (result.success) {
      toast.success("Apartment created");
      setOpen(false);
      setRooms([""]);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setPending(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Add Apartment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>Create Apartment</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Name <span className="text-destructive">*</span></Label>
            <Input name="name" placeholder="e.g., Apartment A" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Description</Label>
            <Textarea name="description" placeholder="Optional description" rows={2} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Rooms <span className="text-destructive">*</span></Label>
            {rooms.map((room, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={room}
                  onChange={(e) => {
                    const updated = [...rooms];
                    updated[i] = e.target.value;
                    setRooms(updated);
                  }}
                  placeholder={`Room ${i + 1}`}
                />
                {rooms.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setRooms(rooms.filter((_, j) => j !== i))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={() => setRooms([...rooms, ""])}
            >
              <Plus className="mr-1 h-3 w-3" />Add Room
            </Button>
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
