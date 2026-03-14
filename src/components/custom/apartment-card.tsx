import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home } from "lucide-react";
import type { Apartment, Room } from "@/types/database";

export function ApartmentCard({
  apartment,
  rooms,
  href,
  renderCount = 0,
  totalRenderSlots = 0,
}: {
  apartment: Apartment;
  rooms: Room[];
  href: string;
  renderCount?: number;
  totalRenderSlots?: number;
}) {
  const statusColor =
    renderCount === 0
      ? "bg-muted-foreground/30"
      : renderCount >= totalRenderSlots
        ? "bg-emerald-500"
        : "bg-amber-500";

  return (
    <Link href={href} className="group">
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-medium leading-6">
              {apartment.name}
            </CardTitle>
          </div>
          <span className={`mt-0.5 h-2.5 w-2.5 rounded-full ${statusColor}`} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs font-normal">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
            </Badge>
            {totalRenderSlots > 0 && (
              <span className="text-xs text-muted-foreground">
                {renderCount}/{totalRenderSlots} renders
              </span>
            )}
          </div>
          {rooms.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {rooms.map((room) => (
                <span
                  key={room.id}
                  className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {room.name}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
