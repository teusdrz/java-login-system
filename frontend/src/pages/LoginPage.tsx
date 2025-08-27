import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LoadingButton } from '../components/Loading';
import ApiService from '../services/ApiService';
import { LoginRequest } from '../types/api';

/**
 * LoginPage Component - Professional authentication interface
 * Features modern dark theme design with comprehensive validation
 * Implements secure JWT authentication with user feedback
 */
const LoginPage: React.FC = () => {
    // Form state management
    const [formData, setFormData] = useState<LoginRequest>({
        username: '',
        password: '',
        rememberMe: false,
    });

    // UI state management
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Hooks for navigation and notifications
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    /**
     * Handle input field changes with validation
     * @param e - Input change event
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        // Clear field-specific errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    /**
     * Validate form data before submission
     * @returns boolean indicating if form is valid
     */
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 3) {
            newErrors.password = 'Password must be at least 3 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle form submission with comprehensive error handling
     * @param e - Form submit event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast({
                type: 'error',
                title: 'Validation Error',
                message: 'Please fix the form errors and try again',
            });
            return;
        }

        setLoading(true);

        try {
            // Prepare login data with browser information
            const loginData: LoginRequest = {
                ...formData,
                ipAddress: '127.0.0.1', // Would be determined by backend in production
                userAgent: navigator.userAgent,
            };

            const response = await ApiService.login(loginData);

            if (response.success && response.data) {
                // Successful login
                login(response.data.token, response.data.user);

                showToast({
                    type: 'success',
                    title: 'Welcome Back!',
                    message: `Successfully logged in as ${response.data.user.firstName}`,
                });

                navigate('/dashboard');
            } else {
                // Login failed
                showToast({
                    type: 'error',
                    title: 'Login Failed',
                    message: response.message || 'Invalid credentials',
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast({
                type: 'error',
                title: 'Network Error',
                message: 'Unable to connect to the server. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Quick login with demo account
     * @param username - Demo account username
     * @param password - Demo account password
     */
    const handleDemoLogin = async (username: string, password: string) => {
        setFormData(prev => ({ ...prev, username, password }));

        // Simulate a small delay for better UX
        setTimeout(() => {
            const event = new Event('submit', { bubbles: true, cancelable: true });
            document.getElementById('loginForm')?.dispatchEvent(event);
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

            {/* Main Login Card - Layout centralizado conforme especificação */}
            <div className="max-w-md w-full space-y-8">

                {/* Header Section */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-white">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Card flutuante conforme especificação */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-8">
                    <div className="card-body">
                        <form id="loginForm" className="space-y-6" onSubmit={handleSubmit}>

                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={`input-field pl-10 ${errors.username ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                                        placeholder="Enter your username"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.username && (
                                    <div className="mt-1 flex items-center text-sm text-danger-400">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.username}
                                    </div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`input-field pl-10 pr-10 ${errors.password ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="mt-1 flex items-center text-sm text-danger-400">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-600 rounded bg-dark-700"
                                        disabled={loading}
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <LoadingButton
                                    type="submit"
                                    loading={loading}
                                    loadingText="Signing in..."
                                    className="w-full"
                                    variant="primary"
                                >
                                    Sign in
                                </LoadingButton>
                            </div>

                            {/* Register Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-400">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className="font-medium text-primary-400 hover:text-primary-300 transition-colors duration-200"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Demo Accounts Section */}
                <div className="card animate-fade-in">
                    <div className="card-header">
                        <h3 className="text-sm font-medium text-gray-300">Demo Accounts</h3>
                    </div>
                    <div className="card-body">
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => handleDemoLogin('admin', 'admin123')}
                                disabled={loading}
                                className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors duration-200 text-left"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-200">Administrator</p>
                                    <p className="text-xs text-gray-400">Full system access</p>
                                </div>
                                <div className="badge badge-danger">Admin</div>
                            </button>

                            <button
                                onClick={() => handleDemoLogin('moderator', 'mod123')}
                                disabled={loading}
                                className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors duration-200 text-left"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-200">Moderator</p>
                                    <p className="text-xs text-gray-400">User management access</p>
                                </div>
                                <div className="badge badge-warning">Moderator</div>
                            </button>

                            <button
                                onClick={() => handleDemoLogin('testuser', 'password123')}
                                disabled={loading}
                                className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors duration-200 text-left"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-200">Regular User</p>
                                    <p className="text-xs text-gray-400">Basic profile access</p>
                                </div>
                                <div className="badge badge-success">User</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;