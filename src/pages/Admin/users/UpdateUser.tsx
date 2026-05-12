// src/pages/Admin/users/UpdateUser.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Phone, Shield, Save, Loader2, AlertCircle } from 'lucide-react';
import * as Yup from 'yup';
import ReusableForm from '../../../components/Reusable/ReusableForm';
import Colors from '../../../components/Reusable/Colors';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import supabase from '@/config/supabaseClient';

// Types
interface UpdateUserProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (userData: any) => void;
    onUserUpdated?: () => void;
}

interface User {
    id: string;
    username: string;
    full_name: string;
    email: string;
    phone: string;
    password?: string;
    role: 'super_admin' | 'theater_owner' | 'theater_manager' | 'sales_person' | 'qr_scanner' | 'customer';
    status: 'active' | 'inactive' | 'pending';
    created_at?: string;
}

// Validation Schema - No password field
const ValidationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username cannot exceed 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
    full_name: Yup.string()
        .required('Full name is required')
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name cannot exceed 100 characters'),
    
    email: Yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number (10-15 digits)'),
    
    role: Yup.string()
        .required('Role is required')
        .oneOf(['super_admin', 'theater_owner', 'theater_manager', 'sales_person', 'qr_scanner', 'customer'], 'Invalid role selected'),
    
    status: Yup.string()
        .required('Status is required')
        .oneOf(['active', 'inactive', 'pending'], 'Invalid status selected')
});

// Reusable Button Component
const ReusableFormButton: React.FC<{
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
    disabled?: boolean;
    loading?: boolean;
}> = ({ onClick, type = 'button', children, variant = 'primary', className = '', disabled = false, loading = false }) => {
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
            disabled={disabled || loading}
            className={`h-[46px] text-base font-normal rounded-2xl flex justify-center items-center cursor-pointer mt-2 ${className}`}
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

const UpdateUser: React.FC<UpdateUserProps> = ({
    user,
    isOpen,
    onClose,
    onUpdate,
    onUserUpdated
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Initial values for the form - No password field
    const initialValues = {
        username: user?.username || '',
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || 'customer',
        status: user?.status || 'active'
    };

    const formFields = [
        {
            name: 'username',
            type: 'text' as const,
            label: 'Username',
            placeholder: 'Enter username',
            required: true,
            icon: <User className="h-4 w-4" />
        },
        {
            name: 'full_name',
            type: 'text' as const,
            label: 'Full Name',
            placeholder: 'Enter full name',
            required: true,
            icon: <User className="h-4 w-4" />
        },
        {
            name: 'email',
            type: 'email' as const,
            label: 'Email Address',
            placeholder: 'Enter email address',
            required: true,
            icon: <Mail className="h-4 w-4" />
        },
        {
            name: 'phone',
            type: 'text' as const,
            label: 'Phone Number',
            placeholder: 'Enter phone number',
            required: true,
            icon: <Phone className="h-4 w-4" />
        },
        {
            name: 'role',
            type: 'select' as const,
            label: 'Role',
            placeholder: 'Select role',
            required: true,
            options: [
                { value: 'super_admin', label: 'Super Admin' },
                { value: 'theater_owner', label: 'Theater Owner' },
                { value: 'theater_manager', label: 'Theater Manager' },
                { value: 'sales_person', label: 'Sales Person' },
                { value: 'qr_scanner', label: 'QR Scanner' },
                { value: 'customer', label: 'Customer' }
            ]
        },
        {
            name: 'status',
            type: 'select' as const,
            label: 'Status',
            placeholder: 'Select status',
            required: true,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' }
            ]
        }
    ];

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        if (!user?.id) {
            setPopupMessage({
                title: 'Error',
                message: 'User ID is missing',
                type: 'error'
            });
            setShowSuccessPopup(true);
            return;
        }

        setIsLoading(true);

        try {
            // Prepare update data - only essential fields, no password
            const updateData: any = {
                username: values.username,
                full_name: values.full_name,
                email: values.email,
                phone: values.phone,
                role: values.role,
                status: values.status,
                updated_at: new Date().toISOString()
            };

            // Update user in Supabase
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', user.id)
                .select()
                .single();

            if (updateError) {
                console.error('Update error:', updateError);
                throw new Error(updateError.message);
            }

            // If role is theater_owner, update owners table
            if (values.role === 'theater_owner') {
                const { error: ownerError } = await supabase
                    .from('owners')
                    .upsert({
                        user_id: user.id,
                        business_name: values.full_name,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });

                if (ownerError) console.error('Owner update error:', ownerError);
            }

            // If role is customer, update customers table
            if (values.role === 'customer') {
                const { error: customerError } = await supabase
                    .from('customers')
                    .upsert({
                        user_id: user.id,
                        full_name: values.full_name,
                        email: values.email,
                        phone: values.phone,
                        is_active: values.status === 'active',
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });

                if (customerError) console.error('Customer update error:', customerError);
            }

            // Update localStorage/sessionStorage if this is the current user
            const storedUser = JSON.parse(
                localStorage.getItem('user') || sessionStorage.getItem('user') || 'null'
            );

            if (storedUser && storedUser.id === user.id) {
                const updatedStoredUser = {
                    ...storedUser,
                    name: values.full_name,
                    full_name: values.full_name,
                    email: values.email,
                    phone: values.phone,
                    username: values.username,
                    role: values.role
                };

                if (localStorage.getItem('user')) {
                    localStorage.setItem('user', JSON.stringify(updatedStoredUser));
                }
                if (sessionStorage.getItem('user')) {
                    sessionStorage.setItem('user', JSON.stringify(updatedStoredUser));
                }
            }

            // Call parent update callback
            onUpdate(updatedUser);
            if (onUserUpdated) onUserUpdated();

            setPopupMessage({
                title: 'User Updated!',
                message: `${values.full_name || values.username} has been updated successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);

            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error: any) {
            console.error('Error updating user:', error);
            setPopupMessage({
                title: 'Error',
                message: error.message || 'Failed to update user. Please try again.',
                type: 'error'
            });
            setShowSuccessPopup(true);
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
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

                    {/* Form - No info alert, no password field */}
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
                                        loading={formik.isSubmitting || isLoading}
                                        className="flex-1"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Update User
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