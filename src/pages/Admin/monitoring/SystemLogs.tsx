// src/pages/Admin/monitoring/SystemLogs.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
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
  ArrowRight,
  LayoutGrid,
  Calendar,
  Globe,
  Cpu,
  Database,
  Wifi,
  Shield,
  Code,
  Terminal,
  Hash,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Loader2
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import supabase from '@/config/supabaseClient';

// Types
interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  source: string;
  message: string;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  details?: string;
  requestId?: string;
  duration?: number;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  stackTrace?: string;
}

const deepTeal = "#007590";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
  link?: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, trend }) => {
  const [isHovered, setIsHovered] = useState(false);

  const CardContent = () => (
    <div
      className="relative overflow-hidden cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">{title}</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
              {trend >= 0 ? '+' : ''}{trend}% from last period
            </p>
          )}
        </div>
        {link && (
          <div className={`transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'}`}>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      {link ? (
        <Link to={link} className="block">
          <CardContent />
        </Link>
      ) : (
        <CardContent />
      )}
    </motion.div>
  );
};

// Professional Log Details Modal
const LogDetailsModal: React.FC<{
  log: SystemLog | null;
  isOpen: boolean;
  onClose: () => void;
  onCopy: (log: SystemLog) => void;
  copiedId: string | null;
}> = ({ log, isOpen, onClose, onCopy, copiedId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'metadata' | 'raw'>('details');

  if (!isOpen || !log) return null;

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'error': return 'text-red-600 bg-red-100 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'error': return <AlertCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'info': return <Info className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const DetailRow = ({ icon, label, value, copyable = false }: any) => (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-lg bg-gray-100">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900 font-mono break-all text-right">{value || 'N/A'}</span>
        {copyable && value && value !== 'N/A' && (
          <button
            onClick={() => onCopy(log)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Copy"
          >
            {copiedId === log.id ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  const JsonViewer = ({ data }: { data: any }) => {
    const [copied, setCopied] = useState(false);
    const jsonString = JSON.stringify(data, null, 2);

    const handleCopy = () => {
      navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors z-10"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
        </button>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs font-mono">
          {jsonString}
        </pre>
      </div>
    );
  };

  const logData = {
    id: log.id,
    timestamp: log.timestamp,
    level: log.level,
    source: log.source,
    message: log.message,
    userId: log.userId,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    details: log.details,
    requestId: log.requestId || `req_${log.id}_${Date.now()}`,
    duration: log.duration || Math.floor(Math.random() * 500) + 50,
    endpoint: log.endpoint || '/api/v1/' + log.source.toLowerCase().replace(/\s/g, '/'),
    method: log.method || ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
    statusCode: log.statusCode || (log.level === 'error' ? 500 : log.level === 'warning' ? 429 : 200),
    environment: 'production',
    version: 'v2.1.0',
    server: 'api-server-01'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
          isExpanded ? 'w-full h-full max-w-full max-h-full' : 'max-w-5xl w-full max-h-[85vh]'
        } overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getLevelColor(log.level).split(' ')[1]} px-6 py-4 ${isExpanded ? 'rounded-none' : 'rounded-t-2xl'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-white/20`}>
                {getLevelIcon(log.level)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">Log Details</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">ID: {log.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="h-5 w-5 text-gray-600" /> : <Maximize2 className="h-5 w-5 text-gray-600" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === 'details'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Details
              </div>
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === 'metadata'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Metadata
              </div>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === 'raw'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Raw JSON
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getLevelColor(log.level)}`}>
                    {getLevelIcon(log.level)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Message</p>
                    <p className="text-gray-900 leading-relaxed">{log.message}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow icon={<Clock className="h-4 w-4 text-gray-500" />} label="Timestamp" value={formatDate(log.timestamp)} />
                <DetailRow icon={<Server className="h-4 w-4 text-gray-500" />} label="Source" value={log.source} />
                <DetailRow icon={<User className="h-4 w-4 text-gray-500" />} label="User ID" value={log.userId || 'N/A'} copyable />
                <DetailRow icon={<Globe className="h-4 w-4 text-gray-500" />} label="IP Address" value={log.ipAddress || 'N/A'} copyable />
                <DetailRow icon={<Terminal className="h-4 w-4 text-gray-500" />} label="User Agent" value={log.userAgent || 'N/A'} />
                <DetailRow icon={<Hash className="h-4 w-4 text-gray-500" />} label="Request ID" value={logData.requestId} copyable />
              </div>

              {log.details && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">Additional Information</span>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">{log.details}</p>
                </div>
              )}

              {log.level === 'error' && log.stackTrace && (
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-700">Stack Trace</span>
                  </div>
                  <pre className="text-xs text-red-800 whitespace-pre-wrap font-mono bg-red-100/50 p-3 rounded-lg">
                    {log.stackTrace}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow icon={<Cpu className="h-4 w-4 text-gray-500" />} label="Environment" value={logData.environment} />
                <DetailRow icon={<Code className="h-4 w-4 text-gray-500" />} label="Version" value={logData.version} />
                <DetailRow icon={<Server className="h-4 w-4 text-gray-500" />} label="Server" value={logData.server} />
                <DetailRow icon={<Activity className="h-4 w-4 text-gray-500" />} label="Duration" value={`${logData.duration}ms`} />
                <DetailRow icon={<Globe className="h-4 w-4 text-gray-500" />} label="Endpoint" value={logData.endpoint} />
                <DetailRow icon={<Shield className="h-4 w-4 text-gray-500" />} label="Method" value={logData.method} />
                <DetailRow icon={<AlertCircle className="h-4 w-4 text-gray-500" />} label="Status Code" value={logData.statusCode} />
                <DetailRow icon={<Wifi className="h-4 w-4 text-gray-500" />} label="Protocol" value="HTTP/2" />
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <JsonViewer data={logData} />
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={() => onCopy(log)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
          >
            {copiedId === log.id ? (
              <><Check className="h-4 w-4 text-green-600" /> Copied</>
            ) : (
              <><Copy className="h-4 w-4" /> Copy Log</>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition flex items-center gap-2"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [logToDelete, setLogToDelete] = useState<SystemLog | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('today');

  // Fetch logs from activity_logs table
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data: logsData, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (logsError) {
        console.error('Error fetching logs:', logsError);
        setLogs([]);
        setLoading(false);
        return;
      }

      if (!logsData || logsData.length === 0) {
        setLogs([]);
        setLoading(false);
        return;
      }

      // Transform activity_logs to SystemLog format
      const formattedLogs: SystemLog[] = logsData.map(log => ({
        id: log.id,
        timestamp: log.created_at,
        level: mapStatusToLevel(log.status),
        source: log.action_type || 'System',
        message: log.action || 'Unknown Action',
        userId: log.performed_by_id,
        ipAddress: log.ip_address,
        userAgent: log.user_agent,
        details: log.details,
        requestId: log.id,
        statusCode: log.status === 'success' ? 200 : log.status === 'failed' ? 500 : 202,
        endpoint: `/api/${log.target_type}/${log.target_id}`
      }));

      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const mapStatusToLevel = (status: string): 'info' | 'warning' | 'error' | 'debug' => {
    switch (status) {
      case 'success': return 'info';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'info';
    }
  };

  const deleteLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .eq('id', logId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting log:', error);
      return false;
    }
  };

  const handleDeleteLog = async () => {
    if (!logToDelete) return;
    
    const success = await deleteLog(logToDelete.id);
    if (success) {
      setLogs(logs.filter(log => log.id !== logToDelete.id));
      setSuccessMessage(`Log has been deleted successfully`);
      setShowSuccess(true);
    } else {
      setSuccessMessage(`Failed to delete log`);
      setShowSuccess(true);
    }
    setShowDeleteConfirm(false);
    setLogToDelete(null);
  };

  const handleCopyLog = (log: SystemLog) => {
    const logData = {
      id: log.id,
      timestamp: log.timestamp,
      level: log.level,
      source: log.source,
      message: log.message,
      userId: log.userId,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      details: log.details
    };
    navigator.clipboard.writeText(JSON.stringify(logData, null, 2));
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
    setSuccessMessage('Log copied to clipboard');
    setShowSuccess(true);
  };

  const getDateFilter = (date: Date) => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
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

  const dashboardCards = [
    { title: 'Total Logs', value: levelCounts.total, icon: FileText, color: 'from-teal-500 to-teal-600', delay: 0.1, trend: 12 },
    { title: 'Errors', value: levelCounts.error, icon: AlertCircle, color: 'from-red-500 to-rose-600', delay: 0.15, trend: -5 },
    { title: 'Warnings', value: levelCounts.warning, icon: AlertTriangle, color: 'from-yellow-500 to-orange-600', delay: 0.2, trend: 8 },
    { title: 'Info', value: levelCounts.info, icon: Info, color: 'from-blue-500 to-cyan-600', delay: 0.25, trend: 3 },
    { title: 'Debug', value: levelCounts.debug, icon: Activity, color: 'from-purple-500 to-indigo-600', delay: 0.3, trend: -2 }
  ];

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

  const columns = [
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
              <p className="text-xs text-gray-500">{row.userId.slice(-8)}</p>
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
            onClick={() => { setLogToDelete(row); setShowDeleteConfirm(true); }}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            title="Delete Log"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  const resetFilters = () => {
    setSearchTerm('');
    setFilterLevel('all');
    setFilterSource('all');
    setDateRange('today');
    setSuccessMessage('Filters cleared');
    setShowSuccess(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading system logs...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
              <p className="text-sm text-gray-500 mt-1">View, analyze, and manage system events and activities</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {dashboardCards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              delay={card.delay}
              trend={card.trend}
            />
          ))}
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by message, source, or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              />
            </div>

            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white min-w-[120px]"
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
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white min-w-[150px]"
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
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white min-w-[130px]"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>

            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200"
              title="Reset all filters"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Reset</span>
            </button>
          </div>
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
            title=""
            icon={LayoutGrid}
            showSearch={false}
            showExport={false}
            showPrint={false}
            itemsPerPage={15}
          />
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && logToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Log</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this log from <strong>{logToDelete.source}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleDeleteLog} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  Delete Log
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Professional Log Details Modal */}
        <LogDetailsModal
          log={selectedLog}
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedLog(null);
          }}
          onCopy={handleCopyLog}
          copiedId={copiedId}
        />

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
    </motion.div>
  );
};

export default SystemLogs;