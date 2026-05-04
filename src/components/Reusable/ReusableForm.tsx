// src/components/Reusable/ReusableForm.tsx
import { useFormik } from "formik";
import { useState, ReactNode, ReactElement, useEffect } from "react";
import * as Yup from "yup";
import Colors from "./Colors";

// Types
export interface FieldOption {
  value: string;
  label: string;
}

export interface Field {
  name: string;
  type: "text" | "email" | "password" | "select" | "radio" | "checkbox" | "file" | "textarea" | "number" | "tel";
  label: string;
  placeholder?: string;
  icon?: ReactElement;
  rightIcon?: ReactElement;
  onRightIconClick?: () => void;
  options?: FieldOption[];
  accept?: string;
  rows?: number;
  colSpan?: number;
  required?: boolean;
  autoComplete?: string;
}

export interface ReusableFormProps {
  id: string;
  fields: Field[];
  onSubmit: (values: any, formikHelpers: any) => void;
  initialValues: Record<string, any>;
  validationSchema: Yup.ObjectSchema<any>;
  columns?: 1 | 2;
  render?: (formik: ReturnType<typeof useFormik>) => ReactNode;
}

const ReusableForm: React.FC<ReusableFormProps> = ({
  id,
  fields,
  onSubmit,
  initialValues,
  validationSchema,
  columns = 1,
  render
}) => {
  const [previews, setPreviews] = useState<any>({});
  const [files, setFiles] = useState<any>({});

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      const hasFileField = fields.some((field) => field.type === "file");
      const finalValues = hasFileField ? { ...values, ...files } : values;
      onSubmit(finalValues, formikHelpers);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((preview: any) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFiles((prev: any) => ({ ...prev, [fieldName]: file }));
    const url = URL.createObjectURL(file);
    setPreviews((prev: any) => ({ ...prev, [fieldName]: { url, type: file.type } }));
    formik.setFieldValue(fieldName, file.name);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    if (formik.touched[fieldName] && formik.errors[fieldName]) {
      return formik.errors[fieldName] as string;
    }
    return undefined;
  };

  const inputStyles = {
    backgroundColor: Colors.lightGray,
    color: Colors.gray,
    borderColor: Colors.mediumGray,
  };

  const labelStyles = {
    color: Colors.smokyGray,
  };

  const errorStyles = {
    color: Colors.error,
  };

  const renderField = (field: Field) => {
    const hasLeftIcon = !!field.icon;
    const hasRightIcon = !!field.rightIcon;
    const error = getFieldError(field.name);
    const isTouched = formik.touched[field.name];
    const value = formik.values[field.name] === undefined ? '' : formik.values[field.name];
    
    // Set autoComplete based on field type to prevent browser autofill
    let autoCompleteValue = field.autoComplete || "off";
    if (field.type === "email") {
      autoCompleteValue = "new-password"; // Prevents email autofill
    } else if (field.type === "password") {
      autoCompleteValue = "new-password"; // Prevents password autofill
    } else if (field.name === "username") {
      autoCompleteValue = "off";
    } else if (field.name === "phone") {
      autoCompleteValue = "off";
    } else if (field.name === "name") {
      autoCompleteValue = "off";
    }

    return (
      <div key={field.name} className="flex flex-col mb-4">
        <label
          htmlFor={field.name}
          className="font-normal font-[sans-serif] text-base mb-1"
          style={labelStyles}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Text, Email, Password, Tel, Number Inputs */}
        {["text", "email", "password", "tel", "number"].includes(field.type) && (
          <div className="relative">
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete={autoCompleteValue}
              className={`w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-deepTeal/50 transition-all py-2 ${
                hasLeftIcon ? 'pl-10' : 'px-4'
              } ${hasRightIcon ? 'pr-10' : 'px-4'}`}
              style={inputStyles}
            />
            {hasLeftIcon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: Colors.mediumGray }}>
                {field.icon}
              </div>
            )}
            {hasRightIcon && (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:opacity-70 transition"
                onClick={field.onRightIconClick}
                style={{ color: Colors.mediumGray }}
              >
                {field.rightIcon}
              </button>
            )}
          </div>
        )}

        {/* Textarea */}
        {field.type === "textarea" && (
          <textarea
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            value={value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="off"
            className="border p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-deepTeal/50 transition-all resize-vertical"
            style={inputStyles}
          />
        )}

        {/* File Upload */}
        {field.type === "file" && (
          <div className="relative flex flex-col">
            <input
              id={field.name}
              type="file"
              accept={field.accept || "image/*,application/pdf"}
              onChange={(e) => handleFileChange(e, field.name)}
              autoComplete="off"
              className="border p-2 rounded-xl w-full cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-deepTeal file:text-white hover:file:bg-deepTeal/80 transition"
              style={inputStyles}
            />
            {previews[field.name] && (
              <div className="mt-3">
                <p className="text-sm mb-1" style={{ color: Colors.smokyGray }}>Preview</p>
                {previews[field.name].type === "application/pdf" ? (
                  <iframe src={previews[field.name].url} className="w-full h-64 border rounded-xl" title="PDF Preview" />
                ) : (
                  <img src={previews[field.name].url} alt="Preview" className="max-h-60 rounded-xl shadow object-cover" />
                )}
              </div>
            )}
          </div>
        )}

        {/* Select Dropdown */}
        {field.type === "select" && field.options && (
          <select
            id={field.name}
            name={field.name}
            value={value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-deepTeal/50 transition-all cursor-pointer"
            style={inputStyles}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Error Message */}
        {error && isTouched && (
          <span className="text-red-500 text-sm mt-1 animate-fadeIn" style={errorStyles}>
            {error}
          </span>
        )}
      </div>
    );
  };

  const renderFieldsInGrid = () => {
    const rows: Field[][] = [];
    let currentRow: Field[] = [];
    let currentSpan = 0;

    fields.forEach((field) => {
      const span = field.colSpan || 1;
      if (currentSpan + span > 2 && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
        currentSpan = 0;
      }
      currentRow.push(field);
      currentSpan += span;
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-2 gap-4">
        {row.map((field) => (
          <div key={field.name} className={`col-span-${field.colSpan || 1}`}>
            {renderField(field)}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <form id={id} onSubmit={formik.handleSubmit} className="space-y-4 w-full">
      {columns === 2 ? renderFieldsInGrid() : fields.map((field) => renderField(field))}
      {render && render(formik)}
    </form>
  );
};

export default ReusableForm;