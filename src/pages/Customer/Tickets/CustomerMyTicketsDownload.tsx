// src/pages/Customer/Tickets/CustomerMyTicketsDownload.tsx
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';
import { Eye, Download, X } from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// ==================== Types ====================
export interface TicketDetail {
  id: string;
  eventName: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  hall: string;
  seatType: string;
  seatNumber?: string;
  price: number;
  paymentTime: string;
  customerName: string;
  customerEmail: string;
  status: 'upcoming' | 'completed' | 'cancelled';  // NEW: ticket status
  qrCodeValue: string;
}

// ==================== Mock Data ====================
const generateMockCustomerTickets = (customerEmail: string): TicketDetail[] => {
  const events = [
    { name: 'Summer Music Festival', date: '2025-07-20', start: '19:00', end: '23:00', hall: 'Grand Hall' },
    { name: 'Comedy Night', date: '2025-07-22', start: '20:00', end: '22:30', hall: 'Blue Hall' },
    { name: 'Movie Premiere: The Epic', date: '2025-07-25', start: '18:30', end: '21:00', hall: 'Red Hall' },
    { name: 'Classical Music Evening', date: '2025-07-28', start: '19:30', end: '22:00', hall: 'Grand Hall' }
  ];
  const seatTypes = ['VIP', 'Premium', 'Economy', 'Standard'];
  const statuses: ('upcoming' | 'completed' | 'cancelled')[] = ['upcoming', 'completed', 'cancelled'];
  const mockTickets: TicketDetail[] = [];

  for (let i = 1; i <= 8; i++) {
    const event = events[i % events.length];
    const seatType = seatTypes[i % seatTypes.length];
    const seatNumber = `${String.fromCharCode(65 + (i % 15))}${Math.floor(Math.random() * 20) + 1}`;
    const price = Math.floor(Math.random() * 200) + 30;
    const paymentTime = new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString();
    const status = statuses[i % statuses.length];
    mockTickets.push({
      id: `TICK-${1000 + i}`,
      eventName: event.name,
      eventDate: event.date,
      eventStartTime: event.start,
      eventEndTime: event.end,
      hall: event.hall,
      seatType,
      seatNumber,
      price,
      paymentTime,
      customerName: 'Demo Customer',
      customerEmail,
      status,
      qrCodeValue: `TICKET:${`TICK-${1000 + i}`}|EVENT:${event.name}|SEAT:${seatNumber}|PRICE:${price}|STATUS:${status}`
    });
  }
  return mockTickets;
};

const loadUserTickets = (userEmail: string): TicketDetail[] => {
  const stored = localStorage.getItem('paid_tickets');
  if (stored) {
    const allTickets: TicketDetail[] = JSON.parse(stored);
    return allTickets.filter(t => t.customerEmail === userEmail);
  }
  const mock = generateMockCustomerTickets(userEmail);
  localStorage.setItem('paid_tickets', JSON.stringify(mock));
  return mock;
};

// ==================== Ticket Detail Modal ====================
interface TicketDetailModalProps {
  ticket: TicketDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, isOpen, onClose }) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `ticket_${ticket?.id || 'ticket'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download ticket. Please try again.');
    }
  };

  if (!isOpen || !ticket) return null;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl flex justify-between items-center text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold">🎟️ Ticket Details</h2>
          <button onClick={onClose} className="hover:opacity-80"><X className="h-6 w-6" /></button>
        </div>
        <div ref={ticketRef} className="p-6 bg-white">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
            <h3 className="text-2xl font-bold text-center mb-4">{ticket.eventName}</h3>
            <div className="space-y-2 mb-6">
              <p><span className="font-semibold">Event Date:</span> {ticket.eventDate}</p>
              <p><span className="font-semibold">Event Time:</span> {ticket.eventStartTime} – {ticket.eventEndTime}</p>
              <p><span className="font-semibold">Hall:</span> {ticket.hall}</p>
              <p><span className="font-semibold">Seat Type:</span> {ticket.seatType}</p>
              {ticket.seatNumber && <p><span className="font-semibold">Seat Number:</span> {ticket.seatNumber}</p>}
              <p><span className="font-semibold">Price Paid:</span> ${ticket.price.toFixed(2)}</p>
              <p><span className="font-semibold">Payment Time:</span> {new Date(ticket.paymentTime).toLocaleString()}</p>
              <p><span className="font-semibold">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>{ticket.status}</span></p>
              <p><span className="font-semibold">Customer:</span> {ticket.customerName}</p>
              <p><span className="font-semibold">Email:</span> {ticket.customerEmail}</p>
            </div>
            <div className="flex justify-center my-4">
              <QRCode value={ticket.qrCodeValue} size={160} style={{ width: '160px', height: '160px' }} />
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">Ticket #{ticket.id}</p>
          </div>
        </div>
        <div className="border-t p-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <ReusableButton variant="secondary" onClick={onClose}>Close</ReusableButton>
          <ReusableButton variant="primary" onClick={handleDownload} icon={Download}>Download as PNG</ReusableButton>
        </div>
      </div>
    </div>
  );
};

// ==================== Main Component ====================
const CustomerMyTicketsDownload: React.FC = () => {
  const [tickets, setTickets] = useState<TicketDetail[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const currentUserEmail = 'customer@example.com';

  useEffect(() => {
    const userTickets = loadUserTickets(currentUserEmail);
    setTickets(userTickets);
    setFilteredTickets(userTickets);
    setLoading(false);
  }, [currentUserEmail]);

  // Filter by search term AND status
  useEffect(() => {
    let filtered = [...tickets];
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.eventName.toLowerCase().includes(term) ||
        t.seatNumber?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, tickets]);

  const handleViewTicket = (ticket: TicketDetail) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  // Only three columns: Event Name, Seat, Actions
  const columns = [
    {
      Header: 'Event Name',
      accessor: 'eventName',
      sortable: true,
    },
    {
      Header: 'Seat',
      accessor: 'seatNumber',
      sortable: true,
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      sortable: false,
      Cell: (row: any) => (
        <button
          onClick={() => handleViewTicket(row.original)}
          className="p-1.5 bg-blue-100 rounded-lg text-blue-700 hover:bg-blue-200 transition-colors"
          title="View Ticket Details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const tableData = filteredTickets.map(ticket => ({
    eventName: ticket.eventName,
    seatNumber: ticket.seatNumber,
    original: ticket,
  }));

  if (loading) {
    return <div className="text-center p-8">Loading your tickets...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          My Tickets
        </h1>
        <p className="text-gray-600 mt-1">View and download your purchased tickets</p>
      </div>

      {/* Search and Status Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by event name or seat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 font-medium"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500">You have no tickets matching the filter.</p>
        </div>
      ) : (
        <ReusableTable
          columns={columns}
          data={tableData}
          title="My Tickets"
          showSearch={false}
          showExport={true}
          showPrint={false}
          itemsPerPage={10}
          onExport={() => {
            const headers = ['Event Name', 'Seat', 'Event Date', 'Event Time', 'Hall', 'Seat Type', 'Price', 'Payment Time', 'Status'];
            const rows = filteredTickets.map(t => [
              t.eventName,
              t.seatNumber || '',
              t.eventDate,
              `${t.eventStartTime} - ${t.eventEndTime}`,
              t.hall,
              t.seatType,
              t.price,
              new Date(t.paymentTime).toLocaleString(),
              t.status,
            ]);
            const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `my_tickets_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        />
      )}

      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <SuccessPopup
        message={successMessage}
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
};

export default CustomerMyTicketsDownload;