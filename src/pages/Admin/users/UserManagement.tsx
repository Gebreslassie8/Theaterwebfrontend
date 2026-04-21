// src/pages/Admin/users/UserManagement.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    UsersRound,
    UserPlus,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    Ban,
    Phone,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    TrendingUp,
    Activity,
    UserCheck,
    ShieldCheck,
    Crown,
    Shield,
    LayoutGrid,
    ArrowRight,
    Mail,
    Lock,
    Image as ImageIcon,
    Calendar,
    AlertTriangle,
    UserX,
    UserCog,
    Trash,
    Clock
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import AddUser from './AddNewUser';
import UpdateUser from './UpdateUser';
import ViewUsers from './ViewUsers';

// User Type Definition
interface User {
    id: number;
    username: string;
    email: string;
    phone: string;
    password: string;
    image: string;
    role: 'Admin' | 'Manager' | 'Theater Owner' | 'Salesperson' | 'Scanner' | 'Customer';
    status: 'Active' | 'Inactive' | 'Permanently Deactivated';
    deactivatedAt?: string;
    deactivationReason?: string;
    deactivationType?: 'temporary' | 'permanent';
}

// Mock User Data with enhanced deactivation info
const mockUsers: User[] = [
    { id: 1, username: 'john_admin', email: 'john.doe@example.com', phone: '+251 911 234 567', password: '********', image: 'https://ui-avatars.com/api/?name=John&background=0D9488&color=fff&size=128', role: 'Admin', status: 'Active' },
    { id: 2, username: 'jane_manager', email: 'jane.smith@example.com', phone: '+251 912 345 678', password: '********', image: 'https://ui-avatars.com/api/?name=Jane&background=0D9488&color=fff&size=128', role: 'Manager', status: 'Active' },
    { id: 3, username: 'mike_customer', email: 'mike.johnson@example.com', phone: '+251 913 456 789', password: '********', image: 'https://ui-avatars.com/api/?name=Mike&background=0D9488&color=fff&size=128', role: 'Customer', status: 'Active' },
    { id: 4, username: 'sarah_owner', email: 'sarah.williams@example.com', phone: '+251 914 567 890', password: '********', image: 'https://ui-avatars.com/api/?name=Sarah&background=0D9488&color=fff&size=128', role: 'Theater Owner', status: 'Active' },
    { id: 5, username: 'david_user', email: 'david.brown@example.com', phone: '+251 915 678 901', password: '********', image: 'https://ui-avatars.com/api/?name=David&background=0D9488&color=fff&size=128', role: 'Customer', status: 'Inactive', deactivatedAt: '2024-03-15', deactivationReason: 'Inactive account', deactivationType: 'temporary' },
    { id: 6, username: 'emily_manager', email: 'emily.davis@example.com', phone: '+251 916 789 012', password: '********', image: 'https://ui-avatars.com/api/?name=Emily&background=0D9488&color=fff&size=128', role: 'Manager', status: 'Active' },
    { id: 7, username: 'jessica_owner', email: 'jessica.taylor@example.com', phone: '+251 918 901 234', password: '********', image: 'https://ui-avatars.com/api/?name=Jessica&background=0D9488&color=fff&size=128', role: 'Theater Owner', status: 'Active' },
    { id: 8, username: 'robert_sales', email: 'robert.anderson@example.com', phone: '+251 919 012 345', password: '********', image: 'https://ui-avatars.com/api/?name=Robert&background=0D9488&color=fff&size=128', role: 'Salesperson', status: 'Active' },
    { id: 9, username: 'lisa_customer', email: 'lisa.martinez@example.com', phone: '+251 910 123 456', password: '********', image: 'https://ui-avatars.com/api/?name=Lisa&background=0D9488&color=fff&size=128', role: 'Customer', status: 'Active' },
    { id: 10, username: 'michael_scanner', email: 'michael.wilson@example.com', phone: '+251 917 890 123', password: '********', image: 'https://ui-avatars.com/api/?name=Michael&background=0D9488&color=fff&size=128', role: 'Scanner', status: 'Active' },
    { id: 11, username: 'kevin_wilson', email: 'kevin.wilson@example.com', phone: '+251 920 123 456', password: '********', image: 'https://ui-avatars.com/api/?name=Kevin&background=0D9488&color=fff&size=128', role: 'Customer', status: 'Inactive', deactivatedAt: '2024-03-20', deactivationReason: 'Violation of terms', deactivationType: 'temporary' },
    { id: 12, username: 'anna_smith', email: 'anna.smith@example.com', phone: '+251 921 234 567', password: '********', image: 'https://ui-avatars.com/api/?name=Anna&background=0D9488&color=fff&size=128', role: 'Salesperson', status: 'Permanently Deactivated', deactivatedAt: '2024-02-10', deactivationReason: 'Fraudulent activity', deactivationType: 'permanent' }
];

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

// Stat Card Component (matching AdminDashboard style)
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    link?: string;
    notification?: boolean;
    notificationCount?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, notification, notificationCount }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getNotificationColor = () => {
        if (title === 'Total Users') return '';
        if (title === 'Deactivated Users') return 'bg-yellow-500';
        if (title === 'New Deactivations') return 'bg-teal-500';
        return 'bg-teal-500';
    };

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
                        {notification && notificationCount && notificationCount > 0 && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold ${getNotificationColor()} text-white rounded-full animate-pulse`}>
                                {notificationCount}
                            </span>
                        )}
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

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [showReactivateConfirm, setShowReactivateConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
    const [userToReactivate, setUserToReactivate] = useState<User | null>(null);
    const [deactivationReason, setDeactivationReason] = useState('');
    const [deactivationType, setDeactivationType] = useState<'temporary' | 'permanent'>('temporary');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    const currentUserRole = 'admin';

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Get current month's deactivations
    const getCurrentMonthDeactivations = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return users.filter(user => {
            if (user.deactivatedAt && (user.status === 'Inactive' || user.status === 'Permanently Deactivated')) {
                const deactivationDate = new Date(user.deactivatedAt);
                return deactivationDate.getMonth() === currentMonth && deactivationDate.getFullYear() === currentYear;
            }
            return false;
        }).length;
    };

    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'Active').length,
        deactivatedUsers: users.filter(u => u.status === 'Inactive' || u.status === 'Permanently Deactivated').length,
        permanentDeactivation: users.filter(u => u.status === 'Permanently Deactivated').length,
        thisMonthDeactivations: getCurrentMonthDeactivations()
    };

    const canDeactivate = (user: User): boolean => {
        const authorizedRoles = ['admin', 'super_admin'];
        return authorizedRoles.includes(currentUserRole) && user.role !== 'Admin' && user.status === 'Active';
    };

    const canReactivate = (user: User): boolean => {
        const authorizedRoles = ['admin', 'super_admin'];
        return authorizedRoles.includes(currentUserRole) && user.status === 'Inactive' && user.deactivationType === 'temporary';
    };

    // Column definitions - HIDDEN Image and Username columns
    const columns = [
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
                    <span className="text-sm text-gray-600">{row.phone}</span>
                </div>
            )
        },
        {
            Header: 'Password',
            accessor: 'password',
            sortable: false,
            Cell: (row: User) => (
                <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-mono text-gray-600">{row.password}</span>
                </div>
            )
        },
        {
            Header: 'Role',
            accessor: 'role',
            sortable: true,
            Cell: (row: User) => {
                const config = {
                    Admin: { icon: ShieldCheck, color: 'bg-red-100 text-red-700', label: 'Admin' },
                    Manager: { icon: Shield, color: 'bg-blue-100 text-blue-700', label: 'Manager' },
                    'Theater Owner': { icon: Crown, color: 'bg-amber-100 text-amber-700', label: 'Theater Owner' },
                    Salesperson: { icon: UserCheck, color: 'bg-green-100 text-green-700', label: 'Salesperson' },
                    Scanner: { icon: Shield, color: 'bg-purple-100 text-purple-700', label: 'Scanner' },
                    Customer: { icon: UserCheck, color: 'bg-teal-100 text-teal-700', label: 'Customer' }
                };
                const c = config[row.role];
                const Icon = c.icon;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>
                        <Icon className="h-3 w-3" />
                        {c.label}
                    </span>
                );
            }
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: User) => {
                const config = {
                    Active: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Active' },
                    Inactive: { icon: XCircle, color: 'bg-yellow-100 text-yellow-700', label: 'Inactive (Temporary)' },
                    'Permanently Deactivated': { icon: Ban, color: 'bg-red-100 text-red-700', label: 'Permanently Deactivated' }
                };
                const c = config[row.status as keyof typeof config];
                const Icon = c.icon;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>
                        <Icon className="h-3 w-3" />
                        {c.label}
                    </span>
                );
            }
        }
    ];

    const renderActions = (row: User) => (
        <div className="flex items-center justify-start gap-2">
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

            <button
                onClick={() => {
                    setSelectedUser(row);
                    setShowUpdateModal(true);
                }}
                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-all duration-200"
                title="Edit User"
            >
                <Edit className="h-4 w-4 text-teal-600" />
            </button>

            {canDeactivate(row) && (
                <button
                    onClick={() => {
                        setUserToDeactivate(row);
                        setShowDeactivateConfirm(true);
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
                        setShowReactivateConfirm(true);
                    }}
                    className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200"
                    title="Reactivate User"
                >
                    <RefreshCw className="h-4 w-4 text-green-600" />
                </button>
            )}

            {row.role !== 'Admin' && row.status !== 'Permanently Deactivated' && (
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

    const handleDeleteUser = () => {
        if (userToDelete) {
            setUsers(users.filter(u => u.id !== userToDelete.id));
            setShowDeleteConfirm(false);
            setUserToDelete(null);
            setPopupMessage({
                title: 'User Deleted!',
                message: `${userToDelete.username} has been removed successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleDeactivateUser = () => {
        if (userToDeactivate) {
            const updatedUsers = users.map(user =>
                user.id === userToDeactivate.id
                    ? { 
                        ...user, 
                        status: deactivationType === 'permanent' ? 'Permanently Deactivated' as const : 'Inactive' as const,
                        deactivatedAt: new Date().toISOString().split('T')[0],
                        deactivationReason: deactivationReason,
                        deactivationType: deactivationType
                    }
                    : user
            );
            setUsers(updatedUsers);
            setShowDeactivateConfirm(false);
            setUserToDeactivate(null);
            setDeactivationReason('');
            setDeactivationType('temporary');
            setPopupMessage({
                title: deactivationType === 'permanent' ? 'User Permanently Deactivated!' : 'User Deactivated!',
                message: `${userToDeactivate.username} has been ${deactivationType === 'permanent' ? 'permanently deactivated' : 'deactivated'} successfully${deactivationType === 'permanent' ? '. This action cannot be undone.' : ''}`,
                type: deactivationType === 'permanent' ? 'error' : 'warning'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleReactivateUser = () => {
        if (userToReactivate) {
            const updatedUsers = users.map(user =>
                user.id === userToReactivate.id
                    ? { ...user, status: 'Active' as const, deactivatedAt: undefined, deactivationReason: undefined, deactivationType: undefined }
                    : user
            );
            setUsers(updatedUsers);
            setShowReactivateConfirm(false);
            setUserToReactivate(null);
            setPopupMessage({
                title: 'User Reactivated!',
                message: `${userToReactivate.username} has been reactivated successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleAddUser = (userData: any) => {
        const newUser: User = {
            id: users.length + 1,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            password: '********',
            image: `https://ui-avatars.com/api/?name=${userData.username.charAt(0).toUpperCase()}&background=0D9488&color=fff&size=128`,
            role: userData.role === 'admin' ? 'Admin' :
                userData.role === 'manager' ? 'Manager' :
                    userData.role === 'theater_owner' ? 'Theater Owner' :
                        userData.role === 'salesperson' ? 'Salesperson' :
                            userData.role === 'scanner' ? 'Scanner' : 'Customer',
            status: userData.status
        };
        setUsers([...users, newUser]);
        setShowAddModal(false);
        setPopupMessage({
            title: 'User Added Successfully!',
            message: `${userData.username} has been added to the system`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleUpdateUser = (updatedUserData: any) => {
        setUsers(users.map(user =>
            user.id === updatedUserData.id
                ? { ...user, ...updatedUserData }
                : user
        ));
        setShowUpdateModal(false);
        setSelectedUser(null);
        setPopupMessage({
            title: 'User Updated!',
            message: `${updatedUserData.username} has been updated successfully`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const columnsWithActions = [
        ...columns,
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: renderActions,
            width: '280px',
            align: 'left' as const
        }
    ];

    // Dashboard Cards matching AdminDashboard style
    const dashboardCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: UsersRound, color: 'from-teal-500 to-teal-600', delay: 0.1, link: '/admin/users', notification: false },
        { title: 'Active Users', value: stats.activeUsers, icon: UserCheck, color: 'from-green-500 to-emerald-600', delay: 0.15, link: '/admin/users?status=active', notification: true, notificationCount: stats.activeUsers },
        { title: 'Deactivated Users', value: stats.deactivatedUsers, icon: UserX, color: 'from-red-500 to-rose-600', delay: 0.2, link: '/admin/users?status=deactivated', notification: true, notificationCount: stats.deactivatedUsers },
        { title: 'Permanent Deactivation', value: stats.permanentDeactivation, icon: Trash, color: 'from-orange-500 to-red-600', delay: 0.25, link: '/admin/users?status=permanent', notification: true, notificationCount: stats.permanentDeactivation },
        { title: 'New Deactivations', value: stats.thisMonthDeactivations, icon: Calendar, color: 'from-purple-500 to-indigo-600', delay: 0.3, link: '/admin/users?filter=recent', notification: true, notificationCount: stats.thisMonthDeactivations }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6 bg-gray-50 min-h-screen"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards - AdminDashboard Style */}
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
                            notification={card.notification}
                            notificationCount={card.notificationCount}
                        />
                    ))}
                </motion.div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email or phone..."
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
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Theater Owner">Theater Owner</option>
                            <option value="Salesperson">Salesperson</option>
                            <option value="Scanner">Scanner</option>
                            <option value="Customer">Customer</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive (Temporary)</option>
                            <option value="Permanently Deactivated">Permanently Deactivated</option>
                        </select>
                    </div>
                    <ReusableButton
                        onClick={() => setShowAddModal(true)}
                        icon="UserPlus"
                        label="Add New User"
                        className="px-5 py-2.5 text-sm whitespace-nowrap bg-teal-600 hover:bg-teal-700 text-white"
                    />
                </div>

                {/* Table */}
                <ReusableTable
                    columns={columnsWithActions}
                    data={filteredUsers}
                    icon={LayoutGrid}
                    showSearch={false}
                    showExport={false}
                    showPrint={false}
                />

                {/* Modals */}
                {showAddModal && (
                    <AddUser
                        onSubmit={handleAddUser}
                        onClose={() => setShowAddModal(false)}
                        formTitle="Add New User"
                    />
                )}

                {showUpdateModal && selectedUser && (
                    <UpdateUser
                        user={selectedUser}
                        isOpen={showUpdateModal}
                        onClose={() => {
                            setShowUpdateModal(false);
                            setSelectedUser(null);
                        }}
                        onUpdate={handleUpdateUser}
                    />
                )}

                {showViewModal && viewingUser && (
                    <ViewUsers
                        user={viewingUser}
                        isOpen={showViewModal}
                        onClose={() => {
                            setShowViewModal(false);
                            setViewingUser(null);
                        }}
                        onEdit={(user) => {
                            setShowViewModal(false);
                            setSelectedUser(user);
                            setShowUpdateModal(true);
                        }}
                    />
                )}

                {/* Deactivate Confirmation Modal */}
                {showDeactivateConfirm && userToDeactivate && (
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
                                Are you sure you want to deactivate <strong>{userToDeactivate.username}</strong>?
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deactivation Type</label>
                                <select
                                    value={deactivationType}
                                    onChange={(e) => setDeactivationType(e.target.value as 'temporary' | 'permanent')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 mb-3"
                                >
                                    <option value="temporary">Temporary (Can be reactivated)</option>
                                    <option value="permanent">Permanent (Cannot be restored)</option>
                                </select>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for deactivation</label>
                                <select
                                    value={deactivationReason}
                                    onChange={(e) => setDeactivationReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select reason</option>
                                    <option value="Violation of terms">Violation of terms</option>
                                    <option value="Inactive account">Inactive account</option>
                                    <option value="Requested by user">Requested by user</option>
                                    <option value="Security concern">Security concern</option>
                                    <option value="Fraudulent activity">Fraudulent activity</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {deactivationType === 'permanent' && (
                                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                    <p className="text-sm text-red-700 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Warning: Permanent deactivation cannot be undone. The user will lose all access permanently.
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeactivateConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleDeactivateUser} disabled={!deactivationReason} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition">Deactivate User</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Reactivate Confirmation Modal */}
                {showReactivateConfirm && userToReactivate && (
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
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to reactivate <strong>{userToReactivate.username}</strong>?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowReactivateConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleReactivateUser} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Reactivate User</button>
                            </div>
                        </motion.div>
                    </div>
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
                                Are you sure you want to delete user <strong>{userToDelete.username}</strong>? This action cannot be undone.
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