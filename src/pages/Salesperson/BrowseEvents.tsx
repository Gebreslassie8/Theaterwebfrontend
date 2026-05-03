// import React, { useState, useMemo } from 'react';
// import { Calendar, Clock, Building2, Armchair, TrendingUp, Search } from 'lucide-react'; // added icons
// import Colors from '../../components/Reusable/Colors';
// import ReusableButton from '../../components/Reusable/ReusableButton';
// import SuccessPopup from '../../components/Reusable/SuccessPopup';
// import CashBookingModal from './CashBookingModal';
// import { saveSaleRecord, SaleRecord } from './SellTickets';

// // ===================== Types =====================
// interface Show {
//   id: number;
//   title: string;
//   description: string;
//   date: string;
//   time: string;
//   totalSeats: number;
//   bookedSeats: number;
//   popularityScore: number;
//   posterColor: string;
// }

// // ===================== Mock Data =====================
// const HALL_CAPACITY = 220;

// const mockShows: Show[] = [
//   { id: 1, title: "The Lion King", description: "Disney's beloved musical returns with stunning visuals.", date: "2026-05-10", time: "14:00", totalSeats: HALL_CAPACITY, bookedSeats: 145, popularityScore: 980, posterColor: "linear-gradient(135deg, #f5af19, #f12711)" },
//   { id: 2, title: "Hamilton", description: "The groundbreaking musical about Alexander Hamilton.", date: "2026-05-10", time: "19:30", totalSeats: HALL_CAPACITY, bookedSeats: 150, popularityScore: 995, posterColor: "linear-gradient(135deg, #11998e, #38ef7d)" },
//   { id: 3, title: "Les Misérables", description: "The world's most popular musical.", date: "2026-05-11", time: "20:00", totalSeats: HALL_CAPACITY, bookedSeats: 78, popularityScore: 890, posterColor: "linear-gradient(135deg, #1f4037, #99f2c8)" },
//   { id: 4, title: "The Phantom of the Opera", description: "Andrew Lloyd Webber's masterpiece.", date: "2026-05-12", time: "19:00", totalSeats: HALL_CAPACITY, bookedSeats: 210, popularityScore: 960, posterColor: "linear-gradient(135deg, #23074d, #cc5333)" },
//   { id: 5, title: "Come From Away", description: "The true story of a small town that welcomed the world.", date: "2026-05-13", time: "15:00", totalSeats: HALL_CAPACITY, bookedSeats: 45, popularityScore: 850, posterColor: "linear-gradient(135deg, #2c3e50, #3498db)" },
//   { id: 6, title: "Wicked", description: "The untold story of the Witches of Oz.", date: "2026-05-14", time: "18:30", totalSeats: HALL_CAPACITY, bookedSeats: 200, popularityScore: 970, posterColor: "linear-gradient(135deg, #8E2DE2, #4A00E0)" },
//   { id: 7, title: "Mamma Mia!", description: "ABBA's greatest hits tell a hilarious story.", date: "2026-05-15", time: "20:30", totalSeats: HALL_CAPACITY, bookedSeats: 89, popularityScore: 900, posterColor: "linear-gradient(135deg, #f857a6, #ff5858)" },
//   { id: 8, title: "The Book of Mormon", description: "From the creators of South Park, a hilarious religious satire.", date: "2026-05-16", time: "21:00", totalSeats: HALL_CAPACITY, bookedSeats: 140, popularityScore: 940, posterColor: "linear-gradient(135deg, #f2994a, #f2c94c)" },
// ];

// const formatDate = (dateStr: string): string => {
//   const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
//   return new Date(dateStr).toLocaleDateString(undefined, options);
// };

// const getUniqueDates = (shows: Show[]): string[] => [...new Set(shows.map(s => s.date))].sort();

// const BrowseEvents: React.FC = () => {
//   const [filterDate, setFilterDate] = useState('all');
//   const [sortBy, setSortBy] = useState<'date'|'popularity'>('date');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedShow, setSelectedShow] = useState<Show | null>(null);
//   const [shows, setShows] = useState(mockShows);
//   const [showCashModal, setShowCashModal] = useState(false);
//   const [successPopup, setSuccessPopup] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

//   const uniqueDates = getUniqueDates(shows);

//   const handleBookingConfirm = (bookingInfo: any) => {
//     if (!selectedShow) return;
//     const tickets = bookingInfo.tickets.map((t: any) => ({ seatId: t.ticketId, seatLabel: t.seat, qrData: t.qrData }));
//     const saleRecord: SaleRecord = {
//       id: bookingInfo.bookingId,
//       customerName: bookingInfo.customerInfo.name,
//       customerPhone: bookingInfo.customerInfo.phone,
//       showTitle: bookingInfo.show,
//       showDate: selectedShow.date,
//       showTime: selectedShow.time,
//       seats: bookingInfo.seats,
//       tickets: tickets,
//       seatType: 'Standard',
//       totalAmount: bookingInfo.totalAmount,
//       paymentMethod: 'cash',
//       saleDate: new Date().toISOString(),
//       salesperson: 'Sales Agent',
//     };
//     saveSaleRecord(saleRecord);
//     setShows(prev => prev.map(s => s.id === selectedShow.id ? { ...s, bookedSeats: s.bookedSeats + bookingInfo.totalSeats } : s));
//     setSuccessPopup({ open: true, message: `✅ Cash payment successful! ${bookingInfo.totalSeats} ticket(s) sold to ${bookingInfo.customerInfo.name}.` });
//   };

//   const filteredShows = useMemo(() => {
//     let res = [...shows];
//     if (filterDate !== 'all') res = res.filter(s => s.date === filterDate);
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       res = res.filter(s => s.title.toLowerCase().includes(term) || s.description.toLowerCase().includes(term));
//     }
//     return res.sort((a,b) => sortBy === 'date' ? a.date.localeCompare(b.date) : b.popularityScore - a.popularityScore);
//   }, [filterDate, sortBy, searchTerm, shows]);

//   const getAvailable = (s: Show) => s.totalSeats - s.bookedSeats;
//   const getSeatColor = (avail: number, total: number) => {
//     const p = (avail/total)*100;
//     if (p===0) return '#ef4444';
//     if (p<20) return '#f97316';
//     return '#10b981';
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.title}>🎭 Browse Events & Shows</h1>
//         <p style={styles.subtitle}>All performances in Main Hall – select seats and pay with cash.</p>
//       </div>
//       <div style={styles.filterBar}>
//         <div style={styles.filterGroup}><label style={styles.filterLabel}>Filter by Date:</label><select value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={styles.select}><option value="all">All Dates</option>{uniqueDates.map(d=><option key={d} value={d}>{formatDate(d)}</option>)}</select></div>
//         <div style={styles.filterGroup}><label style={styles.filterLabel}>Sort by:</label><select value={sortBy} onChange={e=>setSortBy(e.target.value as 'date'|'popularity')} style={styles.select}><option value="date">Date (Earliest First)</option><option value="popularity">Popularity (High to Low)</option></select></div>
//         <div style={styles.filterGroup}><label style={styles.filterLabel}>Search:</label><input type="text" placeholder="Title/Description" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={styles.searchInput} /></div>
//       </div>
//       <div style={styles.resultsCount}>Found {filteredShows.length} show{filteredShows.length!==1?'s':''}</div>
//       <div style={styles.showsGrid}>
//         {filteredShows.map(show => {
//           const avail = getAvailable(show);
//           const soldOut = avail===0;
//           const seatColor = getSeatColor(avail, show.totalSeats);
//           const popPercent = (show.popularityScore/1000)*100;
//           return (
//             <div key={show.id} style={styles.card}>
//               <div style={{...styles.posterBar, background:show.posterColor}}></div>
//               <div style={styles.cardContent}>
//                 <div style={styles.cardHeader}><h2 style={styles.showTitle}>{show.title}</h2>{soldOut && <span style={styles.soldOutBadge}>Sold Out</span>}{!soldOut && avail<10 && <span style={styles.limitedBadge}>Limited</span>}</div>
//                 <p style={styles.description}>{show.description}</p>
//                 {/* Details grid with Lucide icons */}
//                 <div style={styles.detailsGrid}>
//                   <div style={styles.detailItem}><Calendar size={16} style={styles.icon} /> {formatDate(show.date)}</div>
//                   <div style={styles.detailItem}><Clock size={16} style={styles.icon} /> {show.time}</div>
//                   <div style={styles.detailItem}><Building2 size={16} style={styles.icon} /> Main Hall</div>
//                   <div style={styles.detailItem}><Armchair size={16} style={styles.icon} /> {show.totalSeats} seats</div>
//                 </div>
//                 <div style={styles.seatSection}><div style={styles.seatLabels}><span>Available Seats:</span><strong style={{color:seatColor}}>{avail} / {show.totalSeats}</strong></div><div style={styles.progressContainer}><div style={{width:`${(avail/show.totalSeats)*100}%`, backgroundColor:seatColor, height:'100%', borderRadius:9999}} /></div></div>
//                 <div style={styles.popularitySection}><div style={styles.popularityHeader}><span>🔥 Popularity</span><span>{show.popularityScore}/1000</span></div><div style={styles.progressContainer}><div style={{width:`${popPercent}%`, backgroundColor:'#f59e0b', height:'100%', borderRadius:9999}} /></div></div>
//                 <ReusableButton variant="primary" onClick={()=>{setSelectedShow(show); setShowCashModal(true);}} disabled={soldOut} fullWidth>{soldOut?'Sold Out':'💵 Sell Tickets (Cash)'}</ReusableButton>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       {filteredShows.length===0 && <div style={styles.emptyState}>No shows match your filters.</div>}
//       <div style={styles.footer}>📌 Click "Sell Tickets" → Select seats → Enter customer info → Confirm cash payment → Get QR codes.</div>

//       <CashBookingModal
//         show={selectedShow ? { id: selectedShow.id.toString(), title: selectedShow.title, venue: 'Main Hall' } : { title: '', venue: '' }}
//         isOpen={showCashModal}
//         onClose={() => setShowCashModal(false)}
//         onConfirm={handleBookingConfirm}
//         onComplete={() => setSelectedShow(null)}
//       />

//       <SuccessPopup isOpen={successPopup.open} onClose={()=>setSuccessPopup({open:false, message:''})} type="success" title="Payment Successful!" message={successPopup.message} duration={3000} />
//     </div>
//   );
// };

// const styles: { [key: string]: React.CSSProperties } = {
//   container: { fontFamily:'system-ui', backgroundColor:'#f3f4f6', minHeight:'100vh', padding:'1.5rem', maxWidth:'1400px', margin:'0 auto' },
//   header: { marginBottom:'2rem' },
//   title: { fontSize:'1.875rem', fontWeight:700, color:Colors.dark||'#1f2937', margin:0 },
//   subtitle: { color:Colors.gray||'#6b7280', marginTop:'0.25rem', fontSize:'0.875rem' },
//   filterBar: { display:'flex', flexWrap:'wrap', gap:'1rem', backgroundColor:'white', padding:'1rem 1.5rem', borderRadius:'1rem', marginBottom:'1.5rem', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', border:'1px solid #e5e7eb' },
//   filterGroup: { display:'flex', alignItems:'center', gap:'0.5rem' },
//   filterLabel: { fontWeight:500, fontSize:'0.875rem', color:'#374151' },
//   select: { padding:'0.5rem 0.75rem', borderRadius:'0.5rem', border:'1px solid #d1d5db', backgroundColor:'white', fontSize:'0.875rem', cursor:'pointer' },
//   searchInput: { padding:'0.5rem 0.75rem', borderRadius:'0.5rem', border:'1px solid #d1d5db', width:'240px', fontSize:'0.875rem' },
//   resultsCount: { fontSize:'0.875rem', color:'#6b7280', marginBottom:'1rem' },
//   showsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px,1fr))', gap:'1.8rem', marginBottom:'2rem' },
//   card: { backgroundColor:'white', borderRadius:'1.2rem', overflow:'hidden', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)', display:'flex', flexDirection:'column' },
//   posterBar: { height:'8px' },
//   cardContent: { padding:'1.25rem' },
//   cardHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' },
//   showTitle: { fontSize:'1.35rem', fontWeight:700, margin:0 },
//   soldOutBadge: { backgroundColor:'#fee2e2', color:'#dc2626', padding:'0.25rem 0.75rem', borderRadius:9999, fontSize:'0.7rem', fontWeight:600 },
//   limitedBadge: { backgroundColor:'#ffedd5', color:'#f97316', padding:'0.25rem 0.75rem', borderRadius:9999, fontSize:'0.7rem', fontWeight:600 },
//   description: { fontSize:'0.875rem', color:'#4b5563', marginBottom:'1rem', lineHeight:1.4 },
//   detailsGrid: { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.5rem', marginBottom:'1rem', backgroundColor:'#f9fafb', padding:'0.75rem', borderRadius:'0.75rem' },
//   detailItem: { display:'flex', alignItems:'center', gap:'6px', fontSize:'0.85rem', color:'#374151' },
//   icon: { color: Colors.primary || '#0d9488' },
//   seatSection: { marginBottom:'1rem' },
//   seatLabels: { display:'flex', justifyContent:'space-between', fontSize:'0.875rem', marginBottom:'0.25rem' },
//   popularitySection: { marginBottom:'1rem' },
//   popularityHeader: { display:'flex', justifyContent:'space-between', fontSize:'0.875rem', marginBottom:'0.25rem' },
//   progressContainer: { backgroundColor:'#e5e7eb', borderRadius:9999, height:'8px', overflow:'hidden' },
//   emptyState: { textAlign:'center', padding:'3rem', backgroundColor:'white', borderRadius:'1rem', color:'#6b7280' },
//   footer: { marginTop:'2rem', textAlign:'center', fontSize:'0.75rem', color:'#6b7280', borderTop:'1px solid #e5e7eb', paddingTop:'1rem' },
// };

// export default BrowseEvents;
// src/pages/Cashier/BrowseEvents.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Building2, Armchair, TrendingUp, Search, Filter, ChevronDown, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '../../config/supabaseClient';
import EventCard, { Event } from '../../components/UI/EventCard';
import Colors from '../../components/Reusable/Colors';

// ===================== Helper: Transform Supabase Event (same as Home) =====================
const transformSupabaseEvent = (dbEvent: any): Event => {
  const sampleDates = [
    {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '19:30',
      availableSeats: Math.floor(Math.random() * 100) + 20,
      price: dbEvent.price_min || 50,
    },
    {
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '14:00',
      availableSeats: Math.floor(Math.random() * 100) + 20,
      price: dbEvent.price_min || 50,
    },
  ];

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || 'No description available',
    genre: dbEvent.genre || 'General',
    duration: dbEvent.duration_minutes || 120,
    venue: `Theater ${dbEvent.theater_id?.substring(0, 8) || 'Main Hall'}`,
    director: dbEvent.director || undefined,
    cast: dbEvent.cast || [],
    images: {
      poster: dbEvent.poster_url || 'https://images.unsplash.com/photo-1511193311914-034c8c8a8f16?w=800&auto=format&fit=crop',
      gallery: [],
    },
    dates: sampleDates,
    priceRange: {
      min: dbEvent.price_min || 0,
      max: dbEvent.price_max || 0,
    },
    status: dbEvent.status === 'now-showing' ? 'on market' : 'sold out',
    isFeatured: dbEvent.is_featured,
    rating: dbEvent.rating || undefined,
    reviews: dbEvent.review_count || undefined,
    viewCount: dbEvent.view_count || undefined,
  };
};

// ===================== Main Component =====================
const BrowseEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering & sorting state
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'popularity' | 'name'>('date');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });
        if (supabaseError) throw supabaseError;
        if (data) {
          const transformed = data.map(transformSupabaseEvent);
          setEvents(transformed);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Get unique dates from events (based on first show date)
  const uniqueDates = useMemo(() => {
    const dates = events
      .map(e => e.dates[0]?.date)
      .filter((date): date is string => !!date);
    return [...new Set(dates)].sort();
  }, [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Date filter
    if (filterDate !== 'all') {
      result = result.filter(e => e.dates[0]?.date === filterDate);
    }

    // Search filter (title or description)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'date':
        result.sort((a, b) => {
          const dateA = a.dates[0]?.date || '';
          const dateB = b.dates[0]?.date || '';
          return dateA.localeCompare(dateB);
        });
        break;
      case 'popularity':
        result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return result;
  }, [events, filterDate, searchTerm, sortBy]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎭 Browse Events & Shows</h1>
          <p style={styles.subtitle}>Loading events from the database...</p>
        </div>
        <div style={styles.loading}>Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎭 Browse Events & Shows</h1>
          <p style={styles.subtitle}>Error loading events</p>
        </div>
        <div style={styles.error}>
          {error}
          <button onClick={() => window.location.reload()} style={styles.retryBtn}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎭 Browse Events & Shows</h1>
        <p style={styles.subtitle}>All performances in Main Hall – click "Book Now" to reserve tickets.</p>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter by Date:</label>
          <select value={filterDate} onChange={e => setFilterDate(e.target.value)} style={styles.select}>
            <option value="all">All Dates</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>{formatDate(date)}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={styles.select}>
            <option value="date">Date (Earliest First)</option>
            <option value="popularity">Popularity (Most Viewed)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Search:</label>
          <input
            type="text"
            placeholder="Title or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.resultsCount}>
        Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
      </div>

      {/* Events Grid – using EventCard for consistent sizing */}
      <div style={styles.showsGrid}>
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div style={styles.emptyState}>
          No events match your filters. Try adjusting your search or date filter.
        </div>
      )}

      <div style={styles.footer}>
        📌 Click "Book Now" on any event → Select date/time → Complete payment to confirm your seats.
      </div>
    </div>
  );
};

// ===================== Styles (keeping the same visual layout as original) =====================
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'system-ui',
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
    padding: '1.5rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 700,
    color: Colors.dark || '#1f2937',
    margin: 0,
  },
  subtitle: {
    color: Colors.gray || '#6b7280',
    marginTop: '0.25rem',
    fontSize: '0.875rem',
  },
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    backgroundColor: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '1rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  filterLabel: {
    fontWeight: 500,
    fontSize: '0.875rem',
    color: '#374151',
  },
  select: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  searchInput: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    width: '240px',
    fontSize: '0.875rem',
  },
  resultsCount: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem',
  },
  showsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.8rem',
    marginBottom: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1rem',
    color: '#6b7280',
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#fee2e2',
    borderRadius: '1rem',
    color: '#dc2626',
  },
  retryBtn: {
    marginLeft: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    color: '#6b7280',
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#6b7280',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1rem',
  },
};

export default BrowseEvents;