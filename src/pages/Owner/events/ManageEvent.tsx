// src/pages/Owner/events/ManageEvent.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Search, LayoutGrid, Clock, Activity, CheckCircle, XCircle, MapPin, Film, Eye, Edit, Ban, RefreshCw, Trash2 } from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import CreateEventForm from '../../../components/EventForm/CreateEventForm';
import UpdateEventForm from '../../../components/EventForm/UpdateEventForm';
import { DeleteConfirmModal } from '../../../components/EventForm/DeleteConfirmModal';
import { ViewEventModal } from '../../../components/EventForm/ViewEventModals';
import { EventData, halls, generateId, categories } from '../../../components/EventForm/types';

// Mock Data
const mockEvents: EventData[] = [
  { id: '1', name: 'Summer Music Festival', description: 'Amazing music festival', timeSlots: [{ id: 'ts1', date: '2025-06-15', startTime: '18:00', endTime: '23:00' }], hall: 'Grand Hall', seatCategories: [{ id: 'sc1', name: 'VIP', price: 150, capacity: 200, commissionPercent: 10 }, { id: 'sc2', name: 'Regular', price: 50, capacity: 1000, commissionPercent: 10 }], category: 'concert', ageRestriction: 'All Ages', contactEmail: 'info@example.com', contactPhone: '+251 911 234 567', website: '', organizer: 'Event Org', createdAt: new Date().toISOString(), status: 'upcoming', totalBookedSeats: 0, totalRevenue: 0 },
  { id: '2', name: 'Jazz Night', description: 'Smooth jazz evening', timeSlots: [{ id: 'ts2', date: '2025-07-20', startTime: '19:00', endTime: '22:00' }], hall: 'Blue Hall', seatCategories: [{ id: 'sc3', name: 'VIP', price: 100, capacity: 100, commissionPercent: 10 }, { id: 'sc4', name: 'Regular', price: 40, capacity: 600, commissionPercent: 10 }], category: 'concert', ageRestriction: 'All Ages', contactEmail: 'jazz@example.com', contactPhone: '+251 912 345 678', website: '', organizer: 'Jazz Club', createdAt: new Date().toISOString(), status: 'upcoming', totalBookedSeats: 0, totalRevenue: 0 },
  { id: '3', name: 'Rock Concert', description: 'High energy rock concert', timeSlots: [{ id: 'ts3', date: '2025-08-10', startTime: '20:00', endTime: '23:30' }], hall: 'Grand Hall', seatCategories: [{ id: 'sc5', name: 'VIP', price: 200, capacity: 150, commissionPercent: 10 }, { id: 'sc6', name: 'Regular', price: 80, capacity: 800, commissionPercent: 10 }], category: 'concert', ageRestriction: '16+', contactEmail: 'rock@example.com', contactPhone: '+251 913 456 789', website: '', organizer: 'Rock Events', createdAt: new Date().toISOString(), status: 'cancelled', totalBookedSeats: 0, totalRevenue: 0 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const ManageEvent: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Separate states for different actions
  const [selectedEventForView, setSelectedEventForView] = useState<EventData | null>(null);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<EventData | null>(null);
  const [selectedEventForDelete, setSelectedEventForDelete] = useState<EventData | null>(null);
  const [selectedEventForReactivate, setSelectedEventForReactivate] = useState<EventData | null>(null);
  const [eventToCancel, setEventToCancel] = useState<EventData | null>(null);
  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showReasonModal, setShowReasonModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theater_events');
    if (saved) setEvents(JSON.parse(saved));
    else setEvents(mockEvents);
  }, []);

  useEffect(() => {
    if (events.length) localStorage.setItem('theater_events', JSON.stringify(events));
  }, [events]);

  const filteredEvents = events.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: events.length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
    cancelled: events.filter(e => e.status === 'cancelled').length,
  };

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setShowCancelModal(false);
    setShowReasonModal(false);
    setSelectedEventForView(null);
    setSelectedEventForEdit(null);
    setSelectedEventForDelete(null);
    setSelectedEventForReactivate(null);
    setEventToCancel(null);
    setCancelReason('');
  };

  const handleCreateEvent = (formData: any, image: string | null) => {
    const selectedHall = halls.find(h => h.id === formData.hall);
    const newEvent: EventData = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      timeSlots: formData.timeSlots,
      hall: selectedHall?.name || formData.hall,
      seatCategories: formData.seatCategories.map((cat: any) => ({ ...cat, booked: 0 })),
      category: formData.category,
      ageRestriction: formData.ageRestriction,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      website: formData.website,
      organizer: formData.organizer,
      imageUrl: image || undefined,
      createdAt: new Date().toISOString(),
      status: 'ongoing',
      totalBookedSeats: 0,
      totalRevenue: 0,
      contractDate: formData.contractDate,
      contractReference: formData.contractReference
    };
    setEvents([newEvent, ...events]);
    closeAllModals();
    setSuccessMessage(`✨ Event "${newEvent.name}" created successfully!`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleUpdateEvent = (formData: any) => {
    if (!selectedEventForEdit) return;
    const selectedHall = halls.find(h => h.id === formData.hall);
    const updated = events.map(e => e.id === selectedEventForEdit.id ? {
      ...e,
      name: formData.name,
      description: formData.description,
      timeSlots: formData.timeSlots,
      hall: selectedHall?.name || formData.hall,
      seatCategories: formData.seatCategories,
      category: formData.category,
      ageRestriction: formData.ageRestriction,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      website: formData.website,
      organizer: formData.organizer,
      contractDate: formData.contractDate,
      contractReference: formData.contractReference
    } : e);
    setEvents(updated);
    closeAllModals();
    setSuccessMessage(`✏️ Event "${formData.name}" updated successfully!`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleDeleteEvent = () => {
    if (selectedEventForDelete) {
      setEvents(events.filter(e => e.id !== selectedEventForDelete.id));
      closeAllModals();
      setSuccessMessage(`🗑️ Event "${selectedEventForDelete.name}" deleted successfully!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleCancelWithReason = () => {
    if (eventToCancel) {
      setEvents(events.map(e => e.id === eventToCancel.id ? { ...e, status: 'cancelled' } : e));
      closeAllModals();
      setSuccessMessage(`⚠️ Event "${eventToCancel.name}" has been cancelled. Reason: ${cancelReason}`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleReactivateEvent = () => {
    if (selectedEventForReactivate) {
      setEvents(events.map(e => e.id === selectedEventForReactivate.id ? { ...e, status: 'upcoming' } : e));
      closeAllModals();
      setSuccessMessage(`✅ Event "${selectedEventForReactivate.name}" has been reactivated!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  // Separate handlers for each action
  const openViewModal = (event: EventData) => {
    setSelectedEventForView(event);
    setShowViewModal(true);
  };

  const openEditModal = (event: EventData) => {
    setSelectedEventForEdit(event);
    setShowUpdateModal(true);
  };

  const openCancelModal = (event: EventData) => {
    setEventToCancel(event);
    setCancelReason('');
    setShowReasonModal(true);
  };

  const openReactivateModal = (event: EventData) => {
    setSelectedEventForReactivate(event);
    setShowCancelModal(true);
  };

  const openDeleteModal = (event: EventData) => {
    setSelectedEventForDelete(event);
    setShowDeleteModal(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'ongoing': return <Activity className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const columns = [
    { Header: 'Event Name', accessor: 'name', Cell: (row: EventData) => (<div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center"><Film className="h-5 w-5 text-white" />
    </div><div><p className="font-medium">{row.name}</p><p className="text-xs text-gray-500">{row.hall}</p></div></div>) },
    { Header: 'Date & Time', accessor: 'timeSlots', Cell: (row: EventData) => (<div>{row.timeSlots[0]?.date}<br/><span className="text-xs text-gray-500">{row.timeSlots[0]?.startTime} - {row.timeSlots[0]?.endTime}</span></div>) },
    { Header: 'Hall', accessor: 'hall', Cell: (row: EventData) => (<div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><span>{row.hall}</span></div>) },
    { Header: 'Revenue', accessor: 'totalRevenue', Cell: (row: EventData) => <span className="text-green-600 font-semibold">ETB {row.totalRevenue.toLocaleString()}</span> },
    { Header: 'Status', accessor: 'status', Cell: (row: EventData) => (<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>{getStatusIcon(row.status)} {row.status}</span>) }
  ];

  const Actions = (row: EventData) => (
    <div className="flex gap-2">
      <button onClick={() => openViewModal(row)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition" title="View Details">
        <Eye className="h-4 w-4 text-blue-600" />
      </button>
      <button onClick={() => openEditModal(row)} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition" title="Edit Event">
        <Edit className="h-4 w-4 text-teal-600" />
      </button>
      {row.status === 'cancelled' ? (
        <button onClick={() => openReactivateModal(row)} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition" title="Reactivate Event">
          <RefreshCw className="h-4 w-4 text-green-600" />
        </button>
      ) : row.status !== 'completed' && (
        <button onClick={() => openCancelModal(row)} className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition" title="Cancel Event">
          <Ban className="h-4 w-4 text-orange-600" />
        </button>
      )}
      <button onClick={() => openDeleteModal(row)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition" title="Delete Event">
        <Trash2 className="h-4 w-4 text-red-600" />
      </button>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <div><p className="text-sm text-gray-500 mb-1">{title}</p><p className="text-2xl font-bold">{value}</p></div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}><Icon className="h-6 w-6 text-white" /></div>
      </div>
    </motion.div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
              <p className="text-sm text-gray-500">Create, manage and track all events</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Events" value={stats.total} icon={Calendar} color="from-teal-500 to-teal-600" />
          <StatCard title="Ongoing" value={stats.ongoing} icon={Activity} color="from-green-500 to-emerald-600" />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="from-purple-500 to-pink-600" />
          <StatCard title="Cancelled" value={stats.cancelled} icon={XCircle} color="from-red-500 to-rose-600" />
        </div>

        {/* Search, Filter, and Create Event in same row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <ReusableButton
            onClick={() => setShowCreateModal(true)}
            icon={Plus}
            label="Create Event"
            className="bg-teal-600 hover:bg-teal-700 text-white"
          />
        </div>

        {/* Events Table */}
        <ReusableTable 
          columns={[...columns, { Header: 'Actions', accessor: 'actions', Cell: Actions, width: '200px' }]} 
          data={filteredEvents} 
          icon={LayoutGrid} 
          showSearch={false} 
          showExport={false} 
          itemsPerPage={10} 
        />

        {/* Modals - Each with its own selected event */}
        {showCreateModal && <CreateEventForm onSubmit={handleCreateEvent} onCancel={() => closeAllModals()} />}
        
        {showUpdateModal && selectedEventForEdit && (
          <UpdateEventForm 
            event={selectedEventForEdit} 
            onSubmit={handleUpdateEvent} 
            onCancel={() => closeAllModals()} 
          />
        )}
        
        {showViewModal && selectedEventForView && (
          <ViewEventModal 
            event={selectedEventForView} 
            isOpen={showViewModal} 
            onClose={() => closeAllModals()} 
          />
        )}
        
        {/* Delete Modal */}
        <DeleteConfirmModal
          employee={selectedEventForDelete ? { id: selectedEventForDelete.id, name: selectedEventForDelete.name } : null}
          onConfirm={handleDeleteEvent}
          onCancel={() => closeAllModals()}
        />

        {/* Cancel with Reason Modal */}
        {showReasonModal && eventToCancel && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Ban className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Cancel Event</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel <strong>{eventToCancel.name}</strong>?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation *</label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this event..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => closeAllModals()} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button 
                  onClick={handleCancelWithReason} 
                  disabled={!cancelReason.trim()} 
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reactivate/Restore Modal */}
        {showCancelModal && selectedEventForReactivate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Reactivate Event</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reactivate <strong>{selectedEventForReactivate.name}</strong>?
              </p>
              <div className="flex gap-3">
                <button onClick={() => closeAllModals()} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleReactivateEvent} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Reactivate Event
                </button>
              </div>
            </div>
          </div>
        )}

        <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type="success" title="Success" message={successMessage} duration={3000} position="top-right" />
      </div>
    </motion.div>
  );
};

export default ManageEvent;