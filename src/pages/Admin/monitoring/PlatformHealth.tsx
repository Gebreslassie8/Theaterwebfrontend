// src/pages/Admin/monitoring/PlatformHealth.tsx
import React, { useState, useEffect } from 'react';
import { 
  FiActivity, FiHeart, FiServer, FiDatabase, FiCloud, FiWifi, 
  FiCheckCircle, FiXCircle, FiAlertCircle, FiClock, FiRefreshCw, 
  FiTrendingUp, FiTrendingDown, FiCpu, FiHardDrive, FiZap, 
  FiShield, FiEye, FiBell, FiCalendar, FiDownload, FiUsers,
  FiUserCheck, FiUserPlus, FiUserX, FiSearch, FiFilter, FiX
} from 'react-icons/fi';
import { MdHealthAndSafety } from 'react-icons/md';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

interface HealthMetric {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'warning';
  responseTime: number;
  uptime: number;
  lastChecked: string;
  endpoint: string;
  description?: string;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'down';
  uptime: number;
  activeUsers: number;
  requestsPerMinute: number;
  errorRate: number;
  lastIncident: string | null;
}

const deepTeal = "#007590";

const PlatformHealth: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    uptime: 99.98,
    activeUsers: 1247,
    requestsPerMinute: 3450,
    errorRate: 0.02,
    lastIncident: null
  });
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    { id: '1', name: 'API Gateway', status: 'healthy', responseTime: 45, uptime: 99.99, lastChecked: new Date().toISOString(), endpoint: '/api/v1/health', description: 'Main API gateway handling all incoming requests' },
    { id: '2', name: 'Authentication Service', status: 'healthy', responseTime: 32, uptime: 99.99, lastChecked: new Date().toISOString(), endpoint: '/api/v1/auth/health', description: 'User authentication and authorization service' },
    { id: '3', name: 'Payment Gateway', status: 'healthy', responseTime: 78, uptime: 99.95, lastChecked: new Date().toISOString(), endpoint: '/api/v1/payments/health', description: 'Payment processing and transaction service' },
    { id: '4', name: 'Database Cluster', status: 'healthy', responseTime: 23, uptime: 99.99, lastChecked: new Date().toISOString(), endpoint: '/api/v1/db/health', description: 'Primary database cluster for all data' },
    { id: '5', name: 'Redis Cache', status: 'degraded', responseTime: 89, uptime: 99.87, lastChecked: new Date().toISOString(), endpoint: '/api/v1/cache/health', description: 'Caching layer for improved performance' },
    { id: '6', name: 'Email Service', status: 'healthy', responseTime: 156, uptime: 99.92, lastChecked: new Date().toISOString(), endpoint: '/api/v1/email/health', description: 'Email notification and communication service' },
    { id: '7', name: 'CDN Network', status: 'healthy', responseTime: 34, uptime: 99.99, lastChecked: new Date().toISOString(), endpoint: '/api/v1/cdn/health', description: 'Content delivery network for static assets' },
    { id: '8', name: 'Search Service', status: 'warning', responseTime: 234, uptime: 99.78, lastChecked: new Date().toISOString(), endpoint: '/api/v1/search/health', description: 'Elasticsearch search and indexing service' }
  ]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchHealthData();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchHealthData, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        responseTime: Math.floor(Math.random() * 200) + 20,
        lastChecked: new Date().toISOString()
      })));
      setSystemHealth(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 500) + 1000,
        requestsPerMinute: Math.floor(Math.random() * 2000) + 2500
      }));
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
      healthy: { icon: FiCheckCircle, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
      degraded: { icon: FiAlertCircle, color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
      down: { icon: FiXCircle, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
      warning: { icon: FiAlertCircle, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' }
    };
    const config = configs[status];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} border ${config.border}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getOverallStatus = () => {
    const configs: Record<string, { icon: React.ElementType; color: string; bg: string; text: string }> = {
      healthy: { icon: FiCheckCircle, color: 'text-green-600', bg: 'bg-green-50', text: 'All systems operational' },
      degraded: { icon: FiAlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Partial system degradation' },
      down: { icon: FiXCircle, color: 'text-red-600', bg: 'bg-red-50', text: 'Major system outage' }
    };
    const config = configs[systemHealth.overall];
    const Icon = config.icon;
    return { Icon, ...config };
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleExport = () => {
    const exportData = filteredMetrics.map(metric => ({
      Service: metric.name,
      Status: metric.status,
      'Response Time (ms)': metric.responseTime,
      'Uptime (%)': metric.uptime,
      'Last Checked': new Date(metric.lastChecked).toLocaleString(),
      Endpoint: metric.endpoint
    }));
    
    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-health-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setSuccessMessage('Health report exported successfully');
    setShowSuccess(true);
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ];
    return csvRows.join('\n');
  };

  const filteredMetrics = metrics.filter(metric => {
    const matchesSearch = searchQuery === '' || 
      metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (metric.description && metric.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || metric.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      Header: 'Service',
      accessor: 'name',
      sortable: true,
      Cell: (row: HealthMetric) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <FiServer className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500 font-mono">{row.endpoint}</p>
            {row.description && <p className="text-xs text-gray-400 mt-0.5">{row.description}</p>}
          </div>
        </div>
      )
    },
    {
      Header: 'Status',
      accessor: 'status',
      sortable: true,
      Cell: (row: HealthMetric) => getStatusBadge(row.status)
    },
    {
      Header: 'Response Time',
      accessor: 'responseTime',
      sortable: true,
      Cell: (row: HealthMetric) => (
        <div className="flex items-center gap-2">
          <FiClock className="h-3 w-3 text-gray-400" />
          <span className={`font-semibold ${row.responseTime > 100 ? 'text-yellow-600' : row.responseTime > 200 ? 'text-red-600' : 'text-green-600'}`}>
            {row.responseTime}ms
          </span>
        </div>
      )
    },
    {
      Header: 'Uptime',
      accessor: 'uptime',
      sortable: true,
      Cell: (row: HealthMetric) => (
        <div className="flex flex-col">
          <span className="text-gray-700 font-medium">{row.uptime}%</span>
          <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
            <div 
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${row.uptime}%`, backgroundColor: row.uptime >= 99.9 ? '#10b981' : row.uptime >= 99 ? '#f59e0b' : '#ef4444' }}
            />
          </div>
        </div>
      )
    },
    {
      Header: 'Last Checked',
      accessor: 'lastChecked',
      sortable: true,
      Cell: (row: HealthMetric) => (
        <div className="text-sm">
          <div className="text-gray-600">{new Date(row.lastChecked).toLocaleDateString()}</div>
          <div className="text-xs text-gray-400">{new Date(row.lastChecked).toLocaleTimeString()}</div>
        </div>
      )
    }
  ];

  const overallStatus = getOverallStatus();
  const statusCounts = {
    healthy: metrics.filter(m => m.status === 'healthy').length,
    degraded: metrics.filter(m => m.status === 'degraded').length,
    warning: metrics.filter(m => m.status === 'warning').length,
    down: metrics.filter(m => m.status === 'down').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Gradient */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-deepTeal/5 to-transparent rounded-2xl" />
          <div className="relative flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-deepTeal to-deepTeal/80 shadow-lg">
                  <MdHealthAndSafety className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Platform Health</h1>
                  <p className="text-gray-500 mt-1">Monitor system health, service status, and performance metrics</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ReusableButton
                variant="secondary"
                size="sm"
                icon={FiRefreshCw}
                onClick={fetchHealthData}
                loading={loading}
              >
                Refresh
              </ReusableButton>
              <ReusableButton
                variant={autoRefresh ? "danger" : "secondary"}
                size="sm"
                icon={FiBell}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
              </ReusableButton>
            </div>
          </div>
        </div>

        {/* Overall Status Card */}
        <div className={`rounded-2xl p-6 mb-6 ${overallStatus.bg} border-2`} style={{ borderColor: `${deepTeal}30` }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white shadow-lg">
                <overallStatus.Icon className={`h-10 w-10 ${overallStatus.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">System Status: {systemHealth.overall.toUpperCase()}</h2>
                <p className="text-gray-600 mt-1">{overallStatus.text}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-green-600">✅ {statusCounts.healthy} Healthy</span>
                  <span className="text-xs text-yellow-600">⚠️ {statusCounts.warning} Warning</span>
                  <span className="text-xs text-orange-600">📉 {statusCounts.degraded} Degraded</span>
                  <span className="text-xs text-red-600">❌ {statusCounts.down} Down</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Uptime</span>
              <div className="p-2 bg-red-50 rounded-lg">
                <FiHeart className="h-4 w-4 text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemHealth.uptime}%</p>
            <p className="text-xs text-green-600 mt-1">Last 30 days</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Active Users</span>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiUsers className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemHealth.activeUsers.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <FiTrendingUp className="h-3 w-3" />
              +12% from yesterday
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Requests/min</span>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <FiZap className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemHealth.requestsPerMinute.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Peak: 4,200</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Error Rate</span>
              <div className="p-2 bg-red-50 rounded-lg">
                <FiAlertCircle className="h-4 w-4 text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemHealth.errorRate}%</p>
            <p className="text-xs text-green-600 mt-1">Below threshold (0.05%)</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Last Incident</span>
              <div className="p-2 bg-gray-100 rounded-lg">
                <FiCalendar className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            <p className="text-lg font-medium text-gray-900">
              {systemHealth.lastIncident || 'No incidents'}
            </p>
            <p className="text-xs text-green-600 mt-1">All systems stable</p>
          </div>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by service name, endpoint, or description..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none bg-gray-50 hover:bg-white transition-all"
                  style={{ focusRingColor: deepTeal }}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                  showFilters || statusFilter !== 'all'
                    ? 'bg-deepTeal text-white border-deepTeal'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FiFilter className="h-4 w-4" />
                Filters
                {(statusFilter !== 'all') && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                    1
                  </span>
                )}
              </button>

              <ReusableButton size="md" variant="secondary" icon={FiDownload} onClick={handleExport}>
                Export Report
              </ReusableButton>
            </div>
          </div>

          {/* Expandable Filters Panel */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 animate-slideDown">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    statusFilter === 'all'
                      ? 'bg-deepTeal text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  All ({metrics.length})
                </button>
                <button
                  onClick={() => setStatusFilter('healthy')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                    statusFilter === 'healthy'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'
                  }`}
                >
                  <FiCheckCircle className="h-3 w-3" />
                  Healthy ({statusCounts.healthy})
                </button>
                <button
                  onClick={() => setStatusFilter('warning')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                    statusFilter === 'warning'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  <FiAlertCircle className="h-3 w-3" />
                  Warning ({statusCounts.warning})
                </button>
                <button
                  onClick={() => setStatusFilter('degraded')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                    statusFilter === 'degraded'
                      ? 'bg-yellow-500 text-white shadow-sm'
                      : 'bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50'
                  }`}
                >
                  <FiAlertCircle className="h-3 w-3" />
                  Degraded ({statusCounts.degraded})
                </button>
                <button
                  onClick={() => setStatusFilter('down')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                    statusFilter === 'down'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                  }`}
                >
                  <FiXCircle className="h-3 w-3" />
                  Down ({statusCounts.down})
                </button>
                
                {statusFilter !== 'all' && (
                  <button
                    onClick={clearSearch}
                    className="ml-auto text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <FiX className="h-3 w-3" />
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Search Results Info */}
          {searchQuery && (
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 text-sm text-blue-700 flex items-center justify-between">
              <span>
                🔍 Found {filteredMetrics.length} result(s) for "{searchQuery}"
              </span>
              <button onClick={clearSearch} className="text-blue-600 hover:text-blue-800">
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiServer className="h-5 w-5" style={{ color: deepTeal }} />
                <h2 className="text-lg font-semibold text-gray-900">Service Health</h2>
                <span className="text-sm text-gray-500 ml-2">
                  ({filteredMetrics.length} of {metrics.length} services)
                </span>
              </div>
              {filteredMetrics.length !== metrics.length && (
                <button
                  onClick={clearSearch}
                  className="text-sm text-deepTeal hover:underline"
                >
                  Show all services
                </button>
              )}
            </div>
          </div>
          <ReusableTable
            columns={columns}
            data={filteredMetrics}
            showSearch={false}
            showExport={false}
            showPrint={false}
            itemsPerPage={10}
          />
        </div>
      </div>

      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
        title="Success"
        message={successMessage}
        duration={3000}
        position="top-right"
      />
    </div>
  );
};

export default PlatformHealth;