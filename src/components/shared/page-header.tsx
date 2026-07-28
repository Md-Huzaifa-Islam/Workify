"use client";

import { usePathname } from "next/navigation";
import { ALL_NAV_ITEMS } from "@/lib/nav-config";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const pathname = usePathname();
  const navItem = ALL_NAV_ITEMS.find((i) => pathname.startsWith(i.href));

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {navItem ? (
          <div className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <navItem.icon className="size-5" strokeWidth={1.75} />
          </div>
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
