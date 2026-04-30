import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

// ===================== Types & Interfaces =====================
interface Show {
  id: number;
  name: string;
  time: string;
  capacity: number;
  sold: number;
  isCancelled?: boolean;
  status?: 'scheduled' | 'sold_out' | 'cancelled';
}

interface SalesTrend {
  day: string;
  ticketsSold: number;
  revenue: number;
}

interface RevenueSummary {
  daily: number;
  weekly: number;
  monthly: number;
}

interface Alert {
  id: number;
  type: 'sold_out' | 'cancellation';
  message: string;
  showId?: number;
}

// ===================== Mock Data Service =====================
const fetchMockData = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Today's scheduled shows with realistic data
  const todayShows: Show[] = [
    {
      id: 1,
      name: "The Lion King",
      time: "14:00",
      capacity: 200,
      sold: 200,
      status: 'sold_out',
    },
    {
      id: 2,
      name: "Hamilton",
      time: "19:00",
      capacity: 150,
      sold: 120,
      status: 'scheduled',
    },
    {
      id: 3,
      name: "Les Misérables",
      time: "20:30",
      capacity: 180,
      sold: 90,
      status: 'scheduled',
    },
    {
      id: 4,
      name: "Cats",
      time: "18:00",
      capacity: 140,
      sold: 0,
      isCancelled: true,
      status: 'cancelled',
    },
  ];

  // Ticket sales trend for last 7 days (including today)
  const salesTrendData: SalesTrend[] = [
    { day: "Mon (Apr 21)", ticketsSold: 145, revenue: 7250 },
    { day: "Tue (Apr 22)", ticketsSold: 158, revenue: 7900 },
    { day: "Wed (Apr 23)", ticketsSold: 162, revenue: 8100 },
    { day: "Thu (Apr 24)", ticketsSold: 178, revenue: 8900 },
    { day: "Fri (Apr 25)", ticketsSold: 190, revenue: 9500 },
    { day: "Sat (Apr 26)", ticketsSold: 210, revenue: 10500 },
    { day: "Sun (Apr 27)", ticketsSold: 0, revenue: 0 }, // Will be replaced with actual today's sold
  ];

  // Calculate today's total sold from non-cancelled shows
  const activeShows = todayShows.filter(show => !show.isCancelled);
  const todayTotalSold = activeShows.reduce((sum, show) => sum + show.sold, 0);
  const todayTotalRevenue = todayTotalSold * 50; // $50 avg ticket price

  // Update today's (Sunday) data
  salesTrendData[6].ticketsSold = todayTotalSold;
  salesTrendData[6].revenue = todayTotalRevenue;

  // Calculate weekly total tickets and revenue
  const weeklyTotalTickets = salesTrendData.reduce((sum, day) => sum + day.ticketsSold, 0);
  const weeklyTotalRevenue = salesTrendData.reduce((sum, day) => sum + day.revenue, 0);

  // Mock monthly data (approx 4 weeks)
  const monthlyTotalRevenue = weeklyTotalRevenue * 4.2;
  const monthlyTotalTickets = weeklyTotalTickets * 4.2;

  const revenueSummary: RevenueSummary = {
    daily: todayTotalRevenue,
    weekly: weeklyTotalRevenue,
    monthly: Math.round(monthlyTotalRevenue),
  };

  // Generate alerts based on show data
  const alerts: Alert[] = [];
  todayShows.forEach((show) => {
    if (show.status === 'sold_out') {
      alerts.push({
        id: show.id,
        type: 'sold_out',
        message: `🎭 SOLD OUT: ${show.name} at ${show.time}`,
        showId: show.id,
      });
    }
    if (show.isCancelled) {
      alerts.push({
        id: show.id + 100,
        type: 'cancellation',
        message: `⚠️ CANCELLED: ${show.name} at ${show.time} - Please inform ticket holders`,
        showId: show.id,
      });
    }
  });

  // Sold vs Available for Pie Chart
  const activeTotalCapacity = activeShows.reduce((sum, show) => sum + show.capacity, 0);
  const activeTotalSold = activeShows.reduce((sum, show) => sum + show.sold, 0);
  const activeTotalAvailable = activeTotalCapacity - activeTotalSold;

  const pieChartData = [
    { name: 'Tickets Sold', value: activeTotalSold, color: '#10b981' },
    { name: 'Available Seats', value: activeTotalAvailable, color: '#f59e0b' },
  ];

  return {
    shows: todayShows,
    salesTrend: salesTrendData,
    revenue: revenueSummary,
    pieChartData,
    alerts,
    todayStats: {
      totalSold: activeTotalSold,
      totalCapacity: activeTotalCapacity,
      occupancyRate: ((activeTotalSold / activeTotalCapacity) * 100).toFixed(1),
    },
  };
};

// ===================== Helper Components =====================
const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className="stat-card" style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <div style={styles.statIcon}>{icon}</div>
    <div>
      <div style={styles.statTitle}>{title}</div>
      <div style={{ ...styles.statValue, color }}>{value}</div>
    </div>
  </div>
);

const AlertBanner: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div style={styles.noAlerts}>
        ✅ All good! No active alerts.
      </div>
    );
  }
  return (
    <div style={styles.alertContainer}>
      {alerts.map(alert => (
        <div key={alert.id} style={{ ...styles.alertItem, backgroundColor: alert.type === 'sold_out' ? '#fee2e2' : '#fff3e0', borderLeftColor: alert.type === 'sold_out' ? '#dc2626' : '#f97316' }}>
          <span style={styles.alertMessage}>{alert.message}</span>
        </div>
      ))}
    </div>
  );
};

// ===================== Main Component =====================
const SalesDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState<Show[]>([]);
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([]);
  const [revenue, setRevenue] = useState<RevenueSummary>({ daily: 0, weekly: 0, monthly: 0 });
  const [pieData, setPieData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [todayStats, setTodayStats] = useState({ totalSold: 0, totalCapacity: 0, occupancyRate: '0' });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchMockData();
      setShows(data.shows);
      setSalesTrend(data.salesTrend);
      setRevenue(data.revenue);
      setPieData(data.pieChartData);
      setAlerts(data.alerts);
      setTodayStats(data.todayStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading Sales Dashboard...</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Get show status badge
  const getShowStatusBadge = (show: Show) => {
    if (show.isCancelled) return <span style={styles.badgeCancelled}>Cancelled</span>;
    if (show.sold === show.capacity) return <span style={styles.badgeSoldOut}>Sold Out</span>;
    const percent = (show.sold / show.capacity) * 100;
    if (percent >= 85) return <span style={styles.badgeHighDemand}>High Demand</span>;
    return <span style={styles.badgeAvailable}>Available</span>;
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🎟️ Theatre Sales Dashboard</h1>
          <p style={styles.subtitle}>Salesperson Overview — Real-time ticket sales & show insights</p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.lastUpdated}>Last updated: {lastUpdated.toLocaleTimeString()}</div>
          <button onClick={handleRefresh} style={styles.refreshBtn}>⟳ Refresh</button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={styles.statsGrid}>
        <StatCard title="Daily Ticket Sales" value={todayStats.totalSold} icon="🎫" color="#3b82f6" />
        <StatCard title="Daily Revenue" value={formatCurrency(revenue.daily)} icon="💰" color="#10b981" />
        <StatCard title="Weekly Revenue" value={formatCurrency(revenue.weekly)} icon="📆" color="#8b5cf6" />
        <StatCard title="Monthly Revenue" value={formatCurrency(revenue.monthly)} icon="📅" color="#f59e0b" />
        <StatCard title="Occupancy Rate" value={`${todayStats.occupancyRate}%`} icon="📊" color="#ec489a" />
        <StatCard title="Tickets Sold vs Total" value={`${todayStats.totalSold} / ${todayStats.totalCapacity}`} icon="🪑" color="#6b7280" />
      </div>

      {/* Two Column Layout */}
      <div style={styles.twoColumnLayout}>
        {/* Left Column - Charts */}
        <div style={styles.leftColumn}>
          {/* Daily Sales Trend Chart */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3>📈 Daily Ticket Sales Trend (Last 7 Days)</h3>
              <p style={styles.cardSub}>Number of tickets sold per day</p>
            </div>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} tickets`, 'Sold']} />
                  <Legend />
                  <Bar dataKey="ticketsSold" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Tickets Sold" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Tickets Sold vs Available */}
          <div style={{ ...styles.card, marginTop: '1.5rem' }}>
            <div style={styles.cardHeader}>
              <h3>🥧 Tickets Sold vs Available (Today's Active Shows)</h3>
              <p style={styles.cardSub}>Overall seat utilization across all shows</p>
            </div>
            <div style={styles.pieChartWrapper}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} seats`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.pieStats}>
              <div><span style={{ backgroundColor: '#10b981' }} className="color-dot"></span> Tickets Sold: {todayStats.totalSold}</div>
              <div><span style={{ backgroundColor: '#f59e0b' }} className="color-dot"></span> Available: {todayStats.totalCapacity - todayStats.totalSold}</div>
            </div>
          </div>
        </div>

        {/* Right Column - Shows & Alerts */}
        <div style={styles.rightColumn}>
          {/* Today's Scheduled Shows */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3>🎭 Today's Scheduled Shows</h3>
              <p style={styles.cardSub}>Live status & seat availability</p>
            </div>
            <div style={styles.showsList}>
              {shows.map((show) => (
                <div key={show.id} style={{ ...styles.showItem, opacity: show.isCancelled ? 0.6 : 1 }}>
                  <div style={styles.showInfo}>
                    <div>
                      <div style={styles.showName}>{show.name}</div>
                      <div style={styles.showTime}>🕒 {show.time}</div>
                    </div>
                    {getShowStatusBadge(show)}
                  </div>
                  <div style={styles.seatInfo}>
                    <span>🎫 Sold: {show.sold} / {show.capacity}</span>
                    <div style={styles.progressBarContainer}>
                      <div style={{ ...styles.progressBar, width: `${(show.sold / show.capacity) * 100}%`, backgroundColor: show.isCancelled ? '#9ca3af' : show.sold === show.capacity ? '#dc2626' : '#10b981' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Alerts Section */}
          <div style={{ ...styles.card, marginTop: '1.5rem', backgroundColor: '#fffaf0' }}>
            <div style={styles.cardHeader}>
              <h3>🔔 Quick Alerts</h3>
              <p style={styles.cardSub}>Critical updates for sales team</p>
            </div>
            <AlertBanner alerts={alerts} />
          </div>

          {/* Additional Info: Revenue Breakdown */}
          <div style={{ ...styles.card, marginTop: '1.5rem' }}>
            <div style={styles.cardHeader}>
              <h3>💰 Revenue Snapshot</h3>
            </div>
            <div style={styles.revenueBreakdown}>
              <div style={styles.revenueItem}>
                <span>Daily Revenue</span>
                <strong>{formatCurrency(revenue.daily)}</strong>
                <small>Today's shows</small>
              </div>
              <div style={styles.revenueItem}>
                <span>Weekly Revenue</span>
                <strong>{formatCurrency(revenue.weekly)}</strong>
                <small>Last 7 days</small>
              </div>
              <div style={styles.revenueItem}>
                <span>Monthly Revenue</span>
                <strong>{formatCurrency(revenue.monthly)}</strong>
                <small>Projected</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div style={styles.footer}>
        <p>📌 Data refreshes every 5 minutes automatically. Sold-out and cancellation alerts are highlighted.</p>
      </div>
    </div>
  );
};

// ===================== Styles (Inline for standalone use) =====================
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
    padding: '1.5rem',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'sans-serif',
  },
  spinner: {
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '0.25rem',
    fontSize: '0.875rem',
  },
  headerRight: {
    textAlign: 'right',
  },
  lastUpdated: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  refreshBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  statIcon: {
    fontSize: '2rem',
  },
  statTitle: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  twoColumnLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.25rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
  },
  cardHeader: {
    marginBottom: '1rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.5rem',
  },
  cardSub: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  chartContainer: {
    width: '100%',
    height: '300px',
  },
  pieChartWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  pieStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  showsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  showItem: {
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
  },
  showInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  showName: {
    fontWeight: '600',
    fontSize: '1rem',
  },
  showTime: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  seatInfo: {
    fontSize: '0.875rem',
    color: '#374151',
  },
  progressBarContainer: {
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '6px',
    marginTop: '0.5rem',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.3s ease',
  },
  badgeSoldOut: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  badgeCancelled: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  badgeHighDemand: {
    backgroundColor: '#fed7aa',
    color: '#c2410c',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  badgeAvailable: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  alertContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  alertItem: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderLeftColor: '#dc2626',
  },
  alertMessage: {
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  noAlerts: {
    padding: '1rem',
    textAlign: 'center',
    backgroundColor: '#ecfdf5',
    borderRadius: '0.5rem',
    color: '#047857',
  },
  revenueBreakdown: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  },
  revenueItem: {
    textAlign: 'center',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#6b7280',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1rem',
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .color-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 6px;
  }
`;
document.head.appendChild(styleSheet);

export default SalesDashboard;