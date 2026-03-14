"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FolderOpen, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth";

type NavItem = { label: string; href: string; icon: React.ElementType };

const adminNav: NavItem[] = [
  { label: "Projects", href: "/projects", icon: FolderOpen },
  { label: "Freelancers", href: "/freelancers", icon: Users },
];

const freelancerNav: NavItem[] = [
  { label: "My Projects", href: "/my-projects", icon: FolderOpen },
];

export function AppSidebar({ role }: { role: "admin" | "freelancer" }) {
  const pathname = usePathname();
  const navItems = role === "admin" ? adminNav : freelancerNav;

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-card">
      <Link href={role === "admin" ? "/projects" : "/my-projects"} className="flex h-14 items-center px-5">
        <Image src="/logo.svg" alt="3DUp" width={120} height={50} className="h-8 w-auto object-contain object-left" priority />
      </Link>
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border px-3 py-3">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
