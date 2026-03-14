import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { PageTransition } from "@/components/layout/page-transition";
import { NotificationBell } from "@/components/custom/notification-bell";

export async function FreelancerShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "freelancer") redirect("/projects");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex h-screen">
      <AppSidebar role="freelancer" />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end border-b border-border px-6">
          <NotificationBell userId={user.id} initialNotifications={notifications ?? []} />
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
