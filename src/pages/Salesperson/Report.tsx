import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Download,
  CheckCircle,
  Clock,
  Eye,
  Copy,
  Share2,
  Download as DownloadIcon,
  Printer,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Colors from '../../components/Reusable/Colors';
import ReusableshowFilterforall from '../../components/Reusable/ReusableshowFilterforall';
import ReusableTable from '../../components/Reusable/ReusableTable';
import ReusableButton from '../../components/Reusable/ReusableButton';
import { AreaChart } from '../../components/Overview/AreaChart';
import { BarChart } from '../../components/Overview/BarChart';
import { Card, StatCard } from '../../components/Overview/Card';
import { DonutChart } from '../../components/Overview/PieChart';

// ===================== Types =====================
interface Seat {
  seatId: string;
  seatLabel: string;
  qrData: string;
  price?: number;        // optional for backward compatibility
  seatType?: string;     // optional
  eventTitle?: string;
  theatreName?: string;
  hallName?: string;
}

interface SaleRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  showTitle: string;
  showDate: string;
  showTime: string;
  seats: string;
  tickets: Seat[];
  seatType: string;
  totalAmount: number;
  paymentMethod: string;
  saleDate: string;
  salesperson: string;
  theatreName?: string;
  hallName?: string;
}

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';
type PaymentStatus = 'all' | 'completed' | 'pending' | 'refunded';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// ===================== Helper Functions =====================
const groupSalesByPeriod = (sales: SaleRecord[], period: Period): { label: string; amount: number; tickets: number }[] => {
  const groups: { [key: string]: { amount: number; tickets: number } } = {};
  sales.forEach(sale => {
    const saleDate = new Date(sale.saleDate);
    let key: string;
    switch (period) {
      case 'daily':
        key = saleDate.toLocaleDateString('en-CA');
        break;
      case 'weekly':
        const weekStart = new Date(saleDate);
        weekStart.setDate(saleDate.getDate() - saleDate.getDay());
        key = `Week of ${weekStart.toLocaleDateString('en-CA')}`;
        break;
      case 'monthly':
        key = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'yearly':
        key = saleDate.getFullYear().toString();
        break;
    }
    if (!groups[key]) groups[key] = { amount: 0, tickets: 0 };
    groups[key].amount += sale.totalAmount;
    groups[key].tickets += sale.tickets.length;
  });
  return Object.entries(groups).map(([label, data]) => ({ label, amount: data.amount, tickets: data.tickets }));
};

const getUniqueSalespersons = (sales: SaleRecord[]): string[] => {
  const names = new Set(sales.map(s => s.salesperson));
  return Array.from(names).sort();
};

const getAvailableYears = (sales: SaleRecord[]): number[] => {
  const years = new Set<number>();
  sales.forEach(sale => {
    const year = new Date(sale.saleDate).getFullYear();
    years.add(year);
  });
  return Array.from(years).sort((a, b) => b - a);
};

// Safe currency formatter – handles undefined/null
const formatCurrency = (value: number | undefined | null): string => {
  const num = Number(value);
  if (isNaN(num)) return 'ETB 0.00';
  return `ETB ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ===================== QR & Ticket Helpers =====================
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
    const file = new File([blob], `ticket-qr-${seat}.png`, { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [file] }))
      await navigator.share({ title: `Ticket ${seat}`, files: [file] });
    else alert('Sharing not supported');
  } catch (err) { console.error(err); }
};

const downloadTicketWithDetails = async (
  ticket: Seat,
  sale: SaleRecord,
  qrCanvasRef: React.RefObject<HTMLCanvasElement>
) => {
  if (!qrCanvasRef.current) return;

  const width = 500;
  const height = 650;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#0d9488';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  ctx.fillStyle = '#0d9488';
  ctx.font = 'bold 24px "Segoe UI", system-ui';
  ctx.fillText('🎭 TICKET', 20, 60);

  const eventTitle = ticket.eventTitle || sale.showTitle;
  const theatre = ticket.theatreName || sale.theatreName || 'Main Theatre';
  const hall = ticket.hallName || sale.hallName || 'Main Hall';
  const price = ticket.price ?? (sale.totalAmount / sale.tickets.length);

  ctx.font = '14px "Segoe UI"';
  ctx.fillStyle = '#374151';
  ctx.fillText(eventTitle, 20, 100);
  ctx.fillText(`${theatre} – ${hall}`, 20, 130);

  ctx.font = 'bold 16px "Segoe UI"';
  ctx.fillStyle = '#000000';
  ctx.fillText(`Seat: ${ticket.seatLabel} (${ticket.seatType || 'Standard'})`, 20, 170);
  ctx.font = '14px "Segoe UI"';
  ctx.fillStyle = '#374151';
  ctx.fillText(`Price: ${formatCurrency(price)}`, 20, 200);
  ctx.fillText(`Customer: ${sale.customerName}`, 20, 230);
  ctx.fillText(`Date: ${new Date(sale.showDate).toLocaleDateString()} at ${sale.showTime}`, 20, 260);
  ctx.fillText(`Sale ID: ${sale.id}`, 20, 290);

  const qrCanvas = qrCanvasRef.current;
  await new Promise(resolve => setTimeout(resolve, 50));
  ctx.drawImage(qrCanvas, width - 160, height - 160, 140, 140);

  const link = document.createElement('a');
  link.download = `ticket_${ticket.seatLabel}.png`;
  link.href = canvas.toDataURL();
  link.click();
};

const printQR = (canvasRef: React.RefObject<HTMLCanvasElement>, ticket: Seat, sale: SaleRecord) => {
  const printWindow = window.open('', '_blank');
  const eventTitle = ticket.eventTitle || sale.showTitle;
  const theatre = ticket.theatreName || sale.theatreName || 'Main Theatre';
  const hall = ticket.hallName || sale.hallName || 'Main Hall';
  const price = ticket.price ?? (sale.totalAmount / sale.tickets.length);
  printWindow.document.write(`
    <html>
      <head><title>Ticket ${ticket.seatLabel}</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:20px;">
        <h2>${eventTitle}</h2>
        <p><strong>Theatre:</strong> ${theatre}</p>
        <p><strong>Hall:</strong> ${hall}</p>
        <p><strong>Seat:</strong> ${ticket.seatLabel} (${ticket.seatType || 'Standard'})</p>
        <p><strong>Price:</strong> ${formatCurrency(price)}</p>
        <p><strong>Customer:</strong> ${sale.customerName}</p>
        <p><strong>Show Date:</strong> ${new Date(sale.showDate).toLocaleDateString()} at ${sale.showTime}</p>
        <img src="${canvasRef.current?.toDataURL()}" alt="QR Code" />
        <p><em>Scan this QR code at the entrance</em></p>
        <script>window.onload = () => { window.print(); window.close(); }<\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

// ===================== Modal Components =====================
interface TicketViewModalProps {
  sale: SaleRecord | null;
  onClose: () => void;
}

const TicketViewModal: React.FC<TicketViewModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;
  const tickets = sale.tickets;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();
  const formatDateTime = (iso: string) => new Date(iso).toLocaleString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">🎟️ Ticket Details</h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-700">&times;</button>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm">
          <p><strong>Customer:</strong> {sale.customerName} {sale.customerPhone && `(${sale.customerPhone})`}</p>
          <p><strong>Sale Date:</strong> {formatDateTime(sale.saleDate)}</p>
          <p><strong>Total Amount:</strong> {formatCurrency(sale.totalAmount)}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {tickets.map(ticket => (
            <TicketCard key={ticket.seatLabel} ticket={ticket} sale={sale} />
          ))}
        </div>
        <div className="text-center">
          <ReusableButton variant="primary" onClick={onClose}>Close</ReusableButton>
        </div>
      </div>
    </div>
  );
};

const TicketCard: React.FC<{ ticket: Seat; sale: SaleRecord }> = ({ ticket, sale }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconStyle: React.CSSProperties = {
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

  const handleDownloadWithDetails = async () => {
    await downloadTicketWithDetails(ticket, sale, canvasRef);
  };

  // Safe fallbacks for missing ticket properties
  const eventTitle = ticket.eventTitle || sale.showTitle;
  const theatre = ticket.theatreName || sale.theatreName || 'Main Theatre';
  const hall = ticket.hallName || sale.hallName || 'Main Hall';
  const price = ticket.price ?? (sale.totalAmount / sale.tickets.length);
  const seatType = ticket.seatType || 'Standard';

  return (
    <div className="border border-gray-200 rounded-xl p-4 text-center bg-gray-50">
      <div className="font-bold text-md">{eventTitle}</div>
      <div className="text-xs text-gray-600">{theatre} • {hall}</div>
      <div className="font-bold text-lg mt-2">Seat {ticket.seatLabel}</div>
      <div className="text-xs text-gray-500">{seatType}</div>
      <div className="text-sm font-semibold text-teal-700 mt-1">{formatCurrency(price)}</div>
      <QRCodeCanvas value={ticket.qrData} size={120} level="H" includeMargin ref={canvasRef} className="mx-auto mt-2" />
      <div className="flex justify-center gap-2 mt-3">
        <button onClick={() => copyQR(canvasRef)} title="Copy QR code" style={iconStyle}>
          <Copy size={18} />
        </button>
        <button onClick={() => shareQR(canvasRef, ticket.seatLabel)} title="Share QR code" style={iconStyle}>
          <Share2 size={18} />
        </button>
        <button onClick={handleDownloadWithDetails} title="Download ticket (details + QR)" style={iconStyle}>
          <DownloadIcon size={18} />
        </button>
        <button onClick={() => printQR(canvasRef, ticket, sale)} title="Print ticket" style={iconStyle}>
          <Printer size={18} />
        </button>
      </div>
    </div>
  );
};

// ===================== Main Report Component =====================
const Report: React.FC = () => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('daily');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [useDateRange, setUseDateRange] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);

  useEffect(() => {
    const loadSales = () => {
      try {
        const stored = localStorage.getItem('theater_sales_records');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Ensure every ticket has required fields (add fallbacks)
          const enriched = parsed.map((sale: SaleRecord) => ({
            ...sale,
            tickets: sale.tickets.map((ticket: Seat) => ({
              ...ticket,
              price: ticket.price ?? (sale.totalAmount / sale.tickets.length),
              seatType: ticket.seatType || sale.seatType || 'Standard',
            })),
          }));
          setSales(enriched);
        } else {
          // Fresh demo data with all fields
          const demoRecords: SaleRecord[] = [
            {
              id: 'demo1',
              customerName: 'John Doe',
              customerPhone: '555-1234',
              showTitle: 'Various Shows',
              showDate: '2026-05-10',
              showTime: '14:00',
              seats: 'A1, A2',
              tickets: [
                {
                  seatId: 'A1',
                  seatLabel: 'A1',
                  qrData: 'https://theatre.com/ticket/demo1-A1',
                  price: 60,
                  seatType: 'Regular',
                  eventTitle: 'The Lion King',
                  theatreName: 'National Theatre',
                  hallName: 'Main Hall'
                },
                {
                  seatId: 'A2',
                  seatLabel: 'A2',
                  qrData: 'https://theatre.com/ticket/demo1-A2',
                  price: 70,
                  seatType: 'VIP',
                  eventTitle: 'The Lion King',
                  theatreName: 'National Theatre',
                  hallName: 'VIP Lounge'
                }
              ],
              seatType: 'Regular',
              totalAmount: 130,
              paymentMethod: 'cash',
              saleDate: new Date().toISOString(),
              salesperson: 'Alice',
              theatreName: 'National Theatre',
              hallName: 'Main Hall'
            },
            {
              id: 'demo2',
              customerName: 'Jane Smith',
              customerPhone: '555-5678',
              showTitle: 'Hamilton',
              showDate: '2026-05-11',
              showTime: '19:30',
              seats: 'B5',
              tickets: [
                {
                  seatId: 'B5',
                  seatLabel: 'B5',
                  qrData: 'https://theatre.com/ticket/demo2-B5',
                  price: 65,
                  seatType: 'VIP',
                  eventTitle: 'Hamilton',
                  theatreName: 'National Theatre',
                  hallName: 'Studio Theatre'
                }
              ],
              seatType: 'VIP',
              totalAmount: 65,
              paymentMethod: 'card',
              saleDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              salesperson: 'Bob',
              theatreName: 'National Theatre',
              hallName: 'Studio Theatre'
            },
            {
              id: 'demo3',
              customerName: 'Sam Wilson',
              customerPhone: '555-9012',
              showTitle: 'Wicked & Other',
              showDate: '2026-05-12',
              showTime: '20:00',
              seats: 'C10, C11',
              tickets: [
                {
                  seatId: 'C10',
                  seatLabel: 'C10',
                  qrData: 'https://theatre.com/ticket/demo3-C10',
                  price: 80,
                  seatType: 'Regular',
                  eventTitle: 'Wicked',
                  theatreName: 'National Theatre',
                  hallName: 'Main Hall'
                },
                {
                  seatId: 'C11',
                  seatLabel: 'C11',
                  qrData: 'https://theatre.com/ticket/demo3-C11',
                  price: 50,
                  seatType: 'Child',
                  eventTitle: 'The Little Mermaid',
                  theatreName: 'National Theatre',
                  hallName: 'Children\'s Wing'
                }
              ],
              seatType: 'Regular',
              totalAmount: 130,
              paymentMethod: 'cash',
              saleDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              salesperson: 'Alice',
              theatreName: 'National Theatre',
              hallName: 'Main Hall'
            },
          ];
          localStorage.setItem('theater_sales_records', JSON.stringify(demoRecords));
          setSales(demoRecords);
        }
      } catch (err) {
        console.error('Failed to load sales records:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, []);

  const availableYears = useMemo(() => ['all', ...getAvailableYears(sales).map(y => y.toString())], [sales]);

  const filteredSales = useMemo(() => {
    let result = [...sales];
    if (useDateRange) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      result = result.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate >= start && saleDate <= end;
      });
    } else {
      result = result.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        const year = saleDate.getFullYear().toString();
        const month = MONTHS[saleDate.getMonth()];
        const day = saleDate.getDate().toString();
        if (selectedYear !== 'all' && year !== selectedYear) return false;
        if (selectedMonth !== 'all' && month !== selectedMonth) return false;
        if (selectedDay !== 'all' && day !== selectedDay) return false;
        return true;
      });
    }
    if (selectedSalesperson !== 'all') {
      result = result.filter(sale => sale.salesperson === selectedSalesperson);
    }
    return result;
  }, [sales, startDate, endDate, selectedSalesperson, selectedStatus, useDateRange, selectedYear, selectedMonth, selectedDay]);

  const chartData = useMemo(() => groupSalesByPeriod(filteredSales, period), [filteredSales, period]);
  const salespersons = useMemo(() => ['all', ...getUniqueSalespersons(sales)], [sales]);

  const totals = useMemo(() => {
    const totalTickets = filteredSales.reduce((sum, s) => sum + s.tickets.length, 0);
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalTransactions = filteredSales.length;
    const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    return { totalTickets, totalRevenue, totalTransactions, averageTicket };
  }, [filteredSales]);

  const salespersonPieData = useMemo(() => {
    const map = new Map<string, number>();
    filteredSales.forEach(sale => {
      map.set(sale.salesperson, (map.get(sale.salesperson) || 0) + sale.totalAmount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value, color: '' }));
  }, [filteredSales]);

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a'];

  const exportToCSV = () => {
    const headers = ['ID', 'Customer', 'Phone', 'Show', 'Theatre', 'Hall', 'Date', 'Time', 'Seats', 'Amount (ETB)', 'Payment', 'Salesperson', 'Sale Date'];
    const rows = filteredSales.map(s => [
      s.id,
      s.customerName,
      s.customerPhone,
      s.showTitle,
      s.theatreName || '',
      s.hallName || '',
      s.showDate,
      s.showTime,
      s.seats,
      s.totalAmount,
      s.paymentMethod,
      s.salesperson,
      new Date(s.saleDate).toLocaleString(),
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filterValues = {
    useDateRange,
    startDate,
    endDate,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedSalesperson,
    selectedStatus,
  };

  const columns = [
    { Header: 'Sale Date', accessor: 'saleDate', Cell: (row: SaleRecord) => new Date(row.saleDate).toLocaleDateString() },
    { Header: 'Show', accessor: 'showTitle', Cell: (row: SaleRecord) => <div><div className="font-medium">{row.showTitle}</div><div className="text-xs text-gray-500">{row.showDate} {row.showTime}</div></div> },
    { Header: 'Theatre/Hall', accessor: 'theatreName', Cell: (row: SaleRecord) => <div><div>{row.theatreName || '-'}</div><div className="text-xs text-gray-500">{row.hallName || '-'}</div></div> },
    { Header: 'Customer', accessor: 'customerName', Cell: (row: SaleRecord) => <div><div>{row.customerName}</div><div className="text-xs text-gray-500">{row.customerPhone}</div></div> },
    { Header: 'Seats', accessor: 'seats' },
    { Header: 'Amount', accessor: 'totalAmount', Cell: (row: SaleRecord) => <span className="font-medium">{formatCurrency(row.totalAmount)}</span> },
    { Header: 'Payment', accessor: 'paymentMethod', Cell: (row: SaleRecord) => <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${row.paymentMethod === 'cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{row.paymentMethod === 'cash' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}{row.paymentMethod}</span> },
    { Header: 'Salesperson', accessor: 'salesperson' },
    { Header: 'Action', accessor: 'id', Cell: (row: SaleRecord) => <button onClick={() => setSelectedSale(row)} title="View QR Codes & Details" className="text-teal-600 hover:text-teal-800 transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '4px' }}><Eye size={18} /></button> },
  ];

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepTeal mx-auto mb-4" /><p className="text-gray-600">Loading sales report...</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales Report</h1><p className="text-gray-500 mt-1">View and analyze ticket sales performance</p></div>
          <button onClick={exportToCSV} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"><Download size={18} />Export CSV</button>
        </div>
        <ReusableshowFilterforall filterValues={filterValues} onUseDateRangeChange={(val) => setUseDateRange(val)} onStartDateChange={(date) => setStartDate(date)} onEndDateChange={(date) => setEndDate(date)} onSelectedYearChange={(year) => setSelectedYear(year)} onSelectedMonthChange={(month) => setSelectedMonth(month)} onSelectedDayChange={(day) => setSelectedDay(day)} onSelectedSalespersonChange={(person) => setSelectedSalesperson(person)} onSelectedStatusChange={(status) => setSelectedStatus(status as PaymentStatus)} salespersonOptions={salespersons} statusOptions={['all', 'completed', 'pending', 'refunded']} availableYears={availableYears} monthsList={MONTHS} showSalesperson={true} showStatus={false} showDateRangeToggle={true} showYearMonthDay={true} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Tickets Sold" value={totals.totalTickets} icon={Ticket} color="from-blue-500 to-blue-600" link="/salesperson/reports" />
          <StatCard title="Total Revenue" value={formatCurrency(totals.totalRevenue)} icon={DollarSign} color="from-green-500 to-green-600" link="/salesperson/reports" />
          <StatCard title="Average Ticket" value={formatCurrency(totals.averageTicket)} icon={TrendingUp} color="from-purple-500 to-purple-600" link="/salesperson/reports" />
          <StatCard title="Transactions" value={totals.totalTransactions} icon={Users} color="from-orange-500 to-orange-600" link="/salesperson/reports" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title={`Sales Trend (${period})`} subtitle="Revenue and tickets over time"><AreaChart data={chartData} areas={[{ dataKey: 'amount', name: 'Revenue (ETB)', color: Colors.primary || '#0d9488', gradient: true }, { dataKey: 'tickets', name: 'Tickets Sold', color: '#f59e0b', gradient: true }]} xAxisKey="label" yAxisLabel="Amount / Tickets" height={300} showGrid showLegend /></Card>
          <Card title="Revenue by Salesperson" subtitle="Distribution of revenue among sales staff">{salespersonPieData.length > 0 ? <DonutChart data={salespersonPieData.map((item, idx) => ({ name: item.name, value: item.value, color: COLORS[idx % COLORS.length] }))} height={280} showLabels /> : <div className="text-center py-12 text-gray-500">No data available</div>}</Card>
        </div>
        <div className="mb-6"><Card title="Tickets Sold per Period" subtitle={`Number of tickets sold by ${period}`}><BarChart data={chartData} bars={[{ dataKey: 'tickets', name: 'Tickets Sold', color: Colors.primary || '#0d9488' }]} xAxisKey="label" height={300} showGrid showLegend /></Card></div>
        <ReusableTable columns={columns} data={filteredSales} title={`Transaction Details (${filteredSales.length} transactions)`} showSearch={false} itemsPerPage={10} />
        {selectedSale && <TicketViewModal sale={selectedSale} onClose={() => setSelectedSale(null)} />}
      </div>
    </div>
  );
};

export default Report;