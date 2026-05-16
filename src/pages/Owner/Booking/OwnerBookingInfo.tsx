// frontend\src\pages\Owner\Booking\OwnerBookingInfo.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  LayoutGrid,
  Eye,
  Ticket,
  Building,
  X,
  CreditCard,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";
import ReusableButton from "../../../components/Reusable/ReusableButton";
import ReusableTable from "../../../components/Reusable/ReusableTable";
import supabase from "@/config/supabaseClient";

// Types
interface TicketType {
  seatType: string;
  quantity: number;
  price: number;
}

interface BookingInfoType {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  hallName: string;
  bookingDate: string;
  totalTickets: number;
  totalAmount: number;
  netAmount: number;
  commissionRate: number;
  bookedBy: string;
  bookingSource: "online" | "cash";
  ticketTypes: TicketType[];
}

// Helper functions (unchanged)
const formatDateSafe = (dateStr: string | undefined): string => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

const formatETB = (amount: number | undefined): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return "ETB 0";
  return `ETB ${amount.toLocaleString()}`;
};

const formatNumber = (value: number | undefined): string => {
  if (value === undefined || value === null || isNaN(value)) return "0";
  return value.toLocaleString();
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
}> = ({ title, value, icon: Icon, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${
            isHovered ? "scale-105" : ""
          }`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ViewDetailsModal: React.FC<{
  booking: BookingInfoType | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const formatTicketCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/80 text-sm">{booking.eventName}</p>
              <p className="text-xs text-white/60 mt-0.5">
                {booking.hallName} • {formatDateSafe(booking.eventDate)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-xl transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Booking ID</p>
                <p className="font-semibold">{booking.id || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Booked By</p>
                <p className="font-semibold">{booking.bookedBy || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Tickets</p>
                <p className="font-semibold">
                  {formatNumber(booking.totalTickets)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gross Amount</p>
                <p className="font-semibold text-teal-600">
                  {formatTicketCurrency(booking.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  Net Amount (after {booking.commissionRate}% fee)
                </p>
                <p className="font-semibold text-green-600">
                  {formatTicketCurrency(booking.netAmount)}
                </p>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Ticket className="h-4 w-4 text-teal-600" />
            Ticket Details
          </h3>

          <div className="space-y-3 mb-6">
            {booking.ticketTypes && booking.ticketTypes.length > 0 ? (
              booking.ticketTypes.map((ticket, idx) => (
                <div
                  key={`${booking.id}-ticket-${idx}`}
                  className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">
                        {ticket.seatType || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {formatNumber(ticket.quantity)} tickets
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: {formatTicketCurrency(ticket.price)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-teal-600">
                        {formatTicketCurrency(
                          (ticket.price || 0) * (ticket.quantity || 0),
                        )}
                      </p>
                      <p className="text-xs text-gray-400">Subtotal</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No ticket-level details available
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-5 text-center border border-teal-200">
            <div className="inline-block p-3 bg-white rounded-xl shadow-md mb-2">
              <Calendar className="h-8 w-8 text-teal-600" />
            </div>
            <p className="text-sm font-medium text-gray-800">
              Event Date: {formatDateSafe(booking.eventDate)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Booking Date: {formatDateSafe(booking.bookingDate)}
            </p>
          </div>
        </div>

        <div className="border-t p-5 bg-gray-50 flex justify-end">
          <ReusableButton onClick={onClose}>Close</ReusableButton>
        </div>
      </motion.div>
    </div>
  );
};

const OwnerBookingInfo: React.FC = () => {
  const [bookings, setBookings] = useState<BookingInfoType[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingInfoType[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filterHall, setFilterHall] = useState("all");
  const [dateRange, setDateRange] = useState<
    "daily" | "monthly" | "yearly" | "custom"
  >("monthly");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingInfoType | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  // Fetch data (unchanged)
  useEffect(() => {
    const fetchOwnerBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        let userId: string | null = null;
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser?.id || parsedUser?.user_id || null;
          } catch (e) {}
        }
        if (!userId) {
          const storedSession = localStorage.getItem("supabase.auth.token");
          if (storedSession) {
            try {
              const session = JSON.parse(storedSession);
              userId = session?.user?.id || null;
            } catch (e) {}
          }
        }
        if (!userId)
          throw new Error("No authenticated user found. Please log in.");

        const { data: theater, error: theaterError } = await supabase
          .from("theaters")
          .select("id, legal_business_name")
          .eq("owner_user_id", userId)
          .maybeSingle();

        if (theaterError)
          throw new Error(`Theater lookup failed: ${theaterError.message}`);
        if (!theater) throw new Error("No theater found for this owner");

        let commissionRate = 10;
        const { data: contract, error: contractError } = await supabase
          .from("owners_contracts")
          .select("commission_rate")
          .eq("theater_id", theater.id)
          .eq("status", "active")
          .maybeSingle();

        if (!contractError && contract)
          commissionRate = contract.commission_rate;

        const { data: reservations, error: reservationsError } = await supabase
          .from("reservations")
          .select(
            `
            id,
            total_amount,
            payment_method,
            status,
            customer_name,
            customer_email,
            booking_date,
            event_id,
            schedule_id,
            is_guest,
            events!inner (title, theater_id),
            event_schedules!left (show_date, start_time, hall_id, halls!left (name))
          `,
          )
          .eq("events.theater_id", theater.id)
          .order("booking_date", { ascending: false });

        if (reservationsError)
          throw new Error(
            `Reservations fetch failed: ${reservationsError.message}`,
          );
        if (!reservations || reservations.length === 0) {
          setBookings([]);
          setFilteredBookings([]);
          setLoading(false);
          return;
        }

        const transformedBookings: BookingInfoType[] = reservations.map(
          (res: any) => {
            const gross = res.total_amount || 0;
            const net = gross * (1 - commissionRate / 100);
            const schedule = res.event_schedules || {};
            const hall = schedule.halls || {};
            let eventDate = "";
            if (schedule.show_date && schedule.start_time) {
              eventDate = `${schedule.show_date}T${schedule.start_time}`;
            } else if (schedule.start_time) {
              eventDate = schedule.start_time;
            }
            return {
              id: res.id,
              eventId: res.event_id,
              eventName: res.events?.title || "Unknown Event",
              eventDate,
              hallName: hall.name || "Unknown Hall",
              bookingDate: res.booking_date || "",
              totalTickets: 0,
              totalAmount: gross,
              netAmount: net,
              commissionRate,
              bookedBy:
                res.customer_name ||
                res.customer_email ||
                (res.is_guest ? "Guest" : "Unknown"),
              bookingSource:
                res.payment_method?.toLowerCase() === "cash"
                  ? "cash"
                  : "online",
              ticketTypes: [],
            };
          },
        );

        setBookings(transformedBookings);
        setFilteredBookings(transformedBookings);
      } catch (err: any) {
        console.error("Error fetching owner bookings:", err);
        setError(err.message || "Failed to load bookings");
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerBookings();
  }, []);

  const uniqueHalls = useMemo(() => {
    return [...new Map(bookings.map((b) => [b.hallName, b.hallName])).values()];
  }, [bookings]);

  const filterByDateRange = (bookingsList: BookingInfoType[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return bookingsList.filter((booking) => {
      const bookingDate = new Date(booking.eventDate);
      if (isNaN(bookingDate.getTime())) return false;
      switch (dateRange) {
        case "daily":
          const bookingDay = new Date(
            bookingDate.getFullYear(),
            bookingDate.getMonth(),
            bookingDate.getDate(),
          );
          return bookingDay.getTime() === today.getTime();
        case "monthly":
          return (
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear
          );
        case "yearly":
          return bookingDate.getFullYear() === currentYear;
        case "custom":
          if (customStartDate && customEndDate) {
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59);
            return bookingDate >= start && bookingDate <= end;
          }
          return true;
        default:
          return true;
      }
    });
  };

  // Apply all filters (including debounced search)
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter (case-insensitive)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.id.toLowerCase().includes(query) ||
          booking.eventName.toLowerCase().includes(query) ||
          booking.hallName.toLowerCase().includes(query) ||
          booking.bookedBy.toLowerCase().includes(query),
      );
    }

    // Hall filter
    if (filterHall !== "all") {
      filtered = filtered.filter((b) => b.hallName === filterHall);
    }

    // Date range filter
    filtered = filterByDateRange(filtered);

    setFilteredBookings(filtered);
  }, [
    bookings,
    debouncedSearchQuery,
    filterHall,
    dateRange,
    customStartDate,
    customEndDate,
  ]);

  const stats = {
    totalBookings: filteredBookings.length,
    totalTickets: filteredBookings.reduce(
      (sum, b) => sum + (b.totalTickets || 0),
      0,
    ),
    totalGrossRevenue: filteredBookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0,
    ),
    totalNetRevenue: filteredBookings.reduce(
      (sum, b) => sum + (b.netAmount || 0),
      0,
    ),
    onlineBookings: filteredBookings.filter((b) => b.bookingSource === "online")
      .length,
    cashBookings: filteredBookings.filter((b) => b.bookingSource === "cash")
      .length,
  };

  const handleViewDetails = (booking: BookingInfoType) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    const headers = [
      "Booking ID",
      "Event Name",
      "Event Date",
      "Hall",
      "Booked By",
      "Source",
      "Total Tickets",
      "Gross Amount (ETB)",
      "Commission (%)",
      "Net Amount (ETB)",
    ];
    const csvData = filteredBookings.map((b) => [
      b.id,
      b.eventName,
      formatDateSafe(b.eventDate),
      b.hallName,
      b.bookedBy,
      b.bookingSource === "online" ? "Online" : "Cash",
      b.totalTickets,
      b.totalAmount,
      b.commissionRate,
      b.netAmount,
    ]);
    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bookings_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Bookings Report</title>
      <style>
        body { font-family: Arial; padding:20px; }
        h1 { color:#0f766e; }
        .summary { margin-bottom:20px; padding:15px; background:#f5f5f5; border-radius:8px; }
        table { width:100%; border-collapse:collapse; margin-top:20px; }
        th, td { border:1px solid #ddd; padding:8px; text-align:left; }
        th { background-color:#0f766e; color:white; }
      </style></head>
      <body>
        <h1>Theatre Hub - Bookings Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <div class="summary">
          <p><strong>Total Bookings:</strong> ${stats.totalBookings}</p>
          <p><strong>Total Tickets:</strong> ${stats.totalTickets}</p>
          <p><strong>Gross Revenue:</strong> ${formatETB(stats.totalGrossRevenue)}</p>
          <p><strong>Net Revenue (after commission):</strong> ${formatETB(stats.totalNetRevenue)}</p>
        </div>
        <table><thead><tr><th>Booking ID</th><th>Event</th><th>Date</th><th>Hall</th><th>Booked By</th><th>Source</th><th>Tickets</th><th>Gross</th><th>Net</th></tr></thead>
        <tbody>
          ${filteredBookings
            .map(
              (b) => `
            <tr>
              <td>${b.id}</td>
              <td>${b.eventName}</td>
              <td>${formatDateSafe(b.eventDate)}</td>
              <td>${b.hallName}</td>
              <td>${b.bookedBy}</td>
              <td>${b.bookingSource === "online" ? "Online" : "Cash"}</td>
              <td>${b.totalTickets}</td>
              <td>${formatETB(b.totalAmount)}</td>
              <td>${formatETB(b.netAmount)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody></table>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const tableData = filteredBookings.map((booking) => ({
    id: booking.id,
    eventName: (
      <div>
        <p className="font-medium text-gray-900">{booking.eventName}</p>
        <p className="text-xs text-gray-500">
          {formatDateSafe(booking.eventDate)}
        </p>
      </div>
    ),
    hallName: (
      <div className="flex items-center gap-2">
        <Building className="h-3 w-3 text-gray-400" />
        <span className="text-sm font-medium text-gray-700">
          {booking.hallName}
        </span>
      </div>
    ),
    bookedBy: (
      <div className="flex items-center gap-2">
        <CreditCard
          className={`h-3 w-3 ${booking.bookingSource === "online" ? "text-teal-600" : "text-orange-600"}`}
        />
        <div>
          <p className="font-medium text-gray-900">{booking.bookedBy}</p>
          <p className="text-xs text-gray-500">
            {booking.bookingSource === "online" ? "Online" : "Cash"}
          </p>
        </div>
      </div>
    ),
    totalTickets: (
      <span className="font-semibold text-gray-900">
        {formatNumber(booking.totalTickets)}
      </span>
    ),
    totalAmount: (
      <span className="text-green-600 font-semibold">
        {formatETB(booking.totalAmount)}
      </span>
    ),
    netAmount: (
      <span className="text-teal-600 font-semibold">
        {formatETB(booking.netAmount)}
      </span>
    ),
    actions: (
      <button
        onClick={() => handleViewDetails(booking)}
        className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition"
        title="View Details"
      >
        <Eye className="h-4 w-4 text-teal-600" />
      </button>
    ),
  }));

  const tableColumns = [
    { Header: "Booking ID", accessor: "id", sortable: true },
    { Header: "Event", accessor: "eventName", sortable: true },
    { Header: "Hall", accessor: "hallName", sortable: true },
    { Header: "Booked By", accessor: "bookedBy", sortable: true },
    { Header: "Tickets", accessor: "totalTickets", sortable: true },
    { Header: "Gross (ETB)", accessor: "totalAmount", sortable: true },
    { Header: "Net (ETB)", accessor: "netAmount", sortable: true },
    { Header: "", accessor: "actions", sortable: false },
  ];

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
            Error Loading Bookings
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <ReusableButton onClick={() => window.location.reload()}>
            Retry
          </ReusableButton>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Theater Bookings
              </h1>
              <p className="text-sm text-gray-500">
                Manage and track all booking records
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Calendar}
            color="from-teal-500 to-teal-600"
            delay={0.1}
          />
          <StatCard
            title="Total Tickets"
            value={formatNumber(stats.totalTickets)}
            icon={Ticket}
            color="from-purple-500 to-pink-600"
            delay={0.15}
          />
          <StatCard
            title="Gross Revenue"
            value={formatETB(stats.totalGrossRevenue)}
            icon={TrendingUp}
            color="from-emerald-500 to-green-600"
            delay={0.2}
          />
          <StatCard
            title="Net Revenue"
            value={formatETB(stats.totalNetRevenue)}
            icon={CreditCard}
            color="from-blue-500 to-cyan-600"
            delay={0.25}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-teal-600">Online Bookings</p>
                <p className="text-2xl font-bold text-teal-700">
                  {stats.onlineBookings}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-teal-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600">Cash Bookings</p>
                <p className="text-2xl font-bold text-orange-700">
                  {stats.cashBookings}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters Section with enhanced search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search input with icon and clear button */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by ID, event, hall, customer..."
                className="pl-9 pr-8 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Hall Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterHall}
                onChange={(e) => setFilterHall(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white min-w-[150px] text-sm"
              >
                <option value="all">All Halls</option>
                {uniqueHalls.map((hall) => (
                  <option key={hall} value={hall}>
                    {hall}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {["daily", "monthly", "yearly", "custom"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDateRange(opt as any)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                    dateRange === opt
                      ? "bg-white text-teal-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>

            {/* Custom Date Range Picker */}
            {dateRange === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* ReusableTable – search is disabled because we use our own */}
        <ReusableTable
          columns={tableColumns}
          data={tableData}
          title="Bookings List"
          icon={Ticket}
          showSearch={false} // Hide default search, use custom one above
          showExport={true}
          showPrint={true}
          onExport={handleExport}
          onPrint={handlePrint}
          itemsPerPage={10}
          itemsPerPageOptions={[10, 25, 50, 100]}
        />

        <ViewDetailsModal
          booking={selectedBooking}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
        />
      </div>
    </div>
  );
};

export default OwnerBookingInfo;