// src/pages/Admin/monitoring/ActivityLogs.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    History,
    User,
    Shield,
    Settings,
    Calendar,
    Clock,
    Search,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    LogIn,
    LogOut,
    UserPlus,
    Edit,
    Trash2,
    ShieldAlert,
    X,
    Loader2,
    Ban,
    UserCheck,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import supabase from '@/config/supabaseClient';

// Types
interface ActivityLog {
    id: string;
    action: string;
    actionType: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'permission_change' | 'role_change' | 'settings_change' | 'user_block' | 'user_unblock';
    performedBy: string;
    performedByRole: string;
    performedById: string;
    target: string;
    targetId: string;
    targetType: 'user' | 'role' | 'theater' | 'show' | 'payment' | 'settings' | 'event';
    details: string;
    ipAddress: string;
    userAgent: string;
    timestamp: string;
    status: 'success' | 'failed' | 'pending';
    location?: string;
    device?: string;
    oldData?: any;
    newData?: any;
}

interface ActivityStats {
    totalLogs: number;
    todayLogs: number;
    successLogs: number;
    failedLogs: number;
    pendingLogs: number;
}

interface UserForAction {
    id: string;
    email: string;
    full_name: string;
    role: string;
    status: string;
}

// ============================================
// LOG ACTIVITY FUNCTION
// ============================================
export const logActivity = async (data: {
    action: string;
    actionType: ActivityLog['actionType'];
    targetType: ActivityLog['targetType'];
    targetId: string;
    targetName: string;
    details: string;
    status: ActivityLog['status'];
    oldData?: any;
    newData?: any;
}) => {
    try {
        const storedUser = JSON.parse(
            localStorage.getItem('user') || sessionStorage.getItem('user') || 'null'
        );
        
        const userAgent = navigator.userAgent;
        let ipAddress = 'Unknown';
        
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            ipAddress = ipData.ip;
        } catch (error) {
            console.error('Error getting IP:', error);
        }
        
        const { error } = await supabase
            .from('activity_logs')
            .insert({
                action: data.action,
                action_type: data.actionType,
                performed_by_id: storedUser?.id,
                target_type: data.targetType,
                target_id: data.targetId,
                target_name: data.targetName,
                details: data.details,
                ip_address: ipAddress,
                user_agent: userAgent,
                status: data.status,
                old_data: data.oldData,
                new_data: data.newData,
                device: /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent) ? 'Mobile' : 'Desktop',
                created_at: new Date().toISOString()
            });
        
        if (error) console.error('Error logging activity:', error);
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

// Function to block/unblock user (using 'inactive' status instead of 'blocked')
export const toggleUserStatus = async (userId: string, currentStatus: string, reason: string, adminId: string, adminName: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'inactive' ? 'User Blocked' : 'User Unblocked';
    const actionType = newStatus === 'inactive' ? 'user_block' : 'user_unblock';
    
    try {
        const { error: updateError } = await supabase
            .from('users')
            .update({ 
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        
        if (updateError) throw updateError;
        
        const { data: userData } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', userId)
            .single();
        
        await logActivity({
            action: action,
            actionType: actionType,
            targetType: 'user',
            targetId: userId,
            targetName: userData?.email || userId,
            details: `${action} by ${adminName}. Reason: ${reason}`,
            status: 'success',
            oldData: { status: currentStatus },
            newData: { status: newStatus }
        });
        
        return { success: true, newStatus };
    } catch (error) {
        console.error('Error toggling user status:', error);
        return { success: false, error };
    }
};

const ActivityLogs: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [users, setUsers] = useState<UserForAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActionType, setFilterActionType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [logToDelete, setLogToDelete] = useState<ActivityLog | null>(null);
    const [showUserActionModal, setShowUserActionModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserForAction | null>(null);
    const [blockReason, setBlockReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('today');
    const [stats, setStats] = useState<ActivityStats>({
        totalLogs: 0,
        todayLogs: 0,
        successLogs: 0,
        failedLogs: 0,
        pendingLogs: 0
    });
    const [currentAdmin, setCurrentAdmin] = useState<{ id: string; name: string }>({ id: '', name: '' });

    useEffect(() => {
        fetchCurrentAdmin();
        fetchActivityLogs();
        fetchUsers();
    }, []);

    const fetchCurrentAdmin = () => {
        const storedUser = JSON.parse(
            localStorage.getItem('user') || sessionStorage.getItem('user') || 'null'
        );
        if (storedUser) {
            setCurrentAdmin({
                id: storedUser.id,
                name: storedUser.name || storedUser.full_name || 'Admin'
            });
        }
    };

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, email, full_name, role, status')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchActivityLogs = async () => {
        setIsLoading(true);
        try {
            const { data: logsData, error: logsError } = await supabase
                .from('activity_logs')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (logsError) {
                console.error('Error fetching logs:', logsError);
                setLogs([]);
                setStats({
                    totalLogs: 0,
                    todayLogs: 0,
                    successLogs: 0,
                    failedLogs: 0,
                    pendingLogs: 0
                });
                setIsLoading(false);
                return;
            }
            
            if (!logsData || logsData.length === 0) {
                setLogs([]);
                setStats({
                    totalLogs: 0,
                    todayLogs: 0,
                    successLogs: 0,
                    failedLogs: 0,
                    pendingLogs: 0
                });
                setIsLoading(false);
                return;
            }
            
            const logsWithUsers = await Promise.all(logsData.map(async (log) => {
                let performedBy = 'System';
                let performedByRole = 'System';
                
                if (log.performed_by_id) {
                    const { data: userData } = await supabase
                        .from('users')
                        .select('full_name, role')
                        .eq('id', log.performed_by_id)
                        .maybeSingle();
                    
                    if (userData) {
                        performedBy = userData.full_name || 'Unknown';
                        performedByRole = userData.role || 'Unknown';
                    }
                }
                
                return {
                    id: log.id,
                    action: log.action || 'Unknown Action',
                    actionType: log.action_type || 'create',
                    performedBy: performedBy,
                    performedByRole: performedByRole,
                    performedById: log.performed_by_id,
                    target: log.target_name || 'N/A',
                    targetId: log.target_id,
                    targetType: log.target_type || 'user',
                    details: log.details || 'No details provided',
                    ipAddress: log.ip_address || 'Unknown',
                    userAgent: log.user_agent || 'Unknown',
                    timestamp: log.created_at,
                    status: log.status || 'success',
                    location: log.location,
                    device: log.device,
                    oldData: log.old_data,
                    newData: log.new_data
                };
            }));
            
            setLogs(logsWithUsers);
            
            // Calculate stats
            const today = new Date().toDateString();
            setStats({
                totalLogs: logsWithUsers.length,
                todayLogs: logsWithUsers.filter(log => new Date(log.timestamp).toDateString() === today).length,
                successLogs: logsWithUsers.filter(log => log.status === 'success').length,
                failedLogs: logsWithUsers.filter(log => log.status === 'failed').length,
                pendingLogs: logsWithUsers.filter(log => log.status === 'pending').length
            });
            
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlockUser = async () => {
        if (!selectedUser) return;
        
        setIsProcessing(true);
        try {
            const result = await toggleUserStatus(
                selectedUser.id,
                selectedUser.status,
                blockReason || (selectedUser.status === 'active' ? 'Violation of terms' : 'Account reinstated'),
                currentAdmin.id,
                currentAdmin.name
            );
            
            if (result.success) {
                setPopupMessage({
                    title: result.newStatus === 'inactive' ? 'User Blocked' : 'User Unblocked',
                    message: `${selectedUser.full_name} has been ${result.newStatus === 'inactive' ? 'blocked' : 'unblocked'} successfully.`,
                    type: 'success'
                });
                await fetchUsers();
                await fetchActivityLogs();
            } else {
                throw new Error('Failed to update user status');
            }
        } catch (error) {
            setPopupMessage({
                title: 'Error',
                message: 'Failed to update user status',
                type: 'error'
            });
        } finally {
            setIsProcessing(false);
            setShowUserActionModal(false);
            setSelectedUser(null);
            setBlockReason('');
            setShowSuccessPopup(true);
        }
    };

    const handleDeleteLog = async () => {
        if (!logToDelete) return;
        
        try {
            const { error } = await supabase
                .from('activity_logs')
                .delete()
                .eq('id', logToDelete.id);
            
            if (error) throw error;
            
            setPopupMessage({
                title: 'Deleted!',
                message: `Log "${logToDelete.action}" has been deleted successfully`,
                type: 'success'
            });
            await fetchActivityLogs();
            
        } catch (error) {
            console.error('Error deleting log:', error);
            setPopupMessage({
                title: 'Error',
                message: 'Failed to delete log',
                type: 'error'
            });
        } finally {
            setShowDeleteConfirm(false);
            setLogToDelete(null);
            setShowSuccessPopup(true);
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterActionType('all');
        setFilterStatus('all');
        setDateRange('today');
        setPopupMessage({
            title: 'Filters Reset',
            message: 'All filters have been cleared',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const isWithinDateRange = (logDate: Date): boolean => {
        const now = new Date();
        switch (dateRange) {
            case 'today':
                return logDate.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return logDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(now);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return logDate >= monthAgo;
            default:
                return true;
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesActionType = filterActionType === 'all' || log.actionType === filterActionType;
        const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
        const matchesDate = isWithinDateRange(new Date(log.timestamp));

        return matchesSearch && matchesActionType && matchesStatus && matchesDate;
    });

    const getActionIcon = (actionType: string) => {
        switch (actionType) {
            case 'create': return <UserPlus className="h-4 w-4 text-emerald-500" />;
            case 'update': return <Edit className="h-4 w-4 text-teal-500" />;
            case 'delete': return <Trash2 className="h-4 w-4 text-red-500" />;
            case 'login': return <LogIn className="h-4 w-4 text-emerald-500" />;
            case 'logout': return <LogOut className="h-4 w-4 text-gray-500" />;
            case 'permission_change': return <ShieldAlert className="h-4 w-4 text-purple-500" />;
            case 'role_change': return <Shield className="h-4 w-4 text-amber-500" />;
            case 'settings_change': return <Settings className="h-4 w-4 text-gray-500" />;
            case 'user_block': return <Ban className="h-4 w-4 text-red-500" />;
            case 'user_unblock': return <UserCheck className="h-4 w-4 text-green-500" />;
            default: return <Activity className="h-4 w-4 text-teal-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircle className="h-3 w-3" /> Success</span>;
            case 'failed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Failed</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>;
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let relativeTime = '';
        if (diffDays === 1) relativeTime = 'Yesterday';
        else if (diffDays < 7) relativeTime = `${diffDays} days ago`;
        else if (diffDays < 30) relativeTime = `${Math.floor(diffDays / 7)} weeks ago`;
        else relativeTime = `${Math.floor(diffDays / 30)} months ago`;

        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            relative: relativeTime
        };
    };

    // Columns with Block/Unblock actions
    const columns = [
        {
            Header: 'Action',
            accessor: 'action',
            sortable: true,
            Cell: (row: ActivityLog) => (
                <div className="flex items-center gap-2">
                    {getActionIcon(row.actionType)}
                    <div>
                        <span className="text-sm font-medium text-gray-900">{row.action}</span>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{row.details.substring(0, 60)}...</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Performed By',
            accessor: 'performedBy',
            sortable: true,
            Cell: (row: ActivityLog) => (
                <div>
                    <p className="text-sm font-medium text-gray-900">{row.performedBy}</p>
                    <p className="text-xs text-teal-600 capitalize">{row.performedByRole?.replace('_', ' ')}</p>
                </div>
            )
        },
        {
            Header: 'Target',
            accessor: 'target',
            sortable: true,
            Cell: (row: ActivityLog) => (
                <div>
                    <p className="text-sm text-gray-900">{row.target}</p>
                    <p className="text-xs text-gray-500 capitalize">{row.targetType}</p>
                </div>
            )
        },
        {
            Header: 'Timestamp',
            accessor: 'timestamp',
            sortable: true,
            Cell: (row: ActivityLog) => {
                const { date, time, relative } = formatTimestamp(row.timestamp);
                return (
                    <div>
                        <p className="text-sm text-gray-900">{date}</p>
                        <p className="text-xs text-gray-500">{time} ({relative})</p>
                    </div>
                );
            }
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: ActivityLog) => getStatusBadge(row.status)
        },
        {
            Header: 'Actions',
            accessor: 'id',
            sortable: false,
            width: '130px',
            Cell: (row: ActivityLog) => {
                const targetedUser = users.find(u => u.id === row.targetId);
                const isUserTarget = row.targetType === 'user' && targetedUser;
                
                return (
                    <div className="flex items-center gap-2">
                        {isUserTarget && targetedUser && (
                            <button
                                onClick={() => {
                                    setSelectedUser(targetedUser);
                                    setShowUserActionModal(true);
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    targetedUser.status === 'active'
                                        ? 'bg-red-50 hover:bg-red-100'
                                        : 'bg-green-50 hover:bg-green-100'
                                }`}
                                title={targetedUser.status === 'active' ? 'Block User' : 'Unblock User'}
                            >
                                {targetedUser.status === 'active' ? (
                                    <Ban className="h-4 w-4 text-red-600" />
                                ) : (
                                    <UserCheck className="h-4 w-4 text-green-600" />
                                )}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setSelectedLog(row);
                                setShowDetailsModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                            onClick={() => {
                                setLogToDelete(row);
                                setShowDeleteConfirm(true);
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                            title="Delete Log"
                        >
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                    </div>
                );
            }
        }
    ];

    const actionTypes = [
        { value: 'all', label: 'All Actions' },
        { value: 'create', label: 'Create' },
        { value: 'update', label: 'Update' },
        { value: 'delete', label: 'Delete' },
        { value: 'login', label: 'Login' },
        { value: 'logout', label: 'Logout' },
        { value: 'permission_change', label: 'Permission Change' },
        { value: 'role_change', label: 'Role Change' },
        { value: 'settings_change', label: 'Settings Change' },
        { value: 'user_block', label: 'User Blocked' },
        { value: 'user_unblock', label: 'User Unblocked' }
    ];

    const statusTypes = [
        { value: 'all', label: 'All Status' },
        { value: 'success', label: 'Success' },
        { value: 'failed', label: 'Failed' },
        { value: 'pending', label: 'Pending' }
    ];

    const dateRangeOptions = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'Last 7 Days' },
        { value: 'month', label: 'Last 30 Days' },
        { value: 'all', label: 'All Time' }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading activity logs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header - No Refresh Button */}
                <div className="mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg">
                                <History className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
                                <p className="text-gray-500 text-sm">Track user activities, system events, and manage user access</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Cards - Only 4 cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Events</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalLogs}</p>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg shadow-md">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Today</p>
                                <p className="text-2xl font-bold text-teal-600">{stats.todayLogs}</p>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg shadow-md">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Failed</p>
                                <p className="text-2xl font-bold text-red-600">{stats.failedLogs}</p>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md">
                                <AlertCircle className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pendingLogs}</p>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg shadow-md">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[250px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by action, user, target..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                />
                            </div>
                        </div>
                        <select
                            value={filterActionType}
                            onChange={(e) => setFilterActionType(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[150px]"
                        >
                            {actionTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                        >
                            {statusTypes.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as any)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                        >
                            {dateRangeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleResetFilters}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reset Filters
                        </button>
                    </div>
                    <div className="mt-3 text-right">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                            {filteredLogs.length} activities found
                        </span>
                    </div>
                </div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <ReusableTable
                        columns={columns}
                        data={filteredLogs}
                        title="Activity Timeline"
                        icon={History}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                </motion.div>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteConfirm && logToDelete && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <AlertCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Delete Log</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-2">
                                        Are you sure you want to delete this log?
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                        <p className="text-sm font-medium text-gray-900">{logToDelete.action}</p>
                                        <p className="text-xs text-gray-500 mt-1">{logToDelete.details}</p>
                                    </div>
                                    <p className="text-xs text-red-500">This action cannot be undone.</p>
                                </div>
                                <div className="border-t px-6 py-4 flex justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(false);
                                            setLogToDelete(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteLog}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    >
                                        Delete Log
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* User Action Modal (Block/Unblock) */}
                <AnimatePresence>
                    {showUserActionModal && selectedUser && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
                            >
                                <div className={`p-4 ${selectedUser.status === 'active' ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-green-600 to-emerald-700'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            {selectedUser.status === 'active' ? <Ban className="h-5 w-5 text-white" /> : <UserCheck className="h-5 w-5 text-white" />}
                                        </div>
                                        <h3 className="text-lg font-bold text-white">
                                            {selectedUser.status === 'active' ? 'Block User' : 'Unblock User'}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600">
                                            {selectedUser.status === 'active' 
                                                ? `Are you sure you want to block ${selectedUser.full_name}?`
                                                : `Are you sure you want to unblock ${selectedUser.full_name}?`}
                                        </p>
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">User Details:</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedUser.full_name}</p>
                                            <p className="text-xs text-gray-500">{selectedUser.email}</p>
                                            <p className="text-xs text-gray-500 mt-1">Role: {selectedUser.role}</p>
                                            <p className="text-xs text-gray-500">Current Status: <span className={selectedUser.status === 'active' ? 'text-green-600' : 'text-red-600'}>{selectedUser.status}</span></p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={blockReason}
                                            onChange={(e) => setBlockReason(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                            placeholder={selectedUser.status === 'active' 
                                                ? "Enter reason for blocking this user (e.g., suspicious activity, policy violation)..."
                                                : "Enter reason for unblocking this user..."}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="border-t px-6 py-4 flex justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setShowUserActionModal(false);
                                            setSelectedUser(null);
                                            setBlockReason('');
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBlockUser}
                                        disabled={isProcessing || !blockReason}
                                        className={`px-4 py-2 rounded-lg text-white transition flex items-center gap-2 ${
                                            selectedUser.status === 'active'
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-green-600 hover:bg-green-700'
                                        } ${(!blockReason || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                                        ) : (
                                            <>{selectedUser.status === 'active' ? <Ban className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                            {selectedUser.status === 'active' ? 'Block User' : 'Unblock User'}</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Activity Details Modal */}
                <AnimatePresence>
                    {showDetailsModal && selectedLog && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg shadow-md">
                                            <Eye className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Activity Details</h2>
                                    </div>
                                    <button onClick={() => setShowDetailsModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getActionIcon(selectedLog.actionType)}
                                                <p className="text-lg font-semibold text-gray-900">{selectedLog.action}</p>
                                                {getStatusBadge(selectedLog.status)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Performed By</p>
                                            <p className="font-medium text-gray-900 mt-1">{selectedLog.performedBy}</p>
                                            <p className="text-xs text-teal-600 capitalize">{selectedLog.performedByRole?.replace('_', ' ')}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">ID: {selectedLog.performedById?.slice(-8)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Target</p>
                                            <p className="font-medium text-gray-900 mt-1">{selectedLog.target}</p>
                                            <p className="text-xs text-gray-500 capitalize">{selectedLog.targetType}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">ID: {selectedLog.targetId?.slice(-8)}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Details</p>
                                            <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <p className="text-sm text-gray-700">{selectedLog.details}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">IP Address</p>
                                            <p className="text-sm font-mono text-gray-600 mt-1">{selectedLog.ipAddress}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                                            <p className="text-sm text-gray-600 mt-1">{selectedLog.location || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Device</p>
                                            <p className="text-sm text-gray-600 mt-1">{selectedLog.device || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">User Agent</p>
                                            <p className="text-xs text-gray-500 mt-1 font-mono break-all">{selectedLog.userAgent}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Timestamp</p>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {formatTimestamp(selectedLog.timestamp).date} at {formatTimestamp(selectedLog.timestamp).time}
                                            </p>
                                            <p className="text-xs text-gray-400">{formatTimestamp(selectedLog.timestamp).relative}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t px-6 py-4 flex justify-end">
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <SuccessPopup
                    isOpen={showSuccessPopup}
                    onClose={() => setShowSuccessPopup(false)}
                    type={popupMessage.type}
                    title={popupMessage.title}
                    message={popupMessage.message}
                    duration={3000}
                    position="top-right"
                />
            </div>
        </div>
    );
};

export default ActivityLogs;