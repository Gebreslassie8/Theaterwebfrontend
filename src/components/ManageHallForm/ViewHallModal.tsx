// src/components/ManageHallForm/ViewHallModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, Building, Users, DollarSign, CheckCircle, Clock, Layers, Edit, MapPin, Ruler, Calendar, Award, Sparkles } from 'lucide-react';
import ReusableButton from '../Reusable/ReusableButton';
import { Hall } from './types';

interface ViewHallModalProps {
    hall: Hall | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (hall: Hall) => void;
}

const ViewHallModal: React.FC<ViewHallModalProps> = ({ hall, isOpen, onClose, onEdit }) => {
    if (!isOpen || !hall) return null;

    const calculateTotalCapacity = (seatTypes: any[]) => {
        return seatTypes.reduce((sum, st) => sum + st.count, 0);
    };

    const getStatusConfig = (status: string) => {
        if (status === 'Active') {
            return { icon: CheckCircle, color: 'bg-green-100 text-green-700', bgGradient: 'from-green-50 to-emerald-50', borderColor: 'border-green-200', iconColor: 'text-green-600' };
        }
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-700', bgGradient: 'from-yellow-50 to-orange-50', borderColor: 'border-yellow-200', iconColor: 'text-yellow-600' };
    };

    const statusConfig = getStatusConfig(hall.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header with Gradient */}
                <div className="sticky top-0 bg-gradient-to-r bg-deepTeal px-6 py-5 text-white">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Building className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{hall.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-white/80 text-sm">{hall.seatingLayout} Layout</span>
                                    <span className="text-white/40">•</span>
                                    <span className="flex items-center gap-1 text-white/80 text-sm">
                                        <MapPin className="h-3 w-3" />
                                        {hall.rows} × {hall.columns} seats
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Status Card */}
                        <div className={`bg-gradient-to-br ${statusConfig.bgGradient} rounded-xl p-4 border ${statusConfig.borderColor}`}>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-gray-500">Current Status</p>
                                <StatusIcon className={`h-4 w-4 ${statusConfig.iconColor}`} />
                            </div>
                            <p className={`text-xl font-bold ${statusConfig.color}`}>{hall.status}</p>
                        </div>

                        {/* Capacity Card */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-gray-500">Total Capacity</p>
                                <Users className="h-4 w-4 text-purple-500" />
                            </div>
                            <p className="text-xl font-bold text-purple-700">{calculateTotalCapacity(hall.seatTypes).toLocaleString()} <span className="text-sm font-normal">seats</span></p>
                        </div>

                        {/* Price Multiplier Card */}
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-gray-500">Price Multiplier</p>
                                <DollarSign className="h-4 w-4 text-amber-500" />
                            </div>
                            <p className="text-xl font-bold text-amber-700">{hall.priceMultiplier}x</p>
                        </div>

                        {/* Dimensions Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-gray-500">Dimensions</p>
                                <Ruler className="h-4 w-4 text-blue-500" />
                            </div>
                            <p className="text-xl font-bold text-blue-700">{hall.rows} × {hall.columns}</p>
                            <p className="text-xs text-blue-600 mt-1">{hall.rows * hall.columns} total positions</p>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Award className="h-5 w-5 text-teal-600" />
                            Features & Amenities
                        </h3>
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                            {hall.features.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {hall.features.map((feature, idx) => (
                                        <span 
                                            key={idx} 
                                            className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-200 flex items-center gap-2"
                                        >
                                            <Sparkles className="h-3 w-3 text-teal-500" />
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-4">No features listed</p>
                            )}
                        </div>
                    </div>

                    {/* Seat Types Breakdown */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-teal-600" />
                            Seat Types Breakdown
                        </h3>
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border-b border-gray-200">
                                <div className="text-sm font-semibold text-gray-600">Seat Type</div>
                                <div className="text-sm font-semibold text-gray-600 text-right">Seat Count</div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {hall.seatTypes.map((st, idx) => (
                                    <div key={st.id} className="grid grid-cols-2 gap-4 p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                            <span className="font-medium text-gray-800">{st.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-gray-700 font-semibold">{st.count.toLocaleString()}</span>
                                            <span className="text-gray-400 text-sm ml-1">seats</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Total Row */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-teal-50 border-t border-teal-200">
                                <div className="font-semibold text-teal-800">Total Capacity</div>
                                <div className="text-right font-bold text-teal-800">{calculateTotalCapacity(hall.seatTypes).toLocaleString()} seats</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 p-5 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                    <ReusableButton 
                        onClick={onClose} 
                        variant="secondary" 
                        className="px-6 py-2.5"
                    >
                        Close
                    </ReusableButton>
                    {onEdit && (
                        <ReusableButton 
                            onClick={() => { onClose(); onEdit(hall); }} 
                            variant="primary" 
                            icon={Edit}
                            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700"
                        >
                            Edit Hall
                        </ReusableButton>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ViewHallModal;