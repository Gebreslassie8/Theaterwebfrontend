// src/components/EmployeeForm/ViewEmployee.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Phone, Briefcase, DollarSign, Calendar, Clock, Award, FileText, CheckCircle, XCircle, UserCheck, Shield } from 'lucide-react';
import ReusableButton from '../Reusable/ReusableButton';

interface ViewEmployeeProps {
    isOpen: boolean;
    employee: any;
    roles: any[];
    onClose: () => void;
}

const ViewEmployee: React.FC<ViewEmployeeProps> = ({ isOpen, employee, roles, onClose }) => {
    if (!isOpen || !employee) return null;

    const getRoleDetails = (roleId: string) => {
        return roles.find(r => r.id === roleId);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Active':
                return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Active' };
            case 'Inactive':
                return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Inactive' };
            case 'On Leave':
                return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'On Leave' };
            default:
                return { icon: UserCheck, color: 'text-gray-600', bgColor: 'bg-gray-100', label: status || 'Unknown' };
        }
    };

    const role = getRoleDetails(employee.assignedRole);
    const RoleIcon = role?.icon || Shield;
    const statusConfig = getStatusConfig(employee.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Matching AddNewEmployee style */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Employee Details</h2>
                            <p className="text-xs text-gray-500 mt-0.5">View complete employee information</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-white">
                                {employee.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
                            <p className="text-sm text-gray-500">@{employee.username}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                                    <StatusIcon className="h-3 w-3" />
                                    {statusConfig.label}
                                </span>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${role?.bgColor} ${role?.color}`}>
                                    <RoleIcon className="h-3 w-3" />
                                    {role?.label || 'No Role Assigned'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-teal-600" />
                            Personal Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                <p className="font-medium text-gray-900">{employee.name}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Username</p>
                                <p className="font-medium text-gray-900">@{employee.username}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <p className="font-medium text-gray-900">{employee.email}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <p className="font-medium text-gray-900">{employee.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employment Information */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-teal-600" />
                            Employment Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Role</p>
                                <div className="flex items-center gap-2">
                                    <RoleIcon className={`h-4 w-4 ${role?.color}`} />
                                    <p className="font-medium text-gray-900">{role?.label || 'Not Assigned'}</p>
                                </div>
                                {role && (
                                    <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                                )}
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Monthly Salary</p>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3 text-green-600" />
                                    <p className="font-medium text-green-600">${employee.salary?.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Join Date</p>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <p className="font-medium text-gray-900">
                                        {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'Not specified'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Performance</p>
                                <div className="flex items-center gap-2">
                                    <Award className="h-3 w-3 text-yellow-600" />
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div 
                                                className="bg-teal-500 h-1.5 rounded-full" 
                                                style={{ width: `${employee.performance || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-900">{employee.performance || 0}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role Permissions */}
                    {role && role.permissions && role.permissions.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Shield className="h-4 w-4 text-teal-600" />
                                Role Permissions
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((permission: string, index: number) => (
                                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-700">
                                            <CheckCircle className="h-3 w-3" />
                                            {permission.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {employee.notes && (
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-teal-600" />
                                Additional Notes
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-700">{employee.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <ReusableButton 
                            type="button" 
                            variant="secondary" 
                            onClick={onClose} 
                            className="flex-1 py-2.5"
                        >
                            Close
                        </ReusableButton>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ViewEmployee;