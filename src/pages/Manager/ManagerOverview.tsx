// src/pages/Manager/components/ManagerOverview.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Building, DollarSign, Calendar, Ticket, Star,
  Package, TrendingUp, ArrowRight, Eye, Edit, Film
} from 'lucide-react';
import {
  AreaChart, Area, PieChart as RePieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, BarChart, Bar
} from 'recharts';
import { Link } from 'react-router-dom';
import ReusableshowFilterforall from '../../components/Reusable/ReusableshowFilterforall';

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

// Month names for dropdown
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper: format currency
const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

const ManagerOverview: React.FC = () => {
  // ==================== Filter State ====================
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
  const [selectedSalesperson] = useState<string>('all'); // not used, but required by component

  // ==================== Data State ====================
  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load events from localStorage
  useEffect(() => {
    const loadEvents = () => {
      try {
        const stored = localStorage.getItem('theater_events');
        if (stored) {
          setAllEvents(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Filter events based on date and status
  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    // Apply status filter
    if (selectedStatus !== 'all') {
      events = events.filter(e => e.status === selectedStatus);
    }

    // Apply date filter (based on first time slot's date)
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

  // ==================== Derived Statistics ====================
  // Total tickets, revenue, occupancy, customers, etc.
  const stats = useMemo(() => {
    const totalTicketsSold = filteredEvents.reduce((sum, e) => sum + e.totalBookedSeats, 0);
    const totalRevenue = filteredEvents.reduce((sum, e) => sum + e.totalRevenue, 0);
    // Average occupancy: average of (totalBooked / totalCapacity) per event
    let occupancySum = 0;
    let eventsWithCapacity = 0;
    filteredEvents.forEach(event => {
      const totalCapacity = event.seatCategories.reduce((sum, cat) => sum + cat.capacity, 0);
      if (totalCapacity > 0) {
        occupancySum += (event.totalBookedSeats / totalCapacity) * 100;
        eventsWithCapacity++;
      }
    });
    const averageOccupancy = eventsWithCapacity > 0 ? Math.round(occupancySum / eventsWithCapacity) : 0;
    // Count unique customers (if available; fallback to total tickets * 0.6)
    const totalCustomers = Math.round(totalTicketsSold * 0.6); // approximation
    // Active halls (distinct halls with at least one event)
    const activeHalls = new Set(filteredEvents.map(e => e.hall)).size;
    const totalHalls = 6; // assuming 6 halls total
    const upcomingShows = filteredEvents.filter(e => e.status === 'upcoming').length;
    const activePromotions = 3; // placeholder (could be from promotions storage)
    const customerSatisfaction = 4.6; // placeholder (could be from reviews)

    return {
      totalTicketsSold,
      totalRevenue,
      averageOccupancy,
      customerSatisfaction,
      activeHalls,
      totalHalls,
      upcomingShows,
      totalCustomers,
      activePromotions
    };
  }, [filteredEvents]);

  // Revenue data for area chart (monthly aggregated)
  const revenueData = useMemo(() => {
    const map = new Map<string, { revenue: number; tickets: number; occupancySum: number; count: number }>();
    filteredEvents.forEach(event => {
      if (!event.timeSlots.length) return;
      const eventDate = new Date(event.timeSlots[0].date);
      const month = eventDate.toLocaleString('default', { month: 'short' });
      const totalCapacity = event.seatCategories.reduce((sum, cat) => sum + cat.capacity, 0);
      const occupancy = totalCapacity > 0 ? (event.totalBookedSeats / totalCapacity) * 100 : 0;
      const curr = map.get(month) || { revenue: 0, tickets: 0, occupancySum: 0, count: 0 };
      curr.revenue += event.totalRevenue;
      curr.tickets += event.totalBookedSeats;
      curr.occupancySum += occupancy;
      curr.count++;
      map.set(month, curr);
    });
    // Convert to array and sort by month order
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from(map.entries())
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        tickets: data.tickets,
        occupancy: data.count > 0 ? Math.round(data.occupancySum / data.count) : 0
      }))
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
  }, [filteredEvents]);

  // Seat distribution: sum seat categories from all events (capacity vs booked)
  const seatDistribution = useMemo(() => {
    const categories = new Map<string, { value: number; revenue: number; color: string }>();
    filteredEvents.forEach(event => {
      event.seatCategories.forEach(cat => {
        const name = cat.name;
        const booked = cat.booked || 0;
        const revenue = booked * cat.price;
        const curr = categories.get(name) || { value: 0, revenue: 0, color: '#0D9488' };
        curr.value += booked;
        curr.revenue += revenue;
        // assign colors based on name
        if (name === 'Standard') curr.color = '#0D9488';
        else if (name === 'Premium') curr.color = '#3B82F6';
        else if (name === 'VIP') curr.color = '#8B5CF6';
        else if (name === 'Wheelchair') curr.color = '#10B981';
        else curr.color = '#F59E0B';
        categories.set(name, curr);
      });
    });
    return Array.from(categories.entries()).map(([name, data]) => ({
      name,
      value: data.value,
      revenue: data.revenue,
      color: data.color
    }));
  }, [filteredEvents]);

  // Weekly booking trends: aggregate by day of week from timeSlots
  const bookingTrends = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map = new Map<string, { bookings: number; revenue: number }>();
    days.forEach(day => map.set(day, { bookings: 0, revenue: 0 }));
    filteredEvents.forEach(event => {
      event.timeSlots.forEach(slot => {
        const date = new Date(slot.date);
        const dayName = date.toLocaleString('default', { weekday: 'short' }); // e.g., 'Mon'
        const curr = map.get(dayName) || { bookings: 0, revenue: 0 };
        curr.bookings += event.totalBookedSeats;
        curr.revenue += event.totalRevenue;
        map.set(dayName, curr);
      });
    });
    // Return in order Sun..Sat
    return days.map(day => ({
      date: day,
      bookings: map.get(day)?.bookings || 0,
      revenue: map.get(day)?.revenue || 0
    }));
  }, [filteredEvents]);

  // Top performing shows (by tickets sold)
  const topShows = useMemo(() => {
    return filteredEvents
      .map(e => ({
        name: e.name,
        tickets: e.totalBookedSeats,
        revenue: e.totalRevenue,
        rating: 4.5 // placeholder, could be from review system
      }))
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 5);
  }, [filteredEvents]);

  // Recent activities: we can generate from recent events or use mock
  const recentActivities = useMemo(() => {
    // Generate from events sorted by createdAt
    const activities = filteredEvents
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(event => ({
        id: event.id,
        action: event.status === 'upcoming' ? 'New show scheduled' : 'Show updated',
        user: event.name,
        time: new Date(event.createdAt).toLocaleString(),
        icon: Film,
        status: 'success' as const
      }));
    if (activities.length === 0) {
      // fallback mock activities
      return [
        { id: 1, action: 'New show scheduled', user: 'Movie Premiere', time: '10 min ago', icon: Film, status: 'success' },
        { id: 2, action: 'Ticket booking completed', user: 'John Doe', time: '25 min ago', icon: Ticket, status: 'success' },
        { id: 3, action: 'Hall maintenance scheduled', user: 'Hall C', time: '1 hour ago', icon: Building, status: 'warning' },
      ];
    }
    return activities;
  }, [filteredEvents]);

  // Available years for dropdown
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    allEvents.forEach(event => {
      if (event.timeSlots.length) {
        const year = new Date(event.timeSlots[0].date).getFullYear().toString();
        years.add(year);
      }
    });
    return ['all', ...Array.from(years).sort((a,b) => parseInt(b) - parseInt(a))];
  }, [allEvents]);

  // Status options for filter
  const statusOptions = ['all', 'upcoming', 'ongoing', 'completed', 'cancelled'];

  // Filter values object for reusable component
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

  // Card definitions for top row
  const dashboardCards = useMemo(() => [
    { title: 'Tickets Sold', value: stats.totalTicketsSold.toLocaleString(), icon: Ticket, color: 'from-blue-500 to-cyan-600', delay: 0.1, link: '/manager/tickets', notification: false },
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'from-teal-500 to-teal-600', delay: 0.15, link: '/manager/revenue', notification: false },
  ], [stats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-8 p-6"
    >
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {dashboardCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <Link to={card.link} className="block">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">{card.title}</p>
                  <p className="text-xl font-bold text-gray-900">{card.value}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500">Active Halls</p>
          <p className="text-2xl font-bold text-gray-900">{stats.activeHalls}/{stats.totalHalls}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500">Available Events</p>
          <p className="text-2xl font-bold text-purple-600">{stats.activePromotions}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500">Avg Occupancy</p>
          <p className="text-2xl font-bold text-gray-900">{stats.averageOccupancy}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Tickets AreaChart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue & Tickets Overview</h3>
              <p className="text-sm text-gray-500">Monthly performance metrics</p>
            </div>
            <Link to="/manager/reports" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
              View Reports <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis yAxisId="left" stroke="#6B7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toLocaleString() : value} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={2} fill="url(#revenueGradient)" name="Revenue ($)" />
                <Area yAxisId="right" type="monotone" dataKey="tickets" stroke="#3B82F6" strokeWidth={2} fill="url(#ticketsGradient)" name="Tickets Sold" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">No data for selected filters</div>
          )}
        </div>

        {/* Seat Distribution PieChart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seat Distribution</h3>
          {seatDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={seatDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {seatDistribution.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {seatDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-sm font-semibold text-gray-900">{item.value} seats</span>
                      <span className="text-sm text-green-600">{formatCurrency(item.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">No seat data</div>
          )}
        </div>
      </div>

      {/* Weekly Booking Trends */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Weekly Booking Trends</h3>
            <p className="text-sm text-gray-500">Daily bookings and revenue</p>
          </div>
          <Link to="/manager/analytics" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
            View Analytics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {bookingTrends.some(day => day.bookings > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis yAxisId="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toLocaleString() : value} />
              <Bar yAxisId="left" dataKey="bookings" fill="#0D9488" name="Bookings" />
              <Bar yAxisId="right" dataKey="revenue" fill="#F59E0B" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">No booking data for selected filters</div>
        )}
      </div>

      {/* Top Performing Shows */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Shows</h3>
          <Link to="/manager/shows" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {topShows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Show Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tickets Sold</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topShows.map((show, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{show.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{show.tickets.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(show.revenue)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-900">{show.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No shows match the selected filters</div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Link to="/manager/activity" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <activity.icon className={`h-5 w-5 ${
                      activity.status === 'success' ? 'text-green-600' :
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
        </div>
      </div>
    </motion.div>
  );
};

export default ManagerOverview;