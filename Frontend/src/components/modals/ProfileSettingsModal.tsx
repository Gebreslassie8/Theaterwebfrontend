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
    Calendar,
    MapPin,
    Settings,
    ChevronRight,
    AlertTriangle,
    Moon,
    Sun,
    Globe
} from "lucide-react";

const ProfileSettingsModal = ({ isOpen, onClose, user, onUserUpdate }) => {
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [originalPreviewImage, setOriginalPreviewImage] = useState(null);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [originalTwoFactor, setOriginalTwoFactor] = useState(false);

    // Temporary form data (for editing)
    const [tempFormData, setTempFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        bio: "",
        location: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        profileImage: null,
        notifications: {
            email: true,
            push: true,
            bookingConfirmations: true,
            showReminders: true,
        },
        privacy: {
            profileVisibility: "public",
            showEmail: false,
            showPhone: false,
        },
        preferences: {
            currency: "USD",
            theme: "system",
        },
    });

    // Original data (to compare changes)
    const [originalFormData, setOriginalFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        bio: "",
        location: "",
        notifications: {
            email: true,
            push: true,
            bookingConfirmations: true,
            showReminders: true,
        },
        privacy: {
            profileVisibility: "public",
            showEmail: false,
            showPhone: false,
        },
        preferences: {
            currency: "USD",
            theme: "system",
        },
    });

    // Load user data when modal opens
    useEffect(() => {
        if (user && isOpen) {
            const userData = {
                fullName: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
                bio: user?.bio || "",
                location: user?.location || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
                profileImage: user?.profileImage || null,
                notifications: {
                    email: user?.notifications?.email ?? true,
                    push: user?.notifications?.push ?? true,
                    bookingConfirmations: user?.notifications?.bookingConfirmations ?? true,
                    showReminders: user?.notifications?.showReminders ?? true,
                },
                privacy: {
                    profileVisibility: user?.privacy?.profileVisibility || "public",
                    showEmail: user?.privacy?.showEmail ?? false,
                    showPhone: user?.privacy?.showPhone ?? false,
                },
                preferences: {
                    currency: user?.preferences?.currency || "USD",
                    theme: user?.preferences?.theme || "system",
                },
            };

            setTempFormData(userData);
            setOriginalFormData(userData);
            setPreviewImage(user?.profileImage || null);
            setOriginalPreviewImage(user?.profileImage || null);
            setTwoFactorEnabled(user?.twoFactorEnabled || false);
            setOriginalTwoFactor(user?.twoFactorEnabled || false);
            setIsEditing(false);
        }
    }, [user, isOpen]);

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "privacy", label: "Privacy", icon: Eye },
        { id: "preferences", label: "Preferences", icon: Settings },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key) => {
        setTempFormData((prev) => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
        }));
    };

    const handlePrivacyChange = (key, value) => {
        setTempFormData((prev) => ({
            ...prev,
            privacy: { ...prev.privacy, [key]: value },
        }));
    };

    const handlePreferenceChange = (key, value) => {
        setTempFormData((prev) => ({
            ...prev,
            preferences: { ...prev.preferences, [key]: value },
        }));
    };

    const handleSave = () => {
        // Update password if provided
        let updatedUser = {
            ...user,
            name: tempFormData.fullName,
            email: tempFormData.email,
            phone: tempFormData.phone,
            bio: tempFormData.bio,
            location: tempFormData.location,
            profileImage: previewImage,
            notifications: tempFormData.notifications,
            privacy: tempFormData.privacy,
            preferences: tempFormData.preferences,
            twoFactorEnabled: twoFactorEnabled,
        };

        // Update password if new password is provided
        if (tempFormData.newPassword && tempFormData.newPassword === tempFormData.confirmPassword) {
            updatedUser.password = tempFormData.newPassword;
        }

        if (onUserUpdate) onUserUpdate(updatedUser);

        // Update original data
        setOriginalFormData(tempFormData);
        setOriginalPreviewImage(previewImage);
        setOriginalTwoFactor(twoFactorEnabled);

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset all changes
        setTempFormData(originalFormData);
        setPreviewImage(originalPreviewImage);
        setTwoFactorEnabled(originalTwoFactor);
        setIsEditing(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setTempFormData(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const hasChanges = () => {
        return JSON.stringify(tempFormData) !== JSON.stringify(originalFormData) ||
            previewImage !== originalPreviewImage ||
            twoFactorEnabled !== originalTwoFactor;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50"
                        onClick={onClose}
                    />

                    {/* Modal - Responsive Width */}
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-md md:max-w-lg lg:max-w-md bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-teal-600 rounded-lg">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                    Profile Settings
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {saveSuccess && (
                                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs">
                                        <CheckCircle className="h-3 w-3" />
                                        <span className="hidden sm:inline">Saved!</span>
                                    </div>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs - Responsive */}
                        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-1 sm:px-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-medium transition-all relative whitespace-nowrap px-2 ${isActive
                                            ? "text-teal-600 border-b-2 border-teal-600"
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                            }`}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
                            {/* Profile Tab */}
                            {activeTab === "profile" && (
                                <div className="space-y-4">
                                    {/* Profile Picture */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 flex items-center justify-center overflow-hidden ring-2 ring-teal-100">
                                                {previewImage ? (
                                                    <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-lg sm:text-xl font-bold text-white">
                                                        {tempFormData.fullName?.charAt(0) || "U"}
                                                    </span>
                                                )}
                                            </div>
                                            {isEditing && (
                                                <label className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-gray-700 rounded-full shadow-md cursor-pointer border border-teal-600">
                                                    <Camera className="h-3 w-3 text-teal-600" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                </label>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                                                {tempFormData.fullName || "Your Name"}
                                            </h3>
                                            <p className="text-xs text-gray-500 truncate">{tempFormData.email}</p>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={tempFormData.fullName}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-50 focus:ring-1 focus:ring-teal-500 ${isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={tempFormData.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-50 focus:ring-1 focus:ring-teal-500 ${isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={tempFormData.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-50 focus:ring-1 focus:ring-teal-500 ${isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={tempFormData.location}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-50 focus:ring-1 focus:ring-teal-500 ${isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                                Bio
                                            </label>
                                            <textarea
                                                name="bio"
                                                rows={2}
                                                value={tempFormData.bio}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-50 focus:ring-1 focus:ring-teal-500 ${isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === "security" && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Change Password</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="currentPassword"
                                                    value={tempFormData.currentPassword}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 pr-8 ${isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                />
                                                {isEditing && (
                                                    <button
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                                        type="button"
                                                    >
                                                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    name="newPassword"
                                                    value={tempFormData.newPassword}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 pr-8 ${isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                />
                                                {isEditing && (
                                                    <button
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                                        type="button"
                                                    >
                                                        {showNewPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    value={tempFormData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 pr-8 ${isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                />
                                                {isEditing && (
                                                    <button
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                                        type="button"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Two-Factor Authentication */}
                                    <div className="pt-2">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Shield className={`h-4 w-4 ${twoFactorEnabled ? 'text-teal-600' : 'text-gray-500'}`} />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                                    <p className="text-[10px] text-gray-500">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <button
                                                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                                    className={`px-2 py-1 rounded text-xs font-medium transition ${twoFactorEnabled
                                                        ? 'bg-teal-600 text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                        }`}
                                                >
                                                    {twoFactorEnabled ? 'Disable' : 'Enable'}
                                                </button>
                                            )}
                                            {!isEditing && (
                                                <span className="text-xs text-gray-400">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Danger Zone - Only visible in edit mode */}
                                    {isEditing && (
                                        <div className="pt-2 border-t border-red-200">
                                            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                                                <h4 className="text-xs font-semibold text-red-600 mb-1 flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    Danger Zone
                                                </h4>
                                                <button className="w-full flex items-center justify-between px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs transition">
                                                    <span>Delete Account</span>
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === "notifications" && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>

                                    <div className="space-y-2">
                                        {[
                                            { key: 'email', label: 'Email Updates' },
                                            { key: 'push', label: 'Push Notifications' },
                                            { key: 'bookingConfirmations', label: 'Booking Confirmations' },
                                            { key: 'showReminders', label: 'Show Reminders' },
                                        ].map((item) => (
                                            <label key={item.key} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
                                                <input
                                                    type="checkbox"
                                                    checked={tempFormData.notifications[item.key]}
                                                    onChange={() => handleNotificationChange(item.key)}
                                                    disabled={!isEditing}
                                                    className="h-3.5 w-3.5 text-teal-600 rounded focus:ring-teal-500 disabled:opacity-50"
                                                />
                                                <span className="text-xs text-gray-700 dark:text-gray-300">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === "privacy" && (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2">Profile Visibility</h4>
                                        <div className="space-y-1.5">
                                            {[
                                                { value: 'public', label: 'Public - Anyone can see your profile' },
                                                { value: 'private', label: 'Private - Only you can see your profile' },
                                            ].map((option) => (
                                                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="profileVisibility"
                                                        value={option.value}
                                                        checked={tempFormData.privacy.profileVisibility === option.value}
                                                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                                                        disabled={!isEditing}
                                                        className="h-3.5 w-3.5 text-teal-600 disabled:opacity-50"
                                                    />
                                                    <span className="text-xs text-gray-700 dark:text-gray-300">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2">Personal Information</h4>
                                        <div className="space-y-1.5">
                                            {[
                                                { key: 'showEmail', label: 'Show my email address' },
                                                { key: 'showPhone', label: 'Show my phone number' },
                                            ].map((item) => (
                                                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={tempFormData.privacy[item.key]}
                                                        onChange={() => handlePrivacyChange(item.key, !tempFormData.privacy[item.key])}
                                                        disabled={!isEditing}
                                                        className="h-3.5 w-3.5 text-teal-600 rounded disabled:opacity-50"
                                                    />
                                                    <span className="text-xs text-gray-700 dark:text-gray-300">{item.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === "preferences" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Currency
                                        </label>
                                        <select
                                            value={tempFormData.preferences.currency}
                                            onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 ${isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700'}`}
                                        >
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                            <option>GBP (£)</option>
                                            <option>ETB (Br)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2">Theme Preference</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { value: 'light', label: 'Light', icon: Sun },
                                                { value: 'dark', label: 'Dark', icon: Moon },
                                                { value: 'system', label: 'System', icon: Settings },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handlePreferenceChange('theme', option.value)}
                                                    disabled={!isEditing}
                                                    className={`flex-1 min-w-[70px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs transition ${tempFormData.preferences.theme === option.value
                                                        ? 'bg-teal-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer - Responsive */}
                        <div className="px-3 sm:px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <div className="flex justify-end gap-2">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-3 sm:px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 transition"
                                    >
                                        <Edit className="h-3.5 w-3.5" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="px-3 sm:px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm hover:bg-gray-100 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={!hasChanges()}
                                            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 transition ${hasChanges()
                                                ? 'bg-teal-600 hover:bg-teal-700 text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            <Save className="h-3.5 w-3.5" />
                                            Save Changes
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProfileSettingsModal;