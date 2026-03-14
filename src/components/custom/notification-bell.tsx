"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { markNotificationReadAction } from "@/lib/actions/room-assets";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/database";

export function NotificationBell({ userId, initialNotifications }: { userId: string; initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, (payload) => {
        setNotifications((prev) => [payload.new as Notification, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  async function handleMarkRead(id: string) {
    await markNotificationReadAction(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b px-4 py-3"><h3 className="text-sm font-medium">Notifications</h3></div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">No notifications yet</p>
          ) : (
            notifications.slice(0, 20).map((n) => (
              <button
                key={n.id}
                onClick={() => !n.read && handleMarkRead(n.id)}
                className={cn("flex w-full flex-col gap-1 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/50", !n.read && "bg-accent/30")}
              >
                <span className="text-xs font-medium">{n.title}</span>
                {n.body && <span className="text-xs text-muted-foreground">{n.body}</span>}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
