// frontend/src/components/auth/Booking/ChapaCheckout.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Shield,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Clock,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Check,
  Info,
  Sparkles,
} from "lucide-react";

// Types
interface ChapaCheckoutProps {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  eventTitle: string;
  eventId: string;
  scheduleId: string;
  selectedSeats: string[];
  customerName: string;
  onSuccess: (data: ChapaSuccessData) => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

interface ChapaSuccessData {
  txRef: string;
  transactionId?: string;
  message: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

// Chapa API Configuration
const CHAPA_CONFIG = {
  PUBLIC_KEY:
    import.meta.env.VITE_CHAPA_PUBLIC_KEY ||
    "CHAPUBK_TEST-4DbsrZiFnO80MNnib3XNyyjbJfYtSuix",
  API_URL: "https://api.chapa.co/v1",
};

const ChapaCheckout: React.FC<ChapaCheckoutProps> = ({
  amount,
  email,
  firstName,
  lastName,
  phone,
  eventTitle,
  eventId,
  scheduleId,
  selectedSeats,
  customerName,
  onSuccess,
  onCancel,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("chapa");
  const [txRef, setTxRef] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Generate unique transaction reference
  useEffect(() => {
    const generateTxRef = () => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 10).toUpperCase();
      const shortEventId = eventId.substring(0, 8).replace(/-/g, "");
      return `TH-${shortEventId}-${timestamp}-${random}`;
    };
    setTxRef(generateTxRef());
  }, [eventId]);

  // Available payment methods (all processed through Chapa)
  const paymentMethods: PaymentMethod[] = [
    {
      id: "chapa",
      name: "Chapa Payment Gateway",
      icon: <Wallet className="h-6 w-6" />,
      description:
        "Pay securely with telebirr, CBE, Amole, HelloCash, or bank cards",
    },
  ];

  // Format amount for display
  const formatAmount = (amt: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amt);
  };

  // Calculate convenience fee (optional, 2% example)
  const convenienceFee = Math.round(amount * 0.02);
  const totalAmount = amount + convenienceFee;

  // Direct Chapa checkout (redirect method)
  const handleChapaRedirect = () => {
    if (!agreeToTerms) {
      setErrorMessage("Please agree to the terms and conditions");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      // Create a form dynamically and submit to Chapa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `${CHAPA_CONFIG.API_URL}/hosted/pay`;
      form.target = "_self"; // Redirect in same window

      // Required Chapa parameters
      const params: Record<string, string> = {
        public_key: CHAPA_CONFIG.PUBLIC_KEY,
        tx_ref: txRef,
        amount: totalAmount.toString(),
        currency: "ETB",
        email: email,
        first_name: firstName,
        last_name: lastName || "Customer",
        phone_number: phone.replace(/\D/g, ""),
        title: `Tickets for ${eventTitle}`,
        description: `Booking ${selectedSeats.length} ticket(s) for ${eventTitle} - Seats: ${selectedSeats.join(", ")}`,
        return_url: `${window.location.origin}/booking/success?tx_ref=${txRef}&status=success`,
        callback_url: `${window.location.origin}/api/chapa/callback`,
        // Custom metadata
        "meta[event_id]": eventId,
        "meta[schedule_id]": scheduleId,
        "meta[seats]": JSON.stringify(selectedSeats),
        "meta[customer_name]": customerName,
        "meta[customer_email]": email,
        "meta[customer_phone]": phone,
        "meta[total_amount]": totalAmount.toString(),
      };

      // Add parameters as hidden inputs
      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      // Append form to body and submit
      document.body.appendChild(form);

      // Small delay to show processing state
      setTimeout(() => {
        form.submit();
        // Clean up form after submission
        setTimeout(() => {
          document.body.removeChild(form);
        }, 100);
      }, 1500);
    } catch (error) {
      console.error("Chapa redirect error:", error);
      setPaymentStatus("failed");
      setErrorMessage("Failed to initialize payment. Please try again.");
      onError("Payment initialization failed");
      setIsProcessing(false);
    }
  };

  // Alternative: Chapa Direct API Integration with checkout URL
  const handleChapaDirectPayment = async () => {
    if (!agreeToTerms) {
      setErrorMessage("Please agree to the terms and conditions");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      const response = await fetch(
        `${CHAPA_CONFIG.API_URL}/transaction/initialize`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${CHAPA_CONFIG.PUBLIC_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalAmount.toString(),
            currency: "ETB",
            email: email,
            first_name: firstName,
            last_name: lastName || "Customer",
            phone_number: phone.replace(/\D/g, ""),
            tx_ref: txRef,
            callback_url: `${window.location.origin}/api/chapa/callback`,
            return_url: `${window.location.origin}/booking/success?tx_ref=${txRef}&status=success`,
            customization: {
              title: `Tickets for ${eventTitle}`,
              description: `Booking ${selectedSeats.length} ticket(s) for ${eventTitle}`,
              logo: `${window.location.origin}/logo.png`,
            },
            meta: {
              event_id: eventId,
              schedule_id: scheduleId,
              seats: selectedSeats,
              customer_name: customerName,
              customer_email: email,
              customer_phone: phone,
            },
          }),
        },
      );

      const data = await response.json();

      if (data.status === "success" && data.data?.checkout_url) {
        // Redirect to Chapa checkout page
        window.location.href = data.data.checkout_url;
      } else {
        throw new Error(data.message || "Payment initialization failed");
      }
    } catch (error: any) {
      console.error("Chapa payment error:", error);
      setPaymentStatus("failed");
      setErrorMessage(error.message || "Payment failed. Please try again.");
      onError(error.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  // Handle payment cancellation
  const handleCancel = () => {
    setPaymentStatus("idle");
    setErrorMessage("");
    setIsProcessing(false);
    onCancel();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {paymentStatus === "idle" && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Order Summary */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-600" />
                Order Summary
              </h3>

              <div className="space-y-3">
                {/* Event Details */}
                <div className="bg-white/60 dark:bg-dark-800/60 rounded-xl p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        Event
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {eventTitle}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        Seats
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedSeats.length} ticket(s)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        Customer
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {customerName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        Email
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white text-xs">
                        {email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white/60 dark:bg-dark-800/60 rounded-xl p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="font-medium">
                        ETB {formatAmount(amount)}
                      </span>
                    </div>
                    {convenienceFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          Service Fee
                          <Info className="h-3 w-3 text-gray-400 cursor-help" />
                        </span>
                        <span className="font-medium">
                          ETB {formatAmount(convenienceFee)}
                        </span>
                      </div>
                    )}
                    <div className="border-t dark:border-dark-600 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold">Total</span>
                        <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                          ETB {formatAmount(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-teal-600" />
                Payment Method
              </h3>

              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-teal-500 bg-teal-50/50 dark:bg-teal-900/20 shadow-md"
                      : "border-gray-200 dark:border-dark-700 hover:border-teal-300 dark:hover:border-teal-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl transition-colors ${
                        selectedMethod === method.id
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {method.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {method.description}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedMethod === method.id
                          ? "border-teal-600 bg-teal-600"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Supported Payment Options */}
            <div className="bg-gray-50 dark:bg-dark-700/50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-teal-600" />
                Available Payment Options via Chapa:
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-800 rounded-lg p-2">
                  <Smartphone className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span>telebirr</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-800 rounded-lg p-2">
                  <Building2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span>CBE Birr</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-800 rounded-lg p-2">
                  <Building2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span>Amole</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-800 rounded-lg p-2">
                  <Building2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span>HelloCash</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-800 rounded-lg p-2">
                  <CreditCard className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span>Bank Cards</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-800 rounded-lg p-2">
                  <Building2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span>Bank Transfer</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    if (e.target.checked) setErrorMessage("");
                  }}
                  className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-teal-600 hover:underline"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-teal-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  . I understand that tickets are non-refundable.
                </span>
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {errorMessage}
              </motion.div>
            )}

            {/* Pay Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleChapaRedirect}
              disabled={isProcessing || !agreeToTerms}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2 mb-4"
            >
              <ExternalLink className="h-5 w-5" />
              Pay ETB {formatAmount(totalAmount)} with Chapa
            </motion.button>

            {/* Security Notices */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Info className="h-3 w-3" />
                <span>
                  You will be redirected to Chapa's secure payment page
                </span>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="w-full py-3 border-2 border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Booking Details
            </button>
          </motion.div>
        )}

        {/* Processing State */}
        {paymentStatus === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Loader2 className="h-16 w-16 text-teal-600" />
            </motion.div>

            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Redirecting to Chapa
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please wait while we redirect you to the secure payment page...
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Clock className="h-4 w-4" />
              <span>This will only take a moment</span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 max-w-sm mx-auto">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-300 text-left">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>You'll be redirected to Chapa's payment page</li>
                    <li>Choose your preferred payment method</li>
                    <li>Complete the payment securely</li>
                    <li>
                      You'll be automatically returned to confirm your booking
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <button
              onClick={handleCancel}
              className="mt-6 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
            >
              Cancel and go back
            </button>
          </motion.div>
        )}

        {/* Error State */}
        {paymentStatus === "failed" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            </motion.div>

            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Payment Failed
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {errorMessage ||
                "An error occurred while processing your payment."}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Don't worry, you haven't been charged. Please try again.
            </p>

            <div className="space-y-3 max-w-xs mx-auto">
              <button
                onClick={() => {
                  setPaymentStatus("idle");
                  setErrorMessage("");
                  setIsProcessing(false);
                }}
                className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={handleCancel}
                className="w-full py-3 border-2 border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Booking
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChapaCheckout;