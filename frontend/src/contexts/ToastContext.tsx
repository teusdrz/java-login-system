import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast types and interfaces
interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (toast: Omit<Toast, 'id'>) => void;
    hideToast: (id: string) => void;
}

// Create Toast Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast hook for easy access
export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Individual Toast Component
const ToastItem: React.FC<{ toast: Toast; onClose: (id: string) => void }> = ({ toast, onClose }) => {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info,
    };

    const styles = {
        success: 'bg-success-50 border-success-200 text-success-800',
        error: 'bg-danger-50 border-danger-200 text-danger-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-primary-50 border-primary-200 text-primary-800',
    };

    const iconStyles = {
        success: 'text-success-600',
        error: 'text-danger-600',
        warning: 'text-yellow-600',
        info: 'text-primary-600',
    };

    const Icon = icons[toast.type];

    React.useEffect(() => {
        if (toast.duration !== 0) {
            const timer = setTimeout(() => {
                onClose(toast.id);
            }, toast.duration || 5000);

            return () => clearTimeout(timer);
        }
    }, [toast.id, toast.duration, onClose]);

    return (
        <div
            className={`
        ${styles[toast.type]}
        max-w-sm w-full bg-dark-800 border border-dark-600 rounded-lg shadow-strong 
        p-4 animate-slide-in
      `}
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${iconStyles[toast.type]}`} />
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-100">
                        {toast.title}
                    </p>
                    {toast.message && (
                        <p className="mt-1 text-sm text-gray-300">
                            {toast.message}
                        </p>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        className="bg-dark-800 rounded-md inline-flex text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        onClick={() => onClose(toast.id)}
                    >
                        <span className="sr-only">Close</span>
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Toast Provider Component
interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((toastData: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const newToast: Toast = { ...toastData, id };

        setToasts(prev => [...prev, newToast]);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const value: ToastContextType = {
        showToast,
        hideToast,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={hideToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
