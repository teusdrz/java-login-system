import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { User, Role } from '../types/api';
import {
    Users,
    Settings,
    Shield,
    UserPlus,
    Search,
    Filter,
    Bell,
    TrendingUp,
    Activity,
    Wifi,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Clock,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    BarChart3,
    PieChart,
    Download,
    Calendar,
    FileText,
    Database,
    Server,
    Globe,
    Lock,
    Mail,
    Palette,
    Monitor,
    Smartphone,
    Save,
    RefreshCw
} from 'lucide-react';

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    onlineUsers: number;
    totalSessions: number;
    avgSessionTime: string;
    systemUptime: string;
    errorRate: number;
}

interface ActivityLog {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    type: 'success' | 'warning' | 'error';
    ip?: string;
    details?: string;
}

type ViewType = 'overview' | 'users' | 'activity' | 'settings';

interface UserStats {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    status: 'ONLINE' | 'OFFLINE' | 'AWAY';
    lastLogin: string;
    permissions: string[];
}

interface SystemNotification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    time: string;
    read: boolean;
}

interface ReportData {
    id: number;
    title: string;
    description: string;
    type: 'usage' | 'performance' | 'security' | 'user';
    value: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
}

interface SystemSettings {
    category: string;
    settings: {
        key: string;
        label: string;
        value: any;
        type: 'toggle' | 'select' | 'input' | 'color';
        options?: string[];
        description?: string;
    }[];
}

// Animation variants ultra sofisticados
const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { y: -6, scale: 1.02 }
};

const Dashboard: React.FC = () => {
    const { state } = useAuth();
    const { user } = state;
    const [currentView, setCurrentView] = useState<ViewType>('overview');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        activeUsers: 0,
        newUsersToday: 0,
        onlineUsers: 0,
        totalSessions: 0,
        avgSessionTime: '0m',
        systemUptime: '0d 0h 0m',
        errorRate: 0
    });
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<Role | 'all'>('all');

    const loadDashboardData = React.useCallback(async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadStats(),
                loadUsers(),
                loadActivityLogs()
            ]);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadStats = async () => {
        // Mock data - substitua por chamada de API real
        setStats({
            totalUsers: 1247,
            activeUsers: 892,
            newUsersToday: 23,
            onlineUsers: 156,
            totalSessions: 5634,
            avgSessionTime: '24m',
            systemUptime: '15d 8h 32m',
            errorRate: 0.02
        });
    };

    const loadUsers = async () => {
        // Mock data - substitua por chamada de API real
        const mockUsers: User[] = [
            {
                id: '1',
                username: 'admin',
                email: 'admin@company.com',
                role: Role.ADMIN,
                active: true,
                createdAt: '2024-01-15',
                lastLoginAt: '2024-03-20',
                lastModifiedAt: '2024-02-10',
                failedLoginAttempts: 0
            },
            {
                id: '2',
                username: 'john.doe',
                email: 'john@company.com',
                role: Role.USER,
                active: true,
                createdAt: '2024-02-01',
                lastLoginAt: '2024-03-19',
                lastModifiedAt: '2024-02-15',
                failedLoginAttempts: 1
            }
        ];
        setUsers(mockUsers);
    };

    const loadActivityLogs = async () => {
        // Mock data - substitua por chamada de API real
        const mockLogs: ActivityLog[] = [
            { id: '1', action: 'User Login', user: 'john.doe', timestamp: '2024-03-20 14:30:00', type: 'success' },
            { id: '2', action: 'Failed Login Attempt', user: 'unknown', timestamp: '2024-03-20 14:25:00', type: 'warning' },
            { id: '3', action: 'User Registration', user: 'jane.smith', timestamp: '2024-03-20 14:20:00', type: 'success' },
            { id: '4', action: 'Password Reset', user: 'bob.wilson', timestamp: '2024-03-20 14:15:00', type: 'error' }
        ];
        setActivityLogs(mockLogs);
    };

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const getStatusBadge = (isActive: boolean) => {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
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
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
            default: return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Dados mock para relatórios
    const reportData: ReportData[] = [
        {
            id: 1,
            title: "Total de Usuários",
            description: "Usuários registrados no sistema",
            type: "user",
            value: 1247,
            trend: "up",
            percentage: 12.5,
            period: "30 dias"
        },
        {
            id: 2,
            title: "Sessions Ativas",
            description: "Sessões ativas no momento",
            type: "usage",
            value: 89,
            trend: "down",
            percentage: 5.2,
            period: "tempo real"
        },
        {
            id: 3,
            title: "Performance Score",
            description: "Pontuação de performance do sistema",
            type: "performance",
            value: 98.7,
            trend: "up",
            percentage: 2.1,
            period: "24 horas"
        },
        {
            id: 4,
            title: "Alertas de Segurança",
            description: "Incidentes de segurança detectados",
            type: "security",
            value: 3,
            trend: "stable",
            percentage: 0,
            period: "7 dias"
        }
    ];

    const renderReports = () => (
        <motion.div
            key="reports"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8"
        >
            {/* Header com filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Relatórios Avançados
                    </h2>
                    <p className="text-slate-600 mt-1">
                        Analytics e métricas do sistema em tempo real
                    </p>
                </div>
                <div className="flex space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center space-x-2 shadow-sm"
                    >
                        <Calendar size={16} />
                        <span>Período</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-blue-600/20"
                    >
                        <Download size={16} />
                        <span>Exportar</span>
                    </motion.button>
                </div>
            </div>

            {/* Métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reportData.map((report, index) => (
                    <motion.div
                        key={report.id}
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${report.type === 'user' ? 'bg-blue-100 text-blue-600' :
                                    report.type === 'usage' ? 'bg-green-100 text-green-600' :
                                        report.type === 'performance' ? 'bg-purple-100 text-purple-600' :
                                            'bg-amber-100 text-amber-600'
                                }`}>
                                {report.type === 'user' && <Users size={20} />}
                                {report.type === 'usage' && <Activity size={20} />}
                                {report.type === 'performance' && <BarChart3 size={20} />}
                                {report.type === 'security' && <Shield size={20} />}
                            </div>
                            <div className={`flex items-center space-x-1 text-sm ${report.trend === 'up' ? 'text-green-600' :
                                    report.trend === 'down' ? 'text-red-600' :
                                        'text-slate-600'
                                }`}>
                                {report.trend === 'up' && <TrendingUp size={16} />}
                                {report.trend === 'down' && <TrendingUp size={16} className="rotate-180" />}
                                {report.trend === 'stable' && <span className="w-4 h-0.5 bg-slate-400 rounded"></span>}
                                <span className="font-medium">
                                    {report.percentage > 0 ? `+${report.percentage}%` :
                                        report.percentage < 0 ? `${report.percentage}%` :
                                            '0%'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-slate-600 mb-1">
                                {report.title}
                            </h3>
                            <p className="text-2xl font-bold text-slate-800 mb-1">
                                {report.type === 'performance' ? `${report.value}%` : report.value.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">
                                {report.description} • {report.period}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de usuários */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.4 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Atividade de Usuários</h3>
                            <p className="text-sm text-slate-600">Últimos 7 dias</p>
                        </div>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                            <PieChart size={20} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Usuários Ativos', value: 847, color: 'bg-blue-500', percentage: 68 },
                            { label: 'Usuários Inativos', value: 245, color: 'bg-slate-300', percentage: 20 },
                            { label: 'Novos Usuários', value: 155, color: 'bg-green-500', percentage: 12 }
                        ].map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                    <span className="text-sm font-bold text-slate-800">{item.value}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percentage}%` }}
                                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                        className={`h-2 ${item.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Sistema de performance */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.5 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Performance do Sistema</h3>
                            <p className="text-sm text-slate-600">Monitoramento em tempo real</p>
                        </div>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                            <Server size={20} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'CPU', value: 45, color: 'bg-blue-500', status: 'Normal' },
                            { label: 'Memória', value: 68, color: 'bg-amber-500', status: 'Atenção' },
                            { label: 'Disco', value: 32, color: 'bg-green-500', status: 'Ótimo' },
                            { label: 'Rede', value: 89, color: 'bg-red-500', status: 'Alto' }
                        ].map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-bold text-slate-800">{item.value}%</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Normal' || item.status === 'Ótimo' ? 'bg-green-100 text-green-700' :
                                                item.status === 'Atenção' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                                        className={`h-2 ${item.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Logs de atividade recentes */}
            <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.6 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Logs de Atividade</h3>
                        <p className="text-sm text-slate-600">Atividades recentes do sistema</p>
                    </div>
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                        <FileText size={20} />
                    </div>
                </div>
                <div className="space-y-3">
                    {[
                        { action: 'Login realizado', user: 'João Silva', time: '2 min atrás', type: 'success' },
                        { action: 'Usuário criado', user: 'Admin', time: '5 min atrás', type: 'success' },
                        { action: 'Tentativa de login falhada', user: 'usuário@teste.com', time: '12 min atrás', type: 'warning' },
                        { action: 'Relatório exportado', user: 'Maria Santos', time: '25 min atrás', type: 'success' },
                        { action: 'Configuração alterada', user: 'Admin', time: '1 hora atrás', type: 'success' }
                    ].map((log, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-50/50 transition-colors duration-200"
                        >
                            <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-green-500' :
                                    log.type === 'warning' ? 'bg-amber-500' :
                                        'bg-red-500'
                                }`} />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800">{log.action}</p>
                                <p className="text-xs text-slate-600">por {log.user}</p>
                            </div>
                            <span className="text-xs text-slate-500">{log.time}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );

    // Dados mock para configurações
    const systemSettings: SystemSettings[] = [
        {
            category: "Geral",
            settings: [
                {
                    key: "siteName",
                    label: "Nome do Site",
                    value: "Sistema de Login",
                    type: "input",
                    description: "Nome que aparece no cabeçalho do sistema"
                },
                {
                    key: "language",
                    label: "Idioma Padrão",
                    value: "pt-BR",
                    type: "select",
                    options: ["pt-BR", "en-US", "es-ES"],
                    description: "Idioma padrão para novos usuários"
                },
                {
                    key: "darkMode",
                    label: "Modo Escuro",
                    value: false,
                    type: "toggle",
                    description: "Ativar tema escuro por padrão"
                }
            ]
        },
        {
            category: "Segurança",
            settings: [
                {
                    key: "twoFactorAuth",
                    label: "Autenticação de Dois Fatores",
                    value: true,
                    type: "toggle",
                    description: "Exigir 2FA para todos os usuários"
                },
                {
                    key: "sessionTimeout",
                    label: "Timeout de Sessão",
                    value: "30",
                    type: "select",
                    options: ["15", "30", "60", "120"],
                    description: "Minutos de inatividade antes do logout automático"
                },
                {
                    key: "passwordPolicy",
                    label: "Política de Senhas Rígida",
                    value: true,
                    type: "toggle",
                    description: "Exigir senhas complexas (8+ caracteres, maiúscula, número, símbolo)"
                }
            ]
        },
        {
            category: "Notificações",
            settings: [
                {
                    key: "emailNotifications",
                    label: "Notificações por Email",
                    value: true,
                    type: "toggle",
                    description: "Enviar notificações importantes por email"
                },
                {
                    key: "pushNotifications",
                    label: "Notificações Push",
                    value: false,
                    type: "toggle",
                    description: "Ativar notificações push no navegador"
                },
                {
                    key: "notificationFrequency",
                    label: "Frequência de Notificações",
                    value: "important",
                    type: "select",
                    options: ["all", "important", "critical"],
                    description: "Tipos de notificações que devem ser enviadas"
                }
            ]
        },
        {
            category: "Aparência",
            settings: [
                {
                    key: "primaryColor",
                    label: "Cor Primária",
                    value: "#3B82F6",
                    type: "color",
                    description: "Cor principal da interface"
                },
                {
                    key: "compactMode",
                    label: "Modo Compacto",
                    value: false,
                    type: "toggle",
                    description: "Interface mais compacta com menos espaçamento"
                },
                {
                    key: "animationsEnabled",
                    label: "Animações",
                    value: true,
                    type: "toggle",
                    description: "Ativar animações e transições na interface"
                }
            ]
        }
    ];

    const renderSettings = () => (
        <motion.div
            key="settings"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Configurações do Sistema
                    </h2>
                    <p className="text-slate-600 mt-1">
                        Gerencie preferências e configurações gerais
                    </p>
                </div>
                <div className="flex space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center space-x-2 shadow-sm"
                    >
                        <RefreshCw size={16} />
                        <span>Resetar</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-green-600/20"
                    >
                        <Save size={16} />
                        <span>Salvar</span>
                    </motion.button>
                </div>
            </div>

            {/* Configurações por categoria */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {systemSettings.map((category, categoryIndex) => (
                    <motion.div
                        key={category.category}
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: categoryIndex * 0.1 }}
                        className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg space-y-6"
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <div className={`p-2 rounded-xl ${category.category === 'Geral' ? 'bg-blue-100 text-blue-600' :
                                    category.category === 'Segurança' ? 'bg-red-100 text-red-600' :
                                        category.category === 'Notificações' ? 'bg-amber-100 text-amber-600' :
                                            'bg-purple-100 text-purple-600'
                                }`}>
                                {category.category === 'Geral' && <Settings size={20} />}
                                {category.category === 'Segurança' && <Shield size={20} />}
                                {category.category === 'Notificações' && <Bell size={20} />}
                                {category.category === 'Aparência' && <Palette size={20} />}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">{category.category}</h3>
                        </div>

                        <div className="space-y-4">
                            {category.settings.map((setting, settingIndex) => (
                                <motion.div
                                    key={setting.key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: categoryIndex * 0.1 + settingIndex * 0.05 }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-slate-700">
                                                {setting.label}
                                            </label>
                                            {setting.description && (
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {setting.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            {setting.type === 'toggle' && (
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${setting.value ? 'bg-blue-600' : 'bg-slate-200'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${setting.value ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </motion.button>
                                            )}
                                            {setting.type === 'select' && (
                                                <select
                                                    value={setting.value}
                                                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {setting.options?.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            {setting.type === 'input' && (
                                                <input
                                                    type="text"
                                                    value={setting.value}
                                                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
                                                />
                                            )}
                                            {setting.type === 'color' && (
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="color"
                                                        value={setting.value}
                                                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                                                    />
                                                    <span className="text-xs text-slate-600 font-mono">
                                                        {setting.value}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Informações do sistema */}
            <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                        <Database size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Informações do Sistema</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Versão', value: '2.1.4', icon: <Monitor size={16} /> },
                        { label: 'Uptime', value: '15d 8h 32m', icon: <Clock size={16} /> },
                        { label: 'Usuários Online', value: '156', icon: <Users size={16} /> },
                        { label: 'Status', value: 'Online', icon: <CheckCircle size={16} className="text-green-500" /> }
                    ].map((info, index) => (
                        <motion.div
                            key={info.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="bg-slate-50/50 rounded-xl p-4 space-y-2"
                        >
                            <div className="flex items-center space-x-2 text-slate-600">
                                {info.icon}
                                <span className="text-sm font-medium">{info.label}</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800">{info.value}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Backup e manutenção */}
            <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.5 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-green-100 text-green-600 rounded-xl">
                        <Server size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Backup e Manutenção</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Último Backup</h4>
                            <div className="flex items-center space-x-2">
                                <CheckCircle size={16} className="text-green-500" />
                                <span className="text-sm text-slate-600">Hoje às 03:00</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Próximo Backup</h4>
                            <div className="flex items-center space-x-2">
                                <Clock size={16} className="text-blue-500" />
                                <span className="text-sm text-slate-600">Amanhã às 03:00</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                        >
                            Fazer Backup Agora
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors duration-200"
                        >
                            Modo Manutenção
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );

    // Overview ultra minimalista e sofisticado
    const renderOverview = () => (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
        >
            {/* Header de boas-vindas ultra clean */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-12 border border-gray-100/50">
                <div className="relative z-10">
                    <motion.h1
                        className="text-4xl font-extralight text-gray-900 mb-4 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Bem-vindo, {user?.username}
                    </motion.h1>
                    <motion.p
                        className="text-lg font-light text-gray-600 tracking-wide"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Visão executiva do sistema empresarial
                    </motion.p>
                </div>
                {/* Elementos decorativos geométricos */}
                <div className="absolute top-8 right-8 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
                <div className="absolute bottom-8 right-16 w-16 h-16 bg-emerald-500/5 rounded-full blur-lg"></div>
            </div>

            {/* Cards de métricas ultra avançados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-100/50 hover:border-blue-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-100/20"
                >
                    {/* Indicador de status */}
                    <div className="absolute top-6 right-6 w-2 h-2 bg-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>

                    {/* Ícone ultra moderno */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Users className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                    </div>

                    {/* Métricas principais */}
                    <div className="space-y-3">
                        <p className="text-3xl font-extralight text-gray-900 tracking-tight">{stats.totalUsers.toLocaleString()}</p>
                        <p className="text-xs font-light text-gray-400 uppercase tracking-[0.2em]">Total Users</p>

                        {/* Indicador de tendência minimalista */}
                        <div className="flex items-center space-x-3">
                            <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                            <span className="text-xs text-emerald-600 font-medium">+12%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Active Users */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-100/50 hover:border-emerald-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-100/20"
                >
                    <div className="absolute top-6 right-6 w-2 h-2 bg-emerald-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>

                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Activity className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
                    </div>

                    <div className="space-y-3">
                        <p className="text-3xl font-extralight text-gray-900 tracking-tight">{stats.activeUsers.toLocaleString()}</p>
                        <p className="text-xs font-light text-gray-400 uppercase tracking-[0.2em]">Active Users</p>

                        <div className="flex items-center space-x-3">
                            <div className="flex-1 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                            <span className="text-xs text-emerald-600 font-medium">+8%</span>
                        </div>
                    </div>
                </motion.div>

                {/* New Users */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                    className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-100/50 hover:border-purple-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-purple-100/20"
                >
                    <div className="absolute top-6 right-6 w-2 h-2 bg-purple-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>

                    <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <UserPlus className="w-6 h-6 text-purple-600" strokeWidth={1.5} />
                    </div>

                    <div className="space-y-3">
                        <p className="text-3xl font-extralight text-gray-900 tracking-tight">{stats.newUsersToday}</p>
                        <p className="text-xs font-light text-gray-400 uppercase tracking-[0.2em]">New Today</p>

                        <div className="flex items-center space-x-3">
                            <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                            <span className="text-xs text-purple-600 font-medium">+{stats.newUsersToday}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Online Users */}
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                    className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-100/50 hover:border-orange-200/50 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-100/20"
                >
                    <div className="absolute top-6 right-6 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>

                    <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Wifi className="w-6 h-6 text-orange-600" strokeWidth={1.5} />
                    </div>

                    <div className="space-y-3">
                        <p className="text-3xl font-extralight text-gray-900 tracking-tight">{stats.onlineUsers}</p>
                        <p className="text-xs font-light text-gray-400 uppercase tracking-[0.2em]">Online Now</p>

                        <div className="flex items-center space-x-3">
                            <div className="flex-1 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                            <span className="text-xs text-orange-600 font-medium">Live</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Seção de análise avançada */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de crescimento minimalista */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-gray-100/50"
                >
                    <h3 className="text-xl font-light text-gray-900 mb-8 tracking-wide">Crescimento de Usuários</h3>
                    <div className="space-y-6">
                        {/* Gráfico de barras minimalista */}
                        <div className="flex items-end space-x-3 h-40">
                            {[65, 45, 78, 52, 82, 67, 89].map((height, index) => (
                                <motion.div
                                    key={index}
                                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-xl opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer"
                                    style={{ height: `${height}%` }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                                    whileHover={{ scale: 1.05 }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 font-light tracking-wide">
                            <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span>
                        </div>
                    </div>
                </motion.div>

                {/* Distribuição de roles moderna */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-gray-100/50"
                >
                    <h3 className="text-xl font-light text-gray-900 mb-8 tracking-wide">Distribuição de Papéis</h3>
                    <div className="space-y-6">
                        {[
                            { role: 'Administrators', count: 5, color: 'blue', percentage: 15 },
                            { role: 'Moderators', count: 12, color: 'emerald', percentage: 35 },
                            { role: 'Users', count: 156, color: 'purple', percentage: 50 }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="space-y-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-light text-gray-700">{item.role}</span>
                                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                                </div>
                                <div className="relative w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className={`h-2 rounded-full bg-gradient-to-r ${item.color === 'blue' ? 'from-blue-500 to-blue-600' :
                                            item.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                                                'from-purple-500 to-purple-600'
                                            }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percentage}%` }}
                                        transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 100 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Atividade recente ultra limpa */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-gray-100/50"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-light text-gray-900 tracking-wide">Atividade Recente</h3>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    {activityLogs.slice(0, 5).map((log, index) => (
                        <motion.div
                            key={log.id}
                            className="flex items-center space-x-4 p-5 hover:bg-gray-50/50 rounded-2xl transition-all duration-300 group cursor-pointer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                            whileHover={{ x: 4 }}
                        >
                            <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500' :
                                log.type === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                                }`}></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{log.action}</p>
                                <p className="text-xs text-gray-400 font-light mt-1">{log.user} • {log.timestamp}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                {getActivityIcon(log.type)}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );

    // Gerenciamento de usuários limpo
    const renderUsers = () => (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
        >
            {/* Header da seção de usuários */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-light text-gray-900 tracking-wide">Gerenciamento de Usuários</h2>
                    <p className="text-sm text-gray-500 font-light mt-1">Administre usuários do sistema corporativo</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg">
                    <UserPlus className="w-4 h-4 mr-2 inline" />
                    Novo Usuário
                </button>
            </div>

            {/* Controles de busca e filtro */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-100/50">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar usuários..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-light"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as Role | 'all')}
                            className="pl-12 pr-8 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all font-light"
                        >
                            <option value="all">Todos os papéis</option>
                            <option value={Role.ADMIN}>Administrador</option>
                            <option value={Role.MODERATOR}>Moderador</option>
                            <option value={Role.USER}>Usuário</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabela de usuários ultra limpa */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Papel</th>
                                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Último Login</th>
                                <th className="text-right py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/50">
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="hover:bg-gray-50/30 transition-colors group"
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                                                <span className="text-sm font-medium text-white">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                                                <p className="text-xs text-gray-500 font-light">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.role === Role.ADMIN ? 'bg-red-50 text-red-700 border border-red-200' :
                                            user.role === Role.MODERATOR ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                'bg-gray-50 text-gray-700 border border-gray-200'
                                            }`}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {getStatusBadge(user.active ?? false)}
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-sm text-gray-900 font-light">{user.lastLoginAt || 'Nunca'}</p>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );

    // Layout principal
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
            {/* Header ultra sofisticado */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo extraordinária */}
                        <div className="flex items-center space-x-4">
                            <div className="relative group">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl flex items-center justify-center shadow-xl border border-blue-100/30 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500">
                                    <div className="relative w-6 h-6">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-sm"
                                            animate={{ rotate: [0, 90] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner"></div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div className="leading-tight">
                                <h1 className="text-2xl font-extralight text-gray-900 tracking-wide">Nexus</h1>
                                <p className="text-xs text-gray-400 font-light tracking-[0.3em] uppercase">Enterprise</p>
                            </div>
                        </div>

                        {/* Navegação ultra elegante */}
                        <nav className="hidden md:flex items-center">
                            <div className="flex items-center bg-gray-50/50 rounded-3xl p-1.5 backdrop-blur-sm border border-gray-200/50">
                                {[
                                    { id: 'overview', label: 'Overview' },
                                    { id: 'users', label: 'Users' },
                                    { id: 'activity', label: 'Reports' },
                                    { id: 'settings', label: 'Settings' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setCurrentView(item.id as ViewType)}
                                        className={`px-6 py-3 rounded-2xl text-sm font-light transition-all duration-300 ${currentView === item.id
                                            ? 'bg-white text-blue-600 shadow-lg border border-blue-100/50 scale-105'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </nav>

                        {/* Perfil ultra refinado */}
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="p-3 text-gray-400 hover:text-blue-600 transition-colors duration-200 hover:bg-blue-50/50 rounded-2xl">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
                                </button>
                            </div>

                            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200/50">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-sm font-light text-white tracking-wide">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="hidden lg:block text-sm leading-none">
                                    <p className="font-medium text-gray-900">{user?.username}</p>
                                    <p className="text-gray-400 font-light text-xs mt-1">{user?.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        {loading ? (
                            <div className="space-y-8">
                                <div className="animate-pulse bg-gray-200 h-32 rounded-3xl"></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="animate-pulse bg-gray-200 h-40 rounded-3xl"></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {currentView === 'overview' && renderOverview()}
                                {currentView === 'users' && renderUsers()}
                                {currentView === 'activity' && renderReports()}
                                {currentView === 'settings' && renderSettings()}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Dashboard;
