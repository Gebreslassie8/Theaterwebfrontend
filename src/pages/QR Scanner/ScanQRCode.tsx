// src/pages/scanner/ScanQRCode.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    QrCode,
    Scan,
    CheckCircle,
    XCircle,
    AlertCircle,
    Camera,
    Upload,
    Eye,
    ArrowLeft,
    RefreshCw,
    Ticket,
    Calendar,
    Clock,
    MapPin,
    User,
    Mail,
    Phone,
    DollarSign,
    CreditCard,
    Smartphone,
    Landmark,
    Wallet,
    Check,
    X,
    Activity,
    Wifi,
    Battery,
    Zap,
    Shield,
    Award,
    Star,
    Crown,
    TrendingUp,
    Download,
    Printer,
    Copy,
    Share2,
    Info,
    Search,
    Filter,
    Download as DownloadIcon,
    Edit,
    FileText,
    Plus,
    Trash2,
    Save,
    Send,
    ArrowRight,
    AlertTriangle
} from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';
import ReusableForm from '../../components/Reusable/ReusableForm';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';

// Types
interface TicketData {
    id: string;
    ticketNumber: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    hallName: string;
    seatNumber: string;
    seatRow: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    price: number;
    paymentMethod: string;
    purchaseDate: string;
    status: 'valid' | 'invalid' | 'used' | 'expired';
    qrCode: string;
    scannedAt?: string;
    scannedBy?: string;
    gate?: string;
}

interface ScanResult {
    success: boolean;
    message: string;
    ticket?: TicketData;
    timestamp: string;
}

interface ScanHistory {
    id: string;
    ticketNumber: string;
    eventName: string;
    scannedAt: string;
    status: 'valid' | 'invalid' | 'used';
    gate: string;
    scannerId: string;
}

// Stat Card Props
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    link?: string;
    change?: string;
    trend?: 'up' | 'down';
}

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, change, trend }) => {
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
                    <p className="text-xs text-gray-500">{title}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <div className={`flex items-center gap-1 text-xs mt-0.5 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                            <span>{change}</span>
                        </div>
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
                <RouterLink to={link} className="block">
                    <CardContent />
                </RouterLink>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
};

// Mock Data
const validTickets: TicketData[] = [
    {
        id: 'TKT-001',
        ticketNumber: 'TKT-2024-001',
        eventName: 'The Lion King',
        eventDate: '2024-04-28',
        eventTime: '19:00',
        hallName: 'Main Hall',
        seatNumber: '12',
        seatRow: 'A',
        customerName: 'John Smith',
        customerEmail: 'john.smith@example.com',
        customerPhone: '+251 911 234 567',
        price: 450,
        paymentMethod: 'Chapa',
        purchaseDate: '2024-04-15',
        status: 'valid',
        qrCode: 'QR-2024-001'
    },
    {
        id: 'TKT-002',
        ticketNumber: 'TKT-2024-002',
        eventName: 'Hamilton',
        eventDate: '2024-04-28',
        eventTime: '20:00',
        hallName: 'Main Hall',
        seatNumber: '5',
        seatRow: 'B',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@example.com',
        customerPhone: '+251 912 345 678',
        price: 550,
        paymentMethod: 'Telebirr',
        purchaseDate: '2024-04-16',
        status: 'valid',
        qrCode: 'QR-2024-002'
    },
    {
        id: 'TKT-003',
        ticketNumber: 'TKT-2024-003',
        eventName: 'Wicked',
        eventDate: '2024-04-29',
        eventTime: '18:30',
        hallName: 'East Hall',
        seatNumber: '8',
        seatRow: 'C',
        customerName: 'Michael Brown',
        customerEmail: 'michael.b@example.com',
        customerPhone: '+251 913 456 789',
        price: 400,
        paymentMethod: 'Chapa',
        purchaseDate: '2024-04-17',
        status: 'valid',
        qrCode: 'QR-2024-003'
    }
];

// Track scanned tickets (to prevent duplicate scans)
let scannedTickets: string[] = [];

const mockScanHistory: ScanHistory[] = [
    { id: '1', ticketNumber: 'TKT-2024-001', eventName: 'The Lion King', scannedAt: '2024-04-28T19:05:00', status: 'valid', gate: 'Gate A', scannerId: 'SCN-001' },
    { id: '2', ticketNumber: 'TKT-2024-002', eventName: 'Hamilton', scannedAt: '2024-04-28T18:55:00', status: 'valid', gate: 'Gate B', scannerId: 'SCN-002' },
];

// Validation Schema for Manual Entry - Only Ticket Number
const ManualEntrySchema = Yup.object({
    ticketNumber: Yup.string()
        .required('Ticket number is required')
        .min(5, 'Ticket number must be at least 5 characters')
        .max(50, 'Ticket number cannot exceed 50 characters')
        .matches(/^[A-Z0-9-]+$/, 'Ticket number can only contain uppercase letters, numbers, and hyphens')
        .test('ticket-exists', 'Ticket number not found in system', function (value) {
            if (!value) return true;
            return validTickets.some(t => t.ticketNumber === value);
        })
        .test('ticket-not-scanned', 'This ticket has already been scanned and used', function (value) {
            if (!value) return true;
            return !scannedTickets.includes(value);
        })
});

// QR Code validation function
const validateQRCode = (qrData: string): { isValid: boolean; message: string; ticket?: TicketData } => {
    // Check if QR code is empty
    if (!qrData || qrData.trim() === '') {
        return { isValid: false, message: 'QR code data is empty' };
    }

    // Check if QR code format is valid
    const ticketNumberMatch = qrData.match(/TKT-\d{4}-\d{3}/);
    if (!ticketNumberMatch) {
        return { isValid: false, message: 'Invalid QR code format' };
    }

    const ticketNumber = ticketNumberMatch[0];

    // Check if ticket exists
    const ticket = validTickets.find(t => t.ticketNumber === ticketNumber);
    if (!ticket) {
        return { isValid: false, message: 'Ticket not found in system' };
    }

    // Check if ticket has already been scanned
    if (scannedTickets.includes(ticketNumber)) {
        return { isValid: false, message: 'This ticket has already been scanned and used' };
    }

    // Check if event date has passed
    const eventDate = new Date(ticket.eventDate);
    const today = new Date();
    if (eventDate < today) {
        return { isValid: false, message: 'Event date has passed' };
    }

    return { isValid: true, message: 'Ticket is valid', ticket };
};

const ScanQRCode: React.FC = () => {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [showManualInput, setShowManualInput] = useState(false);
    const [scanHistory, setScanHistory] = useState<ScanHistory[]>(mockScanHistory);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [cameraActive, setCameraActive] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Initialize scanned tickets from history
    useEffect(() => {
        scannedTickets = scanHistory.map(h => h.ticketNumber);
    }, [scanHistory]);

    // Camera simulation with QR code validation
    useEffect(() => {
        if (scanning && !cameraActive) {
            setCameraActive(true);
            // Simulate scanning a QR code after 3 seconds
            const timer = setTimeout(() => {
                // For demo, we'll scan TKT-2024-003 (a valid ticket that hasn't been scanned)
                const mockQRData = 'TKT-2024-003';
                handleQRScan(mockQRData);
            }, 3000);
            return () => clearTimeout(timer);
        }
        return () => { };
    }, [scanning, cameraActive]);

    const handleQRScan = (qrData: string) => {
        const validation = validateQRCode(qrData);

        if (validation.isValid && validation.ticket) {
            // Mark ticket as scanned
            scannedTickets.push(validation.ticket.ticketNumber);

            setScanResult({
                success: true,
                message: validation.message,
                ticket: validation.ticket,
                timestamp: new Date().toISOString()
            });

            const newHistory: ScanHistory = {
                id: Date.now().toString(),
                ticketNumber: validation.ticket.ticketNumber,
                eventName: validation.ticket.eventName,
                scannedAt: new Date().toISOString(),
                status: 'valid',
                gate: 'Gate A',
                scannerId: 'SCN-001'
            };
            setScanHistory([newHistory, ...scanHistory]);
            setValidationError(null);
        } else {
            setScanResult({
                success: false,
                message: validation.message,
                timestamp: new Date().toISOString()
            });
            setValidationError(validation.message);

            // Add invalid scan to history
            const newHistory: ScanHistory = {
                id: Date.now().toString(),
                ticketNumber: qrData,
                eventName: 'Unknown',
                scannedAt: new Date().toISOString(),
                status: 'invalid',
                gate: 'Gate A',
                scannerId: 'SCN-001'
            };
            setScanHistory([newHistory, ...scanHistory]);
        }

        setShowResult(true);
        setScanning(false);
        setCameraActive(false);
    };

    const handleManualValidate = async (values: any, { setSubmitting, resetForm }: any) => {
        setValidationError(null);

        try {
            const ticket = validTickets.find(t => t.ticketNumber === values.ticketNumber);

            if (ticket) {
                // Check if already scanned
                if (scannedTickets.includes(ticket.ticketNumber)) {
                    setScanResult({
                        success: false,
                        message: 'This ticket has already been scanned and used',
                        timestamp: new Date().toISOString()
                    });
                    setShowResult(true);
                    setShowManualInput(false);
                    resetForm();
                    setSubmitting(false);
                    return;
                }

                // Mark ticket as scanned
                scannedTickets.push(ticket.ticketNumber);

                setScanResult({
                    success: true,
                    message: 'Ticket validated successfully!',
                    ticket: ticket,
                    timestamp: new Date().toISOString()
                });

                const newHistory: ScanHistory = {
                    id: Date.now().toString(),
                    ticketNumber: values.ticketNumber,
                    eventName: ticket.eventName,
                    scannedAt: new Date().toISOString(),
                    status: 'valid',
                    gate: 'Gate A',
                    scannerId: 'SCN-001'
                };
                setScanHistory([newHistory, ...scanHistory]);
                setShowResult(true);
                setShowManualInput(false);
                resetForm();
            } else {
                setScanResult({
                    success: false,
                    message: 'Ticket not found. Please check the ticket number.',
                    timestamp: new Date().toISOString()
                });
                setShowResult(true);
                setShowManualInput(false);
                resetForm();
            }
        } catch (error) {
            setValidationError('An error occurred during validation');
        }

        setSubmitting(false);
    };

    const startScanning = () => {
        setScanning(true);
        setShowResult(false);
        setScanResult(null);
        setValidationError(null);
    };

    const resetScanner = () => {
        setShowResult(false);
        setScanResult(null);
        setScanning(false);
        setCameraActive(false);
        setShowManualInput(false);
        setValidationError(null);
    };

    const handleMarkAsUsed = () => {
        resetScanner();
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'valid':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Valid</span>;
            case 'used':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><Clock className="h-3 w-3" /> Used</span>;
            case 'invalid':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Invalid</span>;
            default:
                return null;
        }
    };

    // Filter scan history
    const filteredHistory = scanHistory.filter(item => {
        const matchesSearch = item.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.eventName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Scan History Columns
    const historyColumns = [
        { Header: 'Ticket Number', accessor: 'ticketNumber', Cell: (row: ScanHistory) => <span className="font-mono text-sm">{row.ticketNumber}</span> },
        { Header: 'Event', accessor: 'eventName' },
        { Header: 'Scanned At', accessor: 'scannedAt', Cell: (row: ScanHistory) => formatDateTime(row.scannedAt) },
        { Header: 'Gate', accessor: 'gate' },
        { Header: 'Status', accessor: 'status', Cell: (row: ScanHistory) => getStatusBadge(row.status) }
    ];

    // Manual Entry Form Fields - Only Ticket Number
    const manualEntryFields = [
        {
            name: 'ticketNumber',
            type: 'text',
            label: 'Ticket Number',
            placeholder: 'Enter ticket number (e.g., TKT-2024-001)',
            required: true,
            helperText: 'Format: TKT-YYYY-XXX (e.g., TKT-2024-001)'
        }
    ];

    // Stats calculations
    const stats = {
        totalScanned: scanHistory.length,
        validScans: scanHistory.filter(s => s.status === 'valid').length,
        invalidScans: scanHistory.filter(s => s.status === 'invalid').length,
        todayScans: scanHistory.filter(s => new Date(s.scannedAt).toDateString() === new Date().toDateString()).length
    };

    // Dashboard Cards
    const dashboardCards = [
        { title: 'Total Scanned', value: stats.totalScanned, icon: Scan, color: 'from-teal-500 to-teal-600', delay: 0.1, link: '/scanner/history' },
        { title: 'Valid Scans', value: stats.validScans, icon: CheckCircle, color: 'from-green-500 to-emerald-600', delay: 0.15, link: '/scanner/valid' },
        { title: 'Invalid Scans', value: stats.invalidScans, icon: XCircle, color: 'from-red-500 to-pink-600', delay: 0.2, link: '/scanner/invalid' },
        { title: "Today's Scans", value: stats.todayScans, icon: Calendar, color: 'from-blue-500 to-cyan-600', delay: 0.25, link: '/scanner/today' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => navigate('/scanner/dashboard')}
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                            <QrCode className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Scan QR Code</h1>
                            <p className="text-sm text-gray-500">Validate tickets by scanning QR code or manual entry</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
                >
                    {dashboardCards.map((card, index) => (
                        <StatCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            delay={card.delay}
                            link={card.link}
                        />
                    ))}
                </motion.div>

                {/* Validation Error Display */}
                {validationError && !showResult && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 max-w-2xl mx-auto">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-700">{validationError}</p>
                    </div>
                )}

                {/* Centered Scanner Section */}
                <div className="flex flex-col items-center justify-center">
                    {/* Action Buttons - Centered */}
                    <div className="flex flex-wrap gap-4 mb-8 justify-center">
                        <ReusableButton
                            onClick={startScanning}
                            icon={Scan}
                            label="Scan QR Code"
                            className="bg-gradient-to-r from-teal-600 to-emerald-600 min-w-[160px]"
                            disabled={scanning}
                        />
                        <ReusableButton
                            onClick={() => {
                                setShowManualInput(!showManualInput);
                                setValidationError(null);
                            }}
                            icon={Edit}
                            label="Manual Entry"
                            variant="secondary"
                            className="min-w-[160px]"
                        />
                        {(scanning || showResult) && (
                            <ReusableButton
                                onClick={resetScanner}
                                icon={RefreshCw}
                                label="Reset"
                                variant="secondary"
                                className="min-w-[160px]"
                            />
                        )}
                    </div>

                    {/* Manual Entry Form - Only Ticket Number */}
                    {showManualInput && !scanning && !showResult && (
                        <div className="w-full max-w-2xl mx-auto mb-8">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="mb-4 flex items-center gap-2">
                                    <Edit className="h-5 w-5 text-teal-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Manual Ticket Validation</h3>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                                    <p className="text-xs text-blue-800 flex items-center gap-1">
                                        <Info className="h-3 w-3" />
                                        Enter the ticket number to validate. Each ticket can only be scanned once.
                                    </p>
                                </div>
                                <ReusableForm
                                    id="manual-entry-form"
                                    fields={manualEntryFields}
                                    onSubmit={handleManualValidate}
                                    initialValues={{ ticketNumber: '' }}
                                    validationSchema={ManualEntrySchema}
                                    render={(formik) => (
                                        <div className="flex justify-end gap-3 mt-4">
                                            <ReusableButton type="button" variant="secondary" onClick={() => setShowManualInput(false)}>Cancel</ReusableButton>
                                            <ReusableButton type="submit" disabled={formik.isSubmitting}>Validate Ticket</ReusableButton>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {/* Scanner View - Centered */}
                    {scanning && (
                        <div className="w-full max-w-3xl mx-auto mb-8">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
                                    <div className="aspect-video flex items-center justify-center relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20"
                                        />
                                        <motion.div
                                            animate={{ y: [-100, 100] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute w-full h-0.5 bg-teal-500 shadow-lg shadow-teal-500/50"
                                        />
                                        <div className="relative z-10 text-center">
                                            <div className="w-32 h-32 border-2 border-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                                <Scan className="h-12 w-12 text-teal-500 animate-pulse" />
                                            </div>
                                            <p className="text-white font-medium">Scanning QR Code...</p>
                                            <p className="text-white/60 text-sm mt-1">Position QR code in frame</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
                                        <div>
                                            <p className="text-xs font-medium text-blue-800">Scanner Active</p>
                                            <p className="text-xs text-blue-600">Camera is ready. Position QR code in the frame.</p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-2">
                                            <Wifi className="h-3 w-3 text-blue-600" />
                                            <span className="text-xs text-blue-600">Connected</span>
                                            <Battery className="h-3 w-3 text-blue-600 ml-2" />
                                            <span className="text-xs text-blue-600">87%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Scanner Instructions - Centered */}
                    {!scanning && !showResult && !showManualInput && (
                        <div className="w-full max-w-2xl mx-auto mb-8">
                            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Camera className="h-12 w-12 text-gray-400" />
                                </div>
                                <p className="text-gray-600 text-lg font-medium mb-2">Ready to scan tickets</p>
                                <p className="text-sm text-gray-500">
                                    Click "Scan QR Code" to begin validating tickets
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Scan Result Section - Centered */}
                {showResult && scanResult && (
                    <div className="flex justify-center mb-8">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`w-full max-w-2xl rounded-2xl p-6 shadow-lg border ${scanResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl ${scanResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {scanResult.success ? <CheckCircle className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-red-600" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {scanResult.success ? 'Ticket Validated!' : 'Invalid Ticket'}
                                    </h3>
                                    <p className="text-sm text-gray-600">{scanResult.message}</p>
                                </div>
                            </div>

                            {scanResult.ticket && (
                                <div className="space-y-3">
                                    <div className="bg-white rounded-xl p-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Ticket Number</span>
                                            <span className="text-sm font-mono font-medium text-teal-600">{scanResult.ticket.ticketNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500">Event</span>
                                            <span className="text-sm font-medium">{scanResult.ticket.eventName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500">Event Date & Time</span>
                                            <span className="text-sm">{scanResult.ticket.eventDate} at {scanResult.ticket.eventTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500">Hall & Seat</span>
                                            <span className="text-sm">{scanResult.ticket.hallName} - Row {scanResult.ticket.seatRow}, Seat {scanResult.ticket.seatNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500">Customer</span>
                                            <span className="text-sm">{scanResult.ticket.customerName}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 mt-4">
                                {scanResult.success && (
                                    <ReusableButton onClick={handleMarkAsUsed} label="Grant Entry" className="flex-1 bg-green-600 hover:bg-green-700" />
                                )}
                                <ReusableButton onClick={resetScanner} label="Scan Another" variant="secondary" className="flex-1" />
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Scan History Table */}
                <div className="mt-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-teal-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Scan History</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by ticket or event..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none w-64"
                                        />
                                    </div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="valid">Valid</option>
                                        <option value="invalid">Invalid</option>
                                        <option value="used">Used</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <ReusableTable
                            columns={historyColumns}
                            data={filteredHistory}
                            title=""
                            icon={Clock}
                            showSearch={false}
                            showExport={true}
                            showPrint={false}
                            itemsPerPage={10}
                        />
                    </div>
                </div>

                {/* Tips Card */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">Validation Rules</p>
                            <p className="text-xs text-blue-700 mt-1">
                                • Ticket must be in format: TKT-YYYY-XXX<br />
                                • Ticket must exist in the system<br />
                                • Each ticket can only be scanned ONCE<br />
                                • Already scanned tickets will be rejected
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanQRCode;