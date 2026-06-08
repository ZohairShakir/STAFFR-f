'use client';
/**
 * lib/api.ts — Typed fetch wrapper.
 * ALL API calls go through this file. Never call fetch() directly in components or hooks.
 */

const BASE =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      if (typeof err.message === 'string') {
        errorMessage = err.message;
      } else if (Array.isArray(err.message)) {
        errorMessage = err.message.join(', ');
      }
      if (err.errors?.fieldErrors) {
        const fields = Object.entries(err.errors.fieldErrors as Record<string, string[]>)
          .map(([field, msgs]) => `${field}: ${msgs?.join(', ')}`)
          .join('; ');
        if (fields) errorMessage = `${errorMessage} — ${fields}`;
      }
    } catch {
      /* no-op */
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

function buildQs(params: Record<string, string | number | undefined | null>): string {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)]),
    ),
  ).toString();
  return qs ? `?${qs}` : '';
}

// ─── Types (re-exported from @cft/types via inline) ────────────────────────
export type User = {
  id: string; slackId: string; name: string; email: string;
  avatar?: string | null; role: UserRole; createdAt: string;
};
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';
export type ProjectStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
export type ApplicationSource = 'WEB' | 'SLACK';

export type Role = {
  id: string; projectId: string; title: string; skills: string[];
  experience: string; openings: number; filled: number;
  _count?: { applications: number };
};

export type Project = {
  id: string; title: string; description: string; status: ProjectStatus;
  managerId: string; manager?: User; slackChannelId?: string | null;
  deadline?: string | null; roles?: Role[]; createdAt: string; updatedAt: string;
};

export type Application = {
  id: string; userId: string; user?: User; roleId: string; role?: Role & { project?: Project & { manager?: User } };
  status: ApplicationStatus; note?: string | null; source: ApplicationSource;
  reviewedBy?: string | null; reviewer?: User | null; reviewedAt?: string | null;
  createdAt: string; updatedAt: string;
};

export type AuditLog = {
  id: string; actorId: string; actor?: User; entity: string;
  entityId: string; action: string; diff?: Record<string, unknown> | null; createdAt: string;
};

export type HiringFunnelReport = {
  projectId: string; projectTitle: string;
  pending: number; reviewing: number; accepted: number; rejected: number; withdrawn: number;
};

export type FillRateReport = {
  projectId: string; projectTitle: string; roleId: string; roleTitle: string;
  openings: number; filled: number; fillRate: number;
};

export type TimeToHireReport = {
  projectId: string; projectTitle: string; avgDaysToHire: number;
};

export type Paginated<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export type SlackChannel = { id: string; name: string; is_private: boolean; num_members: number };

// ─── API surface ─────────────────────────────────────────────────────────────
export const api = {
  auth: {
    me: () => request<User>('GET', '/users/me'),
    refresh: () => request<{ success: boolean }>('POST', '/auth/refresh'),
    logout: () => request<{ success: boolean }>('POST', '/auth/logout'),
    slackLoginUrl: () => `${BASE}/auth/slack`,
  },

  users: {
    list: () => request<User[]>('GET', '/users'),
    updateRole: (id: string, role: UserRole) =>
      request<User>('PATCH', `/users/${id}/role`, { role }),
  },

  projects: {
    list: (params?: { status?: string; skill?: string; managerId?: string }) =>
      request<Project[]>('GET', `/projects${buildQs(params ?? {})}`),
    get: (id: string) => request<Project>('GET', `/projects/${id}`),
    create: (data: unknown) => request<Project>('POST', '/projects', data),
    update: (id: string, data: unknown) => request<Project>('PATCH', `/projects/${id}`, data),
    publish: (id: string) => request<Project>('POST', `/projects/${id}/publish`),
    delete: (id: string) => request<void>('DELETE', `/projects/${id}`),
  },

  roles: {
    list: (projectId: string) => request<Role[]>('GET', `/projects/${projectId}/roles`),
    create: (projectId: string, data: unknown) =>
      request<Role>('POST', `/projects/${projectId}/roles`, data),
    update: (roleId: string, data: unknown) => request<Role>('PATCH', `/roles/${roleId}`, data),
    delete: (roleId: string) => request<void>('DELETE', `/roles/${roleId}`),
  },

  applications: {
    list: (params?: { status?: string; projectId?: string; roleId?: string }) =>
      request<Application[]>('GET', `/applications${buildQs(params ?? {})}`),
    get: (id: string) => request<Application>('GET', `/applications/${id}`),
    create: (data: unknown) => request<Application>('POST', '/applications', data),
    updateStatus: (id: string, status: ApplicationStatus) =>
      request<Application>('PATCH', `/applications/${id}/status`, { status }),
    withdraw: (id: string) => request<void>('DELETE', `/applications/${id}`),
  },

  reports: {
    hiring: () => request<HiringFunnelReport[]>('GET', '/reports/hiring'),
    fillRate: () => request<FillRateReport[]>('GET', '/reports/fill-rate'),
    timeToHire: () => request<TimeToHireReport[]>('GET', '/reports/time-to-hire'),
  },

  auditLogs: {
    list: (params?: { page?: number; limit?: number; entity?: string; actorId?: string }) =>
      request<Paginated<AuditLog>>('GET', `/audit-logs${buildQs(params ?? {})}`),
  },

  slack: {
    channels: () => request<SlackChannel[]>('GET', '/slack/channels'),
  },
};
