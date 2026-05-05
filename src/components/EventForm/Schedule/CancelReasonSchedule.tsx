// src/components/EventForm/Schedule/CancelReasonModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ban, AlertCircle } from 'lucide-react';
import { Show } from './types';

interface CancelReasonModalProps {
    isOpen: boolean;
    event: Show | null;
    onConfirm: (reason: string) => void;
    onClose: () => void;
}

const CancelReasonModal: React.FC<CancelReasonModalProps> = ({ isOpen, event, onConfirm, onClose }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !event) return null;

    const handleConfirm = () => {
        if (!reason.trim()) {
            setError('Please provide a reason for cancellation');
            return;
        }
        onConfirm(reason);
        setReason('');
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Ban className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Cancel Event</h3>
                </div>
                <p className="text-gray-600 mb-4">
                    Are you sure you want to cancel <strong>{event.name}</strong>?
                </p>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation *</label>
                    <textarea
                        rows={3}
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setError('');
                        }}
                        placeholder="Please provide a reason for cancelling this event..."
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {error && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {error}
                        </p>
                    )}
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={!reason.trim()} 
                        className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                    >
                        Confirm Cancellation
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default CancelReasonModal;