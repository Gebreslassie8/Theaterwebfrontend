// src/pages/Owner/events/EventModals.tsx
import React from 'react';
import { 
  X, Trash2, Ban, RefreshCw, Clock, Activity, CheckCircle, XCircle, 
  Calendar, MapPin, User, Mail, Phone, Globe, FileText, Tag, Award,
  Image as ImageIcon, Wallet 
} from 'lucide-react';
import ReusableButton from '../Reusable/ReusableButton';
import { EventData } from './types';

interface ViewEventModalProps {
  event: EventData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewEventModal: React.FC<ViewEventModalProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'upcoming': return { icon: Clock, color: 'bg-blue-100 text-blue-700', label: 'Upcoming' };
      case 'ongoing': return { icon: Activity, color: 'bg-green-100 text-green-700', label: 'Ongoing' };
      case 'completed': return { icon: CheckCircle, color: 'bg-gray-100 text-gray-700', label: 'Completed' };
      case 'cancelled': return { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Cancelled' };
      default: return { icon: Calendar, color: 'bg-gray-100 text-gray-700', label: status };
    }
  };

  const statusConfig = getStatusConfig(event.status);
  const StatusIcon = statusConfig.icon;

  // Stop propagation to prevent closing when clicking inside modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={handleModalClick}>
        {/* Header */}
         <div className="bg-deepTeal px-6 py-5 shrink-0">         
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl text-white font-bold">{event.name}</h2>
                <p className="text-white/80 text-sm mt-1">Event ID: {event.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Current Status:</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.color}`}>
                <StatusIcon className="h-4 w-4" />
                {statusConfig.label}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Created: {new Date(event.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Event Name</p>
                <p className="font-semibold text-gray-800">{event.name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Organizer</p>
                <p className="font-semibold text-gray-800">{event.organizer}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Venue / Hall</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="font-semibold text-gray-800">{event.hall}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <p className="font-semibold text-gray-800 capitalize">{event.category}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Age Restriction</p>
                <p className="font-semibold text-gray-800">{event.ageRestriction || 'All Ages'}</p>
              </div>
              {event.contractReference && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Contract Reference</p>
                  <p className="font-semibold text-gray-800">{event.contractReference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-teal-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Contact Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="font-semibold text-gray-800">{event.contactEmail || '—'}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Contact Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="font-semibold text-gray-800">{event.contactPhone || '—'}</p>
                </div>
              </div>
              {event.website && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Website</p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <p className="font-semibold text-gray-800">{event.website}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              Event Schedule
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left text-gray-600">#</th>
                    <th className="p-3 text-left text-gray-600">Date</th>
                    <th className="p-3 text-left text-gray-600">Start Time</th>
                    <th className="p-3 text-left text-gray-600">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {event.timeSlots.map((slot, idx) => (
                    <tr key={slot.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-3 text-gray-600">{idx + 1}</td>
                      <td className="p-3 font-medium">{new Date(slot.date).toLocaleDateString()}</td>
                      <td className="p-3">{slot.startTime}</td>
                      <td className="p-3">{slot.endTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Seat Types & Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-teal-600" />
              Seat Types & Pricing
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left text-gray-600">Seat Type</th>
                    <th className="p-3 text-left text-gray-600">Price (ETB)</th>
                    <th className="p-3 text-left text-gray-600">Capacity</th>
                    <th className="p-3 text-left text-gray-600">Commission</th>
                    <th className="p-3 text-left text-gray-600">Booked</th>
                    <th className="p-3 text-left text-gray-600">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {event.seatCategories?.map(cat => (
                    <tr key={cat.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-medium">{cat.name}</td>
                      <td className="p-3 text-green-600 font-semibold">ETB {cat.price.toLocaleString()}</td>
                      <td className="p-3">{cat.capacity.toLocaleString()}</td>
                      <td className="p-3">{cat.commissionPercent}%</td>
                      <td className="p-3">{cat.booked?.toLocaleString() || 0}</td>
                      <td className="p-3">{(cat.capacity - (cat.booked || 0)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-green-600" />
              Financial Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Booked Seats</p>
                <p className="text-2xl font-bold text-gray-800">{event.totalBookedSeats?.toLocaleString() || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">ETB {event.totalRevenue?.toLocaleString() || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-800">{event.seatCategories?.reduce((sum, cat) => sum + cat.capacity, 0).toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600" />
                Description
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>
          )}

          {/* Event Image */}
          {event.imageUrl && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-teal-600" />
                Event Poster
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                <img src={event.imageUrl} alt={event.name} className="max-h-64 rounded-lg shadow-md object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <ReusableButton onClick={onClose} variant="secondary">
            Close
          </ReusableButton>
        </div>
      </div>
    </div>
  );
};

// Delete Event Modal
interface DeleteEventModalProps {
  event: EventData | null;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ event, isOpen, onConfirm, onClose }) => {
  if (!isOpen || !event) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={handleModalClick}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Delete Event</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Delete "<strong>{event.name}</strong>"? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <ReusableButton onClick={onClose} variant="secondary">Cancel</ReusableButton>
          <ReusableButton onClick={onConfirm} variant="danger">Delete</ReusableButton>
        </div>
      </div>
    </div>
  );
};

// Cancel/Restore Event Modal
interface CancelEventModalProps {
  event: EventData | null;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const CancelEventModal: React.FC<CancelEventModalProps> = ({ event, isOpen, onConfirm, onClose }) => {
  if (!isOpen || !event) return null;
  const isRestore = event.status === 'cancelled';

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={handleModalClick}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isRestore ? 'bg-green-100' : 'bg-orange-100'}`}>
            {isRestore ? <RefreshCw className="h-6 w-6 text-green-600" /> : <Ban className="h-6 w-6 text-orange-600" />}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{isRestore ? 'Restore Event' : 'Cancel Event'}</h3>
        </div>
        <p className="text-gray-600 mb-6">
          {isRestore ? `Restore "${event.name}" to upcoming?` : `Cancel "${event.name}"?`}
        </p>
        <div className="flex gap-3">
          <ReusableButton onClick={onClose} variant="secondary">Cancel</ReusableButton>
          <ReusableButton onClick={onConfirm} variant={isRestore ? 'success' : 'warning'}>{isRestore ? 'Restore' : 'Cancel'}</ReusableButton>
        </div>
      </div>
    </div>
  );
};