// src/pages/Manager/inventory/Reports.tsx
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Ticket, Activity, Award } from 'lucide-react';

// ==================== Types ====================
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

interface RevenueData {
  date: string;
  revenue: number;
  tickets: number;
}

interface ShowPopularity {
  name: string;
  ticketsSold: number;
  revenue: number;
}

interface OccupancyData {
  month: string;
  occupancyRate: number;
}

// ==================== Helper: generate fallback mock data ====================
const generateMockReports = () => {
  // 1. Revenue data (last 7 days)
  const dailyRevenue: RevenueData[] = [
    { date: '2024-07-08', revenue: 2850, tickets: 42 },
    { date: '2024-07-09', revenue: 3120, tickets: 48 },
    { date: '2024-07-10', revenue: 2780, tickets: 41 },
    { date: '2024-07-11', revenue: 4100, tickets: 62 },
    { date: '2024-07-12', revenue: 5670, tickets: 85 },
    { date: '2024-07-13', revenue: 7230, tickets: 108 },
    { date: '2024-07-14', revenue: 4890, tickets: 73 },
  ];
  const monthlyRevenue: RevenueData[] = [
    { date: 'Feb 2024', revenue: 45800, tickets: 720 },
    { date: 'Mar 2024', revenue: 52300, tickets: 815 },
    { date: 'Apr 2024', revenue: 49800, tickets: 762 },
    { date: 'May 2024', revenue: 61200, tickets: 945 },
    { date: 'Jun 2024', revenue: 68700, tickets: 1050 },
    { date: 'Jul 2024', revenue: 73400, tickets: 1120 },
  ];

  // 2. Popular shows
  const popularShows: ShowPopularity[] = [
    { name: 'Summer Music Festival', ticketsSold: 1245, revenue: 186750 },
    { name: 'Comedy Night', ticketsSold: 892, revenue: 66900 },
    { name: 'Movie Premiere: The Epic', ticketsSold: 756, revenue: 90720 },
    { name: 'Traditional Theater Play', ticketsSold: 678, revenue: 61020 },
    { name: 'Rock Concert', ticketsSold: 634, revenue: 126800 },
  ];

  // 3. Occupancy over months
  const occupancyData: OccupancyData[] = [
    { month: 'Feb', occupancyRate: 68 },
    { month: 'Mar', occupancyRate: 72 },
    { month: 'Apr', occupancyRate: 70 },
    { month: 'May', occupancyRate: 78 },
    { month: 'Jun', occupancyRate: 82 },
    { month: 'Jul', occupancyRate: 86 },
  ];

  // 4. Summary
  const totalRevenue = popularShows.reduce((s, show) => s + show.revenue, 0);
  const totalTickets = popularShows.reduce((s, show) => s + show.ticketsSold, 0);
  const avgOccupancy = Math.round(occupancyData.reduce((s, o) => s + o.occupancyRate, 0) / occupancyData.length);
  const bestShow = popularShows[0].name;
  const bestDay = 'Saturday';
  const revenueGrowth = 15.2;
  const avgTicketPrice = totalRevenue / totalTickets;

  return {
    revenueData: { daily: dailyRevenue, monthly: monthlyRevenue },
    popularShows,
    occupancyData,
    summary: { totalRevenue, totalTickets, avgOccupancy, bestShow, bestDay, revenueGrowth, avgTicketPrice }
  };
};

// ==================== Main Component ====================
const Reports: React.FC = () => {
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [popularShows, setPopularShows] = useState<ShowPopularity[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTickets: 0,
    avgOccupancy: 0,
    bestShow: '',
    bestDay: '',
    revenueGrowth: 0,
    avgTicketPrice: 0,
  });

  // Helper: format date to YYYY-MM-DD
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
  };

  // Helper: get month name from date
  const getMonthName = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('default', { month: 'short' });
  };

  // Helper: get day name
  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('default', { weekday: 'long' });
  };

  // Load events and compute statistics (with fallback)
  useEffect(() => {
    const savedEvents = localStorage.getItem('theater_events');
    let events: EventData[] = savedEvents ? JSON.parse(savedEvents) : [];

    // If no events or too few, use fallback mock data
    if (events.length === 0) {
      const mock = generateMockReports();
      setRevenueData(view === 'daily' ? mock.revenueData.daily : mock.revenueData.monthly);
      setPopularShows(mock.popularShows);
      setOccupancyData(mock.occupancyData);
      setSummary(mock.summary);
      return;
    }

    // Only consider active events (excluding cancelled, and with revenue > 0 for meaningful stats)
    const activeEvents = events.filter(e => e.status !== 'cancelled' && e.totalRevenue > 0);
    if (activeEvents.length === 0) {
      const mock = generateMockReports();
      setRevenueData(view === 'daily' ? mock.revenueData.daily : mock.revenueData.monthly);
      setPopularShows(mock.popularShows);
      setOccupancyData(mock.occupancyData);
      setSummary(mock.summary);
      return;
    }

    // ----- 1. Revenue & Tickets aggregation (daily or monthly) -----
    const revenueMap = new Map<string, { revenue: number; tickets: number }>();
    activeEvents.forEach(event => {
      if (!event.timeSlots.length) return;
      const firstSlot = event.timeSlots[0];
      const eventDate = firstSlot.date;
      const key = view === 'daily' ? eventDate : getMonthName(eventDate) + ' ' + new Date(eventDate).getFullYear();
      const current = revenueMap.get(key) || { revenue: 0, tickets: 0 };
      current.revenue += event.totalRevenue;
      current.tickets += event.totalBookedSeats;
      revenueMap.set(key, current);
    });
    let revenueArray: RevenueData[] = Array.from(revenueMap.entries()).map(([date, val]) => ({
      date,
      revenue: val.revenue,
      tickets: val.tickets,
    }));
    if (view === 'daily') {
      revenueArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      revenueArray.sort((a, b) => {
        const aMonth = a.date.split(' ')[0];
        const bMonth = b.date.split(' ')[0];
        return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth);
      });
    }
    setRevenueData(revenueArray);

    // ----- 2. Popular shows (top 5 by tickets) -----
    const shows = activeEvents.map(e => ({
      name: e.name,
      ticketsSold: e.totalBookedSeats,
      revenue: e.totalRevenue,
    })).sort((a, b) => b.ticketsSold - a.ticketsSold).slice(0, 5);
    setPopularShows(shows);

    // ----- 3. Occupancy rate per month -----
    const occupancyMap = new Map<string, { totalCap: number; totalBooked: number }>();
    events.forEach(event => {
      if (!event.timeSlots.length) return;
      const firstSlot = event.timeSlots[0];
      const month = getMonthName(firstSlot.date);
      const totalCapacity = event.seatCategories.reduce((sum, cat) => sum + cat.capacity, 0);
      const totalBooked = event.totalBookedSeats;
      const current = occupancyMap.get(month) || { totalCap: 0, totalBooked: 0 };
      current.totalCap += totalCapacity;
      current.totalBooked += totalBooked;
      occupancyMap.set(month, current);
    });
    let occupancyArray: OccupancyData[] = Array.from(occupancyMap.entries()).map(([month, data]) => ({
      month,
      occupancyRate: data.totalCap > 0 ? Math.round((data.totalBooked / data.totalCap) * 100) : 0,
    }));
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    occupancyArray.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    setOccupancyData(occupancyArray);

    // ----- 4. Summary statistics -----
    const totalRevenue = activeEvents.reduce((sum, e) => sum + e.totalRevenue, 0);
    const totalTickets = activeEvents.reduce((sum, e) => sum + e.totalBookedSeats, 0);
    const avgOccupancy = occupancyArray.length
      ? Math.round(occupancyArray.reduce((sum, o) => sum + o.occupancyRate, 0) / occupancyArray.length)
      : 0;
    const bestShow = shows.length ? shows[0].name : 'N/A';
    const avgTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;

    // Best day of week (based on event time slots)
    const daySales = new Map<string, { tickets: number; revenue: number }>();
    events.forEach(event => {
      event.timeSlots.forEach(slot => {
        const day = getDayName(slot.date);
        const current = daySales.get(day) || { tickets: 0, revenue: 0 };
        current.tickets += event.totalBookedSeats;
        current.revenue += event.totalRevenue;
        daySales.set(day, current);
      });
    });
    let bestDay = 'Monday';
    let maxTickets = 0;
    daySales.forEach((val, day) => {
      if (val.tickets > maxTickets) {
        maxTickets = val.tickets;
        bestDay = day;
      }
    });

    // Revenue growth (compare last two months if possible)
    let revenueGrowth = 0;
    if (revenueArray.length >= 2) {
      const lastMonth = revenueArray[revenueArray.length - 1];
      const prevMonth = revenueArray[revenueArray.length - 2];
      if (prevMonth.revenue > 0) {
        revenueGrowth = ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100;
      }
    }

    setSummary({
      totalRevenue,
      totalTickets,
      avgOccupancy,
      bestShow,
      bestDay,
      revenueGrowth,
      avgTicketPrice,
    });
  }, [view]);

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatNumber = (value: number) => value.toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-2">Real‑time insights from your event data</p>
      </div>

      {/* Summary Cards - FinancialReports style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Revenue (active events)</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Total Tickets Sold */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Tickets Sold</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(summary.totalTickets)}</p>
            </div>
          </div>
        </div>

        {/* Average Occupancy Rate */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Average Occupancy Rate</p>
              <p className="text-xl font-bold text-gray-900">{summary.avgOccupancy}%</p>
            </div>
          </div>
        </div>

        {/* Best Selling Show */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Best Selling Show</p>
              <p className="text-xl font-bold text-gray-900 truncate max-w-[200px]">{summary.bestShow}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Revenue Overview</h2>
            <p className="text-gray-500 text-sm">Based on actual event bookings</p>
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setView('daily')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                view === 'daily' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setView('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                view === 'monthly' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" tickFormatter={formatCurrency} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip formatter={(value: number, name: string) => name === 'revenue' ? formatCurrency(value) : value} />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar yAxisId="right" dataKey="tickets" name="Tickets Sold" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">No revenue data available</div>
        )}
      </div>

      {/* Popular Shows & Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔥 Popular Shows</h2>
          <p className="text-gray-500 text-sm mb-6">Tickets sold per show (top 5)</p>
          {popularShows.length > 0 ? (
            <div className="space-y-4">
              {popularShows.map((show, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{show.name}</span>
                    <span className="text-gray-600">{formatNumber(show.ticketsSold)} tickets</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(show.ticketsSold / popularShows[0].ticketsSold) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Revenue: {formatCurrency(show.revenue)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No show data available</div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Seat Occupancy Rate</h2>
          <p className="text-gray-500 text-sm mb-6">Monthly trend (based on total capacity vs booked)</p>
          {occupancyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Line type="monotone" dataKey="occupancyRate" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">No occupancy data available</div>
          )}
          {occupancyData.length >= 2 && (
            <div className="mt-4 bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-2">
                {occupancyData[occupancyData.length-1].occupancyRate > occupancyData[occupancyData.length-2].occupancyRate ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold text-orange-800">
                  Occupancy trend: {occupancyData[occupancyData.length-1].occupancyRate - occupancyData[occupancyData.length-2].occupancyRate > 0 ? '+' : ''}
                  {occupancyData[occupancyData.length-1].occupancyRate - occupancyData[occupancyData.length-2].occupancyRate}% 
                  from previous month
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Insights - already white cards, keep as is */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Best Day</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">{summary.bestDay}</p>
          <p className="text-sm text-gray-500 mt-1">Highest ticket sales volume</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            {summary.revenueGrowth >= 0 ? <TrendingUp className="h-6 w-6 text-green-600" /> : <TrendingDown className="h-6 w-6 text-red-600" />}
            <h3 className="font-semibold text-gray-800">Revenue Growth</h3>
          </div>
          <p className={`text-2xl font-bold ${summary.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.revenueGrowth >= 0 ? '+' : ''}{summary.revenueGrowth.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">Compared to previous period</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <Ticket className="h-6 w-6 text-purple-600" />
            <h3 className="font-semibold text-gray-800">Average Ticket Price</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary.avgTicketPrice)}</p>
          <p className="text-sm text-gray-500 mt-1">Across all sold tickets</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;