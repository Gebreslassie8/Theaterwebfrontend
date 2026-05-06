// src/pages/owner/ViewReports.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, TrendingDown, DollarSign, Ticket, Users, Calendar,
    Download, Filter, RefreshCw, Eye, ArrowUpDown, ChevronLeft, ChevronRight,
    Activity, AlertCircle, Loader2, X, Zap, Building2
} from 'lucide-react';
import {
    PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Area, ComposedChart
} from 'recharts';

// ============ Types ============
type TimeRange = 'today' | 'week' | 'month' | 'quarter' | 'year';
type EventStatus = 'active' | 'completed' | 'cancelled';
type SortBy = 'revenue' | 'tickets' | 'date' | 'occupancy';
type SortOrder = 'asc' | 'desc';
type StaffRole = 'manager' | 'scanner' | 'salesperson';
type StaffStatus = 'active' | 'inactive' | 'on-leave';

interface EventPerformance {
    id: string;
    name: string;
    date: string;
    ticketsSold: number;
    totalTickets: number;
    revenue: number;
    occupancyRate: number;
    category: string;
    status: EventStatus;
    hallName: string;
}

interface DailyRevenue {
    date: string;
    revenue: number;
    ticketsSold: number;
}

interface FilterOptions {
    timeRange: TimeRange;
    eventCategory: string;
    status: 'all' | EventStatus;
    sortBy: SortBy;
    sortOrder: SortOrder;
    selectedHall: string;
}

interface Hall {
    id: string;
    name: string;
}

interface CategoryData {
    category: string;
    revenue: number;
    percentage: number;
    color: string;
}

interface Totals {
    totalRevenue: number;
    totalTickets: number;
    totalEvents: number;
    avgTicketPrice: number;
    revenueGrowth: number;
    ticketGrowth: number;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.FC<{ className?: string }>;
    color: string;
    trend?: number;
}

// ============ Constants ============
const TIME_RANGES: readonly { label: string; value: TimeRange }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Quarter", value: "quarter" },
    { label: "This Year", value: "year" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
    "Theater": "#14b8a6",
    "Concert": "#3b82f6",
    "Sports": "#f59e0b",
    "Conference": "#8b5cf6",
    "Festival": "#ef4444",
    "Comedy": "#ec4899",
    "Exhibition": "#06b6d4",
    "Default": "#6b7280",
};

const HALLS: readonly Hall[] = [
    { id: "hall-1", name: "Main Hall" },
    { id: "hall-2", name: "Blue Hall" },
    { id: "hall-3", name: "Green Hall" },
    { id: "hall-4", name: "VIP Hall" },
] as const;

// ============ Helper Functions ============
const formatDateOnly = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

const getEventCount = (timeRange: TimeRange): number => {
    const counts: Record<TimeRange, number> = {
        today: 3,
        week: 8,
        month: 15,
        quarter: 25,
        year: 40
    };
    return counts[timeRange];
};

// ============ Mock Data Generators ============
const generateMockEvents = (timeRange: TimeRange, hallId: string): EventPerformance[] => {
    const categories = ["Theater", "Concert", "Sports", "Conference", "Festival", "Comedy", "Exhibition"];
    const eventCount = getEventCount(timeRange);
    const events: EventPerformance[] = [];
    const selectedHalls = hallId === "all" ? [...HALLS] : HALLS.filter(h => h.id === hallId);
    
    if (selectedHalls.length === 0) return [];
    
    for (let i = 0; i < eventCount; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const totalTickets = 500 + Math.floor(Math.random() * 1500);
        const ticketsSold = Math.floor(totalTickets * (0.3 + Math.random() * 0.6));
        const revenue = ticketsSold * (10 + Math.random() * 15);
        const date = new Date();
        
        const daysAgo = timeRange === 'month' 
            ? Math.floor(Math.random() * 30) 
            : timeRange === 'week' 
                ? Math.floor(Math.random() * 7)
                : Math.floor(Math.random() * 14);
        date.setDate(date.getDate() - daysAgo);
        
        const status: EventStatus = date > new Date() ? "active" : "completed";
        const hall = selectedHalls[Math.floor(Math.random() * selectedHalls.length)];
        
        events.push({
            id: `event-${i}`,
            name: `${category} Event ${i + 1}`,
            date: date.toISOString(),
            ticketsSold,
            totalTickets,
            revenue,
            occupancyRate: (ticketsSold / totalTickets) * 100,
            category,
            status,
            hallName: hall.name,
        });
    }
    
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateMockDailyRevenue = (timeRange: TimeRange, hallId: string): DailyRevenue[] => {
    const dayCounts: Record<TimeRange, number> = {
        today: 1,
        week: 7,
        month: 30,
        quarter: 90,
        year: 365
    };
    const days = dayCounts[timeRange];
    const hallMultipliers: Record<string, number> = {
        "hall-1": 1.0,
        "hall-2": 0.7,
        "hall-3": 0.5,
        "hall-4": 0.3,
        "all": 1.0,
    };
    const hallMultiplier = hallMultipliers[hallId] ?? 1.0;
    const data: DailyRevenue[] = [];
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const baseRevenue = 2000 + Math.random() * 5000;
        const growthFactor = 1 + (days - i) / days * 0.3;
        const revenue = Math.floor(baseRevenue * growthFactor * hallMultiplier);
        
        data.push({
            date: date.toISOString(),
            revenue,
            ticketsSold: Math.floor(revenue / 15),
        });
    }
    return data;
};

// ============ Components ============
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-500 mb-1">{title}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                {trend !== undefined && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(trend).toFixed(1)}%
                    </p>
                )}
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
        </div>
    </div>
);

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-xs">
                <p className="font-semibold text-gray-900 mb-1">{label}</p>
                {payload.map((p, idx) => (
                    <p key={idx} className="text-xs" style={{ color: p.color }}>
                        {p.name}: {p.name === "Revenue" ? formatCurrency(p.value) : formatNumber(p.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ============ Main Component ============
const ViewReports: React.FC = () => {
    const navigate = useNavigate();
    
    // State
    const [events, setEvents] = useState<EventPerformance[]>([]);
    const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<FilterOptions>({
        timeRange: "month",
        eventCategory: "all",
        status: "all",
        sortBy: "revenue",
        sortOrder: "desc",
        selectedHall: "all",
    });
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    
    const itemsPerPage: number = 10;

    // Derived values
    const getPeriodLabel = (): string => {
        const labels: Record<TimeRange, string> = {
            today: 'Today',
            week: 'This Week',
            month: 'This Month',
            quarter: 'This Quarter',
            year: 'This Year'
        };
        return labels[filters.timeRange];
    };

    const getSelectedHallName = (): string => {
        if (filters.selectedHall === "all") return "All Halls";
        const hall = HALLS.find(h => h.id === filters.selectedHall);
        return hall?.name ?? "All Halls";
    };

    // Fetch data
    const fetchData = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let mockEvents = generateMockEvents(filters.timeRange, filters.selectedHall);
        
        if (filters.eventCategory !== "all") {
            mockEvents = mockEvents.filter(e => e.category === filters.eventCategory);
        }
        if (filters.status !== "all") {
            mockEvents = mockEvents.filter(e => e.status === filters.status);
        }
        
        setEvents(mockEvents);
        setDailyRevenue(generateMockDailyRevenue(filters.timeRange, filters.selectedHall));
        setIsLoading(false);
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Calculate totals
    const totals: Totals = useMemo(() => {
        const totalRevenue = events.reduce((sum, e) => sum + e.revenue, 0);
        const totalTickets = events.reduce((sum, e) => sum + e.ticketsSold, 0);
        const totalEvents = events.length;
        const avgTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;
        
        return {
            totalRevenue,
            totalTickets,
            totalEvents,
            avgTicketPrice,
            revenueGrowth: 15.5,
            ticketGrowth: 12.3,
        };
    }, [events]);

    // Sort and paginate events
    const sortedEvents = useMemo(() => {
        const sorted = [...events].sort((a, b) => {
            let aVal: number | string | Date = a[filters.sortBy];
            let bVal: number | string | Date = b[filters.sortBy];
            
            if (filters.sortBy === 'date') {
                aVal = new Date(a.date).getTime();
                bVal = new Date(b.date).getTime();
            } else if (filters.sortBy === 'revenue' || filters.sortBy === 'tickets' || filters.sortBy === 'occupancy') {
                aVal = a[filters.sortBy] as number;
                bVal = b[filters.sortBy] as number;
            }
            
            if (filters.sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        const start = (currentPage - 1) * itemsPerPage;
        return {
            items: sorted.slice(start, start + itemsPerPage),
            totalPages: Math.ceil(sorted.length / itemsPerPage),
        };
    }, [events, filters, currentPage, itemsPerPage]);

    // Chart data
    const chartData = useMemo(() => {
        return dailyRevenue.map(day => ({
            date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: day.revenue,
            ticketsSold: day.ticketsSold,
        }));
    }, [dailyRevenue]);

    // Category data for pie chart
    const categoryData: CategoryData[] = useMemo(() => {
        const map = new Map<string, number>();
        events.forEach(e => {
            map.set(e.category, (map.get(e.category) || 0) + e.revenue);
        });
        const total = totals.totalRevenue;
        
        return Array.from(map.entries()).map(([category, revenue]) => ({
            category,
            revenue,
            percentage: total > 0 ? (revenue / total) * 100 : 0,
            color: CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Default,
        }));
    }, [events, totals.totalRevenue]);

    // Export to CSV
    const exportCSV = (): void => {
        setIsExporting(true);
        
        const headers = ['Event Name', 'Hall', 'Date', 'Category', 'Tickets Sold', 'Total Tickets', 'Occupancy', 'Revenue', 'Status'];
        const rows = events.map(e => [
            e.name,
            e.hallName,
            formatDateOnly(new Date(e.date)),
            e.category,
            e.ticketsSold.toString(),
            e.totalTickets.toString(),
            `${e.occupancyRate.toFixed(1)}%`,
            formatCurrency(e.revenue),
            e.status
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `report_${getPeriodLabel().toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setIsExporting(false);
    };

    // Handle filter changes
    const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]): void => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                    <p className="text-sm text-gray-500">
                        {getPeriodLabel()} performance metrics for {getSelectedHallName()}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    <button
                        onClick={exportCSV}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                        {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">Filters</h3>
                        <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <select
                            value={filters.selectedHall}
                            onChange={(e) => updateFilter('selectedHall', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="all">All Halls</option>
                            {HALLS.map(hall => (
                                <option key={hall.id} value={hall.id}>{hall.name}</option>
                            ))}
                        </select>
                        
                        <select
                            value={filters.timeRange}
                            onChange={(e) => updateFilter('timeRange', e.target.value as TimeRange)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                        >
                            {TIME_RANGES.map(range => (
                                <option key={range.value} value={range.value}>{range.label}</option>
                            ))}
                        </select>
                        
                        <select
                            value={filters.eventCategory}
                            onChange={(e) => updateFilter('eventCategory', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="all">All Categories</option>
                            {Object.keys(CATEGORY_COLORS).filter(c => c !== "Default").map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        
                        <select
                            value={filters.status}
                            onChange={(e) => updateFilter('status', e.target.value as typeof filters.status)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        
                        <div className="flex gap-2">
                            <select
                                value={filters.sortBy}
                                onChange={(e) => updateFilter('sortBy', e.target.value as SortBy)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="revenue">Sort by Revenue</option>
                                <option value="tickets">Sort by Tickets</option>
                                <option value="date">Sort by Date</option>
                                <option value="occupancy">Sort by Occupancy</option>
                            </select>
                            <button
                                onClick={() => updateFilter('sortOrder', filters.sortOrder === "asc" ? "desc" : "asc")}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(totals.totalRevenue)}
                    icon={DollarSign}
                    color="from-emerald-500 to-teal-600"
                    trend={totals.revenueGrowth}
                />
                <StatCard
                    title="Tickets Sold"
                    value={formatNumber(totals.totalTickets)}
                    icon={Ticket}
                    color="from-blue-500 to-cyan-600"
                    trend={totals.ticketGrowth}
                />
                <StatCard
                    title="Total Events"
                    value={totals.totalEvents}
                    icon={Calendar}
                    color="from-purple-500 to-pink-600"
                />
                <StatCard
                    title="Avg Ticket Price"
                    value={formatCurrency(totals.avgTicketPrice)}
                    icon={Activity}
                    color="from-orange-500 to-red-600"
                />
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Tickets Trend</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" tickFormatter={(v) => formatCurrency(v)} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} name="Revenue" />
                        <Line yAxisId="right" type="monotone" dataKey="ticketsSold" stroke="#3b82f6" name="Tickets Sold" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            dataKey="revenue"
                            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </RePieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                    {categoryData.map(cat => (
                        <div key={cat.category} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span className="text-gray-600">{cat.category}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-gray-900">{formatCurrency(cat.revenue)}</span>
                                <span className="text-gray-500">{cat.percentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Events Performance</h3>
                    <p className="text-sm text-gray-500 mt-1">Detailed breakdown of all events</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hall</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tickets</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Occupancy</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedEvents.items.map(event => (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {event.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <Building2 className="h-3 w-3 inline mr-1" />
                                        {event.hallName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDateOnly(new Date(event.date))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                        {formatNumber(event.ticketsSold)} / {formatNumber(event.totalTickets)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-sm text-gray-600">{event.occupancyRate.toFixed(0)}%</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${event.occupancyRate}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                                        {formatCurrency(event.revenue)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => navigate(`/owner/events/${event.id}`)}
                                            className="text-teal-600 hover:text-teal-700 transition-colors"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {sortedEvents.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-gray-500">
                            Page {currentPage} of {sortedEvents.totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(sortedEvents.totalPages, p + 1))}
                            disabled={currentPage === sortedEvents.totalPages}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-500">
                    Data updates in real-time | Last sync: {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default ViewReports;