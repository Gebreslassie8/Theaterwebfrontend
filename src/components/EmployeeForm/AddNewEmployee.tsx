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
  Coins,
} from "lucide-react";
import * as Yup from "yup";
import supabase from "@/config/supabaseClient";

// Form validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  assignedRole: Yup.string().required("Role is required"),
  salary: Yup.number()
    .min(0, "Salary cannot be negative")
    .typeError("Salary must be a number"),
});

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

interface FieldConfig {
  name: string;
  type: "text" | "email" | "tel" | "password" | "select" | "number";
  label: string;
  placeholder: string;
  required: boolean;
  icon: React.ReactNode;
  colSpan: number;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  options?: Array<{ value: string; label: string }>;
}

const getFields = (
  roles: any[],
  showPassword: boolean,
  setShowPassword: (value: boolean) => void,
  isEditMode: boolean,
): FieldConfig[] => {
  const fields: FieldConfig[] = [
    {
      name: "name",
      type: "text",
      label: "Full Name",
      placeholder: "Enter full name",
      required: true,
      icon: React.createElement(User, { size: 16 }),
      colSpan: 1,
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      placeholder: "Enter email address",
      required: true,
      icon: React.createElement(Mail, { size: 16 }),
      colSpan: 1,
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone Number",
      placeholder: "Enter phone number",
      required: true,
      icon: React.createElement(Phone, { size: 16 }),
      colSpan: 1,
    },
  ];

  // Only show password field in create mode
  if (!isEditMode) {
    fields.push({
      name: "password",
      type: showPassword ? "text" : "password",
      label: "Password",
      placeholder: "Enter password",
      required: true,
      icon: React.createElement(Shield, { size: 16 }),
      rightIcon: showPassword
        ? React.createElement(EyeOff, { size: 18 })
        : React.createElement(Eye, { size: 18 }),
      onRightIconClick: () => setShowPassword(!showPassword),
      colSpan: 1,
    });
  }

  fields.push(
    {
      name: "assignedRole",
      type: "select",
      label: "Role",
      placeholder: "Select a role",
      required: true,
      options: roles.map((r: any) => ({ value: r.id, label: r.label })),
      icon: React.createElement(Briefcase, { size: 16 }),
      colSpan: 1,
    },
    {
      name: "salary",
      type: "number",
      label: "Salary (ETB)",
      placeholder: "Enter salary in Birr",
      required: true,
      icon: React.createElement(Coins, { size: 16 }),
      colSpan: 1,
    },
  );

  return fields;
};

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
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    assignedRole: "",
    salary: "",
  });

  // Generate unique employee ID for new employees
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
      const newRandom = Math.floor(Math.random() * 10000);
      employeeId = `EMP-${timestamp}-${newRandom}`;
    }
    return employeeId;
  };

  // Generate unique username from full name
  const generateUniqueUsername = async (fullName: string): Promise<string> => {
    const nameParts = fullName.toLowerCase().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join("") || "";
    const baseUsername = `${firstName}.${lastName}`.replace(/[^a-z0-9.]/g, "");
    let username = baseUsername;
    let counter = 1;

    while (true) {
      const { data } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (!data) break;
      username = `${baseUsername}${counter}`;
      counter++;
    }
    return username;
  };

  // Populate form with edit data when in edit mode
  useEffect(() => {
    if (isOpen && isEdit && editData) {
      console.log("Populating edit form with:", editData);
      setFormValues({
        name: editData.name || "",
        email: editData.email || "",
        phone: editData.phone || "",
        password: "",
        assignedRole: editData.assignedRole || "",
        salary: editData.salary?.toString() || "",
      });
    } else if (isOpen && !isEdit) {
      // Reset form for new employee
      setFormValues({
        name: "",
        email: "",
        phone: "",
        password: "",
        assignedRole: "",
        salary: "",
      });
    }
  }, [isOpen, isEdit, editData]);

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setShowPassword(false);
      setResetTrigger((prev) => prev + 1);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any,
  ) => {
    setIsSubmitting(true);

    try {
      if (isEdit && editData) {
        // UPDATE MODE - Update existing employee
        const updateData: any = {
          full_name: values.name,
          email: values.email.toLowerCase(),
          phone: values.phone,
          role: values.assignedRole,
          salary: parseFloat(values.salary),
          updated_at: new Date().toISOString(),
        };

        // Only update password if provided
        if (values.password && values.password.trim() !== "") {
          updateData.password = values.password;
        }

        // Update users table
        const { error: userError } = await supabase
          .from("users")
          .update(updateData)
          .eq("id", editData.id);

        if (userError) throw userError;

        // Update employees table
        const { error: employeeError } = await supabase
          .from("employees")
          .update({
            employee_role: values.assignedRole,
            salary: parseFloat(values.salary),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", editData.id);

        if (employeeError) throw employeeError;

        await onSubmit(values);
      } else {
        // CREATE MODE - Add new employee
        // Check if email already exists
        const { data: existingEmail } = await supabase
          .from("users")
          .select("email")
          .eq("email", values.email.toLowerCase())
          .maybeSingle();

        if (existingEmail) {
          throw new Error(`Email ${values.email} is already registered.`);
        }

        // Check if phone already exists
        const { data: existingPhone } = await supabase
          .from("users")
          .select("phone")
          .eq("phone", values.phone)
          .maybeSingle();

        if (existingPhone) {
          throw new Error(
            `Phone number ${values.phone} is already registered.`,
          );
        }

        const username = await generateUniqueUsername(values.name);
        const employeeId = await generateUniqueEmployeeId();

        // Insert into users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert({
            full_name: values.name,
            username: username,
            email: values.email.toLowerCase(),
            phone: values.phone,
            password: values.password,
            role: values.assignedRole,
            status: "active",
            salary: parseFloat(values.salary),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (userError) throw userError;

        // Insert into employees table
        const { error: employeeError } = await supabase
          .from("employees")
          .insert({
            employee_id: employeeId,
            user_id: userData.id,
            theater_id: theaterId,
            employee_role: values.assignedRole,
            is_active: true,
            salary: parseFloat(values.salary),
            hire_date: new Date().toISOString().split("T")[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (employeeError) throw employeeError;

        await onSubmit(values);
      }

      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error saving employee:", error);
      alert(
        `Failed to ${isEdit ? "update" : "add"} employee: ${error.message}`,
      );
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const fields = getFields(roles, showPassword, setShowPassword, isEdit);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleCancel}
    >
      <motion.div
        key={resetTrigger}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEdit ? "Edit Employee" : "Add New Employee"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isEdit
                  ? "Update employee information below"
                  : "Fill in the employee information below"}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const values = {
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                password: (formData.get("password") as string) || "",
                assignedRole: formData.get("assignedRole") as string,
                salary: formData.get("salary") as string,
              };

              if (
                !values.name ||
                !values.email ||
                !values.phone ||
                !values.assignedRole ||
                !values.salary
              ) {
                alert("Please fill in all required fields");
                return;
              }

              if (!isEdit && !values.password) {
                alert("Password is required for new employees");
                return;
              }

              handleSubmit(values, {
                setSubmitting: () => {},
                resetForm: () => {},
              });
            }}
          >
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
                        name={field.name}
                        defaultValue={
                          formValues[field.name as keyof typeof formValues] ||
                          ""
                        }
                        required={field.required}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
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
                        type={
                          field.type === "password" && showPassword
                            ? "text"
                            : field.type
                        }
                        name={field.name}
                        placeholder={field.placeholder}
                        defaultValue={
                          formValues[field.name as keyof typeof formValues]
                        }
                        required={field.required}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    )}
                    {field.rightIcon && field.onRightIconClick && (
                      <button
                        type="button"
                        onClick={field.onRightIconClick}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {field.rightIcon}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200 mt-4 -mb-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
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
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddNewEmployee;