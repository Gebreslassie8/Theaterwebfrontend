// src/pages/Admin/users/ViewUsers.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    User,
    Mail,
    Phone,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    ShieldCheck,
    Crown,
    Shield,
    UserCheck,
    Activity,
    Edit,
    ArrowLeft,
    Ban,
    UserX,
    AlertCircle,
    Lock,
    Image as ImageIcon,
    BadgeCheck,
    Info
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types - Updated to match UserManagement
interface ViewUserProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (user: User) => void;
}

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

const ViewUsers: React.FC<ViewUserProps> = ({
    user,
    isOpen,
    onClose,
    onEdit
}) => {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '' });

    if (!isOpen || !user) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setPopupMessage({
            title: 'Copied!',
            message: `${label} copied to clipboard`
        });
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 2000);
    };

    const getRoleIcon = () => {
        switch (user.role) {
            case 'Admin':
                return <ShieldCheck className="h-5 w-5 text-red-600" />;
            case 'Manager':
                return <Shield className="h-5 w-5 text-blue-600" />;
            case 'Theater Owner':
                return <Crown className="h-5 w-5 text-amber-600" />;
            case 'Salesperson':
                return <UserCheck className="h-5 w-5 text-green-600" />;
            case 'Scanner':
                return <Shield className="h-5 w-5 text-purple-600" />;
            default:
                return <UserCheck className="h-5 w-5 text-teal-600" />;
        }
    };

    const getRoleBadgeColor = () => {
        switch (user.role) {
            case 'Admin':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'Manager':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Theater Owner':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Salesperson':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Scanner':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            default:
                return 'bg-teal-100 text-teal-700 border-teal-200';
        }
    };

    const getStatusBadge = () => {
        switch (user.status) {
            case 'Active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        Active
                    </span>
                );
            case 'Inactive':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Clock className="h-3 w-3" />
                        Inactive (Temporary)
                    </span>
                );
            case 'Permanently Deactivated':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <Ban className="h-3 w-3" />
                        Permanently Deactivated
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <AlertCircle className="h-3 w-3" />
                        {user.status}
                    </span>
                );
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getAvatarColor = () => {
        switch (user.role) {
            case 'Admin':
                return 'from-red-500 to-red-600';
            case 'Manager':
                return 'from-blue-500 to-blue-600';
            case 'Theater Owner':
                return 'from-amber-500 to-amber-600';
            case 'Salesperson':
                return 'from-green-500 to-green-600';
            case 'Scanner':
                return 'from-purple-500 to-purple-600';
            default:
                return 'from-teal-500 to-teal-600';
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition lg:hidden"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-500" />
                            </button>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Download and Share buttons REMOVED */}
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                                title="Close"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Profile Header */}
                        <div className="flex flex-col items-center text-center mb-8 pb-6 border-b border-gray-200">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.username || 'User'}
                                    className="w-28 h-28 rounded-full object-cover ring-4 ring-teal-500/20 shadow-lg mb-4"
                                />
                            ) : (
                                <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4`}>
                                    {getInitials(user.username || user.email || 'User')}
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.username || 'User'}</h3>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                                    {getRoleIcon()}
                                    <span>{user.role}</span>
                                </div>
                                {getStatusBadge()}
                            </div>
                            <p className="text-sm text-gray-500">User ID: #{user.id}</p>
                        </div>

                        {/* Detailed Information Grid */}
                        <div className="space-y-6">
                            {/* Personal Information */}
                            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100">
                                <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="p-1.5 bg-teal-100 rounded-lg">
                                        <Info className="h-4 w-4 text-teal-600" />
                                    </div>
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <User className="h-4 w-4 text-teal-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Username</p>
                                            <p className="text-sm font-medium text-gray-900">{user.username || 'N/A'}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(user.username, 'Username')}
                                            className="text-gray-400 hover:text-teal-600 transition"
                                            title="Copy username"
                                        >
                                            <CopyIcon className="h-3 w-3" />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <Mail className="h-4 w-4 text-teal-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Email Address</p>
                                            <p className="text-sm font-medium text-gray-900">{user.email || 'N/A'}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(user.email, 'Email')}
                                            className="text-gray-400 hover:text-teal-600 transition"
                                            title="Copy email"
                                        >
                                            <CopyIcon className="h-3 w-3" />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <Phone className="h-4 w-4 text-teal-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Phone Number</p>
                                            <p className="text-sm font-medium text-gray-900">{user.phone || 'N/A'}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(user.phone, 'Phone number')}
                                            className="text-gray-400 hover:text-teal-600 transition"
                                            title="Copy phone number"
                                        >
                                            <CopyIcon className="h-3 w-3" />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <Lock className="h-4 w-4 text-teal-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Password</p>
                                            <p className="text-sm font-mono font-medium text-gray-900">{user.password || '********'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100">
                                <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-100 rounded-lg">
                                        <Activity className="h-4 w-4 text-purple-600" />
                                    </div>
                                    Account Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <BadgeCheck className="h-4 w-4 text-teal-600 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Role</p>
                                            <p className="text-sm font-medium text-gray-900">{user.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <Calendar className="h-4 w-4 text-teal-600 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Account Created</p>
                                            <p className="text-sm font-medium text-gray-900">{formatDate(new Date().toISOString())}</p>
                                        </div>
                                    </div>

                                    {user.deactivatedAt && (
                                        <>
                                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                                <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Deactivated On</p>
                                                    <p className="text-sm font-medium text-gray-900">{formatDate(user.deactivatedAt)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Deactivation Reason</p>
                                                    <p className="text-sm font-medium text-gray-900">{user.deactivationReason || 'N/A'}</p>
                                                </div>
                                            </div>

                                            {user.deactivationType && (
                                                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 md:col-span-2">
                                                    <Ban className="h-4 w-4 text-red-600 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Deactivation Type</p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {user.deactivationType === 'temporary' ? 'Temporary Deactivation (Can be reactivated)' : 'Permanent Deactivation (Cannot be restored)'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Image Information */}
                            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100">
                                <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <ImageIcon className="h-4 w-4 text-blue-600" />
                                    </div>
                                    Profile Image
                                </h4>
                                <div className="flex items-center gap-4">
                                    {user.image ? (
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <img
                                                src={user.image}
                                                alt={user.username}
                                                className="w-20 h-20 rounded-full object-cover ring-2 ring-teal-500/20"
                                            />
                                            <div>
                                                <p className="text-sm text-gray-600">Profile image URL:</p>
                                                <p className="text-xs text-gray-500 break-all">{user.image}</p>
                                                <button
                                                    onClick={() => copyToClipboard(user.image, 'Image URL')}
                                                    className="mt-2 text-xs text-teal-600 hover:text-teal-700"
                                                >
                                                    Copy URL
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">No profile image set</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6 mt-4 border-t border-gray-200">
                            {onEdit && (
                                <ReusableButton
                                    onClick={() => {
                                        onEdit(user);
                                        onClose();
                                    }}
                                    icon="Edit"
                                    label="Edit User"
                                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                                />
                            )}
                            <ReusableButton
                                onClick={onClose}
                                icon="X"
                                label="Close"
                                variant="secondary"
                                className="flex-1"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Success Popup for Copy */}
            <SuccessPopup
                isOpen={showSuccessPopup}
                onClose={() => setShowSuccessPopup(false)}
                type="success"
                title={popupMessage.title}
                message={popupMessage.message}
                duration={2000}
                position="top-right"
            />
        </>
    );
};

// Helper Copy Icon component since we removed Share2
const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

export default ViewUsers;