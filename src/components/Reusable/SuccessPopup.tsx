// src/components/Reusable/SuccessPopup.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Info,
    X,
    AlertTriangle
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface SuccessPopupProps {
    isOpen: boolean;
    onClose: () => void;
    type?: ToastType;
    title?: string;
    message?: string;
    duration?: number;
}

// Centered Popup Component
const SuccessPopup: React.FC<SuccessPopupProps> = ({
    isOpen,
    onClose,
    type = 'success',
    title = 'Success!',
    message = 'Operation completed successfully',
    duration = 3000,
}) => {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-16 w-16" />;
            case 'error':
                return <XCircle className="h-16 w-16" />;
            case 'warning':
                return <AlertTriangle className="h-16 w-16" />;
            case 'info':
                return <Info className="h-16 w-16" />;
            default:
                return <CheckCircle className="h-16 w-16" />;
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success':
                return 'text-green-500';
            case 'error':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-500';
            case 'info':
                return 'text-blue-500';
            default:
                return 'text-green-500';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'info':
                return 'border-blue-200 bg-blue-50';
            default:
                return 'border-green-200 bg-green-50';
        }
    };

    const getTitleColor = () => {
        switch (type) {
            case 'success':
                return 'text-green-800';
            case 'error':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            case 'info':
                return 'text-blue-800';
            default:
                return 'text-green-800';
        }
    };

    const getMessageColor = () => {
        switch (type) {
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            case 'warning':
                return 'text-yellow-600';
            case 'info':
                return 'text-blue-600';
            default:
                return 'text-green-600';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/30"
                        onClick={onClose}
                    />

                    {/* Popup Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                            duration: 0.3
                        }}
                        className={`relative w-full max-w-sm mx-4 overflow-hidden rounded-2xl border ${getBorderColor()} shadow-xl`}
                    >
                        {/* Content */}
                        <div className="p-8 text-center">
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
                                className="mb-4"
                            >
                                <div className={`${getIconColor()} mx-auto`}>
                                    {getIcon()}
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className={`text-xl font-bold ${getTitleColor()} mb-2`}
                            >
                                {title}
                            </motion.h3>

                            {/* Message */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`text-sm ${getMessageColor()} mb-6 leading-relaxed`}
                            >
                                {message}
                            </motion.p>

                            {/* Action Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                onClick={onClose}
                                className={`w-full px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                                        type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                                            type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                                'bg-blue-600 hover:bg-blue-700'
                                    } text-white`}
                            >
                                Got it
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessPopup;