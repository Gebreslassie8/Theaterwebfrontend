// src/pages/Salesperson/Report.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Ticket,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';
import SuccessPopup from '../../components/Reusable/SuccessPopup';
// Import mock data directly
import { defaultMockSalesRecords, SaleRecord } from './mockdata/mockdatayReportOfSlaes';

// ===================== Helper Functions =====================
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const getAvailableYears = (sales: SaleRecord[]): number[] => {
  const years = new Set<number>();
  sales.forEach(sale => {
    const year = new Date(sale.saleDate).getFullYear();
    years.add(year);
  });
  return Array.from(years).sort((a, b) => b - a);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

const groupSalesByDay = (
  sales: SaleRecord[],
  year: number,
  month: number
): { day: number; amount: number; tickets: number }[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const groups: { [day: number]: { amount: number; tickets: number } } = {};
  for (let i = 1; i <= daysInMonth; i++) groups[i] = { amount: 0, tickets: 0 };
  sales.forEach(sale => {
    const saleDate = new Date(sale.saleDate);
    if (saleDate.getFullYear() === year && saleDate.getMonth() === month) {
      const day = saleDate.getDate();
      groups[day].amount += sale.totalAmount;
      groups[day].tickets += sale.tickets.length;
    }
  });
  return Object.entries(groups).map(([day, data]) => ({
    day: parseInt(day),
    amount: data.amount,
    tickets: data.tickets,
  }));
};

const groupSalesByMonth = (
  sales: SaleRecord[],
  year: number
): { month: string; amount: number; tickets: number }[] => {
  const groups: { [month: number]: { amount: number; tickets: number } } = {};
  for (let i = 0; i < 12; i++) groups[i] = { amount: 0, tickets: 0 };
  sales.forEach(sale => {
    const saleDate = new Date(sale.saleDate);
    if (saleDate.getFullYear() === year) {
      const month = saleDate.getMonth();
      groups[month].amount += sale.totalAmount;
      groups[month].tickets += sale.tickets.length;
    }
  });
  return MONTHS.map((monthName, idx) => ({
    month: monthName,
    amount: groups[idx].amount,
    tickets: groups[idx].tickets,
  }));
};

const groupSalesByDayOfWeek = (
  sales: SaleRecord[],
  year: number,
  month: number
): { name: string; revenue: number }[] => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const groups: { [key: string]: number } = {
    Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0,
  };
  sales.forEach(sale => {
    const saleDate = new Date(sale.saleDate);
    if (saleDate.getFullYear() === year && saleDate.getMonth() === month) {
      const dayIndex = saleDate.getDay();
      let dayName = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1];
      groups[dayName] += sale.totalAmount;
    }
  });
  return daysOfWeek.map(day => ({
    name: day,
    revenue: groups[day],
  }));
};

// ===================== StatCard Component =====================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay?: number;
  change?: string;
  trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay = 0, change, trend }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
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
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 text-xs mt-0.5 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{change}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 100, damping: 12 },
  },
};

// ===================== Main Component =====================
const Report: React.FC = () => {
  // Directly use the imported mock data (may be empty array)
  const [sales] = useState<SaleRecord[]>(defaultMockSalesRecords);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportPopup, setShowExportPopup] = useState(false);

  // Set default filters based on the earliest/latest date in mock data (if any)
  useEffect(() => {
    if (sales.length > 0) {
      const today = new Date();
      // Check if any sale exists in current year/month, otherwise use the first available year/month
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const hasCurrentYear = sales.some(sale => new Date(sale.saleDate).getFullYear() === currentYear);
      if (hasCurrentYear) {
        setSelectedYear(currentYear.toString());
        const hasCurrentMonth = sales.some(sale => 
          new Date(sale.saleDate).getFullYear() === currentYear && 
          new Date(sale.saleDate).getMonth() === currentMonth
        );
        setSelectedMonth(hasCurrentMonth ? MONTHS[currentMonth] : MONTHS[0]);
      } else {
        // Use the most recent year and month from data
        const sorted = [...sales].sort((a,b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
        const latestDate = new Date(sorted[0].saleDate);
        setSelectedYear(latestDate.getFullYear().toString());
        setSelectedMonth(MONTHS[latestDate.getMonth()]);
      }
      // Default day to "all"
      setSelectedDay('all');
    } else {
      // No data: reset filters
      setSelectedYear('');
      setSelectedMonth('');
      setSelectedDay('all');
    }
  }, [sales]);

  const availableYears = useMemo(() => getAvailableYears(sales).map(y => y.toString()), [sales]);

  // Filter sales based on year/month/day and search
  const filteredSales = useMemo(() => {
    let result = [...sales];
    if (selectedYear) {
      result = result.filter(sale => new Date(sale.saleDate).getFullYear().toString() === selectedYear);
    }
    if (selectedMonth && selectedMonth !== 'all') {
      const monthIndex = MONTHS.indexOf(selectedMonth);
      if (monthIndex !== -1) {
        result = result.filter(sale => new Date(sale.saleDate).getMonth() === monthIndex);
      }
    }
    if (selectedDay && selectedDay !== 'all' && selectedYear && selectedMonth) {
      const dayNum = parseInt(selectedDay);
      result = result.filter(sale => new Date(sale.saleDate).getDate() === dayNum);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(sale =>
        sale.customerName.toLowerCase().includes(term) ||
        sale.showTitle.toLowerCase().includes(term) ||
        sale.salesperson.toLowerCase().includes(term)
      );
    }
    return result;
  }, [sales, selectedYear, selectedMonth, selectedDay, searchTerm]);

  // Totals
  const totals = useMemo(() => {
    const totalTickets = filteredSales.reduce((sum, s) => sum + s.tickets.length, 0);
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalTransactions = filteredSales.length;
    const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const growth = 15.8; // mock – could be calculated from previous period
    return { totalTickets, totalRevenue, totalTransactions, averageTicket, growth };
  }, [filteredSales]);

  // Chart data based on filters
  const composedChartData = useMemo(() => {
    if (!selectedYear) return [];
    if (selectedMonth && selectedMonth !== 'all') {
      const yearNum = parseInt(selectedYear);
      const monthIndex = MONTHS.indexOf(selectedMonth);
      const dailyData = groupSalesByDay(filteredSales, yearNum, monthIndex);
      return dailyData.map(d => ({
        label: `Day ${d.day}`,
        revenue: d.amount,
        tickets: d.tickets,
      }));
    } else {
      const yearNum = parseInt(selectedYear);
      const monthlyData = groupSalesByMonth(filteredSales, yearNum);
      return monthlyData.map(m => ({
        label: m.month.slice(0, 3),
        revenue: m.amount,
        tickets: m.tickets,
      }));
    }
  }, [filteredSales, selectedYear, selectedMonth]);

  // Weekly revenue bar chart data
  const weeklyRevenueData = useMemo(() => {
    if (!selectedYear || !selectedMonth || selectedMonth === 'all') return [];
    const yearNum = parseInt(selectedYear);
    const monthIndex = MONTHS.indexOf(selectedMonth);
    return groupSalesByDayOfWeek(filteredSales, yearNum, monthIndex);
  }, [filteredSales, selectedYear, selectedMonth]);

  // Pie chart data: revenue by salesperson
  const salespersonPieData = useMemo(() => {
    const map = new Map<string, number>();
    filteredSales.forEach(sale => {
      map.set(sale.salesperson, (map.get(sale.salesperson) || 0) + sale.totalAmount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredSales]);

  const COLORS = ['#14b8a6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#ec489a'];

  const exportToCSV = () => {
    const headers = ['ID', 'Customer', 'Phone', 'Show', 'Date', 'Time', 'Seats', 'Amount', 'Payment', 'Salesperson', 'Sale Date'];
    const rows = filteredSales.map(s => [
      s.id,
      s.customerName,
      s.customerPhone,
      s.showTitle,
      s.showDate,
      s.showTime,
      s.seats,
      s.totalAmount,
      s.paymentMethod,
      s.salesperson,
      new Date(s.saleDate).toLocaleString(),
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportPopup(true);
  };

  // No loading state because we read directly from import (synchronous)
  // Transaction table columns
  const transactionColumns = [
    { Header: 'Date', accessor: 'date', Cell: (row: SaleRecord) => new Date(row.saleDate).toLocaleDateString() },
    { Header: 'Show', accessor: 'showTitle' },
    { Header: 'Customer', accessor: 'customerName' },
    { Header: 'Seats', accessor: 'seats' },
    { Header: 'Amount', accessor: 'totalAmount', Cell: (row: SaleRecord) => formatCurrency(row.totalAmount) },
    { Header: 'Payment', accessor: 'paymentMethod' },
    { Header: 'Salesperson', accessor: 'salesperson' },
  ];

  const dashboardCards = [
    { title: 'Total Revenue', value: formatCurrency(totals.totalRevenue), icon: DollarSign, color: 'from-emerald-500 to-teal-600', change: `+${totals.growth}%`, trend: 'up' as const },
    { title: 'Tickets Sold', value: formatNumber(totals.totalTickets), icon: Ticket, color: 'from-blue-500 to-cyan-500', change: '+12% vs last month', trend: 'up' as const },
    { title: 'Average Ticket', value: formatCurrency(totals.averageTicket), icon: TrendingUp, color: 'from-purple-500 to-pink-500', change: '+5% vs last month', trend: 'up' as const },
    { title: 'Transactions', value: formatNumber(totals.totalTransactions), icon: Users, color: 'from-orange-500 to-red-500', change: '+8% vs last month', trend: 'up' as const },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
              <p className="text-sm text-gray-500">View and analyze ticket sales performance</p>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
            <Filter className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
              >
                {MONTHS.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day (optional)</label>
              <select
                value={selectedDay}
                onChange={e => setSelectedDay(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">Any Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day.toString()}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Customer, show, salesperson..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {dashboardCards.map((card, idx) => (
            <StatCard key={idx} title={card.title} value={card.value} icon={card.icon} color={card.color} delay={idx * 0.05} change={card.change} trend={card.trend} />
          ))}
        </motion.div>

        {/* Main Composed Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal-600" />
            Revenue & Tickets Trend {selectedMonth && selectedMonth !== 'all' ? `- ${selectedMonth} ${selectedYear}` : selectedYear ? `- ${selectedYear}` : ''}
          </h2>
          <div className="h-80">
            {composedChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={composedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" angle={-45} textAnchor="end" height={60} interval={0} stroke="#9ca3af" />
                  <YAxis yAxisId="left" tickFormatter={v => formatCurrency(v)} stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                  <Tooltip formatter={(value: any, name: string) => [
                    name === 'revenue' ? formatCurrency(value) : `${value} tickets`,
                    name === 'revenue' ? 'Revenue' : 'Tickets'
                  ]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="tickets" name="Tickets Sold" stroke="#f59e0b" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No sales data available for selected filters
              </div>
            )}
          </div>
        </div>

        {/* Two charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal-600" />
              Weekly Revenue {selectedMonth && selectedMonth !== 'all' ? `- ${selectedMonth} ${selectedYear}` : ''}
            </h2>
            <div className="h-80">
              {weeklyRevenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis tickFormatter={v => formatCurrency(v)} stroke="#9ca3af" />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Bar dataKey="revenue" name="Revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Select a month to view weekly revenue breakdown
                </div>
              )}
            </div>
          </div>

          {/* Revenue by Salesperson */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-teal-600" />
              Revenue by Salesperson
            </h2>
            <div className="h-80">
              {salespersonPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salespersonPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {salespersonPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={value => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No sales data available for selected filters
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Transaction Details</h3>
            <p className="text-sm text-gray-500">Showing {filteredSales.length} transactions</p>
          </div>
          <ReusableTable
            columns={transactionColumns}
            data={filteredSales}
            showSearch={false}
            showExport={false}
            showPrint={false}
            itemsPerPage={10}
          />
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <ReusableButton onClick={exportToCSV} icon={Download} label="Export CSV" variant="primary" size="sm" />
        </div>

        {/* Export Success Popup */}
        <SuccessPopup
          isOpen={showExportPopup}
          onClose={() => setShowExportPopup(false)}
          type="success"
          title="Export Successful"
          message="Sales report exported successfully."
          duration={3000}
          position="top-right"
        />
      </div>
    </motion.div>
  );
};

export default Report;