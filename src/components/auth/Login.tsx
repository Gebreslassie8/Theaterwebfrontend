// Frontend/src/components/auth/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as yup from "yup";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  HelpCircle,
  UserPlus,
  LogIn,
  Smartphone,
} from "lucide-react";

// Validation schemas using Yup
const loginSchemas = {
  email: yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email address")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Email must be in format: name@domain.com",
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(32, "Password cannot exceed 32 characters"),
  }),
  phone: yup.object({
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^[\+]?[0-9]{10,15}$/,
        "Phone must be 10-15 digits (e.g., 251911234567)",
      )
      .test(
        "ethiopian-phone",
        "Enter a valid Ethiopian phone number",
        (value) => {
          if (!value) return false;
          const cleaned = value.replace(/\D/g, "");
          return cleaned.length >= 10 && cleaned.length <= 12;
        },
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(32, "Password cannot exceed 32 characters"),
  }),
};

// Mock Users Data
const mockUsers = [
  {
    id: "1",
    email: "admin@theaterhub.com",
    phone: "+251911234567",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    avatar: "A",
  },
  {
    id: "2",
    email: "owner@theaterhub.com",
    phone: "+251911234568",
    password: "owner123",
    name: "Theater Owner",
    role: "theater_owner",
    avatar: "O",
  },
  {
    id: "3",
    email: "manager@theaterhub.com",
    phone: "+251911234569",
    password: "manager123",
    name: "Theater Manager",
    role: "manager",
    avatar: "M",
  },
  {
    id: "4",
    email: "sales@theaterhub.com",
    phone: "+251911234570",
    password: "sales123",
    name: "Salesperson",
    role: "salesperson",
    avatar: "S",
  },
  {
    id: "5",
    email: "scanner@theaterhub.com",
    phone: "+251911234571",
    password: "scanner123",
    name: "QR Scanner",
    role: "scanner",
    avatar: "Q",
  },
  {
    id: "6",
    email: "customer@theaterhub.com",
    phone: "+251911234572",
    password: "customer123",
    name: "Regular Customer",
    role: "customer",
    avatar: "C",
  },
];

// Role definitions
const roles = [
  {
    id: "admin",
    name: "Administrator",
    icon: Shield,
    description: "Full system access",
    gradient: "from-red-500 to-pink-600",
    route: "/admin/dashboard",
    homeRoute: "/admin",
    color: "red",
    demoCredentials: "admin@theaterhub.com / admin123",
  },
  {
    id: "theater_owner",
    name: "Theater Owner",
    icon: Shield,
    description: "Manage theaters",
    gradient: "from-amber-500 to-yellow-500",
    route: "/owner/dashboard",
    homeRoute: "/owner",
    color: "amber",
    demoCredentials: "owner@theaterhub.com / owner123",
  },
  {
    id: "manager",
    name: "Theater Manager",
    icon: Shield,
    description: "Daily operations",
    gradient: "from-blue-500 to-cyan-500",
    route: "/manager/dashboard",
    homeRoute: "/manager",
    color: "blue",
    demoCredentials: "manager@theaterhub.com / manager123",
  },
  {
    id: "salesperson",
    name: "Salesperson",
    icon: Shield,
    description: "Ticket sales",
    gradient: "from-green-500 to-emerald-500",
    route: "/sales/dashboard",
    homeRoute: "/sales",
    color: "green",
    demoCredentials: "sales@theaterhub.com / sales123",
  },
  {
    id: "scanner",
    name: "QR Scanner",
    icon: Shield,
    description: "Validate tickets",
    gradient: "from-gray-600 to-slate-700",
    route: "/scanner/dashboard",
    homeRoute: "/scanner",
    color: "gray",
    demoCredentials: "scanner@theaterhub.com / scanner123",
  },
  {
    id: "customer",
    name: "Customer",
    icon: Shield,
    description: "Browse and purchase tickets",
    gradient: "from-indigo-500 to-violet-500",
    route: "/customer/dashboard",
    homeRoute: "/",
    color: "indigo",
    demoCredentials: "customer@theaterhub.com / customer123",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loginError, setLoginError] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
    );
    if (user) {
      const roleData = roles.find((r) => r.id === user.role);
      if (roleData) {
        navigate(roleData.route);
      }
    }
  }, [navigate]);

  // Validate form using Yup
  const validateForm = async (field: string | null = null) => {
    try {
      const schema = loginSchemas[authMethod as keyof typeof loginSchemas];
      const data =
        authMethod === "email" ? { email, password } : { phone, password };

      await schema.validate(data, { abortEarly: false });

      if (field) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      } else {
        setErrors({});
      }
      return true;
    } catch (err: any) {
      const validationErrors: Record<string, string> = {};
      if (err.inner) {
        err.inner.forEach((error: any) => {
          validationErrors[error.path] = error.message;
        });
      }

      if (field) {
        setErrors((prev) => ({
          ...prev,
          [field]: validationErrors[field] || "",
        }));
      } else {
        setErrors(validationErrors);
      }
      return false;
    }
  };

  // Handle login with mock data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      try {
        const loginValue = authMethod === "email" ? email : phone;

        // Find user in mock data
        let user = null;
        if (authMethod === "email") {
          user = mockUsers.find(
            (u) => u.email === loginValue && u.password === password,
          );
        } else {
          user = mockUsers.find(
            (u) => u.phone === loginValue && u.password === password,
          );
        }

        if (user) {
          const userData = {
            id: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            name: user.name,
            token: `mock-token-${user.id}-${Date.now()}`,
            loggedIn: true,
            loginTime: new Date().toISOString(),
            lastActive: new Date().toISOString(),
          };

          if (rememberMe) {
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", userData.token);
          } else {
            sessionStorage.setItem("user", JSON.stringify(userData));
            sessionStorage.setItem("token", userData.token);
          }

          const roleData = roles.find((r) => r.id === user.role);
          if (roleData) {
            navigate(roleData.route);
          } else {
            navigate("/");
          }
        } else {
          setLoginError("Invalid email/phone or password");
        }
      } catch (error) {
        console.error("Login error:", error);
        setLoginError("Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 800); // Simulate network delay
  };

  const handleBlur = async (field: string) => {
    setTouched({ ...touched, [field]: true });
    await validateForm(field);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light to-white to-deepTeal/5 dark:from-dark dark:via-gray-900 dark:to-deepBlue/30 transition-colors duration-300">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full px-4 sm:px-6 py-8 sm:py-12"
      >
        {/* Login Form Card - Responsive Width */}
        <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <motion.div
            variants={itemVariants}
            className="bg-white/95 dark:bg-dark/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="p-5 sm:p-6 md:p-8">
              {/* Header */}
              <div className="mb-6 sm:mb-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 bg-deepTeal rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4"
                >
                  <LogIn className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                </motion.div>

                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                >
                  Welcome Back
                </motion.h2>

                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 sm:mt-2"
                >
                  Sign in to continue to your dashboard
                </motion.p>
              </div>

              {/* Demo Credentials Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 p-3 bg-deepTeal/10 dark:bg-deepTeal/20 rounded-xl border border-deepTeal/20"
              >
                <p className="text-xs font-semibold text-deepTeal dark:text-skyTeal mb-2 text-center">
                  Demo Credentials:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full bg-${role.color}-500`}
                      ></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {role.demoCredentials}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Login Error */}
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-2.5 sm:p-3 bg-error-bg dark:bg-error/20 border border-error/20 rounded-xl flex items-center gap-2 text-error"
                >
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm">{loginError}</p>
                </motion.div>
              )}

              {/* Auth Method Tabs */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex bg-gray-100 dark:bg-dark/50 rounded-xl p-1 mb-5 sm:mb-6"
              >
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("email");
                    setErrors({});
                    setTouched({});
                    setLoginError("");
                  }}
                  className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                    authMethod === "email"
                      ? "bg-white dark:bg-dark text-deepTeal shadow-lg"
                      : "text-gray-500 dark:text-gray-400 hover:text-deepTeal"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("phone");
                    setErrors({});
                    setTouched({});
                    setLoginError("");
                  }}
                  className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                    authMethod === "phone"
                      ? "bg-white dark:bg-dark text-deepTeal shadow-lg"
                      : "text-gray-500 dark:text-gray-400 hover:text-deepTeal"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Phone</span>
                </button>
              </motion.div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Email/Phone Field */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {authMethod === "email" ? (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                        Email Address <span className="text-error">*</span>
                      </label>
                      <div className="relative group">
                        <Mail
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 ${
                            focusedField === "email"
                              ? "text-deepTeal"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={async (e) => {
                            setEmail(e.target.value);
                            setLoginError("");
                            if (errors.email || touched.email) {
                              await validateForm("email");
                            }
                          }}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => {
                            setFocusedField(null);
                            handleBlur("email");
                          }}
                          className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm bg-gray-50 dark:bg-dark border-2 rounded-xl outline-none transition-all duration-300 ${
                            errors.email
                              ? "border-error focus:ring-4 focus:ring-error-bg"
                              : focusedField === "email"
                                ? "border-deepTeal ring-4 ring-deepTeal/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-deepTeal"
                          } dark:text-white`}
                          placeholder="you@example.com"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] sm:text-xs text-error mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />{" "}
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                        Phone Number <span className="text-error">*</span>
                      </label>
                      <div className="relative group">
                        <Smartphone
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 ${
                            focusedField === "phone"
                              ? "text-deepTeal"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type="tel"
                          value={phone}
                          onChange={async (e) => {
                            setPhone(e.target.value);
                            setLoginError("");
                            if (errors.phone || touched.phone) {
                              await validateForm("phone");
                            }
                          }}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => {
                            setFocusedField(null);
                            handleBlur("phone");
                          }}
                          className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm bg-gray-50 dark:bg-dark border-2 rounded-xl outline-none transition-all duration-300 ${
                            errors.phone
                              ? "border-error focus:ring-4 focus:ring-error-bg"
                              : focusedField === "phone"
                                ? "border-deepTeal ring-4 ring-deepTeal/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-deepTeal"
                          } dark:text-white`}
                          placeholder="+251911234567"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] sm:text-xs text-error mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />{" "}
                          {errors.phone}
                        </motion.p>
                      )}
                      {!errors.phone && phone && (
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                          Format: 251911234567 or +251911234567
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
                    Password <span className="text-error">*</span>
                  </label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 ${
                        focusedField === "password"
                          ? "text-deepTeal"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={async (e) => {
                        setPassword(e.target.value);
                        setLoginError("");
                        if (errors.password || touched.password) {
                          await validateForm("password");
                        }
                      }}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => {
                        setFocusedField(null);
                        handleBlur("password");
                      }}
                      className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm bg-gray-50 dark:bg-dark border-2 rounded-xl outline-none transition-all duration-300 ${
                        errors.password
                          ? "border-error focus:ring-4 focus:ring-error-bg"
                          : focusedField === "password"
                            ? "border-deepTeal ring-4 ring-deepTeal/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-deepTeal"
                      } dark:text-white`}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-deepTeal transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Remember Me & Forgot Password */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3"
                >
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 group-hover:border-deepTeal ${
                        rememberMe
                          ? "bg-deepTeal border-deepTeal group-hover:bg-deepTeal group-hover:border-deepTeal"
                          : "border-gray-300 dark:border-gray-600 group-hover:border-deepTeal"
                      }`}
                    >
                      {rememberMe && (
                        <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                      )}
                    </div>
                    <span className="ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 group-hover:text-deepTeal transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm text-deepTeal hover:text-deepTeal font-medium flex items-center gap-1 transition-colors justify-center"
                  >
                    <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    Forgot Password?
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2.5 sm:py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group ${
                      isLoading
                        ? "bg-deepTeal/50 cursor-not-allowed"
                        : "bg-deepTeal hover:bg-deepTeal hover:shadow-2xl hover:shadow-deepTeal/30 hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-sm sm:text-base">
                          Signing in...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm sm:text-base">Sign In</span>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <p className="text-[10px] sm:text-xs text-center text-gray-500 dark:text-gray-400">
                  By signing in, you agree to our{" "}
                  <a
                    href="terms"
                    className="text-deepTeal hover:text-deepTeal hover:underline transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="privacy"
                    className="text-deepTeal hover:text-deepTeal hover:underline transition-colors"
                  >
                    Privacy Policy
                  </a>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
