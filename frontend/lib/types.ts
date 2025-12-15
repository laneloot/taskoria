export type UserRole = "admin" | "manager" | "member";

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  bio?: string;
  email_verified?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  owner: string;
  members: number[];
  start_date: string;
  end_date: string | null;
  status: "planning" | "active" | "completed" | "archived";
  tasks_count: number;
  completed_tasks_count: number;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectPayload {
  name: string;
  description?: string;
  members?: number[];
  start_date: string;
  end_date?: string | null;
  status?: Project["status"];
}

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";

export interface Task {
  id: number;
  title: string;
  description: string;
  project: number;
  project_name: string;
  assignee: number | null;
  assignee_username: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
  blocked_by: number[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  target_type: string | null;
  target_id: number | null;
  created_at: string;
}

export interface UserSummary {
  user_id: number;
  username: string;
  total_tasks: number;
  completed_tasks: number;
  active_tasks: number;
  overdue_tasks: number;
  completed_today: number;
}

export interface TaskDistributionResponse {
  status: Record<string, number>;
  priority: Record<string, number>;
  assignee: Record<string, number>;
}

export interface TaskTrendPoint {
  date: string;
  count?: number;
  remaining?: number;
}

export interface WeeklyProductivityPoint {
  date: string;
  count: number;
}

export interface TaskPayload {
  title: string;
  description?: string;
  project: number;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string | null;
  assignee?: number | null;
  blocked_by?: number[];
}
