// Frontend/src/components/auth/ForgotPassword.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as yup from 'yup';
import {
  ArrowLeft, Mail, CheckCircle, XCircle,
  Key, Lock, Send,
  AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import supabase from '@/config/supabaseClient';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  // Check URL for reset token on component mount and when URL changes
  useEffect(() => {
    const checkUrlForResetToken = async () => {
      // Get the full URL hash (everything after #)
      const hash = window.location.hash;
      console.log('🔍 Full URL hash:', hash);
      console.log('🔍 Full URL:', window.location.href);
      
      // Check if hash contains access_token
      if (hash && hash.includes('access_token')) {
        console.log('✅ Reset token found in URL!');
        setShowResetForm(true);
        
        // Get the user session
        const { data: { user }, error } = await supabase.auth.getUser();
        console.log('👤 User from session:', user);
        
        if (error) {
          console.error('Session error:', error);
          setApiError('Invalid or expired reset link. Please request a new one.');
          setShowResetForm(false);
        }
      } else {
        console.log('❌ No reset token found in URL');
      }
    };
    
    checkUrlForResetToken();
  }, [location]);

  const emailValidationSchema = yup.object({
    email: yup
      .string()
      .required(t('forgotPassword.validation.emailRequired'))
      .email(t('forgotPassword.validation.emailInvalid'))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('forgotPassword.validation.emailFormat')),
  });

  const passwordValidationSchema = yup.object({
    newPassword: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be less than 32 characters')
      .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Must contain at least one number')
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Must contain at least one special character'),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('newPassword')], 'Passwords do not match')
  });

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    try {
      await emailValidationSchema.validate({ email });
    } catch (err: any) {
      setApiError(err.message);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`,
      });

      if (error) throw error;

      setSuccessMessage(`Password reset link sent to ${email}! Check your inbox.`);
      setIsSubmitted(true);
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    try {
      await passwordValidationSchema.validate({ newPassword, confirmPassword });
    } catch (err: any) {
      setApiError(err.message);
      return;
    }

    setIsLoading(true);

    try {
      // Update password via Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setResetSuccess(true);
      setSuccessMessage('Password updated successfully! Redirecting to login...');
      
      // Sync with custom users table
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .update({ password: newPassword })
          .eq('email', user.email);
      }
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordChecks = {
    length: newPassword.length >= 8 && newPassword.length <= 32,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };

  // RESET PASSWORD FORM (when token is in URL)
  if (showResetForm && !resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-deepTeal/5 p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-dark-700"
          >
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="h-14 w-14 bg-deepTeal/10 dark:bg-deepTeal/20 rounded-2xl flex items-center justify-center mx-auto">
                  <Lock className="h-7 w-7 text-deepTeal" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Create New Password</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Enter your new password below
                </p>
              </div>

              {apiError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{apiError}</p>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-dark-900 border rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-deepTeal focus:border-transparent dark:text-white" 
                      placeholder="Enter new password" 
                      disabled={isLoading}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-deepTeal transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-dark-800/50 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Password Requirements:</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {passwordChecks.length ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-300" />}
                          <span className="text-xs">8-32 characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordChecks.uppercase ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-300" />}
                          <span className="text-xs">At least one uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordChecks.lowercase ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-300" />}
                          <span className="text-xs">At least one lowercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordChecks.number ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-300" />}
                          <span className="text-xs">At least one number</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordChecks.special ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-gray-300" />}
                          <span className="text-xs">At least one special character</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="h-5 w-5" /></div>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-dark-900 border rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-deepTeal focus:border-transparent dark:text-white" 
                      placeholder="Confirm your new password" 
                      disabled={isLoading}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-deepTeal transition-colors">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword === confirmPassword && <p className="text-xs text-green-500 mt-1">✓ Passwords match</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-deepTeal/30 transition-all duration-300 flex items-center justify-center gap-2 bg-deepTeal hover:bg-skyTeal disabled:bg-deepTeal/50"
                >
                  {isLoading ? (
                    <><div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Resetting...</span></>
                  ) : (
                    <><span>Reset Password</span><Send className="h-5 w-5" /></>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-deepTeal transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // SUCCESS AFTER RESET
  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-3xl shadow-2xl p-8 text-center">
          <div className="h-20 w-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Password Updated!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{successMessage}</p>
        </div>
      </div>
    );
  }

  // EMAIL SENT CONFIRMATION
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-3xl shadow-2xl p-8 text-center">
          <div className="h-20 w-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Check Your Email</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We sent a password reset link to <strong className="text-deepTeal">{email}</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Click the link in the email to reset your password. The link expires in 1 hour.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 text-deepTeal hover:text-skyTeal font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // REQUEST RESET EMAIL FORM
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-deepTeal/5 dark:from-dark-900 dark:via-dark-950 dark:to-deepBlue/30 p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-dark-700"
        >
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="h-14 w-14 bg-deepTeal/10 dark:bg-deepTeal/20 rounded-2xl flex items-center justify-center mx-auto">
                <Key className="h-7 w-7 text-deepTeal" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Reset Password</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Enter your email to receive a reset link
              </p>
            </div>

            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{successMessage}</p>
              </div>
            )}

            {apiError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSendResetEmail} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setApiError('');
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-dark-900 border rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-deepTeal focus:border-transparent dark:text-white"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-deepTeal/30 transition-all duration-300 flex items-center justify-center gap-2 bg-deepTeal hover:bg-skyTeal disabled:bg-deepTeal/50"
              >
                {isLoading ? (
                  <><div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Sending...</span></>
                ) : (
                  <><span>Send Reset Link</span><Send className="h-5 w-5" /></>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-deepTeal dark:text-gray-400 dark:hover:text-skyTeal transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;