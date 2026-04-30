// src/pages/Salesperson/MonthlySalesReport.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Download, BarChart3 } from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';

interface MonthlyData {
  day: number;
  sales: number;
  tickets: number;
}

const generateMonthlyData = (year: number, month: number): MonthlyData[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: i+1,
    sales: Math.floor(Math.random() * 1000) + 200,
    tickets: Math.floor(Math.random() * 50) + 10,
  }));
};

const MonthlySalesReport: React.FC = () => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4); // April
  const [data, setData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    setData(generateMonthlyData(year, month));
  }, [year, month]);

  const totalSales = data.reduce((sum, d) => sum + d.sales, 0);
  const totalTickets = data.reduce((sum, d) => sum + d.tickets, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Monthly Sales Report</h1>
        <div className="flex gap-2">
          <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="px-3 py-2 border rounded-lg"><option>2025</option><option>2026</option></select>
          <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="px-3 py-2 border rounded-lg"><option value={1}>January</option><option value={2}>February</option><option value={3}>March</option><option value={4}>April</option><option value={5}>May</option><option value={6}>June</option><option value={7}>July</option><option value={8}>August</option><option value={9}>September</option><option value={10}>October</option><option value={11}>November</option><option value={12}>December</option></select>
          <ReusableButton variant="outline" icon={Download}>Export CSV</ReusableButton>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 text-center"><BarChart3 className="h-8 w-8 mx-auto text-teal-600" /><p className="text-2xl font-bold mt-2">${totalSales}</p><p>Total Sales</p></div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center"><BarChart3 className="h-8 w-8 mx-auto text-blue-600" /><p className="text-2xl font-bold mt-2">{totalTickets}</p><p>Tickets Sold</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b"><tr><th>Day</th><th>Sales ($)</th><th>Tickets</th></tr></thead>
          <tbody>
            {data.map(d => (
              <tr key={d.day} className="border-b last:border-0"><td className="py-2">{d.day}</td><td>${d.sales}</td><td>{d.tickets}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlySalesReport;