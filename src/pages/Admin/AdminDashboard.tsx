// src/pages/Admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Building,
    CoinsIcon,
    Clock,
    Activity,
    TrendingUp,
    ChevronDown,
    Loader2,
    DollarSign,
    Ticket,
    Calendar,
    AlertTriangle,
    TrendingDown,
    Users,
    CheckCircle,
    XCircle,
    MinusCircle
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell,
    ComposedChart, Bar, Legend,
    LineChart, Line, BarChart
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
    badge?: number;
    trend?: number;
    subtitle?: string;
}

interface RevenueDataPoint {
    label: string;
    revenue: number;
}

interface TheaterDistributionDataPoint {
    name: string;
    value: number;
    color: string;
    percentage: string;
}

interface TheaterGrowthDataPoint {
    label: string;
    activeTheaters: number;
    deactivated: number;
}

interface UserGrowthDataPoint {
    label: string;
    newUsers: number;
}

interface ActivityItem {
    id: string;
    action: string;
    user: string;
    time: string;
    icon: React.ElementType;
    status: 'success' | 'warning' | 'info' | 'error';
}

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

// Helper function to format relative time
const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
};

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, onClick, badge, trend, subtitle }) => {
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
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs text-gray-500">{title}</p>
                            {badge !== undefined && badge > 0 && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                    {badge}
                                </span>
                            )}
                        </div>
                        <p className="text-xl font-bold text-gray-900">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                        )}
                        {trend !== undefined && trend !== 0 && (
                            <div className={`flex items-center gap-1 text-xs mt-0.5 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                <span>{Math.abs(trend)} from yesterday</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Chart Period Selector Component
const ChartPeriodSelector: React.FC<{ period: string; onPeriodChange: (period: string) => void }> = ({ period, onPeriodChange }) => {
    return (
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
    );
};

// Revenue Chart Component with Range Selector
const RevenueChart: React.FC<{ 
    data: RevenueDataPoint[]; 
    period: string; 
    onPeriodChange: (period: string) => void;
    loading: boolean;
    totalRevenue: number;
}> = ({ data, period, onPeriodChange, loading, totalRevenue }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                    <p className="text-sm text-gray-500">Track revenue trends over time with daily, monthly, and yearly views</p>
                </div>
                <ChartPeriodSelector period={period} onPeriodChange={onPeriodChange} />
            </div>
            
            <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">
                    ETB {totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total {period} revenue</p>
            </div>
            
            {loading ? (
                <div className="flex items-center justify-center h-80">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey="label" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip formatter={(value: any) => `ETB ${value.toLocaleString()}`} />
                        <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#0D9488" 
                            strokeWidth={2}
                            fill="url(#revenueGradient)" 
                            name="Revenue"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

// Theater Distribution Pie Chart
const TheaterDistributionChart: React.FC<{ data: TheaterDistributionDataPoint[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    const getStatusIcon = (name: string) => {
        if (name === 'Approved') return <CheckCircle className="h-4 w-4 text-green-600" />;
        if (name === 'Pending') return <Clock className="h-4 w-4 text-yellow-600" />;
        return <XCircle className="h-4 w-4 text-red-600" />;
    };
    
    const getStatusColor = (name: string) => {
        if (name === 'Approved') return 'bg-green-100 text-green-700';
        if (name === 'Pending') return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Theater Distribution</h3>
                    <p className="text-sm text-gray-500">Current theater status breakdown</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </RePieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                    {data.map((item, index) => {
                        const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                        return (
                            <div key={index} className="p-3 rounded-xl bg-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(item.name)}
                                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-gray-900">{item.value}</span>
                                        <span className="text-xs text-gray-500">({percentage}%)</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-500`}
                                        style={{ 
                                            width: `${percentage}%`,
                                            backgroundColor: item.color 
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Theater Growth Chart - Using Area Chart (instead of Bar Chart) and Active Theaters (instead of New Theaters)
const TheaterGrowthChart: React.FC<{ 
    data: TheaterGrowthDataPoint[]; 
    period: string; 
    onPeriodChange: (period: string) => void;
    loading: boolean;
}> = ({ data, period, onPeriodChange, loading }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Theater Growth</h3>
                    <p className="text-sm text-gray-500">Active vs Deactivated theaters over time</p>
                </div>
                <ChartPeriodSelector period={period} onPeriodChange={onPeriodChange} />
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-72">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="deactivatedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey="label" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="activeTheaters" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            fill="url(#activeGradient)" 
                            name="Active Theaters"
                        />
                        <Area 
                            type="monotone" 
                            dataKey="deactivated" 
                            stroke="#EF4444" 
                            strokeWidth={2}
                            fill="url(#deactivatedGradient)" 
                            name="Deactivated Theaters"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

// User Growth Chart
const UserGrowthChart: React.FC<{ 
    data: UserGrowthDataPoint[]; 
    period: string; 
    onPeriodChange: (period: string) => void;
    loading: boolean;
}> = ({ data, period, onPeriodChange, loading }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                    <p className="text-sm text-gray-500">New user registrations over time</p>
                </div>
                <ChartPeriodSelector period={period} onPeriodChange={onPeriodChange} />
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-72">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey="label" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Area 
                            type="monotone" 
                            dataKey="newUsers" 
                            stroke="#0D9488" 
                            strokeWidth={2}
                            fill="url(#userGradient)" 
                            name="New Users"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

// Today's Activity with pagination/limitation for bulky data
const TodayActivity: React.FC<{ activities: ActivityItem[]; onViewAll: () => void; showAll: boolean; onShowLess: () => void }> = ({ 
    activities, 
    onViewAll, 
    showAll, 
    onShowLess 
}) => {
    const navigate = useNavigate();
    const displayedActivities = showAll ? activities : activities.slice(0, 5);
    const hasMore = activities.length > 5;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Today's Activity</h3>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                {hasMore && (
                    <button
                        onClick={showAll ? onShowLess : onViewAll}
                        className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1"
                    >
                        {showAll ? 'Show Less' : `View All (${activities.length})`}
                        <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>
            {activities.length === 0 ? (
                <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No activities recorded today</p>
                    <p className="text-xs text-gray-400 mt-1">Activities will appear here when users interact with the platform</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {displayedActivities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => {
                                if (activity.id.startsWith('theater')) {
                                    navigate('/admin/theaters/theaters');
                                } else if (activity.id.startsWith('payment')) {
                                    navigate('/admin/payments');
                                } else if (activity.id.startsWith('user')) {
                                    navigate('/admin/users');
                                } else if (activity.id.startsWith('booking')) {
                                    navigate('/admin/bookings');
                                }
                            }}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`p-2 rounded-lg ${
                                    activity.status === 'success' ? 'bg-green-100' :
                                    activity.status === 'warning' ? 'bg-yellow-100' :
                                    activity.status === 'error' ? 'bg-red-100' : 'bg-blue-100'
                                }`}>
                                    <activity.icon className={`h-5 w-5 ${
                                        activity.status === 'success' ? 'text-green-600' :
                                        activity.status === 'warning' ? 'text-yellow-600' :
                                        activity.status === 'error' ? 'text-red-600' : 'text-blue-600'
                                    }`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.user}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 ml-4">{activity.time}</span>
                        </motion.div>
                    ))}
                </div>
            )}
            {!showAll && hasMore && (
                <div className="mt-3 text-center">
                    <p className="text-xs text-gray-400">+{activities.length - 5} more activities today</p>
                </div>
            )}
        </div>
    );
};

// Main AdminDashboard Component
const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        approvedTheaters: 0,
        pendingTheaters: 0,
        deactivatedTheaters: 0,
        newTheatersToday: 0,
        newUsersToday: 0,
        totalRevenue: 0,
        todayRevenue: 0,
        yesterdayRevenue: 0
    });
    
    // Chart periods
    const [revenuePeriod, setRevenuePeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
    const [theaterPeriod, setTheaterPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
    const [userPeriod, setUserPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
    
    // Chart data
    const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
    const [theaterGrowthData, setTheaterGrowthData] = useState<TheaterGrowthDataPoint[]>([]);
    const [userGrowthData, setUserGrowthData] = useState<UserGrowthDataPoint[]>([]);
    
    const [revenueLoading, setRevenueLoading] = useState(false);
    const [theaterLoading, setTheaterLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    
    const [theaterDistribution, setTheaterDistribution] = useState<TheaterDistributionDataPoint[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [showAllActivities, setShowAllActivities] = useState(false);

    // Fetch all dashboard data on mount
    useEffect(() => {
        fetchAllDashboardData();
    }, []);

    // Fetch data when periods change
    useEffect(() => {
        if (revenuePeriod) fetchRevenueData();
    }, [revenuePeriod]);
    
    useEffect(() => {
        if (theaterPeriod) fetchTheaterGrowthData();
    }, [theaterPeriod]);
    
    useEffect(() => {
        if (userPeriod) fetchUserGrowthData();
    }, [userPeriod]);

    // ============================================
    // SUPABASE QUERIES
    // ============================================

    const fetchAllDashboardData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchStats(),
                fetchRevenueData(),
                fetchTheaterDistribution(),
                fetchTheaterGrowthData(),
                fetchUserGrowthData(),
                fetchTodayActivities()
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Approved theaters
            const { count: approvedTheaters } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'approved');
            
            // Pending theaters
            const { count: pendingTheaters } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');
            
            // Deactivated/inactive theaters
            const { count: deactivatedTheaters } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'inactive');
            
            // New theaters today
            const today = new Date().toISOString().split('T')[0];
            const { count: newTheatersToday } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today);
            
            // New users today
            const { count: newUsersToday } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today);
            
            // Total revenue
            const { data: earnings } = await supabase
                .from('earnings')
                .select('net_amount');
            
            const totalRevenue = earnings?.reduce((sum, e) => sum + (e.net_amount || 0), 0) || 0;
            
            // Today's revenue
            const { data: todayEarnings } = await supabase
                .from('earnings')
                .select('net_amount')
                .gte('created_at', today);
            
            const todayRevenue = todayEarnings?.reduce((sum, e) => sum + (e.net_amount || 0), 0) || 0;
            
            // Yesterday's revenue
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            const { data: yesterdayEarnings } = await supabase
                .from('earnings')
                .select('net_amount')
                .gte('created_at', yesterdayStr)
                .lt('created_at', today);
            
            const yesterdayRevenue = yesterdayEarnings?.reduce((sum, e) => sum + (e.net_amount || 0), 0) || 0;
            
            setStats({
                approvedTheaters: approvedTheaters || 0,
                pendingTheaters: pendingTheaters || 0,
                deactivatedTheaters: deactivatedTheaters || 0,
                newTheatersToday: newTheatersToday || 0,
                newUsersToday: newUsersToday || 0,
                totalRevenue,
                todayRevenue,
                yesterdayRevenue
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchRevenueData = async () => {
        setRevenueLoading(true);
        try {
            if (revenuePeriod === 'daily') {
                // Last 30 days
                const last30Days = Array.from({ length: 30 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (29 - i));
                    return d.toISOString().split('T')[0];
                });
                
                const { data: earningsData } = await supabase
                    .from('earnings')
                    .select('created_at, net_amount')
                    .gte('created_at', last30Days[0]);
                
                const result = last30Days.map(date => ({
                    label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    revenue: earningsData?.filter((e: any) => e.created_at?.split('T')[0] === date)
                        .reduce((sum: number, e: any) => sum + (e.net_amount || 0), 0) || 0
                }));
                setRevenueData(result);
            } 
            else if (revenuePeriod === 'yearly') {
                // Last 5 years
                const now = new Date();
                const years = Array.from({ length: 5 }, (_, i) => (now.getFullYear() - (4 - i)).toString());
                const { data: earningsData } = await supabase.from('earnings').select('created_at, net_amount');
                
                const result = years.map(year => ({
                    label: year,
                    revenue: earningsData?.filter((e: any) => new Date(e.created_at).getFullYear() === parseInt(year))
                        .reduce((sum: number, e: any) => sum + (e.net_amount || 0), 0) || 0
                }));
                setRevenueData(result);
            } 
            else {
                // Monthly - last 12 months
                const now = new Date();
                const months = Array.from({ length: 12 }, (_, i) => {
                    const d = new Date();
                    d.setMonth(now.getMonth() - (11 - i));
                    return d.toISOString().slice(0, 7);
                });
                
                const { data: earningsData } = await supabase
                    .from('earnings')
                    .select('created_at, net_amount')
                    .gte('created_at', months[0]);
                
                const result = months.map(month => ({
                    label: new Date(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    revenue: earningsData?.filter((e: any) => e.created_at?.startsWith(month))
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
            const { count: approved } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'approved');
            
            const { count: pending } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');
            
            const { count: inactive } = await supabase
                .from('theaters')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'inactive');
            
            const total = (approved || 0) + (pending || 0) + (inactive || 0);
            
            setTheaterDistribution([
                { 
                    name: 'Approved', 
                    value: approved || 0, 
                    color: '#10B981',
                    percentage: total > 0 ? ((approved || 0) / total * 100).toFixed(1) : '0'
                },
                { 
                    name: 'Pending', 
                    value: pending || 0, 
                    color: '#F59E0B',
                    percentage: total > 0 ? ((pending || 0) / total * 100).toFixed(1) : '0'
                },
                { 
                    name: 'Deactivated', 
                    value: inactive || 0, 
                    color: '#EF4444',
                    percentage: total > 0 ? ((inactive || 0) / total * 100).toFixed(1) : '0'
                }
            ]);
        } catch (error) {
            console.error('Error fetching theater distribution:', error);
        }
    };

    const fetchTheaterGrowthData = async () => {
        setTheaterLoading(true);
        try {
            if (theaterPeriod === 'daily') {
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toISOString().split('T')[0];
                });
                
                const { data } = await supabase
                    .from('theaters')
                    .select('created_at, updated_at, status')
                    .gte('created_at', last7Days[0]);
                
                const result = last7Days.map(date => {
                    const dayDate = date;
                    return {
                        label: new Date(dayDate).toLocaleDateString('en-US', { weekday: 'short' }),
                        activeTheaters: data?.filter((t: any) => t.status === 'approved' && t.created_at?.split('T')[0] <= dayDate).length || 0,
                        deactivated: data?.filter((t: any) => t.status === 'inactive' && t.updated_at?.split('T')[0] === dayDate).length || 0
                    };
                });
                setTheaterGrowthData(result);
            } 
            else if (theaterPeriod === 'yearly') {
                const now = new Date();
                const years = Array.from({ length: 5 }, (_, i) => (now.getFullYear() - (4 - i)).toString());
                const { data } = await supabase.from('theaters').select('created_at, updated_at, status');
                
                const result = years.map(year => ({
                    label: year,
                    activeTheaters: data?.filter((t: any) => t.status === 'approved' && new Date(t.created_at).getFullYear() <= parseInt(year)).length || 0,
                    deactivated: data?.filter((t: any) => t.status === 'inactive' && new Date(t.updated_at).getFullYear() === parseInt(year)).length || 0
                }));
                setTheaterGrowthData(result);
            }
            else {
                const now = new Date();
                const months = Array.from({ length: 12 }, (_, i) => {
                    const d = new Date();
                    d.setMonth(now.getMonth() - (11 - i));
                    return d.toISOString().slice(0, 7);
                });
                
                const { data } = await supabase
                    .from('theaters')
                    .select('created_at, updated_at, status')
                    .gte('created_at', months[0]);
                
                const result = months.map(month => ({
                    label: new Date(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    activeTheaters: data?.filter((t: any) => t.status === 'approved' && t.created_at?.startsWith(month)).length || 0,
                    deactivated: data?.filter((t: any) => t.status === 'inactive' && t.updated_at?.startsWith(month)).length || 0
                }));
                setTheaterGrowthData(result);
            }
        } catch (error) {
            console.error('Error fetching theater growth:', error);
        } finally {
            setTheaterLoading(false);
        }
    };

    const fetchUserGrowthData = async () => {
        setUserLoading(true);
        try {
            if (userPeriod === 'daily') {
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toISOString().split('T')[0];
                });
                
                const { data } = await supabase
                    .from('users')
                    .select('created_at')
                    .gte('created_at', last7Days[0]);
                
                const result = last7Days.map(date => ({
                    label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                    newUsers: data?.filter((u: any) => u.created_at?.split('T')[0] === date).length || 0
                }));
                setUserGrowthData(result);
            } 
            else if (userPeriod === 'yearly') {
                const now = new Date();
                const years = Array.from({ length: 5 }, (_, i) => (now.getFullYear() - (4 - i)).toString());
                const { data } = await supabase.from('users').select('created_at');
                
                const result = years.map(year => ({
                    label: year,
                    newUsers: data?.filter((u: any) => new Date(u.created_at).getFullYear() === parseInt(year)).length || 0
                }));
                setUserGrowthData(result);
            }
            else {
                const now = new Date();
                const months = Array.from({ length: 12 }, (_, i) => {
                    const d = new Date();
                    d.setMonth(now.getMonth() - (11 - i));
                    return d.toISOString().slice(0, 7);
                });
                
                const { data } = await supabase
                    .from('users')
                    .select('created_at')
                    .gte('created_at', months[0]);
                
                const result = months.map(month => ({
                    label: new Date(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    newUsers: data?.filter((u: any) => u.created_at?.startsWith(month)).length || 0
                }));
                setUserGrowthData(result);
            }
        } catch (error) {
            console.error('Error fetching user growth:', error);
        } finally {
            setUserLoading(false);
        }
    };

    const fetchTodayActivities = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            
            const { data: theaterRegistrations } = await supabase
                .from('theaters')
                .select('id, legal_business_name, created_at, status')
                .gte('created_at', today)
                .lt('created_at', tomorrowStr)
                .order('created_at', { ascending: false });
            
            const { data: newUsers } = await supabase
                .from('users')
                .select('id, full_name, email, created_at, role')
                .gte('created_at', today)
                .lt('created_at', tomorrowStr)
                .order('created_at', { ascending: false });
            
            const { data: deactivatedTheaters } = await supabase
                .from('theaters')
                .select('id, legal_business_name, updated_at, status')
                .eq('status', 'inactive')
                .gte('updated_at', today)
                .lt('updated_at', tomorrowStr);
            
            const { data: todayPayments } = await supabase
                .from('payments')
                .select('id, amount, payment_status, created_at')
                .gte('created_at', today)
                .lt('created_at', tomorrowStr);
            
            const { data: todayBookings } = await supabase
                .from('reservations')
                .select('id, total_amount, created_at')
                .gte('created_at', today)
                .lt('created_at', tomorrowStr);
            
            const activityList: ActivityItem[] = [];
            
            theaterRegistrations?.forEach((theater: any) => {
                activityList.push({
                    id: `theater_${theater.id}`,
                    action: theater.status === 'pending' ? 'New theater awaiting approval' : 'New theater registered',
                    user: theater.legal_business_name,
                    time: formatTimeAgo(theater.created_at),
                    icon: Building,
                    status: theater.status === 'pending' ? 'warning' : 'success'
                });
            });
            
            deactivatedTheaters?.forEach((theater: any) => {
                activityList.push({
                    id: `deactivated_${theater.id}`,
                    action: 'Theater deactivated',
                    user: theater.legal_business_name,
                    time: formatTimeAgo(theater.updated_at),
                    icon: AlertTriangle,
                    status: 'error'
                });
            });
            
            newUsers?.forEach((user: any) => {
                activityList.push({
                    id: `user_${user.id}`,
                    action: `New ${user.role || 'user'} joined`,
                    user: user.full_name || user.email,
                    time: formatTimeAgo(user.created_at),
                    icon: Users,
                    status: 'success'
                });
            });
            
            todayPayments?.forEach((payment: any) => {
                if (payment.payment_status === 'completed') {
                    activityList.push({
                        id: `payment_${payment.id}`,
                        action: `Payment of ETB ${payment.amount?.toLocaleString()} completed`,
                        user: `Transaction #${payment.id?.slice(-6)}`,
                        time: formatTimeAgo(payment.created_at),
                        icon: DollarSign,
                        status: 'success'
                    });
                }
            });
            
            todayBookings?.forEach((booking: any) => {
                activityList.push({
                    id: `booking_${booking.id}`,
                    action: `New booking created`,
                    user: `Booking #${booking.id?.slice(-6)} - ETB ${booking.total_amount?.toLocaleString()}`,
                    time: formatTimeAgo(booking.created_at),
                    icon: Ticket,
                    status: 'info'
                });
            });
            
            activityList.sort((a, b) => {
                const getTimeValue = (time: string) => {
                    if (time.includes('min')) return -parseInt(time) * 60000;
                    if (time.includes('hour')) return -parseInt(time) * 3600000;
                    return 0;
                };
                return getTimeValue(b.time) - getTimeValue(a.time);
            });
            
            setActivities(activityList.slice(0, 20));
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const revenueTrend = stats.yesterdayRevenue > 0 
        ? ((stats.todayRevenue - stats.yesterdayRevenue) / stats.yesterdayRevenue) * 100 
        : stats.todayRevenue > 0 ? 100 : 0;
    
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    
    const totalTheaters = stats.approvedTheaters + stats.pendingTheaters + stats.deactivatedTheaters;
    const approvedPercentage = totalTheaters > 0 ? ((stats.approvedTheaters / totalTheaters) * 100).toFixed(1) : '0';

    // Dashboard Cards
    const dashboardCards = [
        { 
            title: 'Approved Theaters', 
            value: stats.approvedTheaters, 
            icon: Building, 
            color: 'from-teal-500 to-teal-600', 
            delay: 0.1,
            link: '/admin/theaters/theaters',
            badge: stats.pendingTheaters,
            subtitle: `${approvedPercentage}% of all theaters`
        },
        { 
            title: 'Deactivated Theaters', 
            value: stats.deactivatedTheaters, 
            icon: AlertTriangle, 
            color: 'from-red-500 to-red-600', 
            delay: 0.15,
            link: '/admin/theaters/theaters?filter=inactive',
            subtitle: 'Inactive venues'
        },
        { 
            title: 'New Theaters Today', 
            value: stats.newTheatersToday, 
            icon: Building, 
            color: 'from-emerald-500 to-green-600', 
            delay: 0.2,
            trend: stats.newTheatersToday - (stats.newTheatersToday > 0 ? 0 : 0),
            subtitle: 'New registrations'
        },
        { 
            title: 'New Users Today', 
            value: stats.newUsersToday, 
            icon: Users, 
            color: 'from-blue-500 to-cyan-600', 
            delay: 0.25,
            trend: stats.newUsersToday - (stats.newUsersToday > 0 ? 0 : 0),
            subtitle: 'New accounts'
        },
        { 
            title: 'Total Revenue', 
            value: `ETB ${stats.totalRevenue.toLocaleString()}`, 
            icon: CoinsIcon, 
            color: 'from-purple-500 to-pink-600', 
            delay: 0.3,
            link: '/admin/revenue',
            subtitle: 'Lifetime earnings'
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
            {/* Stats Grid - 5 Cards */}
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
                        badge={card.badge}
                        trend={card.trend}
                        subtitle={card.subtitle}
                    />
                ))}
            </motion.div>

            {/* Revenue Chart with Range Selector */}
            <RevenueChart
                data={revenueData}
                period={revenuePeriod}
                onPeriodChange={(p) => setRevenuePeriod(p as any)}
                loading={revenueLoading}
                totalRevenue={totalRevenue}
            />

            {/* Two Column Layout - Theater Distribution & Today's Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TheaterDistributionChart data={theaterDistribution} />
                
                <TodayActivity 
                    activities={activities}
                    onViewAll={() => setShowAllActivities(true)}
                    showAll={showAllActivities}
                    onShowLess={() => setShowAllActivities(false)}
                />
            </div>

            {/* Growth Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Theater Growth - Using Area Chart with Active Theaters */}
                <TheaterGrowthChart
                    data={theaterGrowthData}
                    period={theaterPeriod}
                    onPeriodChange={(p) => setTheaterPeriod(p as any)}
                    loading={theaterLoading}
                />

                {/* User Growth - Using Area Chart */}
                <UserGrowthChart
                    data={userGrowthData}
                    period={userPeriod}
                    onPeriodChange={(p) => setUserPeriod(p as any)}
                    loading={userLoading}
                />
            </div>
        </motion.div>
    );
};

export default AdminDashboard;