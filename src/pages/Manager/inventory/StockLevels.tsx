// // src/components/dashboard/manager/inventory/StockLevels.tsx
// import React from 'react';
// import { AlertCircle, Package, TrendingDown, RefreshCw } from 'lucide-react';

// const StockLevels: React.FC = () => {
//   const stockItems = [
//     { name: "Popcorn (Large)", current: 45, min: 100, max: 500, status: "Critical" },
//     { name: "Soda (Regular)", current: 180, min: 100, max: 500, status: "Good" },
//     { name: "Nachos", current: 25, min: 50, max: 200, status: "Low" },
//     { name: "Candy Pack", current: 120, min: 100, max: 300, status: "Good" },
//     { name: "Hot Dogs", current: 15, min: 50, max: 150, status: "Critical" },
//   ];

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'Critical': return 'bg-red-100 text-red-700';
//       case 'Low': return 'bg-yellow-100 text-yellow-700';
//       case 'Good': return 'bg-green-100 text-green-700';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const getProgressColor = (status: string) => {
//     switch(status) {
//       case 'Critical': return 'bg-red-500';
//       case 'Low': return 'bg-yellow-500';
//       case 'Good': return 'bg-green-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getPercentage = (current: number, max: number) => {
//     return (current / max) * 100;
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Stock Levels</h1>
//           <p className="text-gray-600 mt-1">Monitor and manage inventory stock levels</p>
//         </div>
//         <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//           <RefreshCw className="h-5 w-5" />
//           Update Stock
//         </button>
//       </div>

//       {/* Stock Alerts */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//           <div className="flex items-center gap-2 mb-2">
//             <AlertCircle className="h-5 w-5 text-red-600" />
//             <h3 className="font-semibold text-red-900">Critical Stock</h3>
//           </div>
//           <p className="text-2xl font-bold text-red-700">2 items</p>
//           <p className="text-sm text-red-600 mt-1">Need immediate restocking</p>
//         </div>
        
//         <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
//           <div className="flex items-center gap-2 mb-2">
//             <TrendingDown className="h-5 w-5 text-yellow-600" />
//             <h3 className="font-semibold text-yellow-900">Low Stock</h3>
//           </div>
//           <p className="text-2xl font-bold text-yellow-700">1 item</p>
//           <p className="text-sm text-yellow-600 mt-1">Below minimum threshold</p>
//         </div>
        
//         <div className="bg-green-50 border border-green-200 rounded-xl p-4">
//           <div className="flex items-center gap-2 mb-2">
//             <Package className="h-5 w-5 text-green-600" />
//             <h3 className="font-semibold text-green-900">Healthy Stock</h3>
//           </div>
//           <p className="text-2xl font-bold text-green-700">2 items</p>
//           <p className="text-sm text-green-600 mt-1">Stock levels are good</p>
//         </div>
//       </div>

//       {/* Stock Levels Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               <th className="text-left p-4 font-semibold text-gray-700">Item Name</th>
//               <th className="text-left p-4 font-semibold text-gray-700">Stock Level</th>
//               <th className="text-left p-4 font-semibold text-gray-700">Status</th>
//               <th className="text-left p-4 font-semibold text-gray-700">Min Threshold</th>
//               <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stockItems.map((item, index) => (
//               <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
//                 <td className="p-4 font-medium text-gray-800">{item.name}</td>
//                 <td className="p-4">
//                   <div className="w-48">
//                     <div className="flex justify-between text-sm mb-1">
//                       <span>{item.current} units</span>
//                       <span>{getPercentage(item.current, item.max)}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className={`${getProgressColor(item.status)} h-2 rounded-full transition-all`}
//                         style={{ width: `${getPercentage(item.current, item.max)}%` }}
//                       />
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-4">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
//                     {item.status}
//                   </span>
//                 </td>
//                 <td className="p-4 text-gray-600">{item.min} units</td>
//                 <td className="p-4">
//                   <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
//                     Restock
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Restock Recommendations */}
//       <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
//         <h3 className="font-semibold text-blue-900 mb-2">Restock Recommendations</h3>
//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <span>Popcorn (Large)</span>
//             <span className="text-red-600">Order 100 units</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span>Hot Dogs</span>
//             <span className="text-red-600">Order 50 units</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span>Nachos</span>
//             <span className="text-yellow-600">Order 30 units</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockLevels;
// src/components/dashboard/manager/inventory/StockLevels.tsx
import React, { useState } from 'react';
import { 
  AlertCircle, Package, TrendingDown, RefreshCw, Search, 
  Filter, Download, ChevronDown, Bell, Coffee, 
  ShoppingBag, Beer, IceCream, Sandwich, Zap,
  TrendingUp, Truck, Clock, CheckCircle, XCircle,
  MoreVertical, Edit, Eye, Printer, Mail
} from 'lucide-react';

interface StockItem {
  id: number;
  name: string;
  category: string;
  current: number;
  min: number;
  max: number;
  status: 'Critical' | 'Low' | 'Good' | 'Overstock';
  price: number;
  supplier: string;
  lastRestocked: string;
  monthlySales: number;
  amharicName?: string;
}

const StockLevels: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  // Ethiopian theatre inventory mock data
  const stockItems: StockItem[] = [
    { 
      id: 1, 
      name: "ፖፕኮርን (ትልቅ) | Popcorn (Large)", 
      amharicName: "ትልቅ ፖፕኮርን",
      category: "Snacks", 
      current: 45, 
      min: 100, 
      max: 500, 
      status: "Critical",
      price: 120,
      supplier: "EthioSnacks PLC",
      lastRestocked: "2024-07-01",
      monthlySales: 1250
    },
    { 
      id: 2, 
      name: "ሶዳ (መደበኛ) | Soda (Regular)", 
      amharicName: "መደበኛ ሶዳ",
      category: "Beverages", 
      current: 180, 
      min: 100, 
      max: 500, 
      status: "Good",
      price: 40,
      supplier: "Ethiopian Beverages",
      lastRestocked: "2024-07-10",
      monthlySales: 890
    },
    { 
      id: 3, 
      name: "ቆጥቋጥ | Nachos", 
      amharicName: "ቆጥቋጥ",
      category: "Snacks", 
      current: 25, 
      min: 50, 
      max: 200, 
      status: "Low",
      price: 80,
      supplier: "Addis Snacks",
      lastRestocked: "2024-07-05",
      monthlySales: 450
    },
    { 
      id: 4, 
      name: "ከረሜላ ፓክ | Candy Pack", 
      amharicName: "ከረሜላ",
      category: "Candy", 
      current: 120, 
      min: 100, 
      max: 300, 
      status: "Good",
      price: 30,
      supplier: "Sweet Ethiopia",
      lastRestocked: "2024-07-08",
      monthlySales: 670
    },
    { 
      id: 5, 
      name: "ትላችን | Hot Dogs", 
      amharicName: "ትላችን",
      category: "Food", 
      current: 15, 
      min: 50, 
      max: 150, 
      status: "Critical",
      price: 95,
      supplier: "Ethio Meat Products",
      lastRestocked: "2024-06-28",
      monthlySales: 380
    },
    { 
      id: 6, 
      name: "ቡና (ትኩስ) | Coffee (Hot)", 
      amharicName: "ትኩስ ቡና",
      category: "Beverages", 
      current: 200, 
      min: 80, 
      max: 400, 
      status: "Good",
      price: 35,
      supplier: "Yirgacheffe Coffee",
      lastRestocked: "2024-07-12",
      monthlySales: 1100
    },
    { 
      id: 7, 
      name: "ዳቦ መጋገሪያ | Sandwich", 
      amharicName: "ሳንድዊች",
      category: "Food", 
      current: 85, 
      min: 40, 
      max: 120, 
      status: "Good",
      price: 110,
      supplier: "Addis Bakery",
      lastRestocked: "2024-07-09",
      monthlySales: 420
    },
    { 
      id: 8, 
      name: "አይስ ክሬም | Ice Cream", 
      amharicName: "አይስ ክሬም",
      category: "Desserts", 
      current: 60, 
      min: 30, 
      max: 100, 
      status: "Good",
      price: 55,
      supplier: "Ice Cream Ethiopia",
      lastRestocked: "2024-07-11",
      monthlySales: 560
    },
    { 
      id: 9, 
      name: "ባምባል | Energy Drink", 
      amharicName: "ባምባል",
      category: "Beverages", 
      current: 35, 
      min: 60, 
      max: 150, 
      status: "Low",
      price: 70,
      supplier: "Energy Ethiopia",
      lastRestocked: "2024-07-03",
      monthlySales: 310
    },
    { 
      id: 10, 
      name: "የፍራፍሬ ጭማቂ | Fruit Juice", 
      amharicName: "ፍራፍሬ ጭማቂ",
      category: "Beverages", 
      current: 150, 
      min: 50, 
      max: 250, 
      status: "Good",
      price: 45,
      supplier: "Fresh Juice Ethiopia",
      lastRestocked: "2024-07-07",
      monthlySales: 780
    }
  ];

  const categories = ['all', 'Snacks', 'Beverages', 'Food', 'Candy', 'Desserts'];
  const statuses = ['all', 'Critical', 'Low', 'Good', 'Overstock'];

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Snacks': return <Coffee className="h-5 w-5" />;
      case 'Beverages': return <Beer className="h-5 w-5" />;
      case 'Food': return <Sandwich className="h-5 w-5" />;
      case 'Candy': return <ShoppingBag className="h-5 w-5" />;
      case 'Desserts': return <IceCream className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Critical': return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'Low': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'Good': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'Overstock': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'Low': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Good': return 'bg-green-100 text-green-700 border-green-200';
      case 'Overstock': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch(status) {
      case 'Critical': return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'Low': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'Good': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'Overstock': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Critical': return <AlertCircle className="h-4 w-4" />;
      case 'Low': return <TrendingDown className="h-4 w-4" />;
      case 'Good': return <CheckCircle className="h-4 w-4" />;
      case 'Overstock': return <Package className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.amharicName && item.amharicName.includes(searchTerm));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    critical: stockItems.filter(i => i.status === 'Critical').length,
    low: stockItems.filter(i => i.status === 'Low').length,
    good: stockItems.filter(i => i.status === 'Good').length,
    totalValue: stockItems.reduce((sum, item) => sum + (item.current * item.price), 0),
    monthlyRevenue: stockItems.reduce((sum, item) => sum + (item.monthlySales * item.price), 0),
    totalItems: stockItems.length
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              የእቃ ክምችት አስተዳደር
            </h1>
            <p className="text-gray-600 mt-2">Stock Levels Management - Ethiopian Theatre Inventory</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300">
            <RefreshCw className="h-5 w-5" />
            Update Stock
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="h-8 w-8 opacity-90" />
            <span className="text-3xl font-bold">{stats.critical}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Critical Stock</h3>
          <p className="text-sm opacity-90">Need immediate restocking</p>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="h-8 w-8 opacity-90" />
            <span className="text-3xl font-bold">{stats.low}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Low Stock</h3>
          <p className="text-sm opacity-90">Below minimum threshold</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8 opacity-90" />
            <span className="text-3xl font-bold">{stats.good}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Healthy Stock</h3>
          <p className="text-sm opacity-90">Stock levels are good</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 opacity-90" />
            <span className="text-3xl font-bold">ብር {stats.monthlyRevenue.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Monthly Revenue</h3>
          <p className="text-sm opacity-90">From concessions sales</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search items (English or Amharic)..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Stock Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className={`${getStatusColor(item.status)} h-2`} />
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getStatusColor(item.status)} bg-opacity-10`}>
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    {item.amharicName && (
                      <p className="text-sm text-gray-500">{item.amharicName}</p>
                    )}
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Stock Level Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Stock Level</span>
                  <span className="font-semibold text-gray-800">
                    {item.current} / {item.max} units
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${getProgressColor(item.status)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${getPercentage(item.current, item.max)}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Min Threshold</p>
                  <p className="font-semibold text-gray-800">{item.min} units</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Unit Price</p>
                  <p className="font-semibold text-green-600">ብር {item.price}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Monthly Sales</p>
                  <p className="font-semibold text-gray-800">{item.monthlySales} units</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Last Restocked</p>
                  <p className="font-semibold text-gray-800">{item.lastRestocked}</p>
                </div>
              </div>

              {/* Status Badge and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  {item.status}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Details">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Restock">
                    <Truck className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition" title="More Options">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Restock Recommendations */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Restock Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stockItems.filter(i => i.status === 'Critical' || i.status === 'Low').map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Current: {item.current} units</p>
                </div>
                <span className={`text-sm font-semibold ${item.status === 'Critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                  Order {item.min - item.current} units
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                  Order Now
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
                  Contact Supplier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supplier Information */}
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Supplier Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(new Map(stockItems.map(item => [item.supplier, item])).values()).map((supplier, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-800">{supplier.supplier}</p>
                <p className="text-sm text-gray-500">Supplies: {stockItems.filter(i => i.supplier === supplier.supplier).map(i => i.name.split('|')[0].trim()).join(', ')}</p>
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                <Mail className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockLevels;