// src/pages/scanner/CustomerCheckin.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    QrCode,
    Scan,
    CheckCircle,
    XCircle,
    AlertCircle,
    Users,
    Crown,
    UserCheck,
    UserPlus,
    Calendar,
    Clock,
    MapPin,
    Ticket,
    Mail,
    Phone,
    User,
    DollarSign,
    CreditCard,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    Star,
    Award,
    Shield,
    Zap,
    Wifi,
    Battery,
    Activity,
    Info,
    X,
    ChevronDown
} from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';
import ReusableForm from '../../components/Reusable/ReusableForm';
import SuccessPopup from '../../components/Reusable/SuccessPopup';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';

// Types
interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    ticketNumber: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    hallName: string;
    seatNumber: string;
    seatRow: string;
    isVIP: boolean;
    isGroup: boolean;
    groupId?: string;
    groupSize?: number;
    checkedIn: boolean;
    checkedInAt?: string;
    checkInMethod?: 'qr' | 'manual' | 'bulk';
    gate?: string;
}

interface CheckinStats {
    totalCheckedIn: number;
    expectedArrivals: number;
    remaining: number;
    vipCheckedIn: number;
    groupCheckedIn: number;
    regularCheckedIn: number;
    checkinRate: number;
}

interface GroupCheckin {
    id: string;
    groupName: string;
    groupCode: string;
    totalMembers: number;
    checkedInMembers: number;
    remainingMembers: number;
    eventName: string;
    gate: string;
    status: 'pending' | 'partial' | 'complete';
}

// Mock Data
const mockCustomers: Customer[] = [
    { id: '1', name: 'John Smith', email: 'john@example.com', phone: '+251911234567', ticketNumber: 'TKT-001', eventName: 'The Lion King', eventDate: '2024-04-28', eventTime: '19:00', hallName: 'Main Hall', seatNumber: '12', seatRow: 'A', isVIP: true, isGroup: false, checkedIn: false },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+251912345678', ticketNumber: 'TKT-002', eventName: 'The Lion King', eventDate: '2024-04-28', eventTime: '19:00', hallName: 'Main Hall', seatNumber: '14', seatRow: 'A', isVIP: true, isGroup: false, checkedIn: false },
    { id: '3', name: 'Michael Chen', email: 'michael@example.com', phone: '+251913456789', ticketNumber: 'TKT-003', eventName: 'The Lion King', eventDate: '2024-04-28', eventTime: '19:00', hallName: 'Main Hall', seatNumber: '5', seatRow: 'B', isVIP: false, isGroup: true, groupId: 'GRP-001', groupSize: 4, checkedIn: false },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com', phone: '+251914567890', ticketNumber: 'TKT-004', eventName: 'The Lion King', eventDate: '2024-04-28', eventTime: '19:00', hallName: 'Main Hall', seatNumber: '6', seatRow: 'B', isVIP: false, isGroup: true, groupId: 'GRP-001', groupSize: 4, checkedIn: false },
    { id: '5', name: 'David Wilson', email: 'david@example.com', phone: '+251915678901', ticketNumber: 'TKT-005', eventName: 'The Lion King', eventDate: '2024-04-28', eventTime: '19:00', hallName: 'Main Hall', seatNumber: '20', seatRow: 'C', isVIP: false, isGroup: false, checkedIn: false },
    { id: '6', name: 'Lisa Brown', email: 'lisa@example.com', phone: '+251916789012', ticketNumber: 'TKT-006', eventName: 'The Lion King', eventDate: '2024-04-28', eventTime: '19:00', hallName: 'Main Hall', seatNumber: '1', seatRow: 'VIP', isVIP: true, isGroup: false, checkedIn: true, checkedInAt: '2024-04-28T18:45:00', gate: 'Gate A' },
];

const mockGroups: GroupCheckin[] = [
    { id: '1', groupName: 'ABC Corporation', groupCode: 'GRP-001', totalMembers: 4, checkedInMembers: 0, remainingMembers: 4, eventName: 'The Lion King', gate: 'Gate A', status: 'pending' },
    { id: '2', groupName: 'XYZ Travel', groupCode: 'GRP-002', totalMembers: 8, checkedInMembers: 0, remainingMembers: 8, eventName: 'Hamilton', gate: 'Gate B', status: 'pending' },
    { id: '3', groupName: 'Tech Solutions', groupCode: 'GRP-003', totalMembers: 12, checkedInMembers: 0, remainingMembers: 12, eventName: 'Wicked', gate: 'Gate C', status: 'pending' },
];

// Track checked-in tickets
let checkedInTickets: string[] = mockCustomers.filter(c => c.checkedIn).map(c => c.ticketNumber);

// Validation Schemas
const ManualCheckinSchema = Yup.object({
    ticketNumber: Yup.string()
        .required('Ticket number is required')
        .test('ticket-exists', 'Ticket number not found', function (value) {
            if (!value) return true;
            return mockCustomers.some(c => c.ticketNumber === value);
        })
        .test('ticket-not-checked', 'This ticket has already been checked in', function (value) {
            if (!value) return true;
            return !checkedInTickets.includes(value);
        }),
    gate: Yup.string().required('Gate selection is required'),
    status: Yup.string().required('Status selection is required'),
    notes: Yup.string().optional()
});

const GroupCheckinSchema = Yup.object({
    groupCode: Yup.string()
        .required('Group code is required')
        .test('group-exists', 'Group code not found', function (value) {
            if (!value) return true;
            return mockGroups.some(g => g.groupCode === value);
        }),
    gate: Yup.string().required('Gate selection is required'),
    status: Yup.string().required('Status selection is required'),
    confirmCheckin: Yup.boolean().oneOf([true], 'Please confirm group check-in')
});

const VIPCheckinSchema = Yup.object({
    ticketNumber: Yup.string()
        .required('Ticket number is required')
        .test('ticket-exists', 'Ticket number not found', function (value) {
            if (!value) return true;
            return mockCustomers.some(c => c.ticketNumber === value);
        })
        .test('ticket-is-vip', 'This ticket is not a VIP ticket', function (value) {
            if (!value) return true;
            const customer = mockCustomers.find(c => c.ticketNumber === value);
            return customer?.isVIP === true;
        })
        .test('ticket-not-checked', 'This ticket has already been checked in', function (value) {
            if (!value) return true;
            return !checkedInTickets.includes(value);
        }),
    gate: Yup.string().required('VIP Gate selection is required'),
    status: Yup.string().required('Status selection is required')
});

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    change?: string;
    trend?: 'up' | 'down';
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, change, trend, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2 }}
            onClick={onClick}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
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
                            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span>{change}</span>
                        </div>
                    )}
                </div>
                {onClick && (
                    <div className={`transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'}`}>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Custom Select Component for better visibility
const CustomSelect: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    label: string;
    required?: boolean;
}> = ({ value, onChange, options, label, required }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent flex items-center justify-between"
                >
                    <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedOption?.label || `Select ${label}`}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${value === option.value ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CustomerCheckin: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'mark' | 'group'>('mark');
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [groups, setGroups] = useState<GroupCheckin[]>(mockGroups);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showManualModal, setShowManualModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showVIPModal, setShowVIPModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Form states for manual check-in
    const [manualTicketNumber, setManualTicketNumber] = useState('');
    const [manualGate, setManualGate] = useState('Gate A');
    const [manualStatus, setManualStatus] = useState('active');
    const [manualNotes, setManualNotes] = useState('');

    // Form states for group check-in
    const [groupCode, setGroupCode] = useState('');
    const [groupGate, setGroupGate] = useState('Gate A');
    const [groupStatus, setGroupStatus] = useState('complete');
    const [confirmCheckin, setConfirmCheckin] = useState(false);

    // Form states for VIP check-in
    const [vipTicketNumber, setVipTicketNumber] = useState('');
    const [vipGate, setVipGate] = useState('Gate A (VIP Express)');
    const [vipStatus, setVipStatus] = useState('priority');

    // Options
    const gateOptions = [
        { value: 'Gate A', label: 'Gate A - Main Entrance' },
        { value: 'Gate B', label: 'Gate B - East Entrance' },
        { value: 'Gate C', label: 'Gate C - West Entrance' },
        { value: 'Gate D', label: 'Gate D - North Entrance' }
    ];

    const vipGateOptions = [
        { value: 'Gate A (VIP Express)', label: 'Gate A - VIP Express (Priority Lane)' },
        { value: 'Gate B (VIP)', label: 'Gate B - VIP Lane' },
        { value: 'VIP Lounge', label: 'VIP Lounge - Exclusive Entrance' }
    ];

    const manualStatusOptions = [
        { value: 'active', label: 'Active - Regular Entry' },
        { value: 'vip', label: 'VIP - Priority Entry' },
        { value: 'group', label: 'Group - Bulk Entry' },
        { value: 'special', label: 'Special - Needs Assistance' }
    ];

    const groupStatusOptions = [
        { value: 'complete', label: 'Complete - All members present' },
        { value: 'partial', label: 'Partial - Some members arriving later' },
        { value: 'early', label: 'Early - Before scheduled time' }
    ];

    const vipStatusOptions = [
        { value: 'priority', label: 'Priority - Immediate entry' },
        { value: 'normal', label: 'Normal - Standard VIP entry' },
        { value: 'companion', label: 'Companion - With guest' }
    ];

    // Stats calculations
    const stats: CheckinStats = {
        totalCheckedIn: customers.filter(c => c.checkedIn).length,
        expectedArrivals: customers.length,
        remaining: customers.filter(c => !c.checkedIn).length,
        vipCheckedIn: customers.filter(c => c.isVIP && c.checkedIn).length,
        groupCheckedIn: customers.filter(c => c.isGroup && c.checkedIn).length,
        regularCheckedIn: customers.filter(c => !c.isVIP && !c.isGroup && c.checkedIn).length,
        checkinRate: (customers.filter(c => c.checkedIn).length / customers.length) * 100
    };

    const getStatusBadge = (checkedIn: boolean) => {
        if (checkedIn) {
            return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Checked In</span>;
        }
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>;
    };

    const getVIPBadge = (isVIP: boolean) => {
        if (isVIP) {
            return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700"><Crown className="h-3 w-3" /> VIP</span>;
        }
        return null;
    };

    const getGroupStatusBadge = (status: string) => {
        switch (status) {
            case 'complete':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Complete</span>;
            case 'partial':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Partial</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><Clock className="h-3 w-3" /> Pending</span>;
        }
    };

    const handleMarkAsUsed = (customer: Customer) => {
        if (!checkedInTickets.includes(customer.ticketNumber)) {
            checkedInTickets.push(customer.ticketNumber);
            setCustomers(prev => prev.map(c =>
                c.id === customer.id
                    ? { ...c, checkedIn: true, checkedInAt: new Date().toISOString(), gate: 'Gate A', checkInMethod: 'manual' }
                    : c
            ));
            setPopupMessage({
                title: 'Customer Checked In',
                message: `${customer.name} has been checked in successfully.`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        } else {
            setPopupMessage({
                title: 'Already Checked In',
                message: `${customer.name} has already been checked in.`,
                type: 'error'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleManualCheckin = () => {
        // Validate
        if (!manualTicketNumber) {
            setPopupMessage({
                title: 'Validation Error',
                message: 'Please enter a ticket number',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        const customer = customers.find(c => c.ticketNumber === manualTicketNumber);

        if (customer) {
            if (checkedInTickets.includes(customer.ticketNumber)) {
                setPopupMessage({
                    title: 'Already Checked In',
                    message: `${customer.name} has already been checked in.`,
                    type: 'error'
                });
                setShowSuccessPopup(true);
                return;
            }

            checkedInTickets.push(customer.ticketNumber);
            setCustomers(prev => prev.map(c =>
                c.id === customer.id
                    ? { ...c, checkedIn: true, checkedInAt: new Date().toISOString(), gate: manualGate, checkInMethod: 'manual', notes: manualNotes }
                    : c
            ));

            setPopupMessage({
                title: 'Manual Check-in Successful',
                message: `${customer.name} has been checked in at ${manualGate}. Status: ${manualStatus}`,
                type: 'success'
            });
            setShowSuccessPopup(true);

            // Reset form
            setManualTicketNumber('');
            setManualGate('Gate A');
            setManualStatus('active');
            setManualNotes('');
            setShowManualModal(false);
        } else {
            setPopupMessage({
                title: 'Ticket Not Found',
                message: 'Ticket number not found in system.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleGroupCheckin = () => {
        if (!groupCode) {
            setPopupMessage({
                title: 'Validation Error',
                message: 'Please enter a group code',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        if (!confirmCheckin) {
            setPopupMessage({
                title: 'Validation Error',
                message: 'Please confirm the group check-in',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        const group = groups.find(g => g.groupCode === groupCode);
        if (group) {
            const groupCustomers = customers.filter(c => c.groupId === group.groupCode);
            const notCheckedIn = groupCustomers.filter(c => !checkedInTickets.includes(c.ticketNumber));

            if (notCheckedIn.length === 0) {
                setPopupMessage({
                    title: 'Already Checked In',
                    message: `All members of ${group.groupName} have already been checked in.`,
                    type: 'error'
                });
                setShowSuccessPopup(true);
                return;
            }

            notCheckedIn.forEach(customer => {
                checkedInTickets.push(customer.ticketNumber);
                setCustomers(prev => prev.map(c =>
                    c.id === customer.id
                        ? { ...c, checkedIn: true, checkedInAt: new Date().toISOString(), gate: groupGate, checkInMethod: 'bulk' }
                        : c
                ));
            });

            const newCheckedInCount = group.checkedInMembers + notCheckedIn.length;
            const newStatus = newCheckedInCount === group.totalMembers ? 'complete' : 'partial';

            setGroups(prev => prev.map(g =>
                g.id === group.id
                    ? { ...g, checkedInMembers: newCheckedInCount, remainingMembers: group.totalMembers - newCheckedInCount, status: newStatus }
                    : g
            ));

            setPopupMessage({
                title: 'Group Checked In',
                message: `${group.groupName}: ${notCheckedIn.length} of ${group.totalMembers} members checked in successfully. Status: ${groupStatus}`,
                type: 'success'
            });
            setShowSuccessPopup(true);

            // Reset form
            setGroupCode('');
            setGroupGate('Gate A');
            setGroupStatus('complete');
            setConfirmCheckin(false);
            setShowGroupModal(false);
        } else {
            setPopupMessage({
                title: 'Group Not Found',
                message: 'Invalid group code. Please check and try again.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleVIPCheckin = () => {
        if (!vipTicketNumber) {
            setPopupMessage({
                title: 'Validation Error',
                message: 'Please enter a ticket number',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        const customer = customers.find(c => c.ticketNumber === vipTicketNumber);

        if (customer) {
            if (checkedInTickets.includes(customer.ticketNumber)) {
                setPopupMessage({
                    title: 'Already Checked In',
                    message: `${customer.name} has already been checked in.`,
                    type: 'error'
                });
                setShowSuccessPopup(true);
                return;
            }

            if (!customer.isVIP) {
                setPopupMessage({
                    title: 'Not a VIP Ticket',
                    message: 'This ticket is not eligible for VIP check-in.',
                    type: 'error'
                });
                setShowSuccessPopup(true);
                return;
            }

            checkedInTickets.push(customer.ticketNumber);
            setCustomers(prev => prev.map(c =>
                c.id === customer.id
                    ? { ...c, checkedIn: true, checkedInAt: new Date().toISOString(), gate: vipGate, checkInMethod: 'manual' }
                    : c
            ));

            setPopupMessage({
                title: 'VIP Customer Checked In',
                message: `${customer.name} (VIP) has been checked in successfully at ${vipGate}. Status: ${vipStatus}`,
                type: 'success'
            });
            setShowSuccessPopup(true);

            // Reset form
            setVipTicketNumber('');
            setVipGate('Gate A (VIP Express)');
            setVipStatus('priority');
            setShowVIPModal(false);
        } else {
            setPopupMessage({
                title: 'Ticket Not Found',
                message: 'Invalid ticket number. Please check and try again.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        }
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter customers by search and status
    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'checked-in' && customer.checkedIn) ||
            (statusFilter === 'pending' && !customer.checkedIn);

        return matchesSearch && matchesStatus;
    });

    // Customer Columns with Check In button
    const customerColumns = [
        {
            Header: 'Customer', accessor: 'name', Cell: (row: Customer) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.ticketNumber}</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Contact', accessor: 'email', Cell: (row: Customer) => (
                <div>
                    <p className="text-sm text-gray-900">{row.email}</p>
                    <p className="text-xs text-gray-500">{row.phone}</p>
                </div>
            )
        },
        {
            Header: 'Seat', accessor: 'seatNumber', Cell: (row: Customer) => (
                <p className="text-sm">Row {row.seatRow}, Seat {row.seatNumber}</p>
            )
        },
        {
            Header: 'Badges', accessor: 'isVIP', Cell: (row: Customer) => (
                <div className="flex gap-1">
                    {getVIPBadge(row.isVIP)}
                    {row.isGroup && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"><Users className="h-3 w-3" /> Group</span>}
                </div>
            )
        },
        { Header: 'Status', accessor: 'checkedIn', Cell: (row: Customer) => getStatusBadge(row.checkedIn) },
        { Header: 'Checked In At', accessor: 'checkedInAt', Cell: (row: Customer) => row.checkedInAt ? formatDateTime(row.checkedInAt) : '-' },
        {
            Header: 'Action', accessor: 'id', Cell: (row: Customer) => (
                !row.checkedIn && (
                    <button
                        onClick={() => handleMarkAsUsed(row)}
                        className="px-3 py-1 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-1"
                    >
                        <UserCheck className="h-3 w-3" />
                        Check In
                    </button>
                )
            )
        }
    ];

    // Group Columns
    const groupColumns = [
        { Header: 'Group Name', accessor: 'groupName' },
        { Header: 'Group Code', accessor: 'groupCode', Cell: (row: GroupCheckin) => <span className="font-mono text-sm">{row.groupCode}</span> },
        {
            Header: 'Progress', accessor: 'checkedInMembers', Cell: (row: GroupCheckin) => (
                <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                        <span>{row.checkedInMembers}/{row.totalMembers}</span>
                        <span>{Math.round((row.checkedInMembers / row.totalMembers) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(row.checkedInMembers / row.totalMembers) * 100}%` }} />
                    </div>
                </div>
            )
        },
        { Header: 'Remaining', accessor: 'remainingMembers' },
        { Header: 'Status', accessor: 'status', Cell: (row: GroupCheckin) => getGroupStatusBadge(row.status) },
        { Header: 'Gate', accessor: 'gate' }
    ];

    // Dashboard Cards
    const dashboardCards = [
        { title: 'Checked In', value: stats.totalCheckedIn, icon: UserCheck, color: 'from-green-500 to-emerald-600', delay: 0.1, change: `${stats.checkinRate.toFixed(0)}% rate`, trend: 'up' as const },
        { title: 'Remaining', value: stats.remaining, icon: Clock, color: 'from-yellow-500 to-orange-600', delay: 0.15, change: `${stats.remaining} waiting`, trend: 'down' as const },
        { title: 'VIP Checked In', value: stats.vipCheckedIn, icon: Crown, color: 'from-amber-500 to-yellow-600', delay: 0.2 },
        { title: 'Group Members', value: stats.groupCheckedIn, icon: Users, color: 'from-blue-500 to-cyan-600', delay: 0.25 }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <button onClick={() => navigate('/scanner/dashboard')} className="p-2 rounded-lg hover:bg-gray-100 transition">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                            <UserCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Customer Check-in</h1>
                            <p className="text-sm text-gray-500">Manage customer check-ins, group check-ins, and VIP entries</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {dashboardCards.map((card, index) => (
                        <StatCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            delay={card.delay}
                            change={card.change}
                            trend={card.trend}
                            onClick={card.onClick}
                        />
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <ReusableButton
                        onClick={() => setShowManualModal(true)}
                        icon={UserCheck}
                        label="Mark as Used"
                        className="bg-gradient-to-r from-teal-600 to-emerald-600"
                    />
                    <ReusableButton
                        onClick={() => setShowGroupModal(true)}
                        icon={Users}
                        label="Group Check-in"
                        variant="secondary"
                    />
                    <ReusableButton
                        onClick={() => setShowVIPModal(true)}
                        icon={Crown}
                        label="VIP Check-in"
                        variant="secondary"
                    />
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('mark')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${activeTab === 'mark' ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <UserCheck className="h-4 w-4 inline mr-2" />
                            All Customers
                        </button>
                        <button
                            onClick={() => setActiveTab('group')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${activeTab === 'group' ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Users className="h-4 w-4 inline mr-2" />
                            Groups
                        </button>
                    </nav>
                </div>

                {/* Search and Filter Bar */}
                {activeTab === 'mark' && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                        <div className="flex flex-wrap gap-3">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, ticket number, email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div className="relative min-w-[180px]">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none appearance-none bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="checked-in">Checked In</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Customers Table */}
                {activeTab === 'mark' && (
                    <ReusableTable
                        columns={customerColumns}
                        data={filteredCustomers}
                        title="Customer Check-in List"
                        icon={Users}
                        showSearch={false}
                        showExport={true}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                )}

                {/* Groups Table */}
                {activeTab === 'group' && (
                    <ReusableTable
                        columns={groupColumns}
                        data={groups}
                        title="Group Check-in Status"
                        icon={Users}
                        showSearch={false}
                        showExport={true}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                )}

                {/* Mark as Used Modal */}
                <AnimatePresence>
                    {showManualModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowManualModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Mark as Used</h2>
                                        <p className="text-white/80 text-sm">Manually check in a customer</p>
                                    </div>
                                    <button onClick={() => setShowManualModal(false)} className="text-white hover:bg-white/20 rounded-lg p-1 transition">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    {/* Ticket Number Input */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ticket Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={manualTicketNumber}
                                            onChange={(e) => setManualTicketNumber(e.target.value)}
                                            placeholder="Enter ticket number (e.g., TKT-001)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Gate Select */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gate <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={manualGate}
                                            onChange={(e) => setManualGate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                        >
                                            {gateOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status Select */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={manualStatus}
                                            onChange={(e) => setManualStatus(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                        >
                                            {manualStatusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Notes Textarea */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes (Optional)
                                        </label>
                                        <textarea
                                            value={manualNotes}
                                            onChange={(e) => setManualNotes(e.target.value)}
                                            placeholder="Add any notes about this check-in..."
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <ReusableButton type="button" variant="secondary" onClick={() => setShowManualModal(false)} className="flex-1">Cancel</ReusableButton>
                                        <ReusableButton type="button" onClick={handleManualCheckin} className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600">Check In</ReusableButton>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Group Check-in Modal */}
                <AnimatePresence>
                    {showGroupModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowGroupModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Group Check-in</h2>
                                        <p className="text-white/80 text-sm">Check in an entire group at once</p>
                                    </div>
                                    <button onClick={() => setShowGroupModal(false)} className="text-white hover:bg-white/20 rounded-lg p-1 transition">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-xs text-blue-800">
                                            <Info className="h-3 w-3 inline mr-1" />
                                            Group check-in will mark all members of the group as checked in at once.
                                        </p>
                                    </div>

                                    {/* Group Code Input */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Group Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={groupCode}
                                            onChange={(e) => setGroupCode(e.target.value)}
                                            placeholder="Enter group code (e.g., GRP-001)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Gate Select */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gate <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={groupGate}
                                            onChange={(e) => setGroupGate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                        >
                                            {gateOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status Select */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Group Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={groupStatus}
                                            onChange={(e) => setGroupStatus(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                        >
                                            {groupStatusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Confirm Checkbox */}
                                    <div className="mb-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={confirmCheckin}
                                                onChange={(e) => setConfirmCheckin(e.target.checked)}
                                                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                I confirm that all group members are present and ready for check-in
                                            </span>
                                        </label>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <ReusableButton type="button" variant="secondary" onClick={() => setShowGroupModal(false)} className="flex-1">Cancel</ReusableButton>
                                        <ReusableButton type="button" onClick={handleGroupCheckin} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">Check In Group</ReusableButton>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* VIP Check-in Modal */}
                <AnimatePresence>
                    {showVIPModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowVIPModal(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">VIP Check-in</h2>
                                        <p className="text-white/80 text-sm">Priority check-in for VIP customers</p>
                                    </div>
                                    <button onClick={() => setShowVIPModal(false)} className="text-white hover:bg-white/20 rounded-lg p-1 transition">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                        <p className="text-xs text-amber-800 flex items-center gap-1">
                                            <Crown className="h-3 w-3" />
                                            VIP customers get priority access through express gates.
                                        </p>
                                    </div>

                                    {/* Ticket Number Input */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ticket Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={vipTicketNumber}
                                            onChange={(e) => setVipTicketNumber(e.target.value)}
                                            placeholder="Enter VIP ticket number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* VIP Gate Select */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            VIP Gate <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={vipGate}
                                            onChange={(e) => setVipGate(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                        >
                                            {vipGateOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* VIP Status Select */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            VIP Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={vipStatus}
                                            onChange={(e) => setVipStatus(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                        >
                                            {vipStatusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <ReusableButton type="button" variant="secondary" onClick={() => setShowVIPModal(false)} className="flex-1">Cancel</ReusableButton>
                                        <ReusableButton type="button" onClick={handleVIPCheckin} className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600">Check In VIP</ReusableButton>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Tips Card */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">Check-in Tips</p>
                            <p className="text-xs text-blue-700 mt-1">
                                • Use "Mark as Used" for individual ticket check-ins with automatic validation<br />
                                • Use "Group Check-in" for corporate or group bookings - checks in all members at once<br />
                                • VIP customers get priority access through VIP gates with special handling<br />
                                • Each ticket can only be checked in once - duplicate attempts are automatically blocked<br />
                                • Use status filter to view checked-in or pending customers
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

export default CustomerCheckin;