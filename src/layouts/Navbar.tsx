import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    Sparkles,
    TrendingUp,
    Calendar,
    Star,
    Heart,
    Ticket,
    Users,
    Coffee,
    Award,
    Shield,
    Camera,
    Gift,
    Music,
    Smile
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

// Animation variants types
interface LogoVariants {
    initial: { scale: number; rotate: number };
    hover: {
        scale: number;
        rotate: number;
        transition: {
            type: string;
            stiffness: number;
            damping: number;
        };
    };
    tap: {
        scale: number;
        transition: {
            type: string;
            stiffness: number;
            damping: number;
        };
    };
}

interface ImageVariants {
    initial: { scale: number; rotate: number };
    hover: {
        scale: number;
        rotate: number;
        transition: {
            duration: number;
            ease: string;
        };
    };
}

interface TextVariants {
    initial: { x: number; opacity: number };
    hover: {
        x: number;
        transition: {
            type: string;
            stiffness: number;
            damping: number;
        };
    };
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

    const languages: Language[] = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' }
    ];

    const navLinks: NavLink[] = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/blogs', label: 'Blogs', icon: BookOpen },
        { to: '/theaters', label: 'Theaters', icon: MapPin },
        { to: '/about', label: 'About', icon: Info },
        { to: '/help', label: 'Help', icon: HelpCircle },
        { to: '/contact', label: 'Contact', icon: MessageCircle }
    ];

    const isActive = (path: string): boolean => location.pathname === path;

    // Logo animation variants with proper types
    const logoVariants: LogoVariants = {
        initial: { scale: 1, rotate: 0 },
        hover: {
            scale: 1.05,
            rotate: 5,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 15
            }
        }
    };

    const imageVariants: ImageVariants = {
        initial: { scale: 1, rotate: 0 },
        hover: {
            scale: 1.1,
            rotate: 360,
            transition: {
                duration: 0.6,
                ease: "easeInOut"
            }
        }
    };

    const textVariants: TextVariants = {
        initial: { x: 0, opacity: 1 },
        hover: {
            x: 5,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2'
                : 'bg-white py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo with Animation */}
                    <motion.div
                        variants={logoVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="cursor-pointer"
                    >
                        <Link to="/" className="flex items-center space-x-3 group">
                            {/* Animated Logo Image */}
                            <motion.div
                                className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center"
                                variants={imageVariants}
                                whileHover="hover"
                            >
                                <img
                                    src="/logo.png"
                                    alt="TheaterHUB Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 10h18M6 14h12M10 18h4'/%3E%3Crect x='4' y='4' width='16' height='16' rx='2'/%3E%3C/svg%3E";
                                    }}
                                />
                                {/* Animated Pulse Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-white/20 rounded-xl"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0, 0.3]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.div>

                            {/* Animated Logo Text */}
                            <motion.span
                                className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent"
                                variants={textVariants}
                                whileHover="hover"
                            >
                                TheaterHUB
                            </motion.span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <motion.div
                                    key={link.to}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to={link.to}
                                        className={`flex items-center space-x-2 transition-all duration-300 font-medium ${isActive(link.to)
                                                ? 'text-teal-600 border-b-2 border-teal-600 pb-1'
                                                : 'text-gray-700 hover:text-teal-600'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{link.label}</span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Language Dropdown */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Globe className="h-5 w-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {languages.find(l => l.code === currentLang)?.flag}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </motion.button>

                            {isLangOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
                                >
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setCurrentLang(lang.code);
                                                setIsLangOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 transition-colors ${currentLang === lang.code ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                                                }`}
                                        >
                                            <span className="text-xl">{lang.flag}</span>
                                            <span>{lang.name}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Login Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/login"
                                className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-5 py-2 rounded-lg hover:from-teal-500 hover:to-teal-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Sign In</span>
                            </Link>
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6 text-gray-700" />
                            ) : (
                                <Menu className="h-6 w-6 text-gray-700" />
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden mt-4 pb-4"
                    >
                        <div className="flex flex-col space-y-3">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(link.to)
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
                            <div className="border-t border-gray-200 pt-3">
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-3 rounded-lg hover:from-teal-500 hover:to-teal-600 transition-colors font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="h-5 w-5" />
                                    <span>Sign In</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;