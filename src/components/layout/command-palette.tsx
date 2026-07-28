"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Bot, FolderKanban, Moon, Sun, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ALL_NAV_ITEMS, QUICK_CREATE_ITEMS } from "@/lib/nav-config";
import { listEmployees } from "@/lib/mock-api/employees";
import { listProjects } from "@/lib/mock-api/projects";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { useCommandPaletteStore } from "@/lib/store/command-palette-store";

export function CommandPalette() {
  const open = useCommandPaletteStore((s) => s.open);
  const setOpen = useCommandPaletteStore((s) => s.setOpen);
  const toggle = useCommandPaletteStore((s) => s.toggle);
  const router = useRouter();
  const { setTheme } = useTheme();
  const companyId = useWorkspaceStore((s) => s.companyId);

  const { data: employees } = useQuery({
    queryKey: ["command-employees", companyId],
    queryFn: () => listEmployees(companyId, { pageSize: 5 }),
    enabled: open,
  });
  const { data: projects } = useQuery({
    queryKey: ["command-projects", companyId],
    queryFn: () => listProjects(companyId, { pageSize: 5 }),
    enabled: open,
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
      <CommandInput placeholder="Search pages, people, projects..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {ALL_NAV_ITEMS.map((item) => (
            <CommandItem key={item.href} onSelect={() => go(item.href)}>
              <item.icon />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick create">
          {QUICK_CREATE_ITEMS.map((item) => (
            <CommandItem key={item.href} onSelect={() => go(item.href)}>
              <item.icon />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        {employees && employees.data.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="People">
              {employees.data.map((e) => (
                <CommandItem key={e.id} onSelect={() => go("/employees")}>
                  <UserRound />
                  <span>{e.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{e.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        {projects && projects.data.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {projects.data.map((p) => (
                <CommandItem key={p.id} onSelect={() => go("/projects")}>
                  <FolderKanban />
                  <span>{p.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        <CommandSeparator />
        <CommandGroup heading="Ask AI">
          <CommandItem onSelect={() => go("/ai-assistant")}>
            <Bot />
            <span>Open AI Assistant</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => setTheme("light")}>
            <Sun />
            <span>Light</span>
          </CommandItem>
          <CommandItem onSelect={() => setTheme("dark")}>
            <Moon />
            <span>Dark</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      </Command>
    </CommandDialog>
  );
}
