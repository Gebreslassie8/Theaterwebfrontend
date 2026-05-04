// src/pages/Manager/components/ManagerOverview.tsx
import React, { useMemo } from 'react';
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

// Types
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
  link?: string;
  notification?: boolean;
  notificationCount?: number;
}

interface RevenueDataPoint {
  month: string;
  revenue: number;
  tickets: number;
  occupancy: number;
}

interface SeatDistributionDataPoint {
  name: string;
  value: number;
  color: string;
  revenue: number;
}

interface BookingTrendDataPoint {
  date: string;
  bookings: number;
  revenue: number;
}

interface ShowDataPoint {
  name: string;
  tickets: number;
  revenue: number;
  rating: number;
}

interface Activity {
  id: number;
  action: string;
  user: string;
  time: string;
  icon: React.ElementType;
  status: 'success' | 'warning' | 'info';
}

// Mock Data
const stats = {
  totalTicketsSold: 15420,
  totalRevenue: 328500,
  averageOccupancy: 72,
  customerSatisfaction: 4.6,
  activeHalls: 5,
  totalHalls: 6,
  upcomingShows: 12,
  totalCustomers: 8450,
  activePromotions: 3
};

const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 45000, tickets: 1850, occupancy: 65 },
  { month: 'Feb', revenue: 52000, tickets: 2100, occupancy: 68 },
  { month: 'Mar', revenue: 48000, tickets: 1950, occupancy: 62 },
  { month: 'Apr', revenue: 61000, tickets: 2450, occupancy: 75 },
  { month: 'May', revenue: 55000, tickets: 2250, occupancy: 70 },
  { month: 'Jun', revenue: 78500, tickets: 3100, occupancy: 78 },
];

const seatDistribution: SeatDistributionDataPoint[] = [
  { name: 'Standard', value: 850, color: '#0D9488', revenue: 42500 },
  { name: 'Premium', value: 450, color: '#3B82F6', revenue: 45000 },
  { name: 'VIP', value: 200, color: '#8B5CF6', revenue: 30000 },
  { name: 'Wheelchair', value: 50, color: '#10B981', revenue: 3000 },
];

const bookingTrends: BookingTrendDataPoint[] = [
  { date: 'Mon', bookings: 245, revenue: 12250 },
  { date: 'Tue', bookings: 230, revenue: 11500 },
  { date: 'Wed', bookings: 260, revenue: 13000 },
  { date: 'Thu', bookings: 290, revenue: 14500 },
  { date: 'Fri', bookings: 420, revenue: 21000 },
  { date: 'Sat', bookings: 580, revenue: 29000 },
  { date: 'Sun', bookings: 510, revenue: 25500 },
];

const topShows: ShowDataPoint[] = [
  { name: 'Movie Premiere', tickets: 1250, revenue: 31250, rating: 4.8 },
  { name: 'Concert Night', tickets: 980, revenue: 39200, rating: 4.7 },
  { name: 'Comedy Show', tickets: 870, revenue: 21750, rating: 4.6 },
  { name: 'Drama Play', tickets: 650, revenue: 16250, rating: 4.5 },
];

const recentActivities: Activity[] = [
  { id: 1, action: 'New show scheduled', user: 'Movie Premiere', time: '10 min ago', icon: Film, status: 'success' },
  { id: 2, action: 'Ticket booking completed', user: 'John Doe', time: '25 min ago', icon: Ticket, status: 'success' },
  { id: 3, action: 'Hall maintenance scheduled', user: 'Hall C', time: '1 hour ago', icon: Building, status: 'warning' },
  { id: 4, action: 'New customer registered', user: 'Sarah Smith', time: '2 hours ago', icon: Users, status: 'success' },
  { id: 5, action: 'Promotion campaign started', user: 'Summer Sale', time: '3 hours ago', icon: TrendingUp, status: 'info' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 }
  }
};

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, notification, notificationCount }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const CardContent = () => (
    <div
      className="relative overflow-hidden cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">{title}</p>
            {notification && notificationCount && notificationCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                {notificationCount}
              </span>
            )}
          </div>
          <p className="text-xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        {link && (
          <div className={`transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'}`}>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      {link ? <Link to={link} className="block"><CardContent /></Link> : <CardContent />}
    </motion.div>
  );
};

const ManagerOverview: React.FC = () => {
  const dashboardCards = useMemo(() => [
    { title: 'Tickets Sold', value: stats.totalTicketsSold, icon: Ticket, color: 'from-blue-500 to-cyan-600', delay: 0.1, link: '/manager/tickets', notification: false },
    { title: 'Total Revenue', value: `$${(stats.totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'from-teal-500 to-teal-600', delay: 0.15, link: '/manager/revenue', notification: false },
  ], []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 p-6"
    >
      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {dashboardCards.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </motion.div>

      {/* Secondary Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500">Active Halls</p>
          <p className="text-2xl font-bold text-gray-900">{stats.activeHalls}/{stats.totalHalls}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <p className="text-sm text-gray-500">Avilable Event</p>
          <p className="text-2xl font-bold text-purple-600">{stats.activePromotions}</p>
        </div>

      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Tickets AreaChart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue & Tickets Overview</h3>
              <p className="text-sm text-gray-500">Monthly performance metrics</p>
            </div>
            <Link to="/manager/reports" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
              View Reports <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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
        </motion.div>

        {/* Seat Distribution PieChart */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seat Distribution</h3>
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
                  <span className="text-sm text-green-600">${(item.revenue / 1000).toFixed(1)}K</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Booking Trends (BarChart) */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Weekly Booking Trends</h3>
            <p className="text-sm text-gray-500">Daily bookings and revenue</p>
          </div>
          <Link to="/manager/analytics" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
            View Analytics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
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
      </motion.div>

      {/* Top Performing Shows (full width) */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Shows</h3>
          <Link to="/manager/shows" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
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
                  <td className="py-3 px-4 text-sm text-gray-900">${(show.revenue / 1000).toFixed(1)}K</td>
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
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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
        </motion.div>
      </div>

     
    </motion.div>
  );
};

export default ManagerOverview;