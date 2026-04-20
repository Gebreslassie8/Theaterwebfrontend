// src/pages/Manager/components/events/EventsSchedule.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, DollarSign, Eye, Edit, Trash2, Ban, Plus, Search, Ticket, CheckCircle, XCircle, Activity, Clock, MoreVertical, X } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  description: string;
  category: string;
  date: string;
  time: string;
  endTime: string;
  hall: string;
  totalSeats: number;
  bookedSeats: number;
  price: number;
  revenue: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string;
}

const EventsSchedule: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Mock data
    const mockEvents: Event[] = [
      {
        id: 1,
        name: "Summer Music Festival",
        description: "An amazing summer music festival featuring top artists from around the world.",
        category: "Concert",
        date: "2024-07-15",
        time: "19:00",
        endTime: "23:00",
        hall: "Grand Hall",
        totalSeats: 1500,
        bookedSeats: 1245,
        price: 150,
        revenue: 186750,
        status: 'upcoming',
        organizer: "Events Management Co."
      },
      {
        id: 2,
        name: "Comedy Night",
        description: "A hilarious night of stand-up comedy featuring the best comedians.",
        category: "Comedy",
        date: "2024-07-18",
        time: "20:00",
        endTime: "22:30",
        hall: "Blue Hall",
        totalSeats: 800,
        bookedSeats: 678,
        price: 75,
        revenue: 50850,
        status: 'upcoming',
        organizer: "Comedy Club International"
      },
      {
        id: 3,
        name: "Movie Premiere: The Epic",
        description: "Exclusive premiere of the most anticipated movie of the year.",
        category: "Movie",
        date: "2024-07-20",
        time: "18:30",
        endTime: "21:00",
        hall: "Red Hall",
        totalSeats: 500,
        bookedSeats: 489,
        price: 120,
        revenue: 58680,
        status: 'ongoing',
        organizer: "Premier Pictures"
      },
      {
        id: 4,
        name: "Traditional Theater Play",
        description: "A beautiful traditional theater performance.",
        category: "Theater",
        date: "2024-07-22",
        time: "19:00",
        endTime: "21:30",
        hall: "Grand Hall",
        totalSeats: 1200,
        bookedSeats: 892,
        price: 90,
        revenue: 80280,
        status: 'upcoming',
        organizer: "Cultural Arts Center"
      }
    ];
    setEvents(mockEvents);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'upcoming': return <Clock className="h-3 w-3" />;
      case 'ongoing': return <Activity className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      setShowDeleteModal(false);
      setSuccessMessage(`✓ Event "${selectedEvent.name}" deleted successfully!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleCancelEvent = () => {
    if (selectedEvent) {
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, status: 'cancelled' } : e));
      setShowCancelModal(false);
      setSuccessMessage(`⚠️ Event "${selectedEvent.name}" has been cancelled!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredEvents.reduce((sum, e) => sum + e.revenue, 0);
  const totalTickets = filteredEvents.reduce((sum, e) => sum + e.bookedSeats, 0);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Events Schedule
        </h1>
        <p className="text-gray-600 mt-2">Manage all your theater events and performances</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 opacity-90" />
            <span className="text-2xl font-bold">{filteredEvents.length}</span>
          </div>
          <p className="text-sm opacity-90">Total Events</p>
          <p className="text-lg font-bold mt-2">{filteredEvents.length}</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Ticket className="h-8 w-8 opacity-90" />
            <span className="text-2xl font-bold">{totalTickets.toLocaleString()}</span>
          </div>
          <p className="text-sm opacity-90">Tickets Sold</p>
          <p className="text-lg font-bold mt-2">{totalTickets.toLocaleString()}</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 opacity-90" />
            <span className="text-2xl font-bold">${totalRevenue.toLocaleString()}</span>
          </div>
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-lg font-bold mt-2">${totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 opacity-90" />
            <span className="text-2xl font-bold">78%</span>
          </div>
          <p className="text-sm opacity-90">Avg Occupancy</p>
          <p className="text-lg font-bold mt-2">78%</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events by name..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">Event Name</th>
                <th className="text-left p-4 font-semibold text-gray-700">Date & Time</th>
                <th className="text-left p-4 font-semibold text-gray-700">Hall</th>
                <th className="text-left p-4 font-semibold text-gray-700">Tickets</th>
                <th className="text-left p-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-gray-800">{event.name}</p>
                      <p className="text-xs text-gray-500">{event.category}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-800">{event.date}</p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </td>
                  <td className="p-4 text-gray-600">{event.hall}</td>
                  <td className="p-4">
                    <p className="text-gray-800">{event.bookedSeats.toLocaleString()} / {event.totalSeats.toLocaleString()}</p>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${(event.bookedSeats / event.totalSeats) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-green-600">${event.revenue.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setSelectedEvent(event); setShowDetailsModal(true); }} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Edit Event"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => { setSelectedEvent(event); setShowCancelModal(true); }} 
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="Cancel Event"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => { setSelectedEvent(event); setShowDeleteModal(true); }} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full animate-fadeInUp">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Event Details</h2>
                <button onClick={() => setShowDetailsModal(false)} className="hover:opacity-80">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Event Name</p>
                <p className="font-semibold text-gray-800">{selectedEvent.name}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="font-semibold text-gray-800">{selectedEvent.date} at {selectedEvent.time}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Venue</p>
                <p className="font-semibold text-gray-800">{selectedEvent.hall}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Ticket Sales</p>
                <p className="font-semibold text-gray-800">{selectedEvent.bookedSeats} / {selectedEvent.totalSeats} seats</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="font-semibold text-green-600">${selectedEvent.revenue.toLocaleString()}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                  {getStatusIcon(selectedEvent.status)}
                  {selectedEvent.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-600 mt-1">{selectedEvent.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full animate-shake">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Delete Event</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-800 mb-2">
                Are you sure you want to delete "<span className="font-bold">{selectedEvent.name}</span>"?
              </p>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold">
                  Cancel
                </button>
                <button onClick={handleDeleteEvent} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Cancel Event</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-800 mb-2">
                Are you sure you want to cancel "<span className="font-bold">{selectedEvent.name}</span>"?
              </p>
              <p className="text-sm text-gray-500">This will cancel all bookings for this event.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold">
                  Keep Event
                </button>
                <button onClick={handleCancelEvent} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold">
                  Cancel Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed bottom-8 right-8 z-50 animate-slideInRight">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl p-4 max-w-md">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8" />
              <div>
                <p className="font-bold text-lg">Success!</p>
                <p className="text-sm opacity-90">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
        .animate-shake { animation: shake 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default EventsSchedule;