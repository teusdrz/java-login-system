import React from 'react';
import { Loader2 } from 'lucide-react';

// Loading Spinner Component
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8',
    };

    return (
        <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
    );
};

// Loading Button Component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    loadingText?: string;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
    loading = false,
    loadingText,
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    disabled,
    ...props
}) => {
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            className={`
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${className}
      `}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    {loadingText || 'Loading...'}
                </div>
            ) : (
                children
            )}
        </button>
    );
};

// Full Page Loading Component
interface FullPageLoadingProps {
    message?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
    message = 'Loading...'
}) => {
    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
            <div className="text-center">
                <div className="mb-4">
                    <LoadingSpinner size="xl" className="mx-auto text-primary-500" />
                </div>
                <p className="text-gray-300 text-lg font-medium">{message}</p>
            </div>
        </div>
    );
};

// Skeleton Loading Component
interface SkeletonProps {
    className?: string;
    lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    lines = 1
}) => {
    return (
        <div className="animate-pulse">
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={`bg-dark-700 rounded ${className} ${index > 0 ? 'mt-2' : ''
                        }`}
                    style={{ height: '1rem' }}
                />
            ))}
        </div>
    );
};

// Table Skeleton Component
export const TableSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4">
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4" />
                    </div>
                ))}
            </div>
        </div>
    );
};
