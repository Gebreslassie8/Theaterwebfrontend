// src/components/dashboard/manager/inventory/SnacksConcessions.tsx
import React, { useState } from 'react';
import { Coffee, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

const SnacksConcessions: React.FC = () => {
  const [items] = useState([
    { id: 1, name: "Popcorn (Large)", category: "Snacks", price: 8.99, stock: 150, sold: 234 },
    { id: 2, name: "Popcorn (Medium)", category: "Snacks", price: 6.99, stock: 200, sold: 189 },
    { id: 3, name: "Soda (Regular)", category: "Beverages", price: 4.99, stock: 300, sold: 456 },
    { id: 4, name: "Nachos", category: "Snacks", price: 7.99, stock: 80, sold: 123 },
    { id: 5, name: "Candy Pack", category: "Snacks", price: 3.99, stock: 250, sold: 345 },
    { id: 6, name: "Hot Dog", category: "Food", price: 5.99, stock: 60, sold: 98 },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Snacks & Concessions</h1>
          <p className="text-gray-600 mt-1">Manage your concession items inventory</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          Add New Item
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="h-5 w-5" />
          Category
        </button>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">Item Name</th>
              <th className="text-left p-4 font-semibold text-gray-700">Category</th>
              <th className="text-left p-4 font-semibold text-gray-700">Price</th>
              <th className="text-left p-4 font-semibold text-gray-700">Stock</th>
              <th className="text-left p-4 font-semibold text-gray-700">Sold</th>
              <th className="text-left p-4 font-semibold text-gray-700">Revenue</th>
              <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Coffee className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{item.category}</td>
                <td className="p-4 text-gray-600">${item.price}</td>
                <td className="p-4">
                  <span className={`font-medium ${item.stock < 50 ? 'text-red-600' : 'text-gray-600'}`}>
                    {item.stock}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{item.sold}</td>
                <td className="p-4 text-gray-600">${(item.price * item.sold).toFixed(2)}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SnacksConcessions;