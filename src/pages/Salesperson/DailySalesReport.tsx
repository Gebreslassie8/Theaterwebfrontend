// src/pages/Salesperson/DailySalesReport.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Download, TrendingUp } from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';

interface Sale {
  id: number;
  time: string;
  event: string;
  seats: string;
  amount: number;
  payment: string;
}

const generateMockSales = (): Sale[] => {
  return [
    { id: 1, time: '10:30', event: 'Summer Concert', seats: 'VIP 12', amount: 80, payment: 'Cash' },
    { id: 2, time: '11:45', event: 'Movie Night', seats: 'Standard 45', amount: 30, payment: 'Card' },
    { id: 3, time: '14:00', event: 'Theater Play', seats: 'Premium 8', amount: 80, payment: 'Wallet' },
  ];
};

const DailySalesReport: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10));
  useEffect(() => { setSales(generateMockSales()); }, [selectedDate]);

  const total = sales.reduce((sum, s) => sum + s.amount, 0);

  const columns = [
    { Header: 'Time', accessor: 'time' },
    { Header: 'Event', accessor: 'event' },
    { Header: 'Seats', accessor: 'seats' },
    { Header: 'Amount', accessor: 'amount', Cell: (row: Sale) => `$${row.amount}` },
    { Header: 'Payment', accessor: 'payment' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daily Sales Report</h1>
        <div className="flex gap-2">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
          <ReusableButton variant="outline" icon={Download}>Export PDF</ReusableButton>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 text-teal-700"><TrendingUp className="h-6 w-6" /><span className="text-xl font-bold">Total Sales: ${total}</span></div>
      </div>
      <ReusableTable columns={columns} data={sales} title={`Sales for ${selectedDate}`} showSearch={false} itemsPerPage={10} />
    </div>
  );
};

export default DailySalesReport;