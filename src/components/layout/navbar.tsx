"use client";

import { Bot, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { QuickCreateMenu } from "@/components/layout/quick-create-menu";
import { useCommandPaletteStore } from "@/lib/store/command-palette-store";
import { NAV_GROUPS } from "@/lib/nav-config";

function useCurrentNavItem() {
  const pathname = usePathname();
  for (const group of NAV_GROUPS) {
    const item = group.items.find((i) => pathname.startsWith(i.href));
    if (item) return { group, item };
  }
  return null;
}

export function Navbar() {
  const toggleCommandPalette = useCommandPaletteStore((s) => s.toggle);
  const router = useRouter();
  const current = useCurrentNavItem();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-5" />

      {current ? (
        <div className="hidden items-center gap-1.5 text-sm sm:flex">
          <span className="text-muted-foreground">{current.group.label}</span>
          <span className="text-muted-foreground">/</span>
          <span className="flex items-center gap-1.5 font-medium">
            <current.item.icon className="size-3.5 text-primary" />
            {current.item.title}
          </span>
        </div>
      ) : null}

      <button
        onClick={toggleCommandPalette}
        className="ml-2 flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search Workify...</span>
        <kbd className="pointer-events-none hidden select-none items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-1.5 md:inline-flex"
          onClick={() => router.push("/ai-assistant")}
        >
          <Bot className="size-4 text-primary" />
          Ask AI
        </Button>
        <NotificationsMenu />
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <QuickCreateMenu />
      </div>
    </header>
  );
}
