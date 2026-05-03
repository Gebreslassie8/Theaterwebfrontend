import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, TrendingUp, Ticket, Calendar, Download, Filter,
    ArrowRight, Wallet, CreditCard, PieChart, BarChart3,
    Target, Users, RefreshCw, Clock, Building
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { SaleRecord, loadSalesHistory } from './SellTickets';

// ----- Types -----
interface RevenueData {
    period: string;
    revenue: number;
    tickets: number;
}

interface RevenueSource {
    name: string;
    value: number;
    color: string;
    percentage: number;
}

interface ShowPerformance {
    id: string;
    name: string;
    revenue: number;
    tickets: number;
    occupancy: number;
}

interface PaymentMethod {
    method: string;
    amount: number;
    percentage: number;
    color: string;
}

type PeriodType = 'daily' | 'monthly' | 'yearly';

// ----- Helper Functions -----
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

// ----- Main Component -----
const ReportAnalysis: React.FC = () => {
    const [sales, setSales] = useState<SaleRecord[]>([]);
    const [period, setPeriod] = useState<PeriodType>('monthly');
    const [isExporting, setIsExporting] = useState(false);

    // Load sales data
    useEffect(() => {
        const allSales = loadSalesHistory();
        // sort by saleDate descending
        const sorted = [...allSales].sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
        setSales(sorted);
    }, []);

    // --- Aggregated data based on period ---
    const getGroupedData = (): RevenueData[] => {
        if (sales.length === 0) return [];

        const now = new Date();
        let startDate: Date;
        let format: (d: Date) => string;

        switch (period) {
            case 'daily':
                // last 7 days (including today)
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 6);
                format = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short' });
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // last 12 months
                format = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' });
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear() - 4, 0, 1); // last 5 years
                format = (d: Date) => d.getFullYear().toString();
                break;
        }

        // Initialize map for all periods in range
        const dataMap = new Map<string, RevenueData>();
        let current = new Date(startDate);
        while (current <= now) {
            let key: string;
            if (period === 'daily') key = format(current);
            else if (period === 'monthly') key = format(current);
            else key = current.getFullYear().toString();

            dataMap.set(key, { period: key, revenue: 0, tickets: 0 });
            if (period === 'daily') current.setDate(current.getDate() + 1);
            else if (period === 'monthly') current.setMonth(current.getMonth() + 1);
            else current.setFullYear(current.getFullYear() + 1);
        }

        // Aggregate sales
        sales.forEach(sale => {
            const saleDate = new Date(sale.saleDate);
            let key: string;
            if (period === 'daily') key = saleDate.toLocaleDateString('en-US', { weekday: 'short' });
            else if (period === 'monthly') key = saleDate.toLocaleDateString('en-US', { month: 'short' });
            else key = saleDate.getFullYear().toString();

            const existing = dataMap.get(key);
            if (existing) {
                existing.revenue += sale.totalAmount;
                existing.tickets += sale.seats.length;
            }
        });

        // Convert to array and preserve order
        return Array.from(dataMap.values());
    };

    const chartData = getGroupedData();

    // Totals for the selected period
    const totals = useMemo(() => {
        const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
        const totalTickets = chartData.reduce((sum, d) => sum + d.tickets, 0);
        const avgTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;
        return { totalRevenue, totalTickets, avgTicketPrice };
    }, [chartData]);

    // Today's revenue (for the current date)
    const todayStr = new Date().toISOString().slice(0, 10);
    const todaysSales = sales.filter(s => s.saleDate.slice(0, 10) === todayStr);
    const todaysRevenue = todaysSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const todaysTickets = todaysSales.reduce((sum, s) => sum + s.seats.length, 0);

    // Revenue sources (Ticket Sales only, since only tickets are sold)
    const totalRevenueAll = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const revenueSources: RevenueSource[] = [
        { name: 'Ticket Sales', value: totalRevenueAll, percentage: 100, color: '#14b8a6' }
    ];

    // Top shows (by revenue)
    const showRevenueMap = new Map<string, { revenue: number; tickets: number; showDate?: string }>();
    sales.forEach(sale => {
        const existing = showRevenueMap.get(sale.showTitle);
        if (existing) {
            existing.revenue += sale.totalAmount;
            existing.tickets += sale.seats.length;
        } else {
            showRevenueMap.set(sale.showTitle, { revenue: sale.totalAmount, tickets: sale.seats.length, showDate: sale.showDate });
        }
    });
    const topShows: ShowPerformance[] = Array.from(showRevenueMap.entries())
        .map(([name, data]) => ({
            id: name.replace(/\s/g, '_'),
            name,
            revenue: data.revenue,
            tickets: data.tickets,
            occupancy: 0 // We don't have total seat capacity per show; keep 0 or compute if needed
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    // Payment methods from sales
    const paymentMap = new Map<string, number>();
    sales.forEach(sale => {
        const method = sale.paymentMethod === 'cash' ? 'Cash' : 'Card';
        paymentMap.set(method, (paymentMap.get(method) || 0) + sale.totalAmount);
    });
    const paymentMethods: PaymentMethod[] = Array.from(paymentMap.entries()).map(([method, amount]) => ({
        method,
        amount,
        percentage: totalRevenueAll ? (amount / totalRevenueAll) * 100 : 0,
        color: method === 'Cash' ? '#3b82f6' : '#f59e0b'
    }));

    // Revenue growth (compare last two periods)
    const growth = (() => {
        if (chartData.length < 2) return 0;
        const last = chartData[chartData.length - 1].revenue;
        const prev = chartData[chartData.length - 2].revenue;
        if (prev === 0) return 0;
        return ((last - prev) / prev) * 100;
    })();

    const bestPeriod = chartData.reduce((max, d) => d.revenue > max.revenue ? d : max, chartData[0] || { period: '', revenue: 0 }).period;
    const avgDailyRevenue = chartData.length ? totals.totalRevenue / chartData.length : 0;

    const getPeriodLabel = () => {
        switch (period) {
            case 'daily': return 'Daily';
            case 'monthly': return 'Monthly';
            case 'yearly': return 'Yearly';
        }
    };

    const exportReport = async () => {
        setIsExporting(true);
        setTimeout(() => {
            const reportData = {
                period: getPeriodLabel(),
                generatedAt: new Date().toISOString(),
                data: chartData,
                totals,
                revenueSources,
                topShows,
                paymentMethods,
                todaysRevenue,
                todaysTickets
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

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-xs">
                    <p className="font-semibold text-gray-900 mb-1">{label}</p>
                    {payload.map((p: any, idx: number) => (
                        <p key={idx} className="text-xs" style={{ color: p.color }}>
                            {p.name}: {formatCurrency(p.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Stat Card Component
    const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 mb-1">{title}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">{getPeriodLabel()} financial overview and performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Period Selector */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {[
                            { id: 'daily' as PeriodType, label: 'Daily' },
                            { id: 'monthly' as PeriodType, label: 'Monthly' },
                            { id: 'yearly' as PeriodType, label: 'Yearly' }
                        ].map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                                    period === p.id
                                        ? 'bg-teal-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={exportReport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                        {isExporting ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Today's Revenue"
                    value={formatCurrency(todaysRevenue)}
                    icon={DollarSign}
                    color="from-emerald-500 to-teal-600"
                    subtitle={`${todaysTickets} tickets today`}
                />
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(totals.totalRevenue)}
                    icon={TrendingUp}
                    color="from-blue-500 to-cyan-600"
                    subtitle={`${getPeriodLabel()} total`}
                />
                <StatCard
                    title="Tickets Sold"
                    value={formatNumber(totals.totalTickets)}
                    icon={Ticket}
                    color="from-purple-500 to-pink-600"
                    subtitle={`${getPeriodLabel()} total`}
                />
                <StatCard
                    title="Avg Ticket Price"
                    value={formatCurrency(totals.avgTicketPrice)}
                    icon={Wallet}
                    color="from-orange-500 to-red-600"
                />
            </div>

            {/* Revenue Trends Chart */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                        <p className="text-sm text-gray-500">{getPeriodLabel()} revenue performance</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-teal-500" />
                        <span className="text-xs text-gray-600">Revenue</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                        <XAxis dataKey="period" stroke="#6B7280" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#6B7280" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} fill="url(#revenueGrad)" name="Revenue" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue Sources (only Ticket Sales) */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={250}>
                        <RePieChart>
                            <Pie
                                data={revenueSources}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {revenueSources.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        </RePieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3">
                        {revenueSources.map((source, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                                    <span className="text-gray-600">{source.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-gray-900">{formatCurrency(source.value)}</span>
                                    <span className="text-gray-500">{source.percentage}%</span>
                                </div>
                            </div>
                        ))}
                        <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-sm font-semibold">
                                <span className="text-gray-900">Total Revenue</span>
                                <span className="text-teal-600">{formatCurrency(totalRevenueAll)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performing Shows */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Top Performing Shows</h3>
                        <p className="text-sm text-gray-500">Best performing shows by revenue</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Show Name</th>
                                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Revenue</th>
                                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Tickets</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topShows.map((show) => (
                                <tr key={show.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-3">
                                        <p className="text-sm font-medium text-gray-900">{show.name}</p>
                                    </td>
                                    <td className="py-3 px-3 text-right text-sm font-semibold text-gray-900">{formatCurrency(show.revenue)}</td>
                                    <td className="py-3 px-3 text-right text-sm text-gray-600">{formatNumber(show.tickets)}</td>
                                </tr>
                            ))}
                            {topShows.length === 0 && (
                                <tr><td colSpan={3} className="text-center py-4 text-gray-500">No sales data available</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Methods & Key Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                        {paymentMethods.map((method, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                                        <span className="text-gray-600">{method.method}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-gray-900">{formatCurrency(method.amount)}</span>
                                        <span className="text-gray-500">{method.percentage.toFixed(1)}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${method.percentage}%`, backgroundColor: method.color }}
                                    />
                                </div>
                            </div>
                        ))}
                        {paymentMethods.length === 0 && <div className="text-center text-gray-500">No payment data</div>}
                    </div>
                </div>

                {/* Key Insights */}
                <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-4 md:p-6 shadow-lg text-white">
                    <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Revenue Growth</p>
                                <p className="text-2xl font-bold">{growth >= 0 ? '+' : ''}{growth.toFixed(1)}%</p>
                                <p className="text-xs opacity-75">vs previous {getPeriodLabel().toLowerCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Target className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Best Period</p>
                                <p className="text-2xl font-bold">{bestPeriod || 'N/A'}</p>
                                <p className="text-xs opacity-75">Highest revenue {getPeriodLabel().toLowerCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Most Popular Show</p>
                                <p className="text-2xl font-bold">{topShows[0]?.name || 'N/A'}</p>
                                <p className="text-xs opacity-75">Highest revenue</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Best Period</p>
                        <p className="text-base font-bold text-gray-900">{bestPeriod || '—'}</p>
                        <p className="text-xs text-teal-600">Peak performance</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Top Show</p>
                        <p className="text-base font-bold text-gray-900">{topShows[0]?.name || '—'}</p>
                        <p className="text-xs text-teal-600">{formatCurrency(topShows[0]?.revenue || 0)} revenue</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Avg Daily Revenue</p>
                        <p className="text-base font-bold text-gray-900">{formatCurrency(avgDailyRevenue)}</p>
                        <p className="text-xs text-gray-500">Per {getPeriodLabel().toLowerCase()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
                        <p className="text-base font-bold text-gray-900">{sales.length}</p>
                        <p className="text-xs text-gray-500">All time</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportAnalysis;