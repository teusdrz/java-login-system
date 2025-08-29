import React, { useRef, useState } from 'react';
import {
    Settings,
    ArrowLeft,
    Shield,
    Bell,
    Database,
    Globe,
    Palette,
    Eye,
    EyeOff,
    Save,
    RefreshCw,
    AlertTriangle,
    Monitor,
    Smartphone
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// Professional Animation Components
const BusinessAnimatedText: React.FC<{ text: string; className?: string; delay?: number }> = ({
    text,
    className = "",
    delay = 0
}) => {
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (textRef.current) {
            gsap.fromTo(textRef.current, {
                opacity: 0,
                y: 15,
                scale: 0.98
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                delay: delay,
                ease: "power2.out"
            });
        }
    }, [text, delay]);

    return <div ref={textRef} className={className}>{text}</div>;
};

const BusinessCard: React.FC<{
    children: React.ReactNode;
    className?: string;
    delay?: number;
    hoverEffect?: boolean;
}> = ({ children, className = "", delay = 0, hoverEffect = true }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (cardRef.current) {
            gsap.fromTo(cardRef.current, {
                opacity: 0,
                y: 30,
                scale: 0.95,
                rotationX: 10
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationX: 0,
                duration: 0.8,
                delay: delay,
                ease: "power3.out"
            });

            if (hoverEffect) {
                const card = cardRef.current;

                const handleMouseEnter = () => {
                    gsap.to(card, {
                        scale: 1.02,
                        y: -5,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                };

                const handleMouseLeave = () => {
                    gsap.to(card, {
                        scale: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                };

                card.addEventListener('mouseenter', handleMouseEnter);
                card.addEventListener('mouseleave', handleMouseLeave);

                return () => {
                    card.removeEventListener('mouseenter', handleMouseEnter);
                    card.removeEventListener('mouseleave', handleMouseLeave);
                };
            }
        }
    }, [delay, hoverEffect]);

    return <div ref={cardRef} className={className}>{children}</div>;
};

interface SettingSection {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

const SystemSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const pageRef = useRef<HTMLDivElement>(null);

    const [activeSection, setActiveSection] = useState<string>('general');
    const [settings, setSettings] = useState({
        notifications: {
            emailNotifications: true,
            pushNotifications: true,
            securityAlerts: true,
            maintenanceAlerts: false
        },
        security: {
            twoFactorAuth: false,
            sessionTimeout: '30',
            passwordExpiry: '90',
            loginAttempts: '5'
        },
        system: {
            autoBackup: true,
            backupFrequency: 'daily',
            systemMaintenance: 'auto',
            logRetention: '30'
        },
        appearance: {
            theme: 'light',
            language: 'en',
            timezone: 'UTC-03:00',
            dateFormat: 'DD/MM/YYYY'
        }
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Professional color palette
    const businessColors = {
        primary: '#1e40af',
        secondary: '#059669',
        accent: '#7c3aed',
        warning: '#d97706',
        danger: '#dc2626',
        neutral: '#374151'
    };

    const settingSections: SettingSection[] = [
        {
            id: 'general',
            title: 'General Settings',
            description: 'Basic system configuration and preferences',
            icon: <Settings className="w-6 h-6" />,
            color: businessColors.primary,
            bgColor: 'bg-blue-50'
        },
        {
            id: 'security',
            title: 'Security & Privacy',
            description: 'Authentication, permissions, and security policies',
            icon: <Shield className="w-6 h-6" />,
            color: businessColors.danger,
            bgColor: 'bg-red-50'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Email alerts, push notifications, and communication settings',
            icon: <Bell className="w-6 h-6" />,
            color: businessColors.secondary,
            bgColor: 'bg-green-50'
        },
        {
            id: 'database',
            title: 'Database & Storage',
            description: 'Data management, backups, and storage configuration',
            icon: <Database className="w-6 h-6" />,
            color: businessColors.accent,
            bgColor: 'bg-purple-50'
        },
        {
            id: 'integrations',
            title: 'Integrations & APIs',
            description: 'Third-party services, webhooks, and API management',
            icon: <Globe className="w-6 h-6" />,
            color: businessColors.warning,
            bgColor: 'bg-amber-50'
        },
        {
            id: 'appearance',
            title: 'Appearance & Localization',
            description: 'Theme, language, timezone, and display preferences',
            icon: <Palette className="w-6 h-6" />,
            color: businessColors.neutral,
            bgColor: 'bg-gray-50'
        }
    ];

    const handleSaveSettings = async () => {
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully!');
        }, 2000);
    };

    const updateSetting = (section: string, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [key]: value
            }
        }));
    };

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">System Version</span>
                            <span className="text-sm text-gray-600">v2.1.4</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Last Updated</span>
                            <span className="text-sm text-gray-600">Aug 28, 2025</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Database Size</span>
                            <span className="text-sm text-gray-600">2.4 GB</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Active Users</span>
                            <span className="text-sm text-gray-600">2,847</span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Maintenance</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Automatic Updates</h4>
                            <p className="text-sm text-gray-600">Enable automatic system updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                            <p className="text-sm text-gray-600">Enable maintenance mode for system updates</p>
                        </div>
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                            Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.security.twoFactorAuth}
                                onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Session Timeout (minutes)
                            </label>
                            <select
                                value={settings.security.sessionTimeout}
                                onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="120">2 hours</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password Expiry (days)
                            </label>
                            <select
                                value={settings.security.passwordExpiry}
                                onChange={(e) => updateSetting('security', 'passwordExpiry', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="30">30 days</option>
                                <option value="60">60 days</option>
                                <option value="90">90 days</option>
                                <option value="never">Never</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Control</h3>
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                            <div>
                                <h4 className="font-medium text-red-900">Security Alert</h4>
                                <p className="text-sm text-red-700 mt-1">3 failed login attempts detected in the last hour</p>
                                <button className="text-sm text-red-600 underline mt-2">View Details</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Active Sessions</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <Monitor className="w-4 h-4 mr-2 text-gray-600" />
                                        <span>Desktop - Chrome</span>
                                    </div>
                                    <span className="text-green-600 font-medium">Current</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <Smartphone className="w-4 h-4 mr-2 text-gray-600" />
                                        <span>Mobile - Safari</span>
                                    </div>
                                    <button className="text-red-600 text-xs">Terminate</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">API Keys</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Production API Key</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-600 text-xs">Active</span>
                                        <button className="text-blue-600 text-xs">Rotate</button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Development API Key</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500 text-xs">Inactive</span>
                                        <button className="text-blue-600 text-xs">Generate</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => {
                        const labels = {
                            emailNotifications: 'Email Notifications',
                            pushNotifications: 'Push Notifications',
                            securityAlerts: 'Security Alerts',
                            maintenanceAlerts: 'Maintenance Alerts'
                        };

                        const descriptions = {
                            emailNotifications: 'Receive notifications via email',
                            pushNotifications: 'Receive browser push notifications',
                            securityAlerts: 'Important security-related notifications',
                            maintenanceAlerts: 'System maintenance and update notifications'
                        };

                        return (
                            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900">{labels[key as keyof typeof labels]}</h4>
                                    <p className="text-sm text-gray-600">{descriptions[key as keyof typeof descriptions]}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={value}
                                        onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Server
                        </label>
                        <input
                            type="text"
                            placeholder="smtp.company.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Port
                        </label>
                        <input
                            type="number"
                            placeholder="587"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="noreply@company.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <Eye className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        Test Connection
                    </button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'general':
                return renderGeneralSettings();
            case 'security':
                return renderSecuritySettings();
            case 'notifications':
                return renderNotificationSettings();
            case 'database':
                return (
                    <div className="text-center py-12">
                        <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Database Settings</h3>
                        <p className="text-gray-600">Database configuration panel coming soon...</p>
                    </div>
                );
            case 'integrations':
                return (
                    <div className="text-center py-12">
                        <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Integrations & APIs</h3>
                        <p className="text-gray-600">Integration management panel coming soon...</p>
                    </div>
                );
            case 'appearance':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme & Display</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Theme
                                    </label>
                                    <select
                                        value={settings.appearance.theme}
                                        onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="auto">Auto</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Language
                                    </label>
                                    <select
                                        value={settings.appearance.language}
                                        onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="en">English</option>
                                        <option value="pt">Português</option>
                                        <option value="es">Español</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Timezone
                                    </label>
                                    <select
                                        value={settings.appearance.timezone}
                                        onChange={(e) => updateSetting('appearance', 'timezone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="UTC-03:00">UTC-03:00 (São Paulo)</option>
                                        <option value="UTC+00:00">UTC+00:00 (London)</option>
                                        <option value="UTC-05:00">UTC-05:00 (New York)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date Format
                                    </label>
                                    <select
                                        value={settings.appearance.dateFormat}
                                        onChange={(e) => updateSetting('appearance', 'dateFormat', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return renderGeneralSettings();
        }
    };

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6"
        >
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <BusinessCard delay={0.1}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={onBack}
                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <BusinessAnimatedText
                                        text="System Settings"
                                        className="text-3xl font-bold text-gray-900"
                                        delay={0.2}
                                    />
                                    <BusinessAnimatedText
                                        text="Configure system preferences and administrative settings"
                                        className="text-lg text-gray-600 mt-2"
                                        delay={0.4}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Settings className="w-12 h-12 text-green-600" />
                            </div>
                        </div>
                    </div>
                </BusinessCard>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Settings Menu */}
                    <BusinessCard delay={0.3}>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <BusinessAnimatedText
                                text="Settings Categories"
                                className="text-lg font-bold text-gray-900 mb-6"
                                delay={0.4}
                            />

                            <div className="space-y-2">
                                {settingSections.map((section, index) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${activeSection === section.id
                                                ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div
                                                className="p-1 rounded"
                                                style={{
                                                    backgroundColor: activeSection === section.id ? `${section.color}20` : 'transparent',
                                                    color: section.color
                                                }}
                                            >
                                                {section.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm">{section.title}</h3>
                                                <p className="text-xs opacity-75 mt-1">{section.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </BusinessCard>

                    {/* Settings Content */}
                    <div className="lg:col-span-3">
                        <BusinessCard delay={0.5}>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <BusinessAnimatedText
                                        text={settingSections.find(s => s.id === activeSection)?.title || 'Settings'}
                                        className="text-xl font-bold text-gray-900"
                                        delay={0.6}
                                    />
                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={isSaving}
                                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${isSaving
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                    >
                                        {isSaving ? (
                                            <div className="flex items-center">
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </div>
                                        )}
                                    </button>
                                </div>

                                {renderContent()}
                            </div>
                        </BusinessCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
