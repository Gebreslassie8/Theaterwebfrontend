// src/pages/Admin/users/RolesAndPermissions.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    Crown,
    UserCheck,
    UserCog,
    Lock,
    Unlock,
    Eye,
    Edit,
    Trash2,
    Save,
    X,
    Plus,
    Settings,
    Users,
    Ticket,
    DollarSign,
    Building,
    BarChart3,
    MessageCircle,
    FileText,
    Search,
    AlertCircle
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import CreateRole from './CreateRole';

// Types
interface Permission {
    id: string;
    name: string;
    module: string;
    description: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
    color: string;
    icon: React.ElementType;
    permissions: string[];
    userCount: number;
    isSystemRole: boolean;
}

interface Module {
    id: string;
    name: string;
    icon: React.ElementType;
    permissions: Permission[];
}

// Mock Permissions Data
const modules: Module[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        icon: BarChart3,
        permissions: [
            { id: 'view_dashboard', name: 'View Dashboard', module: 'dashboard', description: 'Access to main dashboard' },
            { id: 'view_analytics', name: 'View Analytics', module: 'dashboard', description: 'Access to analytics and reports' },
            { id: 'export_reports', name: 'Export Reports', module: 'dashboard', description: 'Export dashboard data' }
        ]
    },
    {
        id: 'users',
        name: 'User Management',
        icon: Users,
        permissions: [
            { id: 'view_users', name: 'View Users', module: 'users', description: 'View list of all users' },
            { id: 'create_users', name: 'Create Users', module: 'users', description: 'Add new users to system' },
            { id: 'edit_users', name: 'Edit Users', module: 'users', description: 'Modify user information' },
            { id: 'delete_users', name: 'Delete Users', module: 'users', description: 'Remove users from system' },
            { id: 'manage_roles', name: 'Manage Roles', module: 'users', description: 'Create and edit roles' },
            { id: 'assign_roles', name: 'Assign Roles', module: 'users', description: 'Assign roles to users' }
        ]
    },
    {
        id: 'theaters',
        name: 'Theater Management',
        icon: Building,
        permissions: [
            { id: 'view_theaters', name: 'View Theaters', module: 'theaters', description: 'View all theaters' },
            { id: 'create_theaters', name: 'Create Theaters', module: 'theaters', description: 'Add new theaters' },
            { id: 'edit_theaters', name: 'Edit Theaters', module: 'theaters', description: 'Modify theater details' },
            { id: 'delete_theaters', name: 'Delete Theaters', module: 'theaters', description: 'Remove theaters' },
            { id: 'approve_theaters', name: 'Approve Theaters', module: 'theaters', description: 'Approve pending theaters' }
        ]
    },
    {
        id: 'shows',
        name: 'Show Management',
        icon: Ticket,
        permissions: [
            { id: 'view_shows', name: 'View Shows', module: 'shows', description: 'View all shows and events' },
            { id: 'create_shows', name: 'Create Shows', module: 'shows', description: 'Add new shows' },
            { id: 'edit_shows', name: 'Edit Shows', module: 'shows', description: 'Modify show details' },
            { id: 'delete_shows', name: 'Delete Shows', module: 'shows', description: 'Remove shows' },
            { id: 'manage_bookings', name: 'Manage Bookings', module: 'shows', description: 'View and manage bookings' }
        ]
    },
    {
        id: 'payments',
        name: 'Payment Management',
        icon: DollarSign,
        permissions: [
            { id: 'view_payments', name: 'View Payments', module: 'payments', description: 'View all transactions' },
            { id: 'process_refunds', name: 'Process Refunds', module: 'payments', description: 'Process refund requests' },
            { id: 'view_reports', name: 'View Reports', module: 'payments', description: 'View financial reports' },
            { id: 'manage_wallet', name: 'Manage Wallet', module: 'payments', description: 'Manage system wallet' }
        ]
    },
    {
        id: 'content',
        name: 'Content Management',
        icon: FileText,
        permissions: [
            { id: 'view_content', name: 'View Content', module: 'content', description: 'View all content' },
            { id: 'create_content', name: 'Create Content', module: 'content', description: 'Create blog posts and articles' },
            { id: 'edit_content', name: 'Edit Content', module: 'content', description: 'Modify existing content' },
            { id: 'delete_content', name: 'Delete Content', module: 'content', description: 'Remove content' },
            { id: 'publish_content', name: 'Publish Content', module: 'content', description: 'Publish and unpublish content' }
        ]
    },
    {
        id: 'support',
        name: 'Support & Help',
        icon: MessageCircle,
        permissions: [
            { id: 'view_tickets', name: 'View Tickets', module: 'support', description: 'View support tickets' },
            { id: 'reply_tickets', name: 'Reply to Tickets', module: 'support', description: 'Respond to support tickets' },
            { id: 'resolve_tickets', name: 'Resolve Tickets', module: 'support', description: 'Mark tickets as resolved' },
            { id: 'manage_faq', name: 'Manage FAQ', module: 'support', description: 'Create and edit FAQ entries' }
        ]
    },
    {
        id: 'settings',
        name: 'System Settings',
        icon: Settings,
        permissions: [
            { id: 'view_settings', name: 'View Settings', module: 'settings', description: 'View system settings' },
            { id: 'edit_settings', name: 'Edit Settings', module: 'settings', description: 'Modify system settings' },
            { id: 'manage_backup', name: 'Manage Backup', module: 'settings', description: 'Create and restore backups' },
            { id: 'view_logs', name: 'View Logs', module: 'settings', description: 'View system logs' }
        ]
    }
];

// Mock Roles Data
const mockRoles: Role[] = [
    {
        id: '1',
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        color: 'from-red-500 to-red-600',
        icon: ShieldAlert,
        permissions: modules.flatMap(m => m.permissions.map(p => p.id)),
        userCount: 2,
        isSystemRole: true
    },
    {
        id: '2',
        name: 'Admin',
        description: 'Administrative access with most permissions',
        color: 'from-purple-500 to-purple-600',
        icon: ShieldCheck,
        permissions: modules.flatMap(m => m.permissions.map(p => p.id)).filter(p => !p.includes('delete') && !p.includes('manage_backup')),
        userCount: 5,
        isSystemRole: true
    },
    {
        id: '3',
        name: 'Manager',
        description: 'Management access for theaters and shows',
        color: 'from-blue-500 to-blue-600',
        icon: UserCog,
        permissions: [
            'view_dashboard', 'view_analytics',
            'view_users', 'view_theaters', 'create_theaters', 'edit_theaters',
            'view_shows', 'create_shows', 'edit_shows', 'manage_bookings',
            'view_payments', 'view_reports',
            'view_content', 'view_tickets'
        ],
        userCount: 12,
        isSystemRole: false
    },
    {
        id: '4',
        name: 'Theater Owner',
        description: 'Access to own theater management',
        color: 'from-amber-500 to-amber-600',
        icon: Crown,
        permissions: [
            'view_dashboard', 'view_analytics',
            'view_theaters', 'edit_theaters',
            'view_shows', 'create_shows', 'edit_shows', 'manage_bookings',
            'view_payments', 'view_reports'
        ],
        userCount: 8,
        isSystemRole: false
    },
    {
        id: '5',
        name: 'Support Agent',
        description: 'Customer support access',
        color: 'from-green-500 to-green-600',
        icon: MessageCircle,
        permissions: [
            'view_dashboard',
            'view_users', 'view_theaters',
            'view_shows', 'manage_bookings',
            'view_payments',
            'view_tickets', 'reply_tickets', 'resolve_tickets'
        ],
        userCount: 6,
        isSystemRole: false
    },
    {
        id: '6',
        name: 'Viewer',
        description: 'Read-only access to most features',
        color: 'from-gray-500 to-gray-600',
        icon: Eye,
        permissions: [
            'view_dashboard', 'view_analytics',
            'view_users', 'view_theaters',
            'view_shows', 'view_payments', 'view_reports',
            'view_content', 'view_tickets'
        ],
        userCount: 15,
        isSystemRole: false
    }
];

const RolesAndPermissions: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Filter roles based on search
    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTogglePermission = (permissionId: string) => {
        if (!selectedRole) return;
        const newPermissions = selectedRole.permissions.includes(permissionId)
            ? selectedRole.permissions.filter(p => p !== permissionId)
            : [...selectedRole.permissions, permissionId];
        setSelectedRole({ ...selectedRole, permissions: newPermissions });
    };

    const handleSelectAllModule = (modulePermissions: Permission[]) => {
        if (!selectedRole) return;
        const modulePermissionIds = modulePermissions.map(p => p.id);
        const allSelected = modulePermissionIds.every(id => selectedRole.permissions.includes(id));
        let newPermissions;
        if (allSelected) {
            newPermissions = selectedRole.permissions.filter(p => !modulePermissionIds.includes(p));
        } else {
            newPermissions = [...new Set([...selectedRole.permissions, ...modulePermissionIds])];
        }
        setSelectedRole({ ...selectedRole, permissions: newPermissions });
    };

    const handleSaveRole = () => {
        if (selectedRole) {
            setRoles(roles.map(r => r.id === selectedRole.id ? selectedRole : r));
            setShowEditModal(false);
            setPopupMessage({
                title: 'Role Updated!',
                message: `${selectedRole.name} permissions have been updated successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleDeleteRole = () => {
        if (roleToDelete) {
            setRoles(roles.filter(r => r.id !== roleToDelete.id));
            setShowDeleteConfirm(false);
            setRoleToDelete(null);
            setPopupMessage({
                title: 'Role Deleted!',
                message: `${roleToDelete.name} role has been deleted successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleCreateRole = (newRole: any) => {
        setRoles(prev => [...prev, newRole]);
        setShowCreateModal(false);
        setPopupMessage({
            title: 'Role Created!',
            message: `${newRole.name} role has been created successfully`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const getRoleIcon = (role: Role) => {
        const Icon = role.icon;
        return <Icon className="h-5 w-5" />;
    };

    // Column definitions for roles table
    const roleColumns = [
        {
            Header: 'Role',
            accessor: 'name',
            sortable: true,
            Cell: (row: Role) => (
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${row.color} text-white`}>
                        {getRoleIcon(row)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.description}</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Users',
            accessor: 'userCount',
            sortable: true,
            Cell: (row: Role) => (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{row.userCount} users</span>
                </div>
            )
        },
        {
            Header: 'Permissions',
            accessor: 'permissions',
            Cell: (row: Role) => (
                <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-600">{row.permissions.length} permissions</span>
                </div>
            )
        },
        {
            Header: 'Type',
            accessor: 'isSystemRole',
            Cell: (row: Role) => (
                row.isSystemRole ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <Lock className="h-3 w-3" />
                        System Role
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Unlock className="h-3 w-3" />
                        Custom Role
                    </span>
                )
            )
        }
    ];

    // Action buttons for roles table - INCLUDES BOTH EDIT AND DELETE
    const roleActions = [
        {
            label: 'Edit Permissions',
            icon: Edit,
            onClick: (row: Role) => {
                setSelectedRole({ ...row });
                setShowEditModal(true);
            },
            color: 'primary' as const
        },
        {
            label: 'Delete Role',
            icon: Trash2,
            onClick: (row: Role) => {
                if (!row.isSystemRole) {
                    setRoleToDelete(row);
                    setShowDeleteConfirm(true);
                } else {
                    setPopupMessage({
                        title: 'Cannot Delete',
                        message: 'System roles cannot be deleted',
                        type: 'error'
                    });
                    setShowSuccessPopup(true);
                }
            },
            color: 'error' as const,
            show: (row: Role) => !row.isSystemRole
        }
    ];

    const allPermissionsByModule = modules;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 rounded-xl">
                                    <Shield className="h-6 w-6 text-purple-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
                            </div>
                            <p className="text-gray-600">Manage user roles and access permissions</p>
                        </div>
                    </div>
                </motion.div>

                {/* Search and Create Role on Same Line */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="relative min-w-[280px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search roles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        />
                    </div>
                    <ReusableButton
                        onClick={() => setShowCreateModal(true)}
                        icon="Plus"
                        label="Create Role"
                        className="px-5 py-2.5 text-sm whitespace-nowrap"
                    />
                </div>

                {/* Roles Table */}
                <ReusableTable
                    columns={roleColumns}
                    data={filteredRoles}
                    actions={roleActions}
                    title="System Roles"
                    icon={Shield}
                    showSearch={false}
                    showExport={true}
                    showPrint={true}
                />

                {/* Edit Permissions Modal */}
                {showEditModal && selectedRole && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedRole.color} text-white`}>
                                        {getRoleIcon(selectedRole)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Edit Permissions</h2>
                                        <p className="text-sm text-gray-500">{selectedRole.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Permissions List */}
                            <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Select permissions for this role. {selectedRole.permissions.length} permissions selected.
                                    </p>
                                    {!selectedRole.isSystemRole && (
                                        <button
                                            onClick={() => {
                                                if (selectedRole.permissions.length === allPermissionsByModule.flatMap(m => m.permissions).length) {
                                                    setSelectedRole({ ...selectedRole, permissions: [] });
                                                } else {
                                                    setSelectedRole({
                                                        ...selectedRole,
                                                        permissions: allPermissionsByModule.flatMap(m => m.permissions.map(p => p.id))
                                                    });
                                                }
                                            }}
                                            className="text-sm text-deepTeal hover:underline"
                                        >
                                            {selectedRole.permissions.length === allPermissionsByModule.flatMap(m => m.permissions).length ? 'Deselect All' : 'Select All'}
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                                    {allPermissionsByModule.map((module) => {
                                        const ModuleIcon = module.icon;
                                        const modulePermissions = module.permissions;
                                        const selectedCount = modulePermissions.filter(p => selectedRole.permissions.includes(p.id)).length;
                                        const allSelected = selectedCount === modulePermissions.length;

                                        return (
                                            <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <ModuleIcon className="h-5 w-5 text-deepTeal" />
                                                        <h3 className="font-semibold text-gray-900">{module.name}</h3>
                                                        <span className="text-xs text-gray-500">({selectedCount}/{modulePermissions.length})</span>
                                                    </div>
                                                    {!selectedRole.isSystemRole && (
                                                        <button
                                                            onClick={() => handleSelectAllModule(modulePermissions)}
                                                            className="text-xs text-deepTeal hover:underline"
                                                        >
                                                            {allSelected ? 'Deselect All' : 'Select All'}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {module.permissions.map((permission) => (
                                                            <label
                                                                key={permission.id}
                                                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedRole.permissions.includes(permission.id)
                                                                    ? 'border-deepTeal bg-deepTeal/5'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRole.permissions.includes(permission.id)}
                                                                    onChange={() => handleTogglePermission(permission.id)}
                                                                    disabled={selectedRole.isSystemRole}
                                                                    className="mt-0.5 rounded border-gray-300 text-deepTeal focus:ring-deepTeal"
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                                                                    <p className="text-xs text-gray-500">{permission.description}</p>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveRole}
                                        className="flex-1 px-4 py-2 bg-deepTeal text-white rounded-lg hover:bg-deepTeal/80 transition flex items-center justify-center gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && roleToDelete && (
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
                                <h3 className="text-xl font-bold text-gray-900">Delete Role</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete the role <strong className="text-gray-900">{roleToDelete.name}</strong>?
                                This action cannot be undone. Users with this role will need to be reassigned.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteRole}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Delete Role
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Create Role Modal */}
                <CreateRole
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateRole}
                />

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

export default RolesAndPermissions;