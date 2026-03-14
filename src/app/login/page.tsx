import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "@/components/custom/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex justify-center">
            <Image src="/logo.svg" alt="3DUp" width={180} height={75} className="h-12 w-auto object-contain" priority />
          </div>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
