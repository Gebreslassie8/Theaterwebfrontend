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
import ReusableForm from "../components/Reusable/ReusableForm";
import ReusableButton from "../components/Reusable/ReusableButton";
import SuccessPopup from "../components/Reusable/SuccessPopup";
import apiService from "../services/api.service";
import type { Field } from "../components/Reusable/ReusableForm";

// Validation Schema
const RegistrationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9+\-\s()]{10,15}$/, "Please enter a valid phone number"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username is too long")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .optional(),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and number",
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  agreeToTerms: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions",
  ),
});

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const CustomerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: any,
  ) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Generate username from email if not provided
      const username = values.username || values.email.split("@")[0];

      // Prepare registration data for backend with DEFAULT ROLE = 'customer'
      const registrationData = {
        email: values.email,
        phone: values.phone,
        full_name: values.fullName,
        username: username,
        password: values.password,
        role: "customer", // This will map to user_rol enum in Supabase
        status: "active", // Default status
      };

      // Call backend API
      const response = await apiService.registerCustomer(registrationData);

      if (response.success) {
        // Store user data (excluding password)
        const { password, ...userWithoutPassword } = response.data;
        localStorage.setItem(
          "theater_user",
          JSON.stringify(userWithoutPassword),
        );

        // Show success popup
        setShowSuccess(true);
        resetForm();
        setAgreeToTerms(false);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/login", {
            state: { message: "Registration successful! Please login." },
          });
        }, 2000);
      } else {
        setErrorMessage(
          response.error || "Registration failed. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const formFields: Field[] = [
    {
      name: "fullName",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      icon: <User className="h-4 w-4" />,
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email",
      required: true,
      icon: <Mail className="h-4 w-4" />,
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone Number",
      placeholder: "+251 911 234 567",
      required: true,
      icon: <Phone className="h-4 w-4" />,
    },
    {
      name: "username",
      type: "text",
      label: "Username (Optional)",
      placeholder: "Choose a username",
      required: false,
      icon: <User className="h-4 w-4" />,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      label: "Password",
      placeholder: "Create a password",
      required: true,
      icon: showPassword ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      ),
      onIconClick: () => setShowPassword(!showPassword),
    },
    {
      name: "confirmPassword",
      type: showConfirmPassword ? "text" : "password",
      label: "Confirm Password",
      placeholder: "Confirm your password",
      required: true,
      icon: showConfirmPassword ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      ),
      onIconClick: () => setShowConfirmPassword(!showConfirmPassword),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
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
            Create Account
          </h1>
          <p className="text-gray-500">
            Join Theatre Hub Ethiopia and start your journey
          </p>
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
          <ReusableForm
            id="customer-registration-form"
            fields={formFields}
            onSubmit={handleSubmit}
            initialValues={{
              fullName: "",
              email: "",
              phone: "",
              username: "",
              password: "",
              confirmPassword: "",
              agreeToTerms: false,
            }}
            validationSchema={RegistrationSchema}
            render={(formik) => (
              <div className="space-y-5">
                {/* Password Requirements */}
                {formik.values.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs space-y-1 p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium text-gray-700 mb-1">
                      Password must contain:
                    </p>
                    <div className="flex items-center gap-2">
                      {formik.values.password.length >= 8 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                      <span
                        className={
                          formik.values.password.length >= 8
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/(?=.*[a-z])/.test(formik.values.password) ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                      <span
                        className={
                          /(?=.*[a-z])/.test(formik.values.password)
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        Lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/(?=.*[A-Z])/.test(formik.values.password) ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                      <span
                        className={
                          /(?=.*[A-Z])/.test(formik.values.password)
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        Uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/(?=.*\d)/.test(formik.values.password) ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                      <span
                        className={
                          /(?=.*\d)/.test(formik.values.password)
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        Number
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      formik.setFieldValue("agreeToTerms", e.target.checked);
                    }}
                    className="mt-1 w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-gray-600"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-teal-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-teal-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <ReusableButton
                  type="submit"
                  variant="primary"
                  isLoading={formik.isSubmitting || isLoading}
                  disabled={!agreeToTerms}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                >
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                </ReusableButton>

                {/* Sign In Link */}
                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-teal-600 font-medium hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          />
        </motion.div>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
        title="Registration Successful!"
        message="Welcome to Theatre Hub! Redirecting to login page..."
        duration={3000}
        position="top-right"
      />
    </div>
  );
};

export default CustomerRegistration;