// src/pages/Manager/inventory/Reports.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Ticket, Activity, Award, Users, Building, CheckCircle, Film } from 'lucide-react';

// Only these imports (four chart components + the reusable filter)
import { AreaChart } from '../../../components/Overview/AreaChart';
import { BarChart } from '../../../components/Overview/BarChart';
import { Card, StatCard, MetricCard } from '../../../components/Overview/Card';
import { DonutChart } from '../../../components/Overview/PieChart';
import ReusableshowFilterforall from '../../../components/Reusable/ReusableshowFilterforall';

// ==================== Types (matching theater_events) ====================
interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface SeatCategory {
  id: string;
  name: string;
  price: number;
  capacity: number;
  booked?: number;
  commissionPercent: number;
}

interface EventData {
  id: string;
  name: string;
  description: string;
  timeSlots: TimeSlot[];
  hall: string;
  seatCategories: SeatCategory[];
  category: string;
  ageRestriction: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  organizer: string;
  imageUrl?: string;
  createdAt: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  totalBookedSeats: number;
  totalRevenue: number;
  totalManagerEarnings: number;
  contractDate?: string;
  contractReference?: string;
}

// Derived chart data types
interface RevenueDataPoint {
  period: string;
  revenue: number;
  tickets: number;
}

interface ShowPopularity {
  name: string;
  ticketsSold: number;
  revenue: number;
}

interface HallOccupancy {
  name: string;
  occupancy: number;
  capacity: number;
  color: string;
}

interface SeatDistribution {
  name: string;
  value: number;
  color: string;
}

// Helper functions
const formatCurrency = (value: number) => {
  if (value >= 1000000) return `ETB ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `ETB ${(value / 1000).toFixed(0)}K`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const getMonthShort = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString('default', { month: 'short' });
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Mock data (fallback when no events or empty)
const generateMockData = () => {
  const dailyRevenue: RevenueDataPoint[] = [
    { period: '2024-07-08', revenue: 2850, tickets: 42 },
    { period: '2024-07-09', revenue: 3120, tickets: 48 },
    { period: '2024-07-10', revenue: 2780, tickets: 41 },
    { period: '2024-07-11', revenue: 4100, tickets: 62 },
    { period: '2024-07-12', revenue: 5670, tickets: 85 },
    { period: '2024-07-13', revenue: 7230, tickets: 108 },
    { period: '2024-07-14', revenue: 4890, tickets: 73 },
  ];
  const monthlyRevenue: RevenueDataPoint[] = [
    { period: 'Feb 2024', revenue: 45800, tickets: 720 },
    { period: 'Mar 2024', revenue: 52300, tickets: 815 },
    { period: 'Apr 2024', revenue: 49800, tickets: 762 },
    { period: 'May 2024', revenue: 61200, tickets: 945 },
    { period: 'Jun 2024', revenue: 68700, tickets: 1050 },
    { period: 'Jul 2024', revenue: 73400, tickets: 1120 },
  ];
  const popularShows: ShowPopularity[] = [
    { name: 'Summer Music Festival', ticketsSold: 1245, revenue: 186750 },
    { name: 'Comedy Night', ticketsSold: 892, revenue: 66900 },
    { name: 'Movie Premiere: The Epic', ticketsSold: 756, revenue: 90720 },
    { name: 'Traditional Theater Play', ticketsSold: 678, revenue: 61020 },
    { name: 'Rock Concert', ticketsSold: 634, revenue: 126800 },
  ];
  const hallOccupancy: HallOccupancy[] = [
    { name: 'Grand Hall', occupancy: 85, capacity: 300, color: '#14b8a6' },
    { name: 'West End Theater', occupancy: 72, capacity: 250, color: '#f59e0b' },
    { name: 'Disney Theater', occupancy: 68, capacity: 280, color: '#3b82f6' },
    { name: 'Emerald Theatre', occupancy: 45, capacity: 200, color: '#ef4444' },
    { name: 'Opera House', occupancy: 78, capacity: 350, color: '#8b5cf6' },
    { name: 'Broadway Hall', occupancy: 55, capacity: 220, color: '#06b6d4' },
  ];
  const seatDistribution: SeatDistribution[] = [
    { name: 'Standard', value: 4850, color: '#14b8a6' },
    { name: 'Premium', value: 2850, color: '#f59e0b' },
    { name: 'VIP', value: 1250, color: '#8b5cf6' },
    { name: 'Wheelchair', value: 380, color: '#3b82f6' },
  ];
  const totalRevenue = popularShows.reduce((s, show) => s + show.revenue, 0);
  const totalTickets = popularShows.reduce((s, show) => s + show.ticketsSold, 0);
  const avgOccupancy = Math.round(hallOccupancy.reduce((s, h) => s + h.occupancy, 0) / hallOccupancy.length);
  return { dailyRevenue, monthlyRevenue, popularShows, hallOccupancy, seatDistribution, totalRevenue, totalTickets, avgOccupancy };
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
};

const Reports: React.FC = () => {
  // Chart view state
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly'>('monthly');
  const [selectedRevenueType, setSelectedRevenueType] = useState<'revenue' | 'tickets'>('revenue');

  // Filter state (for ReusableshowFilterforall)
  const [useDateRange, setUseDateRange] = useState(false);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSalesperson] = useState<string>('all'); // not used

  // Data state
  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  // Derived filtered events (based on filter criteria)
  const filteredEvents = useMemo(() => {
    let events = [...allEvents];
    if (selectedStatus !== 'all') {
      events = events.filter(e => e.status === selectedStatus);
    }
    events = events.filter(event => {
      if (!event.timeSlots.length) return false;
      const eventDateStr = event.timeSlots[0].date;
      const eventDate = new Date(eventDateStr);
      if (useDateRange) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);
        return eventDate >= start && eventDate <= end;
      } else {
        const year = eventDate.getFullYear().toString();
        const month = MONTHS[eventDate.getMonth()];
        const day = eventDate.getDate().toString();
        if (selectedYear !== 'all' && year !== selectedYear) return false;
        if (selectedMonth !== 'all' && month !== selectedMonth) return false;
        if (selectedDay !== 'all' && day !== selectedDay) return false;
        return true;
      }
    });
    return events;
  }, [allEvents, useDateRange, startDate, endDate, selectedYear, selectedMonth, selectedDay, selectedStatus]);

  // Chart data states
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [popularShows, setPopularShows] = useState<ShowPopularity[]>([]);
  const [hallOccupancy, setHallOccupancy] = useState<HallOccupancy[]>([]);
  const [seatDistribution, setSeatDistribution] = useState<SeatDistribution[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTickets: 0,
    avgOccupancy: 0,
    activeShows: 0,
    completedShows: 0,
    totalHalls: 0,
  });

  // Load events from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem('theater_events');
    if (stored) {
      try {
        setAllEvents(JSON.parse(stored));
      } catch (e) {
        console.error(e);
        setAllEvents([]);
      }
    } else {
      setAllEvents([]);
    }
    setLoading(false);
  }, []);

  // Recompute chart data whenever filteredEvents or period changes
  useEffect(() => {
    if (loading) return;

    const activeEvents = filteredEvents.filter(e => e.status !== 'cancelled' && e.totalRevenue > 0);
    if (activeEvents.length === 0) {
      // Fallback to mock data
      const mock = generateMockData();
      setRevenueData(selectedPeriod === 'daily' ? mock.dailyRevenue : mock.monthlyRevenue);
      setPopularShows(mock.popularShows);
      setHallOccupancy(mock.hallOccupancy);
      setSeatDistribution(mock.seatDistribution);
      setSummary({
        totalRevenue: mock.totalRevenue,
        totalTickets: mock.totalTickets,
        avgOccupancy: mock.avgOccupancy,
        activeShows: mock.popularShows.length,
        completedShows: 12,
        totalHalls: mock.hallOccupancy.length,
      });
      return;
    }

    // 1. Revenue & Tickets (daily or monthly)
    const revenueMap = new Map<string, { revenue: number; tickets: number }>();
    activeEvents.forEach(event => {
      if (!event.timeSlots.length) return;
      const dateStr = event.timeSlots[0].date;
      let key: string;
      if (selectedPeriod === 'daily') {
        key = dateStr;
      } else {
        const d = new Date(dateStr);
        key = `${getMonthShort(dateStr)} ${d.getFullYear()}`;
      }
      const cur = revenueMap.get(key) || { revenue: 0, tickets: 0 };
      cur.revenue += event.totalRevenue;
      cur.tickets += event.totalBookedSeats;
      revenueMap.set(key, cur);
    });
    let revArray: RevenueDataPoint[] = Array.from(revenueMap.entries()).map(([period, val]) => ({
      period,
      revenue: val.revenue,
      tickets: val.tickets,
    }));
    if (selectedPeriod === 'daily') {
      revArray.sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
    } else {
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      revArray.sort((a, b) => {
        const aMonth = a.period.split(' ')[0];
        const bMonth = b.period.split(' ')[0];
        return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth);
      });
    }
    setRevenueData(revArray);

    // 2. Popular shows (top 5 by tickets)
    const shows = activeEvents
      .map(e => ({ name: e.name, ticketsSold: e.totalBookedSeats, revenue: e.totalRevenue }))
      .sort((a, b) => b.ticketsSold - a.ticketsSold)
      .slice(0, 5);
    setPopularShows(shows);

    // 3. Hall occupancy
    const hallMap = new Map<string, { totalCap: number; totalBooked: number }>();
    activeEvents.forEach(event => {
      if (!event.hall) return;
      const totalCap = event.seatCategories.reduce((sum, cat) => sum + cat.capacity, 0);
      const totalBooked = event.totalBookedSeats;
      const cur = hallMap.get(event.hall) || { totalCap: 0, totalBooked: 0 };
      cur.totalCap += totalCap;
      cur.totalBooked += totalBooked;
      hallMap.set(event.hall, cur);
    });
    const hallColors = ['#14b8a6', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4'];
    let hallArray: HallOccupancy[] = Array.from(hallMap.entries()).map(([name, data], idx) => ({
      name,
      occupancy: data.totalCap > 0 ? Math.round((data.totalBooked / data.totalCap) * 100) : 0,
      capacity: data.totalCap,
      color: hallColors[idx % hallColors.length],
    }));
    if (hallArray.length === 0) {
      hallArray = generateMockData().hallOccupancy;
    }
    setHallOccupancy(hallArray);

    // 4. Seat distribution
    const seatMap = new Map<string, number>();
    activeEvents.forEach(event => {
      event.seatCategories.forEach(cat => {
        const current = seatMap.get(cat.name) || 0;
        seatMap.set(cat.name, current + cat.capacity);
      });
    });
    let seatArray: SeatDistribution[] = Array.from(seatMap.entries()).map(([name, value], idx) => ({
      name,
      value,
      color: hallColors[idx % hallColors.length],
    }));
    if (seatArray.length === 0) {
      seatArray = generateMockData().seatDistribution;
    }
    setSeatDistribution(seatArray);

    // 5. Summary stats
    const totalRevenue = activeEvents.reduce((sum, e) => sum + e.totalRevenue, 0);
    const totalTickets = activeEvents.reduce((sum, e) => sum + e.totalBookedSeats, 0);
    const avgOccupancy = hallArray.length
      ? Math.round(hallArray.reduce((sum, h) => sum + h.occupancy, 0) / hallArray.length)
      : 0;
    const activeShows = activeEvents.filter(e => e.status === 'ongoing').length;
    const completedShows = activeEvents.filter(e => e.status === 'completed').length;
    const totalHalls = new Set(activeEvents.map(e => e.hall)).size;

    setSummary({
      totalRevenue,
      totalTickets,
      avgOccupancy,
      activeShows,
      completedShows,
      totalHalls: totalHalls || hallArray.length,
    });
  }, [filteredEvents, selectedPeriod, loading]);

  // Current revenue data for the chart
  const currentRevenueData = revenueData;
  const totalRevenueSum = currentRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTicketsSum = currentRevenueData.reduce((sum, item) => sum + item.tickets, 0);

  // Data for Donut charts
  const hallDonutData = hallOccupancy.map(h => ({ name: h.name, value: h.occupancy, color: h.color }));
  const seatDonutData = seatDistribution;

  // Filter values for the reusable component
  const filterValues = {
    useDateRange,
    startDate,
    endDate,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedSalesperson,
    selectedStatus,
  };

  // Available years for filter dropdown
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    allEvents.forEach(event => {
      if (event.timeSlots.length) {
        const year = new Date(event.timeSlots[0].date).getFullYear().toString();
        years.add(year);
      }
    });
    return ['all', ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))];
  }, [allEvents]);

  const statusOptions = ['all', 'upcoming', 'ongoing', 'completed', 'cancelled'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Real‑time insights from your event data</p>
        </div>
      </motion.div>

      {/* Reusable Filter Panel */}
      <ReusableshowFilterforall
        filterValues={filterValues}
        onUseDateRangeChange={setUseDateRange}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSelectedYearChange={setSelectedYear}
        onSelectedMonthChange={setSelectedMonth}
        onSelectedDayChange={setSelectedDay}
        onSelectedSalespersonChange={() => {}}
        onSelectedStatusChange={setSelectedStatus}
        salespersonOptions={['all']}
        statusOptions={statusOptions}
        availableYears={availableYears}
        monthsList={MONTHS}
        showSalesperson={false}
        showStatus={true}
        showDateRangeToggle={true}
        showYearMonthDay={true}
      />

      {/* Primary Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Revenue" value={formatCurrency(summary.totalRevenue)} icon={DollarSign} color="from-green-500 to-emerald-600" />
        <StatCard title="Total Tickets Sold" value={summary.totalTickets.toLocaleString()} icon={Ticket} color="from-blue-500 to-cyan-600" />
      

      {/* Secondary Stats */}
        <MetricCard title="Total Halls" value={summary.totalHalls} icon={<Building className="h-5 w-5 text-white" />} />
        <MetricCard title="Best Show" value={popularShows[0]?.name || 'N/A'} icon={<Award className="h-5 w-5 text-white" />} />
</motion.div>
      {/* Revenue & Tickets AreaChart */}
      <motion.div variants={itemVariants}>
        <Card
          title="Revenue & Tickets Overview"
          subtitle={`${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} performance - Total: ${formatCurrency(totalRevenueSum)} | Tickets: ${totalTicketsSum.toLocaleString()}`}
          headerAction={
            <div className="flex gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['Daily', 'Monthly'].map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period.toLowerCase() as any)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedPeriod === period.toLowerCase() ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedRevenueType('revenue')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedRevenueType === 'revenue' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedRevenueType('tickets')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedRevenueType === 'tickets' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tickets
                </button>
              </div>
            </div>
          }
        >
          <AreaChart
            data={currentRevenueData}
            areas={[{
              dataKey: selectedRevenueType === 'revenue' ? 'revenue' : 'tickets',
              name: selectedRevenueType === 'revenue' ? 'Revenue' : 'Tickets',
              color: '#14b8a6',
              gradient: true,
            }]}
            xAxisKey="period"
            yAxisLabel={selectedRevenueType === 'revenue' ? 'Revenue (ETB)' : 'Tickets Sold'}
            height={350}
            showGrid
            showLegend
          />
        </Card>
      </motion.div>

      {/* Hall Occupancy - DonutChart */}
      <motion.div variants={itemVariants}>
        <Card title="Hall Occupancy" subtitle="Current occupancy rates across all halls" showMoreLink="/manager/halls" showMoreText="Manage Halls">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutChart data={hallDonutData} height={280} showLabels />
            <div className="space-y-3">
              {hallOccupancy.map((hall, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{hall.name}</span>
                    <span className="text-gray-500">{hall.occupancy}% occupancy</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${hall.occupancy}%`, backgroundColor: hall.color }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Capacity: {hall.capacity.toLocaleString()} seats</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Popular Shows - BarChart (horizontal) */}
      <motion.div variants={itemVariants}>
        <Card title="🔥 Popular Shows (Top 5)" subtitle="Tickets sold per show">
          <BarChart
            data={popularShows.map(show => ({ name: show.name, tickets: show.ticketsSold }))}
            bars={[{ dataKey: 'tickets', name: 'Tickets Sold', color: '#f59e0b' }]}
            xAxisKey="name"
            layout="vertical"
            yAxisLabel="Show"
            height={350}
            showGrid
            showLegend={false}
            showTooltip
          />
        </Card>
      </motion.div>

      {/* Seat Distribution - DonutChart */}
      <motion.div variants={itemVariants}>
        <Card title="Seat Distribution" subtitle="Distribution of seats across categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutChart data={seatDonutData} height={280} showLabels />
            <div className="space-y-3">
              {seatDistribution.map((seat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seat.color }} />
                    <span className="text-sm font-medium text-gray-700">{seat.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{seat.value.toLocaleString()} seats</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-teal-700">Total Seats</span>
                  <span className="text-lg font-bold text-teal-800">{seatDistribution.reduce((sum, s) => sum + s.value, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Average Ticket Price"
          value={summary.totalTickets ? formatCurrency(summary.totalRevenue / summary.totalTickets) : 'ETB 0'}
          icon={<Ticket className="h-5 w-5 text-white" />}
        />
        <MetricCard
          title="Revenue Growth (Estimate)"
          value="+12.5%"
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          trend={12.5}
        />
        <MetricCard
          title="Events Completed"
          value={summary.completedShows}
          icon={<Calendar className="h-5 w-5 text-white" />}
        />
      </motion.div>
    </motion.div>
  );
};

export default Reports;