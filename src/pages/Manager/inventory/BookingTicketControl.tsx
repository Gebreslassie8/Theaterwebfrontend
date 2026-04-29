// src/pages/Manager/inventory/BookingTicketControl.tsx
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Ticket, TrendingUp, Activity, 
  Eye, CheckCircle, XCircle, Ban, Clock, Download, Search 
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// ==================== Types ====================
export interface Booking {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  hall: string;
  seatNumbers: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  bookingDate: string;
  status: 'pending' | 'approved' | 'cancelled';
  paymentMethod: string;
  transactionId: string;
  ticketCount: number;
}

interface SeatDetail {
  seatNumber: string;
  type: 'Standard' | 'VIP' | 'Premium' | 'Wheelchair';
  price: number;
}

interface SalesStats {
  totalRevenue: number;
  totalTicketsSold: number;
  approvedBookings: number;
  pendingApprovals: number;
  cancelledBookings: number;
  occupancyRate: number;
}

// Helper: determine seat type and individual price
const getSeatTypeAndPrice = (seatNumber: string, basePrice: number): SeatDetail => {
  const row = seatNumber.charAt(0);
  const num = parseInt(seatNumber.slice(1));
  
  if ((row === 'A' || row === 'B') && num <= 10) {
    return { seatNumber, type: 'VIP', price: basePrice * 2 };
  }
  if ((row === 'C' || row === 'D') && num <= 15) {
    return { seatNumber, type: 'Premium', price: basePrice * 1.5 };
  }
  if (seatNumber === 'H05') {
    return { seatNumber, type: 'Wheelchair', price: basePrice * 0.9 };
  }
  return { seatNumber, type: 'Standard', price: basePrice };
};

// ==================== Main Component ====================
const BookingTicketControl: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'cancel' | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [stats, setStats] = useState<SalesStats>({
    totalRevenue: 0,
    totalTicketsSold: 0,
    approvedBookings: 0,
    pendingApprovals: 0,
    cancelledBookings: 0,
    occupancyRate: 0,
  });

  // Fresh mock data (10 bookings, all fields filled)
  const getFreshMockData = (): Booking[] => [
    {
      id: 'BKG001',
      eventName: 'Summer Music Festival',
      eventDate: '2024-07-15',
      eventTime: '19:00',
      hall: 'Grand Hall',
      seatNumbers: ['A12', 'A13', 'A14'],
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+1 234 567 8900',
      totalAmount: 450,
      bookingDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'pending',
      paymentMethod: 'credit_card',
      transactionId: 'TXN123456',
      ticketCount: 3,
    },
    {
      id: 'BKG002',
      eventName: 'Comedy Night',
      eventDate: '2024-07-18',
      eventTime: '20:00',
      hall: 'Blue Hall',
      seatNumbers: ['B05', 'B06'],
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      customerPhone: '+1 234 567 8901',
      totalAmount: 150,
      bookingDate: new Date(Date.now() - 1 * 86400000).toISOString(),
      status: 'approved',
      paymentMethod: 'mobile_money',
      transactionId: 'TXN123457',
      ticketCount: 2,
    },
    {
      id: 'BKG003',
      eventName: 'Movie Premiere: The Epic',
      eventDate: '2024-07-20',
      eventTime: '18:30',
      hall: 'Red Hall',
      seatNumbers: ['C01'],
      customerName: 'Mike Johnson',
      customerEmail: 'mike.johnson@example.com',
      customerPhone: '+1 234 567 8902',
      totalAmount: 120,
      bookingDate: new Date(Date.now() - 3 * 86400000).toISOString(),
      status: 'cancelled',
      paymentMethod: 'cash',
      transactionId: 'TXN123458',
      ticketCount: 1,
    },
    {
      id: 'BKG004',
      eventName: 'Summer Music Festival',
      eventDate: '2024-07-15',
      eventTime: '19:00',
      hall: 'Grand Hall',
      seatNumbers: ['B10', 'B11', 'B12', 'B13'],
      customerName: 'Sarah Williams',
      customerEmail: 'sarah.williams@example.com',
      customerPhone: '+1 234 567 8903',
      totalAmount: 600,
      bookingDate: new Date(Date.now() - 1 * 86400000).toISOString(),
      status: 'pending',
      paymentMethod: 'credit_card',
      transactionId: 'TXN123459',
      ticketCount: 4,
    },
    {
      id: 'BKG005',
      eventName: 'Traditional Theater Play',
      eventDate: '2024-07-22',
      eventTime: '19:00',
      hall: 'Grand Hall',
      seatNumbers: ['A01', 'A02'],
      customerName: 'David Brown',
      customerEmail: 'david.brown@example.com',
      customerPhone: '+1 234 567 8904',
      totalAmount: 180,
      bookingDate: new Date(Date.now() - 0.5 * 86400000).toISOString(),
      status: 'approved',
      paymentMethod: 'debit_card',
      transactionId: 'TXN123460',
      ticketCount: 2,
    },
    {
      id: 'BKG006',
      eventName: 'Rock Concert',
      eventDate: '2024-07-25',
      eventTime: '21:00',
      hall: 'Grand Hall',
      seatNumbers: ['C12', 'C13', 'C14', 'C15'],
      customerName: 'Emma Wilson',
      customerEmail: 'emma.wilson@example.com',
      customerPhone: '+1 234 567 8905',
      totalAmount: 800,
      bookingDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      status: 'approved',
      paymentMethod: 'credit_card',
      transactionId: 'TXN123461',
      ticketCount: 4,
    },
    {
      id: 'BKG007',
      eventName: 'Jazz Evening',
      eventDate: '2024-07-28',
      eventTime: '20:30',
      hall: 'Blue Hall',
      seatNumbers: ['D02', 'D03'],
      customerName: 'Robert Taylor',
      customerEmail: 'robert.taylor@example.com',
      customerPhone: '+1 234 567 8906',
      totalAmount: 220,
      bookingDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'pending',
      paymentMethod: 'mobile_money',
      transactionId: 'TXN123462',
      ticketCount: 2,
    },
    {
      id: 'BKG008',
      eventName: 'Kids Magic Show',
      eventDate: '2024-07-30',
      eventTime: '14:00',
      hall: 'Red Hall',
      seatNumbers: ['E01', 'E02', 'E03'],
      customerName: 'Lisa Anderson',
      customerEmail: 'lisa.anderson@example.com',
      customerPhone: '+1 234 567 8907',
      totalAmount: 105,
      bookingDate: new Date(Date.now() - 1 * 86400000).toISOString(),
      status: 'approved',
      paymentMethod: 'cash',
      transactionId: 'TXN123463',
      ticketCount: 3,
    },
    {
      id: 'BKG009',
      eventName: 'Broadway Musical',
      eventDate: '2024-08-02',
      eventTime: '19:30',
      hall: 'Grand Hall',
      seatNumbers: ['F10', 'F11'],
      customerName: 'Michael Lee',
      customerEmail: 'michael.lee@example.com',
      customerPhone: '+1 234 567 8908',
      totalAmount: 300,
      bookingDate: new Date(Date.now() - 4 * 86400000).toISOString(),
      status: 'cancelled',
      paymentMethod: 'credit_card',
      transactionId: 'TXN123464',
      ticketCount: 2,
    },
    {
      id: 'BKG010',
      eventName: 'Film Festival',
      eventDate: '2024-08-05',
      eventTime: '16:00',
      hall: 'Red Hall',
      seatNumbers: ['G07'],
      customerName: 'Olivia Martinez',
      customerEmail: 'olivia.martinez@example.com',
      customerPhone: '+1 234 567 8909',
      totalAmount: 85,
      bookingDate: new Date(Date.now() - 1 * 86400000).toISOString(),
      status: 'pending',
      paymentMethod: 'debit_card',
      transactionId: 'TXN123465',
      ticketCount: 1,
    },
  ];

  // Load fresh data (overwrites localStorage to prevent corruption)
  useEffect(() => {
    const freshData = getFreshMockData();
    setBookings(freshData);
    localStorage.setItem('theater_bookings', JSON.stringify(freshData));
  }, []);

  // Apply search and status filters
  useEffect(() => {
    let filtered = [...bookings];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.customerName.toLowerCase().includes(term) ||
          b.eventName.toLowerCase().includes(term) ||
          b.id.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }
    setFilteredBookings(filtered);

    // Update statistics
    const totalRevenue = filtered
      .filter((b) => b.status === 'approved')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const totalTicketsSold = filtered
      .filter((b) => b.status === 'approved')
      .reduce((sum, b) => sum + b.ticketCount, 0);
    const approvedBookings = filtered.filter((b) => b.status === 'approved').length;
    const pendingApprovals = filtered.filter((b) => b.status === 'pending').length;
    const cancelledBookings = filtered.filter((b) => b.status === 'cancelled').length;
    const occupancyRate = filtered.length
      ? (approvedBookings / (approvedBookings + pendingApprovals + cancelledBookings)) * 100
      : 0;

    setStats({
      totalRevenue,
      totalTicketsSold,
      approvedBookings,
      pendingApprovals,
      cancelledBookings,
      occupancyRate: Math.round(occupancyRate),
    });
  }, [bookings, searchTerm, statusFilter]);

  // Persist changes to localStorage
  useEffect(() => {
    if (bookings.length) localStorage.setItem('theater_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // ---------- Action Handlers ----------
  const handleApprove = (booking: Booking) => {
    setSelectedBooking(booking);
    setConfirmAction('approve');
    setShowConfirmModal(true);
  };

  const handleCancel = (booking: Booking) => {
    setSelectedBooking(booking);
    setConfirmAction('cancel');
    setShowConfirmModal(true);
  };

  const confirmActionHandler = () => {
    if (!selectedBooking || !confirmAction) return;

    let updatedBookings: Booking[];
    if (confirmAction === 'approve') {
      updatedBookings = bookings.map((b) =>
        b.id === selectedBooking.id ? { ...b, status: 'approved' } : b
      );
      setSuccessMessage(`✅ Booking ${selectedBooking.id} approved! Tickets are now valid.`);
    } else {
      updatedBookings = bookings.map((b) =>
        b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b
      );
      setSuccessMessage(`❌ Booking ${selectedBooking.id} cancelled. Customer notified.`);
    }

    setBookings(updatedBookings);
    setShowConfirmModal(false);
    setSelectedBooking(null);
    setConfirmAction(null);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const viewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getSeatDetailsForBooking = (booking: Booking): SeatDetail[] => {
    const avgPrice = booking.totalAmount / booking.ticketCount;
    return booking.seatNumbers.map((seat) => getSeatTypeAndPrice(seat, avgPrice));
  };

  // ---------- Table Columns (Action icons only) ----------
  const columns = [
    { Header: 'Booking ID', accessor: 'id', sortable: true },
    {
      Header: 'Customer',
      accessor: 'customerName',
      sortable: true,
      Cell: (row: Booking) => (
        <div>
          <div className="font-medium text-gray-800">{row?.customerName || '—'}</div>
          <div className="text-xs text-gray-500">{row?.customerEmail || '—'}</div>
        </div>
      ),
    },
    { Header: 'Event', accessor: 'eventName', sortable: true },
    {
      Header: 'Date & Time',
      accessor: 'eventDate',
      sortable: true,
      Cell: (row: Booking) => (
        <div>
          <div>{row?.eventDate || '—'}</div>
          <div className="text-sm text-gray-500">{row?.eventTime || '—'}</div>
        </div>
      ),
    },
    { Header: 'Tickets', accessor: 'ticketCount', sortable: true },
    {
      Header: 'Amount',
      accessor: 'totalAmount',
      sortable: true,
      Cell: (row: Booking) => (
        <span className="font-semibold text-green-600">${row?.totalAmount?.toLocaleString() ?? '0'}</span>
      ),
    },
    {
      Header: 'Status',
      accessor: 'status',
      sortable: true,
      Cell: (row: Booking) => {
        const status = row?.status;
        if (!status) return <span className="text-gray-500">—</span>;
        const variants = {
          approved: 'bg-green-100 text-green-700',
          pending: 'bg-yellow-100 text-yellow-700',
          cancelled: 'bg-red-100 text-red-700',
        };
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${variants[status]}`}
          >
            {status === 'approved' && <CheckCircle className="h-3 w-3" />}
            {status === 'pending' && <Clock className="h-3 w-3" />}
            {status === 'cancelled' && <XCircle className="h-3 w-3" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      sortable: false,
      Cell: (row: Booking) => {
        if (!row) return null;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => viewDetails(row)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            {row.status === 'pending' && (
              <>
                <button
                  onClick={() => handleApprove(row)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                  title="Approve Booking"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={() => handleCancel(row)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Cancel Booking"
                >
                  <XCircle size={18} />
                </button>
              </>
            )}
            {row.status === 'approved' && (
              <button
                onClick={() => handleCancel(row)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Cancel Booking"
              >
                <Ban size={18} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const handleExport = () => alert('Export to CSV feature coming soon.');
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Booking & Ticket Control
        </h1>
        <p className="text-gray-600 mt-2">Manage customer bookings, approve/cancel tickets, and monitor sales</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <DollarSign className="h-8 w-8 opacity-90" />
            <span className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</span>
          </div>
          <p className="text-sm opacity-90 mt-2">Total Revenue (Approved)</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <Ticket className="h-8 w-8 opacity-90" />
            <span className="text-2xl font-bold">{stats.totalTicketsSold}</span>
          </div>
          <p className="text-sm opacity-90 mt-2">Tickets Sold (Approved)</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <TrendingUp className="h-8 w-8 opacity-90" />
            <span className="text-2xl font-bold">{stats.occupancyRate}%</span>
          </div>
          <p className="text-sm opacity-90 mt-2">Approval Rate</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <Activity className="h-8 w-8 opacity-90" />
            <span className="text-2xl font-bold">{stats.pendingApprovals}</span>
          </div>
          <p className="text-sm opacity-90 mt-2">Pending Approvals</p>
        </div>
      </div>

      {/* Centered Search & Filter */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-3xl">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by customer, event, or booking ID..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-5 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Reusable Table (without internal search) */}
      <ReusableTable
        columns={columns}
        data={filteredBookings}
        title="All Bookings"
        icon={Ticket}
        showSearch={false}
        showExport={true}
        showPrint={true}
        itemsPerPage={1000}
        itemsPerPageOptions={[1000]}
        onExport={handleExport}
        onPrint={handlePrint}
      />

      {/* Details Modal with seat‑level breakdown */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <button onClick={() => setShowDetailsModal(false)} className="hover:opacity-80">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <p className="opacity-90 mt-1">ID: {selectedBooking.id}</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Customer Info</p>
                  <div className="mt-2 space-y-2">
                    <div><strong>Name:</strong> {selectedBooking.customerName}</div>
                    <div><strong>Email:</strong> {selectedBooking.customerEmail}</div>
                    <div><strong>Phone:</strong> {selectedBooking.customerPhone}</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Event Details</p>
                  <div className="mt-2 space-y-2">
                    <div><strong>Event:</strong> {selectedBooking.eventName}</div>
                    <div><strong>Hall:</strong> {selectedBooking.hall}</div>
                    <div><strong>Date/Time:</strong> {selectedBooking.eventDate} {selectedBooking.eventTime}</div>
                  </div>
                </div>
              </div>

              {/* Seat details with types and individual prices */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Seat Details</p>
                <div className="space-y-2">
                  {getSeatDetailsForBooking(selectedBooking).map((seat, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white rounded-lg border">
                      <div>
                        <span className="font-mono font-bold">{seat.seatNumber}</span>
                        <span className="ml-2 text-sm text-gray-600">({seat.type})</span>
                      </div>
                      <span className="font-semibold text-green-600">${seat.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-600">${selectedBooking.totalAmount}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Payment Info</p>
                  <div className="mt-2 space-y-2">
                    <div><strong>Method:</strong> {selectedBooking.paymentMethod}</div>
                    <div><strong>Transaction ID:</strong> {selectedBooking.transactionId}</div>
                    <div><strong>Booked on:</strong> {new Date(selectedBooking.bookingDate).toLocaleString()}</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        selectedBooking.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : selectedBooking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedBooking.status === 'approved' && <CheckCircle className="h-4 w-4" />}
                      {selectedBooking.status === 'pending' && <Clock className="h-4 w-4" />}
                      {selectedBooking.status === 'cancelled' && <XCircle className="h-4 w-4" />}
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                {selectedBooking.status === 'pending' && (
                  <>
                    <ReusableButton
                      variant="success"
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleApprove(selectedBooking);
                      }}
                    >
                      Approve
                    </ReusableButton>
                    <ReusableButton
                      variant="danger"
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleCancel(selectedBooking);
                      }}
                    >
                      Cancel
                    </ReusableButton>
                  </>
                )}
                <ReusableButton variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </ReusableButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal (Approve / Cancel) */}
      {showConfirmModal && selectedBooking && confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            {confirmAction === 'approve' ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            ) : (
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            )}
            <h2 className="text-xl font-bold mt-4">
              {confirmAction === 'approve' ? 'Approve Booking' : 'Cancel Booking'}
            </h2>
            <p className="text-gray-600 my-4">
              {confirmAction === 'approve'
                ? `Approve booking ${selectedBooking.id} for ${selectedBooking.customerName}?`
                : `Cancel booking ${selectedBooking.id}? This action cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <ReusableButton variant="outline" onClick={() => setShowConfirmModal(false)} className="flex-1">
                No, Go Back
              </ReusableButton>
              <ReusableButton
                variant={confirmAction === 'approve' ? 'success' : 'danger'}
                onClick={confirmActionHandler}
                className="flex-1"
              >
                Yes, {confirmAction === 'approve' ? 'Approve' : 'Cancel'}
              </ReusableButton>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        message={successMessage}
        onClose={() => setShowSuccessPopup(false)}
        duration={3000}
      />
    </div>
  );
};

export default BookingTicketControl;