// src/pages/Admin/users/CreateRole.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Shield,
    ShieldCheck,
    ShieldAlert,
    Crown,
    UserCog,
    Eye,
    Edit,
    Save,
    Plus,
    Trash2,
    Settings,
    Users,
    Ticket,
    Calendar,
    DollarSign,
    Building,
    BarChart3,
    MessageCircle,
    FileText,
    Star,
    Lock,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    ChevronDown,
    Search,
    Zap,
    Sparkles,
    Palette,
    Globe,
    Database,
    Cloud,
    Smartphone,
    Monitor,
    Wifi,
    Cpu,
    HardDrive,
    Server,
    Layout,
    Grid,
    List,
    Maximize2,
    Minimize2
} from 'lucide-react';
import * as Yup from 'yup';
import ReusableForm from '../../../components/Reusable/ReusableForm';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface Permission {
    id: string;
    name: string;
    module: string;
    description: string;
    category?: string;
    level?: 'read' | 'write' | 'delete' | 'manage';
}

interface Module {
    id: string;
    name: string;
    icon: React.ElementType;
    permissions: Permission[];
    description?: string;
    color?: string;
}

interface CreateRoleProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (roleData: any) => void;
    editingRole?: any;
}

// Enhanced Mock Permissions Data
const modules: Module[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        icon: Layout,
        color: 'from-blue-500 to-cyan-500',
        description: 'Access to main dashboard and analytics',
        permissions: [
            { id: 'view_dashboard', name: 'View Dashboard', module: 'dashboard', description: 'Access to main dashboard', level: 'read' },
            { id: 'view_analytics', name: 'View Analytics', module: 'dashboard', description: 'Access to analytics and reports', level: 'read' },
            { id: 'export_reports', name: 'Export Reports', module: 'dashboard', description: 'Export dashboard data', level: 'write' },
            { id: 'customize_dashboard', name: 'Customize Dashboard', module: 'dashboard', description: 'Personalize dashboard layout', level: 'manage' }
        ]
    },
    {
        id: 'users',
        name: 'User Management',
        icon: Users,
        color: 'from-purple-500 to-pink-500',
        description: 'Manage system users and roles',
        permissions: [
            { id: 'view_users', name: 'View Users', module: 'users', description: 'View list of all users', level: 'read' },
            { id: 'create_users', name: 'Create Users', module: 'users', description: 'Add new users to system', level: 'write' },
            { id: 'edit_users', name: 'Edit Users', module: 'users', description: 'Modify user information', level: 'write' },
            { id: 'delete_users', name: 'Delete Users', module: 'users', description: 'Remove users from system', level: 'delete' },
            { id: 'manage_roles', name: 'Manage Roles', module: 'users', description: 'Create and edit roles', level: 'manage' },
            { id: 'assign_roles', name: 'Assign Roles', module: 'users', description: 'Assign roles to users', level: 'manage' }
        ]
    },
    {
        id: 'theaters',
        name: 'Theater Management',
        icon: Building,
        color: 'from-green-500 to-emerald-500',
        description: 'Manage theaters and venues',
        permissions: [
            { id: 'view_theaters', name: 'View Theaters', module: 'theaters', description: 'View all theaters', level: 'read' },
            { id: 'create_theaters', name: 'Create Theaters', module: 'theaters', description: 'Add new theaters', level: 'write' },
            { id: 'edit_theaters', name: 'Edit Theaters', module: 'theaters', description: 'Modify theater details', level: 'write' },
            { id: 'delete_theaters', name: 'Delete Theaters', module: 'theaters', description: 'Remove theaters', level: 'delete' },
            { id: 'approve_theaters', name: 'Approve Theaters', module: 'theaters', description: 'Approve pending theaters', level: 'manage' }
        ]
    },
    {
        id: 'shows',
        name: 'Show Management',
        icon: Ticket,
        color: 'from-orange-500 to-red-500',
        description: 'Manage shows and events',
        permissions: [
            { id: 'view_shows', name: 'View Shows', module: 'shows', description: 'View all shows and events', level: 'read' },
            { id: 'create_shows', name: 'Create Shows', module: 'shows', description: 'Add new shows', level: 'write' },
            { id: 'edit_shows', name: 'Edit Shows', module: 'shows', description: 'Modify show details', level: 'write' },
            { id: 'delete_shows', name: 'Delete Shows', module: 'shows', description: 'Remove shows', level: 'delete' },
            { id: 'manage_bookings', name: 'Manage Bookings', module: 'shows', description: 'View and manage bookings', level: 'manage' }
        ]
    },
    {
        id: 'payments',
        name: 'Payment Management',
        icon: DollarSign,
        color: 'from-teal-500 to-cyan-500',
        description: 'Manage payments and transactions',
        permissions: [
            { id: 'view_payments', name: 'View Payments', module: 'payments', description: 'View all transactions', level: 'read' },
            { id: 'process_refunds', name: 'Process Refunds', module: 'payments', description: 'Process refund requests', level: 'write' },
            { id: 'view_reports', name: 'View Reports', module: 'payments', description: 'View financial reports', level: 'read' },
            { id: 'manage_wallet', name: 'Manage Wallet', module: 'payments', description: 'Manage system wallet', level: 'manage' }
        ]
    },
    {
        id: 'content',
        name: 'Content Management',
        icon: FileText,
        color: 'from-indigo-500 to-purple-500',
        description: 'Manage content and blog posts',
        permissions: [
            { id: 'view_content', name: 'View Content', module: 'content', description: 'View all content', level: 'read' },
            { id: 'create_content', name: 'Create Content', module: 'content', description: 'Create blog posts and articles', level: 'write' },
            { id: 'edit_content', name: 'Edit Content', module: 'content', description: 'Modify existing content', level: 'write' },
            { id: 'delete_content', name: 'Delete Content', module: 'content', description: 'Remove content', level: 'delete' },
            { id: 'publish_content', name: 'Publish Content', module: 'content', description: 'Publish and unpublish content', level: 'manage' }
        ]
    },
    {
        id: 'settings',
        name: 'System Settings',
        icon: Settings,
        color: 'from-gray-500 to-gray-700',
        description: 'System configuration',
        permissions: [
            { id: 'view_settings', name: 'View Settings', module: 'settings', description: 'View system settings', level: 'read' },
            { id: 'edit_settings', name: 'Edit Settings', module: 'settings', description: 'Modify system settings', level: 'write' },
            { id: 'manage_backup', name: 'Manage Backup', module: 'settings', description: 'Create and restore backups', level: 'manage' },
            { id: 'view_logs', name: 'View Logs', module: 'settings', description: 'View system logs', level: 'read' }
        ]
    }
];

const roleColors = [
    { value: 'from-purple-500 to-purple-600', label: 'Purple', bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-600 to-purple-700' },
    { value: 'from-blue-500 to-blue-600', label: 'Blue', bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-600 to-blue-700' },
    { value: 'from-green-500 to-green-600', label: 'Green', bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-600 to-green-700' },
    { value: 'from-amber-500 to-amber-600', label: 'Amber', bg: 'bg-amber-100', text: 'text-amber-600', gradient: 'from-amber-600 to-amber-700' },
    { value: 'from-red-500 to-red-600', label: 'Red', bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-600 to-red-700' },
    { value: 'from-pink-500 to-pink-600', label: 'Pink', bg: 'bg-pink-100', text: 'text-pink-600', gradient: 'from-pink-600 to-pink-700' },
    { value: 'from-indigo-500 to-indigo-600', label: 'Indigo', bg: 'bg-indigo-100', text: 'text-indigo-600', gradient: 'from-indigo-600 to-indigo-700' },
    { value: 'from-teal-500 to-teal-600', label: 'Teal', bg: 'bg-teal-100', text: 'text-teal-600', gradient: 'from-teal-600 to-teal-700' }
];

const roleIcons = [
    { value: 'Shield', icon: Shield, label: 'Standard Shield' },
    { value: 'ShieldCheck', icon: ShieldCheck, label: 'Verified Shield' },
    { value: 'ShieldAlert', icon: ShieldAlert, label: 'Alert Shield' },
    { value: 'Crown', icon: Crown, label: 'Crown' },
    { value: 'UserCog', icon: UserCog, label: 'User Settings' },
    { value: 'Eye', icon: Eye, label: 'Eye' },
    { value: 'Users', icon: Users, label: 'Users' },
    { value: 'Star', icon: Star, label: 'Star' },
    { value: 'Sparkles', icon: Sparkles, label: 'Sparkles' },
    { value: 'Zap', icon: Zap, label: 'Lightning' }
];

// Validation Schema
const RoleValidationSchema = Yup.object({
    name: Yup.string()
        .required('Role name is required')
        .min(3, 'Role name must be at least 3 characters')
        .max(50, 'Role name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Role name can only contain letters and spaces'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(200, 'Description cannot exceed 200 characters'),
    color: Yup.string(),
    icon: Yup.string()
});

const CreateRole: React.FC<CreateRoleProps> = ({ isOpen, onClose, onCreate, editingRole }) => {
    const [step, setStep] = useState(1);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [expandedModules, setExpandedModules] = useState<string[]>(modules.map(m => m.id));
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [formValues, setFormValues] = useState({
        name: editingRole?.name || '',
        description: editingRole?.description || '',
        color: editingRole?.color || 'from-purple-500 to-purple-600',
        icon: editingRole?.icon || 'Shield'
    });

    useEffect(() => {
        if (editingRole?.permissions) {
            setSelectedPermissions(editingRole.permissions);
        }
    }, [editingRole]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleTogglePermission = (permissionId: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(p => p !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSelectAllModule = (modulePermissions: Permission[]) => {
        const modulePermissionIds = modulePermissions.map(p => p.id);
        const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id));

        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(p => !modulePermissionIds.includes(p)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...modulePermissionIds])]);
        }
    };

    const handleSelectAll = () => {
        const allPermissions = modules.flatMap(m => m.permissions.map(p => p.id));
        if (selectedPermissions.length === allPermissions.length) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(allPermissions);
        }
    };

    const handleSubmit = () => {
        const selectedIcon = roleIcons.find(i => i.value === formValues.icon)?.icon || Shield;

        const roleData = {
            id: editingRole?.id || Date.now().toString(),
            name: formValues.name,
            description: formValues.description,
            color: formValues.color,
            icon: selectedIcon,
            iconName: formValues.icon,
            permissions: selectedPermissions,
            userCount: editingRole?.userCount || 0,
            isSystemRole: editingRole?.isSystemRole || false,
            createdAt: editingRole?.createdAt || new Date().toISOString()
        };

        onCreate(roleData);
        setPopupMessage({
            title: editingRole ? 'Role Updated!' : 'Role Created!',
            message: `${formValues.name} role has been ${editingRole ? 'updated' : 'created'} successfully`,
            type: 'success'
        });
        setShowSuccessPopup(true);

        setTimeout(() => {
            onClose();
        }, 1500);
    };

    const handleNext = () => {
        if (!formValues.name || !formValues.description) {
            alert('Please fill in all required fields');
            return;
        }
        setStep(2);
    };

    const filteredModules = modules.filter(module =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.permissions.some(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const allPermissions = modules.flatMap(m => m.permissions);
    const totalPermissions = allPermissions.length;
    const selectedCount = selectedPermissions.length;

    const getPermissionLevelColor = (level?: string) => {
        switch (level) {
            case 'read': return 'bg-blue-100 text-blue-700';
            case 'write': return 'bg-green-100 text-green-700';
            case 'delete': return 'bg-red-100 text-red-700';
            case 'manage': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const selectedIcon = roleIcons.find(i => i.value === formValues.icon)?.icon || Shield;
    const selectedColor = roleColors.find(c => c.value === formValues.color) || roleColors[0];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header - Fixed */}
                        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl bg-gradient-to-r ${formValues.color} shadow-lg`}>
                                    {editingRole ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {editingRole ? 'Edit Role' : 'Create New Role'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {step === 1 ? 'Configure role basics' : `Set permissions (${selectedCount}/${totalPermissions} selected)`}
                                    </p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Step Indicator - Fixed */}
                        <div className="flex-shrink-0 px-6 pt-6">
                            <div className="flex items-center justify-between max-w-md mx-auto">
                                <div className="flex items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= 1 ? `bg-gradient-to-r ${formValues.color} text-white shadow-md` : 'bg-gray-200 text-gray-500'}`}>
                                        1
                                    </div>
                                    <div className={`flex-1 h-1 mx-2 transition-all ${step >= 2 ? `bg-gradient-to-r ${formValues.color}` : 'bg-gray-200'}`}></div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= 2 ? `bg-gradient-to-r ${formValues.color} text-white shadow-md` : 'bg-gray-200 text-gray-500'}`}>
                                        2
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between max-w-md mx-auto mt-2">
                                <span className={`text-xs ${step === 1 ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>Basic Info</span>
                                <span className={`text-xs ${step === 2 ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>Permissions</span>
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {/* Step 1: Basic Information */}
                            {step === 1 && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column - Form */}
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Role Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formValues.name}
                                                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                                                placeholder="e.g., Content Manager, Support Agent"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Choose a unique, descriptive name for this role</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Description <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={formValues.description}
                                                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                                                rows={4}
                                                placeholder="Describe the purpose and responsibilities of this role"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">{formValues.description.length}/200 characters</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Role Color
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {roleColors.map((color) => (
                                                    <button
                                                        key={color.value}
                                                        type="button"
                                                        onClick={() => setFormValues({ ...formValues, color: color.value })}
                                                        className={`w-10 h-10 rounded-xl bg-gradient-to-r ${color.value} ${formValues.color === color.value ? 'ring-2 ring-offset-2 ring-purple-500 scale-110' : ''} transition-all`}
                                                        title={color.label}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Role Icon
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {roleIcons.map((icon) => {
                                                    const IconComponent = icon.icon;
                                                    return (
                                                        <button
                                                            key={icon.value}
                                                            type="button"
                                                            onClick={() => setFormValues({ ...formValues, icon: icon.value })}
                                                            className={`p-2.5 rounded-xl border transition-all ${formValues.icon === icon.value ? `border-purple-500 bg-gradient-to-r ${formValues.color} text-white shadow-md` : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                                        >
                                                            <IconComponent className="h-5 w-5" />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Smart Preview */}
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 sticky top-0">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                <Sparkles className="h-4 w-4 text-purple-500" />
                                                Live Preview
                                            </h3>

                                            {/* Role Card Preview */}
                                            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 mb-6">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${formValues.color} text-white shadow-md`}>
                                                        {React.createElement(selectedIcon, { className: "h-6 w-6" })}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 text-lg">{formValues.name || 'Role Name'}</h4>
                                                        <p className="text-sm text-gray-500 mt-1">{formValues.description || 'Role description will appear here'}</p>
                                                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                                <span className="text-xs text-gray-500">Active</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Lock className="h-3 w-3 text-gray-400" />
                                                                <span className="text-xs text-gray-500">Custom Role</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                                                <span className="text-xs text-gray-500">{selectedCount} Permissions</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats Preview */}
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center">
                                                    <p className="text-2xl font-bold text-blue-700">{modules.length}</p>
                                                    <p className="text-xs text-blue-600">Modules</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center">
                                                    <p className="text-2xl font-bold text-purple-700">{totalPermissions}</p>
                                                    <p className="text-xs text-purple-600">Permissions</p>
                                                </div>
                                            </div>

                                            {/* Info Box */}
                                            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                    <p className="text-xs text-amber-700">
                                                        Roles define access levels. Assign permissions carefully based on job responsibilities.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Permissions */}
                            {step === 2 && (
                                <div>
                                    {/* Search and View Controls */}
                                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sticky top-0 bg-white py-2 z-10">
                                        <div className="relative flex-1 max-w-sm">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search modules or permissions..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => setViewMode('grid')}
                                                    className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}
                                                >
                                                    <Grid className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setViewMode('list')}
                                                    className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}
                                                >
                                                    <List className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <span className="font-semibold text-purple-600">{selectedCount}</span> of {totalPermissions} selected
                                            </div>
                                            <button
                                                onClick={handleSelectAll}
                                                className="text-sm text-purple-600 hover:text-purple-700 font-medium px-3 py-1.5 rounded-lg hover:bg-purple-50 transition"
                                            >
                                                {selectedCount === totalPermissions ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Permissions Grid/List - Scrollable */}
                                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-3'}>
                                        {filteredModules.map((module) => {
                                            const ModuleIcon = module.icon;
                                            const modulePermissions = module.permissions;
                                            const selectedModuleCount = modulePermissions.filter(p => selectedPermissions.includes(p.id)).length;
                                            const allModuleSelected = selectedModuleCount === modulePermissions.length;
                                            const isExpanded = expandedModules.includes(module.id);

                                            return (
                                                <div key={module.id} className={`border border-gray-200 rounded-xl overflow-hidden transition-all ${isExpanded ? 'shadow-md' : ''}`}>
                                                    <div className={`bg-gradient-to-r ${module.color || 'from-gray-50 to-gray-100'} px-4 py-3 flex items-center justify-between cursor-pointer hover:opacity-90 transition`}
                                                        onClick={() => toggleModule(module.id)}>
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <ModuleIcon className="h-5 w-5 text-white" />
                                                            <div>
                                                                <h3 className="font-semibold text-white">{module.name}</h3>
                                                                {module.description && (
                                                                    <p className="text-xs text-white/80">{module.description}</p>
                                                                )}
                                                            </div>
                                                            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                                                                {selectedModuleCount}/{modulePermissions.length}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSelectAllModule(modulePermissions);
                                                                }}
                                                                className="text-xs text-white hover:text-white/80 bg-white/20 px-2 py-1 rounded-lg"
                                                            >
                                                                {allModuleSelected ? 'Deselect All' : 'Select All'}
                                                            </button>
                                                            {isExpanded ? (
                                                                <ChevronDown className="h-4 w-4 text-white" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4 text-white" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="p-4 bg-white">
                                                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-2' : 'space-y-2'}>
                                                                {module.permissions.map((permission) => (
                                                                    <label
                                                                        key={permission.id}
                                                                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedPermissions.includes(permission.id)
                                                                            ? 'border-purple-500 bg-purple-50 shadow-sm'
                                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                            }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedPermissions.includes(permission.id)}
                                                                            onChange={() => handleTogglePermission(permission.id)}
                                                                            className="mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                                <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                                                                                {permission.level && (
                                                                                    <span className={`text-xs px-1.5 py-0.5 rounded ${getPermissionLevelColor(permission.level)}`}>
                                                                                        {permission.level.toUpperCase()}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <p className="text-xs text-gray-500">{permission.description}</p>
                                                                        </div>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {filteredModules.length === 0 && (
                                        <div className="text-center py-12">
                                            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">No permissions found matching your search</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Buttons - Fixed */}
                        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between rounded-b-2xl">
                            {step === 2 && (
                                <ReusableButton
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setStep(1)}
                                    label="Back"
                                    icon="ArrowLeft"
                                />
                            )}
                            {step === 1 && <div />}
                            <div className="flex gap-3">
                                <ReusableButton
                                    type="button"
                                    variant="secondary"
                                    onClick={onClose}
                                    label="Cancel"
                                />
                                {step === 1 ? (
                                    <ReusableButton
                                        type="button"
                                        onClick={handleNext}
                                        label="Continue to Permissions"
                                        icon="ArrowRight"
                                        className={`bg-gradient-to-r ${formValues.color}`}
                                    />
                                ) : (
                                    <ReusableButton
                                        type="button"
                                        onClick={handleSubmit}
                                        label={editingRole ? "Update Role" : "Create Role"}
                                        icon={editingRole ? "Save" : "Plus"}
                                        className={`bg-gradient-to-r ${formValues.color}`}
                                    />
                                )}
                            </div>
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
        </AnimatePresence>
    );
};

export default CreateRole;