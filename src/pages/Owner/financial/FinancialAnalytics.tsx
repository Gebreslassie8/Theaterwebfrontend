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
    Building as BuildingIcon
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

const topShows: ShowPerformance[] = [
    { id: '1', name: 'The Lion King', revenue: 245000, tickets: 11200, occupancy: 94 },
    { id: '2', name: 'Hamilton', revenue: 198000, tickets: 8900, occupancy: 98 },
    { id: '3', name: 'Wicked', revenue: 175000, tickets: 8200, occupancy: 89 },
    { id: '4', name: 'The Phantom', revenue: 142000, tickets: 6800, occupancy: 85 },
    { id: '5', name: 'Chicago', revenue: 125000, tickets: 6100, occupancy: 82 },
];

const paymentMethods: PaymentMethod[] = [
    { method: 'Mobile Money', amount: 780000, percentage: 30.2, color: Colors.skyTeal, icon: <Smartphone className="h-4 w-4" /> },
    { method: 'Cash', amount: 350000, percentage: 13.6, color: Colors.deepBlue, icon: <DollarSign className="h-4 w-4" /> },
    { method: 'Bank Transfer', amount: 198000, percentage: 7.7, color: Colors.deepAqua, icon: <BuildingIcon className="h-4 w-4" /> },
];

type PeriodType = 'daily' | 'monthly' | 'yearly';

const FinancialAnalytics: React.FC = () => {
    const [period, setPeriod] = useState<PeriodType>('monthly');
    const [isExporting, setIsExporting] = useState(false);

    const getData = (): RevenueData[] => {
        switch (period) {
            case 'daily': return generateDailyData();
            case 'monthly': return generateMonthlyData();
            case 'yearly': return generateYearlyData();
            default: return generateMonthlyData();
        }
    };

    const chartData = getData();
    
    const totals = useMemo(() => {
        const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
        const totalTickets = chartData.reduce((sum, d) => sum + d.tickets, 0);
        const avgTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;
        return { totalRevenue, totalTickets, avgTicketPrice };
    }, [chartData]);

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `ETB ${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `ETB ${(amount / 1000).toFixed(0)}K`;
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

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
                topShows: topShows,
                paymentMethods: paymentMethods,
                todaysRevenue: todaysRevenue,
                todaysTickets: todaysTickets
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

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">{getPeriodLabel()} financial overview and performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
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
                    <button
                        onClick={exportReport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                        {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Today's Revenue" 
                    value={formatFullCurrency(todaysRevenue)} 
                    icon={DollarSign} 
                    color="from-emerald-500 to-teal-600"
                />
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
                <StatCard 
                    title="Avg Ticket Price" 
                    value={formatFullCurrency(totals.avgTicketPrice)} 
                    icon={Wallet} 
                    color="from-orange-500 to-red-600"
                />
            </div>

            {/* Revenue Trends Chart */}
            <ChartCard 
                title="Revenue Trends"
                subtitle={`${getPeriodLabel()} revenue performance`}
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

            {/* Top Performing Shows */}
            <Card 
                title="Top Performing Shows"
                subtitle="Best performing shows by revenue and occupancy"
                showMoreLink="/owner/events"
                showMoreText="View All Shows"
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Show Name</th>
                                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Revenue</th>
                                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Tickets</th>
                                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Occupancy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topShows.map((show) => (
                                <tr key={show.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-3">
                                        <p className="text-sm font-medium text-gray-900">{show.name}</p>
                                    </td>
                                    <td className="py-3 px-3 text-right text-sm font-semibold text-gray-900">{formatFullCurrency(show.revenue)}</td>
                                    <td className="py-3 px-3 text-right text-sm text-gray-600">{formatNumber(show.tickets)}</td>
                                    <td className="py-3 px-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-sm text-gray-600">{show.occupancy}%</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${show.occupancy}%` }} />
                                            </div>
                                        </div>
                                     </td>
                                 </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Payment Methods & Key Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <Card title="Payment Methods" subtitle="Distribution of payment transactions">
                    <div className="space-y-3">
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
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                        className="h-1.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${method.percentage}%`, backgroundColor: method.color }} 
                                    />
                                </div>
                            </div>
                        ))}
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
                                    <p className="text-xs opacity-75">vs previous {getPeriodLabel().toLowerCase()}</p>
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
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-90">Peak Day</p>
                                    <p className="text-2xl font-bold">Saturday</p>
                                    <p className="text-xs opacity-75">Highest daily sales</p>
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