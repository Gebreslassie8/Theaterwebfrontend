// src/pages/Admin/users/UpdateUser.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, User, Mail, Phone, Shield, Briefcase, Save } from 'lucide-react';
import * as Yup from 'yup';
import ReusableForm from '../../../components/Reusable/ReusableForm';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import Colors from '../../../components/Reusable/Colors';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface UpdateUserProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (userData: any) => void;
}

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'Admin' | 'Manager' | 'User' | 'Theater Owner';
    status: 'Active' | 'Inactive' | 'Pending';
    joinDate: string;
    lastActive: string;
    bookings: number;
    totalSpent: number;
}

// Validation Schema
const ValidationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username cannot exceed 50 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number'),
    role: Yup.string()
        .required('Role is required'),
    status: Yup.string()
        .required('Status is required'),
    department: Yup.string(),
});

// Reusable Button Component
const ReusableFormButton: React.FC<{
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
    disabled?: boolean;
}> = ({ onClick, type = 'button', children, variant = 'primary', className = '', disabled = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getButtonStyle = () => {
        if (variant === 'secondary') {
            return {
                backgroundColor: isHovered ? Colors.lightGray : Colors.white,
                color: Colors.error,
                transition: 'all 0.3s ease',
                border: `2px solid ${Colors.error}`,
            };
        }
        if (variant === 'danger') {
            return {
                backgroundColor: isHovered ? Colors.error : Colors.red,
                color: Colors.white,
                transition: 'all 0.3s ease',
                border: 'none',
            };
        }
        return {
            backgroundColor: isHovered ? '#0ea5e9' : '#007590',
            color: Colors.white,
            transition: 'all 0.3s ease',
            border: 'none',
        };
    };

    const buttonStyle = getButtonStyle();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`h-[46px] text-base font-normal rounded-2xl flex justify-center items-center cursor-pointer mt-2 ${className}`}
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </button>
    );
};

const UpdateUser: React.FC<UpdateUserProps> = ({
    user,
    isOpen,
    onClose,
    onUpdate
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    // Initial values for the form
    const initialValues = {
        username: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role?.toLowerCase().replace(' ', '_') || 'user',
        status: user?.status || 'Active',
        department: '',
    };

    const formFields = [
        {
            name: 'username',
            type: 'text' as const,
            label: 'Username',
            placeholder: 'Enter username',
        },
        {
            name: 'email',
            type: 'email' as const,
            label: 'Email Address',
            placeholder: 'Enter email address',
        },
        {
            name: 'phone',
            type: 'text' as const,
            label: 'Phone Number',
            placeholder: 'Enter phone number',
        },
        {
            name: 'role',
            type: 'select' as const,
            label: 'Role',
            placeholder: 'Select role',
            options: [
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'theater_owner', label: 'Theater Owner' },
                { value: 'salesperson', label: 'Salesperson' },
                { value: 'scanner', label: 'Scanner' },
                { value: 'customer', label: 'Customer' },
            ],
        },
        {
            name: 'status',
            type: 'select' as const,
            label: 'Status',
            placeholder: 'Select status',
            options: [
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Pending', label: 'Pending' },
            ],
        },
        {
            name: 'department',
            type: 'text' as const,
            label: 'Department (Optional)',
            placeholder: 'Enter department name',
        },
    ];

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const updatedUser = {
            id: user?.id,
            name: values.username,
            email: values.email,
            phone: values.phone,
            role: values.role === 'admin' ? 'Admin' :
                values.role === 'manager' ? 'Manager' :
                    values.role === 'theater_owner' ? 'Theater Owner' : 'User',
            status: values.status,
            department: values.department,
        };

        onUpdate(updatedUser);
        setIsLoading(false);
        setSubmitting(false);

        setPopupMessage({
            title: 'User Updated!',
            message: `${values.username} has been updated successfully`,
            type: 'success'
        });
        setShowSuccessPopup(true);

        // Close modal after 1.5 seconds
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Update User</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-lg transition"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        <ReusableForm
                            id="update-user-form"
                            fields={formFields}
                            onSubmit={handleSubmit}
                            initialValues={initialValues}
                            validationSchema={ValidationSchema}
                            render={(formik) => (
                                <div className="flex gap-3 pt-4">
                                    <ReusableFormButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            formik.resetForm();
                                            onClose();
                                        }}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </ReusableFormButton>
                                    <ReusableFormButton
                                        type="submit"
                                        variant="primary"
                                        disabled={formik.isSubmitting || isLoading}
                                        className="flex-1"
                                    >
                                        {formik.isSubmitting || isLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Updating...
                                            </div>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Update User
                                            </>
                                        )}
                                    </ReusableFormButton>
                                </div>
                            )}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Success Popup */}
            <SuccessPopup
                isOpen={showSuccessPopup}
                onClose={() => setShowSuccessPopup(false)}
                type={popupMessage.type}
                title={popupMessage.title}
                message={popupMessage.message}
                duration={3000}
                position="top-right"
            />
        </>
    );
};

export default UpdateUser;