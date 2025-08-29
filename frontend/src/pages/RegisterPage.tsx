import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import { LoadingButton } from '../components/Loading';
import ApiService from '../services/ApiService';
import { RegisterRequest } from '../types/api';

/**
 * Interface for registration form data with confirm password
 */
interface RegistrationFormData extends RegisterRequest {
    confirmPassword: string;
}

/**
 * RegisterPage Component - Professional user registration interface
 * Features modern dark theme design with comprehensive validation
 * Implements secure user registration with real-time feedback
 */
const RegisterPage: React.FC = () => {
    // Form state management
    const [formData, setFormData] = useState<RegistrationFormData>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // UI state management
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: '',
        color: '',
    });

    // Hooks for navigation and notifications
    const { showToast } = useToast();
    const navigate = useNavigate();

    /**
     * Calculate password strength with visual feedback
     * @param password - Password to evaluate
     */
    const calculatePasswordStrength = (password: string) => {
        let score = 0;
        let feedback = '';
        let color = '';

        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        switch (score) {
            case 0:
            case 1:
                feedback = 'Very Weak';
                color = 'bg-danger-500';
                break;
            case 2:
                feedback = 'Weak';
                color = 'bg-warning-500';
                break;
            case 3:
                feedback = 'Fair';
                color = 'bg-yellow-500';
                break;
            case 4:
                feedback = 'Good';
                color = 'bg-primary-500';
                break;
            case 5:
                feedback = 'Strong';
                color = 'bg-success-500';
                break;
            default:
                feedback = '';
                color = '';
        }

        setPasswordStrength({ score, feedback, color });
    };

    /**
     * Handle input field changes with validation
     * @param e - Input change event
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Clear field-specific errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        setFormData((prev: RegistrationFormData) => ({
            ...prev,
            [name]: value,
        }));

        // Calculate password strength for password field
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    /**
     * Validate form data before submission
     * @returns boolean indicating if form is valid
     */
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }

        // First name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        // Last name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (passwordStrength.score < 3) {
            newErrors.password = 'Password is too weak. Use a mix of letters, numbers, and symbols';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registrationData } = formData;

            const response = await ApiService.register(registrationData);

            if (response.success) {
                showToast({
                    type: 'success',
                    title: 'Registration Successful!',
                    message: 'Your account has been created. Please sign in to continue.',
                });

                navigate('/login');
            } else {
                showToast({
                    type: 'error',
                    title: 'Registration Failed',
                    message: response.message || 'Unable to create account',
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast({
                type: 'error',
                title: 'Network Error',
                message: 'Unable to connect to the server. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-dark-950" />

            {/* Decorative elements */}
            <div className="absolute top-1/6 left-1/6 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/6 right-1/6 w-80 h-80 bg-primary-600/5 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-md w-full space-y-8">
                {/* Header Section */}
                <div className="text-center">
                    {/* Logo extraordinária igual ao dashboard */}
                    <div className="mx-auto flex items-center justify-center space-x-3 mb-6">
                        <div className="relative group">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl flex items-center justify-center shadow-xl border border-blue-100/30 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500">
                                <div className="relative w-8 h-8">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-sm"
                                        animate={{ rotate: [0, 90] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner"></div>
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-dark-900 animate-pulse"></div>
                        </div>
                        <div className="leading-tight">
                            <h1 className="text-3xl font-extralight text-white tracking-wide">Nexus</h1>
                            <p className="text-sm text-gray-400 font-light tracking-[0.3em] uppercase">Enterprise</p>
                        </div>
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-gradient">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Join us and start your journey today
                    </p>
                </div>

                {/* Registration Form Card */}
                <div className="card animate-fade-in">
                    <div className="card-body">
                        <form className="space-y-6" onSubmit={handleSubmit}>

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
                                        placeholder="Choose a username"
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

                            {/* Name Fields Row */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={`input-field ${errors.firstName ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                                        placeholder="First name"
                                        disabled={loading}
                                    />
                                    {errors.firstName && (
                                        <div className="mt-1 flex items-center text-sm text-danger-400">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.firstName}
                                        </div>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={`input-field ${errors.lastName ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                                        placeholder="Last name"
                                        disabled={loading}
                                    />
                                    {errors.lastName && (
                                        <div className="mt-1 flex items-center text-sm text-danger-400">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.lastName}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`input-field pl-10 ${errors.email ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                                        placeholder="Enter your email"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.email && (
                                    <div className="mt-1 flex items-center text-sm text-danger-400">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.email}
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
                                        placeholder="Create a strong password"
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

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Password strength:</span>
                                            <span className={`font-medium ${passwordStrength.score >= 3 ? 'text-success-400' : 'text-warning-400'}`}>
                                                {passwordStrength.feedback}
                                            </span>
                                        </div>
                                        <div className="mt-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {errors.password && (
                                    <div className="mt-1 flex items-center text-sm text-danger-400">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                                        placeholder="Confirm your password"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Match Indicator */}
                                {formData.confirmPassword && (
                                    <div className="mt-1 flex items-center text-sm">
                                        {formData.password === formData.confirmPassword ? (
                                            <div className="flex items-center text-success-400">
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Passwords match
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-danger-400">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Passwords do not match
                                            </div>
                                        )}
                                    </div>
                                )}

                                {errors.confirmPassword && (
                                    <div className="mt-1 flex items-center text-sm text-danger-400">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.confirmPassword}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <LoadingButton
                                    type="submit"
                                    loading={loading}
                                    loadingText="Creating account..."
                                    className="w-full"
                                    variant="primary"
                                >
                                    Create Account
                                </LoadingButton>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-400">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="font-medium text-primary-400 hover:text-primary-300 transition-colors duration-200"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Requirements Card */}
                <div className="card animate-fade-in">
                    <div className="card-header">
                        <h3 className="text-sm font-medium text-gray-300">Password Requirements</h3>
                    </div>
                    <div className="card-body">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className={`flex items-center ${formData.password.length >= 8 ? 'text-success-400' : 'text-gray-400'}`}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                At least 8 characters
                            </div>
                            <div className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-success-400' : 'text-gray-400'}`}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                One lowercase letter
                            </div>
                            <div className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-success-400' : 'text-gray-400'}`}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                One uppercase letter
                            </div>
                            <div className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-success-400' : 'text-gray-400'}`}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                One number
                            </div>
                            <div className={`flex items-center ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-success-400' : 'text-gray-400'}`}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                One special character
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
