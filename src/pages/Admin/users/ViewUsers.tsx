// src/pages/Admin/users/ViewUsers.tsx
import React, { useState, useEffect } from 'react';
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
    Info,
    Loader2,
    Copy,
    Check
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import supabase from '@/config/supabaseClient';

// Types
interface ViewUserProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (user: User) => void;
}

interface User {
    id: string;
    username: string;
    full_name: string;
    email: string;
    phone: string;
    password?: string;
    profile_image_url?: string;
    role: 'super_admin' | 'theater_owner' | 'theater_manager' | 'sales_person' | 'qr_scanner' | 'customer';
    status: 'active' | 'inactive' | 'pending';
    created_at?: string;
    updated_at?: string;
    last_login?: string;
    bio?: string;
    location?: string;
}

const ViewUsers: React.FC<ViewUserProps> = ({
    user,
    isOpen,
    onClose,
    onEdit
}) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Fetch additional user data when modal opens
    useEffect(() => {
        if (isOpen && user?.id) {
            fetchUserDetails();
        }
    }, [isOpen, user?.id]);

    const fetchUserDetails = async () => {
        if (!user?.id) return;
        
        setLoading(true);
        try {
            const { data: userDetails, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            setUserData(userDetails);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setUserData(user);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const displayUser = userData || user;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyToClipboard = async (text: string, label: string, fieldName: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setPopupMessage({
                title: 'Copied!',
                message: `${label} copied to clipboard`,
                type: 'success'
            });
            setShowSuccessPopup(true);
            setTimeout(() => {
                setCopiedField(null);
                setShowSuccessPopup(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Check if image is base64 or URL
    const isBase64Image = (str?: string): boolean => {
        if (!str) return false;
        return str.startsWith('data:image');
    };

    // Get image source (base64 or URL)
    const getImageSrc = (imageUrl?: string): string => {
        if (!imageUrl) return '';
        return imageUrl;
    };

    const getRoleIcon = () => {
        switch (displayUser?.role) {
            case 'super_admin':
                return <ShieldCheck className="h-5 w-5 text-red-600" />;
            case 'theater_owner':
                return <Crown className="h-5 w-5 text-amber-600" />;
            case 'theater_manager':
                return <Shield className="h-5 w-5 text-blue-600" />;
            case 'sales_person':
                return <UserCheck className="h-5 w-5 text-green-600" />;
            case 'qr_scanner':
                return <Shield className="h-5 w-5 text-purple-600" />;
            default:
                return <UserCheck className="h-5 w-5 text-teal-600" />;
        }
    };

    const getRoleLabel = () => {
        switch (displayUser?.role) {
            case 'super_admin':
                return 'Super Admin';
            case 'theater_owner':
                return 'Theater Owner';
            case 'theater_manager':
                return 'Theater Manager';
            case 'sales_person':
                return 'Sales Person';
            case 'qr_scanner':
                return 'QR Scanner';
            default:
                return 'Customer';
        }
    };

    const getRoleBadgeColor = () => {
        switch (displayUser?.role) {
            case 'super_admin':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'theater_owner':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'theater_manager':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'sales_person':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'qr_scanner':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            default:
                return 'bg-teal-100 text-teal-700 border-teal-200';
        }
    };

    const getStatusBadge = () => {
        switch (displayUser?.status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        Active
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Clock className="h-3 w-3" />
                        Inactive
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        <Clock className="h-3 w-3" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <AlertCircle className="h-3 w-3" />
                        {displayUser?.status || 'Unknown'}
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
        switch (displayUser?.role) {
            case 'super_admin':
                return 'from-red-500 to-red-600';
            case 'theater_owner':
                return 'from-amber-500 to-amber-600';
            case 'theater_manager':
                return 'from-blue-500 to-blue-600';
            case 'sales_person':
                return 'from-green-500 to-green-600';
            case 'qr_scanner':
                return 'from-purple-500 to-purple-600';
            default:
                return 'from-teal-500 to-teal-600';
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading user details...</p>
                </div>
            </div>
        );
    }

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
                            {displayUser?.profile_image_url ? (
                                <img
                                    src={getImageSrc(displayUser.profile_image_url)}
                                    alt={displayUser.username || 'User'}
                                    className="w-28 h-28 rounded-full object-cover ring-4 ring-teal-500/20 shadow-lg mb-4"
                                    onError={(e) => {
                                        // If image fails to load, show fallback
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        const parent = (e.target as HTMLImageElement).parentElement;
                                        if (parent && !parent.querySelector('.fallback-avatar')) {
                                            const fallback = document.createElement('div');
                                            fallback.className = `w-28 h-28 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4 fallback-avatar`;
                                            fallback.textContent = getInitials(displayUser?.full_name || displayUser?.username || 'User');
                                            parent.appendChild(fallback);
                                        }
                                    }}
                                />
                            ) : (
                                <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4`}>
                                    {getInitials(displayUser?.full_name || displayUser?.username || 'User')}
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{displayUser?.full_name || displayUser?.username || 'User'}</h3>
                            <div className="flex items-center gap-3 mb-3 flex-wrap justify-center">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                                    {getRoleIcon()}
                                    <span>{getRoleLabel()}</span>
                                </div>
                                {getStatusBadge()}
                            </div>
                            <p className="text-sm text-gray-500">User ID: {displayUser?.id?.slice(0, 8)}...</p>
                            <p className="text-xs text-gray-400 mt-1">Created: {formatDateTime(displayUser?.created_at)}</p>
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
                                            <p className="text-sm font-medium text-gray-900">{displayUser?.username || 'N/A'}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(displayUser?.username || '', 'Username', 'username')}
                                            className="text-gray-400 hover:text-teal-600 transition"
                                            title="Copy username"
                                        >
                                            {copiedField === 'username' ? (
                                                <Check className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <User className="h-4 w-4 text-teal-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Full Name</p>
                                            <p className="text-sm font-medium text-gray-900">{displayUser?.full_name || 'N/A'}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(displayUser?.full_name || '', 'Full Name', 'fullname')}
                                            className="text-gray-400 hover:text-teal-600 transition"
                                            title="Copy full name"
                                        >
                                            {copiedField === 'fullname' ? (
                                                <Check className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <Mail className="h-4 w-4 text-teal-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Email Address</p>
                                            <p className="text-sm font-medium text-gray-900">{displayUser?.email || 'N/A'}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(displayUser?.email || '', 'Email', 'email')}
                                            className="text-gray-400 hover:text-teal-600 transition"
                                            title="Copy email"
                                        >
                                            {copiedField === 'email' ? (
                                                <Check className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <Phone className="h-4 w-4 text-teal-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Phone Number</p>
                                            <p className="text-sm font-medium text-gray-900">{displayUser?.phone || 'N/A'}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(displayUser?.phone || '', 'Phone number', 'phone')}
                                            className="text-gray-400 hover:text-teal-600 transition"
                                            title="Copy phone number"
                                        >
                                            {copiedField === 'phone' ? (
                                                <Check className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </button>
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
                                            <p className="text-sm font-medium text-gray-900">{getRoleLabel()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <Calendar className="h-4 w-4 text-teal-600 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Account Created</p>
                                            <p className="text-sm font-medium text-gray-900">{formatDateTime(displayUser?.created_at)}</p>
                                        </div>
                                    </div>

                                    {displayUser?.last_login && (
                                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                            <Clock className="h-4 w-4 text-teal-600 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Last Login</p>
                                                <p className="text-sm font-medium text-gray-900">{formatDateTime(displayUser.last_login)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {displayUser?.updated_at && (
                                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                            <Activity className="h-4 w-4 text-teal-600 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Last Updated</p>
                                                <p className="text-sm font-medium text-gray-900">{formatDateTime(displayUser.updated_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profile Image Section - Fixed for base64 */}
                            {displayUser?.profile_image_url && (
                                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100">
                                    <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                            <ImageIcon className="h-4 w-4 text-blue-600" />
                                        </div>
                                        Profile Image
                                    </h4>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <img
                                                src={getImageSrc(displayUser.profile_image_url)}
                                                alt={displayUser.username}
                                                className="w-20 h-20 rounded-full object-cover ring-2 ring-teal-500/20"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-600 mb-1">Profile Image:</p>
                                                {isBase64Image(displayUser.profile_image_url) ? (
                                                    <>
                                                        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg mb-2">
                                                            Base64 encoded image (stored in database)
                                                        </p>
                                                        <div className="bg-gray-100 rounded-lg p-2 max-h-24 overflow-auto">
                                                            <code className="text-xs text-gray-500 break-all">
                                                                {displayUser.profile_image_url.substring(0, 100)}...
                                                            </code>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-xs text-gray-500 break-all">{displayUser.profile_image_url}</p>
                                                )}
                                                <button
                                                    onClick={() => copyToClipboard(
                                                        isBase64Image(displayUser.profile_image_url) 
                                                            ? displayUser.profile_image_url.substring(0, 100) + '... (base64 truncated)'
                                                            : displayUser.profile_image_url || '', 
                                                        'Image', 
                                                        'image'
                                                    )}
                                                    className="mt-2 text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
                                                >
                                                    {copiedField === 'image' ? (
                                                        <><Check className="h-3 w-3" /> Copied</>
                                                    ) : (
                                                        <><Copy className="h-3 w-3" /> Copy Image Reference</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6 mt-4 border-t border-gray-200">
                            {onEdit && (
                                <ReusableButton
                                    onClick={() => {
                                        onEdit(displayUser);
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
                type={popupMessage.type}
                title={popupMessage.title}
                message={popupMessage.message}
                duration={2000}
                position="top-right"
            />
        </>
    );
};

export default ViewUsers;