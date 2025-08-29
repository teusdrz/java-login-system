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
    Eye
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

const UserManagement: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const pageRef = useRef<HTMLDivElement>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const userStats: UserStats = {
        total: 2847,
        active: 2683,
        inactive: 164,
        pending: 23,
        admins: 12,
        managers: 89,
        users: 2598,
        viewers: 148
    };

    const userData: UserData[] = [
        {
            id: '1',
            name: 'João Silva',
            email: 'joao.silva@company.com',
            role: 'admin',
            status: 'active',
            lastLogin: '2025-08-28 15:30',
            createdAt: '2024-01-15',
            department: 'IT Department'
        },
        {
            id: '2',
            name: 'Maria Santos',
            email: 'maria.santos@company.com',
            role: 'manager',
            status: 'active',
            lastLogin: '2025-08-28 14:22',
            createdAt: '2024-02-20',
            department: 'Sales Department'
        },
        {
            id: '3',
            name: 'Pedro Oliveira',
            email: 'pedro.oliveira@company.com',
            role: 'user',
            status: 'inactive',
            lastLogin: '2025-08-25 09:15',
            createdAt: '2024-03-10',
            department: 'Marketing Department'
        },
        {
            id: '4',
            name: 'Ana Costa',
            email: 'ana.costa@company.com',
            role: 'user',
            status: 'active',
            lastLogin: '2025-08-28 16:45',
            createdAt: '2024-04-05',
            department: 'HR Department'
        },
        {
            id: '5',
            name: 'Carlos Lima',
            email: 'carlos.lima@company.com',
            role: 'viewer',
            status: 'pending',
            lastLogin: 'Never',
            createdAt: '2025-08-28',
            department: 'Finance Department'
        }
    ];

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

    const filteredUsers = userData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleSelectUser = (userId: string) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(user => user.id));
        }
    };

    const handleEditUser = (user: UserData) => {
        console.log('Editing user:', user);
        // setEditingUser(user);
        // setShowEditUserModal(true);
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            console.log('Deleting user:', userId);
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedUsers.length === 0) return;
        
        switch (action) {
            case 'activate':
                console.log('Activating users:', selectedUsers);
                break;
            case 'deactivate':
                console.log('Deactivating users:', selectedUsers);
                break;
            case 'delete':
                if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
                    console.log('Deleting users:', selectedUsers);
                }
                break;
        }
        setSelectedUsers([]);
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
                                        text="User Management"
                                        className="text-3xl font-bold text-gray-900"
                                        delay={0.2}
                                    />
                                    <BusinessAnimatedText 
                                        text="Manage user accounts, roles, and permissions"
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
                        { label: 'Total Users', value: userStats.total, color: 'blue', icon: Users },
                        { label: 'Active', value: userStats.active, color: 'green', icon: CheckCircle },
                        { label: 'Inactive', value: userStats.inactive, color: 'red', icon: XCircle },
                        { label: 'Pending', value: userStats.pending, color: 'yellow', icon: Clock },
                        { label: 'Admins', value: userStats.admins, color: 'yellow', icon: Crown },
                        { label: 'Managers', value: userStats.managers, color: 'blue', icon: Shield },
                        { label: 'Users', value: userStats.users, color: 'green', icon: User },
                        { label: 'Viewers', value: userStats.viewers, color: 'gray', icon: Eye }
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
                                        placeholder="Search users..."
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
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">User</option>
                                    <option value="viewer">Viewer</option>
                                </select>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => console.log('Add user modal')}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Add User
                                </button>
                                
                                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </button>
                                
                                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Import
                                </button>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedUsers.length > 0 && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-900">
                                        {selectedUsers.length} user(s) selected
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleBulkAction('activate')}
                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors duration-200"
                                        >
                                            Activate
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('deactivate')}
                                            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors duration-200"
                                        >
                                            Deactivate
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('delete')}
                                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
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
                                                onChange={handleSelectAll}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    <span className="ml-1 capitalize">{user.role}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                    {getStatusIcon(user.status)}
                                                    <span className="ml-1 capitalize">{user.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {user.department}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {user.lastLogin}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="p-1 rounded text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-1 rounded text-red-600 hover:bg-red-100 transition-colors duration-200"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1 rounded text-gray-600 hover:bg-gray-100 transition-colors duration-200">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                                    <span className="font-medium">{filteredUsers.length}</span> results
                                </div>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-100 transition-colors duration-200">
                                        Previous
                                    </button>
                                    <button className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-100 transition-colors duration-200">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </BusinessCard>
            </div>
        </div>
    );
};

export default UserManagement;
