// src/pages/Admin/users/ViewUsers.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    User,
    Mail,
    Phone,
    Calendar,
    DollarSign,
    Ticket,
    CheckCircle,
    XCircle,
    Clock,
    ShieldCheck,
    Crown,
    Shield,
    UserCheck,
    MapPin,
    Briefcase,
    Building,
    Star,
    TrendingUp,
    Activity,
    Edit,
    ArrowLeft,
    Printer,
    Download,
    Share2,
    Users
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface ViewUserProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (user: User) => void;
}

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

const ViewUsers: React.FC<ViewUserProps> = ({
    user,
    isOpen,
    onClose,
    onEdit
}) => {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '' });

    if (!isOpen || !user) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    const handlePrint = () => {
        const printContent = document.getElementById('user-details-print');
        if (printContent) {
            const printWindow = window.open('', '_blank');
            printWindow?.document.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>User Details - ${user.name}</title>
                        <style>
                            body { font-family: 'Inter', Arial, sans-serif; padding: 40px; }
                            .header { text-align: center; margin-bottom: 30px; }
                            .title { font-size: 28px; font-weight: bold; color: #007590; }
                            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
                            .info-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
                            .info-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
                            .info-value { font-size: 16px; font-weight: 600; color: #1f2937; }
                            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
                            .status-Active { background: #dcfce7; color: #166534; }
                            .status-Inactive { background: #fee2e2; color: #991b1b; }
                            .status-Pending { background: #fef3c7; color: #92400e; }
                            @media print {
                                body { padding: 0; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div class="title">User Details</div>
                            <div>Generated on ${new Date().toLocaleString()}</div>
                        </div>
                        ${printContent.innerHTML}
                    </body>
                </html>
            `);
            printWindow?.document.close();
            printWindow?.print();
        }
    };

    const handleDownload = () => {
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            joinDate: user.joinDate,
            lastActive: user.lastActive,
            bookings: user.bookings,
            totalSpent: user.totalSpent,
            address: user.address,
            department: user.department,
            theater: user.theater,
            rating: user.rating
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `user_${user.name.replace(/\s/g, '_')}_${user.id}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const getRoleIcon = () => {
        switch (user.role) {
            case 'Admin':
                return <ShieldCheck className="h-5 w-5 text-red-600" />;
            case 'Manager':
                return <Shield className="h-5 w-5 text-blue-600" />;
            case 'Theater Owner':
                return <Crown className="h-5 w-5 text-amber-600" />;
            default:
                return <UserCheck className="h-5 w-5 text-green-600" />;
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="h-3 w-3" />
                        Inactive
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Clock className="h-3 w-3" />
                        Pending
                    </span>
                );
        }
    };

    const getInitials = (name: string) => {
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
            default:
                return 'from-green-500 to-green-600';
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
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
                                onClick={handlePrint}
                                className="p-2 text-gray-500 hover:text-deepTeal hover:bg-deepTeal/10 rounded-lg transition"
                                title="Print"
                            >
                                <Printer className="h-4 w-4" />
                            </button>
                            <button
                                onClick={handleDownload}
                                className="p-2 text-gray-500 hover:text-deepTeal hover:bg-deepTeal/10 rounded-lg transition"
                                title="Download JSON"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => copyToClipboard(window.location.href, 'Link')}
                                className="p-2 text-gray-500 hover:text-deepTeal hover:bg-deepTeal/10 rounded-lg transition"
                                title="Share"
                            >
                                <Share2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition hidden lg:block"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Print Area */}
                    <div id="user-details-print" className="p-6">
                        {/* Profile Header */}
                        <div className="flex flex-col items-center text-center mb-8 pb-6 border-b border-gray-200">
                            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4`}>
                                {getInitials(user.name)}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h3>
                            <div className="flex items-center gap-2 mb-3">
                                {getRoleIcon()}
                                <span className="text-sm text-gray-500">{user.role}</span>
                            </div>
                            {getStatusBadge()}
                        </div>

                        {/* Admin Dashboard Style Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all group">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Bookings</p>
                                        <p className="text-2xl font-bold text-gray-900">{user.bookings}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Ticket className="h-3 w-3 text-blue-500" />
                                            <span className="text-xs text-gray-500">Lifetime bookings</span>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                                        <Ticket className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all group">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Spent</p>
                                        <p className="text-2xl font-bold text-green-600">ETB {user.totalSpent.toLocaleString()}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <DollarSign className="h-3 w-3 text-green-500" />
                                            <span className="text-xs text-gray-500">Total spent</span>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all group">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg. per Booking</p>
                                        <p className="text-2xl font-bold text-purple-600">ETB {Math.round(user.totalSpent / user.bookings) || 0}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <TrendingUp className="h-3 w-3 text-purple-500" />
                                            <span className="text-xs text-gray-500">Average value</span>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                                        <TrendingUp className="h-5 w-5 text-purple-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all group">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Member Since</p>
                                        <p className="text-lg font-bold text-gray-900">{formatDate(user.joinDate)}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Calendar className="h-3 w-3 text-orange-500" />
                                            <span className="text-xs text-gray-500">Join date</span>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-orange-100 rounded-lg group-hover:scale-110 transition-transform">
                                        <Calendar className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Personal Information */}
                            <div className="bg-gray-50 rounded-xl p-5">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="h-4 w-4 text-deepTeal" />
                                    Personal Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Email Address</p>
                                            <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Phone Number</p>
                                            <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                                        </div>
                                    </div>
                                    {user.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Address</p>
                                                <p className="text-sm font-medium text-gray-900">{user.address}</p>
                                            </div>
                                        </div>
                                    )}
                                    {user.department && (
                                        <div className="flex items-start gap-3">
                                            <Briefcase className="h-4 w-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Department</p>
                                                <p className="text-sm font-medium text-gray-900">{user.department}</p>
                                            </div>
                                        </div>
                                    )}
                                    {user.theater && (
                                        <div className="flex items-start gap-3">
                                            <Building className="h-4 w-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Associated Theater</p>
                                                <p className="text-sm font-medium text-gray-900">{user.theater}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="bg-gray-50 rounded-xl p-5">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-deepTeal" />
                                    Account Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Join Date</p>
                                            <p className="text-sm font-medium text-gray-900">{formatDate(user.joinDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Last Active</p>
                                            <p className="text-sm font-medium text-gray-900">{formatDateTime(user.lastActive)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Total Bookings</p>
                                            <p className="text-sm font-medium text-gray-900">{user.bookings}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <DollarSign className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Total Spent</p>
                                            <p className="text-sm font-medium text-green-600">ETB {user.totalSpent.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {user.rating && (
                                        <div className="flex items-start gap-3">
                                            <Star className="h-4 w-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Rating</p>
                                                <p className="text-sm font-medium text-amber-600 flex items-center gap-1">
                                                    {user.rating} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            {onEdit && (
                                <ReusableButton
                                    onClick={() => {
                                        onEdit(user);
                                        onClose();
                                    }}
                                    icon="Edit"
                                    label="Edit User"
                                    className="flex-1"
                                />
                            )}
                            <ReusableButton
                                onClick={handlePrint}
                                icon="Printer"
                                label="Print Details"
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

export default ViewUsers;