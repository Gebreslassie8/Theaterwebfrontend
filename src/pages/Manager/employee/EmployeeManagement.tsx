// src/pages/Manager/employee/EmployeeManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Edit, Trash2, Plus, X, Eye, Search, UserPlus, DollarSign, Users, QrCode } from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// ==================== Types ====================
export type EmployeeRole = 'sales_employee' | 'qr_scanner';

export interface Employee {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  salary: number;
  role: EmployeeRole;
  notes?: string;
}

// ==================== Helper to create dynamic Yup schema ====================
const createEmployeeSchema = (isAddMode: boolean, existingUsernames: string[], currentUsername?: string) => {
  return yup.object({
    name: yup.string().required('Full name is required'),
    username: yup
      .string()
      .required('Username is required')
      .test('unique-username', 'Username already exists', (value) => {
        if (!value) return true;
        // For edit mode, if the username hasn't changed, it's valid.
        if (!isAddMode && value === currentUsername) return true;
        // Otherwise, check against all other usernames
        return !existingUsernames.includes(value);
      }),
    password: yup
      .string()
      .when([], {
        is: () => isAddMode,
        then: (schema) => schema.required('Password is required for new employee').min(4, 'Password must be at least 4 characters'),
        otherwise: (schema) => schema.notRequired(),
      }),
    email: yup.string().required('Email is required').email('Invalid email format'),
    phone: yup.string().required('Phone number is required'),
    salary: yup
      .number()
      .required('Salary is required')
      .positive('Salary must be positive')
      .typeError('Salary must be a number'),
    role: yup.string().oneOf(['sales_employee', 'qr_scanner']).required('Role is required'),
    notes: yup.string().optional(),
  });
};

// ==================== Mock Data & Helpers ====================
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const defaultEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'John Doe',
    username: 'john.doe',
    password: 'john123',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901',
    salary: 2500,
    role: 'sales_employee',
    notes: 'Top performer',
  },
  {
    id: 'emp-2',
    name: 'Jane Smith',
    username: 'jane.smith',
    password: 'jane123',
    email: 'jane.smith@example.com',
    phone: '+1 234 567 8902',
    salary: 2400,
    role: 'sales_employee',
  },
  {
    id: 'emp-3',
    name: 'Mike Johnson',
    username: 'mike.j',
    password: 'mike123',
    email: 'mike.j@example.com',
    phone: '+1 234 567 8903',
    salary: 2300,
    role: 'qr_scanner',
  },
  {
    id: 'emp-4',
    name: 'Sarah Williams',
    username: 'sarah.w',
    password: 'sarah123',
    email: 'sarah.w@example.com',
    phone: '+1 234 567 8904',
    salary: 2800,
    role: 'sales_employee',
    notes: 'Senior sales',
  },
  {
    id: 'emp-5',
    name: 'David Brown',
    username: 'david.b',
    password: 'david123',
    email: 'david.b@example.com',
    phone: '+1 234 567 8905',
    salary: 2000,
    role: 'qr_scanner',
  },
];

const migrateEmployee = (emp: any): Employee => {
  return {
    id: emp.id,
    name: emp.name,
    username: emp.username || emp.email?.split('@')[0] || 'user',
    password: emp.password || 'temp123',
    email: emp.email,
    phone: emp.phone,
    salary: typeof emp.salary === 'number' ? emp.salary : 2000,
    role: emp.role || 'sales_employee',
    notes: emp.notes,
  };
};

const loadEmployees = (): Employee[] => {
  const stored = localStorage.getItem('theater_employees');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const migrated = parsed.map(migrateEmployee);
        saveEmployees(migrated);
        return migrated;
      }
    } catch { /* fallback */ }
  }
  saveEmployees(defaultEmployees);
  return defaultEmployees;
};

const saveEmployees = (employees: Employee[]) => {
  localStorage.setItem('theater_employees', JSON.stringify(employees));
};

// ==================== Main Component ====================
const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Get list of all usernames (excluding the current employee if editing)
  const getExistingUsernames = useCallback(() => {
    if (modalMode === 'edit' && currentEmployee) {
      return employees.filter(emp => emp.id !== currentEmployee.id).map(emp => emp.username);
    }
    return employees.map(emp => emp.username);
  }, [employees, modalMode, currentEmployee]);

  // Dynamically create schema
  const [schema, setSchema] = useState(() => 
    createEmployeeSchema(true, [], undefined)
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      salary: 2000,
      role: 'sales_employee' as EmployeeRole,
      notes: '',
    },
  });

  // Update schema whenever mode or employees change (but not during typing)
  useEffect(() => {
    const existingUsernames = getExistingUsernames();
    const currentUsername = modalMode === 'edit' ? currentEmployee?.username : undefined;
    setSchema(() => createEmployeeSchema(modalMode === 'add', existingUsernames, currentUsername));
  }, [modalMode, currentEmployee, employees, getExistingUsernames]);

  useEffect(() => {
    const data = loadEmployees();
    setEmployees(data);
    setFilteredEmployees(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.username.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.phone.toLowerCase().includes(term)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const openAddModal = () => {
    setModalMode('add');
    setCurrentEmployee(null);
    reset({
      name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      salary: 2000,
      role: 'sales_employee',
      notes: '',
    });
    setShowModal(true);
  };

  const openEditModal = (emp: Employee) => {
    setModalMode('edit');
    setCurrentEmployee(emp);
    reset({
      name: emp.name,
      username: emp.username,
      password: '',
      email: emp.email,
      phone: emp.phone,
      salary: emp.salary,
      role: emp.role,
      notes: emp.notes || '',
    });
    setShowModal(true);
  };

  const openViewModal = (emp: Employee) => {
    setModalMode('view');
    setCurrentEmployee(emp);
    setShowModal(true);
  };

  const onSubmit = async (data: any) => {
    if (modalMode === 'add') {
      const newEmployee: Employee = {
        id: generateId(),
        name: data.name,
        username: data.username,
        password: data.password,
        email: data.email,
        phone: data.phone,
        salary: data.salary,
        role: data.role,
        notes: data.notes,
      };
      const updated = [...employees, newEmployee];
      setEmployees(updated);
      saveEmployees(updated);
      setSuccessMessage(`Employee "${newEmployee.name}" added successfully.`);
    } else if (modalMode === 'edit' && currentEmployee) {
      const updatedEmployee: Employee = {
        ...currentEmployee,
        name: data.name,
        username: data.username,
        password: data.password ? data.password : currentEmployee.password,
        email: data.email,
        phone: data.phone,
        salary: data.salary,
        role: data.role,
        notes: data.notes,
      };
      const updated = employees.map(emp => emp.id === currentEmployee.id ? updatedEmployee : emp);
      setEmployees(updated);
      saveEmployees(updated);
      setSuccessMessage(`Employee "${updatedEmployee.name}" updated successfully.`);
    }
    setShowModal(false);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleDelete = () => {
    if (!deletingEmployee) return;
    const updated = employees.filter(emp => emp.id !== deletingEmployee.id);
    setEmployees(updated);
    saveEmployees(updated);
    setShowDeleteConfirm(false);
    setDeletingEmployee(null);
    setSuccessMessage(`Employee "${deletingEmployee.name}" deleted.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const openDeleteConfirm = (emp: Employee) => {
    setDeletingEmployee(emp);
    setShowDeleteConfirm(true);
  };

  const formatRole = (role: EmployeeRole) => {
    return role === 'sales_employee' ? 'Sales Employee' : 'QR Scanner';
  };

  const columns = [
    { Header: 'Name', accessor: 'name', sortable: true },
    { Header: 'Username', accessor: 'username', sortable: true },
    { Header: 'Email', accessor: 'email', sortable: true },
    { Header: 'Phone', accessor: 'phone', sortable: true },
    {
      Header: 'Role',
      accessor: 'role',
      sortable: true,
      Cell: (row: Employee) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.role === 'sales_employee' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-purple-100 text-purple-800'
        }`}>
          {formatRole(row.role)}
        </span>
      )
    },
    {
      Header: 'Salary',
      accessor: 'salary',
      sortable: true,
      Cell: (row: Employee) => <span>${(row.salary || 0).toLocaleString()}</span>
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      sortable: false,
      Cell: (row: Employee) => (
        <div className="flex gap-2">
          <button onClick={() => openViewModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye size={16} /></button>
          <button onClick={() => openEditModal(row)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Edit"><Edit size={16} /></button>
          <button onClick={() => openDeleteConfirm(row)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} /></button>
        </div>
      )
    }
  ];

  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
  const qrScannerCount = employees.filter(e => e.role === 'qr_scanner').length;
  const salesEmployeeCount = employees.filter(e => e.role === 'sales_employee').length;

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mb-8 flex justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage all employees (Sales Employees & QR Scanners)</p>
        </div>
        <ReusableButton variant="primary" onClick={openAddModal} icon={<Plus size={16} />}>Add New Employee</ReusableButton>
      </div>

      {/* Statistics Cards - FinancialReports style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Employees */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Employees</p>
              <p className="text-xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>

        {/* Sales Employees */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Sales Employees</p>
              <p className="text-xl font-bold text-gray-900">{salesEmployeeCount}</p>
            </div>
          </div>
        </div>

        {/* QR Scanners */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">QR Scanners</p>
              <p className="text-xl font-bold text-gray-900">{qrScannerCount}</p>
            </div>
          </div>
        </div>

        {/* Monthly Payroll */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Monthly Payroll</p>
              <p className="text-xl font-bold text-gray-900">${totalMonthlyPayroll.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, username, email or phone..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ReusableTable columns={columns} data={filteredEmployees} title="Employees" showSearch={false} showExport showPrint={false} itemsPerPage={10} onExport={() => {}} />

      {/* Add/Edit/View Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className={`p-4 rounded-t-2xl flex justify-between ${modalMode === 'view' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
              <h2 className="text-xl font-bold">
                {modalMode === 'add' ? 'Add New Employee' : modalMode === 'edit' ? 'Edit Employee' : 'Employee Details'}
              </h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <div className="p-6">
              {modalMode === 'view' && currentEmployee ? (
                <div className="grid grid-cols-2 gap-3">
                  <div><strong>Name:</strong> {currentEmployee.name}</div>
                  <div><strong>Username:</strong> {currentEmployee.username}</div>
                  <div><strong>Password:</strong> {currentEmployee.password}</div>
                  <div><strong>Email:</strong> {currentEmployee.email}</div>
                  <div><strong>Phone:</strong> {currentEmployee.phone}</div>
                  <div><strong>Role:</strong> {formatRole(currentEmployee.role)}</div>
                  <div><strong>Salary:</strong> ${currentEmployee.salary}</div>
                  <div className="col-span-2"><strong>Notes:</strong> {currentEmployee.notes || '—'}</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => <input {...field} type="text" className="w-full p-2 border rounded mt-1" />}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username *</label>
                      <Controller
                        name="username"
                        control={control}
                        render={({ field }) => <input {...field} type="text" className="w-full p-2 border rounded mt-1" />}
                      />
                      {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {modalMode === 'add' ? 'Password *' : 'New Password (optional)'}
                      </label>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => <input {...field} type="password" className="w-full p-2 border rounded mt-1" />}
                      />
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email *</label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => <input {...field} type="email" className="w-full p-2 border rounded mt-1" />}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone *</label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => <input {...field} type="tel" className="w-full p-2 border rounded mt-1" />}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role *</label>
                      <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <select {...field} className="w-full p-2 border rounded mt-1">
                            <option value="sales_employee">Sales Employee</option>
                            <option value="qr_scanner">QR Scanner</option>
                          </select>
                        )}
                      />
                      {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Monthly Salary ($) *</label>
                      <Controller
                        name="salary"
                        control={control}
                        render={({ field }) => <input {...field} type="number" step="100" className="w-full p-2 border rounded mt-1" onChange={e => field.onChange(parseInt(e.target.value) || 0)} value={field.value} />}
                      />
                      {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                    <Controller
                      name="notes"
                      control={control}
                      render={({ field }) => <textarea {...field} rows={3} className="w-full p-2 border rounded mt-1" />}
                    />
                  </div>
                  <div className="flex gap-3">
                    <ReusableButton variant="outline" onClick={() => setShowModal(false)} type="button">Cancel</ReusableButton>
                    <ReusableButton variant="primary" type="submit" disabled={isSubmitting}>
                      {modalMode === 'add' ? 'Create' : 'Save'}
                    </ReusableButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Delete Employee</h2>
            <p>Delete {deletingEmployee.name}?</p>
            <div className="flex gap-3 mt-6">
              <ReusableButton variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</ReusableButton>
              <ReusableButton variant="danger" onClick={handleDelete}>Delete</ReusableButton>
            </div>
          </div>
        </div>
      )}

      <SuccessPopup isOpen={showSuccessPopup} message={successMessage} onClose={() => setShowSuccessPopup(false)} duration={3000} />
    </div>
  );
};

export default EmployeeManagement;