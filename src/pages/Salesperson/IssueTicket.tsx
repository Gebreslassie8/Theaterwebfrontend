import React, { useState } from 'react';
// Assuming Tailwind CSS is available; otherwise include custom CSS.
// Icons can be replaced if lucide-react is not installed; here we use simple Unicode/emoji.
// For production, install: npm install lucide-react

type Ticket = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  showTitle: string;
  seatNumber: string;
  price: number;
  status: 'valid' | 'used' | 'expired';
  issuedAt: string;
};

type Show = {
  id: string;
  title: string;
  dateTime: string;
  venue: string;
};

// Mock data for demonstration
const mockShows: Show[] = [
  { id: 's1', title: 'The Lion King', dateTime: '2025-05-15 19:00', venue: 'Main Hall' },
  { id: 's2', title: 'Hamilton', dateTime: '2025-05-16 20:00', venue: 'Grand Theatre' },
  { id: 's3', title: 'Wicked', dateTime: '2025-05-17 15:00', venue: 'West End' },
];

const mockSeats = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2'];

// Mock API functions (replace with real fetch calls)
const mockIssueTicket = (ticketData: any): Promise<Ticket> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        ...ticketData,
        status: 'valid',
        issuedAt: new Date().toISOString(),
      });
    }, 800);
  });
};

const mockGetTicket = (ticketId: string): Promise<Ticket | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate existing tickets for demo
      const existingTickets: Record<string, Ticket> = {
        'TKT-ABC123': {
          id: 'TKT-ABC123',
          customerName: 'John Doe',
          email: 'john@example.com',
          phone: '555-1234',
          showTitle: 'The Lion King',
          seatNumber: 'A1',
          price: 75.0,
          status: 'valid',
          issuedAt: new Date().toISOString(),
        },
        'TKT-USED01': {
          id: 'TKT-USED01',
          customerName: 'Jane Smith',
          email: 'jane@example.com',
          phone: '555-5678',
          showTitle: 'Hamilton',
          seatNumber: 'B2',
          price: 120.0,
          status: 'used',
          issuedAt: new Date().toISOString(),
        },
      };
      resolve(existingTickets[ticketId] || null);
    }, 500);
  });
};

const mockResendTicket = (ticketId: string, method: 'email' | 'sms'): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ticketId.trim() === '') reject(new Error('Ticket ID required'));
      else resolve();
    }, 600);
  });
};

const mockMarkTicketAsUsed = (ticketId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ticketId.trim() === '') reject(new Error('Ticket ID required'));
      else resolve();
    }, 500);
  });
};

const IssueTicket: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'issue' | 'reprint' | 'resend' | 'verify'>('issue');

  // Issue Ticket state
  const [issueForm, setIssueForm] = useState({
    showId: '',
    seatNumber: '',
    customerName: '',
    email: '',
    phone: '',
    price: '',
  });
  const [issuing, setIssuing] = useState(false);
  const [issuedTicket, setIssuedTicket] = useState<Ticket | null>(null);
  const [issueError, setIssueError] = useState('');

  // Reprint / Resend / Verify shared state
  const [ticketIdInput, setTicketIdInput] = useState('');
  const [retrievedTicket, setRetrievedTicket] = useState<Ticket | null>(null);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [ticketNotFound, setTicketNotFound] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // For resend, selected method
  const [resendMethod, setResendMethod] = useState<'email' | 'sms'>('email');

  // For verify, extra action
  const [verifyingMarkUsed, setVerifyingMarkUsed] = useState(false);

  // Helper to clear messages
  const clearMessages = () => {
    setIssueError('');
    setActionSuccess('');
    setActionError('');
    setTicketNotFound(false);
  };

  // Handle issue ticket submission
  const handleIssueTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!issueForm.showId || !issueForm.seatNumber || !issueForm.customerName || !issueForm.email || !issueForm.phone || !issueForm.price) {
      setIssueError('Please fill all fields');
      return;
    }
    const selectedShow = mockShows.find(s => s.id === issueForm.showId);
    if (!selectedShow) {
      setIssueError('Invalid show selected');
      return;
    }
    setIssuing(true);
    try {
      const newTicket = await mockIssueTicket({
        customerName: issueForm.customerName,
        email: issueForm.email,
        phone: issueForm.phone,
        showTitle: selectedShow.title,
        seatNumber: issueForm.seatNumber,
        price: parseFloat(issueForm.price),
      });
      setIssuedTicket(newTicket);
      // Reset form
      setIssueForm({ showId: '', seatNumber: '', customerName: '', email: '', phone: '', price: '' });
    } catch (err) {
      setIssueError('Failed to issue ticket. Try again.');
    } finally {
      setIssuing(false);
    }
  };

  // Retrieve ticket by ID (for reprint, resend, verify)
  const fetchTicket = async () => {
    clearMessages();
    if (!ticketIdInput.trim()) {
      setActionError('Please enter a Ticket ID');
      return;
    }
    setLoadingTicket(true);
    setRetrievedTicket(null);
    setTicketNotFound(false);
    try {
      const ticket = await mockGetTicket(ticketIdInput.trim());
      if (ticket) {
        setRetrievedTicket(ticket);
      } else {
        setTicketNotFound(true);
      }
    } catch (err) {
      setActionError('Error fetching ticket');
    } finally {
      setLoadingTicket(false);
    }
  };

  // Reprint function (simulate print dialog)
  const handleReprint = () => {
    if (!retrievedTicket) return;
    // In real app, you might generate a PDF or open print dialog with ticket details.
    const printContent = `
      <html>
        <head><title>Ticket ${retrievedTicket.id}</title></head>
        <body>
          <h1>Theatre Ticket</h1>
          <p><strong>Ticket ID:</strong> ${retrievedTicket.id}</p>
          <p><strong>Show:</strong> ${retrievedTicket.showTitle}</p>
          <p><strong>Seat:</strong> ${retrievedTicket.seatNumber}</p>
          <p><strong>Customer:</strong> ${retrievedTicket.customerName}</p>
          <p><strong>Price:</strong> $${retrievedTicket.price}</p>
          <p><strong>Status:</strong> ${retrievedTicket.status}</p>
          <p><strong>Issued:</strong> ${new Date(retrievedTicket.issuedAt).toLocaleString()}</p>
          <div style="margin-top:20px;">--- QR Code placeholder ---</div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert('Please allow pop-ups to print the ticket.');
    }
    setActionSuccess('Reprint initiated. Printing dialog should appear.');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  // Resend ticket via email/SMS
  const handleResend = async () => {
    if (!retrievedTicket) return;
    setActionError('');
    setActionSuccess('');
    try {
      await mockResendTicket(retrievedTicket.id, resendMethod);
      setActionSuccess(`Ticket resent via ${resendMethod.toUpperCase()} to ${resendMethod === 'email' ? retrievedTicket.email : retrievedTicket.phone}`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to resend ticket');
    }
  };

  // Verify ticket validity and optionally mark as used
  const handleMarkAsUsed = async () => {
    if (!retrievedTicket) return;
    if (retrievedTicket.status === 'used') {
      setActionError('This ticket has already been used.');
      return;
    }
    if (retrievedTicket.status === 'expired') {
      setActionError('This ticket has expired and cannot be used.');
      return;
    }
    setVerifyingMarkUsed(true);
    try {
      await mockMarkTicketAsUsed(retrievedTicket.id);
      setRetrievedTicket({ ...retrievedTicket, status: 'used' });
      setActionSuccess('Ticket marked as used successfully.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update ticket status');
    } finally {
      setVerifyingMarkUsed(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Salesperson Dashboard - Ticket Management</h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 mb-6">
        {(['issue', 'reprint', 'resend', 'verify'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              clearMessages();
              // Reset states when switching tabs for cleaner UX
              if (tab !== 'issue') setIssuedTicket(null);
              if (tab !== 'reprint') setRetrievedTicket(null);
              if (tab !== 'resend') setRetrievedTicket(null);
              if (tab !== 'verify') setRetrievedTicket(null);
              setTicketIdInput('');
            }}
            className={`py-2 px-4 font-semibold capitalize transition ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            {tab === 'issue' && '🎟️ Issue Ticket'}
            {tab === 'reprint' && '🖨️ Reprint Lost Ticket'}
            {tab === 'resend' && '📧 Resend via Email/SMS'}
            {tab === 'verify' && '✅ Verify Ticket at Counter'}
          </button>
        ))}
      </div>

      {/* ----- Issue Ticket Tab ----- */}
      {activeTab === 'issue' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Issue New Ticket</h2>
          {issuedTicket ? (
            <div className="border border-green-300 bg-green-50 p-4 rounded-md mb-4">
              <p className="text-green-800 font-medium">Ticket issued successfully!</p>
              <div className="mt-2 text-sm">
                <p><strong>Ticket ID:</strong> {issuedTicket.id}</p>
                <p><strong>Show:</strong> {issuedTicket.showTitle}</p>
                <p><strong>Seat:</strong> {issuedTicket.seatNumber}</p>
                <p><strong>Customer:</strong> {issuedTicket.customerName}</p>
                <p><strong>Email:</strong> {issuedTicket.email}</p>
                <p><strong>Phone:</strong> {issuedTicket.phone}</p>
                <p><strong>Price:</strong> ${issuedTicket.price}</p>
                <div className="mt-2 p-2 bg-gray-200 inline-block">[QR Code Placeholder]</div>
              </div>
              <button
                onClick={() => setIssuedTicket(null)}
                className="mt-3 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              >
                Issue Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleIssueTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Show *</label>
                  <select
                    value={issueForm.showId}
                    onChange={(e) => setIssueForm({ ...issueForm, showId: e.target.value })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Select Show</option>
                    {mockShows.map(show => (
                      <option key={show.id} value={show.id}>{show.title} - {show.dateTime}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seat Number *</label>
                  <select
                    value={issueForm.seatNumber}
                    onChange={(e) => setIssueForm({ ...issueForm, seatNumber: e.target.value })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Select Seat</option>
                    {mockSeats.map(seat => (
                      <option key={seat} value={seat}>{seat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
                  <input
                    type="text"
                    value={issueForm.customerName}
                    onChange={(e) => setIssueForm({ ...issueForm, customerName: e.target.value })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={issueForm.email}
                    onChange={(e) => setIssueForm({ ...issueForm, email: e.target.value })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    value={issueForm.phone}
                    onChange={(e) => setIssueForm({ ...issueForm, phone: e.target.value })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={issueForm.price}
                    onChange={(e) => setIssueForm({ ...issueForm, price: e.target.value })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>
              {issueError && <p className="text-red-600 text-sm">{issueError}</p>}
              <button
                type="submit"
                disabled={issuing}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {issuing ? 'Issuing...' : 'Issue Ticket'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ----- Reprint Tab ----- */}
      {activeTab === 'reprint' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Reprint Lost Ticket</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter Ticket ID (e.g., TKT-ABC123)"
              value={ticketIdInput}
              onChange={(e) => setTicketIdInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
            <button
              onClick={fetchTicket}
              disabled={loadingTicket}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:bg-gray-400"
            >
              {loadingTicket ? 'Loading...' : 'Find Ticket'}
            </button>
          </div>

          {loadingTicket && <p>Searching...</p>}
          {ticketNotFound && <p className="text-red-600">Ticket not found. Please check the ID.</p>}
          {actionError && <p className="text-red-600">{actionError}</p>}

          {retrievedTicket && (
            <div className="border border-gray-200 rounded-md p-4 mt-2">
              <h3 className="font-bold">Ticket Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <span>Ticket ID:</span><span>{retrievedTicket.id}</span>
                <span>Show:</span><span>{retrievedTicket.showTitle}</span>
                <span>Seat:</span><span>{retrievedTicket.seatNumber}</span>
                <span>Customer:</span><span>{retrievedTicket.customerName}</span>
                <span>Email:</span><span>{retrievedTicket.email}</span>
                <span>Phone:</span><span>{retrievedTicket.phone}</span>
                <span>Status:</span>
                <span className={`font-semibold ${retrievedTicket.status === 'valid' ? 'text-green-600' : 'text-red-600'}`}>
                  {retrievedTicket.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleReprint}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                🖨️ Reprint Ticket
              </button>
              {actionSuccess && <p className="text-green-600 text-sm mt-2">{actionSuccess}</p>}
            </div>
          )}
        </div>
      )}

      {/* ----- Resend Tab ----- */}
      {activeTab === 'resend' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Resend Ticket via Email or SMS</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Ticket ID"
              value={ticketIdInput}
              onChange={(e) => setTicketIdInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
            <button
              onClick={fetchTicket}
              disabled={loadingTicket}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
            >
              {loadingTicket ? 'Loading...' : 'Lookup Ticket'}
            </button>
          </div>

          {loadingTicket && <p>Loading...</p>}
          {ticketNotFound && <p className="text-red-600">Ticket not found.</p>}
          {actionError && <p className="text-red-600">{actionError}</p>}

          {retrievedTicket && (
            <div className="border border-gray-200 rounded-md p-4 mt-2">
              <p><strong>Ticket:</strong> {retrievedTicket.id} - {retrievedTicket.showTitle}</p>
              <p><strong>Customer:</strong> {retrievedTicket.customerName}</p>
              <div className="mt-3">
                <label className="block text-sm font-medium">Resend via:</label>
                <div className="flex gap-4 mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="email"
                      checked={resendMethod === 'email'}
                      onChange={() => setResendMethod('email')}
                      className="mr-1"
                    /> Email ({retrievedTicket.email})
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="sms"
                      checked={resendMethod === 'sms'}
                      onChange={() => setResendMethod('sms')}
                      className="mr-1"
                    /> SMS ({retrievedTicket.phone})
                  </label>
                </div>
              </div>
              <button
                onClick={handleResend}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Resend Ticket
              </button>
              {actionSuccess && <p className="text-green-600 text-sm mt-2">{actionSuccess}</p>}
            </div>
          )}
        </div>
      )}

      {/* ----- Verify Tab ----- */}
      {activeTab === 'verify' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Confirm Ticket Validity at Counter</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Scan / Enter Ticket ID"
              value={ticketIdInput}
              onChange={(e) => setTicketIdInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
            <button
              onClick={fetchTicket}
              disabled={loadingTicket}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
            >
              Verify
            </button>
          </div>

          {loadingTicket && <p>Verifying...</p>}
          {ticketNotFound && <p className="text-red-600">Ticket ID not recognized.</p>}
          {actionError && <p className="text-red-600">{actionError}</p>}

          {retrievedTicket && (
            <div className="border rounded-md p-4 mt-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold">Ticket: {retrievedTicket.id}</p>
                  <p>Show: {retrievedTicket.showTitle}</p>
                  <p>Seat: {retrievedTicket.seatNumber}</p>
                  <p>Customer: {retrievedTicket.customerName}</p>
                  <p className="mt-2">
                    Status: 
                    <span className={`ml-2 font-bold ${
                      retrievedTicket.status === 'valid' ? 'text-green-600' : 
                      retrievedTicket.status === 'used' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {retrievedTicket.status.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-100 p-2">[QR Sim]</div>
              </div>

              {retrievedTicket.status === 'valid' && (
                <button
                  onClick={handleMarkAsUsed}
                  disabled={verifyingMarkUsed}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-300"
                >
                  {verifyingMarkUsed ? 'Updating...' : 'Mark as Used (Entry Granted)'}
                </button>
              )}
              {retrievedTicket.status === 'used' && (
                <p className="mt-3 text-red-700 font-medium">✗ This ticket has already been used. Entry not allowed.</p>
              )}
              {retrievedTicket.status === 'expired' && (
                <p className="mt-3 text-orange-700 font-medium">⚠️ This ticket has expired.</p>
              )}
              {actionSuccess && <p className="text-green-600 text-sm mt-2">{actionSuccess}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueTicket;