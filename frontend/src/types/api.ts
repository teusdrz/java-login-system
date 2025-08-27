// API Types for Java Login System

export interface User {
    id?: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: Role;
    active?: boolean;
    createdAt?: string;
    lastModifiedAt?: string;
    lastLoginAt?: string;
    failedLoginAttempts?: number;
}

export enum Role {
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    USER = 'USER'
}

export interface LoginRequest {
    username: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    token: string;
    user: User;
    expiresAt: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
}

export interface UserUpdateRequest {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    active?: boolean;
}

export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}

export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    onlineUsers: number;
}
