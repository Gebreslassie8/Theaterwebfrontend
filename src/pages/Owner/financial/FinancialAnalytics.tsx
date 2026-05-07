// src/pages/Owner/financial/FinancialAnalytics.tsx
import React, { useState, useMemo } from 'react';
import {
    DollarSign,
    TrendingUp,
    Download,
    Wallet,
    Ticket,
    Target,
    Users,
    RefreshCw,
    Smartphone,
    Building as BuildingIcon,
    Search,
    Calendar,
    Filter,
    X,
    ChevronDown,
    CalendarRange
} from 'lucide-react';
// Import Overview components
import { Card, StatCard, ChartCard } from '../../../components/Overview/Card';
import { AreaChart } from '../../../components/Overview/AreaChart';
import Colors from '../../../components/Reusable/Colors';

// Types
interface RevenueData {
    period: string;
    revenue: number;
    tickets: number;
}

interface EventPerformance {
    id: string;
    name: string;
    revenue: number;
    tickets: number;
    occupancy: number;
    hall?: string;
    date?: string;
}

interface PaymentMethod {
    method: string;
    amount: number;
    percentage: number;
    color: string;
    icon?: React.ReactNode;
}

// Mock Data Generators
const generateDailyData = (): RevenueData[] => {
    return [
        { period: 'Mon', revenue: 32450, tickets: 156 },
        { period: 'Tue', revenue: 28900, tickets: 142 },
        { period: 'Wed', revenue: 35600, tickets: 178 },
        { period: 'Thu', revenue: 41200, tickets: 195 },
        { period: 'Fri', revenue: 52300, tickets: 245 },
        { period: 'Sat', revenue: 67800, tickets: 312 },
        { period: 'Sun', revenue: 58900, tickets: 278 },
    ];
};

const generateMonthlyData = (): RevenueData[] => {
    return [
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
};

const generateYearlyData = (): RevenueData[] => {
    return [
        { period: '2020', revenue: 1850000, tickets: 88500 },
        { period: '2021', revenue: 2120000, tickets: 99800 },
        { period: '2022', revenue: 1980000, tickets: 94100 },
        { period: '2023', revenue: 2350000, tickets: 111500 },
        { period: '2024', revenue: 2680000, tickets: 128200 },
    ];
};

// Today's Revenue
const todaysRevenue = 67800;
const todaysTickets = 312;

const topEvents: EventPerformance[] = [
    { id: '1', name: 'The Lion King', revenue: 245000, tickets: 11200, occupancy: 94, hall: 'Grand Hall', date: '2024-06-15' },
    { id: '2', name: 'Hamilton', revenue: 198000, tickets: 8900, occupancy: 98, hall: 'Blue Hall', date: '2024-07-20' },
    { id: '3', name: 'Wicked', revenue: 175000, tickets: 8200, occupancy: 89, hall: 'Grand Hall', date: '2024-08-10' },
    { id: '4', name: 'The Phantom', revenue: 142000, tickets: 6800, occupancy: 85, hall: 'IMAX Hall', date: '2024-06-01' },
    { id: '5', name: 'Chicago', revenue: 125000, tickets: 6100, occupancy: 82, hall: 'West Hall', date: '2024-09-15' },
];

const paymentMethods: PaymentMethod[] = [
    { method: 'Mobile Money', amount: 1250000, percentage: 65.2, color: Colors.skyTeal, icon: <Smartphone className="h-4 w-4" /> },
    { method: 'Cash', amount: 668000, percentage: 34.8, color: Colors.deepBlue, icon: <Wallet className="h-4 w-4" /> },
];

type PeriodType = 'daily' | 'monthly' | 'yearly' | 'custom';

interface DateRange {
    from: string;
    to: string;
}

// Advanced Filter Component
const AdvancedFilter: React.FC<{
    period: PeriodType;
    onPeriodChange: (period: PeriodType) => void;
    dateRange: DateRange;
    onDateRangeChange: (range: DateRange) => void;
    selectedEvent: string;
    onEventSelect: (eventId: string) => void;
    onReset: () => void;
    events: { id: string; name: string }[];
}> = ({ period, onPeriodChange, dateRange, onDateRangeChange, selectedEvent, onEventSelect, onReset, events }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showEventDropdown, setShowEventDropdown] = useState(false);

    const selectedEventName = events.find(e => e.id === selectedEvent)?.name || 'All Events';

    return (
        <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
            <div className="flex flex-col gap-4">
                {/* Period Selection Buttons */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Period</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'daily' as PeriodType, label: 'Daily', icon: Calendar },
                            { id: 'monthly' as PeriodType, label: 'Monthly', icon: Calendar },
                            { id: 'yearly' as PeriodType, label: 'Yearly', icon: Calendar },
                            { id: 'custom' as PeriodType, label: 'Custom Range', icon: CalendarRange }
                        ].map((p) => (
                            <button
                                key={p.id}
                                onClick={() => onPeriodChange(p.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    period === p.id 
                                        ? 'bg-teal-600 text-white shadow-md' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <p.icon className="h-4 w-4" />
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Date Range Picker */}
                {period === 'custom' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>
                )}

                {/* Event Filter */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Event</label>
                    <button
                        onClick={() => setShowEventDropdown(!showEventDropdown)}
                        className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <span>{selectedEventName}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showEventDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showEventDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="p-2 max-h-60 overflow-y-auto">
                                <button
                                    onClick={() => {
                                        onEventSelect('');
                                        setShowEventDropdown(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                        selectedEvent === '' 
                                            ? 'bg-teal-50 text-teal-700' 
                                            : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    All Events
                                </button>
                                {events.map(event => (
                                    <button
                                        key={event.id}
                                        onClick={() => {
                                            onEventSelect(event.id);
                                            setShowEventDropdown(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                            selectedEvent === event.id 
                                                ? 'bg-teal-50 text-teal-700' 
                                                : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        {event.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Reset Button */}
                {(selectedEvent || period !== 'monthly') && (
                    <div className="flex justify-end">
                        <button
                            onClick={onReset}
                            className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                        >
                            <X className="h-4 w-4" />
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const FinancialAnalytics: React.FC = () => {
    const [period, setPeriod] = useState<PeriodType>('monthly');
    const [isExporting, setIsExporting] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });

    const getData = (): RevenueData[] => {
        switch (period) {
            case 'daily': return generateDailyData();
            case 'monthly': return generateMonthlyData();
            case 'yearly': return generateYearlyData();
            case 'custom': return generateCustomRangeData(dateRange);
            default: return generateMonthlyData();
        }
    };

    // Generate custom range data based on date range
    const generateCustomRangeData = (range: DateRange): RevenueData[] => {
        const start = new Date(range.from);
        const end = new Date(range.to);
        const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 31) {
            // Daily data
            const data: RevenueData[] = [];
            for (let i = 0; i <= diffDays; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                data.push({
                    period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    revenue: Math.floor(30000 + Math.random() * 40000),
                    tickets: Math.floor(150 + Math.random() * 200)
                });
            }
            return data;
        } else if (diffDays <= 365) {
            // Monthly data
            const monthlyData: { [key: string]: { revenue: number; tickets: number } } = {};
            for (let i = 0; i <= diffDays; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = { revenue: 0, tickets: 0 };
                }
                monthlyData[monthKey].revenue += Math.floor(1000 + Math.random() * 5000);
                monthlyData[monthKey].tickets += Math.floor(5 + Math.random() * 30);
            }
            return Object.entries(monthlyData).map(([period, data]) => ({
                period,
                revenue: data.revenue,
                tickets: data.tickets
            }));
        } else {
            // Yearly data
            const yearlyData: { [key: string]: { revenue: number; tickets: number } } = {};
            for (let i = 0; i <= diffDays; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                const yearKey = date.getFullYear().toString();
                if (!yearlyData[yearKey]) {
                    yearlyData[yearKey] = { revenue: 0, tickets: 0 };
                }
                yearlyData[yearKey].revenue += Math.floor(5000 + Math.random() * 20000);
                yearlyData[yearKey].tickets += Math.floor(20 + Math.random() * 100);
            }
            return Object.entries(yearlyData).map(([period, data]) => ({
                period,
                revenue: data.revenue,
                tickets: data.tickets
            }));
        }
    };

    const chartData = getData();
    
    const totals = useMemo(() => {
        const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
        const totalTickets = chartData.reduce((sum, d) => sum + d.tickets, 0);
        const avgTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;
        return { totalRevenue, totalTickets, avgTicketPrice };
    }, [chartData]);

    const formatFullCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const getPeriodLabel = () => {
        switch (period) {
            case 'daily': return 'Daily';
            case 'monthly': return 'Monthly';
            case 'yearly': return 'Yearly';
            case 'custom': return `Custom (${dateRange.from} to ${dateRange.to})`;
            default: return 'Monthly';
        }
    };

    const exportReport = async () => {
        setIsExporting(true);
        setTimeout(() => {
            const reportData = {
                period: getPeriodLabel(),
                generatedAt: new Date().toISOString(),
                data: chartData,
                totals: totals,
                topEvents: topEvents,
                paymentMethods: paymentMethods,
                todaysRevenue: todaysRevenue,
                todaysTickets: todaysTickets,
                selectedEventId: selectedEventId,
                dateRange: period === 'custom' ? dateRange : null
            };
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `financial_report_${period}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setIsExporting(false);
            alert('Report exported successfully!');
        }, 1500);
    };

    const handleEventSelect = (eventId: string) => {
        setSelectedEventId(eventId);
    };

    const handleResetFilter = () => {
        setSelectedEventId('');
        setPeriod('monthly');
        setDateRange({
            from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0]
        });
    };

    // Filter events based on selection
    const filteredEvents = useMemo(() => {
        if (!selectedEventId) return topEvents;
        return topEvents.filter(event => event.id === selectedEventId);
    }, [selectedEventId]);

    // Prepare events data for the filter
    const eventsForFilter = useMemo(() => {
        return topEvents.map(event => ({ id: event.id, name: event.name }));
    }, []);

    // Calculate payment method totals
    const paymentTotals = useMemo(() => {
        const total = paymentMethods.reduce((sum, m) => sum + m.amount, 0);
        return { total };
    }, []);

    const selectedEventName = eventsForFilter.find(e => e.id === selectedEventId)?.name || '';

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">{getPeriodLabel()} financial overview and performance metrics</p>
                </div>
                <button
                    onClick={exportReport}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                    {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Export Report
                </button>
            </div>

            {/* Advanced Filter with Daily, Monthly, Yearly, and Date Range */}
            <AdvancedFilter
                period={period}
                onPeriodChange={setPeriod}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                selectedEvent={selectedEventId}
                onEventSelect={handleEventSelect}
                onReset={handleResetFilter}
                events={eventsForFilter}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm font-medium">Today's Revenue</p>
                            <p className="text-3xl font-bold mt-2">ETB {todaysRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <StatCard 
                    title="Total Revenue" 
                    value={formatFullCurrency(totals.totalRevenue)} 
                    icon={TrendingUp} 
                    color="from-blue-500 to-cyan-600"
                />
                <StatCard 
                    title="Tickets Sold" 
                    value={formatNumber(totals.totalTickets)} 
                    icon={Ticket} 
                    color="from-purple-500 to-pink-600"
                />
            </div>

            {/* Revenue Trends Chart */}
            <ChartCard 
                title="Revenue Trends"
                subtitle={`${getPeriodLabel()} revenue performance - Total: ${formatFullCurrency(totals.totalRevenue)}`}
                actions={
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: Colors.deepTeal }} />
                        <span className="text-xs text-gray-600">Revenue</span>
                    </div>
                }
            >
                <AreaChart
                    data={chartData}
                    areas={[
                        { dataKey: 'revenue', name: 'Revenue', color: Colors.deepTeal, gradient: 'teal' }
                    ]}
                    xAxisKey="period"
                    yAxisLabel="Revenue (ETB)"
                    height={350}
                />
            </ChartCard>

            {/* Top Performing Events */}
            <Card 
                title="Top Performing Events"
                subtitle={selectedEventId ? `Filtered: ${selectedEventName}` : "Best performing events by revenue and occupancy"}
                showMoreLink="/owner/events"
                showMoreText="View All Events"
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Event Name</th>
                                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Hall</th>
                                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Date</th>
                                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Revenue</th>
                                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Tickets</th>
                                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Occupancy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-3">
                                        <p className="text-sm font-medium text-gray-900">{event.name}</p>
                                    </td>
                                    <td className="py-3 px-3">
                                        <p className="text-sm text-gray-600">{event.hall}</p>
                                    </td>
                                    <td className="py-3 px-3">
                                        <p className="text-sm text-gray-600">{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
                                    </td>
                                    <td className="py-3 px-3 text-right text-sm font-semibold text-gray-900">{formatFullCurrency(event.revenue)}</td>
                                    <td className="py-3 px-3 text-right text-sm text-gray-600">{formatNumber(event.tickets)}</td>
                                    <td className="py-3 px-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-sm text-gray-600">{event.occupancy}%</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${event.occupancy}%` }} />
                                            </div>
                                        </div>
                                     </td>
                                 </tr>
                            ))}
                            {filteredEvents.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        No events found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Payment Methods & Key Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <Card title="Payment Methods" subtitle="Distribution of payment transactions">
                    <div className="space-y-4">
                        {paymentMethods.map((method, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 rounded" style={{ backgroundColor: `${method.color}20` }}>
                                            <div style={{ color: method.color }}>{method.icon}</div>
                                        </div>
                                        <span className="text-gray-600">{method.method}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-gray-900">{formatFullCurrency(method.amount)}</span>
                                        <span className="text-gray-500">{method.percentage}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="h-2 rounded-full transition-all duration-500" 
                                        style={{ width: `${method.percentage}%`, backgroundColor: method.color }} 
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="pt-3 mt-2 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Total</span>
                                <span className="font-bold text-gray-900">{formatFullCurrency(paymentTotals.total)}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Key Insights */}
                <Card variant="gradient" color="teal">
                    <div className="text-white">
                        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-90">Revenue Growth</p>
                                    <p className="text-2xl font-bold">+18.5%</p>
                                    <p className="text-xs opacity-75">vs previous {period === 'custom' ? 'period' : getPeriodLabel().toLowerCase()}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Target className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-90">Best Performance</p>
                                    <p className="text-2xl font-bold">December</p>
                                    <p className="text-xs opacity-75">Highest revenue month</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Smartphone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-90">Top Payment</p>
                                    <p className="text-2xl font-bold">Mobile Money</p>
                                    <p className="text-xs opacity-75">65.2% of transactions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Simple Footer */}
            <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-500">
                    Data updates in real-time | Last sync: {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default FinancialAnalytics;