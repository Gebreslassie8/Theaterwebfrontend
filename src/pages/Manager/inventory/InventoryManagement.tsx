// src/components/dashboard/manager/inventory/InventoryManagement.tsx
import React from 'react';
import { Package, TrendingUp, AlertCircle, ShoppingCart } from 'lucide-react';

const InventoryManagement: React.FC = () => {
  const stats = [
    { title: "Total Items", value: "156", icon: Package, color: "bg-blue-500" },
    { title: "Low Stock Items", value: "8", icon: AlertCircle, color: "bg-red-500" },
    { title: "Monthly Sales", value: "$12,345", icon: TrendingUp, color: "bg-green-500" },
    { title: "Orders Today", value: "45", icon: ShoppingCart, color: "bg-purple-500" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <p className="text-gray-600 mt-1">Track and manage your concessions inventory</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className={`${stat.color} p-3 rounded-lg inline-block mb-4`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Low Stock Alert</h3>
          <p className="text-sm opacity-90 mb-4">8 items need restocking</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
            View Items
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Daily Sales Report</h3>
          <p className="text-sm opacity-90 mb-4">Today's revenue: $2,345</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
            Generate Report
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">New Order</h3>
          <p className="text-sm opacity-90 mb-4">3 pending deliveries</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
            Process Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;