// src/pages/Owner/events/EventModals.tsx
import React from "react";
import {
  X,
  Trash2,
  Ban,
  RefreshCw,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  Tag,
  Award,
  Image as ImageIcon,
  Wallet,
  Film,
  Theater,
  Users,
  Building,
} from "lucide-react";
import { EventData } from "../../components/EventForm/types";

interface ViewEventModalProps {
  event: EventData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewEventModal: React.FC<ViewEventModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !event) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "coming-soon":
        return {
          icon: Clock,
          color: "bg-blue-100 text-blue-700",
          label: "Coming Soon",
        };
      case "now-showing":
        return {
          icon: Activity,
          color: "bg-green-100 text-green-700",
          label: "Now Showing",
        };
      case "ended":
        return {
          icon: CheckCircle,
          color: "bg-gray-100 text-gray-700",
          label: "Ended",
        };
      case "cancelled":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-700",
          label: "Cancelled",
        };
      default:
        return {
          icon: Calendar,
          color: "bg-gray-100 text-gray-700",
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(event.status);
  const StatusIcon = statusConfig.icon;

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Get schedules from event (supports both timeSlots and schedules property)
  const schedules = (event as any).schedules || event.timeSlots || [];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {event.poster_url ? (
                  <img
                    src={event.poster_url}
                    alt={event.title}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <Film className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl text-white font-bold">{event.title}</h2>
                <p className="text-white/80 text-sm mt-1">
                  Event ID: {event.id?.slice(0, 8)}...
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge and Stats */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Current Status:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.color}`}
              >
                <StatusIcon className="h-4 w-4" />
                {statusConfig.label}
              </span>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-gray-500">
                <span className="font-semibold text-gray-700">
                  ⭐ {event.rating || 0}
                </span>{" "}
                ({event.review_count || 0} reviews)
              </div>
              <div className="text-gray-500">
                👁️ {(event.view_count || 0).toLocaleString()} views
              </div>
              <div className="text-gray-400">
                Created: {formatDate(event.created_at)}
              </div>
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
                <p className="text-xs text-gray-500 mb-1">Event Title</p>
                <p className="font-semibold text-gray-800">{event.title}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Genre</p>
                <p className="font-semibold text-gray-800">
                  {event.genre || "—"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {event.category || "—"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="font-semibold text-gray-800">
                  {event.duration_minutes} minutes
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Director</p>
                <p className="font-semibold text-gray-800">
                  {event.director || "—"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Featured Event</p>
                <p className="font-semibold text-gray-800">
                  {event.is_featured ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Event Provider Information */}
          {(event as any).event_provider && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                Event Provider
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Provider Name</p>
                  <p className="font-semibold text-gray-800">
                    {(event as any).event_provider}
                  </p>
                </div>
                {(event as any).event_provider_email && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Provider Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="font-semibold text-gray-800">
                        {(event as any).event_provider_email}
                      </p>
                    </div>
                  </div>
                )}
                {(event as any).event_provider_phone && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Provider Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="font-semibold text-gray-800">
                        {(event as any).event_provider_phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cast */}
          {event.cast && event.cast.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                Cast
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {event.cast.map((member, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Show Schedules */}
          {schedules.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-600" />
                Show Schedules
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left text-gray-600">#</th>
                      <th className="p-3 text-left text-gray-600">Date</th>
                      <th className="p-3 text-left text-gray-600">
                        Start Time
                      </th>
                      <th className="p-3 text-left text-gray-600">End Time</th>
                      <th className="p-3 text-left text-gray-600">Hall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((slot: any, idx: number) => (
                      <tr
                        key={slot.id || idx}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-3 text-gray-600">{idx + 1}</td>
                        <td className="p-3 font-medium">
                          {formatDate(slot.date)}
                        </td>
                        <td className="p-3">{slot.startTime}</td>
                        <td className="p-3">{slot.endTime}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Building className="h-3 w-3 text-gray-400" />
                            {slot.hallName || slot.hall || "Main Hall"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Venue / Hall Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Theater className="h-5 w-5 text-teal-600" />
              Venue Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Venue / Hall</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="font-semibold text-gray-800">
                    {event.hall || "Main Hall"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Age Restriction</p>
                <p className="font-semibold text-gray-800">
                  {event.ageRestriction || "All Ages"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {(event.contactEmail ||
            event.contactPhone ||
            event.website ||
            event.organizer) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.organizer && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Organizer</p>
                    <p className="font-semibold text-gray-800">
                      {event.organizer}
                    </p>
                  </div>
                )}
                {event.contactEmail && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Contact Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="font-semibold text-gray-800">
                        {event.contactEmail}
                      </p>
                    </div>
                  </div>
                )}
                {event.contactPhone && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Contact Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="font-semibold text-gray-800">
                        {event.contactPhone}
                      </p>
                    </div>
                  </div>
                )}
                {event.website && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Website</p>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <p className="font-semibold text-gray-800">
                        {event.website}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contract Information */}
          {(event.contractDate || event.contractReference) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600" />
                Contract Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.contractDate && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Contract Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(event.contractDate)}
                    </p>
                  </div>
                )}
                {event.contractReference && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Contract Reference
                    </p>
                    <p className="font-semibold text-gray-800">
                      {event.contractReference}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seat Types & Pricing */}
          {event.seatCategories && event.seatCategories.length > 0 && (
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
                      <th className="p-3 text-left text-gray-600">
                        Price (ETB)
                      </th>
                      <th className="p-3 text-left text-gray-600">Capacity</th>
                      <th className="p-3 text-left text-gray-600">
                        Commission
                      </th>
                      <th className="p-3 text-left text-gray-600">Booked</th>
                      <th className="p-3 text-left text-gray-600">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.seatCategories.map((cat) => (
                      <tr
                        key={cat.id}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium">{cat.name}</td>
                        <td className="p-3 text-green-600 font-semibold">
                          ETB {cat.price.toLocaleString()}
                        </td>
                        <td className="p-3">{cat.capacity.toLocaleString()}</td>
                        <td className="p-3">{cat.commissionPercent}%</td>
                        <td className="p-3">
                          {cat.booked?.toLocaleString() || 0}
                        </td>
                        <td className="p-3">
                          {(cat.capacity - (cat.booked || 0)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Financial Summary */}
          {(event.totalBookedSeats !== undefined ||
            event.totalRevenue !== undefined) && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-green-600" />
                Financial Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Price Range</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Booked Seats</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {event.totalBookedSeats?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ETB {event.totalRevenue?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600" />
                Description
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Event Poster */}
          {event.poster_url && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-teal-600" />
                Event Poster
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                <img
                  src={event.poster_url}
                  alt={event.title}
                  className="max-h-80 rounded-lg shadow-md object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
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

export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  event,
  isOpen,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !event) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={handleModalClick}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Delete Event</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "<strong>{event.title}</strong>"? This
          action cannot be undone and will also delete all associated schedules
          and bookings.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
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

export const CancelEventModal: React.FC<CancelEventModalProps> = ({
  event,
  isOpen,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !event) return null;

  // Check if event is cancelled (status can be 'cancelled')
  const isRestore = event.status === "cancelled";

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={handleModalClick}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 rounded-lg ${isRestore ? "bg-green-100" : "bg-orange-100"}`}
          >
            {isRestore ? (
              <RefreshCw className="h-6 w-6 text-green-600" />
            ) : (
              <Ban className="h-6 w-6 text-orange-600" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {isRestore ? "Restore Event" : "Cancel Event"}
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          {isRestore
            ? `Are you sure you want to restore "${event.title}"? It will be set to "Coming Soon" status.`
            : `Are you sure you want to cancel "${event.title}"?`}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
              isRestore
                ? "bg-green-600 hover:bg-green-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {isRestore ? "Restore Event" : "Cancel Event"}
          </button>
        </div>
      </div>
    </div>
  );
};