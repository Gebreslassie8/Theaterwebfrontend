// src/pages/manager/TicketSalesDetails.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ticket, TrendingUp } from 'lucide-react';
import { Card } from '../../../components/Overview/Card';

interface ShowData {
  id: string;
  name: string;
  sales: number;
  capacity: number;
  revenue: number;
  status: string;
  time: string;
  date: string;
  hall: string;
}

const showsData: ShowData[] = [
  { id: '1', name: 'The Lion King', sales: 89, capacity: 120, revenue: 4005, status: 'selling', time: '7:00 PM', date: '2026-04-20', hall: 'Grand Hall' },
  { id: '2', name: 'Hamilton', sales: 95, capacity: 120, revenue: 6175, status: 'almost full', time: '8:30 PM', date: '2026-04-21', hall: 'West End Theater' },
  { id: '3', name: 'Wicked', sales: 110, capacity: 120, revenue: 6050, status: 'sold out', time: '6:00 PM', date: '2026-04-19', hall: 'Disney Theater' },
  { id: '4', name: 'Phantom of Opera', sales: 67, capacity: 120, revenue: 4020, status: 'selling', time: '9:00 PM', date: '2026-04-22', hall: 'Emerald Theatre' },
  { id: '5', name: 'Chicago', sales: 78, capacity: 120, revenue: 3900, status: 'selling', time: '7:30 PM', date: '2026-04-23', hall: 'Opera House' },
  { id: '6', name: 'Les Misérables', sales: 45, capacity: 120, revenue: 2700, status: 'upcoming', time: '8:00 PM', date: '2026-05-01', hall: 'Broadway Hall' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const TicketSalesDetails: React.FC = () => {
  const totalSold = showsData.reduce((sum, show) => sum + show.sales, 0);
  const totalCapacity = showsData.reduce((sum, show) => sum + show.capacity, 0);
  const totalFree = totalCapacity - totalSold;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen"
    >
      {/* Header with back button */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Link
          to="/manager/overview"
          className="p-2 rounded-lg bg-white shadow hover:bg-gray-50 transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ticket Sales Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            Breakdown of sold and free seats per event
          </p>
        </div>
      </motion.div>

      {/* Summary Cards – only Sold and Free */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tickets Sold</p>
              <p className="text-2xl font-bold text-teal-600">{totalSold.toLocaleString()}</p>
            </div>
            <Ticket className="h-8 w-8 text-teal-200" />
          </div>
        </Card>
        <Card className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Free Seats</p>
              <p className="text-2xl font-bold text-blue-600">{totalFree.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </Card>
      </motion.div>

      {/* Per‑event table – without Reserved column */}
      <motion.div variants={itemVariants}>
        <Card title="Per‑Event Seat Status" subtitle="Sold and free seats per event">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Event</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Hall</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Sold</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Free</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {showsData.map((show) => {
                  const free = show.capacity - show.sales;
                  return (
                    <tr key={show.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{show.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{show.hall}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{show.date}</td>
                      <td className="py-3 px-4 text-right text-sm font-semibold text-teal-600">{show.sales}</td>
                      <td className="py-3 px-4 text-right text-sm font-semibold text-blue-600">{free}</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-500">{show.capacity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TicketSalesDetails;