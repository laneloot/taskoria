import { api } from "@/lib/api/client";
import {
  ApiUser,
  Notification,
  PaginatedResponse,
  Project,
  ProjectPayload,
  Task,
  TaskDistributionResponse,
  TaskPayload,
  TaskTrendPoint,
  UserSummary,
  WeeklyProductivityPoint,
} from "@/lib/types";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
  role?: "admin" | "manager" | "member";
}

export interface ProfileUpdatePayload {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: File | null;
  removeAvatar?: boolean;
}

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<{ access: string; refresh: string }>("/users/login/", payload);
  return data;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post<ApiUser>("/users/register/", payload);
  return data;
};

export const fetchProfile = async () => {
  const { data } = await api.get<ApiUser>("/users/profile/");
  return data;
};

export const updateProfile = async (payload: ProfileUpdatePayload) => {
  const { avatar, removeAvatar, ...rest } = payload;
  const hasFile = avatar instanceof File;

  if (hasFile) {
    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    formData.append("avatar", avatar);
    const { data } = await api.patch<ApiUser>("/users/profile/", formData);
    return data;
  }

  const body: Record<string, unknown> = {};
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined) {
      body[key] = value;
    }
  });
  if (removeAvatar) {
    body.avatar = null;
  }

  const { data } = await api.patch<ApiUser>("/users/profile/", body);
  return data;
};

export const fetchProjects = async (params: Record<string, string | number | undefined> = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });
  if (!searchParams.has("limit")) {
    searchParams.set("limit", "20");
  }
  const query = searchParams.toString();
  const { data } = await api.get<PaginatedResponse<Project>>(`/projects/${query ? `?${query}` : ""}`);
  return data;
};

export const fetchTasks = async (params: Record<string, string | number | undefined> = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });
  if (!searchParams.has("limit")) {
    searchParams.set("limit", "10");
  }
  const query = searchParams.toString();
  const { data } = await api.get<PaginatedResponse<Task>>(`/tasks/${query ? `?${query}` : ""}`);
  return data;
};

export const fetchUsers = async (params: { limit?: number } = {}) => {
  const searchParams = new URLSearchParams();
  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }
  if (!searchParams.has("limit")) {
    searchParams.set("limit", "100");
  }
  const query = searchParams.toString();
  const { data } = await api.get<PaginatedResponse<ApiUser>>(`/users/all/${query ? `?${query}` : ""}`);
  return data.results;
};

export const createProject = async (payload: ProjectPayload) => {
  const { data } = await api.post<Project>("/projects/", payload);
  return data;
};

export const updateProject = async (projectId: number, payload: Partial<ProjectPayload>) => {
  const { data } = await api.patch<Project>(`/projects/${projectId}/`, payload);
  return data;
};

export const deleteProject = async (projectId: number) => {
  await api.delete(`/projects/${projectId}/`);
};

export const fetchNotifications = async () => {
  const { data } = await api.get<PaginatedResponse<Notification>>("/notifications/");
  return data;
};

export const markNotificationRead = async (notificationId: number) => {
  await api.post(`/notifications/${notificationId}/mark_read/`);
};

export const markAllNotificationsRead = async () => {
  await api.post(`/notifications/mark_all_read/`);
};

export const fetchUserSummary = async () => {
  const { data } = await api.get<UserSummary>("/analytics/user/summary/");
  return data;
};

export const fetchTaskDistribution = async (projectId?: number) => {
  const path = projectId
    ? `/analytics/project/${projectId}/tasks/distribution/`
    : "/analytics/tasks/distribution/";
  const { data } = await api.get<TaskDistributionResponse>(path);
  return data;
};

export const fetchTaskTrends = async (projectId?: number) => {
  const path = projectId
    ? `/analytics/project/${projectId}/tasks/trends/`
    : "/analytics/tasks/trends/";
  const { data } = await api.get<{ created_per_day: TaskTrendPoint[]; completed_per_day: TaskTrendPoint[] }>(path);
  return data;
};

export const fetchWeeklyProductivity = async (userId?: number) => {
  const path = userId
    ? `/analytics/user/${userId}/weekly-productivity/`
    : "/analytics/user/weekly-productivity/";
  const { data } = await api.get<WeeklyProductivityPoint[]>(path);
  return data;
};

export const createTask = async (payload: TaskPayload) => {
  const { data } = await api.post<Task>("/tasks/", payload);
  return data;
};

export const updateTask = async (taskId: number, payload: Partial<TaskPayload>) => {
  const { data } = await api.patch<Task>(`/tasks/${taskId}/`, payload);
  return data;
};

export const deleteTask = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}/`);
};
