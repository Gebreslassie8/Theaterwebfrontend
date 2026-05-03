// src/pages/Salesperson/Report.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Download,
  CheckCircle,
  Clock,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
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
  ComposedChart,
} from 'recharts';
import Colors from '../../components/Reusable/Colors';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';
import SuccessPopup from '../../components/Reusable/SuccessPopup';

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
  saleDate: string;
  salesperson: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ===================== Helper Functions =====================
const getAvailableYears = (sales: SaleRecord[]): number[] => {
  const years = new Set<number>();
  sales.forEach((sale) => {
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

// Group sales by day within a month
const groupSalesByDay = (
  sales: SaleRecord[],
  year: number,
  month: number
): { day: number; amount: number; tickets: number }[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const groups: { [day: number]: { amount: number; tickets: number } } = {};
  for (let i = 1; i <= daysInMonth; i++) {
    groups[i] = { amount: 0, tickets: 0 };
  }
  sales.forEach((sale) => {
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

// Group sales by month within a year
const groupSalesByMonth = (
  sales: SaleRecord[],
  year: number
): { month: string; amount: number; tickets: number }[] => {
  const groups: { [month: number]: { amount: number; tickets: number } } = {};
  for (let i = 0; i < 12; i++) groups[i] = { amount: 0, tickets: 0 };
  sales.forEach((sale) => {
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

// Group sales by year (for yearly trend)
const groupSalesByYear = (
  sales: SaleRecord[]
): { year: string; amount: number; tickets: number }[] => {
  const groups: { [year: string]: { amount: number; tickets: number } } = {};
  sales.forEach((sale) => {
    const year = new Date(sale.saleDate).getFullYear().toString();
    if (!groups[year]) groups[year] = { amount: 0, tickets: 0 };
    groups[year].amount += sale.totalAmount;
    groups[year].tickets += sale.tickets.length;
  });
  return Object.entries(groups)
    .map(([year, data]) => ({ year, amount: data.amount, tickets: data.tickets }))
    .sort((a, b) => a.year.localeCompare(b.year));
};

// ===================== Main Component =====================
const Report: React.FC = () => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [showExportPopup, setShowExportPopup] = useState(false);

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
              tickets: [
                { seatId: 'A1', seatLabel: 'A1', qrData: 'qr1' },
                { seatId: 'A2', seatLabel: 'A2', qrData: 'qr2' },
              ],
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
              tickets: [
                { seatId: 'C10', seatLabel: 'C10', qrData: 'qr4' },
                { seatId: 'C11', seatLabel: 'C11', qrData: 'qr5' },
              ],
              seatType: 'Standard',
              totalAmount: 150,
              paymentMethod: 'cash',
              saleDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              salesperson: 'Alice',
            },
            {
              id: 'demo4',
              customerName: 'Past Customer',
              customerPhone: '555-0000',
              showTitle: 'Old Show',
              showDate: '2025-03-15',
              showTime: '18:00',
              seats: 'D1',
              tickets: [{ seatId: 'D1', seatLabel: 'D1', qrData: 'qr6' }],
              seatType: 'Standard',
              totalAmount: 80,
              paymentMethod: 'cash',
              saleDate: '2025-03-15T10:00:00Z',
              salesperson: 'Charlie',
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

  // Set default filters
  useEffect(() => {
    if (sales.length > 0) {
      const today = new Date();
      const currentYear = today.getFullYear().toString();
      const currentMonth = MONTHS[today.getMonth()];
      const currentDay = today.getDate().toString();
      setSelectedYear(currentYear);
      setSelectedMonth(currentMonth);
      setSelectedDay(currentDay);
    }
  }, [sales]);

  const availableYears = useMemo(() => {
    const years = getAvailableYears(sales);
    return years.map((y) => y.toString());
  }, [sales]);

  // Filter sales
  const filteredSales = useMemo(() => {
    let result = [...sales];
    if (selectedYear && selectedYear !== 'all') {
      result = result.filter(
        (sale) => new Date(sale.saleDate).getFullYear().toString() === selectedYear
      );
    }
    if (selectedMonth && selectedMonth !== 'all') {
      const monthIndex = MONTHS.indexOf(selectedMonth);
      if (monthIndex !== -1) {
        result = result.filter((sale) => new Date(sale.saleDate).getMonth() === monthIndex);
      }
    }
    if (
      selectedDay &&
      selectedDay !== 'all' &&
      selectedYear &&
      selectedYear !== 'all' &&
      selectedMonth &&
      selectedMonth !== 'all'
    ) {
      const dayNum = parseInt(selectedDay);
      result = result.filter((sale) => new Date(sale.saleDate).getDate() === dayNum);
    }
    return result;
  }, [sales, selectedYear, selectedMonth, selectedDay]);

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
    filteredSales.forEach((sale) => {
      map.set(sale.salesperson, (map.get(sale.salesperson) || 0) + sale.totalAmount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredSales]);

  // Chart data based on selected year/month
  const chartData = useMemo(() => {
    if (!selectedYear || selectedYear === 'all') {
      return groupSalesByYear(filteredSales).map((item) => ({
        label: item.year,
        amount: item.amount,
        tickets: item.tickets,
      }));
    }
    if (selectedMonth && selectedMonth !== 'all') {
      const yearNum = parseInt(selectedYear);
      const monthIndex = MONTHS.indexOf(selectedMonth);
      if (monthIndex !== -1) {
        const dailyData = groupSalesByDay(filteredSales, yearNum, monthIndex);
        return dailyData.map((d) => ({
          label: `Day ${d.day}`,
          amount: d.amount,
          tickets: d.tickets,
        }));
      }
    }
    const yearNum = parseInt(selectedYear);
    const monthlyData = groupSalesByMonth(filteredSales, yearNum);
    return monthlyData.map((m) => ({
      label: m.month.slice(0, 3),
      amount: m.amount,
      tickets: m.tickets,
    }));
  }, [filteredSales, selectedYear, selectedMonth]);

  const COLORS = ['#14b8a6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#ec489a'];

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Customer',
      'Phone',
      'Show',
      'Date',
      'Time',
      'Seats',
      'Amount',
      'Payment',
      'Salesperson',
      'Sale Date',
    ];
    const rows = filteredSales.map((s) => [
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
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportPopup(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading sales report...</p>
        </div>
      </div>
    );
  }

  // Transaction table columns
  const transactionColumns = [
    { Header: 'Date', accessor: 'date', Cell: (row: SaleRecord) => new Date(row.saleDate).toLocaleDateString() },
    { Header: 'Show', accessor: 'showTitle', Cell: (row: SaleRecord) => row.showTitle },
    { Header: 'Customer', accessor: 'customerName', Cell: (row: SaleRecord) => row.customerName },
    { Header: 'Seats', accessor: 'seats', Cell: (row: SaleRecord) => row.seats },
    { Header: 'Amount', accessor: 'totalAmount', Cell: (row: SaleRecord) => formatCurrency(row.totalAmount) },
    { Header: 'Payment', accessor: 'paymentMethod', Cell: (row: SaleRecord) => row.paymentMethod },
    { Header: 'Salesperson', accessor: 'salesperson', Cell: (row: SaleRecord) => row.salesperson },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales Report</h1>
            <p className="text-gray-500 mt-1">View and analyze ticket sales performance</p>
          </div>
          <ReusableButton onClick={exportToCSV} icon={Download} label="Export CSV" variant="primary" size="sm" />
        </div>

        {/* Filters Panel - Always Visible */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
            <Filter className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day (optional)</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Any Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day.toString()}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Ticket} label="Tickets Sold" value={formatNumber(totals.totalTickets)} color="from-blue-500 to-blue-600" />
          <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(totals.totalRevenue)} color="from-emerald-500 to-teal-600" />
          <StatCard icon={TrendingUp} label="Average Ticket" value={formatCurrency(totals.averageTicket)} color="from-purple-500 to-pink-500" />
          <StatCard icon={Users} label="Transactions" value={formatNumber(totals.totalTransactions)} color="from-orange-500 to-red-500" />
        </div>

        {/* Chart Section - Consistent with FinancialReports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-600" />
              Sales Trend {selectedYear && selectedMonth && selectedDay !== 'all'
                ? `- ${selectedMonth} ${selectedYear}`
                : selectedMonth
                ? `- ${selectedMonth} ${selectedYear}`
                : selectedYear
                ? `- ${selectedYear}`
                : '(All Years)'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" angle={-45} textAnchor="end" height={60} interval={0} stroke="#9ca3af" />
                <YAxis yAxisId="left" tickFormatter={(v) => formatCurrency(v)} stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                <Tooltip formatter={(value: any, name: string) => [
                  name === 'amount' ? formatCurrency(value) : `${value} tickets`,
                  name === 'amount' ? 'Revenue' : 'Tickets'
                ]} />
                <Legend />
                <Bar yAxisId="left" dataKey="amount" name="Revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="tickets" name="Tickets Sold" stroke="#f59e0b" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Salesperson */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-teal-600" />
              Revenue by Salesperson
            </h3>
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
                  labelLine={false}
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

        {/* Bar Chart for Tickets */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            Tickets Sold Detail
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" angle={-45} textAnchor="end" height={60} interval={0} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip formatter={(value) => [`${value} tickets`, 'Tickets']} />
              <Legend />
              <Bar dataKey="tickets" name="Tickets Sold" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Transactions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Transaction Details</h3>
            <p className="text-sm text-gray-500">Showing {filteredSales.length} transactions</p>
          </div>
          <div className="overflow-x-auto">
            <ReusableTable
              columns={transactionColumns}
              data={filteredSales}
              showSearch={true}
              showExport={false}
              showPrint={false}
              itemsPerPage={10}
            />
          </div>
        </div>

        {/* Export Success Popup */}
        <SuccessPopup
          isOpen={showExportPopup}
          onClose={() => setShowExportPopup(false)}
          type="success"
          title="Export Successful"
          message={`Sales report exported successfully.`}
          duration={3000}
          position="top-right"
        />
      </div>
    </div>
  );
};

// ===================== StatCard Component (matching FinancialReports styling) =====================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Report;