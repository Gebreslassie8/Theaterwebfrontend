// src/pages/Manager/halls/HallsManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Building,
    Plus,
    Edit,
    Trash2,
    Eye,
    Search,
    ArrowRight,
    MapPin,
    Users,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    LayoutGrid,
    Phone,
    Mail,
    Calendar,
    Shield,
    Award,
    TrendingUp,
    UserCheck,
    RefreshCw,
    Ban,
    Clock,
    Wallet,
    Ticket,
    Gift,
    Sparkles,
    Diamond,
    Layers,
    Maximize2,
    Save,
    X
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// ==================== Types ====================
export interface SeatType {
    id: string;
    name: string;
    count: number;
}

export interface Hall {
    id: number;
    name: string;
    seatTypes: SeatType[];
    features: string[];
    status: 'Active' | 'Maintenance';
    seatingLayout: string;
    rows: number;
    columns: number;
    priceMultiplier: number;
}

// Helper: calculate total capacity from seat types
const calculateTotalCapacity = (seatTypes: SeatType[]): number => {
    return seatTypes.reduce((sum, st) => sum + st.count, 0);
};

// Generate unique ID for seat types
const generateTypeId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ==================== Mock API ====================
const mockApi = {
    getHalls: async (): Promise<Hall[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        name: "Hall A",
                        seatTypes: [
                            { id: generateTypeId(), name: "VIP", count: 50 },
                            { id: generateTypeId(), name: "Premium", count: 100 },
                            { id: generateTypeId(), name: "Economy", count: 300 },
                            { id: generateTypeId(), name: "Standard", count: 50 },
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
                        name: "Hall B",
                        seatTypes: [
                            { id: generateTypeId(), name: "VIP", count: 30 },
                            { id: generateTypeId(), name: "Premium", count: 60 },
                            { id: generateTypeId(), name: "Economy", count: 150 },
                            { id: generateTypeId(), name: "Standard", count: 60 },
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
                        name: "Hall C",
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
                    {
                        id: 4,
                        name: "VIP Hall",
                        seatTypes: [
                            { id: generateTypeId(), name: "VIP", count: 80 },
                            { id: generateTypeId(), name: "Premium", count: 20 },
                        ],
                        features: ["Premium Seats", "Private Lounge", "AC"],
                        status: "Active",
                        seatingLayout: "Premium",
                        rows: 10,
                        columns: 10,
                        priceMultiplier: 2.0,
                    },
                    {
                        id: 5,
                        name: "IMAX Hall",
                        seatTypes: [
                            { id: generateTypeId(), name: "IMAX Standard", count: 650 },
                            { id: generateTypeId(), name: "IMAX VIP", count: 150 },
                        ],
                        features: ["IMAX Screen", "3D", "Dolby Atmos"],
                        status: "Active",
                        seatingLayout: "Premium",
                        rows: 25,
                        columns: 32,
                        priceMultiplier: 2.5,
                    },
                    {
                        id: 6,
                        name: "Kids Hall",
                        seatTypes: [
                            { id: generateTypeId(), name: "Kids Seat", count: 150 },
                        ],
                        features: ["Kids Friendly", "Soft Seats", "Play Area"],
                        status: "Active",
                        seatingLayout: "Compact",
                        rows: 10,
                        columns: 15,
                        priceMultiplier: 0.8,
                    },
                ]);
            }, 500);
        });
    },
    createHall: async (hallData: Omit<Hall, 'id'>): Promise<Hall> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...hallData, id: Math.floor(Math.random() * 1000) });
            }, 500);
        });
    },
    updateHall: async (id: number, hallData: Omit<Hall, 'id'>): Promise<Hall> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...hallData, id });
            }, 500);
        });
    },
    deleteHall: async (id: number): Promise<{ success: boolean }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 500);
        });
    }
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
                <Link to={link} className="block">
                    <CardContent />
                </Link>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
};

// Main Component
const HallsManagement: React.FC = () => {
    const [halls, setHalls] = useState<Hall[]>([]);
    const [filteredHalls, setFilteredHalls] = useState<Hall[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Form modal (add new hall)
    const [showForm, setShowForm] = useState(false);
    const [formName, setFormName] = useState('');
    const [formSeatTypes, setFormSeatTypes] = useState<SeatType[]>([]);
    const [formFeatures, setFormFeatures] = useState('');
    const [formSeatingLayout, setFormSeatingLayout] = useState('Standard');
    const [formRows, setFormRows] = useState(10);
    const [formColumns, setFormColumns] = useState(10);
    const [formPriceMultiplier, setFormPriceMultiplier] = useState(1.0);

    // Details/Edit modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editSeatTypes, setEditSeatTypes] = useState<SeatType[]>([]);
    const [editFeatures, setEditFeatures] = useState('');
    const [editSeatingLayout, setEditSeatingLayout] = useState('');
    const [editRows, setEditRows] = useState(0);
    const [editColumns, setEditColumns] = useState(0);
    const [editPriceMultiplier, setEditPriceMultiplier] = useState(1);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Load halls
    useEffect(() => {
        loadHalls();
    }, []);

    useEffect(() => {
        let filtered = [...halls];
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(hall =>
                hall.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredHalls(filtered);
    }, [searchTerm, halls]);

    const loadHalls = async () => {
        setLoading(true);
        try {
            const data = await mockApi.getHalls();
            setHalls(data);
            setFilteredHalls(data);
        } catch (error) {
            console.error(error);
            setPopupMessage({ title: 'Error', message: 'Failed to load halls', type: 'error' });
            setShowSuccessPopup(true);
        } finally {
            setLoading(false);
        }
    };

    // Add/remove seat type helpers for add form
    const addFormSeatType = () => {
        setFormSeatTypes([...formSeatTypes, { id: generateTypeId(), name: '', count: 0 }]);
    };
    const updateFormSeatType = (id: string, field: keyof SeatType, value: string | number) => {
        setFormSeatTypes(prev =>
            prev.map(st =>
                st.id === id ? { ...st, [field]: field === 'count' ? Math.max(0, Number(value)) : value } : st
            )
        );
    };
    const removeFormSeatType = (id: string) => {
        setFormSeatTypes(prev => prev.filter(st => st.id !== id));
    };

    // Add/remove seat type helpers for edit modal
    const addEditSeatType = () => {
        setEditSeatTypes([...editSeatTypes, { id: generateTypeId(), name: '', count: 0 }]);
    };
    const updateEditSeatType = (id: string, field: keyof SeatType, value: string | number) => {
        setEditSeatTypes(prev =>
            prev.map(st =>
                st.id === id ? { ...st, [field]: field === 'count' ? Math.max(0, Number(value)) : value } : st
            )
        );
    };
    const removeEditSeatType = (id: string) => {
        setEditSeatTypes(prev => prev.filter(st => st.id !== id));
    };

    // Open add modal
    const handleAddHall = () => {
        setFormName('');
        setFormSeatTypes([]);
        setFormFeatures('');
        setFormSeatingLayout('Standard');
        setFormRows(10);
        setFormColumns(10);
        setFormPriceMultiplier(1.0);
        setShowForm(true);
    };

    // Submit new hall
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) {
            setPopupMessage({ title: 'Validation Error', message: 'Hall name is required', type: 'error' });
            setShowSuccessPopup(true);
            return;
        }
        if (formSeatTypes.length === 0) {
            setPopupMessage({ title: 'Validation Error', message: 'Please add at least one seat type', type: 'error' });
            setShowSuccessPopup(true);
            return;
        }
        if (formSeatTypes.some(st => !st.name.trim() || st.count <= 0)) {
            setPopupMessage({ title: 'Validation Error', message: 'All seat types must have a name and a positive count', type: 'error' });
            setShowSuccessPopup(true);
            return;
        }
        const featuresArray = formFeatures.split(',').map(f => f.trim()).filter(f => f);
        const newHall: Omit<Hall, 'id'> = {
            name: formName,
            seatTypes: formSeatTypes,
            features: featuresArray,
            status: 'Active',
            seatingLayout: formSeatingLayout,
            rows: formRows,
            columns: formColumns,
            priceMultiplier: formPriceMultiplier,
        };
        try {
            const created = await mockApi.createHall(newHall);
            setHalls([...halls, created]);
            setPopupMessage({ title: 'Success', message: `${formName} added successfully!`, type: 'success' });
            setShowSuccessPopup(true);
            setShowForm(false);
        } catch (error) {
            setPopupMessage({ title: 'Error', message: 'Failed to add hall', type: 'error' });
            setShowSuccessPopup(true);
        }
    };

    // View details
    const handleViewDetails = (hall: Hall) => {
        setSelectedHall(hall);
        setIsEditing(false);
        setShowDetailsModal(true);
    };

    // Edit from table
    const handleEditFromTable = (hall: Hall) => {
        setSelectedHall(hall);
        setEditName(hall.name);
        setEditSeatTypes(hall.seatTypes.map(st => ({ ...st })));
        setEditFeatures(hall.features.join(', '));
        setEditSeatingLayout(hall.seatingLayout);
        setEditRows(hall.rows);
        setEditColumns(hall.columns);
        setEditPriceMultiplier(hall.priceMultiplier);
        setIsEditing(true);
        setShowDetailsModal(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        if (!selectedHall) return;
        const featuresArray = editFeatures.split(',').map(f => f.trim()).filter(f => f);
        const updatedHall: Omit<Hall, 'id'> = {
            name: editName,
            seatTypes: editSeatTypes,
            features: featuresArray,
            status: 'Active',
            seatingLayout: editSeatingLayout,
            rows: editRows,
            columns: editColumns,
            priceMultiplier: editPriceMultiplier,
        };
        try {
            const saved = await mockApi.updateHall(selectedHall.id, updatedHall);
            setHalls(halls.map(h => h.id === selectedHall.id ? saved : h));
            setSelectedHall(saved);
            setIsEditing(false);
            setPopupMessage({ title: 'Success', message: `${editName} updated successfully!`, type: 'success' });
            setShowSuccessPopup(true);
        } catch (error) {
            setPopupMessage({ title: 'Error', message: 'Failed to update hall', type: 'error' });
            setShowSuccessPopup(true);
        }
    };

    const handleDeleteHall = async (id: number) => {
        if (window.confirm('Delete this hall?')) {
            try {
                await mockApi.deleteHall(id);
                setHalls(halls.filter(h => h.id !== id));
                setPopupMessage({ title: 'Deleted', message: 'Hall deleted successfully', type: 'success' });
                setShowSuccessPopup(true);
            } catch (error) {
                setPopupMessage({ title: 'Error', message: 'Delete failed', type: 'error' });
                setShowSuccessPopup(true);
            }
        }
    };

    // Calculate stats
    const stats = {
        totalHalls: halls.length,
        activeHalls: halls.filter(h => h.status === 'Active').length,
        totalCapacity: halls.reduce((sum, h) => sum + calculateTotalCapacity(h.seatTypes), 0),
        avgCapacity: Math.round(halls.reduce((sum, h) => sum + calculateTotalCapacity(h.seatTypes), 0) / halls.length) || 0
    };

    // Table columns – shows Hall Name, Total Seats, Actions
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
                        <p className="text-sm font-medium text-gray-900">{row.name}</p>
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
                    <span className="text-sm font-semibold text-gray-900">{calculateTotalCapacity(row.seatTypes).toLocaleString()}</span>
                </div>
            )
        },
        {
            Header: 'Price Multiplier',
            accessor: 'priceMultiplier',
            sortable: true,
            Cell: (row: Hall) => (
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-600">{row.priceMultiplier}x</span>
                </div>
            )
        },
        {
            Header: 'Seat Types',
            accessor: 'seatTypes',
            sortable: true,
            Cell: (row: Hall) => (
                <div className="flex flex-wrap gap-1">
                    {row.seatTypes.slice(0, 2).map(st => (
                        <span key={st.id} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{st.name}: {st.count}</span>
                    ))}
                    {row.seatTypes.length > 2 && <span className="text-xs text-gray-400">+{row.seatTypes.length - 2}</span>}
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: Hall) => {
                const isActive = row.status === 'Active';
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {isActive ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {row.status}
                    </span>
                );
            }
        }
    ];

    const renderActions = (row: Hall) => (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleViewDetails(row)}
                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                title="View Details"
            >
                <Eye className="h-4 w-4 text-blue-600" />
            </button>
            <button
                onClick={() => handleEditFromTable(row)}
                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition"
                title="Edit Hall"
            >
                <Edit className="h-4 w-4 text-amber-600" />
            </button>
            <button
                onClick={() => handleDeleteHall(row.id)}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition"
                title="Delete Hall"
            >
                <Trash2 className="h-4 w-4 text-red-600" />
            </button>
        </div>
    );

    const columnsWithActions = [...columns, { Header: 'Actions', accessor: 'actions', Cell: renderActions, width: '120px' }];

    const dashboardCards = [
        { title: 'Total Halls', value: stats.totalHalls, icon: Building, color: 'from-blue-500 to-cyan-600', delay: 0.1 },
        { title: 'Active Halls', value: stats.activeHalls, icon: CheckCircle, color: 'from-green-500 to-emerald-600', delay: 0.15 },
        { title: 'Total Capacity', value: stats.totalCapacity.toLocaleString(), icon: Users, color: 'from-purple-500 to-pink-600', delay: 0.2 },
        { title: 'Avg Capacity', value: stats.avgCapacity.toLocaleString(), icon: LayoutGrid, color: 'from-amber-500 to-orange-600', delay: 0.25 },
        { title: 'Avg Multiplier', value: `${(halls.reduce((sum, h) => sum + h.priceMultiplier, 0) / halls.length || 0).toFixed(1)}x`, icon: TrendingUp, color: 'from-teal-500 to-teal-600', delay: 0.3 }
    ];

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                            <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Halls Management</h1>
                            <p className="text-sm text-gray-500">Manage theater halls, seating types, and pricing configurations</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                    {dashboardCards.map((card, index) => (
                        <StatCard key={index} title={card.title} value={card.value} icon={card.icon} color={card.color} delay={card.delay} />
                    ))}
                </motion.div>

                {/* Search and Add Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search halls by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
                        />
                    </div>
                    <ReusableButton onClick={handleAddHall} icon={Plus} label="Add New Hall" className="bg-teal-600 hover:bg-teal-700 text-white" />
                </div>

                {/* Table */}
                <ReusableTable columns={columnsWithActions} data={filteredHalls} icon={Building} showSearch={false} showExport={false} showPrint={false} itemsPerPage={10} />

                {/* Add Hall Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 p-6 flex justify-between items-center text-white rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <Plus className="h-6 w-6" />
                                    <h2 className="text-xl font-bold">Add New Hall</h2>
                                </div>
                                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-white/20 rounded-lg transition"><X className="h-5 w-5" /></button>
                            </div>
                            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hall Name <span className="text-red-500">*</span></label>
                                    <input type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="e.g., Grand Hall" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                                    <input type="text" value={formFeatures} onChange={e => setFormFeatures(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="AC, Dolby Sound, VIP Seats" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
                                        <select value={formSeatingLayout} onChange={e => setFormSeatingLayout(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500">
                                            <option>Standard</option>
                                            <option>Compact</option>
                                            <option>Premium</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Multiplier</label>
                                        <input type="number" step="0.1" value={formPriceMultiplier} onChange={e => setFormPriceMultiplier(parseFloat(e.target.value))} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                                        <input type="number" value={formRows} onChange={e => setFormRows(parseInt(e.target.value))} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                                        <input type="number" value={formColumns} onChange={e => setFormColumns(parseInt(e.target.value))} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500" />
                                    </div>
                                </div>

                                {/* Dynamic Seat Types */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">Seat Types (Name & Count)</h3>
                                        <ReusableButton onClick={addFormSeatType} variant="secondary" size="sm" icon={Plus}>Add Type</ReusableButton>
                                    </div>
                                    <div className="space-y-3">
                                        {formSeatTypes.map(st => (
                                            <div key={st.id} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                                                <input type="text" placeholder="Seat type name" value={st.name} onChange={e => updateFormSeatType(st.id, 'name', e.target.value)} className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                                <input type="number" placeholder="Count" value={st.count} onChange={e => updateFormSeatType(st.id, 'count', e.target.value)} className="w-28 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                                <button type="button" onClick={() => removeFormSeatType(st.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-5 w-5" /></button>
                                            </div>
                                        ))}
                                    </div>
                                    {formSeatTypes.length === 0 && <p className="text-gray-400 text-center py-2">No seat types added. Click "Add Type" to start.</p>}
                                    <div className="mt-3 text-right font-semibold text-teal-600">
                                        Total Capacity: {calculateTotalCapacity(formSeatTypes).toLocaleString()} seats
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <ReusableButton type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</ReusableButton>
                                    <ReusableButton type="submit" variant="primary">Create Hall</ReusableButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Details / Edit Modal */}
                {showDetailsModal && selectedHall && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 p-6 flex justify-between items-center text-white rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    {isEditing ? <Edit className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                    <h2 className="text-xl font-bold">{isEditing ? 'Edit Hall' : 'Hall Details'}</h2>
                                </div>
                                <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition"><X className="h-5 w-5" /></button>
                            </div>
                            <div className="p-6 space-y-6">
                                {!isEditing ? (
                                    // View Mode
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Hall Name</p><p className="text-lg font-semibold text-gray-900">{selectedHall.name}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Status</p>{selectedHall.status === 'Active' ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Active</span> : <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Maintenance</span>}</div>
                                            <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Total Capacity</p><p className="text-lg font-bold text-teal-600">{calculateTotalCapacity(selectedHall.seatTypes).toLocaleString()} seats</p></div>
                                            <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Price Multiplier</p><p className="text-lg font-semibold text-amber-600">{selectedHall.priceMultiplier}x</p></div>
                                            <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Layout</p><p className="text-lg font-semibold">{selectedHall.seatingLayout} ({selectedHall.rows}×{selectedHall.columns})</p></div>
                                            <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Features</p><p className="text-sm">{selectedHall.features.join(', ') || 'None'}</p></div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">Seat Types Breakdown</h3>
                                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                                {selectedHall.seatTypes.map(st => (
                                                    <div key={st.id} className="flex justify-between items-center border-b last:border-0 py-2">
                                                        <span className="font-medium text-gray-700">{st.name}</span>
                                                        <span className="text-gray-600">{st.count.toLocaleString()} seats</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Edit Mode
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Hall Name *</label>
                                            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                                            <input type="text" value={editFeatures} onChange={e => setEditFeatures(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500" />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
                                                <select value={editSeatingLayout} onChange={e => setEditSeatingLayout(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500">
                                                    <option>Standard</option>
                                                    <option>Compact</option>
                                                    <option>Premium</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price Multiplier</label>
                                                <input type="number" step="0.1" value={editPriceMultiplier} onChange={e => setEditPriceMultiplier(parseFloat(e.target.value))} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                                                <input type="number" value={editRows} onChange={e => setEditRows(parseInt(e.target.value))} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                                                <input type="number" value={editColumns} onChange={e => setEditColumns(parseInt(e.target.value))} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500" />
                                            </div>
                                        </div>

                                        {/* Dynamic Seat Types for Edit */}
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">Seat Types (Name & Count)</h3>
                                                <ReusableButton onClick={addEditSeatType} variant="secondary" size="sm" icon={Plus}>Add Type</ReusableButton>
                                            </div>
                                            <div className="space-y-3">
                                                {editSeatTypes.map(st => (
                                                    <div key={st.id} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                                                        <input type="text" placeholder="Seat type name" value={st.name} onChange={e => updateEditSeatType(st.id, 'name', e.target.value)} className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                                        <input type="number" placeholder="Count" value={st.count} onChange={e => updateEditSeatType(st.id, 'count', e.target.value)} className="w-28 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                                                        <button type="button" onClick={() => removeEditSeatType(st.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-5 w-5" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                            {editSeatTypes.length === 0 && <p className="text-gray-400 text-center py-2">No seat types. Click "Add Type" to add.</p>}
                                            <div className="mt-3 text-right font-semibold text-teal-600">
                                                Total Capacity: {calculateTotalCapacity(editSeatTypes).toLocaleString()} seats
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="border-t p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                                {!isEditing ? (
                                    <>
                                        <ReusableButton variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</ReusableButton>
                                        <ReusableButton variant="primary" onClick={() => setIsEditing(true)} icon={Edit}>Edit Hall</ReusableButton>
                                    </>
                                ) : (
                                    <>
                                        <ReusableButton variant="secondary" onClick={handleCancelEdit}>Cancel</ReusableButton>
                                        <ReusableButton variant="success" onClick={handleSaveEdit} icon={Save}>Save Changes</ReusableButton>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

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

export default HallsManagement;