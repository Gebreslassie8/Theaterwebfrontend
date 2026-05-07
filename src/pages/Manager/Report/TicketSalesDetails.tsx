// src/pages/manager/TicketSalesDetails.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ticket, TrendingUp, Download, Search, Filter } from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';

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

// Extract unique hall names for filter
const uniqueHalls = Array.from(new Set(showsData.map(show => show.hall)));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const TicketSalesDetails: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHall, setSelectedHall] = useState<string>('');

  const totalSold = showsData.reduce((sum, show) => sum + show.sales, 0);
  const totalCapacity = showsData.reduce((sum, show) => sum + show.capacity, 0);
  const totalFree = totalCapacity - totalSold;

  // Prepare base data with computed 'free' field
  const baseData = showsData.map(show => ({
    id: show.id,
    name: show.name,
    hall: show.hall,
    date: show.date,
    sales: show.sales,
    capacity: show.capacity,
    free: show.capacity - show.sales
  }));

  // Apply filters: search by event name + filter by hall
  const filteredData = useMemo(() => {
    let filtered = baseData;
    if (searchTerm.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedHall) {
      filtered = filtered.filter(item => item.hall === selectedHall);
    }
    return filtered;
  }, [searchTerm, selectedHall, baseData]);

  const columns = [
    { Header: 'Event', accessor: 'name', sortable: true },
    { Header: 'Hall', accessor: 'hall', sortable: true },
    { Header: 'Date', accessor: 'date', sortable: true },
    {
      Header: 'Sold',
      accessor: 'sales',
      sortable: true,
      Cell: (row: any) => <span className="font-semibold text-teal-600">{row.sales}</span>
    },
    {
      Header: 'Free',
      accessor: 'free',
      sortable: true,
      Cell: (row: any) => <span className="font-semibold text-blue-600">{row.free}</span>
    },
    {
      Header: 'Capacity',
      accessor: 'capacity',
      sortable: true,
      Cell: (row: any) => <span className="text-gray-500">{row.capacity}</span>
    }
  ];

  const handleExport = () => {
    console.log('Export ticket sales data');
    alert('Export functionality would be implemented here.');
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen"
    >
      {/* Header with back button and export */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/manager/dashboard"
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
        </div>
      </motion.div>

      {/* Summary Cards – minimized width, centered */}
      <motion.div variants={itemVariants} className="flex justify-center gap-5 flex-wrap">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 w-64">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Tickets Sold</p>
              <p className="text-xl font-bold text-gray-900">{totalSold.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 w-64">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Free Seats</p>
              <p className="text-xl font-bold text-gray-900">{totalFree.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter row: search bar + hall dropdown, both centered and aligned */}
      <motion.div variants={itemVariants} className="flex justify-center gap-4 flex-wrap">
        {/* Search input */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by event name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 rounded-xl border-gray-200 focus:border-teal-500 focus:outline-none"
          />
        </div>

        {/* Hall filter dropdown */}
        <div className="relative w-full max-w-xs">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={selectedHall}
            onChange={e => setSelectedHall(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 rounded-xl border-gray-200 focus:border-teal-500 focus:outline-none appearance-none bg-white"
          >
            <option value="">All Halls</option>
            {uniqueHalls.map(hall => (
              <option key={hall} value={hall}>{hall}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ReusableTable – internal search disabled */}
      <motion.div variants={itemVariants}>
        <ReusableTable
          columns={columns}
          data={filteredData}
          title="Per‑Event Seat Status"
          showSearch={false}
          showExport={true}
          showPrint={true}
          itemsPerPage={10}
        />
      </motion.div>
    </motion.div>
  );
};

export default TicketSalesDetails;