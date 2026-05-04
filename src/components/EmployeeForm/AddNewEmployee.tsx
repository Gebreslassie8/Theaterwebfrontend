// src/components/EmployeeForm/AddNewEmployee.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, UserPlus, User, Mail, Phone, Briefcase, Activity, Eye, EyeOff, Shield, Coins } from 'lucide-react';
import * as Yup from 'yup';
import ReusableForm from '../Reusable/ReusableForm';
import ReusableButton from '../Reusable/ReusableButton';

const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password cannot exceed 20 characters'),
    assignedRole: Yup.string().required('Role is required'),
    status: Yup.string().required('Status is required'),
    salary: Yup.number()
        .required('Salary is required')
        .min(0, 'Salary cannot be negative')
        .typeError('Salary must be a number'),
});

const getFields = (roles: any[], showPassword: boolean, setShowPassword: any) => [
    { 
        name: 'name', 
        type: 'text', 
        label: 'Full Name', 
        placeholder: 'Enter full name', 
        required: true, 
        icon: <User size={16} />, 
        colSpan: 1 
    },
    { 
        name: 'username', 
        type: 'text', 
        label: 'Username', 
        placeholder: 'Enter username', 
        required: true, 
        icon: <User size={16} />, 
        colSpan: 1 
    },
    { 
        name: 'email', 
        type: 'email', 
        label: 'Email Address', 
        placeholder: 'Enter email address', 
        required: true, 
        icon: <Mail size={16} />, 
        colSpan: 1 
    },
    { 
        name: 'phone', 
        type: 'tel', 
        label: 'Phone Number', 
        placeholder: 'Enter phone number', 
        required: true, 
        icon: <Phone size={16} />, 
        colSpan: 1 
    },
    { 
        name: 'password', 
        type: showPassword ? 'text' : 'password', 
        label: 'Password', 
        placeholder: 'Enter password', 
        required: true, 
        icon: <Shield size={16} />,
        rightIcon: showPassword ? <EyeOff size={18} /> : <Eye size={18} />,
        onRightIconClick: () => setShowPassword(!showPassword),
        colSpan: 1 
    },
    { 
        name: 'assignedRole', 
        type: 'select', 
        label: 'Role', 
        required: true, 
        options: roles.map(r => ({ value: r.id, label: r.label })), 
        icon: <Briefcase size={16} />, 
        colSpan: 1 
    },
    { 
        name: 'salary', 
        type: 'number', 
        label: 'Salary (ETB)', 
        placeholder: 'Enter salary in Birr', 
        required: true,
        icon: <Coins size={16} />, 
        colSpan: 1 
    },
    { 
        name: 'status', 
        type: 'select', 
        label: 'Status', 
        required: true, 
        options: [
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
            { value: 'On Leave', label: 'On Leave' }
        ], 
        icon: <Activity size={16} />, 
        colSpan: 1 
    }
];

const AddNewEmployee: React.FC<any> = ({ isOpen, onClose, onSubmit, roles }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [formValues, setFormValues] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        assignedRole: '',
        status: 'Active',
        salary: ''
    });

    // Reset all values when modal opens
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset all form values
            setFormValues({
                name: '',
                username: '',
                email: '',
                phone: '',
                password: '',
                assignedRole: '',
                status: 'Active',
                salary: ''
            });
            setShowPassword(false);
            setResetTrigger(prev => prev + 1);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
        try {
            // Filter out any empty values
            const submitData = {
                name: values.name,
                username: values.username,
                email: values.email,
                phone: values.phone,
                password: values.password,
                assignedRole: values.assignedRole,
                status: values.status,
                salary: values.salary
            };
            await onSubmit(submitData);
            resetForm();
            // Reset local state
            setFormValues({
                name: '',
                username: '',
                email: '',
                phone: '',
                password: '',
                assignedRole: '',
                status: 'Active',
                salary: ''
            });
            onClose();
        } catch (error) {
            console.error('Error saving employee:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    // ALL FIELDS ARE EMPTY STRINGS
    const initialFormValues = {
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        assignedRole: '',
        status: 'Active',
        salary: ''
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCancel}>
            <motion.div
                key={resetTrigger}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg">
                            <UserPlus className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Fill in the employee information below</p>
                        </div>
                    </div>
                    <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <ReusableForm
                        key={`form-${resetTrigger}`}
                        id={`add-employee-form-${resetTrigger}`}
                        fields={getFields(roles, showPassword, setShowPassword)}
                        onSubmit={handleSubmit}
                        initialValues={initialFormValues}
                        validationSchema={validationSchema}
                        columns={2}
                        render={(formik: any) => (
                            <>
                                {formik.values.password && formik.values.password.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
                                    >
                                        <p className="text-xs font-medium text-blue-800 mb-2">Password Requirements:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${formik.values.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span className={`text-xs ${formik.values.password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                                                    At least 6 characters
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${/(?=.*[a-z])/.test(formik.values.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span className={`text-xs ${/(?=.*[a-z])/.test(formik.values.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                                    Lowercase letter
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${/(?=.*[A-Z])/.test(formik.values.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span className={`text-xs ${/(?=.*[A-Z])/.test(formik.values.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                                    Uppercase letter
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${/(?=.*\d)/.test(formik.values.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span className={`text-xs ${/(?=.*\d)/.test(formik.values.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                                    Number
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200 mt-4 -mb-2">
                                    <div className="flex gap-3">
                                        <ReusableButton 
                                            type="button" 
                                            variant="secondary" 
                                            onClick={handleCancel} 
                                            className="flex-1 py-2.5"
                                        >
                                            Cancel
                                        </ReusableButton>
                                        <ReusableButton 
                                            type="submit" 
                                            variant="primary" 
                                            disabled={formik.isSubmitting || !formik.isValid} 
                                            loading={formik.isSubmitting} 
                                            className="flex-1 py-2.5"
                                        >
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Create Employee
                                        </ReusableButton>
                                    </div>
                                </div>
                            </>
                        )}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default AddNewEmployee;