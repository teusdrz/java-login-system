import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Role } from '../types/api';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Observer } from 'gsap/Observer';
import { Flip } from 'gsap/Flip';
import {
    BarChart3, Users, FileText, Settings, AlertTriangle, Shield, UserPlus,
    Search, Filter, MoreVertical, Eye, Edit, Trash2, CheckCircle, XCircle,
    Clock, Bell, TrendingUp, Download, Upload, Save, RefreshCw, LogOut,
    Activity, Database, Server, Wifi, WifiOff, Plus, Minus, ChevronDown,
    ChevronUp, Lock, Unlock, Zap, Target, Globe, Monitor, HardDrive,
    Cpu, MemoryStick, Network, Calendar, Mail, Phone, AlertCircle, CheckSquare,
    TrendingDown, Home, Sparkles, Layers, Crosshair, Waves, Orbit, Palette
} from 'lucide-react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';

// Registrar plugins do GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin, Observer, Flip);

// Interfaces
interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    onlineUsers: number;
    totalSessions: number;
    avgSessionTime: string;
    systemUptime: string;
    errorRate: number;
    revenue: number;
    growth: number;
}

interface ActivityLog {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    type: 'success' | 'warning' | 'error' | 'info';
    details?: string;
    ip?: string;
}

interface SystemMetrics {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    temperature: number;
    uptime: string;
}

interface SystemSettings {
    maintenance: boolean;
    registration: boolean;
    notifications: boolean;
    autoBackup: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    emailVerification: boolean;
    twoFactorAuth: boolean;
    apiRateLimit: number;
    maxFileSize: number;
}

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    timestamp: string;
    read: boolean;
}

type ViewType = 'overview' | 'users' | 'activity' | 'settings' | 'analytics' | 'notifications';

// Mock Data
const mockUsers: User[] = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Administrator',
        lastName: 'System',
        role: Role.ADMIN,
        active: true,
        createdAt: '2023-12-31',
        lastModifiedAt: '2024-01-15',
        failedLoginAttempts: 0
    },
    {
        id: '2',
        username: 'moderator1',
        email: 'mod1@example.com',
        firstName: 'John',
        lastName: 'Moderator',
        role: Role.MODERATOR,
        active: true,
        createdAt: '2024-01-14',
        lastModifiedAt: '2024-01-15',
        failedLoginAttempts: 0
    },
    {
        id: '3',
        username: 'user1',
        email: 'user1@example.com',
        firstName: 'Jane',
        lastName: 'User',
        role: Role.USER,
        active: true,
        createdAt: '2024-01-31',
        lastModifiedAt: '2024-02-01',
        failedLoginAttempts: 0
    },
    {
        id: '4',
        username: 'user2',
        email: 'user2@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
        role: Role.USER,
        active: false,
        createdAt: '2024-02-09',
        lastModifiedAt: '2024-02-10',
        failedLoginAttempts: 3
    }
];

const mockActivityLogs: ActivityLog[] = [
    {
        id: '1',
        action: 'User Login',
        user: 'admin',
        timestamp: new Date().toLocaleString(),
        type: 'success',
        details: 'Successful login from dashboard',
        ip: '192.168.1.100'
    },
    {
        id: '2',
        action: 'User Created',
        user: 'admin',
        timestamp: new Date(Date.now() - 300000).toLocaleString(),
        type: 'success',
        details: 'New user account created',
        ip: '192.168.1.100'
    },
    {
        id: '3',
        action: 'Failed Login Attempt',
        user: 'unknown',
        timestamp: new Date(Date.now() - 600000).toLocaleString(),
        type: 'warning',
        details: 'Invalid credentials provided',
        ip: '192.168.1.150'
    },
    {
        id: '4',
        action: 'System Update',
        user: 'system',
        timestamp: new Date(Date.now() - 900000).toLocaleString(),
        type: 'info',
        details: 'System security update applied',
        ip: 'localhost'
    }
];

const mockNotifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Sistema Atualizado',
        message: 'O sistema foi atualizado com sucesso para a versão 2.1.4',
        type: 'success',
        timestamp: new Date().toLocaleString(),
        read: false
    },
    {
        id: '2',
        title: 'Alto Uso de CPU',
        message: 'O uso de CPU está acima de 85% nos últimos 10 minutos',
        type: 'warning',
        timestamp: new Date(Date.now() - 600000).toLocaleString(),
        read: false
    },
    {
        id: '3',
        title: 'Backup Completado',
        message: 'Backup automático diário foi completado com sucesso',
        type: 'info',
        timestamp: new Date(Date.now() - 86400000).toLocaleString(),
        read: true
    }
];

// Helper Functions
const getActivityIcon = (type: ActivityLog['type']): React.ReactElement => {
    switch (type) {
        case 'success':
            return <CheckCircle className="h-5 w-5" />;
        case 'warning':
            return <AlertTriangle className="h-5 w-5" />;
        case 'error':
            return <AlertCircle className="h-5 w-5" />;
        case 'info':
        default:
            return <CheckSquare className="h-5 w-5" />;
    }
};

// Componente de Item de Navegação com Animações Extraordinárias
interface NavigationItemProps {
    item: {
        id: string;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
    };
    index: number;
    isActive: boolean;
    onClick: () => void;
    notificationCount: number;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ 
    item, 
    index, 
    isActive, 
    onClick, 
    notificationCount 
}) => {
    const itemRef = useRef<HTMLButtonElement>(null);
    const iconRef = useRef<HTMLSpanElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const notificationRef = useRef<HTMLSpanElement>(null);

    const IconComponent = item.icon;

    useGSAP(() => {
        // Animação de entrada extraordinária
        if (itemRef.current) {
            gsap.fromTo(itemRef.current, 
                {
                    opacity: 0,
                    x: -100,
                    rotationY: -90,
                    scale: 0.5,
                    filter: "blur(10px)"
                },
                {
                    opacity: 1,
                    x: 0,
                    rotationY: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 1.2,
                    ease: "elastic.out(1, 0.5)",
                    delay: index * 0.15
                }
            );
        }

        // Animações de hover extraordinárias
        const handleHover = () => {
            const tl = gsap.timeline();
            
            tl
                // Expansão com brilho
                .to(itemRef.current, {
                    scale: 1.05,
                    x: 10,
                    boxShadow: "10px 0 30px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.1)",
                    background: "linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
                    borderLeft: "4px solid #3b82f6",
                    duration: 0.5,
                    ease: "back.out(1.4)"
                })
                // Ícone com rotação e pulsação
                .to(iconRef.current, {
                    scale: 1.3,
                    rotation: 360,
                    color: "#3b82f6",
                    textShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                }, "-=0.3")
                // Label com efeito de brilho
                .to(labelRef.current, {
                    scale: 1.1,
                    color: "#1e40af",
                    textShadow: "0 0 5px rgba(59, 130, 246, 0.5)",
                    duration: 0.3,
                    ease: "power2.out"
                }, "-=0.4");

            // Efeito de partículas flutuantes
            gsap.to(itemRef.current, {
                background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
                duration: 1,
                ease: "sine.out"
            });
        };

        const handleLeave = () => {
            if (!isActive) {
                const tl = gsap.timeline();
                
                tl
                    .to(itemRef.current, {
                        scale: 1,
                        x: 0,
                        boxShadow: "none",
                        background: "transparent",
                        borderLeft: "none",
                        duration: 0.4,
                        ease: "power2.out"
                    })
                    .to(iconRef.current, {
                        scale: 1,
                        rotation: 0,
                        color: "#6b7280",
                        textShadow: "none",
                        duration: 0.3,
                        ease: "power2.out"
                    }, "-=0.2")
                    .to(labelRef.current, {
                        scale: 1,
                        color: "#6b7280",
                        textShadow: "none",
                        duration: 0.3,
                        ease: "power2.out"
                    }, "-=0.3");
            }
        };

        const button = itemRef.current;
        if (button) {
            button.addEventListener('mouseenter', handleHover);
            button.addEventListener('mouseleave', handleLeave);

            return () => {
                button.removeEventListener('mouseenter', handleHover);
                button.removeEventListener('mouseleave', handleLeave);
            };
        }
    }, [isActive, index]);

    // Animação quando ativo
    useGSAP(() => {
        if (itemRef.current && isActive) {
            gsap.to(itemRef.current, {
                scale: 1.05,
                x: 15,
                background: "linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.15) 100%)",
                boxShadow: "10px 0 30px rgba(59, 130, 246, 0.4), inset 0 0 30px rgba(59, 130, 246, 0.1)",
                borderLeft: "6px solid #3b82f6",
                duration: 0.6,
                ease: "back.out(1.2)"
            });

            gsap.to(iconRef.current, {
                scale: 1.2,
                color: "#1e40af",
                textShadow: "0 0 15px rgba(59, 130, 246, 1)",
                duration: 0.5,
                ease: "power2.out"
            });

            gsap.to(labelRef.current, {
                color: "#1e40af",
                fontWeight: "bold",
                textShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
                duration: 0.4,
                ease: "power2.out"
            });
        } else if (itemRef.current) {
            gsap.to(itemRef.current, {
                scale: 1,
                x: 0,
                background: "transparent",
                boxShadow: "none",
                borderLeft: "none",
                duration: 0.4,
                ease: "power2.out"
            });

            gsap.to(iconRef.current, {
                scale: 1,
                color: "#6b7280",
                textShadow: "none",
                duration: 0.3,
                ease: "power2.out"
            });

            gsap.to(labelRef.current, {
                color: "#6b7280",
                fontWeight: "normal",
                textShadow: "none",
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }, [isActive]);

    // Animação de notificação
    useGSAP(() => {
        if (notificationRef.current && notificationCount > 0) {
            gsap.fromTo(notificationRef.current,
                { scale: 0, rotation: -180 },
                { 
                    scale: 1, 
                    rotation: 0, 
                    duration: 0.6, 
                    ease: "elastic.out(1, 0.3)" 
                }
            );

            // Pulsação contínua
            gsap.to(notificationRef.current, {
                scale: 1.2,
                duration: 1,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }, [notificationCount]);

    return (
        <button
            ref={itemRef}
            onClick={onClick}
            className="nav-item w-full flex items-center px-3 py-3 mb-2 text-sm font-medium rounded-lg transition-all duration-200 transform-gpu"
            style={{ perspective: '1000px' }}
        >
            <span ref={iconRef} className="flex items-center justify-center mr-3">
                <IconComponent className="w-5 h-5" />
            </span>
            <span ref={labelRef} className="flex-1 text-left">
                {item.label}
            </span>
            {notificationCount > 0 && (
                <span 
                    ref={notificationRef}
                    className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 transform-gpu"
                >
                    {notificationCount}
                </span>
            )}
        </button>
    );
};

const Dashboard: React.FC = () => {
    const { state } = useAuth();
    const { user } = state;
    
    // Refs for GSAP animations
    const containerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const statsCardsRef = useRef<HTMLDivElement>(null);
    const chartsRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    
    // States
    const [currentView, setCurrentView] = useState<ViewType>('overview');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 1247,
        activeUsers: 892,
        newUsersToday: 23,
        onlineUsers: 156,
        totalSessions: 3245,
        avgSessionTime: '24m',
        systemUptime: '15d 8h 32m',
        errorRate: 2.1,
        revenue: 45890,
        growth: 12.5
    });
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
    const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
        cpu: 45,
        memory: 68,
        disk: 34,
        network: 23,
        temperature: 42,
        uptime: '15d 8h 32m'
    });
    const [systemSettings, setSystemSettings] = useState<SystemSettings>({
        maintenance: false,
        registration: true,
        notifications: true,
        autoBackup: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        emailVerification: true,
        twoFactorAuth: false,
        apiRateLimit: 1000,
        maxFileSize: 10
    });
    const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<Role | 'all'>('all');
    const [showUserForm, setShowUserForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [realTimeUpdates, setRealTimeUpdates] = useState(true);

    const isModerator = user?.role === Role.ADMIN || user?.role === Role.MODERATOR;

    // GSAP Animações Extraordinárias e Avançadas
    useGSAP(() => {
        // Animação de entrada com morfismo fluido e efeitos de partículas
        if (containerRef.current) {
            gsap.set([sidebarRef.current, mainContentRef.current], { 
                opacity: 0,
                scale: 0.95,
                rotationY: -15,
                transformOrigin: "center center",
                filter: "blur(10px)"
            });
            
            // Timeline mestra com efeitos extraordinários
            const masterTL = gsap.timeline();
            
            masterTL
                // Entrada da sidebar com efeito de cristal
                .to(sidebarRef.current, { 
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    filter: "blur(0px)",
                    duration: 1.2, 
                    ease: "elastic.out(1, 0.8)",
                    transformOrigin: "left center"
                })
                // Efeito de ondas propagando pelo sidebar
                .to(sidebarRef.current, {
                    boxShadow: "0 0 50px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(59, 130, 246, 0.1)",
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.6")
                // Entrada do conteúdo principal com efeito holográfico
                .to(mainContentRef.current, { 
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    filter: "blur(0px)",
                    duration: 1.0, 
                    ease: "back.out(1.7)",
                    transformOrigin: "center center"
                }, "-=0.8")
                // Efeito de brilho holográfico
                .to(mainContentRef.current, {
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%)",
                    duration: 1.5,
                    ease: "sine.inOut"
                }, "-=0.5");

            // Animação contínua de respiração para elementos ativos
            gsap.to(sidebarRef.current, {
                scale: 1.02,
                duration: 3,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }, []);

    // Animação de transição de conteúdo com efeito de quebra-cabeça quântico
    useGSAP(() => {
        if (mainContentRef.current) {
            const children = Array.from(mainContentRef.current.children);
            
            // Efeito de saída com fragmentação
            gsap.fromTo(children, 
                { 
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    scale: 1,
                    filter: "blur(0px)"
                },
                { 
                    opacity: 0,
                    y: -50,
                    rotationX: 90,
                    scale: 0.8,
                    filter: "blur(5px)",
                    duration: 0.4, 
                    stagger: {
                        amount: 0.3,
                        from: "random",
                        ease: "power3.in"
                    }
                }
            ).then(() => {
                // Efeito de entrada com materialização quântica
                gsap.fromTo(children,
                    { 
                        opacity: 0,
                        y: 100,
                        rotationX: -90,
                        scale: 0.5,
                        filter: "blur(15px) brightness(0.5)",
                        boxShadow: "0 0 0 rgba(59, 130, 246, 0)"
                    },
                    { 
                        opacity: 1,
                        y: 0,
                        rotationX: 0,
                        scale: 1,
                        filter: "blur(0px) brightness(1)",
                        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)",
                        duration: 0.8, 
                        stagger: {
                            amount: 0.6,
                            from: "center",
                            ease: "back.out(2)"
                        }
                    }
                );
            });
        }
    }, [currentView]);

    // Animação de cartões de estatísticas com efeito de levitação magnética
    useGSAP(() => {
        if (statsCardsRef.current && currentView === 'overview') {
            const cards = Array.from(statsCardsRef.current.children);
            
            // Reset inicial
            gsap.set(cards, {
                opacity: 0,
                y: 200,
                rotationY: 45,
                scale: 0.3,
                filter: "blur(20px)",
                transformOrigin: "center bottom"
            });

            // Animação de entrada com efeito gravitacional
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                rotationY: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1.2,
                stagger: {
                    amount: 0.8,
                    ease: "power4.out"
                },
                ease: "elastic.out(1, 0.6)"
            });

            // Efeito de levitação contínua para cada cartão
            cards.forEach((card, index) => {
                gsap.to(card, {
                    y: Math.sin(index * 0.5) * 10,
                    rotation: Math.cos(index * 0.3) * 2,
                    duration: 3 + (index * 0.5),
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: index * 0.2
                });

                // Efeito de auroras nos cartões
                gsap.to(card, {
                    boxShadow: `0 10px 30px rgba(${59 + index * 20}, ${130 + index * 15}, 246, ${0.15 + index * 0.05})`,
                    duration: 2,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });
            });
        }
    }, [currentView]);

    // Real-time data updates with GSAP
    useEffect(() => {
        const updateInterval = setInterval(() => {
            if (realTimeUpdates) {
                // Animate metric updates
                const newMetrics = {
                    cpu: Math.max(10, Math.min(90, systemMetrics.cpu + (Math.random() - 0.5) * 10)),
                    memory: Math.max(20, Math.min(95, systemMetrics.memory + (Math.random() - 0.5) * 5)),
                    disk: Math.max(10, Math.min(80, systemMetrics.disk + (Math.random() - 0.5) * 2)),
                    network: Math.max(5, Math.min(50, systemMetrics.network + (Math.random() - 0.5) * 8)),
                    temperature: Math.max(35, Math.min(70, systemMetrics.temperature + (Math.random() - 0.5) * 3)),
                    uptime: systemMetrics.uptime
                };

                // GSAP number animation
                gsap.to(systemMetrics, {
                    duration: 1,
                    ...newMetrics,
                    ease: "power2.out",
                    onUpdate: () => {
                        setSystemMetrics({ ...systemMetrics });
                    }
                });
            }
        }, 3000);

        return () => clearInterval(updateInterval);
    }, [realTimeUpdates, systemMetrics]);

    // Load data
    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            // Simulate API call with loading animation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Animate loading completion
            if (statsCardsRef.current) {
                gsap.fromTo(statsCardsRef.current.children,
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
                );
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    // Navigation handler with GSAP animation
    const handleViewChange = (view: ViewType) => {
        if (view === currentView) return;

        // Animate out current content
        if (mainContentRef.current) {
            gsap.to(mainContentRef.current.children, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.in",
                onComplete: () => {
                    setCurrentView(view);
                }
            });
        }
    };

    // User management functions
    const handleCreateUser = async (userData: any) => {
        try {
            const newUser: User = {
                id: Date.now().toString(),
                username: userData.username,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
                active: userData.isActive,
                createdAt: new Date().toISOString().split('T')[0],
                lastModifiedAt: new Date().toISOString().split('T')[0],
                failedLoginAttempts: 0
            };

            // Animate new user addition
            setUsers(prev => [newUser, ...prev]);
            setShowUserForm(false);
            
            // Add activity log
            const logEntry: ActivityLog = {
                id: Date.now().toString(),
                action: 'User Created',
                user: user?.username || 'system',
                timestamp: new Date().toLocaleString(),
                type: 'success',
                details: `Created user: ${userData.username}`,
                ip: '192.168.1.100'
            };
            setActivityLogs(prev => [logEntry, ...prev]);

            // GSAP success animation
            gsap.from('.user-row:first-child', {
                scale: 0.8,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(1.7)"
            });

        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

        try {
            const userToDelete = users.find(u => u.id === userId);
            
            // Animate user removal
            const userElement = document.querySelector(`[data-user-id="${userId}"]`);
            if (userElement) {
                gsap.to(userElement, {
                    opacity: 0,
                    x: -50,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        setUsers(prev => prev.filter(u => u.id !== userId));
                    }
                });
            } else {
                setUsers(prev => prev.filter(u => u.id !== userId));
            }
            
            // Add activity log
            const logEntry: ActivityLog = {
                id: Date.now().toString(),
                action: 'User Deleted',
                user: user?.username || 'system',
                timestamp: new Date().toLocaleString(),
                type: 'warning',
                details: `Deleted user: ${userToDelete?.username}`,
                ip: '192.168.1.100'
            };
            setActivityLogs(prev => [logEntry, ...prev]);

        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleToggleUserStatus = async (userId: string) => {
        try {
            const userToToggle = users.find(u => u.id === userId);
            setUsers(prev => prev.map(u => 
                u.id === userId 
                    ? { ...u, active: !u.active, lastModifiedAt: new Date().toISOString().split('T')[0] }
                    : u
            ));
            
            // Add activity log
            const logEntry: ActivityLog = {
                id: Date.now().toString(),
                action: `User ${userToToggle?.active ? 'Deactivated' : 'Activated'}`,
                user: user?.username || 'system',
                timestamp: new Date().toLocaleString(),
                type: 'success',
                details: `${userToToggle?.active ? 'Deactivated' : 'Activated'} user: ${userToToggle?.username}`,
                ip: '192.168.1.100'
            };
            setActivityLogs(prev => [logEntry, ...prev]);

            // GSAP status change animation
            const statusElement = document.querySelector(`[data-user-id="${userId}"] .status-badge`);
            if (statusElement) {
                gsap.to(statusElement, {
                    scale: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out"
                });
            }

        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const handleUpdateSettings = async (newSettings: Partial<SystemSettings>) => {
        try {
            setSystemSettings(prev => ({ ...prev, ...newSettings }));
            
            // Add activity log
            const logEntry: ActivityLog = {
                id: Date.now().toString(),
                action: 'Settings Updated',
                user: user?.username || 'system',
                timestamp: new Date().toLocaleString(),
                type: 'success',
                details: 'System settings modified',
                ip: '192.168.1.100'
            };
            setActivityLogs(prev => [logEntry, ...prev]);

            // GSAP settings save animation
            gsap.to('.settings-form', {
                scale: 1.02,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });

        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    // Chart data
    const userGrowthData = [
        { month: 'Jan', users: 120 },
        { month: 'Feb', users: 145 },
        { month: 'Mar', users: 167 },
        { month: 'Apr', users: 189 },
        { month: 'May', users: 203 },
        { month: 'Jun', users: 234 },
        { month: 'Jul', users: 267 },
        { month: 'Aug', users: 289 }
    ];

    const roleDistributionData = [
        { name: 'Usuários', value: users.filter(u => u.role === Role.USER).length, color: '#3B82F6' },
        { name: 'Moderadores', value: users.filter(u => u.role === Role.MODERATOR).length, color: '#10B981' },
        { name: 'Admins', value: users.filter(u => u.role === Role.ADMIN).length, color: '#F59E0B' }
    ];

    // Helper functions
    const getStatusBadge = (isActive: boolean) => (
        <span className={`status-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
            {isActive ? (
                <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Ativo
                </>
            ) : (
                <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Inativo
                </>
            )}
        </span>
    );

    const getRoleBadge = (role: Role) => {
        const roleConfig = {
            [Role.ADMIN]: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', icon: Shield },
            [Role.MODERATOR]: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: UserPlus },
            [Role.USER]: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', icon: Users }
        };

        const config = roleConfig[role];
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent className="w-3 h-3 mr-1" />
                {role}
            </span>
        );
    };

    const getActivityIcon = (type: ActivityLog['type']) => {
        const iconProps = { className: "h-4 w-4" };
        switch (type) {
            case 'success': return <CheckCircle {...iconProps} className="h-4 w-4 text-green-500" />;
            case 'warning': return <AlertTriangle {...iconProps} className="h-4 w-4 text-yellow-500" />;
            case 'error': return <XCircle {...iconProps} className="h-4 w-4 text-red-500" />;
            case 'info': return <Bell {...iconProps} className="h-4 w-4 text-blue-500" />;
            default: return <Activity {...iconProps} />;
        }
    };

    // Filter users
    const filteredUsers = users.filter(u => {
        const matchesSearch = !searchTerm || 
            (u.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        
        return matchesSearch && matchesRole;
    });

    // Navigation items
    const navigationItems = [
        { id: 'overview', label: 'Dashboard', icon: BarChart3 },
        { id: 'users', label: 'Usuários', icon: Users },
        { id: 'activity', label: 'Atividade', icon: Activity },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'notifications', label: 'Notificações', icon: Bell },
        { id: 'settings', label: 'Configurações', icon: Settings }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <div ref={sidebarRef} className="w-64 bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">AdminPanel</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sistema de Gestão</p>
                        </div>
                    </div>
                </div>

                <nav className="mt-6">
                    <div className="px-3">
                        {navigationItems.map((item, index) => {
                            const IconComponent = item.icon;
                            const isActive = currentView === item.id;
                            
                            return (
                                <NavigationItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    isActive={isActive}
                                    onClick={() => handleViewChange(item.id as ViewType)}
                                    notificationCount={item.id === 'notifications' ? notifications.filter(n => !n.read).length : 0}
                                />
                            );
                        })}
                    </div>
                </nav>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {user?.username?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div ref={mainContentRef} className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {navigationItems.find(item => item.id === currentView)?.label}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {currentView === 'overview' && 'Visão geral do sistema e métricas principais'}
                                    {currentView === 'users' && 'Gerencie usuários, roles e permissões'}
                                    {currentView === 'activity' && 'Monitor de atividades e logs do sistema'}
                                    {currentView === 'analytics' && 'Análises avançadas e relatórios'}
                                    {currentView === 'notifications' && 'Central de notificações e alertas'}
                                    {currentView === 'settings' && 'Configurações do sistema e segurança'}
                                </p>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${realTimeUpdates ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {realTimeUpdates ? 'Tempo Real' : 'Pausado'}
                                    </span>
                                    <button
                                        onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        {realTimeUpdates ? 'Pausar' : 'Ativar'}
                                    </button>
                                </div>
                                
                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <LoadingScreen />
                    ) : (
                        <>
                            {currentView === 'overview' && (
                                <OverviewSection 
                                    stats={stats}
                                    systemMetrics={systemMetrics}
                                    userGrowthData={userGrowthData}
                                    roleDistributionData={roleDistributionData}
                                    recentActivity={activityLogs.slice(0, 5)}
                                    statsCardsRef={statsCardsRef}
                                    chartsRef={chartsRef}
                                />
                            )}
                            
                            {currentView === 'users' && (
                                <UsersSection 
                                    users={filteredUsers}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    filterRole={filterRole}
                                    setFilterRole={setFilterRole}
                                    showUserForm={showUserForm}
                                    setShowUserForm={setShowUserForm}
                                    selectedUser={selectedUser}
                                    setSelectedUser={setSelectedUser}
                                    onCreateUser={handleCreateUser}
                                    onDeleteUser={handleDeleteUser}
                                    onToggleStatus={handleToggleUserStatus}
                                    getStatusBadge={getStatusBadge}
                                    getRoleBadge={getRoleBadge}
                                    isModerator={isModerator}
                                    tableRef={tableRef}
                                />
                            )}
                            
                            {currentView === 'activity' && (
                                <ActivitySection 
                                    activityLogs={activityLogs}
                                    getActivityIcon={getActivityIcon}
                                />
                            )}
                            
                            {currentView === 'analytics' && (
                                <AnalyticsSection 
                                    stats={stats}
                                    userGrowthData={userGrowthData}
                                    users={users}
                                />
                            )}
                            
                            {currentView === 'notifications' && (
                                <NotificationsSection 
                                    notifications={notifications}
                                    setNotifications={setNotifications}
                                />
                            )}
                            
                            {currentView === 'settings' && (
                                <SettingsSection 
                                    settings={systemSettings}
                                    onUpdateSettings={handleUpdateSettings}
                                    isModerator={isModerator}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

// Loading Screen Component
const LoadingScreen: React.FC = () => {
    const loadingRef = useRef<HTMLDivElement>(null);
    
    useGSAP(() => {
        if (loadingRef.current) {
            // Animação quântica de loading com efeito de partículas
            gsap.set('.loading-dot', { 
                scale: 0,
                opacity: 0,
                rotationY: 180,
                transformOrigin: "center center"
            });
            
            // Timeline complexa para loading extraordinário
            const loadingTL = gsap.timeline({ repeat: -1 });
            
            loadingTL
                // Materialização das partículas
                .to('.loading-dot', {
                    scale: 1,
                    opacity: 1,
                    rotationY: 0,
                    duration: 0.8,
                    stagger: {
                        amount: 0.6,
                        from: "center",
                        ease: "back.out(1.7)"
                    }
                })
                // Efeito de pulsação energética
                .to('.loading-dot', {
                    scale: 1.5,
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)",
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.out"
                })
                // Retorno com ondas
                .to('.loading-dot', {
                    scale: 1,
                    boxShadow: "0 0 5px rgba(59, 130, 246, 0.3)",
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.in"
                })
                // Rotação orbital
                .to('.loading-dot', {
                    rotation: 360,
                    duration: 1.5,
                    ease: "power1.inOut"
                }, "-=0.8")
                // Pausa antes de repetir
                .to('.loading-dot', {
                    scale: 0.8,
                    duration: 0.3,
                    ease: "power2.inOut"
                })
                .to('.loading-dot', {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.inOut"
                });

            // Efeito de halo contínuo no contêiner
            gsap.to(loadingRef.current, {
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }, []);

    return (
        <div ref={loadingRef} className="flex items-center justify-center h-96">
            <div className="text-center">
                <div className="flex space-x-2 mb-4">
                    <div className="loading-dot w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="loading-dot w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="loading-dot w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
            </div>
        </div>
    );
};

// Overview Section Component
interface OverviewSectionProps {
    stats: DashboardStats;
    systemMetrics: SystemMetrics;
    userGrowthData: any[];
    roleDistributionData: any[];
    recentActivity: ActivityLog[];
    statsCardsRef: React.RefObject<HTMLDivElement | null>;
    chartsRef: React.RefObject<HTMLDivElement | null>;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ 
    stats, 
    systemMetrics, 
    userGrowthData, 
    roleDistributionData, 
    recentActivity,
    statsCardsRef,
    chartsRef
}) => {
    const metricsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (chartsRef.current) {
            const charts = Array.from(chartsRef.current.children);
            
            // Animação de entrada com efeito de cristalização
            gsap.set(charts, {
                opacity: 0,
                scale: 0.1,
                rotationY: 90,
                z: -200,
                transformOrigin: "center center",
                filter: "blur(20px) brightness(0.3)"
            });

            // Timeline extraordinária para gráficos
            const chartsTimeline = gsap.timeline();
            
            chartsTimeline
                // Primeira fase: materialização quântica
                .to(charts, {
                    opacity: 0.3,
                    scale: 0.5,
                    rotationY: 45,
                    z: -100,
                    filter: "blur(10px) brightness(0.6)",
                    duration: 0.6,
                    stagger: {
                        amount: 0.8,
                        from: "random",
                        ease: "power3.out"
                    }
                })
                // Segunda fase: estabilização dimensional
                .to(charts, {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    z: 0,
                    filter: "blur(0px) brightness(1)",
                    duration: 1.2,
                    stagger: {
                        amount: 0.6,
                        ease: "elastic.out(1, 0.5)"
                    }
                }, "-=0.3")
                // Terceira fase: ativação energética
                .to(charts, {
                    boxShadow: "0 25px 50px rgba(59, 130, 246, 0.2), inset 0 0 30px rgba(147, 51, 234, 0.1)",
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out"
                }, "-=0.8");

            // Animação contínua de flutuação para gráficos
            charts.forEach((chart, index) => {
                gsap.to(chart, {
                    y: Math.sin(index * 1.2) * 8,
                    rotationZ: Math.cos(index * 0.8) * 1.5,
                    duration: 4 + (index * 0.3),
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: index * 0.4
                });

                // Efeito de campo energético
                gsap.to(chart, {
                    background: `linear-gradient(${index * 45}deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%)`,
                    duration: 3,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });
            });
        }
    }, []);

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div ref={statsCardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total de Usuários"
                    value={stats.totalUsers.toLocaleString()}
                    icon={Users}
                    trend="+12%"
                    color="blue"
                />
                <StatsCard
                    title="Usuários Ativos"
                    value={stats.activeUsers.toLocaleString()}
                    icon={CheckCircle}
                    trend="+8%"
                    color="green"
                />
                <StatsCard
                    title="Novos Hoje"
                    value={stats.newUsersToday.toString()}
                    icon={UserPlus}
                    trend="+23%"
                    color="purple"
                />
                <StatsCard
                    title="Online Agora"
                    value={stats.onlineUsers.toString()}
                    icon={Wifi}
                    trend="+5%"
                    color="orange"
                />
            </div>

            {/* System Metrics */}
            <div ref={metricsRef} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="CPU"
                    value={systemMetrics.cpu}
                    icon={Cpu}
                    color="blue"
                />
                <MetricCard
                    title="Memória"
                    value={systemMetrics.memory}
                    icon={MemoryStick}
                    color="green"
                />
                <MetricCard
                    title="Disco"
                    value={systemMetrics.disk}
                    icon={HardDrive}
                    color="yellow"
                />
                <MetricCard
                    title="Rede"
                    value={systemMetrics.network}
                    icon={Network}
                    color="purple"
                />
            </div>

            {/* Charts */}
            <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Growth Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Crescimento de Usuários
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1F2937', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }} 
                            />
                            <Line 
                                type="monotone" 
                                dataKey="users" 
                                stroke="#3B82F6" 
                                strokeWidth={3}
                                dot={{ fill: '#3B82F6', r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Role Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Distribuição de Roles
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={roleDistributionData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                            >
                                {roleDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Atividade Recente
                </h3>
                <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                activity.type === 'success' ? 'bg-green-100 text-green-600' :
                                activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                activity.type === 'error' ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {activity.action}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    por {activity.user} • {activity.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Stats Card Component
interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<any>;
    trend: string;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const valueRef = useRef<HTMLParagraphElement>(null);

    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600'
    };

    useGSAP(() => {
        // Animação extraordinária de hover com efeito holográfico
        const handleHover = () => {
            const tl = gsap.timeline();
            
            tl
                // Levitação com rotação sutil
                .to(cardRef.current, {
                    y: -15,
                    scale: 1.05,
                    rotationY: 5,
                    rotationX: 2,
                    boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3), 0 0 30px rgba(147, 51, 234, 0.2)",
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.95) 100%)",
                    duration: 0.6,
                    ease: "back.out(1.4)"
                })
                // Pulsação do ícone com efeito energético
                .to(iconRef.current, {
                    scale: 1.3,
                    rotation: 360,
                    boxShadow: "0 0 20px rgba(255, 255, 255, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3)",
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                }, "-=0.4")
                // Efeito de digitação no valor
                .to(valueRef.current, {
                    scale: 1.1,
                    color: "#3b82f6",
                    textShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                    duration: 0.3,
                    ease: "power2.out"
                }, "-=0.3");

            // Efeito de ondas propagando
            gsap.to(cardRef.current, {
                background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                duration: 1.5,
                ease: "sine.out"
            });
        };

        const handleLeave = () => {
            const tl = gsap.timeline();
            
            tl
                // Retorno suave à posição original
                .to(cardRef.current, {
                    y: 0,
                    scale: 1,
                    rotationY: 0,
                    rotationX: 0,
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                    background: "white",
                    duration: 0.5,
                    ease: "power3.out"
                })
                .to(iconRef.current, {
                    scale: 1,
                    rotation: 0,
                    boxShadow: "none",
                    duration: 0.4,
                    ease: "power2.out"
                }, "-=0.3")
                .to(valueRef.current, {
                    scale: 1,
                    color: "#111827",
                    textShadow: "none",
                    duration: 0.3,
                    ease: "power2.out"
                }, "-=0.3");
        };

        // Animação contínua de respiração quando não hover
        const breatheAnimation = gsap.to(cardRef.current, {
            scale: 1.01,
            duration: 3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            paused: true
        });

        const card = cardRef.current;
        if (card) {
            // Iniciar respiração
            breatheAnimation.play();

            card.addEventListener('mouseenter', () => {
                breatheAnimation.pause();
                handleHover();
            });
            
            card.addEventListener('mouseleave', () => {
                handleLeave();
                setTimeout(() => breatheAnimation.play(), 500);
            });

            return () => {
                breatheAnimation.kill();
                card.removeEventListener('mouseenter', handleHover);
                card.removeEventListener('mouseleave', handleLeave);
            };
        }
    }, []);

    // Animação inicial de entrada
    useGSAP(() => {
        if (cardRef.current) {
            gsap.fromTo(cardRef.current, 
                {
                    opacity: 0,
                    y: 100,
                    rotationX: -90,
                    transformOrigin: "center bottom"
                },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1.2,
                    ease: "elastic.out(1, 0.5)",
                    delay: Math.random() * 0.5
                }
            );
        }
    }, []);

    return (
        <div 
            ref={cardRef}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transform-gpu"
            style={{ perspective: '1000px' }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p ref={valueRef} className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">{trend}</p>
                </div>
                <div 
                    ref={iconRef}
                    className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center transform-gpu`}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

// Metric Card Component
interface MetricCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: 'blue' | 'green' | 'yellow' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color }) => {
    const progressRef = useRef<HTMLDivElement>(null);

    const colorClasses = {
        blue: 'from-blue-400 to-blue-600',
        green: 'from-green-400 to-green-600',
        yellow: 'from-yellow-400 to-yellow-600',
        purple: 'from-purple-400 to-purple-600'
    };

    useGSAP(() => {
        if (progressRef.current) {
            gsap.fromTo(progressRef.current,
                { width: '0%' },
                { width: `${value}%`, duration: 1.5, ease: "power3.out" }
            );
        }
    }, [value]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="mb-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                    ref={progressRef}
                    className={`h-2 bg-gradient-to-r ${colorClasses[color]} rounded-full`}
                />
            </div>
        </div>
    );
};

// Users Section Component
interface UsersSectionProps {
    users: User[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterRole: Role | 'all';
    setFilterRole: (role: Role | 'all') => void;
    showUserForm: boolean;
    setShowUserForm: (show: boolean) => void;
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
    onCreateUser: (userData: any) => void;
    onDeleteUser: (userId: string) => void;
    onToggleStatus: (userId: string) => void;
    getStatusBadge: (isActive: boolean) => React.ReactElement;
    getRoleBadge: (role: Role) => React.ReactElement;
    isModerator: boolean;
    tableRef: React.RefObject<HTMLDivElement | null>;
}

const UsersSection: React.FC<UsersSectionProps> = ({
    users,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    showUserForm,
    setShowUserForm,
    onCreateUser,
    onDeleteUser,
    onToggleStatus,
    getStatusBadge,
    getRoleBadge,
    isModerator,
    tableRef
}) => {
    const formRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role: Role.USER,
        isActive: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateUser(formData);
        setFormData({
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            role: Role.USER,
            isActive: true
        });
    };

    useGSAP(() => {
        if (showUserForm && formRef.current) {
            gsap.fromTo(formRef.current,
                { height: 0, opacity: 0 },
                { height: 'auto', opacity: 1, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [showUserForm]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciamento de Usuários</h2>
                    <p className="text-gray-600 dark:text-gray-400">Gerencie usuários, roles e permissões do sistema</p>
                </div>
                {isModerator && (
                    <button
                        onClick={() => setShowUserForm(!showUserForm)}
                        className="mt-3 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                    >
                        <UserPlus className="h-5 w-5" />
                        <span>Novo Usuário</span>
                    </button>
                )}
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Buscar usuários..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                            />
                        </div>
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as Role | 'all')}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                        >
                            <option value="all">Todas as Roles</option>
                            <option value={Role.ADMIN}>Admin</option>
                            <option value={Role.MODERATOR}>Moderador</option>
                            <option value={Role.USER}>Usuário</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* User Form */}
            {showUserForm && (
                <div
                    ref={formRef}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Novo Usuário
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Sobrenome
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Role
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                            >
                                <option value={Role.USER}>Usuário</option>
                                <option value={Role.MODERATOR}>Moderador</option>
                                <option value={Role.ADMIN}>Admin</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                Usuário ativo
                            </label>
                        </div>
                        <div className="md:col-span-2 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowUserForm(false)}
                                className="px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Criar Usuário
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div 
                ref={tableRef}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Usuário
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Criado em
                                </th>
                                {isModerator && (
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Ações
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user, index) => (
                                <tr
                                    key={user.id}
                                    data-user-id={user.id}
                                    className="user-row hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-white">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    @{user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(user.active || false)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(user.createdAt || new Date()).toLocaleDateString('pt-BR')}
                                    </td>
                                    {isModerator && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button
                                                    onClick={() => onToggleStatus(user.id || '')}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                                >
                                                    {user.active ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                                                </button>
                                                <button
                                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteUser(user.id || '')}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum usuário encontrado</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando um novo usuário.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Activity Section Component
interface ActivitySectionProps {
    activityLogs: ActivityLog[];
    getActivityIcon: (type: ActivityLog['type']) => React.ReactElement;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ activityLogs, getActivityIcon }) => {
    const [filterType, setFilterType] = useState<ActivityLog['type'] | 'all'>('all');
    const timelineRef = useRef<HTMLDivElement>(null);

    const filteredLogs = activityLogs.filter(log => 
        filterType === 'all' || log.type === filterType
    );

    useGSAP(() => {
        if (timelineRef.current) {
            gsap.fromTo(timelineRef.current.children,
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, [filteredLogs]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monitor de Atividade</h2>
                    <p className="text-gray-600 dark:text-gray-400">Monitore todas as atividades e eventos do sistema</p>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as ActivityLog['type'] | 'all')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">Todos os tipos</option>
                        <option value="success">Sucessos</option>
                        <option value="warning">Avisos</option>
                        <option value="error">Erros</option>
                        <option value="info">Informações</option>
                    </select>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center space-x-2 transition-all duration-200">
                        <Download className="h-4 w-4" />
                        <span>Exportar</span>
                    </button>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div ref={timelineRef} className="flow-root">
                    <ul className="-mb-8">
                        {filteredLogs.map((log, index) => (
                            <li key={log.id}>
                                <div className="relative pb-8">
                                    {index !== filteredLogs.length - 1 && (
                                        <span 
                                            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" 
                                            aria-hidden="true" 
                                        />
                                    )}
                                    <div className="relative flex items-start space-x-3">
                                        <div className="relative">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                                                log.type === 'success' ? 'bg-green-500' :
                                                log.type === 'warning' ? 'bg-yellow-500' :
                                                log.type === 'error' ? 'bg-red-500' :
                                                'bg-blue-500'
                                            }`}>
                                                <div className="text-white">
                                                    {getActivityIcon(log.type)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div>
                                                <div className="text-sm">
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {log.action}
                                                    </span>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                                    por <span className="font-medium">{log.user}</span> • {log.timestamp}
                                                </p>
                                                {log.ip && (
                                                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                                                        IP: {log.ip}
                                                    </p>
                                                )}
                                            </div>
                                            {log.details && (
                                                <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                                    {log.details}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {filteredLogs.length === 0 && (
                    <div className="text-center py-12">
                        <Activity className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma atividade encontrada</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Nenhuma atividade corresponde aos filtros selecionados.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Analytics Section Component
interface AnalyticsSectionProps {
    stats: DashboardStats;
    userGrowthData: any[];
    users: User[];
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ stats, userGrowthData, users }) => {
    const analyticsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (analyticsRef.current) {
            gsap.fromTo(analyticsRef.current.children,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
            );
        }
    }, []);

    return (
        <div ref={analyticsRef} className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Avançadas</h2>
                <p className="text-gray-600 dark:text-gray-400">Análises detalhadas e insights do sistema</p>
            </div>

            {/* Advanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receita Total</h3>
                    <p className="text-3xl font-bold text-green-600">R$ {stats.revenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-2">+{stats.growth}% este mês</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sessões Totais</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalSessions.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-2">Tempo médio: {stats.avgSessionTime}</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Taxa de Erro</h3>
                    <p className="text-3xl font-bold text-red-600">{stats.errorRate}%</p>
                    <p className="text-sm text-red-600 mt-2">-0.3% desde ontem</p>
                </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Crescimento de Usuários</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={userGrowthData}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: 'none', 
                                borderRadius: '8px',
                                color: '#F9FAFB'
                            }} 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="users" 
                            stroke="#3B82F6" 
                            fillOpacity={1} 
                            fill="url(#colorUsers)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Notifications Section Component
interface NotificationsSectionProps {
    notifications: NotificationItem[];
    setNotifications: (notifications: NotificationItem[]) => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ notifications, setNotifications }) => {
    const notificationsRef = useRef<HTMLDivElement>(null);

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    useGSAP(() => {
        if (notificationsRef.current) {
            gsap.fromTo(notificationsRef.current.children,
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notificações</h2>
                    <p className="text-gray-600 dark:text-gray-400">Central de notificações e alertas do sistema</p>
                </div>
                <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                >
                    Marcar todas como lidas
                </button>
            </div>

            <div ref={notificationsRef} className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${
                            notification.type === 'success' ? 'border-green-500' :
                            notification.type === 'warning' ? 'border-yellow-500' :
                            notification.type === 'error' ? 'border-red-500' :
                            'border-blue-500'
                        } ${!notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {notification.title}
                                    </h3>
                                    {!notification.read && (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {notification.message}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                    {notification.timestamp}
                                </p>
                            </div>
                            <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <Eye className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Settings Section Component
interface SettingsSectionProps {
    settings: SystemSettings;
    onUpdateSettings: (settings: Partial<SystemSettings>) => void;
    isModerator: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ settings, onUpdateSettings, isModerator }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [hasChanges, setHasChanges] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSettingChange = (key: keyof SystemSettings, value: any) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = () => {
        onUpdateSettings(localSettings);
        setHasChanges(false);
    };

    const handleReset = () => {
        setLocalSettings(settings);
        setHasChanges(false);
    };

    useGSAP(() => {
        if (settingsRef.current) {
            gsap.fromTo(settingsRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, []);

    if (!isModerator) {
        return (
            <div className="text-center py-12">
                <Lock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Acesso Restrito</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Você não tem permissão para acessar as configurações do sistema.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações do Sistema</h2>
                    <p className="text-gray-600 dark:text-gray-400">Configure as preferências e comportamentos do sistema</p>
                </div>
                {hasChanges && (
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
                        >
                            <Save className="h-4 w-4" />
                            <span>Salvar</span>
                        </button>
                    </div>
                )}
            </div>

            <div ref={settingsRef} className="settings-form space-y-6">
                {/* System Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        Sistema
                    </h3>
                    <div className="space-y-6">
                        <ToggleSetting
                            label="Modo de Manutenção"
                            description="Impede novos logins quando ativado"
                            checked={localSettings.maintenance}
                            onChange={(checked) => handleSettingChange('maintenance', checked)}
                        />
                        <ToggleSetting
                            label="Registro Aberto"
                            description="Permite que novos usuários se registrem"
                            checked={localSettings.registration}
                            onChange={(checked) => handleSettingChange('registration', checked)}
                        />
                        <ToggleSetting
                            label="Notificações"
                            description="Enviar notificações por email"
                            checked={localSettings.notifications}
                            onChange={(checked) => handleSettingChange('notifications', checked)}
                        />
                        <ToggleSetting
                            label="Backup Automático"
                            description="Realizar backup diário dos dados"
                            checked={localSettings.autoBackup}
                            onChange={(checked) => handleSettingChange('autoBackup', checked)}
                        />
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Segurança
                    </h3>
                    <div className="space-y-6">
                        <NumberSetting
                            label="Timeout de Sessão (minutos)"
                            description="Tempo antes do usuário ser deslogado automaticamente"
                            value={localSettings.sessionTimeout}
                            min={5}
                            max={720}
                            onChange={(value) => handleSettingChange('sessionTimeout', value)}
                        />
                        <NumberSetting
                            label="Máximo de Tentativas de Login"
                            description="Número máximo de tentativas antes de bloquear a conta"
                            value={localSettings.maxLoginAttempts}
                            min={3}
                            max={10}
                            onChange={(value) => handleSettingChange('maxLoginAttempts', value)}
                        />
                        <ToggleSetting
                            label="Verificação por Email"
                            description="Exigir verificação de email para novos usuários"
                            checked={localSettings.emailVerification}
                            onChange={(checked) => handleSettingChange('emailVerification', checked)}
                        />
                        <ToggleSetting
                            label="Autenticação de Dois Fatores"
                            description="Habilitar 2FA para todos os usuários"
                            checked={localSettings.twoFactorAuth}
                            onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                        />
                    </div>
                </div>

                {/* API Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        API e Integrações
                    </h3>
                    <div className="space-y-6">
                        <NumberSetting
                            label="Limite de Taxa da API (req/min)"
                            description="Número máximo de requisições por minuto por usuário"
                            value={localSettings.apiRateLimit}
                            min={100}
                            max={10000}
                            step={100}
                            onChange={(value) => handleSettingChange('apiRateLimit', value)}
                        />
                        <NumberSetting
                            label="Tamanho Máximo de Arquivo (MB)"
                            description="Tamanho máximo permitido para upload de arquivos"
                            value={localSettings.maxFileSize}
                            min={1}
                            max={100}
                            onChange={(value) => handleSettingChange('maxFileSize', value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Toggle Setting Component
interface ToggleSettingProps {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({ label, description, checked, onChange }) => {
    const toggleRef = useRef<HTMLLabelElement>(null);

    const handleClick = () => {
        onChange(!checked);
        
        // GSAP animation for toggle
        if (toggleRef.current) {
            gsap.to(toggleRef.current, {
                scale: 1.05,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            </div>
            <label 
                ref={toggleRef}
                className="relative inline-flex items-center cursor-pointer"
                onClick={handleClick}
            >
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
};

// Number Setting Component
interface NumberSettingProps {
    label: string;
    description: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
}

const NumberSetting: React.FC<NumberSettingProps> = ({ label, description, value, min, max, step = 1, onChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description}
            </p>
        </div>
    );
};

export default Dashboard;
