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
    AlertCircle
} from "lucide-react";
import supabase from "@/config/supabaseClient";
import SuccessPopup from "../Reusable/SuccessPopup";

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUserUpdate: (updatedUser: any) => void;
}

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

    // Form Data
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        bio: "",
        location: "",
        profileImage: null as string | null,
        notifications: {
            email: true,
            bookingConfirmations: true,
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

    // Load user data when modal opens
    useEffect(() => {
        if (user && isOpen && user.id) {
            fetchUserData(user.id);
        }
    }, [user, isOpen]);

    const fetchUserData = async (id: string) => {
        try {
            // Validate UUID format - if not valid, try to find by email
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            let query;
            
            if (uuidRegex.test(id)) {
                // It's a valid UUID
                query = supabase.from('users').select('*').eq('id', id);
            } else {
                // It might be a number string or email, try by email
                console.log('Invalid UUID format, trying by email:', id);
                query = supabase.from('users').select('*').eq('email', user?.email);
            }
            
            const { data: userData, error: userError } = await query.single();
            
            if (userError) {
                console.error('User fetch error:', userError);
                // Use data from props as fallback
                setUserRole(user?.role);
                const userFormData = {
                    fullName: user?.full_name || user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    bio: user?.bio || "",
                    location: user?.location || "",
                    profileImage: user?.profile_image_url || null,
                    notifications: {
                        email: user?.email_notifications ?? true,
                        bookingConfirmations: user?.reminder_notifications ?? true,
                    },
                    privacy: {
                        profileVisibility: user?.profile_visibility || "public",
                        showEmail: user?.show_email ?? false,
                        showPhone: user?.show_phone ?? false,
                    },
                    preferences: {
                        currency: user?.currency || "ETB",
                        theme: user?.theme || "system",
                    },
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                };
                setFormData(userFormData);
                setOriginalFormData(userFormData);
                setTwoFactorEnabled(user?.two_factor_enabled || false);
                setOriginalTwoFactor(user?.two_factor_enabled || false);
                
                // Set the correct user ID from the fetched data or props
                if (userData) {
                    setUserId(userData.id);
                    setUserRole(userData.role);
                } else {
                    setUserId(id);
                }
                setIsEditing(false);
                return;
            }
            
            if (userData) {
                setUserId(userData.id);
                setUserRole(userData.role);
                
                const userFormData = {
                    fullName: userData.full_name || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    bio: userData.bio || "",
                    location: userData.location || "",
                    profileImage: userData.profile_image_url || null,
                    notifications: {
                        email: userData.email_notifications ?? true,
                        bookingConfirmations: userData.reminder_notifications ?? true,
                    },
                    privacy: {
                        profileVisibility: userData.profile_visibility || "public",
                        showEmail: userData.show_email ?? false,
                        showPhone: userData.show_phone ?? false,
                    },
                    preferences: {
                        currency: userData.currency || "ETB",
                        theme: userData.theme || "system",
                    },
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                };
                
                setFormData(userFormData);
                setOriginalFormData(userFormData);
                setTwoFactorEnabled(userData.two_factor_enabled || false);
                setOriginalTwoFactor(userData.two_factor_enabled || false);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
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
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setPopupMessage({
                    title: 'Error',
                    message: 'Image must be less than 2MB',
                    type: 'error'
                });
                setShowSuccessPopup(true);
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, profileImage: base64String }));
            };
            reader.readAsDataURL(file);
        }
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
            
            // Update users table - using the correct UUID
            const updateData: any = {
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                bio: formData.bio,
                location: formData.location,
                profile_image_url: formData.profileImage,
                email_notifications: formData.notifications.email,
                reminder_notifications: formData.notifications.bookingConfirmations,
                profile_visibility: formData.privacy.profileVisibility,
                show_email: formData.privacy.showEmail,
                show_phone: formData.privacy.showPhone,
                currency: formData.preferences.currency,
                theme: formData.preferences.theme,
                two_factor_enabled: twoFactorEnabled,
                updated_at: new Date().toISOString()
            };
            
            // Update password if provided
            if (formData.newPassword && formData.newPassword === formData.confirmPassword) {
                updateData.password = formData.newPassword;
            }
            
            const { error: updateError } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', userId);
            
            if (updateError) {
                console.error('Update error:', updateError);
                throw new Error(updateError.message);
            }
            
            // Update localStorage/sessionStorage
            const storedUser = JSON.parse(
                localStorage.getItem('user') || sessionStorage.getItem('user') || 'null'
            );
            
            if (storedUser) {
                const updatedStoredUser = {
                    ...storedUser,
                    id: userId,
                    name: formData.fullName,
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    bio: formData.bio,
                    location: formData.location,
                    profileImage: formData.profileImage,
                    profile_image_url: formData.profileImage,
                };
                
                if (localStorage.getItem('user')) {
                    localStorage.setItem('user', JSON.stringify(updatedStoredUser));
                }
                if (sessionStorage.getItem('user')) {
                    sessionStorage.setItem('user', JSON.stringify(updatedStoredUser));
                }
            }
            
            // Update parent component
            const updatedUser = {
                ...user,
                id: userId,
                name: formData.fullName,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                bio: formData.bio,
                location: formData.location,
                profileImage: formData.profileImage,
                profile_image_url: formData.profileImage,
                notifications: formData.notifications,
                privacy: formData.privacy,
                preferences: formData.preferences,
                twoFactorEnabled: twoFactorEnabled,
            };
            
            onUserUpdate(updatedUser);
            
            // Update original data
            setOriginalFormData(formData);
            setOriginalTwoFactor(twoFactorEnabled);
            
            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
            
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
            // Delete related records first
            await supabase.from('customers').delete().eq('user_id', userId);
            await supabase.from('employees').delete().eq('user_id', userId);
            await supabase.from('owners').delete().eq('user_id', userId);
            await supabase.from('users').delete().eq('id', userId);
            
            // Clear local storage
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
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
        setFormData(originalFormData);
        setTwoFactorEnabled(originalTwoFactor);
        setIsEditing(false);
    };

    const hasChanges = () => {
        return JSON.stringify(formData) !== JSON.stringify(originalFormData) ||
            twoFactorEnabled !== originalTwoFactor;
    };

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
                            <li>Theater data if you're a theater owner</li>
                            <li>Associated contracts and agreements</li>
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
                                                    {formData.profileImage ? (
                                                        <img src={formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
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
                                                {userRole && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full capitalize">
                                                        {userRole.replace('_', ' ')}
                                                    </span>
                                                )}
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <input type="text" name="location" value={formData.location} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                                <textarea name="bio" rows={3} value={formData.bio} onChange={handleInputChange} disabled={!isEditing} className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 disabled:opacity-50 focus:ring-2 focus:ring-teal-500 resize-none" />
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
                                                <input type={showNewPassword ? 'text' : 'password'} name="newPassword" value={formData.newPassword} onChange={handleInputChange} disabled={!isEditing} placeholder="New Password" className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 pr-10" />
                                                {isEditing && <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                                            </div>
                                            <div className="relative">
                                                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} disabled={!isEditing} placeholder="Confirm Password" className="w-full px-4 py-2.5 text-sm border rounded-xl bg-gray-50 pr-10" />
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
                                            <span className="text-sm">Email Updates</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                            <input type="checkbox" checked={formData.notifications.bookingConfirmations} onChange={() => handleNotificationChange('bookingConfirmations')} disabled={!isEditing} className="h-4 w-4 text-teal-600 rounded" />
                                            <span className="text-sm">Booking Reminders</span>
                                        </label>
                                    </div>
                                )}

                                {activeTab === "privacy" && (
                                    <div className="space-y-5">
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3">Profile Visibility</h4>
                                            {['public', 'private'].map((option) => (
                                                <label key={option} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                                    <input type="radio" name="profileVisibility" value={option} checked={formData.privacy.profileVisibility === option} onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)} disabled={!isEditing} className="h-4 w-4 text-teal-600" />
                                                    <span className="text-sm capitalize">{option} - {option === 'public' ? 'Anyone can see your profile' : 'Only you can see your profile'}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3">Personal Information</h4>
                                            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                                <input type="checkbox" checked={formData.privacy.showEmail} onChange={() => handlePrivacyChange('showEmail', !formData.privacy.showEmail)} disabled={!isEditing} className="h-4 w-4 text-teal-600 rounded" />
                                                <span className="text-sm">Show my email address</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                                <input type="checkbox" checked={formData.privacy.showPhone} onChange={() => handlePrivacyChange('showPhone', !formData.privacy.showPhone)} disabled={!isEditing} className="h-4 w-4 text-teal-600 rounded" />
                                                <span className="text-sm">Show my phone number</span>
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