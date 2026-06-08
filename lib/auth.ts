'use client';
import { api, type UserRole } from './api';

export function isAdmin(role: UserRole) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export function isManager(role: UserRole) {
  return role === 'PROJECT_MANAGER' || isAdmin(role);
}
