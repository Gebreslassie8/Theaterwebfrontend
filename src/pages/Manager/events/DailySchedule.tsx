// src/components/dashboard/manager/events/DailySchedule.tsx
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const DailySchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const schedule = [
    { time: "10:00 AM", event: "Morning Movie", hall: "Hall A", tickets: 234, status: "Completed" },
    { time: "1:00 PM", event: "Matinee Show", hall: "Hall B", tickets: 456, status: "In Progress" },
    { time: "4:00 PM", event: "Afternoon Show", hall: "Hall C", tickets: 389, status: "Upcoming" },
    { time: "7:00 PM", event: "Evening Concert", hall: "Hall A", tickets: 892, status: "Upcoming" },
    { time: "9:00 PM", event: "Late Night Comedy", hall: "Hall B", tickets: 445, status: "Upcoming" },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daily Schedule</h1>
        <p className="text-gray-600 mt-1">View and manage today's event schedule</p>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">{formatDate(currentDate)}</h2>
        </div>
        <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-4">
        {schedule.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.event}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {item.hall}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {item.tickets} tickets
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">{item.time}</p>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  item.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                  item.status === 'In Progress' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailySchedule;