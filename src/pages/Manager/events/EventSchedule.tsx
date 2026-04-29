// src/pages/Manager/events/EventSchedule.tsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Edit, Trash2, Eye, Plus, X, 
  CheckCircle, AlertCircle, Search, Filter, Download, RefreshCw,
  Ticket, Users, DollarSign, List
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// ==================== Types (from CreateEvent) ====================
interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface SeatCategory {
  id: string;
  name: string;
  price: number;
  capacity: number;
  booked?: number;
  commissionPercent: number;
}

interface EventData {
  id: string;
  name: string;
  timeSlots: TimeSlot[];
  hall: string;
  seatCategories: SeatCategory[];
  category: string;
  ageRestriction: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  organizer: string;
  imageUrl?: string;
  createdAt: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  totalBookedSeats: number;
  totalRevenue: number;
  totalManagerEarnings: number;
  contractDate?: string;
  contractReference?: string;
}

// Scheduled Event (for this page)
export interface ScheduledEvent {
  id: string;
  sourceEventId: string;
  eventName: string;
  date: string;
  startTime: string;
  endTime: string;
  hall: string;
  totalSeats: number;
  bookedSeats: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  ticketPrice: number;
  description?: string;
}

// ==================== Helpers ====================
const getWeekday = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const groupEventsByWeekday = (events: ScheduledEvent[]) => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const grouped: { [weekday: string]: ScheduledEvent[] } = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  };
  events.forEach(event => {
    const weekday = getWeekday(event.date);
    if (grouped[weekday]) {
      grouped[weekday].push(event);
    }
  });
  for (const day of weekdays) {
    grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
  return { weekdays, grouped };
};

// ==================== Main Component ====================
const EventSchedule: React.FC = () => {
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ScheduledEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [hallFilter, setHallFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'weekly'>('weekly');
  
  // Data from main event registry
  const [registeredEvents, setRegisteredEvents] = useState<EventData[]>([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [currentEvent, setCurrentEvent] = useState<ScheduledEvent | null>(null);
  const [selectedSourceEventId, setSelectedSourceEventId] = useState<string>('');
  const [formData, setFormData] = useState<Partial<ScheduledEvent>>({
    eventName: '',
    date: '',
    startTime: '',
    endTime: '',
    hall: '',
    totalSeats: 0,
    bookedSeats: 0,
    status: 'scheduled',
    ticketPrice: 0,
    description: '',
  });
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<ScheduledEvent | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Load registered events from localStorage (the main event list)
  useEffect(() => {
    const storedEvents = localStorage.getItem('theater_events');
    if (storedEvents) {
      setRegisteredEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Load scheduled events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('theater_scheduled_events');
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      // Generate some initial scheduled events from registered events if available
      if (registeredEvents.length > 0) {
        const initialScheduled: ScheduledEvent[] = registeredEvents.slice(0, 5).map((ev, idx) => ({
          id: `sch-${idx}`,
          sourceEventId: ev.id,
          eventName: ev.name,
          date: new Date().toISOString().split('T')[0],
          startTime: '19:00',
          endTime: '22:00',
          hall: ev.hall,
          totalSeats: ev.seatCategories.reduce((sum, cat) => sum + cat.capacity, 0),
          bookedSeats: 0,
          status: 'scheduled',
          ticketPrice: Math.min(...ev.seatCategories.map(cat => cat.price)),
          description: ev.description || '',
        }));
        setEvents(initialScheduled);
        localStorage.setItem('theater_scheduled_events', JSON.stringify(initialScheduled));
      } else {
        setEvents([]);
      }
    }
  }, [registeredEvents]);

  // Persist scheduled events
  useEffect(() => {
    if (events.length) localStorage.setItem('theater_scheduled_events', JSON.stringify(events));
  }, [events]);

  // Filter events
  useEffect(() => {
    let filtered = [...events];
    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }
    if (hallFilter !== 'all') {
      filtered = filtered.filter(e => e.hall === hallFilter);
    }
    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, hallFilter]);

  // When a registered event is selected in the add modal, populate the form
  const handleSourceEventChange = (sourceId: string) => {
    const sourceEvent = registeredEvents.find(ev => ev.id === sourceId);
    if (sourceEvent) {
      const totalSeats = sourceEvent.seatCategories.reduce((sum, cat) => sum + cat.capacity, 0);
      const lowestPrice = Math.min(...sourceEvent.seatCategories.map(cat => cat.price));
      setFormData({
        ...formData,
        eventName: sourceEvent.name,
        hall: sourceEvent.hall,
        totalSeats: totalSeats,
        ticketPrice: lowestPrice,
        description: sourceEvent.description || '',
      });
      setSelectedSourceEventId(sourceId);
    } else {
      setSelectedSourceEventId('');
      setFormData({
        ...formData,
        eventName: '',
        hall: '',
        totalSeats: 0,
        ticketPrice: 0,
        description: '',
      });
    }
  };

  // Open add modal
  const openAddModal = () => {
    setModalMode('add');
    setSelectedSourceEventId('');
    setFormData({
      eventName: '',
      date: '',
      startTime: '',
      endTime: '',
      hall: '',
      totalSeats: 0,
      bookedSeats: 0,
      status: 'scheduled',
      ticketPrice: 0,
      description: '',
    });
    setCurrentEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event: ScheduledEvent) => {
    setModalMode('edit');
    setCurrentEvent(event);
    setSelectedSourceEventId(event.sourceEventId);
    setFormData({ ...event });
    setShowModal(true);
  };

  const openViewModal = (event: ScheduledEvent) => {
    setModalMode('view');
    setCurrentEvent(event);
    setShowModal(true);
  };

  const openDeleteConfirm = (event: ScheduledEvent) => {
    setDeletingEvent(event);
    setShowDeleteConfirm(true);
  };

  // Save schedule (add or edit)
  const handleSaveEvent = () => {
    if (modalMode === 'add') {
      if (!selectedSourceEventId) {
        alert('Please select an existing event to schedule.');
        return;
      }
      if (!formData.date || !formData.startTime || !formData.endTime) {
        alert('Please fill date and time fields.');
        return;
      }
      const sourceEvent = registeredEvents.find(ev => ev.id === selectedSourceEventId);
      if (!sourceEvent) return;
      const totalSeats = sourceEvent.seatCategories.reduce((sum, cat) => sum + cat.capacity, 0);
      const lowestPrice = Math.min(...sourceEvent.seatCategories.map(cat => cat.price));
      const newId = `sch-${Date.now()}`;
      const newEvent: ScheduledEvent = {
        id: newId,
        sourceEventId: selectedSourceEventId,
        eventName: sourceEvent.name,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        hall: sourceEvent.hall,
        totalSeats: totalSeats,
        bookedSeats: formData.bookedSeats || 0,
        status: formData.status as ScheduledEvent['status'],
        ticketPrice: lowestPrice,
        description: formData.description || sourceEvent.description,
      };
      setEvents(prev => [...prev, newEvent]);
      setSuccessMessage(`Schedule for "${sourceEvent.name}" created.`);
    } else if (modalMode === 'edit' && currentEvent) {
      // Only allow editing date, time, booked seats, status, description
      const updatedEvent: ScheduledEvent = {
        ...currentEvent,
        date: formData.date || currentEvent.date,
        startTime: formData.startTime || currentEvent.startTime,
        endTime: formData.endTime || currentEvent.endTime,
        bookedSeats: formData.bookedSeats ?? currentEvent.bookedSeats,
        status: formData.status as ScheduledEvent['status'] || currentEvent.status,
        description: formData.description || currentEvent.description,
      };
      setEvents(prev => prev.map(e => e.id === currentEvent.id ? updatedEvent : e));
      setSuccessMessage(`Schedule for "${updatedEvent.eventName}" updated.`);
    }
    setShowModal(false);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleDeleteEvent = () => {
    if (!deletingEvent) return;
    setEvents(prev => prev.filter(e => e.id !== deletingEvent.id));
    setShowDeleteConfirm(false);
    setDeletingEvent(null);
    setSuccessMessage(`Schedule for "${deletingEvent.eventName}" deleted.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event-schedule.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('Reset all scheduled events? This will remove all custom schedules and generate new ones from registered events.')) {
      if (registeredEvents.length > 0) {
        const initialScheduled: ScheduledEvent[] = registeredEvents.slice(0, 5).map((ev, idx) => ({
          id: `sch-${idx}`,
          sourceEventId: ev.id,
          eventName: ev.name,
          date: new Date().toISOString().split('T')[0],
          startTime: '19:00',
          endTime: '22:00',
          hall: ev.hall,
          totalSeats: ev.seatCategories.reduce((sum, cat) => sum + cat.capacity, 0),
          bookedSeats: 0,
          status: 'scheduled',
          ticketPrice: Math.min(...ev.seatCategories.map(cat => cat.price)),
          description: ev.description || '',
        }));
        setEvents(initialScheduled);
        localStorage.setItem('theater_scheduled_events', JSON.stringify(initialScheduled));
      } else {
        setEvents([]);
        localStorage.setItem('theater_scheduled_events', JSON.stringify([]));
      }
      setSuccessMessage('Schedules reset.');
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const getStatusBadge = (status: ScheduledEvent['status']) => {
    const variants = {
      scheduled: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return variants[status];
  };

  // List view columns
  const columns = [
    { Header: 'Event', accessor: 'eventName', sortable: true },
    { Header: 'Date', accessor: 'date', sortable: true },
    { Header: 'Time', accessor: 'startTime', sortable: true, Cell: (row: ScheduledEvent) => <span>{row.startTime} - {row.endTime}</span> },
    { Header: 'Hall', accessor: 'hall', sortable: true },
    { Header: 'Seats', accessor: 'totalSeats', sortable: true, Cell: (row: ScheduledEvent) => <span>{row.bookedSeats}/{row.totalSeats}</span> },
    { Header: 'Price', accessor: 'ticketPrice', sortable: true, Cell: (row: ScheduledEvent) => <span>${row.ticketPrice}</span> },
    { 
      Header: 'Status', 
      accessor: 'status', 
      sortable: true,
      Cell: (row: ScheduledEvent) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      sortable: false,
      Cell: (row: ScheduledEvent) => (
        <div className="flex gap-2">
          <button onClick={() => openViewModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye size={16} /></button>
          <button onClick={() => openEditModal(row)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Edit"><Edit size={16} /></button>
          <button onClick={() => openDeleteConfirm(row)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} /></button>
        </div>
      )
    },
  ];

  const totalEvents = filteredEvents.length;
  const totalTicketsSold = filteredEvents.reduce((sum, e) => sum + e.bookedSeats, 0);
  const totalRevenue = filteredEvents.reduce((sum, e) => sum + (e.bookedSeats * e.ticketPrice), 0);

  const { weekdays, grouped } = groupEventsByWeekday(filteredEvents);
  const availableHalls = Array.from(new Set(events.map(e => e.hall)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Event Schedule</h1>
          <p className="text-gray-600 mt-1">Schedule showtimes from your registered events</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border overflow-hidden">
            <button onClick={() => setViewMode('weekly')} className={`px-3 py-2 flex items-center gap-1 ${viewMode === 'weekly' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'}`}><Calendar size={16} /> Weekly</button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2 flex items-center gap-1 ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'}`}><List size={16} /> List</button>
          </div>
          <ReusableButton variant="primary" onClick={openAddModal} icon={<Plus size={16} />}>Schedule Event</ReusableButton>
          <ReusableButton variant="outline" onClick={handleReset} icon={<RefreshCw size={16} />}>Reset</ReusableButton>
          <ReusableButton variant="outline" onClick={handleExport} icon={<Download size={16} />}>Export</ReusableButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3"><Calendar className="h-8 w-8 text-blue-500" /><div><p className="text-sm text-gray-500">Total Schedules</p><p className="text-2xl font-bold">{totalEvents}</p></div></div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3"><Ticket className="h-8 w-8 text-green-500" /><div><p className="text-sm text-gray-500">Tickets Sold</p><p className="text-2xl font-bold">{totalTicketsSold.toLocaleString()}</p></div></div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3"><DollarSign className="h-8 w-8 text-purple-500" /><div><p className="text-sm text-gray-500">Revenue</p><p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p></div></div>
      </div>

      {/* Filters (list view only) */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /><input type="text" placeholder="Search by event name..." className="w-full pl-10 pr-4 py-2 border rounded-xl" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <select className="px-4 py-2 border rounded-xl bg-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}><option value="all">All Status</option><option value="scheduled">Scheduled</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
            <select className="px-4 py-2 border rounded-xl bg-white" value={hallFilter} onChange={e => setHallFilter(e.target.value)}><option value="all">All Halls</option>{availableHalls.map(hall => <option key={hall} value={hall}>{hall}</option>)}</select>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'list' ? (
        <ReusableTable columns={columns} data={filteredEvents} title="Scheduled Shows" icon={Calendar} showSearch={false} showExport={false} showPrint={false} itemsPerPage={1000} itemsPerPageOptions={[1000]} onExport={() => {}} onPrint={() => {}} />
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-teal-700 to-blue-900 text-white">
                  <th className="p-3 border text-center w-32">Day</th>
                  {weekdays.map(day => (
                    <th key={day} className="p-3 border text-center">
                      {day}<br />
                      <span className="text-sm font-normal">{grouped[day].length} event{grouped[day].length !== 1 ? 's' : ''}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border bg-gray-100 font-medium text-center align-top">Events</td>
                  {weekdays.map(day => (
                    <td key={day} className="p-2 border align-top">
                      {grouped[day].length > 0 ? (
                        <div className="space-y-3">
                          {grouped[day].map(event => (
                            <div key={event.id} className="bg-blue-50 rounded-lg p-2 shadow-sm">
                              <div className="font-semibold text-blue-800">{event.eventName}</div>
                              <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                <Clock size={12} /> {event.startTime} - {event.endTime}
                              </div>
                              <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                <MapPin size={12} /> {event.hall}
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(event.status)}`}>
                                  {event.status}
                                </span>
                                <div className="flex gap-1">
                                  <button onClick={() => openViewModal(event)} className="text-blue-600 hover:text-blue-800" title="View"><Eye size={14} /></button>
                                  <button onClick={() => openEditModal(event)} className="text-green-600 hover:text-green-800" title="Edit"><Edit size={14} /></button>
                                  <button onClick={() => openDeleteConfirm(event)} className="text-red-600 hover:text-red-800" title="Delete"><Trash2 size={14} /></button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-300 text-center py-4">No events</div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 text-sm text-gray-500 border-t">Scheduled shows based on registered events.</div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`p-4 rounded-t-2xl flex justify-between items-center ${modalMode === 'view' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-green-600 to-emerald-600'} text-white`}>
              <h2 className="text-xl font-bold">{modalMode === 'add' && 'Schedule New Showtime'}{modalMode === 'edit' && 'Edit Schedule'}{modalMode === 'view' && 'Schedule Details'}</h2>
              <button onClick={() => setShowModal(false)} className="hover:opacity-80"><X /></button>
            </div>
            <div className="p-6">
              {modalMode === 'view' && currentEvent ? (
                <div className="space-y-4">
                  <div><strong>Event Name:</strong> {currentEvent.eventName}</div>
                  <div><strong>Date:</strong> {currentEvent.date}</div>
                  <div><strong>Time:</strong> {currentEvent.startTime} - {currentEvent.endTime}</div>
                  <div><strong>Hall:</strong> {currentEvent.hall}</div>
                  <div><strong>Total Seats:</strong> {currentEvent.totalSeats.toLocaleString()}</div>
                  <div><strong>Booked Seats:</strong> {currentEvent.bookedSeats.toLocaleString()}</div>
                  <div><strong>Ticket Price:</strong> ${currentEvent.ticketPrice}</div>
                  <div><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(currentEvent.status)}`}>{currentEvent.status}</span></div>
                  <div><strong>Description:</strong> {currentEvent.description || 'No description'}</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {modalMode === 'add' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Select Event *</label>
                      <select className="w-full p-2 border rounded-lg" value={selectedSourceEventId} onChange={e => handleSourceEventChange(e.target.value)}>
                        <option value="">-- Choose an event --</option>
                        {registeredEvents.map(ev => <option key={ev.id} value={ev.id}>{ev.name} ({ev.hall})</option>)}
                      </select>
                    </div>
                  )}
                  <div><label className="block text-sm font-medium mb-1">Event Name</label><input type="text" className="w-full p-2 border rounded-lg bg-gray-100" value={formData.eventName} readOnly disabled /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" className="w-full p-2 border rounded-lg" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">Hall</label><input type="text" className="w-full p-2 border rounded-lg bg-gray-100" value={formData.hall} readOnly disabled /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Start Time *</label><input type="time" className="w-full p-2 border rounded-lg" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} /></div>
                    <div><label className="block text-sm font-medium mb-1">End Time *</label><input type="time" className="w-full p-2 border rounded-lg" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Total Seats</label><input type="number" className="w-full p-2 border rounded-lg bg-gray-100" value={formData.totalSeats} readOnly disabled /></div>
                    <div><label className="block text-sm font-medium mb-1">Ticket Price ($)</label><input type="number" className="w-full p-2 border rounded-lg bg-gray-100" value={formData.ticketPrice} readOnly disabled /></div>
                  </div>
                  <div><label className="block text-sm font-medium mb-1">Booked Seats (optional)</label><input type="number" className="w-full p-2 border rounded-lg" value={formData.bookedSeats} onChange={e => setFormData({...formData, bookedSeats: parseInt(e.target.value) || 0})} /></div>
                  <div><label className="block text-sm font-medium mb-1">Status</label><select className="w-full p-2 border rounded-lg" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ScheduledEvent['status']})}><option value="scheduled">Scheduled</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
                  <div><label className="block text-sm font-medium mb-1">Description</label><textarea rows={3} className="w-full p-2 border rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                  <div className="flex gap-3 pt-4"><ReusableButton variant="outline" onClick={() => setShowModal(false)}>Cancel</ReusableButton><ReusableButton variant="primary" onClick={handleSaveEvent}>{modalMode === 'add' ? 'Schedule Showtime' : 'Save Changes'}</ReusableButton></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteConfirm && deletingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Delete Schedule</h2>
            <p>Are you sure you want to delete the schedule for <strong>{deletingEvent.eventName}</strong> on {deletingEvent.date}?</p>
            <div className="flex gap-3 mt-6"><ReusableButton variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</ReusableButton><ReusableButton variant="danger" onClick={handleDeleteEvent}>Delete</ReusableButton></div>
          </div>
        </div>
      )}

      <SuccessPopup isOpen={showSuccessPopup} message={successMessage} onClose={() => setShowSuccessPopup(false)} duration={3000} />
    </div>
  );
};

export default EventSchedule;