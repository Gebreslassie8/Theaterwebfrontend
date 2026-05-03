// src/pages/Manager/halls/HallsManagement.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X, Eye, Users, MapPin, Star, Tag, Layout, CreditCard, Save, Search, Building, TrendingUp, CheckCircle } from 'lucide-react';import ReusableButton from '../../../components/Reusable/ReusableButton';
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
  seatTypes: SeatType[];        // dynamic list of seat types and their counts
  features: string[];
  status: 'Active' | 'Maintenance'; // kept for API compatibility but hidden from UI
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

// ==================== Main Component ====================
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

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
      setSuccessMessage('Failed to load halls');
      setShowSuccess(true);
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
      alert('Hall name is required');
      return;
    }
    if (formSeatTypes.length === 0) {
      alert('Please add at least one seat type');
      return;
    }
    if (formSeatTypes.some(st => !st.name.trim() || st.count <= 0)) {
      alert('All seat types must have a name and a positive count');
      return;
    }
    const featuresArray = formFeatures.split(',').map(f => f.trim()).filter(f => f);
    const newHall: Omit<Hall, 'id'> = {
      name: formName,
      seatTypes: formSeatTypes,
      features: featuresArray,
      status: 'Active', // always active, hidden from UI
      seatingLayout: formSeatingLayout,
      rows: formRows,
      columns: formColumns,
      priceMultiplier: formPriceMultiplier,
    };
    try {
      const created = await mockApi.createHall(newHall);
      setHalls([...halls, created]);
      setSuccessMessage(`${formName} added successfully!`);
      setShowSuccess(true);
      setShowForm(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setSuccessMessage('Failed to add hall');
      setShowSuccess(true);
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

  const handleEditInModal = () => {
    if (!selectedHall) return;
    setEditName(selectedHall.name);
    setEditSeatTypes(selectedHall.seatTypes.map(st => ({ ...st })));
    setEditFeatures(selectedHall.features.join(', '));
    setEditSeatingLayout(selectedHall.seatingLayout);
    setEditRows(selectedHall.rows);
    setEditColumns(selectedHall.columns);
    setEditPriceMultiplier(selectedHall.priceMultiplier);
    setIsEditing(true);
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
      status: 'Active', // always active, hidden from UI
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
      setSuccessMessage(`${editName} updated successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setSuccessMessage('Failed to update hall');
      setShowSuccess(true);
    }
  };

  const handleDeleteHall = async (id: number) => {
    if (window.confirm('Delete this hall?')) {
      try {
        await mockApi.deleteHall(id);
        setHalls(halls.filter(h => h.id !== id));
        setSuccessMessage('Hall deleted');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        setSuccessMessage('Delete failed');
        setShowSuccess(true);
      }
    }
  };

  const handleCancelForm = () => setShowForm(false);

  // Table columns – shows Hall Name, Total Seats, Actions (Status column removed)
  const tableColumns = [
    { Header: 'Hall Name', accessor: 'name', sortable: true },
    {
      Header: 'Total Seats',
      accessor: 'totalCapacity',
      sortable: true,
      Cell: (row: Hall) => <span>{calculateTotalCapacity(row.seatTypes).toLocaleString()}</span>
    },
    {
      Header: 'View',
      accessor: 'view',
      sortable: false,
      Cell: (row: Hall) => (
        <button onClick={() => handleViewDetails(row)} className="p-1.5 bg-white border rounded-lg text-green-600 hover:bg-green-50">
          <Eye className="h-4 w-4" />
        </button>
      )
    },
    {
      Header: 'Edit',
      accessor: 'edit',
      sortable: false,
      Cell: (row: Hall) => (
        <button onClick={() => handleEditFromTable(row)} className="p-1.5 bg-white border rounded-lg text-blue-600 hover:bg-blue-50">
          <Edit className="h-4 w-4" />
        </button>
      )
    },
    {
      Header: 'Delete',
      accessor: 'delete',
      sortable: false,
      Cell: (row: Hall) => (
        <button onClick={() => handleDeleteHall(row.id)} className="p-1.5 bg-white border rounded-lg text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </button>
      )
    }
  ];

  // Statistics for cards
  const totalHalls = halls.length;
  const totalSeats = halls.reduce((sum, hall) => sum + calculateTotalCapacity(hall.seatTypes), 0);
  const averageCapacity = totalHalls > 0 ? Math.round(totalSeats / totalHalls) : 0;
  const activeHalls = halls.filter(h => h.status === 'Active').length;

  if (loading) return <div className="p-6 text-center">Loading halls...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Halls Management</h1>
          <p className="text-gray-600 mt-1">Manage cinema halls, seat types, and capacities</p>
        </div>
        <ReusableButton onClick={handleAddHall} variant="primary" icon={Plus}>Add New Hall</ReusableButton>
      </div>

      {/* Statistics Cards - FinancialReports style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Halls */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Halls</p>
              <p className="text-xl font-bold text-gray-900">{totalHalls}</p>
            </div>
          </div>
        </div>

        {/* Total Seats */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Seats</p>
              <p className="text-xl font-bold text-gray-900">{totalSeats.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Average Capacity */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg. Capacity / Hall</p>
              <p className="text-xl font-bold text-gray-900">{averageCapacity.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Active Halls */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Halls</p>
              <p className="text-xl font-bold text-gray-900">{activeHalls}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search only – Status filter removed */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Search by hall name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-3 border-2 rounded-xl" />
        </div>
      </div>

      <ReusableTable columns={tableColumns} data={filteredHalls} title="All Halls" showSearch={false} showExport={false} showPrint={false} itemsPerPage={10} />

      {/* Add Hall Modal - Deep Teal Header */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-teal-700 p-6 sticky top-0 flex justify-between text-white">
              <h2 className="text-xl font-bold">➕ Add New Hall</h2>
              <button onClick={handleCancelForm}><X /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              <div><label>Hall Name *</label><input type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full p-2 border rounded-lg" required /></div>
              <div><label>Features (comma separated)</label><input type="text" value={formFeatures} onChange={e => setFormFeatures(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label>Layout</label><select value={formSeatingLayout} onChange={e => setFormSeatingLayout(e.target.value)} className="w-full p-2 border rounded-lg"><option>Standard</option><option>Compact</option><option>Premium</option></select></div>
                <div><label>Price Multiplier</label><input type="number" step="0.1" value={formPriceMultiplier} onChange={e => setFormPriceMultiplier(parseFloat(e.target.value))} className="w-full p-2 border rounded-lg" /></div>
                <div><label>Rows</label><input type="number" value={formRows} onChange={e => setFormRows(parseInt(e.target.value))} className="w-full p-2 border rounded-lg" /></div>
                <div><label>Columns</label><input type="number" value={formColumns} onChange={e => setFormColumns(parseInt(e.target.value))} className="w-full p-2 border rounded-lg" /></div>
              </div>

              {/* Dynamic Seat Types */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Seat Types (Name & Count)</h3>
                  <ReusableButton onClick={addFormSeatType} variant="primary" size="sm" icon={Plus}>Add Type</ReusableButton>
                </div>
                <div className="space-y-3">
                  {formSeatTypes.map(st => (
                    <div key={st.id} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                      <input type="text" placeholder="Seat type name" value={st.name} onChange={e => updateFormSeatType(st.id, 'name', e.target.value)} className="flex-1 p-2 border rounded" />
                      <input type="number" placeholder="Count" value={st.count} onChange={e => updateFormSeatType(st.id, 'count', e.target.value)} className="w-28 p-2 border rounded" />
                      <button type="button" onClick={() => removeFormSeatType(st.id)} className="text-red-600"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  ))}
                </div>
                {formSeatTypes.length === 0 && <p className="text-gray-400 text-center py-2">No seat types added. Click "Add Type" to start.</p>}
                <div className="mt-3 text-right font-semibold">
                  Total Capacity: {calculateTotalCapacity(formSeatTypes)}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <ReusableButton type="button" variant="outline" onClick={handleCancelForm}>Cancel</ReusableButton>
                <ReusableButton type="submit" variant="primary">Create Hall</ReusableButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details / Edit Modal – Deep Teal header for both view and edit modes */}
      {showDetailsModal && selectedHall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header always deep teal */}
            <div className="bg-teal-700 p-6 sticky top-0 flex justify-between text-white">
              <h2 className="text-xl font-bold">{isEditing ? '✏️ Edit Hall' : '📋 Hall Details'}</h2>
              <button onClick={() => setShowDetailsModal(false)}><X /></button>
            </div>
            <div className="p-6 space-y-6">
              {!isEditing ? (
                // View Mode – shows all seat types with counts (Status line removed)
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Name:</strong> {selectedHall.name}</div>
                    <div><strong>Total Capacity:</strong> {calculateTotalCapacity(selectedHall.seatTypes)}</div>
                    <div><strong>Price Multiplier:</strong> {selectedHall.priceMultiplier}x</div>
                    <div><strong>Layout:</strong> {selectedHall.seatingLayout} ({selectedHall.rows}×{selectedHall.columns})</div>
                    <div><strong>Features:</strong> {selectedHall.features.join(', ')}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Seat Types Breakdown</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      {selectedHall.seatTypes.map(st => (
                        <div key={st.id} className="flex justify-between items-center border-b last:border-0 py-2">
                          <span className="font-medium">{st.name}</span>
                          <span>{st.count} seats</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Edit Mode – dynamic list of seat types (Status field removed)
                <div className="space-y-6">
                  <div><label>Hall Name *</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                  <div><label>Features (comma separated)</label><input type="text" value={editFeatures} onChange={e => setEditFeatures(e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label>Layout</label><select value={editSeatingLayout} onChange={e => setEditSeatingLayout(e.target.value)} className="w-full p-2 border rounded-lg"><option>Standard</option><option>Compact</option><option>Premium</option></select></div>
                    <div><label>Price Multiplier</label><input type="number" step="0.1" value={editPriceMultiplier} onChange={e => setEditPriceMultiplier(parseFloat(e.target.value))} className="w-full p-2 border rounded-lg" /></div>
                    <div><label>Rows</label><input type="number" value={editRows} onChange={e => setEditRows(parseInt(e.target.value))} className="w-full p-2 border rounded-lg" /></div>
                    <div><label>Columns</label><input type="number" value={editColumns} onChange={e => setEditColumns(parseInt(e.target.value))} className="w-full p-2 border rounded-lg" /></div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold">Seat Types (Name & Count)</h3>
                      <ReusableButton onClick={addEditSeatType} variant="primary" size="sm" icon={Plus}>Add Type</ReusableButton>
                    </div>
                    <div className="space-y-3">
                      {editSeatTypes.map(st => (
                        <div key={st.id} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
                          <input type="text" placeholder="Seat type name" value={st.name} onChange={e => updateEditSeatType(st.id, 'name', e.target.value)} className="flex-1 p-2 border rounded" />
                          <input type="number" placeholder="Count" value={st.count} onChange={e => updateEditSeatType(st.id, 'count', e.target.value)} className="w-28 p-2 border rounded" />
                          <button type="button" onClick={() => removeEditSeatType(st.id)} className="text-red-600"><Trash2 className="h-5 w-5" /></button>
                        </div>
                      ))}
                    </div>
                    {editSeatTypes.length === 0 && <p className="text-gray-400 text-center py-2">No seat types. Click "Add Type" to add.</p>}
                    <div className="mt-3 text-right font-semibold">
                      Total Capacity: {calculateTotalCapacity(editSeatTypes)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              {!isEditing ? (
                <>
                  <ReusableButton variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</ReusableButton>
                  <ReusableButton variant="primary" onClick={handleEditInModal} icon={Edit}>Edit Hall</ReusableButton>
                </>
              ) : (
                <>
                  <ReusableButton variant="secondary" onClick={handleCancelEdit}>Cancel</ReusableButton>
                  <ReusableButton variant="success" onClick={handleSaveEdit} icon={Save}>Save Changes</ReusableButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <SuccessPopup message={successMessage} isVisible={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
};

export default HallsManagement;