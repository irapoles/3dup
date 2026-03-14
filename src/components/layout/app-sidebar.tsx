"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FolderOpen, Users, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavItem = { label: string; href: string; icon: React.ElementType };

const adminNav: NavItem[] = [
  { label: "Projects", href: "/projects", icon: FolderOpen },
  { label: "Freelancers", href: "/freelancers", icon: Users },
];

const freelancerNav: NavItem[] = [
  { label: "My Projects", href: "/my-projects", icon: FolderOpen },
];

function NavLinks({
  role,
  pathname,
  onNavigate,
}: {
  role: "admin" | "freelancer";
  pathname: string;
  onNavigate?: () => void;
}) {
  const navItems = role === "admin" ? adminNav : freelancerNav;
  const homeHref = role === "admin" ? "/projects" : "/my-projects";

  return (
    <>
      <Link
        href={homeHref}
        onClick={onNavigate}
        className="flex h-14 items-center px-5"
      >
        <Image
          src="/logo.svg"
          alt="3DUp"
          width={120}
          height={50}
          className="h-8 w-auto object-contain object-left"
          priority
        />
      </Link>
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border px-3 py-3">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex min-h-[44px] w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sign Out
          </button>
        </form>
      </div>
    </>
  );
}

export function AppSidebar({ role }: { role: "admin" | "freelancer" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: top bar with menu trigger + logo */}
      <div className="flex h-14 w-full shrink-0 items-center gap-2 border-b border-border bg-card px-3 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-11 min-h-[44px] min-w-[44px]"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex w-[280px] flex-col gap-0 p-0"
            showCloseButton={true}
          >
            <NavLinks role={role} pathname={pathname} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <Link
          href={role === "admin" ? "/projects" : "/my-projects"}
          className="flex items-center"
        >
          <Image
            src="/logo.svg"
            alt="3DUp"
            width={120}
            height={50}
            className="h-8 w-auto object-contain object-left"
          />
        </Link>
      </div>

      {/* Desktop: sidebar */}
      <aside className="hidden h-screen w-60 flex-col border-r border-border bg-card lg:flex">
        <NavLinks role={role} pathname={pathname} />
      </aside>
    </>
  );
}
