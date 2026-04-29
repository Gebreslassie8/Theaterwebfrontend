import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as yup from 'yup';
import {
  ArrowLeft, Mail, CheckCircle, XCircle,
  Shield, Key, Lock, Send, Smartphone,
  AlertCircle, Sparkles, PartyPopper, Gift,
  ThumbsUp, Clock, Bell, Star
} from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import SuccessPopup from '../Reusable/SuccessPopup';

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

const API_BASE_URL = 'http://localhost:5000/api';

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
  const [userId, setUserId] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [apiError, setApiError] = useState('');

  // Popup state for reusable component
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    details: null,
    onConfirm: null,
    confirmText: 'OK'
  });

  const showPopup = (type, title, message, details = null, onConfirm = null, confirmText = 'OK') => {
    setPopup({
      isOpen: true,
      type,
      title,
      message,
      details,
      onConfirm: onConfirm || (() => setPopup(prev => ({ ...prev, isOpen: false }))),
      confirmText
    });
  };

  const recoveryMethods = [
    {
      id: 'email',
      label: 'Email Recovery',
      icon: Mail,
      color: 'from-deepTeal to-deepTeal',
      description: 'Reset link sent to your email'
    },
    {
      id: 'phone',
      label: 'SMS Recovery',
      icon: Smartphone,
      color: 'from-deepBlue to-deepTeal',
      description: 'Code sent to your phone'
    }
  ];

  // Validate step 1 based on selected method
  const validateStep1 = async (field = null) => {
    try {
      const schema = step1Schemas[method];
      const data = { email };
      await schema.validate(data, { abortEarly: false });
      setErrors((prev) => ({ ...prev, email: null }));
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
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
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
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
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
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

  const handleSubmit = async (e) => {
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

    try {
      if (step === 1) {
        // Request reset code
        const response = await fetch(`${API_BASE_URL}/password/request-reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: method,
            value: email
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to send reset code');
        }

        // Store userId for next steps
        if (data.userId) {
          setUserId(data.userId);
        }

        // Show success popup
        showPopup(
          'success',
          '✨ Verification Code Sent!',
          `We've sent a 6-digit verification code to your ${method === 'email' ? 'email address' : 'phone number'}. Please check your ${method === 'email' ? 'inbox' : 'messages'} and enter the code below.`,
          method === 'email'
            ? `📧 Code sent to: ${email.substring(0, 3)}***${email.substring(email.indexOf('@') - 2)}`
            : `📱 Code sent to: ${email.substring(0, 4)}***${email.substring(email.length - 3)}`,
          () => setStep(2),
          'Continue'
        );

      } else if (step === 2) {
        // Verify code
        const codeString = code.join('');

        const response = await fetch(`${API_BASE_URL}/password/verify-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            code: codeString
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Invalid verification code');
        }

        // Store reset token
        setResetToken(data.resetToken);

        // Show success popup
        showPopup(
          'success',
          '✓ Code Verified!',
          'Your verification code has been successfully validated. Now you can create a strong new password for your account.',
          '🔐 Your account is now ready for password reset',
          () => setStep(3),
          'Continue'
        );

      } else if (step === 3) {
        // Reset password
        const response = await fetch(`${API_BASE_URL}/password/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resetToken,
            newPassword
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to reset password');
        }

        // Show success popup
        showPopup(
          'success',
          '🎉 Password Reset Successful!',
          'Your password has been updated successfully. You can now log in with your new password.',
          '✨ Redirecting to login page...',
          () => {
            window.location.href = '/login';
          },
          'Login Now'
        );

        // Set success state
        setIsSubmitted(true);

        // Clear state
        setUserId(null);
        setResetToken(null);

        // Redirect to login after 3 seconds if popup doesn't close
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    } catch (error) {
      setApiError(error.message);
      showPopup(
        'error',
        '❌ Oops! Something went wrong',
        error.message || 'An unexpected error occurred. Please try again.',
        null,
        null,
        'Try Again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
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

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!userId) {
      showPopup('error', 'Error', 'User information missing. Please start over.', null, null, 'OK');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/password/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      showPopup(
        'success',
        '📨 Code Resent!',
        `A new verification code has been sent to your ${method === 'email' ? 'email' : 'phone'}. Please check and enter the code.`,
        null,
        () => {
          // Clear code inputs for fresh entry
          setCode(['', '', '', '', '', '']);
        },
        'OK'
      );

    } catch (error) {
      showPopup('error', 'Error', error.message, null, null, 'OK');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodChange = (methodId) => {
    setMethod(methodId);
    setStep(1);
    setEmail('');
    setCode(['', '', '', '', '', '']);
    setErrors({});
    setTouched({});
    setApiError('');
    setUserId(null);
    setResetToken(null);
  };

  const handleBlur = async (field) => {
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
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-deepTeal/5 dark:from-dark-900 dark:via-dark-950 dark:to-deepBlue/30 transition-colors duration-300">
        <div className="w-full px-4 sm:px-6 py-8 sm:py-12">
          <div className="mx-auto w-full max-w-[95%] sm:max-w-md md:max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/95 dark:bg-dark-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-dark-700/50"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 md:p-8 pb-2 sm:pb-3 md:pb-4">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 bg-deepTeal/10 dark:bg-deepTeal/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-deepTeal">
                    <Key className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                      {step === 1 && 'Select a recovery method to continue'}
                      {step === 2 && 'Enter the verification code sent to you'}
                      {step === 3 && 'Create a strong new password'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 md:p-8 pt-0 sm:pt-0 md:pt-0">
                {/* Success Message - Fallback */}
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 sm:py-8"
                  >
                    <div className="h-16 w-16 sm:h-20 sm:w-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      Password Reset Successful!
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                      Your password has been updated successfully. Redirecting to login...
                    </p>
                    <div className="h-1 w-24 sm:w-32 bg-gray-100 dark:bg-dark-700 rounded-full mx-auto overflow-hidden">
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
                      <div className="mb-6 sm:mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {recoveryMethods.map((methodItem) => (
                            <button
                              key={methodItem.id}
                              onClick={() => handleMethodChange(methodItem.id)}
                              className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-3 text-center ${method === methodItem.id
                                ? 'border-deepTeal bg-deepTeal/10 dark:bg-deepTeal/20 ring-2 ring-deepTeal/20 dark:ring-deepTeal/30'
                                : 'border-gray-100 dark:border-dark-700 hover:border-deepTeal dark:hover:border-deepTeal bg-gray-50 dark:bg-dark-900'
                                }`}
                            >
                              <methodItem.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${method === methodItem.id ? 'text-deepTeal' : 'text-gray-500'}`} />
                              <span className={`text-xs sm:text-sm font-semibold ${method === methodItem.id
                                ? 'text-deepTeal dark:text-deepTeal'
                                : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                {methodItem.id === 'email' ? 'Email' : 'SMS'}
                              </span>

                              {method === methodItem.id && (
                                <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-deepTeal" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Progress Steps */}
                    <div className="mb-6 sm:mb-8 px-2 sm:px-4">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-dark-700 -z-10 rounded-full" />
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-deepTeal -z-10 rounded-full transition-all duration-500"
                          style={{ width: `${((step - 1) / 2) * 100}%` }}
                        />

                        {[1, 2, 3].map((stepNum) => (
                          <div key={stepNum} className="flex flex-col items-center bg-white dark:bg-dark-800 px-1 sm:px-2">
                            <div className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${stepNum < step
                              ? 'bg-deepTeal border-deepTeal text-white'
                              : stepNum === step
                                ? 'border-deepTeal text-deepTeal'
                                : 'border-gray-300 dark:border-dark-600 text-gray-400 dark:text-dark-500'
                              }`}>
                              {stepNum < step ? (
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <span className="text-xs sm:text-sm font-bold">{stepNum}</span>
                              )}
                            </div>
                            <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium transition-colors duration-300 ${stepNum <= step
                              ? 'text-deepTeal dark:text-deepTeal'
                              : 'text-gray-400 dark:text-dark-500'
                              }`}>
                              {stepNum === 1 ? 'Identity' : stepNum === 2 ? 'Verify' : 'Reset'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6" key={step}>
                        {/* Step 1: Email/Phone Input */}
                        {step === 1 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key="step1"
                          >
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                {method === 'email' ? 'Email Address' : 'Phone Number'}
                                <span className="text-red-500 ml-1">*</span>
                              </label>
                              <div className="relative group">
                                <div className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-deepTeal' : 'text-gray-400'
                                  }`}>
                                  {method === 'email' ? <Mail className="h-4 w-4 sm:h-5 sm:w-5" /> : <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />}
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
                                  className={`w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 text-sm bg-gray-50 dark:bg-dark-900 border rounded-xl outline-none transition-all duration-300 ${errors.email
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30'
                                    : focusedField === 'email'
                                      ? 'border-deepTeal ring-4 ring-deepTeal/20 dark:ring-deepTeal/30'
                                      : 'border-gray-200 dark:border-dark-700 hover:border-deepTeal dark:hover:border-deepTeal'
                                    } dark:text-white`}
                                  placeholder={
                                    method === 'email' ? 'you@example.com' : '+251911234567'
                                  }
                                />
                              </div>
                              {errors.email && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-start gap-1 sm:gap-2 mt-1 text-red-500 text-[10px] sm:text-xs"
                                >
                                  <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 mt-0.5" />
                                  <span>{errors.email}</span>
                                </motion.div>
                              )}
                              {method === 'email' && !errors.email && (
                                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                                  We'll send a verification code to this email address
                                </p>
                              )}
                              {method === 'phone' && !errors.phone && (
                                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
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
                            <div className="text-center mb-4 sm:mb-6">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Enter Verification Code</h3>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                We sent a 6-digit code to{' '}
                                <span className="text-deepTeal dark:text-deepTeal font-medium block mt-1">
                                  {method === 'email' ? email : email}
                                </span>
                              </p>
                            </div>

                            <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 mb-5 sm:mb-6">
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
                                  className={`h-10 w-9 sm:h-12 sm:w-10 md:h-14 md:w-14 text-center text-lg sm:text-xl md:text-2xl font-bold rounded-xl border-2 bg-gray-50 dark:bg-dark-900 focus:outline-none transition-all duration-300 ${errors.code
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30'
                                    : focusedField === `code-${index}`
                                      ? 'border-deepTeal ring-4 ring-deepTeal/20 dark:ring-deepTeal/30'
                                      : 'border-gray-200 dark:border-dark-700 hover:border-deepTeal dark:hover:border-deepTeal'
                                    } dark:text-white`}
                                />
                              ))}
                            </div>

                            {errors.code && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-4 text-red-500 text-xs sm:text-sm"
                              >
                                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                {errors.code}
                              </motion.div>
                            )}

                            <div className="text-center">
                              <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={isLoading}
                                className="text-deepTeal hover:text-deepTeal dark:text-deepTeal dark:hover:text-deepTeal font-medium text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="space-y-4 sm:space-y-5"
                          >
                            {/* New Password */}
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                New Password <span className="text-red-500">*</span>
                              </label>
                              <div className="relative group">
                                <div className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'newPassword' ? 'text-deepTeal' : 'text-gray-400'
                                  }`}>
                                  <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
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
                                  className={`w-full pl-9 sm:pl-11 pr-9 sm:pr-11 py-2 sm:py-2.5 md:py-3 text-sm bg-gray-50 dark:bg-dark-900 border rounded-xl outline-none transition-all duration-300 ${errors.newPassword
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30'
                                    : focusedField === 'newPassword'
                                      ? 'border-deepTeal ring-4 ring-deepTeal/20 dark:ring-deepTeal/30'
                                      : 'border-gray-200 dark:border-dark-700 hover:border-deepTeal dark:hover:border-deepTeal'
                                    } dark:text-white`}
                                  placeholder="Enter new password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-deepTeal dark:hover:text-deepTeal transition-colors"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                                </button>
                              </div>

                              {/* Password Requirements */}
                              {newPassword && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg border border-gray-100 dark:border-dark-700"
                                >
                                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
                                    Password must contain:
                                  </p>
                                  <div className="space-y-0.5 sm:space-y-1">
                                    {[
                                      { label: '8-32 characters', met: passwordChecks.length },
                                      { label: 'Uppercase letter (A-Z)', met: passwordChecks.uppercase },
                                      { label: 'Lowercase letter (a-z)', met: passwordChecks.lowercase },
                                      { label: 'Number (0-9)', met: passwordChecks.number },
                                      { label: 'Special character (!@#$%^&*)', met: passwordChecks.special },
                                      { label: 'No spaces', met: passwordChecks.noSpaces },
                                    ].map((req, idx) => (
                                      <div key={idx} className="flex items-center gap-1 sm:gap-2">
                                        {req.met ? (
                                          <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
                                        ) : (
                                          <XCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-300 dark:text-gray-600" />
                                        )}
                                        <span className={`text-[10px] sm:text-xs ${req.met
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
                                      className="text-[10px] sm:text-xs text-green-600 dark:text-green-500 mt-1 sm:mt-2 font-medium"
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
                                  className="flex items-start gap-1 sm:gap-2 mt-1 text-red-500 text-[10px] sm:text-xs"
                                >
                                  <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 mt-0.5" />
                                  <span>{errors.newPassword}</span>
                                </motion.div>
                              )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                                Confirm New Password <span className="text-red-500">*</span>
                              </label>
                              <div className="relative group">
                                <div className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-deepTeal' : 'text-gray-400'
                                  }`}>
                                  <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
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
                                  className={`w-full pl-9 sm:pl-11 pr-9 sm:pr-11 py-2 sm:py-2.5 md:py-3 text-sm bg-gray-50 dark:bg-dark-900 border rounded-xl outline-none transition-all duration-300 ${errors.confirmPassword
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30'
                                    : focusedField === 'confirmPassword'
                                      ? 'border-deepTeal ring-4 ring-deepTeal/20 dark:ring-deepTeal/30'
                                      : 'border-gray-200 dark:border-dark-700 hover:border-deepTeal dark:hover:border-deepTeal'
                                    } dark:text-white`}
                                  placeholder="Confirm new password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-deepTeal dark:hover:text-deepTeal transition-colors"
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                                </button>
                              </div>

                              {confirmPassword && newPassword === confirmPassword && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-center gap-1 sm:gap-2 mt-1 text-green-500 text-[10px] sm:text-xs"
                                >
                                  <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  Passwords match
                                </motion.div>
                              )}

                              {errors.confirmPassword && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-start gap-1 sm:gap-2 mt-1 text-red-500 text-[10px] sm:text-xs"
                                >
                                  <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 mt-0.5" />
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
                          className={`w-full py-2.5 sm:py-3 md:py-4 rounded-xl font-bold text-white shadow-lg shadow-deepTeal/30 transition-all duration-300 flex items-center justify-center gap-2 ${isLoading
                            ? 'bg-deepTeal/50 cursor-not-allowed transform-none'
                            : 'bg-deepTeal hover:bg-deepTeal hover:shadow-deepTeal/40 hover:-translate-y-0.5 active:translate-y-0'
                            }`}
                        >
                          {isLoading ? (
                            <>
                              <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span className="text-sm sm:text-base">
                                {step === 1 && 'Sending...'}
                                {step === 2 && 'Verifying...'}
                                {step === 3 && 'Resetting...'}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm sm:text-base">
                                {step === 1 && 'Send Reset Link'}
                                {step === 2 && 'Verify Code'}
                                {step === 3 && 'Reset Password'}
                              </span>
                              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                            </>
                          )}
                        </button>
                      </form>
                    </AnimatePresence>

                    {/* Back to Login Link */}
                    <div className="mt-5 sm:mt-6 text-center">
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-deepTeal dark:text-gray-400 dark:hover:text-deepTeal transition-colors"
                      >
                        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                        Back to Login
                      </Link>
                    </div>

                    {/* Security Info */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 dark:border-dark-700 text-center">
                      <div className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 dark:bg-dark-900 rounded-full text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span>Secure 256-bit SSL Encryption</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reusable Success Popup */}
      <SuccessPopup
        isOpen={popup.isOpen}
        onClose={() => setPopup(prev => ({ ...prev, isOpen: false }))}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        details={popup.details}
        onConfirm={popup.onConfirm}
        confirmText={popup.confirmText}
      />
    </>
  );
};

export default ForgotPassword;