// src/pages/Salesperson/Report.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Filter,
  Download,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Colors from '../../components/Reusable/Colors';

// ===================== Types =====================
interface Seat {
  seatId: string;
  seatLabel: string;
  qrData: string;
}

interface SaleRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  showTitle: string;
  showDate: string;
  showTime: string;
  seats: string;
  tickets: Seat[];
  seatType: string;
  totalAmount: number;
  paymentMethod: string;
  saleDate: string; // ISO string
  salesperson: string;
}

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';
type PaymentStatus = 'all' | 'completed' | 'pending' | 'refunded';

// Month names
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// ===================== Helper Functions =====================
const getStartOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getEndOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Group sales by period (daily/weekly/monthly/yearly)
const groupSalesByPeriod = (sales: SaleRecord[], period: Period): { label: string; amount: number; tickets: number }[] => {
  const groups: { [key: string]: { amount: number; tickets: number } } = {};

  sales.forEach(sale => {
    const saleDate = new Date(sale.saleDate);
    let key: string;

    switch (period) {
      case 'daily':
        key = saleDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
        break;
      case 'weekly':
        const weekStart = new Date(saleDate);
        weekStart.setDate(saleDate.getDate() - saleDate.getDay());
        key = `Week of ${weekStart.toLocaleDateString('en-CA')}`;
        break;
      case 'monthly':
        key = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'yearly':
        key = saleDate.getFullYear().toString();
        break;
      default:
        key = saleDate.toLocaleDateString('en-CA');
    }

    if (!groups[key]) {
      groups[key] = { amount: 0, tickets: 0 };
    }
    groups[key].amount += sale.totalAmount;
    groups[key].tickets += sale.tickets.length;
  });

  return Object.entries(groups).map(([label, data]) => ({ label, amount: data.amount, tickets: data.tickets }));
};

// Get unique salespersons from records
const getUniqueSalespersons = (sales: SaleRecord[]): string[] => {
  const names = new Set(sales.map(s => s.salesperson));
  return Array.from(names).sort();
};

// Get available years from sales data (for dropdown)
const getAvailableYears = (sales: SaleRecord[]): number[] => {
  const years = new Set<number>();
  sales.forEach(sale => {
    const year = new Date(sale.saleDate).getFullYear();
    years.add(year);
  });
  return Array.from(years).sort((a, b) => b - a); // newest first
};

// Format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// ===================== Main Component =====================
const Report: React.FC = () => {
  // State for sales data
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [period, setPeriod] = useState<Period>('daily');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>('all');
  
  // NEW: Year, Month, Day filters
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 'all' or month name
  const [selectedDay, setSelectedDay] = useState<string>('all'); // 'all' or '1'..'31'

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [useDateRange, setUseDateRange] = useState(false); // toggle between date range picker and year/month/day

  // Load sales from localStorage
  useEffect(() => {
    const loadSales = () => {
      try {
        const stored = localStorage.getItem('theater_sales_records');
        if (stored) {
          setSales(JSON.parse(stored));
        } else {
          // Demo data
          const demoRecords: SaleRecord[] = [
            {
              id: 'demo1',
              customerName: 'John Doe',
              customerPhone: '555-1234',
              showTitle: 'The Lion King',
              showDate: '2026-05-10',
              showTime: '14:00',
              seats: 'A1, A2',
              tickets: [{ seatId: 'A1', seatLabel: 'A1', qrData: 'qr1' }, { seatId: 'A2', seatLabel: 'A2', qrData: 'qr2' }],
              seatType: 'Standard',
              totalAmount: 120,
              paymentMethod: 'cash',
              saleDate: new Date().toISOString(),
              salesperson: 'Alice',
            },
            {
              id: 'demo2',
              customerName: 'Jane Smith',
              customerPhone: '555-5678',
              showTitle: 'Hamilton',
              showDate: '2026-05-11',
              showTime: '19:30',
              seats: 'B5',
              tickets: [{ seatId: 'B5', seatLabel: 'B5', qrData: 'qr3' }],
              seatType: 'Standard',
              totalAmount: 65,
              paymentMethod: 'card',
              saleDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              salesperson: 'Bob',
            },
            {
              id: 'demo3',
              customerName: 'Sam Wilson',
              customerPhone: '555-9012',
              showTitle: 'Wicked',
              showDate: '2026-05-12',
              showTime: '20:00',
              seats: 'C10, C11',
              tickets: [{ seatId: 'C10', seatLabel: 'C10', qrData: 'qr4' }, { seatId: 'C11', seatLabel: 'C11', qrData: 'qr5' }],
              seatType: 'Standard',
              totalAmount: 150,
              paymentMethod: 'cash',
              saleDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              salesperson: 'Alice',
            },
          ];
          localStorage.setItem('theater_sales_records', JSON.stringify(demoRecords));
          setSales(demoRecords);
        }
      } catch (err) {
        console.error('Failed to load sales records:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, []);

  // Available years for dropdown
  const availableYears = useMemo(() => ['all', ...getAvailableYears(sales).map(y => y.toString())], [sales]);

  // Filter sales based on all criteria
  const filteredSales = useMemo(() => {
    let result = [...sales];

    if (useDateRange) {
      // Date range filter
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      result = result.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate >= start && saleDate <= end;
      });
    } else {
      // Year/Month/Day filter
      result = result.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        const year = saleDate.getFullYear().toString();
        const month = MONTHS[saleDate.getMonth()];
        const day = saleDate.getDate().toString();

        if (selectedYear !== 'all' && year !== selectedYear) return false;
        if (selectedMonth !== 'all' && month !== selectedMonth) return false;
        if (selectedDay !== 'all' && day !== selectedDay) return false;
        return true;
      });
    }

    // Salesperson filter
    if (selectedSalesperson !== 'all') {
      result = result.filter(sale => sale.salesperson === selectedSalesperson);
    }

    // Status filter (demo; assume all completed)
    if (selectedStatus !== 'all') {
      // Placeholder – add status field to records if needed
    }

    return result;
  }, [sales, startDate, endDate, selectedSalesperson, selectedStatus, useDateRange, selectedYear, selectedMonth, selectedDay]);

  // Aggregated data for charts
  const chartData = useMemo(() => groupSalesByPeriod(filteredSales, period), [filteredSales, period]);

  // Unique salespersons for dropdown
  const salespersons = useMemo(() => ['all', ...getUniqueSalespersons(sales)], [sales]);

  // Totals
  const totals = useMemo(() => {
    const totalTickets = filteredSales.reduce((sum, s) => sum + s.tickets.length, 0);
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalTransactions = filteredSales.length;
    const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    return { totalTickets, totalRevenue, totalTransactions, averageTicket };
  }, [filteredSales]);

  // Pie data for salesperson distribution
  const salespersonPieData = useMemo(() => {
    const map = new Map<string, number>();
    filteredSales.forEach(sale => {
      map.set(sale.salesperson, (map.get(sale.salesperson) || 0) + sale.totalAmount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredSales]);

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a'];

  // Export to CSV
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepTeal mx-auto mb-4" />
          <p className="text-gray-600">Loading sales report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales Report</h1>
            <p className="text-gray-500 mt-1">View and analyze ticket sales performance</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-deepTeal text-white rounded-lg hover:bg-deepTeal/80 transition shadow-md"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Filter Panel */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 font-medium mb-3"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          {showFilters && (
            <div className="space-y-4">
              {/* Toggle between date range and year/month/day */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!useDateRange}
                    onChange={() => setUseDateRange(false)}
                  />
                  <span className="text-sm">Filter by Year/Month/Day</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={useDateRange}
                    onChange={() => setUseDateRange(true)}
                  />
                  <span className="text-sm">Filter by Date Range</span>
                </label>
              </div>

              {/* Year/Month/Day Filter */}
              {!useDateRange && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select
                      value={selectedYear}
                      onChange={e => setSelectedYear(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year}>
                          {year === 'all' ? 'All Years' : year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                    <select
                      value={selectedMonth}
                      onChange={e => setSelectedMonth(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="all">All Months</option>
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="all">Any Day</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day.toString()}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Date Range Filter */}
              {useDateRange && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {/* Common Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                 
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Ticket} label="Tickets Sold" value={totals.totalTickets} color="from-blue-500 to-blue-600" />
          <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(totals.totalRevenue)} color="from-green-500 to-green-600" />
          <StatCard icon={TrendingUp} label="Average Ticket" value={formatCurrency(totals.averageTicket)} color="from-purple-500 to-purple-600" />
          <StatCard icon={Users} label="Transactions" value={totals.totalTransactions} color="from-orange-500 to-orange-600" />
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend ({period})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => [name === 'amount' ? formatCurrency(value as number) : value, name === 'amount' ? 'Revenue' : 'Tickets']} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="amount" stroke={Colors.primary || '#0d9488'} name="Revenue ($)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="tickets" stroke="#f59e0b" name="Tickets Sold" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Salesperson</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salespersonPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {salespersonPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart for tickets per period */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tickets Sold per Period</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} tickets`, 'Tickets']} />
              <Legend />
              <Bar dataKey="tickets" fill={Colors.primary || '#0d9488'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Transactions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Transaction Details</h3>
            <p className="text-sm text-gray-500">Showing {filteredSales.length} transactions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Show</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesperson</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(sale.saleDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{sale.showTitle}</div>
                      <div className="text-xs text-gray-500">{sale.showDate} {sale.showTime}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{sale.customerName}</div>
                      <div className="text-xs text-gray-500">{sale.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3">{sale.seats}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(sale.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        sale.paymentMethod === 'cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {sale.paymentMethod === 'cash' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3">{sale.salesperson}</td>
                  </tr>
                ))}
                {filteredSales.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No sales records found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== Helper Component =====================
const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string | number; color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
  </div>
);

export default Report;