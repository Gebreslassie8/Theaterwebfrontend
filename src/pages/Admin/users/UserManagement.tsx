// src/pages/Admin/users/UserManagement.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    UsersRound,
    UserPlus,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    Ban,
    Phone,
    Calendar,
    DollarSign,
    Ticket,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Search,
    TrendingUp,
    Activity,
    UserMinus,
    UserCheck,
    ShieldCheck,
    Crown,
    Shield,
    XCircle as XCircleIcon,
    LayoutGrid
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import AddUser from './AddNewUser';
import UpdateUser from './UpdateUser';
import ViewUsers from './ViewUsers';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// User Type Definition
interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'Admin' | 'Manager' | 'User' | 'Theater Owner';
    status: 'Active' | 'Inactive' | 'Pending';
    joinDate: string;
    lastActive: string;
    bookings: number;
    totalSpent: number;
    address?: string;
    department?: string;
    theater?: string;
    rating?: number;
}

// Mock User Data
const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+251 911 234 567', role: 'Admin', status: 'Active', joinDate: '2024-01-15', lastActive: '2024-04-01', bookings: 45, totalSpent: 12500 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+251 912 345 678', role: 'Manager', status: 'Active', joinDate: '2024-02-20', lastActive: '2024-04-02', bookings: 32, totalSpent: 8900 },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', phone: '+251 913 456 789', role: 'User', status: 'Active', joinDate: '2024-03-10', lastActive: '2024-04-01', bookings: 12, totalSpent: 3400 },
    { id: 4, name: 'Sarah Williams', email: 'sarah.williams@example.com', phone: '+251 914 567 890', role: 'Theater Owner', status: 'Active', joinDate: '2024-01-05', lastActive: '2024-04-03', bookings: 89, totalSpent: 25600 },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', phone: '+251 915 678 901', role: 'User', status: 'Inactive', joinDate: '2023-12-01', lastActive: '2024-03-15', bookings: 5, totalSpent: 1200 },
    { id: 6, name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+251 916 789 012', role: 'Manager', status: 'Active', joinDate: '2024-01-25', lastActive: '2024-04-02', bookings: 28, totalSpent: 7600 },
    { id: 7, name: 'Michael Wilson', email: 'michael.wilson@example.com', phone: '+251 917 890 123', role: 'User', status: 'Pending', joinDate: '2024-03-20', lastActive: '2024-03-28', bookings: 0, totalSpent: 0 },
    { id: 8, name: 'Jessica Taylor', email: 'jessica.taylor@example.com', phone: '+251 918 901 234', role: 'Theater Owner', status: 'Active', joinDate: '2023-11-10', lastActive: '2024-04-01', bookings: 156, totalSpent: 45200 },
    { id: 9, name: 'Robert Anderson', email: 'robert.anderson@example.com', phone: '+251 919 012 345', role: 'User', status: 'Active', joinDate: '2024-02-05', lastActive: '2024-04-02', bookings: 18, totalSpent: 5100 },
    { id: 10, name: 'Lisa Martinez', email: 'lisa.martinez@example.com', phone: '+251 910 123 456', role: 'Manager', status: 'Active', joinDate: '2024-01-18', lastActive: '2024-04-03', bookings: 42, totalSpent: 11800 },
];

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Success Popup State
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Get current user role from localStorage (in real app, from auth context)
    const currentUserRole = 'admin';

    // Filtered users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Stats
    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'Active').length,
        pendingUsers: users.filter(u => u.status === 'Pending').length,
        totalBookings: users.reduce((sum, u) => sum + u.bookings, 0),
    };

    // Check if user can be deactivated
    const canDeactivate = (user: User): boolean => {
        const authorizedRoles = ['admin', 'super_admin'];
        return authorizedRoles.includes(currentUserRole) && user.role !== 'Admin' && user.status === 'Active';
    };

    // Check if user can be reactivated
    const canReactivate = (user: User): boolean => {
        const authorizedRoles = ['admin', 'super_admin'];
        return authorizedRoles.includes(currentUserRole) && user.status === 'Inactive';
    };

    // Column definitions
    const columns = [
        {
            Header: 'User',
            accessor: 'name',
            sortable: true,
            Cell: (row: User) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deepTeal to-teal-600 flex items-center justify-center text-white font-bold">
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.email}</p>
                    </div>
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
            Header: 'Role',
            accessor: 'role',
            sortable: true,
            Cell: (row: User) => {
                const config = {
                    Admin: { icon: ShieldCheck, color: 'bg-red-100 text-red-700', label: 'Admin' },
                    Manager: { icon: Shield, color: 'bg-blue-100 text-blue-700', label: 'Manager' },
                    'Theater Owner': { icon: Crown, color: 'bg-amber-100 text-amber-700', label: 'Theater Owner' },
                    User: { icon: UserCheck, color: 'bg-green-100 text-green-700', label: 'User' }
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
                    Inactive: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Inactive' },
                    Pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' }
                };
                const c = config[row.status];
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
            Header: 'Bookings',
            accessor: 'bookings',
            sortable: true,
            Cell: (row: User) => (
                <div className="flex items-center gap-1">
                    <Ticket className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{row.bookings}</span>
                </div>
            )
        },
        {
            Header: 'Total Spent',
            accessor: 'totalSpent',
            sortable: true,
            Cell: (row: User) => (
                <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-green-500" />
                    <span className="text-sm font-medium text-green-600">ETB {row.totalSpent.toLocaleString()}</span>
                </div>
            )
        },
        {
            Header: 'Join Date',
            accessor: 'joinDate',
            sortable: true,
            Cell: (row: User) => (
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{new Date(row.joinDate).toLocaleDateString()}</span>
                </div>
            )
        }
    ];

    // Action buttons for each row - FIXED POSITIONING
    const renderActions = (row: User) => (
        <div className="flex items-center justify-start gap-2">
            {/* View Button */}
            <button
                onClick={() => {
                    setViewingUser(row);
                    setShowViewModal(true);
                }}
                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 group"
                title="View Details"
            >
                <Eye className="h-4 w-4 text-blue-600" />
            </button>

            {/* Edit Button */}
            <button
                onClick={() => {
                    setSelectedUser(row);
                    setShowUpdateModal(true);
                }}
                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-all duration-200 group"
                title="Edit User"
            >
                <Edit className="h-4 w-4 text-teal-600" />
            </button>

            {/* Deactivate Button - Only for Active users */}
            {canDeactivate(row) && (
                <button
                    onClick={() => {
                        setUserToDeactivate(row);
                        setShowDeactivateConfirm(true);
                    }}
                    className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-all duration-200 group"
                    title="Deactivate User"
                >
                    <Ban className="h-4 w-4 text-orange-600" />
                </button>
            )}

            {/* Reactivate Button - Only for Inactive users */}
            {canReactivate(row) && (
                <button
                    onClick={() => {
                        setUserToReactivate(row);
                        setShowReactivateConfirm(true);
                    }}
                    className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200 group"
                    title="Reactivate User"
                >
                    <RefreshCw className="h-4 w-4 text-green-600" />
                </button>
            )}

            {/* Delete Button - For all non-admin users */}
            {row.role !== 'Admin' && (
                <button
                    onClick={() => {
                        setUserToDelete(row);
                        setShowDeleteConfirm(true);
                    }}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200 group"
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
                message: `${userToDelete.name} has been removed successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleDeactivateUser = () => {
        if (userToDeactivate) {
            const updatedUsers = users.map(user =>
                user.id === userToDeactivate.id
                    ? { ...user, status: 'Inactive' as const }
                    : user
            );
            setUsers(updatedUsers);

            setShowDeactivateConfirm(false);
            setUserToDeactivate(null);
            setDeactivationReason('');

            setPopupMessage({
                title: 'User Deactivated!',
                message: `${userToDeactivate.name} has been deactivated successfully`,
                type: 'warning'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleReactivateUser = () => {
        if (userToReactivate) {
            const updatedUsers = users.map(user =>
                user.id === userToReactivate.id
                    ? { ...user, status: 'Active' as const, lastActive: new Date().toISOString().split('T')[0] }
                    : user
            );
            setUsers(updatedUsers);

            setShowReactivateConfirm(false);
            setUserToReactivate(null);

            setPopupMessage({
                title: 'User Reactivated!',
                message: `${userToReactivate.name} has been reactivated successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleAddUser = (userData: any) => {
        const newUser: User = {
            id: users.length + 1,
            name: userData.username,
            email: userData.email,
            phone: userData.phone,
            role: userData.role === 'admin' ? 'Admin' :
                userData.role === 'manager' ? 'Manager' :
                    userData.role === 'theater_owner' ? 'Theater Owner' : 'User',
            status: userData.status,
            joinDate: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString().split('T')[0],
            bookings: 0,
            totalSpent: 0
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
            message: `${updatedUserData.name} has been updated successfully`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    // Add actions column to columns array
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {/* Total Users Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <UsersRound className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                +{stats.activeUsers} active
                            </span>
                            <span className="text-gray-400">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active rate</span>
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}></div>
                        </div>
                    </div>

                    {/* Active Users Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Active Users</p>
                                <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600 flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                Currently online
                            </span>
                            <span className="text-gray-400">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total</span>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">Active users count</div>
                    </div>

                    {/* Pending Approval Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Pending Approval</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pendingUsers}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <UserMinus className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-yellow-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Awaiting verification
                            </span>
                            <span className="text-gray-400">{stats.pendingUsers} pending</span>
                        </div>
                        <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(stats.pendingUsers / stats.totalUsers) * 100}%` }}></div>
                        </div>
                    </div>

                    {/* Total Bookings Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                <Ticket className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-600 flex items-center gap-1">
                                <Ticket className="h-3 w-3" />
                                Lifetime bookings
                            </span>
                            <span className="text-gray-400">{Math.round(stats.totalBookings / stats.totalUsers)} per user</span>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">Total tickets sold</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Theater Owner">Theater Owner</option>
                            <option value="User">User</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                    <ReusableButton
                        onClick={() => setShowAddModal(true)}
                        icon="UserPlus"
                        label="Add New User"
                        className="px-5 py-2.5 text-sm whitespace-nowrap"
                    />
                </div>

                {/* Table */}
                <ReusableTable
                    columns={columnsWithActions}
                    data={filteredUsers}
                    icon={LayoutGrid}
                    showSearch={false}
                    showExport={true}
                    showPrint={true}
                    onExport={() => console.log('Export')}
                    onPrint={() => console.log('Print')}
                />

                {/* Add User Modal */}
                {showAddModal && (
                    <AddUser
                        onSubmit={handleAddUser}
                        onClose={() => setShowAddModal(false)}
                        formTitle="Add New User"
                    />
                )}

                {/* Update User Modal */}
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

                {/* View User Modal */}
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
                                Are you sure you want to deactivate <strong>{userToDeactivate.name}</strong>?
                            </p>
                            <div className="mb-4">
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
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeactivateConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeactivateUser}
                                    disabled={!deactivationReason}
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                                >
                                    Deactivate User
                                </button>
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
                                Are you sure you want to reactivate <strong>{userToReactivate.name}</strong>?
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                The user will regain access to their account with their previous role and permissions.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowReactivateConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReactivateUser}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Reactivate User
                                </button>
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
                                Are you sure you want to delete user <strong className="text-gray-900">{userToDelete.name}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Delete User
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Success Popup */}
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
        </div>
    );
};

export default UserManagement;