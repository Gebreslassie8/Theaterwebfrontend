// src/components/content/AdmincontactManagement.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Eye, Search, CheckCircle, Clock, Reply,
  X, Inbox, MailOpen,
  User, AtSign, Calendar, Theater, Shield, Filter, Trash2, Globe, AlertCircle
} from 'lucide-react';
import SuccessPopup from '../Reusable/SuccessPopup';
import ReplyContactReusable, { FlexibleContactMessage } from './ReplyContactReusable';
import AdminSocialLinksManager from '../socialinkmanage/AdminSocialLinksManager';
import ReusableTable from '../Reusable/ReusableTable';
import supabase from "@/config/supabaseClient";

// Types
interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  subject: string;
  message: string;
  message_category: string;
  recipient_type: 'admin' | 'theater';
  theater_id: string | null;
  status: 'pending' | 'read' | 'replied' | 'archived' | 'spam';
  ip_address: string;
  user_agent: string;
  referrer_url: string;
  created_at: string;
  updated_at: string;
  theater_name?: string;
}

interface ContactMessageWithResponse extends ContactMessage {
  reply_message?: string;
  replied_at?: string;
  replied_by?: string;
}

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

  const getNotificationColor = () => {
    if (title === 'Total Messages') return 'bg-purple-500';
    if (title === 'Pending') return 'bg-red-500';
    if (title === 'Read') return 'bg-blue-500';
    if (title === 'Replied') return 'bg-green-500';
    return 'bg-teal-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
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
      </div>
    </motion.div>
  );
};

const AdmincontactManagement: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessageWithResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageWithResponse | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
  const [loading, setLoading] = useState(true);
  const [showSocialManager, setShowSocialManager] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessageWithResponse | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sendingReply, setSendingReply] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Fetch current user from custom users table (not Supabase Auth)
  useEffect(() => {
    const getCurrentUser = async () => {
      setIsLoadingUser(true);
      try {
        // Try to get user from localStorage/session (your dashboard auth)
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('📱 User from storage:', parsedUser);
          
          // Check if user exists in your custom users table
          const { data: dbUser, error } = await supabase
            .from('users')
            .select('id, email, full_name, role')
            .eq('email', parsedUser.email)
            .single();
          
          if (dbUser && !error) {
            setCurrentUser(dbUser);
            console.log('✅ User found in database:', dbUser);
          } else {
            // Try to get first admin user from database
            const { data: adminUser, error: adminError } = await supabase
              .from('users')
              .select('id, email, full_name, role')
              .eq('role', 'admin')
              .limit(1)
              .single();
            
            if (adminUser && !adminError) {
              setCurrentUser(adminUser);
              console.log('✅ Using admin user:', adminUser);
            } else {
              console.error('❌ No user found in database');
            }
          }
        } else {
          // No stored user, try to get first admin from database
          const { data: adminUser, error: adminError } = await supabase
            .from('users')
            .select('id, email, full_name, role')
            .eq('role', 'admin')
            .limit(1)
            .single();
          
          if (adminUser && !adminError) {
            setCurrentUser(adminUser);
            console.log('✅ Using admin user from database:', adminUser);
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    getCurrentUser();
  }, []);

  // Fetch messages from database
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all contact messages with theater info
      const { data: messagesData, error: messagesError } = await supabase
        .from('contact_messages')
        .select(`
          *,
          theaters:theater_id (
            legal_business_name
          )
        `)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Fetch responses to get reply messages
      const { data: responsesData, error: responsesError } = await supabase
        .from('contact_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (responsesError) throw responsesError;

      // Map messages with theater names and responses
      const mappedMessages: ContactMessageWithResponse[] = (messagesData || []).map(msg => {
        const messageResponses = (responsesData || []).filter(r => r.contact_message_id === msg.id);
        const latestResponse = messageResponses[0];
        
        return {
          ...msg,
          theater_name: msg.theaters?.legal_business_name,
          status: msg.status as 'pending' | 'read' | 'replied' | 'archived' | 'spam',
          reply_message: latestResponse?.response_message,
          replied_at: latestResponse?.created_at,
        };
      });

      setMessages(mappedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setPopupMessage({
        title: 'Error',
        message: 'Failed to load messages',
        type: 'error'
      });
      setShowSuccessPopup(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      const matchesSearch = m.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.sender_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
      const matchesType = filterType === 'all' || m.recipient_type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [messages, searchTerm, filterStatus, filterType]);

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
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><Clock className="h-3 w-3" /> Pending</span>;
      case 'read':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"><Eye className="h-3 w-3" /> Read</span>;
      case 'replied':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Replied</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const getRecipientBadge = (type: string, theaterName?: string) => {
    if (type === 'admin') {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"><Shield className="h-3 w-3" /> Admin</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700"><Theater className="h-3 w-3" /> {theaterName || 'Theater'}</span>;
  };

  const handleMarkAsRead = useCallback(async (message: ContactMessageWithResponse) => {
    if (message.status === 'pending') {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read', updated_at: new Date().toISOString() })
        .eq('id', message.id);

      if (!error) {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: 'read' } : m
        ));
        setPopupMessage({
          title: 'Marked as Read',
          message: `Message from ${message.sender_name} marked as read`,
          type: 'success'
        });
        setShowSuccessPopup(true);
      }
    }
  }, []);

  const handleSendReply = useCallback(async (messageId: string, replyContent: string, ccSelf?: boolean) => {
    // Check if user is available
    if (!currentUser) {
      setPopupMessage({
        title: 'Error',
        message: 'Unable to identify user. Please refresh the page.',
        type: 'error'
      });
      setShowSuccessPopup(true);
      return;
    }

    setSendingReply(true);

    try {
      console.log('Sending reply with user:', { id: currentUser.id, email: currentUser.email });

      // First, verify the message exists
      const { data: existingMessage, error: checkError } = await supabase
        .from('contact_messages')
        .select('id, status')
        .eq('id', messageId)
        .single();

      if (checkError) {
        console.error('Message not found:', checkError);
        throw new Error('Message not found');
      }

      console.log('Message verified:', existingMessage);

      // Insert response into contact_responses table
      const { data: responseData, error: responseError } = await supabase
        .from('contact_responses')
        .insert({
          contact_message_id: messageId,
          response_message: replyContent,
          responded_by: currentUser.id,
          responder_role: 'admin',
          response_type: 'direct',
          email_sent: true,
          email_sent_at: new Date().toISOString(),
          email_status: 'sent'
        })
        .select()
        .single();

      if (responseError) {
        console.error('Response insert error:', responseError);
        throw responseError;
      }

      console.log('Response inserted:', responseData);

      // Update message status to replied
      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({ 
          status: 'replied',
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log('Message status updated to replied');

      // Update local state
      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, status: 'replied', reply_message: replyContent, replied_at: new Date().toISOString() }
          : m
      ));

      setPopupMessage({
        title: '✓ Reply Sent Successfully',
        message: `Your reply has been sent to the customer`,
        type: 'success'
      });
      setShowSuccessPopup(true);

      // If ccSelf is true, log it
      if (ccSelf && currentUser.email) {
        console.log(`Sending copy to ${currentUser.email}`);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      setPopupMessage({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to send reply. Please try again.',
        type: 'error'
      });
      setShowSuccessPopup(true);
    } finally {
      setSendingReply(false);
    }
  }, [currentUser]);

  const handleDeleteClick = (message: ContactMessageWithResponse) => {
    setMessageToDelete(message);
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    
    setDeleting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageToDelete.id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      // Update local state
      setMessages(prev => prev.filter(m => m.id !== messageToDelete.id));
      
      setPopupMessage({
        title: 'Deleted',
        message: `Message from ${messageToDelete.sender_name} permanently deleted`,
        type: 'success'
      });
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error deleting message:', error);
      setPopupMessage({
        title: 'Error',
        message: 'Failed to delete message',
        type: 'error'
      });
      setShowSuccessPopup(true);
    } finally {
      setDeleting(false);
      setShowDeleteWarning(false);
      setMessageToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteWarning(false);
    setMessageToDelete(null);
  };

  // Convert message to FlexibleContactMessage for ReplyContactReusable
  const convertToFlexibleMessage = (message: ContactMessageWithResponse): FlexibleContactMessage => {
    return {
      id: message.id,
      name: message.sender_name,
      email: message.sender_email,
      phone: message.sender_phone,
      subject: message.subject,
      message: message.message,
      category: message.message_category,
      recipientType: message.recipient_type,
      theaterId: message.theater_id || undefined,
      theaterName: message.theater_name,
      status: message.status,
      createdAt: message.created_at,
      repliedAt: message.replied_at,
      replyMessage: message.reply_message,
    };
  };

  // Delete Warning Modal
  const DeleteWarningModal = () => {
    if (!showDeleteWarning || !messageToDelete) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCancelDelete}>
        <div className="bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Message</h2>
            </div>
            
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this message?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              From: <span className="font-medium">{messageToDelete.sender_name}</span><br />
              Subject: <span className="font-medium">{messageToDelete.subject}</span>
            </p>
            
            <p className="text-sm text-red-600 mb-6 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Table columns for ReusableTable
  const tableColumns = [
    {
      Header: 'From',
      accessor: 'sender_name',
      Cell: (row: ContactMessageWithResponse) => (
        <div>
          <p className="font-medium text-gray-900">{row.sender_name}</p>
          <p className="text-xs text-gray-500">{row.sender_email}</p>
          {row.sender_phone && <p className="text-xs text-gray-400">{row.sender_phone}</p>}
        </div>
      )
    },
    {
      Header: 'Subject',
      accessor: 'subject',
      Cell: (row: ContactMessageWithResponse) => (
        <div>
          <p className="text-sm text-gray-900 truncate max-w-[200px]">{row.subject}</p>
          <p className="text-xs text-gray-400">{row.message_category}</p>
        </div>
      )
    },
    {
      Header: 'Recipient',
      accessor: 'recipient_type',
      Cell: (row: ContactMessageWithResponse) => getRecipientBadge(row.recipient_type, row.theater_name)
    },
    {
      Header: 'Received',
      accessor: 'created_at',
      Cell: (row: ContactMessageWithResponse) => <p className="text-sm text-gray-600">{formatDate(row.created_at)}</p>
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: (row: ContactMessageWithResponse) => getStatusBadge(row.status)
    },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: (row: ContactMessageWithResponse) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedMessage(row);
              setShowDetailsModal(true);
              if (row.status === 'pending') handleMarkAsRead(row);
            }}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>
          
          {/* Reply Button - Uses ReplyContactReusable */}
          <ReplyContactReusable
            message={convertToFlexibleMessage(row)}
            onReply={handleSendReply}
            theaterName={row.theater_name}
            isSubmitting={sendingReply}
          />
          
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  // Dashboard stats
  const dashboardCards = [
    { title: 'Total Messages', value: messages.length, icon: Inbox, color: 'from-purple-500 to-purple-600', delay: 0.1, notification: true, notificationCount: messages.length },
    { title: 'Pending', value: messages.filter(m => m.status === 'pending').length, icon: Mail, color: 'from-red-500 to-red-600', delay: 0.15, notification: true, notificationCount: messages.filter(m => m.status === 'pending').length },
    { title: 'Read', value: messages.filter(m => m.status === 'read').length, icon: MailOpen, color: 'from-blue-500 to-blue-600', delay: 0.2, notification: false },
    { title: 'Replied', value: messages.filter(m => m.status === 'replied').length, icon: Reply, color: 'from-green-500 to-green-600', delay: 0.25, notification: false }
  ];

  // Details Modal Component
  const DetailsModal = () => {
    if (!selectedMessage) return null;
    
    return (
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
                <p className="font-medium text-gray-900">{selectedMessage.sender_name}</p>
                <p className="text-sm text-gray-600">{selectedMessage.sender_email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="text-sm text-gray-900">{selectedMessage.sender_phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Subject</p>
                <p className="font-medium text-gray-900">{selectedMessage.subject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                <p className="text-sm text-gray-600">{selectedMessage.message_category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Recipient</p>
                <p className="text-sm text-gray-600">
                  {selectedMessage.recipient_type === 'admin' ? 'Admin Support' : selectedMessage.theater_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Received</p>
                <p className="text-sm text-gray-600">{formatDate(selectedMessage.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">IP Address</p>
                <p className="text-sm text-gray-600">{selectedMessage.ip_address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                {getStatusBadge(selectedMessage.status)}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Message</p>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>

            {selectedMessage.reply_message && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-600 uppercase tracking-wide">Your Reply</p>
                <p className="text-sm text-green-800 mt-1 whitespace-pre-wrap">{selectedMessage.reply_message}</p>
                <p className="text-xs text-green-500 mt-1">Sent on {selectedMessage.replied_at && formatDate(selectedMessage.replied_at)}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <ReplyContactReusable
                message={convertToFlexibleMessage(selectedMessage)}
                onReply={handleSendReply}
                theaterName={selectedMessage.theater_name}
                isSubmitting={sendingReply}
              />
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Social Links Modal
  const SocialLinksModal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSocialManager(false)}>
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Global Social Media Links</h2>
            </div>
            <button onClick={() => setShowSocialManager(false)} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6">
            <AdminSocialLinksManager onClose={() => setShowSocialManager(false)} />
          </div>
        </div>
      </div>
    );
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Social Manager Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-sm text-gray-500">View and manage customer inquiries</p>
            {currentUser && (
              <p className="text-xs text-green-600 mt-1">✓ Logged in as: {currentUser.email}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowSocialManager(true)}
className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold"        >
          <Globe className="h-4 w-4" />
          Manage Social Links
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
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
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            <option value="all">All Recipients</option>
            <option value="admin">Admin</option>
            <option value="theater">Theater</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent"></div>
        </div>
      ) : (
        <ReusableTable
          columns={tableColumns}
          data={filteredMessages}
          title="Contact Messages"
          icon={Mail}
          showSearch={false}
          showExport={false}
          showPrint={false}
          itemsPerPage={10}
        />
      )}

      {/* Modals */}
      {showDetailsModal && selectedMessage && <DetailsModal />}
      {showSocialManager && <SocialLinksModal />}
      
      {/* Delete Warning Modal */}
      <DeleteWarningModal />

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
  );
};

export default AdmincontactManagement;