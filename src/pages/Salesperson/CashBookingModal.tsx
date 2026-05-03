import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Ticket, Phone, Mail, User, CheckCircle, AlertCircle,
  ChevronRight, ChevronLeft, QrCode, Share2, Copy,
  Check, Download, Printer, Wallet
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Seat sections
const SEAT_SECTIONS = {
  VIP: { rows: ['A', 'B'], multiplier: 2.5, name: 'VIP' },
  PREMIUM: { rows: ['C', 'D'], multiplier: 1.8, name: 'Premium' },
  STANDARD: { rows: ['E', 'F', 'G', 'H'], multiplier: 1, name: 'Standard' }
};

const validateEthiopianPhone = (phone) => /^(?:\+251|0)?[97]\d{8}$/.test(phone);
const formatBirr = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB' }).format(amount);

const generateUniqueQRData = (ticket, idx) => JSON.stringify({
  ticketId: ticket.ticketId,
  ticketNumber: idx + 1,
  totalTickets: ticket.totalTickets,
  bookingId: ticket.bookingId,
  show: ticket.show,
  seat: ticket.seat,
  row: ticket.row,
  number: ticket.number,
  section: ticket.section,
  customerName: ticket.customerName,
  price: ticket.price,
  venue: ticket.venue,
  timestamp: new Date().toISOString()
});

const CashBookingModal = ({ show, isOpen, onClose, onConfirm, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatDetails, setSeatDetails] = useState({});
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessQR, setShowSuccessQR] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [copied, setCopied] = useState({});
  const [shared, setShared] = useState({});
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [validation, setValidation] = useState({
    name: { valid: true, msg: '', touched: false },
    email: { valid: true, msg: '', touched: false },
    phone: { valid: true, msg: '', touched: false }
  });

  useEffect(() => {
    if (!isOpen && !showSuccessQR) {
      setStep(1);
      setSelectedSeats([]);
      setSeatDetails({});
      setCustomerInfo({ name: '', email: '', phone: '' });
      setError('');
      setValidation({
        name: { valid: true, msg: '', touched: false },
        email: { valid: true, msg: '', touched: false },
        phone: { valid: true, msg: '', touched: false }
      });
    }
  }, [isOpen, showSuccessQR]);

  const generateSeats = () => {
    const seats = [];
    const base = 500;
    Object.entries(SEAT_SECTIONS).forEach(([sec, cfg]) => {
      cfg.rows.forEach(row => {
        for (let i = 1; i <= 12; i++) {
          seats.push({
            id: `${row}${i}`,
            row, number: i,
            section: sec,
            sectionName: cfg.name,
            price: Math.round(base * cfg.multiplier),
            isReserved: Math.random() < 0.2
          });
        }
      });
    });
    return seats;
  };
  const [seats] = useState(generateSeats());

  const total = selectedSeats.reduce((sum, id) => sum + (seats.find(s => s.id === id)?.price || 0), 0);

  const handleSeatSelect = (id) => {
    const seat = seats.find(s => s.id === id);
    if (seat?.isReserved) return;
    setSelectedSeats(prev => {
      if (prev.includes(id)) {
        const newDetails = { ...seatDetails };
        delete newDetails[id];
        setSeatDetails(newDetails);
        return prev.filter(i => i !== id);
      }
      setSeatDetails(prev => ({ ...prev, [id]: { seatId: id, row: seat.row, number: seat.number, section: seat.sectionName, price: seat.price } }));
      return [...prev, id];
    });
  };

  const handleFieldChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    setValidation(prev => ({ ...prev, [field]: { ...prev[field], touched: true } }));
    if (field === 'name') {
      const ok = value.trim().length >= 2;
      setValidation(prev => ({ ...prev, name: { ...prev.name, valid: ok, msg: ok ? '' : 'Name too short' } }));
    }
    if (field === 'email') {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setValidation(prev => ({ ...prev, email: { ...prev.email, valid: ok, msg: ok ? '' : 'Invalid email' } }));
    }
    if (field === 'phone') {
      const ok = validateEthiopianPhone(value);
      setValidation(prev => ({ ...prev, phone: { ...prev.phone, valid: ok, msg: ok ? '' : 'Invalid Ethiopian phone' } }));
    }
  };

  const next = () => {
    if (step === 1 && selectedSeats.length === 0) { setError('Select at least one seat'); return; }
    if (step === 2) {
      if (!customerInfo.name || !validation.name.valid || !customerInfo.email || !validation.email.valid || !customerInfo.phone || !validation.phone.valid) {
        setError('Fill all customer info correctly');
        return;
      }
      processPayment();
      return;
    }
    setError('');
    setStep(s => s + 1);
  };
  const back = () => setStep(s => s - 1);

  const generateTickets = () => {
    const bookingId = `CASH${Date.now()}${Math.random().toString(36).substring(2, 10)}`;
    return selectedSeats.map((id, idx) => {
      const seat = seats.find(s => s.id === id);
      const ticket = {
        ticketId: `${bookingId}${Math.random().toString(36).substring(2, 8)}`,
        bookingId,
        ticketNumber: idx + 1,
        totalTickets: selectedSeats.length,
        show: show.title,
        seat: id,
        row: seat.row,
        number: seat.number,
        section: seat.sectionName,
        price: seat.price,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        venue: show.venue,
      };
      ticket.qrData = generateUniqueQRData(ticket, idx);
      return ticket;
    });
  };

  const processPayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const tickets = generateTickets();
    const info = {
      bookingId: tickets[0]?.bookingId,
      show: show.title,
      seats: selectedSeats,
      seatDetails,
      totalSeats: selectedSeats.length,
      totalAmount: total,
      totalAmountBirr: formatBirr(total),
      customerInfo,
      paymentMethod: 'cash',
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      venue: show.venue,
      tickets
    };
    setBookingData(info);
    const bookings = JSON.parse(localStorage.getItem('theater_bookings') || '[]');
    bookings.push(info);
    localStorage.setItem('theater_bookings', JSON.stringify(bookings));
    onConfirm(info);
    setIsProcessing(false);
    onClose();
    setTimeout(() => setShowSuccessQR(true), 50);
  };

  const copyQR = (ticket, idx) => {
    navigator.clipboard.writeText(ticket.qrData);
    setCopied(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [idx]: false })), 2000);
  };
  const shareQR = async (ticket, idx) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Ticket ${ticket.seat}`,
          text: `${ticket.show}\nSeat: ${ticket.seat}\nCustomer: ${ticket.customerName}`,
        });
        setShared(prev => ({ ...prev, [idx]: true }));
        setTimeout(() => setShared(prev => ({ ...prev, [idx]: false })), 2000);
      } else {
        navigator.clipboard.writeText(`${ticket.show}\nSeat: ${ticket.seat}\nCustomer: ${ticket.customerName}`);
        alert('Ticket info copied to clipboard');
      }
    } catch { alert('Share cancelled'); }
  };
  const downloadTicket = (ticket) => {
    const qrElement = document.getElementById(`qr-${ticket.ticketId}`);
    if (qrElement) {
      const svgString = qrElement.outerHTML;
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_${ticket.seat}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert('QR code not ready');
    }
  };
  const printTicket = (ticket) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Ticket ${ticket.seat}</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:20px;">
          <h2>${ticket.show}</h2>
          <p>Seat: ${ticket.seat}</p>
          <p>Customer: ${ticket.customerName}</p>
          <p>Price: ${formatBirr(ticket.price)}</p>
          <div>${document.getElementById(`qr-${ticket.ticketId}`)?.outerHTML || 'QR code'}</div>
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  const printAll = () => {
    if (!bookingData) return;
    const w = window.open('', '_blank');
    let html = '<html><head><title>All Tickets</title></head><body>';
    bookingData.tickets.forEach(t => {
      html += `<div style="border:1px solid #ccc;margin:10px;padding:10px;">
        <h3>${t.show}</h3><p>Seat: ${t.seat}</p><p>Customer: ${t.customerName}</p>
        <p>Price: ${formatBirr(t.price)}</p>
        <div>${document.getElementById(`qr-${t.ticketId}`)?.outerHTML || 'QR'}</div>
      </div>`;
    });
    html += '<script>window.onload = () => { window.print(); window.close(); }<\/script></body></html>';
    w.document.write(html);
    w.document.close();
  };

  const getSeatStyle = (seat) => {
    if (seat.isReserved) return 'bg-gray-200 cursor-not-allowed opacity-50';
    if (selectedSeats.includes(seat.id)) return 'bg-deepTeal text-white ring-2 ring-deepTeal ring-offset-2 shadow-lg';
    if (seat.section === 'VIP') return 'bg-amber-100 hover:bg-amber-200 border-amber-300';
    if (seat.section === 'PREMIUM') return 'bg-purple-100 hover:bg-purple-200 border-purple-300';
    return 'bg-deepTeal/10 hover:bg-deepTeal/20 border-deepTeal/30';
  };

  const closeSuccessQRModal = () => {
    setShowSuccessQR(false);
    setBookingData(null);
    if (onComplete) onComplete();
  };

  if (!isOpen && !showSuccessQR) return null;

  return (
    <>
      {/* Main Booking Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative max-w-6xl mx-auto mt-16 mb-16">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-deepTeal to-deepBlue text-white px-6 py-4 flex justify-between items-center">
                  <div><h2 className="text-2xl font-bold flex gap-2"><Ticket /> Theatre Hub Ethiopia</h2><p className="text-white/80 text-sm">{show.title}</p></div>
                  <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg"><X /></button>
                </div>
                <div className="px-6 py-4 border-b bg-gray-50">
                  <div className="flex justify-between max-w-2xl mx-auto">
                    {[{step:1,label:'Seats',icon:Ticket},{step:2,label:'Info & Cash',icon:User}].map(item => (
                      <div key={item.step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex justify-center items-center ${step >= item.step ? 'bg-deepTeal text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {step > item.step ? <CheckCircle size={20}/> : <item.icon size={20}/>}
                          </div>
                          <span className="text-xs mt-2 hidden sm:block">{item.label}</span>
                        </div>
                        {item.step < 2 && <div className="flex-1 h-0.5 bg-gray-200"><div className={`h-full bg-deepTeal transition-all ${step > item.step ? 'w-full' : 'w-0'}`} /></div>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm">{error}</div>}
                  {step === 1 && (
                    <div>
                      <h3 className="text-lg font-semibold text-center mb-4">Select Your Seats</h3>
                      <div className="mb-6 p-4 bg-gradient-to-r from-deepTeal/10 to-deepBlue/5 rounded-xl text-center">Selected {selectedSeats.length} seats | Total {formatBirr(total)}</div>
                      <div className="flex justify-center gap-6 mb-6 text-sm">
                        {Object.entries(SEAT_SECTIONS).map(([k,c]) => <div key={k} className="flex items-center gap-2"><div className={`w-4 h-4 rounded border ${k==='VIP'?'bg-amber-100 border-amber-300':k==='PREMIUM'?'bg-purple-100 border-purple-300':'bg-deepTeal/10 border-deepTeal/30'}`} /><span>{c.name}</span></div>)}
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-deepTeal ring-2 ring-deepTeal" /><span>Selected</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-200" /><span>Reserved</span></div>
                      </div>
                      <div className="text-center mb-4"><div className="w-48 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto rounded-full" /><div className="text-xs text-gray-400 mt-1">STAGE</div></div>
                      <div className="flex justify-center">
                        <div>
                          {['A','B','C','D','E','F','G','H'].map(row => {
                            const rs = seats.filter(s => s.row === row).sort((a,b)=>a.number-b.number);
                            if(!rs.length) return null;
                            return (
                              <div key={row} className="flex items-center mb-2">
                                <div className="w-8 text-center font-mono text-sm text-gray-400">{row}</div>
                                <div className="flex gap-1.5 flex-wrap justify-center">
                                  {rs.map(seat => (
                                    <button key={seat.id} onClick={()=>handleSeatSelect(seat.id)} disabled={seat.isReserved}
                                      onMouseEnter={()=>setHoveredSeat(seat.id)} onMouseLeave={()=>setHoveredSeat(null)}
                                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs font-medium transition-all ${getSeatStyle(seat)} ${hoveredSeat===seat.id && !seat.isReserved && !selectedSeats.includes(seat.id)?'shadow-lg scale-105':''}`}
                                      title={`${seat.sectionName} Seat ${seat.id} - ${formatBirr(seat.price)}`}>
                                      {seat.number}
                                    </button>
                                  ))}
                                </div>
                                <div className="w-20 text-right"><span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100">{SEAT_SECTIONS[rs[0]?.section]?.name}</span></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {selectedSeats.length>0 && (
                        <div className="mt-8 p-5 bg-gray-50 rounded-xl">
                          <h4 className="font-semibold mb-3 flex gap-2"><Ticket size={16} className="text-deepTeal" /> Selected Seats</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {selectedSeats.map(id => {
                              const s = seats.find(x=>x.id===id);
                              return <div key={id} className="flex justify-between p-2 bg-white rounded border"><div><b>{id}</b><br/><span className="text-xs">{s?.sectionName}</span></div><span className="font-semibold text-deepTeal">{formatBirr(s?.price)}</span></div>;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {step === 2 && (
                    <div className="max-w-md mx-auto">
                      <h3 className="text-lg font-semibold text-center mb-4">Customer Info & Cash Payment</h3>
                      <div className="space-y-4 mb-6">
                        <div><label className="block text-sm font-medium">Full Name *</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" value={customerInfo.name} onChange={e=>handleFieldChange('name',e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded" /></div>{validation.name.touched && !validation.name.valid && <p className="text-xs text-red-500">{validation.name.msg}</p>}</div>
                        <div><label className="block text-sm font-medium">Email *</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="email" value={customerInfo.email} onChange={e=>handleFieldChange('email',e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded" /></div>{validation.email.touched && !validation.email.valid && <p className="text-xs text-red-500">{validation.email.msg}</p>}</div>
                        <div><label className="block text-sm font-medium">Phone (Ethiopian) *</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="tel" value={customerInfo.phone} onChange={e=>handleFieldChange('phone',e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded" /></div>{validation.phone.touched && !validation.phone.valid && <p className="text-xs text-red-500">{validation.phone.msg}</p>}</div>
                      </div>
                      <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex justify-between"><span className="font-semibold">Total:</span><span className="text-2xl font-bold text-amber-700">{formatBirr(total)}</span></div>
                        <div className="text-sm text-gray-600">{selectedSeats.length} tickets</div>
                      </div>
                      <button onClick={next} disabled={isProcessing} className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                        {isProcessing ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><Wallet size={20} /> Confirm Cash Payment</>}
                      </button>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
                  {step > 1 && <button onClick={back} className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded flex items-center gap-1"><ChevronLeft size={16} /> Back</button>}
                  {step === 1 && <button onClick={next} className="ml-auto px-4 py-2 bg-deepTeal text-white rounded flex items-center gap-1">Next <ChevronRight size={16} /></button>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success QR Modal – with icon buttons, no extra text */}
      {showSuccessQR && bookingData && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeSuccessQRModal} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex gap-2 text-green-600">
                  <CheckCircle className="text-green-500" /> Payment Successful!
                </h2>
                <p className="text-sm text-gray-500">Booking ID: {bookingData.bookingId}</p>
              </div>
              <button onClick={closeSuccessQRModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between flex-wrap gap-2">
                <div><span className="font-semibold">Total Amount:</span><span className="text-xl font-bold text-green-700 ml-2">{bookingData.totalAmountBirr}</span></div>
                <div><span className="font-semibold">Tickets:</span><span className="ml-2">{bookingData.totalSeats}</span></div>
                <div><span className="font-semibold">Show:</span><span className="ml-2">{bookingData.show}</span></div>
              </div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <QrCode className="text-deepTeal" /> Your Ticket QR Codes
              </h3>
              <div className="space-y-6">
                {bookingData.tickets.map((ticket, idx) => (
                  <div key={ticket.ticketId} className="border-2 border-deepTeal/30 rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-deepTeal to-deepBlue text-white px-5 py-3 flex justify-between">
                      <div><h3 className="font-bold">Theatre Hub Ethiopia</h3></div>
                      <div className="text-right">
                        <span className="text-xs">Ticket {idx+1}/{bookingData.totalSeats}</span><br />
                        <span className="text-[10px] font-mono">{ticket.ticketId}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-center mb-4">
                        <QRCodeSVG id={`qr-${ticket.ticketId}`} value={ticket.qrData} size={140} level="H" />
                      </div>
                      <div className="flex justify-center gap-4 mb-4">
                        <button onClick={() => shareQR(ticket, idx)} title="Share ticket" className="p-2 rounded-lg bg-deepTeal text-white hover:bg-deepBlue transition-colors">
                          {shared[idx] ? <Check size={18} /> : <Share2 size={18} />}
                        </button>
                        <button onClick={() => copyQR(ticket, idx)} title="Copy QR data" className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors">
                          {copied[idx] ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                        <button onClick={() => downloadTicket(ticket)} title="Download QR as SVG" className="p-2 rounded-lg bg-deepTeal text-white hover:bg-deepBlue transition-colors">
                          <Download size={18} />
                        </button>
                        <button onClick={() => printTicket(ticket)} title="Print ticket" className="p-2 rounded-lg bg-deepTeal text-white hover:bg-deepBlue transition-colors">
                          <Printer size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-deepTeal/5 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Seat</div>
                          <div className="font-bold text-2xl text-deepTeal">{ticket.seat}</div>
                          <div className="text-xs">Row {ticket.row}, Seat {ticket.number}</div>
                        </div>
                        <div className="bg-deepTeal/5 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Ticket Holder</div>
                          <div className="font-semibold">{ticket.customerName}</div>
                        </div>
                        <div className="bg-deepTeal/5 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Section</div>
                          <div>{ticket.section}</div>
                        </div>
                        <div className="bg-deepTeal/5 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Price</div>
                          <div className="font-semibold">{formatBirr(ticket.price)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={printAll} className="flex-1 py-2 bg-deepTeal text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-deepBlue transition">
                  <Printer size={18} /> Print All ({bookingData.totalSeats})
                </button>
                <button onClick={closeSuccessQRModal} className="flex-1 py-2 border-2 border-deepTeal text-deepTeal rounded-xl font-semibold hover:bg-deepTeal/10 transition">
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CashBookingModal;