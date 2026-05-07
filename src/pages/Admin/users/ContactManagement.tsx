// src/pages/Admin/content/ContactManagement.tsx
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Eye, Search, CheckCircle, Clock, Reply, Archive,
  X, Send, Inbox, MailOpen, Archive as ArchiveIcon, TrendingUp,
  ArrowRight, MessageCircle, Star, AlertCircle, Bell, FileText, PhoneCall,
  Zap, User, AtSign, Calendar, Building, DollarSign, Users, UserCheck,
  Theater, Shield, Activity, MapPin, Download, RefreshCw, Filter
} from 'lucide-react';
import ReusableForm from '../../../components/Reusable/ReusableForm';
import ButtonStyle from '../../../components/Reusable/ButtonStyle';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import { Link } from 'react-router-dom';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'read' | 'unread' | 'replied' | 'archived';
  createdAt: string;
  repliedAt?: string;
  replyMessage?: string;
}

const mockMessages: ContactMessage[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '+251911234567', subject: 'Ticket Inquiry', message: 'I have a question about my tickets for the Hamilton show. Can you help me?', status: 'unread', createdAt: '2024-04-15T10:30:00' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+251912345678', subject: 'Group Booking', message: 'We need to book 50 tickets for our company event. Please contact me.', status: 'read', createdAt: '2024-04-14T14:20:00' },
  { id: '3', name: 'Michael Chen', email: 'michael@example.com', phone: '+251913456789', subject: 'Refund Request', message: 'I need a refund for my cancelled show tickets.', status: 'replied', createdAt: '2024-04-13T09:15:00', repliedAt: '2024-04-13T11:00:00', replyMessage: 'Your refund has been processed. It will reflect in 3-5 business days.' },
  { id: '4', name: 'Emily Wilson', email: 'emily@example.com', phone: '+251914567890', subject: 'Venue Information', message: 'What is the parking situation at the venue?', status: 'read', createdAt: '2024-04-12T16:45:00' },
  { id: '5', name: 'David Brown', email: 'david@example.com', phone: '+251915678901', subject: 'Partnership Opportunity', message: 'We would like to partner with your theater for events.', status: 'archived', createdAt: '2024-04-11T11:30:00' }
];

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

// Stat Card Component - Exactly like AdminDashboard
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
  link?: string;
  notification?: boolean;
  notificationCount?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, notification, notificationCount }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getNotificationColor = () => {
    if (title === 'Total Messages') return 'bg-purple-500';
    if (title === 'Unread') return 'bg-red-500';
    if (title === 'Read') return 'bg-blue-500';
    if (title === 'Replied') return 'bg-green-500';
    if (title === 'Archived') return 'bg-gray-500';
    return 'bg-teal-500';
  };

  const CardContent = () => (
    <div
      className="relative overflow-hidden cursor-pointer transition-all duration-300"
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
              <span className={`px-1.5 py-0.5 text-[9px] font-bold ${getNotificationColor()} text-white rounded-full animate-pulse`}>
                {notificationCount}
              </span>
            )}
          </div>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
        {link && (
          <div className={`transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'}`}>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      {link ? (
        <Link to={link} className="block">
          <CardContent />
        </Link>
      ) : (
        <CardContent />
      )}
    </motion.div>
  );
};

const ContactManagement: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, filterStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><Archive className="h-3 w-3" /> Archived</span>;
    }
  };

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
        replyMessage: replyContent
      } : m));
      setShowReplyModal(false);
      setReplyContent('');
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

  // Focus textarea when modal opens
  useEffect(() => {
    if (showReplyModal && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [showReplyModal]);

  // Dashboard Cards Data - styled like AdminDashboard
  const dashboardCards = [
    { title: 'Total Messages', value: messages.length, icon: Inbox, color: 'from-purple-500 to-purple-600', delay: 0.1, notification: true, notificationCount: messages.length },
    { title: 'Unread', value: messages.filter(m => m.status === 'unread').length, icon: Mail, color: 'from-red-500 to-red-600', delay: 0.15, notification: true, notificationCount: messages.filter(m => m.status === 'unread').length },
    { title: 'Read', value: messages.filter(m => m.status === 'read').length, icon: MailOpen, color: 'from-blue-500 to-blue-600', delay: 0.2, notification: false },
    { title: 'Replied', value: messages.filter(m => m.status === 'replied').length, icon: Reply, color: 'from-green-500 to-green-600', delay: 0.25, notification: false },
    { title: 'Archived', value: messages.filter(m => m.status === 'archived').length, icon: ArchiveIcon, color: 'from-gray-500 to-gray-600', delay: 0.3, notification: false }
  ];

  const columns = useMemo(() => [
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
    { Header: 'Subject', accessor: 'subject', sortable: true },
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
            onClick={() => {
              setSelectedMessage(row);
              setShowDetailsModal(true);
              if (row.status === 'unread') handleMarkAsRead(row);
            }}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => {
              setSelectedMessage(row);
              setReplyContent('');
              setShowReplyModal(true);
            }}
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
            <Archive className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )
    }
  ], [handleMarkAsRead, handleArchive]);

  // Details Modal
  const DetailsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
          <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">From</p>
              <p className="font-medium text-gray-900">{selectedMessage?.name}</p>
              <p className="text-sm text-gray-600">{selectedMessage?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
              <p className="text-sm text-gray-900">{selectedMessage?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Subject</p>
              <p className="font-medium text-gray-900">{selectedMessage?.subject}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Received</p>
              <p className="text-sm text-gray-600">{selectedMessage && formatDate(selectedMessage.createdAt)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Message</p>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>
          </div>

          {selectedMessage?.replyMessage && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-xs text-green-600 uppercase tracking-wide">Your Reply</p>
              <p className="text-sm text-green-800 mt-1 whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
              <p className="text-xs text-green-500 mt-1">Sent on {selectedMessage.repliedAt && formatDate(selectedMessage.repliedAt)}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <ReusableButton
              onClick={() => {
                setShowDetailsModal(false);
                setShowReplyModal(true);
              }}
              label="Reply"
              className="flex-1"
            />
            <ReusableButton variant="secondary" onClick={() => setShowDetailsModal(false)} label="Close" className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );

  // Quick Templates
  const quickTemplates = [
    {
      label: 'Standard Reply',
      template: `Dear ${selectedMessage?.name || 'Customer'},

Thank you for your message. I will look into this and get back to you shortly.

Best regards,
Customer Support Team`
    },
    {
      label: 'Formal Response',
      template: `Dear ${selectedMessage?.name || 'Customer'},

Thank you for contacting us. I am happy to assist you with your inquiry.

Best regards,
Customer Support Team`
    },
    {
      label: 'Casual Reply',
      template: `Hi ${selectedMessage?.name || 'Customer'},

Thanks for reaching out! I'll help you with your request right away.

Best,
Support Team`
    },
    {
      label: 'Ticket Inquiry Response',
      template: `Dear ${selectedMessage?.name || 'Customer'},

Thank you for your ticket inquiry. The Hamilton show tickets are available. Would you like me to check specific dates for you?

Best regards,
Support Team`
    },
    {
      label: 'Group Booking Response',
      template: `Dear ${selectedMessage?.name || 'Customer'},

Thank you for your group booking inquiry. We can accommodate 50 tickets for your company event. Please let me know your preferred date and time.

Best regards,
Support Team`
    }
  ];

  const handleTemplateClick = (template: string) => {
    setReplyContent(template);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // Reply Modal
  const ReplyModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReplyModal(false)}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg">
              <Reply className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reply to {selectedMessage?.name}</h2>
              <p className="text-xs text-gray-500">Compose your professional response</p>
            </div>
          </div>
          <button onClick={() => setShowReplyModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-y font-sans text-gray-700 placeholder-gray-400"
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                  {replyContent.length === 0 ? 'No message typed yet' : `${replyContent.length} characters`}
                </p>
                {replyContent.length > 0 && replyContent.length < 20 && (
                  <p className="text-xs text-amber-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Message is quite short
                  </p>
                )}
                {replyContent.length >= 20 && replyContent.length < 100 && (
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Looking good
                  </p>
                )}
                {replyContent.length >= 100 && (
                  <p className="text-xs text-sky-500 flex items-center gap-1">
                    <Star className="h-3 w-3" /> Great detail!
                  </p>
                )}
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                Quick Templates
              </p>
              <div className="flex flex-wrap gap-2">
                {quickTemplates.map((template, idx) => (
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
              <p className="text-xs text-gray-400 mt-3">Click a template to auto-fill the message</p>
            </div>

            {/* Original Message Section */}
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl p-4 border border-sky-100">
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-600" />
                Original Message from {selectedMessage?.name}:
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
                <div className="flex items-start gap-2">
                  <Calendar className="h-3 w-3 text-gray-400 mt-0.5" />
                  <p className="text-xs text-gray-600">Received: {selectedMessage && formatDate(selectedMessage.createdAt)}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-sky-200">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage?.message}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-sky-200">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <PhoneCall className="h-3 w-3" />
                    Phone: {selectedMessage?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <ReusableButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyContent('');
                }}
                className="flex-1"
              >
                Cancel
              </ReusableButton>
              <ReusableButton
                type="button"
                onClick={handleSendReply}
                disabled={!replyContent.trim()}
                className="flex-1"
              >
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
      className="space-y-8 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-100">
          <Mail className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-sm text-gray-500">View and manage customer inquiries</p>
        </div>
      </motion.div>

      {/* Stats Grid - Exactly like AdminDashboard */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {dashboardCards.map((card, index) => (
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

      {/* Search and Filter */}
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
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
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
      {showDetailsModal && selectedMessage && <DetailsModal />}
      {showReplyModal && selectedMessage && <ReplyModal />}

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