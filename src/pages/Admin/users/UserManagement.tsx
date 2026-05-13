// src/pages/Admin/users/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    UsersRound,
    Eye,
    Trash2,
    RefreshCw,
    Ban,
    Phone,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    UserCheck,
    ShieldCheck,
    Crown,
    Shield,
    LayoutGrid,
    ArrowRight,
    Mail,
    Calendar,
    AlertTriangle,
    UserX,
    Clock,
    Loader2
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import ViewUsers from './ViewUsers';
import supabase from '@/config/supabaseClient';

// User Type Definition matching your schema
interface User {
    id: string;
    username: string;
    full_name: string;
    email: string;
    phone: string;
    password?: string;
    profile_image_url?: string;
    role: 'super_admin' | 'theater_owner' | 'theater_manager' | 'sales_person' | 'qr_scanner' | 'customer';
    status: 'active' | 'inactive' | 'suspended';
    created_at?: string;
    updated_at?: string;
    last_login?: string;
    bio?: string;
    location?: string;
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 12
        }
    }
};

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link }) => {
    const [isHovered, setIsHovered] = useState(false);

    const CardContent = () => (
        <div
            className="relative overflow-hidden cursor-pointer transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{title}</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
                {link && (
                    <div className={`transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'}`}>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
            {link ? (
                <Link to={link} className="block">
                    <CardContent />
                </Link>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
};

// Deactivate User Modal with Textarea
interface DeactivateUserModalProps {
    user: User | null;
    onClose: () => void;
    onConfirm: (user: User, reason: string) => void;
}

const DeactivateUserModal: React.FC<DeactivateUserModalProps> = ({ user, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (!reason.trim()) {
            setError('Please provide a reason for deactivation');
            return;
        }
        if (user) {
            onConfirm(user, reason);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Deactivate User</h3>
                </div>
                
                <p className="text-gray-600 mb-4">
                    Are you sure you want to deactivate <strong>{user.full_name || user.username}</strong>?
                </p>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for deactivation <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if (error) setError('');
                        }}
                        rows={4}
                        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none`}
                        placeholder="Please provide a reason for deactivation..."
                    />
                    {error && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {error}
                        </p>
                    )}
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                    >
                        Deactivate User
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Reactivate User Modal
interface ReactivateUserModalProps {
    user: User | null;
    onClose: () => void;
    onConfirm: (user: User) => void;
}

const ReactivateUserModal: React.FC<ReactivateUserModalProps> = ({ user, onClose, onConfirm }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <RefreshCw className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Reactivate User</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                    Are you sure you want to reactivate <strong>{user.full_name || user.username}</strong>?
                </p>
                
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(user)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Reactivate User
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showReactivateModal, setShowReactivateModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
    const [userToReactivate, setUserToReactivate] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Fetch users from Supabase
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedUsers: User[] = data.map((user: any) => ({
                id: user.id,
                username: user.username || '',
                full_name: user.full_name || '',
                email: user.email,
                phone: user.phone || '',
                password: '********',
                profile_image_url: user.profile_image_url,
                role: user.role,
                status: user.status,
                created_at: user.created_at,
                updated_at: user.updated_at,
                last_login: user.last_login,
                bio: user.bio,
                location: user.location
            }));

            setUsers(formattedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            setPopupMessage({
                title: 'Error',
                message: 'Failed to load users',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        inactiveUsers: users.filter(u => u.status === 'inactive').length,
        suspendedUsers: users.filter(u => u.status === 'suspended').length,
        newThisMonth: users.filter(u => {
            if (u.created_at) {
                const createdDate = new Date(u.created_at);
                const now = new Date();
                return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
            }
            return false;
        }).length
    };

    const canDeactivate = (user: User): boolean => {
        return user.status === 'active' && user.role !== 'super_admin';
    };

    const canReactivate = (user: User): boolean => {
        return user.status === 'inactive';
    };

    const canDelete = (user: User): boolean => {
        return user.role !== 'super_admin';
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userToDelete.id);

            if (error) throw error;

            await fetchUsers();
            setShowDeleteConfirm(false);
            setUserToDelete(null);
            setPopupMessage({
                title: 'User Deleted!',
                message: `${userToDelete.full_name || userToDelete.username} has been removed successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        } catch (error) {
            console.error('Error deleting user:', error);
            setPopupMessage({
                title: 'Error',
                message: 'Failed to delete user',
                type: 'error'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleDeactivateUser = async (user: User, reason: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    status: 'inactive',
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            await fetchUsers();
            setShowDeactivateModal(false);
            setUserToDeactivate(null);
            setPopupMessage({
                title: 'User Deactivated!',
                message: `${user.full_name || user.username} has been deactivated successfully. Reason: ${reason}`,
                type: 'warning'
            });
            setShowSuccessPopup(true);
        } catch (error) {
            console.error('Error deactivating user:', error);
            setPopupMessage({
                title: 'Error',
                message: 'Failed to deactivate user',
                type: 'error'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleReactivateUser = async (user: User) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    status: 'active',
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            await fetchUsers();
            setShowReactivateModal(false);
            setUserToReactivate(null);
            setPopupMessage({
                title: 'User Reactivated!',
                message: `${user.full_name || user.username} has been reactivated successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        } catch (error) {
            console.error('Error reactivating user:', error);
            setPopupMessage({
                title: 'Error',
                message: 'Failed to reactivate user',
                type: 'error'
            });
            setShowSuccessPopup(true);
        }
    };

    const getRoleDisplay = (role: string) => {
        const roles: Record<string, { label: string; icon: React.ElementType; color: string }> = {
            super_admin: { label: 'Super Admin', icon: ShieldCheck, color: 'bg-red-100 text-red-700' },
            theater_owner: { label: 'Theater Owner', icon: Crown, color: 'bg-amber-100 text-amber-700' },
            theater_manager: { label: 'Theater Manager', icon: Shield, color: 'bg-blue-100 text-blue-700' },
            sales_person: { label: 'Sales Person', icon: UserCheck, color: 'bg-green-100 text-green-700' },
            qr_scanner: { label: 'QR Scanner', icon: Shield, color: 'bg-purple-100 text-purple-700' },
            customer: { label: 'Customer', icon: UserCheck, color: 'bg-teal-100 text-teal-700' }
        };
        return roles[role] || roles.customer;
    };

    const getStatusDisplay = (status: string) => {
        const statuses: Record<string, { label: string; icon: React.ElementType; color: string }> = {
            active: { label: 'Active', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
            inactive: { label: 'Inactive', icon: XCircle, color: 'bg-yellow-100 text-yellow-700' },
            suspended: { label: 'Suspended', icon: AlertTriangle, color: 'bg-red-100 text-red-700' }
        };
        return statuses[status] || statuses.active;
    };

    // Table columns based on your database fields
    const columns = [
        {
            Header: 'Full Name',
            accessor: 'full_name',
            sortable: true,
            Cell: (row: User) => (
                <div className="flex items-center gap-3">
                    {row.profile_image_url ? (
                        <img src={row.profile_image_url} alt={row.full_name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                            {(row.full_name?.[0] || row.username?.[0] || 'U').toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-medium text-gray-900">{row.full_name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">@{row.username || 'N/A'}</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Email',
            accessor: 'email',
            sortable: true,
            Cell: (row: User) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{row.email}</span>
                </div>
            )
        },
        {
            Header: 'Phone',
            accessor: 'phone',
            sortable: true,
            Cell: (row: User) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{row.phone || 'N/A'}</span>
                </div>
            )
        },
        {
            Header: 'Role',
            accessor: 'role',
            sortable: true,
            Cell: (row: User) => {
                const role = getRoleDisplay(row.role);
                const Icon = role.icon;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                        <Icon className="h-3 w-3" />
                        {role.label}
                    </span>
                );
            }
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: User) => {
                const status = getStatusDisplay(row.status);
                const Icon = status.icon;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <Icon className="h-3 w-3" />
                        {status.label}
                    </span>
                );
            }
        },
        {
            Header: 'Created',
            accessor: 'created_at',
            sortable: true,
            Cell: (row: User) => (
                <div className="text-sm text-gray-600">
                    {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}
                </div>
            )
        }
    ];

    const renderActions = (row: User) => (
        <div className="flex items-center gap-2">
            <button
                onClick={() => {
                    setViewingUser(row);
                    setShowViewModal(true);
                }}
                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                title="View Details"
            >
                <Eye className="h-4 w-4 text-blue-600" />
            </button>

            {canDeactivate(row) && (
                <button
                    onClick={() => {
                        setUserToDeactivate(row);
                        setShowDeactivateModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-all duration-200"
                    title="Deactivate User"
                >
                    <Ban className="h-4 w-4 text-orange-600" />
                </button>
            )}

            {canReactivate(row) && (
                <button
                    onClick={() => {
                        setUserToReactivate(row);
                        setShowReactivateModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200"
                    title="Reactivate User"
                >
                    <RefreshCw className="h-4 w-4 text-green-600" />
                </button>
            )}

            {canDelete(row) && (
                <button
                    onClick={() => {
                        setUserToDelete(row);
                        setShowDeleteConfirm(true);
                    }}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200"
                    title="Delete User"
                >
                    <Trash2 className="h-4 w-4 text-red-600" />
                </button>
            )}
        </div>
    );

    const columnsWithActions = [
        ...columns,
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: renderActions,
            width: '200px',
            align: 'left' as const
        }
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phone || '').includes(searchTerm);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const dashboardCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: UsersRound, color: 'from-teal-500 to-teal-600', delay: 0.1, link: '/admin/users' },
        { title: 'Active Users', value: stats.activeUsers, icon: UserCheck, color: 'from-green-500 to-emerald-600', delay: 0.15, link: '/admin/users?status=active' },
        { title: 'Inactive Users', value: stats.inactiveUsers, icon: UserX, color: 'from-yellow-500 to-orange-600', delay: 0.2, link: '/admin/users?status=inactive' },
        { title: 'Suspended', value: stats.suspendedUsers, icon: AlertTriangle, color: 'from-red-500 to-red-600', delay: 0.25, link: '/admin/users?status=suspended' },
        { title: 'New This Month', value: stats.newThisMonth, icon: Calendar, color: 'from-purple-500 to-indigo-600', delay: 0.3, link: '/admin/users?filter=recent' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6 bg-gray-50 min-h-screen"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                    {dashboardCards.map((card, index) => (
                        <StatCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            delay={card.delay}
                            link={card.link}
                        />
                    ))}
                </motion.div>

                {/* Search and Filters - Removed Add User Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, username, email or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Roles</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="theater_owner">Theater Owner</option>
                            <option value="theater_manager">Theater Manager</option>
                            <option value="sales_person">Sales Person</option>
                            <option value="qr_scanner">QR Scanner</option>
                            <option value="customer">Customer</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                    {/* Add User Button REMOVED */}
                </div>

                {/* Table */}
                <ReusableTable
                    columns={columnsWithActions}
                    data={filteredUsers}
                    icon={LayoutGrid}
                    showSearch={false}
                    showExport={false}
                    showPrint={false}
                    itemsPerPage={10}
                />

                {/* View Modal */}
                {showViewModal && viewingUser && (
                    <ViewUsers
                        user={viewingUser}
                        isOpen={showViewModal}
                        onClose={() => {
                            setShowViewModal(false);
                            setViewingUser(null);
                        }}
                    />
                )}

                {/* Deactivate Modal */}
                {showDeactivateModal && userToDeactivate && (
                    <DeactivateUserModal
                        user={userToDeactivate}
                        onClose={() => setShowDeactivateModal(false)}
                        onConfirm={handleDeactivateUser}
                    />
                )}

                {/* Reactivate Modal */}
                {showReactivateModal && userToReactivate && (
                    <ReactivateUserModal
                        user={userToReactivate}
                        onClose={() => setShowReactivateModal(false)}
                        onConfirm={handleReactivateUser}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && userToDelete && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete user <strong>{userToDelete.full_name || userToDelete.username}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleDeleteUser} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete User</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                <SuccessPopup
                    isOpen={showSuccessPopup}
                    onClose={() => setShowSuccessPopup(false)}
                    type={popupMessage.type}
                    title={popupMessage.title}
                    message={popupMessage.message}
                    duration={3000}
                    position="top-right"
                />
            </div>
        </motion.div>
    );
};

export default UserManagement;