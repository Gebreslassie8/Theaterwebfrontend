// src/components/EmployeeForm/UpdateEmployee.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, User, Mail, Phone, Briefcase, Coins, Activity, AlertCircle } from 'lucide-react';
import * as Yup from 'yup';
import ReusableForm from '../Reusable/ReusableForm';
import ReusableButton from '../Reusable/ReusableButton';

const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
    username: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    assignedRole: Yup.string().required('Role is required'),
    status: Yup.string().required('Status is required'),
    salary: Yup.number().min(0, 'Salary cannot be negative').nullable(),
});

const getFields = (roles: any[]) => [
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
        label: 'Email', 
        placeholder: 'Enter email', 
        required: true, 
        icon: <Mail size={16} />, 
        colSpan: 1 
    },
    { 
        name: 'phone', 
        type: 'tel', 
        label: 'Phone', 
        placeholder: 'Enter phone number', 
        required: true, 
        icon: <Phone size={16} />, 
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
            { value: 'Inactive', label: 'Inactive' }
        ], 
        icon: <Activity size={16} />, 
        colSpan: 1 
    }
];

const UpdateEmployee: React.FC<any> = ({ isOpen, employee, roles, onClose, onUpdate }) => {
    // Default values - all defined
    const defaultValues = {
        name: '',
        username: '',
        email: '',
        phone: '',
        assignedRole: '',
        status: 'Active',
        salary: 5000
    };

    const [initialValues, setInitialValues] = useState(defaultValues);

    useEffect(() => {
        if (employee && isOpen) {
            console.log('Loading employee for update:', employee);
            // Only set values if employee exists and has valid data
            setInitialValues({
                name: employee.name || '',
                username: employee.username || '',
                email: employee.email || '',
                phone: employee.phone || '',
                assignedRole: employee.assignedRole || '',
                status: employee.status || 'Active',
                salary: employee.salary || 5000,
            });
        } else {
            // Reset to default when modal closes or no employee
            setInitialValues(defaultValues);
        }
    }, [employee, isOpen]);

    if (!isOpen || !employee) return null;

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            console.log('Submitting update with values:', values);
            const updatedData = {
                ...values,
                id: employee.id
            };
            await onUpdate(updatedData);
            setSubmitting(false);
            onClose();
        } catch (error) {
            console.error('Error updating employee:', error);
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCancel}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                            <Save className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Update Employee</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Edit employee information</p>
                        </div>
                    </div>
                    <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6 flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700">
                            Update the employee information below. Fields marked with <span className="text-red-500 font-medium">*</span> are required.
                        </p>
                    </div>

                    <ReusableForm
                        id="update-employee-form"
                        fields={getFields(roles)}
                        onSubmit={handleSubmit}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        columns={2}
                        render={(formik: any) => (
                            <>
                                {formik.values.assignedRole && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200"
                                    >
                                        <div className="flex items-start gap-2">
                                            <Briefcase className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-medium text-purple-800">Role Information:</p>
                                                <p className="text-xs text-purple-700 mt-1">
                                                    {formik.values.assignedRole === 'salesperson' && 'Salespersons can sell tickets, manage sales, and view customer data.'}
                                                    {formik.values.assignedRole === 'manager' && 'Managers can manage events, staff, and view reports.'}
                                                    {formik.values.assignedRole === 'scanner' && 'Scanners can scan tickets at events and validate entries.'}
                                                </p>
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
                                            <Save className="h-4 w-4 mr-2" />
                                            Update Employee
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

export default UpdateEmployee;