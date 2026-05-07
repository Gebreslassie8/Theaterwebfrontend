// src/pages/Owner/content/OwnerContactManagement.tsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Eye, Search, CheckCircle, Clock, Reply,
  X, Send, Inbox,
  Trash2, Filter, RefreshCw, User,
  Tag, MessageCircle, Theater,
  Ticket, Phone, MapPin, Edit2, Settings, XCircle
} from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';
import SuccessPopup from '../../components/Reusable/SuccessPopup';

// Types
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
  recipientType: 'theater';
  theaterId: string;
  theaterName: string;
  status: 'read' | 'unread' | 'replied';
  createdAt: string;
  repliedAt?: string;
  replyMessage?: string;
  repliedBy?: string;
}

interface TheaterInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    telegram: string;
    tiktok: string;
  };
}

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

// Mock data
const mockMessages: ContactMessage[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+251912345678',
    subject: 'Question about Hamilton Show',
    message: 'I want to book tickets for Hamilton. Is there a group discount?',
    category: 'booking',
    recipientType: 'theater',
    theaterId: '1',
    theaterName: 'Grand Theater',
    status: 'unread',
    createdAt: '2024-04-14T14:20:00'
  },
  {
    id: '2',
    name: 'Emily Wilson',
    email: 'emily@example.com',
    phone: '+251914567890',
    subject: 'Parking Information',
    message: 'What is the parking situation at Grand Theater?',
    category: 'general',
    recipientType: 'theater',
    theaterId: '1',
    theaterName: 'Grand Theater',
    status: 'replied',
    createdAt: '2024-04-12T16:45:00',
    repliedAt: '2024-04-12T17:30:00',
    replyMessage: 'Dear Emily, we have valet parking available. The cost is 50 ETB.',
    repliedBy: 'Theater Owner'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+251915678901',
    subject: 'Group Booking Request',
    message: 'We have a group of 25 people interested in coming to the show next Friday. Do you offer group discounts?',
    category: 'booking',
    recipientType: 'theater',
    theaterId: '1',
    theaterName: 'Grand Theater',
    status: 'unread',
    createdAt: '2024-04-13T10:30:00'
  }
];

// Mock theater info
const mockTheaterInfo: TheaterInfo = {
  id: '1',
  name: 'Grand Theater',
  phone: '+251 911 234 567',
  email: 'info@grandtheater.com',
  address: 'Bole Road, Addis Ababa, Ethiopia',
  description: 'Premier cinema in Bole area with luxury seating and state-of-the-art sound system.',
  socialMedia: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    telegram: '',
    tiktok: ''
  }
};

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
    feedback: { color: 'bg-green-100 text-green-700', label: 'Feedback' }
  };
  const c = config[category] || config.general;
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
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
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Unread</span>;
  }
};

// Edit Contact Info Modal
const EditContactInfoModal: React.FC<{
  theaterInfo: TheaterInfo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedInfo: TheaterInfo) => void;
}> = ({ theaterInfo, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(theaterInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      onClose();
    }, 500);
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
            <h2 className="text-xl font-bold text-white">Edit Theater Information</h2>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
              <XCircle className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theater Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="border-t pt-4 mt-2">
            <h3 className="font-semibold text-gray-900 mb-3">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(formData.socialMedia).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, [key]: e.target.value }
                    })}
                    placeholder={`https://${key}.com/yourpage`}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const OwnerContactManagement: React.FC = () => {
  const theaterId = '1';
  const theaterName = 'Grand Theater';
  const [theaterInfo, setTheaterInfo] = useState<TheaterInfo>(mockTheaterInfo);
  const [showEditModal, setShowEditModal] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>(
    mockMessages.filter(m => m.theaterId === theaterId)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
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
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [messages, searchTerm, filterStatus, filterCategory]);

  const stats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    booking: messages.filter(m => m.category === 'booking').length,
    general: messages.filter(m => m.category === 'general').length,
  }), [messages]);

  const handleMarkAsRead = useCallback((message: ContactMessage) => {
    if (message.status === 'unread') {
      setMessages(prev => prev.map(m => m.id === message.id ? { ...m, status: 'read' } : m));
    }
  }, []);

  const handleSendReply = useCallback(() => {
    if (selectedMessage && replyContent.trim()) {
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? {
        ...m,
        status: 'replied',
        repliedAt: new Date().toISOString(),
        replyMessage: replyContent,
        repliedBy: 'Theater Owner'
      } : m));
      setShowModal(false);
      setReplyContent('');
      setSelectedMessage(null);
      setPopupMessage({
        title: '✓ Reply Sent',
        message: `Your reply has been sent to ${selectedMessage.name}`,
        type: 'success'
      });
      setShowSuccessPopup(true);
    }
  }, [selectedMessage, replyContent]);

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

  const handleSaveTheaterInfo = (updatedInfo: TheaterInfo) => {
    setTheaterInfo(updatedInfo);
    setPopupMessage({
      title: 'Success!',
      message: 'Theater information updated successfully',
      type: 'success'
    });
    setShowSuccessPopup(true);
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
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterCategory('all');
  };

  const statsCards = [
    { title: 'Total Messages', value: stats.total, icon: Inbox, color: 'from-teal-500 to-teal-600', delay: 0.1, notification: true, notificationCount: stats.total },
    { title: 'Unread', value: stats.unread, icon: Mail, color: 'from-red-500 to-red-600', delay: 0.15, notification: true, notificationCount: stats.unread },
    { title: 'Booking', value: stats.booking, icon: Ticket, color: 'from-blue-500 to-blue-600', delay: 0.2, notification: true, notificationCount: stats.booking },
    { title: 'General', value: stats.general, icon: MessageCircle, color: 'from-green-500 to-green-600', delay: 0.25, notification: true, notificationCount: stats.general }
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
            title="View"
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
              <p className="text-xs text-gray-500">Customer Inquiry</p>
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
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Message</p>
            <div className="mt-1 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedMessage?.message}</p>
            </div>
          </div>

          {selectedMessage?.replyMessage && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Reply className="h-4 w-4 text-green-600" />
                <p className="text-xs font-semibold text-green-700">Your Reply</p>
              </div>
              <p className="text-sm text-green-800 whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
              <p className="text-xs text-green-600 mt-2">Sent on {selectedMessage.repliedAt && formatDate(selectedMessage.repliedAt)}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => { setShowModal(false); openReplyModal(selectedMessage!); }} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
              Reply
            </button>
            <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Reply Modal - Fixed typing functionality
  const ReplyModal = () => {
    // Handle textarea change
    const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setReplyContent(e.target.value);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Reply className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Reply to {selectedMessage?.name}</h2>
                <p className="text-xs text-gray-500">Write your response below</p>
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Message Textarea - Fixed typing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                ref={textareaRef}
                value={replyContent}
                onChange={handleReplyChange}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-y font-sans"
                placeholder="Type your reply here..."
                autoFocus
              />
            </div>

            {/* Original Message Reference */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Original Message
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <User className="h-3 w-3" />
                <span>{selectedMessage?.name}</span>
                <span>•</span>
                <Tag className="h-3 w-3" />
                <span>{selectedMessage?.subject}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendReply} 
                disabled={!replyContent.trim()} 
                className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                <Send className="h-4 w-4" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              <p className="text-sm text-gray-500 mt-1">Manage customer inquiries for {theaterName}</p>
            </div>
          </div>
          <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Edit Theater Info
          </button>
        </div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 mb-6">
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
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="booking">Booking</option>
              <option value="feedback">Feedback</option>
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

        {/* Modals */}
        {showModal && modalMode === 'view' && <ViewModal />}
        {showModal && modalMode === 'reply' && <ReplyModal />}
        
        <EditContactInfoModal
          theaterInfo={theaterInfo}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveTheaterInfo}
        />

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
          position="top-right"
        />
      </div>
    </motion.div>
  );
};

export default OwnerContactManagement;