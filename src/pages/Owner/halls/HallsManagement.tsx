// src/components/dashboard/manager/halls/HallsManagement.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Grid, Settings, X } from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableForm from '../../../components/Reusable/ReusableForm';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Mock API service
const mockApi = {
  getHalls: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: "Hall A", capacity: 500, features: ["AC", "Dolby Sound", "VIP Seats"], status: "Active", seatingLayout: "Standard", rows: 20, columns: 25, priceMultiplier: 1.0 },
          { id: 2, name: "Hall B", capacity: 300, features: ["AC", "Surround Sound"], status: "Active", seatingLayout: "Standard", rows: 15, columns: 20, priceMultiplier: 1.0 },
          { id: 3, name: "Hall C", capacity: 200, features: ["Standard Sound"], status: "Maintenance", seatingLayout: "Compact", rows: 10, columns: 20, priceMultiplier: 1.0 },
          { id: 4, name: "VIP Hall", capacity: 100, features: ["Premium Seats", "Private Lounge", "AC"], status: "Active", seatingLayout: "Premium", rows: 10, columns: 10, priceMultiplier: 2.0 },
          { id: 5, name: "IMAX Hall", capacity: 800, features: ["IMAX Screen", "3D", "Dolby Atmos"], status: "Active", seatingLayout: "Premium", rows: 25, columns: 32, priceMultiplier: 2.5 },
          { id: 6, name: "Kids Hall", capacity: 150, features: ["Kids Friendly", "Soft Seats", "Play Area"], status: "Active", seatingLayout: "Compact", rows: 10, columns: 15, priceMultiplier: 0.8 },
        ]);
      }, 500);
    });
  },
  createHall: async (hallData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...hallData, id: Math.floor(Math.random() * 1000) });
      }, 500);
    });
  },
  updateHall: async (id: number, hallData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...hallData, id });
      }, 500);
    });
  },
  deleteHall: async (id: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};

const HallsManagement: React.FC = () => {
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSeatingModal, setShowSeatingModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingHall, setEditingHall] = useState<any>(null);
  const [selectedHall, setSelectedHall] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    features: '',
    status: 'Active'
  });

  const [seatingData, setSeatingData] = useState({
    rows: 0,
    columns: 0,
    layoutType: 'Standard'
  });

  const [settingsData, setSettingsData] = useState({
    priceMultiplier: 1.0,
    hasProjector: true,
    hasSoundSystem: true,
    hasAirConditioning: true,
    accessibilityFeatures: ''
  });

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getHalls();
      setHalls(data as any[]);
    } catch (error) {
      console.error('Error loading halls:', error);
      setSuccessMessage('Failed to load halls');
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Hall Name',
      type: 'text' as const,
      placeholder: 'Enter hall name',
      required: true,
      value: formData.name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })
    },
    {
      name: 'capacity',
      label: 'Capacity',
      type: 'number' as const,
      placeholder: 'Enter seating capacity',
      required: true,
      value: formData.capacity,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, capacity: e.target.value })
    },
    {
      name: 'features',
      label: 'Features',
      type: 'textarea' as const,
      placeholder: 'Enter features separated by commas',
      required: true,
      value: formData.features,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, features: e.target.value })
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      required: true,
      value: formData.status,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value }),
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Maintenance', label: 'Maintenance' },
      ],
    },
  ];

  // Table columns configuration for ReusableTable
  const tableColumns = [
    {
      Header: 'Hall Name',
      accessor: 'name',
      sortable: true
    },
    {
      Header: 'Capacity',
      accessor: 'capacity',
      sortable: true
    },
    {
      Header: 'Features',
      accessor: 'features',
      sortable: false
    },
    {
      Header: 'Status',
      accessor: 'status',
      sortable: true,
      Cell: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      Header: 'Layout',
      accessor: 'seatingLayout',
      sortable: true,
      Cell: (row: any) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
          {row.seatingLayout}
        </span>
      )
    },
    {
      Header: 'Price Multiplier',
      accessor: 'priceMultiplier',
      sortable: true,
      Cell: (row: any) => (
        <span className="font-semibold text-blue-600">
          {row.priceMultiplier}x
        </span>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      sortable: false,
      Cell: (row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleSeatingLayout(row)}
            className="p-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            title="Seating Layout"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleSettings(row)}
            className="p-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditHall(row)}
            className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            title="Edit Hall"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteHall(row.id)}
            className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  // Prepare data for ReusableTable
  const tableData = halls.map(hall => ({
    id: hall.id,
    name: hall.name,
    capacity: hall.capacity,
    features: Array.isArray(hall.features) ? hall.features.join(', ') : hall.features,
    status: hall.status,
    seatingLayout: hall.seatingLayout,
    priceMultiplier: hall.priceMultiplier,
  }));

  const handleAddHall = () => {
    setEditingHall(null);
    setFormData({
      name: '',
      capacity: '',
      features: '',
      status: 'Active'
    });
    setShowForm(true);
  };

  const handleEditHall = (hall: any) => {
    setEditingHall(hall);
    setFormData({
      name: hall.name,
      capacity: hall.capacity.toString(),
      features: hall.features,
      status: hall.status
    });
    setShowForm(true);
  };

  const handleDeleteHall = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this hall?')) {
      try {
        await mockApi.deleteHall(id);
        const deletedHall = halls.find(hall => hall.id === id);
        setHalls(halls.filter(hall => hall.id !== id));
        setSuccessMessage(`${deletedHall?.name} deleted successfully!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        setSuccessMessage('Failed to delete hall');
        setShowSuccess(true);
      }
    }
  };

  const handleSeatingLayout = (hall: any) => {
    setSelectedHall(hall);
    setSeatingData({
      rows: hall.rows || 0,
      columns: hall.columns || 0,
      layoutType: hall.seatingLayout || 'Standard'
    });
    setShowSeatingModal(true);
  };

  const handleSaveSeatingLayout = async () => {
    try {
      const updatedHall = {
        ...selectedHall,
        rows: seatingData.rows,
        columns: seatingData.columns,
        seatingLayout: seatingData.layoutType,
        capacity: seatingData.rows * seatingData.columns
      };
      await mockApi.updateHall(selectedHall.id, updatedHall);
      setHalls(halls.map(hall => 
        hall.id === selectedHall.id ? updatedHall : hall
      ));
      setSuccessMessage(`Seating layout for ${selectedHall.name} updated successfully!`);
      setShowSuccess(true);
      setShowSeatingModal(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setSuccessMessage('Failed to update seating layout');
      setShowSuccess(true);
    }
  };

  const handleSettings = (hall: any) => {
    setSelectedHall(hall);
    setSettingsData({
      priceMultiplier: hall.priceMultiplier || 1.0,
      hasProjector: hall.hasProjector !== undefined ? hall.hasProjector : true,
      hasSoundSystem: hall.hasSoundSystem !== undefined ? hall.hasSoundSystem : true,
      hasAirConditioning: hall.hasAirConditioning !== undefined ? hall.hasAirConditioning : true,
      accessibilityFeatures: hall.accessibilityFeatures || ''
    });
    setShowSettingsModal(true);
  };

  const handleSaveSettings = async () => {
    try {
      const updatedHall = {
        ...selectedHall,
        priceMultiplier: settingsData.priceMultiplier,
        hasProjector: settingsData.hasProjector,
        hasSoundSystem: settingsData.hasSoundSystem,
        hasAirConditioning: settingsData.hasAirConditioning,
        accessibilityFeatures: settingsData.accessibilityFeatures
      };
      await mockApi.updateHall(selectedHall.id, updatedHall);
      setHalls(halls.map(hall => 
        hall.id === selectedHall.id ? updatedHall : hall
      ));
      setSuccessMessage(`Settings for ${selectedHall.name} updated successfully!`);
      setShowSuccess(true);
      setShowSettingsModal(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setSuccessMessage('Failed to update settings');
      setShowSuccess(true);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.capacity || !formData.features) {
      alert('Please fill in all required fields');
      return;
    }
    
    const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);
    
    try {
      if (editingHall) {
        const updatedHall = {
          ...editingHall,
          name: formData.name,
          capacity: parseInt(formData.capacity),
          features: featuresArray.join(', '),
          status: formData.status
        };
        await mockApi.updateHall(editingHall.id, updatedHall);
        setHalls(halls.map(hall => 
          hall.id === editingHall.id ? updatedHall : hall
        ));
        setSuccessMessage(`${formData.name} updated successfully!`);
      } else {
        const newHall = {
          name: formData.name,
          capacity: parseInt(formData.capacity),
          features: featuresArray.join(', '),
          status: formData.status,
          seatingLayout: 'Standard',
          rows: 0,
          columns: 0,
          priceMultiplier: 1.0,
        };
        const createdHall = await mockApi.createHall(newHall);
        setHalls([...halls, createdHall]);
        setSuccessMessage(`${formData.name} added successfully!`);
      }
      
      setShowForm(false);
      setEditingHall(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setSuccessMessage('Failed to save hall');
      setShowSuccess(true);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingHall(null);
    setFormData({
      name: '',
      capacity: '',
      features: '',
      status: 'Active'
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading halls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Halls Management</h1>
          <p className="text-gray-600 mt-1">Manage theater halls and seating arrangements</p>
        </div>
        <ReusableButton
          onClick={handleAddHall}
          variant="primary"
          icon={Plus}
          className="text-white font-medium"
        >
          Add New Hall
        </ReusableButton>
      </div>

      {/* Reusable Table */}
      <ReusableTable
        columns={tableColumns}
        data={tableData}
        title="All Halls"
        showSearch={true}
        showExport={false}
        showPrint={false}
        itemsPerPage={10}
      />

      {/* Add/Edit Hall Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingHall ? '✏️ Edit Hall' : '➕ Add New Hall'}
              </h2>
              <button
                onClick={handleCancelForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <ReusableForm
              fields={formFields}
              onSubmit={handleFormSubmit}
              submitLabel={editingHall ? "Update Hall" : "Create Hall"}
              cancelLabel="Cancel"
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* Seating Layout Modal with ReusableButton white text */}
      {showSeatingModal && selectedHall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                🪑 Seating Layout - {selectedHall.name}
              </h2>
              <button
                onClick={() => setShowSeatingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Layout Type
                </label>
                <select
                  value={seatingData.layoutType}
                  onChange={(e) => setSeatingData({ ...seatingData, layoutType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Compact">Compact</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Rows
                </label>
                <input
                  type="number"
                  value={seatingData.rows}
                  onChange={(e) => setSeatingData({ ...seatingData, rows: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Columns
                </label>
                <input
                  type="number"
                  value={seatingData.columns}
                  onChange={(e) => setSeatingData({ ...seatingData, columns: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="30"
                />
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Total Seats: {seatingData.rows * seatingData.columns}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <ReusableButton
                onClick={handleSaveSeatingLayout}
                variant="success"
                className="text-white font-medium"
              >
                Save Layout
              </ReusableButton>
              <ReusableButton
                onClick={() => setShowSeatingModal(false)}
                variant="secondary"
                className="text-white font-medium"
              >
                Cancel
              </ReusableButton>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal with ReusableButton white text */}
      {showSettingsModal && selectedHall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                ⚙️ Hall Settings - {selectedHall.name}
              </h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Multiplier
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settingsData.priceMultiplier}
                  onChange={(e) => setSettingsData({ ...settingsData, priceMultiplier: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amenities</label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settingsData.hasProjector}
                    onChange={(e) => setSettingsData({ ...settingsData, hasProjector: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Projector</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settingsData.hasSoundSystem}
                    onChange={(e) => setSettingsData({ ...settingsData, hasSoundSystem: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Sound System</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settingsData.hasAirConditioning}
                    onChange={(e) => setSettingsData({ ...settingsData, hasAirConditioning: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Air Conditioning</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accessibility Features
                </label>
                <textarea
                  value={settingsData.accessibilityFeatures}
                  onChange={(e) => setSettingsData({ ...settingsData, accessibilityFeatures: e.target.value })}
                  placeholder="e.g., Wheelchair access, Hearing assistance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <ReusableButton
                onClick={handleSaveSettings}
                variant="success"
                className="text-white font-medium"
              >
                Save Settings
              </ReusableButton>
              <ReusableButton
                onClick={() => setShowSettingsModal(false)}
                variant="secondary"
                className="text-white font-medium text-font"
              >
                Cancel
              </ReusableButton>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      <SuccessPopup
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default HallsManagement;