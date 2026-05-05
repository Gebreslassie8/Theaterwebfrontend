// src/components/ManageHallForm/UpdateHallModal.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus, Trash2, Layers, AlertCircle, Building, Layout } from 'lucide-react';
import * as Yup from 'yup';
import ReusableButton from '../Reusable/ReusableButton';
import { Hall, SeatType } from './types';

interface UpdateHallModalProps {
    hall: Hall;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const generateTypeId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Yup Validation Schema
const hallValidationSchema = Yup.object({
    name: Yup.string()
        .required('Hall name is required')
        .min(2, 'Hall name must be at least 2 characters')
        .max(50, 'Hall name cannot exceed 50 characters'),
    seatingLayout: Yup.string().required('Layout is required'),
    rows: Yup.number()
        .required('Number of rows is required')
        .min(1, 'Rows must be at least 1')
        .max(50, 'Rows cannot exceed 50'),
    columns: Yup.number()
        .required('Number of columns is required')
        .min(1, 'Columns must be at least 1')
        .max(50, 'Columns cannot exceed 50'),
    priceMultiplier: Yup.number()
        .required('Price multiplier is required')
        .min(0.5, 'Price multiplier must be at least 0.5')
        .max(5, 'Price multiplier cannot exceed 5'),
    seatTypes: Yup.array()
        .min(1, 'At least one seat type is required')
        .of(
            Yup.object({
                name: Yup.string().required('Seat type name is required'),
                count: Yup.number()
                    .required('Seat count is required')
                    .min(1, 'Seat count must be at least 1')
                    .max(1000, 'Seat count cannot exceed 1000')
            })
        )
});

const seatTypeSchema = Yup.object({
    name: Yup.string().required('Seat type name is required'),
    count: Yup.number().required('Seat count is required').min(1, 'Count must be at least 1')
});

const UpdateHallModal: React.FC<UpdateHallModalProps> = ({ hall, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        features: '',
        seatingLayout: '',
        rows: 0,
        columns: 0,
        priceMultiplier: 1,
        seatTypes: [] as SeatType[]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [seatTypeErrors, setSeatTypeErrors] = useState<Record<string, Record<string, string>>>({});

    useEffect(() => {
        setFormData({
            name: hall.name,
            features: hall.features.join(', '),
            seatingLayout: hall.seatingLayout,
            rows: hall.rows,
            columns: hall.columns,
            priceMultiplier: hall.priceMultiplier,
            seatTypes: hall.seatTypes.map(st => ({ ...st }))
        });
    }, [hall]);

    const addSeatType = () => {
        setFormData(prev => ({
            ...prev,
            seatTypes: [...prev.seatTypes, { id: generateTypeId(), name: '', count: 0 }]
        }));
    };

    const updateSeatType = async (id: string, field: keyof SeatType, value: string | number) => {
        const updatedSeatTypes = formData.seatTypes.map(st =>
            st.id === id ? { ...st, [field]: field === 'count' ? Math.max(0, Number(value)) : value } : st
        );
        setFormData(prev => ({ ...prev, seatTypes: updatedSeatTypes }));
        
        const seatType = updatedSeatTypes.find(st => st.id === id);
        if (seatType && touched[`seat_${id}`]) {
            try {
                await seatTypeSchema.validateAt(field, { [field]: seatType[field] });
                setSeatTypeErrors(prev => ({
                    ...prev,
                    [id]: { ...prev[id], [field]: '' }
                }));
            } catch (err: any) {
                setSeatTypeErrors(prev => ({
                    ...prev,
                    [id]: { ...prev[id], [field]: err.message }
                }));
            }
        }
    };

    const removeSeatType = (id: string) => {
        setFormData(prev => ({
            ...prev,
            seatTypes: prev.seatTypes.filter(st => st.id !== id)
        }));
    };

    const handleBlur = async (field: string, value: any) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        try {
            await hallValidationSchema.validateAt(field, { [field]: value });
            setErrors(prev => ({ ...prev, [field]: '' }));
        } catch (err: any) {
            setErrors(prev => ({ ...prev, [field]: err.message }));
        }
    };

    const handleSeatTypeBlur = async (id: string, field: string, value: any) => {
        setTouched(prev => ({ ...prev, [`seat_${id}`]: true }));
        try {
            await seatTypeSchema.validateAt(field, { [field]: value });
            setSeatTypeErrors(prev => ({
                ...prev,
                [id]: { ...prev[id], [field]: '' }
            }));
        } catch (err: any) {
            setSeatTypeErrors(prev => ({
                ...prev,
                [id]: { ...prev[id], [field]: err.message }
            }));
        }
    };

    const validateForm = async () => {
        try {
            await hallValidationSchema.validate(formData, { abortEarly: false });
            for (const seatType of formData.seatTypes) {
                await seatTypeSchema.validate(seatType);
            }
            setErrors({});
            setSeatTypeErrors({});
            return true;
        } catch (err: any) {
            const newErrors: Record<string, string> = {};
            const newSeatTypeErrors: Record<string, Record<string, string>> = {};
            
            err.inner.forEach((error: any) => {
                if (error.path === 'seatTypes') {
                    error.inner?.forEach((seatErr: any) => {
                        const match = seatErr.path.match(/seatTypes\[(\d+)\]\.(\w+)/);
                        if (match) {
                            const [_, index, field] = match;
                            const seatId = formData.seatTypes[parseInt(index)]?.id;
                            if (seatId) {
                                if (!newSeatTypeErrors[seatId]) newSeatTypeErrors[seatId] = {};
                                newSeatTypeErrors[seatId][field] = seatErr.message;
                            }
                        }
                    });
                } else {
                    newErrors[error.path] = error.message;
                }
            });
            
            setErrors(newErrors);
            setSeatTypeErrors(newSeatTypeErrors);
            return false;
        }
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (isValid) {
            const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);
            onSubmit({ ...formData, features: featuresArray, id: hall.id });
        }
    };

    const totalCapacity = formData.seatTypes.reduce((sum, st) => sum + st.count, 0);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r bg-deepTeal px-6 py-5 flex justify-between items-center text-white rounded-t-2xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Building className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Update Hall</h2>
                            <p className="text-white/80 text-sm">Edit hall information below</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="border-b pb-3">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Building className="h-5 w-5 text-teal-600" />
                            Basic Information
                        </h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hall Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            onBlur={() => handleBlur('name', formData.name)}
                            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                                errors.name && touched.name ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                            }`}
                            placeholder="e.g., Grand Hall" 
                        />
                        {errors.name && touched.name && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                        <input 
                            type="text" 
                            value={formData.features} 
                            onChange={e => setFormData({...formData, features: e.target.value})}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none hover:border-teal-300 transition"
                            placeholder="AC, Dolby Sound, VIP Seats" 
                        />
                    </div>

                    {/* Configuration */}
                    <div className="border-b pb-3 mt-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Layout className="h-5 w-5 text-teal-600" />
                            Hall Configuration
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Layout <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={formData.seatingLayout} 
                                onChange={e => setFormData({...formData, seatingLayout: e.target.value})}
                                onBlur={() => handleBlur('seatingLayout', formData.seatingLayout)}
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                                    errors.seatingLayout && touched.seatingLayout ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                }`}
                            >
                                <option>Standard</option>
                                <option>Compact</option>
                                <option>Premium</option>
                            </select>
                            {errors.seatingLayout && touched.seatingLayout && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.seatingLayout}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price Multiplier <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number" 
                                step="0.1" 
                                value={formData.priceMultiplier} 
                                onChange={e => setFormData({...formData, priceMultiplier: parseFloat(e.target.value)})}
                                onBlur={() => handleBlur('priceMultiplier', formData.priceMultiplier)}
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                                    errors.priceMultiplier && touched.priceMultiplier ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                }`}
                            />
                            {errors.priceMultiplier && touched.priceMultiplier && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.priceMultiplier}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rows <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number" 
                                value={formData.rows} 
                                onChange={e => setFormData({...formData, rows: parseInt(e.target.value)})}
                                onBlur={() => handleBlur('rows', formData.rows)}
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                                    errors.rows && touched.rows ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                }`}
                            />
                            {errors.rows && touched.rows && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.rows}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Columns <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number" 
                                value={formData.columns} 
                                onChange={e => setFormData({...formData, columns: parseInt(e.target.value)})}
                                onBlur={() => handleBlur('columns', formData.columns)}
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                                    errors.columns && touched.columns ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-teal-300'
                                }`}
                            />
                            {errors.columns && touched.columns && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.columns}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Seat Types */}
                    <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers className="h-5 w-5 text-teal-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Seat Types</h3>
                            <span className="text-xs text-gray-400">(Name & Count)</span>
                        </div>
                        
                        <div className="space-y-3">
                            {formData.seatTypes.map((st, idx) => (
                                <div key={st.id} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-medium text-gray-500">Seat Type #{idx + 1}</span>
                                        <button 
                                            onClick={() => removeSeatType(st.id)} 
                                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition text-red-600 hover:text-red-700"
                                            title="Remove seat type"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Seat Type Name *</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g., VIP, Premium, Regular" 
                                                value={st.name} 
                                                onChange={e => updateSeatType(st.id, 'name', e.target.value)}
                                                onBlur={() => handleSeatTypeBlur(st.id, 'name', st.name)}
                                                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                                                    seatTypeErrors[st.id]?.name && touched[`seat_${st.id}`] 
                                                        ? 'border-red-500 bg-red-50' 
                                                        : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                            />
                                            {seatTypeErrors[st.id]?.name && touched[`seat_${st.id}`] && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> {seatTypeErrors[st.id].name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Seat Count *</label>
                                            <input 
                                                type="number" 
                                                min="1"
                                                placeholder="Number of seats" 
                                                value={st.count || ''} 
                                                onChange={e => updateSeatType(st.id, 'count', parseInt(e.target.value))}
                                                onBlur={() => handleSeatTypeBlur(st.id, 'count', st.count)}
                                                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                                                    seatTypeErrors[st.id]?.count && touched[`seat_${st.id}`] 
                                                        ? 'border-red-500 bg-red-50' 
                                                        : 'border-gray-200 hover:border-teal-300'
                                                }`}
                                            />
                                            {seatTypeErrors[st.id]?.count && touched[`seat_${st.id}`] && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> {seatTypeErrors[st.id].count}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Add Type Button - Below the seat types list */}
                        <div className="mt-4">
                            <button
                                onClick={addSeatType}
                                className="w-full py-3 border-2 border-dashed border-teal-300 rounded-lg text-teal-600 hover:bg-teal-50 hover:border-teal-400 transition-all flex items-center justify-center gap-2 font-medium"
                            >
                                <Plus className="h-4 w-4" />
                                Add Seat Type
                            </button>
                        </div>
                        
                        {errors.seatTypes && touched.seatTypes && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" /> {errors.seatTypes}
                            </p>
                        )}
                        
                        {formData.seatTypes.length > 0 && (
                            <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-teal-700">Total Capacity</span>
                                    <span className="text-xl font-bold text-teal-600">{totalCapacity.toLocaleString()} seats</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t mt-4">
                        <ReusableButton 
                            variant="secondary" 
                            onClick={onCancel}
                            className="flex-1 py-2.5"
                        >
                            Cancel
                        </ReusableButton>
                        <ReusableButton 
                            variant="primary" 
                            onClick={handleSubmit}
                            icon={Save}
                            className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700"
                        >
                            Update Hall
                        </ReusableButton>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UpdateHallModal;