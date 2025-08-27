import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserUpdateRequest,
  PasswordChangeRequest,
  ApiResponse,
  UserStats
} from '../types/api';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'http://localhost:8080/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests automatically
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token expiration
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<LoginResponse>> = await this.api.post(
        '/auth/login',
        credentials
      );
      
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.post(
        '/auth/register',
        userData
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await this.api.post('/auth/logout');
      
      // Clear local storage regardless of response
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return response.data;
    } catch (error: any) {
      // Clear local storage even on error
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      };
    }
  }

  // User management methods
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get('/users');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
      };
    }
  }

  async updateUser(userId: string, userData: UserUpdateRequest): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.put(
        `/users/${userId}`,
        userData
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user',
      };
    }
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
      };
    }
  }

  // Profile methods
  async updateProfile(userData: UserUpdateRequest): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.put('/profile', userData);
      
      // Update local user data if successful
      if (response.data.success && response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
      };
    }
  }

  async changePassword(passwordData: PasswordChangeRequest): Promise<ApiResponse<void>> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = await this.api.put(
        '/profile/password',
        passwordData
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password',
      };
    }
  }

  // Utility methods
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const roleHierarchy = ['USER', 'MODERATOR', 'ADMIN'];
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    
    return userRoleIndex >= requiredRoleIndex;
  }
}

export default new ApiService();
