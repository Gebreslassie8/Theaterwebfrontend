//frontend\src\components\content\AdmincontactManagement.tsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Eye, Search, CheckCircle, Clock, Reply, Archive,
  X, Send, Inbox, MailOpen, Archive as ArchiveIcon,
  Trash2, Filter, RefreshCw, User, AtSign, Calendar,
  PhoneCall, Star, AlertCircle, Tag, Users, DollarSign,
  Ticket, Briefcase, MessageCircle, UserCog, Theater,
  ChevronDown
} from 'lucide-react';
import ReusableButton from '../Reusable/ReusableButton';
import ReusableTable from '../Reusable/ReusableTable';
import SuccessPopup from '../Reusable/SuccessPopup';
import supabase from '@/config/supabaseClient';

// Types
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
  recipientType: 'admin' | 'theater';
  theaterId?: string;
  theaterName?: string;
  status: 'read' | 'unread' | 'replied' | 'archived';
  createdAt: string;
  repliedAt?: string;
  replyMessage?: string;
  repliedBy?: string;
}

// Mock data with recipient types
const initialMessages: ContactMessage[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+251911234567',
    subject: 'Technical Issue with Platform',
    message: 'The website is not loading properly on my mobile device.',
    category: 'technical',
    recipientType: 'admin',
    status: 'unread',
    createdAt: '2024-04-15T10:30:00'
  }
];

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getCategoryBadge = (category: string) => {
  const config: Record<string, { color: string; label: string }> = {
    general: { color: 'bg-gray-100 text-gray-700', label: 'General' },
    booking: { color: 'bg-blue-100 text-blue-700', label: 'Booking' },
    payment: { color: 'bg-yellow-100 text-yellow-700', label: 'Payment' },
    technical: { color: 'bg-orange-100 text-orange-700', label: 'Technical' },
    feedback: { color: 'bg-green-100 text-green-700', label: 'Feedback' },
    partnership: { color: 'bg-purple-100 text-purple-700', label: 'Partnership' }
  };
  
  const c = config[category] || config.general;
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
};

const getRecipientBadge = (recipientType: string, theaterName?: string) => {
  if (recipientType === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
        <UserCog className="h-3 w-3" /> System Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
      <Theater className="h-3 w-3" /> {theaterName || 'Theater Owner'}
    </span>
  );
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'unread':
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><Clock className="h-3 w-3" /> Unread</span>;
    case 'read':
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"><Eye className="h-3 w-3" /> Read</span>;
    case 'replied':
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Replied</span>;
    default:
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><ArchiveIcon className="h-3 w-3" /> Archived</span>;
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
  notification?: boolean;
  notificationCount?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, notification, notificationCount }) => {
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
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">{title}</p>
              {notification && notificationCount !== undefined && notificationCount > 0 && (
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

// Quick Templates for Admin
const adminTemplates = [
  {
    label: 'Technical Support',
    template: (name: string) => `Dear ${name},

Thank you for reporting this technical issue. Our team is investigating and will resolve it shortly.

Best regards,
Technical Support Team`
  },
  {
    label: 'Payment Issue',
    template: (name: string) => `Dear ${name},

I apologize for the payment issue you experienced. I've forwarded this to our payment processing team for immediate review.

Best regards,
Support Team`
  },
  {
    label: 'Partnership',
    template: (name: string) => `Dear ${name},

Thank you for your interest in partnering with us. I'll connect you with our partnerships team.

Best regards,
Partnerships Coordinator`
  },
  {
    label: 'General Response',
    template: (name: string) => `Dear ${name},

Thank you for your message. I'll look into this and get back to you shortly.

Best regards,
Customer Support Team`
  }
];

const ContactManagement: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRecipient, setFilterRecipient] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'reply'>('view');
  const [replyContent, setReplyContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
      const matchesRecipient = filterRecipient === 'all' || m.recipientType === filterRecipient;
      return matchesSearch && matchesStatus && matchesCategory && matchesRecipient;
    });
  }, [messages, searchTerm, filterStatus, filterCategory, filterRecipient]);

  const stats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    adminMessages: messages.filter(m => m.recipientType === 'admin').length,
    theaterMessages: messages.filter(m => m.recipientType === 'theater').length,
    booking: messages.filter(m => m.category === 'booking').length,
    payment: messages.filter(m => m.category === 'payment').length,
    partnership: messages.filter(m => m.category === 'partnership').length,
  }), [messages]);

  const handleMarkAsRead = useCallback((message: ContactMessage) => {
    if (message.status === 'unread') {
      setMessages(prev => prev.map(m => m.id === message.id ? { ...m, status: 'read' } : m));
      setPopupMessage({
        title: 'Marked as Read',
        message: `Message from ${message.name} marked as read`,
        type: 'success'
      });
      setShowSuccessPopup(true);
    }
  }, []);

  const handleSendReply = useCallback(() => {
    if (selectedMessage && replyContent.trim()) {
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? {
        ...m,
        status: 'replied',
        repliedAt: new Date().toISOString(),
        replyMessage: replyContent,
        repliedBy: 'Admin'
      } : m));
      setShowModal(false);
      setReplyContent('');
      setSelectedMessage(null);
      setPopupMessage({
        title: '✓ Reply Sent Successfully',
        message: `Your reply has been sent to ${selectedMessage.name}`,
        type: 'success'
      });
      setShowSuccessPopup(true);
    }
  }, [selectedMessage, replyContent]);

  const handleArchive = useCallback((message: ContactMessage) => {
    setMessages(prev => prev.map(m => m.id === message.id ? { ...m, status: 'archived' } : m));
    setPopupMessage({
      title: 'Archived',
      message: `Message from ${message.name} archived`,
      type: 'success'
    });
    setShowSuccessPopup(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedMessage) {
      setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
      setShowDeleteConfirm(false);
      setSelectedMessage(null);
      setPopupMessage({
        title: 'Deleted',
        message: `Message from ${selectedMessage.name} has been deleted`,
        type: 'success'
      });
      setShowSuccessPopup(true);
    }
  }, [selectedMessage]);

  const handleTemplateClick = (templateGenerator: (name: string) => string) => {
    if (selectedMessage) {
      const template = templateGenerator(selectedMessage.name);
      setReplyContent(template);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  const openViewModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setModalMode('view');
    setShowModal(true);
    if (message.status === 'unread') handleMarkAsRead(message);
  };

  const openReplyModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setModalMode('reply');
    setReplyContent('');
    setShowModal(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterCategory('all');
    setFilterRecipient('all');
  };

  const statsCards = [
    { title: 'Total Messages', value: stats.total, icon: Inbox, color: 'from-purple-500 to-purple-600', delay: 0.1, notification: true, notificationCount: stats.total },
    { title: 'Unread', value: stats.unread, icon: Mail, color: 'from-red-500 to-red-600', delay: 0.15, notification: true, notificationCount: stats.unread },
    { title: 'To Admin', value: stats.adminMessages, icon: UserCog, color: 'from-indigo-500 to-indigo-600', delay: 0.2, notification: true, notificationCount: stats.adminMessages },
    { title: 'To Theaters', value: stats.theaterMessages, icon: Theater, color: 'from-teal-500 to-teal-600', delay: 0.25, notification: true, notificationCount: stats.theaterMessages },
    { title: 'Partnership', value: stats.partnership, icon: Users, color: 'from-green-500 to-green-600', delay: 0.3, notification: true, notificationCount: stats.partnership }
  ];

  const columns = [
    {
      Header: 'From',
      accessor: 'name',
      sortable: true,
      Cell: (row: ContactMessage) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      )
    },
    {
      Header: 'Subject',
      accessor: 'subject',
      sortable: true,
      Cell: (row: ContactMessage) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-800 truncate">{row.subject}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {getCategoryBadge(row.category)}
          </div>
        </div>
      )
    },
    {
      Header: 'Recipient',
      accessor: 'recipientType',
      sortable: true,
      Cell: (row: ContactMessage) => getRecipientBadge(row.recipientType, row.theaterName)
    },
    {
      Header: 'Received',
      accessor: 'createdAt',
      sortable: true,
      Cell: (row: ContactMessage) => <p className="text-sm text-gray-600">{formatDate(row.createdAt)}</p>
    },
    {
      Header: 'Status',
      accessor: 'status',
      sortable: true,
      Cell: (row: ContactMessage) => getStatusBadge(row.status)
    },
    {
      Header: 'Actions',
      accessor: 'id',
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
          <button
            onClick={() => openReplyModal(row)}
            className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
            title="Reply"
          >
            <Reply className="h-4 w-4 text-green-600" />
          </button>
          <button
            onClick={() => handleArchive(row)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Archive"
          >
            <ArchiveIcon className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => { setSelectedMessage(row); setShowDeleteConfirm(true); }}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  // View Modal
  const ViewModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
              <p className="text-xs text-gray-500">From: {selectedMessage?.name}</p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">From</p>
              <p className="font-medium text-gray-900">{selectedMessage?.name}</p>
              <p className="text-sm text-gray-600">{selectedMessage?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
              <p className="text-sm text-gray-900">{selectedMessage?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Subject</p>
              <p className="font-medium text-gray-900">{selectedMessage?.subject}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
              {selectedMessage && getCategoryBadge(selectedMessage.category)}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Recipient</p>
              {selectedMessage && getRecipientBadge(selectedMessage.recipientType, selectedMessage.theaterName)}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
              {selectedMessage && getStatusBadge(selectedMessage.status)}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Message</p>
            <div className="mt-1 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedMessage?.message}</p>
            </div>
          </div>

          {selectedMessage?.replyMessage && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Reply className="h-4 w-4 text-green-600" />
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Your Reply</p>
              </div>
              <p className="text-sm text-green-800 whitespace-pre-wrap leading-relaxed">{selectedMessage.replyMessage}</p>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-green-200">
                <p className="text-xs text-green-600">Sent on {selectedMessage.repliedAt && formatDate(selectedMessage.repliedAt)}</p>
                <p className="text-xs text-green-600">By: {selectedMessage.repliedBy || 'Admin'}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <ReusableButton onClick={() => { setShowModal(false); openReplyModal(selectedMessage!); }} label="Reply" className="flex-1" />
            <ReusableButton variant="secondary" onClick={() => setShowModal(false)} label="Close" className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );

  // Reply Modal
  const ReplyModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Reply className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reply to {selectedMessage?.name}</h2>
              <p className="text-xs text-gray-500">Compose your response</p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                ref={textareaRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Dear ${selectedMessage?.name},

Thank you for your message. I am happy to assist you with your inquiry.

Best regards,
Customer Support Team`}
                rows={10}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-y"
              />
            </div>

            {/* Quick Templates */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                Quick Templates
              </p>
              <div className="flex flex-wrap gap-2">
                {adminTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTemplateClick(template.template)}
                    className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all duration-200"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Original Message Section */}
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl p-4 border border-sky-100">
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-600" />
                Original Message:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <User className="h-3 w-3 text-gray-400 mt-0.5" />
                  <p className="text-xs text-gray-600">From: {selectedMessage?.name} ({selectedMessage?.email})</p>
                </div>
                <div className="flex items-start gap-2">
                  <AtSign className="h-3 w-3 text-gray-400 mt-0.5" />
                  <p className="text-xs text-gray-600">Subject: {selectedMessage?.subject}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-sky-200">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage?.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <ReusableButton type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                Cancel
              </ReusableButton>
              <ReusableButton type="button" onClick={handleSendReply} disabled={!replyContent.trim()} className="flex-1">
                <Send className="h-4 w-4" />
                Send Reply
              </ReusableButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 p-6 bg-gray-50 min-h-screen"
    >
      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
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
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterRecipient}
            onChange={(e) => setFilterRecipient(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            <option value="all">All Recipients</option>
            <option value="admin">System Admin</option>
            <option value="theater">Theater Owners</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="booking">Booking</option>
            <option value="payment">Payment</option>
            <option value="technical">Technical</option>
            <option value="feedback">Feedback</option>
            <option value="partnership">Partnership</option>
          </select>
          <ReusableButton onClick={resetFilters} variant="secondary" icon={RefreshCw} label="Reset" />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <ReusableTable
          columns={columns}
          data={filteredMessages}
          title="Contact Messages"
          icon={Mail}
          showSearch={false}
          showExport={true}
          showPrint={false}
          itemsPerPage={10}
        />
      </motion.div>

      {/* Modals */}
      {showModal && modalMode === 'view' && <ViewModal />}
      {showModal && modalMode === 'reply' && <ReplyModal />}

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
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this message from "<strong>{selectedMessage.name}</strong>"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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
        position="top-right"
      />
    </motion.div>
  );
};

export default ContactManagement;