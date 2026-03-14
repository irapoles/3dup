"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/actions/auth";
import { loginSchema } from "@/lib/schemas/auth";

export function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [pending, setPending] = useState(false);

  function validateField(name: string, value: string) {
    const shape = loginSchema.shape;
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
    setServerError("");
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    if (result && !result.success) {
      setServerError(result.error);
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium">Email</Label>
        <Input
          name="email"
          type="email"
          placeholder="admin@3dup.com"
          onBlur={(e) => validateField("email", e.target.value)}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium">Password</Label>
        <Input
          name="password"
          type="password"
          onBlur={(e) => validateField("password", e.target.value)}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
