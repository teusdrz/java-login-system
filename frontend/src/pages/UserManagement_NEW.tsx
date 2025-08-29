import React, { useRef, useState } from 'react';
import {
    Users,
    ArrowLeft,
    UserPlus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Shield,
    Download,
    Upload,
    CheckCircle,
    XCircle,
    Clock,
    Crown,
    User,
    Eye,
    Save,
    X
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

interface UserData {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'user' | 'viewer';
    status: 'active' | 'inactive' | 'pending';
    lastLogin: string;
    createdAt: string;
    department: string;
    avatar?: string;
}

interface UserStats {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    admins: number;
    managers: number;
    users: number;
    viewers: number;
}

// Função para gerar dados fictícios realistas
const generateMockUsers = (): UserData[] => {
    const departments = [
        'IT Department', 'Sales Department', 'Marketing Department',
        'HR Department', 'Finance Department', 'Operations Department',
        'Customer Service', 'Engineering', 'Product Management', 'Legal Department'
    ];

    const firstNames = [
        'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Luisa', 'Fernando', 'Juliana',
        'Roberto', 'Carla', 'Marcos', 'Patricia', 'André', 'Beatriz', 'Paulo',
        'Fernanda', 'Ricardo', 'Mônica', 'Rodrigo', 'Cristina', 'Lucas', 'Amanda',
        'Gabriel', 'Renata', 'Diego', 'Camila', 'Bruno', 'Vanessa', 'Thiago', 'Sandra'
    ];

    const lastNames = [
        'Silva', 'Santos', 'Oliveira', 'Costa', 'Lima', 'Pereira', 'Souza',
        'Rodrigues', 'Ferreira', 'Alves', 'Gomes', 'Martins', 'Araújo', 'Melo',
        'Barbosa', 'Ribeiro', 'Cardoso', 'Dias', 'Morais', 'Reis', 'Dantas',
        'Moreira', 'Teixeira', 'Mendes', 'Cavalcanti', 'Andrade', 'Nascimento'
    ];

    const roles: ('admin' | 'manager' | 'user' | 'viewer')[] = ['admin', 'manager', 'user', 'viewer'];
    const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];

    const users: UserData[] = [];

    for (let i = 1; i <= 50; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;

        // Distribui roles de forma realista
        let role: 'admin' | 'manager' | 'user' | 'viewer';
        if (i <= 2) role = 'admin';
        else if (i <= 8) role = 'manager';
        else if (i <= 42) role = 'user';
        else role = 'viewer';

        // Distribui status de forma realista
        let status: 'active' | 'inactive' | 'pending';
        if (i <= 40) status = 'active';
        else if (i <= 47) status = 'inactive';
        else status = 'pending';

        const department = departments[Math.floor(Math.random() * departments.length)];

        // Gera datas realistas
        const createdDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const lastLoginDate = status === 'active'
            ? new Date(2025, 7, Math.floor(Math.random() * 28) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
            : status === 'inactive'
                ? new Date(2025, 6, Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
                : new Date(0); // Pending users never logged in

        users.push({
            id: i.toString(),
            name,
            email,
            role,
            status,
            lastLogin: status === 'pending' ? 'Never' : lastLoginDate.toISOString().slice(0, 16).replace('T', ' '),
            createdAt: createdDate.toISOString().slice(0, 10),
            department
        });
    }

    return users;
};

const UserManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const pageRef = useRef<HTMLDivElement>(null);

    const [users, setUsers] = useState<UserData[]>(() => generateMockUsers());
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState<Partial<UserData>>({
        name: '',
        email: '',
        role: 'user',
        status: 'pending',
        department: ''
    });

    // Calcula estatísticas dinamicamente baseado nos usuários atuais
    const userStats: UserStats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        pending: users.filter(u => u.status === 'pending').length,
        admins: users.filter(u => u.role === 'admin').length,
        managers: users.filter(u => u.role === 'manager').length,
        users: users.filter(u => u.role === 'user').length,
        viewers: users.filter(u => u.role === 'viewer').length
    };

    // Filtra usuários baseado na pesquisa e filtros
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Função para adicionar usuário
    const handleAddUser = () => {
        if (newUser.name && newUser.email && newUser.department) {
            const user: UserData = {
                id: (users.length + 1).toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role as 'admin' | 'manager' | 'user' | 'viewer',
                status: newUser.status as 'active' | 'inactive' | 'pending',
                department: newUser.department,
                lastLogin: 'Never',
                createdAt: new Date().toISOString().slice(0, 10)
            };

            setUsers([...users, user]);
            setNewUser({ name: '', email: '', role: 'user', status: 'pending', department: '' });
            setShowAddForm(false);
        }
    };

    // Função para editar usuário
    const handleEditUser = (user: UserData) => {
        setEditingUser({ ...user });
    };

    // Função para salvar edição
    const handleSaveEdit = () => {
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
            setEditingUser(null);
        }
    };

    // Função para deletar usuário
    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
            setUsers(users.filter(u => u.id !== userId));
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    // Função para deletar múltiplos usuários
    const handleDeleteSelected = () => {
        if (selectedUsers.length > 0 && window.confirm(`Tem certeza que deseja deletar ${selectedUsers.length} usuários selecionados?`)) {
            setUsers(users.filter(u => !selectedUsers.includes(u.id)));
            setSelectedUsers([]);
        }
    };

    // Função para alternar seleção de usuário
    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // Função para selecionar todos
    const toggleSelectAll = () => {
        setSelectedUsers(
            selectedUsers.length === filteredUsers.length
                ? []
                : filteredUsers.map(u => u.id)
        );
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Crown className="w-4 h-4 text-yellow-600" />;
            case 'manager':
                return <Shield className="w-4 h-4 text-blue-600" />;
            case 'user':
                return <User className="w-4 h-4 text-green-600" />;
            case 'viewer':
                return <Eye className="w-4 h-4 text-gray-600" />;
            default:
                return <User className="w-4 h-4 text-gray-600" />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'text-yellow-700 bg-yellow-100';
            case 'manager':
                return 'text-blue-700 bg-blue-100';
            case 'user':
                return 'text-green-700 bg-green-100';
            case 'viewer':
                return 'text-gray-700 bg-gray-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'inactive':
                return <XCircle className="w-4 h-4 text-red-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-700 bg-green-100';
            case 'inactive':
                return 'text-red-700 bg-red-100';
            case 'pending':
                return 'text-yellow-700 bg-yellow-100';
            default:
                return 'text-gray-700 bg-gray-100';
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
                                        text="Gerenciamento de Usuários"
                                        className="text-3xl font-bold text-gray-900"
                                        delay={0.2}
                                    />
                                    <BusinessAnimatedText
                                        text="Gerencie contas de usuários, funções e permissões"
                                        className="text-lg text-gray-600 mt-2"
                                        delay={0.4}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Users className="w-12 h-12 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </BusinessCard>

                {/* User Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {[
                        { label: 'Total de Usuários', value: userStats.total, color: 'blue', icon: Users },
                        { label: 'Ativos', value: userStats.active, color: 'green', icon: CheckCircle },
                        { label: 'Inativos', value: userStats.inactive, color: 'red', icon: XCircle },
                        { label: 'Pendentes', value: userStats.pending, color: 'yellow', icon: Clock },
                        { label: 'Admins', value: userStats.admins, color: 'yellow', icon: Crown },
                        { label: 'Gerentes', value: userStats.managers, color: 'blue', icon: Shield },
                        { label: 'Usuários', value: userStats.users, color: 'green', icon: User },
                        { label: 'Visualizadores', value: userStats.viewers, color: 'gray', icon: Eye }
                    ].map((stat, index) => (
                        <BusinessCard key={stat.label} delay={0.3 + index * 0.05}>
                            <div className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-xl p-4`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-${stat.color}-700 text-sm font-medium`}>{stat.label}</p>
                                        <p className={`text-${stat.color}-900 text-xl font-bold`}>{stat.value.toLocaleString()}</p>
                                    </div>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                            </div>
                        </BusinessCard>
                    ))}
                </div>

                {/* Controls */}
                <BusinessCard delay={0.5}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Buscar usuários..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                                    />
                                </div>

                                {/* Filters */}
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Todas as Funções</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Gerente</option>
                                    <option value="user">Usuário</option>
                                    <option value="viewer">Visualizador</option>
                                </select>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Todos os Status</option>
                                    <option value="active">Ativo</option>
                                    <option value="inactive">Inativo</option>
                                    <option value="pending">Pendente</option>
                                </select>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Adicionar Usuário
                                </button>

                                <button
                                    onClick={() => alert('Exportando usuários...')}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                                    <Download className="w-4 h-4 mr-2" />
                                    Exportar
                                </button>

                                <button
                                    onClick={() => alert('Importando usuários...')}
                                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Importar
                                </button>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedUsers.length > 0 && (
                            <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <span className="text-blue-700 font-medium">
                                    {selectedUsers.length} usuário(s) selecionado(s)
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleDeleteSelected}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                    >
                                        Deletar Selecionados
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </BusinessCard>

                {/* Users Table */}
                <BusinessCard delay={0.7}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                                onChange={toggleSelectAll}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuário
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Função
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Departamento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Último Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => toggleUserSelection(user.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    <span className="ml-1 capitalize">{user.role}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                    {getStatusIcon(user.status)}
                                                    <span className="ml-1 capitalize">{user.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.department}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.lastLogin}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </BusinessCard>

                {/* Add User Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <BusinessCard className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Adicionar Novo Usuário</h3>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        value={newUser.name || ''}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={newUser.email || ''}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                                    <input
                                        type="text"
                                        value={newUser.department || ''}
                                        onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                                    <select
                                        value={newUser.role || 'user'}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="user">Usuário</option>
                                        <option value="manager">Gerente</option>
                                        <option value="admin">Admin</option>
                                        <option value="viewer">Visualizador</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={newUser.status || 'pending'}
                                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="pending">Pendente</option>
                                        <option value="active">Ativo</option>
                                        <option value="inactive">Inativo</option>
                                    </select>
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={handleAddUser}
                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Salvar
                                    </button>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </BusinessCard>
                    </div>
                )}

                {/* Edit User Modal */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <BusinessCard className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Editar Usuário</h3>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                                    <input
                                        type="text"
                                        value={editingUser.department}
                                        onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                                    <select
                                        value={editingUser.role}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="user">Usuário</option>
                                        <option value="manager">Gerente</option>
                                        <option value="admin">Admin</option>
                                        <option value="viewer">Visualizador</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={editingUser.status}
                                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="pending">Pendente</option>
                                        <option value="active">Ativo</option>
                                        <option value="inactive">Inativo</option>
                                    </select>
                                </div>
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Salvar
                                    </button>
                                    <button
                                        onClick={() => setEditingUser(null)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </BusinessCard>
                    </div>
                )}

                {/* Summary */}
                <BusinessCard delay={0.9}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="text-center">
                            <BusinessAnimatedText
                                text={`Mostrando ${filteredUsers.length} de ${users.length} usuários`}
                                className="text-sm text-gray-600"
                                delay={1.0}
                            />
                        </div>
                    </div>
                </BusinessCard>
            </div>
        </div>
    );
};

export default UserManagement;
