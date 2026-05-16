// src/pages/Owner/financial/FinancialAnalytics.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  CalendarRange,
  CreditCard,
} from "lucide-react";
import { Card, StatCard, ChartCard } from "../../../components/Overview/Card";
import { AreaChart } from "../../../components/Overview/AreaChart";
import Colors from "../../../components/Reusable/Colors";
import supabase from "@/config/supabaseClient";

// ---------- Types ----------
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

interface DateRange {
  from: string;
  to: string;
}

type PeriodType = "daily" | "monthly" | "yearly" | "custom";

// ---------- Helpers ----------
const formatFullCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};

// ---------- Advanced Filter Component (exactly as requested) ----------
const AdvancedFilter: React.FC<{
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  selectedEvent: string;
  onEventSelect: (eventId: string) => void;
  onReset: () => void;
  events: { id: string; name: string }[];
}> = ({
  period,
  onPeriodChange,
  dateRange,
  onDateRangeChange,
  selectedEvent,
  onEventSelect,
  onReset,
  events,
}) => {
  const [showEventDropdown, setShowEventDropdown] = useState(false);

  const selectedEventName =
    events.find((e) => e.id === selectedEvent)?.name || "All Events";

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Period
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "daily" as PeriodType, label: "Daily", icon: Calendar },
              { id: "monthly" as PeriodType, label: "Monthly", icon: Calendar },
              { id: "yearly" as PeriodType, label: "Yearly", icon: Calendar },
              {
                id: "custom" as PeriodType,
                label: "Custom Range",
                icon: CalendarRange,
              },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => onPeriodChange(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  period === p.id
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <p.icon className="h-4 w-4" />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {period === "custom" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  onDateRangeChange({ ...dateRange, from: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  onDateRangeChange({ ...dateRange, to: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Event
          </label>
          <button
            onClick={() => setShowEventDropdown(!showEventDropdown)}
            className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span>{selectedEventName}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                showEventDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {showEventDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2 max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    onEventSelect("");
                    setShowEventDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedEvent === ""
                      ? "bg-teal-50 text-teal-700"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  All Events
                </button>
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      onEventSelect(event.id);
                      setShowEventDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedEvent === event.id
                        ? "bg-teal-50 text-teal-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {event.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {(selectedEvent || period !== "monthly") && (
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

// ---------- Main Component ----------
const FinancialAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>("monthly");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  // Real data states
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [eventScheduleMap, setEventScheduleMap] = useState<Record<string, any>>(
    {},
  );
  const [hallMap, setHallMap] = useState<
    Record<string, { name: string; capacity: number }>
  >({});
  const [commissionRate, setCommissionRate] = useState<number>(10);

  // ---------- Data Fetching (real Supabase) ----------
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Authentication – try multiple ways
        let userId: string | null = null;

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (!sessionError && session?.user) {
          userId = session.user.id;
        } else {
          // fallback: scan localStorage
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
              const value = localStorage.getItem(key);
              if (
                value &&
                (value.includes("c18a3475") || value.includes("user"))
              ) {
                try {
                  const parsed = JSON.parse(value);
                  const id = parsed?.id || parsed?.user?.id || parsed?.user_id;
                  if (id && id.length > 10) {
                    userId = id;
                    break;
                  }
                } catch (e) {}
              }
            }
          }
        }

        if (!userId)
          throw new Error("Could not verify user. Please log in again.");

        // 2. Get theater
        const { data: theater, error: theaterError } = await supabase
          .from("theaters")
          .select("id, legal_business_name")
          .eq("owner_user_id", userId)
          .maybeSingle();

        if (theaterError)
          throw new Error(`Theater lookup failed: ${theaterError.message}`);
        if (!theater) throw new Error("No theater found for this owner");

        // 3. Commission rate
        const { data: contract } = await supabase
          .from("owners_contracts")
          .select("commission_rate")
          .eq("theater_id", theater.id)
          .eq("status", "active")
          .maybeSingle();
        if (contract) setCommissionRate(contract.commission_rate);

        // 4. Events
        const { data: events, error: eventsError } = await supabase
          .from("events")
          .select("id, title")
          .eq("theater_id", theater.id);
        if (eventsError)
          throw new Error(`Events fetch failed: ${eventsError.message}`);
        setAllEvents(events || []);
        if (!events || events.length === 0) {
          setAllReservations([]);
          setLoading(false);
          return;
        }

        const eventIds = events.map((e) => e.id);

        // 5. Reservations (confirmed only)
        const { data: reservations, error: reservationsError } = await supabase
          .from("reservations")
          .select(
            "id, total_amount, payment_method, status, customer_name, customer_email, booking_date, event_id, schedule_id, is_guest",
          )
          .in("event_id", eventIds)
          .eq("status", "confirmed");
        if (reservationsError)
          throw new Error(
            `Reservations fetch failed: ${reservationsError.message}`,
          );
        setAllReservations(reservations || []);

        // 6. Schedules & Halls (with capacity)
        const scheduleIds = [
          ...new Set(
            (reservations || []).map((r) => r.schedule_id).filter(Boolean),
          ),
        ];
        let scheduleMap: Record<string, any> = {};
        if (scheduleIds.length > 0) {
          const { data: schedules, error: schedulesError } = await supabase
            .from("event_schedules")
            .select("id, show_date, start_time, hall_id")
            .in("id", scheduleIds);
          if (!schedulesError && schedules) {
            scheduleMap = Object.fromEntries(schedules.map((s) => [s.id, s]));
            const hallIds = [
              ...new Set(schedules.map((s) => s.hall_id).filter(Boolean)),
            ];
            if (hallIds.length > 0) {
              const { data: halls, error: hallsError } = await supabase
                .from("halls")
                .select("id, name, capacity")
                .in("id", hallIds);
              if (!hallsError && halls) {
                const hallInfoMap = Object.fromEntries(
                  halls.map((h) => [
                    h.id,
                    { name: h.name, capacity: h.capacity || 0 },
                  ]),
                );
                setHallMap(hallInfoMap);
              }
            }
          }
        }
        setEventScheduleMap(scheduleMap);
      } catch (err: any) {
        console.error("Error fetching financial data:", err);
        setError(err.message || "Failed to load financial data");
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  // ---------- Filtering Logic (same as your original) ----------
  const getFilteredReservations = useCallback(() => {
    let filtered = [...allReservations];
    if (selectedEventId)
      filtered = filtered.filter((r) => r.event_id === selectedEventId);

    if (period === "custom" && dateRange.from && dateRange.to) {
      const start = new Date(dateRange.from);
      const end = new Date(dateRange.to);
      end.setHours(23, 59, 59);
      filtered = filtered.filter((r) => {
        const schedule = eventScheduleMap[r.schedule_id];
        if (!schedule || !schedule.show_date) return false;
        const eventDate = new Date(schedule.show_date);
        return eventDate >= start && eventDate <= end;
      });
    } else if (period !== "custom") {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter((r) => {
        const schedule = eventScheduleMap[r.schedule_id];
        if (!schedule || !schedule.show_date) return false;
        const eventDate = new Date(schedule.show_date);
        switch (period) {
          case "daily":
            const eventDay = new Date(
              eventDate.getFullYear(),
              eventDate.getMonth(),
              eventDate.getDate(),
            );
            return eventDay.getTime() === today.getTime();
          case "monthly":
            return (
              eventDate.getMonth() === currentMonth &&
              eventDate.getFullYear() === currentYear
            );
          case "yearly":
            return eventDate.getFullYear() === currentYear;
          default:
            return true;
        }
      });
    }
    return filtered;
  }, [allReservations, selectedEventId, period, dateRange, eventScheduleMap]);

  // Chart data grouped by period
  const chartData = useMemo((): RevenueData[] => {
    const filtered = getFilteredReservations();
    if (filtered.length === 0) return [];

    const groups = new Map<string, { revenue: number; tickets: number }>();
    filtered.forEach((res) => {
      const schedule = eventScheduleMap[res.schedule_id];
      if (!schedule || !schedule.show_date) return;
      const date = new Date(schedule.show_date);
      let key: string;
      if (period === "daily") {
        key = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (period === "monthly") {
        key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      } else if (period === "yearly") {
        key = date.getFullYear().toString();
      } else {
        const start = new Date(dateRange.from);
        const end = new Date(dateRange.to);
        const diffDays = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays <= 31)
          key = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        else if (diffDays <= 365)
          key = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
        else key = date.getFullYear().toString();
      }
      if (!groups.has(key)) groups.set(key, { revenue: 0, tickets: 0 });
      const group = groups.get(key)!;
      group.revenue += res.total_amount || 0;
      group.tickets += 1;
    });
    let sorted = Array.from(groups.entries()).map(([periodKey, data]) => ({
      period: periodKey,
      revenue: data.revenue,
      tickets: data.tickets,
    }));
    sorted.sort((a, b) => a.period.localeCompare(b.period));
    return sorted;
  }, [getFilteredReservations, eventScheduleMap, period, dateRange]);

  // Totals
  const totals = useMemo(() => {
    const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
    const totalTickets = chartData.reduce((sum, d) => sum + d.tickets, 0);
    return { totalRevenue, totalTickets };
  }, [chartData]);

  // Today's revenue (real)
  const todaysStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const filtered = allReservations.filter((r) => {
      const schedule = eventScheduleMap[r.schedule_id];
      return schedule && schedule.show_date === today;
    });
    const revenue = filtered.reduce((sum, r) => sum + (r.total_amount || 0), 0);
    return { revenue, tickets: filtered.length };
  }, [allReservations, eventScheduleMap]);

  // Top Events (with real occupancy using hall capacity)
  const topEvents = useMemo((): EventPerformance[] => {
    const filtered = getFilteredReservations();
    const eventMap = new Map<
      string,
      {
        revenue: number;
        tickets: number;
        eventName: string;
        scheduleId?: string;
      }
    >();
    filtered.forEach((res) => {
      const event = allEvents.find((e) => e.id === res.event_id);
      if (!event) return;
      if (!eventMap.has(res.event_id)) {
        eventMap.set(res.event_id, {
          revenue: 0,
          tickets: 0,
          eventName: event.title,
          scheduleId: res.schedule_id,
        });
      }
      const data = eventMap.get(res.event_id)!;
      data.revenue += res.total_amount || 0;
      data.tickets += 1;
    });
    const performances: EventPerformance[] = [];
    for (const [id, data] of eventMap.entries()) {
      const schedule = eventScheduleMap[data.scheduleId || ""];
      const hallInfo = schedule?.hall_id ? hallMap[schedule.hall_id] : null;
      const hallName = hallInfo?.name || "Unknown";
      const capacity = hallInfo?.capacity || 0;
      const occupancy = capacity > 0 ? (data.tickets / capacity) * 100 : 0;
      performances.push({
        id,
        name: data.eventName,
        revenue: data.revenue,
        tickets: data.tickets,
        occupancy: Math.min(100, Math.round(occupancy)),
        hall: hallName,
        date: schedule?.show_date
          ? new Date(schedule.show_date).toISOString()
          : undefined,
      });
    }
    performances.sort((a, b) => b.revenue - a.revenue);
    return performances.slice(0, 5);
  }, [getFilteredReservations, allEvents, eventScheduleMap, hallMap]);

  // Payment Methods (real)
  const paymentMethods = useMemo((): PaymentMethod[] => {
    const filtered = getFilteredReservations();
    const methodTotals = new Map<string, number>();
    filtered.forEach((res) => {
      const method = res.payment_method || "unknown";
      methodTotals.set(
        method,
        (methodTotals.get(method) || 0) + (res.total_amount || 0),
      );
    });
    const total = Array.from(methodTotals.values()).reduce((a, b) => a + b, 0);
    const methods: PaymentMethod[] = [];
    methodTotals.forEach((amount, method) => {
      const percentage = total > 0 ? (amount / total) * 100 : 0;
      let icon;
      if (method.toLowerCase().includes("chapa"))
        icon = <Smartphone className="h-4 w-4" />;
      else if (method.toLowerCase() === "cash")
        icon = <Wallet className="h-4 w-4" />;
      else icon = <CreditCard className="h-4 w-4" />;
      methods.push({
        method:
          method === "chapa"
            ? "Mobile Money"
            : method.charAt(0).toUpperCase() + method.slice(1),
        amount,
        percentage,
        color: method === "chapa" ? Colors.skyTeal : Colors.deepBlue,
        icon,
      });
    });
    return methods;
  }, [getFilteredReservations]);

  // Key Insights (dynamic from real data)
  const revenueGrowth = useMemo(() => {
    if (chartData.length >= 2) {
      const first = chartData[0].revenue;
      const last = chartData[chartData.length - 1].revenue;
      if (first === 0) return "+∞";
      const growth = ((last - first) / first) * 100;
      return `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
    }
    return "N/A";
  }, [chartData]);

  const bestPerformanceEvent = topEvents[0]?.name || "—";
  const topPaymentMethod = paymentMethods[0]?.method || "—";
  const topPaymentPercent = paymentMethods[0]?.percentage.toFixed(1) || "0";

  // Helpers
  const getPeriodLabel = () => {
    switch (period) {
      case "daily":
        return "Daily";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      case "custom":
        return `Custom (${dateRange.from} to ${dateRange.to})`;
      default:
        return "Monthly";
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
        topEvents,
        paymentMethods,
        todaysRevenue: todaysStats.revenue,
        todaysTickets: todaysStats.tickets,
        selectedEventId,
        dateRange: period === "custom" ? dateRange : null,
      };
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financial_report_${period}_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsExporting(false);
      alert("Report exported successfully!");
    }, 500);
  };

  const handleEventSelect = (eventId: string) => setSelectedEventId(eventId);
  const handleResetFilter = () => {
    setSelectedEventId("");
    setPeriod("monthly");
    setDateRange({
      from: new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .split("T")[0],
      to: new Date().toISOString().split("T")[0],
    });
  };

  const eventsForFilter = useMemo(
    () => allEvents.map((e) => ({ id: e.id, name: e.title })),
    [allEvents],
  );
  const selectedEventName =
    eventsForFilter.find((e) => e.id === selectedEventId)?.name || "";

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Financial Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {getPeriodLabel()} financial overview and performance metrics
          </p>
        </div>
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

      {/* Advanced Filter */}
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
              <p className="text-emerald-100 text-sm font-medium">
                Today's Revenue
              </p>
              <p className="text-3xl font-bold mt-2">
                {formatFullCurrency(todaysStats.revenue)}
              </p>
              <p className="text-emerald-100 text-xs mt-1">
                {todaysStats.tickets} tickets sold
              </p>
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
        subtitle={`${getPeriodLabel()} revenue performance - Total: ${formatFullCurrency(
          totals.totalRevenue,
        )}`}
        actions={
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: Colors.deepTeal }}
            />
            <span className="text-xs text-gray-600">Revenue</span>
          </div>
        }
      >
        <AreaChart
          data={chartData}
          areas={[
            {
              dataKey: "revenue",
              name: "Revenue",
              color: Colors.deepTeal,
              gradient: true, // ✅ boolean – matches component's type
            },
          ]}
          xAxisKey="period"
          yAxisLabel="Revenue (ETB)"
          height={350}
        />
      </ChartCard>

      {/* Top Performing Events */}
      <Card
        title="Top Performing Events"
        subtitle={
          selectedEventId
            ? `Filtered: ${selectedEventName}`
            : "Best performing events by revenue"
        }
        showMoreLink="/owner/events"
        showMoreText="View All Events"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">
                  Event Name
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">
                  Hall
                </th>
                <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">
                  Date
                </th>
                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">
                  Revenue
                </th>
                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">
                  Tickets
                </th>
                <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">
                  Occupancy
                </th>
              </tr>
            </thead>
            <tbody>
              {topEvents.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-3">
                    <p className="text-sm font-medium text-gray-900">
                      {event.name}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-sm text-gray-600">{event.hall || "—"}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-sm text-gray-600">
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "—"}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-semibold text-gray-900">
                    {formatFullCurrency(event.revenue)}
                  </td>
                  <td className="py-3 px-3 text-right text-sm text-gray-600">
                    {formatNumber(event.tickets)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-gray-600">
                        {event.occupancy}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-teal-500 h-1.5 rounded-full"
                          style={{ width: `${event.occupancy}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {topEvents.length === 0 && (
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
        <Card
          title="Payment Methods"
          subtitle="Distribution of payment transactions"
        >
          <div className="space-y-4">
            {paymentMethods.map((method, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1 rounded"
                      style={{ backgroundColor: `${method.color}20` }}
                    >
                      <div style={{ color: method.color }}>{method.icon}</div>
                    </div>
                    <span className="text-gray-600">{method.method}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">
                      {formatFullCurrency(method.amount)}
                    </span>
                    <span className="text-gray-500">
                      {method.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${method.percentage}%`,
                      backgroundColor: method.color,
                    }}
                  />
                </div>
              </div>
            ))}
            {paymentMethods.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No payment data available
              </div>
            )}
            <div className="pt-3 mt-2 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Total</span>
                <span className="font-bold text-gray-900">
                  {formatFullCurrency(
                    paymentMethods.reduce((sum, m) => sum + m.amount, 0),
                  )}
                </span>
              </div>
            </div>
          </div>
        </Card>

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
                  <p className="text-2xl font-bold">{revenueGrowth}</p>
                  <p className="text-xs opacity-75">
                    vs previous{" "}
                    {period === "custom"
                      ? "period"
                      : getPeriodLabel().toLowerCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Best Performance</p>
                  <p className="text-2xl font-bold">{bestPerformanceEvent}</p>
                  <p className="text-xs opacity-75">Highest revenue event</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Top Payment</p>
                  <p className="text-2xl font-bold">{topPaymentMethod}</p>
                  <p className="text-xs opacity-75">
                    {topPaymentPercent}% of transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
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

export default FinancialAnalytics;
