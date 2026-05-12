// src/pages/Admin/settings/SystemSettings.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Yup from 'yup';
import {
    Settings, Calendar, Percent,
    Plus, Trash2, Edit, X, Star,
    LayoutGrid, Loader2, FileText, Save, AlertCircle
} from 'lucide-react';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import supabase  from '../../../config/supabaseClient';

// Types
interface CommissionAgreement {
    id: string;
    commission_rate: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

interface PeriodicRental {
    id: string;
    name: string;
    duration_months: number;
    rental_fee: number;
    description: string;
    is_active: boolean;
    popular: boolean;
    created_at?: string;
    updated_at?: string;
}

type TabType = 'commission' | 'rental';

// Validation schemas
const commissionValidationSchema = Yup.object({
    commission_rate: Yup.number()
        .min(0, 'Commission rate cannot be less than 0%')
        .max(100, 'Commission rate cannot exceed 100%')
        .required('Commission rate is required')
});

const rentalValidationSchema = Yup.object({
    name: Yup.string()
        .min(3, 'Agreement name must be at least 3 characters')
        .max(100, 'Agreement name cannot exceed 100 characters')
        .required('Agreement name is required'),
    duration_months: Yup.number()
        .min(1, 'Duration must be at least 1 month')
        .max(60, 'Duration cannot exceed 60 months')
        .required('Duration is required'),
    rental_fee: Yup.number()
        .min(0, 'Rental fee cannot be negative')
        .required('Rental fee is required'),
    description: Yup.string()
        .max(500, 'Description cannot exceed 500 characters')
});

const SystemSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('commission');
    const [commissionAgreement, setCommissionAgreement] = useState<CommissionAgreement | null>(null);
    const [periodicRentals, setPeriodicRentals] = useState<PeriodicRental[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [editingRental, setEditingRental] = useState<PeriodicRental | null>(null);
    const [showRentalModal, setShowRentalModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'rental'; id: string } | null>(null);
    
    // Validation errors state
    const [commissionErrors, setCommissionErrors] = useState<{ commission_rate?: string }>({});
    const [rentalErrors, setRentalErrors] = useState<{ name?: string; duration_months?: string; rental_fee?: string; description?: string }>({});

    const formatCurrency = (amount: number) => `ETB ${amount.toLocaleString()}`;

    // Fetch data from Supabase
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsFetching(true);
        try {
            // First, check if table exists and get commission data
            const { data: commissionData, error: commissionError } = await supabase
                .from('commission_agreements')
                .select('*')
                .maybeSingle();

            if (commissionError) {
                console.error('Error fetching commission:', commissionError);
                // If table doesn't exist or error, set default data
                setCommissionAgreement({
                    id: 'temp',
                    commission_rate: 8,
                    is_active: true
                });
            } else if (commissionData) {
                setCommissionAgreement(commissionData);
            } else {
                // No data found, create default
                setCommissionAgreement({
                    id: 'temp',
                    commission_rate: 8,
                    is_active: true
                });
            }

            // Fetch periodic rentals
            const { data: rentalsData, error: rentalsError } = await supabase
                .from('periodic_rentals')
                .select('*')
                .order('rental_fee', { ascending: true });

            if (rentalsError) {
                console.error('Error fetching rentals:', rentalsError);
                // Set default rentals if error
                setPeriodicRentals([
                    {
                        id: '1',
                        name: 'Monthly Rental',
                        duration_months: 1,
                        rental_fee: 6000,
                        description: 'Month-to-month rental agreement for theater space',
                        is_active: true,
                        popular: false
                    },
                    {
                        id: '2',
                        name: 'Quarterly Rental',
                        duration_months: 3,
                        rental_fee: 8000,
                        description: '3-month rental agreement for theater space',
                        is_active: true,
                        popular: true
                    },
                    {
                        id: '3',
                        name: 'Yearly Rental',
                        duration_months: 12,
                        rental_fee: 6000,
                        description: 'Annual rental agreement for theater space',
                        is_active: true,
                        popular: false
                    }
                ]);
            } else if (rentalsData && rentalsData.length > 0) {
                setPeriodicRentals(rentalsData);
            } else {
                // No data found, set default rentals
                setPeriodicRentals([
                    {
                        id: '1',
                        name: 'Monthly Rental',
                        duration_months: 1,
                        rental_fee: 6000,
                        description: 'Month-to-month rental agreement for theater space',
                        is_active: true,
                        popular: false
                    },
                    {
                        id: '2',
                        name: 'Quarterly Rental',
                        duration_months: 3,
                        rental_fee: 8000,
                        description: '3-month rental agreement for theater space',
                        is_active: true,
                        popular: true
                    },
                    {
                        id: '3',
                        name: 'Yearly Rental',
                        duration_months: 12,
                        rental_fee: 6000,
                        description: 'Annual rental agreement for theater space',
                        is_active: true,
                        popular: false
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Set default data on error
            setCommissionAgreement({
                id: 'temp',
                commission_rate: 8,
                is_active: true
            });
            setPeriodicRentals([
                {
                    id: '1',
                    name: 'Monthly Rental',
                    duration_months: 1,
                    rental_fee: 6000,
                    description: 'Month-to-month rental agreement for theater space',
                    is_active: true,
                    popular: false
                },
                {
                    id: '2',
                    name: 'Quarterly Rental',
                    duration_months: 3,
                    rental_fee: 8000,
                    description: '3-month rental agreement for theater space',
                    is_active: true,
                    popular: true
                },
                {
                    id: '3',
                    name: 'Yearly Rental',
                    duration_months: 12,
                    rental_fee: 6000,
                    description: 'Annual rental agreement for theater space',
                    is_active: true,
                    popular: false
                }
            ]);
        } finally {
            setIsFetching(false);
        }
    };

    // Validate commission form
    const validateCommissionForm = async () => {
        try {
            await commissionValidationSchema.validate(
                { commission_rate: commissionAgreement?.commission_rate },
                { abortEarly: false }
            );
            setCommissionErrors({});
            return true;
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors: { commission_rate?: string } = {};
                error.inner.forEach(err => {
                    if (err.path === 'commission_rate') {
                        errors.commission_rate = err.message;
                    }
                });
                setCommissionErrors(errors);
            }
            return false;
        }
    };

    // Save commission agreement with button click
    const handleSaveCommission = async () => {
        const isValid = await validateCommissionForm();
        if (!isValid) return;

        setIsSaving(true);
        try {
            // Check if we have a real record or temp
            if (commissionAgreement?.id && commissionAgreement.id !== 'temp') {
                // Update existing
                const { error } = await supabase
                    .from('commission_agreements')
                    .update({
                        commission_rate: commissionAgreement.commission_rate,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', commissionAgreement.id);

                if (error) throw error;
            } else {
                // Insert new
                const { data, error } = await supabase
                    .from('commission_agreements')
                    .insert({
                        commission_rate: commissionAgreement?.commission_rate || 8,
                        is_active: true
                    })
                    .select()
                    .single();

                if (error) throw error;
                
                if (data) {
                    setCommissionAgreement(data);
                }
            }
            
            setPopupMessage({
                title: 'Commission Updated',
                message: `Commission rate has been updated to ${commissionAgreement?.commission_rate}%`,
                type: 'success'
            });
            setShowSuccessPopup(true);
            
            // Refresh data
            await fetchData();
        } catch (error: any) {
            console.error('Error saving commission:', error);
            setPopupMessage({
                title: 'Save Failed',
                message: error.message || 'Failed to save commission rate. Please check your permissions.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsSaving(false);
        }
    };

    // Validate rental form
    const validateRentalForm = async (formData: any) => {
        try {
            await rentalValidationSchema.validate(formData, { abortEarly: false });
            setRentalErrors({});
            return true;
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors: any = {};
                error.inner.forEach(err => {
                    if (err.path) {
                        errors[err.path] = err.message;
                    }
                });
                setRentalErrors(errors);
            }
            return false;
        }
    };

    // Periodic Rental CRUD with validation
    const handleAddRental = async (rental: Omit<PeriodicRental, 'id' | 'created_at' | 'updated_at'>) => {
        const isValid = await validateRentalForm(rental);
        if (!isValid) return;

        setIsSaving(true);
        try {
            const { data, error } = await supabase
                .from('periodic_rentals')
                .insert({
                    name: rental.name,
                    duration_months: rental.duration_months,
                    rental_fee: rental.rental_fee,
                    description: rental.description,
                    is_active: rental.is_active,
                    popular: rental.popular
                })
                .select()
                .single();

            if (error) throw error;
            
            setPeriodicRentals([...periodicRentals, data]);
            setShowRentalModal(false);
            setRentalErrors({});
            setPopupMessage({
                title: 'Rental Plan Added',
                message: `${rental.name} rental plan has been added successfully.`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        } catch (error: any) {
            console.error('Error adding rental:', error);
            setPopupMessage({
                title: 'Add Failed',
                message: error.message || 'Failed to add rental plan.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateRental = async (rental: PeriodicRental) => {
        const isValid = await validateRentalForm(rental);
        if (!isValid) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('periodic_rentals')
                .update({
                    name: rental.name,
                    duration_months: rental.duration_months,
                    rental_fee: rental.rental_fee,
                    description: rental.description,
                    is_active: rental.is_active,
                    popular: rental.popular,
                    updated_at: new Date().toISOString()
                })
                .eq('id', rental.id);

            if (error) throw error;
            
            setPeriodicRentals(periodicRentals.map(r => r.id === rental.id ? rental : r));
            setEditingRental(null);
            setShowRentalModal(false);
            setRentalErrors({});
            setPopupMessage({
                title: 'Rental Plan Updated',
                message: `${rental.name} rental plan has been updated successfully.`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        } catch (error: any) {
            console.error('Error updating rental:', error);
            setPopupMessage({
                title: 'Update Failed',
                message: error.message || 'Failed to update rental plan.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteRental = async (id: string) => {
        const rentalToDelete = periodicRentals.find(r => r.id === id);
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('periodic_rentals')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            setPeriodicRentals(periodicRentals.filter(r => r.id !== id));
            setShowDeleteConfirm(null);
            setPopupMessage({
                title: 'Rental Plan Deleted',
                message: `${rentalToDelete?.name} has been removed successfully.`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        } catch (error: any) {
            console.error('Error deleting rental:', error);
            setPopupMessage({
                title: 'Delete Failed',
                message: error.message || 'Failed to delete rental plan.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsSaving(false);
        }
    };

    // Rental Modal Component (without framer-motion)
    const RentalModal = () => {
        const [formData, setFormData] = useState<Partial<PeriodicRental>>(
            editingRental || {
                name: '',
                duration_months: 1,
                rental_fee: 6000,
                description: '',
                is_active: true,
                popular: false
            }
        );

        const handleFieldChange = (field: string, value: any) => {
            setFormData({ ...formData, [field]: value });
            // Clear error for this field when user starts typing
            if (rentalErrors[field as keyof typeof rentalErrors]) {
                setRentalErrors({ ...rentalErrors, [field]: undefined });
            }
        };

        const handleSubmit = async () => {
            if (editingRental) {
                await handleUpdateRental({ ...editingRental, ...formData } as PeriodicRental);
            } else {
                await handleAddRental(formData as Omit<PeriodicRental, 'id' | 'created_at' | 'updated_at'>);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
                    <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-white" />
                                <h2 className="text-xl font-bold text-white">
                                    {editingRental ? 'Edit Rental Agreement' : 'Add Rental Agreement'}
                                </h2>
                            </div>
                            <button onClick={() => { setShowRentalModal(false); setEditingRental(null); setRentalErrors({}); }} className="p-1 hover:bg-white/20 rounded-lg">
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Agreement Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                                    rentalErrors.name ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., Monthly Rental, Quarterly Rental, Yearly Rental"
                            />
                            {rentalErrors.name && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {rentalErrors.name}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (Months) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.duration_months}
                                onChange={(e) => handleFieldChange('duration_months', parseInt(e.target.value))}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                                    rentalErrors.duration_months ? 'border-red-500' : 'border-gray-200'
                                }`}
                                min="1"
                            />
                            {rentalErrors.duration_months && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {rentalErrors.duration_months}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rental Fee (ETB) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.rental_fee}
                                onChange={(e) => handleFieldChange('rental_fee', parseFloat(e.target.value))}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                                    rentalErrors.rental_fee ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {rentalErrors.rental_fee && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {rentalErrors.rental_fee}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                rows={2}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 resize-none ${
                                    rentalErrors.description ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="Describe the rental agreement terms"
                            />
                            {rentalErrors.description && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {rentalErrors.description}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => handleFieldChange('is_active', e.target.checked)}
                                    className="w-4 h-4 text-teal-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Active Agreement</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.popular}
                                    onChange={(e) => handleFieldChange('popular', e.target.checked)}
                                    className="w-4 h-4 text-yellow-600 rounded"
                                />
                                <span className="text-sm text-gray-700">Mark as Popular</span>
                            </label>
                        </div>
                    </div>

                    <div className="border-t px-6 py-4 flex justify-end gap-3">
                        <button onClick={() => { setShowRentalModal(false); setEditingRental(null); setRentalErrors({}); }} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Save Agreement</button>
                    </div>
                </div>
            </div>
        );
    };

    // Delete Confirm Modal
    const DeleteConfirmModal = () => {
        if (!showDeleteConfirm) return null;
        
        const rentalToDelete = periodicRentals.find(r => r.id === showDeleteConfirm.id);
        
        const handleConfirm = () => {
            handleDeleteRental(showDeleteConfirm.id);
        };

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Confirm Delete Agreement</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete <strong>{rentalToDelete?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </div>
        );
    };

    // Table columns for periodic rentals
    const rentalColumns = [
        {
            Header: 'Agreement Name',
            accessor: 'name',
            sortable: true,
            Cell: (row: PeriodicRental) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{row.name}</span>
                    {row.popular && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3" /> Popular
                        </span>
                    )}
                </div>
            )
        },
        {
            Header: 'Duration',
            accessor: 'duration_months',
            sortable: true,
            Cell: (row: PeriodicRental) => (
                <span className="text-gray-700">{row.duration_months} Month{row.duration_months > 1 ? 's' : ''}</span>
            )
        },
        {
            Header: 'Rental Fee',
            accessor: 'rental_fee',
            sortable: true,
            Cell: (row: PeriodicRental) => (
                <span className="font-semibold text-teal-600">{formatCurrency(row.rental_fee)}</span>
            )
        },
        {
            Header: 'Description',
            accessor: 'description',
            sortable: false,
            Cell: (row: PeriodicRental) => (
                <span className="text-gray-500 text-sm">{row.description}</span>
            )
        },
        {
            Header: 'Status',
            accessor: 'is_active',
            sortable: true,
            Cell: (row: PeriodicRental) => (
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            Header: 'Actions',
            accessor: 'id',
            sortable: false,
            Cell: (row: PeriodicRental) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setEditingRental(row); setShowRentalModal(true); }}
                        className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-all duration-200"
                        title="Edit"
                    >
                        <Edit className="h-4 w-4 text-teal-600" />
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm({ type: 'rental', id: row.id })}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                </div>
            )
        }
    ];

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                            <Settings className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                            <p className="text-sm text-gray-500 mt-1">Configure commission agreements and rental agreements</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
                    <button
                        onClick={() => setActiveTab('commission')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === 'commission' ? 'bg-white text-teal-600 shadow-md' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Percent className="h-4 w-4" />
                        Commission Agreement
                    </button>
                    <button
                        onClick={() => setActiveTab('rental')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === 'rental' ? 'bg-white text-teal-600 shadow-md' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Calendar className="h-4 w-4" />
                        Periodic Rental Agreement
                    </button>
                </div>

                {/* Commission Agreement Tab with Submit Button */}
                {activeTab === 'commission' && commissionAgreement && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Commission Agreement</h3>
                            <p className="text-sm text-gray-500 mt-1">Configure global commission rate for all ticket sales</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-2xl">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Commission Rate (%) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            value={commissionAgreement.commission_rate}
                                            onChange={(e) => {
                                                const newValue = parseFloat(e.target.value);
                                                setCommissionAgreement({ ...commissionAgreement, commission_rate: newValue });
                                                // Clear error when user types
                                                if (commissionErrors.commission_rate) {
                                                    setCommissionErrors({});
                                                }
                                            }}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                                commissionErrors.commission_rate ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                            step="0.5"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                    {commissionErrors.commission_rate && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> {commissionErrors.commission_rate}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">Percentage charged per ticket sold</p>
                                </div>

                                {/* Submit Button for Commission */}
                                <div className="flex justify-end pt-4 border-t">
                                    <button
                                        onClick={handleSaveCommission}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Update Commission Rate</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Periodic Rental Agreement Tab */}
                {activeTab === 'rental' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex justify-end items-center mb-4">
                            <ReusableButton
                                onClick={() => { setEditingRental(null); setShowRentalModal(true); }}
                                icon="Plus"
                                label="Add Rental Agreement"
                                className="px-5 py-2.5 text-sm bg-teal-600 hover:bg-teal-700 text-white"
                            />
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <ReusableTable
                                columns={rentalColumns}
                                data={periodicRentals}
                                icon={LayoutGrid}
                                showSearch={false}
                                showExport={false}
                                showPrint={false}
                            />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Modals */}
            {showRentalModal && <RentalModal />}
            {showDeleteConfirm && <DeleteConfirmModal />}

            {/* Success Popup */}
            <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type={popupMessage.type} title={popupMessage.title} message={popupMessage.message} duration={3000} position="top-right" />
        </div>
    );
};

export default SystemSettings;