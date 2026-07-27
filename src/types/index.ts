export type Status = "active" | "inactive" | "pending" | "archived";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type Priority = "low" | "medium" | "high" | "urgent";

export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  plan: "starter" | "growth" | "scale" | "enterprise";
  industry: string;
  employeeCount: number;
  createdAt: string;
  primaryColor: string;
}

export interface Department {
  id: string;
  companyId: string;
  name: string;
  headId: string | null;
  employeeCount: number;
  budget: number;
  color: string;
}

export interface Team {
  id: string;
  companyId: string;
  departmentId: string;
  name: string;
  leadId: string;
  memberIds: string[];
  description: string;
}

export interface Employee {
  id: string;
  companyId: string;
  departmentId: string;
  teamIds: string[];
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  title: string;
  status: Status;
  employmentType: "full_time" | "part_time" | "contractor";
  location: string;
  joinedAt: string;
  managerId: string | null;
  salary: number;
  phone: string;
}

export interface Project {
  id: string;
  companyId: string;
  departmentId: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  progress: number;
  priority: Priority;
  ownerId: string;
  memberIds: string[];
  startDate: string;
  dueDate: string;
  budget: number;
  spent: number;
  color: string;
}

export interface Task {
  id: string;
  projectId: string;
  companyId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  reporterId: string;
  labels: string[];
  dueDate: string | null;
  createdAt: string;
  commentCount: number;
  attachmentCount: number;
  subtaskTotal: number;
  subtaskDone: number;
}

export interface PayrollRun {
  id: string;
  companyId: string;
  period: string;
  employeeId: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: "draft" | "processing" | "paid" | "failed";
  paidAt: string | null;
}

export interface ExpenseRequest {
  id: string;
  companyId: string;
  employeeId: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  status: ApprovalStatus;
  submittedAt: string;
  receiptUrl: string | null;
}

export interface LeaveRequest {
  id: string;
  companyId: string;
  employeeId: string;
  type: "vacation" | "sick" | "personal" | "unpaid" | "parental";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: ApprovalStatus;
  requestedAt: string;
}

export interface AttendanceRecord {
  id: string;
  companyId: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "present" | "absent" | "late" | "leave" | "holiday";
  hoursWorked: number;
}

export interface Invoice {
  id: string;
  companyId: string;
  number: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  issueDate: string;
  dueDate: string;
  client: string;
}

export interface NotificationItem {
  id: string;
  companyId: string;
  userId: string;
  type: "task" | "approval" | "mention" | "system" | "billing";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface FileItem {
  id: string;
  companyId: string;
  name: string;
  type: "folder" | "pdf" | "image" | "doc" | "sheet" | "other";
  size: number;
  ownerId: string;
  updatedAt: string;
  parentId: string | null;
}

export interface Meeting {
  id: string;
  companyId: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
  attendeeIds: string[];
  location: "video" | "in_person";
}

export interface ActivityLogEntry {
  id: string;
  companyId: string;
  actorId: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  filters?: Record<string, string | string[] | undefined>;
}
