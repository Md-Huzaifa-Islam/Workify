import { faker } from "@faker-js/faker";
import type {
  ActivityLogEntry,
  AttendanceRecord,
  Comment,
  Company,
  Department,
  Employee,
  ExpenseRequest,
  FileItem,
  Invoice,
  LeaveRequest,
  Meeting,
  NotificationItem,
  PayrollRun,
  Project,
  Task,
  Team,
} from "@/types";

faker.seed(1337);

function pick<T>(arr: readonly T[]): T {
  return faker.helpers.arrayElement(arr);
}

function pickMany<T>(arr: readonly T[], count: number): T[] {
  return faker.helpers.arrayElements(arr, count);
}

const COMPANY_COLORS = ["#6366f1", "#0ea5e9", "#d946ef", "#f59e0b", "#10b981"];
const DEPARTMENT_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#d946ef",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];
const PROJECT_COLORS = DEPARTMENT_COLORS;

const DEPARTMENT_NAMES = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Success",
  "Human Resources",
  "Finance",
  "Operations",
  "Legal",
  "IT & Security",
  "Data & Analytics",
  "Support",
  "Business Development",
  "Quality Assurance",
  "Research",
  "Procurement",
  "Facilities",
  "Recruiting",
  "Executive",
];

const ROLE_BY_DEPT: Record<string, string[]> = {
  Engineering: [
    "Software Engineer",
    "Senior Software Engineer",
    "Staff Engineer",
    "Engineering Manager",
    "DevOps Engineer",
    "QA Engineer",
  ],
  Product: ["Product Manager", "Senior PM", "Product Analyst", "Head of Product"],
  Design: ["Product Designer", "UX Researcher", "Design Lead", "Brand Designer"],
  Marketing: ["Marketing Manager", "Content Strategist", "SEO Specialist", "Growth Marketer"],
  Sales: ["Account Executive", "Sales Development Rep", "Sales Manager", "Solutions Consultant"],
  "Customer Success": ["CS Manager", "Onboarding Specialist", "Support Lead"],
  "Human Resources": ["HR Business Partner", "Recruiter", "People Ops Manager"],
  Finance: ["Financial Analyst", "Controller", "Accounts Payable Specialist"],
  Operations: ["Operations Manager", "Business Operations Analyst"],
  Legal: ["Legal Counsel", "Compliance Officer"],
};

const PROJECT_NAME_NOUNS = [
  "Atlas",
  "Nebula",
  "Horizon",
  "Vertex",
  "Catalyst",
  "Momentum",
  "Beacon",
  "Zenith",
  "Odyssey",
  "Pulse",
  "Nimbus",
  "Aurora",
  "Cascade",
  "Ember",
  "Fusion",
  "Orbit",
  "Prism",
  "Summit",
  "Vector",
  "Meridian",
];

const TASK_LABELS = [
  "bug",
  "feature",
  "design",
  "backend",
  "frontend",
  "urgent",
  "tech-debt",
  "research",
  "docs",
];

export const COMPANIES: Company[] = Array.from({ length: 5 }).map((_, i) => {
  const name = faker.company.name();
  return {
    id: `company_${i + 1}`,
    name,
    slug: faker.helpers.slugify(name).toLowerCase(),
    logoUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
    plan: pick(["starter", "growth", "scale", "enterprise"] as const),
    industry: pick([
      "Software",
      "Fintech",
      "Healthcare",
      "E-commerce",
      "Logistics",
      "Manufacturing",
    ]),
    employeeCount: 0,
    createdAt: faker.date.past({ years: 4 }).toISOString(),
    primaryColor: COMPANY_COLORS[i % COMPANY_COLORS.length],
  };
});

export const DEPARTMENTS: Department[] = COMPANIES.flatMap((company) =>
  pickMany(DEPARTMENT_NAMES, 4).map((name, i) => ({
    id: `dept_${company.id}_${i + 1}`,
    companyId: company.id,
    name,
    headId: null,
    employeeCount: 0,
    budget: faker.number.int({ min: 50_000, max: 2_000_000 }),
    color: DEPARTMENT_COLORS[i % DEPARTMENT_COLORS.length],
  })),
);

export const EMPLOYEES: Employee[] = COMPANIES.flatMap((company) => {
  const depts = DEPARTMENTS.filter((d) => d.companyId === company.id);
  return Array.from({ length: 24 }).map((_, i) => {
    const dept = depts[i % depts.length];
    const roles = ROLE_BY_DEPT[dept.name] ?? ["Specialist", "Manager", "Analyst"];
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    return {
      id: `emp_${company.id}_${i + 1}`,
      companyId: company.id,
      departmentId: dept.id,
      teamIds: [],
      name,
      email: faker.internet
        .email({ firstName, lastName, provider: `${company.slug}.io` })
        .toLowerCase(),
      avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      role: pick(roles),
      title: pick(roles),
      status: pick(["active", "active", "active", "inactive", "pending"] as const),
      employmentType: pick(["full_time", "full_time", "full_time", "part_time", "contractor"] as const),
      location: pick([
        "New York, US",
        "San Francisco, US",
        "Austin, US",
        "London, UK",
        "Berlin, DE",
        "Toronto, CA",
        "Remote",
      ]),
      joinedAt: faker.date.past({ years: 5 }).toISOString(),
      managerId: null,
      salary: faker.number.int({ min: 55_000, max: 220_000 }),
      phone: faker.phone.number(),
    };
  });
});

for (const dept of DEPARTMENTS) {
  const deptEmployees = EMPLOYEES.filter((e) => e.departmentId === dept.id);
  dept.employeeCount = deptEmployees.length;
  dept.headId = deptEmployees[0]?.id ?? null;
}
for (const company of COMPANIES) {
  company.employeeCount = EMPLOYEES.filter((e) => e.companyId === company.id).length;
}
for (const emp of EMPLOYEES) {
  const companyEmployees = EMPLOYEES.filter(
    (e) => e.companyId === emp.companyId && e.id !== emp.id,
  );
  if (companyEmployees.length && faker.number.int({ min: 0, max: 4 }) !== 0) {
    emp.managerId = pick(companyEmployees).id;
  }
}

export const TEAMS: Team[] = DEPARTMENTS.flatMap((dept, i) => {
  const deptEmployees = EMPLOYEES.filter((e) => e.departmentId === dept.id);
  if (deptEmployees.length < 3) return [];
  const teamCount = i % 3 === 0 ? 1 : 0;
  return Array.from({ length: Math.max(teamCount, i < 12 ? 1 : 0) }).map((_, j) => {
    const members = pickMany(deptEmployees, Math.min(deptEmployees.length, faker.number.int({ min: 3, max: 8 })));
    const team: Team = {
      id: `team_${dept.id}_${j + 1}`,
      companyId: dept.companyId,
      departmentId: dept.id,
      name: `${dept.name} ${pick(["Core", "Squad", "Pod", "Guild"])}`,
      leadId: members[0].id,
      memberIds: members.map((m) => m.id),
      description: faker.company.catchPhrase(),
    };
    for (const m of members) m.teamIds.push(team.id);
    return team;
  });
}).slice(0, 12);

export const PROJECTS: Project[] = COMPANIES.flatMap((company) => {
  const depts = DEPARTMENTS.filter((d) => d.companyId === company.id);
  const companyEmployees = EMPLOYEES.filter((e) => e.companyId === company.id);
  return Array.from({ length: 16 }).map((_, i) => {
    const dept = pick(depts);
    const start = faker.date.past({ years: 1 });
    const due = faker.date.future({ years: 1, refDate: start });
    const status = pick([
      "planning",
      "active",
      "active",
      "active",
      "on_hold",
      "completed",
      "cancelled",
    ] as const);
    const budget = faker.number.int({ min: 20_000, max: 500_000 });
    return {
      id: `project_${company.id}_${i + 1}`,
      companyId: company.id,
      departmentId: dept.id,
      name: `${pick(PROJECT_NAME_NOUNS)} ${pick(["Rollout", "Revamp", "Initiative", "Launch", "Migration", "Program"])}`,
      description: faker.company.catchPhrase(),
      status,
      progress: status === "completed" ? 100 : faker.number.int({ min: 5, max: 95 }),
      priority: pick(["low", "medium", "high", "urgent"] as const),
      ownerId: pick(companyEmployees).id,
      memberIds: pickMany(companyEmployees, faker.number.int({ min: 3, max: 9 })).map((e) => e.id),
      startDate: start.toISOString(),
      dueDate: due.toISOString(),
      budget,
      spent: Math.round(budget * faker.number.float({ min: 0.1, max: 1.1, fractionDigits: 2 })),
      color: pick(PROJECT_COLORS),
    };
  });
});

export const TASKS: Task[] = PROJECTS.flatMap((project) => {
  const companyEmployees = EMPLOYEES.filter((e) => e.companyId === project.companyId);
  const count = faker.number.int({ min: 4, max: 8 });
  return Array.from({ length: count }).map((_, i) => {
    const status = pick(["todo", "todo", "in_progress", "in_progress", "review", "done", "done"] as const);
    const subtaskTotal = faker.number.int({ min: 0, max: 6 });
    return {
      id: `task_${project.id}_${i + 1}`,
      projectId: project.id,
      companyId: project.companyId,
      title: faker.hacker.phrase().replace(/^./, (c) => c.toUpperCase()),
      description: faker.lorem.sentences({ min: 1, max: 2 }),
      status,
      priority: pick(["low", "medium", "high", "urgent"] as const),
      assigneeId: faker.number.int({ min: 0, max: 10 }) === 0 ? null : pick(companyEmployees).id,
      reporterId: pick(companyEmployees).id,
      labels: pickMany(TASK_LABELS, faker.number.int({ min: 0, max: 3 })),
      dueDate:
        faker.number.int({ min: 0, max: 4 }) === 0
          ? null
          : faker.date.soon({ days: 45 }).toISOString(),
      createdAt: faker.date.recent({ days: 60 }).toISOString(),
      commentCount: faker.number.int({ min: 0, max: 12 }),
      attachmentCount: faker.number.int({ min: 0, max: 5 }),
      subtaskTotal,
      subtaskDone: subtaskTotal > 0 ? faker.number.int({ min: 0, max: subtaskTotal }) : 0,
    };
  });
});

export const COMMENTS: Comment[] = TASKS.flatMap((task) => {
  const companyEmployees = EMPLOYEES.filter((e) => e.companyId === task.companyId);
  return Array.from({ length: Math.min(task.commentCount, 4) }).map((_, i) => ({
    id: `comment_${task.id}_${i + 1}`,
    taskId: task.id,
    authorId: pick(companyEmployees).id,
    body: faker.lorem.sentence(),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  }));
});

export const PAYROLL_RUNS: PayrollRun[] = COMPANIES.flatMap((company) => {
  const companyEmployees = EMPLOYEES.filter((e) => e.companyId === company.id);
  return Array.from({ length: 3 }).flatMap((_, monthOffset) => {
    const period = faker.date.recent({ days: 30 * (monthOffset + 1) });
    const periodLabel = period.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return companyEmployees.map((emp) => {
      const gross = Math.round(emp.salary / 12);
      const deductions = Math.round(gross * faker.number.float({ min: 0.15, max: 0.32, fractionDigits: 2 }));
      return {
        id: `payroll_${emp.id}_${monthOffset}`,
        companyId: company.id,
        period: periodLabel,
        employeeId: emp.id,
        grossPay: gross,
        deductions,
        netPay: gross - deductions,
        status: monthOffset === 0 ? pick(["draft", "processing", "paid"] as const) : "paid",
        paidAt: monthOffset === 0 ? null : faker.date.recent({ days: 30 * monthOffset }).toISOString(),
      };
    });
  });
});

export const EXPENSE_REQUESTS: ExpenseRequest[] = EMPLOYEES.flatMap((emp) => {
  const count = faker.number.int({ min: 0, max: 3 });
  return Array.from({ length: count }).map((_, i) => ({
    id: `expense_${emp.id}_${i + 1}`,
    companyId: emp.companyId,
    employeeId: emp.id,
    category: pick(["Travel", "Meals", "Software", "Equipment", "Office Supplies", "Training"]),
    description: faker.commerce.productName(),
    amount: faker.number.int({ min: 20, max: 3200 }),
    currency: "USD",
    status: pick(["pending", "approved", "approved", "rejected"] as const),
    submittedAt: faker.date.recent({ days: 45 }).toISOString(),
    receiptUrl: faker.number.int({ min: 0, max: 3 }) === 0 ? null : "receipt.pdf",
  }));
});

export const LEAVE_REQUESTS: LeaveRequest[] = EMPLOYEES.flatMap((emp) => {
  const count = faker.number.int({ min: 0, max: 2 });
  return Array.from({ length: count }).map((_, i) => {
    const start = faker.date.soon({ days: 60 });
    const days = faker.number.int({ min: 1, max: 10 });
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    return {
      id: `leave_${emp.id}_${i + 1}`,
      companyId: emp.companyId,
      employeeId: emp.id,
      type: pick(["vacation", "sick", "personal", "unpaid", "parental"] as const),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      days,
      reason: faker.lorem.sentence(),
      status: pick(["pending", "approved", "approved", "rejected"] as const),
      requestedAt: faker.date.recent({ days: 20 }).toISOString(),
    };
  });
});

export const ATTENDANCE_RECORDS: AttendanceRecord[] = EMPLOYEES.flatMap((emp) =>
  Array.from({ length: 14 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const status = pick(["present", "present", "present", "present", "late", "absent", "leave"] as const);
    return {
      id: `att_${emp.id}_${i}`,
      companyId: emp.companyId,
      employeeId: emp.id,
      date: date.toISOString().slice(0, 10),
      checkIn: status === "present" || status === "late" ? "09:0" + faker.number.int({ min: 0, max: 9 }) : null,
      checkOut: status === "present" || status === "late" ? "18:0" + faker.number.int({ min: 0, max: 9 }) : null,
      status,
      hoursWorked: status === "present" ? faker.number.int({ min: 7, max: 9 }) : status === "late" ? faker.number.int({ min: 5, max: 7 }) : 0,
    };
  }),
);

export const INVOICES: Invoice[] = COMPANIES.flatMap((company) =>
  Array.from({ length: 10 }).map((_, i) => ({
    id: `invoice_${company.id}_${i + 1}`,
    companyId: company.id,
    number: `INV-${2000 + i}`,
    amount: faker.number.int({ min: 500, max: 45_000 }),
    status: pick(["draft", "sent", "paid", "paid", "overdue"] as const),
    issueDate: faker.date.recent({ days: 90 }).toISOString(),
    dueDate: faker.date.soon({ days: 30 }).toISOString(),
    client: faker.company.name(),
  })),
);

export const NOTIFICATIONS: NotificationItem[] = EMPLOYEES.slice(0, 40).flatMap((emp) =>
  Array.from({ length: faker.number.int({ min: 2, max: 6 }) }).map((_, i) => {
    const type = pick(["task", "approval", "mention", "system", "billing"] as const);
    return {
      id: `notif_${emp.id}_${i}`,
      companyId: emp.companyId,
      userId: emp.id,
      type,
      title: {
        task: "Task assigned to you",
        approval: "Approval request needs review",
        mention: "You were mentioned in a comment",
        system: "System update completed",
        billing: "Invoice payment received",
      }[type],
      body: faker.lorem.sentence(),
      read: faker.datatype.boolean(0.5),
      createdAt: faker.date.recent({ days: 14 }).toISOString(),
    };
  }),
);

export const FILES: FileItem[] = COMPANIES.flatMap((company) => {
  const companyEmployees = EMPLOYEES.filter((e) => e.companyId === company.id);
  const types = ["pdf", "image", "doc", "sheet", "other"] as const;
  return Array.from({ length: 24 }).map((_, i) => ({
    id: `file_${company.id}_${i + 1}`,
    companyId: company.id,
    name: `${faker.system.commonFileName(pick(types) === "image" ? "png" : undefined)}`,
    type: pick(types),
    size: faker.number.int({ min: 10_000, max: 20_000_000 }),
    ownerId: pick(companyEmployees).id,
    updatedAt: faker.date.recent({ days: 60 }).toISOString(),
    parentId: null,
  }));
});

export const MEETINGS: Meeting[] = COMPANIES.flatMap((company) => {
  const companyEmployees = EMPLOYEES.filter((e) => e.companyId === company.id);
  return Array.from({ length: 8 }).map((_, i) => ({
    id: `meeting_${company.id}_${i + 1}`,
    companyId: company.id,
    title: pick([
      "Sprint Planning",
      "1:1 Sync",
      "All Hands",
      "Design Review",
      "Quarterly Business Review",
      "Client Check-in",
    ]),
    startsAt: faker.date.soon({ days: 14 }).toISOString(),
    durationMinutes: pick([30, 30, 45, 60]),
    attendeeIds: pickMany(companyEmployees, faker.number.int({ min: 2, max: 6 })).map((e) => e.id),
    location: pick(["video", "in_person"] as const),
  }));
});

export const ACTIVITY_LOG: ActivityLogEntry[] = COMPANIES.flatMap((company) => {
  const companyEmployees = EMPLOYEES.filter((e) => e.companyId === company.id);
  return Array.from({ length: 30 }).map((_, i) => ({
    id: `activity_${company.id}_${i + 1}`,
    companyId: company.id,
    actorId: pick(companyEmployees).id,
    action: pick([
      "created task",
      "completed task",
      "updated project",
      "submitted expense",
      "requested leave",
      "commented on",
      "uploaded file",
      "approved request",
    ]),
    target: pick(PROJECT_NAME_NOUNS) + " " + pick(["Rollout", "Revamp", "Initiative"]),
    createdAt: faker.date.recent({ days: 14 }).toISOString(),
  }));
});
