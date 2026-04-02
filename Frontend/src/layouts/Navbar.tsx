import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    BookOpen,
    MapPin,
    MessageCircle,
    Info,
    HelpCircle,
    User,
    Menu,
    X,
    Globe,
    LogIn,
    ChevronDown,
    UserPlus,
    Ticket,
    Calendar,
    Star,
    Heart,
    Building2,
    Smartphone,
    Mail,
    Phone
} from 'lucide-react';

// Types
interface Language {
    code: string;
    name: string;
    flag: string;
}

interface NavLink {
    to: string;
    label: string;
    icon: React.ElementType;
}

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [currentLang, setCurrentLang] = useState<string>('en');
    const location = useLocation();

    useEffect(() => {
        const handleScroll = (): void => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const languages: Language[] = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' }
    ];

    const navLinks: NavLink[] = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/about', label: 'About', icon: Info },
        { to: '/blogs', label: 'blogs', icon: BookOpen },
        { to: '/gallery', label: 'Gallery', icon: Star },
        { to: '/pricing', label: 'Pricing', icon: Ticket },
        { to: '/contact', label: 'Contact', icon: MessageCircle },
        { to: '/help', label: 'Help', icon: HelpCircle }

    ];

    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2'
            : 'bg-white py-3'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
                            <img
                                src="/logo.png"
                                alt="TheaterHUB"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 10h18M6 14h12M10 18h4'/%3E%3Crect x='4' y='4' width='16' height='16' rx='2'/%3E%3C/svg%3E";
                                }}
                            />
                        </div>
                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                            Ethiopian TheaterHUB
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`flex items-center space-x-1.5 transition-all duration-300 font-medium text-sm lg:text-base ${isActive(link.to)
                                        ? 'text-teal-600 border-b-2 border-teal-600 pb-1'
                                        : 'text-gray-700 hover:text-teal-600'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side - Desktop */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Language Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                                <span className="text-sm sm:text-base">
                                    {languages.find(l => l.code === currentLang)?.flag}
                                </span>
                                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </button>

                            <AnimatePresence>
                                {isLangOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setCurrentLang(lang.code);
                                                    setIsLangOpen(false);
                                                }}
                                                className={`w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 transition-colors text-sm sm:text-base ${currentLang === lang.code ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                                                    }`}
                                            >
                                                <span className="text-lg sm:text-xl">{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sign In Button - Desktop */}
                        <Link
                            to="/login"
                            className="hidden md:flex items-center space-x-1.5 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium text-sm"
                        >
                            <LogIn className="h-4 w-4" />
                            <span>Sign In</span>
                        </Link>

                        {/* Join Now Button - Desktop (Prominent like image) */}
                        <Link
                            to="/account"
                            className="hidden md:flex items-center space-x-1.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-teal-500 hover:to-teal-600 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Join Now</span>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5 text-gray-700" />
                            ) : (
                                <Menu className="h-5 w-5 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden mt-3 pb-4 overflow-hidden"
                        >
                            <div className="flex flex-col space-y-2">
                                {/* Navigation Links */}
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive(link.to)
                                                ? 'bg-teal-50 text-teal-600'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{link.label}</span>
                                        </Link>
                                    );
                                })}

                                {/* Divider */}
                                <div className="border-t border-gray-100 my-2"></div>

                                {/* Sign In - Mobile */}
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="h-5 w-5" />
                                    <span className="font-medium">Sign In</span>
                                </Link>

                                {/* Join Now - Mobile (Prominent) */}
                                <Link
                                    to="/account"
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md hover:shadow-lg transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <UserPlus className="h-5 w-5" />
                                    <span className="font-medium font-semibold">Join Now</span>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;