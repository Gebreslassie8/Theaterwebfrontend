// src/pages/Admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Building,
    CoinsIcons,
    Clock,
    UserCheck,
    Activity,
    TrendingUp,
    Calendar as CalendarIcon,
    ChevronDown,
    Loader2,
    CoinsIcon
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LineChart, Line,
    Legend
} from 'recharts';
import supabase from '@/config/supabaseClient';

// Types
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    link?: string;
    onClick?: () => void;
}

interface RevenueDataPoint {
    month: string;
    revenue: number;
}

interface TheaterDistributionDataPoint {
    name: string;
    value: number;
    color: string;
}

interface UserGrowthDataPoint {
    month: string;
    users: number;
    newUsers: number;
}

interface TheaterGrowthDataPoint {
    month: string;
    theaters: number;
    newTheaters: number;
    pendingTheaters: number;
}

interface ActivityItem {
    id: string;
    action: string;
    user: string;
    time: string;
    icon: React.ElementType;
    status: 'success' | 'warning' | 'info';
}

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
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

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) onClick();
        if (link) navigate(link);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2, cursor: link || onClick ? 'pointer' : 'default' }}
            onClick={handleClick}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
            <div className="relative overflow-hidden transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">{title}</p>
                        <p className="text-xl font-bold text-gray-900">{value}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Revenue Card Component
const RevenueCard: React.FC<{ 
    revenueData: RevenueDataPoint[]; 
    period: string; 
    onPeriodChange: (period: string) => void;
    loading: boolean;
}> = ({ revenueData, period, onPeriodChange, loading }) => {
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);

    return (
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                    <p className="text-sm text-gray-500">Track revenue trends in ETB</p>
                </div>
                <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => onPeriodChange('daily')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${period === 'daily'
                                ? 'bg-white text-teal-600 shadow-md'
                                : 'text-gray-600 hover:text-teal-600'
                            }`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => onPeriodChange('monthly')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${period === 'monthly'
                                ? 'bg-white text-teal-600 shadow-md'
                                : 'text-gray-600 hover:text-teal-600'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => onPeriodChange('yearly')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${period === 'yearly'
                                ? 'bg-white text-teal-600 shadow-md'
                                : 'text-gray-600 hover:text-teal-600'
                            }`}
                    >
                        Yearly
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">
                    ETB {totalRevenue.toLocaleString()}
                </p>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-72">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey={period === 'daily' ? 'day' : period === 'yearly' ? 'year' : 'month'} stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip formatter={(value: any) => `ETB ${value.toLocaleString()}`} />
                        <Area type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={2} fill="url(#revenueGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </motion.div>
    );
};

// Main AdminDashboard Component
const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        approvedTheaters: 0,
        pendingTheaters: 0,
        totalUsers: 0,
        newUsersToday: 0,
        totalRevenue: 0,
        totalShows: 0,
        totalBookings: 0
    });
    const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
    const [revenuePeriod, setRevenuePeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
    const [revenueLoading, setRevenueLoading] = useState(false);
    const [theaterDistribution, setTheaterDistribution] = useState<TheaterDistributionDataPoint[]>([]);
    const [userGrowth, setUserGrowth] = useState<UserGrowthDataPoint[]>([]);
    const [theaterGrowth, setTheaterGrowth] = useState<TheaterGrowthDataPoint[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [showAllActivities, setShowAllActivities] = useState(false);

    // Fetch all dashboard data on mount
    useEffect(() => {
        fetchAllDashboardData();
    }, []);

    // Fetch revenue data when period changes
    useEffect(() => {
        if (revenuePeriod) {
            fetchRevenueData();
        }
    }, [revenuePeriod]);

    // ============================================
    // INLINE BACKEND - SUPABASE QUERIES
    // ============================================

    const fetchAllDashboardData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchStats(),
                fetchRevenueData(),
                fetchTheaterDistribution(),
                fetchUserGrowth(),
                fetchTheaterGrowth(),
                fetchActivities()
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Get approved theaters (status = 'active')
            const { count: approvedTheaters } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            // Get pending theaters
            const { count: pendingTheaters } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            // Get total users
            const { count: totalUsers } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            // Get new users today
            const today = new Date().toISOString().split('T')[0];
            const { count: newUsersToday } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today);

            // Get total revenue from earnings
            const { data: earnings } = await supabase
                .from('earnings')
                .select('net_amount');
            
            const totalRevenue = earnings?.reduce((sum, e) => sum + (e.net_amount || 0), 0) || 0;

            // Get total shows
            const { count: totalShows } = await supabase
                .from('events')
                .select('*', { count: 'exact', head: true });

            // Get total bookings
            const { count: totalBookings } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true });

            setStats({
                approvedTheaters: approvedTheaters || 0,
                pendingTheaters: pendingTheaters || 0,
                totalUsers: totalUsers || 0,
                newUsersToday: newUsersToday || 0,
                totalRevenue,
                totalShows: totalShows || 0,
                totalBookings: totalBookings || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchRevenueData = async () => {
        setRevenueLoading(true);
        try {
            if (revenuePeriod === 'daily') {
                // Last 7 days
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toISOString().split('T')[0];
                });
                
                const { data } = await supabase
                    .from('earnings')
                    .select('created_at, net_amount')
                    .gte('created_at', last7Days[0]);
                
                const result = last7Days.map(day => ({
                    day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
                    revenue: data?.filter((e: any) => e.created_at.split('T')[0] === day)
                        .reduce((sum: number, e: any) => sum + (e.net_amount || 0), 0) || 0
                }));
                setRevenueData(result as any);
            } 
            else if (revenuePeriod === 'yearly') {
                // Last 5 years
                const now = new Date();
                const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - (4 - i));
                
                const { data } = await supabase.from('earnings').select('created_at, net_amount');
                
                const result = years.map(year => ({
                    year: year.toString(),
                    revenue: data?.filter((e: any) => new Date(e.created_at).getFullYear() === year)
                        .reduce((sum: number, e: any) => sum + (e.net_amount || 0), 0) || 0
                }));
                setRevenueData(result as any);
            } 
            else {
                // Monthly - last 12 months
                const now = new Date();
                const months = Array.from({ length: 12 }, (_, i) => {
                    const d = new Date();
                    d.setMonth(now.getMonth() - (11 - i));
                    return d.toISOString().slice(0, 7);
                });
                
                const { data } = await supabase
                    .from('earnings')
                    .select('created_at, net_amount')
                    .gte('created_at', months[0]);
                
                const result = months.map(month => ({
                    month: new Date(month).toLocaleDateString('en-US', { month: 'short' }),
                    revenue: data?.filter((e: any) => e.created_at.startsWith(month))
                        .reduce((sum: number, e: any) => sum + (e.net_amount || 0), 0) || 0
                }));
                setRevenueData(result);
            }
        } catch (error) {
            console.error('Error fetching revenue:', error);
        } finally {
            setRevenueLoading(false);
        }
    };

    const fetchTheaterDistribution = async () => {
        try {
            const { count: active } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');
            
            const { count: pending } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');
            
            const { count: inactive } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'inactive');
            
            setTheaterDistribution([
                { name: 'Active Theaters', value: active || 0, color: '#10B981' },
                { name: 'Pending Approval', value: pending || 0, color: '#F59E0B' },
                { name: 'Inactive', value: inactive || 0, color: '#EF4444' }
            ]);
        } catch (error) {
            console.error('Error fetching theater distribution:', error);
        }
    };

    const fetchUserGrowth = async () => {
        try {
            const now = new Date();
            const months = Array.from({ length: 6 }, (_, i) => {
                const d = new Date();
                d.setMonth(now.getMonth() - (5 - i));
                return d.toISOString().slice(0, 7);
            });
            
            const growthData: UserGrowthDataPoint[] = [];
            
            for (const month of months) {
                const endOfMonth = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0).toISOString();
                const startOfMonth = month + '-01';
                
                const { count: totalUsers } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .lte('created_at', endOfMonth);
                
                const { count: newUsers } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', startOfMonth)
                    .lte('created_at', endOfMonth);
                
                growthData.push({
                    month: new Date(month).toLocaleDateString('en-US', { month: 'short' }),
                    users: totalUsers || 0,
                    newUsers: newUsers || 0
                });
            }
            
            setUserGrowth(growthData);
        } catch (error) {
            console.error('Error fetching user growth:', error);
        }
    };

    const fetchTheaterGrowth = async () => {
        try {
            const now = new Date();
            const months = Array.from({ length: 6 }, (_, i) => {
                const d = new Date();
                d.setMonth(now.getMonth() - (5 - i));
                return d.toISOString().slice(0, 7);
            });
            
            const growthData: TheaterGrowthDataPoint[] = [];
            
            for (const month of months) {
                const endOfMonth = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0).toISOString();
                const startOfMonth = month + '-01';
                
                const { count: totalTheaters } = await supabase
                    .from('theaters')
                    .select('*', { count: 'exact', head: true })
                    .lte('created_at', endOfMonth);
                
                const { count: newTheaters } = await supabase
                    .from('theaters')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', startOfMonth)
                    .lte('created_at', endOfMonth);
                
                const { count: pendingTheaters } = await supabase
                    .from('theaters')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending');
                
                growthData.push({
                    month: new Date(month).toLocaleDateString('en-US', { month: 'short' }),
                    theaters: totalTheaters || 0,
                    newTheaters: newTheaters || 0,
                    pendingTheaters: pendingTheaters || 0
                });
            }
            
            setTheaterGrowth(growthData);
        } catch (error) {
            console.error('Error fetching theater growth:', error);
        }
    };

    const fetchActivities = async () => {
        try {
            // Get recent theater registrations
            const { data: theaterRegistrations } = await supabase
                .from('theaters')
                .select('id, legal_business_name, created_at, status')
                .order('created_at', { ascending: false })
                .limit(10);
            
            // Get recent payments
            const { data: recentPayments } = await supabase
                .from('payments')
                .select('id, amount, payment_status, created_at, booking_id')
                .order('created_at', { ascending: false })
                .limit(10);
            
            // Get recent user registrations
            const { data: newUsers } = await supabase
                .from('users')
                .select('id, full_name, created_at, role')
                .order('created_at', { ascending: false })
                .limit(10);
            
            const activityList: ActivityItem[] = [];
            
            theaterRegistrations?.forEach((theater: any) => {
                activityList.push({
                    id: `theater_${theater.id}`,
                    action: theater.status === 'pending' ? 'New theater awaiting approval' : 'New theater registered',
                    user: theater.legal_business_name,
                    time: formatRelativeTime(theater.created_at),
                    icon: Building,
                    status: theater.status === 'pending' ? 'warning' : 'success'
                });
            });
            
            recentPayments?.forEach((payment: any) => {
                activityList.push({
                    id: `payment_${payment.id}`,
                    action: `Payment of ETB ${payment.amount?.toLocaleString()} processed`,
                    user: `Booking #${payment.booking_id?.slice(-6)}`,
                    time: formatRelativeTime(payment.created_at),
                    icon: DollarSign,
                    status: payment.payment_status === 'completed' ? 'success' : 'info'
                });
            });
            
            newUsers?.forEach((user: any) => {
                activityList.push({
                    id: `user_${user.id}`,
                    action: `New ${user.role} joined`,
                    user: user.full_name,
                    time: formatRelativeTime(user.created_at),
                    icon: Users,
                    status: 'success'
                });
            });
            
            // Sort by time (most recent first)
            activityList.sort((a, b) => {
                const getTimeValue = (time: string) => {
                    if (time.includes('min')) return -parseInt(time) * 60000;
                    if (time.includes('hour')) return -parseInt(time) * 3600000;
                    if (time.includes('day')) return -parseInt(time) * 86400000;
                    return 0;
                };
                return getTimeValue(b.time) - getTimeValue(a.time);
            });
            
            setActivities(activityList.slice(0, 10));
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const displayedActivities = showAllActivities ? activities : activities.slice(0, 3);

    // Dashboard Cards Data with Links
    const dashboardCards = [
        { 
            title: 'Approved Theaters', 
            value: stats.approvedTheaters, 
            icon: Building, 
            color: 'from-teal-500 to-teal-600', 
            delay: 0.1,
            link: '/admin/theaters/theaters',
        },
        { 
            title: 'Pending Theaters', 
            value: stats.pendingTheaters, 
            icon: Clock, 
            color: 'from-yellow-500 to-orange-600', 
            delay: 0.15,
            link: '/admin/theaters/theaters'
        },
        { 
            title: 'Total Users', 
            value: stats.totalUsers.toLocaleString(), 
            icon: Users, 
            color: 'from-blue-500 to-cyan-600', 
            delay: 0.2,
            link: '/admin/users'
        },
        { 
            title: 'New Users Today', 
            value: stats.newUsersToday, 
            icon: UserCheck, 
            color: 'from-indigo-500 to-purple-600', 
            delay: 0.25,
            link: '/admin/users?filter=today'
        },
        { 
            title: 'Total Revenue', 
            value: `ETB ${stats.totalRevenue.toLocaleString()}`, 
            icon: CoinsIcon, 
            color: 'from-emerald-500 to-green-600', 
            delay: 0.3,
            link: '/admin/revenue'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6"
        >
            {/* Stats Grid with Clickable Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                {dashboardCards.map((card, index) => (
                    <StatCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        color={card.color}
                        delay={card.delay}
                        link={card.link}
                    />
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueCard 
                    revenueData={revenueData} 
                    period={revenuePeriod} 
                    onPeriodChange={(period) => setRevenuePeriod(period as any)}
                    loading={revenueLoading}
                />

                {/* Theater Distribution */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Theater Distribution</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <RePieChart>
                            <Pie
                                data={theaterDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                            >
                                {theaterDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RePieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {theaterDistribution.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* User Growth & Theater Growth Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                            <p className="text-sm text-gray-500">Monthly user growth trend</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#0D9488" strokeWidth={2} name="Total Users" />
                            <Line type="monotone" dataKey="newUsers" stroke="#F59E0B" strokeWidth={2} name="New Users" />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Theater Growth Chart */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Theater Growth</h3>
                            <p className="text-sm text-gray-500">Monthly theater growth trend</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={theaterGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="theaters" stroke="#0D9488" strokeWidth={2} name="Total Theaters" />
                            <Line type="monotone" dataKey="newTheaters" stroke="#10B981" strokeWidth={2} name="New Theaters" />
                            <Line type="monotone" dataKey="pendingTheaters" stroke="#F59E0B" strokeWidth={2} name="Pending Theaters" />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    {activities.length > 3 && (
                        <button
                            onClick={() => setShowAllActivities(!showAllActivities)}
                            className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1"
                        >
                            {showAllActivities ? 'Show Less' : `View All (${activities.length})`}
                            <ChevronDown className={`h-4 w-4 transition-transform ${showAllActivities ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
                <div className="space-y-3">
                    {displayedActivities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => {
                                if (activity.id.startsWith('theater')) {
                                    navigate('/admin/theaters');
                                } else if (activity.id.startsWith('payment')) {
                                    navigate('/admin/payments');
                                } else if (activity.id.startsWith('user')) {
                                    navigate('/admin/users');
                                }
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${activity.status === 'success' ? 'bg-green-100' :
                                        activity.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                                    }`}>
                                    <activity.icon className={`h-5 w-5 ${activity.status === 'success' ? 'text-green-600' :
                                            activity.status === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                        }`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.user}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                        </motion.div>
                    ))}
                </div>
                {!showAllActivities && activities.length > 3 && (
                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-400">+{activities.length - 3} more activities</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;