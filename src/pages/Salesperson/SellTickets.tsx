import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Download, TrendingUp, Search, Trash2, Eye, Copy, Share2, 
  Download as DownloadIcon, Printer, DollarSign, Ticket, Users, 
  CreditCard, Clock, Activity
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Colors from '../../components/Reusable/Colors';
import ReusableTable from '../../components/Reusable/ReusableTable';
import ReusableButton from '../../components/Reusable/ReusableButton';
import SuccessPopup from '../../components/Reusable/SuccessPopup';

export interface TicketData {
  seatId: number;
  seatLabel: string;
  qrData: string;
}

export interface SaleRecord {
  id: string;
  customerName: string;
  customerPhone?: string;
  showTitle: string;
  showDate: string;
  showTime: string;
  seats: string[];
  tickets?: TicketData[];
  seatType: string;
  totalAmount: number;
  paymentMethod: 'cash' | 'card';
  saleDate: string;
  salesperson: string;
}

const STORAGE_KEY = 'theatre_sales_history';

export const loadSalesHistory = (): SaleRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [
    {
      id: '3',
      customerName: 'Robert Johnson',
      customerPhone: '555-9012',
      showTitle: 'Les Misérables',
      showDate: '2026-05-11',
      showTime: '20:00',
      seats: ['B2', 'B3', 'B4'],
      tickets: [
        { seatId: 4, seatLabel: 'B2', qrData: 'https://theatre.com/ticket/4-B2' },
        { seatId: 5, seatLabel: 'B3', qrData: 'https://theatre.com/ticket/5-B3' },
        { seatId: 6, seatLabel: 'B4', qrData: 'https://theatre.com/ticket/6-B4' },
      ],
      seatType: 'Regular',
      totalAmount: 150,
      paymentMethod: 'cash',
      saleDate: new Date('2026-05-08T09:15:00').toISOString(),
      salesperson: 'Alice Johnson',
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      customerPhone: '555-5678',
      showTitle: 'Hamilton',
      showDate: '2026-05-10',
      showTime: '19:30',
      seats: ['C5'],
      tickets: [{ seatId: 3, seatLabel: 'C5', qrData: 'https://theatre.com/ticket/3-C5' }],
      seatType: 'VIP',
      totalAmount: 75,
      paymentMethod: 'cash',
      saleDate: new Date('2026-05-09T14:20:00').toISOString(),
      salesperson: 'Bob Williams',
    },
    {
      id: '1',
      customerName: 'John Doe',
      customerPhone: '555-1234',
      showTitle: 'The Lion King',
      showDate: '2026-05-10',
      showTime: '14:00',
      seats: ['A12', 'A13'],
      tickets: [
        { seatId: 1, seatLabel: 'A12', qrData: 'https://theatre.com/ticket/1-A12' },
        { seatId: 2, seatLabel: 'A13', qrData: 'https://theatre.com/ticket/2-A13' },
      ],
      seatType: 'Regular',
      totalAmount: 100,
      paymentMethod: 'cash',
      saleDate: new Date('2026-05-09T10:30:00').toISOString(),
      salesperson: 'Alice Johnson',
    },
  ];
};

export const saveSaleRecord = (sale: SaleRecord): void => {
  const existing = loadSalesHistory();
  existing.push(sale);
  existing.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

// QR Modal helpers
const copyQR = async (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  if (!canvasRef.current) return;
  try {
    const canvas = canvasRef.current;
    const blob = await new Promise<Blob>(resolve => canvas.toBlob(b => resolve(b!)));
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    alert('QR code copied!');
  } catch { alert('Copy failed'); }
};

const shareQR = async (canvasRef: React.RefObject<HTMLCanvasElement>, seat: string) => {
  if (!canvasRef.current) return;
  try {
    const canvas = canvasRef.current;
    const blob = await new Promise<Blob>(resolve => canvas.toBlob(b => resolve(b!)));
    const file = new File([blob], `ticket-${seat}.png`, { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [file] }))
      await navigator.share({ title: `Ticket ${seat}`, files: [file] });
    else alert('Sharing not supported');
  } catch (err) { console.error(err); }
};

const downloadQR = (canvasRef: React.RefObject<HTMLCanvasElement>, seat: string) => {
  if (!canvasRef.current) return;
  const link = document.createElement('a');
  link.download = `ticket-${seat}.png`;
  link.href = canvasRef.current.toDataURL();
  link.click();
};

const printQR = (canvasRef: React.RefObject<HTMLCanvasElement>, ticket: TicketData, sale: SaleRecord) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head><title>Ticket ${ticket.seatLabel}</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:20px;">
        <h2>${sale.showTitle}</h2>
        <p>Seat: ${ticket.seatLabel}</p>
        <p>Customer: ${sale.customerName}</p>
        <p>Show Date: ${new Date(sale.showDate).toLocaleDateString()} at ${sale.showTime}</p>
        <p>Price: $${sale.totalAmount / sale.seats.length}</p>
        <img src="${canvasRef.current?.toDataURL()}" />
        <script>window.onload = () => { window.print(); window.close(); }<\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

interface TicketViewModalProps {
  sale: SaleRecord | null;
  onClose: () => void;
}

const TicketViewModal: React.FC<TicketViewModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  let tickets = sale.tickets;
  if (!tickets || tickets.length === 0) {
    tickets = sale.seats.map((seatLabel, idx) => ({
      seatId: idx,
      seatLabel,
      qrData: `https://theatre.com/legacy/${sale.id}/${seatLabel}`,
    }));
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();
  const formatDateTime = (iso: string) => new Date(iso).toLocaleString();

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2>🎟️ Ticket Details</h2>
          <button onClick={onClose} style={modalStyles.closeBtn}>×</button>
        </div>
        <div style={modalStyles.info}>
          <p><strong>Customer:</strong> {sale.customerName} {sale.customerPhone && `(${sale.customerPhone})`}</p>
          <p><strong>Sale Date:</strong> {formatDateTime(sale.saleDate)}</p>
          <p><strong>Show:</strong> {sale.showTitle}</p>
          <p><strong>Show Date & Time:</strong> {formatDate(sale.showDate)} at {sale.showTime}</p>
          <p><strong>Seats:</strong> {sale.seats.join(', ')}</p>
          <p><strong>Total Amount:</strong> ${sale.totalAmount}</p>
        </div>
        <div style={modalStyles.ticketsContainer}>
          {tickets.map(ticket => (
            <TicketCard key={ticket.seatLabel} ticket={ticket} sale={sale} />
          ))}
        </div>
        <div style={modalStyles.footer}>
          <ReusableButton variant="primary" onClick={onClose}>Close</ReusableButton>
        </div>
      </div>
    </div>
  );
};

const TicketCard: React.FC<{ ticket: TicketData; sale: SaleRecord }> = ({ ticket, sale }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <div style={modalStyles.ticketCard}>
      <div style={modalStyles.seatLabel}>Seat {ticket.seatLabel}</div>
      <QRCodeCanvas value={ticket.qrData} size={120} level="H" includeMargin ref={canvasRef} />
      <div style={modalStyles.buttonGroup}>
        <button onClick={() => copyQR(canvasRef)} title="Copy QR code" style={iconButtonStyle}>
          <Copy size={18} />
        </button>
        <button onClick={() => shareQR(canvasRef, ticket.seatLabel)} title="Share QR code" style={iconButtonStyle}>
          <Share2 size={18} />
        </button>
        <button onClick={() => downloadQR(canvasRef, ticket.seatLabel)} title="Download QR code" style={iconButtonStyle}>
          <DownloadIcon size={18} />
        </button>
        <button onClick={() => printQR(canvasRef, ticket, sale)} title="Print ticket" style={iconButtonStyle}>
          <Printer size={18} />
        </button>
      </div>
    </div>
  );
};

const iconButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: Colors.primary || '#0d9488',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px',
  borderRadius: '6px',
  transition: 'background-color 0.2s',
};

const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    maxWidth: '90vw',
    width: '700px',
    maxHeight: '85vh',
    overflowY: 'auto',
    padding: '1.5rem',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.5rem',
  },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
  info: {
    marginBottom: '1rem',
    fontSize: '0.9rem',
    backgroundColor: '#f3f4f6',
    padding: '0.75rem',
    borderRadius: '0.5rem',
  },
  ticketsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  ticketCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1rem',
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },
  seatLabel: { fontWeight: 'bold', marginBottom: 8 },
  buttonGroup: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px', flexWrap: 'wrap' },
  footer: { marginTop: '1rem', textAlign: 'center' },
};

// Main SellTickets Component
const SellTickets: React.FC = () => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [filteredSales, setFilteredSales] = useState<SaleRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [searchTerm, setSearchTerm] = useState('');
  const [successPopup, setSuccessPopup] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { applyFilters(); }, [sales, selectedDate, searchTerm]);

  const loadData = () => {
    const allSales = loadSalesHistory();
    const sorted = [...allSales].sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
    setSales(sorted);
  };

  const applyFilters = () => {
    let filtered = [...sales];
    if (selectedDate) filtered = filtered.filter(s => s.saleDate.slice(0, 10) === selectedDate);
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.customerName.toLowerCase().includes(term) ||
        (s.customerPhone && s.customerPhone.includes(term)) ||
        s.showTitle.toLowerCase().includes(term) ||
        s.seats.some(seat => seat.toLowerCase().includes(term)) ||
        s.seatType.toLowerCase().includes(term) ||
        s.id.includes(term)
      );
    }
    setFilteredSales(filtered);
  };

  const formatDateTime = (iso: string) => new Date(iso).toLocaleString();

  // Statistics for cards
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalTransactions = filteredSales.length;
  const totalTicketsSold = filteredSales.reduce((sum, s) => sum + s.seats.length, 0);
  const avgTicketPrice = totalTicketsSold > 0 ? totalRevenue / totalTicketsSold : 0;

  const columns = [
    { Header: 'Sale Date', accessor: 'saleDate', Cell: (row: SaleRecord) => formatDateTime(row.saleDate) },
    { Header: 'Show', accessor: 'showTitle' },
    { Header: 'Customer', accessor: 'customerName' },
    { Header: 'Phone', accessor: 'customerPhone', Cell: (row: SaleRecord) => row.customerPhone || '-' },
    {
      Header: 'View',
      accessor: 'id',
      Cell: (row: SaleRecord) => (
        <button
          onClick={() => setSelectedSale(row)}
          title="View QR Codes & Details"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: Colors.primary || '#0d9488',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px',
          }}
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  const handleExport = () => {
    if (filteredSales.length === 0) {
      setSuccessPopup({ open: true, message: 'No data to export.' });
      return;
    }
    const fullColumns = ['Sale Date', 'Customer', 'Phone', 'Show', 'Show Date', 'Time', 'Seats', 'Amount', 'Payment Method', 'ID'];
    const rows = filteredSales.map(sale => {
      return [
        formatDateTime(sale.saleDate),
        sale.customerName,
        sale.customerPhone || '',
        sale.showTitle,
        new Date(sale.showDate).toLocaleDateString(),
        sale.showTime,
        sale.seats.join(';'),
        sale.totalAmount,
        sale.paymentMethod,
        sale.id,
      ].map(val => {
        if (typeof val === 'string' && (val.includes(',') || val.includes('"')))
          return `"${val.replace(/"/g, '""')}"`;
        return val;
      }).join(',');
    }).join('\n');
    const blob = new Blob([`${fullColumns.join(',')}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessPopup({ open: true, message: 'CSV exported!' });
  };

  const handleClearHistory = () => {
    if (window.confirm('Delete all sales history? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      loadData();
      setSuccessPopup({ open: true, message: 'History cleared.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Ticket Sales History
            </h1>
            <p className="text-gray-600 mt-1">Manage and view all completed ticket sales</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="pl-10 pr-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <ReusableButton variant="secondary" onClick={handleExport} icon={Download}>Export CSV</ReusableButton>
            <ReusableButton variant="danger" onClick={handleClearHistory} icon={Trash2}>Clear History</ReusableButton>
          </div>
        </div>

        {/* FinancialReports-style Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Transactions</p>
                <p className="text-xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
            </div>
          </div>

          {/* Tickets Sold */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tickets Sold</p>
                <p className="text-xl font-bold text-gray-900">{totalTicketsSold.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Average Ticket Price */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg. Ticket Price</p>
                <p className="text-xl font-bold text-gray-900">${avgTicketPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by customer name, phone, show title, or seat..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Sales Table */}
        <ReusableTable
          columns={columns}
          data={filteredSales}
          title={`Sales - ${new Date(selectedDate).toLocaleDateString()}`}
          showSearch={false}
          itemsPerPage={10}
        />

        {/* QR Ticket Modal */}
        {selectedSale && <TicketViewModal sale={selectedSale} onClose={() => setSelectedSale(null)} />}

        {/* Success Popup */}
        <SuccessPopup
          isOpen={successPopup.open}
          onClose={() => setSuccessPopup({ open: false, message: '' })}
          type="success"
          title="Done"
          message={successPopup.message}
          duration={2000}
        />
      </div>
    </div>
  );
};

export default SellTickets;