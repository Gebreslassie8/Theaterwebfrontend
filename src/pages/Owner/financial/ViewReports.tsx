// src/pages/owner/ViewReports.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Ticket,
    Users,
    Calendar,
    Download,
    Filter,
    RefreshCw,
    Eye,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Activity,
    Clock,
    AlertCircle,
    Loader2,
    X,
    Zap,
    Award,
    Target,
    Wallet,
    PieChart,
    ArrowRight,
    UserCheck,
    QrCode,
    ShoppingCart,
    Star,
    Mail,
    Phone,
    MapPin,
    CheckCircle,
    XCircle,
    Shield,
    UserCog,
    Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    LineChart,
    Line,
    PieChart as RePieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    ComposedChart,
    AreaChart
} from 'recharts';

// Types
interface ReportMetrics {
    totalRevenue: number;
    totalTicketsSold: number;
    totalEvents: number;
    totalCustomers: number;
    averageTicketPrice: number;
    occupancyRate: number;
    revenueGrowth: number;
    ticketGrowth: number;
    customerGrowth: number;
    topPerformingCategory: string;
}

interface EventPerformance {
    id: string;
    name: string;
    date: string;
    ticketsSold: number;
    totalTickets: number;
    revenue: number;
    occupancyRate: number;
    category: string;
    status: "active" | "completed" | "cancelled";
    hallId?: string;
    hallName?: string;
}

interface DailyRevenue {
    date: string;
    revenue: number;
    ticketsSold: number;
    customers: number;
}

interface CategoryDistribution {
    category: string;
    revenue: number;
    percentage: number;
    color: string;
    ticketCount: number;
}

interface Hall {
    id: string;
    name: string;
    location: string;
}

interface FilterOptions {
    timeRange: "today" | "week" | "month" | "quarter" | "year";
    eventCategory: string;
    status: "all" | "active" | "completed" | "cancelled";
    sortBy: "revenue" | "tickets" | "date" | "occupancy";
    sortOrder: "asc" | "desc";
    selectedHall: string;
}

// Constants
const TIME_RANGES = [
    { label: "Today", value: "today", days: 1 },
    { label: "This Week", value: "week", days: 7 },
    { label: "This Month", value: "month", days: 30 },
    { label: "This Quarter", value: "quarter", days: 90 },
    { label: "This Year", value: "year", days: 365 },
];

const CATEGORY_COLORS = {
    "Theater": "#14b8a6",
    "Concert": "#3b82f6",
    "Sports": "#f59e0b",
    "Conference": "#8b5cf6",
    "Festival": "#ef4444",
    "Comedy": "#ec4899",
    "Exhibition": "#06b6d4",
    "Default": "#6b7280",
};

// Halls data
const HALLS: Hall[] = [
    { id: "hall-1", name: "Main Hall", location: "Addis Ababa" },
    { id: "hall-2", name: "Blue Hall", location: "Addis Ababa" },
    { id: "hall-3", name: "Green Hall", location: "Addis Ababa" },
    { id: "hall-4", name: "VIP Hall", location: "Addis Ababa" },
];

// Helper functions
const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${month} ${day}, ${year} at ${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const formatDateOnly = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
};

const formatMonthDay = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${month} ${day}`;
};

const formatCurrency = (amount: number) => {
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

// Mock Data Generators with Hall-specific data
const generateMockMetrics = (timeRange: string, hallId: string): ReportMetrics => {
    const baseRevenue = 150000;
    const baseTickets = 12500;
    const baseCustomers = 8000;
    
    // Hall multiplier for different halls
    const hallMultipliers: Record<string, number> = {
        "hall-1": 1.0,
        "hall-2": 0.7,
        "hall-3": 0.5,
        "hall-4": 0.3,
        "all": 1.0,
    };
    
    const multipliers: Record<string, number> = {
        today: 0.03,
        week: 0.2,
        month: 0.8,
        quarter: 2.5,
        year: 10,
    };
    
    const multiplier = multipliers[timeRange] || 1;
    const hallMultiplier = hallMultipliers[hallId] || hallMultipliers.all;
    
    return {
        totalRevenue: Math.floor(baseRevenue * multiplier * hallMultiplier * (0.8 + Math.random() * 0.4)),
        totalTicketsSold: Math.floor(baseTickets * multiplier * hallMultiplier * (0.8 + Math.random() * 0.4)),
        totalEvents: Math.floor(15 * multiplier * hallMultiplier * (0.8 + Math.random() * 0.4)),
        totalCustomers: Math.floor(baseCustomers * multiplier * hallMultiplier * (0.8 + Math.random() * 0.4)),
        averageTicketPrice: 12.50 + Math.random() * 5,
        occupancyRate: 65 + Math.random() * 25,
        revenueGrowth: (Math.random() * 40) - 10,
        ticketGrowth: (Math.random() * 35) - 5,
        customerGrowth: (Math.random() * 30) - 8,
        topPerformingCategory: ["Theater", "Concert", "Sports"][Math.floor(Math.random() * 3)],
    };
};

const generateMockEvents = (timeRange: string, hallId: string): EventPerformance[] => {
    const eventCount = timeRange === "today" ? 3 : timeRange === "week" ? 8 : timeRange === "month" ? 15 : timeRange === "quarter" ? 25 : 40;
    const categories = ["Theater", "Concert", "Sports", "Conference", "Festival", "Comedy", "Exhibition"];
    const eventNames = {
        "Theater": ["Hamlet", "Romeo & Juliet", "Macbeth", "The Lion King", "Wicked", "Les Misérables", "Hamilton", "Cats"],
        "Concert": ["Summer Vibes", "Rock Fest", "Jazz Night", "Classical Masters", "Pop Revolution", "EDM Festival", "Indie Showcase"],
        "Sports": ["Championship Final", "Derby Match", "Tennis Open", "Basketball League", "Boxing Night", "Marathon", "Golf Tournament"],
        "Conference": ["Tech Summit", "Business Forum", "Medical Conference", "Education Expo", "Startup Pitch", "Innovation Day", "AI Conference"],
        "Festival": ["Food Festival", "Art Festival", "Music Festival", "Cultural Fest", "Film Festival", "Beer Festival", "Wine Tasting"],
        "Comedy": ["Laugh Night", "Comedy Circus", "Stand-up Special", "Improv Show", "Funny Fest", "Comedy Gala", "Roast Battle"],
        "Exhibition": ["Art Expo", "Auto Show", "Tech Exhibition", "Fashion Week", "Book Fair", "Trade Show", "Gaming Expo"],
    };
    
    const events: EventPerformance[] = [];
    const selectedHalls = hallId === "all" ? HALLS : HALLS.filter(h => h.id === hallId);
    
    for (let i = 0; i < eventCount; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const nameList = eventNames[category as keyof typeof eventNames];
        const name = nameList[Math.floor(Math.random() * nameList.length)];
        const totalTickets = 500 + Math.floor(Math.random() * 2000);
        const ticketsSold = Math.floor(totalTickets * (0.3 + Math.random() * 0.7));
        const revenue = ticketsSold * (10 + Math.random() * 20);
        
        const date = new Date();
        if (timeRange === "today") {
            date.setHours(date.getHours() - Math.floor(Math.random() * 12));
        } else if (timeRange === "week") {
            date.setDate(date.getDate() - Math.floor(Math.random() * 7));
        } else if (timeRange === "month") {
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        } else if (timeRange === "quarter") {
            date.setDate(date.getDate() - Math.floor(Math.random() * 90));
        } else {
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        }
        
        const now = new Date();
        let status: "active" | "completed" | "cancelled" = "completed";
        if (date > now) status = "active";
        if (Math.random() < 0.1) status = "cancelled";
        
        const hall = selectedHalls[Math.floor(Math.random() * selectedHalls.length)];
        
        events.push({
            id: `event-${i + 1}`,
            name: `${name} ${Math.floor(Math.random() * 100) + 1}`,
            date: date.toISOString(),
            ticketsSold,
            totalTickets,
            revenue,
            occupancyRate: (ticketsSold / totalTickets) * 100,
            category,
            status,
            hallId: hall.id,
            hallName: hall.name,
        });
    }
    
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateMockDailyRevenue = (timeRange: string, hallId: string): DailyRevenue[] => {
    const days = TIME_RANGES.find(t => t.value === timeRange)?.days || 30;
    const dailyData: DailyRevenue[] = [];
    
    const hallMultipliers: Record<string, number> = {
        "hall-1": 1.0,
        "hall-2": 0.7,
        "hall-3": 0.5,
        "hall-4": 0.3,
        "all": 1.0,
    };
    const hallMultiplier = hallMultipliers[hallId] || hallMultipliers.all;
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        let revenue = isWeekend 
            ? 5000 + Math.random() * 8000 
            : 2000 + Math.random() * 5000;
        
        revenue *= (1 + (days - i) / days * 0.3);
        revenue *= hallMultiplier;
        
        const ticketsSold = Math.floor(revenue / (10 + Math.random() * 10));
        const customers = Math.floor(ticketsSold * (0.7 + Math.random() * 0.3));
        
        dailyData.push({
            date: date.toISOString(),
            revenue: Math.floor(revenue),
            ticketsSold,
            customers,
        });
    }
    
    return dailyData;
};

const generateMockCategoryDistribution = (events: EventPerformance[]): CategoryDistribution[] => {
    const categoryMap = new Map<string, { revenue: number; tickets: number }>();
    
    events.forEach(event => {
        const current = categoryMap.get(event.category) || { revenue: 0, tickets: 0 };
        categoryMap.set(event.category, {
            revenue: current.revenue + event.revenue,
            tickets: current.tickets + event.ticketsSold,
        });
    });
    
    const total = Array.from(categoryMap.values()).reduce((a, b) => a + b.revenue, 0);
    
    return Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        revenue: data.revenue,
        percentage: (data.revenue / total) * 100,
        ticketCount: data.tickets,
        color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Default,
    }));
};

// CSV export
const exportToCSV = (metrics: ReportMetrics | null, events: EventPerformance[], dailyRevenue: DailyRevenue[], periodLabel: string, hallName: string) => {
    const metricsRows = metrics ? [
        ["Metric", "Value"],
        ["Total Revenue", formatCurrency(metrics.totalRevenue)],
        ["Total Tickets Sold", formatNumber(metrics.totalTicketsSold)],
        ["Total Events", metrics.totalEvents],
        ["Total Customers", formatNumber(metrics.totalCustomers)],
        ["Average Ticket Price", formatCurrency(metrics.averageTicketPrice)],
        ["Revenue Growth", `${metrics.revenueGrowth > 0 ? "+" : ""}${metrics.revenueGrowth.toFixed(1)}%`],
    ] : [];
    
    const eventsRows = [
        ["Event Name", "Date", "Category", "Hall", "Tickets Sold", "Total Tickets", "Occupancy Rate", "Revenue", "Status"],
        ...events.map(event => [
            event.name,
            formatDateOnly(new Date(event.date)),
            event.category,
            event.hallName || "N/A",
            event.ticketsSold,
            event.totalTickets,
            `${event.occupancyRate.toFixed(1)}%`,
            formatCurrency(event.revenue),
            event.status,
        ]),
    ];
    
    const convertToCSV = (data: any[][]) => {
        return data.map(row => 
            row.map(cell => 
                typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
                    ? `"${cell.replace(/"/g, '""')}"` 
                    : cell
            ).join(',')
        ).join('\n');
    };
    
    const fullCSV = `=== REPORT FOR ${hallName} (${periodLabel}) ===\n${convertToCSV(metricsRows)}\n\n=== EVENTS ===\n${convertToCSV(eventsRows)}`;
    
    const blob = new Blob([fullCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `report_${hallName.toLowerCase().replace(/\s/g, '_')}_${periodLabel.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Stat Card Component - Updated to show ETB without dollar sign
const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }: any) => (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-500 mb-1">{title}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                {trend !== undefined && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(trend).toFixed(1)}% from last period
                    </p>
                )}
                {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
        </div>
    </div>
);

const ViewReports: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
    const [eventPerformance, setEventPerformance] = useState<EventPerformance[]>([]);
    const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
    const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterOptions>({
        timeRange: "month",
        eventCategory: "all",
        status: "all",
        sortBy: "revenue",
        sortOrder: "desc",
        selectedHall: "all",
    });
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isExporting, setIsExporting] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const getPeriodLabel = () => {
        switch (filters.timeRange) {
            case 'today': return 'Today';
            case 'week': return 'This Week';
            case 'month': return 'This Month';
            case 'quarter': return 'This Quarter';
            case 'year': return 'This Year';
            default: return 'This Month';
        }
    };

    const getSelectedHallName = () => {
        if (filters.selectedHall === "all") return "All Halls";
        const hall = HALLS.find(h => h.id === filters.selectedHall);
        return hall ? hall.name : "All Halls";
    };

    // Fetch mock data
    const fetchReportData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const mockMetrics = generateMockMetrics(filters.timeRange, filters.selectedHall);
            let mockEvents = generateMockEvents(filters.timeRange, filters.selectedHall);
            const mockDailyRevenue = generateMockDailyRevenue(filters.timeRange, filters.selectedHall);
            
            if (filters.eventCategory !== "all") {
                mockEvents = mockEvents.filter(e => e.category === filters.eventCategory);
            }
            
            if (filters.status !== "all") {
                mockEvents = mockEvents.filter(event => event.status === filters.status);
            }
            
            const mockCategories = generateMockCategoryDistribution(mockEvents);
            
            setMetrics(mockMetrics);
            setEventPerformance(mockEvents);
            setDailyRevenue(mockDailyRevenue);
            setCategoryDistribution(mockCategories);
            setLastUpdated(new Date());
        } catch (err) {
            setError("Failed to load report data");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    // Sort and paginate events
    const sortedAndPaginatedEvents = useMemo(() => {
        let sorted = [...eventPerformance];
        sorted.sort((a, b) => {
            let aValue: any = a[filters.sortBy as keyof EventPerformance];
            let bValue: any = b[filters.sortBy as keyof EventPerformance];
            if (filters.sortBy === "date") {
                aValue = new Date(a.date).getTime();
                bValue = new Date(b.date).getTime();
            }
            if (filters.sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {
            items: sorted.slice(startIndex, endIndex),
            totalPages: Math.ceil(sorted.length / itemsPerPage),
            totalItems: sorted.length,
        };
    }, [eventPerformance, filters.sortBy, filters.sortOrder, currentPage, itemsPerPage]);

    // Chart data
    const chartData = useMemo(() => {
        return dailyRevenue.map(day => ({
            date: formatMonthDay(new Date(day.date)),
            revenue: day.revenue,
            ticketsSold: day.ticketsSold,
        }));
    }, [dailyRevenue]);

    // Handle export
    const handleExport = () => {
        setIsExporting(true);
        try {
            exportToCSV(metrics, eventPerformance, dailyRevenue, getPeriodLabel(), getSelectedHallName());
        } catch (error) {
            console.error("Error exporting:", error);
            setError("Failed to export data");
        } finally {
            setIsExporting(false);
        }
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-xs">
                    <p className="font-semibold text-gray-900 mb-1">{label}</p>
                    {payload.map((p: any, idx: number) => (
                        <p key={idx} className="text-xs" style={{ color: p.color }}>
                            {p.name}: {p.name === "Revenue" ? formatCurrency(p.value) : formatNumber(p.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {getPeriodLabel()} performance metrics for {getSelectedHallName()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    
                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-md"
                    >
                        {isExporting ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">Filter Reports</h3>
                        <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hall</label>
                            <select
                                value={filters.selectedHall}
                                onChange={(e) => {
                                    setFilters({ ...filters, selectedHall: e.target.value });
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                                <option value="all">All Halls</option>
                                {HALLS.map(hall => (
                                    <option key={hall.id} value={hall.id}>{hall.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                            <select
                                value={filters.timeRange}
                                onChange={(e) => {
                                    setFilters({ ...filters, timeRange: e.target.value as FilterOptions["timeRange"] });
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                                {TIME_RANGES.map(range => (
                                    <option key={range.value} value={range.value}>{range.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Category</label>
                            <select
                                value={filters.eventCategory}
                                onChange={(e) => {
                                    setFilters({ ...filters, eventCategory: e.target.value });
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                                <option value="all">All Categories</option>
                                {Object.keys(CATEGORY_COLORS).filter(c => c !== "Default").map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => {
                                    setFilters({ ...filters, status: e.target.value as FilterOptions["status"] });
                                    setCurrentPage(1);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                                <option value="all">All Events</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                        <p className="text-gray-500">Loading data...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
                    <p className="text-red-600">{error}</p>
                    <button onClick={fetchReportData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    {/* Stats Grid - All values now show ETB format without dollar sign */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard 
                            title="Total Revenue" 
                            value={formatCurrency(metrics?.totalRevenue || 0)} 
                            icon={DollarSign} 
                            color="from-emerald-500 to-teal-600"
                            trend={metrics?.revenueGrowth}
                        />
                        <StatCard 
                            title="Tickets Sold" 
                            value={formatNumber(metrics?.totalTicketsSold || 0)} 
                            icon={Ticket} 
                            color="from-blue-500 to-cyan-600"
                            trend={metrics?.ticketGrowth}
                        />
                        <StatCard 
                            title="Total Events" 
                            value={metrics?.totalEvents || 0} 
                            icon={Calendar} 
                            color="from-purple-500 to-pink-600"
                            subtitle={`${getPeriodLabel()} total`}
                        />
                        <StatCard 
                            title="Total Customers" 
                            value={formatNumber(metrics?.totalCustomers || 0)} 
                            icon={Users} 
                            color="from-orange-500 to-red-600"
                            trend={metrics?.customerGrowth}
                        />
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-500">Average Ticket Price</p>
                                <Activity className="h-4 w-4 text-gray-400" />
                            </div>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics?.averageTicketPrice || 0)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-500">Revenue per Event</p>
                                <Zap className="h-4 w-4 text-gray-400" />
                            </div>
                            <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(((metrics?.totalRevenue || 0) / (metrics?.totalEvents || 1)))}
                            </p>
                        </div>
                    </div>

                    {/* Revenue Trend Chart */}
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Revenue & Tickets Trend</h3>
                                <p className="text-sm text-gray-500">{getPeriodLabel()} performance metrics for {getSelectedHallName()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-teal-500" />
                                    <span className="text-xs text-gray-600">Revenue (ETB)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-xs text-gray-600">Tickets Sold</span>
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                            <ComposedChart data={chartData}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                                <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="left" stroke="#14b8a6" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} fill="url(#revenueGrad)" name="Revenue" />
                                <Line yAxisId="right" type="monotone" dataKey="ticketsSold" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} name="Tickets Sold" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <RePieChart>
                                <Pie
                                    data={categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="revenue"
                                    label={({ name, percent }) => `${percent ? ((percent) * 100).toFixed(0) : 0}%`}
                                    labelLine={false}
                                >
                                    {categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                            </RePieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                            {categoryDistribution.map((category, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                                        <span className="text-gray-600">{category.category}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-gray-900">{formatCurrency(category.revenue)}</span>
                                        <span className="text-gray-500">{category.percentage.toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Events Performance Table */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Events Performance</h3>
                                    <p className="text-sm text-gray-500">Detailed breakdown of all events in {getSelectedHallName()}</p>
                                </div>
                                <div className="flex gap-3">
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterOptions["sortBy"] })}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="revenue">Sort by Revenue</option>
                                        <option value="tickets">Sort by Tickets</option>
                                        <option value="date">Sort by Date</option>
                                        <option value="occupancy">Sort by Occupancy</option>
                                    </select>
                                    <button
                                        onClick={() => setFilters({ ...filters, sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-50 transition-all"
                                    >
                                        <ArrowUpDown className="h-3 w-3" />
                                        {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {sortedAndPaginatedEvents.items.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No events found matching the filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hall</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tickets Sold</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Occupancy</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {sortedAndPaginatedEvents.items.map((event) => (
                                                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{event.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <Building2 className="h-3 w-3" />
                                                            {event.hallName || "N/A"}
                                                        </div>
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
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-sm text-gray-600">{event.occupancyRate.toFixed(1)}%</span>
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
                                {sortedAndPaginatedEvents.totalPages > 1 && (
                                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                                            {Math.min(currentPage * itemsPerPage, sortedAndPaginatedEvents.totalItems)} of{" "}
                                            {sortedAndPaginatedEvents.totalItems} events
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(sortedAndPaginatedEvents.totalPages, p + 1))}
                                                disabled={currentPage === sortedAndPaginatedEvents.totalPages}
                                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                
                </>
            )}
        </div>
    );
};

export default ViewReports;