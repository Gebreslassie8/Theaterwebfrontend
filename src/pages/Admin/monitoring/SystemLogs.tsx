// src/pages/Admin/monitoring/SystemLogs.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Search,
  Download,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Clock,
  User,
  Activity,
  Server,
  RefreshCw,
  X,
  Copy,
  Archive,
  FilterX
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  source: string;
  message: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
}

const deepTeal = "#007590";

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock log data
  const mockLogs: SystemLog[] = [
    { id: '1', timestamp: new Date().toISOString(), level: 'info', source: 'Auth Service', message: 'User login successful', userId: 'user_123', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', details: 'Login from new device. Two-factor authentication bypassed.' },
    { id: '2', timestamp: new Date(Date.now() - 300000).toISOString(), level: 'warning', source: 'Payment Gateway', message: 'Payment processing delay detected', userId: 'user_456', ipAddress: '192.168.1.101', userAgent: 'Firefox/121.0', details: 'Stripe API response time exceeded 3 seconds. Retry logic triggered.' },
    { id: '3', timestamp: new Date(Date.now() - 600000).toISOString(), level: 'error', source: 'Database', message: 'Connection pool timeout', ipAddress: 'localhost', userAgent: 'System', details: 'Connection pool exhausted. Active connections: 100/100. Query optimization recommended.' },
    { id: '4', timestamp: new Date(Date.now() - 900000).toISOString(), level: 'info', source: 'API Gateway', message: 'New theater registration submitted', userId: 'theater_789', ipAddress: '192.168.1.102', userAgent: 'Postman/10.0', details: 'Registration data validated. Awaiting admin approval.' },
    { id: '5', timestamp: new Date(Date.now() - 1200000).toISOString(), level: 'warning', source: 'Cache Service', message: 'Redis memory usage above 80%', ipAddress: 'localhost', userAgent: 'System', details: 'Current memory usage: 82%. Consider scaling up or clearing old cache.' },
    { id: '6', timestamp: new Date(Date.now() - 1800000).toISOString(), level: 'info', source: 'Email Service', message: 'Welcome email sent to new theater', userId: 'theater_101', ipAddress: '192.168.1.103', userAgent: 'NodeMailer', details: 'Email delivered successfully. Open rate tracking enabled.' },
    { id: '7', timestamp: new Date(Date.now() - 2400000).toISOString(), level: 'error', source: 'Search Service', message: 'Elasticsearch indexing failed', ipAddress: 'localhost', userAgent: 'System', details: 'Indexing timeout for document ID: movie_12345. Check Elasticsearch cluster health.' },
    { id: '8', timestamp: new Date(Date.now() - 3600000).toISOString(), level: 'info', source: 'Auth Service', message: 'Password reset requested', userId: 'user_202', ipAddress: '192.168.1.104', userAgent: 'Safari/17.0', details: 'Reset link sent to registered email. Link expires in 1 hour.' },
    { id: '9', timestamp: new Date(Date.now() - 7200000).toISOString(), level: 'error', source: 'Payment Gateway', message: 'Payment verification failed', userId: 'user_303', ipAddress: '192.168.1.105', userAgent: 'Chrome/120.0', details: 'Card declined by bank. Error code: 2005.' },
    { id: '10', timestamp: new Date(Date.now() - 10800000).toISOString(), level: 'warning', source: 'Database', message: 'Slow query detected', ipAddress: 'localhost', userAgent: 'System', details: 'Query took 5.2 seconds. Table: bookings. Missing index on created_at column.' }
  ];

  useEffect(() => {
    fetchLogs();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelBadge = (level: string) => {
    const configs: Record<string, { icon: any; color: string; bg: string; border: string }> = {
      info: { icon: Info, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
      warning: { icon: AlertTriangle, color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
      error: { icon: AlertCircle, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
      debug: { icon: Activity, color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200' }
    };
    const config = configs[level];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} border ${config.border}`}>
        <Icon className="h-3 w-3" />
        {level.toUpperCase()}
      </span>
    );
  };

  const handleExport = () => {
    const exportData = filteredLogs.map(log => ({
      Timestamp: new Date(log.timestamp).toLocaleString(),
      Level: log.level,
      Source: log.source,
      Message: log.message,
      UserId: log.userId || 'N/A',
      IP: log.ipAddress || 'N/A',
      UserAgent: log.userAgent || 'N/A'
    }));
    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setSuccessMessage('Logs exported successfully');
    setShowSuccess(true);
  };

  const handleCopyLog = (log: SystemLog) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setSuccessMessage('Log copied to clipboard');
    setShowSuccess(true);
  };

  const handleArchiveLogs = () => {
    if (selectedLogs.length === 0) {
      setSuccessMessage('Please select logs to archive');
      setShowSuccess(true);
      return;
    }
    setLogs(logs.filter(log => !selectedLogs.includes(log.id)));
    setSelectedLogs([]);
    setSuccessMessage(`${selectedLogs.length} log(s) archived successfully`);
    setShowSuccess(true);
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setLogs([]);
      setSelectedLogs([]);
      setSuccessMessage('All logs cleared successfully');
      setShowSuccess(true);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterLevel('all');
    setFilterSource('all');
    setDateRange('today');
    setSuccessMessage('Filters cleared');
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

  const handleSelectLog = (id: string) => {
    setSelectedLogs(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getDateFilter = (date: Date) => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return date >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return date >= monthAgo;
      default:
        return true;
    }
  };

  const sources = ['all', ...Array.from(new Set(logs.map(l => l.source)))];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userId && log.userId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesSource = filterSource === 'all' || log.source === filterSource;
    const matchesDate = getDateFilter(new Date(log.timestamp));
    return matchesSearch && matchesLevel && matchesSource && matchesDate;
  });

  const levelCounts = {
    total: logs.length,
    info: logs.filter(l => l.level === 'info').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error: logs.filter(l => l.level === 'error').length,
    debug: logs.filter(l => l.level === 'debug').length
  };

  const columns = [
    {
      Header: '',
      accessor: 'select',
      sortable: false,
      width: '50px',
      Cell: (row: SystemLog) => (
        <input
          type="checkbox"
          checked={selectedLogs.includes(row.id)}
          onChange={() => handleSelectLog(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-deepTeal focus:ring-deepTeal cursor-pointer"
        />
      )
    },
    {
      Header: 'Timestamp',
      accessor: 'timestamp',
      sortable: true,
      Cell: (row: SystemLog) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{new Date(row.timestamp).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(row.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      Header: 'Level',
      accessor: 'level',
      sortable: true,
      Cell: (row: SystemLog) => getLevelBadge(row.level)
    },
    {
      Header: 'Source',
      accessor: 'source',
      sortable: true,
      Cell: (row: SystemLog) => (
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-gray-100">
            <Server className="h-3 w-3 text-gray-500" />
          </div>
          <span className="text-sm font-medium text-gray-700">{row.source}</span>
        </div>
      )
    },
    {
      Header: 'Message',
      accessor: 'message',
      sortable: true,
      Cell: (row: SystemLog) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-700 truncate">{row.message}</p>
          {row.userId && (
            <div className="flex items-center gap-1 mt-0.5">
              <User className="h-3 w-3 text-gray-400" />
              <p className="text-xs text-gray-500">{row.userId}</p>
            </div>
          )}
        </div>
      )
    },
    {
      Header: 'Actions',
      accessor: 'id',
      sortable: false,
      width: '100px',
      Cell: (row: SystemLog) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setSelectedLog(row); setShowDetails(true); }}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleCopyLog(row)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Copy Log"
          >
            <Copy className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-deepTeal/5 to-transparent rounded-2xl" />
          <div className="relative flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-deepTeal to-deepTeal/80 shadow-lg">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
                  <p className="text-gray-500 mt-1">View, analyze, and manage system events and activities</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ReusableButton
                size="sm"
                variant={autoRefresh ? "danger" : "secondary"}
                icon={RefreshCw}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
              </ReusableButton>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total Logs</span>
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{levelCounts.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Errors</span>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">{levelCounts.error}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Warnings</span>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{levelCounts.warning}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Info</span>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">{levelCounts.info}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Debug</span>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">{levelCounts.debug}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by message, source, or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent bg-gray-50 hover:bg-white transition-colors outline-none"
              />
            </div>

            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-colors cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="debug">Debug</option>
            </select>

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-colors cursor-pointer min-w-[150px]"
            >
              {sources.map(source => (
                <option key={source} value={source}>
                  {source === 'all' ? 'All Sources' : source}
                </option>
              ))}
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-colors cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>

            <ReusableButton size="md" variant="secondary" icon={Download} onClick={handleExport}>
              Export
            </ReusableButton>

            <ReusableButton size="md" variant="secondary" icon={Archive} onClick={handleArchiveLogs}>
              Archive Selected
            </ReusableButton>

            <ReusableButton size="md" variant="danger" icon={Trash2} onClick={handleClearLogs}>
              Clear All
            </ReusableButton>

            <ReusableButton size="md" variant="secondary" icon={FilterX} onClick={handleClearFilters}>
              Clear Filters
            </ReusableButton>
          </div>

          {/* Selected logs indicator */}
          {selectedLogs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-deepTeal" />
                <span className="text-sm text-gray-600">{selectedLogs.length} log(s) selected</span>
              </div>
              <button
                onClick={() => setSelectedLogs([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {filteredLogs.length} of {logs.length} logs
              </div>
            </div>
          </div>
          <ReusableTable
            columns={columns}
            data={filteredLogs}
            showSearch={false}
            showExport={false}
            showPrint={false}
            itemsPerPage={15}
          />
        </div>

        {/* Log Details Modal */}
        <AnimatePresence>
          {showDetails && selectedLog && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              >
                <div className="sticky top-0 bg-gradient-to-r from-deepTeal to-deepTeal/90 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Log Details</h2>
                      <p className="text-white/80 text-sm">ID: {selectedLog.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-80px)]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Timestamp</label>
                      <p className="font-medium text-gray-900 mt-1">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Level</label>
                      <div className="mt-1">{getLevelBadge(selectedLog.level)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Source</label>
                      <p className="font-medium text-gray-900 mt-1">{selectedLog.source}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="text-xs text-gray-500 uppercase tracking-wide">User ID</label>
                      <p className="font-medium text-gray-900 mt-1 font-mono">{selectedLog.userId || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="text-xs text-gray-500 uppercase tracking-wide">IP Address</label>
                      <p className="font-medium text-gray-900 mt-1 font-mono">{selectedLog.ipAddress || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <label className="text-xs text-gray-500 uppercase tracking-wide">User Agent</label>
                      <p className="font-medium text-gray-900 mt-1 text-sm">{selectedLog.userAgent || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Message</label>
                    <p className="mt-2 text-gray-800">{selectedLog.message}</p>
                  </div>

                  {selectedLog.details && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <label className="text-xs text-blue-600 uppercase tracking-wide flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Additional Details
                      </label>
                      <p className="mt-2 text-sm text-blue-800">{selectedLog.details}</p>
                    </div>
                  )}
                </div>

                <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
                  <ReusableButton variant="secondary" onClick={() => handleCopyLog(selectedLog)}>
                    Copy Log
                  </ReusableButton>
                  <ReusableButton variant="secondary" onClick={() => setShowDetails(false)}>
                    Close
                  </ReusableButton>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
    </div>
  );
};

export default SystemLogs;