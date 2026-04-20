// src/pages/Manager/events/DailySchedule.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  stage: string;
}

const STAGES = ['Main Stage', 'Black Box', 'Outdoor Amphitheater'];

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const doTimesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
  return timeToMinutes(start1) < timeToMinutes(end2) && timeToMinutes(start2) < timeToMinutes(end1);
};

const getTodayDate = (): string => new Date().toISOString().split('T')[0];

const eventApi = {
  getEvents: async (): Promise<ScheduleEvent[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem('theatre_schedule_events');
        if (stored) resolve(JSON.parse(stored));
        else {
          const today = getTodayDate();
          const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
          resolve([
            { id: '1', title: 'The Lion King', date: today, startTime: '19:00', endTime: '21:30', stage: 'Main Stage' },
            { id: '2', title: 'Hamlet', date: today, startTime: '15:00', endTime: '17:30', stage: 'Black Box' },
            { id: '3', title: "A Midsummer Night's Dream", date: tomorrow, startTime: '20:00', endTime: '22:00', stage: 'Outdoor Amphitheater' },
          ]);
        }
      }, 300);
    });
  },
  saveEvents: async (events: ScheduleEvent[]): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('theatre_schedule_events', JSON.stringify(events));
        resolve();
      }, 200);
    });
  },
  createEvent: async (eventData: Omit<ScheduleEvent, 'id'>): Promise<ScheduleEvent> => {
    const newEvent = { ...eventData, id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() };
    const events = await eventApi.getEvents();
    events.push(newEvent);
    await eventApi.saveEvents(events);
    return newEvent;
  },
  updateEvent: async (id: string, eventData: Omit<ScheduleEvent, 'id'>): Promise<ScheduleEvent> => {
    const events = await eventApi.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    const updated = { ...eventData, id };
    events[index] = updated;
    await eventApi.saveEvents(events);
    return updated;
  },
  deleteEvent: async (id: string): Promise<void> => {
    const events = await eventApi.getEvents();
    await eventApi.saveEvents(events.filter(e => e.id !== id));
  },
};

const DailySchedule: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: selectedDate,
    startTime: '19:00',
    endTime: '21:00',
    stage: STAGES[0],
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventApi.getEvents();
      setEvents(data);
    } catch (error) {
      setSuccessMessage('Failed to load events');
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const hasConflict = (newEvent: Omit<ScheduleEvent, 'id'>, excludeId?: string): boolean => {
    return events.some(existing => {
      if (excludeId && existing.id === excludeId) return false;
      if (existing.date !== newEvent.date) return false;
      if (existing.stage !== newEvent.stage) return false;
      return doTimesOverlap(newEvent.startTime, newEvent.endTime, existing.startTime, existing.endTime);
    });
  };

  const handleAddClick = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: selectedDate,
      startTime: '19:00',
      endTime: '21:00',
      stage: STAGES[0],
    });
    setFormError('');
    setShowForm(true);
  };

  const handleEditClick = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      stage: event.stage,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const deletedEvent = events.find(e => e.id === id);
        await eventApi.deleteEvent(id);
        setEvents(events.filter(e => e.id !== id));
        setSuccessMessage(`${deletedEvent?.title} deleted successfully!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        setSuccessMessage('Failed to delete event');
        setShowSuccess(true);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setFormError('Event title is required.');
      return;
    }
    if (timeToMinutes(formData.startTime) >= timeToMinutes(formData.endTime)) {
      setFormError('End time must be after start time.');
      return;
    }

    const newEventData = {
      title: formData.title.trim(),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      stage: formData.stage,
    };

    if (hasConflict(newEventData, editingEvent?.id)) {
      setFormError('Schedule conflict: Another event already occupies this stage at the given time.');
      return;
    }

    try {
      if (editingEvent) {
        const updated = await eventApi.updateEvent(editingEvent.id, newEventData);
        setEvents(events.map(e => e.id === editingEvent.id ? updated : e));
        setSuccessMessage(`${formData.title} updated successfully!`);
      } else {
        const created = await eventApi.createEvent(newEventData);
        setEvents([...events, created]);
        setSuccessMessage(`${formData.title} added successfully!`);
      }
      setShowForm(false);
      setEditingEvent(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setSuccessMessage('Failed to save event');
      setShowSuccess(true);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormError('');
  };

  const filteredEvents = events
    .filter(e => e.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const formatDisplayDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const tableColumns = [
    { Header: 'Event', accessor: 'title', sortable: true },
    {
      Header: 'Date',
      accessor: 'date',
      sortable: true,
      Cell: (row: any) => <span className="text-deepTeal">{formatDisplayDate(row.date)}</span>,
    },
    { Header: 'Start Time', accessor: 'startTime', sortable: true },
    { Header: 'End Time', accessor: 'endTime', sortable: true },
    {
      Header: 'Stage',
      accessor: 'stage',
      sortable: true,
      Cell: (row: any) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
          {row.stage}
        </span>
      ),
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      sortable: false,
      Cell: (row: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditClick(row)} className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => handleDeleteClick(row.id)} className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const tableData = filteredEvents.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    stage: event.stage,
  }));

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daily Theatre Schedule</h1>
          <p className="text-gray-600">Manage daily events and stage bookings</p>
        </div>
        <ReusableButton onClick={handleAddClick} variant="primary" icon={Plus}>
          Add Event
        </ReusableButton>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow border">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="[&_input[type='text']]:w-full [&_input[type='text']]:md:w-96">
        <ReusableTable
          columns={tableColumns}
          data={tableData}
          title={`Schedule for ${formatDisplayDate(selectedDate)}`}
          showSearch={true}
          showExport={false}
          showPrint={false}
          itemsPerPage={10}
          searchPlaceholder="Search events..."
        />
      </div>

      {/* Modal Popup with ReusableButton for Cancel and Save */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  {STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <ReusableButton onClick={handleCancel} variant="secondary">
                Cancel
              </ReusableButton>
              <ReusableButton onClick={handleSave} variant="primary">
                {editingEvent ? 'Update' : 'Save'}
              </ReusableButton>
            </div>
          </div>
        </div>
      )}

      <SuccessPopup
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default DailySchedule;