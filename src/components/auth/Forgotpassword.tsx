import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as yup from 'yup';
import {
  ArrowLeft, Mail, CheckCircle, XCircle,
  Shield, Key, Lock, Send, Smartphone,
  AlertCircle
} from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';

// Mock User Data Store (Temporary)
interface MockUser {
  id: string;
  email: string;
  phone: string;
  name: string;
  password: string;
}

// Mock user database for testing
const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'john@example.com',
    phone: '0912345678',
    name: 'John Smith',
    password: 'OldPassword123!'
  },
  {
    id: '2',
    email: 'sarah@example.com',
    phone: '0923456789',
    name: 'Sarah Johnson',
    password: 'OldPassword123!'
  },
  {
    id: '3',
    email: 'admin@theaterhub.com',
    phone: '0934567890',
    name: 'Admin User',
    password: 'Admin123!'
  }
];

// Store temporary reset data in memory
let tempResetData: {
  userId: string;
  code: string;
  token: string;
  expiry: number;
} | null = null;

// Generate random 6-digit code
const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate random token
const generateToken = (): string => {
  return 'reset_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

// Validation schemas using Yup
const step1Schemas = {
  email: yup.object({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address (e.g., name@example.com)')
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Email must be in format: name@domain.com'
      )
      .test('user-exists', 'Email not found in our system', (value) => {
        if (!value) return true;
        return mockUsers.some(user => user.email.toLowerCase() === value.toLowerCase());
      })
  }),
  phone: yup.object({
    email: yup
      .string()
      .required('Phone number is required')
      .matches(
        /^[\+]?[0-9]{10,15}$/,
        'Phone number must be 10-15 digits (e.g., 251911234567 or +251911234567)'
      )
      .test('ethiopian-phone', 'Please enter a valid Ethiopian phone number', (value) => {
        if (!value) return false;
        const cleaned = value.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 12;
      })
      .test('user-exists', 'Phone number not found in our system', (value) => {
        if (!value) return true;
        const cleaned = value.replace(/\D/g, '');
        return mockUsers.some(user => user.phone === cleaned);
      })
  })
};

const step2Schema = yup.object({
  code: yup
    .string()
    .required('Verification code is required')
    .length(6, 'Code must be exactly 6 digits')
    .matches(/^\d+$/, 'Code must contain only numbers (0-9)')
    .test('not-all-zeros', 'Code cannot be all zeros', (value) => {
      return value !== '000000';
    })
});

const step3Schema = yup.object({
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password cannot exceed 32 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
    .matches(/[0-9]/, 'Password must contain at least one number (0-9)')
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Password must contain at least one special character (!@#$%^&*)'
    )
    .test('no-spaces', 'Password cannot contain spaces', (value) => {
      return !/\s/.test(value);
    })
    .test('no-sequential', 'Password cannot contain sequential characters (123, abc)', (value) => {
      const sequential = ['123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'def'];
      return !sequential.some(seq => value.toLowerCase().includes(seq));
    }),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .test('passwords-match', 'Passwords must be identical', function (value) {
      return value === this.parent.newPassword;
    })
});

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState('email');
  const [step, setStep] = useState(1);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [touched, setTouched] = useState({});
  const [userId, setUserId] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [apiError, setApiError] = useState('');
  const [showMockCode, setShowMockCode] = useState(false);
  const [mockCode, setMockCode] = useState('');

  const recoveryMethods = [
    {
      id: 'email',
      label: 'Email Recovery',
      icon: Mail,
      color: 'from-deepTeal to-skyTeal',
      description: 'Reset link sent to your email'
    },
    {
      id: 'phone',
      label: 'SMS Recovery',
      icon: Smartphone,
      color: 'from-deepBlue to-skyTeal',
      description: 'Code sent to your phone'
    }
  ];

  // Find user by email or phone
  const findUser = (value: string): MockUser | undefined => {
    if (method === 'email') {
      return mockUsers.find(user => user.email.toLowerCase() === value.toLowerCase());
    } else {
      const cleanedPhone = value.replace(/\D/g, '');
      return mockUsers.find(user => user.phone === cleanedPhone);
    }
  };

  // Validate step 1 based on selected method
  const validateStep1 = async (field = null) => {
    try {
      const schema = step1Schemas[method];
      const data = { email };
      await schema.validate(data, { abortEarly: false });
      setErrors((prev) => ({ ...prev, email: null }));
      return true;
    } catch (err: any) {
      const validationErrors = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });

      if (field) {
        setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
      } else {
        setErrors(validationErrors);
      }
      return false;
    }
  };

  // Validate step 2
  const validateStep2 = async () => {
    try {
      const codeString = code.join('');
      await step2Schema.validate({ code: codeString }, { abortEarly: false });
      setErrors((prev) => ({ ...prev, code: null }));
      return true;
    } catch (err: any) {
      const validationErrors = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  // Validate step 3
  const validateStep3 = async (field = null) => {
    try {
      await step3Schema.validate(
        { newPassword, confirmPassword },
        { abortEarly: false }
      );
      setErrors((prev) => ({ ...prev, newPassword: null, confirmPassword: null }));
      return true;
    } catch (err: any) {
      const validationErrors = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });

      if (field) {
        setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
      } else {
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    let isValid = false;

    if (step === 1) {
      isValid = await validateStep1();
    } else if (step === 2) {
      isValid = await validateStep2();
    } else if (step === 3) {
      isValid = await validateStep3();
    }

    if (!isValid) return;

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (step === 1) {
        // Find user
        const user = findUser(email);

        if (!user) {
          throw new Error(`${method === 'email' ? 'Email' : 'Phone number'} not found in our system.`);
        }

        // Generate reset code and token
        const resetCode = generateCode();
        const resetToken = generateToken();
        const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        // Store reset data
        tempResetData = {
          userId: user.id,
          code: resetCode,
          token: resetToken,
          expiry: expiry
        };

        setUserId(user.id);
        setResetToken(resetToken);
        setMockCode(resetCode);
        setShowMockCode(true);

        // Log to console for testing
        console.log(`=== PASSWORD RESET (MOCK) ===`);
        console.log(`To: ${method === 'email' ? user.email : user.phone}`);
        console.log(`Verification code: ${resetCode}`);
        console.log(`Expires in 10 minutes`);
        console.log(`===============================`);

        // Move to next step
        setStep(2);

      } else if (step === 2) {
        const codeString = code.join('');

        // Verify code matches stored data
        if (!tempResetData || tempResetData.userId !== userId) {
          throw new Error('Session expired. Please start over.');
        }

        if (Date.now() > tempResetData.expiry) {
          tempResetData = null;
          throw new Error('Verification code has expired. Please request a new code.');
        }

        if (tempResetData.code !== codeString) {
          throw new Error('Invalid verification code. Please check and try again.');
        }

        // Move to next step
        setStep(3);

      } else if (step === 3) {
        // Verify reset token
        if (!tempResetData || tempResetData.token !== resetToken) {
          throw new Error('Invalid reset session. Please start over.');
        }

        if (Date.now() > tempResetData.expiry) {
          tempResetData = null;
          throw new Error('Reset session has expired. Please request a new reset.');
        }

        // Find user and update password
        const user = mockUsers.find(u => u.id === userId);

        if (!user) {
          throw new Error('User not found.');
        }

        // Update password (mock)
        user.password = newPassword;

        console.log(`=== PASSWORD UPDATED (MOCK) ===`);
        console.log(`User: ${user.name} (${user.email})`);
        console.log(`New password set successfully`);
        console.log(`===============================`);

        // Clear temp data
        tempResetData = null;
        setUserId(null);
        setResetToken(null);

        // Show success
        setIsSubmitted(true);

        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Clear code error when user starts typing
      if (errors.code) {
        setErrors({ ...errors, code: null });
      }

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!userId) {
      alert('User information missing. Please start over.');
      return;
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Generate new code
      const newCode = generateCode();
      const newExpiry = Date.now() + 10 * 60 * 1000;

      if (tempResetData) {
        tempResetData.code = newCode;
        tempResetData.expiry = newExpiry;
      }

      setMockCode(newCode);
      setShowMockCode(true);

      const user = mockUsers.find(u => u.id === userId);

      console.log(`=== NEW CODE RESENT (MOCK) ===`);
      console.log(`To: ${method === 'email' ? user?.email : user?.phone}`);
      console.log(`New verification code: ${newCode}`);
      console.log(`===============================`);

      // Clear code inputs
      setCode(['', '', '', '', '', '']);

      alert('New verification code sent!');

    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodChange = (methodId: string) => {
    setMethod(methodId);
    setStep(1);
    setEmail('');
    setCode(['', '', '', '', '', '']);
    setErrors({});
    setTouched({});
    setApiError('');
    setUserId(null);
    setResetToken(null);
    setShowMockCode(false);
    tempResetData = null;
  };

  const handleBlur = async (field: string) => {
    setTouched({ ...touched, [field]: true });

    if (step === 1 && field === 'email') {
      await validateStep1(field);
    } else if (step === 3 && (field === 'newPassword' || field === 'confirmPassword')) {
      await validateStep3(field);
    }
  };

  const passwordChecks = {
    length: newPassword.length >= 8 && newPassword.length <= 32,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
    noSpaces: !/\s/.test(newPassword),
  };

  const allPasswordChecksMet = Object.values(passwordChecks).every(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-deepTeal/5 dark:from-dark-900 dark:via-dark-950 dark:to-deepBlue/30 p-4 transition-colors duration-300">
      <div className="max-w-xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-dark-700"
        >
          {/* Header */}
          <div className="p-8 pb-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 bg-deepTeal/10 dark:bg-deepTeal/20 rounded-2xl flex items-center justify-center text-deepTeal">
                <Key className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {step === 1 && 'Select a recovery method to continue'}
                  {step === 2 && 'Enter the verification code sent to you'}
                  {step === 3 && 'Create a strong new password'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 pt-0">
            {/* Success Message */}
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="h-20 w-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Password Reset Successful!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your password has been updated successfully. Redirecting to login...
                </p>
                <div className="h-1.5 w-32 bg-gray-100 dark:bg-dark-700 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    className="h-full bg-green-500"
                  />
                </div>
              </motion.div>
            ) : (
              <>
                {/* Recovery Method Selection - Only on step 1 */}
                {step === 1 && (
                  <div className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {recoveryMethods.map((methodItem) => (
                        <button
                          key={methodItem.id}
                          onClick={() => handleMethodChange(methodItem.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 text-center ${method === methodItem.id
                            ? 'border-deepTeal bg-deepTeal/10 dark:bg-deepTeal/20 ring-2 ring-deepTeal/20 dark:ring-deepTeal/30'
                            : 'border-gray-100 dark:border-dark-700 hover:border-deepTeal dark:hover:border-skyTeal bg-gray-50 dark:bg-dark-900'
                            }`}
                        >
                          <methodItem.icon className={`h-6 w-6 ${method === methodItem.id ? 'text-deepTeal' : 'text-gray-500'
                            }`} />
                          <span className={`text-sm font-semibold ${method === methodItem.id
                            ? 'text-deepTeal dark:text-skyTeal'
                            : 'text-gray-700 dark:text-gray-300'
                            }`}>
                            {methodItem.id === 'email' ? 'Email' : 'SMS'}
                          </span>

                          {method === methodItem.id && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-4 w-4 text-deepTeal" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Steps */}
                <div className="mb-8 px-4">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-dark-700 -z-10 rounded-full" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-deepTeal -z-10 rounded-full transition-all duration-500"
                      style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />

                    {[1, 2, 3].map((stepNum) => (
                      <div key={stepNum} className="flex flex-col items-center bg-white dark:bg-dark-800 px-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${stepNum < step
                          ? 'bg-deepTeal border-deepTeal text-white'
                          : stepNum === step
                            ? 'border-deepTeal text-deepTeal'
                            : 'border-gray-300 dark:border-dark-600 text-gray-400 dark:text-dark-500'
                          }`}>
                          {stepNum < step ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-bold">{stepNum}</span>
                          )}
                        </div>
                        <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${stepNum <= step
                          ? 'text-deepTeal dark:text-skyTeal'
                          : 'text-gray-400 dark:text-dark-500'
                          }`}>
                          {stepNum === 1 ? 'Identity' : stepNum === 2 ? 'Verify' : 'Reset'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <form onSubmit={handleSubmit} className="space-y-6" key={step}>
                    {/* Step 1: Email/Phone Input */}
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key="step1"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {method === 'email' ? 'Email Address' : 'Phone Number'}
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <div className="relative group">
                            <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-deepTeal' : 'text-gray-400'
                              }`}>
                              {method === 'email' ? <Mail className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                            </div>
                            <input
                              type={method === 'email' ? 'email' : 'tel'}
                              value={email}
                              onChange={async (e) => {
                                setEmail(e.target.value);
                                if (errors.email || touched.email) {
                                  await validateStep1('email');
                                }
                              }}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => {
                                setFocusedField(null);
                                handleBlur('email');
                              }}
                              className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-dark-900 border rounded-xl outline-none transition-all duration-300 ${errors.email
                                ? 'border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30'
                                : focusedField === 'email'
                                  ? 'border-deepTeal ring-4 ring-deepTeal/20 dark:ring-deepTeal/30'
                                  : 'border-gray-200 dark:border-dark-700 hover:border-deepTeal dark:hover:border-skyTeal'
                                } dark:text-white`}
                              placeholder={
                                method === 'email' ? 'you@example.com' : '0912345678'
                              }
                            />
                          </div>
                          {errors.email && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start gap-2 mt-2 text-red-500 text-xs"
                            >
                              <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                              <span>{errors.email}</span>
                            </motion.div>
                          )}
                          {method === 'email' && !errors.email && (
                            <p className="text-xs text-gray-400 mt-2">
                              We'll send a verification code to this email address
                            </p>
                          )}
                          {method === 'phone' && !errors.phone && (
                            <p className="text-xs text-gray-400 mt-2">
                              We'll send a verification code to this phone number
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Verification Code */}
                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key="step2"
                      >
                        <div className="text-center mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enter Verification Code</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            We sent a 6-digit code to{' '}
                            <span className="text-deepTeal dark:text-skyTeal font-medium block mt-1">
                              {method === 'email' ? email : email}
                            </span>
                          </p>
                          {showMockCode && (
                            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                📋 Mock Code: <span className="font-mono font-bold">{mockCode}</span>
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                          {code.map((digit, index) => (
                            <input
                              key={index}
                              id={`code-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength="1"
                              value={digit}
                              onChange={(e) => handleCodeChange(index, e.target.value)}
                              onKeyDown={(e) => handleCodeKeyDown(index, e)}
                              onFocus={() => setFocusedField(`code-${index}`)}
                              onBlur={() => setFocusedField(null)}
                              className={`h-12 w-10 sm:h-14 sm:w-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 bg-gray-50 dark:bg-dark-900 focus:outline-none transition-all duration-300 ${errors.code
                                ? 'border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30'
                                : focusedField === `code-${index}`
                                  ? 'border-deepTeal ring-4 ring-deepTeal/20 dark:ring-deepTeal/30'
                                  : 'border-gray-200 dark:border-dark-700 hover:border-deepTeal dark:hover:border-skyTeal'
                                } dark:text-white`}
                            />
                          ))}
                        </div>

                        {errors.code && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 mb-4 text-red-500 text-sm"
                          >
                            <AlertCircle className="h-4 w-4" />
                            {errors.code}
                          </motion.div>
                        )}

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isLoading}
                            className="text-deepTeal hover:text-skyTeal dark:text-skyTeal dark:hover:text-deepTeal font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Didn't receive code? Resend
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key="step3"
                        className="space-y-5"
                      >
                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            New Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group">
                            <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'newPassword' ? 'text-deepTeal' : 'text-gray-400'
                              }`}>
                              <Lock className="h-5 w-5" />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={async (e) => {
                                setNewPassword(e.target.value);
                                if (errors.newPassword || touched.newPassword) {
                                  await validateStep3('newPassword');
                                }
                              }}
                              onFocus={() => setFocusedField('newPassword')}
                              onBlur={() => {
                                setFocusedField(null);
                                handleBlur('newPassword');
                              }}
                              className={`w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-dark-900 border rounded-xl outline-none transition-all duration-300 ${errors.newPassword
                                ? 'border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30'
                                : focusedField === 'newPassword'
                                  ? 'border-deepTeal ring-4 ring-deepTeal/20 dark:ring-deepTeal/30'
                                  : 'border-gray-200 dark:border-dark-700 hover:border-deepTeal dark:hover:border-skyTeal'
                                } dark:text-white`}
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-deepTeal dark:hover:text-skyTeal transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>

                          {/* Password Requirements */}
                          {newPassword && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 p-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg border border-gray-100 dark:border-dark-700"
                            >
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Password must contain:
                              </p>
                              <div className="space-y-1">
                                {[
                                  { label: '8-32 characters', met: passwordChecks.length },
                                  { label: 'Uppercase letter (A-Z)', met: passwordChecks.uppercase },
                                  { label: 'Lowercase letter (a-z)', met: passwordChecks.lowercase },
                                  { label: 'Number (0-9)', met: passwordChecks.number },
                                  { label: 'Special character (!@#$%^&*)', met: passwordChecks.special },
                                  { label: 'No spaces', met: passwordChecks.noSpaces },
                                ].map((req, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    {req.met ? (
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <XCircle className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                                    )}
                                    <span className={`text-xs ${req.met
                                      ? 'text-green-600 dark:text-green-500'
                                      : 'text-gray-500 dark:text-gray-400'
                                      }`}>
                                      {req.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {allPasswordChecksMet && (
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-xs text-green-600 dark:text-green-500 mt-2 font-medium"
                                >
                                  ✓ All requirements met!
                                </motion.p>
                              )}
                            </motion.div>
                          )}

                          {errors.newPassword && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start gap-2 mt-2 text-red-500 text-xs"
                            >
                              <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                              <span>{errors.newPassword}</span>
                            </motion.div>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Confirm New Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group">
                            <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-deepTeal' : 'text-gray-400'
                              }`}>
                              <Lock className="h-5 w-5" />
                            </div>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={async (e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword || touched.confirmPassword) {
                                  await validateStep3('confirmPassword');
                                }
                              }}
                              onFocus={() => setFocusedField('confirmPassword')}
                              onBlur={() => {
                                setFocusedField(null);
                                handleBlur('confirmPassword');
                              }}
                              className={`w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-dark-900 border rounded-xl outline-none transition-all duration-300 ${errors.confirmPassword
                                ? 'border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30'
                                : focusedField === 'confirmPassword'
                                  ? 'border-deepTeal ring-4 ring-deepTeal/20 dark:ring-deepTeal/30'
                                  : 'border-gray-200 dark:border-dark-700 hover:border-deepTeal dark:hover:border-skyTeal'
                                } dark:text-white`}
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-deepTeal dark:hover:text-skyTeal transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>

                          {confirmPassword && newPassword === confirmPassword && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2 mt-2 text-green-500 text-xs"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Passwords match
                            </motion.div>
                          )}

                          {errors.confirmPassword && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start gap-2 mt-2 text-red-500 text-xs"
                            >
                              <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                              <span>{errors.confirmPassword}</span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-deepTeal/30 transition-all duration-300 flex items-center justify-center gap-2 ${isLoading
                        ? 'bg-deepTeal/50 cursor-not-allowed transform-none'
                        : 'bg-deepTeal hover:bg-skyTeal hover:shadow-skyTeal/40 hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>
                            {step === 1 && 'Sending...'}
                            {step === 2 && 'Verifying...'}
                            {step === 3 && 'Resetting...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {step === 1 && 'Send Reset Link'}
                            {step === 2 && 'Verify Code'}
                            {step === 3 && 'Reset Password'}
                          </span>
                          <Send className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                </AnimatePresence>

                {/* Back to Login Link */}
                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-deepTeal dark:text-gray-400 dark:hover:text-skyTeal transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>

                {/* Mock Data Info Card - Only visible on step 1 */}
                {step === 1 && (
                  <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-800">
                        <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Mock Test Accounts</p>
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 space-y-0.5">
                          <div>📧 john@example.com | 📱 0912345678</div>
                          <div>📧 sarah@example.com | 📱 0923456789</div>
                          <div>📧 admin@theaterhub.com | 📱 0934567890</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;