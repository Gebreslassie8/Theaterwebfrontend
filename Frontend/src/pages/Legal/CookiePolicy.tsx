// src/pages/Legal/CookiePolicy.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Cookie,
    Settings,
    Eye,
    Shield,
    AlertCircle,
    CheckCircle,
    XCircle,
    Globe,
    Clock,
    RefreshCw,
    Database,
    Lock,
    Smartphone,
    Laptop,
    Tablet,
    ChevronDown,
    ChevronUp,
    Info,
    Save,
    Check,
    X
} from 'lucide-react';

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardHover = {
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 }
    }
};

const CookiePolicy: React.FC = () => {
    const [cookieSettings, setCookieSettings] = useState({
        functional: true,
        analytics: true,
        marketing: false
    });
    const [showDetails, setShowDetails] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showBanner, setShowBanner] = useState(true);
    const lastUpdated = "March 30, 2024";

    useEffect(() => {
        const saved = localStorage.getItem('cookiePreferences');
        if (saved) {
            setCookieSettings(JSON.parse(saved));
        }
    }, []);

    const savePreferences = () => {
        localStorage.setItem('cookiePreferences', JSON.stringify(cookieSettings));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const acceptAll = () => {
        setCookieSettings({ functional: true, analytics: true, marketing: true });
        localStorage.setItem('cookiePreferences', JSON.stringify({ functional: true, analytics: true, marketing: true }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setShowBanner(false);
    };

    const rejectAll = () => {
        setCookieSettings({ functional: false, analytics: false, marketing: false });
        localStorage.setItem('cookiePreferences', JSON.stringify({ functional: false, analytics: false, marketing: false }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const cookieCategories = [
        {
            id: 'essential',
            name: 'Essential Cookies',
            icon: Shield,
            alwaysActive: true,
            description: 'These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you.',
            examples: ['Session management', 'Authentication', 'Security', 'Load balancing', 'CSRF protection'],
            duration: 'Session',
            provider: 'TheaterHUB'
        },
        {
            id: 'functional',
            name: 'Functional Cookies',
            icon: Settings,
            alwaysActive: false,
            description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
            examples: ['Language preferences', 'Theater favorites', 'User preferences', 'Location settings', 'UI customization'],
            duration: '1 year',
            provider: 'TheaterHUB'
        },
        {
            id: 'analytics',
            name: 'Analytics Cookies',
            icon: Database,
            alwaysActive: false,
            description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
            examples: ['Page views', 'User behavior', 'Traffic sources', 'Conversion tracking', 'Session duration'],
            duration: '2 years',
            provider: 'Google Analytics, Mixpanel'
        },
        {
            id: 'marketing',
            name: 'Marketing Cookies',
            icon: Eye,
            alwaysActive: false,
            description: 'These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.',
            examples: ['Ad personalization', 'Retargeting', 'Campaign tracking', 'Social media integration', 'Audience segmentation'],
            duration: '2 years',
            provider: 'Facebook, Google Ads, TikTok'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Toast */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
                        >
                            <CheckCircle className="h-5 w-5" />
                            <span>Preferences saved successfully!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Cookie Consent Banner */}
                <AnimatePresence>
                    {showBanner && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-40 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5"
                        >
                            <div className="flex items-start gap-3">
                                <Cookie className="h-6 w-6 text-deepTeal flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        We value your privacy
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={acceptAll}
                                            className="px-4 py-2 bg-deepTeal text-white rounded-lg text-sm font-medium hover:bg-deepTeal/80 transition"
                                        >
                                            Accept All
                                        </button>
                                        <button
                                            onClick={rejectAll}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            Reject All
                                        </button>
                                        <Link
                                            to="/cookies"
                                            className="px-4 py-2 text-deepTeal rounded-lg text-sm font-medium hover:bg-deepTeal/5 transition"
                                        >
                                            Customize
                                        </Link>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowBanner(false)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-deepTeal to-deepBlue rounded-2xl mb-6 shadow-lg"
                    >
                        <Cookie className="h-10 w-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Cookie Policy
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        How we use cookies to enhance your experience
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Last Updated: {lastUpdated}</p>
                </motion.div>

                {/* What are Cookies */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-deepTeal/10 rounded-lg">
                            <Info className="h-6 w-6 text-deepTeal" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            What Are Cookies?
                        </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        Cookies are small text files placed on your device when you visit a website. They help us remember your preferences, understand how you use our site, and improve your experience. We use cookies to make TheaterHUB work better for you.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Smartphone className="h-5 w-5 text-deepTeal" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Mobile Devices</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Laptop className="h-5 w-5 text-deepTeal" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Desktop Computers</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Tablet className="h-5 w-5 text-deepTeal" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tablets</span>
                        </div>
                    </div>
                </motion.div>

                {/* Cookie Preferences */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.1 }}
                    className="mb-8 p-6 bg-gradient-to-r from-deepTeal/5 to-deepBlue/5 rounded-2xl border border-deepTeal/20"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-deepTeal/10 rounded-lg">
                            <Save className="h-6 w-6 text-deepTeal" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Manage Your Cookie Preferences
                        </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Choose which cookies you want to allow. Essential cookies are always enabled as they are necessary for the website to function properly.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={acceptAll}
                            className="px-6 py-2.5 bg-deepTeal text-white rounded-xl font-medium hover:bg-deepTeal/80 transition-all shadow-md hover:shadow-lg"
                        >
                            Accept All Cookies
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={rejectAll}
                            className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        >
                            Reject All Non-Essential
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={savePreferences}
                            className="px-6 py-2.5 border-2 border-deepTeal text-deepTeal rounded-xl font-medium hover:bg-deepTeal/5 transition-all"
                        >
                            Save Current Preferences
                        </motion.button>
                    </div>
                </motion.div>

                {/* Cookie Categories */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-4 mb-8"
                >
                    {cookieCategories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            variants={fadeInUp}
                            whileHover="hover"
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <div
                                className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                onClick={() => setShowDetails(showDetails === category.id ? null : category.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${category.alwaysActive ? 'bg-deepTeal/10' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                            <category.icon className={`h-6 w-6 ${category.alwaysActive ? 'text-deepTeal' : 'text-gray-500'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                {category.name}
                                                {category.alwaysActive && (
                                                    <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full font-normal">
                                                        Always Active
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {!category.alwaysActive && (
                                            <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={cookieSettings[category.id as keyof typeof cookieSettings]}
                                                    onChange={(e) => setCookieSettings({
                                                        ...cookieSettings,
                                                        [category.id]: e.target.checked
                                                    })}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-deepTeal/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-deepTeal"></div>
                                            </label>
                                        )}
                                        {showDetails === category.id ? (
                                            <ChevronUp className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <AnimatePresence>
                                {showDetails === category.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                                    >
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-deepTeal" />
                                                        Examples
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {category.examples.map((example, idx) => (
                                                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                                <CheckCircle className="h-3 w-3 text-deepTeal" />
                                                                {example}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-deepTeal" />
                                                        Details
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            <strong>Duration:</strong> {category.duration}
                                                        </p>
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            <strong>Provider:</strong> {category.provider}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                {/* How to Control Cookies */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.2 }}
                    className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-deepTeal/10 rounded-lg">
                            <Settings className="h-6 w-6 text-deepTeal" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            How to Control Cookies
                        </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        You can manage cookies through your browser settings. Most browsers allow you to:
                    </p>
                    <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-4 w-4 text-deepTeal" />
                            See what cookies are stored and delete them
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-4 w-4 text-deepTeal" />
                            Block third-party cookies
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-4 w-4 text-deepTeal" />
                            Block all cookies from specific sites
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-4 w-4 text-deepTeal" />
                            Clear all cookies when you close your browser
                        </li>
                    </ul>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span><strong>Important:</strong> If you disable cookies, some features of our website may not function properly, and you may not be able to complete ticket purchases or use certain interactive features.</span>
                        </p>
                    </div>
                </motion.div>

                {/* Third-Party Cookies */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.3 }}
                    className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-deepTeal/10 rounded-lg">
                            <Globe className="h-6 w-6 text-deepTeal" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Third-Party Cookies
                        </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        Some cookies are placed by third-party services that appear on our pages. These services include:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-medium text-gray-900 dark:text-white">Google Analytics</p>
                            <p className="text-xs text-gray-500">Website analytics and performance tracking</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-medium text-gray-900 dark:text-white">Facebook Pixel</p>
                            <p className="text-xs text-gray-500">Advertising and conversion tracking</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-medium text-gray-900 dark:text-white">Payment Processors</p>
                            <p className="text-xs text-gray-500">Secure payment processing (Chapa, TeleBirr)</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-medium text-gray-900 dark:text-white">Social Media Platforms</p>
                            <p className="text-xs text-gray-500">Sharing content and social features</p>
                        </div>
                    </div>
                </motion.div>

                {/* Updates */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.4 }}
                    className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-deepTeal/10 rounded-lg">
                            <RefreshCw className="h-6 w-6 text-deepTeal" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Updates to This Policy
                        </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our practices. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our Services after changes constitutes acceptance of the updated policy.
                    </p>
                </motion.div>

                {/* Footer */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.5 }}
                    className="p-6 bg-gradient-to-r from-deepTeal/5 to-deepBlue/5 rounded-2xl border border-deepTeal/20 text-center"
                >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        For more information about how we handle your personal data, please review our Privacy Policy.
                    </p>
                    <div className="flex justify-center gap-6 mt-4">
                        <Link to="/terms" className="text-sm text-deepTeal hover:underline font-medium">
                            Terms of Service
                        </Link>
                        <Link to="/privacy" className="text-sm text-deepTeal hover:underline font-medium">
                            Privacy Policy
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CookiePolicy;