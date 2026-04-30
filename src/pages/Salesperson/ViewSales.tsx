// src/pages/Salesperson/ViewSales.tsx
import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar } from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';

interface Sale {
  id: number;
  event: string;
  customer: string;
  seats: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Refunded';
  discount?: number;
}

const mockSales: Sale[] = [
  { id: 1, event: 'Summer Concert', customer: 'John Doe', seats: 'VIP 12', amount: 80, date: '2026-04-30', status: 'Paid', discount: 0 },
  { id: 2, event: 'Movie Night', customer: 'Jane Smith', seats: 'Standard 45', amount: 27, date: '2026-04-30', status: 'Paid', discount: 10 },
];

const ViewSales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  useEffect(() => { setSales(mockSales); }, []);

  const filtered = sales.filter(s => s.event.toLowerCase().includes(search.toLowerCase()) || s.customer.toLowerCase().includes(search.toLowerCase()));

  const exportCSV = () => { alert('Export CSV'); };
  const exportPDF = () => { alert('Export PDF'); };

  const columns = [
    { Header: 'Event', accessor: 'event' }, { Header: 'Customer', accessor: 'customer' }, { Header: 'Seats', accessor: 'seats' }, { Header: 'Amount', accessor: 'amount', Cell: (row: Sale) => `$${row.amount}` }, { Header: 'Date', accessor: 'date' }, { Header: 'Status', accessor: 'status' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Sales Records</h1>
      <div className="flex flex-wrap gap-4 mb-4"><div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg w-full" /></div><div><input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="px-3 py-2 border rounded-lg" /> to <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="px-3 py-2 border rounded-lg" /></div><ReusableButton variant="outline" icon={Download} onClick={exportCSV}>CSV</ReusableButton><ReusableButton variant="outline" onClick={exportPDF}>PDF</ReusableButton></div>
      <ReusableTable columns={columns} data={filtered} title="All Sales" showSearch={false} itemsPerPage={10} />
    </div>
  );
};

export default ViewSales;