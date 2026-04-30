// src/pages/Salesperson/AddCustomer.tsx
import React, { useState } from 'react';
import { UserPlus, Mail, Phone, MapPin } from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';

const AddCustomer: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Customer ${form.name} added successfully!`);
    // Reset or redirect
    setForm({ name: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-5">
        <div><label>Full Name *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded" /></div>
        <div><label>Email *</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-2 border rounded" /></div>
        <div><label>Phone</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-2 border rounded" /></div>
        <div><label>Address</label><textarea rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full p-2 border rounded" /></div>
        <ReusableButton type="submit" icon={UserPlus}>Save Customer</ReusableButton>
      </form>
    </div>
  );
};

export default AddCustomer;