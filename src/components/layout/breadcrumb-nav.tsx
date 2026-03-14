"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

type Segment = { label: string; href?: string };

export function BreadcrumbNav({ segments }: { segments: Segment[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, i) => (
          <React.Fragment key={seg.label}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {i < segments.length - 1 && seg.href ? (
                <BreadcrumbLink asChild>
                  <Link href={seg.href}>{seg.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{seg.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
