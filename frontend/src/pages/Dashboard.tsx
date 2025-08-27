import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Role } from '../types/api';
import {
    BarChart3,
    Users,
    FileText,
    Settings,
    AlertTriangle,
    Shield,
    UserPlus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    Bell,
    TrendingUp
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    onlineUsers: number;
}

interface ActivityLog {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    type: 'success' | 'warning' | 'error';
}

type ViewType = 'overview' | 'users' | 'activity' | 'settings';

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
        onlineUsers: 0
    });
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<Role | 'all'>('all');

    const isModerator = user?.role === Role.ADMIN || user?.role === Role.MODERATOR;

    const loadDashboardData = React.useCallback(async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadStats(),
                loadUsers(),
                loadActivityLogs()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const loadStats = async () => {
        // Mock data - replace with actual API call
        setStats({
            totalUsers: 1247,
            activeUsers: 892,
            newUsersToday: 23,
            onlineUsers: 156
        });
    };

    const loadUsers = async () => {
        // Mock data - replace with actual API call
        const mockUsers: User[] = [
            {
                id: '1',
                username: 'admin',
                email: 'admin@example.com',
                firstName: 'Admin',
                lastName: 'User',
                role: Role.ADMIN,
                active: true,
                createdAt: '2024-01-01',
                lastModifiedAt: '2024-01-01',
                failedLoginAttempts: 0
            },
            {
                id: '2',
                username: 'moderator1',
                email: 'mod1@example.com',
                firstName: 'Moderator',
                lastName: 'One',
                role: Role.MODERATOR,
                active: true,
                createdAt: '2024-01-15',
                lastModifiedAt: '2024-01-15',
                failedLoginAttempts: 0
            },
            {
                id: '3',
                username: 'user1',
                email: 'user1@example.com',
                firstName: 'User',
                lastName: 'One',
                role: Role.USER,
                active: true,
                createdAt: '2024-02-01',
                lastModifiedAt: '2024-02-01',
                failedLoginAttempts: 0
            },
            {
                id: '4',
                username: 'user2',
                email: 'user2@example.com',
                firstName: 'User',
                lastName: 'Two',
                role: Role.USER,
                active: false,
                createdAt: '2024-02-10',
                lastModifiedAt: '2024-02-10',
                failedLoginAttempts: 2
            }
        ];
        setUsers(mockUsers);
    };

    const loadActivityLogs = async () => {
        // Mock data - replace with actual API call
        const mockLogs: ActivityLog[] = [
            { id: '1', action: 'User Login', user: 'john.doe', timestamp: '2024-03-20 14:30:00', type: 'success' },
            { id: '2', action: 'Failed Login Attempt', user: 'unknown', timestamp: '2024-03-20 14:25:00', type: 'warning' },
            { id: '3', action: 'User Registration', user: 'jane.smith', timestamp: '2024-03-20 14:20:00', type: 'success' },
            { id: '4', action: 'Password Reset', user: 'bob.wilson', timestamp: '2024-03-20 14:15:00', type: 'error' }
        ];
        setActivityLogs(mockLogs);
    };

    const getStatusBadge = (isActive: boolean) => {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
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

    const getRoleBadge = (role: Role) => {
        const roleConfig = {
            [Role.ADMIN]: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400', label: 'Admin' },
            [Role.MODERATOR]: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400', label: 'Moderador' },
            [Role.USER]: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400', label: 'Usuário' }
        };

        const config = roleConfig[role];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Shield className="w-3 h-3 mr-1" />
                {config.label}
            </span>
        );
    };

    const getActivityIcon = (type: ActivityLog['type']) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
            default: return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Chart data
    const userActivityData = [
        { name: 'Jan', users: 65 },
        { name: 'Feb', users: 89 },
        { name: 'Mar', users: 124 },
        { name: 'Apr', users: 145 },
        { name: 'May', users: 178 },
        { name: 'Jun', users: 201 }
    ];

    const roleDistributionData = [
        { name: 'Usuários', value: 85, color: '#6B7280' },
        { name: 'Moderadores', value: 12, color: '#3B82F6' },
        { name: 'Admins', value: 3, color: '#8B5CF6' }
    ];

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Bem-vindo de volta, {user?.username}!
                </h1>
                <p className="text-primary-100">
                    Aqui está um resumo da atividade do sistema hoje.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Total de Usuários</p>
                            <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                            <p className="text-xs text-green-400 mt-1">↗ +12% este mês</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Usuários Ativos</p>
                            <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
                            <p className="text-xs text-green-400 mt-1">↗ +8% esta semana</p>
                        </div>
                        <div className="h-12 w-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Novos Hoje</p>
                            <p className="text-2xl font-bold text-white">{stats.newUsersToday}</p>
                            <p className="text-xs text-blue-400 mt-1">→ Média normal</p>
                        </div>
                        <div className="h-12 w-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                            <UserPlus className="h-6 w-6 text-yellow-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Online Agora</p>
                            <p className="text-2xl font-bold text-white">{stats.onlineUsers}</p>
                            <p className="text-xs text-green-400 mt-1">↗ Pico diário</p>
                        </div>
                        <div className="h-12 w-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Crescimento de Usuários</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userActivityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }}
                            />
                            <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Distribuição de Roles</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={roleDistributionData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {roleDistributionData.map((entry, index) => (
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
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Atividade Recente</h3>
                    <Bell className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                    {activityLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                            {getActivityIcon(log.type)}
                            <div className="flex-1">
                                <p className="text-sm text-white">{log.action}</p>
                                <p className="text-xs text-gray-400">por {log.user} • {log.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderUserManagement = () => (
        <div className="space-y-6">
            {/* User Management Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gerenciamento de Usuários</h1>
                    <p className="text-gray-400">Gerencie usuários, roles e permissões do sistema</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Novo Usuário
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar usuários..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as Role | 'all')}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="all">Todos os Roles</option>
                            <option value={Role.USER}>Usuário</option>
                            <option value={Role.MODERATOR}>Moderador</option>
                            <option value={Role.ADMIN}>Admin</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Usuário
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Criado em
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-white">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-white">{user.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-300">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(user.active)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-300">
                                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-yellow-400 transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between bg-gray-800 px-6 py-3 border border-gray-700 rounded-lg">
                <div className="text-sm text-gray-400">
                    Mostrando {filteredUsers.length} de {users.length} usuários
                </div>
                <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">
                        Anterior
                    </button>
                    <span className="px-3 py-1 text-sm bg-primary-600 text-white rounded">1</span>
                    <button className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">
                        Próximo
                    </button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="space-y-6">
                    <div className="animate-pulse bg-gray-800 h-32 rounded-lg"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-800 h-24 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            );
        }

        switch (currentView) {
            case 'users':
                return renderUserManagement();
            case 'activity':
                return (
                    <div className="text-center py-12">
                        <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Monitor de Atividade</h3>
                        <p className="text-gray-400">Esta funcionalidade será implementada em breve.</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="text-center py-12">
                        <Settings className="h-12 w-12 text-primary-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Configurações do Sistema</h3>
                        <p className="text-gray-400">Esta funcionalidade será implementada em breve.</p>
                    </div>
                );
            default:
                return renderOverview();
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar Navigation - Only for Admin/Moderator */}
            {isModerator && (
                <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
                    <nav className="p-6">
                        <div className="space-y-2">
                            <button
                                onClick={() => setCurrentView('overview')}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${currentView === 'overview'
                                        ? 'bg-primary-500 text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <BarChart3 className="h-5 w-5" />
                                <span>Dashboard</span>
                            </button>

                            <button
                                onClick={() => setCurrentView('users')}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${currentView === 'users'
                                        ? 'bg-primary-500 text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <Users className="h-5 w-5" />
                                <span>Usuários</span>
                            </button>

                            <button
                                onClick={() => setCurrentView('activity')}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${currentView === 'activity'
                                        ? 'bg-primary-500 text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <FileText className="h-5 w-5" />
                                <span>Atividade</span>
                            </button>

                            <button
                                onClick={() => setCurrentView('settings')}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${currentView === 'settings'
                                        ? 'bg-primary-500 text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <Settings className="h-5 w-5" />
                                <span>Configurações</span>
                            </button>
                        </div>
                    </nav>
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 p-6">
                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;
