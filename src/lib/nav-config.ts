import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Bot,
  Building2,
  CalendarCheck,
  CheckSquare,
  ClipboardList,
  FolderKanban,
  Home,
  ReceiptText,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wallet,
  Workflow,
  Folders,
  CreditCard,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: Home }],
  },
  {
    label: "Work",
    items: [
      { title: "Projects", href: "/projects", icon: FolderKanban },
      { title: "Tasks", href: "/tasks", icon: CheckSquare },
      { title: "Teams", href: "/teams", icon: UsersRound },
    ],
  },
  {
    label: "People",
    items: [
      { title: "Employees", href: "/employees", icon: UsersRound },
      { title: "Departments", href: "/departments", icon: Building2 },
      { title: "Attendance", href: "/attendance", icon: CalendarCheck },
      { title: "Leave", href: "/leave", icon: ClipboardList },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Payroll", href: "/payroll", icon: Wallet },
      { title: "Expenses", href: "/expenses", icon: ReceiptText },
      { title: "Billing", href: "/billing", icon: CreditCard },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Reports", href: "/reports", icon: ScrollText },
      { title: "AI Assistant", href: "/ai-assistant", icon: Bot, badge: "AI" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Approvals", href: "/approvals", icon: Banknote },
      { title: "Files", href: "/files", icon: Folders },
      { title: "Automation", href: "/automation", icon: Workflow },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Roles & Permissions", href: "/roles", icon: ShieldCheck },
      { title: "Company Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export const QUICK_CREATE_ITEMS = [
  { title: "New Task", href: "/tasks?create=1", icon: CheckSquare },
  { title: "New Project", href: "/projects?create=1", icon: FolderKanban },
  { title: "Invite Employee", href: "/employees?create=1", icon: UsersRound },
  { title: "New Expense", href: "/expenses?create=1", icon: ReceiptText },
] satisfies NavItem[];

export const AI_ICON = Sparkles;
