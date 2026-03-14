import { BreadcrumbNav } from "./breadcrumb-nav";

type PageHeaderProps = {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
};

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-2">
          <BreadcrumbNav segments={breadcrumbs} />
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-8 text-foreground">
          {title}
        </h1>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}
