// src/pages/Owner/content/OwnerContactManagement.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Eye,
  Search,
  CheckCircle,
  Clock,
  Reply,
  X,
  Inbox,
  Trash2,
  RefreshCw,
  User,
  MessageCircle,
  Theater,
  Ticket,
  Phone,
  MapPin,
  Settings,
  XCircle,
  AlertCircle,
  Send,
  Loader2,
} from "lucide-react";
import ReusableTable from "../Reusable/ReusableTable";
import SuccessPopup from "..//Reusable/SuccessPopup";
import supabase from "@/config/supabaseClient";

// ==================== Types ====================
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  category: "general" | "booking" | "feedback" | "support";
  recipient_type: "theater" | "admin";
  theater_id: string | null;
  theater_name: string | null;
  status: "unread" | "read" | "replied";
  reply_message: string | null;
  replied_by: string | null;
  replied_by_id: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

interface TheaterContactInfo {
  id: string;
  theater_id: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  telegram_username: string;
  tiktok_url: string;
  created_at: string;
  updated_at: string;
}

interface TheaterInfo {
  id: string;
  legal_business_name: string;
  trade_name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

// ==================== Animation Variants ====================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

// ==================== Stat Card Component ====================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
  notification?: boolean;
  notificationCount?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  delay,
  notification,
  notificationCount,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div
        className="relative overflow-hidden transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? "scale-105" : ""}`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">{title}</p>
              {notification &&
                notificationCount !== undefined &&
                notificationCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                    {notificationCount}
                  </span>
                )}
            </div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== Edit Contact Info Modal ====================
interface EditContactInfoModalProps {
  theaterInfo: TheaterInfo | null;
  contactInfo: TheaterContactInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<TheaterContactInfo>) => Promise<void>;
}

const EditContactInfoModal: React.FC<EditContactInfoModalProps> = ({
  theaterInfo,
  contactInfo,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    description: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    linkedin_url: "",
    youtube_url: "",
    telegram_username: "",
    tiktok_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        phone: contactInfo.phone || "",
        email: contactInfo.email || "",
        address: contactInfo.address || "",
        description: contactInfo.description || "",
        facebook_url: contactInfo.facebook_url || "",
        twitter_url: contactInfo.twitter_url || "",
        instagram_url: contactInfo.instagram_url || "",
        linkedin_url: contactInfo.linkedin_url || "",
        youtube_url: contactInfo.youtube_url || "",
        telegram_username: contactInfo.telegram_username || "",
        tiktok_url: contactInfo.tiktok_url || "",
      });
    }
  }, [contactInfo]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              Edit Theater Information
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition"
            >
              <XCircle className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theater Name
            </label>
            <input
              type="text"
              value={theaterInfo?.legal_business_name || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Contact phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Contact email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Theater address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Theater description"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Social Media Links
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Facebook URL"
                value={formData.facebook_url}
                onChange={(e) =>
                  setFormData({ ...formData, facebook_url: e.target.value })
                }
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Twitter URL"
                value={formData.twitter_url}
                onChange={(e) =>
                  setFormData({ ...formData, twitter_url: e.target.value })
                }
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Instagram URL"
                value={formData.instagram_url}
                onChange={(e) =>
                  setFormData({ ...formData, instagram_url: e.target.value })
                }
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={formData.linkedin_url}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin_url: e.target.value })
                }
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="YouTube URL"
                value={formData.youtube_url}
                onChange={(e) =>
                  setFormData({ ...formData, youtube_url: e.target.value })
                }
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Telegram Username"
                value={formData.telegram_username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    telegram_username: e.target.value,
                  })
                }
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="TikTok URL"
                value={formData.tiktok_url}
                onChange={(e) =>
                  setFormData({ ...formData, tiktok_url: e.target.value })
                }
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ==================== Reply Modal ====================
interface ReplyModalProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (messageId: string, replyContent: string) => Promise<void>;
  theaterName: string;
}

const ReplyModal: React.FC<ReplyModalProps> = ({
  message,
  isOpen,
  onClose,
  onReply,
  theaterName,
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReplyContent("");
    }
  }, [isOpen]);

  if (!isOpen || !message) return null;

  const handleSubmit = async () => {
    if (!replyContent.trim()) {
      alert("Please enter a reply message");
      return;
    }
    setIsSubmitting(true);
    await onReply(message.id, replyContent);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-lg w-full"
      >
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Reply className="h-5 w-5 text-white" />
              <h2 className="text-xl font-bold text-white">
                Reply to Customer
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition"
            >
              <XCircle className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">From:</p>
            <p className="font-medium text-gray-900">{message.name}</p>
            <p className="text-sm text-gray-600">{message.email}</p>
            {message.phone && (
              <p className="text-sm text-gray-600">Phone: {message.phone}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Subject:</p>
            <p className="font-medium text-gray-900">{message.subject}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Original Message:</p>
            <p className="text-sm text-gray-700 max-h-32 overflow-y-auto">
              {message.message}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Reply *
            </label>
            <textarea
              rows={5}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Write your reply to ${message.name}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>
        </div>

        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send Reply
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ==================== View Modal ====================
interface ViewModalProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({
  message,
  isOpen,
  onClose,
  onReply,
}) => {
  if (!isOpen || !message) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: "General",
      booking: "Booking",
      feedback: "Feedback",
      support: "Support",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: "bg-gray-100 text-gray-700",
      booking: "bg-blue-100 text-blue-700",
      feedback: "bg-green-100 text-green-700",
      support: "bg-yellow-100 text-yellow-700",
    };
    return colors[category] || colors.general;
  };

  const getStatusBadge = () => {
    switch (message.status) {
      case "unread":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <Clock className="h-3 w-3" /> Unread
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Eye className="h-3 w-3" /> Read
          </span>
        );
      case "replied":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3" /> Replied
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Message Details
              </h2>
              <p className="text-xs text-gray-500">Customer Inquiry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">From</p>
              <p className="font-medium text-gray-900">{message.name}</p>
              <p className="text-sm text-gray-600">{message.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
              <p className="text-sm text-gray-900">{message.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Subject</p>
              <p className="font-medium text-gray-900">{message.subject}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(message.category)}`}
              >
                {getCategoryLabel(message.category)}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Received</p>
              <p className="text-sm text-gray-900">
                {formatDate(message.created_at)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
              {getStatusBadge()}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Message</p>
            <div className="mt-1 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>

          {message.reply_message && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Reply className="h-4 w-4 text-green-600" />
                <p className="text-xs font-semibold text-green-700">
                  Your Reply
                </p>
              </div>
              <p className="text-sm text-green-800 whitespace-pre-wrap">
                {message.reply_message}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Sent on {message.replied_at && formatDate(message.replied_at)}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
            {message.status !== "replied" && (
              <button
                onClick={onReply}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
              >
                <Reply className="h-4 w-4" />
                Reply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== Main Component ====================
const OwnerContactManagement: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [theaterInfo, setTheaterInfo] = useState<TheaterInfo | null>(null);
  const [contactInfo, setContactInfo] = useState<TheaterContactInfo | null>(
    null,
  );
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "",
    message: "",
    type: "success" as any,
  });

  // Get current user from session
  useEffect(() => {
    const getCurrentUser = () => {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    };
    getCurrentUser();
  }, []);

  // Load theater info and messages
  const loadData = useCallback(async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      // Get theater owned by this user
      const { data: theaterData, error: theaterError } = await supabase
        .from("theaters")
        .select("*")
        .eq("owner_user_id", currentUser.id)
        .single();

      if (theaterError) throw theaterError;
      setTheaterInfo(theaterData);

      // Get contact info for this theater
      const { data: contactData, error: contactError } = await supabase
        .from("theater_contact_info")
        .select("*")
        .eq("theater_id", theaterData.id)
        .maybeSingle();

      if (!contactError && contactData) {
        setContactInfo(contactData);
      }

      // Get messages for this theater
      const { data: messagesData, error: messagesError } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("theater_id", theaterData.id)
        .order("created_at", { ascending: false });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      loadData();
    }
  }, [currentUser?.id, loadData]);

  // Create or update contact info
  const handleSaveContactInfo = async (data: Partial<TheaterContactInfo>) => {
    if (!theaterInfo) return;

    try {
      if (contactInfo) {
        // Update existing
        const { error } = await supabase
          .from("theater_contact_info")
          .update(data)
          .eq("id", contactInfo.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from("theater_contact_info").insert({
          theater_id: theaterInfo.id,
          ...data,
        });

        if (error) throw error;
      }

      await loadData();
      setPopupMessage({
        title: "Success!",
        message: "Theater information updated successfully",
        type: "success",
      });
      setShowSuccessPopup(true);
    } catch (error: any) {
      console.error("Error saving contact info:", error);
      setPopupMessage({
        title: "Error!",
        message: error.message,
        type: "error",
      });
      setShowSuccessPopup(true);
    }
  };

  // Mark message as read
  const handleMarkAsRead = useCallback(async (message: ContactMessage) => {
    if (message.status === "unread") {
      try {
        const { error } = await supabase
          .from("contact_messages")
          .update({ status: "read", updated_at: new Date().toISOString() })
          .eq("id", message.id);

        if (error) throw error;

        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, status: "read" } : m)),
        );
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  }, []);

  // Handle reply
  const handleReply = useCallback(
    async (messageId: string, replyContent: string) => {
      try {
        const { error } = await supabase
          .from("contact_messages")
          .update({
            status: "replied",
            reply_message: replyContent,
            replied_by: currentUser?.name || currentUser?.full_name,
            replied_by_id: currentUser?.id,
            replied_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", messageId);

        if (error) throw error;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  status: "replied",
                  reply_message: replyContent,
                  replied_by: currentUser?.name || currentUser?.full_name,
                  replied_at: new Date().toISOString(),
                }
              : m,
          ),
        );

        setPopupMessage({
          title: "✓ Reply Sent",
          message: `Your reply has been sent successfully`,
          type: "success",
        });
        setShowSuccessPopup(true);
      } catch (error: any) {
        console.error("Error sending reply:", error);
        setPopupMessage({
          title: "Error!",
          message: error.message,
          type: "error",
        });
        setShowSuccessPopup(true);
      }
    },
    [currentUser],
  );

  // Delete message
  const handleDelete = useCallback(async () => {
    if (!selectedMessage) return;

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", selectedMessage.id);

      if (error) throw error;

      setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
      setShowDeleteConfirm(false);
      setSelectedMessage(null);
      setPopupMessage({
        title: "Deleted",
        message: `Message from ${selectedMessage.name} has been deleted`,
        type: "success",
      });
      setShowSuccessPopup(true);
    } catch (error: any) {
      console.error("Error deleting message:", error);
      setPopupMessage({
        title: "Error!",
        message: error.message,
        type: "error",
      });
      setShowSuccessPopup(true);
    }
  }, [selectedMessage]);

  // Open view modal
  const openViewModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowViewModal(true);
    if (message.status === "unread") handleMarkAsRead(message);
  };

  // Open reply modal
  const openReplyModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterCategory("all");
  };

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || m.status === filterStatus;
      const matchesCategory =
        filterCategory === "all" || m.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [messages, searchTerm, filterStatus, filterCategory]);

  // Stats
  const stats = useMemo(
    () => ({
      total: messages.length,
      unread: messages.filter((m) => m.status === "unread").length,
      booking: messages.filter((m) => m.category === "booking").length,
      general: messages.filter((m) => m.category === "general").length,
    }),
    [messages],
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryBadge = (category: string) => {
    const config: Record<string, { color: string; label: string }> = {
      general: { color: "bg-gray-100 text-gray-700", label: "General" },
      booking: { color: "bg-blue-100 text-blue-700", label: "Booking" },
      feedback: { color: "bg-green-100 text-green-700", label: "Feedback" },
      support: { color: "bg-yellow-100 text-yellow-700", label: "Support" },
    };
    const c = config[category] || config.general;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.color}`}
      >
        {c.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <Clock className="h-3 w-3" /> Unread
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Eye className="h-3 w-3" /> Read
          </span>
        );
      case "replied":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3" /> Replied
          </span>
        );
      default:
        return null;
    }
  };

  const columns = [
    {
      Header: "From",
      accessor: "name",
      sortable: true,
      Cell: (row: ContactMessage) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      Header: "Subject",
      accessor: "subject",
      sortable: true,
      Cell: (row: ContactMessage) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-800 truncate">{row.subject}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {getCategoryBadge(row.category)}
          </div>
        </div>
      ),
    },
    {
      Header: "Received",
      accessor: "created_at",
      sortable: true,
      Cell: (row: ContactMessage) => (
        <p className="text-sm text-gray-600">{formatDate(row.created_at)}</p>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      sortable: true,
      Cell: (row: ContactMessage) => getStatusBadge(row.status),
    },
    {
      Header: "Actions",
      accessor: "id",
      sortable: false,
      Cell: (row: ContactMessage) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openViewModal(row)}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>

          {row.status !== "replied" && (
            <button
              onClick={() => openReplyModal(row)}
              className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
              title="Reply"
            >
              <Reply className="h-4 w-4 text-teal-600" />
            </button>
          )}

          <button
            onClick={() => {
              setSelectedMessage(row);
              setShowDeleteConfirm(true);
            }}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  const statsCards = [
    {
      title: "Total Messages",
      value: stats.total,
      icon: Inbox,
      color: "from-teal-500 to-teal-600",
      delay: 0.1,
      notification: true,
      notificationCount: stats.total,
    },
    {
      title: "Unread",
      value: stats.unread,
      icon: Mail,
      color: "from-red-500 to-red-600",
      delay: 0.15,
      notification: true,
      notificationCount: stats.unread,
    },
    {
      title: "Booking",
      value: stats.booking,
      icon: Ticket,
      color: "from-blue-500 to-blue-600",
      delay: 0.2,
      notification: true,
      notificationCount: stats.booking,
    },
    {
      title: "General",
      value: stats.general,
      icon: MessageCircle,
      color: "from-green-500 to-green-600",
      delay: 0.25,
      notification: true,
      notificationCount: stats.general,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 p-6 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
              <Theater className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Customer Messages
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage customer inquiries for{" "}
                {theaterInfo?.legal_business_name || "your theater"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Edit Theater Info
          </button>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {statsCards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              delay={card.delay}
              notification={card.notification}
              notificationCount={card.notificationCount}
            />
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-4 shadow-md border border-gray-100 mb-6"
        >
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="booking">Booking</option>
              <option value="feedback">Feedback</option>
              <option value="support">Support</option>
            </select>
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <ReusableTable
            columns={columns}
            data={filteredMessages}
            title="Customer Messages"
            icon={Mail}
            showSearch={false}
            showExport={true}
            showPrint={false}
            itemsPerPage={10}
          />
        </motion.div>

        {/* Modals */}
        <ViewModal
          message={selectedMessage}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedMessage(null);
          }}
          onReply={() => {
            setShowViewModal(false);
            setShowReplyModal(true);
          }}
        />

        <ReplyModal
          message={selectedMessage}
          isOpen={showReplyModal}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedMessage(null);
          }}
          onReply={handleReply}
          theaterName={theaterInfo?.legal_business_name || "Theater"}
        />

        <EditContactInfoModal
          theaterInfo={theaterInfo}
          contactInfo={contactInfo}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveContactInfo}
        />

        {/* Delete Confirm Modal */}
        {showDeleteConfirm && selectedMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Delete Message
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this message? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Popup */}
        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          type={popupMessage.type}
          title={popupMessage.title}
          message={popupMessage.message}
          duration={3000}
        />
      </div>
    </motion.div>
  );
};

export default OwnerContactManagement;