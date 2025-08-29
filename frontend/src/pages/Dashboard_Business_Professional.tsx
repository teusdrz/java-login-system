import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import GenerateReport from './GenerateReport';
import SystemSettings from './SystemSettings';
import UserManagement from './UserManagement';
import {
    Activity,
    Users,
    DollarSign,
    TrendingUp,
    Settings,
    Shield,
    Cpu,
    Database,
    Monitor,
    Building2,
    FileText,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    Area,
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// Professional Business Text Animation Component
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

// Professional Card Animation Component
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

// Interface definitions
interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
    growth: number;
    systemLoad: number;
    memoryUsage: number;
    diskSpace: number;
    networkSpeed: number;
    efficiency: number;
    performance: number;
}

interface SystemMetrics {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    uptime: string;
    processes: number;
    temperature: number;
    powerUsage: number;
    stability: number;
}

interface MetricCard {
    id: string;
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend: number;
    color: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
}

const Dashboard: React.FC = () => {
    const { state } = useAuth();
    const { user } = state;
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Navigation state
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'reports' | 'settings' | 'users'>('dashboard');

    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        activeUsers: 0,
        revenue: 0,
        growth: 0,
        systemLoad: 0,
        memoryUsage: 0,
        diskSpace: 0,
        networkSpeed: 0,
        efficiency: 0,
        performance: 0
    });

    const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0,
        uptime: '0h 0m',
        processes: 0,
        temperature: 0,
        powerUsage: 0,
        stability: 0
    });

    // Professional color palette
    const businessColors = {
        primary: '#1e40af',      // Professional blue
        secondary: '#059669',    // Business green
        accent: '#7c3aed',       // Professional purple
        warning: '#d97706',      // Business amber
        danger: '#dc2626',       // Professional red
        neutral: '#374151',      // Business gray
        light: '#f8fafc',        // Light background
        dark: '#0f172a'          // Dark text
    };

    // Simulated data loading
    useEffect(() => {
        const loadData = () => {
            setStats({
                totalUsers: 2847,
                activeUsers: 1924,
                revenue: 284750,
                growth: 12.5,
                systemLoad: 78,
                memoryUsage: 65,
                diskSpace: 42,
                networkSpeed: 856,
                efficiency: 94.2,
                performance: 91.8
            });

            setSystemMetrics({
                cpu: 45,
                memory: 67,
                disk: 42,
                network: 89,
                uptime: '15d 8h 42m',
                processes: 124,
                temperature: 58,
                powerUsage: 275,
                stability: 99.2
            });
        };

        const timer = setTimeout(loadData, 500);
        return () => clearTimeout(timer);
    }, []);

    // Business metric cards configuration
    const metricCards: MetricCard[] = [
        {
            id: 'users',
            title: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: <Users className="w-8 h-8" />,
            trend: 8.2,
            color: businessColors.primary,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-900',
            borderColor: 'border-blue-200'
        },
        {
            id: 'revenue',
            title: 'Monthly Revenue',
            value: `$${(stats.revenue / 1000).toFixed(1)}K`,
            icon: <DollarSign className="w-8 h-8" />,
            trend: 12.5,
            color: businessColors.secondary,
            bgColor: 'bg-green-50',
            textColor: 'text-green-900',
            borderColor: 'border-green-200'
        },
        {
            id: 'performance',
            title: 'System Performance',
            value: `${stats.performance}%`,
            icon: <Activity className="w-8 h-8" />,
            trend: 5.8,
            color: businessColors.accent,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-900',
            borderColor: 'border-purple-200'
        },
        {
            id: 'efficiency',
            title: 'Operational Efficiency',
            value: `${stats.efficiency}%`,
            icon: <TrendingUp className="w-8 h-8" />,
            trend: 3.2,
            color: businessColors.warning,
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-900',
            borderColor: 'border-amber-200'
        }
    ];

    // Chart data
    const performanceData = [
        { name: 'Jan', users: 2400, revenue: 240000, efficiency: 88 },
        { name: 'Feb', users: 2210, revenue: 221000, efficiency: 90 },
        { name: 'Mar', users: 2290, revenue: 229000, efficiency: 92 },
        { name: 'Apr', users: 2000, revenue: 200000, efficiency: 89 },
        { name: 'May', users: 2181, revenue: 218100, efficiency: 94 },
        { name: 'Jun', users: 2500, revenue: 250000, efficiency: 95 },
        { name: 'Jul', users: 2847, revenue: 284750, efficiency: 94 }
    ];

    const systemData = [
        { subject: 'CPU', A: systemMetrics.cpu, fullMark: 100 },
        { subject: 'Memory', A: systemMetrics.memory, fullMark: 100 },
        { subject: 'Disk', A: systemMetrics.disk, fullMark: 100 },
        { subject: 'Network', A: systemMetrics.network, fullMark: 100 },
        { subject: 'Stability', A: systemMetrics.stability, fullMark: 100 }
    ];

    const distributionData = [
        { name: 'Desktop', value: 65, color: businessColors.primary },
        { name: 'Mobile', value: 28, color: businessColors.secondary },
        { name: 'Tablet', value: 7, color: businessColors.accent }
    ];

    // Render different pages based on current selection
    if (currentPage === 'reports') {
        return <GenerateReport onBack={() => setCurrentPage('dashboard')} />;
    }

    if (currentPage === 'settings') {
        return <SystemSettings onBack={() => setCurrentPage('dashboard')} />;
    }

    if (currentPage === 'users') {
        return <UserManagement onBack={() => setCurrentPage('dashboard')} />;
    }

    return (
        <div
            ref={dashboardRef}
            className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6"
        >
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Professional Header */}
                <BusinessCard delay={0.1}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <BusinessAnimatedText
                                    text={`Welcome back, ${user?.username || 'Executive'}`}
                                    className="text-3xl font-bold text-gray-900"
                                    delay={0.2}
                                />
                                <BusinessAnimatedText
                                    text="Enterprise Business Intelligence Dashboard"
                                    className="text-lg text-gray-600 mt-2"
                                    delay={0.4}
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <BusinessAnimatedText
                                        text={new Date().toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        className="text-sm text-gray-500"
                                        delay={0.6}
                                    />
                                    <BusinessAnimatedText
                                        text={new Date().toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        className="text-lg font-semibold text-gray-700"
                                        delay={0.8}
                                    />
                                </div>
                                <Building2 className="w-12 h-12 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </BusinessCard>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metricCards.map((card, index) => (
                        <BusinessCard key={card.id} delay={0.2 + index * 0.1}>
                            <div className={`${card.bgColor} ${card.borderColor} border rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                                        {card.icon}
                                    </div>
                                    <div className={`flex items-center ${card.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {card.trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                        <BusinessAnimatedText
                                            text={`${Math.abs(card.trend)}%`}
                                            className="text-sm font-medium ml-1"
                                            delay={0.4 + index * 0.1}
                                        />
                                    </div>
                                </div>
                                <BusinessAnimatedText
                                    text={card.title}
                                    className={`text-sm font-medium ${card.textColor} mb-2`}
                                    delay={0.6 + index * 0.1}
                                />
                                <BusinessAnimatedText
                                    text={card.value.toString()}
                                    className={`text-3xl font-bold ${card.textColor}`}
                                    delay={0.8 + index * 0.1}
                                />
                            </div>
                        </BusinessCard>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Performance Trends */}
                    <BusinessCard delay={0.8}>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <BusinessAnimatedText
                                text="Performance Trends"
                                className="text-xl font-bold text-gray-900 mb-6"
                                delay={0.9}
                            />
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                    <YAxis stroke="#64748b" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="efficiency"
                                        fill="url(#colorEfficiency)"
                                        stroke={businessColors.accent}
                                        strokeWidth={2}
                                    />
                                    <Bar dataKey="users" fill={businessColors.primary} opacity={0.7} />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke={businessColors.secondary}
                                        strokeWidth={3}
                                        dot={{ fill: businessColors.secondary, r: 4 }}
                                    />
                                    <defs>
                                        <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={businessColors.accent} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={businessColors.accent} stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </BusinessCard>

                    {/* System Health Radar */}
                    <BusinessCard delay={1.0}>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <BusinessAnimatedText
                                text="System Health Monitor"
                                className="text-xl font-bold text-gray-900 mb-6"
                                delay={1.1}
                            />
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={systemData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" className="text-sm text-gray-600" />
                                    <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs text-gray-400" />
                                    <Radar
                                        name="System Health"
                                        dataKey="A"
                                        stroke={businessColors.primary}
                                        fill={businessColors.primary}
                                        fillOpacity={0.2}
                                        strokeWidth={2}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </BusinessCard>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Platform Distribution */}
                    <BusinessCard delay={1.2}>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <BusinessAnimatedText
                                text="Platform Distribution"
                                className="text-xl font-bold text-gray-900 mb-6"
                                delay={1.3}
                            />
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={distributionData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}%`}
                                    >
                                        {distributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </BusinessCard>

                    {/* System Status */}
                    <BusinessCard delay={1.4}>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <BusinessAnimatedText
                                text="System Status"
                                className="text-xl font-bold text-gray-900 mb-6"
                                delay={1.5}
                            />
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Cpu className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-gray-700">CPU Usage</span>
                                    </div>
                                    <BusinessAnimatedText
                                        text={`${systemMetrics.cpu}%`}
                                        className="font-semibold text-gray-900"
                                        delay={1.6}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Database className="w-5 h-5 text-green-600 mr-2" />
                                        <span className="text-gray-700">Memory</span>
                                    </div>
                                    <BusinessAnimatedText
                                        text={`${systemMetrics.memory}%`}
                                        className="font-semibold text-gray-900"
                                        delay={1.7}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Monitor className="w-5 h-5 text-purple-600 mr-2" />
                                        <span className="text-gray-700">Uptime</span>
                                    </div>
                                    <BusinessAnimatedText
                                        text={systemMetrics.uptime}
                                        className="font-semibold text-gray-900"
                                        delay={1.8}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Shield className="w-5 h-5 text-amber-600 mr-2" />
                                        <span className="text-gray-700">Security</span>
                                    </div>
                                    <BusinessAnimatedText
                                        text="Active"
                                        className="font-semibold text-green-600"
                                        delay={1.9}
                                    />
                                </div>
                            </div>
                        </div>
                    </BusinessCard>

                    {/* Quick Actions */}
                    <BusinessCard delay={1.6}>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <BusinessAnimatedText
                                text="Quick Actions"
                                className="text-xl font-bold text-gray-900 mb-6"
                                delay={1.7}
                            />
                            <div className="space-y-3">
                                <button
                                    onClick={() => setCurrentPage('reports')}
                                    className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                >
                                    <div className="flex items-center">
                                        <FileText className="w-5 h-5 text-blue-600 mr-3" />
                                        <span className="text-gray-700">Generate Report</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage('settings')}
                                    className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
                                >
                                    <div className="flex items-center">
                                        <Settings className="w-5 h-5 text-green-600 mr-3" />
                                        <span className="text-gray-700">System Settings</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage('users')}
                                    className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                                >
                                    <div className="flex items-center">
                                        <Users className="w-5 h-5 text-purple-600 mr-3" />
                                        <span className="text-gray-700">User Management</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </BusinessCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
