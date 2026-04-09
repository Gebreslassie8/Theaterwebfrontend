// src/pages/Manager/components/ManagerOverview.tsx
import React from 'react';
import { LayoutDashboard, TrendingUp, Users, Ticket, Calendar, Package, DollarSign } from 'lucide-react';

const ManagerOverview: React.FC = () => {
  const stats = [
    { title: "Today's Tickets Sold", value: "1,234", icon: Ticket, color: "bg-blue-500", change: "+12%", changeType: "increase" },
    { title: "Total Revenue", value: "$24,567", icon: DollarSign, color: "bg-green-500", change: "+8%", changeType: "increase" },
    { title: "Total Events", value: "45", icon: Calendar, color: "bg-purple-500", change: "+5", changeType: "increase" },
    { title: "Hall Occupancy", value: "78%", icon: LayoutDashboard, color: "bg-orange-500", change: "+8%", changeType: "increase" },
    { title: "Inventory Stock", value: "92%", icon: Package, color: "bg-indigo-500", change: "-3%", changeType: "decrease" },
    { title: "Staff on Duty", value: "23", icon: Users, color: "bg-cyan-500", change: "+2", changeType: "increase" },
  ];

  const recentEvents = [
    { id: 1, name: "Summer Music Festival", date: "2024-07-15", time: "7:00 PM", tickets: 234, revenue: "$4,680" },
    { id: 2, name: "Comedy Night", date: "2024-07-18", time: "8:00 PM", tickets: 156, revenue: "$3,120" },
    { id: 3, name: "Movie Premiere", date: "2024-07-20", time: "6:30 PM", tickets: 289, revenue: "$5,780" },
    { id: 4, name: "Theater Play", date: "2024-07-22", time: "7:30 PM", tickets: 178, revenue: "$3,560" },
  ];

  const lowStockItems = [
    { id: 1, name: "Popcorn (Large)", current: 45, min: 100, status: "Critical" },
    { id: 2, name: "Hot Dogs", current: 15, min: 50, status: "Critical" },
    { id: 3, name: "Nachos", current: 25, min: 50, status: "Low" },
    { id: 4, name: "Soda (Regular)", current: 180, min: 100, status: "Good" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                stat.changeType === 'increase' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Events and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Events</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
          </div>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{event.name}</p>
                  <div className="flex gap-4 mt-1">
                    <p className="text-xs text-gray-600">{event.date} at {event.time}</p>
                    <p className="text-xs text-gray-600">{event.tickets} tickets</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{event.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">Manage Inventory →</button>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className={`p-3 rounded-lg ${
                item.status === 'Critical' ? 'bg-red-50 border border-red-200' : 
                item.status === 'Low' ? 'bg-yellow-50 border border-yellow-200' : 
                'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Current: {item.current} units</p>
                  </div>
                  {item.status !== 'Good' && (
                    <button className={`px-3 py-1 rounded text-sm ${
                      item.status === 'Critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
                    } text-white transition`}>
                      Restock
                    </button>
                  )}
                  {item.status === 'Good' && (
                    <span className="text-sm text-green-600">✓ Stock OK</span>
                  )}
                </div>
                {item.status !== 'Good' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.status === 'Critical' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${(item.current / item.min) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum required: {item.min} units
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:shadow-lg transition">
          <div className="text-left">
            <Calendar className="h-6 w-6 mb-2" />
            <p className="font-semibold">Create Event</p>
            <p className="text-sm opacity-90">Add new event to schedule</p>
          </div>
        </button>
        
        <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:shadow-lg transition">
          <div className="text-left">
            <Users className="h-6 w-6 mb-2" />
            <p className="font-semibold">Manage Staff</p>
            <p className="text-sm opacity-90">Schedule and attendance</p>
          </div>
        </button>
        
        <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:shadow-lg transition">
          <div className="text-left">
            <Package className="h-6 w-6 mb-2" />
            <p className="font-semibold">Update Inventory</p>
            <p className="text-sm opacity-90">Manage stock levels</p>
          </div>
        </button>
        
        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:shadow-lg transition">
          <div className="text-left">
            <TrendingUp className="h-6 w-6 mb-2" />
            <p className="font-semibold">View Reports</p>
            <p className="text-sm opacity-90">Sales and analytics</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ManagerOverview;