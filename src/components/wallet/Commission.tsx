// src/pages/Admin/wallet/Commission.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Percent, TrendingUp, TrendingDown, Edit2, Save, X, AlertCircle,
    Shield, DollarSign, Clock, Calendar, Users, Ticket, Building,
    Smartphone, Landmark, CreditCard, Wallet, CheckCircle, Plus,
    Trash2, Settings, BarChart3, PiggyBank, AlertTriangle, Search,
    Filter, RefreshCw, ChevronLeft, ChevronRight, Eye, Power, PowerOff
} from 'lucide-react';
import ReusableButton from '../Reusable/ReusableButton';
import ReusableForm from '../Reusable/ReusableForm';
import ReusableTable from '../Reusable/ReusableTable';
import SuccessPopup from '../Reusable/SuccessPopup';
import * as Yup from 'yup';

// Types
interface CommissionRule {
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    appliesTo: 'booking' | 'ticket' | 'subscription' | 'all';
    userType: 'all' | 'theater' | 'customer' | 'admin';
    minAmount?: number;
    maxAmount?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface FeeStructure {
    id: string;
    name: string;
    description: string;
    type: 'withdrawal' | 'deposit' | 'transfer' | 'refund';
    feeType: 'percentage' | 'fixed';
    feeValue: number;
    minFee?: number;
    maxFee?: number;
    appliesTo: string[];
    isActive: boolean;
    createdAt: string;
}

const deepTeal = "#007590";

// Mock Data
const mockCommissions: CommissionRule[] = [
    {
        id: '1',
        name: 'Standard Booking Commission',
        type: 'percentage',
        value: 5,
        appliesTo: 'booking',
        userType: 'theater',
        minAmount: 100,
        maxAmount: 10000,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-03-15'
    },
    {
        id: '2',
        name: 'Premium Ticket Fee',
        type: 'fixed',
        value: 25,
        appliesTo: 'ticket',
        userType: 'customer',
        minAmount: 500,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-03-10'
    },
    {
        id: '3',
        name: 'Subscription Commission',
        type: 'percentage',
        value: 10,
        appliesTo: 'subscription',
        userType: 'all',
        isActive: true,
        createdAt: '2024-02-01',
        updatedAt: '2024-02-01'
    },
    {
        id: '4',
        name: 'Event Booking Fee',
        type: 'percentage',
        value: 7.5,
        appliesTo: 'booking',
        userType: 'all',
        minAmount: 50,
        maxAmount: 5000,
        isActive: false,
        createdAt: '2024-01-15',
        updatedAt: '2024-03-01'
    }
];

const mockFees: FeeStructure[] = [
    {
        id: '1',
        name: 'Bank Transfer Fee',
        description: 'Fee for bank transfer withdrawals',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: 25,
        minFee: 25,
        maxFee: 500,
        appliesTo: ['bank_transfer'],
        isActive: true,
        createdAt: '2024-01-01'
    },
    {
        id: '2',
        name: 'Telebirr Fee',
        description: 'Fee for Telebirr withdrawals',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: 10,
        minFee: 10,
        maxFee: 200,
        appliesTo: ['telebirr'],
        isActive: true,
        createdAt: '2024-01-01'
    },
    {
        id: '3',
        name: 'CBE Birr Fee',
        description: 'Fee for CBE Birr withdrawals',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: 10,
        minFee: 10,
        maxFee: 200,
        appliesTo: ['cbebirr'],
        isActive: true,
        createdAt: '2024-01-01'
    },
    {
        id: '4',
        name: 'HelloCash Fee',
        description: 'Fee for HelloCash withdrawals',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: 10,
        minFee: 10,
        maxFee: 200,
        appliesTo: ['hellocash'],
        isActive: true,
        createdAt: '2024-01-01'
    },
    {
        id: '5',
        name: 'Chapa Fee',
        description: 'Fee for Chapa withdrawals',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: 15,
        minFee: 15,
        maxFee: 300,
        appliesTo: ['chapa'],
        isActive: true,
        createdAt: '2024-01-01'
    }
];

// Validation Schemas
const commissionValidationSchema = Yup.object({
    name: Yup.string().required('Rule name is required').min(3, 'Name must be at least 3 characters'),
    type: Yup.string().required('Commission type is required'),
    value: Yup.number().required('Value is required').positive('Value must be positive'),
    appliesTo: Yup.string().required('Applies to is required'),
    userType: Yup.string().required('User type is required'),
    minAmount: Yup.number().min(0, 'Min amount cannot be negative'),
    maxAmount: Yup.number().min(0, 'Max amount cannot be negative'),
});

const feeValidationSchema = Yup.object({
    name: Yup.string().required('Fee name is required').min(3, 'Name must be at least 3 characters'),
    description: Yup.string(),
    type: Yup.string().required('Fee type is required'),
    feeType: Yup.string().required('Fee calculation type is required'),
    feeValue: Yup.number().required('Fee value is required').positive('Fee value must be positive'),
    minFee: Yup.number().min(0, 'Min fee cannot be negative'),
    maxFee: Yup.number().min(0, 'Max fee cannot be negative'),
    appliesTo: Yup.array().min(1, 'Select at least one payment method'),
});

const Commission: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'commissions' | 'fees'>('commissions');
    const [commissions, setCommissions] = useState<CommissionRule[]>(mockCommissions);
    const [fees, setFees] = useState<FeeStructure[]>(mockFees);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [modalType, setModalType] = useState<'commission' | 'fee'>('commission');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showReactivateModal, setShowReactivateModal] = useState(false);
    const [itemToAction, setItemToAction] = useState<any>(null);
    const [itemType, setItemType] = useState<'commission' | 'fee'>('commission');
    const [deactivateReason, setDeactivateReason] = useState('');
    const [reactivateReason, setReactivateReason] = useState('');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Commission Form Fields with proper support for Value, Min Amount, Max Amount
    const commissionFormFields = [
        { name: 'name', label: 'Rule Name', type: 'text', placeholder: 'e.g., Standard Booking Commission', required: true },
        {
            name: 'type',
            label: 'Commission Type',
            type: 'select',
            required: true,
            options: [
                { value: 'percentage', label: 'Percentage (%)' },
                { value: 'fixed', label: 'Fixed Amount (ETB)' }
            ]
        },
        { name: 'value', label: 'Value', type: 'number', placeholder: '5', required: true, step: '0.01' },
        {
            name: 'appliesTo',
            label: 'Applies To',
            type: 'select',
            required: true,
            options: [
                { value: 'all', label: 'All' },
                { value: 'booking', label: 'Bookings' },
                { value: 'ticket', label: 'Tickets' },
                { value: 'subscription', label: 'Subscriptions' }
            ]
        },
        {
            name: 'userType',
            label: 'User Type',
            type: 'select',
            required: true,
            options: [
                { value: 'all', label: 'All Users' },
                { value: 'theater', label: 'Theaters Only' },
                { value: 'customer', label: 'Customers Only' },
                { value: 'admin', label: 'Admin Only' }
            ]
        },
        { name: 'minAmount', label: 'Min Amount (Optional)', type: 'number', placeholder: '100', step: '0.01' },
        { name: 'maxAmount', label: 'Max Amount (Optional)', type: 'number', placeholder: '10000', step: '0.01' },
    ];

    // Fee Form Fields with proper support for Fee Value, Min Fee, Max Fee
    const feeFormFields = [
        { name: 'name', label: 'Fee Name', type: 'text', placeholder: 'e.g., Bank Transfer Fee', required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe this fee structure', rows: 2 },
        {
            name: 'type',
            label: 'Fee Type',
            type: 'select',
            required: true,
            options: [
                { value: 'withdrawal', label: 'Withdrawal' },
                { value: 'deposit', label: 'Deposit' },
                { value: 'transfer', label: 'Transfer' },
                { value: 'refund', label: 'Refund' }
            ]
        },
        {
            name: 'feeType',
            label: 'Fee Calculation',
            type: 'select',
            required: true,
            options: [
                { value: 'fixed', label: 'Fixed Amount' },
                { value: 'percentage', label: 'Percentage' }
            ]
        },
        { name: 'feeValue', label: 'Fee Value', type: 'number', placeholder: '25', required: true, step: '0.01' },
        { name: 'minFee', label: 'Min Fee (Optional)', type: 'number', placeholder: '10', step: '0.01' },
        { name: 'maxFee', label: 'Max Fee (Optional)', type: 'number', placeholder: '500', step: '0.01' },
    ];

    const handleSaveCommission = async (values: any, { setSubmitting }: any) => {
        const minAmount = values.minAmount ? parseFloat(values.minAmount) : undefined;
        const maxAmount = values.maxAmount ? parseFloat(values.maxAmount) : undefined;

        if (editingItem) {
            setCommissions(commissions.map(comm =>
                comm.id === editingItem.id
                    ? { ...comm, ...values, minAmount, maxAmount, value: parseFloat(values.value), updatedAt: new Date().toISOString().split('T')[0] }
                    : comm
            ));
            setPopupMessage({
                title: 'Commission Updated',
                message: 'Commission rule has been updated successfully.',
                type: 'success'
            });
        } else {
            const newCommission: CommissionRule = {
                id: Date.now().toString(),
                ...values,
                value: parseFloat(values.value),
                minAmount,
                maxAmount,
                isActive: true,
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0]
            };
            setCommissions([...commissions, newCommission]);
            setPopupMessage({
                title: 'Commission Added',
                message: 'New commission rule has been added successfully.',
                type: 'success'
            });
        }
        setShowModal(false);
        setEditingItem(null);
        setShowSuccessPopup(true);
        setSubmitting(false);
    };

    const handleSaveFee = async (values: any, { setSubmitting }: any) => {
        const appliesTo = values.appliesTo ? (typeof values.appliesTo === 'string' ? [values.appliesTo] : values.appliesTo) : [];
        const minFee = values.minFee ? parseFloat(values.minFee) : undefined;
        const maxFee = values.maxFee ? parseFloat(values.maxFee) : undefined;

        if (editingItem) {
            setFees(fees.map(fee =>
                fee.id === editingItem.id
                    ? { ...fee, ...values, appliesTo, feeValue: parseFloat(values.feeValue), minFee, maxFee }
                    : fee
            ));
            setPopupMessage({
                title: 'Fee Updated',
                message: 'Fee structure has been updated successfully.',
                type: 'success'
            });
        } else {
            const newFee: FeeStructure = {
                id: Date.now().toString(),
                ...values,
                feeValue: parseFloat(values.feeValue),
                appliesTo,
                minFee,
                maxFee,
                isActive: true,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setFees([...fees, newFee]);
            setPopupMessage({
                title: 'Fee Added',
                message: 'New fee structure has been added successfully.',
                type: 'success'
            });
        }
        setShowModal(false);
        setEditingItem(null);
        setShowSuccessPopup(true);
        setSubmitting(false);
    };

    // Delete Modal Handlers
    const openDeleteModal = (item: any, type: 'commission' | 'fee') => {
        setItemToAction(item);
        setItemType(type);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (itemType === 'commission') {
            setCommissions(commissions.filter(c => c.id !== itemToAction.id));
            setPopupMessage({
                title: 'Commission Deleted',
                message: `"${itemToAction.name}" has been permanently deleted.`,
                type: 'success'
            });
        } else {
            setFees(fees.filter(f => f.id !== itemToAction.id));
            setPopupMessage({
                title: 'Fee Deleted',
                message: `"${itemToAction.name}" has been permanently deleted.`,
                type: 'success'
            });
        }
        setShowDeleteModal(false);
        setItemToAction(null);
        setShowSuccessPopup(true);
    };

    // Deactivate Modal Handlers
    const openDeactivateModal = (item: any, type: 'commission' | 'fee') => {
        setItemToAction(item);
        setItemType(type);
        setDeactivateReason('');
        setShowDeactivateModal(true);
    };

    const handleConfirmDeactivate = () => {
        if (!deactivateReason) {
            setPopupMessage({
                title: 'Reason Required',
                message: 'Please provide a reason for deactivation.',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        if (itemType === 'commission') {
            setCommissions(commissions.map(c =>
                c.id === itemToAction.id ? { ...c, isActive: false } : c
            ));
            setPopupMessage({
                title: 'Commission Deactivated',
                message: `"${itemToAction.name}" has been deactivated. Reason: ${deactivateReason}`,
                type: 'warning'
            });
        } else {
            setFees(fees.map(f =>
                f.id === itemToAction.id ? { ...f, isActive: false } : f
            ));
            setPopupMessage({
                title: 'Fee Deactivated',
                message: `"${itemToAction.name}" has been deactivated. Reason: ${deactivateReason}`,
                type: 'warning'
            });
        }
        setShowDeactivateModal(false);
        setItemToAction(null);
        setDeactivateReason('');
        setShowSuccessPopup(true);
    };

    // Reactivate Modal Handlers
    const openReactivateModal = (item: any, type: 'commission' | 'fee') => {
        setItemToAction(item);
        setItemType(type);
        setReactivateReason('');
        setShowReactivateModal(true);
    };

    const handleConfirmReactivate = () => {
        if (!reactivateReason) {
            setPopupMessage({
                title: 'Reason Required',
                message: 'Please provide a reason for reactivation.',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        if (itemType === 'commission') {
            setCommissions(commissions.map(c =>
                c.id === itemToAction.id ? { ...c, isActive: true } : c
            ));
            setPopupMessage({
                title: 'Commission Reactivated',
                message: `"${itemToAction.name}" has been reactivated. Reason: ${reactivateReason}`,
                type: 'success'
            });
        } else {
            setFees(fees.map(f =>
                f.id === itemToAction.id ? { ...f, isActive: true } : f
            ));
            setPopupMessage({
                title: 'Fee Reactivated',
                message: `"${itemToAction.name}" has been reactivated. Reason: ${reactivateReason}`,
                type: 'success'
            });
        }
        setShowReactivateModal(false);
        setItemToAction(null);
        setReactivateReason('');
        setShowSuccessPopup(true);
    };

    const handleEdit = (item: any, type: 'commission' | 'fee') => {
        setEditingItem(item);
        setModalType(type);
        setShowModal(true);
    };

    const handleView = (item: any) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3" />
                Active
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                <X className="h-3 w-3" />
                Inactive
            </span>
        );
    };

    // Table Columns for Commissions
    const commissionColumns = [
        {
            Header: 'Rule Name',
            accessor: 'name',
            sortable: true,
            Cell: (row: CommissionRule) => (
                <div>
                    <div className="font-medium text-gray-900">{row.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">ID: {row.id}</div>
                </div>
            )
        },
        {
            Header: 'Value',
            accessor: 'value',
            sortable: true,
            Cell: (row: CommissionRule) => (
                <span className="font-semibold" style={{ color: deepTeal }}>
                    {row.type === 'percentage' ? `${row.value}%` : formatCurrency(row.value)}
                </span>
            )
        },
        {
            Header: 'Applies To',
            accessor: 'appliesTo',
            sortable: true,
            Cell: (row: CommissionRule) => (
                <span className="capitalize text-gray-700">{row.appliesTo}</span>
            )
        },
        {
            Header: 'User Type',
            accessor: 'userType',
            sortable: true,
            Cell: (row: CommissionRule) => (
                <span className="capitalize text-gray-700">{row.userType}</span>
            )
        },
        {
            Header: 'Status',
            accessor: 'isActive',
            sortable: true,
            Cell: (row: CommissionRule) => getStatusBadge(row.isActive)
        },
        {
            Header: 'Last Updated',
            accessor: 'updatedAt',
            sortable: true,
            Cell: (row: CommissionRule) => (
                <div className="text-sm text-gray-500">{row.updatedAt}</div>
            )
        },
        {
            Header: 'Actions',
            accessor: 'id',
            sortable: false,
            Cell: (row: CommissionRule) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="View Details"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                        onClick={() => handleEdit(row, 'commission')}
                        className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="h-4 w-4 text-teal-600" />
                    </button>
                    {row.isActive ? (
                        <button
                            onClick={() => openDeactivateModal(row, 'commission')}
                            className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                            title="Deactivate"
                        >
                            <PowerOff className="h-4 w-4 text-orange-600" />
                        </button>
                    ) : (
                        <button
                            onClick={() => openReactivateModal(row, 'commission')}
                            className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                            title="Reactivate"
                        >
                            <Power className="h-4 w-4 text-green-600" />
                        </button>
                    )}
                    <button
                        onClick={() => openDeleteModal(row, 'commission')}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                </div>
            )
        }
    ];

    // Table Columns for Fees
    const feeColumns = [
        {
            Header: 'Fee Name',
            accessor: 'name',
            sortable: true,
            Cell: (row: FeeStructure) => (
                <div>
                    <div className="font-medium text-gray-900">{row.name}</div>
                    <div className="text-xs text-gray-500">{row.description}</div>
                </div>
            )
        },
        {
            Header: 'Fee Value',
            accessor: 'feeValue',
            sortable: true,
            Cell: (row: FeeStructure) => (
                <span className="font-semibold" style={{ color: deepTeal }}>
                    {row.feeType === 'percentage' ? `${row.feeValue}%` : formatCurrency(row.feeValue)}
                </span>
            )
        },
        {
            Header: 'Type',
            accessor: 'type',
            sortable: true,
            Cell: (row: FeeStructure) => (
                <span className="capitalize text-gray-700">{row.type}</span>
            )
        },
        {
            Header: 'Payment Methods',
            accessor: 'appliesTo',
            sortable: false,
            Cell: (row: FeeStructure) => (
                <div className="flex flex-wrap gap-1">
                    {row.appliesTo.map(method => (
                        <span key={method} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                            {method.replace('_', ' ')}
                        </span>
                    ))}
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'isActive',
            sortable: true,
            Cell: (row: FeeStructure) => getStatusBadge(row.isActive)
        },
        {
            Header: 'Actions',
            accessor: 'id',
            sortable: false,
            Cell: (row: FeeStructure) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleView(row)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="View Details"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                        onClick={() => handleEdit(row, 'fee')}
                        className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="h-4 w-4 text-teal-600" />
                    </button>
                    {row.isActive ? (
                        <button
                            onClick={() => openDeactivateModal(row, 'fee')}
                            className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                            title="Deactivate"
                        >
                            <PowerOff className="h-4 w-4 text-orange-600" />
                        </button>
                    ) : (
                        <button
                            onClick={() => openReactivateModal(row, 'fee')}
                            className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                            title="Reactivate"
                        >
                            <Power className="h-4 w-4 text-green-600" />
                        </button>
                    )}
                    <button
                        onClick={() => openDeleteModal(row, 'fee')}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                </div>
            )
        }
    ];

    const filteredCommissions = commissions.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && c.isActive) || (statusFilter === 'inactive' && !c.isActive);
        return matchesSearch && matchesStatus;
    });

    const filteredFees = fees.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && f.isActive) || (statusFilter === 'inactive' && !f.isActive);
        return matchesSearch && matchesStatus;
    });

    const stats = {
        totalCommissionRate: commissions.filter(c => c.isActive).reduce((sum, c) => sum + c.value, 0),
        activeCommissions: commissions.filter(c => c.isActive).length,
        totalFees: fees.filter(f => f.isActive).reduce((sum, f) => sum + f.feeValue, 0),
        activeFees: fees.filter(f => f.isActive).length
    };

    const initialCommissionValues = editingItem ? {
        name: editingItem.name,
        type: editingItem.type,
        value: editingItem.value,
        appliesTo: editingItem.appliesTo,
        userType: editingItem.userType,
        minAmount: editingItem.minAmount || '',
        maxAmount: editingItem.maxAmount || ''
    } : {
        name: '',
        type: 'percentage',
        value: '',
        appliesTo: 'all',
        userType: 'all',
        minAmount: '',
        maxAmount: ''
    };

    const initialFeeValues = editingItem ? {
        name: editingItem.name,
        description: editingItem.description || '',
        type: editingItem.type,
        feeType: editingItem.feeType,
        feeValue: editingItem.feeValue,
        minFee: editingItem.minFee || '',
        maxFee: editingItem.maxFee || '',
        appliesTo: editingItem.appliesTo || []
    } : {
        name: '',
        description: '',
        type: 'withdrawal',
        feeType: 'fixed',
        feeValue: '',
        minFee: '',
        maxFee: '',
        appliesTo: []
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 rounded-xl" style={{ background: `linear-gradient(135deg, ${deepTeal} 0%, ${deepTeal}CC 100%)` }}>
                                    <Percent className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Commission & Fees System</h1>
                            </div>
                            <p className="text-gray-600">Manage platform commissions and transaction fees</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="px-4 py-2 rounded-xl border" style={{ backgroundColor: `${deepTeal}10`, borderColor: `${deepTeal}30` }}>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" style={{ color: deepTeal }} />
                                    <span className="text-sm" style={{ color: deepTeal }}>Automated Calculations</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Commission Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCommissionRate}%</p>
                            </div>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${deepTeal}15` }}>
                                <Percent className="h-5 w-5" style={{ color: deepTeal }} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Commissions</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeCommissions}</p>
                            </div>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${deepTeal}15` }}>
                                <TrendingUp className="h-5 w-5" style={{ color: deepTeal }} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Fees</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalFees)}</p>
                            </div>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${deepTeal}15` }}>
                                <DollarSign className="h-5 w-5" style={{ color: deepTeal }} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Fees</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeFees}</p>
                            </div>
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${deepTeal}15` }}>
                                <PiggyBank className="h-5 w-5" style={{ color: deepTeal }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex gap-2 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('commissions')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${activeTab === 'commissions' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                            style={activeTab === 'commissions' ? { color: deepTeal, borderBottomColor: deepTeal, backgroundColor: `${deepTeal}08` } : {}}
                        >
                            <div className="flex items-center gap-2">
                                <Percent className="h-4 w-4" />
                                Commission Rules
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('fees')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${activeTab === 'fees' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                            style={activeTab === 'fees' ? { color: deepTeal, borderBottomColor: deepTeal, backgroundColor: `${deepTeal}08` } : {}}
                        >
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Fee Structures
                            </div>
                        </button>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab === 'commissions' ? 'commission rules' : 'fee structures'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none bg-gray-50 hover:bg-white transition-all"
                                style={{ focusRingColor: deepTeal }}
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                        <ReusableButton
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                            }}
                            variant="secondary"
                            size="sm"
                            icon={RefreshCw}
                        >
                            Reset
                        </ReusableButton>
                        <ReusableButton
                            onClick={() => {
                                setEditingItem(null);
                                setModalType(activeTab === 'commissions' ? 'commission' : 'fee');
                                setShowModal(true);
                            }}
                            variant="primary"
                            icon={Plus}
                        >
                            Add {activeTab === 'commissions' ? 'Commission' : 'Fee'}
                        </ReusableButton>
                    </div>
                </div>

                {/* Tables */}
                {activeTab === 'commissions' && (
                    <ReusableTable
                        columns={commissionColumns}
                        data={filteredCommissions}
                        title="Commission Rules"
                        icon={Percent}
                        showSearch={false}
                        showExport={true}
                        showPrint={true}
                        itemsPerPage={10}
                    />
                )}

                {activeTab === 'fees' && (
                    <ReusableTable
                        columns={feeColumns}
                        data={filteredFees}
                        title="Fee Structures"
                        icon={DollarSign}
                        showSearch={false}
                        showExport={true}
                        showPrint={true}
                        itemsPerPage={10}
                    />
                )}

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${deepTeal}15` }}>
                                            {modalType === 'commission' ? (
                                                <Percent className="h-5 w-5" style={{ color: deepTeal }} />
                                            ) : (
                                                <DollarSign className="h-5 w-5" style={{ color: deepTeal }} />
                                            )}
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {editingItem ? 'Edit' : 'Add'} {modalType === 'commission' ? 'Commission Rule' : 'Fee Structure'}
                                        </h2>
                                    </div>
                                    <button onClick={() => { setShowModal(false); setEditingItem(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>

                                <div className="p-6">
                                    {modalType === 'commission' ? (
                                        <>
                                            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${deepTeal}10` }}>
                                                <p className="text-sm" style={{ color: deepTeal }}>
                                                    <AlertCircle className="h-4 w-4 inline mr-2" />
                                                    Commission rules determine how much the platform earns from each transaction.
                                                    <br />
                                                    <strong>Note:</strong> Min/Max amounts define the transaction range where this rule applies.
                                                </p>
                                            </div>
                                            <ReusableForm
                                                fields={commissionFormFields}
                                                onSubmit={handleSaveCommission}
                                                initialValues={initialCommissionValues}
                                                validationSchema={commissionValidationSchema}
                                                submitLabel={editingItem ? 'Update Commission' : 'Add Commission'}
                                                cancelLabel="Cancel"
                                                onCancel={() => { setShowModal(false); setEditingItem(null); }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${deepTeal}10` }}>
                                                <p className="text-sm" style={{ color: deepTeal }}>
                                                    <AlertCircle className="h-4 w-4 inline mr-2" />
                                                    Fee structures define charges for payment processing and withdrawals.
                                                    <br />
                                                    <strong>Note:</strong> Min/Max fees set the boundaries for the applied fee amount.
                                                </p>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Methods *</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['chapa', 'telebirr', 'cbebirr', 'hellocash', 'bank_transfer'].map(method => (
                                                        <label key={method} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                            <input
                                                                type="checkbox"
                                                                value={method}
                                                                checked={initialFeeValues.appliesTo?.includes(method)}
                                                                onChange={(e) => {
                                                                    const newAppliesTo = e.target.checked
                                                                        ? [...(initialFeeValues.appliesTo || []), method]
                                                                        : (initialFeeValues.appliesTo || []).filter(m => m !== method);
                                                                    setEditingItem({ ...initialFeeValues, appliesTo: newAppliesTo });
                                                                }}
                                                                className="w-4 h-4 rounded" style={{ accentColor: deepTeal }}
                                                            />
                                                            <span className="text-sm text-gray-700 capitalize">{method.replace('_', ' ')}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <ReusableForm
                                                fields={feeFormFields}
                                                onSubmit={handleSaveFee}
                                                initialValues={initialFeeValues}
                                                validationSchema={feeValidationSchema}
                                                submitLabel={editingItem ? 'Update Fee' : 'Add Fee'}
                                                cancelLabel="Cancel"
                                                onCancel={() => { setShowModal(false); setEditingItem(null); }}
                                            />
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* View Details Modal */}
                <AnimatePresence>
                    {showViewModal && selectedItem && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                            >
                                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center" style={{ background: `linear-gradient(135deg, ${deepTeal} 0%, ${deepTeal}CC 100%)` }}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-xl">
                                            {'type' in selectedItem && (selectedItem.type === 'percentage' || selectedItem.feeType === 'percentage') ? (
                                                <Percent className="h-5 w-5 text-white" />
                                            ) : (
                                                <DollarSign className="h-5 w-5 text-white" />
                                            )}
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Details</h2>
                                    </div>
                                    <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-white/20 rounded-lg">
                                        <X className="h-5 w-5 text-white" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    {'minAmount' in selectedItem ? (
                                        // Commission Details with Value, Min Amount, Max Amount
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Rule Name</label>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedItem.name}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Value</label>
                                                    <p className="font-medium mt-1" style={{ color: deepTeal }}>
                                                        {selectedItem.type === 'percentage' ? `${selectedItem.value}%` : formatCurrency(selectedItem.value)}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Applies To</label>
                                                    <p className="font-medium text-gray-900 mt-1 capitalize">{selectedItem.appliesTo}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">User Type</label>
                                                    <p className="font-medium text-gray-900 mt-1 capitalize">{selectedItem.userType}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Min Amount</label>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedItem.minAmount ? formatCurrency(selectedItem.minAmount) : 'Not set'}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Max Amount</label>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedItem.maxAmount ? formatCurrency(selectedItem.maxAmount) : 'Not set'}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Status</label>
                                                    <div className="mt-1">{getStatusBadge(selectedItem.isActive)}</div>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Last Updated</label>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedItem.updatedAt}</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        // Fee Details with Fee Value, Min Fee, Max Fee
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Fee Name</label>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedItem.name}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Description</label>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedItem.description || 'N/A'}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Fee Value</label>
                                                    <p className="font-medium mt-1" style={{ color: deepTeal }}>
                                                        {selectedItem.feeType === 'percentage' ? `${selectedItem.feeValue}%` : formatCurrency(selectedItem.feeValue)}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Fee Type</label>
                                                    <p className="font-medium text-gray-900 mt-1 capitalize">{selectedItem.type}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Min Fee</label>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedItem.minFee ? formatCurrency(selectedItem.minFee) : 'Not set'}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Max Fee</label>
                                                    <p className="font-medium text-gray-900 mt-1">{selectedItem.maxFee ? formatCurrency(selectedItem.maxFee) : 'Not set'}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Payment Methods</label>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {selectedItem.appliesTo.map((method: string) => (
                                                            <span key={method} className="px-2 py-0.5 bg-gray-200 rounded text-xs text-gray-700">
                                                                {method.replace('_', ' ')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <label className="text-xs text-gray-500 uppercase">Status</label>
                                                    <div className="mt-1">{getStatusBadge(selectedItem.isActive)}</div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="border-t px-6 py-4 flex justify-end gap-3">
                                    <ReusableButton variant="secondary" onClick={() => setShowViewModal(false)}>Close</ReusableButton>
                                    <ReusableButton
                                        variant="primary"
                                        onClick={() => {
                                            setShowViewModal(false);
                                            handleEdit(selectedItem, 'minAmount' in selectedItem ? 'commission' : 'fee');
                                        }}
                                    >
                                        Edit Item
                                    </ReusableButton>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteModal && itemToAction && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-md w-full"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-red-100 rounded-full">
                                            <AlertTriangle className="h-6 w-6 text-red-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Confirm Delete</h2>
                                    </div>
                                    <p className="text-gray-600 mb-2">
                                        Are you sure you want to delete <strong className="text-gray-900">{itemToAction.name}</strong>?
                                    </p>
                                    <p className="text-sm text-red-600 mb-6">
                                        ⚠️ This action cannot be undone. The {itemType} rule will be permanently removed.
                                    </p>
                                    <div className="flex gap-3">
                                        <ReusableButton
                                            variant="secondary"
                                            onClick={() => setShowDeleteModal(false)}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </ReusableButton>
                                        <ReusableButton
                                            variant="danger"
                                            onClick={handleConfirmDelete}
                                            className="flex-1"
                                        >
                                            Delete Permanently
                                        </ReusableButton>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Deactivate Confirmation Modal */}
                <AnimatePresence>
                    {showDeactivateModal && itemToAction && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-md w-full"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-orange-100 rounded-full">
                                            <PowerOff className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Deactivate {itemType === 'commission' ? 'Commission' : 'Fee'}</h2>
                                    </div>
                                    <p className="text-gray-600 mb-2">
                                        Are you sure you want to deactivate <strong className="text-gray-900">{itemToAction.name}</strong>?
                                    </p>
                                    <p className="text-sm text-orange-600 mb-4">
                                        ⚠️ This rule will no longer be applied to new transactions.
                                    </p>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason for deactivation <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={deactivateReason}
                                            onChange={(e) => setDeactivateReason(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="">Select reason</option>
                                            <option value="No longer needed">No longer needed</option>
                                            <option value="Temporary pause">Temporary pause</option>
                                            <option value="Under review">Under review</option>
                                            <option value="Policy change">Policy change</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    {deactivateReason === 'Other' && (
                                        <div className="mb-4">
                                            <textarea
                                                value={deactivateReason}
                                                onChange={(e) => setDeactivateReason(e.target.value)}
                                                placeholder="Please specify reason..."
                                                rows={2}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                    )}
                                    <div className="flex gap-3">
                                        <ReusableButton
                                            variant="secondary"
                                            onClick={() => setShowDeactivateModal(false)}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </ReusableButton>
                                        <ReusableButton
                                            variant="danger"
                                            onClick={handleConfirmDeactivate}
                                            className="flex-1"
                                        >
                                            Confirm Deactivation
                                        </ReusableButton>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Reactivate Confirmation Modal */}
                <AnimatePresence>
                    {showReactivateModal && itemToAction && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-md w-full"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-green-100 rounded-full">
                                            <Power className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Reactivate {itemType === 'commission' ? 'Commission' : 'Fee'}</h2>
                                    </div>
                                    <p className="text-gray-600 mb-2">
                                        Are you sure you want to reactivate <strong className="text-gray-900">{itemToAction.name}</strong>?
                                    </p>
                                    <p className="text-sm text-green-600 mb-4">
                                        ✅ This rule will be applied to new transactions once reactivated.
                                    </p>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason for reactivation <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={reactivateReason}
                                            onChange={(e) => setReactivateReason(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="">Select reason</option>
                                            <option value="Policy restored">Policy restored</option>
                                            <option value="Review completed">Review completed</option>
                                            <option value="Issue resolved">Issue resolved</option>
                                            <option value="Business need">Business need</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    {reactivateReason === 'Other' && (
                                        <div className="mb-4">
                                            <textarea
                                                value={reactivateReason}
                                                onChange={(e) => setReactivateReason(e.target.value)}
                                                placeholder="Please specify reason..."
                                                rows={2}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    )}
                                    <div className="flex gap-3">
                                        <ReusableButton
                                            variant="secondary"
                                            onClick={() => setShowReactivateModal(false)}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </ReusableButton>
                                        <ReusableButton
                                            variant="success"
                                            onClick={handleConfirmReactivate}
                                            className="flex-1"
                                        >
                                            Confirm Reactivation
                                        </ReusableButton>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

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

export default Commission;