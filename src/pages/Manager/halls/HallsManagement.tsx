// src/components/dashboard/manager/halls/HallsManagement.tsx
import React, { useState } from 'react';
import { Building, Edit, Trash2, Plus, Users, Grid, Settings } from 'lucide-react';

const HallsManagement: React.FC = () => {
  const [halls] = useState([
    { id: 1, name: "Hall A", capacity: 500, features: ["AC", "Dolby Sound", "VIP Seats"], status: "Active" },
    { id: 2, name: "Hall B", capacity: 300, features: ["AC", "Surround Sound"], status: "Active" },
    { id: 3, name: "Hall C", capacity: 200, features: ["Standard Sound"], status: "Maintenance" },
    { id: 4, name: "VIP Hall", capacity: 100, features: ["Premium Seats", "Private Lounge", "AC"], status: "Active" },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Halls Management</h1>
          <p className="text-gray-600 mt-1">Manage your theater halls and seating arrangements</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          Add New Hall
        </button>
      </div>

      {/* Halls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => (
          <div key={hall.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  hall.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {hall.status}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{hall.name}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Users className="h-4 w-4" />
                <span className="text-sm">Capacity: {hall.capacity} seats</span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                <div className="flex flex-wrap gap-2">
                  {hall.features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                  <Grid className="h-4 w-4" />
                  Seating Layout
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallsManagement;