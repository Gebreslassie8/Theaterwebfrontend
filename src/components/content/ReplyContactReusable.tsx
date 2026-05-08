// src/components/content/ReplyContactReusable.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Mail, 
  User, 
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
  Reply,
  Theater
} from 'lucide-react';

// ============= Types =============
export interface ContactMessage {
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

export interface ReplyData {
  messageId: string;
  replyMessage: string;
  replyDate: string;
  ccSelf?: boolean;
}

interface ReplyContactReusableProps {
  message: ContactMessage;
  onReply: (messageId: string, replyContent: string, ccSelf?: boolean) => void;
  theaterName?: string;
  isSubmitting?: boolean;
}

// ============= Helper Functions =============
const formatDate = (dateString: string): string => {
  const d = new Date(dateString);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============= Main Component =============
const ReplyContactReusable: React.FC<ReplyContactReusableProps> = ({ 
  message, 
  onReply,
  theaterName = 'Theater',
  isSubmitting: externalSubmitting = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [ccSelf, setCcSelf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(0);

  // Auto focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setReplyText('');
      setCcSelf(false);
      setError(null);
      setSuccessMessage(null);
      setCharCount(0);
    }
  }, [isOpen]);

  // Update character count
  useEffect(() => {
    setCharCount(replyText.length);
  }, [replyText]);

  const handleSubmit = async () => {
    // Validation
    if (!replyText.trim()) {
      setError('Please enter a reply message');
      return;
    }

    if (replyText.length < 10) {
      setError('Reply message must be at least 10 characters');
      return;
    }

    if (replyText.length > 5000) {
      setError('Reply message cannot exceed 5000 characters');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onReply(message.id, replyText, ccSelf);
      setSuccessMessage('Reply sent successfully!');
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      setError('Failed to send reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getCharacterColor = () => {
    if (charCount > 4500) return 'text-orange-500';
    if (charCount > 4000) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <>
      {/* Reply Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
        title="Reply"
      >
        <Reply className="h-4 w-4 text-green-600" />
      </button>

      {/* Reply Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-emerald-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Reply className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Reply to Customer</h2>
                      <p className="text-sm text-white/80 mt-0.5">
                        Respond to {message.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Success Message */}
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">Success!</p>
                        <p className="text-sm text-green-700">{successMessage}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-800">Error</p>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Original Message Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-teal-100 rounded-lg">
                        <Theater className="w-4 h-4 text-teal-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{theaterName}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <div className="p-1 bg-blue-100 rounded-lg mt-0.5">
                          <User className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">From:</span>{' '}
                          <span className="text-gray-900">{message.name}</span>
                          {message.email && (
                            <span className="text-gray-500 ml-1">&lt;{message.email}&gt;</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <div className="p-1 bg-purple-100 rounded-lg mt-0.5">
                          <MessageSquare className="w-3 h-3 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Subject:</span>{' '}
                          <span className="text-gray-900">{message.subject}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <div className="p-1 bg-green-100 rounded-lg mt-0.5">
                          <Calendar className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Received:</span>{' '}
                          <span className="text-gray-600">{formatDate(message.createdAt)}</span>
                        </div>
                      </div>

                      {message.phone && (
                        <div className="flex items-start gap-2 text-sm">
                          <div className="p-1 bg-yellow-100 rounded-lg mt-0.5">
                            <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Phone:</span>{' '}
                            <span className="text-gray-600">{message.phone}</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Original Message</span>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reply Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Reply <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        ref={textareaRef}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={6}
                        className={`
                          w-full px-4 py-3 rounded-lg border transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none
                          ${error && !successMessage
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-teal-500'
                          }
                        `}
                        placeholder={`Dear ${message.name},\n\nThank you for contacting ${theaterName}...`}
                        disabled={!!successMessage}
                      />
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Enter</kbd> to send
                        </span>
                        <span className={`text-xs ${getCharacterColor()}`}>
                          {charCount} / 5000 characters
                          {charCount > 4500 && ' (approaching limit)'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        id="ccSelf"
                        checked={ccSelf}
                        onChange={(e) => setCcSelf(e.target.checked)}
                        className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                        disabled={!!successMessage}
                      />
                      <label htmlFor="ccSelf" className="text-sm text-gray-700 cursor-pointer">
                        Send a copy to my email address
                      </label>
                    </div>

                    {/* Quick Reply Templates */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick Templates</p>
                      <div className="flex flex-wrap gap-2">
                        {['Thank you for your message', 'We will get back to you soon', 'Ticket information sent'].map((template) => (
                          <button
                            key={template}
                            type="button"
                            onClick={() => setReplyText(prev => prev + (prev ? '\n\n' : '') + template)}
                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            disabled={!!successMessage}
                          >
                            {template}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        disabled={isSubmitting || !!successMessage}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || externalSubmitting || !!successMessage || !replyText.trim()}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                      >
                        {(isSubmitting || externalSubmitting) ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReplyContactReusable;