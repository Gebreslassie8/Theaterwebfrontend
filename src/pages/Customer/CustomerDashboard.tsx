// Frontend/src/pages/Customer/CustomerDashboard.tsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar,
    Ticket,
    Star,
    Heart,
    Clock,
    MapPin,
    DollarSign,
    Award,
    Gift,
    Download,
    QrCode,
    Share2,
    Bookmark,
    ChevronRight,
    TrendingUp,
    Wallet,
    CheckCircle,
    XCircle,
    Headphones
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';

// Types
interface User {
    id?: string | number;
    name?: string;
    email?: string;
    role: string;
    phone?: string;
    profileImage?: string;
    membershipTier?: 'basic' | 'premium' | 'vip';
    [key: string]: any;
}

interface OutletContext {
    user: User;
    onUserUpdate?: (user: User) => void;
}

interface UpcomingShow {
    id: number;
    title: string;
    venue: string;
    date: string;
    time: string;
    image: string;
    price: number;
    seats: string;
    status: 'confirmed' | 'pending' | 'cancelled';
}

interface RecommendedShow {
    id: number;
    title: string;
    genre: string;
    rating: number;
    price: number;
    image: string;
    venue: string;
    date: string;
}

interface Transaction {
    id: string;
    show: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'refunded';
    tickets: number;
}

interface LoyaltyPoint {
    total: number;
    thisMonth: number;
    nextReward: number;
    tier: string;
}

interface Stats {
    ticketsBooked: number;
    upcomingShows: number;
    pointsEarned: number;
    savedAmount: number;
    totalSpent: number;
    favoriteGenre: string;
    favoriteVenue: string;
    memberSince: string;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    trend?: 'up' | 'down';
    color: string;
    delay?: number;
    dateRange: string;
}

interface QuickActionButtonProps {
    icon: React.ElementType;
    text: string;
    color: 'primary' | 'success' | 'warning' | 'info' | 'error';
}

interface QuickStatBadgeProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    status?: 'online' | 'warning' | 'offline';
}

const CustomerDashboard: React.FC = () => {
    const { user } = useOutletContext<OutletContext>();
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [showBalance, setShowBalance] = useState<boolean>(true);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 12
            }
        }
    };

    // Customer Statistics
    const stats: Stats = {
        ticketsBooked: 24,
        upcomingShows: 5,
        pointsEarned: 1250,
        savedAmount: 85,
        totalSpent: 342,
        favoriteGenre: "Musical",
        favoriteVenue: "Grand Theater",
        memberSince: "2024-01-15"
    };

    // Loyalty Points
    const loyaltyPoints: LoyaltyPoint = {
        total: 1250,
        thisMonth: 320,
        nextReward: 1750,
        tier: "Premium"
    };

    // Upcoming Shows
    const upcomingShows: UpcomingShow[] = [
        {
            id: 1,
            title: "The Lion King",
            venue: "Grand Theater",
            date: "2024-12-20",
            time: "7:00 PM",
            image: "https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=400&h=250&fit=crop",
            price: 45,
            seats: "A12, A13",
            status: "confirmed"
        },
        {
            id: 2,
            title: "Hamilton",
            venue: "City Cinema",
            date: "2024-12-25",
            time: "8:30 PM",
            image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop",
            price: 65,
            seats: "B5",
            status: "confirmed"
        },
        {
            id: 3,
            title: "Wicked",
            venue: "Star Theater",
            date: "2024-12-28",
            time: "6:00 PM",
            image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=250&fit=crop",
            price: 55,
            seats: "C8, C9",
            status: "pending"
        }
    ];

    // Recommended Shows
    const recommendedShows: RecommendedShow[] = [
        {
            id: 1,
            title: "Chicago",
            genre: "Musical",
            rating: 4.6,
            price: 50,
            image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=250&fit=crop",
            venue: "Grand Theater",
            date: "2024-12-30"
        },
        {
            id: 2,
            title: "Phantom of Opera",
            genre: "Drama",
            rating: 4.8,
            price: 60,
            image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=250&fit=crop",
            venue: "Royal Opera",
            date: "2025-01-05"
        },
        {
            id: 3,
            title: "Mamma Mia!",
            genre: "Comedy",
            rating: 4.5,
            price: 45,
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=250&fit=crop",
            venue: "City Cinema",
            date: "2025-01-10"
        }
    ];

    // Recent Transactions
    const transactions: Transaction[] = [
        { id: '#TR-2024-001', show: 'The Lion King', amount: 90, date: 'Dec 15, 2024', status: 'completed', tickets: 2 },
        { id: '#TR-2024-002', show: 'Hamilton', amount: 65, date: 'Dec 10, 2024', status: 'completed', tickets: 1 },
        { id: '#TR-2024-003', show: 'Wicked', amount: 110, date: 'Dec 5, 2024', status: 'completed', tickets: 2 },
        { id: '#TR-2024-004', show: 'Chicago', amount: 50, date: 'Nov 28, 2024', status: 'refunded', tickets: 1 },
    ];

    // Genre Preferences Data
    const genreData = [
        { name: 'Musical', value: 45, color: '#22c55e' },
        { name: 'Drama', value: 25, color: '#06b6d4' },
        { name: 'Comedy', value: 20, color: '#facc15' },
        { name: 'Romance', value: 10, color: '#7c3aed' },
    ];

    // Monthly Spending Data
    const spendingData = [
        { month: 'Jul', amount: 45 },
        { month: 'Aug', amount: 90 },
        { month: 'Sep', amount: 65 },
        { month: 'Oct', amount: 110 },
        { month: 'Nov', amount: 85 },
        { month: 'Dec', amount: 155 },
    ];

    return (
        <div className="lg:ml-2">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8"
            >
                {/* Welcome Header */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-gradient-to-br from-deepTeal to-deepBlue rounded-2xl p-6 text-white shadow-xl"
                >
                    <div className="absolute inset-0">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute bg-white/10 rounded-full"
                                style={{
                                    width: Math.random() * 100 + 50,
                                    height: Math.random() * 100 + 50,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    x: [0, Math.random() * 100 - 50],
                                    y: [0, Math.random() * 100 - 50],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: Math.random() * 10 + 10,
                                    repeat: Infinity,
                                    repeatType: "reverse" as const,
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <motion.h1
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    Welcome back, {user?.name || 'Customer'}!
                                </motion.h1>

                                <motion.p
                                    className="text-white/80 text-base sm:text-lg"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Discover amazing shows and earn rewards
                                </motion.p>
                            </div>

                            {/* Loyalty Card */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 min-w-[200px]"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-white/70">Loyalty Points</span>
                                    <Award className="h-4 w-4 text-yellow-400" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold">{loyaltyPoints.total}</span>
                                    <span className="text-xs text-white/70">points</span>
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between text-[10px] text-white/70 mb-1">
                                        <span>To next reward</span>
                                        <span>{loyaltyPoints.nextReward - loyaltyPoints.total} points left</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-1.5">
                                        <div
                                            className="bg-yellow-400 h-1.5 rounded-full"
                                            style={{ width: `${(loyaltyPoints.total / loyaltyPoints.nextReward) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-6"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <QuickStatBadge icon={Calendar} label="Member Since" value={new Date(stats.memberSince).toLocaleDateString()} />
                            <QuickStatBadge icon={Ticket} label="Tickets Booked" value={stats.ticketsBooked} />
                            <QuickStatBadge icon={TrendingUp} label="Saved" value={`$${stats.savedAmount}`} />
                            <QuickStatBadge icon={Heart} label="Favorite Genre" value={stats.favoriteGenre} />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatCard
                        title="Upcoming Shows"
                        value={stats.upcomingShows}
                        icon={Calendar}
                        change="+2"
                        trend="up"
                        color="from-green-500 to-green-600"
                        delay={0.1}
                        dateRange="month"
                    />
                    <StatCard
                        title="Points Earned"
                        value={loyaltyPoints.thisMonth}
                        icon={Star}
                        change="+150"
                        trend="up"
                        color="from-yellow-500 to-yellow-600"
                        delay={0.2}
                        dateRange="month"
                    />
                    <StatCard
                        title="Total Spent"
                        value={`$${stats.totalSpent}`}
                        icon={DollarSign}
                        change="+$45"
                        trend="up"
                        color="from-cyan-500 to-cyan-600"
                        delay={0.3}
                        dateRange="month"
                    />
                    <StatCard
                        title="Wallet Balance"
                        value={showBalance ? "$45.50" : "****"}
                        icon={Wallet}
                        change="+$20"
                        trend="up"
                        color="from-purple-500 to-purple-600"
                        delay={0.4}
                        dateRange="month"
                    />
                </motion.div>

                {/* Upcoming Shows Section */}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Upcoming Shows</h2>
                        <button className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                            View All <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingShows.map((show, index) => (
                            <motion.div
                                key={show.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                            >
                                <img src={show.image} alt={show.title} className="w-full h-40 object-cover" />
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{show.title}</h3>
                                            <p className="text-sm text-gray-500">{show.venue}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${show.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            show.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {show.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mt-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 text-purple-600" />
                                            <span>{new Date(show.date).toLocaleDateString()} at {show.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 text-purple-600" />
                                            <span>{show.venue}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Ticket className="h-4 w-4 text-purple-600" />
                                            <span>Seats: {show.seats}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <QrCode className="h-5 w-5 text-gray-400" />
                                            <span className="text-xs text-gray-500">E-Ticket Available</span>
                                        </div>
                                        <button className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                                            View Ticket
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Recommended & Analytics */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recommended Shows */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recommended for You</h2>
                            <button className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                                See All <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recommendedShows.map((show, index) => (
                                <motion.div
                                    key={show.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 flex gap-4"
                                >
                                    <img src={show.image} alt={show.title} className="w-24 h-24 rounded-xl object-cover" />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{show.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{show.genre}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                                        <span className="text-xs text-gray-600">{show.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-purple-600">${show.price}</div>
                                                <div className="text-xs text-gray-500">per ticket</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(show.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {show.venue}
                                            </span>
                                        </div>
                                        <button className="mt-2 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors">
                                            Book Now
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Spending Chart */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h3>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={spendingData}>
                                    <defs>
                                        <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 10 }} />
                                    <YAxis stroke="#6B7280" tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2} fill="url(#spendingGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Transactions & Genre Preferences */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                        <div className="space-y-3">
                            {transactions.map((transaction, index) => (
                                <motion.div
                                    key={transaction.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${transaction.status === 'completed' ? 'bg-green-100' :
                                            transaction.status === 'pending' ? 'bg-yellow-100' :
                                                'bg-red-100'
                                            }`}>
                                            {transaction.status === 'completed' ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : transaction.status === 'pending' ? (
                                                <Clock className="h-4 w-4 text-yellow-600" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{transaction.show}</p>
                                            <p className="text-xs text-gray-500">{transaction.date} • {transaction.tickets} tickets</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">${transaction.amount}</p>
                                        <p className="text-xs text-gray-500">{transaction.id}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Genre Preferences */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Your Genre Preferences</h3>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={genreData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {genreData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {genreData.map((genre, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: genre.color }} />
                                    <span className="text-xs text-gray-600">{genre.name}</span>
                                    <span className="text-xs font-semibold text-gray-900 ml-auto">{genre.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <QuickActionButton icon={Ticket} text="Book Tickets" color="primary" />
                    <QuickActionButton icon={Wallet} text="Add Funds" color="success" />
                    <QuickActionButton icon={Gift} text="Redeem Points" color="warning" />
                    <QuickActionButton icon={Headphones} text="Support" color="info" />
                </motion.div>
            </motion.div>
        </div>
    );
};

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, trend, color, delay, dateRange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200 relative overflow-hidden group"
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">{title}</p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
                        {change && (
                            <div className="flex items-center gap-1 mt-2">
                                <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${trend === 'up'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {change}
                                </span>
                                <span className="text-[10px] sm:text-xs text-gray-500">vs last {dateRange}</span>
                            </div>
                        )}
                    </div>
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Quick Action Button
const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon: Icon, text, color }) => {
    const colors = {
        primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
        success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
        warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
        info: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
        error: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
    };

    return (
        <button
            className={`p-2 sm:p-3 ${colors[color]} text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm`}
        >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{text}</span>
        </button>
    );
};

// Quick Stat Badge Component
const QuickStatBadge: React.FC<QuickStatBadgeProps> = ({ icon: Icon, label, value, status }) => (
    <div className="flex items-center gap-1 sm:gap-2 text-white/90 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg backdrop-blur-sm">
        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="text-xs sm:text-sm">{label}:</span>
        <span className="text-xs sm:text-sm font-semibold flex items-center gap-1">
            {value}
            {status === 'online' && (
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500"></span>
                </span>
            )}
        </span>
    </div>
);

export default CustomerDashboard;