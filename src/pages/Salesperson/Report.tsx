import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Download,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Colors from '../../components/Reusable/Colors';
import ReusableshowFilterforall from '../../components/Reusable/ReusableshowFilterforall';

// Import only the four required components
import { AreaChart } from '../../components/Overview/AreaChart';
import { BarChart } from '../../components/Overview/BarChart';
import { Card, StatCard } from '../../components/Overview/Card';
import { DonutChart } from '../../components/Overview/PieChart';

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

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';
type PaymentStatus = 'all' | 'completed' | 'pending' | 'refunded';

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

const groupSalesByPeriod = (sales: SaleRecord[], period: Period): { label: string; amount: number; tickets: number }[] => {
  const groups: { [key: string]: { amount: number; tickets: number } } = {};

  sales.forEach(sale => {
    const saleDate = new Date(sale.saleDate);
    let key: string;

    switch (period) {
      case 'daily':
        key = saleDate.toLocaleDateString('en-CA');
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

const getUniqueSalespersons = (sales: SaleRecord[]): string[] => {
  const names = new Set(sales.map(s => s.salesperson));
  return Array.from(names).sort();
};

const getAvailableYears = (sales: SaleRecord[]): number[] => {
  const years = new Set<number>();
  sales.forEach(sale => {
    const year = new Date(sale.saleDate).getFullYear();
    years.add(year);
  });
  return Array.from(years).sort((a, b) => b - a);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// ===================== Main Component =====================
const Report: React.FC = () => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('daily');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [useDateRange, setUseDateRange] = useState(false);

  useEffect(() => {
    const loadSales = () => {
      try {
        const stored = localStorage.getItem('theater_sales_records');
        if (stored) {
          setSales(JSON.parse(stored));
        } else {
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

  const availableYears = useMemo(() => ['all', ...getAvailableYears(sales).map(y => y.toString())], [sales]);

  const filteredSales = useMemo(() => {
    let result = [...sales];

    if (useDateRange) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      result = result.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate >= start && saleDate <= end;
      });
    } else {
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

    if (selectedSalesperson !== 'all') {
      result = result.filter(sale => sale.salesperson === selectedSalesperson);
    }

    // Status filter placeholder
    if (selectedStatus !== 'all') {
      // Add status field logic if needed
    }

    return result;
  }, [sales, startDate, endDate, selectedSalesperson, selectedStatus, useDateRange, selectedYear, selectedMonth, selectedDay]);

  const chartData = useMemo(() => groupSalesByPeriod(filteredSales, period), [filteredSales, period]);
  const salespersons = useMemo(() => ['all', ...getUniqueSalespersons(sales)], [sales]);

  const totals = useMemo(() => {
    const totalTickets = filteredSales.reduce((sum, s) => sum + s.tickets.length, 0);
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalTransactions = filteredSales.length;
    const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    return { totalTickets, totalRevenue, totalTransactions, averageTicket };
  }, [filteredSales]);

  const salespersonPieData = useMemo(() => {
    const map = new Map<string, number>();
    filteredSales.forEach(sale => {
      map.set(sale.salesperson, (map.get(sale.salesperson) || 0) + sale.totalAmount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value, color: '' }));
  }, [filteredSales]);

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a'];

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
        
        </div>

        {/* Reusable Filter Component */}
        <ReusableshowFilterforall
          filterValues={filterValues}
          onUseDateRangeChange={(val) => setUseDateRange(val)}
          onStartDateChange={(date) => setStartDate(date)}
          onEndDateChange={(date) => setEndDate(date)}
          onSelectedYearChange={(year) => setSelectedYear(year)}
          onSelectedMonthChange={(month) => setSelectedMonth(month)}
          onSelectedDayChange={(day) => setSelectedDay(day)}
          onSelectedSalespersonChange={(person) => setSelectedSalesperson(person)}
          onSelectedStatusChange={(status) => setSelectedStatus(status as PaymentStatus)}
          salespersonOptions={salespersons}
          statusOptions={['all', 'completed', 'pending', 'refunded']}
          availableYears={availableYears}
          monthsList={MONTHS}
          showSalesperson={true}
          showStatus={false}
          showDateRangeToggle={true}
          showYearMonthDay={true}
        />

        {/* Stats Cards - using StatCard from Card component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Tickets Sold"
            value={totals.totalTickets}
            icon={Ticket}
            color="from-blue-500 to-blue-600"
            link="/salesperson/reports"  // optional link (no link needed)
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totals.totalRevenue)}
            icon={DollarSign}
            color="from-green-500 to-green-600"
            link="/salesperson/reports"
          />
          <StatCard
            title="Average Ticket"
            value={formatCurrency(totals.averageTicket)}
            icon={TrendingUp}
            color="from-purple-500 to-purple-600"
            link="/salesperson/reports"
          />
          <StatCard
            title="Transactions"
            value={totals.totalTransactions}
            icon={Users}
            color="from-orange-500 to-orange-600"
            link="/salesperson/reports"
          />
        </div>

        {/* Chart Section: AreaChart (Sales Trend) + DonutChart (Revenue by Salesperson) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title={`Sales Trend (${period})`} subtitle="Revenue and tickets over time">
            <AreaChart
              data={chartData}
              areas={[
                { dataKey: 'amount', name: 'Revenue ($)', color: Colors.primary || '#0d9488', gradient: true },
                { dataKey: 'tickets', name: 'Tickets Sold', color: '#f59e0b', gradient: true }
              ]}
              xAxisKey="label"
              yAxisLabel="Amount / Tickets"
              height={300}
              showGrid
              showLegend
            />
          </Card>

          <Card title="Revenue by Salesperson" subtitle="Distribution of revenue among sales staff">
            {salespersonPieData.length > 0 ? (
              <DonutChart
                data={salespersonPieData.map((item, idx) => ({
                  name: item.name,
                  value: item.value,
                  color: COLORS[idx % COLORS.length]
                }))}
                height={280}
                showLabels
              />
            ) : (
              <div className="text-center py-12 text-gray-500">No data available</div>
            )}
          </Card>
        </div>

        {/* BarChart: Tickets Sold per Period */}
        <div className="mb-6">
          <Card title="Tickets Sold per Period" subtitle={`Number of tickets sold by ${period}`}>
            <BarChart
              data={chartData}
              bars={[{ dataKey: 'tickets', name: 'Tickets Sold', color: Colors.primary || '#0d9488' }]}
              xAxisKey="label"
              height={300}
              showGrid
              showLegend
            />
          </Card>
        </div>

        {/* Detailed Table */}
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

export default Report;