// src/pages/Sales/SalesDashboard.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Building, DollarSign, Clock, UserCheck,
  ArrowRight, Calendar as CalendarIcon,
  TrendingUp, TrendingDown, Package, ShoppingCart
} from 'lucide-react';
import {
  AreaChart, Area, PieChart as RePieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line
} from 'recharts';
import { Link } from 'react-router-dom';

// ===================== Types =====================
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
  orders: number;
}

interface ProductDistributionDataPoint {
  name: string;
  value: number;
  color: string;
}

interface CustomerGrowthDataPoint {
  month: string;
  customers: number;
  newCustomers: number;
}

interface Activity {
  id: number;
  action: string;
  user: string;
  time: string;
  icon: React.ElementType;
  status: 'success' | 'warning' | 'info';
}

// ===================== Mock Data =====================
const stats = {
  totalRevenue: 485000,
  totalOrders: 3250,
  pendingOrders: 48,
  totalCustomers: 12450,
  newCustomersToday: 127,
  averageOrderValue: 149,
  conversionRate: 3.2,
  returningCustomers: 6780
};

const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 42000, orders: 310 },
  { month: 'Feb', revenue: 48000, orders: 355 },
  { month: 'Mar', revenue: 45000, orders: 340 },
  { month: 'Apr', revenue: 58000, orders: 410 },
  { month: 'May', revenue: 52000, orders: 395 },
  { month: 'Jun', revenue: 63000, orders: 470 }
];

const productData: ProductDistributionDataPoint[] = [
  { name: 'Electronics', value: 42, color: '#0D9488' },
  { name: 'Clothing', value: 28, color: '#F59E0B' },
  { name: 'Home & Living', value: 18, color: '#3B82F6' },
  { name: 'Books', value: 12, color: '#EF4444' }
];

const customerGrowthData: CustomerGrowthDataPoint[] = [
  { month: 'Jan', customers: 8200, newCustomers: 410 },
  { month: 'Feb', customers: 8650, newCustomers: 450 },
  { month: 'Mar', customers: 9100, newCustomers: 450 },
  { month: 'Apr', customers: 9780, newCustomers: 680 },
  { month: 'May', customers: 10500, newCustomers: 720 },
  { month: 'Jun', customers: 11200, newCustomers: 700 }
];

const recentActivities: Activity[] = [
  { id: 1, action: 'New order placed', user: 'Order #OR-9823', time: '5 min ago', icon: ShoppingCart, status: 'success' },
  { id: 2, action: 'High value sale', user: 'Customer: Sarah Johnson', time: '25 min ago', icon: TrendingUp, status: 'success' },
  { id: 3, action: 'Payment failed', user: 'Order #OR-9812', time: '1 hour ago', icon: DollarSign, status: 'warning' },
  { id: 4, action: 'New customer registered', user: 'Michael Chen', time: '3 hours ago', icon: Users, status: 'success' }
];

// ===================== Animation Variants =====================
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

// ===================== Stat Card Component =====================
const StatCard: React.FC<StatCardProps> = ({
  title, value, icon: Icon, color, delay,
  link, notification, notificationCount
}) => {
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

// ===================== Main Dashboard Component =====================
const SalesDashboard: React.FC = () => {
  const dashboardCards = useMemo(() => [
    { title: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, color: 'from-teal-500 to-teal-600', delay: 0.1, link: '/sales/revenue', notification: false },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'from-blue-500 to-cyan-600', delay: 0.15, link: '/sales/orders', notification: false },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'from-yellow-500 to-orange-600', delay: 0.2, link: '/sales/orders?status=pending', notification: true, notificationCount: stats.pendingOrders },
    { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'from-indigo-500 to-purple-600', delay: 0.25, link: '/sales/customers', notification: false },
    { title: 'New Customers Today', value: stats.newCustomersToday, icon: UserCheck, color: 'from-green-500 to-emerald-600', delay: 0.3, link: '/sales/customers?filter=new', notification: true, notificationCount: stats.newCustomersToday }
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart (AreaChart) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-500">Monthly revenue & order trends</p>
            </div>
            <Link to="/sales/revenue" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
              View Details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Distribution (PieChart) */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
            <Link to="/sales/products" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {productData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${value}%`} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {productData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Customer Growth (LineChart) */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Customer Growth</h3>
            <p className="text-sm text-gray-500">Monthly customer acquisition trend</p>
          </div>
          <Link to="/sales/customers" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
            View All Customers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={customerGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip formatter={(value: any) => value.toLocaleString()} />
            <Line type="monotone" dataKey="customers" stroke="#0D9488" strokeWidth={2} name="Total Customers" />
            <Line type="monotone" dataKey="newCustomers" stroke="#F59E0B" strokeWidth={2} name="New Customers" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Link to="/sales/activity" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
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
    </motion.div>
  );
};

export default SalesDashboard;