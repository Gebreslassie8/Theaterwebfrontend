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
  Globe
} from "lucide-react";
import ReusableTable from "../../components/Reusable/ReusableTable";
import SuccessPopup from "../../components/Reusable/SuccessPopup";
import SocialLinksManager from "../../components/socialinkmanage/SocialLinksManager";
import ReplyContactReusable, { FlexibleContactMessage } from "../../components/content/ReplyContactReusable";
import supabase from "@/config/supabaseClient";

// ==================== Types ====================
interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  subject: string;
  message: string;
  message_category: string;
  recipient_type: "theater" | "admin";
  theater_id: string | null;
  status: "pending" | "read" | "replied" | "archived";
  ip_address: string;
  user_agent: string;
  referrer_url: string;
  created_at: string;
  updated_at: string;
  theater_name?: string;
  reply_message?: string;
  replied_at?: string;
  replied_by?: string;
}

interface TheaterInfo {
  id: string;
  legal_business_name: string;
  trade_name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  logo_url?: string;
  description?: string;
  social_links?: any;
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

  const getStatusBadge = () => {
    switch (message.status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <Clock className="h-3 w-3" /> Pending
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
              <p className="font-medium text-gray-900">{message.sender_name}</p>
              <p className="text-sm text-gray-600">{message.sender_email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
              <p className="text-sm text-gray-900">{message.sender_phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Subject</p>
              <p className="font-medium text-gray-900">{message.subject}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
              <p className="text-sm text-gray-600">{message.message_category}</p>
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
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSocialManager, setShowSocialManager] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "",
    message: "",
    type: "success" as any,
  });

  // Get current user from session
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
        } else {
          const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
          if (userStr) {
            setCurrentUser(JSON.parse(userStr));
          }
        }
      } catch (error) {
        console.error("Error getting user:", error);
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

      // Get messages for this theater
      const { data: messagesData, error: messagesError } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("theater_id", theaterData.id)
        .eq("recipient_type", "theater")
        .order("created_at", { ascending: false });

      if (messagesError) throw messagesError;

      // Get responses
      if (messagesData && messagesData.length > 0) {
        const messageIds = messagesData.map(m => m.id);
        const { data: responsesData } = await supabase
          .from("contact_responses")
          .select("*")
          .in("contact_message_id", messageIds);
        
        if (responsesData) setResponses(responsesData);
      }

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

  // Get reply for a message
  const getReplyForMessage = (messageId: string) => {
    return responses.find(r => r.contact_message_id === messageId);
  };

  // Mark message as read
  const handleMarkAsRead = useCallback(async (message: ContactMessage) => {
    if (message.status === "pending") {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status: "read", updated_at: new Date().toISOString() })
        .eq("id", message.id);
      
      if (!error) {
        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, status: "read" } : m));
      }
    }
  }, []);

  // Handle reply using ReplyContactReusable
  const handleSendReply = useCallback(async (messageId: string, replyContent: string, ccSelf?: boolean) => {
    if (!currentUser) return;
    
    setSendingReply(true);
    
    try {
      // Insert response
      const { error: responseError } = await supabase
        .from("contact_responses")
        .insert({
          contact_message_id: messageId,
          response_message: replyContent,
          responded_by: currentUser.id,
          responder_role: "theater_owner",
          response_type: "direct",
          email_sent: false,
          email_sent_at: new Date().toISOString(),
          email_status: "pending"
        });
      
      if (responseError) throw responseError;
      
      // Update message status
      const { error: updateError } = await supabase
        .from("contact_messages")
        .update({
          status: "replied",
          updated_at: new Date().toISOString()
        })
        .eq("id", messageId);
      
      if (updateError) throw updateError;
      
      // Update local state
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, status: "replied", reply_message: replyContent, replied_at: new Date().toISOString() } : m
      ));
      
      setResponses(prev => [...prev, {
        contact_message_id: messageId,
        response_message: replyContent,
        created_at: new Date().toISOString()
      }]);
      
      setPopupMessage({
        title: "✓ Reply Sent",
        message: "Your reply has been sent successfully",
        type: "success",
      });
      setShowSuccessPopup(true);
      
      // Auto close popup after 3 seconds
      setTimeout(() => setShowSuccessPopup(false), 3000);
      
    } catch (error: any) {
      console.error("Error sending reply:", error);
      setPopupMessage({
        title: "Error!",
        message: error.message || "Failed to send reply",
        type: "error",
      });
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } finally {
      setSendingReply(false);
    }
  }, [currentUser]);

  // Delete message
  const handleDelete = useCallback(async () => {
    if (!selectedMessage) return;
    
    try {
      await supabase.from("contact_responses").delete().eq("contact_message_id", selectedMessage.id);
      
      const { error } = await supabase.from("contact_messages").delete().eq("id", selectedMessage.id);
      if (error) throw error;
      
      setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
      setResponses(prev => prev.filter(r => r.contact_message_id !== selectedMessage.id));
      setShowDeleteConfirm(false);
      setSelectedMessage(null);
      
      setPopupMessage({ title: "Deleted", message: "Message has been deleted", type: "success" });
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error: any) {
      setPopupMessage({ title: "Error!", message: error.message, type: "error" });
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  }, [selectedMessage]);

  // Convert message to FlexibleContactMessage for ReplyContactReusable
  const convertToFlexibleMessage = (message: ContactMessage): FlexibleContactMessage => {
    return {
      id: message.id,
      name: message.sender_name,
      email: message.sender_email,
      phone: message.sender_phone || undefined,
      subject: message.subject,
      message: message.message,
      category: message.message_category,
      recipientType: message.recipient_type,
      theaterId: message.theater_id || undefined,
      theaterName: theaterInfo?.legal_business_name,
      status: message.status,
      createdAt: message.created_at,
      repliedAt: message.replied_at,
      replyMessage: message.reply_message,
    };
  };

  // Open view modal
  const openViewModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowViewModal(true);
    if (message.status === "pending") handleMarkAsRead(message);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch = m.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.sender_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || m.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, filterStatus]);

  const stats = useMemo(() => ({
    total: messages.length,
    pending: messages.filter(m => m.status === "pending").length,
    read: messages.filter(m => m.status === "read").length,
    replied: messages.filter(m => m.status === "replied").length,
  }), [messages]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><Clock className="h-3 w-3" /> Pending</span>;
      case "read":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"><Eye className="h-3 w-3" /> Read</span>;
      case "replied":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Replied</span>;
      default:
        return null;
    }
  };

  const columns = [
    {
      Header: "From",
      accessor: "sender_name",
      sortable: true,
      Cell: (row: ContactMessage) => (
        <div>
          <p className="font-medium text-gray-900">{row.sender_name}</p>
          <p className="text-xs text-gray-500">{row.sender_email}</p>
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
          <p className="text-xs text-gray-400 mt-0.5">{row.message_category}</p>
        </div>
      ),
    },
    {
      Header: "Received",
      accessor: "created_at",
      sortable: true,
      Cell: (row: ContactMessage) => <p className="text-sm text-gray-600">{formatDate(row.created_at)}</p>,
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
      Cell: (row: ContactMessage) => {
        const reply = getReplyForMessage(row.id);
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openViewModal(row)}
              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4 text-blue-600" />
            </button>

            {row.status !== "replied" && !reply && (
              <ReplyContactReusable
                message={convertToFlexibleMessage(row)}
                onReply={handleSendReply}
                theaterName={theaterInfo?.legal_business_name}
                isSubmitting={sendingReply}
              />
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
        );
      },
    },
  ];

  const statsCards = [
    { title: "Total Messages", value: stats.total, icon: Inbox, color: "from-teal-500 to-teal-600", delay: 0.1, notification: false, notificationCount: stats.total },
    { title: "Pending", value: stats.pending, icon: Mail, color: "from-red-500 to-red-600", delay: 0.15, notification: true, notificationCount: stats.pending },
    { title: "Read", value: stats.read, icon: Eye, color: "from-blue-500 to-blue-600", delay: 0.2, notification: false },
    { title: "Replied", value: stats.replied, icon: Reply, color: "from-green-500 to-green-600", delay: 0.25, notification: false },
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
              <h1 className="text-2xl font-bold text-gray-900">Customer Messages</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage customer inquiries for {theaterInfo?.legal_business_name || "your theater"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSocialManager(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition flex items-center gap-2 shadow-md"
          >
            <Globe className="h-4 w-4" />
            Manage Social Links
          </button>
        </div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statsCards.map((card, index) => (
            <StatCard key={index} title={card.title} value={card.value} icon={card.icon} color={card.color} delay={card.delay} notification={card.notification} notificationCount={card.notificationCount} />
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 mb-6">
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
              <option value="pending">Pending</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
            <button onClick={resetFilters} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
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

        {/* View Modal */}
        <ViewModal
          message={selectedMessage}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedMessage(null);
          }}
          onReply={() => {
            setShowViewModal(false);
          }}
        />


{showSocialManager && theaterInfo && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSocialManager(false)}>
    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Social Media Links</h2>
          </div>
          <button onClick={() => setShowSocialManager(false)} className="p-1 hover:bg-white/20 rounded-lg transition">
            <XCircle className="h-5 w-5 text-white" />
          </button>
        </div>
        <p className="text-teal-100 text-sm mt-2 ml-14">
          Manage your theater's social media presence
        </p>
      </div>
      <div className="p-6">
        <SocialLinksManager 
          theaterId={theaterInfo.id} 
          onClose={() => setShowSocialManager(false)} 
        />
      </div>
      {/* Removed the Close button from here since SocialLinksManager handles it */}
    </div>
  </div>
)}

        {/* Delete Confirm Modal */}
        {showDeleteConfirm && selectedMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Message</h3>
              </div>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
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