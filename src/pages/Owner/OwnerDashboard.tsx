// src/pages/Owner/OwnerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Building,
    Ticket,
    Activity,
    TrendingUp,
    Users,
    Eye,
    Edit,
    CheckCircle,
    RotateCcw,
    Film,
    Calendar,
    Clock,
    Loader2,
    FileText,
    Percent,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// Direct imports from Overview components
import { AreaChart } from '../../components/Overview/AreaChart';
import { Card, MetricCard, StatCard } from '../../components/Overview/Card';
import { DonutChart } from '../../components/Overview/PieChart';
import supabase from '@/config/supabaseClient';

// Types
interface HallDataPoint {
    name: string;
    occupancy: number;
    capacity: number;
    color: string;
}

interface Show {
    id: string;
    name: string;
    hallName: string;
    sales: number;
    capacity: number;
    revenue: number;
    status: 'selling' | 'almost full' | 'sold out';
    time: string;
    date: string;
}

interface Transaction {
    id: string;
    customer: string;
    amount: number;
    tickets: number;
    time: string;
    status: 'completed' | 'refunded';
    date: string;
}

interface Stats {
    totalRevenue: number;
    ticketsToday: number;
    occupancyRate: number;
    activeEvents: number;
    totalEmployees: number;
    activeEmployees: number;
    totalHalls: number;
    commissionRate: number;
    contractType: string;
}

interface RevenueData {
    period: string;
    revenue: number;
    tickets: number;
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

const OwnerDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [theaterId, setTheaterId] = useState<string | null>(null);
    const [theaterName, setTheaterName] = useState<string>('');
    const [stats, setStats] = useState<Stats>({
        totalRevenue: 0,
        ticketsToday: 0,
        occupancyRate: 0,
        activeEvents: 0,
        totalEmployees: 0,
        activeEmployees: 0,
        totalHalls: 0,
        commissionRate: 0,
        contractType: ''
    });
    const [hallData, setHallData] = useState<HallDataPoint[]>([]);
    const [showsData, setShowsData] = useState<Show[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
    const [dailyRevenueData, setDailyRevenueData] = useState<RevenueData[]>([]);
    const [monthlyRevenueData, setMonthlyRevenueData] = useState<RevenueData[]>([]);
    const [yearlyRevenueData, setYearlyRevenueData] = useState<RevenueData[]>([]);
    
    // Pagination state for transactions
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [transactionsPerPage] = useState(10);

    // Get current user from localStorage
    const getCurrentUser = () => {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    };

    useEffect(() => {
        fetchTheaterAndData();
    }, []);

    const fetchTheaterAndData = async () => {
        setLoading(true);
        try {
            const currentUser = getCurrentUser();
            
            if (!currentUser) {
                console.log('No user found in localStorage');
                setLoading(false);
                return;
            }
            
            console.log('Logged in user:', currentUser.id, currentUser.email);
            
            // Get theater owned by this user
            const { data: theater, error: theaterError } = await supabase
                .from('theaters')
                .select('id, legal_business_name, total_halls, status')
                .eq('owner_user_id', currentUser.id)
                .maybeSingle();

            if (theaterError) {
                console.error('Theater error:', theaterError);
            }
            
            if (theater) {
                console.log('Theater found:', theater.legal_business_name, theater.id);
                setTheaterId(theater.id);
                setTheaterName(theater.legal_business_name);
                
                await Promise.all([
                    fetchContractInfo(theater.id),
                    fetchDashboardStats(theater.id),
                    fetchHallOccupancy(theater.id),
                    fetchActiveEvents(theater.id),
                    fetchRecentTransactions(theater.id),
                    fetchRevenueData(theater.id)
                ]);
            } else {
                console.log('No theater found for user:', currentUser.id);
            }
        } catch (error) {
            console.error('Error fetching theater data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchContractInfo = async (theaterId: string) => {
        try {
            const { data: contract, error: contractError } = await supabase
                .from('owners_contracts')
                .select('contract_type, commission_rate, status')
                .eq('theater_id', theaterId)
                .eq('status', 'active')
                .maybeSingle();

            if (contractError) {
                console.error('Contract error:', contractError);
            }

            if (contract) {
                setStats(prev => ({
                    ...prev,
                    commissionRate: contract.commission_rate || 0,
                    contractType: contract.contract_type || 'N/A'
                }));
            }
        } catch (error) {
            console.error('Error fetching contract:', error);
        }
    };

    const fetchDashboardStats = async (theaterId: string) => {
        try {
            // Get total revenue from earnings
            const { data: earnings, error: earningsError } = await supabase
                .from('earnings')
                .select('net_amount, created_at')
                .eq('theater_id', theaterId)
                .eq('is_subscription_payment', false);

            if (earningsError) {
                console.error('Earnings error:', earningsError);
            }

            const totalRevenue = earnings?.reduce((sum, e) => sum + (e.net_amount || 0), 0) || 0;

            // Get tickets sold today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const { data: events, error: eventsError } = await supabase
                .from('events')
                .select('id')
                .eq('theater_id', theaterId);

            if (eventsError) {
                console.error('Events error:', eventsError);
            }

            const eventIds = events?.map(e => e.id) || [];
            let ticketsToday = 0;

            if (eventIds.length > 0) {
                const { data: reservations, error: reservationsError } = await supabase
                    .from('reservations')
                    .select('id, created_at')
                    .in('event_id', eventIds)
                    .eq('status', 'confirmed')
                    .gte('created_at', today.toISOString())
                    .lt('created_at', tomorrow.toISOString());

                if (!reservationsError) {
                    ticketsToday = reservations?.length || 0;
                }
            }

            const activeEvents = events?.length || 0;

            const { data: employees, error: employeesError } = await supabase
                .from('employees')
                .select('id, is_active')
                .eq('theater_id', theaterId);

            if (employeesError) {
                console.error('Employees error:', employeesError);
            }

            const totalEmployees = employees?.length || 0;
            const activeEmployees = employees?.filter(e => e.is_active === true).length || 0;

            setStats(prev => ({
                ...prev,
                totalRevenue,
                ticketsToday,
                activeEvents,
                totalEmployees,
                activeEmployees
            }));

        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Fetch hall occupancy - counts halls from halls table
    const fetchHallOccupancy = async (theaterId: string) => {
        try {
            // Get all halls for this theater
            const { data: halls, error: hallsError } = await supabase
                .from('halls')
                .select('id, name, capacity')
                .eq('theater_id', theaterId)
                .eq('is_active', true);

            if (hallsError) {
                console.error('Halls error:', hallsError);
            }

            // Get all event schedules for this theater to calculate occupancy
            const { data: events, error: eventsError } = await supabase
                .from('events')
                .select('id')
                .eq('theater_id', theaterId);

            if (eventsError) {
                console.error('Events error:', eventsError);
            }

            const eventIds = events?.map(e => e.id) || [];
            let schedules: any[] = [];

            if (eventIds.length > 0) {
                const { data: schedulesData, error: schedulesError } = await supabase
                    .from('event_schedules')
                    .select('hall_id, available_seats, total_seats, show_date')
                    .in('event_id', eventIds)
                    .gte('show_date', new Date().toISOString().split('T')[0]);

                if (!schedulesError) {
                    schedules = schedulesData || [];
                }
            }

            // Calculate occupancy per hall
            const hallOccupancyMap = new Map<string, { name: string; capacity: number; soldSeats: number }>();
            
            halls?.forEach(hall => {
                hallOccupancyMap.set(hall.id, {
                    name: hall.name,
                    capacity: hall.capacity,
                    soldSeats: 0
                });
            });

            schedules.forEach(schedule => {
                const hall = hallOccupancyMap.get(schedule.hall_id);
                if (hall && schedule.total_seats) {
                    const sold = schedule.total_seats - (schedule.available_seats || 0);
                    hall.soldSeats += sold;
                }
            });

            const colors = ['#14b8a6', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
            
            const hallOccupancyData: HallDataPoint[] = Array.from(hallOccupancyMap.entries()).map(([id, hall], index) => {
                const occupancy = hall.capacity > 0 ? Math.min(hall.soldSeats, hall.capacity) : 0;
                return {
                    name: hall.name,
                    occupancy: occupancy,
                    capacity: hall.capacity,
                    color: colors[index % colors.length]
                };
            });

            // Calculate total halls count
            const totalHalls = halls?.length || 0;
            
            // Calculate average occupancy rate
            const totalCapacity = hallOccupancyData.reduce((sum, h) => sum + h.capacity, 0);
            const totalOccupancy = hallOccupancyData.reduce((sum, h) => sum + h.occupancy, 0);
            const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

            setStats(prev => ({
                ...prev,
                totalHalls,
                occupancyRate
            }));

            setHallData(hallOccupancyData);
            console.log('Halls loaded:', hallOccupancyData.length);
        } catch (error) {
            console.error('Error fetching hall occupancy:', error);
        }
    };

    const fetchActiveEvents = async (theaterId: string) => {
        try {
            const { data: events, error: eventsError } = await supabase
                .from('events')
                .select('id, title, theater_id')
                .eq('theater_id', theaterId);

            if (eventsError) {
                console.error('Events error:', eventsError);
            }

            const eventIds = events?.map(e => e.id) || [];
            let allSchedules: any[] = [];
            
            if (eventIds.length > 0) {
                const { data: schedules, error: schedulesError } = await supabase
                    .from('event_schedules')
                    .select(`
                        id,
                        event_id,
                        hall_id,
                        show_date,
                        start_time,
                        total_seats,
                        available_seats,
                        halls (
                            id,
                            name
                        )
                    `)
                    .in('event_id', eventIds)
                    .gte('show_date', new Date().toISOString().split('T')[0]);

                if (schedulesError) {
                    console.error('Schedules error:', schedulesError);
                } else {
                    allSchedules = schedules || [];
                }
            }

            const shows: Show[] = [];

            allSchedules.forEach(schedule => {
                const event = events?.find(e => e.id === schedule.event_id);
                const soldSeats = (schedule.total_seats || 0) - (schedule.available_seats || 0);
                const estimatedRevenue = soldSeats * 100;
                
                let status: 'selling' | 'almost full' | 'sold out' = 'selling';
                if (schedule.available_seats === 0) {
                    status = 'sold out';
                } else if ((schedule.available_seats || 0) < (schedule.total_seats || 0) * 0.2) {
                    status = 'almost full';
                }

                shows.push({
                    id: schedule.id,
                    name: event?.title || 'Unknown Event',
                    hallName: schedule.halls?.name || 'Unknown Hall',
                    sales: soldSeats,
                    capacity: schedule.total_seats || 0,
                    revenue: estimatedRevenue,
                    status: status,
                    time: schedule.start_time || 'TBD',
                    date: schedule.show_date || new Date().toISOString().split('T')[0]
                });
            });

            setShowsData(shows.slice(0, 5));
        } catch (error) {
            console.error('Error fetching active events:', error);
        }
    };

    // Fetch recent transactions with pagination
    const fetchRecentTransactions = async (theaterId: string, page: number = 1) => {
        try {
            const { data: events, error: eventsError } = await supabase
                .from('events')
                .select('id')
                .eq('theater_id', theaterId);

            if (eventsError) {
                console.error('Events error:', eventsError);
            }

            const eventIds = events?.map(e => e.id) || [];
            
            if (eventIds.length === 0) {
                setTransactions([]);
                setTotalTransactions(0);
                return;
            }

            // Get total count
            const { count: totalCount, error: countError } = await supabase
                .from('reservations')
                .select('id', { count: 'exact', head: true })
                .in('event_id', eventIds)
                .eq('status', 'confirmed');

            if (countError) {
                console.error('Count error:', countError);
            }

            setTotalTransactions(totalCount || 0);

            // Get paginated data
            const start = (page - 1) * transactionsPerPage;
            const end = start + transactionsPerPage - 1;

            const { data: reservations, error: reservationsError } = await supabase
                .from('reservations')
                .select('id, customer_name, total_amount, created_at, status')
                .in('event_id', eventIds)
                .eq('status', 'confirmed')
                .order('created_at', { ascending: false })
                .range(start, end);

            if (reservationsError) {
                console.error('Reservations error:', reservationsError);
            }

            const transactionsList: Transaction[] = (reservations || []).map(res => ({
                id: `#TR-${res.id.slice(-8)}`,
                customer: res.customer_name || 'Guest',
                amount: res.total_amount || 0,
                tickets: 1,
                time: formatRelativeTime(res.created_at),
                date: res.created_at,
                status: 'completed'
            }));

            setTransactions(transactionsList);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // Handle page change for transactions
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        if (theaterId) {
            fetchRecentTransactions(theaterId, newPage);
        }
    };

    const fetchRevenueData = async (theaterId: string) => {
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const { data: earnings, error: earningsError } = await supabase
                .from('earnings')
                .select('net_amount, created_at')
                .eq('theater_id', theaterId)
                .eq('is_subscription_payment', false)
                .gte('created_at', sevenDaysAgo.toISOString());

            if (earningsError) {
                console.error('Earnings error:', earningsError);
            }

            // Daily data
            const dailyMap = new Map<string, { revenue: number; tickets: number }>();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dayName = days[date.getDay()];
                dailyMap.set(dayName, { revenue: 0, tickets: 0 });
            }

            (earnings || []).forEach(earning => {
                const date = new Date(earning.created_at);
                const dayName = days[date.getDay()];
                const existing = dailyMap.get(dayName);
                if (existing) {
                    existing.revenue += earning.net_amount || 0;
                    existing.tickets += 1;
                }
            });

            const dailyData: RevenueData[] = Array.from(dailyMap.entries()).map(([period, data]) => ({
                period,
                revenue: data.revenue,
                tickets: data.tickets
            }));

            setDailyRevenueData(dailyData);

            // Monthly data
            const monthlyMap = new Map<string, { revenue: number; tickets: number }>();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            for (let i = 0; i < 12; i++) {
                const monthName = monthNames[i];
                monthlyMap.set(monthName, { revenue: 0, tickets: 0 });
            }

            (earnings || []).forEach(earning => {
                const date = new Date(earning.created_at);
                const monthName = monthNames[date.getMonth()];
                const existing = monthlyMap.get(monthName);
                if (existing) {
                    existing.revenue += earning.net_amount || 0;
                    existing.tickets += 1;
                }
            });

            const monthlyData: RevenueData[] = Array.from(monthlyMap.entries()).map(([period, data]) => ({
                period,
                revenue: data.revenue,
                tickets: data.tickets
            }));

            setMonthlyRevenueData(monthlyData);

            // Yearly data
            const yearlyMap = new Map<string, { revenue: number; tickets: number }>();
            const currentYear = new Date().getFullYear();
            
            for (let i = 4; i >= 0; i--) {
                const year = (currentYear - i).toString();
                yearlyMap.set(year, { revenue: 0, tickets: 0 });
            }

            (earnings || []).forEach(earning => {
                const year = new Date(earning.created_at).getFullYear().toString();
                const existing = yearlyMap.get(year);
                if (existing) {
                    existing.revenue += earning.net_amount || 0;
                    existing.tickets += 1;
                }
            });

            const yearlyData: RevenueData[] = Array.from(yearlyMap.entries()).map(([period, data]) => ({
                period,
                revenue: data.revenue,
                tickets: data.tickets
            }));

            setYearlyRevenueData(yearlyData);
            
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        }
    };

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

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `ETB ${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `ETB ${(amount / 1000).toFixed(0)}K`;
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'selling':
                return { bg: 'bg-green-100', text: 'text-green-700', label: 'Selling' };
            case 'almost full':
                return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Almost Full' };
            case 'sold out':
                return { bg: 'bg-red-100', text: 'text-red-700', label: 'Sold Out' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
        }
    };

    const getRevenueData = (): RevenueData[] => {
        switch (selectedPeriod) {
            case 'daily':
                return dailyRevenueData;
            case 'monthly':
                return monthlyRevenueData;
            case 'yearly':
                return yearlyRevenueData;
            default:
                return monthlyRevenueData;
        }
    };

    const getXAxisKey = (): string => {
        return 'period';
    };

    const formatYAxisTick = (value: number): string => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
        }
        return value.toString();
    };

    const currentData = getRevenueData();
    const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);

    // Donut chart data for hall occupancy
    const donutData = hallData.map(hall => ({
        name: hall.name,
        value: hall.occupancy,
        color: hall.color
    }));

    // Pagination component
    const Pagination = () => {
        const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
        
        if (totalPages <= 1) return null;
        
        return (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * transactionsPerPage + 1} to {Math.min(currentPage * transactionsPerPage, totalTransactions)} of {totalTransactions} transactions
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-colors ${
                            currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === pageNum
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-colors ${
                            currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6 p-4 md:p-6"
        >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back! Here's what's happening with {theaterName || 'your business'} today.
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Tickets Today"
                    value={stats.ticketsToday}
                    icon={Ticket}
                    color="from-blue-500 to-cyan-600"
                    link="/owner/bookings"
                />
                <StatCard
                    title="Active Events"
                    value={stats.activeEvents}
                    icon={Film}
                    color="from-orange-500 to-red-600"
                    link="/owner/events/manage_event"
                />
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={TrendingUp}
                    color="from-green-500 to-emerald-600"
                    link="/owner/financial" 
                />
                <StatCard
                    title="Active Employees"
                    value={`${stats.activeEmployees}/${stats.totalEmployees}`}
                    icon={Users}
                    color="from-purple-500 to-pink-600"
                    link="/owner/employes/employee"
                />
            </motion.div>

            {/* Secondary Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Halls"
                    value={stats.totalHalls}
                    icon={<Building className="h-5 w-5 text-white" />}
                />
                <MetricCard
                    title="Occupancy Rate"
                    value={`${stats.occupancyRate}%`}
                    icon={<Activity className="h-5 w-5 text-white" />}
                />
                <MetricCard
                    title="Commission Rate"
                    value={`${stats.commissionRate}%`}
                    icon={<Percent className="h-5 w-5 text-white" />}
                />
                <MetricCard
                    title="Contract Type"
                    value={stats.contractType === 'per_ticket' ? 'Per Ticket' : stats.contractType === 'subscription' ? 'Subscription' : 'N/A'}
                    icon={<FileText className="h-5 w-5 text-white" />}
                />
            </motion.div>

            {/* Hall Occupancy - Working Donut Chart */}
            <motion.div variants={itemVariants}>
                <Card
                    title="Hall Occupancy"
                    subtitle="Current occupancy rates across your halls"
                    showMoreLink="/owner/halls/manage"
                    showMoreText="Manage Halls"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DonutChart
                            data={donutData}
                            height={300}
                            showLabels={true}
                        />
                        <div className="space-y-3">
                            {hallData.map((hall, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700 font-medium">{hall.name}</span>
                                        <span className="text-gray-500">{hall.occupancy} / {hall.capacity} seats</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${hall.capacity > 0 ? (hall.occupancy / hall.capacity) * 100 : 0}%`, backgroundColor: hall.color }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {hall.capacity > 0 ? ((hall.occupancy / hall.capacity) * 100).toFixed(0) : 0}% filled
                                    </p>
                                </div>
                            ))}
                            {hallData.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No halls found. Please add halls to your theater.
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Revenue Trends Chart */}
            <motion.div variants={itemVariants}>
                <Card
                    title="Revenue Trends"
                    subtitle={`${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} revenue performance - Total: ${formatCurrency(totalRevenue)}`}
                    headerAction={
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {['Daily', 'Monthly', 'Yearly'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period.toLowerCase() as any)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                                        selectedPeriod === period.toLowerCase() 
                                            ? 'bg-teal-600 text-white shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    }
                >
                    <AreaChart
                        data={getRevenueData()}
                        areas={[
                            { dataKey: 'revenue', name: 'Revenue', color: '#14b8a6', gradient: true },
                        ]}
                        xAxisKey={getXAxisKey()}
                        yAxisLabel="Revenue (ETB)"
                        height={350}
                        showGrid={true}
                        showLegend={true}
                        yAxisTickFormatter={formatYAxisTick}
                    />
                    {currentData.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No revenue data available
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Current Events Performance Table */}
            <motion.div variants={itemVariants}>
                <Card
                    title="Current Events Performance"
                    subtitle="Real-time performance metrics for active events"
                    showMoreLink="/owner/events/manage_event"
                    showMoreText="View All Events"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Event Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Hall Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date & Time</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sales</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showsData.map((show) => {
                                    const statusBadge = getStatusBadgeClass(show.status);
                                    return (
                                        <tr key={show.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{show.name}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-3 w-3 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{show.hallName}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-600">{show.date}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">{show.time}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-700">{show.sales}/{show.capacity}</span>
                                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                        <div 
                                                            className="h-1.5 rounded-full bg-teal-500" 
                                                            style={{ width: `${show.capacity > 0 ? (show.sales / show.capacity) * 100 : 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-semibold text-emerald-600">{formatCurrency(show.revenue)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusBadge.bg} ${statusBadge.text}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {showsData.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">
                                            No active events found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>

            {/* Recent Bookings & Transactions with Pagination */}
            <motion.div variants={itemVariants}>
                <Card
                    title="Recent Bookings & Transactions"
                    subtitle="Latest customer activities and ticket purchases"
                    showMoreLink="/owner/bookings"
                    showMoreText="View All Bookings"
                >
                    <div className="space-y-3">
                        {transactions.map((transaction, index) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-green-100`}>
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{transaction.customer}</p>
                                        <p className="text-xs text-gray-500">{transaction.id} • {transaction.tickets} ticket{transaction.tickets !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                                    <p className="text-xs text-gray-400">{transaction.time}</p>
                                </div>
                            </motion.div>
                        ))}
                        {transactions.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No recent transactions found
                            </div>
                        )}
                        
                        {/* Pagination Component */}
                        <Pagination />
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default OwnerDashboard;