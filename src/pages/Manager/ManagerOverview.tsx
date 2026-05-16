// src/pages/Manager/ManagerOverview.tsx
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
  Loader2,
  AlertCircle
} from 'lucide-react';

import { AreaChart } from '../../components/Overview/AreaChart';
import { BarChart } from '../../components/Overview/BarChart';
import { Card, StatCard, MetricCard } from '../../components/Overview/Card';
import { DonutChart } from '../../components/Overview/PieChart';
import supabase from '@/config/supabaseClient';

// ==================== Types ====================
interface HallOccupancyData {
  name: string;
  occupancy: number;
  capacity: number;
  color: string;
}

interface ShowData {
  id: string;
  name: string;
  sales: number;
  capacity: number;
  revenue: number;
  status: 'selling' | 'almost full' | 'sold out' | 'upcoming' | 'completed';
  time: string;
  date: string;
  hall: string;
}

interface Transaction {
  id: string;
  customer: string;
  amount: number;
  tickets: number;
  time: string;
  status: 'completed' | 'refunded' | 'pending';
}

interface ManagerStats {
  totalRevenue: number;
  ticketsSold: number;
  ticketsToday: number;
  occupancyRate: number;
  activeShows: number;
  totalHalls: number;
  activeHalls: number;
  totalCustomers: number;
  upcomingShows: number;
  completedShows: number;
}

interface RevenueData {
  period: string;
  revenue: number;
  tickets: number;
}

interface SeatDistribution {
  name: string;
  value: number;
  color: string;
}

const ManagerOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theaterId, setTheaterId] = useState<string | null>(null);
  const [stats, setStats] = useState<ManagerStats>({
    totalRevenue: 0,
    ticketsSold: 0,
    ticketsToday: 0,
    occupancyRate: 0,
    activeShows: 0,
    totalHalls: 0,
    activeHalls: 0,
    totalCustomers: 0,
    upcomingShows: 0,
    completedShows: 0,
  });
  const [hallOccupancyData, setHallOccupancyData] = useState<HallOccupancyData[]>([]);
  const [showsData, setShowsData] = useState<ShowData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dailyRevenueData, setDailyRevenueData] = useState<RevenueData[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<RevenueData[]>([]);
  const [weeklyBookingData, setWeeklyBookingData] = useState<RevenueData[]>([]);
  const [seatDistributionData, setSeatDistributionData] = useState<SeatDistribution[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly'>('monthly');
  const [selectedRevenueType, setSelectedRevenueType] = useState<'revenue' | 'tickets'>('revenue');

  // Colors for charts
  const colors = ['#14b8a6', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

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

  // Fetch theater ID for the logged-in manager
  const fetchTheaterId = async (userId: string) => {
    // First check if user is a theater manager in employees table
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('theater_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (employeeError) {
      console.error('Employee fetch error:', employeeError);
    }

    if (employee) {
      return employee.theater_id;
    }

    // If not found as employee, check as theater owner
    const { data: theater, error: theaterError } = await supabase
      .from('theaters')
      .select('id')
      .eq('owner_user_id', userId)
      .maybeSingle();

    if (theaterError) {
      console.error('Theater fetch error:', theaterError);
    }

    return theater?.id || null;
  };

  // Fetch total revenue from earnings
  const fetchTotalRevenue = async (theaterId: string) => {
    const { data, error } = await supabase
      .from('earnings')
      .select('net_amount')
      .eq('theater_id', theaterId)
      .eq('is_subscription_payment', false);

    if (error) {
      console.error('Revenue fetch error:', error);
      return 0;
    }

    return data?.reduce((sum, e) => sum + (e.net_amount || 0), 0) || 0;
  };

  // Fetch total tickets sold
  const fetchTotalTicketsSold = async (theaterId: string) => {
    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('theater_id', theaterId);

    const eventIds = events?.map(e => e.id) || [];
    
    if (eventIds.length === 0) return 0;

    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('id')
      .in('event_id', eventIds)
      .eq('status', 'confirmed');

    if (error) {
      console.error('Tickets fetch error:', error);
      return 0;
    }

    return reservations?.length || 0;
  };

  // Fetch tickets sold today
  const fetchTicketsToday = async (theaterId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('theater_id', theaterId);

    const eventIds = events?.map(e => e.id) || [];
    
    if (eventIds.length === 0) return 0;

    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('id')
      .in('event_id', eventIds)
      .eq('status', 'confirmed')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (error) {
      console.error('Tickets today fetch error:', error);
      return 0;
    }

    return reservations?.length || 0;
  };

  // Fetch halls data
  const fetchHalls = async (theaterId: string) => {
    const { data, error } = await supabase
      .from('halls')
      .select('id, name, capacity')
      .eq('theater_id', theaterId)
      .eq('is_active', true);

    if (error) {
      console.error('Halls fetch error:', error);
      return [];
    }

    return data || [];
  };

  // Fetch active shows (events with schedules)
  const fetchActiveShows = async (theaterId: string) => {
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title')
      .eq('theater_id', theaterId);

    if (eventsError) {
      console.error('Events fetch error:', eventsError);
      return [];
    }

    const eventIds = events?.map(e => e.id) || [];
    
    if (eventIds.length === 0) return [];

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
        halls (name)
      `)
      .in('event_id', eventIds)
      .order('show_date', { ascending: true });

    if (schedulesError) {
      console.error('Schedules fetch error:', schedulesError);
      return [];
    }

    const shows: ShowData[] = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    for (const schedule of schedules || []) {
      const event = events.find(e => e.id === schedule.event_id);
      const soldSeats = (schedule.total_seats || 0) - (schedule.available_seats || 0);
      const estimatedRevenue = soldSeats * 100; // Placeholder
      
      let status: 'selling' | 'almost full' | 'sold out' | 'upcoming' | 'completed' = 'selling';
      if (schedule.show_date < today) {
        status = 'completed';
      } else if (schedule.available_seats === 0) {
        status = 'sold out';
      } else if ((schedule.available_seats || 0) < (schedule.total_seats || 0) * 0.2) {
        status = 'almost full';
      } else if (schedule.show_date > today) {
        status = 'upcoming';
      }

      shows.push({
        id: schedule.id,
        name: event?.title || 'Unknown Event',
        sales: soldSeats,
        capacity: schedule.total_seats || 0,
        revenue: estimatedRevenue,
        status,
        time: schedule.start_time || 'TBD',
        date: schedule.show_date,
        hall: schedule.halls?.name || 'Unknown Hall'
      });
    }

    return shows;
  };

  // Fetch recent transactions
  const fetchRecentTransactions = async (theaterId: string) => {
    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('theater_id', theaterId);

    const eventIds = events?.map(e => e.id) || [];
    
    if (eventIds.length === 0) return [];

    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('id, customer_name, total_amount, created_at, status')
      .in('event_id', eventIds)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Transactions fetch error:', error);
      return [];
    }

    return reservations?.map(res => ({
      id: `#TR-${res.id.slice(-8)}`,
      customer: res.customer_name || 'Guest',
      amount: res.total_amount || 0,
      tickets: 1,
      time: formatRelativeTime(res.created_at),
      status: res.status === 'confirmed' ? 'completed' : 'pending'
    })) || [];
  };

  // Fetch revenue data for charts
  const fetchRevenueData = async (theaterId: string) => {
    const { data: earnings, error } = await supabase
      .from('earnings')
      .select('net_amount, created_at')
      .eq('theater_id', theaterId)
      .eq('is_subscription_payment', false)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Revenue data fetch error:', error);
      return;
    }

    // Daily data - last 7 days
    const dailyMap = new Map<string, { revenue: number; tickets: number }>();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayName = days[date.getDay()];
      dailyMap.set(dayName, { revenue: 0, tickets: 0 });
    }

    earnings?.forEach(earning => {
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

    // Monthly data - last 12 months
    const monthlyMap = new Map<string, { revenue: number; tickets: number }>();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 12; i++) {
      const monthName = monthNames[i];
      monthlyMap.set(monthName, { revenue: 0, tickets: 0 });
    }

    earnings?.forEach(earning => {
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

    // Weekly booking data
    const weeklyMap = new Map<string, { revenue: number; tickets: number }>();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    weekDays.forEach(day => weeklyMap.set(day, { revenue: 0, tickets: 0 }));

    earnings?.forEach(earning => {
      const date = new Date(earning.created_at);
      const dayName = weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const existing = weeklyMap.get(dayName);
      if (existing) {
        existing.revenue += earning.net_amount || 0;
        existing.tickets += 1;
      }
    });

    const weeklyData: RevenueData[] = Array.from(weeklyMap.entries()).map(([period, data]) => ({
      period,
      revenue: data.revenue,
      tickets: data.tickets
    }));

    setWeeklyBookingData(weeklyData);
  };

  // Calculate hall occupancy
  const calculateHallOccupancy = async (theaterId: string, halls: any[]) => {
    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('theater_id', theaterId);

    const eventIds = events?.map(e => e.id) || [];
    
    if (eventIds.length === 0) {
      setHallOccupancyData(halls.map((hall, idx) => ({
        name: hall.name,
        occupancy: 0,
        capacity: hall.capacity,
        color: colors[idx % colors.length]
      })));
      return;
    }

    const { data: schedules } = await supabase
      .from('event_schedules')
      .select('hall_id, total_seats, available_seats')
      .in('event_id', eventIds);

    const hallOccupancyMap = new Map<string, { name: string; capacity: number; soldSeats: number }>();
    
    halls.forEach(hall => {
      hallOccupancyMap.set(hall.id, {
        name: hall.name,
        capacity: hall.capacity,
        soldSeats: 0
      });
    });

    schedules?.forEach(schedule => {
      const hall = hallOccupancyMap.get(schedule.hall_id);
      if (hall && schedule.total_seats) {
        const sold = schedule.total_seats - (schedule.available_seats || 0);
        hall.soldSeats += sold;
      }
    });

    const occupancyData: HallOccupancyData[] = Array.from(hallOccupancyMap.entries()).map(([id, hall], idx) => ({
      name: hall.name,
      occupancy: hall.capacity > 0 ? Math.min(Math.round((hall.soldSeats / hall.capacity) * 100), 100) : 0,
      capacity: hall.capacity,
      color: colors[idx % colors.length]
    }));

    setHallOccupancyData(occupancyData);

    // Calculate overall occupancy rate
    const totalCapacity = occupancyData.reduce((sum, h) => sum + h.capacity, 0);
    const totalOccupancy = occupancyData.reduce((sum, h) => sum + (h.capacity * (h.occupancy / 100)), 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

    setStats(prev => ({ ...prev, occupancyRate }));
  };

  // Calculate seat distribution
  const calculateSeatDistribution = async (theaterId: string, halls: any[]) => {
    const totalSeats = halls.reduce((sum, h) => sum + h.capacity, 0);
    
    // For demo, create distribution based on seat levels
    const distribution: SeatDistribution[] = [
      { name: 'Standard', value: Math.round(totalSeats * 0.52), color: '#14b8a6' },
      { name: 'Premium', value: Math.round(totalSeats * 0.31), color: '#f59e0b' },
      { name: 'VIP', value: Math.round(totalSeats * 0.13), color: '#8b5cf6' },
      { name: 'Wheelchair', value: Math.round(totalSeats * 0.04), color: '#3b82f6' },
    ];

    setSeatDistributionData(distribution);
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
    if (amount >= 1000000) return `ETB ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `ETB ${(amount / 1000).toFixed(0)}K`;
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'ETB', 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setError('User not found. Please login again.');
        setLoading(false);
        return;
      }

      const theaterId = await fetchTheaterId(currentUser.id);
      if (!theaterId) {
        setError('No theater associated with this account.');
        setLoading(false);
        return;
      }

      setTheaterId(theaterId);

      // Fetch halls first
      const halls = await fetchHalls(theaterId);
      const totalHalls = halls.length;
      const activeHalls = halls.filter(h => h.is_active !== false).length;

      // Fetch all data in parallel
      const [
        totalRevenue,
        totalTicketsSold,
        ticketsToday,
        activeShows,
        transactionsList,
        shows
      ] = await Promise.all([
        fetchTotalRevenue(theaterId),
        fetchTotalTicketsSold(theaterId),
        fetchTicketsToday(theaterId),
        fetchActiveShows(theaterId),
        fetchRecentTransactions(theaterId),
        fetchActiveShows(theaterId)
      ]);

      // Calculate counts
      const activeShowsCount = shows.filter(s => s.status === 'selling' || s.status === 'almost full').length;
      const upcomingShowsCount = shows.filter(s => s.status === 'upcoming').length;
      const completedShowsCount = shows.filter(s => s.status === 'completed').length;
      const totalCustomers = 0; // Would need customers table

      setStats({
        totalRevenue,
        ticketsSold: totalTicketsSold,
        ticketsToday,
        occupancyRate: 0, // Will be updated after hall occupancy calculation
        activeShows: activeShowsCount,
        totalHalls,
        activeHalls,
        totalCustomers,
        upcomingShows: upcomingShowsCount,
        completedShows: completedShowsCount,
      });

      setShowsData(shows.slice(0, 6));
      setTransactions(transactionsList);

      // Calculate hall occupancy
      await calculateHallOccupancy(theaterId, halls);
      
      // Calculate seat distribution
      await calculateSeatDistribution(theaterId, halls);
      
      // Fetch revenue data for charts
      await fetchRevenueData(theaterId);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const getRevenueData = () => (selectedPeriod === 'daily' ? dailyRevenueData : monthlyRevenueData);
  const currentData = getRevenueData();
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTickets = currentData.reduce((sum, item) => sum + item.tickets, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 mb-2">{error}</p>
          <button
            onClick={() => loadAllData()}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with your events today.</p>
        </div>
      </motion.div>

      {/* Primary Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Tickets Sold Today" value={stats.ticketsToday} icon={Ticket} color="from-blue-500 to-cyan-600" link="/manager/detail" />
        <StatCard title="Active Events" value={stats.activeShows} icon={Film} color="from-orange-500 to-red-600" link="/manager/createview" />
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={TrendingUp} color="from-green-500 to-emerald-600" link="/manager/Report" />
        <StatCard title="Occupancy Rate" value={`${stats.occupancyRate}%`} icon={Activity} color="from-purple-500 to-pink-600" link="/manager/halls" />
      </motion.div>

      {/* Secondary Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/manager/Report" className="block transition-transform hover:scale-[1.02]">
          <MetricCard title="Total Tickets Sold" value={stats.ticketsSold.toLocaleString()} icon={<Ticket className="h-5 w-5 text-white" />} />
        </Link>
        <Link to="/manager/halls" className="block transition-transform hover:scale-[1.02]">
          <MetricCard title="Active Halls" value={`${stats.activeHalls}/${stats.totalHalls}`} icon={<Building className="h-5 w-5 text-white" />} />
        </Link>
        <MetricCard title="Total Customers" value={stats.totalCustomers.toLocaleString()} icon={<Users className="h-5 w-5 text-white" />} />
      </motion.div>

      {/* Hall Occupancy */}
      <motion.div variants={itemVariants}>
        <Card title="Hall Occupancy" subtitle="Current occupancy rates across all halls" showMoreLink="/manager/halls" showMoreText="Manage Halls">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutChart data={hallOccupancyData.map(h => ({ name: h.name, value: h.occupancy, color: h.color }))} height={280} showLabels />
            <div className="space-y-3">
              {hallOccupancyData.map((hall, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{hall.name}</span>
                    <span className="text-gray-500">{hall.occupancy}% filled</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${hall.occupancy}%`, backgroundColor: hall.color }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Capacity: {hall.capacity} seats</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Revenue & Tickets AreaChart */}
      <motion.div variants={itemVariants}>
        <Card
          title="Revenue & Tickets Overview"
          subtitle={`${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} performance - Total: ${formatCurrency(totalRevenue)} | Tickets: ${totalTickets.toLocaleString()}`}
          headerAction={
            <div className="flex gap-2 flex-wrap">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['Daily', 'Monthly'].map(period => (
                  <button key={period} onClick={() => setSelectedPeriod(period.toLowerCase() as any)} className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${selectedPeriod === period.toLowerCase() ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
                    {period}
                  </button>
                ))}
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button onClick={() => setSelectedRevenueType('revenue')} className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${selectedRevenueType === 'revenue' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Revenue</button>
                <button onClick={() => setSelectedRevenueType('tickets')} className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${selectedRevenueType === 'tickets' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Tickets</button>
              </div>
            </div>
          }
        >
          <AreaChart
            data={currentData}
            areas={[{ dataKey: selectedRevenueType === 'revenue' ? 'revenue' : 'tickets', name: selectedRevenueType === 'revenue' ? 'Revenue' : 'Tickets', color: '#14b8a6', gradient: true }]}
            xAxisKey="period"
            yAxisLabel={selectedRevenueType === 'revenue' ? 'Revenue (ETB)' : 'Tickets Sold'}
            height={350}
            showGrid
            showLegend
          />
        </Card>
      </motion.div>

      {/* Weekly Booking Trends - BarChart */}
      <motion.div variants={itemVariants}>
        <Card title="Weekly Booking Trends" subtitle="Daily booking patterns and revenue" showMoreLink="/manager/analytics" showMoreText="View Analytics">
          <BarChart
            data={weeklyBookingData}
            bars={[
              { dataKey: 'tickets', name: 'Tickets Sold', color: '#14b8a6' },
              { dataKey: 'revenue', name: 'Revenue (ETB)', color: '#f59e0b' }
            ]}
            xAxisKey="period"
            height={350}
            showGrid
            showLegend
          />
        </Card>
      </motion.div>

      {/* Seat Distribution */}
      <motion.div variants={itemVariants}>
        <Card title="Seat Distribution" subtitle="Distribution of seats across categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutChart data={seatDistributionData} height={280} showLabels />
            <div className="space-y-3">
              {seatDistributionData.map((seat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seat.color }} />
                    <span className="text-sm font-medium text-gray-700">{seat.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{seat.value.toLocaleString()} seats</p>
                    <p className="text-xs text-gray-500">{((seat.value / seatDistributionData.reduce((sum, s) => sum + s.value, 0)) * 100).toFixed(1)}% of total</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-teal-700">Total Seats</span>
                  <span className="text-lg font-bold text-teal-800">{seatDistributionData.reduce((sum, s) => sum + s.value, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Shows Table */}
      <motion.div variants={itemVariants}>
        <Card title="Current Shows Performance" subtitle="Real-time performance metrics for active shows" showMoreLink="/manager/shows" showMoreText="View All Shows">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Show Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Hall</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sales</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {showsData.map(show => (
                  <tr key={show.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{show.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{show.hall}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{show.date} at {show.time}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{show.sales}/{show.capacity}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${(show.sales / show.capacity) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-emerald-600">{formatCurrency(show.revenue)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/manager/shows/${show.id}`} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Link>
                        <Link to={`/manager/shows/edit/${show.id}`} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition">
                          <Edit className="h-4 w-4 text-teal-600" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {showsData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No shows found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants}>
        <Card title="Recent Bookings & Transactions" subtitle="Latest customer activities and ticket purchases" showMoreLink="/manager/bookings" showMoreText="View All Bookings">
          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <motion.div key={tx.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.status === 'completed' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <RotateCcw className="h-5 w-5 text-red-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.customer}</p>
                    <p className="text-xs text-gray-500">{tx.id} • {tx.tickets} ticket{tx.tickets !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(tx.amount)}</p>
                  <p className="text-xs text-gray-400">{tx.time}</p>
                </div>
              </motion.div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No recent transactions found
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Upcoming Schedule */}
      <motion.div variants={itemVariants}>
        <Card title="Upcoming Schedule" subtitle={`${stats.upcomingShows} shows scheduled in the next 30 days`} showMoreLink="/manager/schedule" showMoreText="View Full Schedule">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {showsData.filter(s => s.status === 'upcoming' || s.status === 'selling').slice(0, 3).map(show => (
              <div key={show.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-teal-100"><Calendar className="h-5 w-5 text-teal-600" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{show.name}</p>
                  <p className="text-xs text-gray-500">{show.date} at {show.time}</p>
                  <p className="text-xs text-teal-600">{show.hall}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{show.sales}/{show.capacity}</p>
                  <p className="text-xs text-gray-500">seats sold</p>
                </div>
              </div>
            ))}
            {showsData.filter(s => s.status === 'upcoming' || s.status === 'selling').length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No upcoming shows scheduled
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ManagerOverview;