// Frontend/src/components/theater/TheaterRegistration.tsx
import supabase from "@/config/supabaseClient";
import React, {
  useState,
  useRef,
  ChangeEvent,
  useCallback,
  useEffect,
} from "react";
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
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface FormData {
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  businessLicenseNumber: string;
  taxId: string;
  yearsInOperation: string;
  city: string;
  region: string;
  fullAddress: string;
  documents: {
    businessLicense: File | null;
    taxCertificate: File | null;
  };
  pricingModel: string;
  contractType: string;
  isNewTheater: boolean;
  paymentCompleted: boolean;
  paymentIntentId: string;
  // Owner information
  ownerFullName: string;
  ownerPassword: string;
}

interface Errors {
  [key: string]: string;
}

// ============================================
// CONSTANTS
// ============================================

const CITIES = [
  "Addis Ababa",
  "Gondar",
  "Jimma",
  "Harar",
  "Adama",
  "Dessie",
  "Arba Minch",
  "Jijiga",
  "Bahir Dar",
  "Hawassa",
  "Mekelle",
  "Dire Dawa",
];
const REGIONS = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "South West Ethiopia",
  "Southern Nations",
  "Tigray",
];
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
    bestFor: "New or low-volume theaters",
  },
  {
    id: "contract",
    name: "Contract Plan",
    description: "Fixed monthly subscription",
    icon: Calendar,
    rate: "Starting from 6,000 ETB/month",
    bestFor: "High-volume theaters",
  },
];

const CONTRACT_TYPES = [
  {
    id: "monthly",
    name: "Monthly",
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
    name: "Quarterly",
    icon: Award,
    basePrice: 8000,
    features: ["Save 15% vs monthly", "Priority support", "Marketing tools"],
  },
  {
    id: "yearly",
    name: "Yearly",
    icon: Star,
    basePrice: 6000,
    features: [
      "Save 30% vs monthly",
      "24/7 dedicated support",
      "Advanced analytics",
      "Feature updates",
    ],
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

const TheaterRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToNoRefund, setAgreedToNoRefund] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    email: "",
    phone: "",
    businessType: "",
    businessLicenseNumber: "",
    taxId: "",
    yearsInOperation: "",
    city: "",
    region: "",
    fullAddress: "",
    documents: { businessLicense: null, taxCertificate: null },
    pricingModel: "",
    contractType: "",
    isNewTheater: false,
    paymentCompleted: false,
    paymentIntentId: "",
    ownerFullName: "",
    ownerPassword: "",
  });

  const handleInputChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [errors],
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
      if (!formData.businessName.trim())
        newErrors.businessName = "Business name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        newErrors.email = "Please enter a valid email address";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.businessType)
        newErrors.businessType = "Business type is required";
      if (!formData.businessLicenseNumber.trim())
        newErrors.businessLicenseNumber = "Business license number is required";
      if (!formData.taxId.trim()) newErrors.taxId = "Tax ID / TIN is required";
      if (!formData.yearsInOperation)
        newErrors.yearsInOperation = "Years in operation is required";
      if (!formData.ownerFullName.trim())
        newErrors.ownerFullName = "Owner full name is required";
      if (!formData.ownerPassword.trim())
        newErrors.ownerPassword = "Password is required";
      else if (formData.ownerPassword.length < 6)
        newErrors.ownerPassword = "Password must be at least 6 characters";
    } else if (step === 2) {
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.region) newErrors.region = "Region is required";
      if (!formData.fullAddress.trim())
        newErrors.fullAddress = "Full address is required";
      if (!formData.documents.businessLicense)
        newErrors.businessLicense = "Business license is required";
      if (!formData.documents.taxCertificate)
        newErrors.taxCertificate = "Tax registration certificate is required";
    } else if (step === 3) {
      if (!formData.pricingModel)
        newErrors.pricingModel = "Please select a pricing model";
      if (formData.pricingModel === "contract" && !formData.contractType)
        newErrors.contractType = "Please select a contract type";
      if (!agreedToTerms)
        newErrors.terms =
          "You must confirm that the information provided is accurate";
      if (!agreedToNoRefund)
        newErrors.noRefund = "You must acknowledge the no-refund policy";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, formData, agreedToTerms, agreedToNoRefund]);

  const handleNext = useCallback(() => {
    if (validateStep()) setStep((prev) => prev + 1);
  }, [validateStep]);
  const handleBack = useCallback(() => setStep((prev) => prev - 1), []);

  // Create user in Supabase Auth and Users table
  const createUser = useCallback(async () => {
    // First, check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", formData.email)
      .single();

    if (existingUser) {
      return existingUser.id;
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.ownerPassword,
      options: {
        data: {
          full_name: formData.ownerFullName,
          role: "theater_owner",
        },
      },
    });

    if (authError) throw new Error(`Auth signup failed: ${authError.message}`);

    if (!authData.user) throw new Error("User creation failed");

    // Insert into users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email: formData.email,
        phone: formData.phone,
        full_name: formData.ownerFullName,
        role: "theater_owner",
        status: "active",
      })
      .select()
      .single();

    if (userError) throw new Error(`User insert failed: ${userError.message}`);

    return userData.id;
  }, [
    formData.email,
    formData.ownerPassword,
    formData.ownerFullName,
    formData.phone,
  ]);

  const submitToSupabase = useCallback(async () => {
    // First, create/get the owner user
    const ownerUserId = await createUser();
    setCreatedUserId(ownerUserId);

    const theaterId = crypto.randomUUID();

    let licenseDocUrl = null;
    let taxDocUrl = null;

    // Upload Business License if exists
    if (formData.documents.businessLicense) {
      const fileExt = formData.documents.businessLicense.name.split(".").pop();
      const fileName = `${theaterId}_license.${fileExt}`;
      const { error: licenseError } = await supabase.storage
        .from("documents")
        .upload(fileName, formData.documents.businessLicense);

      if (!licenseError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("documents").getPublicUrl(fileName);
        licenseDocUrl = publicUrl;
      }
    }

    // Upload Tax Certificate if exists
    if (formData.documents.taxCertificate) {
      const fileExt = formData.documents.taxCertificate.name.split(".").pop();
      const fileName = `${theaterId}_tax.${fileExt}`;
      const { error: taxError } = await supabase.storage
        .from("documents")
        .upload(fileName, formData.documents.taxCertificate);

      if (!taxError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("documents").getPublicUrl(fileName);
        taxDocUrl = publicUrl;
      }
    }

    // Insert theater with owner_user_id reference
    const { data: theaterData, error: theaterError } = await supabase
      .from("theaters")
      .insert({
        id: theaterId,
        legal_business_name: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        business_type: formData.businessType,
        business_license_number: formData.businessLicenseNumber,
        license_document_url: licenseDocUrl,
        tax_id: formData.taxId,
        city: formData.city,
        address: formData.fullAddress,
        total_halls: 0,
        description: "Theater registration pending",
        status: "pending",
        is_approved: false,
        owner_user_id: ownerUserId, // This links to the users table
        country: "Ethiopia",
        subscription_status: "trial",
      });

    if (theaterError) {
      console.error("Theater insert error:", theaterError);
      if (theaterError.code === "23505") {
        if (theaterError.message.includes("business_license_number")) {
          throw new Error(
            `Business license number "${formData.businessLicenseNumber}" is already taken.`,
          );
        }
        if (theaterError.message.includes("tax_id")) {
          throw new Error(`Tax ID "${formData.taxId}" is already taken.`);
        }
        throw new Error("A theater with this information already exists.");
      }
      throw theaterError;
    }

    // Insert contract
    if (theaterData) {
      await supabase.from("contract").insert({
        provider_name: formData.businessName,
        provider_contact: formData.phone,
        contract_start_date: new Date().toISOString().split("T")[0],
        contract_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: formData.pricingModel === "contract" ? "active" : "draft",
        commission_rate: formData.pricingModel === "contract" ? 0 : 10,
      });
    }

    // Also insert into owners table for additional owner info
    await supabase.from("owners").insert({
      user_id: ownerUserId,
      business_name: formData.businessName,
      business_type: formData.businessType.toLowerCase().replace(/\s/g, "_"),
      city: formData.city,
      physical_address: formData.fullAddress,
      verification_status: "pending",
    });

    return theaterData;
  }, [formData, createUser]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      await submitToSupabase();
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  }, [validateStep, submitToSupabase]);

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Business & Owner Information
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tell us about your business and owner details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                  placeholder="Enter your legal business name"
                />
                {errors.businessName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.businessName}
                  </p>
                )}
              </div>

              {/* Owner Section */}
              <div className="md:col-span-2">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                      Owner Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Owner Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ownerFullName"
                        value={formData.ownerFullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                        placeholder="Full name of the owner"
                      />
                      {errors.ownerFullName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.ownerFullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="ownerPassword"
                        value={formData.ownerPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                        placeholder="Create a password (min 6 characters)"
                      />
                      {errors.ownerPassword && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.ownerPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                  placeholder="business@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                  placeholder="+251 XXX XXX XXX"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
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
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
                >
                  <option value="">Select Business Type</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.businessType && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.businessType}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Business License Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessLicenseNumber"
                  value={formData.businessLicenseNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                  placeholder="Enter a UNIQUE license number"
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
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                  placeholder="Tax Identification Number"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Location & Documents
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Where is your theater located?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
                >
                  <option value="">Select City</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city}</p>
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
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800/50 dark:text-white"
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
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
                  placeholder="Street, building, floor, etc."
                />
                {errors.fullAddress && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.fullAddress}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            <div className="space-y-4">
              <div className="border-2 rounded-2xl p-5 border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Business License <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Valid business license or registration certificate
                    </p>
                    {formData.documents.businessLicense && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ Uploaded: {formData.documents.businessLicense.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      ref={(el) => {
                        if (el) fileInputRefs.current.businessLicense = el;
                      }}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleDocumentUpload(e, "businessLicense")
                      }
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRefs.current.businessLicense?.click()
                      }
                      className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md"
                    >
                      <Upload className="h-4 w-4 inline mr-2" /> Upload
                    </button>
                  </div>
                </div>
                {errors.businessLicense && (
                  <p className="text-xs text-red-500 mt-3">
                    {errors.businessLicense}
                  </p>
                )}
              </div>

              <div className="border-2 rounded-2xl p-5 border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Tax Registration Certificate{" "}
                      <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Tax Identification Number (TIN) certificate
                    </p>
                    {formData.documents.taxCertificate && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ Uploaded: {formData.documents.taxCertificate.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      ref={(el) => {
                        if (el) fileInputRefs.current.taxCertificate = el;
                      }}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleDocumentUpload(e, "taxCertificate")
                      }
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRefs.current.taxCertificate?.click()
                      }
                      className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md"
                    >
                      <Upload className="h-4 w-4 inline mr-2" /> Upload
                    </button>
                  </div>
                </div>
                {errors.taxCertificate && (
                  <p className="text-xs text-red-500 mt-3">
                    {errors.taxCertificate}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pricing & Terms
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose your payment model
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNewTheater}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isNewTheater: e.target.checked,
                    }))
                  }
                  className="mt-1 h-5 w-5 text-purple-600 rounded"
                />
                <div>
                  <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                    🎯 New / Low Volume Theater — Save 15%
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    Get 15% off all contract plans
                  </p>
                </div>
              </label>
            </div>

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
                    className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${isSelected ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20" : "border-gray-200 dark:border-gray-700 hover:border-teal-300"}`}
                  >
                    <Icon
                      className={`h-8 w-8 mb-3 ${isSelected ? "text-teal-600" : "text-gray-500"}`}
                    />
                    <h3
                      className={`font-bold text-lg ${isSelected ? "text-teal-600" : "text-gray-900 dark:text-white"}`}
                    >
                      {model.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {model.description}
                    </p>
                    <p className="text-sm font-bold mt-3 text-teal-600">
                      {model.rate}
                    </p>
                  </div>
                );
              })}
            </div>
            {errors.pricingModel && (
              <p className="text-xs text-red-500">{errors.pricingModel}</p>
            )}

            {formData.pricingModel === "contract" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CONTRACT_TYPES.map((contract) => {
                  const Icon = contract.icon;
                  const isSelected = formData.contractType === contract.id;
                  const finalPrice = formData.isNewTheater
                    ? contract.basePrice * 0.85
                    : contract.basePrice;
                  return (
                    <div
                      key={contract.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          contractType: contract.id,
                        }))
                      }
                      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${isSelected ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20" : "border-gray-200 dark:border-gray-700"}`}
                    >
                      <Icon
                        className={`h-6 w-6 mb-2 ${isSelected ? "text-teal-600" : "text-gray-500"}`}
                      />
                      <h4 className="font-bold">{contract.name}</h4>
                      <p className="text-2xl font-bold text-teal-600">
                        {new Intl.NumberFormat("en-ET", {
                          style: "currency",
                          currency: "ETB",
                        }).format(finalPrice)}
                      </p>
                      <p className="text-xs text-gray-500">per {contract.id}</p>
                    </div>
                  );
                })}
              </div>
            )}
            {errors.contractType && (
              <p className="text-xs text-red-500">{errors.contractType}</p>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Terms & Agreement</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>All information provided is accurate and complete</li>
                <li>You authorize us to verify the documents provided</li>
                <li>You agree to our commission structure</li>
                <li>All registration fees are non-refundable</li>
              </ul>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 text-teal-600 rounded"
                />
                <span className="text-sm">
                  I confirm that all information provided is accurate
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToNoRefund}
                  onChange={(e) => setAgreedToNoRefund(e.target.checked)}
                  className="mt-1 h-5 w-5 text-teal-600 rounded"
                />
                <span className="text-sm">
                  I acknowledge the no-refund policy
                </span>
              </label>
            </div>
            {(errors.terms || errors.noRefund) && (
              <p className="text-xs text-red-500">
                {errors.terms || errors.noRefund}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Registration Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for registering. Our team will review your application
            within 3-5 business days.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              <strong>Owner Account Created!</strong>
              <br />
              Email: {formData.email}
              <br />
              You can now login with your credentials.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium"
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
          <div className="inline-flex items-center justify-center h-20 w-20 bg-teal-600 rounded-2xl mb-4 shadow-lg">
            <Theater className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Theater Registration</h1>
          <p className="text-gray-600 mt-2">
            Join our platform and start selling tickets
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= s ? "bg-teal-600 text-white border-teal-600" : "bg-gray-200 text-gray-500 border-gray-300"}`}
              >
                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${step > s ? "bg-teal-600" : "bg-gray-300"}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            {step === 1 && "Step 1: Business & Owner Information"}
            {step === 2 && "Step 2: Location & Documents"}
            {step === 3 && "Step 3: Pricing & Terms"}
          </p>
        </div>

        {/* Form content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {renderCurrentStep()}

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {errors.submit}
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2.5 border-2 rounded-xl hover:bg-gray-50 flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center gap-2"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !agreedToTerms ||
                  !agreedToNoRefund ||
                  (formData.pricingModel === "contract" &&
                    !formData.contractType)
                }
                className={`ml-auto px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 ${isSubmitting || !agreedToTerms || !agreedToNoRefund || (formData.pricingModel === "contract" && !formData.contractType) ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 text-white"}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" /> Create Account & Submit
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterRegistration;
