// src/pages/Manager/Customer/Customer.tsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Eye, MessageSquare, CheckCircle, XCircle, 
  AlertCircle, Phone, Mail, Calendar, Clock, 
  Download, RefreshCw, Ban, DollarSign, Ticket, 
  Plus, Send, MoreVertical
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// ==================== Types ====================
interface Booking {
  id: string;
  eventName: string;
  eventDate: string;
  seats: string[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  ticketsPurchased: number;
  joinDate: string;
  status: 'active' | 'blocked';
  lastActive: string;
  bookings: Booking[];
}

interface Complaint {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  date: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  resolution?: string;
  resolvedAt?: string;
}

// ==================== Helper ====================
const generateMockBookings = (customerId: string): Booking[] => {
  const events = ['Summer Music Festival', 'Comedy Night', 'Movie Premiere', 'Rock Concert', 'Theater Play'];
  const statuses: ('confirmed' | 'cancelled' | 'completed')[] = ['confirmed', 'completed', 'confirmed', 'cancelled', 'completed'];
  return events.map((event, idx) => ({
    id: `BKG${customerId}${idx}`,
    eventName: event,
    eventDate: `2024-0${Math.floor(Math.random() * 5) + 6}-${Math.floor(Math.random() * 28) + 1}`,
    seats: [`${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 20) + 1}`],
    totalAmount: Math.floor(Math.random() * 200) + 50,
    status: statuses[idx % statuses.length],
  }));
};

// ==================== Mock Data ====================
const rawMockCustomers: Omit<Customer, 'bookings'>[] = [
  { id: 'C001', name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', totalSpent: 1250, ticketsPurchased: 12, joinDate: '2024-01-15', status: 'active', lastActive: '2024-07-14' },
  { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 8901', totalSpent: 890, ticketsPurchased: 8, joinDate: '2024-02-20', status: 'active', lastActive: '2024-07-13' },
  { id: 'C003', name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 234 567 8902', totalSpent: 2450, ticketsPurchased: 22, joinDate: '2023-11-05', status: 'active', lastActive: '2024-07-14' },
  { id: 'C004', name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 234 567 8903', totalSpent: 560, ticketsPurchased: 5, joinDate: '2024-05-10', status: 'blocked', lastActive: '2024-06-20' },
  { id: 'C005', name: 'David Brown', email: 'david@example.com', phone: '+1 234 567 8904', totalSpent: 3200, ticketsPurchased: 28, joinDate: '2023-09-12', status: 'active', lastActive: '2024-07-12' },
];

const mockCustomers: Customer[] = rawMockCustomers.map(c => ({
  ...c,
  bookings: generateMockBookings(c.id),
}));

const mockComplaints: Complaint[] = [
  { id: 'COMP001', customerId: 'C001', customerName: 'John Doe', subject: 'Payment made but ticket not received', description: 'I paid for 3 tickets but never got the QR code.', date: '2024-07-10T14:30:00', status: 'in_progress', priority: 'high', assignedTo: 'Support Team' },
  { id: 'COMP002', customerId: 'C003', customerName: 'Mike Johnson', subject: 'Wrong seat assigned', description: 'Booked VIP seats but got standard.', date: '2024-07-12T09:15:00', status: 'open', priority: 'high', assignedTo: 'Tech Support' },
  { id: 'COMP003', customerId: 'C002', customerName: 'Jane Smith', subject: 'Booking cancelled unexpectedly', description: 'My booking was cancelled without notification.', date: '2024-07-08T16:45:00', status: 'resolved', priority: 'medium', assignedTo: 'Operations', resolution: 'Reissued tickets with apology discount.', resolvedAt: '2024-07-10' },
  { id: 'COMP004', customerId: 'C005', customerName: 'David Brown', subject: 'System error during booking', description: 'Website crashed when I tried to complete payment.', date: '2024-07-05T20:00:00', status: 'in_progress', priority: 'medium', assignedTo: 'IT Team' },
];

// ==================== Main Component ====================
const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveText, setResolveText] = useState('');
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ subject: '', description: '', priority: 'medium' as 'low' | 'medium' | 'high' });
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<'customers' | 'complaints'>('customers');

  // ========== Load & fix data ==========
  useEffect(() => {
    const storedCustomers = localStorage.getItem('theater_customers');
    const storedComplaints = localStorage.getItem('theater_complaints');
    
    if (storedCustomers) {
      let parsed = JSON.parse(storedCustomers);
      // Ensure every customer has bookings array and correct totals
      parsed = parsed.map((c: any) => ({
        ...c,
        bookings: c.bookings || generateMockBookings(c.id),
        ticketsPurchased: c.ticketsPurchased || (c.bookings?.filter((b: Booking) => b.status !== 'cancelled').length) || 0,
        totalSpent: c.totalSpent || c.bookings?.reduce((sum: number, b: Booking) => sum + b.totalAmount, 0) || 0,
      }));
      setCustomers(parsed);
    } else {
      setCustomers(mockCustomers);
    }
    
    if (storedComplaints) {
      setComplaints(JSON.parse(storedComplaints));
    } else {
      setComplaints(mockComplaints);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (customers.length) localStorage.setItem('theater_customers', JSON.stringify(customers));
    if (complaints.length) localStorage.setItem('theater_complaints', JSON.stringify(complaints));
  }, [customers, complaints]);

  // ========== Filters ==========
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = complaintFilter === 'all' || c.status === complaintFilter;
    return matchesSearch && matchesStatus;
  });

  // ========== Customer actions ==========
  const handleBlockCustomer = (customerId: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === customerId ? { ...c, status: c.status === 'blocked' ? 'active' : 'blocked' } : c
    ));
    const customer = customers.find(c => c.id === customerId);
    setSuccessMessage(`Customer ${customerId} ${customer?.status === 'blocked' ? 'unblocked' : 'blocked'}.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  // ========== Complaint actions ==========
  const handleUpdateComplaintStatus = (complaintId: string, newStatus: Complaint['status'], resolution?: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === complaintId ? { 
        ...c, 
        status: newStatus, 
        resolution: resolution || c.resolution,
        resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : c.resolvedAt
      } : c
    ));
    setSuccessMessage(`Complaint ${complaintId} updated to ${newStatus.replace('_', ' ')}.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
    setShowResolveModal(false);
    setResolveText('');
  };

  const handleAddComplaint = () => {
    if (!selectedCustomer) return;
    const newId = `COMP${String(complaints.length + 1).padStart(3, '0')}`;
    const complaint: Complaint = {
      id: newId,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      subject: newComplaint.subject,
      description: newComplaint.description,
      date: new Date().toISOString(),
      status: 'open',
      priority: newComplaint.priority,
      assignedTo: 'Manager',
    };
    setComplaints(prev => [complaint, ...prev]);
    setSuccessMessage(`Complaint #${newId} submitted successfully.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
    setShowNewComplaintModal(false);
    setNewComplaint({ subject: '', description: '', priority: 'medium' });
  };

  const openResolveModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setResolveText(complaint.resolution || '');
    setShowResolveModal(true);
  };

  // ========== Table Columns ==========
  const customerColumns = [
    { Header: 'ID', accessor: 'id', sortable: true },
    { Header: 'Name', accessor: 'name', sortable: true },
    { Header: 'Email', accessor: 'email', sortable: true },
    { Header: 'Phone', accessor: 'phone', sortable: true },
    { Header: 'Total Spent', accessor: 'totalSpent', sortable: true, Cell: (row: Customer) => <span className="font-semibold text-green-600">${row.totalSpent.toLocaleString()}</span> },
    { Header: 'Tickets', accessor: 'ticketsPurchased', sortable: true },
    { Header: 'Join Date', accessor: 'joinDate', sortable: true },
    { Header: 'Last Active', accessor: 'lastActive', sortable: true },
    { 
      Header: 'Status', 
      accessor: 'status', 
      sortable: true,
      Cell: (row: Customer) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
          {row.status}
        </span>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      sortable: false,
      Cell: (row: Customer) => {
        // DEBUG: ensure row is a full customer
        // console.log('Actions row:', row);
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => {
                // Explicitly set selected customer and open modal
                setSelectedCustomer(row);
                setShowCustomerModal(true);
              }} 
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" 
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={() => handleBlockCustomer(row.id)} 
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" 
              title={row.status === 'blocked' ? 'Unblock' : 'Block'}
            >
              {row.status === 'blocked' ? <CheckCircle size={16} /> : <Ban size={16} />}
            </button>
            <button 
              onClick={() => { setSelectedCustomer(row); setShowNewComplaintModal(true); }} 
              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg" 
              title="Add Complaint"
            >
              <MessageSquare size={16} />
            </button>
          </div>
        );
      }
    },
  ];

  const complaintColumns = [
    { Header: 'ID', accessor: 'id', sortable: true },
    { Header: 'Customer', accessor: 'customerName', sortable: true },
    { Header: 'Subject', accessor: 'subject', sortable: true },
    { Header: 'Date', accessor: 'date', sortable: true, Cell: (row: Complaint) => new Date(row.date).toLocaleString() },
    { 
      Header: 'Priority', 
      accessor: 'priority', 
      sortable: true,
      Cell: (row: Complaint) => {
        const colors = { low: 'bg-gray-100 text-gray-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[row.priority]}`}>{row.priority.toUpperCase()}</span>;
      }
    },
    { 
      Header: 'Status', 
      accessor: 'status', 
      sortable: true,
      Cell: (row: Complaint) => {
        const variants = {
          open: 'bg-red-100 text-red-700',
          in_progress: 'bg-yellow-100 text-yellow-700',
          resolved: 'bg-green-100 text-green-700',
        };
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${variants[row.status]}`}>
            {row.status === 'resolved' && <CheckCircle className="h-3 w-3" />}
            {row.status === 'open' && <AlertCircle className="h-3 w-3" />}
            {row.status === 'in_progress' && <Clock className="h-3 w-3" />}
            {row.status.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      sortable: false,
      Cell: (row: Complaint) => (
        <div className="flex gap-2">
          <button onClick={() => { setSelectedComplaint(row); setShowComplaintModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
            <Eye size={16} />
          </button>
          {row.status !== 'resolved' && (
            <>
              <button onClick={() => handleUpdateComplaintStatus(row.id, 'in_progress')} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Mark In Progress">
                <Clock size={16} />
              </button>
              <button onClick={() => openResolveModal(row)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Resolve">
                <CheckCircle size={16} />
              </button>
            </>
          )}
        </div>
      )
    },
  ];

  const handleExport = () => alert('Export to CSV coming soon.');
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 w-fit shadow-sm">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
            activeTab === 'customers' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users size={18} /> Customers ({customers.length})
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
            activeTab === 'complaints' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MessageSquare size={18} /> Complaints ({complaints.filter(c => c.status !== 'resolved').length} open)
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'customers' ? (
            <select
              className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          ) : (
            <select
              className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white"
              value={complaintFilter}
              onChange={(e) => setComplaintFilter(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          )}
          <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); setComplaintFilter('all'); }} className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
            <RefreshCw size={16} /> Reset
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition flex items-center gap-2">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Reusable Table */}
      <ReusableTable
        columns={activeTab === 'customers' ? customerColumns : complaintColumns}
        data={activeTab === 'customers' ? filteredCustomers : filteredComplaints}
        title={activeTab === 'customers' ? 'All Customers' : 'Customer Complaints'}
        icon={activeTab === 'customers' ? Users : MessageSquare}
        showSearch={false}
        showExport={false}
        showPrint={false}
        itemsPerPage={1000}
        itemsPerPageOptions={[1000]}
        onExport={handleExport}
        onPrint={handlePrint}
      />

      {/* ========== Customer Details Modal ========== */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Customer Profile</h2>
                <button onClick={() => setShowCustomerModal(false)} className="hover:opacity-80"><XCircle className="h-6 w-6" /></button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Personal & Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Users size={18} /> Personal Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>ID:</strong> {selectedCustomer.id}</div>
                    <div><strong>Name:</strong> {selectedCustomer.name}</div>
                    <div><strong>Email:</strong> {selectedCustomer.email}</div>
                    <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
                    <div><strong>Status:</strong> <span className={`px-2 py-0.5 rounded-full text-xs ${selectedCustomer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedCustomer.status}</span></div>
                    <div><strong>Joined:</strong> {selectedCustomer.joinDate}</div>
                    <div><strong>Last Active:</strong> {selectedCustomer.lastActive}</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><DollarSign size={18} /> Financial Activity</h3>
                  <div className="space-y-2">
                    <div><strong>Total Spent:</strong> <span className="text-green-600 font-bold">${selectedCustomer.totalSpent.toLocaleString()}</span></div>
                    <div><strong>Tickets Purchased:</strong> {selectedCustomer.ticketsPurchased}</div>
                    <div><strong>Average Ticket Price:</strong> ${(selectedCustomer.totalSpent / selectedCustomer.ticketsPurchased).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Booking History */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Ticket size={18} /> Booking History</h3>
                {selectedCustomer.bookings.length === 0 ? (
                  <p className="text-gray-500 text-sm">No bookings found.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.bookings.map(booking => (
                      <div key={booking.id} className="flex justify-between items-center p-2 bg-white rounded-lg border">
                        <div>
                          <p className="font-medium">{booking.eventName}</p>
                          <p className="text-xs text-gray-500">{booking.eventDate} | Seats: {booking.seats.join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${booking.totalAmount}</p>
                          <p className={`text-xs ${booking.status === 'confirmed' ? 'text-blue-600' : booking.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'}`}>{booking.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interaction History (Complaints) */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><MessageSquare size={18} /> Interaction History (Complaints)</h3>
                {complaints.filter(c => c.customerId === selectedCustomer.id).length === 0 ? (
                  <p className="text-gray-500 text-sm">No complaints filed.</p>
                ) : (
                  <div className="space-y-2">
                    {complaints.filter(c => c.customerId === selectedCustomer.id).map(comp => (
                      <div key={comp.id} className="p-2 bg-white rounded-lg border">
                        <div className="flex justify-between">
                          <span className="font-medium">{comp.subject}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${comp.status === 'resolved' ? 'bg-green-100 text-green-700' : comp.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{comp.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{comp.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(comp.date).toLocaleString()}</p>
                        {comp.resolution && <p className="text-xs text-green-600 mt-1">Resolution: {comp.resolution}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <ReusableButton variant="outline" onClick={() => setShowCustomerModal(false)}>Close</ReusableButton>
                <ReusableButton variant="primary" onClick={() => { setShowCustomerModal(false); setShowNewComplaintModal(true); }}>File New Complaint</ReusableButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Details Modal (same as before, omitted for brevity) */}
      {showComplaintModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Complaint Details</h2>
                <button onClick={() => setShowComplaintModal(false)} className="hover:opacity-80"><XCircle className="h-6 w-6" /></button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div><strong>ID:</strong> {selectedComplaint.id}</div>
              <div><strong>Customer:</strong> {selectedComplaint.customerName}</div>
              <div><strong>Subject:</strong> {selectedComplaint.subject}</div>
              <div><strong>Description:</strong> {selectedComplaint.description}</div>
              <div><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleString()}</div>
              <div><strong>Priority:</strong> <span className={`px-2 py-0.5 rounded-full text-xs ${selectedComplaint.priority === 'high' ? 'bg-red-100 text-red-700' : selectedComplaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{selectedComplaint.priority}</span></div>
              <div><strong>Status:</strong> <span className={`px-2 py-0.5 rounded-full text-xs ${selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-700' : selectedComplaint.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{selectedComplaint.status}</span></div>
              <div><strong>Assigned To:</strong> {selectedComplaint.assignedTo}</div>
              {selectedComplaint.resolution && <div><strong>Resolution:</strong> {selectedComplaint.resolution}</div>}
              {selectedComplaint.resolvedAt && <div><strong>Resolved At:</strong> {new Date(selectedComplaint.resolvedAt).toLocaleString()}</div>}
            </div>
            <div className="p-4 border-t flex gap-2 justify-end">
              {selectedComplaint.status !== 'resolved' && (
                <>
                  <ReusableButton variant="warning" size="sm" onClick={() => handleUpdateComplaintStatus(selectedComplaint.id, 'in_progress')}>Mark In Progress</ReusableButton>
                  <ReusableButton variant="success" size="sm" onClick={() => openResolveModal(selectedComplaint)}>Resolve</ReusableButton>
                </>
              )}
              <ReusableButton variant="outline" onClick={() => setShowComplaintModal(false)}>Close</ReusableButton>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Complaint Modal */}
      {showResolveModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="bg-green-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Resolve Complaint</h2>
            </div>
            <div className="p-6 space-y-4">
              <p><strong>Complaint:</strong> {selectedComplaint.subject}</p>
              <textarea
                className="w-full p-3 border rounded-xl"
                rows={4}
                placeholder="Enter resolution notes..."
                value={resolveText}
                onChange={(e) => setResolveText(e.target.value)}
              />
            </div>
            <div className="p-4 border-t flex gap-2 justify-end">
              <ReusableButton variant="outline" onClick={() => setShowResolveModal(false)}>Cancel</ReusableButton>
              <ReusableButton variant="success" onClick={() => handleUpdateComplaintStatus(selectedComplaint.id, 'resolved', resolveText)}>Resolve</ReusableButton>
            </div>
          </div>
        </div>
      )}

      {/* New Complaint Modal */}
      {showNewComplaintModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="bg-orange-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">File New Complaint</h2>
              <p className="text-sm opacity-90">Customer: {selectedCustomer.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Subject"
                className="w-full p-2 border rounded-lg"
                value={newComplaint.subject}
                onChange={(e) => setNewComplaint({...newComplaint, subject: e.target.value})}
              />
              <textarea
                placeholder="Description"
                rows={4}
                className="w-full p-2 border rounded-lg"
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
              />
              <select
                className="w-full p-2 border rounded-lg"
                value={newComplaint.priority}
                onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value as any})}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="p-4 border-t flex gap-2 justify-end">
              <ReusableButton variant="outline" onClick={() => setShowNewComplaintModal(false)}>Cancel</ReusableButton>
              <ReusableButton variant="primary" onClick={handleAddComplaint}>Submit Complaint</ReusableButton>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      <SuccessPopup isOpen={showSuccessPopup} message={successMessage} onClose={() => setShowSuccessPopup(false)} duration={3000} />
    </div>
  );
};

export default CustomerManagement;