import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Skeleton, TableSkeleton } from '../components/Loading';
import {
    Users,
    Shield,
    Activity,
    LogOut,
    User,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    Bell,
    TrendingUp,
    UserCheck,
    AlertTriangle,
    BarChart3,
    FileText
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import ApiService from '../services/ApiService';
import { User as UserType, Role } from '../types/api';

// Sample data for charts and analytics
const userActivityData = [
    { date: 'Jan', active: 145, new: 12, total: 180 },
    { date: 'Feb', active: 152, new: 18, total: 198 },
    { date: 'Mar', active: 168, new: 24, total: 222 },
    { date: 'Apr', active: 175, new: 15, total: 237 },
    { date: 'May', active: 188, new: 32, total: 269 },
    { date: 'Jun', active: 195, new: 28, total: 297 },
];

const roleDistribution = [
    { name: 'Users', value: 245, color: '#3B82F6' },
    { name: 'Moderators', value: 12, color: '#F59E0B' },
    { name: 'Admins', value: 3, color: '#EF4444' },
];

/**
 * Dashboard Component - Dashboard Administrativo conforme especificação
 * Barra Lateral à esquerda com ícones e links para diferentes seções
 * Seção de Gerenciamento de Usuários com tabela e status visuais
 * Seção de Logs de Auditoria com gráficos e tabela paginada
 */
const Dashboard: React.FC = () => {
    // Authentication and navigation hooks
    const { state, logout } = useAuth();
    const { showToast } = useToast();

    // Component state management
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserType[]>([]);
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');

    const [stats] = useState({
        totalUsers: 260,
        activeUsers: 195,
        totalSessions: 1847,
        systemUptime: '99.9%'
    });

    // Check if user is moderator/admin
    const isModerator = state.user?.role === Role.ADMIN || state.user?.role === Role.MODERATOR;

    /**
     * Load dashboard data on component mount
     */
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);

                if (isModerator) {
                    const usersResponse = await ApiService.getAllUsers();
                    if (usersResponse.success && usersResponse.data) {
                        setUsers(usersResponse.data);
                    }
                }
            } catch (error) {
                showToast({
                    type: 'error',
                    title: 'Loading Error',
                    message: 'Failed to load dashboard data'
                });
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [isModerator, showToast]);

    /**
     * Get status badge component
     */
    const getStatusBadge = (isActive: boolean) => {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                    ? 'bg-success-100 text-success-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                {isActive ? 'Ativo' : 'Inativo'}
            </span>
        );
    };

    /**
     * Get role badge component
     */
    const getRoleBadge = (role: Role) => {
        const roleColors = {
            [Role.ADMIN]: 'bg-red-100 text-red-800',
            [Role.MODERATOR]: 'bg-yellow-100 text-yellow-800',
            [Role.USER]: 'bg-blue-100 text-blue-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role]}`}>
                {role}
            </span>
        );
    };

    /**
     * Função para renderizar as diferentes seções
     */
    const renderCurrentSection = () => {
        switch (currentSection) {
            case 'dashboard':
                return renderDashboardContent();
            case 'users':
                return renderUserManagement();
            case 'audit':
                return renderAuditLogs();
            default:
                return renderDashboardContent();
        }
    };

    /**
     * Conteúdo do Dashboard
     */
    const renderDashboardContent = () => {
        return (
            <div className="space-y-6">
                {/* Dashboard stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Total Users</p>
                                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                                <p className="text-xs text-success-400 mt-1">↗ 12% increase</p>
                            </div>
                            <div className="h-12 w-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Active Users</p>
                                <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
                                <p className="text-xs text-success-400 mt-1">↗ 8% increase</p>
                            </div>
                            <div className="h-12 w-12 bg-success-600/20 rounded-lg flex items-center justify-center">
                                <UserCheck className="h-6 w-6 text-success-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Total Sessions</p>
                                <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
                                <p className="text-xs text-yellow-400 mt-1">→ No change</p>
                            </div>
                            <div className="h-12 w-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                                <Activity className="h-6 w-6 text-yellow-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">System Uptime</p>
                                <p className="text-2xl font-bold text-white">{stats.systemUptime}</p>
                                <p className="text-xs text-success-400 mt-1">↗ Excellent</p>
                            </div>
                            <div className="h-12 w-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráficos que visualizam dados conforme especificação */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Area Chart - Atividade dos usuários */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">User Activity Trends</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#F9FAFB'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="active" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                                    <Area type="monotone" dataKey="new" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart - Distribuição de roles */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Role Distribution</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roleDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {roleDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#F9FAFB'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {roleDistribution.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        ></div>
                                        <span className="text-sm text-gray-300">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-medium text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * Seção de Gerenciamento de Usuários conforme especificação
     */
    const renderUserManagement = () => {
        const filteredUsers = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="space-y-6">
                {/* Header com busca */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <h2 className="text-xl font-semibold text-white">User Management</h2>

                    <div className="flex items-center space-x-3">
                        {/* Search bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 transition-all duration-200">
                            <Plus className="h-4 w-4 mr-1" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Tabela de usuários conforme especificação */}
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Nome de Usuário
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Papel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium text-white">
                                                            {user.username[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white">{user.username}</div>
                                                        <div className="text-sm text-gray-400">ID: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-200">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(user.active)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {/* Botão de Ações (...) com menu dropdown conforme especificação */}
                                                <div className="flex items-center space-x-2">
                                                    <button className="text-gray-400 hover:text-white transition-colors">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-gray-400 hover:text-white transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-gray-400 hover:text-white transition-colors">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    /**
     * Seção de Logs de Auditoria conforme especificação
     */
    const renderAuditLogs = () => {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Audit Logs</h2>

                {/* Gráficos que visualizam os dados de log conforme especificação */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Daily Login Activity</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#F9FAFB'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="active" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Failed Login Attempts</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800">
                                <div className="flex items-center space-x-3">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    <span className="text-sm text-red-200">Failed attempts today</span>
                                </div>
                                <span className="text-lg font-bold text-red-400">23</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                                <div className="flex items-center space-x-3">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                    <span className="text-sm text-yellow-200">Suspicious activity</span>
                                </div>
                                <span className="text-lg font-bold text-yellow-400">7</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabela paginada e filtrável para logs conforme especificação */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity Logs</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Action
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        IP Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        2024-01-15 10:30:00
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        john.doe@example.com
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        User Login
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        192.168.1.100
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                                            Success
                                        </span>
                                    </td>
                                </tr>
                                {/* More log entries... */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 flex">

            {/* Barra Lateral conforme especificação */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">

                {/* Logo/Header da Sidebar */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                            <p className="text-xs text-gray-400">Management System</p>
                        </div>
                    </div>
                </div>

                {/* Navegação da Sidebar com ícones (lucide-react) conforme especificação */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setCurrentSection('dashboard')}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'dashboard'
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <BarChart3 className="h-5 w-5" />
                                <span>Dashboard</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentSection('users')}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'users'
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <Users className="h-5 w-5" />
                                <span>Gerenciamento de Usuários</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentSection('audit')}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'audit'
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <FileText className="h-5 w-5" />
                                <span>Logs de Auditoria</span>
                            </button>
                        </li>
                        <li>
                            <Link
                                to="/profile"
                                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                <User className="h-5 w-5" />
                                <span>Meu Perfil</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Footer da Sidebar */}
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-300 hover:bg-red-600 hover:text-white"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Conteúdo Principal */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* Top Header */}
                <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white capitalize">{currentSection}</h2>
                            <p className="text-sm text-gray-400">
                                {currentSection === 'dashboard' && 'System overview and analytics'}
                                {currentSection === 'users' && 'Manage user accounts and permissions'}
                                {currentSection === 'audit' && 'View system logs and activity'}
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* User Info */}
                            <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">
                                        {state.user?.username?.[0]?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-white">{state.user?.username}</p>
                                    <p className="text-xs text-gray-400">{state.user?.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Área de Conteúdo Rolável */}
                <div className="flex-1 overflow-auto p-6">
                    {renderCurrentSection()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
