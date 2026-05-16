// src/components/modals/ProfileSettingsModal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    User,
    Mail,
    Phone,
    Camera,
    Lock,
    Shield,
    Bell,
    Eye,
    EyeOff,
    CheckCircle,
    Edit,
    Save,
    Trash2,
    MapPin,
    Settings,
    AlertTriangle,
    Moon,
    Sun,
    Loader2,
    Building,
    Briefcase,
    QrCode,
    ShoppingBag,
    Users as UsersIcon
} from "lucide-react";
import supabase from "@/config/supabaseClient";
import SuccessPopup from "../Reusable/SuccessPopup";

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUserUpdate: (updatedUser: any) => void;
}

// Role configuration
const ROLE_CONFIG: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
    super_admin: { label: "Super Admin", icon: Shield, color: "text-red-600", bgColor: "bg-red-100" },
    theater_owner: { label: "Theater Owner", icon: Building, color: "text-amber-600", bgColor: "bg-amber-100" },
    theater_manager: { label: "Theater Manager", icon: Briefcase, color: "text-blue-600", bgColor: "bg-blue-100" },
    sales_person: { label: "Sales Person", icon: ShoppingBag, color: "text-green-600", bgColor: "bg-green-100" },
    qr_scanner: { label: "QR Scanner", icon: QrCode, color: "text-purple-600", bgColor: "bg-purple-100" },
    customer: { label: "Customer", icon: UsersIcon, color: "text-teal-600", bgColor: "bg-teal-100" }
};

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose, user, onUserUpdate }) => {
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        bio: "",
        location: "",
        username: "",
        profile_image_url: null as string | null,
        notifications: {
            email: true,
            sms: true,
            push: true,
            reminder: true,
        },
        privacy: {
            profileVisibility: "public",
            showEmail: false,
            showPhone: false,
        },
        preferences: {
            currency: "ETB",
            theme: "system",
        },
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [originalFormData, setOriginalFormData] = useState({ ...formData });
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [originalTwoFactor, setOriginalTwoFactor] = useState(false);

    // Load user data when modal opens - DIRECTLY from user prop (no auth session needed)
    useEffect(() => {
        if (user && isOpen) {
            populateFormFromUser(user);
            
            // Also try to fetch latest data from database
            if (user.id) {
                fetchUserDataFromDB(user.id);
            }
        }
    }, [user, isOpen]);

    const fetchUserDataFromDB = async (id: string) => {
        try {
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();
            
            if (userError) {
                console.error('User fetch error:', userError);
                return;
            }
            
            if (userData) {
                setUserId(userData.id);
                setUserRole(userData.role);
                populateFormFromUser(userData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const populateFormFromUser = (userData: any) => {
        const userFormData = {
            fullName: userData.full_name || userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            bio: userData.bio || "",
            location: userData.location || "",
            username: userData.username || "",
            profile_image_url: userData.profile_image_url || null,
            notifications: {
                email: userData.email_notifications ?? true,
                sms: userData.sms_notifications ?? true,
                push: userData.push_notifications ?? true,
                reminder: userData.reminder_notifications ?? true,
            },
            privacy: {
                profileVisibility: userData.profile_visibility || "public",
                showEmail: userData.show_email ?? false,
                showPhone: userData.show_phone ?? false,
            },
            preferences: {
                currency: userData.currency || userData.currencey || "ETB",
                theme: userData.theme || "system",
            },
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        };
        
        setFormData(userFormData);
        setOriginalFormData(JSON.parse(JSON.stringify(userFormData)));
        setProfileImagePreview(userData.profile_image_url || null);
        setTwoFactorEnabled(userData.two_factor_enabled || false);
        setOriginalTwoFactor(userData.two_factor_enabled || false);
        setUserId(userData.id);
        setUserRole(userData.role);
        setIsEditing(false);
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "privacy", label: "Privacy", icon: Eye },
        { id: "preferences", label: "Preferences", icon: Settings },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key: string) => {
        setFormData((prev) => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
        }));
    };

    const handlePrivacyChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            privacy: { ...prev.privacy, [key]: value },
        }));
    };

    const handlePreferenceChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            preferences: { ...prev.preferences, [key]: value },
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setPopupMessage({
                title: 'Error',
                message: 'Image must be less than 2MB',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setPopupMessage({
                title: 'Error',
                message: 'Only JPEG, PNG, WEBP images are allowed',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        setProfileImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const uploadProfileImage = async (userId: string): Promise<string | null> => {
        if (!profileImageFile) return formData.profile_image_url;

        const fileExt = profileImageFile.name.split('.').pop();
        const fileName = `${userId}_profile_${Date.now()}.${fileExt}`;
        const filePath = `profiles/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, profileImageFile);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSave = async () => {
        if (!userId) {
            setPopupMessage({
                title: 'Error',
                message: 'User not found',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }
        
        setIsSaving(true);
        
        try {
            // Upload profile image if changed
            let profileImageUrl = formData.profile_image_url;
            if (profileImageFile) {
                const uploadedUrl = await uploadProfileImage(userId);
                if (uploadedUrl) profileImageUrl = uploadedUrl;
            }

            // Verify current password if changing password
            if (formData.newPassword) {
                const { data: userData, error: verifyError } = await supabase
                    .from('users')
                    .select('password')
                    .eq('id', userId)
                    .single();
                
                if (verifyError || !userData) {
                    throw new Error('User not found');
                }
                
                if (userData.password !== formData.currentPassword) {
                    setPopupMessage({
                        title: 'Error',
                        message: 'Current password is incorrect',
                        type: 'error'
                    });
                    setShowSuccessPopup(true);
                    setIsSaving(false);
                    return;
                }
            }
            
            // Prepare update data
            const updateData: any = {
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                bio: formData.bio,
                location: formData.location,
                username: formData.username || null,
                profile_image_url: profileImageUrl,
                email_notifications: formData.notifications.email,
                reminder_notifications: formData.notifications.reminder,
                profile_visibility: formData.privacy.profileVisibility,
                show_email: formData.privacy.showEmail,
                show_phone: formData.privacy.showPhone,
                currency: formData.preferences.currency,
                theme: formData.preferences.theme,
                two_factor_enabled: twoFactorEnabled,
                updated_at: new Date().toISOString()
            };
            
            // Add password if changing
            if (formData.newPassword && formData.newPassword === formData.confirmPassword) {
                updateData.password = formData.newPassword;
            }
            
            const { error: updateError } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', userId);
            
            if (updateError) {
                throw new Error(updateError.message);
            }
            
            // Update the user object in parent component
            const updatedUser = {
                ...user,
                id: userId,
                full_name: formData.fullName,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                bio: formData.bio,
                location: formData.location,
                username: formData.username,
                profile_image_url: profileImageUrl,
                role: userRole,
                two_factor_enabled: twoFactorEnabled,
            };
            
            onUserUpdate(updatedUser);
            
            // Update local storage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const updatedStoredUser = { ...parsedUser, ...updatedUser };
                localStorage.setItem('user', JSON.stringify(updatedStoredUser));
            }
            
            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
            
            setProfileImageFile(null);
            
            setPopupMessage({
                title: 'Success!',
                message: 'Profile updated successfully',
                type: 'success'
            });
            setShowSuccessPopup(true);
            setIsEditing(false);
            
        } catch (error: any) {
            console.error('Error saving profile:', error);
            setPopupMessage({
                title: 'Error',
                message: error.message || 'Failed to update profile',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            setPopupMessage({
                title: 'Confirmation Required',
                message: 'Type "DELETE" to confirm account deletion',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }
        
        setIsDeleting(true);
        
        try {
            // Delete related records based on role
            if (userRole === 'theater_owner') {
                await supabase.from('owners').delete().eq('user_id', userId);
            }
            if (userRole === 'customer') {
                await supabase.from('customers').delete().eq('user_id', userId);
            }
            if (['theater_manager', 'sales_person', 'qr_scanner'].includes(userRole || '')) {
                await supabase.from('employees').delete().eq('user_id', userId);
            }
            
            // Delete user
            await supabase.from('users').delete().eq('id', userId);
            
            // Clear local storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            
            setPopupMessage({
                title: 'Account Deleted',
                message: 'Your account has been permanently deleted',
                type: 'success'
            });
            setShowSuccessPopup(true);
            
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error: any) {
            console.error('Delete error:', error);
            setPopupMessage({
                title: 'Error',
                message: error.message || 'Failed to delete account',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeleteConfirmText('');
        }
    };

    const handleCancel = () => {
        setFormData(JSON.parse(JSON.stringify(originalFormData)));
        setTwoFactorEnabled(originalTwoFactor);
        setProfileImagePreview(originalFormData.profile_image_url);
        setProfileImageFile(null);
        setIsEditing(false);
    };

    const hasChanges = () => {
        return JSON.stringify(formData) !== JSON.stringify(originalFormData) ||
            twoFactorEnabled !== originalTwoFactor ||
            profileImageFile !== null;
    };

    const roleConfig = ROLE_CONFIG[userRole || 'customer'] || ROLE_CONFIG.customer;
    const RoleIcon = roleConfig.icon;

    const currencies = [
        { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
        { code: "USD", symbol: "$", name: "US Dollar" },
        { code: "EUR", symbol: "€", name: "Euro" },
        { code: "GBP", symbol: "£", name: "British Pound" },
    ];

    const themes = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
        { value: 'system', label: 'System', icon: Settings },
    ];

    // Delete Confirmation Modal
    const DeleteConfirmationModal = () => (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            >
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Delete Account</h3>
                            <p className="text-sm text-white/80">This action cannot be undone</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 space-y-5">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Warning: Permanent Data Loss
                        </p>
                        <ul className="text-xs text-red-700 dark:text-red-400 mt-3 list-disc pl-5 space-y-1">
                            <li>Your profile information and settings</li>
                            <li>All your booking history and tickets</li>
                            {userRole === 'theater_owner' && <li>Theater data and contracts</li>}
                            {userRole === 'theater_manager' && <li>Management records</li>}
                            <li>Associated data across the platform</li>
                        </ul>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type <span className="font-bold text-red-600 text-base">DELETE</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="Type DELETE here"
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center font-mono text-lg"
                            autoFocus
                        />
                    </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={() => {
                            setShowDeleteModal(false);
                            setDeleteConfirmText('');
                        }}
                        className="px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                        className={`px-5 py-2.5 rounded-xl text-white font-medium transition flex items-center gap-2 ${
                            deleteConfirmText === 'DELETE' && !isDeleting
                                ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isDeleting ? (
                            <><Loader2 className="h-5 w-5 animate-spin" /> Deleting...</>
                        ) : (
                            <><Trash2 className="h-5 w-5" /> Permanently Delete</>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );

    if (!user || !isOpen) return null;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                            onClick={onClose}
                        />

                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-md md:max-w-lg bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-teal-600 to-teal-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">Profile Settings</h2>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/20 transition">
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </div>

                            {/* Role Badge */}
                            <div className="px-5 pt-4 pb-2">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${roleConfig.bgColor} ${roleConfig.color}`}>
                                    <RoleIcon className="h-3.5 w-3.5" />
                                    {roleConfig.label}
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                                                isActive
                                                    ? "text-teal-600 border-b-2 border-teal-600"
                                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                            }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                {activeTab === "profile" && (
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 flex items-center justify-center overflow-hidden ring-4 ring-teal-100">
                                                    {profileImagePreview ? (
                                                        <img src={profileImagePreview} alt="Profile" className="h-full w-full object-cover" />
                                                    ) : formData.profile_image_url ? (
                                                        <img src={formData.profile_image_url} alt="Profile" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="text-2xl font-bold text-white">
                                                            {formData.fullName?.charAt(0) || "U"}
                                                        </span>
                                                    )}
                                                </div>
                                                {isEditing && (
                                                    <label className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md cursor-pointer border-2 border-teal-600">
                                                        <Camera className="h-3.5 w-3.5 text-teal-600" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                    </label>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                    {formData.fullName || "Your Name"}
                                                </h3>
                                                <p className="text-sm text-gray-500">{formData.email}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                                <input type="text" name="username" value={formData.username} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-teal-500" placeholder="Choose a username" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} disabled={!isEditing} className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-teal-500" placeholder="Your location" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                                <textarea name="bio" rows={3} value={formData.bio} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-teal-500 resize-none" placeholder="Tell us about yourself" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "security" && (
                                    <div className="space-y-5">
                                        <h3 className="text-base font-semibold mb-4">Change Password</h3>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input type={showPassword ? 'text' : 'password'} name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} disabled={!isEditing} placeholder="Current Password" className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 pr-10" />
                                                {isEditing && <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                                            </div>
                                            <div className="relative">
                                                <input type={showNewPassword ? 'text' : 'password'} name="newPassword" value={formData.newPassword} onChange={handleInputChange} disabled={!isEditing} placeholder="New Password (min 6 characters)" className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 pr-10" />
                                                {isEditing && <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                                            </div>
                                            <div className="relative">
                                                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} disabled={!isEditing} placeholder="Confirm New Password" className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 pr-10" />
                                                {isEditing && <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Shield className="h-5 w-5 text-teal-600" />
                                                <div>
                                                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                                                    <p className="text-xs text-gray-500">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <button onClick={() => setTwoFactorEnabled(!twoFactorEnabled)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${twoFactorEnabled ? 'bg-red-100 text-red-700' : 'bg-teal-600 text-white'}`}>
                                                    {twoFactorEnabled ? 'Disable' : 'Enable'}
                                                </button>
                                            )}
                                        </div>

                                        {isEditing && (
                                            <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                                                <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4" /> Danger Zone
                                                </h4>
                                                <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center justify-between px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium">
                                                    <span>Delete Account</span> <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "notifications" && (
                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold mb-4">Notification Preferences</h3>
                                        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                            <input type="checkbox" checked={formData.notifications.email} onChange={() => handleNotificationChange('email')} disabled={!isEditing} className="h-4 w-4 text-teal-600 rounded" />
                                            <span className="text-sm">Email Notifications</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                            <input type="checkbox" checked={formData.notifications.sms} onChange={() => handleNotificationChange('sms')} disabled={!isEditing} className="h-4 w-4 text-teal-600 rounded" />
                                            <span className="text-sm">SMS Notifications</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                            <input type="checkbox" checked={formData.notifications.push} onChange={() => handleNotificationChange('push')} disabled={!isEditing} className="h-4 w-4 text-teal-600 rounded" />
                                            <span className="text-sm">Push Notifications</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                            <input type="checkbox" checked={formData.notifications.reminder} onChange={() => handleNotificationChange('reminder')} disabled={!isEditing} className="h-4 w-4 text-teal-600 rounded" />
                                            <span className="text-sm">Booking Reminders</span>
                                        </label>
                                    </div>
                                )}

                                {activeTab === "privacy" && (
                                    <div className="space-y-5">
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3">Profile Visibility</h4>
                                            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                                <input type="radio" name="profileVisibility" value="public" checked={formData.privacy.profileVisibility === 'public'} onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)} disabled={!isEditing} className="h-4 w-4 text-teal-600" />
                                                <span className="text-sm">Public - Anyone can see your profile</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                                <input type="radio" name="profileVisibility" value="private" checked={formData.privacy.profileVisibility === 'private'} onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)} disabled={!isEditing} className="h-4 w-4 text-teal-600" />
                                                <span className="text-sm">Private - Only you can see your profile</span>
                                            </label>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3">Contact Information Visibility</h4>
                                            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                                <input type="checkbox" checked={formData.privacy.showEmail} onChange={() => handlePrivacyChange('showEmail', !formData.privacy.showEmail)} disabled={!isEditing} className="h-4 w-4 text-teal-600 rounded" />
                                                <span className="text-sm">Show my email address on profile</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                                <input type="checkbox" checked={formData.privacy.showPhone} onChange={() => handlePrivacyChange('showPhone', !formData.privacy.showPhone)} disabled={!isEditing} className="h-4 w-4 text-teal-600 rounded" />
                                                <span className="text-sm">Show my phone number on profile</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "preferences" && (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Currency</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {currencies.map((currency) => (
                                                    <button key={currency.code} onClick={() => handlePreferenceChange('currency', currency.code)} disabled={!isEditing} className={`px-4 py-2 rounded-xl text-sm border-2 ${formData.preferences.currency === currency.code ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-700'}`}>
                                                        {currency.code} ({currency.symbol})
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium mb-3">Theme</h4>
                                            <div className="flex gap-2">
                                                {themes.map((theme) => (
                                                    <button key={theme.value} onClick={() => handlePreferenceChange('theme', theme.value)} disabled={!isEditing} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm border-2 ${formData.preferences.theme === theme.value ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 bg-white text-gray-700'}`}>
                                                        <theme.icon className="h-4 w-4" /> {theme.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex justify-end gap-3">
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium flex items-center gap-2">
                                            <Edit className="h-4 w-4" /> Edit Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button onClick={handleCancel} className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100">Cancel</button>
                                            <button onClick={handleSave} disabled={!hasChanges() || isSaving} className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${hasChanges() && !isSaving ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-400 text-white cursor-not-allowed'}`}>
                                                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {showDeleteModal && <DeleteConfirmationModal />}

            <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type={popupMessage.type} title={popupMessage.title} message={popupMessage.message} duration={3000} position="top-right" />
        </>
    );
};

export default ProfileSettingsModal;