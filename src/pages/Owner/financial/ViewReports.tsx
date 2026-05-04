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
    UserCog
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

interface StaffMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'manager' | 'scanner' | 'salesperson';
    joinDate: string;
    status: 'active' | 'inactive' | 'on-leave';
    location: string;
    performance: number;
    lastActive: string;
    totalTasks: number;
    successRate: number;
}

interface ActivityLog {
    id: string;
    staffName: string;
    role: string;
    action: string;
    timestamp: string;
    details: string;
    status: 'success' | 'pending' | 'failed';
}

interface FilterOptions {
    timeRange: "today" | "week" | "month" | "quarter" | "year";
    eventCategory: string;
    status: "all" | "active" | "completed" | "cancelled";
    sortBy: "revenue" | "tickets" | "date" | "occupancy";
    sortOrder: "asc" | "desc";
    staffRole: "all" | "manager" | "scanner" | "salesperson";
    staffStatus: "all" | "active" | "inactive" | "on-leave";
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

const ROLE_COLORS = {
    manager: "#8b5cf6",
    scanner: "#3b82f6",
    salesperson: "#10b981",
};

const ROLE_ICONS = {
    manager: <Shield className="h-4 w-4" />,
    scanner: <QrCode className="h-4 w-4" />,
    salesperson: <ShoppingCart className="h-4 w-4" />,
};

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

const getTimeAgo = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const diffHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
};

// Mock Data Generators
const generateMockMetrics = (timeRange: string): ReportMetrics => {
    const baseRevenue = 150000;
    const baseTickets = 12500;
    const baseCustomers = 8000;
    
    const multipliers: Record<string, number> = {
        today: 0.03,
        week: 0.2,
        month: 0.8,
        quarter: 2.5,
        year: 10,
    };
    
    const multiplier = multipliers[timeRange] || 1;
    
    return {
        totalRevenue: Math.floor(baseRevenue * multiplier * (0.8 + Math.random() * 0.4)),
        totalTicketsSold: Math.floor(baseTickets * multiplier * (0.8 + Math.random() * 0.4)),
        totalEvents: Math.floor(15 * multiplier * (0.8 + Math.random() * 0.4)),
        totalCustomers: Math.floor(baseCustomers * multiplier * (0.8 + Math.random() * 0.4)),
        averageTicketPrice: 12.50 + Math.random() * 5,
        occupancyRate: 65 + Math.random() * 25,
        revenueGrowth: (Math.random() * 40) - 10,
        ticketGrowth: (Math.random() * 35) - 5,
        customerGrowth: (Math.random() * 30) - 8,
        topPerformingCategory: ["Theater", "Concert", "Sports"][Math.floor(Math.random() * 3)],
    };
};

const generateMockEvents = (timeRange: string): EventPerformance[] => {
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
        });
    }
    
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateMockDailyRevenue = (timeRange: string): DailyRevenue[] => {
    const days = TIME_RANGES.find(t => t.value === timeRange)?.days || 30;
    const dailyData: DailyRevenue[] = [];
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        let revenue = isWeekend 
            ? 5000 + Math.random() * 8000 
            : 2000 + Math.random() * 5000;
        
        revenue *= (1 + (days - i) / days * 0.3);
        
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

// Staff Mock Data
const generateStaffMembers = (): StaffMember[] => {
    const managers = [
        { name: 'John Smith', email: 'john.smith@theaterhub.com', phone: '+251911234567', location: 'Addis Ababa Main', performance: 94, totalTasks: 156, successRate: 98 },
        { name: 'Sarah Johnson', email: 'sarah.j@theaterhub.com', phone: '+251912345678', location: 'Bole Branch', performance: 88, totalTasks: 134, successRate: 95 },
        { name: 'Michael Brown', email: 'michael.b@theaterhub.com', phone: '+251923456789', location: 'Piassa Branch', performance: 91, totalTasks: 148, successRate: 97 },
    ];
    
    const scanners = [
        { name: 'David Wilson', email: 'david.w@theaterhub.com', phone: '+251934567890', location: 'Addis Ababa Main', performance: 87, totalTasks: 892, successRate: 96 },
        { name: 'Emily Davis', email: 'emily.d@theaterhub.com', phone: '+251945678901', location: 'Bole Branch', performance: 92, totalTasks: 945, successRate: 98 },
        { name: 'James Miller', email: 'james.m@theaterhub.com', phone: '+251956789012', location: 'Piassa Branch', performance: 85, totalTasks: 823, successRate: 94 },
        { name: 'Lisa Anderson', email: 'lisa.a@theaterhub.com', phone: '+251967890123', location: 'Addis Ababa Main', performance: 89, totalTasks: 867, successRate: 95 },
        { name: 'Robert Taylor', email: 'robert.t@theaterhub.com', phone: '+251978901234', location: 'Bole Branch', performance: 86, totalTasks: 845, successRate: 94 },
    ];
    
    const salespersons = [
        { name: 'Maria Garcia', email: 'maria.g@theaterhub.com', phone: '+251989012345', location: 'Addis Ababa Main', performance: 95, totalTasks: 567, successRate: 99 },
        { name: 'Thomas Martinez', email: 'thomas.m@theaterhub.com', phone: '+251990123456', location: 'Bole Branch', performance: 89, totalTasks: 523, successRate: 96 },
        { name: 'Jennifer Lee', email: 'jennifer.l@theaterhub.com', phone: '+251901234567', location: 'Piassa Branch', performance: 93, totalTasks: 545, successRate: 97 },
        { name: 'Charles Wilson', email: 'charles.w@theaterhub.com', phone: '+251912345678', location: 'Addis Ababa Main', performance: 87, totalTasks: 498, successRate: 95 },
        { name: 'Patricia Moore', email: 'patricia.m@theaterhub.com', phone: '+251923456789', location: 'Bole Branch', performance: 91, totalTasks: 534, successRate: 96 },
        { name: 'Daniel Anderson', email: 'daniel.a@theaterhub.com', phone: '+251934567890', location: 'Piassa Branch', performance: 88, totalTasks: 512, successRate: 95 },
    ];
    
    return [
        ...managers.map((m, i) => ({
            id: `mgr-${i + 1}`,
            name: m.name,
            email: m.email,
            phone: m.phone,
            role: 'manager' as const,
            joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'on-leave'),
            location: m.location,
            performance: m.performance,
            lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            totalTasks: m.totalTasks,
            successRate: m.successRate,
        })),
        ...scanners.map((s, i) => ({
            id: `scn-${i + 1}`,
            name: s.name,
            email: s.email,
            phone: s.phone,
            role: 'scanner' as const,
            joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'on-leave'),
            location: s.location,
            performance: s.performance,
            lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            totalTasks: s.totalTasks,
            successRate: s.successRate,
        })),
        ...salespersons.map((sp, i) => ({
            id: `sale-${i + 1}`,
            name: sp.name,
            email: sp.email,
            phone: sp.phone,
            role: 'salesperson' as const,
            joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'on-leave'),
            location: sp.location,
            performance: sp.performance,
            lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            totalTasks: sp.totalTasks,
            successRate: sp.successRate,
        })),
    ];
};

const generateActivityLogs = (staff: StaffMember[]): ActivityLog[] => {
    const actions = {
        manager: ['Created Event', 'Updated Event', 'Deleted Event', 'Assigned Staff', 'Generated Report', 'Approved Refund', 'Modified Pricing', 'Reviewed Analytics'],
        scanner: ['Scanned Ticket', 'Validated Entry', 'Rejected Ticket', 'Verified VIP Access', 'Checked Customer', 'Marked Attendance', 'Reported Issue'],
        salesperson: ['Sold Ticket', 'Processed Refund', 'Upgraded Ticket', 'Created Invoice', 'Customer Support', 'Sold Voucher', 'Answered Query', 'Made Call'],
    };
    
    const events = ['The Lion King', 'Hamilton', 'Wicked', 'Phantom', 'Chicago', 'Cats'];
    const logs: ActivityLog[] = [];
    
    for (let i = 0; i < 50; i++) {
        const staffMember = staff[Math.floor(Math.random() * staff.length)];
        const actionList = actions[staffMember.role];
        const action = actionList[Math.floor(Math.random() * actionList.length)];
        const eventName = events[Math.floor(Math.random() * events.length)];
        
        const date = new Date();
        date.setHours(date.getHours() - Math.floor(Math.random() * 168));
        
        logs.push({
            id: `log-${i + 1}`,
            staffName: staffMember.name,
            role: staffMember.role,
            action,
            timestamp: date.toISOString(),
            details: `${action} for ${eventName}`,
            status: Math.random() > 0.9 ? 'failed' : (Math.random() > 0.95 ? 'pending' : 'success'),
        });
    }
    
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// CSV export
const exportToCSV = (metrics: ReportMetrics | null, events: EventPerformance[], dailyRevenue: DailyRevenue[], staff: StaffMember[], activities: ActivityLog[], periodLabel: string) => {
    const metricsRows = metrics ? [
        ["Metric", "Value"],
        ["Total Revenue", formatCurrency(metrics.totalRevenue)],
        ["Total Tickets Sold", formatNumber(metrics.totalTicketsSold)],
        ["Total Events", metrics.totalEvents],
        ["Total Customers", formatNumber(metrics.totalCustomers)],
        ["Average Ticket Price", formatCurrency(metrics.averageTicketPrice)],
        ["Occupancy Rate", `${metrics.occupancyRate.toFixed(1)}%`],
        ["Revenue Growth", `${metrics.revenueGrowth > 0 ? "+" : ""}${metrics.revenueGrowth.toFixed(1)}%`],
        ["Top Category", metrics.topPerformingCategory],
    ] : [];
    
    const staffRows = [
        ["Name", "Role", "Location", "Status", "Performance", "Total Tasks", "Success Rate", "Last Active"],
        ...staff.map(member => [
            member.name,
            member.role,
            member.location,
            member.status,
            `${member.performance}%`,
            member.totalTasks,
            `${member.successRate}%`,
            formatDateOnly(new Date(member.lastActive)),
        ]),
    ];
    
    const activitiesRows = [
        ["Staff Name", "Role", "Action", "Details", "Status", "Timestamp"],
        ...activities.map(activity => [
            activity.staffName,
            activity.role,
            activity.action,
            activity.details,
            activity.status,
            formatDateOnly(new Date(activity.timestamp)),
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
    
    const fullCSV = `=== METRICS (${periodLabel}) ===\n${convertToCSV(metricsRows)}\n\n=== STAFF MEMBERS ===\n${convertToCSV(staffRows)}\n\n=== RECENT ACTIVITIES ===\n${convertToCSV(activitiesRows)}`;
    
    const blob = new Blob([fullCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `report_${periodLabel.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Stat Card Component
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
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [activeTab, setActiveTab] = useState<'reports' | 'staff'>('reports');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterOptions>({
        timeRange: "month",
        eventCategory: "all",
        status: "all",
        sortBy: "revenue",
        sortOrder: "desc",
        staffRole: "all",
        staffStatus: "all",
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

    // Fetch mock data
    const fetchReportData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const mockMetrics = generateMockMetrics(filters.timeRange);
            let mockEvents = generateMockEvents(filters.timeRange);
            const mockDailyRevenue = generateMockDailyRevenue(filters.timeRange);
            const mockStaff = generateStaffMembers();
            const mockActivities = generateActivityLogs(mockStaff);
            
            if (filters.eventCategory !== "all") {
                mockEvents = mockEvents.filter(e => e.category === filters.eventCategory);
            }
            
            if (filters.status !== "all") {
                mockEvents = mockEvents.filter(event => event.status === filters.status);
            }
            
            let filteredStaff = mockStaff;
            if (filters.staffRole !== "all") {
                filteredStaff = mockStaff.filter(s => s.role === filters.staffRole);
            }
            if (filters.staffStatus !== "all") {
                filteredStaff = mockStaff.filter(s => s.status === filters.staffStatus);
            }
            
            const mockCategories = generateMockCategoryDistribution(mockEvents);
            
            setMetrics(mockMetrics);
            setEventPerformance(mockEvents);
            setDailyRevenue(mockDailyRevenue);
            setCategoryDistribution(mockCategories);
            setStaffMembers(filteredStaff);
            setActivityLogs(mockActivities);
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

    // Filtered staff
    const filteredStaff = useMemo(() => {
        let filtered = [...staffMembers];
        if (filters.staffRole !== "all") {
            filtered = filtered.filter(s => s.role === filters.staffRole);
        }
        if (filters.staffStatus !== "all") {
            filtered = filtered.filter(s => s.status === filters.staffStatus);
        }
        return filtered;
    }, [staffMembers, filters.staffRole, filters.staffStatus]);

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
            exportToCSV(metrics, eventPerformance, dailyRevenue, staffMembers, activityLogs, getPeriodLabel());
        } catch (error) {
            console.error("Error exporting:", error);
            setError("Failed to export data");
        } finally {
            setIsExporting(false);
        }
    };

    // Staff role stats
    const roleStats = useMemo(() => {
        const stats = {
            manager: { total: 0, active: 0, avgPerformance: 0 },
            scanner: { total: 0, active: 0, avgPerformance: 0 },
            salesperson: { total: 0, active: 0, avgPerformance: 0 },
        };
        
        staffMembers.forEach(staff => {
            stats[staff.role].total++;
            if (staff.status === 'active') stats[staff.role].active++;
            stats[staff.role].avgPerformance += staff.performance;
        });
        
        Object.keys(stats).forEach(role => {
            if (stats[role as keyof typeof stats].total > 0) {
                stats[role as keyof typeof stats].avgPerformance /= stats[role as keyof typeof stats].total;
            }
        });
        
        return stats;
    }, [staffMembers]);

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
                        {activeTab === 'reports' ? getPeriodLabel() : 'Staff'} performance metrics and analytics
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Tab Switcher */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                activeTab === 'reports' 
                                    ? 'bg-teal-600 text-white shadow-sm' 
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <BarChart3 className="h-4 w-4" />
                            Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('staff')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                activeTab === 'staff' 
                                    ? 'bg-teal-600 text-white shadow-sm' 
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Users className="h-4 w-4" />
                            Staff Activity
                        </button>
                    </div>
                    
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
                    
                    {activeTab === 'reports' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Role</label>
                                <select
                                    value={filters.staffRole}
                                    onChange={(e) => setFilters({ ...filters, staffRole: e.target.value as FilterOptions["staffRole"] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="manager">Managers</option>
                                    <option value="scanner">Scanners</option>
                                    <option value="salesperson">Salespersons</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Status</label>
                                <select
                                    value={filters.staffStatus}
                                    onChange={(e) => setFilters({ ...filters, staffStatus: e.target.value as FilterOptions["staffStatus"] })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="on-leave">On Leave</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setFilters({
                                            ...filters,
                                            staffRole: "all",
                                            staffStatus: "all",
                                        });
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}
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
                    {activeTab === 'reports' ? (
                        <>
                            {/* Stats Grid */}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs text-gray-500">Average Ticket Price</p>
                                        <Activity className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics?.averageTicketPrice || 0)}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs text-gray-500">Occupancy Rate</p>
                                        <Target className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{metrics?.occupancyRate.toFixed(1)}%</p>
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                        <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${metrics?.occupancyRate || 0}%` }} />
                                    </div>
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
                                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs text-gray-500">Top Category</p>
                                        <Award className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{metrics?.topPerformingCategory}</p>
                                </div>
                            </div>

                            {/* Revenue Trend Chart */}
                            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Revenue & Tickets Trend</h3>
                                        <p className="text-sm text-gray-500">{getPeriodLabel()} performance metrics</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-teal-500" />
                                            <span className="text-xs text-gray-600">Revenue</span>
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                                <p className="text-2xl font-bold">{metrics?.revenueGrowth > 0 ? '+' : ''}{metrics?.revenueGrowth.toFixed(1)}%</p>
                                                <p className="text-xs opacity-75">vs previous {getPeriodLabel().toLowerCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                <Target className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm opacity-90">Ticket Sales Growth</p>
                                                <p className="text-2xl font-bold">{metrics?.ticketGrowth > 0 ? '+' : ''}{metrics?.ticketGrowth.toFixed(1)}%</p>
                                                <p className="text-xs opacity-75">vs previous {getPeriodLabel().toLowerCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm opacity-90">Customer Growth</p>
                                                <p className="text-2xl font-bold">{metrics?.customerGrowth > 0 ? '+' : ''}{metrics?.customerGrowth.toFixed(1)}%</p>
                                                <p className="text-xs opacity-75">new customers this period</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Events Performance Table */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-4 md:p-6 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Events Performance</h3>
                                            <p className="text-sm text-gray-500">Detailed breakdown of all events</p>
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

                            {/* Summary Footer */}
                            <div className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Best Performing Category</p>
                                        <p className="text-base font-bold text-gray-900">{metrics?.topPerformingCategory}</p>
                                        <p className="text-xs text-teal-600">Top revenue generator</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Average Occupancy</p>
                                        <p className="text-base font-bold text-gray-900">{metrics?.occupancyRate.toFixed(1)}%</p>
                                        <p className="text-xs text-gray-500">Across all events</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Total Events</p>
                                        <p className="text-base font-bold text-gray-900">{metrics?.totalEvents}</p>
                                        <p className="text-xs text-gray-500">{getPeriodLabel().toLowerCase()} total</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Revenue per Ticket</p>
                                        <p className="text-base font-bold text-gray-900">{formatCurrency(metrics?.averageTicketPrice || 0)}</p>
                                        <p className="text-xs text-green-600">Average ticket price</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Staff Role Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Managers</p>
                                            <p className="text-2xl font-bold">{roleStats.manager.total}</p>
                                            <p className="text-xs opacity-75">{roleStats.manager.active} Active</p>
                                        </div>
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <Shield className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-xs opacity-75">Avg Performance: {roleStats.manager.avgPerformance.toFixed(1)}%</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Scanners</p>
                                            <p className="text-2xl font-bold">{roleStats.scanner.total}</p>
                                            <p className="text-xs opacity-75">{roleStats.scanner.active} Active</p>
                                        </div>
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <QrCode className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-xs opacity-75">Avg Performance: {roleStats.scanner.avgPerformance.toFixed(1)}%</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Salespersons</p>
                                            <p className="text-2xl font-bold">{roleStats.salesperson.total}</p>
                                            <p className="text-xs opacity-75">{roleStats.salesperson.active} Active</p>
                                        </div>
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <ShoppingCart className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-xs opacity-75">Avg Performance: {roleStats.salesperson.avgPerformance.toFixed(1)}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Staff Members Table */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-4 md:p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Staff Members</h3>
                                    <p className="text-sm text-gray-500">Manage and monitor staff performance</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Performance</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tasks</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Last Active</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredStaff.map((staff) => (
                                                <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                                <Mail className="h-3 w-3" />
                                                                <span>{staff.email}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                                                <Phone className="h-3 w-3" />
                                                                <span>{staff.phone}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-${staff.role === 'manager' ? 'purple' : staff.role === 'scanner' ? 'blue' : 'green'}-100 text-${staff.role === 'manager' ? 'purple' : staff.role === 'scanner' ? 'blue' : 'green'}-700`}>
                                                            {ROLE_ICONS[staff.role]}
                                                            {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <MapPin className="h-3 w-3" />
                                                            {staff.location}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                                                            staff.status === 'active' ? 'bg-green-100 text-green-700' :
                                                            staff.status === 'inactive' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {staff.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                            {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-sm font-semibold text-gray-900">{staff.performance}%</span>
                                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${staff.performance}%` }} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                                        {staff.totalTasks.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-sm font-semibold text-gray-900">{staff.successRate}%</span>
                                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${staff.successRate}%` }} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                                                        {getTimeAgo(staff.lastActive)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent Activity Logs */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-4 md:p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                                    <p className="text-sm text-gray-500">Latest staff actions and events</p>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {activityLogs.slice(0, 10).map((log) => (
                                        <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${
                                                        log.role === 'manager' ? 'bg-purple-100' :
                                                        log.role === 'scanner' ? 'bg-blue-100' : 'bg-green-100'
                                                    }`}>
                                                        {ROLE_ICONS[log.role as keyof typeof ROLE_ICONS]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{log.staffName}</p>
                                                        <p className="text-sm text-gray-600">{log.action}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{log.details}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400">{formatDateOnly(new Date(log.timestamp))}</p>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full mt-1 ${
                                                        log.status === 'success' ? 'bg-green-100 text-green-700' :
                                                        log.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {log.status === 'success' ? <CheckCircle className="h-3 w-3" /> : 
                                                         log.status === 'failed' ? <XCircle className="h-3 w-3" /> : 
                                                         <Clock className="h-3 w-3" />}
                                                        {log.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Summary Footer */}
                    <div className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Data Source</p>
                                <p className="text-base font-bold text-gray-900">Real-time Analytics</p>
                                <p className="text-xs text-teal-600">Live updates</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Last Sync</p>
                                <p className="text-base font-bold text-gray-900">{formatDateOnly(lastUpdated)}</p>
                                <p className="text-xs text-gray-500">{formatDate(lastUpdated)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Data Accuracy</p>
                                <p className="text-base font-bold text-gray-900">99.9%</p>
                                <p className="text-xs text-green-600">Verified</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Report Period</p>
                                <p className="text-base font-bold text-gray-900">{getPeriodLabel()}</p>
                                <p className="text-xs text-gray-500">Rolling period</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewReports;