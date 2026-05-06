import React, { useState } from 'react';
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
} from 'lucide-react';

import { AreaChart } from '../../components/Overview/AreaChart';
import { BarChart } from '../../components/Overview/BarChart';
import { Card, StatCard, MetricCard } from '../../components/Overview/Card';
import { DonutChart } from '../../components/Overview/PieChart';

// ==================== Types & Mock Data ====================
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

const managerStats: ManagerStats = {
  totalRevenue: 158750,
  ticketsSold: 12580,
  ticketsToday: 156,
  occupancyRate: 78,
  activeShows: 8,
  totalHalls: 6,
  activeHalls: 5,
  totalCustomers: 7548,
  upcomingShows: 12,
  completedShows: 45,
};

const hallOccupancyData: HallOccupancyData[] = [
  { name: 'Grand Hall', occupancy: 85, capacity: 300, color: '#14b8a6' },
  { name: 'West End Theater', occupancy: 92, capacity: 250, color: '#f59e0b' },
  { name: 'Disney Theater', occupancy: 68, capacity: 280, color: '#3b82f6' },
  { name: 'Emerald Theatre', occupancy: 45, capacity: 200, color: '#ef4444' },
  { name: 'Opera House', occupancy: 78, capacity: 350, color: '#8b5cf6' },
  { name: 'Broadway Hall', occupancy: 55, capacity: 220, color: '#06b6d4' },
];

const showsData: ShowData[] = [
  { id: '1', name: 'The Lion King', sales: 89, capacity: 120, revenue: 4005, status: 'selling', time: '7:00 PM', date: '2026-04-20', hall: 'Grand Hall' },
  { id: '2', name: 'Hamilton', sales: 95, capacity: 120, revenue: 6175, status: 'almost full', time: '8:30 PM', date: '2026-04-21', hall: 'West End Theater' },
  { id: '3', name: 'Wicked', sales: 110, capacity: 120, revenue: 6050, status: 'sold out', time: '6:00 PM', date: '2026-04-19', hall: 'Disney Theater' },
  { id: '4', name: 'Phantom of Opera', sales: 67, capacity: 120, revenue: 4020, status: 'selling', time: '9:00 PM', date: '2026-04-22', hall: 'Emerald Theatre' },
  { id: '5', name: 'Chicago', sales: 78, capacity: 120, revenue: 3900, status: 'selling', time: '7:30 PM', date: '2026-04-23', hall: 'Opera House' },
  { id: '6', name: 'Les Misérables', sales: 45, capacity: 120, revenue: 2700, status: 'upcoming', time: '8:00 PM', date: '2026-05-01', hall: 'Broadway Hall' },
];

const transactions: Transaction[] = [
  { id: '#TR-2026-001', customer: 'John Doe', amount: 90, tickets: 2, time: '5 min ago', status: 'completed' },
  { id: '#TR-2026-002', customer: 'Jane Smith', amount: 135, tickets: 3, time: '15 min ago', status: 'completed' },
  { id: '#TR-2026-003', customer: 'Bob Johnson', amount: 45, tickets: 1, time: '25 min ago', status: 'completed' },
  { id: '#TR-2026-004', customer: 'Alice Brown', amount: 180, tickets: 4, time: '35 min ago', status: 'completed' },
  { id: '#TR-2026-005', customer: 'Charlie Wilson', amount: 90, tickets: 2, time: '45 min ago', status: 'refunded' },
  { id: '#TR-2026-006', customer: 'Emma Davis', amount: 225, tickets: 5, time: '1 hour ago', status: 'completed' },
];

const dailyRevenueData: RevenueData[] = [
  { period: 'Mon', revenue: 32450, tickets: 156 },
  { period: 'Tue', revenue: 28900, tickets: 142 },
  { period: 'Wed', revenue: 35600, tickets: 178 },
  { period: 'Thu', revenue: 41200, tickets: 195 },
  { period: 'Fri', revenue: 52300, tickets: 245 },
  { period: 'Sat', revenue: 67800, tickets: 312 },
  { period: 'Sun', revenue: 58900, tickets: 278 },
];

const monthlyRevenueData: RevenueData[] = [
  { period: 'Jan', revenue: 125000, tickets: 5850 },
  { period: 'Feb', revenue: 118000, tickets: 5420 },
  { period: 'Mar', revenue: 142000, tickets: 6780 },
  { period: 'Apr', revenue: 158000, tickets: 7450 },
  { period: 'May', revenue: 172000, tickets: 8150 },
  { period: 'Jun', revenue: 189000, tickets: 8920 },
  { period: 'Jul', revenue: 195000, tickets: 9250 },
  { period: 'Aug', revenue: 182000, tickets: 8680 },
  { period: 'Sep', revenue: 201000, tickets: 9560 },
  { period: 'Oct', revenue: 215000, tickets: 10200 },
  { period: 'Nov', revenue: 235000, tickets: 11150 },
  { period: 'Dec', revenue: 268000, tickets: 12800 },
];

const weeklyBookingData: RevenueData[] = [
  { period: 'Mon', revenue: 10150, tickets: 145 },
  { period: 'Tue', revenue: 8400, tickets: 120 },
  { period: 'Wed', revenue: 9450, tickets: 135 },
  { period: 'Thu', revenue: 11200, tickets: 160 },
  { period: 'Fri', revenue: 16100, tickets: 230 },
  { period: 'Sat', revenue: 21700, tickets: 310 },
  { period: 'Sun', revenue: 15750, tickets: 225 },
];

const seatDistributionData = [
  { name: 'Standard', value: 4850, color: '#14b8a6' },
  { name: 'Premium', value: 2850, color: '#f59e0b' },
  { name: 'VIP', value: 1250, color: '#8b5cf6' },
  { name: 'Wheelchair', value: 380, color: '#3b82f6' },
];

// Helper functions
const formatCurrency = (amount: number) => {
  if (amount >= 1000000) return `ETB ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `ETB ${(amount / 1000).toFixed(0)}K`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
};

const ManagerOverview: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly'>('monthly');
  const [selectedRevenueType, setSelectedRevenueType] = useState<'revenue' | 'tickets'>('revenue');

  const getRevenueData = () => (selectedPeriod === 'daily' ? dailyRevenueData : monthlyRevenueData);
  const currentData = getRevenueData();
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTickets = currentData.reduce((sum, item) => sum + item.tickets, 0);

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
        <StatCard title="Tickets Sold Today" value={managerStats.ticketsToday} icon={Ticket} color="from-blue-500 to-cyan-600" link="/manager/detail" />
        <StatCard title="Active Event" value={managerStats.activeShows} icon={Film} color="from-orange-500 to-red-600" link="/manager/events/create" />
        <StatCard title="Total Revenue" value={formatCurrency(managerStats.totalRevenue)} icon={TrendingUp} color="from-green-500 to-emerald-600" link="/manager/Report" />
      

      {/* Secondary Stats */}
        {/* Total Tickets Sold - clickable */}
        <Link to="/manager/ticket-sales" className="block transition-transform hover:scale-[1.02]">
          <MetricCard title="Total Tickets Sold" value={managerStats.ticketsSold.toLocaleString()} icon={<Ticket className="h-5 w-5 text-white" />} />
        </Link>
        {/* Total Customers - clickable */}
      </motion.div>

      {/* Hall Occupancy - using DonutChart from PieChart */}
      <motion.div variants={itemVariants}>
        <Card title="Hall Occupancy" subtitle="Current occupancy rates across all halls" showMoreLink="/manager/halls" showMoreText="Manage Halls">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutChart data={hallOccupancyData.map(h => ({ name: h.name, value: h.occupancy, color: h.color }))} height={280} showLabels />
            <div className="space-y-3">
              {hallOccupancyData.map((hall, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{hall.name}</span>
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
            <div className="flex gap-2">
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

      {/* Seat Distribution - DonutChart */}
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
                    <p className="text-xs text-gray-500">{((seat.value / 9330) * 100).toFixed(1)}% of total</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-teal-700">Total Seats</span>
                  <span className="text-lg font-bold text-teal-800">9,330</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Shows Table - Status column removed */}
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
                        <button className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"><Eye className="h-4 w-4 text-blue-600" /></button>
                        <button className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition"><Edit className="h-4 w-4 text-teal-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                    <p className="text-xs text-gray-500">{tx.id} • {tx.tickets} tickets</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(tx.amount)}</p>
                  <p className="text-xs text-gray-400">{tx.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Upcoming Schedule */}
      <motion.div variants={itemVariants}>
        <Card title="Upcoming Schedule" subtitle={`${managerStats.upcomingShows} shows scheduled in the next 30 days`} showMoreLink="/manager/schedule" showMoreText="View Full Schedule">
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
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ManagerOverview;