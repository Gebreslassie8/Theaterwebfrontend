// src/components/Reusable/ScheduleEventButton.tsx
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import ReusableButton from './ReusableButton';

// Types (copied from EventSchedule - better to move to a shared types file)
export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface SeatCategory {
  id: string;
  name: string;
  price: number;
  capacity: number;
  booked?: number;
  commissionPercent: number;
}

export interface EventData {
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
  description?: string;
}

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

interface ScheduleEventButtonProps {
  registeredEvents: EventData[];
  onSchedule: (newEvent: ScheduledEvent) => void;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'danger';
  buttonText?: string;
}

const ScheduleEventButton: React.FC<ScheduleEventButtonProps> = ({
  registeredEvents,
  onSchedule,
  buttonVariant = 'primary',
  buttonText = 'Schedule Event',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSourceEventId, setSelectedSourceEventId] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    bookedSeats: 0,
    status: 'scheduled' as ScheduledEvent['status'],
    description: '',
  });

  const handleSourceEventChange = (sourceId: string) => {
    const sourceEvent = registeredEvents.find(ev => ev.id === sourceId);
    if (sourceEvent) {
      setSelectedSourceEventId(sourceId);
      // Do not override eventName/hall/etc. in formData – we'll compute them on save.
    } else {
      setSelectedSourceEventId('');
    }
  };

  const handleSave = () => {
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
      totalSeats,
      bookedSeats: formData.bookedSeats || 0,
      status: formData.status,
      ticketPrice: lowestPrice,
      description: formData.description || sourceEvent.description,
    };

    onSchedule(newEvent);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSourceEventId('');
    setFormData({
      date: '',
      startTime: '',
      endTime: '',
      bookedSeats: 0,
      status: 'scheduled',
      description: '',
    });
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const selectedSource = registeredEvents.find(ev => ev.id === selectedSourceEventId);

  return (
    <>
      <ReusableButton variant={buttonVariant} onClick={openModal} icon={<Plus size={16} />}>
        {buttonText}
      </ReusableButton>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 rounded-t-2xl flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <h2 className="text-xl font-bold">Schedule New Showtime</h2>
              <button onClick={() => setShowModal(false)} className="hover:opacity-80">
                <X />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Event *</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={selectedSourceEventId}
                    onChange={e => handleSourceEventChange(e.target.value)}
                  >
                    <option value="">-- Choose an event --</option>
                    {registeredEvents.map(ev => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name} ({ev.hall})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Event Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg bg-gray-100"
                    value={selectedSource?.name || ''}
                    readOnly
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hall</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg bg-gray-100"
                      value={selectedSource?.hall || ''}
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time *</label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded-lg"
                      value={formData.startTime}
                      onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time *</label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded-lg"
                      value={formData.endTime}
                      onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Seats</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg bg-gray-100"
                      value={selectedSource?.seatCategories.reduce((sum, cat) => sum + cat.capacity, 0) || 0}
                      readOnly
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ticket Price ($)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg bg-gray-100"
                      value={selectedSource ? Math.min(...selectedSource.seatCategories.map(cat => cat.price)) : 0}
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Booked Seats (optional)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    value={formData.bookedSeats}
                    onChange={e => setFormData({ ...formData, bookedSeats: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as ScheduledEvent['status'] })}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    rows={3}
                    className="w-full p-2 border rounded-lg"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <ReusableButton variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </ReusableButton>
                  <ReusableButton variant="primary" onClick={handleSave}>
                    Schedule Showtime
                  </ReusableButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleEventButton;