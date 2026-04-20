// src/pages/Admin/content/HelpManagement.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Ticket,
  CreditCard,
  User,
  Shield,
  QrCode,
  Wallet,
  Users,
  XCircle,
  Save,
  X,
  Archive,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types matching frontend Help.tsx
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: string;
  status: 'published' | 'draft' | 'archived';
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Ticket: Ticket,
  CreditCard: CreditCard,
  User: User,
  Shield: Shield,
  QrCode: QrCode,
  Wallet: Wallet,
  Users: Users,
  HelpCircle: HelpCircle
};

// Available icons for selection
const availableIcons = [
  { name: 'Ticket', icon: Ticket },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'User', icon: User },
  { name: 'Shield', icon: Shield },
  { name: 'QrCode', icon: QrCode },
  { name: 'Wallet', icon: Wallet },
  { name: 'Users', icon: Users },
  { name: 'HelpCircle', icon: HelpCircle }
];

// Mock FAQ Data
const mockFAQs: FAQItem[] = [
  {
    id: 1,
    category: 'tickets',
    question: 'How do I book tickets online?',
    answer: 'Booking tickets is easy! Simply browse our shows, select your preferred date and time, choose your seats, and proceed to checkout. You can pay using Chapa, TeleBirr, CBE Birr, or HelloCash.',
    icon: 'Ticket',
    status: 'published',
    order: 1,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 2,
    category: 'tickets',
    question: 'How do I get my tickets after booking?',
    answer: 'After successful payment, you\'ll receive an email with your e-tickets. You can also access them in your account under "My Tickets". Simply show the QR code at the venue entrance.',
    icon: 'QrCode',
    status: 'published',
    order: 2,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 3,
    category: 'tickets',
    question: 'How many tickets can I book?',
    answer: 'You can book as many tickets as you want! There is no limit on the number of tickets per booking. Feel free to book tickets for large groups and special events.',
    icon: 'Users',
    status: 'published',
    order: 3,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 4,
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept multiple payment methods including: Chapa (Card/Bank Transfer), TeleBirr, CBE Birr, and HelloCash. All payments are processed securely.',
    icon: 'CreditCard',
    status: 'published',
    order: 1,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 5,
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Click "Sign Up" on the homepage, fill in your details, verify your email, and you\'re ready to start booking! You can also sign up using Google or Facebook.',
    icon: 'User',
    status: 'draft',
    order: 1,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 6,
    category: 'wallet',
    question: 'What is TheaterHUB Wallet?',
    answer: 'TheaterHUB Wallet is our digital wallet that allows you to store funds for quick and easy ticket purchases. You can add funds using various payment methods.',
    icon: 'Wallet',
    status: 'published',
    order: 1,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 7,
    category: 'technical',
    question: 'Having trouble with the website?',
    answer: 'Clear your browser cache, try a different browser, or contact our support team at support@theaterhub.com. We\'re here to help!',
    icon: 'HelpCircle',
    status: 'published',
    order: 1,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 8,
    category: 'tickets',
    question: 'Can I transfer my tickets to someone else?',
    answer: 'Yes, you can transfer tickets through your account dashboard. Go to "My Tickets", select the ticket, and click "Transfer". The recipient will receive an email with the ticket details.',
    icon: 'Users',
    status: 'archived',
    order: 4,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 9,
    category: 'technical',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your inbox. You\'ll be able to create a new password.',
    icon: 'Shield',
    status: 'published',
    order: 2,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  }
];

// Categories
const categories = [
  { id: 'tickets', name: 'Tickets', color: 'from-purple-500 to-purple-600' },
  { id: 'payments', name: 'Payments', color: 'from-emerald-500 to-green-600' },
  { id: 'account', name: 'Account', color: 'from-blue-500 to-cyan-600' },
  { id: 'wallet', name: 'Wallet', color: 'from-yellow-500 to-orange-600' },
  { id: 'technical', name: 'Technical', color: 'from-pink-500 to-rose-600' }
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

// Stat Card Component (without notifications)
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay }) => {
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
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HelpManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(mockFAQs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedFaq, setSelectedFaq] = useState<FAQItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

  // Form state
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'tickets',
    icon: 'HelpCircle',
    status: 'published' as 'published' | 'draft' | 'archived',
    order: 1
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || faq.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || faq.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Published</span>;
      case 'draft':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Draft</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"><Archive className="h-3 w-3" /> Archived</span>;
    }
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return faqs.length;
    return faqs.filter(faq => faq.category === categoryId).length;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.question.trim()) errors.question = 'Question is required';
    if (!formData.answer.trim()) errors.answer = 'Answer is required';
    if (formData.answer.length < 20) errors.answer = 'Answer must be at least 20 characters';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'tickets',
      icon: 'HelpCircle',
      status: 'published',
      order: faqs.length + 1
    });
    setFormErrors({});
  };

  // Handle Add FAQ
  const handleAddFaq = () => {
    if (!validateForm()) return;

    const newFaq: FAQItem = {
      id: Date.now(),
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      icon: formData.icon,
      status: formData.status,
      order: formData.order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setFaqs([...faqs, newFaq]);
    setPopupMessage({
      title: 'FAQ Added',
      message: `"${formData.question}" has been added successfully`,
      type: 'success'
    });
    setShowModal(false);
    setShowSuccessPopup(true);
    resetForm();
  };

  // Handle Update FAQ
  const handleUpdateFaq = () => {
    if (!selectedFaq || !validateForm()) return;

    const updatedFaqs = faqs.map(faq => faq.id === selectedFaq.id ? {
      ...faq,
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      icon: formData.icon,
      status: formData.status,
      order: formData.order,
      updatedAt: new Date().toISOString()
    } : faq);

    setFaqs(updatedFaqs);
    setPopupMessage({
      title: 'FAQ Updated',
      message: `"${formData.question}" has been updated successfully`,
      type: 'success'
    });
    setShowModal(false);
    setShowSuccessPopup(true);
    resetForm();
    setSelectedFaq(null);
  };

  // Handle Archive FAQ
  const handleArchiveFaq = () => {
    if (selectedFaq) {
      const updatedFaqs = faqs.map(faq => faq.id === selectedFaq.id ? {
        ...faq,
        status: 'archived' as const,
        updatedAt: new Date().toISOString()
      } : faq);

      setFaqs(updatedFaqs);
      setShowArchiveConfirm(false);
      setSelectedFaq(null);
      setPopupMessage({
        title: 'FAQ Archived',
        message: `"${selectedFaq.question}" has been archived successfully`,
        type: 'success'
      });
      setShowSuccessPopup(true);
    }
  };

  // Handle Delete FAQ (Permanent)
  const handleDeleteFaq = () => {
    if (selectedFaq) {
      setFaqs(faqs.filter(faq => faq.id !== selectedFaq.id));
      setShowDeleteConfirm(false);
      setSelectedFaq(null);
      setPopupMessage({
        title: 'FAQ Deleted',
        message: `"${selectedFaq.question}" has been deleted permanently`,
        type: 'success'
      });
      setShowSuccessPopup(true);
    }
  };

  // Handle Restore from Archive
  const handleRestoreFaq = (faq: FAQItem) => {
    const updatedFaqs = faqs.map(f => f.id === faq.id ? {
      ...f,
      status: 'draft' as const,
      updatedAt: new Date().toISOString()
    } : f);

    setFaqs(updatedFaqs);
    setPopupMessage({
      title: 'FAQ Restored',
      message: `"${faq.question}" has been restored from archive`,
      type: 'success'
    });
    setShowSuccessPopup(true);
  };

  const openAddModal = () => {
    setModalMode('add');
    resetForm();
    setSelectedFaq(null);
    setShowModal(true);
  };

  const openEditModal = (faq: FAQItem) => {
    setSelectedFaq(faq);
    setModalMode('edit');
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      icon: faq.icon,
      status: faq.status,
      order: faq.order
    });
    setShowModal(true);
  };

  const openViewModal = (faq: FAQItem) => {
    setSelectedFaq(faq);
    setModalMode('view');
    setShowModal(true);
  };

  // Stats (without notifications)
  const stats = {
    total: faqs.length,
    published: faqs.filter(f => f.status === 'published').length,
    draft: faqs.filter(f => f.status === 'draft').length,
    archived: faqs.filter(f => f.status === 'archived').length
  };

  const dashboardCards = [
    { title: 'Total FAQs', value: stats.total, icon: HelpCircle, color: 'from-purple-500 to-purple-600', delay: 0.1 },
    { title: 'Published', value: stats.published, icon: CheckCircle, color: 'from-emerald-500 to-green-600', delay: 0.15 },
    { title: 'Draft', value: stats.draft, icon: Clock, color: 'from-yellow-500 to-orange-600', delay: 0.2 },
    { title: 'Archived', value: stats.archived, icon: Archive, color: 'from-gray-500 to-gray-600', delay: 0.25 }
  ];

  const columns = [
    {
      Header: 'Question',
      accessor: 'question',
      sortable: true,
      Cell: (row: FAQItem) => (
        <div>
          <p className="font-medium text-gray-900">{row.question}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{row.answer.substring(0, 80)}...</p>
        </div>
      )
    },
    {
      Header: 'Category',
      accessor: 'category',
      sortable: true,
      Cell: (row: FAQItem) => {
        const category = categories.find(c => c.id === row.category);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${category?.color.split('-')[1]}-100 text-${category?.color.split('-')[1]}-700`}>
            {category?.name || row.category}
          </span>
        );
      }
    },
    { Header: 'Order', accessor: 'order', sortable: true },
    { Header: 'Status', accessor: 'status', sortable: true, Cell: (row: FAQItem) => getStatusBadge(row.status) },
    { Header: 'Updated', accessor: 'updatedAt', sortable: true, Cell: (row: FAQItem) => formatDate(row.updatedAt) },
    {
      Header: 'Actions',
      accessor: 'id',
      sortable: false,
      Cell: (row: FAQItem) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openViewModal(row)}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4 text-teal-600" />
          </button>
          {row.status !== 'archived' ? (
            <button
              onClick={() => { setSelectedFaq(row); setShowArchiveConfirm(true); }}
              className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
              title="Archive"
            >
              <Archive className="h-4 w-4 text-orange-600" />
            </button>
          ) : (
            <button
              onClick={() => handleRestoreFaq(row)}
              className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
              title="Restore"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
            </button>
          )}
          <button
            onClick={() => { setSelectedFaq(row); setShowDeleteConfirm(true); }}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            title="Delete Permanently"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  // Add/Edit Modal with Form
  const FormModal = () => {
    const SelectedIcon = iconMap[formData.icon] || HelpCircle;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${modalMode === 'add' ? 'bg-teal-100' : 'bg-blue-100'}`}>
                {modalMode === 'add' ? <Plus className="h-5 w-5 text-teal-600" /> : <Edit className="h-5 w-5 text-blue-600" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === 'add' ? 'Add New FAQ' : 'Edit FAQ'}
                </h2>
                <p className="text-xs text-gray-500">
                  {modalMode === 'add' ? 'Create a new frequently asked question' : 'Update FAQ information'}
                </p>
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); modalMode === 'add' ? handleAddFaq() : handleUpdateFaq(); }} className="space-y-5">
              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="Enter frequently asked question"
                  className={`w-full px-4 py-2.5 border ${formErrors.question ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none`}
                />
                {formErrors.question && <p className="text-xs text-red-500 mt-1">{formErrors.question}</p>}
              </div>

              {/* Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed answer to the question..."
                  rows={6}
                  className={`w-full px-4 py-2.5 border ${formErrors.answer ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none`}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">Detailed answer to the question</p>
                  <p className={`text-xs ${formData.answer.length < 20 && formData.answer.length > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.answer.length} characters (minimum 20)
                  </p>
                </div>
                {formErrors.answer && <p className="text-xs text-red-500 mt-1">{formErrors.answer}</p>}
              </div>

              {/* Category and Icon Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Icon
                  </label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    {availableIcons.map(icon => (
                      <option key={icon.name} value={icon.name}>{icon.name}</option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Preview:</span>
                    <div className="p-1.5 rounded-lg bg-teal-50">
                      <SelectedIcon className="h-4 w-4 text-teal-600" />
                    </div>
                    <span className="text-xs text-gray-400">{formData.icon}</span>
                  </div>
                </div>
              </div>

              {/* Order and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min={1}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <ReusableButton type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </ReusableButton>
                <ReusableButton type="submit" className="flex-1">
                  <Save className="h-4 w-4" />
                  {modalMode === 'add' ? 'Add FAQ' : 'Update FAQ'}
                </ReusableButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // View Modal
  const ViewModal = () => {
    const IconComponent = selectedFaq ? iconMap[selectedFaq.icon] || HelpCircle : HelpCircle;
    const category = categories.find(c => c.id === selectedFaq?.category);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">FAQ Details</h2>
                <p className="text-xs text-gray-500">Frequently asked question information</p>
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase mb-1">Question</p>
                <p className="font-semibold text-lg">{selectedFaq?.question}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 uppercase mb-2">Answer</p>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedFaq?.answer}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium bg-${category?.color.split('-')[1]}-100 text-${category?.color.split('-')[1]}-700`}>
                  {category?.name || selectedFaq?.category}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Icon</p>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50">
                    <IconComponent className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="text-sm">{selectedFaq?.icon}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Display Order</p>
                <p className="text-sm font-semibold">{selectedFaq?.order}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                {selectedFaq && getStatusBadge(selectedFaq.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Created</p>
                <p className="text-sm">{selectedFaq && formatDate(selectedFaq.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Last Updated</p>
                <p className="text-sm">{selectedFaq && formatDate(selectedFaq.updatedAt)}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <ReusableButton onClick={() => { setShowModal(false); openEditModal(selectedFaq!); }} label="Edit FAQ" className="flex-1" />
              <ReusableButton variant="secondary" onClick={() => setShowModal(false)} label="Close" className="flex-1" />
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
      className="space-y-8 p-6"
    >
      {/* Stats Cards - No Notifications */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {dashboardCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            delay={card.delay}
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
              placeholder="Search by question or answer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            <option value="all">All Categories ({getCategoryCount('all')})</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name} ({getCategoryCount(cat.id)})</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <ReusableButton onClick={openAddModal} icon={Plus} label="Add New FAQ" />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <ReusableTable
          columns={columns}
          data={filteredFaqs}
          title="FAQ Management"
          icon={HelpCircle}
          showSearch={false}
          showExport={true}
          showPrint={false}
          itemsPerPage={10}
        />
      </motion.div>

      {/* Modals */}
      {showModal && modalMode !== 'view' && <FormModal />}
      {showModal && modalMode === 'view' && <ViewModal />}

      {/* Archive Confirm Modal */}
      {showArchiveConfirm && selectedFaq && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Archive className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Archive FAQ</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to archive "<strong>{selectedFaq.question}</strong>"?
              Archived FAQs will not be visible on the help page.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowArchiveConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleArchiveFaq} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal (Permanent Delete) */}
      {showDeleteConfirm && selectedFaq && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Permanently</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete "<strong>{selectedFaq.question}</strong>"?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDeleteFaq} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete Permanently
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

export default HelpManagement;