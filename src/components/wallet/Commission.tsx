// src/components/wallet/Commission.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Percent,
    DollarSign,
    Edit,
    Trash2,
    Plus,
    CheckCircle,
    XCircle,
    TrendingUp,
    Wallet,
    Search,
    AlertCircle,
    ArrowRight,
    LayoutGrid,
    Banknote,
    CreditCard
} from 'lucide-react';
import ReusableButton from '../Reusable/ReusableButton';
import ReusableTable from '../Reusable/ReusableTable';
import SuccessPopup from '../Reusable/SuccessPopup';

// Types
interface CommissionRule {
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    appliesTo: string;
    targetName?: string;
    minCommission?: number;
    maxCommission?: number;
    isActive: boolean;
    priority: number;
    updatedAt: string;
}

interface FeeStructure {
    id: string;
    name: string;
    description: string;
    type: 'withdrawal' | 'deposit' | 'transaction';
    feeType: 'fixed' | 'percentage';
    feeValue: number;
    minFee?: number;
    maxFee?: number;
    appliesTo: string[];
    isActive: boolean;
}

// Mock Data - NO REFUND
const mockCommissionRules: CommissionRule[] = [
    { id: '1', name: 'Standard Commission', type: 'percentage', value: 15, appliesTo: 'all', minCommission: 10, maxCommission: 500, isActive: true, priority: 1, updatedAt: '2024-03-15' },
    { id: '2', name: 'Grand Cinema Special', type: 'percentage', value: 12, appliesTo: 'theater', targetName: 'Grand Cinema', minCommission: 8, maxCommission: 400, isActive: true, priority: 2, updatedAt: '2024-03-10' }
];

const mockFeeStructures: FeeStructure[] = [
    { id: '1', name: 'Bank Transfer Fee', description: 'Fee for bank transfer withdrawals', type: 'withdrawal', feeType: 'fixed', feeValue: 25, minFee: 25, maxFee: 500, appliesTo: ['bank_transfer'], isActive: true },
    { id: '2', name: 'Telebirr Fee', description: 'Fee for Telebirr withdrawals', type: 'withdrawal', feeType: 'fixed', feeValue: 10, minFee: 10, maxFee: 200, appliesTo: ['telebirr'], isActive: true },
    { id: '3', name: 'CBE Birr Fee', description: 'Fee for CBE Birr withdrawals', type: 'withdrawal', feeType: 'fixed', feeValue: 10, minFee: 10, maxFee: 200, appliesTo: ['cbebirr'], isActive: true },
    { id: '4', name: 'HelloCash Fee', description: 'Fee for HelloCash withdrawals', type: 'withdrawal', feeType: 'fixed', feeValue: 10, minFee: 10, maxFee: 200, appliesTo: ['hellocash'], isActive: true },
    { id: '5', name: 'Chapa Fee', description: 'Fee for Chapa withdrawals', type: 'withdrawal', feeType: 'fixed', feeValue: 15, minFee: 15, maxFee: 300, appliesTo: ['chapa'], isActive: true },
    { id: '6', name: 'Transaction Fee', description: 'Fee per booking transaction', type: 'transaction', feeType: 'fixed', feeValue: 5, appliesTo: ['all_bookings'], isActive: true }
];

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
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link }) => {
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
                <a href={link} className="block">
                    <CardContent />
                </a>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
};

const Commission: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'rules' | 'fees'>('rules');
    const [rules, setRules] = useState<CommissionRule[]>(mockCommissionRules);
    const [fees, setFees] = useState<FeeStructure[]>(mockFeeStructures);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Form state for add/edit
    const [formData, setFormData] = useState({
        name: '',
        type: 'percentage',
        value: 0,
        appliesTo: 'all',
        minCommission: '',
        maxCommission: '',
        priority: 1,
        description: '',
        feeType: 'fixed',
        minFee: '',
        maxFee: ''
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const getStatusBadge = (isActive: boolean) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );

    const getFeeTypeIcon = (type: string) => {
        switch (type) {
            case 'withdrawal': return <Banknote className="h-3 w-3" />;
            case 'deposit': return <CreditCard className="h-3 w-3" />;
            default: return <CreditCard className="h-3 w-3" />;
        }
    };

    // CRUD Operations
    const handleAdd = () => {
        setFormData({
            name: '',
            type: 'percentage',
            value: 0,
            appliesTo: 'all',
            minCommission: '',
            maxCommission: '',
            priority: rules.length + 1,
            description: '',
            feeType: 'fixed',
            minFee: '',
            maxFee: ''
        });
        setShowAddModal(true);
    };

    const handleEdit = (item: any) => {
        if (activeTab === 'rules') {
            setFormData({
                name: item.name,
                type: item.type,
                value: item.value,
                appliesTo: item.appliesTo,
                minCommission: item.minCommission?.toString() || '',
                maxCommission: item.maxCommission?.toString() || '',
                priority: item.priority,
                description: '',
                feeType: 'fixed',
                minFee: '',
                maxFee: ''
            });
        } else {
            setFormData({
                name: item.name,
                type: 'percentage',
                value: item.feeValue,
                appliesTo: 'all',
                minCommission: '',
                maxCommission: '',
                priority: 1,
                description: item.description,
                feeType: item.feeType,
                minFee: item.minFee?.toString() || '',
                maxFee: item.maxFee?.toString() || ''
            });
        }
        setSelectedItem(item);
        setShowEditModal(true);
    };

    const handleDelete = (item: any) => {
        setSelectedItem(item);
        setShowDeleteConfirm(true);
    };

    const handleToggleStatus = (id: string, isRule: boolean) => {
        if (isRule) {
            setRules(rules.map(rule => rule.id === id ? { ...rule, isActive: !rule.isActive } : rule));
        } else {
            setFees(fees.map(fee => fee.id === id ? { ...fee, isActive: !fee.isActive } : fee));
        }
        setPopupMessage({ title: 'Status Updated', message: 'Status changed successfully', type: 'success' });
        setShowSuccessPopup(true);
    };

    const confirmDelete = () => {
        if (selectedItem) {
            if (activeTab === 'rules') {
                setRules(rules.filter(r => r.id !== selectedItem.id));
            } else {
                setFees(fees.filter(f => f.id !== selectedItem.id));
            }
            setPopupMessage({ title: 'Deleted', message: `${selectedItem.name} has been deleted`, type: 'success' });
            setShowSuccessPopup(true);
        }
        setShowDeleteConfirm(false);
        setSelectedItem(null);
    };

    const handleAddSubmit = () => {
        if (activeTab === 'rules') {
            const newRule: CommissionRule = {
                id: Date.now().toString(),
                name: formData.name,
                type: formData.type as 'percentage' | 'fixed',
                value: formData.value,
                appliesTo: formData.appliesTo,
                minCommission: formData.minCommission ? Number(formData.minCommission) : undefined,
                maxCommission: formData.maxCommission ? Number(formData.maxCommission) : undefined,
                isActive: true,
                priority: formData.priority,
                updatedAt: new Date().toISOString().split('T')[0]
            };
            setRules([newRule, ...rules]);
            setPopupMessage({ title: 'Rule Added', message: `${formData.name} added successfully`, type: 'success' });
        } else {
            const newFee: FeeStructure = {
                id: Date.now().toString(),
                name: formData.name,
                description: formData.description,
                type: 'withdrawal',
                feeType: formData.feeType as 'fixed' | 'percentage',
                feeValue: formData.value,
                minFee: formData.minFee ? Number(formData.minFee) : undefined,
                maxFee: formData.maxFee ? Number(formData.maxFee) : undefined,
                appliesTo: ['bank_transfer'],
                isActive: true
            };
            setFees([newFee, ...fees]);
            setPopupMessage({ title: 'Fee Added', message: `${formData.name} added successfully`, type: 'success' });
        }
        setShowAddModal(false);
        setShowSuccessPopup(true);
    };

    const handleEditSubmit = () => {
        if (activeTab === 'rules' && selectedItem) {
            setRules(rules.map(rule =>
                rule.id === selectedItem.id
                    ? {
                        ...rule,
                        name: formData.name,
                        type: formData.type as 'percentage' | 'fixed',
                        value: formData.value,
                        appliesTo: formData.appliesTo,
                        minCommission: formData.minCommission ? Number(formData.minCommission) : undefined,
                        maxCommission: formData.maxCommission ? Number(formData.maxCommission) : undefined,
                        priority: formData.priority,
                        updatedAt: new Date().toISOString().split('T')[0]
                    }
                    : rule
            ));
            setPopupMessage({ title: 'Rule Updated', message: `${formData.name} updated successfully`, type: 'success' });
        } else if (selectedItem) {
            setFees(fees.map(fee =>
                fee.id === selectedItem.id
                    ? {
                        ...fee,
                        name: formData.name,
                        description: formData.description,
                        feeType: formData.feeType as 'fixed' | 'percentage',
                        feeValue: formData.value,
                        minFee: formData.minFee ? Number(formData.minFee) : undefined,
                        maxFee: formData.maxFee ? Number(formData.maxFee) : undefined
                    }
                    : fee
            ));
            setPopupMessage({ title: 'Fee Updated', message: `${formData.name} updated successfully`, type: 'success' });
        }
        setShowEditModal(false);
        setSelectedItem(null);
        setShowSuccessPopup(true);
    };

    // Table Columns
    const ruleColumns = [
        { Header: 'Rule Name', accessor: 'name', Cell: (row: CommissionRule) => <div><p className="font-medium text-gray-900">{row.name}</p><p className="text-xs text-gray-500">Priority: {row.priority}</p></div> },
        { Header: 'Value', accessor: 'value', Cell: (row: CommissionRule) => <span className="font-semibold text-purple-600">{row.type === 'percentage' ? `${row.value}%` : formatCurrency(row.value)}</span> },
        { Header: 'Applies To', accessor: 'appliesTo', Cell: (row: CommissionRule) => <span className="text-sm capitalize">{row.appliesTo}{row.targetName && `: ${row.targetName}`}</span> },
        { Header: 'Min/Max', accessor: 'minCommission', Cell: (row: CommissionRule) => <span className="text-sm">{row.minCommission ? formatCurrency(row.minCommission) : '-'}{row.maxCommission ? ` - ${formatCurrency(row.maxCommission)}` : ''}</span> },
        { Header: 'Status', accessor: 'isActive', Cell: (row: CommissionRule) => getStatusBadge(row.isActive) },
        { Header: 'Updated', accessor: 'updatedAt', Cell: (row: CommissionRule) => formatDate(row.updatedAt) }
    ];

    const feeColumns = [
        { Header: 'Fee Name', accessor: 'name', Cell: (row: FeeStructure) => <div><p className="font-medium text-gray-900">{row.name}</p><p className="text-xs text-gray-500">{row.description}</p></div> },
        { Header: 'Type', accessor: 'type', Cell: (row: FeeStructure) => <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 capitalize">{getFeeTypeIcon(row.type)} {row.type}</span> },
        { Header: 'Value', accessor: 'feeValue', Cell: (row: FeeStructure) => <span className="font-semibold text-blue-600">{row.feeType === 'percentage' ? `${row.feeValue}%` : formatCurrency(row.feeValue)}</span> },
        { Header: 'Min/Max', accessor: 'minFee', Cell: (row: FeeStructure) => <span className="text-sm">{row.minFee ? formatCurrency(row.minFee) : '-'}{row.maxFee ? ` - ${formatCurrency(row.maxFee)}` : ''}</span> },
        { Header: 'Status', accessor: 'isActive', Cell: (row: FeeStructure) => getStatusBadge(row.isActive) }
    ];

    // Action Buttons
    const ruleActions = [
        { label: 'Edit', icon: Edit, onClick: (row: CommissionRule) => handleEdit(row), color: 'success' as const },
        { label: 'Delete', icon: Trash2, onClick: (row: CommissionRule) => handleDelete(row), color: 'danger' as const },
        { label: row => row.isActive ? 'Deactivate' : 'Activate', icon: row => row.isActive ? XCircle : CheckCircle, onClick: (row: CommissionRule) => handleToggleStatus(row.id, true), color: row => row.isActive ? 'warning' : 'success', dynamic: true as const }
    ];

    const feeActions = [
        { label: 'Edit', icon: Edit, onClick: (row: FeeStructure) => handleEdit(row), color: 'success' as const },
        { label: 'Delete', icon: Trash2, onClick: (row: FeeStructure) => handleDelete(row), color: 'danger' as const },
        { label: row => row.isActive ? 'Deactivate' : 'Activate', icon: row => row.isActive ? XCircle : CheckCircle, onClick: (row: FeeStructure) => handleToggleStatus(row.id, false), color: row => row.isActive ? 'warning' : 'success', dynamic: true as const }
    ];

    const filteredRules = rules.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredFees = fees.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const totalCommission = rules.filter(r => r.isActive && r.type === 'percentage').reduce((sum, r) => sum + r.value, 0);
    const avgCommission = (totalCommission / (rules.filter(r => r.isActive && r.type === 'percentage').length || 1)).toFixed(1);

    const stats = {
        avgCommission: avgCommission,
        activeRules: rules.filter(r => r.isActive).length,
        activeFees: fees.filter(f => f.isActive).length,
        totalItems: rules.length + fees.length
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6 bg-gray-50 min-h-screen"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                            <Percent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Commission & Fees</h1>
                            <p className="text-sm text-gray-500">Manage platform commission rates and fee structures</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatCard title="Avg Commission Rate" value={`${stats.avgCommission}%`} icon={Percent} color="from-purple-500 to-pink-500" delay={0.1} />
                    <StatCard title="Active Rules" value={stats.activeRules} icon={CheckCircle} color="from-green-500 to-emerald-600" delay={0.15} />
                    <StatCard title="Active Fees" value={stats.activeFees} icon={Wallet} color="from-blue-500 to-cyan-600" delay={0.2} />
                    <StatCard title="Total Items" value={stats.totalItems} icon={TrendingUp} color="from-amber-500 to-orange-600" delay={0.25} />
                </motion.div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('rules')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2 ${activeTab === 'rules' ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50' : 'text-gray-500'}`}
                        >
                            <Percent className="h-4 w-4" /> Commission Rules ({rules.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('fees')}
                            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2 ${activeTab === 'fees' ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50' : 'text-gray-500'}`}
                        >
                            <DollarSign className="h-4 w-4" /> Fee Structures ({fees.length})
                        </button>
                    </nav>
                </div>

                {/* Search and Add Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            />
                        </div>
                    </div>
                    <ReusableButton
                        onClick={handleAdd}
                        icon={Plus}
                        label={`Add ${activeTab === 'rules' ? 'Commission Rule' : 'Fee Structure'}`}
                        className="px-5 py-2.5 text-sm whitespace-nowrap bg-purple-600 hover:bg-purple-700 text-white"
                    />
                </div>

                {/* Tables */}
                {activeTab === 'rules' && (
                    <ReusableTable
                        columns={ruleColumns}
                        data={filteredRules}
                        actions={ruleActions}
                        icon={LayoutGrid}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                    />
                )}
                {activeTab === 'fees' && (
                    <ReusableTable
                        columns={feeColumns}
                        data={filteredFees}
                        actions={feeActions}
                        icon={LayoutGrid}
                        showSearch={false}
                        showExport={false}
                        showPrint={false}
                    />
                )}

                {/* Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Plus className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Add {activeTab === 'rules' ? 'Commission Rule' : 'Fee Structure'}</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter name"
                                    />
                                </div>

                                {activeTab === 'rules' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Commission Type *</label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="percentage">Percentage (%)</option>
                                                <option value="fixed">Fixed Amount (ETB)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                                            <input
                                                type="number"
                                                value={formData.value}
                                                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder={formData.type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Applies To *</label>
                                            <select
                                                value={formData.appliesTo}
                                                onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="all">All</option>
                                                <option value="theater">Specific Theater</option>
                                                <option value="show">Specific Show</option>
                                                <option value="category">Seat Category</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Commission</label>
                                                <input
                                                    type="number"
                                                    value={formData.minCommission}
                                                    onChange={(e) => setFormData({ ...formData, minCommission: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="Optional"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Commission</label>
                                                <input
                                                    type="number"
                                                    value={formData.maxCommission}
                                                    onChange={(e) => setFormData({ ...formData, maxCommission: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="Optional"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                                            <input
                                                type="number"
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder="Lower number = higher priority"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder="Describe the fee"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type *</label>
                                            <select
                                                value={formData.feeType}
                                                onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="fixed">Fixed Amount (ETB)</option>
                                                <option value="percentage">Percentage (%)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Value *</label>
                                            <input
                                                type="number"
                                                value={formData.value}
                                                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder={formData.feeType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Fee</label>
                                                <input
                                                    type="number"
                                                    value={formData.minFee}
                                                    onChange={(e) => setFormData({ ...formData, minFee: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="Optional"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Fee</label>
                                                <input
                                                    type="number"
                                                    value={formData.maxFee}
                                                    onChange={(e) => setFormData({ ...formData, maxFee: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="Optional"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleAddSubmit} disabled={!formData.name || formData.value <= 0} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition">Add {activeTab === 'rules' ? 'Rule' : 'Fee'}</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && selectedItem && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-teal-100 rounded-lg">
                                    <Edit className="h-6 w-6 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Edit {activeTab === 'rules' ? 'Commission Rule' : 'Fee Structure'}</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                {activeTab === 'rules' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Commission Type *</label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="percentage">Percentage (%)</option>
                                                <option value="fixed">Fixed Amount (ETB)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                                            <input
                                                type="number"
                                                value={formData.value}
                                                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Applies To *</label>
                                            <select
                                                value={formData.appliesTo}
                                                onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="all">All</option>
                                                <option value="theater">Specific Theater</option>
                                                <option value="show">Specific Show</option>
                                                <option value="category">Seat Category</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Commission</label><input type="number" value={formData.minCommission} onChange={(e) => setFormData({ ...formData, minCommission: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Commission</label><input type="number" value={formData.maxCommission} onChange={(e) => setFormData({ ...formData, maxCommission: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                                        </div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label><input type="number" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" /></div>
                                    </>
                                ) : (
                                    <>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Fee Type *</label><select value={formData.feeType} onChange={(e) => setFormData({ ...formData, feeType: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="fixed">Fixed Amount</option><option value="percentage">Percentage</option></select></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Fee Value *</label><input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" /></div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Fee</label><input type="number" value={formData.minFee} onChange={(e) => setFormData({ ...formData, minFee: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Fee</label><input type="number" value={formData.maxFee} onChange={(e) => setFormData({ ...formData, maxFee: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleEditSubmit} disabled={!formData.name || formData.value <= 0} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition">Save Changes</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && selectedItem && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-lg"><AlertCircle className="h-6 w-6 text-red-600" /></div>
                                <h3 className="text-xl font-bold text-gray-900">Delete {activeTab === 'rules' ? 'Commission Rule' : 'Fee Structure'}</h3>
                            </div>
                            <p className="text-gray-600 mb-6">Delete <strong>{selectedItem.name}</strong>? This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* No Refund Policy Note */}
                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-blue-700"><strong>Note:</strong> Refunds are NOT allowed in this system. Only Withdrawal, Deposit, and Transaction fees apply.</p>
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
        </motion.div>
    );
};

export default Commission;