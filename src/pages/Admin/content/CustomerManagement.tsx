// src/pages/Admin/content/CustomerManagement.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Search,
    Eye,
    Edit,
    Trash2,
    Ban,
    CheckCircle,
    Clock,
    Archive,
    Plus,
    Filter,
    Download,
    RefreshCw,
    Shield,
    UserCheck,
    UserX,
    Activity,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    X,
    Save,
    Lock,
    Key,
    AlertCircle
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import * as Yup from 'yup';

// Types
interface Customer {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'suspended';
    role: 'customer' | 'premium' | 'vip';
    totalBookings: number;
    totalSpent: number;
    joinDate: string;
    lastActive: string;
    avatar?: string;
    location?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
}

// Mock Customer Data
const mockCustomers: Customer[] = [
    {
        id: 1,
        fullName: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+251911234567',
        status: 'active',
        role: 'vip',
        totalBookings: 45,
        totalSpent: 12500,
        joinDate: '2024-01-15T10:00:00Z',
        lastActive: '2024-03-20T15:30:00Z',
        location: 'Addis Ababa',
        emailVerified: true,
        phoneVerified: true
    },
    {
        id: 2,
        fullName: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+251912345678',
        status: 'active',
        role: 'premium',
        totalBookings: 28,
        totalSpent: 8750,
        joinDate: '2024-02-10T10:00:00Z',
        lastActive: '2024-03-19T14:20:00Z',
        location: 'Addis Ababa',
        emailVerified: true,
        phoneVerified: false
    },
    {
        id: 3,
        fullName: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+251913456789',
        status: 'active',
        role: 'customer',
        totalBookings: 12,
        totalSpent: 3200,
        joinDate: '2024-02-20T10:00:00Z',
        lastActive: '2024-03-18T11:45:00Z',
        location: 'Addis Ababa',
        emailVerified: true,
        phoneVerified: true
    },
    {
        id: 4,
        fullName: 'Emily Wilson',
        email: 'emily.w@example.com',
        phone: '+251914567890',
        status: 'inactive',
        role: 'customer',
        totalBookings: 3,
        totalSpent: 850,
        joinDate: '2024-03-01T10:00:00Z',
        lastActive: '2024-03-10T09:30:00Z',
        location: 'Addis Ababa',
        emailVerified: false,
        phoneVerified: false
    },
    {
        id: 5,
        fullName: 'David Brown',
        email: 'david.b@example.com',
        phone: '+251915678901',
        status: 'suspended',
        role: 'customer',
        totalBookings: 8,
        totalSpent: 2100,
        joinDate: '2024-01-05T10:00:00Z',
        lastActive: '2024-03-01T16:00:00Z',
        location: 'Addis Ababa',
        emailVerified: true,
        phoneVerified: true
    },
    {
        id: 6,
        fullName: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        phone: '+251916789012',
        status: 'active',
        role: 'premium',
        totalBookings: 35,
        totalSpent: 9800,
        joinDate: '2024-01-20T10:00:00Z',
        lastActive: '2024-03-20T10:15:00Z',
        location: 'Addis Ababa',
        emailVerified: true,
        phoneVerified: true
    }
];

// Validation Schema for Add/Edit Customer
const CustomerSchema = Yup.object({
    fullName: Yup.string().required('Full name is required').min(3, 'Name must be at least 3 characters'),
    email: Yup.string().required('Email is required').email('Please enter a valid email address'),
    phone: Yup.string().required('Phone number is required').matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number'),
    role: Yup.string().required('Role is required'),
    status: Yup.string().required('Status is required'),
    location: Yup.string()
});

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
    trend?: string;
    trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, trend, trendUp }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
            <div
                className="relative overflow-hidden transition-all duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        {trend && (
                            <div className="flex items-center gap-1 mt-1">
                                {trendUp ? (
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                )}
                                <span className={`text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>{trend}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const CustomerManagement: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
    const [showActivateConfirm, setShowActivateConfirm] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'customer',
        status: 'active',
        location: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
        const matchesRole = filterRole === 'all' || customer.role === filterRole;
        return matchesSearch && matchesStatus && matchesRole;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Active</span>;
            case 'inactive':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Inactive</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><Ban className="h-3 w-3" /> Suspended</span>;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'vip':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"><Shield className="h-3 w-3" /> VIP</span>;
            case 'premium':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"><UserCheck className="h-3 w-3" /> Premium</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><User className="h-3 w-3" /> Customer</span>;
        }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            role: 'customer',
            status: 'active',
            location: ''
        });
        setFormErrors({});
    };

    // Handle Add Customer
    const handleAddCustomer = () => {
        const errors: Record<string, string> = {};
        if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const newCustomer: Customer = {
            id: Date.now(),
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            status: formData.status as 'active' | 'inactive' | 'suspended',
            role: formData.role as 'customer' | 'premium' | 'vip',
            totalBookings: 0,
            totalSpent: 0,
            joinDate: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            location: formData.location,
            emailVerified: false,
            phoneVerified: false
        };

        setCustomers([newCustomer, ...customers]);
        setPopupMessage({
            title: 'Customer Added',
            message: `${formData.fullName} has been added successfully`,
            type: 'success'
        });
        setShowModal(false);
        setShowSuccessPopup(true);
        resetForm();
    };

    // Handle Update Customer
    const handleUpdateCustomer = () => {
        if (!selectedCustomer) return;

        const updatedCustomers = customers.map(customer => customer.id === selectedCustomer.id ? {
            ...customer,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role as 'customer' | 'premium' | 'vip',
            status: formData.status as 'active' | 'inactive' | 'suspended',
            location: formData.location,
            lastActive: new Date().toISOString()
        } : customer);

        setCustomers(updatedCustomers);
        setPopupMessage({
            title: 'Customer Updated',
            message: `${formData.fullName} has been updated successfully`,
            type: 'success'
        });
        setShowModal(false);
        setShowSuccessPopup(true);
        resetForm();
        setSelectedCustomer(null);
    };

    // Handle Suspend Customer
    const handleSuspendCustomer = () => {
        if (selectedCustomer) {
            const updatedCustomers = customers.map(customer => customer.id === selectedCustomer.id ? {
                ...customer,
                status: 'suspended' as const,
                lastActive: new Date().toISOString()
            } : customer);

            setCustomers(updatedCustomers);
            setShowSuspendConfirm(false);
            setSelectedCustomer(null);
            setPopupMessage({
                title: 'Customer Suspended',
                message: `${selectedCustomer.fullName} has been suspended`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    // Handle Activate Customer
    const handleActivateCustomer = () => {
        if (selectedCustomer) {
            const updatedCustomers = customers.map(customer => customer.id === selectedCustomer.id ? {
                ...customer,
                status: 'active' as const,
                lastActive: new Date().toISOString()
            } : customer);

            setCustomers(updatedCustomers);
            setShowActivateConfirm(false);
            setSelectedCustomer(null);
            setPopupMessage({
                title: 'Customer Activated',
                message: `${selectedCustomer.fullName} has been activated`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    // Handle Delete Customer (Permanent)
    const handleDeleteCustomer = () => {
        if (selectedCustomer) {
            setCustomers(customers.filter(customer => customer.id !== selectedCustomer.id));
            setShowDeleteConfirm(false);
            setSelectedCustomer(null);
            setPopupMessage({
                title: 'Customer Deleted',
                message: `${selectedCustomer.fullName} has been deleted permanently`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        resetForm();
        setSelectedCustomer(null);
        setShowModal(true);
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setModalMode('edit');
        setFormData({
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            role: customer.role,
            status: customer.status,
            location: customer.location || ''
        });
        setShowModal(true);
    };

    const openViewModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setModalMode('view');
        setShowModal(true);
    };

    // Stats
    const stats = {
        total: customers.length,
        active: customers.filter(c => c.status === 'active').length,
        inactive: customers.filter(c => c.status === 'inactive').length,
        suspended: customers.filter(c => c.status === 'suspended').length,
        vip: customers.filter(c => c.role === 'vip').length,
        premium: customers.filter(c => c.role === 'premium').length,
        totalBookings: customers.reduce((sum, c) => sum + c.totalBookings, 0),
        totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
    };

    const dashboardCards = [
        { title: 'Total Customers', value: stats.total, icon: Users, color: 'from-purple-500 to-purple-600', delay: 0.1, trend: '+12%', trendUp: true },
        { title: 'Active', value: stats.active, icon: UserCheck, color: 'from-emerald-500 to-green-600', delay: 0.15, trend: '+5%', trendUp: true },
        { title: 'Inactive', value: stats.inactive, icon: Clock, color: 'from-yellow-500 to-orange-600', delay: 0.2, trend: '-2%', trendUp: false },
        { title: 'Suspended', value: stats.suspended, icon: Ban, color: 'from-red-500 to-rose-600', delay: 0.25, trend: '+1%', trendUp: false },
        { title: 'VIP', value: stats.vip, icon: Shield, color: 'from-purple-500 to-pink-600', delay: 0.3, trend: '+8%', trendUp: true },
        { title: 'Premium', value: stats.premium, icon: UserCheck, color: 'from-blue-500 to-cyan-600', delay: 0.35, trend: '+10%', trendUp: true }
    ];

    const columns = [
        {
            Header: 'Customer',
            accessor: 'fullName',
            sortable: true,
            Cell: (row: Customer) => (
                <div>
                    <p className="font-medium text-gray-900">{row.fullName}</p>
                    <p className="text-xs text-gray-500">{row.email}</p>
                </div>
            )
        },
        { Header: 'Phone', accessor: 'phone', sortable: true },
        { Header: 'Role', accessor: 'role', sortable: true, Cell: (row: Customer) => getRoleBadge(row.role) },
        { Header: 'Status', accessor: 'status', sortable: true, Cell: (row: Customer) => getStatusBadge(row.status) },
        { Header: 'Bookings', accessor: 'totalBookings', sortable: true, Cell: (row: Customer) => <p className="font-semibold">{row.totalBookings}</p> },
        { Header: 'Total Spent', accessor: 'totalSpent', sortable: true, Cell: (row: Customer) => <p className="font-semibold text-emerald-600">{formatCurrency(row.totalSpent)}</p> },
        { Header: 'Joined', accessor: 'joinDate', sortable: true, Cell: (row: Customer) => formatDate(row.joinDate) },
        {
            Header: 'Actions',
            accessor: 'id',
            sortable: false,
            Cell: (row: Customer) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => openViewModal(row)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="View"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                        onClick={() => openEditModal(row)}
                        className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
                        title="Edit"
                    >
                        <Edit className="h-4 w-4 text-teal-600" />
                    </button>
                    {row.status !== 'suspended' ? (
                        <button
                            onClick={() => { setSelectedCustomer(row); setShowSuspendConfirm(true); }}
                            className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                            title="Suspend"
                        >
                            <Ban className="h-4 w-4 text-orange-600" />
                        </button>
                    ) : (
                        <button
                            onClick={() => { setSelectedCustomer(row); setShowActivateConfirm(true); }}
                            className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                            title="Activate"
                        >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </button>
                    )}
                    <button
                        onClick={() => { setSelectedCustomer(row); setShowDeleteConfirm(true); }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                </div>
            )
        }
    ];

    // Add/Edit Modal with Form
    const FormModal = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${modalMode === 'add' ? 'bg-teal-100' : 'bg-blue-100'}`}>
                            {modalMode === 'add' ? <Plus className="h-5 w-5 text-teal-600" /> : <Edit className="h-5 w-5 text-blue-600" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {modalMode === 'add' ? 'Add New Customer' : 'Edit Customer'}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {modalMode === 'add' ? 'Create a new customer account' : 'Update customer information'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={(e) => { e.preventDefault(); modalMode === 'add' ? handleAddCustomer() : handleUpdateCustomer(); }} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
                                    className={`w-full pl-10 pr-4 py-2.5 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none`}
                                />
                            </div>
                            {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="customer@example.com"
                                    className={`w-full pl-10 pr-4 py-2.5 border ${formErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none`}
                                />
                            </div>
                            {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+251 911 234 567"
                                    className={`w-full pl-10 pr-4 py-2.5 border ${formErrors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none`}
                                />
                            </div>
                            {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="City, Country"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Role and Status Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                >
                                    <option value="customer">Customer</option>
                                    <option value="premium">Premium</option>
                                    <option value="vip">VIP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <ReusableButton type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                                Cancel
                            </ReusableButton>
                            <ReusableButton type="submit" className="flex-1">
                                <Save className="h-4 w-4" />
                                {modalMode === 'add' ? 'Add Customer' : 'Update Customer'}
                            </ReusableButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    // View Modal
    const ViewModal = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Eye className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
                            <p className="text-xs text-gray-500">Customer information and statistics</p>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Customer Header */}
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-white">
                                {selectedCustomer?.fullName.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{selectedCustomer?.fullName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                {getRoleBadge(selectedCustomer?.role || 'customer')}
                                {getStatusBadge(selectedCustomer?.status || 'active')}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Member since {selectedCustomer && formatDate(selectedCustomer.joinDate)}</p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <p className="text-xs text-gray-500 uppercase mb-3">Contact Information</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-700">{selectedCustomer?.email}</span>
                                {selectedCustomer?.emailVerified && (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-700">{selectedCustomer?.phone}</span>
                                {selectedCustomer?.phoneVerified && (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                )}
                            </div>
                            {selectedCustomer?.location && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-700">{selectedCustomer?.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500">Total Bookings</p>
                            <p className="text-xl font-bold text-gray-900">{selectedCustomer?.totalBookings}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500">Total Spent</p>
                            <p className="text-xl font-bold text-emerald-600">{formatCurrency(selectedCustomer?.totalSpent || 0)}</p>
                        </div>
                    </div>

                    {/* Last Active */}
                    <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase mb-1">Last Active</p>
                        <p className="text-sm text-gray-700">{selectedCustomer && formatDate(selectedCustomer.lastActive)}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <ReusableButton onClick={() => { setShowModal(false); openEditModal(selectedCustomer!); }} label="Edit Customer" className="flex-1" />
                        <ReusableButton variant="secondary" onClick={() => setShowModal(false)} label="Close" className="flex-1" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6"
        >
            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                {dashboardCards.map((card, index) => (
                    <StatCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        color={card.color}
                        delay={card.delay}
                        trend={card.trend}
                        trendUp={card.trendUp}
                    />
                ))}
            </motion.div>

            {/* Search and Filter */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    >
                        <option value="all">All Roles</option>
                        <option value="customer">Customer</option>
                        <option value="premium">Premium</option>
                        <option value="vip">VIP</option>
                    </select>
                    <ReusableButton onClick={openAddModal} icon={Plus} label="Add New Customer" />
                </div>
            </motion.div>

            {/* Table */}
            <motion.div variants={itemVariants}>
                <ReusableTable
                    columns={columns}
                    data={filteredCustomers}
                    title="Customer Management"
                    icon={Users}
                    showSearch={false}
                    showExport={true}
                    showPrint={false}
                    itemsPerPage={10}
                />
            </motion.div>

            {/* Modals */}
            {showModal && modalMode !== 'view' && <FormModal />}
            {showModal && modalMode === 'view' && <ViewModal />}

            {/* Suspend Confirm Modal */}
            {showSuspendConfirm && selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Ban className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Suspend Customer</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to suspend "<strong>{selectedCustomer.fullName}</strong>"?
                            Suspended customers will not be able to make new bookings.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowSuspendConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleSuspendCustomer} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                                Suspend
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Activate Confirm Modal */}
            {showActivateConfirm && selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Activate Customer</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to activate "<strong>{selectedCustomer.fullName}</strong>"?
                            The customer will be able to make bookings again.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowActivateConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleActivateCustomer} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                Activate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal (Permanent Delete) */}
            {showDeleteConfirm && selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Delete Customer</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to permanently delete "<strong>{selectedCustomer.fullName}</strong>"?
                            This action cannot be undone and all customer data will be lost.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleDeleteCustomer} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                Delete Permanently
                            </button>
                        </div>
                    </div>
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
        </motion.div>
    );
};

export default CustomerManagement;