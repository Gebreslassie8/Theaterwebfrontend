// src/components/EventForm/Schedule/viewEventDetailsModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, Calendar, Ticket, Edit } from 'lucide-react';
import { Show } from './types';

interface ViewEventDetailsModalProps {
    event: Show | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (event: Show) => void;
}

const ViewEventDetailsModal: React.FC<ViewEventDetailsModalProps> = ({ event, isOpen, onClose, onEdit }) => {
    if (!isOpen || !event) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white sticky top-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">{event.name}</h2>
                            <p className="text-white/80 text-sm mt-1">{event.hall}</p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
                            <XCircle className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Organizer</p>
                            <p className="font-semibold">{event.organizer}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="font-semibold capitalize">{event.category || 'General'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Age Restriction</p>
                            <p className="font-semibold">{event.ageRestriction || 'All Ages'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Status</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                event.status === 'selling' ? 'bg-green-100 text-green-700' :
                                event.status === 'almost full' ? 'bg-yellow-100 text-yellow-700' :
                                event.status === 'sold out' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {typeof event.status === 'string' ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Upcoming'}
                            </span>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-teal-500" />
                            Schedule
                        </h3>
                        <div className="space-y-2">
                            {event.timeSlots?.map((slot, idx) => (
                                <div key={slot.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium">{slot.date}</p>
                                        <p className="text-xs text-gray-500">{slot.startTime} - {slot.endTime}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">Slot {idx + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seat Categories */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-teal-500" />
                            Seat Categories & Pricing
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-2 text-left">Type</th>
                                        <th className="p-2 text-left">Price</th>
                                        <th className="p-2 text-left">Capacity</th>
                                        <th className="p-2 text-left">Commission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {event.seatCategories?.map((cat) => (
                                        <tr key={cat.id} className="border-t">
                                            <td className="p-2">{cat.name}</td>
                                            <td className="p-2">{formatCurrency(cat.price)}</td>
                                            <td className="p-2">{cat.capacity}</td>
                                            <td className="p-2">{cat.commissionPercent}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Description */}
                    {event.description && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{event.description}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                            Close
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                onEdit?.(event);
                            }}
                            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Event
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ViewEventDetailsModal;