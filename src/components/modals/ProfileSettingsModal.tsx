import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Only import the icons you actually use in this component
import {
    // Basic UI
    X,
    User,
    Mail,
    Phone,
    Camera,
    Lock,
    Key,
    Shield,
    Globe,
    Moon,
    Sun,
    Bell,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Edit,
    Save,
    Trash2,
    Award,
    Calendar,
    MapPin,

    // Social
    Github,
    Twitter,
    Linkedin,
    Instagram,
    Facebook,
    Link,

    // Money
    CreditCard,
    Wallet,
    DollarSign,
    Clock,
    History,
    Star,
    Heart,

    // Security
    ShieldAlert,
    AlertTriangle,
    HelpCircle,
    Settings,

    // Navigation
    ChevronRight,
    ChevronLeft,
    Menu,
    Home,
    Search,
    Filter,

    // Communication
    BellRing,
    MessageCircle,
    ThumbsUp,
    ThumbsDown,

    // Devices
    Smartphone,
    Laptop,
    Tablet,
    LogOut,

    // File
    FileText,

    // Actions
    Plus,
    Minus,
    Edit as EditIcon,
    Save as SaveIcon,

    // Weather/Nature (removed 'Tree' as it doesn't exist)
    Zap,
    Wind,
    Cloud,
    CloudRain,
    CloudSnow,
    Sun as SunIcon,
    Moon as MoonIcon,
    Thermometer,
    Droplets,
    Waves,

    // Transportation
    Plane,
    Car,
    Train,

    // Entertainment
    Ticket,
    Music,
    Film,
    Theater,
    Drama,
    Gamepad,

    // Nature (use these instead)
    Mountain,
    Leaf,
    Flower,

    // Food
    Coffee,
    Wine,
    Beer,
    Pizza,

    // Tools
    Wrench,
    Hammer,
    Compass,

    // Misc
    Sparkles,
    Gift,
    Package,
    Box,
    Map,
    Navigation,
    Signpost,
    Route
} from "lucide-react";

// Import your custom colors
// deepTeal: "#007590"
// deepBlue: "#17304F"
// smokyGray: "#6c757d"
// lightGray: "#f8f9fa"
// mediumGray: "#6c757d"
// skyTeal: "#0099b0"

const ProfileSettingsModal = ({ isOpen, onClose, user, onUserUpdate }) => {
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [connectedDevices, setConnectedDevices] = useState([
        { id: 1, name: "iPhone 14 Pro", type: "smartphone", lastActive: "2 minutes ago", current: true },
        { id: 2, name: "MacBook Pro", type: "laptop", lastActive: "1 hour ago", current: false },
        { id: 3, name: "iPad Air", type: "tablet", lastActive: "2 days ago", current: false },
    ]);

    // Form states
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        bio: "",
        location: "",
        website: "",
        twitter: "",
        linkedin: "",
        github: "",
        instagram: "",
        facebook: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        profileImage: null,
        notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false,
            bookingConfirmations: true,
            showReminders: true,
            specialOffers: false,
            newsletter: true,
        },
        privacy: {
            profileVisibility: "public",
            showEmail: false,
            showPhone: false,
            showLocation: true,
            showBookings: true,
            showReviews: true,
        },
        preferences: {
            language: "English",
            timezone: "East Africa Time (UTC+3)",
            dateFormat: "MM/DD/YYYY",
            currency: "USD",
            theme: "system",
        },
        payment: {
            defaultMethod: "visa",
            cards: [
                { id: 1, type: "visa", last4: "4242", expiry: "12/25", default: true },
                { id: 2, type: "mastercard", last4: "8888", expiry: "08/24", default: false },
            ],
            addresses: [
                { id: 1, type: "home", address: "123 Main St, Addis Ababa, Ethiopia", default: true },
                { id: 2, type: "work", address: "456 Bole Rd, Addis Ababa, Ethiopia", default: false },
            ],
        },
    });

    // Load user data when modal opens or user changes
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user?.name || "John Doe",
                email: user?.email || "john.doe@example.com",
                phone: user?.phone || "+251 911 234 567",
                bio: user?.bio || "Theatre enthusiast and event organizer with over 10 years of experience in the industry. Passionate about bringing live performances to audiences across Ethiopia.",
                location: user?.location || "Addis Ababa, Ethiopia",
                website: user?.website || "https://example.com",
                twitter: user?.twitter || "@johndoe",
                linkedin: user?.linkedin || "linkedin.com/in/johndoe",
                github: user?.github || "github.com/johndoe",
                instagram: user?.instagram || "@johndoe",
                facebook: user?.facebook || "facebook.com/johndoe",
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
                profileImage: user?.profileImage || null,
                notifications: {
                    email: user?.notifications?.email ?? true,
                    push: user?.notifications?.push ?? true,
                    sms: user?.notifications?.sms ?? false,
                    marketing: user?.notifications?.marketing ?? false,
                    bookingConfirmations: user?.notifications?.bookingConfirmations ?? true,
                    showReminders: user?.notifications?.showReminders ?? true,
                    specialOffers: user?.notifications?.specialOffers ?? false,
                    newsletter: user?.notifications?.newsletter ?? true,
                },
                privacy: {
                    profileVisibility: user?.privacy?.profileVisibility || "public",
                    showEmail: user?.privacy?.showEmail ?? false,
                    showPhone: user?.privacy?.showPhone ?? false,
                    showLocation: user?.privacy?.showLocation ?? true,
                    showBookings: user?.privacy?.showBookings ?? true,
                    showReviews: user?.privacy?.showReviews ?? true,
                },
                preferences: {
                    language: user?.preferences?.language || "English",
                    timezone: user?.preferences?.timezone || "East Africa Time (UTC+3)",
                    dateFormat: user?.preferences?.dateFormat || "MM/DD/YYYY",
                    currency: user?.preferences?.currency || "USD",
                    theme: user?.preferences?.theme || "system",
                },
                payment: {
                    defaultMethod: user?.payment?.defaultMethod || "visa",
                    cards: user?.payment?.cards || [
                        { id: 1, type: "visa", last4: "4242", expiry: "12/25", default: true },
                        { id: 2, type: "mastercard", last4: "8888", expiry: "08/24", default: false },
                    ],
                    addresses: user?.payment?.addresses || [
                        { id: 1, type: "home", address: "123 Main St, Addis Ababa, Ethiopia", default: true },
                        { id: 2, type: "work", address: "456 Bole Rd, Addis Ababa, Ethiopia", default: false },
                    ],
                },
            });
            setPreviewImage(user?.profileImage || null);
            setTwoFactorEnabled(user?.twoFactorEnabled || false);
        }
    }, [user, isOpen]);

    const tabs = [
        { id: "profile", label: "Profile", icon: User, color: "deepTeal" },
        { id: "account", label: "Account", icon: Lock, color: "deepBlue" },
        { id: "security", label: "Security", icon: Shield, color: "skyTeal" },
        { id: "notifications", label: "Notifications", icon: Bell, color: "deepTeal" },
        { id: "privacy", label: "Privacy", icon: Eye, color: "deepBlue" },
        { id: "preferences", label: "Preferences", icon: Settings, color: "skyTeal" },
        { id: "billing", label: "Billing", icon: CreditCard, color: "deepTeal" },
        { id: "devices", label: "Devices", icon: Laptop, color: "deepBlue" },
        { id: "integrations", label: "Integrations", icon: Link, color: "skyTeal" },
        { id: "activity", label: "Activity", icon: History, color: "deepTeal" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key) => {
        setFormData((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key],
            },
        }));
    };

    const handlePrivacyChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            privacy: {
                ...prev.privacy,
                [key]: value,
            },
        }));
    };

    const handlePreferenceChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: value,
            },
        }));
    };

    const handleSave = () => {
        // Create updated user object
        const updatedUser = {
            ...user,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
            location: formData.location,
            website: formData.website,
            twitter: formData.twitter,
            linkedin: formData.linkedin,
            github: formData.github,
            instagram: formData.instagram,
            facebook: formData.facebook,
            profileImage: previewImage || formData.profileImage,
            notifications: formData.notifications,
            privacy: formData.privacy,
            preferences: formData.preferences,
            payment: formData.payment,
            twoFactorEnabled: twoFactorEnabled,
        };

        // Call the parent update function
        if (onUserUpdate) {
            onUserUpdate(updatedUser);
        }

        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setIsEditing(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                // Update form data with new image
                setFormData(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const getColorClasses = (color, isActive = false) => {
        const colors = {
            deepTeal: {
                bg: "bg-deepTeal",
                bgLight: "bg-deepTeal/10",
                text: "text-deepTeal",
                border: "border-deepTeal",
                hover: "hover:bg-deepTeal/20",
                gradient: "from-deepTeal to-skyTeal",
            },
            deepBlue: {
                bg: "bg-deepBlue",
                bgLight: "bg-deepBlue/10",
                text: "text-deepBlue",
                border: "border-deepBlue",
                hover: "hover:bg-deepBlue/20",
                gradient: "from-deepBlue to-deepTeal",
            },
            skyTeal: {
                bg: "bg-skyTeal",
                bgLight: "bg-skyTeal/10",
                text: "text-skyTeal",
                border: "border-skyTeal",
                hover: "hover:bg-skyTeal/20",
                gradient: "from-skyTeal to-deepTeal",
            },
            smokyGray: {
                bg: "bg-smokyGray",
                bgLight: "bg-smokyGray/10",
                text: "text-smokyGray",
                border: "border-smokyGray",
                hover: "hover:bg-smokyGray/20",
                gradient: "from-smokyGray to-mediumGray",
            },
        };
        return colors[color] || colors.deepTeal;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with custom colors */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-gradient-to-br from-deepBlue/90 via-dark-900/95 to-black/90 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-10 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="relative w-full max-w-7xl h-full max-h-[90vh] bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col border border-deepTeal/20">
                            {/* Header with custom gradient */}
                            <div className="flex-shrink-0 px-6 py-4 border-b border-deepTeal/20 bg-gradient-to-r from-deepTeal/10 via-deepBlue/10 to-skyTeal/10 dark:from-deepTeal/5 dark:via-deepBlue/5 dark:to-skyTeal/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-r from-deepTeal to-skyTeal">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-deepBlue dark:text-white">
                                            Profile Settings
                                        </h2>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {saveSuccess && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                <span className="text-sm font-medium">Saved!</span>
                                            </motion.div>
                                        )}
                                        <button
                                            onClick={onClose}
                                            className="p-2 rounded-lg hover:bg-deepTeal/10 transition-colors"
                                        >
                                            <X className="h-5 w-5 text-smokyGray dark:text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex overflow-hidden">
                                {/* Sidebar Tabs with custom colors */}
                                <div className="w-64 flex-shrink-0 border-r border-deepTeal/20 bg-gradient-to-b from-lightGray to-white dark:from-dark-900 dark:to-dark-800 overflow-y-auto">
                                    <nav className="p-4 space-y-1">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon;
                                            const isActive = activeTab === tab.id;
                                            const colors = getColorClasses(tab.color);
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                                        ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
                                                        : "text-smokyGray dark:text-gray-300 hover:bg-deepTeal/10"
                                                        }`}
                                                >
                                                    <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-smokyGray group-hover:text-deepTeal"
                                                        }`} />
                                                    <span className="text-sm font-medium">{tab.label}</span>
                                                    {isActive && (
                                                        <ChevronRight className="h-4 w-4 ml-auto text-white" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-dark-800">
                                    <AnimatePresence mode="wait">
                                        {/* Profile Tab */}
                                        {activeTab === "profile" && (
                                            <motion.div
                                                key="profile"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                {/* Profile Picture */}
                                                <div className="flex items-center space-x-6">
                                                    <div className="relative group">
                                                        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-deepTeal to-skyTeal flex items-center justify-center overflow-hidden ring-4 ring-deepTeal/20">
                                                            {previewImage ? (
                                                                <img
                                                                    src={previewImage}
                                                                    alt="Profile"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-3xl font-bold text-white">
                                                                    {formData.fullName?.charAt(0) || "U"}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <label
                                                            htmlFor="profile-image"
                                                            className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-dark-700 rounded-full shadow-lg cursor-pointer hover:bg-deepTeal/10 transition-colors border-2 border-deepTeal"
                                                        >
                                                            <Camera className="h-4 w-4 text-deepTeal" />
                                                            <input
                                                                type="file"
                                                                id="profile-image"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                            />
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-deepBlue dark:text-white">
                                                            {formData.fullName}
                                                        </h3>
                                                        <p className="text-sm text-smokyGray dark:text-gray-400">
                                                            {formData.email}
                                                        </p>
                                                        <div className="flex items-center mt-1">
                                                            <Award className="h-4 w-4 text-deepTeal mr-1" />
                                                            <span className="text-xs text-deepBlue dark:text-gray-300">Verified Member</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Form Fields */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                            Full Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="fullName"
                                                            value={formData.fullName}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                            Email
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                            Phone
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                            Location
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal transition-colors"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Bio */}
                                                <div>
                                                    <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                        Bio
                                                    </label>
                                                    <textarea
                                                        name="bio"
                                                        rows={4}
                                                        value={formData.bio}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal transition-colors"
                                                    />
                                                </div>

                                                {/* Social Links */}
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-deepBlue dark:text-white">Social Links</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex items-center space-x-3">
                                                            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                                                            <input
                                                                type="text"
                                                                name="twitter"
                                                                value={formData.twitter}
                                                                onChange={handleInputChange}
                                                                disabled={!isEditing}
                                                                placeholder="Twitter handle"
                                                                className="flex-1 px-4 py-2 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                            />
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                                                            <input
                                                                type="text"
                                                                name="linkedin"
                                                                value={formData.linkedin}
                                                                onChange={handleInputChange}
                                                                disabled={!isEditing}
                                                                placeholder="LinkedIn URL"
                                                                className="flex-1 px-4 py-2 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                            />
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <Github className="h-5 w-5 text-gray-900 dark:text-white" />
                                                            <input
                                                                type="text"
                                                                name="github"
                                                                value={formData.github}
                                                                onChange={handleInputChange}
                                                                disabled={!isEditing}
                                                                placeholder="GitHub username"
                                                                className="flex-1 px-4 py-2 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                            />
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <Instagram className="h-5 w-5 text-[#E4405F]" />
                                                            <input
                                                                type="text"
                                                                name="instagram"
                                                                value={formData.instagram}
                                                                onChange={handleInputChange}
                                                                disabled={!isEditing}
                                                                placeholder="Instagram handle"
                                                                className="flex-1 px-4 py-2 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Website */}
                                                <div>
                                                    <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                        Personal Website
                                                    </label>
                                                    <div className="flex items-center space-x-2">
                                                        <Globe className="h-5 w-5 text-deepTeal" />
                                                        <input
                                                            type="url"
                                                            name="website"
                                                            value={formData.website}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            placeholder="https://example.com"
                                                            className="flex-1 px-4 py-2 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Account Tab */}
                                        {activeTab === "account" && (
                                            <motion.div
                                                key="account"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-bold text-deepBlue dark:text-white">Account Information</h3>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                                Username
                                                            </label>
                                                            <input
                                                                type="text"
                                                                defaultValue={user?.username || "@johndoe"}
                                                                disabled={!isEditing}
                                                                className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                                Display Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.fullName}
                                                                onChange={handleInputChange}
                                                                name="fullName"
                                                                disabled={!isEditing}
                                                                className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                            Account Type
                                                        </label>
                                                        <select
                                                            disabled={!isEditing}
                                                            value={user?.accountType || "Personal"}
                                                            className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                        >
                                                            <option>Personal</option>
                                                            <option>Business</option>
                                                            <option>Enterprise</option>
                                                            <option>Artist</option>
                                                            <option>Venue Manager</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                            Member Since
                                                        </label>
                                                        <div className="flex items-center px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white">
                                                            <Calendar className="h-4 w-4 mr-2 text-deepTeal" />
                                                            <span>January 15, 2023</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Account Stats */}
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="p-4 bg-gradient-to-br from-deepTeal/10 to-skyTeal/10 rounded-xl border border-deepTeal/20">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <Ticket className="h-5 w-5 text-deepTeal" />
                                                            <span className="text-xs text-smokyGray">Bookings</span>
                                                        </div>
                                                        <div className="text-2xl font-bold text-deepBlue dark:text-white">47</div>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-deepBlue/10 to-deepTeal/10 rounded-xl border border-deepBlue/20">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <Star className="h-5 w-5 text-deepBlue" />
                                                            <span className="text-xs text-smokyGray">Reviews</span>
                                                        </div>
                                                        <div className="text-2xl font-bold text-deepBlue dark:text-white">23</div>
                                                    </div>
                                                    <div className="p-4 bg-gradient-to-br from-skyTeal/10 to-deepTeal/10 rounded-xl border border-skyTeal/20">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <Heart className="h-5 w-5 text-skyTeal" />
                                                            <span className="text-xs text-smokyGray">Favorites</span>
                                                        </div>
                                                        <div className="text-2xl font-bold text-deepBlue dark:text-white">12</div>
                                                    </div>
                                                </div>

                                                {/* Danger Zone */}
                                                <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
                                                    <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2 flex items-center">
                                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                                        Danger Zone
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <button className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors">
                                                            <span className="text-sm font-medium">Delete Account</span>
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                        <button className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg transition-colors">
                                                            <span className="text-sm font-medium">Deactivate Account</span>
                                                            <EyeOff className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Security Tab */}
                                        {activeTab === "security" && (
                                            <motion.div
                                                key="security"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                <h3 className="text-lg font-bold text-deepBlue dark:text-white">Security Settings</h3>

                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-deepBlue dark:text-white">Change Password</h4>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                                Current Password
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type={showPassword ? 'text' : 'password'}
                                                                    name="currentPassword"
                                                                    value={formData.currentPassword}
                                                                    onChange={handleInputChange}
                                                                    disabled={!isEditing}
                                                                    className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white pr-10 disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                                />
                                                                <button
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-smokyGray hover:text-deepTeal transition-colors"
                                                                    type="button"
                                                                >
                                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                                New Password
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type={showNewPassword ? 'text' : 'password'}
                                                                    name="newPassword"
                                                                    value={formData.newPassword}
                                                                    onChange={handleInputChange}
                                                                    disabled={!isEditing}
                                                                    className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white pr-10 disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                                />
                                                                <button
                                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-smokyGray hover:text-deepTeal transition-colors"
                                                                    type="button"
                                                                >
                                                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                                Confirm New Password
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                                    name="confirmPassword"
                                                                    value={formData.confirmPassword}
                                                                    onChange={handleInputChange}
                                                                    disabled={!isEditing}
                                                                    className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white pr-10 disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                                />
                                                                <button
                                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-smokyGray hover:text-deepTeal transition-colors"
                                                                    type="button"
                                                                >
                                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Two-Factor Authentication */}
                                                <div className="pt-4 border-t border-deepTeal/20">
                                                    <h4 className="text-sm font-bold text-deepBlue dark:text-white mb-3">Two-Factor Authentication</h4>
                                                    <div className="flex items-center justify-between p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                        <div className="flex items-center space-x-3">
                                                            <Shield className={`h-5 w-5 ${twoFactorEnabled ? 'text-deepTeal' : 'text-smokyGray'}`} />
                                                            <div>
                                                                <p className="text-sm font-medium text-deepBlue dark:text-white">2FA Status</p>
                                                                <p className="text-xs text-smokyGray dark:text-gray-400">
                                                                    {twoFactorEnabled ? 'Enabled' : 'Not enabled'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${twoFactorEnabled
                                                                ? 'bg-deepTeal hover:bg-skyTeal text-white'
                                                                : 'bg-smokyGray/10 hover:bg-smokyGray/20 text-smokyGray border border-smokyGray/20'
                                                                }`}
                                                            disabled={!isEditing}
                                                        >
                                                            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Login History */}
                                                <div className="pt-4">
                                                    <h4 className="text-sm font-bold text-deepBlue dark:text-white mb-3">Recent Login Activity</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between p-3 bg-lightGray dark:bg-dark-700 rounded-lg border border-deepTeal/20">
                                                            <div className="flex items-center space-x-3">
                                                                <Laptop className="h-4 w-4 text-deepTeal" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-deepBlue dark:text-white">MacBook Pro • Chrome</p>
                                                                    <p className="text-xs text-smokyGray dark:text-gray-400">Addis Ababa, Ethiopia</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-smokyGray">2 hours ago</span>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-lightGray dark:bg-dark-700 rounded-lg border border-deepTeal/20">
                                                            <div className="flex items-center space-x-3">
                                                                <Smartphone className="h-4 w-4 text-skyTeal" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-deepBlue dark:text-white">iPhone 14 Pro • Safari</p>
                                                                    <p className="text-xs text-smokyGray dark:text-gray-400">Addis Ababa, Ethiopia</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-smokyGray">Yesterday</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Notifications Tab */}
                                        {activeTab === "notifications" && (
                                            <motion.div
                                                key="notifications"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                <h3 className="text-lg font-bold text-deepBlue dark:text-white">Notification Preferences</h3>

                                                <div className="space-y-4">
                                                    <div className="p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                        <h4 className="text-sm font-bold text-deepBlue dark:text-white mb-3">Email Notifications</h4>
                                                        <div className="space-y-3">
                                                            {[
                                                                { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
                                                                { key: 'bookingConfirmations', label: 'Booking confirmations', desc: 'Get confirmation emails for bookings' },
                                                                { key: 'showReminders', label: 'Show reminders', desc: 'Reminders before your shows' },
                                                                { key: 'newsletter', label: 'Newsletter', desc: 'Weekly newsletter with upcoming shows' },
                                                                { key: 'specialOffers', label: 'Special offers', desc: 'Exclusive deals and promotions' },
                                                                { key: 'marketing', label: 'Marketing emails', desc: 'Promotional and marketing content' },
                                                            ].map((item) => (
                                                                <label key={item.key} className="flex items-start space-x-3 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={formData.notifications[item.key]}
                                                                        onChange={() => handleNotificationChange(item.key)}
                                                                        disabled={!isEditing}
                                                                        className="mt-1 h-4 w-4 text-deepTeal border-deepTeal/30 rounded focus:ring-deepTeal"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-deepBlue dark:text-white">{item.label}</p>
                                                                        <p className="text-xs text-smokyGray dark:text-gray-400">{item.desc}</p>
                                                                    </div>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                        <h4 className="text-sm font-bold text-deepBlue dark:text-white mb-3">Push Notifications</h4>
                                                        <div className="space-y-3">
                                                            {[
                                                                { key: 'push', label: 'Push notifications', desc: 'Receive push notifications on your devices' },
                                                                { key: 'sms', label: 'SMS notifications', desc: 'Get text message alerts' },
                                                            ].map((item) => (
                                                                <label key={item.key} className="flex items-start space-x-3 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={formData.notifications[item.key]}
                                                                        onChange={() => handleNotificationChange(item.key)}
                                                                        disabled={!isEditing}
                                                                        className="mt-1 h-4 w-4 text-deepTeal border-deepTeal/30 rounded focus:ring-deepTeal"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-deepBlue dark:text-white">{item.label}</p>
                                                                        <p className="text-xs text-smokyGray dark:text-gray-400">{item.desc}</p>
                                                                    </div>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Privacy Tab */}
                                        {activeTab === "privacy" && (
                                            <motion.div
                                                key="privacy"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                <h3 className="text-lg font-bold text-deepBlue dark:text-white">Privacy Settings</h3>

                                                <div className="space-y-4">
                                                    <div className="p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                        <h4 className="text-sm font-bold text-deepBlue dark:text-white mb-3">Profile Visibility</h4>
                                                        <div className="space-y-3">
                                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="profileVisibility"
                                                                    value="public"
                                                                    checked={formData.privacy.profileVisibility === 'public'}
                                                                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                                                                    disabled={!isEditing}
                                                                    className="h-4 w-4 text-deepTeal border-deepTeal/30 focus:ring-deepTeal"
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium text-deepBlue dark:text-white">Public</p>
                                                                    <p className="text-xs text-smokyGray dark:text-gray-400">Anyone can see your profile</p>
                                                                </div>
                                                            </label>
                                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="profileVisibility"
                                                                    value="private"
                                                                    checked={formData.privacy.profileVisibility === 'private'}
                                                                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                                                                    disabled={!isEditing}
                                                                    className="h-4 w-4 text-deepTeal border-deepTeal/30 focus:ring-deepTeal"
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium text-deepBlue dark:text-white">Private</p>
                                                                    <p className="text-xs text-smokyGray dark:text-gray-400">Only you can see your profile</p>
                                                                </div>
                                                            </label>
                                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="profileVisibility"
                                                                    value="friends"
                                                                    checked={formData.privacy.profileVisibility === 'friends'}
                                                                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                                                                    disabled={!isEditing}
                                                                    className="h-4 w-4 text-deepTeal border-deepTeal/30 focus:ring-deepTeal"
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium text-deepBlue dark:text-white">Friends Only</p>
                                                                    <p className="text-xs text-smokyGray dark:text-gray-400">Only your friends can see your profile</p>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                        <h4 className="text-sm font-bold text-deepBlue dark:text-white mb-3">Personal Information</h4>
                                                        <div className="space-y-3">
                                                            {[
                                                                { key: 'showEmail', label: 'Show email address' },
                                                                { key: 'showPhone', label: 'Show phone number' },
                                                                { key: 'showLocation', label: 'Show location' },
                                                                { key: 'showBookings', label: 'Show booking history' },
                                                                { key: 'showReviews', label: 'Show reviews and ratings' },
                                                            ].map((item) => (
                                                                <label key={item.key} className="flex items-start space-x-3 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={formData.privacy[item.key]}
                                                                        onChange={() => handlePrivacyChange(item.key, !formData.privacy[item.key])}
                                                                        disabled={!isEditing}
                                                                        className="mt-1 h-4 w-4 text-deepTeal border-deepTeal/30 rounded focus:ring-deepTeal"
                                                                    />
                                                                    <p className="text-sm text-deepBlue dark:text-white">{item.label}</p>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Preferences Tab */}
                                        {activeTab === "preferences" && (
                                            <motion.div
                                                key="preferences"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                <h3 className="text-lg font-bold text-deepBlue dark:text-white">Preferences</h3>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                            Language
                                                        </label>
                                                        <select
                                                            value={formData.preferences.language}
                                                            onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                        >
                                                            <option>English</option>
                                                            <option>Amharic</option>
                                                            <option>French</option>
                                                            <option>Arabic</option>
                                                            <option>Spanish</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                            Timezone
                                                        </label>
                                                        <select
                                                            value={formData.preferences.timezone}
                                                            onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                        >
                                                            <option>East Africa Time (UTC+3)</option>
                                                            <option>Eastern Time (UTC-5)</option>
                                                            <option>Central Time (UTC-6)</option>
                                                            <option>Mountain Time (UTC-7)</option>
                                                            <option>Pacific Time (UTC-8)</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                            Date Format
                                                        </label>
                                                        <select
                                                            value={formData.preferences.dateFormat}
                                                            onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                        >
                                                            <option>MM/DD/YYYY</option>
                                                            <option>DD/MM/YYYY</option>
                                                            <option>YYYY-MM-DD</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-deepBlue dark:text-gray-300 mb-1">
                                                            Currency
                                                        </label>
                                                        <select
                                                            value={formData.preferences.currency}
                                                            onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                                                            disabled={!isEditing}
                                                            className="w-full px-4 py-2.5 bg-lightGray dark:bg-dark-700 border border-deepTeal/20 rounded-xl text-deepBlue dark:text-white disabled:opacity-50 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                                                        >
                                                            <option>USD ($)</option>
                                                            <option>EUR (€)</option>
                                                            <option>GBP (£)</option>
                                                            <option>ETB (Br)</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                    <h4 className="text-sm font-bold text-deepBlue dark:text-white mb-3">Theme Preference</h4>
                                                    <div className="flex space-x-4">
                                                        <button
                                                            onClick={() => handlePreferenceChange('theme', 'light')}
                                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${formData.preferences.theme === 'light'
                                                                ? 'bg-deepTeal text-white border-deepTeal'
                                                                : 'border-deepTeal/20 text-deepBlue dark:text-white hover:bg-deepTeal/10'
                                                                }`}
                                                            disabled={!isEditing}
                                                        >
                                                            <Sun className="h-4 w-4" />
                                                            <span>Light</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handlePreferenceChange('theme', 'dark')}
                                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${formData.preferences.theme === 'dark'
                                                                ? 'bg-deepTeal text-white border-deepTeal'
                                                                : 'border-deepTeal/20 text-deepBlue dark:text-white hover:bg-deepTeal/10'
                                                                }`}
                                                            disabled={!isEditing}
                                                        >
                                                            <Moon className="h-4 w-4" />
                                                            <span>Dark</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handlePreferenceChange('theme', 'system')}
                                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${formData.preferences.theme === 'system'
                                                                ? 'bg-deepTeal text-white border-deepTeal'
                                                                : 'border-deepTeal/20 text-deepBlue dark:text-white hover:bg-deepTeal/10'
                                                                }`}
                                                            disabled={!isEditing}
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                            <span>System</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Billing Tab */}
                                        {activeTab === "billing" && (
                                            <motion.div
                                                key="billing"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                <h3 className="text-lg font-bold text-deepBlue dark:text-white">Billing & Payments</h3>

                                                {/* Payment Methods */}
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-deepBlue dark:text-white">Payment Methods</h4>
                                                    {formData.payment.cards.map((card) => (
                                                        <div key={card.id} className="flex items-center justify-between p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                            <div className="flex items-center space-x-3">
                                                                {card.type === 'visa' ? (
                                                                    <CreditCard className="h-6 w-6 text-deepTeal" />
                                                                ) : (
                                                                    <CreditCard className="h-6 w-6 text-skyTeal" />
                                                                )}
                                                                <div>
                                                                    <p className="text-sm font-medium text-deepBlue dark:text-white">
                                                                        {card.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {card.last4}
                                                                    </p>
                                                                    <p className="text-xs text-smokyGray dark:text-gray-400">Expires {card.expiry}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                {card.default && (
                                                                    <span className="px-2 py-1 bg-deepTeal/10 text-deepTeal text-xs rounded-full border border-deepTeal/20">
                                                                        Default
                                                                    </span>
                                                                )}
                                                                <button className="p-2 hover:bg-deepTeal/10 rounded-lg transition-colors">
                                                                    <Edit className="h-4 w-4 text-smokyGray" />
                                                                </button>
                                                                <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button className="w-full px-4 py-3 border-2 border-dashed border-deepTeal/30 rounded-xl text-deepTeal hover:bg-deepTeal/5 transition-colors flex items-center justify-center space-x-2">
                                                        <Plus className="h-5 w-5" />
                                                        <span>Add Payment Method</span>
                                                    </button>
                                                </div>

                                                {/* Billing Addresses */}
                                                <div className="space-y-4 pt-4">
                                                    <h4 className="font-medium text-deepBlue dark:text-white">Billing Addresses</h4>
                                                    {formData.payment.addresses.map((address) => (
                                                        <div key={address.id} className="flex items-center justify-between p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                            <div className="flex items-start space-x-3">
                                                                <MapPin className="h-5 w-5 text-deepTeal mt-0.5" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-deepBlue dark:text-white">
                                                                        {address.type === 'home' ? 'Home Address' : 'Work Address'}
                                                                    </p>
                                                                    <p className="text-xs text-smokyGray dark:text-gray-400">{address.address}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                {address.default && (
                                                                    <span className="px-2 py-1 bg-deepTeal/10 text-deepTeal text-xs rounded-full border border-deepTeal/20">
                                                                        Default
                                                                    </span>
                                                                )}
                                                                <button className="p-2 hover:bg-deepTeal/10 rounded-lg transition-colors">
                                                                    <Edit className="h-4 w-4 text-smokyGray" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button className="w-full px-4 py-3 border-2 border-dashed border-deepTeal/30 rounded-xl text-deepTeal hover:bg-deepTeal/5 transition-colors flex items-center justify-center space-x-2">
                                                        <Plus className="h-5 w-5" />
                                                        <span>Add New Address</span>
                                                    </button>
                                                </div>

                                                {/* Billing History */}
                                                <div className="pt-4">
                                                    <h4 className="font-medium text-deepBlue dark:text-white mb-3">Recent Transactions</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between p-3 bg-lightGray dark:bg-dark-700 rounded-lg border border-deepTeal/20">
                                                            <div className="flex items-center space-x-3">
                                                                <Receipt className="h-5 w-5 text-deepTeal" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-deepBlue dark:text-white">Hamilton Tickets</p>
                                                                    <p className="text-xs text-smokyGray dark:text-gray-400">Dec 20, 2024</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-semibold text-deepBlue dark:text-white">$398.00</span>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-lightGray dark:bg-dark-700 rounded-lg border border-deepTeal/20">
                                                            <div className="flex items-center space-x-3">
                                                                <Receipt className="h-5 w-5 text-skyTeal" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-deepBlue dark:text-white">The Lion King Tickets</p>
                                                                    <p className="text-xs text-smokyGray dark:text-gray-400">Dec 15, 2024</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm font-semibold text-deepBlue dark:text-white">$258.00</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Devices Tab */}
                                        {activeTab === "devices" && (
                                            <motion.div
                                                key="devices"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                <h3 className="text-lg font-bold text-deepBlue dark:text-white">Connected Devices</h3>

                                                <div className="space-y-4">
                                                    {connectedDevices.map((device) => (
                                                        <div key={device.id} className="flex items-center justify-between p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                            <div className="flex items-center space-x-3">
                                                                {device.type === 'smartphone' ? (
                                                                    <Smartphone className="h-5 w-5 text-deepTeal" />
                                                                ) : device.type === 'laptop' ? (
                                                                    <Laptop className="h-5 w-5 text-skyTeal" />
                                                                ) : (
                                                                    <Tablet className="h-5 w-5 text-deepBlue" />
                                                                )}
                                                                <div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <p className="text-sm font-medium text-deepBlue dark:text-white">{device.name}</p>
                                                                        {device.current && (
                                                                            <span className="px-2 py-0.5 bg-deepTeal/10 text-deepTeal text-xs rounded-full border border-deepTeal/20">
                                                                                Current
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-smokyGray dark:text-gray-400">Last active: {device.lastActive}</p>
                                                                </div>
                                                            </div>
                                                            {!device.current && (
                                                                <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="p-4 bg-deepTeal/5 rounded-xl border border-deepTeal/20">
                                                    <div className="flex items-start space-x-3">
                                                        <Shield className="h-5 w-5 text-deepTeal mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-deepBlue dark:text-white">Device Management</p>
                                                            <p className="text-xs text-smokyGray dark:text-gray-400 mt-1">
                                                                You can manage connected devices and sign out of any device remotely.
                                                                For security, we recommend removing devices you no longer use.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Integrations Tab */}
                                        {activeTab === "integrations" && (
                                            <motion.div
                                                key="integrations"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                <h3 className="text-lg font-bold text-deepBlue dark:text-white">Connected Apps & Integrations</h3>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-[#1DA1F2]/10 rounded-lg flex items-center justify-center">
                                                                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-deepBlue dark:text-white">Twitter</p>
                                                                <p className="text-xs text-smokyGray dark:text-gray-400">Connected as @johndoe</p>
                                                            </div>
                                                        </div>
                                                        <button className="px-3 py-1.5 text-sm bg-deepTeal/10 text-deepTeal hover:bg-deepTeal/20 rounded-lg transition-colors">
                                                            Disconnect
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-[#0A66C2]/10 rounded-lg flex items-center justify-center">
                                                                <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-deepBlue dark:text-white">LinkedIn</p>
                                                                <p className="text-xs text-smokyGray dark:text-gray-400">Not connected</p>
                                                            </div>
                                                        </div>
                                                        <button className="px-3 py-1.5 text-sm bg-deepTeal text-white hover:bg-skyTeal rounded-lg transition-colors">
                                                            Connect
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between p-4 bg-lightGray dark:bg-dark-700 rounded-xl border border-deepTeal/20">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-[#5865F2]/10 rounded-lg flex items-center justify-center">
                                                                <MessageCircle className="h-5 w-5 text-[#5865F2]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-deepBlue dark:text-white">Discord</p>
                                                                <p className="text-xs text-smokyGray dark:text-gray-400">Connect for community updates</p>
                                                            </div>
                                                        </div>
                                                        <button className="px-3 py-1.5 text-sm bg-deepTeal text-white hover:bg-skyTeal rounded-lg transition-colors">
                                                            Connect
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Activity Tab */}
                                        {activeTab === "activity" && (
                                            <motion.div
                                                key="activity"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-6"
                                            >
                                                <h3 className="text-lg font-bold text-deepBlue dark:text-white">Recent Activity</h3>

                                                <div className="space-y-4">
                                                    <div className="flex items-start space-x-3 p-3 bg-lightGray dark:bg-dark-700 rounded-lg border border-deepTeal/20">
                                                        <div className="p-2 bg-deepTeal/10 rounded-lg">
                                                            <Ticket className="h-4 w-4 text-deepTeal" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-deepBlue dark:text-white">Booked tickets for Hamilton</p>
                                                            <p className="text-xs text-smokyGray dark:text-gray-400">2 hours ago • 2 tickets • $398.00</p>
                                                        </div>
                                                        <span className="text-xs text-deepTeal">Completed</span>
                                                    </div>

                                                    <div className="flex items-start space-x-3 p-3 bg-lightGray dark:bg-dark-700 rounded-lg border border-deepTeal/20">
                                                        <div className="p-2 bg-skyTeal/10 rounded-lg">
                                                            <Star className="h-4 w-4 text-skyTeal" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-deepBlue dark:text-white">Reviewed The Lion King</p>
                                                            <p className="text-xs text-smokyGray dark:text-gray-400">Yesterday • 5 stars • "Amazing performance!"</p>
                                                        </div>
                                                        <span className="text-xs text-deepTeal">Published</span>
                                                    </div>

                                                    <div className="flex items-start space-x-3 p-3 bg-lightGray dark:bg-dark-700 rounded-lg border border-deepTeal/20">
                                                        <div className="p-2 bg-deepBlue/10 rounded-lg">
                                                            <Heart className="h-4 w-4 text-deepBlue" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-deepBlue dark:text-white">Added Swan Lake to wishlist</p>
                                                            <p className="text-xs text-smokyGray dark:text-gray-400">3 days ago</p>
                                                        </div>
                                                        <span className="text-xs text-deepTeal">Saved</span>
                                                    </div>
                                                </div>

                                                <button className="w-full px-4 py-2 border border-deepTeal/20 text-deepTeal hover:bg-deepTeal/5 rounded-lg transition-colors">
                                                    View All Activity
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex-shrink-0 px-6 py-4 border-t border-deepTeal/20 bg-gradient-to-r from-lightGray to-white dark:from-dark-900 dark:to-dark-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-deepTeal animate-pulse"></div>
                                        <span className="text-xs text-smokyGray dark:text-gray-400">
                                            Last updated: {new Date().toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-4 py-2 bg-gradient-to-r from-deepTeal to-skyTeal hover:from-deepBlue hover:to-deepTeal text-white rounded-lg text-sm font-medium transition-all flex items-center shadow-lg hover:shadow-glow"
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-2 border border-deepTeal/30 text-smokyGray dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-deepTeal/10 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    className="px-4 py-2 bg-gradient-to-r from-deepTeal to-skyTeal hover:from-deepBlue hover:to-deepTeal text-white rounded-lg text-sm font-medium transition-all flex items-center shadow-lg hover:shadow-glow"
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProfileSettingsModal;