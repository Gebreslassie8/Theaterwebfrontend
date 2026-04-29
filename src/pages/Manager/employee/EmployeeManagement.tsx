// src/pages/Manager/employee/EmployeeManagement.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X, Eye, Search, UserPlus, DollarSign, Users } from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// ==================== Types ====================
export interface SalesPerson {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  salary: number;
  notes?: string;
}

// ==================== Mock Data & Helpers ====================
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const defaultEmployees: SalesPerson[] = [
  {
    id: 'emp-1',
    name: 'John Doe',
    username: 'john.doe',
    password: 'john123',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901',
    salary: 2500,
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
  },
  {
    id: 'emp-3',
    name: 'Mike Johnson',
    username: 'mike.j',
    password: 'mike123',
    email: 'mike.j@example.com',
    phone: '+1 234 567 8903',
    salary: 2300,
  },
  {
    id: 'emp-4',
    name: 'Sarah Williams',
    username: 'sarah.w',
    password: 'sarah123',
    email: 'sarah.w@example.com',
    phone: '+1 234 567 8904',
    salary: 2800,
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
  },
];

const migrateEmployee = (emp: any): SalesPerson => {
  return {
    id: emp.id,
    name: emp.name,
    username: emp.username || emp.email?.split('@')[0] || 'user',
    password: emp.password || 'temp123',
    email: emp.email,
    phone: emp.phone,
    salary: typeof emp.salary === 'number' ? emp.salary : 2000,
    notes: emp.notes,
  };
};

const loadEmployees = (): SalesPerson[] => {
  const stored = localStorage.getItem('theater_sales_persons');
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

const saveEmployees = (employees: SalesPerson[]) => {
  localStorage.setItem('theater_sales_persons', JSON.stringify(employees));
};

// ==================== Main Component ====================
const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<SalesPerson[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<SalesPerson[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [currentEmployee, setCurrentEmployee] = useState<SalesPerson | null>(null);
  const [formData, setFormData] = useState<Partial<SalesPerson>>({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    salary: 2000,
    notes: '',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<SalesPerson | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
    setFormData({
      name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      salary: 2000,
      notes: '',
    });
    setShowModal(true);
  };

  const openEditModal = (emp: SalesPerson) => {
    setModalMode('edit');
    setCurrentEmployee(emp);
    setFormData({ ...emp, password: '' });
    setShowModal(true);
  };

  const openViewModal = (emp: SalesPerson) => {
    setModalMode('view');
    setCurrentEmployee(emp);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.username || (modalMode === 'add' && !formData.password) || !formData.email || !formData.phone) {
      alert('Please fill all required fields (Name, Username, Password, Email, Phone)');
      return;
    }
    if (formData.salary && formData.salary < 0) {
      alert('Salary must be positive');
      return;
    }
    // Check username uniqueness
    const existing = employees.find(emp => emp.username === formData.username && emp.id !== currentEmployee?.id);
    if (existing) {
      alert('Username already exists. Choose another.');
      return;
    }

    if (modalMode === 'add') {
      const newEmployee: SalesPerson = {
        id: generateId(),
        name: formData.name!,
        username: formData.username!,
        password: formData.password!,
        email: formData.email!,
        phone: formData.phone!,
        salary: formData.salary || 0,
        notes: formData.notes,
      };
      const updated = [...employees, newEmployee];
      setEmployees(updated);
      saveEmployees(updated);
      setSuccessMessage(`Sales person "${newEmployee.name}" added successfully.`);
    } else if (modalMode === 'edit' && currentEmployee) {
      const updatedEmployee: SalesPerson = {
        ...currentEmployee,
        name: formData.name!,
        username: formData.username!,
        password: formData.password ? formData.password : currentEmployee.password,
        email: formData.email!,
        phone: formData.phone!,
        salary: formData.salary || 0,
        notes: formData.notes,
      };
      const updated = employees.map(emp => emp.id === currentEmployee.id ? updatedEmployee : emp);
      setEmployees(updated);
      saveEmployees(updated);
      setSuccessMessage(`Sales person "${updatedEmployee.name}" updated successfully.`);
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
    setSuccessMessage(`Sales person "${deletingEmployee.name}" deleted.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const openDeleteConfirm = (emp: SalesPerson) => {
    setDeletingEmployee(emp);
    setShowDeleteConfirm(true);
  };

  // Table columns – no status, no address
  const columns = [
    { Header: 'Name', accessor: 'name', sortable: true },
    { Header: 'Username', accessor: 'username', sortable: true },
    { Header: 'Email', accessor: 'email', sortable: true },
    { Header: 'Phone', accessor: 'phone', sortable: true },
    {
      Header: 'Salary',
      accessor: 'salary',
      sortable: true,
      Cell: (row: SalesPerson) => <span>${(row.salary || 0).toLocaleString()}</span>
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      sortable: false,
      Cell: (row: SalesPerson) => (
        <div className="flex gap-2">
          <button onClick={() => openViewModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye size={16} /></button>
          <button onClick={() => openEditModal(row)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Edit"><Edit size={16} /></button>
          <button onClick={() => openDeleteConfirm(row)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} /></button>
        </div>
      )
    }
  ];

  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + (e.salary || 0), 0);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mb-8 flex justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Sales Team Management</h1>
          <p className="text-gray-600 mt-1">Manage sales persons and their login credentials</p>
        </div>
        <ReusableButton variant="primary" onClick={openAddModal} icon={<Plus size={16} />}>Add Sales Person</ReusableButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-500" />
          <div><p className="text-sm text-gray-500">Total Salespersons</p><p className="text-2xl font-bold">{employees.length}</p></div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-purple-500" />
          <div><p className="text-sm text-gray-500">Total Monthly Payroll</p><p className="text-2xl font-bold">${totalMonthlyPayroll.toLocaleString()}</p></div>
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

      <ReusableTable columns={columns} data={filteredEmployees} title="Sales Persons" showSearch={false} showExport showPrint={false} itemsPerPage={10} onExport={() => {}} />

      {/* Add/Edit/View Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className={`p-4 rounded-t-2xl flex justify-between ${modalMode === 'view' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
              <h2 className="text-xl font-bold">{modalMode === 'add' ? 'Add Sales Person' : modalMode === 'edit' ? 'Edit Sales Person' : 'Sales Person Details'}</h2>
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
                  <div><strong>Salary:</strong> ${currentEmployee.salary}</div>
                  <div className="col-span-2"><strong>Notes:</strong> {currentEmployee.notes || '—'}</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div><label>Full Name *</label><input type="text" className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label>Username *</label><input type="text" className="w-full p-2 border rounded" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} /></div>
                    <div><label>{modalMode === 'add' ? 'Password *' : 'New Password (optional)'}</label><input type="password" className="w-full p-2 border rounded" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label>Email *</label><input type="email" className="w-full p-2 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                    <div><label>Phone *</label><input type="tel" className="w-full p-2 border rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label>Monthly Salary ($)</label><input type="number" step="100" className="w-full p-2 border rounded" value={formData.salary} onChange={e => setFormData({...formData, salary: parseInt(e.target.value)})} /></div>
                  </div>
                  <div><label>Notes (optional)</label><textarea rows={3} className="w-full p-2 border rounded" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></div>
                  <div className="flex gap-3"><ReusableButton variant="outline" onClick={() => setShowModal(false)}>Cancel</ReusableButton><ReusableButton variant="primary" onClick={handleSave}>{modalMode === 'add' ? 'Create' : 'Save'}</ReusableButton></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Delete Sales Person</h2>
            <p>Delete {deletingEmployee.name}?</p>
            <div className="flex gap-3 mt-6"><ReusableButton variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</ReusableButton><ReusableButton variant="danger" onClick={handleDelete}>Delete</ReusableButton></div>
          </div>
        </div>
      )}

      <SuccessPopup isOpen={showSuccessPopup} message={successMessage} onClose={() => setShowSuccessPopup(false)} duration={3000} />
    </div>
  );
};

export default EmployeeManagement;