// Frontend/src/components/theater/TheaterRegistration.tsx
import supabase from "@/config/supabaseClient";
import React, { useState, useRef, ChangeEvent, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
  Theater,
  CreditCard,
  Lock,
  X,
  Loader2,
  Send,
  FileCheck,
  Receipt,
  Calendar,
  Wallet,
  ClipboardCheck,
  Ticket,
  Award,
  Star,
  UserPlus,
  User,
  FileSignature,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface FormData {
  // Step 1: Owner Account
  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerPassword: string;
  ownerConfirmPassword: string;

  // Step 2: Theater Information
  theaterName: string;
  businessType: string;
  businessLicenseNumber: string;
  taxId: string;
  yearsInOperation: string;
  city: string;
  region: string;
  fullAddress: string;
  theaterDescription: string;

  // Step 3: Documents
  documents: {
    businessLicense: File | null;
    taxCertificate: File | null;
    ownerIdCard: File | null;
  };

  // Step 4: Pricing & Terms
  pricingModel: string;
  contractType: string;
  agreedToTerms: boolean;
  agreedToNoRefund: boolean;
}

interface Errors {
  [key: string]: string;
}

// City-Region mapping
const CITY_REGION_MAP: Record<string, string[]> = {
  Oromia: ["Adama", "Jimma", "Bishoftu", "Ambo", "Shashamane", "Nekemte"],
  Amhara: ["Gondar", "Bahir Dar", "Dessie", "Debre Markos", "Lalibela"],
  Tigray: ["Mekelle", "Adwa", "Axum", "Shire"],
  Sidama: ["Hawassa", "Yirgalem", "Wendo"],
  Somali: ["Jijiga", "Gode", "Kebri Dahar"],
  Harari: ["Harar"],
  "Addis Ababa": ["Addis Ababa"],
  "Dire Dawa": ["Dire Dawa"],
  Afar: ["Semera", "Asayita"],
  "Benishangul-Gumuz": ["Assosa", "Metekel"],
  Gambela: ["Gambela"],
  "South West Ethiopia": ["Bonga", "Mizan Teferi"],
  "Southern Nations": ["Arba Minch", "Sodo", "Wolaita Sodo"],
};

// Get cities based on selected region
const getCitiesForRegion = (region: string): string[] => {
  return CITY_REGION_MAP[region] || [];
};

// All regions for selection
const REGIONS = Object.keys(CITY_REGION_MAP);

const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "LLC",
  "Corporation",
  "Non-Profit",
  "Government",
];
const YEARS_OPTIONS = [
  "Less than 1 year",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

const PRICING_MODELS = [
  {
    id: "per_ticket",
    name: "Per Ticket Selling",
    description: "Pay commission per ticket sold",
    icon: Ticket,
    rate: "5-10% commission per ticket",
  },
  {
    id: "subscription",
    name: "Subscription Plan",
    description: "Fixed monthly subscription",
    icon: Calendar,
    rate: "Starting from 6,000 ETB/month",
  },
];

const CONTRACT_TYPES = [
  {
    id: "monthly",
    name: "Monthly Plan",
    icon: Calendar,
    basePrice: 6000,
    features: [
      "No long-term commitment",
      "Cancel anytime",
      "Basic support included",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    icon: Award,
    basePrice: 8000,
    features: ["Save 15% vs monthly", "Priority support", "Marketing tools"],
  },
  {
    id: "yearly",
    name: "Yearly Plan",
    icon: Star,
    basePrice: 6000,
    features: [
      "Save 30% vs monthly",
      "24/7 dedicated support",
      "Advanced analytics",
    ],
  },
];

// ============================================
// STEP INDICATOR COMPONENT
// ============================================

const StepIndicator: React.FC<{
  currentStep: number;
  steps: { number: number; title: string; icon: React.ElementType }[];
}> = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex justify-between">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center flex-1 relative z-10"
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? "bg-teal-600 text-white shadow-lg" : ""}
                  ${isActive ? "bg-teal-600 text-white ring-4 ring-teal-200 dark:ring-teal-800 shadow-lg" : ""}
                  ${!isCompleted && !isActive ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400" : ""}
                `}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : ""}`} />
                )}
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span
                  className={`
                  text-xs font-medium transition-all duration-300
                  ${isActive ? "text-teal-600 dark:text-teal-400" : ""}
                  ${isCompleted ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}
                `}
                >
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// PASSWORD INPUT COMPONENT
// ============================================

const PasswordInput: React.FC<{
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  label: string;
}> = ({ name, value, onChange, placeholder, error, label }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// ============================================
// PHONE INPUT COMPONENT
// ============================================

const PhoneInput: React.FC<{
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}> = ({ value, onChange, error }) => {
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Allow only + and numbers
    if (val === "" || (val.startsWith("+") && /^\+?[0-9]*$/.test(val))) {
      onChange({
        ...e,
        target: { ...e.target, value: val, name: "ownerPhone" },
      });
    } else if (/^[0-9]*$/.test(val)) {
      onChange({
        ...e,
        target: { ...e.target, value: val, name: "ownerPhone" },
      });
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        Phone Number <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="tel"
          name="ownerPhone"
          value={value}
          onChange={handlePhoneChange}
          className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
          placeholder="+251 XXX XXX XXX"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const TheaterRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [formData, setFormData] = useState<FormData>({
    ownerFullName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerPassword: "",
    ownerConfirmPassword: "",
    theaterName: "",
    businessType: "",
    businessLicenseNumber: "",
    taxId: "",
    yearsInOperation: "",
    city: "",
    region: "",
    fullAddress: "",
    theaterDescription: "",
    documents: {
      businessLicense: null,
      taxCertificate: null,
      ownerIdCard: null,
    },
    pricingModel: "",
    contractType: "",
    agreedToTerms: false,
    agreedToNoRefund: false,
  });

  const steps = [
    { number: 1, title: "Owner Account", icon: UserPlus },
    { number: 2, title: "Theater Info", icon: Theater },
    { number: 3, title: "Documents", icon: FileCheck },
    { number: 4, title: "Pricing & Terms", icon: FileSignature },
  ];

  // Get available cities based on selected region
  const availableCities = formData.region
    ? getCitiesForRegion(formData.region)
    : [];

  const handleInputChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      // Clear city when region changes
      if (name === "region") {
        setFormData((prev) => ({ ...prev, city: "" }));
      }

      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
      if (duplicateError) setDuplicateError(null);
    },
    [errors, duplicateError],
  );

  const handleDocumentUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>, docType: string) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            [docType]: "File size must be less than 10MB",
          }));
          return;
        }
        setFormData((prev) => ({
          ...prev,
          documents: { ...prev.documents, [docType]: file },
        }));
        setErrors((prev) => ({ ...prev, [docType]: "" }));
      }
    },
    [],
  );

  const validateStep = useCallback((): boolean => {
    const newErrors: Errors = {};
    if (step === 1) {
      if (!formData.ownerFullName.trim())
        newErrors.ownerFullName = "Full name is required";
      if (!formData.ownerEmail.trim())
        newErrors.ownerEmail = "Email is required";
      else if (!formData.ownerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        newErrors.ownerEmail = "Please enter a valid email address";
      if (!formData.ownerPhone.trim())
        newErrors.ownerPhone = "Phone number is required";
      if (!formData.ownerPassword.trim())
        newErrors.ownerPassword = "Password is required";
      else if (formData.ownerPassword.length < 6)
        newErrors.ownerPassword = "Password must be at least 6 characters";
      if (!formData.ownerConfirmPassword.trim())
        newErrors.ownerConfirmPassword = "Please confirm your password";
      else if (formData.ownerPassword !== formData.ownerConfirmPassword)
        newErrors.ownerConfirmPassword = "Passwords do not match";
    } else if (step === 2) {
      if (!formData.theaterName.trim())
        newErrors.theaterName = "Theater name is required";
      if (!formData.businessType)
        newErrors.businessType = "Business type is required";
      if (!formData.businessLicenseNumber.trim())
        newErrors.businessLicenseNumber = "Business license number is required";
      if (!formData.taxId.trim()) newErrors.taxId = "Tax ID is required";
      if (!formData.yearsInOperation)
        newErrors.yearsInOperation = "Years in operation is required";
      if (!formData.region) newErrors.region = "Region is required";
      if (!formData.city) newErrors.city = "City is required";
      else if (
        availableCities.length > 0 &&
        !availableCities.includes(formData.city)
      ) {
        newErrors.city = `"${formData.city}" is not a valid city for the selected region. Please select from the list.`;
      }
      if (!formData.fullAddress.trim())
        newErrors.fullAddress = "Full address is required";
      if (!formData.theaterDescription.trim())
        newErrors.theaterDescription = "Theater description is required";
    } else if (step === 3) {
      if (!formData.documents.businessLicense)
        newErrors.businessLicense = "Business license is required";
      if (!formData.documents.taxCertificate)
        newErrors.taxCertificate = "Tax registration certificate is required";
      if (!formData.documents.ownerIdCard)
        newErrors.ownerIdCard = "Owner ID card is required";
    } else if (step === 4) {
      if (!formData.pricingModel)
        newErrors.pricingModel = "Please select a pricing model";
      if (formData.pricingModel === "subscription" && !formData.contractType)
        newErrors.contractType = "Please select a subscription plan";
      if (!formData.agreedToTerms)
        newErrors.terms =
          "You must confirm that the information provided is accurate";
      if (!formData.agreedToNoRefund)
        newErrors.noRefund = "You must acknowledge the no-refund policy";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, formData, availableCities]);

  const handleNext = useCallback(() => {
    if (validateStep()) setStep((prev) => prev + 1);
  }, [validateStep]);
  const handleBack = useCallback(() => setStep((prev) => prev - 1), []);

  // Check for duplicates before submission
  const checkDuplicates = useCallback(async () => {
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", formData.ownerEmail)
      .single();

    if (existingUser) {
      throw new Error(
        `Email "${formData.ownerEmail}" is already registered. Please use a different email.`,
      );
    }

    const { data: existingPhone } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", formData.ownerPhone)
      .single();

    if (existingPhone) {
      throw new Error(
        `Phone number "${formData.ownerPhone}" is already registered.`,
      );
    }

    const { data: existingLicense } = await supabase
      .from("theaters")
      .select("business_license_number")
      .eq("business_license_number", formData.businessLicenseNumber)
      .single();

    if (existingLicense) {
      throw new Error(
        `Business license number "${formData.businessLicenseNumber}" is already registered.`,
      );
    }

    const { data: existingTaxId } = await supabase
      .from("theaters")
      .select("tax_id")
      .eq("tax_id", formData.taxId)
      .single();

    if (existingTaxId) {
      throw new Error(`Tax ID "${formData.taxId}" is already registered.`);
    }

    return true;
  }, [formData]);

  // Create owner, theater, and contract
  const createRegistration = useCallback(async () => {
    await checkDuplicates();

    // Create user
    const userId = crypto.randomUUID();
    const { error: userError } = await supabase.from("users").insert({
      id: userId,
      email: formData.ownerEmail,
      phone: formData.ownerPhone,
      full_name: formData.ownerFullName,
      role: "theater_owner",
      status: "active",
    });

    if (userError)
      throw new Error(`Failed to create owner account: ${userError.message}`);

    // Create owner record
    const ownerId = crypto.randomUUID();
    const { error: ownerError } = await supabase.from("owners").insert({
      id: ownerId,
      user_id: userId,
      business_name: formData.theaterName,
      business_type: formData.businessType.toLowerCase().replace(/\s/g, "_"),
      years_of_experience: parseInt(formData.yearsInOperation) || 0,
      city: formData.city,
      physical_address: formData.fullAddress,
      verification_status: "pending",
    });

    if (ownerError)
      throw new Error(`Failed to create owner record: ${ownerError.message}`);

    // Upload documents
    const theaterId = crypto.randomUUID();
    let licenseDocUrl = null,
      taxDocUrl = null,
      ownerIdUrl = null;

    if (formData.documents.businessLicense) {
      const fileExt = formData.documents.businessLicense.name.split(".").pop();
      const { error } = await supabase.storage
        .from("documents")
        .upload(
          `${theaterId}_license.${fileExt}`,
          formData.documents.businessLicense,
        );
      if (!error) {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("documents")
          .getPublicUrl(`${theaterId}_license.${fileExt}`);
        licenseDocUrl = publicUrl;
      }
    }

    if (formData.documents.taxCertificate) {
      const fileExt = formData.documents.taxCertificate.name.split(".").pop();
      const { error } = await supabase.storage
        .from("documents")
        .upload(
          `${theaterId}_tax.${fileExt}`,
          formData.documents.taxCertificate,
        );
      if (!error) {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("documents")
          .getPublicUrl(`${theaterId}_tax.${fileExt}`);
        taxDocUrl = publicUrl;
      }
    }

    if (formData.documents.ownerIdCard) {
      const fileExt = formData.documents.ownerIdCard.name.split(".").pop();
      const { error } = await supabase.storage
        .from("documents")
        .upload(`${ownerId}_id.${fileExt}`, formData.documents.ownerIdCard);
      if (!error) {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("documents")
          .getPublicUrl(`${ownerId}_id.${fileExt}`);
        ownerIdUrl = publicUrl;
      }
    }

    // Create theater
    const { error: theaterError } = await supabase.from("theaters").insert({
      id: theaterId,
      legal_business_name: formData.theaterName,
      email: formData.ownerEmail,
      phone: formData.ownerPhone,
      business_type: formData.businessType,
      business_license_number: formData.businessLicenseNumber,
      license_document_url: licenseDocUrl,
      tax_id: formData.taxId,
      city: formData.city,
      address: formData.fullAddress,
      description: formData.theaterDescription,
      total_halls: 0,
      status: "pending",
      is_approved: false,
      owner_user_id: userId,
      country: "Ethiopia",
      subscription_status: "trial",
    });

    if (theaterError) {
      if (theaterError.code === "23505") {
        if (theaterError.message.includes("business_license_number")) {
          throw new Error(
            `Business license number "${formData.businessLicenseNumber}" is already registered.`,
          );
        }
        if (theaterError.message.includes("tax_id")) {
          throw new Error(`Tax ID "${formData.taxId}" is already registered.`);
        }
      }
      throw new Error(`Failed to create theater: ${theaterError.message}`);
    }

    // Create contract
    const contractNumber = `CTR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    let basePrice = 0;
    let paymentFrequency = null;
    let commissionRate = 10;

    if (formData.pricingModel === "per_ticket") {
      basePrice = 0;
      paymentFrequency = "per_ticket";
      commissionRate = 10;
    } else if (formData.pricingModel === "subscription") {
      if (formData.contractType === "monthly") basePrice = 6000;
      else if (formData.contractType === "quarterly") basePrice = 8000;
      else if (formData.contractType === "yearly") basePrice = 6000;
      paymentFrequency = formData.contractType;
      commissionRate = 0;
    }

    await supabase.from("owners_contracts").insert({
      owner_id: ownerId,
      theater_id: theaterId,
      contract_number: contractNumber,
      contract_type:
        formData.pricingModel === "per_ticket" ? "per_ticket" : "subscription",
      subscription_plan:
        formData.pricingModel === "subscription" ? formData.contractType : null,
      base_price: basePrice,
      discounted_price: null,
      discount_percent: 0,
      commission_rate: commissionRate,
      contract_start_date: new Date().toISOString().split("T")[0],
      payment_frequency: paymentFrequency,
      payment_status: "pending",
      status: "active",
      terms_accepted_at: new Date().toISOString(),
    });

    return { userId, ownerId, theaterId, contractNumber };
  }, [formData, checkDuplicates]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setDuplicateError(null);

    try {
      await createRegistration();
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";

      if (
        errorMessage.includes("already registered") ||
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate")
      ) {
        setDuplicateError(errorMessage);
      } else {
        setErrors((prev) => ({ ...prev, submit: errorMessage }));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [validateStep, createRegistration]);

  // Step 1: Create Owner Account
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
          <UserPlus className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create Owner Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your personal information to create your account
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ownerFullName"
            value={formData.ownerFullName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
            placeholder="Enter your full name"
          />
          {errors.ownerFullName && (
            <p className="text-xs text-red-500 mt-1">{errors.ownerFullName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
              placeholder="you@example.com"
            />
          </div>
          {errors.ownerEmail && (
            <p className="text-xs text-red-500 mt-1">{errors.ownerEmail}</p>
          )}
        </div>

        <PhoneInput
          value={formData.ownerPhone}
          onChange={handleInputChange}
          error={errors.ownerPhone}
        />

        <PasswordInput
          name="ownerPassword"
          value={formData.ownerPassword}
          onChange={handleInputChange}
          placeholder="Create a password (min 6 characters)"
          error={errors.ownerPassword}
          label="Password"
        />

        <PasswordInput
          name="ownerConfirmPassword"
          value={formData.ownerConfirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm your password"
          error={errors.ownerConfirmPassword}
          label="Confirm Password"
        />
      </div>
    </div>
  );

  // Step 2: Theater Information (Description at the end)
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
          <Theater className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Theater Information
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tell us about your theater business
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Theater Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="theaterName"
            value={formData.theaterName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
            placeholder="Enter your theater name"
          />
          {errors.theaterName && (
            <p className="text-xs text-red-500 mt-1">{errors.theaterName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 dark:bg-gray-800/50 dark:text-white transition-all"
          >
            <option value="">Select Business Type</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="text-xs text-red-500 mt-1">{errors.businessType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Business License Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="businessLicenseNumber"
            value={formData.businessLicenseNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
            placeholder="Enter a UNIQUE business license number"
          />
          {errors.businessLicenseNumber && (
            <p className="text-xs text-red-500 mt-1">
              {errors.businessLicenseNumber}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Tax ID / TIN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="taxId"
            value={formData.taxId}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
            placeholder="Enter a UNIQUE Tax ID"
          />
          {errors.taxId && (
            <p className="text-xs text-red-500 mt-1">{errors.taxId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Years in Operation <span className="text-red-500">*</span>
          </label>
          <select
            name="yearsInOperation"
            value={formData.yearsInOperation}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 dark:bg-gray-800/50 dark:text-white transition-all"
          >
            <option value="">Select Years in Operation</option>
            {YEARS_OPTIONS.map((years) => (
              <option key={years} value={years}>
                {years}
              </option>
            ))}
          </select>
          {errors.yearsInOperation && (
            <p className="text-xs text-red-500 mt-1">
              {errors.yearsInOperation}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Region <span className="text-red-500">*</span>
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 dark:bg-gray-800/50 dark:text-white transition-all"
          >
            <option value="">Select Region</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-xs text-red-500 mt-1">{errors.region}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            disabled={!formData.region}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 dark:bg-gray-800/50 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {formData.region ? "Select City" : "Select Region First"}
            </option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-xs text-red-500 mt-1">{errors.city}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Full Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white transition-all"
            placeholder="Street, building, floor, etc."
          />
          {errors.fullAddress && (
            <p className="text-xs text-red-500 mt-1">{errors.fullAddress}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Theater Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="theaterDescription"
            rows={4}
            value={formData.theaterDescription}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white resize-none transition-all"
            placeholder="Describe your theater, facilities, seating capacity, etc."
          />
          {errors.theaterDescription && (
            <p className="text-xs text-red-500 mt-1">
              {errors.theaterDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Step 3: Document Upload (same as before)
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
          <FileCheck className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Required Documents
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please upload the required documents for verification
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div
          className={`border-2 rounded-2xl p-5 transition-all ${errors.businessLicense ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-700 hover:border-teal-300"}`}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`p-2.5 rounded-xl ${formData.documents.businessLicense ? "bg-green-100 dark:bg-green-900/20" : "bg-gray-100 dark:bg-gray-800"}`}
              >
                <FileText
                  className={`h-5 w-5 ${formData.documents.businessLicense ? "text-green-600" : "text-gray-500"}`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Business License <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Valid business license or registration certificate
                </p>
                {formData.documents.businessLicense && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />{" "}
                    {formData.documents.businessLicense.name}
                  </p>
                )}
              </div>
            </div>
            <div>
              <input
                ref={(el) => {
                  if (el) fileInputRefs.current.businessLicense = el;
                }}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleDocumentUpload(e, "businessLicense")}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRefs.current.businessLicense?.click()}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${formData.documents.businessLicense ? "border-2 border-green-500 text-green-600 hover:bg-green-50" : "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md"}`}
              >
                <Upload className="h-4 w-4" />{" "}
                {formData.documents.businessLicense ? "Replace" : "Upload"}
              </button>
            </div>
          </div>
          {errors.businessLicense && (
            <p className="text-xs text-red-500 mt-3">
              {errors.businessLicense}
            </p>
          )}
        </div>

        <div
          className={`border-2 rounded-2xl p-5 transition-all ${errors.taxCertificate ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-700 hover:border-teal-300"}`}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`p-2.5 rounded-xl ${formData.documents.taxCertificate ? "bg-green-100 dark:bg-green-900/20" : "bg-gray-100 dark:bg-gray-800"}`}
              >
                <Receipt
                  className={`h-5 w-5 ${formData.documents.taxCertificate ? "text-green-600" : "text-gray-500"}`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Tax Registration Certificate{" "}
                  <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tax Identification Number (TIN) certificate
                </p>
                {formData.documents.taxCertificate && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />{" "}
                    {formData.documents.taxCertificate.name}
                  </p>
                )}
              </div>
            </div>
            <div>
              <input
                ref={(el) => {
                  if (el) fileInputRefs.current.taxCertificate = el;
                }}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleDocumentUpload(e, "taxCertificate")}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRefs.current.taxCertificate?.click()}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${formData.documents.taxCertificate ? "border-2 border-green-500 text-green-600 hover:bg-green-50" : "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md"}`}
              >
                <Upload className="h-4 w-4" />{" "}
                {formData.documents.taxCertificate ? "Replace" : "Upload"}
              </button>
            </div>
          </div>
          {errors.taxCertificate && (
            <p className="text-xs text-red-500 mt-3">{errors.taxCertificate}</p>
          )}
        </div>

        <div
          className={`border-2 rounded-2xl p-5 transition-all ${errors.ownerIdCard ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-700 hover:border-teal-300"}`}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`p-2.5 rounded-xl ${formData.documents.ownerIdCard ? "bg-green-100 dark:bg-green-900/20" : "bg-gray-100 dark:bg-gray-800"}`}
              >
                <User
                  className={`h-5 w-5 ${formData.documents.ownerIdCard ? "text-green-600" : "text-gray-500"}`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Owner ID Card <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Valid government-issued ID (Passport, National ID, or Driver's
                  License)
                </p>
                {formData.documents.ownerIdCard && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />{" "}
                    {formData.documents.ownerIdCard.name}
                  </p>
                )}
              </div>
            </div>
            <div>
              <input
                ref={(el) => {
                  if (el) fileInputRefs.current.ownerIdCard = el;
                }}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleDocumentUpload(e, "ownerIdCard")}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRefs.current.ownerIdCard?.click()}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${formData.documents.ownerIdCard ? "border-2 border-green-500 text-green-600 hover:bg-green-50" : "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md"}`}
              >
                <Upload className="h-4 w-4" />{" "}
                {formData.documents.ownerIdCard ? "Replace" : "Upload"}
              </button>
            </div>
          </div>
          {errors.ownerIdCard && (
            <p className="text-xs text-red-500 mt-3">{errors.ownerIdCard}</p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Document Requirements
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              • PDF, JPG, or PNG format only (max 10MB per file)
              <br />
              • Documents must be clear and legible
              <br />
              • Business license must be currently valid
              <br />• ID card must match the owner's name
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Pricing & Terms (same as before)
  const renderStep4 = () => {
    const getPlanPrice = (plan: string) => {
      if (plan === "monthly") return "6,000 ETB";
      if (plan === "quarterly") return "8,000 ETB";
      return "6,000 ETB";
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
            <FileSignature className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Pricing Plan & Terms
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose your preferred payment model
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Select Payment Model <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRICING_MODELS.map((model) => {
              const Icon = model.icon;
              const isSelected = formData.pricingModel === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      pricingModel: model.id,
                      contractType: "",
                    }))
                  }
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${isSelected ? "border-teal-500 bg-gradient-to-br from-teal-500/10 to-teal-600/10 shadow-lg" : "border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:shadow-md"}`}
                >
                  <div
                    className={`p-2 rounded-xl inline-block ${isSelected ? "bg-teal-100 dark:bg-teal-900/30" : "bg-gray-100 dark:bg-gray-800"} mb-3`}
                  >
                    <Icon
                      className={`h-6 w-6 ${isSelected ? "text-teal-600" : "text-gray-600 dark:text-gray-400"}`}
                    />
                  </div>
                  <h3
                    className={`font-bold text-lg ${isSelected ? "text-teal-600" : "text-gray-900 dark:text-white"}`}
                  >
                    {model.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${isSelected ? "text-gray-600" : "text-gray-500"}`}
                  >
                    {model.description}
                  </p>
                  <p className={`text-sm font-bold mt-3 text-teal-600`}>
                    {model.rate}
                  </p>
                </div>
              );
            })}
          </div>
          {errors.pricingModel && (
            <p className="text-xs text-red-500 mt-2">{errors.pricingModel}</p>
          )}
        </div>

        {formData.pricingModel === "subscription" && (
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Select Subscription Plan <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CONTRACT_TYPES.map((contract) => {
                const Icon = contract.icon;
                const isSelected = formData.contractType === contract.id;
                return (
                  <div
                    key={contract.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        contractType: contract.id,
                      }))
                    }
                    className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${isSelected ? "border-teal-500 bg-gradient-to-br from-teal-500/10 to-teal-600/10 shadow-lg" : "border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:shadow-md"}`}
                  >
                    <div
                      className={`p-2 rounded-xl inline-block ${isSelected ? "bg-teal-100 dark:bg-teal-900/30" : "bg-gray-100 dark:bg-gray-800"} mb-3`}
                    >
                      <Icon
                        className={`h-6 w-6 ${isSelected ? "text-teal-600" : "text-gray-600 dark:text-gray-400"}`}
                      />
                    </div>
                    <h4
                      className={`font-bold text-lg ${isSelected ? "text-teal-600" : "text-gray-900 dark:text-white"}`}
                    >
                      {contract.name}
                    </h4>
                    <p className="text-2xl font-bold text-teal-600 mt-2">
                      {getPlanPrice(contract.id)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      per {contract.id.replace("ly", "")}
                    </p>
                    <div className="mt-3 space-y-1">
                      {contract.features.map((feature, idx) => (
                        <p
                          key={idx}
                          className="text-xs text-gray-500 flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {feature}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.contractType && (
              <p className="text-xs text-red-500 mt-2">{errors.contractType}</p>
            )}
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-800/50 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Terms & Agreement
          </h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              By registering your theater on our platform, you agree to the
              following terms and conditions:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                All information provided is accurate and complete to the best of
                your knowledge
              </li>
              <li>
                You authorize us to verify the documents and information
                provided
              </li>
              <li>
                You agree to our commission structure based on your selected
                pricing plan
              </li>
              <li>
                Your account may be suspended for violation of terms or
                provision of false information
              </li>
              <li>This agreement is governed by the laws of Ethiopia</li>
            </ul>
            <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <p className="text-amber-800 dark:text-amber-300 text-sm">
                  <strong>Admin Review Required:</strong> All applications
                  undergo review within 3-5 business days. You will be notified
                  once approved.
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600 mt-0.5" />
                <p className="text-gray-800 dark:text-gray-300 text-sm">
                  <strong>No Refund Policy:</strong> All registration fees are
                  non-refundable. Carefully review your selection before
                  completing payment.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleInputChange}
              className="mt-1 h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition">
                I confirm that all information provided is accurate
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                I understand that providing false information may lead to
                rejection or account suspension
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="agreedToNoRefund"
              checked={formData.agreedToNoRefund}
              onChange={handleInputChange}
              className="mt-1 h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition">
                I acknowledge the no-refund policy
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                I understand that all payments made are non-refundable
              </p>
            </div>
          </label>
        </div>
        {(errors.terms || errors.noRefund) && (
          <p className="text-xs text-red-500 mt-2">
            {errors.terms || errors.noRefund}
          </p>
        )}
      </div>
    );
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Registration Submitted Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for registering your theater. Our team will review your
            application within 3-5 business days.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              <strong>Owner Account Created!</strong>
              <br />
              Email: {formData.ownerEmail}
              <br />
              You can now login with your credentials.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
            <Theater className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-400 dark:to-teal-600 bg-clip-text text-transparent">
            Theater Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join our platform and start selling tickets online
          </p>
        </div>

        <StepIndicator currentStep={step} steps={steps} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700"
          >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {duplicateError && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                      Duplicate Information Detected
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      {duplicateError}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                      Please use different values and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {errors.submit}
                </p>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 font-medium"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              )}
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className={`${step > 1 ? "" : "ml-auto"} px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg`}
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !formData.agreedToTerms ||
                    !formData.agreedToNoRefund ||
                    (formData.pricingModel === "subscription" &&
                      !formData.contractType)
                  }
                  className={`${step > 1 ? "" : "ml-auto"} px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-md ${
                    isSubmitting ||
                    !formData.agreedToTerms ||
                    !formData.agreedToNoRefund ||
                    (formData.pricingModel === "subscription" &&
                      !formData.contractType)
                      ? "bg-gray-400 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating
                      Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" /> Create Account & Submit
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          By registering, you agree to our{" "}
          <a href="#" className="text-teal-600 hover:underline font-medium">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-teal-600 hover:underline font-medium">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default TheaterRegistration;
