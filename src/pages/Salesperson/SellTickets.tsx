import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// --- Type Definitions ---
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Show {
  id: string;
  title: string;
  datetime: string;
  venue: string;
  ticketPrice: number;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'reserved' | 'sold';
  price: number; // price can vary per seat
}

interface Booking {
  id: string;
  customerId: string;
  showId: string;
  seats: Seat[];
  totalAmount: number;
  discountPercent: number;
  discountAmount: number;
  finalAmount: number;
  bookingReference: string;
  qrData: string;
}

// Mock API functions (replace with real fetch calls)
const mockFetchCustomers = async (searchTerm: string): Promise<Customer[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const allCustomers: Customer[] = [
    { id: 'c1', name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
    { id: 'c2', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' },
    { id: 'c3', name: 'Alice Johnson', email: 'alice@example.com', phone: '5551234567' },
  ];
  if (!searchTerm) return [];
  return allCustomers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));
};

const mockCreateCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return {
    id: `c${Date.now()}`,
    ...customerData,
  };
};

const mockFetchShows = async (): Promise<Show[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    { id: 's1', title: 'The Phantom of the Opera', datetime: '2025-05-15T19:00:00', venue: 'Main Hall', ticketPrice: 45.0 },
    { id: 's2', title: 'Hamilton', datetime: '2025-05-16T20:00:00', venue: 'Central Theatre', ticketPrice: 85.0 },
    { id: 's3', title: 'Wicked', datetime: '2025-05-17T18:30:00', venue: 'Lyric Stage', ticketPrice: 60.0 },
  ];
};

const mockFetchSeats = async (showId: string): Promise<Seat[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  // Generate mock seats: rows A-D, numbers 1-8
  const rows = ['A', 'B', 'C', 'D'];
  const seats: Seat[] = [];
  rows.forEach(row => {
    for (let i = 1; i <= 8; i++) {
      const seatId = `${row}${i}`;
      let status: Seat['status'] = 'available';
      // Mock some taken seats
      if ((row === 'A' && i <= 2) || (row === 'C' && i === 5)) status = 'reserved';
      if ((row === 'B' && i === 3)) status = 'sold';
      seats.push({
        id: seatId,
        row,
        number: i,
        status,
        price: row === 'A' ? 75 : row === 'B' ? 65 : row === 'C' ? 55 : 45,
      });
    }
  });
  return seats;
};

const mockCreateBooking = async (bookingData: {
  customerId: string;
  showId: string;
  seatIds: string[];
  discountPercent: number;
}): Promise<Booking> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const mockSeats: Seat[] = bookingData.seatIds.map((sid, idx) => ({
    id: sid,
    row: sid[0],
    number: parseInt(sid.slice(1)),
    status: 'reserved',
    price: 50 + idx * 5,
  }));
  const total = mockSeats.reduce((sum, s) => sum + s.price, 0);
  const discountAmount = (total * bookingData.discountPercent) / 100;
  const finalAmount = total - discountAmount;
  const bookingRef = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const qrData = JSON.stringify({
    bookingRef,
    showId: bookingData.showId,
    seats: bookingData.seatIds,
    customerId: bookingData.customerId,
    finalAmount,
  });
  return {
    id: `b${Date.now()}`,
    customerId: bookingData.customerId,
    showId: bookingData.showId,
    seats: mockSeats,
    totalAmount: total,
    discountPercent: bookingData.discountPercent,
    discountAmount,
    finalAmount,
    bookingReference: bookingRef,
    qrData,
  };
};

// Helper to get user discount permission (mock)
const fetchDiscountPermission = async (): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // Simulate that manager has allowed discounts for this salesperson
  return true;
};

const SellTickets: React.FC = () => {
  // --- State Variables ---
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountAllowed, setDiscountAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<{ customers?: boolean; shows?: boolean; seats?: boolean; booking?: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<Booking | null>(null);
  const [showDiscountLabel, setShowDiscountLabel] = useState(false);

  // Refs for print section
  const ticketRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    loadShows();
    loadDiscountPermission();
  }, []);

  const loadShows = async () => {
    setLoading(prev => ({ ...prev, shows: true }));
    try {
      const showsData = await mockFetchShows();
      setShows(showsData);
    } catch (err) {
      setError('Failed to load shows');
    } finally {
      setLoading(prev => ({ ...prev, shows: false }));
    }
  };

  const loadDiscountPermission = async () => {
    const allowed = await fetchDiscountPermission();
    setDiscountAllowed(allowed);
    setShowDiscountLabel(allowed);
  };

  const handleSearchCustomer = async () => {
    if (!searchTerm.trim()) {
      setCustomerSearchResults([]);
      return;
    }
    setLoading(prev => ({ ...prev, customers: true }));
    try {
      const results = await mockFetchCustomers(searchTerm);
      setCustomerSearchResults(results);
    } catch (err) {
      setError('Customer search failed');
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchResults([]);
    setSearchTerm('');
    setShowCreateForm(false);
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      setError('Name and email are required');
      return;
    }
    try {
      const created = await mockCreateCustomer(newCustomer);
      setSelectedCustomer(created);
      setShowCreateForm(false);
      setNewCustomer({ name: '', email: '', phone: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create customer');
    }
  };

  // When show changes, load seats
  useEffect(() => {
    if (selectedShow) {
      loadSeatsForShow(selectedShow.id);
      setSelectedSeatIds([]); // reset seat selection
      setBookingConfirmed(null); // clear previous booking
    } else {
      setSeats([]);
    }
  }, [selectedShow]);

  const loadSeatsForShow = async (showId: string) => {
    setLoading(prev => ({ ...prev, seats: true }));
    try {
      const seatsData = await mockFetchSeats(showId);
      setSeats(seatsData);
    } catch (err) {
      setError('Failed to load seat map');
    } finally {
      setLoading(prev => ({ ...prev, seats: false }));
    }
  };

  const toggleSeatSelection = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status !== 'available') return;

    setSelectedSeatIds(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const calculateTotal = () => {
    const selectedSeats = seats.filter(s => selectedSeatIds.includes(s.id));
    const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    return { subtotal, discountAmount, final: subtotal - discountAmount };
  };

  const handleReserveAndConfirm = async () => {
    // Validation
    if (!selectedCustomer) {
      setError('Please select or create a customer');
      return;
    }
    if (!selectedShow) {
      setError('Please select a show');
      return;
    }
    if (selectedSeatIds.length === 0) {
      setError('Please select at least one seat');
      return;
    }
    if (discountPercent < 0 || discountPercent > 100) {
      setError('Discount must be between 0 and 100');
      return;
    }
    if (discountPercent > 0 && !discountAllowed) {
      setError('Discounts are not allowed by manager');
      return;
    }

    setLoading(prev => ({ ...prev, booking: true }));
    try {
      const booking = await mockCreateBooking({
        customerId: selectedCustomer.id,
        showId: selectedShow.id,
        seatIds: selectedSeatIds,
        discountPercent,
      });
      setBookingConfirmed(booking);
      setError(null);
    } catch (err) {
      setError('Booking confirmation failed');
    } finally {
      setLoading(prev => ({ ...prev, booking: false }));
    }
  };

  const handlePrintTicket = () => {
    if (ticketRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Theatre Ticket</title><style>body { font-family: sans-serif; padding: 20px; }</style></head>
            <body>${ticketRef.current.innerHTML}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      } else {
        window.print();
      }
    }
  };

  const handleResetBooking = () => {
    setBookingConfirmed(null);
    setSelectedSeatIds([]);
    setDiscountPercent(0);
  };

  // Seat map rendering
  const renderSeatMap = () => {
    const rows = Array.from(new Set(seats.map(s => s.row))).sort();
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-lg mb-3">Seat Map</h3>
        <div className="space-y-2">
          {rows.map(row => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-6 font-bold">{row}</span>
              <div className="flex flex-wrap gap-2">
                {seats.filter(s => s.row === row).map(seat => {
                  let bgColor = 'bg-gray-200';
                  let cursor = 'cursor-not-allowed';
                  let isSelected = selectedSeatIds.includes(seat.id);
                  if (seat.status === 'available') {
                    bgColor = isSelected ? 'bg-green-500 hover:bg-green-600' : 'bg-white hover:bg-gray-100';
                    cursor = 'cursor-pointer';
                  } else if (seat.status === 'reserved') bgColor = 'bg-yellow-200';
                  else if (seat.status === 'sold') bgColor = 'bg-red-200';
                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeatSelection(seat.id)}
                      disabled={seat.status !== 'available'}
                      className={`w-10 h-10 border rounded-md text-sm font-medium transition ${bgColor} ${cursor} border-gray-300`}
                      title={`${seat.row}${seat.number} - $${seat.price} (${seat.status})`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <span><span className="inline-block w-4 h-4 bg-white border mr-1"></span> Available</span>
          <span><span className="inline-block w-4 h-4 bg-green-500 mr-1"></span> Selected</span>
          <span><span className="inline-block w-4 h-4 bg-yellow-200 mr-1"></span> Reserved</span>
          <span><span className="inline-block w-4 h-4 bg-red-200 mr-1"></span> Sold</span>
        </div>
      </div>
    );
  };

  const { subtotal, discountAmount, final: finalTotal } = calculateTotal();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎭 Sell Tickets</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-800 font-bold">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Customer & Show Selection */}
        <div className="space-y-6">
          {/* Customer Section */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">👤 Customer</h2>
            {selectedCustomer ? (
              <div className="bg-green-50 p-3 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-600">{selectedCustomer.email} | {selectedCustomer.phone}</p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email"
                    className="flex-1 border rounded-md px-3 py-2"
                  />
                  <button
                    onClick={handleSearchCustomer}
                    disabled={loading.customers}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Search
                  </button>
                </div>
                {customerSearchResults.length > 0 && (
                  <div className="border rounded-md mb-3 max-h-48 overflow-y-auto">
                    {customerSearchResults.map(cust => (
                      <div key={cust.id} className="p-2 hover:bg-gray-100 cursor-pointer border-b" onClick={() => handleSelectCustomer(cust)}>
                        <p className="font-medium">{cust.name}</p>
                        <p className="text-sm text-gray-600">{cust.email}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  + Create new customer
                </button>
                {showCreateForm && (
                  <div className="mt-3 border-t pt-3">
                    <input type="text" placeholder="Full Name" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} className="w-full border rounded-md px-3 py-2 mb-2" />
                    <input type="email" placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} className="w-full border rounded-md px-3 py-2 mb-2" />
                    <input type="tel" placeholder="Phone" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} className="w-full border rounded-md px-3 py-2 mb-2" />
                    <button onClick={handleCreateCustomer} className="bg-green-600 text-white px-4 py-2 rounded-md">Save Customer</button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Show Selection */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">🎬 Select Show</h2>
            {loading.shows ? (
              <div>Loading shows...</div>
            ) : (
              <select
                value={selectedShow?.id || ''}
                onChange={(e) => {
                  const show = shows.find(s => s.id === e.target.value);
                  setSelectedShow(show || null);
                }}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">-- Choose a show --</option>
                {shows.map(show => (
                  <option key={show.id} value={show.id}>
                    {show.title} - {new Date(show.datetime).toLocaleString()} ({show.venue})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Seat Map */}
          {selectedShow && (
            <div className="border rounded-lg p-4 shadow-sm">
              {loading.seats ? <div>Loading seat map...</div> : renderSeatMap()}
            </div>
          )}
        </div>

        {/* Right Column: Booking Summary & Discount */}
        <div className="space-y-6">
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">🧾 Booking Summary</h2>
            {selectedShow && (
              <div className="mb-3 p-2 bg-gray-100 rounded">
                <p className="font-medium">{selectedShow.title}</p>
                <p className="text-sm">{new Date(selectedShow.datetime).toLocaleString()} | {selectedShow.venue}</p>
              </div>
            )}
            <div className="mb-3">
              <p className="font-medium">Selected Seats:</p>
              {selectedSeatIds.length === 0 ? (
                <p className="text-gray-500 text-sm">None selected</p>
              ) : (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSeatIds.map(id => {
                    const seat = seats.find(s => s.id === id);
                    return (
                      <span key={id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">
                        {seat?.row}{seat?.number} (${seat?.price})
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAllowed && (
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1">
                    <span>Discount %:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-20 border rounded px-2 py-1"
                    />
                  </label>
                  {discountPercent > 0 && <span className="text-green-600">-${discountAmount.toFixed(2)}</span>}
                </div>
              )}
              {!discountAllowed && showDiscountLabel && (
                <div className="text-sm text-gray-500 italic">Discounts are currently disabled by manager.</div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Final Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleReserveAndConfirm}
              disabled={loading.booking || !selectedCustomer || !selectedShow || selectedSeatIds.length === 0}
              className="w-full mt-4 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading.booking ? 'Processing...' : 'Reserve & Confirm Booking'}
            </button>
          </div>

          {/* Ticket / Receipt Display after confirmation */}
          {bookingConfirmed && (
            <div className="border rounded-lg p-4 shadow-sm bg-white">
              <div ref={ticketRef} className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <h3 className="text-2xl font-bold text-center mb-2">🎟️ THEATRE TICKET</h3>
                <div className="text-center mb-4">
                  <p className="text-sm">Booking Reference: <strong>{bookingConfirmed.bookingReference}</strong></p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div><span className="font-semibold">Customer:</span> {selectedCustomer?.name}</div>
                  <div><span className="font-semibold">Show:</span> {selectedShow?.title}</div>
                  <div><span className="font-semibold">Date/Time:</span> {selectedShow && new Date(selectedShow.datetime).toLocaleString()}</div>
                  <div><span className="font-semibold">Venue:</span> {selectedShow?.venue}</div>
                  <div className="col-span-2"><span className="font-semibold">Seats:</span> {bookingConfirmed.seats.map(s => `${s.row}${s.number}`).join(', ')}</div>
                  <div><span className="font-semibold">Total Paid:</span> ${bookingConfirmed.finalAmount.toFixed(2)}</div>
                  {bookingConfirmed.discountPercent > 0 && <div><span className="font-semibold">Discount:</span> {bookingConfirmed.discountPercent}%</div>}
                </div>
                <div className="flex justify-center my-3">
                  <QRCodeSVG value={bookingConfirmed.qrData} size={128} />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">Scan QR code for entry validation</p>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handlePrintTicket} className="flex-1 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900">
                  🖨️ Print Ticket
                </button>
                <button onClick={handleResetBooking} className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                  ➕ New Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellTickets;