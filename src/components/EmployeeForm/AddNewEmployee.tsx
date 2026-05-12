// frontend/src/components/EmployeeForm/AddNewEmployee.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  UserPlus,
  User,
  Mail,
  Phone,
  Briefcase,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Edit,
  CheckCircle,
} from "lucide-react";
import * as Yup from "yup";
import supabase from "@/config/supabaseClient";

interface AddNewEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  roles: Array<{ id: string; label: string }>;
  editData?: any;
  isEdit?: boolean;
  theaterId?: string | null;
  currentUserRole?: string;
}

const createValidationSchema = (isEditMode: boolean) =>
  Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9+\s-]+$/, "Invalid phone number format"),
    assignedRole: Yup.string().required("Role is required"),
    password: Yup.string().when([], {
      is: () => !isEditMode,
      then: (schema) =>
        schema
          .required("Password is required")
          .min(6, "Password must be at least 6 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),
    confirmPassword: Yup.string().when(["password"], {
      is: (password: string) => password && password.length > 0,
      then: (schema) =>
        schema
          .required("Please confirm your password")
          .oneOf([Yup.ref("password")], "Passwords must match"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

const AddNewEmployee: React.FC<AddNewEmployeeProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roles,
  editData = null,
  isEdit = false,
  theaterId = null,
  currentUserRole = "theater_owner",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    assignedRole: "",
  });

  const validationSchema = createValidationSchema(isEdit);

  const generateUniqueEmployeeId = async (): Promise<string> => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    let employeeId = `EMP-${timestamp}-${random}`;

    while (true) {
      const { data } = await supabase
        .from("employees")
        .select("employee_id")
        .eq("employee_id", employeeId)
        .maybeSingle();
      if (!data) break;
      employeeId = `EMP-${timestamp}-${Math.floor(Math.random() * 10000)}`;
    }
    return employeeId;
  };

  const generateUniqueUsername = async (fullName: string): Promise<string> => {
    const parts = fullName.toLowerCase().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join("") || "";
    const base = `${firstName}.${lastName}`.replace(/[^a-z0-9.]/g, "");
    let username = base;
    let counter = 1;

    while (true) {
      const { data } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle();
      if (!data) break;
      username = `${base}${counter++}`;
    }
    return username;
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setErrors({});

      if (isEdit && editData) {
        setFormValues({
          name: editData.name || "",
          email: editData.email || "",
          phone: editData.phone || "",
          password: "",
          confirmPassword: "",
          assignedRole: editData.assignedRole || "",
        });
      } else {
        setFormValues({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          assignedRole: "",
        });
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isEdit, editData]);

  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors: Record<string, string> = {};
      err.inner.forEach((error: any) => {
        if (error.path) newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!(await validateForm())) return;
    setIsSubmitting(true);

    try {
      if (isEdit && editData) {
        // UPDATE MODE
        const updateData: any = {
          full_name: formValues.name,
          email: formValues.email.toLowerCase(),
          phone: formValues.phone,
          role: formValues.assignedRole,
          updated_at: new Date().toISOString(),
        };

        if (formValues.password?.trim()) {
          updateData.password = formValues.password;
        }

        // Update users table
        const { error: userError } = await supabase
          .from("users")
          .update(updateData)
          .eq("id", editData.id);
        if (userError) throw userError;

        // Update employees table
        const { error: empError } = await supabase
          .from("employees")
          .update({
            employee_role: formValues.assignedRole,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", editData.id);
        if (empError) throw empError;

        await onSubmit(formValues);
      } else {
        // CREATE MODE
        // Check for existing email
        const { data: existingEmail } = await supabase
          .from("users")
          .select("email")
          .eq("email", formValues.email.toLowerCase())
          .maybeSingle();
        if (existingEmail) {
          throw new Error(`Email ${formValues.email} is already registered`);
        }

        // Check for existing phone
        const { data: existingPhone } = await supabase
          .from("users")
          .select("phone")
          .eq("phone", formValues.phone)
          .maybeSingle();
        if (existingPhone) {
          throw new Error(
            `Phone number ${formValues.phone} is already registered`,
          );
        }

        // Generate unique identifiers
        const username = await generateUniqueUsername(formValues.name);
        const employeeId = await generateUniqueEmployeeId();

        // Insert into users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert({
            full_name: formValues.name,
            username,
            email: formValues.email.toLowerCase(),
            phone: formValues.phone,
            password: formValues.password,
            role: formValues.assignedRole,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        if (userError) throw userError;

        // Insert into employees table
        const { error: empError } = await supabase.from("employees").insert({
          employee_id: employeeId,
          user_id: userData.id,
          theater_id: theaterId,
          employee_role: formValues.assignedRole,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (empError) throw empError;

        await onSubmit(formValues);
      }

      onClose();
    } catch (error: any) {
      console.error("Error saving employee:", error);
      alert(error.message || `Failed to ${isEdit ? "update" : "add"} employee`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter roles based on user permissions
  const availableRoles =
    currentUserRole === "super_admin"
      ? roles
      : roles.filter((r) => r.id !== "super_admin" && r.id !== "theater_owner");

  // Field configuration
  const fields = [
    {
      name: "name",
      type: "text",
      label: "Full Name",
      placeholder: "Enter full name",
      required: true,
      icon: <User size={16} />,
      colSpan: 1,
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      placeholder: "Enter email",
      required: true,
      icon: <Mail size={16} />,
      colSpan: 1,
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone Number",
      placeholder: "Enter phone number",
      required: true,
      icon: <Phone size={16} />,
      colSpan: 1,
    },
    {
      name: "assignedRole",
      type: "select",
      label: "Role",
      placeholder: "Select a role",
      required: true,
      icon: <Briefcase size={16} />,
      colSpan: 1,
      options: availableRoles.map((r) => ({ value: r.id, label: r.label })),
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      label: "Password",
      placeholder: isEdit ? "Leave blank to keep current" : "Enter password",
      required: !isEdit,
      icon: <Lock size={16} />,
      colSpan: 1,
      rightIcon: showPassword ? <EyeOff size={18} /> : <Eye size={18} />,
      onRightIconClick: () => setShowPassword(!showPassword),
    },
    {
      name: "confirmPassword",
      type: showConfirmPassword ? "text" : "password",
      label: "Confirm Password",
      placeholder: "Confirm password",
      required: !isEdit,
      icon: <Shield size={16} />,
      colSpan: 1,
      rightIcon: showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />,
      onRightIconClick: () => setShowConfirmPassword(!showConfirmPassword),
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg">
              {isEdit ? (
                <Edit className="h-5 w-5 text-white" />
              ) : (
                <UserPlus className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isEdit ? "Edit Employee" : "Add New Employee"}
              </h2>
              <p className="text-xs text-gray-500">
                {isEdit
                  ? "Update employee information"
                  : "Fill in the employee information"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Info Banner */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                Fields marked with{" "}
                <span className="text-red-500 font-medium">*</span> are
                required. Username will be auto-generated from the full name.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {field.icon}
                  </div>

                  {field.type === "select" ? (
                    <select
                      value={
                        formValues[
                          field.name as keyof typeof formValues
                        ] as string
                      }
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={
                        formValues[
                          field.name as keyof typeof formValues
                        ] as string
                      }
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      required={field.required}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  )}

                  {field.rightIcon && (
                    <button
                      type="button"
                      onClick={field.onRightIconClick}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {field.rightIcon}
                    </button>
                  )}
                </div>
                {errors[field.name] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200 mt-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    {isEdit ? "Update Employee" : "Create Employee"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddNewEmployee;