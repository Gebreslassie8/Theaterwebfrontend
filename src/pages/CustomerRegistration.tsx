// frontend/src/pages/CustomerRegistration.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import * as Yup from "yup";
import SuccessPopup from "../components/Reusable/SuccessPopup";
import supabase from "@/config/supabaseClient";
import { useTranslation } from "react-i18next";

// Types
interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// Helper to create validation schema with translated messages
const getValidationSchema = (t: (key: string) => string) =>
  Yup.object({
    fullName: Yup.string()
      .required(t("customerRegistration.validation.fullNameRequired"))
      .min(3, t("customerRegistration.validation.fullNameMin"))
      .max(100, t("customerRegistration.validation.fullNameMax")),
    email: Yup.string()
      .required(t("customerRegistration.validation.emailRequired"))
      .email(t("customerRegistration.validation.emailInvalid")),
    phone: Yup.string()
      .required(t("customerRegistration.validation.phoneRequired"))
      .matches(
        /^[0-9+\-\s()]{10,15}$/,
        t("customerRegistration.validation.phoneInvalid")
      ),
    username: Yup.string()
      .required(t("customerRegistration.validation.usernameRequired"))
      .min(3, t("customerRegistration.validation.usernameMin"))
      .max(50, t("customerRegistration.validation.usernameMax"))
      .matches(
        /^[a-zA-Z0-9_]+$/,
        t("customerRegistration.validation.usernamePattern")
      ),
    password: Yup.string()
      .required(t("customerRegistration.validation.passwordRequired"))
      .min(8, t("customerRegistration.validation.passwordMin"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t("customerRegistration.validation.passwordStrength")
      ),
    confirmPassword: Yup.string()
      .required(t("customerRegistration.validation.confirmPasswordRequired"))
      .oneOf([Yup.ref("password")], t("customerRegistration.validation.passwordsMatch")),
    agreeToTerms: Yup.boolean().oneOf(
      [true],
      t("customerRegistration.validation.agreeToTermsRequired")
    ),
  });

const CustomerRegistration: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formValues, setFormValues] = useState<FormValues>({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation schema with current t function
  const RegistrationSchema = getValidationSchema(t);

  // Check if username already exists
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    const { data } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .maybeSingle();
    return !!data;
  };

  // Generate a unique username if the chosen one is taken
  const generateUniqueUsername = async (
    baseUsername: string
  ): Promise<string> => {
    let username = baseUsername;
    let counter = 1;

    while (await checkUsernameExists(username)) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  };

  // Validate a single field
  const validateField = async (field: keyof FormValues, value: any) => {
    try {
      await RegistrationSchema.validateAt(field, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
      return false;
    }
  };

  // Handle input change
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormValues((prev) => ({ ...prev, [name]: newValue }));

    if (touched[name]) {
      await validateField(name as keyof FormValues, newValue);
    }
  };

  // Handle blur
  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    await validateField(name as keyof FormValues, newValue);
  };

  // Validate all fields
  const validateForm = async () => {
    try {
      await RegistrationSchema.validate(formValues, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors: Record<string, string> = {};
      err.inner.forEach((error: any) => {
        if (error.path) {
          newErrors[error.path] = error.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formValues).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Check if username already exists
      const usernameExists = await checkUsernameExists(formValues.username);
      let finalUsername = formValues.username;

      if (usernameExists) {
        finalUsername = await generateUniqueUsername(formValues.username);
      }

      // Check if email already exists
      const { data: existingEmail } = await supabase
        .from("users")
        .select("email")
        .eq("email", formValues.email.toLowerCase())
        .maybeSingle();

      if (existingEmail) {
        throw new Error(t("customerRegistration.errors.emailExists"));
      }

      // Check if phone already exists
      const { data: existingPhone } = await supabase
        .from("users")
        .select("phone")
        .eq("phone", formValues.phone)
        .maybeSingle();

      if (existingPhone) {
        throw new Error(t("customerRegistration.errors.phoneExists"));
      }

      // Insert into users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          email: formValues.email.toLowerCase(),
          phone: formValues.phone,
          full_name: formValues.fullName,
          username: finalUsername,
          password: formValues.password,
          role: "customer",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) throw userError;

      // Insert into customers table
      const { error: customerError } = await supabase
        .from("customers")
        .insert({
          user_id: userData.id,
          full_name: formValues.fullName,
          email: formValues.email.toLowerCase(),
          phone: formValues.phone,
          is_active: true,
          created_at: new Date().toISOString(),
        });

      if (customerError) throw customerError;

      // Show success message
      setShowSuccess(true);

      // Reset form
      setFormValues({
        fullName: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });
      setTouched({});
      setErrors({});

      // Redirect after 2.5 seconds
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: t("customerRegistration.success.redirectMessage"),
          },
        });
      }, 2500);
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrorMessage(
        error.message || t("customerRegistration.errors.unexpected")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Check password strength for visual feedback
  const getPasswordStrength = () => {
    const password = formValues.password;
    if (!password) return { strength: 0, color: "bg-gray-200", text: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;

    if (strength <= 2)
      return { strength, color: "bg-red-500", text: t("customerRegistration.passwordStrength.weak") };
    if (strength === 3)
      return { strength, color: "bg-yellow-500", text: t("customerRegistration.passwordStrength.medium") };
    return { strength, color: "bg-green-500", text: t("customerRegistration.passwordStrength.strong") };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 mb-4 shadow-lg">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("customerRegistration.title")}
          </h1>
          <p className="text-gray-500">{t("customerRegistration.subtitle")}</p>
        </motion.div>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("customerRegistration.form.fullName")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                    errors.fullName && touched.fullName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  placeholder={t("customerRegistration.form.fullNamePlaceholder")}
                  autoComplete="off"
                />
              </div>
              {errors.fullName && touched.fullName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email and Phone - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("customerRegistration.form.email")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                      errors.email && touched.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                    placeholder={t("customerRegistration.form.emailPlaceholder")}
                    autoComplete="off"
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("customerRegistration.form.phone")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                      errors.phone && touched.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                    placeholder={t("customerRegistration.form.phonePlaceholder")}
                    autoComplete="off"
                  />
                </div>
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("customerRegistration.form.username")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                    errors.username && touched.username
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  placeholder={t("customerRegistration.form.usernamePlaceholder")}
                  autoComplete="off"
                />
              </div>
              {errors.username && touched.username && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.username}
                </p>
              )}
              {formValues.username && !errors.username && touched.username && (
                <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />{" "}
                  {t("customerRegistration.usernameAvailable")}
                </p>
              )}
            </div>

            {/* Password and Confirm Password - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("customerRegistration.form.password")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                      errors.password && touched.password
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                    placeholder={t("customerRegistration.form.passwordPlaceholder")}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("customerRegistration.form.confirmPassword")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-4 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                    placeholder={t("customerRegistration.form.confirmPasswordPlaceholder")}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            {formValues.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-medium text-gray-700">
                    {t("customerRegistration.passwordStrength.title")}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{
                          width: `${(passwordStrength.strength / 4) * 100}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.strength <= 2
                          ? "text-red-600"
                          : passwordStrength.strength === 3
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    {formValues.password.length >= 8 ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                    <span
                      className={
                        formValues.password.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {t("customerRegistration.passwordRequirements.length")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/(?=.*[a-z])/.test(formValues.password) ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                    <span
                      className={
                        /(?=.*[a-z])/.test(formValues.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {t("customerRegistration.passwordRequirements.lowercase")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/(?=.*[A-Z])/.test(formValues.password) ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                    <span
                      className={
                        /(?=.*[A-Z])/.test(formValues.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {t("customerRegistration.passwordRequirements.uppercase")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/(?=.*\d)/.test(formValues.password) ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                    <span
                      className={
                        /(?=.*\d)/.test(formValues.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {t("customerRegistration.passwordRequirements.number")}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formValues.agreeToTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {t("customerRegistration.terms.prefix")}{" "}
                  <Link
                    to="/terms"
                    className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
                  >
                    {t("customerRegistration.terms.termsLink")}
                  </Link>{" "}
                  {t("customerRegistration.terms.and")}{" "}
                  <Link
                    to="/privacy"
                    className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
                  >
                    {t("customerRegistration.terms.privacyLink")}
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && touched.agreeToTerms && (
                <div className="flex items-center gap-2 text-red-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.agreeToTerms}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formValues.agreeToTerms}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  {t("customerRegistration.creatingAccount")}
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  {t("customerRegistration.createAccount")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {t("customerRegistration.alreadyHaveAccount")}{" "}
                <Link
                  to="/login"
                  className="text-teal-600 font-medium hover:underline"
                >
                  {t("customerRegistration.signInLink")}
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
        title={t("customerRegistration.success.title")}
        message={t("customerRegistration.success.message")}
        duration={3000}
      />
    </div>
  );
};

export default CustomerRegistration;