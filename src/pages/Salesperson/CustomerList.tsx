// src/pages/Salesperson/CustomerList.tsx
import React, { useState } from 'react';

// Types
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

interface Purchase {
  id: number;
  customerId: number;
  showName: string;
  date: string;
  seats: string;
  price: number;
}

// Mock data
const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '555-1234', joinDate: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '555-5678', joinDate: '2024-02-20' },
];

const MOCK_PURCHASES: Purchase[] = [
  { id: 101, customerId: 1, showName: 'The Lion King', date: '2024-03-10', seats: 'A12, A13', price: 120 },
  { id: 102, customerId: 1, showName: 'Hamilton', date: '2024-04-05', seats: 'B4', price: 85 },
  { id: 103, customerId: 2, showName: 'Wicked', date: '2024-03-20', seats: 'C8, C9', price: 150 },
];

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [purchases] = useState<Purchase[]>(MOCK_PURCHASES);
  const [showHistoryFor, setShowHistoryFor] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'joinDate'>>({
    name: '',
    email: '',
    phone: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Helper: get purchase history for a customer
  const getPurchaseHistory = (customerId: number): Purchase[] => {
    return purchases.filter((p) => p.customerId === customerId);
  };

  // Add new customer
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      alert('Please fill out all fields.');
      return;
    }
    const newId = Math.max(...customers.map((c) => c.id), 0) + 1;
    const today = new Date().toISOString().slice(0, 10);
    const customerToAdd: Customer = {
      ...newCustomer,
      id: newId,
      joinDate: today,
    };
    setCustomers([...customers, customerToAdd]);
    setNewCustomer({ name: '', email: '', phone: '' });
    setShowAddForm(false);
  };

  // Update customer contact info
  const handleUpdateCustomer = () => {
    if (editingCustomer) {
      setCustomers(
        customers.map((c) => (c.id === editingCustomer.id ? editingCustomer : c))
      );
      setEditingCustomer(null);
    }
  };

  // Delete customer
  const handleDeleteCustomer = (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
          >
            + Add New Customer
          </button>
        </div>

        {/* Add Customer Form (Conditional) */}
        {showAddForm && (
          <div className="bg-white p-5 rounded-lg shadow-md mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">New Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Save Customer
              </button>
            </div>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  {editingCustomer?.id === customer.id ? (
                    // Edit mode
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="email"
                          value={editingCustomer.email}
                          onChange={(e) =>
                            setEditingCustomer({ ...editingCustomer, email: e.target.value })
                          }
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editingCustomer.phone}
                          onChange={(e) =>
                            setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                          }
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.joinDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={handleUpdateCustomer}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCustomer(null)}
                          className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.joinDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-3">
                        <button
                          onClick={() => setShowHistoryFor(customer)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          History
                        </button>
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No customers found. Click "Add New Customer" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Purchase History Modal */}
        {showHistoryFor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800">
                  Purchase History: {showHistoryFor.name}
                </h3>
                <button
                  onClick={() => setShowHistoryFor(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {getPurchaseHistory(showHistoryFor.id).length === 0 ? (
                  <p className="text-gray-500 italic">No purchase history found.</p>
                ) : (
                  <ul className="space-y-4">
                    {getPurchaseHistory(showHistoryFor.id).map((purchase) => (
                      <li key={purchase.id} className="border-b pb-3 last:border-b-0">
                        <div className="font-semibold text-gray-800">{purchase.showName}</div>
                        <div className="text-sm text-gray-600">
                          Date: {purchase.date} | Seats: {purchase.seats}
                        </div>
                        <div className="text-sm font-medium text-green-700">
                          Total: ${purchase.price.toFixed(2)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right">
                <button
                  onClick={() => setShowHistoryFor(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;