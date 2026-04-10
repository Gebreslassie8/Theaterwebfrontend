// src/pages/Admin/monitoring/Performance.tsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Activity, Server, 
  Database, Clock, Zap, Cpu, HardDrive, Wifi, RefreshCw,
  Calendar, Download, Eye, ChevronRight, AlertCircle, 
  CheckCircle, Shield, Target, Gauge
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis, ComposedChart
} from 'recharts';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

const deepTeal = "#007590";

const Performance: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 28,
    responseTime: 156,
    throughput: 1250
  });

  const performanceData = [
    { time: '00:00', cpu: 32, memory: 58, responseTime: 120, requests: 2340, errorRate: 0.02 },
    { time: '04:00', cpu: 28, memory: 55, responseTime: 110, requests: 1890, errorRate: 0.01 },
    { time: '08:00', cpu: 45, memory: 62, responseTime: 145, requests: 3450, errorRate: 0.03 },
    { time: '12:00', cpu: 68, memory: 75, responseTime: 189, requests: 5670, errorRate: 0.05 },
    { time: '16:00', cpu: 72, memory: 78, responseTime: 201, requests: 6230, errorRate: 0.08 },
    { time: '20:00', cpu: 55, memory: 68, responseTime: 167, requests: 4560, errorRate: 0.04 },
    { time: '23:00', cpu: 38, memory: 60, responseTime: 134, requests: 2980, errorRate: 0.02 }
  ];

  const endpointPerformance = [
    { endpoint: '/api/auth/login', avgTime: 45, p95: 78, p99: 95, requests: 12500, status: 'healthy' },
    { endpoint: '/api/theaters/list', avgTime: 32, p95: 56, p99: 72, requests: 45200, status: 'healthy' },
    { endpoint: '/api/movies/showtimes', avgTime: 28, p95: 48, p99: 65, requests: 38700, status: 'healthy' },
    { endpoint: '/api/bookings/create', avgTime: 89, p95: 145, p99: 189, requests: 8920, status: 'warning' },
    { endpoint: '/api/payments/process', avgTime: 156, p95: 234, p99: 312, requests: 7650, status: 'critical' }
  ];

  const healthScore = {
    score: 94,
    cpu: 82,
    memory: 76,
    response: 88,
    uptime: 99.98
  };

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMetrics({
        cpu: Math.floor(Math.random() * 40) + 30,
        memory: Math.floor(Math.random() * 30) + 50,
        disk: Math.floor(Math.random() * 20) + 30,
        network: Math.floor(Math.random() * 30) + 20,
        responseTime: Math.floor(Math.random() * 100) + 100,
        throughput: Math.floor(Math.random() * 1000) + 800
      });
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} className="text-sm" style={{ color: p.color }}>
              {p.name}: {p.value}{p.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const MetricCard: React.FC<{ 
    title: string; 
    value: number; 
    unit: string; 
    icon: React.ReactNode; 
    trend?: number; 
    color: string;
    description?: string;
    target?: number;
  }> = ({ title, value, unit, icon, trend, color, description, target }) => (
    <div 
      className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setSelectedMetric(title)}
      onMouseLeave={() => setSelectedMetric(null)}
      style={{ transform: selectedMetric === title ? 'translateY(-2px)' : 'translateY(0)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="p-2 rounded-xl transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${color}15` }}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      {target && (
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Target</span>
            <span className="text-gray-700">{target}{unit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((value / target) * 100, 100)}%`, backgroundColor: color }}
            />
          </div>
        </div>
      )}
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
          {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{Math.abs(trend)}% from last hour</span>
        </div>
      )}
    </div>
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'critical': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
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
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Performance Monitoring</h1>
                  <p className="text-gray-500 mt-1">Monitor system performance, resource usage, and API metrics</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm text-sm focus:ring-2 focus:outline-none shadow-sm"
                style={{ focusRingColor: deepTeal }}
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <ReusableButton size="md" variant="secondary" icon={RefreshCw} onClick={fetchPerformanceData} loading={loading}>
                Refresh
              </ReusableButton>
            </div>
          </div>
        </div>

        {/* Health Score Card */}
        <div className="bg-gradient-to-r from-deepTeal to-teal-700 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-white/80 text-sm font-medium">Overall Health Score</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{healthScore.score}</span>
                  <span className="text-white/60 text-lg">/100</span>
                </div>
                <p className="text-white/70 text-sm mt-1">All systems operating normally</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-white/70 text-xs">CPU Health</p>
                <p className="text-2xl font-bold text-white">{healthScore.cpu}%</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-xs">Memory Health</p>
                <p className="text-2xl font-bold text-white">{healthScore.memory}%</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-xs">Response Health</p>
                <p className="text-2xl font-bold text-white">{healthScore.response}%</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-xs">Uptime</p>
                <p className="text-2xl font-bold text-white">{healthScore.uptime}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
          <MetricCard 
            title="CPU Usage" 
            value={metrics.cpu} 
            unit="%" 
            icon={<Cpu className="h-5 w-5" style={{ color: deepTeal }} />} 
            trend={+5} 
            color={deepTeal}
            description="Processing power utilization"
            target={80}
          />
          <MetricCard 
            title="Memory Usage" 
            value={metrics.memory} 
            unit="%" 
            icon={<Database className="h-5 w-5" style={{ color: deepTeal }} />} 
            trend={-2} 
            color={deepTeal}
            description="RAM consumption"
            target={85}
          />
          <MetricCard 
            title="Disk Usage" 
            value={metrics.disk} 
            unit="%" 
            icon={<HardDrive className="h-5 w-5" style={{ color: deepTeal }} />} 
            trend={+1} 
            color={deepTeal}
            description="Storage utilization"
            target={90}
          />
          <MetricCard 
            title="Network I/O" 
            value={metrics.network} 
            unit="Mbps" 
            icon={<Wifi className="h-5 w-5" style={{ color: deepTeal }} />} 
            trend={+8} 
            color={deepTeal}
            description="Bandwidth usage"
            target={100}
          />
          <MetricCard 
            title="Response Time" 
            value={metrics.responseTime} 
            unit="ms" 
            icon={<Clock className="h-5 w-5" style={{ color: deepTeal }} />} 
            trend={+12} 
            color={deepTeal}
            description="API latency"
            target={200}
          />
          <MetricCard 
            title="Throughput" 
            value={metrics.throughput} 
            unit="rps" 
            icon={<Zap className="h-5 w-5" style={{ color: deepTeal }} />} 
            trend={-3} 
            color={deepTeal}
            description="Requests per second"
            target={2000}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* CPU & Memory Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5" style={{ color: deepTeal }} />
                CPU & Memory Usage
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
                  <span className="text-xs text-gray-500">CPU</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#82ca9d]" />
                  <span className="text-xs text-gray-500">Memory</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cpu" stroke="#8884d8" fill="url(#cpuGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="memory" stroke="#82ca9d" fill="url(#memoryGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Response Time & Error Rate Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Gauge className="h-5 w-5" style={{ color: deepTeal }} />
                Response Time & Error Rate
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis yAxisId="left" stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="responseTime" name="Response Time (ms)" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="errorRate" name="Error Rate (%)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Rate Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-5 w-5" style={{ color: deepTeal }} />
              Request Rate (Requests per minute)
            </h3>
            <div className="text-sm text-gray-500">
              Peak: <span className="font-semibold text-deepTeal">6,230</span> requests
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="requests" 
                name="Requests" 
                fill={deepTeal} 
                radius={[8, 8, 0, 0]}
                onMouseEnter={(data) => console.log(data)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Endpoint Performance Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" style={{ color: deepTeal }} />
              <h3 className="text-lg font-semibold text-gray-900">API Endpoint Performance</h3>
            </div>
            <ReusableButton size="sm" variant="secondary" icon={Download} onClick={handleExport}>
              Export Metrics
            </ReusableButton>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">P95</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">P99</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requests</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {endpointPerformance.map((endpoint, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-3 text-sm font-mono text-gray-700">{endpoint.endpoint}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(endpoint.status)}`}>
                        {getStatusIcon(endpoint.status)}
                        {endpoint.status.charAt(0).toUpperCase() + endpoint.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`font-semibold ${
                        endpoint.avgTime > 100 ? 'text-yellow-600' : 
                        endpoint.avgTime > 150 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {endpoint.avgTime}ms
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{endpoint.p95}ms</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{endpoint.p99}ms</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{endpoint.requests.toLocaleString()}</td>
                    <td className="px-6 py-3">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-deepTeal/10 hover:bg-deepTeal/20">
                        <Eye className="h-4 w-4" style={{ color: deepTeal }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">System Health</span>
            </div>
            <p className="text-xs text-green-600">All core systems are operating within normal parameters</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">Attention Needed</span>
            </div>
            <p className="text-xs text-yellow-600">Payment endpoint latency is above acceptable threshold</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Peak Hours</span>
            </div>
            <p className="text-xs text-blue-600">Peak traffic occurs between 4PM - 8PM daily</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">SLA Status</span>
            </div>
            <p className="text-xs text-purple-600">99.98% uptime - Exceeding 99.9% SLA target</p>
          </div>
        </div>
      </div>

      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
        title="Exported"
        message="Performance data exported successfully"
        duration={3000}
        position="top-right"
      />
    </div>
  );
};

export default Performance;