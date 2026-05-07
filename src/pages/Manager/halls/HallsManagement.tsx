// src/pages/Manager/halls/HallsManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, Plus, Search, LayoutGrid, Clock, CheckCircle, XCircle, Eye, Edit, Ban, RefreshCw, Trash2, Users } from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import AddHallModal from '../../../components/ManageHallForm/AddHallModal';
import UpdateHallModal from '../../../components/ManageHallForm/UpdateHallModal';
import ViewHallModal from '../../../components/ManageHallForm/ViewHallModal';
import { DeleteConfirmModal } from '../../../components/EventForm/DeleteConfirmModal';
import { Hall } from '../../../components/ManageHallForm/types';

// Helper Functions
const calculateTotalCapacity = (seatTypes: any[]): number => {
    return seatTypes.reduce((sum, st) => sum + st.count, 0);
};

const generateTypeId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Mock Data
const mockHalls: Hall[] = [
    {
        id: 1,
        name: "Grand Hall",
        seatTypes: [
            { id: generateTypeId(), name: "VIP", count: 50 },
            { id: generateTypeId(), name: "Premium", count: 100 },
            { id: generateTypeId(), name: "Regular", count: 300 },
        ],
        features: ["AC", "Dolby Sound", "VIP Seats"],
        status: "Active",
        seatingLayout: "Standard",
        rows: 20,
        columns: 25,
        priceMultiplier: 1.0,
    },
    {
        id: 2,
        name: "Blue Hall",
        seatTypes: [
            { id: generateTypeId(), name: "VIP", count: 30 },
            { id: generateTypeId(), name: "Premium", count: 60 },
            { id: generateTypeId(), name: "Regular", count: 150 },
        ],
        features: ["AC", "Surround Sound"],
        status: "Active",
        seatingLayout: "Standard",
        rows: 15,
        columns: 20,
        priceMultiplier: 1.0,
    },
    {
        id: 3,
        name: "Red Hall",
        seatTypes: [
            { id: generateTypeId(), name: "Standard", count: 200 },
        ],
        features: ["Standard Sound"],
        status: "Maintenance",
        seatingLayout: "Compact",
        rows: 10,
        columns: 20,
        priceMultiplier: 1.0,
    },
];

// Save/Load from localStorage
const saveHalls = (halls: Hall[]) => localStorage.setItem('theater_halls', JSON.stringify(halls));
const loadHalls = (): Hall[] => {
    const stored = localStorage.getItem('theater_halls');
    if (stored) return JSON.parse(stored);
    saveHalls(mockHalls);
    return mockHalls;
};

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
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; delay: number }> = ({ title, value, icon: Icon, color, delay }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">{title}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Main Component
const HallsManagement: React.FC = () => {
    const [halls, setHalls] = useState<Hall[]>([]);
    const [filteredHalls, setFilteredHalls] = useState<Hall[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    
    const [selectedHallForView, setSelectedHallForView] = useState<Hall | null>(null);
    const [selectedHallForEdit, setSelectedHallForEdit] = useState<Hall | null>(null);
    const [selectedHallForDelete, setSelectedHallForDelete] = useState<Hall | null>(null);
    const [selectedHallForDeactivate, setSelectedHallForDeactivate] = useState<Hall | null>(null);
    
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [deactivateReason, setDeactivateReason] = useState('');
    const [showReasonModal, setShowReasonModal] = useState(false);

    useEffect(() => {
        const data = loadHalls();
        setHalls(data);
        setFilteredHalls(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        let filtered = halls;
        if (searchTerm) {
            filtered = filtered.filter(hall =>
                hall.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterStatus !== 'all') {
            filtered = filtered.filter(hall => hall.status === filterStatus);
        }
        setFilteredHalls(filtered);
    }, [searchTerm, halls, filterStatus]);

    const stats = {
        total: halls.length,
        active: halls.filter(h => h.status === 'Active').length,
        maintenance: halls.filter(h => h.status === 'Maintenance').length,
        totalCapacity: halls.reduce((sum, h) => sum + calculateTotalCapacity(h.seatTypes), 0),
    };

    const closeAllModals = () => {
        setShowAddModal(false);
        setShowUpdateModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
        setShowDeactivateModal(false);
        setShowReasonModal(false);
        setSelectedHallForView(null);
        setSelectedHallForEdit(null);
        setSelectedHallForDelete(null);
        setSelectedHallForDeactivate(null);
        setDeactivateReason('');
    };

    const handleAddHall = (hallData: any) => {
        const newHall: Hall = {
            id: Date.now(),
            name: hallData.name,
            seatTypes: hallData.seatTypes,
            features: hallData.features,
            status: 'Active',
            seatingLayout: hallData.seatingLayout,
            rows: hallData.rows,
            columns: hallData.columns,
            priceMultiplier: hallData.priceMultiplier,
        };
        const updated = [newHall, ...halls];
        setHalls(updated);
        saveHalls(updated);
        closeAllModals();
        setSuccessMessage(`✨ Hall "${newHall.name}" added successfully!`);
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
    };

    const handleUpdateHall = (updatedData: any) => {
        if (!selectedHallForEdit) return;
        const updated = halls.map(hall =>
            hall.id === selectedHallForEdit.id
                ? { ...hall, ...updatedData }
                : hall
        );
        setHalls(updated);
        saveHalls(updated);
        closeAllModals();
        setSuccessMessage(`✏️ Hall "${updatedData.name}" updated successfully!`);
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
    };

    const handleDeleteHall = () => {
        if (selectedHallForDelete) {
            const updated = halls.filter(hall => hall.id !== selectedHallForDelete.id);
            setHalls(updated);
            saveHalls(updated);
            closeAllModals();
            setSuccessMessage(`🗑️ Hall "${selectedHallForDelete.name}" deleted successfully!`);
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 3000);
        }
    };

    const handleDeactivateHall = () => {
        if (selectedHallForDeactivate) {
            const updated = halls.map(hall =>
                hall.id === selectedHallForDeactivate.id
                    ? { ...hall, status: 'Maintenance' as const }
                    : hall
            );
            setHalls(updated);
            saveHalls(updated);
            closeAllModals();
            setSuccessMessage(`⚠️ Hall "${selectedHallForDeactivate.name}" has been deactivated. Reason: ${deactivateReason}`);
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 3000);
        }
    };

    const handleActivateHall = () => {
        if (selectedHallForDeactivate) {
            const updated = halls.map(hall =>
                hall.id === selectedHallForDeactivate.id
                    ? { ...hall, status: 'Active' as const }
                    : hall
            );
            setHalls(updated);
            saveHalls(updated);
            closeAllModals();
            setSuccessMessage(`✅ Hall "${selectedHallForDeactivate.name}" has been reactivated!`);
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 3000);
        }
    };

    const openViewModal = (hall: Hall) => {
        setSelectedHallForView(hall);
        setShowViewModal(true);
    };

    const openEditModal = (hall: Hall) => {
        setSelectedHallForEdit(hall);
        setShowUpdateModal(true);
    };

    const openDeactivateModal = (hall: Hall) => {
        setSelectedHallForDeactivate(hall);
        setDeactivateReason('');
        setShowReasonModal(true);
    };

    const openActivateModal = (hall: Hall) => {
        setSelectedHallForDeactivate(hall);
        setShowDeactivateModal(true);
    };

    const openDeleteModal = (hall: Hall) => {
        setSelectedHallForDelete(hall);
        setShowDeleteModal(true);
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Maintenance': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Active': return <CheckCircle className="h-3 w-3" />;
            case 'Maintenance': return <Clock className="h-3 w-3" />;
            default: return null;
        }
    };

    const columns = [
        {
            Header: 'Hall',
            accessor: 'name',
            sortable: true,
            Cell: (row: Hall) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                        <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.seatingLayout} Layout</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Total Seats',
            accessor: 'totalCapacity',
            sortable: true,
            Cell: (row: Hall) => (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">{calculateTotalCapacity(row.seatTypes).toLocaleString()}</span>
                </div>
            )
        },
        {
            Header: 'Price Multiplier',
            accessor: 'priceMultiplier',
            sortable: true,
            Cell: (row: Hall) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-amber-600">{row.priceMultiplier}x</span>
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: Hall) => (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                    {getStatusIcon(row.status)} {row.status}
                </span>
            )
        }
    ];

    const Actions = (row: Hall) => (
        <div className="flex gap-2">
            <button onClick={() => openViewModal(row)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition" title="View Details">
                <Eye className="h-4 w-4 text-blue-600" />
            </button>
            <button onClick={() => openEditModal(row)} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition" title="Edit Hall">
                <Edit className="h-4 w-4 text-teal-600" />
            </button>
            {row.status === 'Active' ? (
                <button onClick={() => openDeactivateModal(row)} className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition" title="Deactivate Hall">
                    <Ban className="h-4 w-4 text-orange-600" />
                </button>
            ) : (
                <button onClick={() => openActivateModal(row)} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition" title="Activate Hall">
                    <RefreshCw className="h-4 w-4 text-green-600" />
                </button>
            )}
            <button onClick={() => openDeleteModal(row)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition" title="Delete Hall">
                <Trash2 className="h-4 w-4 text-red-600" />
            </button>
        </div>
    );

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" /></div>;
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                            <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Halls Management</h1>
                            <p className="text-sm text-gray-500">Manage theater halls, seating types, and pricing configurations</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - 4 cards only */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Halls" value={stats.total} icon={Building} color="from-teal-500 to-teal-600" delay={0.1} />
                    <StatCard title="Active Halls" value={stats.active} icon={CheckCircle} color="from-green-500 to-emerald-600" delay={0.15} />
                    <StatCard title="Maintenance" value={stats.maintenance} icon={Clock} color="from-yellow-500 to-orange-600" delay={0.2} />
                    <StatCard title="Total Capacity" value={stats.totalCapacity.toLocaleString()} icon={Users} color="from-purple-500 to-pink-600" delay={0.25} />
                </div>

                {/* Search, Filter, and Add Hall */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search halls..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <ReusableButton
                        onClick={() => setShowAddModal(true)}
                        icon={Plus}
                        label="Add New Hall"
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                    />
                </div>

                {/* Halls Table */}
                <ReusableTable 
                    columns={[...columns, { Header: 'Actions', accessor: 'actions', Cell: Actions, width: '220px' }]} 
                    data={filteredHalls} 
                    icon={LayoutGrid} 
                    showSearch={false} 
                    showExport={false} 
                    itemsPerPage={10} 
                />

                {/* Modals */}
                {showAddModal && <AddHallModal onSubmit={handleAddHall} onCancel={() => closeAllModals()} />}
                
                {showUpdateModal && selectedHallForEdit && (
                    <UpdateHallModal 
                        hall={selectedHallForEdit} 
                        onSubmit={handleUpdateHall} 
                        onCancel={() => closeAllModals()} 
                    />
                )}
                
                {showViewModal && selectedHallForView && (
                    <ViewHallModal 
                        hall={selectedHallForView} 
                        isOpen={showViewModal} 
                        onClose={() => closeAllModals()} 
                        onEdit={openEditModal}
                    />
                )}
                
                {/* Delete Modal */}
                <DeleteConfirmModal
                    employee={selectedHallForDelete ? { id: selectedHallForDelete.id.toString(), name: selectedHallForDelete.name } : null}
                    onConfirm={handleDeleteHall}
                    onCancel={() => closeAllModals()}
                />

                {/* Deactivate with Reason Modal */}
                {showReasonModal && selectedHallForDeactivate && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Ban className="h-6 w-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Deactivate Hall</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to deactivate <strong>{selectedHallForDeactivate.name}</strong>?
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for deactivation *</label>
                                <textarea
                                    rows={3}
                                    value={deactivateReason}
                                    onChange={(e) => setDeactivateReason(e.target.value)}
                                    placeholder="Please provide a reason for deactivating this hall..."
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => closeAllModals()} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDeactivateHall} 
                                    disabled={!deactivateReason.trim()} 
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                                >
                                    Deactivate Hall
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Activate Modal */}
                {showDeactivateModal && selectedHallForDeactivate && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <RefreshCw className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Activate Hall</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to activate <strong>{selectedHallForDeactivate.name}</strong>?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => closeAllModals()} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button onClick={handleActivateHall} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                    Activate Hall
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type="success" title="Success" message={successMessage} duration={3000} position="top-right" />
            </div>
        </motion.div>
    );
};

export default HallsManagement;