"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createFreelancerAction } from "@/lib/actions/freelancers";
import { createFreelancerSchema } from "@/lib/schemas/freelancer";
import { toast } from "sonner";

export function CreateFreelancerDialog() {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const router = useRouter();

  function validateField(name: string, value: string) {
    const shape = createFreelancerSchema.shape;
    const field = shape[name as keyof typeof shape];
    if (!field) return;
    const result = field.safeParse(value);
    if (!result.success) {
      setErrors((prev) => ({ ...prev, [name]: result.error.issues[0]?.message ?? "Invalid" }));
    } else {
      setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: (formData.get("phone") as string) || undefined,
      website: (formData.get("website") as string) || undefined,
      price: (formData.get("price") as string) || undefined,
    };

    const parsed = createFreelancerSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      setPending(false);
      return;
    }

    try {
      const result = await createFreelancerAction(formData);
      if (result?.success) {
        toast.success("Freelancer created");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result?.error ?? "Failed to create freelancer");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create freelancer");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" />Add Freelancer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>Register Freelancer</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Name <span className="text-destructive">*</span></Label>
            <Input name="name" placeholder="Full name" onBlur={(e) => validateField("name", e.target.value)} />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Email <span className="text-destructive">*</span></Label>
            <Input name="email" type="email" placeholder="email@example.com" onBlur={(e) => validateField("email", e.target.value)} />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Password <span className="text-destructive">*</span></Label>
            <Input name="password" type="password" placeholder="Min 6 characters" onBlur={(e) => validateField("password", e.target.value)} />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Phone</Label>
            <Input name="phone" placeholder="+1234567890" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Website</Label>
            <Input name="website" placeholder="https://portfolio.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Price</Label>
            <Input name="price" placeholder="e.g., $50/hr or Fixed $500" />
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
