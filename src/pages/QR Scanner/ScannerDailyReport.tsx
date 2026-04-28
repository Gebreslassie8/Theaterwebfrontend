// src/pages/scanner/ScannerDailyReport.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    FileText,
    Send,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Calendar,
    Users,
    Ticket,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Download,
    Printer,
    RefreshCw,
    Eye,
    Edit,
    Trash2,
    Plus,
    Minus,
    Upload,
    Camera,
    QrCode,
    Scan,
    UserCheck,
    UserX,
    MapPin,
    CreditCard,
    Smartphone,
    Landmark,
    Wallet,
    Filter,
    Search,
    Info,
    Share2,
    Copy,
    Mail,
    MessageCircle,
    Settings,
    Award,
    Crown,
    Star,
    Target,
    Percent,
    Activity,
    Zap,
    Shield,
    Bell,
    AlertTriangle,
    ThumbsUp,
    ThumbsDown,
    Flag,
    HelpCircle
} from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableForm from '../../components/Reusable/ReusableForm';
import SuccessPopup from '../../components/Reusable/SuccessPopup';
import * as Yup from 'yup';

// Types
interface DailyReportData {
    id: string;
    scannerId: string;
    scannerName: string;
    gateNumber: string;
    date: string;
    submittedAt: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';

    // Entry Statistics
    totalScanned: number;
    validEntries: number;
    invalidEntries: number;
    duplicateAttempts: number;
    vipEntries: number;
    groupEntries: number;
    regularEntries: number;

    // Time Statistics
    peakHour: string;
    peakHourCount: number;
    averageScanTime: number;
    slowestHour: string;
    fastestHour: string;

    // Issues & Notes
    technicalIssues: string[];
    customerIssues: string[];
    suggestions: string[];
    additionalNotes: string;

    // Attachments
    attachments?: string[];

    // Approval
    approvedBy?: string;
    approvedAt?: string;
    rejectionReason?: string;
}

interface ReportSummary {
    reportsSent: number;
    approved: number;
    rejected: number;
    pending: number;
    totalScans: number;
}

// Mock Data
const mockDailyReport: DailyReportData = {
    id: 'RPT-001',
    scannerId: 'SCN-001',
    scannerName: 'John Scanner',
    gateNumber: 'Gate A',
    date: new Date().toISOString().split('T')[0],
    submittedAt: new Date().toISOString(),
    status: 'draft',
    totalScanned: 342,
    validEntries: 328,
    invalidEntries: 8,
    duplicateAttempts: 6,
    vipEntries: 45,
    groupEntries: 89,
    regularEntries: 194,
    peakHour: '7:00 PM',
    peakHourCount: 67,
    averageScanTime: 4.2,
    slowestHour: '8:00 PM',
    fastestHour: '10:00 AM',
    technicalIssues: ['Scanner lag at 7:30 PM', 'QR code reader failed twice'],
    customerIssues: ['2 customers had invalid tickets', '1 customer arrived late'],
    suggestions: ['Add more staff during peak hours', 'Improve lighting at gate'],
    additionalNotes: 'Overall smooth operation today.',
};

// Validation Schema
const DailyReportSchema = Yup.object({
    totalScanned: Yup.number().required('Total scanned is required').min(0, 'Must be 0 or greater'),
    validEntries: Yup.number().required('Valid entries is required').min(0, 'Must be 0 or greater'),
    invalidEntries: Yup.number().required('Invalid entries is required').min(0, 'Must be 0 or greater'),
    duplicateAttempts: Yup.number().required('Duplicate attempts is required').min(0, 'Must be 0 or greater'),
    vipEntries: Yup.number().min(0, 'Must be 0 or greater'),
    groupEntries: Yup.number().min(0, 'Must be 0 or greater'),
    regularEntries: Yup.number().min(0, 'Must be 0 or greater'),
    peakHour: Yup.string(),
    averageScanTime: Yup.number().min(0, 'Must be 0 or greater'),
    additionalNotes: Yup.string().max(500, 'Notes cannot exceed 500 characters'),
});

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span>{Math.abs(trend)}% from last period</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </motion.div>
    );
};

const ScannerDailyReport: React.FC = () => {
    const navigate = useNavigate();
    const [report, setReport] = useState<DailyReportData>(mockDailyReport);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Report summary for the scanner - Updated values
    const [reportSummary] = useState<ReportSummary>({
        reportsSent: 10,
        approved: 8,
        rejected: 2,
        pending: 3,
        totalScans: 4580,
    });

    const handleInputChange = (field: keyof DailyReportData, value: any) => {
        setReport(prev => ({ ...prev, [field]: value }));
    };

    const addIssue = (type: 'technical' | 'customer' | 'suggestion') => {
        const issue = prompt(`Enter ${type} issue:`);
        if (issue) {
            setReport(prev => ({
                ...prev,
                [type === 'technical' ? 'technicalIssues' : type === 'customer' ? 'customerIssues' : 'suggestions']:
                    [...prev[type === 'technical' ? 'technicalIssues' : type === 'customer' ? 'customerIssues' : 'suggestions'], issue]
            }));
        }
    };

    const removeIssue = (type: 'technical' | 'customer' | 'suggestion', index: number) => {
        setReport(prev => ({
            ...prev,
            [type === 'technical' ? 'technicalIssues' : type === 'customer' ? 'customerIssues' : 'suggestions']:
                prev[type === 'technical' ? 'technicalIssues' : type === 'customer' ? 'customerIssues' : 'suggestions'].filter((_, i) => i !== index)
        }));
    };

    const handleSubmitReport = async () => {
        setIsSubmitting(true);

        // Validate required fields
        if (!report.totalScanned || !report.validEntries) {
            setPopupMessage({
                title: 'Validation Error',
                message: 'Please fill in all required fields',
                type: 'error'
            });
            setShowSuccessPopup(true);
            setIsSubmitting(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setReport(prev => ({
                ...prev,
                status: 'submitted',
                submittedAt: new Date().toISOString()
            }));

            setPopupMessage({
                title: 'Report Submitted!',
                message: 'Your daily report has been sent to the owner/manager for review.',
                type: 'success'
            });
            setShowSuccessPopup(true);
            setIsSubmitting(false);
            setShowPreview(false);
        }, 2000);
    };

    const handleSaveDraft = () => {
        setReport(prev => ({ ...prev, status: 'draft' }));
        setPopupMessage({
            title: 'Draft Saved',
            message: 'Your report has been saved as a draft.',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleExportPDF = () => {
        setPopupMessage({
            title: 'Export Started',
            message: 'Preparing PDF export...',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handlePrint = () => {
        window.print();
        setPopupMessage({
            title: 'Print Started',
            message: 'Preparing report for printing...',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const calculateValidationRate = () => {
        return ((report.validEntries / report.totalScanned) * 100).toFixed(1);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'submitted':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Submitted</span>;
            case 'approved':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Approved</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Rejected</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><FileText className="h-3 w-3" /> Draft</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/scanner/dashboard')}
                                className="p-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Daily Report Submission</h1>
                                <p className="text-sm text-gray-500">Submit your daily scanning report to owners/managers</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleExportPDF}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                PDF
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <Printer className="h-4 w-4" />
                                Print
                            </button>
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Eye className="h-4 w-4" />
                                Preview
                            </button>
                        </div>
                    </div>
                </div>

                {/* Report Summary Stats - Admin Dashboard Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                    <StatCard
                        title="Reports Sent"
                        value={reportSummary.reportsSent}
                        icon={Send}
                        color="from-teal-500 to-emerald-600"
                        trend={12}
                    />
                    <StatCard
                        title="Approved"
                        value={reportSummary.approved}
                        icon={CheckCircle}
                        color="from-green-500 to-emerald-600"
                        trend={8}
                    />
                    <StatCard
                        title="Rejected"
                        value={reportSummary.rejected}
                        icon={XCircle}
                        color="from-red-500 to-pink-600"
                        trend={-5}
                    />
                    <StatCard
                        title="Pending"
                        value={reportSummary.pending}
                        icon={Clock}
                        color="from-yellow-500 to-orange-600"
                    />
                    <StatCard
                        title="Total Scans"
                        value={reportSummary.totalScans}
                        icon={Scan}
                        color="from-purple-500 to-indigo-600"
                        trend={15}
                    />
                </div>

                {/* Date Selector */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-teal-600" />
                        <span className="text-sm font-medium text-gray-700">Report Date:</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <Calendar className="h-4 w-4" />
                                {new Date(selectedDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </button>
                            {showDatePicker && (
                                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setShowDatePicker(false);
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="ml-auto">
                            {getStatusBadge(report.status)}
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                {!showPreview ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Stats */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Entry Statistics */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Ticket className="h-5 w-5 text-teal-600" />
                                    Entry Statistics
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Total Scanned <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={report.totalScanned}
                                            onChange={(e) => handleInputChange('totalScanned', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Valid Entries <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={report.validEntries}
                                            onChange={(e) => handleInputChange('validEntries', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Invalid Entries
                                        </label>
                                        <input
                                            type="number"
                                            value={report.invalidEntries}
                                            onChange={(e) => handleInputChange('invalidEntries', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Duplicate Attempts
                                        </label>
                                        <input
                                            type="number"
                                            value={report.duplicateAttempts}
                                            onChange={(e) => handleInputChange('duplicateAttempts', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            VIP Entries
                                        </label>
                                        <input
                                            type="number"
                                            value={report.vipEntries}
                                            onChange={(e) => handleInputChange('vipEntries', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Group Entries
                                        </label>
                                        <input
                                            type="number"
                                            value={report.groupEntries}
                                            onChange={(e) => handleInputChange('groupEntries', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Time Statistics */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-teal-600" />
                                    Time Statistics
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Peak Hour
                                        </label>
                                        <input
                                            type="text"
                                            value={report.peakHour}
                                            onChange={(e) => handleInputChange('peakHour', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="e.g., 7:00 PM"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Peak Hour Count
                                        </label>
                                        <input
                                            type="number"
                                            value={report.peakHourCount}
                                            onChange={(e) => handleInputChange('peakHourCount', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Average Scan Time (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={report.averageScanTime}
                                            onChange={(e) => handleInputChange('averageScanTime', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5 text-teal-600" />
                                    Additional Notes
                                </h2>
                                <textarea
                                    value={report.additionalNotes}
                                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Enter any additional notes, observations, or comments..."
                                />
                            </div>
                        </div>

                        {/* Right Column - Issues & Actions */}
                        <div className="space-y-6">
                            {/* Technical Issues */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                        Technical Issues
                                    </h2>
                                    <button
                                        onClick={() => addIssue('technical')}
                                        className="p-1 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                {report.technicalIssues.length === 0 ? (
                                    <p className="text-sm text-gray-500">No technical issues reported</p>
                                ) : (
                                    <div className="space-y-2">
                                        {report.technicalIssues.map((issue, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                                                <span className="text-sm text-gray-700">{issue}</span>
                                                <button
                                                    onClick={() => removeIssue('technical', index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Customer Issues */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Users className="h-5 w-5 text-orange-500" />
                                        Customer Issues
                                    </h2>
                                    <button
                                        onClick={() => addIssue('customer')}
                                        className="p-1 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                {report.customerIssues.length === 0 ? (
                                    <p className="text-sm text-gray-500">No customer issues reported</p>
                                ) : (
                                    <div className="space-y-2">
                                        {report.customerIssues.map((issue, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                                                <span className="text-sm text-gray-700">{issue}</span>
                                                <button
                                                    onClick={() => removeIssue('customer', index)}
                                                    className="text-orange-500 hover:text-orange-700"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Suggestions */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <ThumbsUp className="h-5 w-5 text-green-500" />
                                        Suggestions for Improvement
                                    </h2>
                                    <button
                                        onClick={() => addIssue('suggestion')}
                                        className="p-1 text-teal-600 hover:bg-teal-50 rounded-lg transition"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                {report.suggestions.length === 0 ? (
                                    <p className="text-sm text-gray-500">No suggestions yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {report.suggestions.map((suggestion, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                                <span className="text-sm text-gray-700">{suggestion}</span>
                                                <button
                                                    onClick={() => removeIssue('suggestion', index)}
                                                    className="text-green-500 hover:text-green-700"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                                <div className="space-y-3">
                                    <ReusableButton
                                        onClick={handleSaveDraft}
                                        icon={FileText}
                                        label="Save as Draft"
                                        variant="secondary"
                                        className="w-full"
                                    />
                                    <ReusableButton
                                        onClick={handleSubmitReport}
                                        icon={Send}
                                        label="Submit Report"
                                        className="w-full bg-gradient-to-r from-teal-600 to-emerald-600"
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Preview Mode */
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Report Preview</h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-teal-600 hover:text-teal-700"
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Preview Content */}
                        <div className="space-y-6">
                            <div className="border-b pb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Report Information</h3>
                                <p className="text-sm">Date: {new Date(selectedDate).toLocaleDateString()}</p>
                                <p className="text-sm">Status: {getStatusBadge(report.status)}</p>
                            </div>

                            <div className="border-b pb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Entry Statistics</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <p className="text-sm">Total Scanned: <span className="font-medium">{report.totalScanned}</span></p>
                                    <p className="text-sm">Valid: <span className="text-green-600 font-medium">{report.validEntries}</span></p>
                                    <p className="text-sm">Invalid: <span className="text-red-600 font-medium">{report.invalidEntries}</span></p>
                                    <p className="text-sm">Duplicate: <span className="text-yellow-600 font-medium">{report.duplicateAttempts}</span></p>
                                    <p className="text-sm">VIP: <span className="text-purple-600 font-medium">{report.vipEntries}</span></p>
                                    <p className="text-sm">Group: <span className="text-blue-600 font-medium">{report.groupEntries}</span></p>
                                </div>
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                    <p className="text-sm">Validation Rate: <span className="font-bold text-teal-600">{calculateValidationRate()}%</span></p>
                                </div>
                            </div>

                            <div className="border-b pb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Time Statistics</h3>
                                <p className="text-sm">Peak Hour: {report.peakHour} ({report.peakHourCount} entries)</p>
                                <p className="text-sm">Average Scan Time: {report.averageScanTime} seconds</p>
                            </div>

                            {report.technicalIssues.length > 0 && (
                                <div className="border-b pb-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Technical Issues</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {report.technicalIssues.map((issue, i) => (
                                            <li key={i} className="text-sm text-gray-600">{issue}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {report.customerIssues.length > 0 && (
                                <div className="border-b pb-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Customer Issues</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {report.customerIssues.map((issue, i) => (
                                            <li key={i} className="text-sm text-gray-600">{issue}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {report.suggestions.length > 0 && (
                                <div className="border-b pb-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Suggestions</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {report.suggestions.map((suggestion, i) => (
                                            <li key={i} className="text-sm text-gray-600">{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {report.additionalNotes && (
                                <div className="border-b pb-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                                    <p className="text-sm text-gray-600">{report.additionalNotes}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <ReusableButton
                                    onClick={() => setShowPreview(false)}
                                    icon={Edit}
                                    label="Edit Report"
                                    variant="secondary"
                                    className="flex-1"
                                />
                                <ReusableButton
                                    onClick={handleSubmitReport}
                                    icon={Send}
                                    label="Submit Report"
                                    className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tips Card */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">Report Submission Tips</p>
                            <p className="text-xs text-blue-700 mt-1">
                                • Ensure all required fields (*) are filled before submitting<br />
                                • Report any technical issues immediately for faster resolution<br />
                                • Use the "Save as Draft" feature if you need to complete the report later<br />
                                • Once submitted, reports cannot be edited - please review carefully<br />
                                • Submitted reports will be reviewed by owners/managers within 24 hours
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success Popup */}
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

export default ScannerDailyReport;