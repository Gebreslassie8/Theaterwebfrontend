// src/pages/Manager/employee/EmployeeManagement.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    UsersRound,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    Ban,
    Phone,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    Activity,
    UserCheck,
    Crown,
    Shield,
    LayoutGrid,
    ArrowRight,
    Mail,
    UserX,
    Clock,
    CoinsIcon,
    Briefcase
} from 'lucide-react';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import AddNewEmployee from '../../../components/EmployeeForm/AddNewEmployee';
import UpdateEmployee from '../../../components/EmployeeForm/UpdateEmployee';
import ViewEmployee from '../../../components/EmployeeForm/ViewEmployee';
import { DeleteConfirmModal } from '../../../components/EmployeeForm/DeleteConfirmModal';

// Employee Type Definition
interface Employee {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    salary: number;
    notes?: string;
    status: 'Active' | 'Inactive' | 'On Leave';
    joinDate?: string;
    assignedRole: 'salesperson' | 'manager' | 'scanner' | 'admin';
    deactivatedAt?: string;
    deactivationReason?: string;
}

// Mock Employee Data
const mockEmployees: Employee[] = [
    { id: 'emp-1', name: 'John Doe', username: 'john.doe', email: 'john.doe@example.com', phone: '+251 911 234 567', password: '********', salary: 8500, status: 'Active', joinDate: '2024-01-15', assignedRole: 'salesperson' },
    { id: 'emp-2', name: 'Jane Smith', username: 'jane.smith', email: 'jane.smith@example.com', phone: '+251 912 345 678', password: '********', salary: 12000, status: 'Active', joinDate: '2024-02-10', assignedRole: 'manager' },
    { id: 'emp-3', name: 'Mike Johnson', username: 'mike.j', email: 'mike.johnson@example.com', phone: '+251 913 456 789', password: '********', salary: 9500, status: 'Active', joinDate: '2024-03-01', assignedRole: 'salesperson' },
    { id: 'emp-4', name: 'Sarah Williams', username: 'sarah.w', email: 'sarah.williams@example.com', phone: '+251 914 567 890', password: '********', salary: 10500, status: 'Active', joinDate: '2024-01-20', assignedRole: 'scanner' },
    { id: 'emp-5', name: 'David Brown', username: 'david.b', email: 'david.brown@example.com', phone: '+251 915 678 901', password: '********', salary: 7500, status: 'Inactive', joinDate: '2024-03-15', assignedRole: 'salesperson', deactivatedAt: '2024-03-15', deactivationReason: 'Performance issues' },
    { id: 'emp-6', name: 'Emily Davis', username: 'emily.d', email: 'emily.davis@example.com', phone: '+251 916 789 012', password: '********', salary: 15000, status: 'Active', joinDate: '2024-04-01', assignedRole: 'admin', notes: 'System administrator' },
    { id: 'emp-7', name: 'Robert Wilson', username: 'robert.w', email: 'robert.wilson@example.com', phone: '+251 917 890 123', password: '********', salary: 13000, status: 'Active', joinDate: '2024-04-10', assignedRole: 'manager' },
    { id: 'emp-8', name: 'Lisa Anderson', username: 'lisa.a', email: 'lisa.anderson@example.com', phone: '+251 918 901 234', password: '********', salary: 8800, status: 'On Leave', joinDate: '2024-03-20', assignedRole: 'salesperson', notes: 'Maternity leave' },
    { id: 'emp-9', name: 'Michael Chen', username: 'michael.c', email: 'michael.chen@example.com', phone: '+251 919 012 345', password: '********', salary: 18000, status: 'Active', joinDate: '2024-02-15', assignedRole: 'admin', notes: 'Lead architect' },
    { id: 'emp-10', name: 'Rachel Green', username: 'rachel.g', email: 'rachel.green@example.com', phone: '+251 910 123 456', password: '********', salary: 11000, status: 'Active', joinDate: '2024-03-25', assignedRole: 'manager' },
    { id: 'emp-11', name: 'Thomas Anderson', username: 'thomas.a', email: 'thomas.anderson@example.com', phone: '+251 911 234 568', password: '********', salary: 9200, status: 'Active', joinDate: '2024-04-05', assignedRole: 'salesperson' },
    { id: 'emp-12', name: 'Patricia White', username: 'patricia.w', email: 'patricia.white@example.com', phone: '+251 912 345 679', password: '********', salary: 8200, status: 'Inactive', joinDate: '2024-01-10', assignedRole: 'scanner', deactivatedAt: '2024-01-10', deactivationReason: 'Attendance issues' }
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
                <Link to={link} className="block">
                    <CardContent />
                </Link>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
};

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [showReactivateConfirm, setShowReactivateConfirm] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [employeeToDeactivate, setEmployeeToDeactivate] = useState<Employee | null>(null);
    const [employeeToReactivate, setEmployeeToReactivate] = useState<Employee | null>(null);
    const [deactivationReason, setDeactivationReason] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Allowed roles for adding/updating (removed admin and manager)
    const allowedRoles = [
        { id: 'salesperson', label: 'Sales Person' },
        { id: 'scanner', label: 'Scanner' }
    ];

    // Full role list for display (ViewEmployee needs to show existing admin/manager labels)
    const allRolesForDisplay = [
        { id: 'salesperson', label: 'Sales Person' },
        { id: 'manager', label: 'Manager' },
        { id: 'scanner', label: 'Scanner' },
        { id: 'admin', label: 'Admin' }
    ];

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.phone.includes(searchTerm);
        // Remove manager and admin from role filter
        const matchesRole = filterRole === 'all' || employee.assignedRole === filterRole;
        const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = {
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.status === 'Active').length,
        inactiveEmployees: employees.filter(e => e.status === 'Inactive').length,
        totalPayroll: employees.reduce((sum, e) => sum + e.salary, 0),
    };

    const canDeactivate = (employee: Employee): boolean => {
        return employee.status === 'Active';
    };

    const canReactivate = (employee: Employee): boolean => {
        return employee.status === 'Inactive';
    };

    // Column definitions
    const columns = [
        {
            Header: 'Employee',
            accessor: 'name',
            sortable: true,
            Cell: (row: Employee) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">@{row.username}</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Contact',
            accessor: 'email',
            sortable: true,
            Cell: (row: Employee) => (
                <div>
                    <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{row.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{row.phone}</span>
                    </div>
                </div>
            )
        },
        {
            Header: 'Role',
            accessor: 'assignedRole',
            sortable: true,
            Cell: (row: Employee) => {
                const config = {
                    salesperson: { icon: UserCheck, color: 'bg-green-100 text-green-700', label: 'Sales Person' },
                    manager: { icon: Shield, color: 'bg-blue-100 text-blue-700', label: 'Manager' },
                    scanner: { icon: Activity, color: 'bg-purple-100 text-purple-700', label: 'Scanner' },
                    admin: { icon: Crown, color: 'bg-red-100 text-red-700', label: 'Admin' }
                };
                const c = config[row.assignedRole];
                const Icon = c.icon;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>
                        <Icon className="h-3 w-3" />
                        {c.label}
                    </span>
                );
            }
        },
        {
            Header: 'Salary (ETB)',
            accessor: 'salary',
            sortable: true,
            Cell: (row: Employee) => <span className="font-semibold text-green-600">Br {row.salary.toLocaleString()}</span>
        },
        {
            Header: 'Status',
            accessor: 'status',
            sortable: true,
            Cell: (row: Employee) => {
                const config = {
                    Active: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Active' },
                    Inactive: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Inactive' },
                    'On Leave': { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'On Leave' }
                };
                const c = config[row.status];
                const Icon = c.icon;
                return (
                    <div className="flex flex-col">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>
                            <Icon className="h-3 w-3" />
                            {c.label}
                        </span>
                        {row.deactivationReason && row.status === 'Inactive' && (
                            <span className="text-xs text-gray-400 mt-1" title={row.deactivationReason}>
                                Reason: {row.deactivationReason.length > 30 ? row.deactivationReason.substring(0, 30) + '...' : row.deactivationReason}
                            </span>
                        )}
                    </div>
                );
            }
        }
    ];

    const renderActions = (row: Employee) => (
        <div className="flex items-center justify-start gap-2">
            <button
                onClick={() => {
                    setViewingEmployee(row);
                    setShowViewModal(true);
                }}
                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                title="View Details"
            >
                <Eye className="h-4 w-4 text-blue-600" />
            </button>

            <button
                onClick={() => {
                    setSelectedEmployee(row);
                    setShowUpdateModal(true);
                }}
                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-all duration-200"
                title="Edit Employee"
            >
                <Edit className="h-4 w-4 text-teal-600" />
            </button>

            {canDeactivate(row) && (
                <button
                    onClick={() => {
                        setEmployeeToDeactivate(row);
                        setShowDeactivateConfirm(true);
                    }}
                    className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-all duration-200"
                    title="Deactivate Employee"
                >
                    <Ban className="h-4 w-4 text-orange-600" />
                </button>
            )}

            {canReactivate(row) && (
                <button
                    onClick={() => {
                        setEmployeeToReactivate(row);
                        setShowReactivateConfirm(true);
                    }}
                    className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200"
                    title="Reactivate Employee"
                >
                    <RefreshCw className="h-4 w-4 text-green-600" />
                </button>
            )}

            <button
                onClick={() => {
                    setEmployeeToDelete(row);
                    setShowDeleteConfirm(true);
                }}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200"
                title="Delete Employee"
            >
                <Trash2 className="h-4 w-4 text-red-600" />
            </button>
        </div>
    );

    const handleDeleteEmployee = () => {
        if (employeeToDelete) {
            setEmployees(employees.filter(e => e.id !== employeeToDelete.id));
            setShowDeleteConfirm(false);
            setEmployeeToDelete(null);
            setPopupMessage({
                title: 'Employee Deleted!',
                message: `${employeeToDelete.name} has been removed successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleDeactivateEmployee = () => {
        if (employeeToDeactivate) {
            const updatedEmployees = employees.map(employee =>
                employee.id === employeeToDeactivate.id
                    ? {
                        ...employee,
                        status: 'Inactive' as const,
                        deactivatedAt: new Date().toISOString().split('T')[0],
                        deactivationReason: deactivationReason
                    }
                    : employee
            );
            setEmployees(updatedEmployees);
            setShowDeactivateConfirm(false);
            setEmployeeToDeactivate(null);
            setDeactivationReason('');
            setPopupMessage({
                title: 'Employee Deactivated!',
                message: `${employeeToDeactivate.name} has been deactivated successfully`,
                type: 'warning'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleReactivateEmployee = () => {
        if (employeeToReactivate) {
            const updatedEmployees = employees.map(employee =>
                employee.id === employeeToReactivate.id
                    ? { ...employee, status: 'Active' as const, deactivatedAt: undefined, deactivationReason: undefined }
                    : employee
            );
            setEmployees(updatedEmployees);
            setShowReactivateConfirm(false);
            setEmployeeToReactivate(null);
            setPopupMessage({
                title: 'Employee Reactivated!',
                message: `${employeeToReactivate.name} has been reactivated successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const handleAddEmployee = (employeeData: any) => {
        const newEmployee: Employee = {
            id: `emp-${employees.length + 1}`,
            name: employeeData.name,
            username: employeeData.username,
            email: employeeData.email,
            phone: employeeData.phone,
            password: '********',
            salary: employeeData.salary || 5000,
            notes: employeeData.notes,
            status: employeeData.status || 'Active',
            joinDate: new Date().toISOString().split('T')[0],
            assignedRole: employeeData.assignedRole
        };
        setEmployees([...employees, newEmployee]);
        setShowAddModal(false);
        setPopupMessage({
            title: 'Employee Added Successfully!',
            message: `${employeeData.name} has been added to the system`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const handleUpdateEmployee = (updatedEmployeeData: any) => {
        setEmployees(employees.map(employee =>
            employee.id === updatedEmployeeData.id
                ? { ...employee, ...updatedEmployeeData }
                : employee
        ));
        setShowUpdateModal(false);
        setSelectedEmployee(null);
        setPopupMessage({
            title: 'Employee Updated!',
            message: `${updatedEmployeeData.name} has been updated successfully`,
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    const columnsWithActions = [
        ...columns,
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: renderActions,
            width: '280px',
            align: 'left' as const
        }
    ];

    // Dashboard Cards
    const dashboardCards = [
        { title: 'Total Employees', value: stats.totalEmployees, icon: UsersRound, color: 'from-teal-500 to-teal-600', delay: 0.1 },
        { title: 'Active Employees', value: stats.activeEmployees, icon: UserCheck, color: 'from-green-500 to-emerald-600', delay: 0.15 },
        { title: 'Inactive Employees', value: stats.inactiveEmployees, icon: UserX, color: 'from-red-500 to-rose-600', delay: 0.2 },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6 bg-gray-50 min-h-screen"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Roles</option>
                            <option value="salesperson">Sales Person</option>
                            <option value="scanner">Scanner</option>
                            {/* Removed manager and admin from filter */}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <ReusableButton
                        onClick={() => setShowAddModal(true)}
                        icon="UserPlus"
                        label="Add New Employee"
                        className="px-5 py-2.5 text-sm whitespace-nowrap bg-teal-600 hover:bg-teal-700 text-white"
                    />
                </div>

                {/* Table */}
                <ReusableTable
                    columns={columnsWithActions}
                    data={filteredEmployees}
                    icon={LayoutGrid}
                    showSearch={false}
                    showExport={true}
                    showPrint={false}
                />

                {/* Modals */}
                {showAddModal && (
                    <AddNewEmployee
                        isOpen={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        onSubmit={handleAddEmployee}
                        roles={allowedRoles}   // Only salesperson and scanner
                    />
                )}

                {showUpdateModal && selectedEmployee && (
                    <UpdateEmployee
                        isOpen={showUpdateModal}
                        employee={selectedEmployee}
                        roles={allowedRoles}   // Only salesperson and scanner (can downgrade admin/manager but not assign these roles)
                        onClose={() => {
                            setShowUpdateModal(false);
                            setSelectedEmployee(null);
                        }}
                        onUpdate={handleUpdateEmployee}
                    />
                )}

                {showViewModal && viewingEmployee && (
                    <ViewEmployee
                        isOpen={showViewModal}
                        employee={viewingEmployee}
                        roles={allRolesForDisplay}   // Keep full list for correct label display
                        onClose={() => {
                            setShowViewModal(false);
                            setViewingEmployee(null);
                        }}
                    />
                )}

                {/* Deactivate Confirmation Modal */}
                {showDeactivateConfirm && employeeToDeactivate && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <AlertCircle className="h-6 w-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Deactivate Employee</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to deactivate <strong>{employeeToDeactivate.name}</strong>?
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for deactivation</label>
                                <select
                                    value={deactivationReason}
                                    onChange={(e) => setDeactivationReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select reason</option>
                                    <option value="Performance issues">Performance issues</option>
                                    <option value="Attendance problems">Attendance problems</option>
                                    <option value="Policy violation">Policy violation</option>
                                    <option value="Requested by employee">Requested by employee</option>
                                    <option value="Role elimination">Role elimination</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeactivateConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleDeactivateEmployee} disabled={!deactivationReason} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition">Deactivate</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Reactivate Confirmation Modal */}
                {showReactivateConfirm && employeeToReactivate && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <RefreshCw className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Reactivate Employee</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to reactivate <strong>{employeeToReactivate.name}</strong>?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowReactivateConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleReactivateEmployee} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Reactivate</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <DeleteConfirmModal
                    employee={employeeToDelete}
                    onConfirm={handleDeleteEmployee}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setEmployeeToDelete(null);
                    }}
                />

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

export default EmployeeManagement;