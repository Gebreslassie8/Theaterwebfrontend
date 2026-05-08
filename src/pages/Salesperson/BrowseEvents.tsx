import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Building2, Armchair, TrendingUp, Search, Filter, ChevronDown, CheckCircle, Theater, MapPin } from 'lucide-react';
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
          <h1 style={styles.title}>
            <Theater style={{ width: '1.875rem', height: '1.875rem', display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Browse Events & Shows
          </h1>
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
          <h1 style={styles.title}>
            <Theater style={{ width: '1.875rem', height: '1.875rem', display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Browse Events & Shows
          </h1>
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
        <h1 style={styles.title}>
          <Theater style={{ width: '1.875rem', height: '1.875rem', display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Browse Events & Shows
        </h1>
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
        <MapPin style={{ width: '0.875rem', height: '0.875rem', display: 'inline-block', marginRight: '0.25rem', verticalAlign: 'middle' }} />
        Click "Book Now" on any event → Select date/time → Complete payment to confirm your seats.
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
    display: 'flex',
    alignItems: 'center',
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