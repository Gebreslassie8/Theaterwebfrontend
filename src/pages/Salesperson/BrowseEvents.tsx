import React, { useState, useMemo } from 'react';

// ===================== Types =====================
interface Show {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  hall: string;
  totalSeats: number;
  bookedSeats: number;
  popularityScore: number;
}

interface Seat {
  id: number;
  row: string;
  number: number;
  isBooked: boolean;
}

// ===================== Mock Data =====================
const mockShows: Show[] = [
  {
    id: 1,
    title: "The Lion King",
    description: "Disney's beloved musical returns with stunning visuals and unforgettable music.",
    date: "2026-05-10",
    time: "14:00",
    hall: "Grand Hall A",
    totalSeats: 200,
    bookedSeats: 145,
    popularityScore: 980,
  },
  {
    id: 2,
    title: "Hamilton",
    description: "The groundbreaking musical about Alexander Hamilton.",
    date: "2026-05-10",
    time: "19:30",
    hall: "Broadway Hall",
    totalSeats: 150,
    bookedSeats: 150,
    popularityScore: 995,
  },
  {
    id: 3,
    title: "Les Misérables",
    description: "The world's most popular musical.",
    date: "2026-05-11",
    time: "20:00",
    hall: "Grand Hall A",
    totalSeats: 180,
    bookedSeats: 78,
    popularityScore: 890,
  },
  {
    id: 4,
    title: "The Phantom of the Opera",
    description: "Andrew Lloyd Webber's masterpiece.",
    date: "2026-05-12",
    time: "19:00",
    hall: "Opera Hall",
    totalSeats: 220,
    bookedSeats: 210,
    popularityScore: 960,
  },
  {
    id: 5,
    title: "Come From Away",
    description: "The true story of a small town that welcomed the world.",
    date: "2026-05-13",
    time: "15:00",
    hall: "Intimate Theater",
    totalSeats: 120,
    bookedSeats: 45,
    popularityScore: 850,
  },
  {
    id: 6,
    title: "Wicked",
    description: "The untold story of the Witches of Oz.",
    date: "2026-05-14",
    time: "18:30",
    hall: "Grand Hall A",
    totalSeats: 200,
    bookedSeats: 200,
    popularityScore: 970,
  },
  {
    id: 7,
    title: "Mamma Mia!",
    description: "ABBA's greatest hits tell a hilarious story of love and family.",
    date: "2026-05-15",
    time: "20:30",
    hall: "Broadway Hall",
    totalSeats: 150,
    bookedSeats: 89,
    popularityScore: 900,
  },
  {
    id: 8,
    title: "The Book of Mormon",
    description: "From the creators of South Park, a hilarious religious satire.",
    date: "2026-05-16",
    time: "21:00",
    hall: "Comedy Hall",
    totalSeats: 140,
    bookedSeats: 140,
    popularityScore: 940,
  },
];

// Helper functions
const formatDate = (dateStr: string): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const getUniqueDates = (shows: Show[]): string[] => {
  const dates = shows.map(show => show.date);
  return [...new Set(dates)].sort();
};

const generateSeatsForShow = (show: Show): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = Math.ceil(show.totalSeats / rows.length);
  let seatId = 1;
  let bookedCount = 0;

  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow; i++) {
      if (seatId > show.totalSeats) break;
      const isBooked = bookedCount < show.bookedSeats;
      seats.push({
        id: seatId,
        row: row,
        number: i,
        isBooked: isBooked,
      });
      if (isBooked) bookedCount++;
      seatId++;
    }
    if (seatId > show.totalSeats) break;
  }
  return seats;
};

// ===================== Seat Map Modal Component =====================
interface SeatMapModalProps {
  show: Show | null;
  onClose: () => void;
  onSellSuccess: (showId: number, seatIds: number[]) => void;
}

const SeatMapModal: React.FC<SeatMapModalProps> = ({ show, onClose, onSellSuccess }) => {
  const [seats, setSeats] = useState<Seat[]>(() => (show ? generateSeatsForShow(show) : []));
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!show) return null;

  const toggleSeatSelection = (seatId: number, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const handleSell = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSeats(prevSeats =>
      prevSeats.map(seat =>
        selectedSeats.includes(seat.id) ? { ...seat, isBooked: true } : seat
      )
    );
    onSellSuccess(show.id, selectedSeats);
    setSelectedSeats([]);
    setIsProcessing(false);
    alert(`Successfully sold ${selectedSeats.length} ticket(s) for ${show.title}!`);
  };

  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const availableCount = seats.filter(s => !s.isBooked).length;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2>{show.title} - Seat Selection</h2>
          <button onClick={onClose} style={modalStyles.closeBtn}>×</button>
        </div>
        <div style={modalStyles.infoBar}>
          <div>📅 {formatDate(show.date)} at {show.time}</div>
          <div>🏛️ {show.hall}</div>
          <div>🎫 Available: {availableCount} / {show.totalSeats}</div>
        </div>
        <div style={modalStyles.seatLegend}>
          <span><span style={{ backgroundColor: '#9ca3af', width: '20px', height: '20px', display: 'inline-block', marginRight: '4px' }}></span> Booked</span>
          <span><span style={{ backgroundColor: '#10b981', width: '20px', height: '20px', display: 'inline-block', marginRight: '4px' }}></span> Available</span>
          <span><span style={{ backgroundColor: '#3b82f6', width: '20px', height: '20px', display: 'inline-block', marginRight: '4px' }}></span> Selected</span>
        </div>
        <div style={modalStyles.seatGrid}>
          {Object.entries(seatsByRow).map(([row, rowSeats]) => (
            <div key={row} style={modalStyles.seatRow}>
              <div style={modalStyles.rowLabel}>Row {row}</div>
              <div style={modalStyles.seatsContainer}>
                {rowSeats.map(seat => {
                  const isSelected = selectedSeats.includes(seat.id);
                  let seatColor = '#10b981';
                  if (seat.isBooked) seatColor = '#9ca3af';
                  else if (isSelected) seatColor = '#3b82f6';
                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeatSelection(seat.id, seat.isBooked)}
                      disabled={seat.isBooked}
                      style={{
                        ...modalStyles.seat,
                        backgroundColor: seatColor,
                        cursor: seat.isBooked ? 'not-allowed' : 'pointer',
                        opacity: seat.isBooked ? 0.6 : 1,
                      }}
                      title={`Row ${seat.row}, Seat ${seat.number}`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={modalStyles.footer}>
          <div>Selected: {selectedSeats.length} seat(s)</div>
          <button onClick={handleSell} disabled={isProcessing || selectedSeats.length === 0} style={modalStyles.sellButton}>
            {isProcessing ? 'Processing...' : `Sell Tickets ($${selectedSeats.length * 50})`}
          </button>
        </div>
      </div>
    </div>
  );
};

const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    maxWidth: '90vw',
    width: '800px',
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
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  infoBar: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    backgroundColor: '#f3f4f6',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  seatLegend: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '1rem',
    fontSize: '0.75rem',
  },
  seatGrid: {
    marginBottom: '1rem',
  },
  seatRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  rowLabel: {
    width: '50px',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  },
  seatsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  seat: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.75rem',
    transition: 'transform 0.1s',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1rem',
    marginTop: '1rem',
  },
  sellButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

// ===================== Main BrowseEvents Component =====================
const BrowseEvents: React.FC = () => {
  const [filterDate, setFilterDate] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [shows, setShows] = useState<Show[]>(mockShows);

  const uniqueDates = getUniqueDates(shows);

  const handleSellSuccess = (showId: number, seatIds: number[]) => {
    setShows(prevShows =>
      prevShows.map(show =>
        show.id === showId
          ? { ...show, bookedSeats: show.bookedSeats + seatIds.length }
          : show
      )
    );
  };

  const filteredShows = useMemo(() => {
    let result = [...shows];

    if (filterDate !== 'all') {
      result = result.filter(show => show.date === filterDate);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(show => show.title.toLowerCase().includes(term) || show.description.toLowerCase().includes(term));
    }

    if (sortBy === 'date') {
      result.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sortBy === 'popularity') {
      result.sort((a, b) => b.popularityScore - a.popularityScore);
    }

    return result;
  }, [filterDate, sortBy, searchTerm, shows]);

  const getAvailableSeats = (show: Show) => show.totalSeats - show.bookedSeats;
  const getSeatStatusColor = (available: number, total: number) => {
    const percent = (available / total) * 100;
    if (percent === 0) return '#ef4444';
    if (percent < 20) return '#f97316';
    return '#10b981';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🎭 Browse Events & Shows</h1>
          <p style={styles.subtitle}>Discover available theatre performances, check seat availability, and sell tickets.</p>
        </div>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter by Date:</label>
          <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={styles.select}>
            <option value="all">All Dates</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>{formatDate(date)}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'popularity')} style={styles.select}>
            <option value="date">Date (Earliest First)</option>
            <option value="popularity">Popularity (High to Low)</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Search:</label>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.resultsCount}>
        Found {filteredShows.length} show{filteredShows.length !== 1 ? 's' : ''}
      </div>

      <div style={styles.showsGrid}>
        {filteredShows.map(show => {
          const availableSeats = getAvailableSeats(show);
          const isSoldOut = availableSeats === 0;
          const seatColor = getSeatStatusColor(availableSeats, show.totalSeats);
          const popularityPercent = (show.popularityScore / 1000) * 100;

          return (
            <div key={show.id} style={{ ...styles.card, opacity: isSoldOut ? 0.7 : 1 }}>
              <div style={styles.cardHeader}>
                <h2 style={styles.showTitle}>{show.title}</h2>
                {isSoldOut && <span style={styles.soldOutBadge}>Sold Out</span>}
                {!isSoldOut && availableSeats < 10 && <span style={styles.limitedBadge}>Limited Seats</span>}
              </div>
              <p style={styles.description}>{show.description}</p>

              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>📅</span>
                  <span>{formatDate(show.date)}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>⏰</span>
                  <span>{show.time}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>🏛️</span>
                  <span>{show.hall}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>🎫</span>
                  <span>Total seats: {show.totalSeats}</span>
                </div>
              </div>

              <div style={styles.seatSection}>
                <div style={styles.seatLabels}>
                  <span>Available Seats:</span>
                  <strong style={{ color: seatColor }}>{availableSeats} / {show.totalSeats}</strong>
                </div>
                <div style={styles.progressContainer}>
                  <div style={{ ...styles.progressFill, width: `${(availableSeats / show.totalSeats) * 100}%`, backgroundColor: seatColor }} />
                </div>
              </div>

              <div style={styles.popularitySection}>
                <div style={styles.popularityHeader}>
                  <span>🔥 Popularity Score</span>
                  <span>{show.popularityScore}/1000</span>
                </div>
                <div style={styles.progressContainer}>
                  <div style={{ ...styles.progressFill, width: `${popularityPercent}%`, backgroundColor: '#f59e0b' }} />
                </div>
              </div>

              <button
                style={{ ...styles.viewButton, backgroundColor: isSoldOut ? '#9ca3af' : '#3b82f6', cursor: isSoldOut ? 'not-allowed' : 'pointer' }}
                disabled={isSoldOut}
                onClick={() => setSelectedShow(show)}
              >
                {isSoldOut ? 'Sold Out' : 'View Seats & Sell'}
              </button>
            </div>
          );
        })}
      </div>

      {filteredShows.length === 0 && (
        <div style={styles.emptyState}>
          <p>No shows match your filters. Try changing the date or search term.</p>
        </div>
      )}

      <div style={styles.footer}>
        <p>📌 Click "View Seats & Sell" to open interactive seat map. Select seats and complete the sale.</p>
      </div>

      {selectedShow && (
        <SeatMapModal
          show={selectedShow}
          onClose={() => setSelectedShow(null)}
          onSellSuccess={handleSellSuccess}
        />
      )}
    </div>
  );
};

// ===================== Styles =====================
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f9fafb',
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
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  subtitle: {
    color: '#6b7280',
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
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  filterLabel: {
    fontWeight: '500',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.25rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  showTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  soldOutBadge: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  limitedBadge: {
    backgroundColor: '#ffedd5',
    color: '#f97316',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  description: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '1rem',
    lineHeight: '1.4',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem',
    marginBottom: '1rem',
    backgroundColor: '#f9fafb',
    padding: '0.75rem',
    borderRadius: '0.75rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  detailIcon: {
    fontSize: '1rem',
  },
  seatSection: {
    marginBottom: '1rem',
  },
  seatLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  popularitySection: {
    marginBottom: '1rem',
  },
  popularityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  progressContainer: {
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '8px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.3s ease',
  },
  viewButton: {
    border: 'none',
    color: 'white',
    padding: '0.6rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s',
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