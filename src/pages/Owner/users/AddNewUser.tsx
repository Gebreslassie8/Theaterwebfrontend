// src/pages/Admin/users/AddNewUser.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, UserPlus, Shield, Mail, AlertCircle, CheckCircle, User, Phone, Briefcase, Activity } from 'lucide-react';
import * as Yup from 'yup';
import ReusableForm from '../../../components/Reusable/ReusableForm';
import ButtonStyle from '../../../components/Reusable/ButtonStyle';
import Colors from '../../../components/Reusable/Colors';

interface AddUserProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
  initialValues?: any;
  formTitle?: string;
}

const ValidationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number'),
  role: Yup.string()
    .required('Role is required'),
  status: Yup.string()
    .required('Status is required'),
  department: Yup.string(),
});

const ReusableButton: React.FC<any> = ({
  onClick,
  type = 'button',
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getButtonStyle = () => {
    if (variant === 'secondary') {
      return {
        backgroundColor: isHovered ? Colors.lightGray : Colors.white,
        color: Colors.error,
        transition: 'all 0.3s ease',
        border: `2px solid ${Colors.error}`,
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
      };
    }
    if (variant === 'danger') {
      return {
        backgroundColor: isHovered ? Colors.error : Colors.red,
        color: Colors.white,
        transition: 'all 0.3s ease',
        border: 'none',
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
      };
    }
    return {
      backgroundColor: isHovered ? ButtonStyle.hoverBackgroundColor : ButtonStyle.backgroundColor,
      color: ButtonStyle.color,
      transition: 'all 0.3s ease',
      border: 'none',
      transform: isPressed ? 'scale(0.98)' : 'scale(1)',
    };
  };

  const buttonStyle = getButtonStyle();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${ButtonStyle.base} ${className} relative overflow-hidden`}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Creating...</span>
        </div>
      ) : (
        children
      )}
      {isHovered && variant === 'primary' && (
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
      )}
    </button>
  );
};

// Form Input Component
const FormInput: React.FC<{
  label: string;
  name: string;
  type: string;
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  required?: boolean;
}> = ({ label, name, type, value, onChange, onBlur, error, touched, placeholder, icon, rightIcon, onRightIconClick, required }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-10 py-2.5 border ${error && touched ? 'border-red-500' : 'border-gray-200'
            } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white group-focus-within:bg-white`}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && touched && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1 flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Select Input Component
const FormSelect: React.FC<{
  label: string;
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
  touched?: boolean;
  options: { value: string; label: string }[];
  required?: boolean;
}> = ({ label, name, value, onChange, onBlur, error, touched, options, required }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-2.5 border ${error && touched ? 'border-red-500' : 'border-gray-200'
          } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white`}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && touched && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1 flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

const AddNewUser: React.FC<AddUserProps> = ({
  onSubmit,
  onClose,
  initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: '',
    status: 'Active',
    department: '',
  },
  formTitle = 'Add New User'
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '', bg: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;

    const strengthMap: Record<number, { label: string; color: string; bg: string }> = {
      1: { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500' },
      2: { label: 'Fair', color: 'text-orange-500', bg: 'bg-orange-500' },
      3: { label: 'Good', color: 'text-yellow-500', bg: 'bg-yellow-500' },
      4: { label: 'Strong', color: 'text-green-500', bg: 'bg-green-500' },
    };

    return strengthMap[strength] || { strength, label: '', color: '', bg: '' };
  };

  const formFields = [
    {
      name: 'username',
      type: 'text',
      label: 'Username',
      placeholder: 'Enter username',
      required: true,
      icon: <User className="h-4 w-4" />
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter email address',
      required: true,
      icon: <Mail className="h-4 w-4" />
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: 'Enter phone number',
      required: true,
      icon: <Phone className="h-4 w-4" />
    },
    {
      name: 'password',
      type: showPassword ? 'text' : 'password',
      label: 'Password',
      placeholder: 'Enter password',
      required: true,
      icon: <Shield className="h-4 w-4" />,
      rightIcon: showPassword ? <EyeOff size={18} /> : <Eye size={18} />,
      onRightIconClick: () => setShowPassword(!showPassword)
    },
    {
      name: 'confirmPassword',
      type: showConfirmPassword ? 'text' : 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      required: true,
      icon: <Shield className="h-4 w-4" />,
      rightIcon: showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />,
      onRightIconClick: () => setShowConfirmPassword(!showConfirmPassword)
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      placeholder: 'Select role',
      required: true,
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'manager', label: 'Manager' },
        { value: 'theater_owner', label: 'Theater Owner' },
        { value: 'salesperson', label: 'Salesperson' },
        { value: 'scanner', label: 'Scanner' },
        { value: 'customer', label: 'Customer' }
      ]
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      placeholder: 'Select status',
      required: true,
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Pending', label: 'Pending' }
      ]
    },
    {
      name: 'department',
      type: 'text',
      label: 'Department',
      placeholder: 'Enter department name (Optional)',
      icon: <Briefcase className="h-4 w-4" />
    },
  ];

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const { confirmPassword, ...submitData } = values;
    await onSubmit(submitData);
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{formTitle}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {/* Info Alert */}
            <div className="mb-6 flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                All fields marked with <span className="text-red-500">*</span> are required.
                User will receive login credentials via email after creation.
              </p>
            </div>

            <ReusableForm
              id="add-user-form"
              fields={formFields}
              onSubmit={handleSubmit}
              initialValues={initialValues}
              validationSchema={ValidationSchema}
              render={(formik) => (
                <div className="space-y-6">
                  {/* Password Strength Indicator */}
                  {formik.values.password && formik.values.password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
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
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Role Information */}
                  {formik.values.role && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                    >
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-purple-800">Role Information:</p>
                          <p className="text-xs text-purple-700 mt-1">
                            {formik.values.role === 'admin' && 'Admin users have full system access including user management, settings, and all features.'}
                            {formik.values.role === 'manager' && 'Managers can manage users, content, and view reports but cannot access system settings.'}
                            {formik.values.role === 'theater_owner' && 'Theater owners can manage their own theater, shows, and view sales reports.'}
                            {formik.values.role === 'salesperson' && 'Salespersons can process ticket sales and view basic reports.'}
                            {formik.values.role === 'scanner' && 'Scanners can only scan tickets for entry validation.'}
                            {formik.values.role === 'customer' && 'Customers have basic access to purchase tickets and view their bookings.'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Status Information */}
                  {formik.values.status && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start gap-2">
                        <Activity className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-800">Status Information:</p>
                          <p className="text-xs text-gray-700 mt-1">
                            {formik.values.status === 'Active' && 'Active users can log in and access the system with their assigned permissions.'}
                            {formik.values.status === 'Inactive' && 'Inactive users cannot log in to the system until reactivated by an admin.'}
                            {formik.values.status === 'Pending' && 'Pending users are awaiting email verification or admin approval.'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Security Note */}
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-emerald-800">Security Information</p>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          User credentials will be encrypted and stored securely. An email will be sent to the user with their login information.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <ReusableButton
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        formik.resetForm();
                        onClose();
                      }}
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
                      Create User Account
                    </ReusableButton>
                  </div>
                </div>
              )}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddNewUser;