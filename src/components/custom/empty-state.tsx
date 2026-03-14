import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="mb-4 h-12 w-12 text-muted-foreground/40" />
      <h3 className="mb-1 text-base font-medium">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
