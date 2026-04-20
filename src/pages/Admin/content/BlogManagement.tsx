// src/pages/Admin/content/BlogManagement.tsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  User,
  Tag,
  Clock,
  CheckCircle,
  X,
  Archive,
  Filter,
  ArrowRight,
  Image,
  Upload,
  XCircle,
  Save,
  AlertCircle,
  Newspaper,
  Star,
  Zap,
  Users,
  Lightbulb,
  HeartHandshake
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import * as Yup from 'yup';

// Types matching frontend Blog.tsx
interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  count: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  author: Author;
  categories: Category[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  bookmarks: number;
  isTrending: boolean;
  status: 'published' | 'draft' | 'archived';
  content: string;
  updatedAt: string;
}

// Mock Authors
const mockAuthors: Author[] = [
  { id: '1', name: 'Sarah Johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=007590&color=fff', role: 'Theater Critic' },
  { id: '2', name: 'Michael Chen', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=007590&color=fff', role: 'Technical Director' },
  { id: '3', name: 'Emma Rodriguez', avatar: 'https://ui-avatars.com/api/?name=Emma+Rodriguez&background=007590&color=fff', role: 'Arts Journalist' }
];

// Mock Categories
const mockCategories: Category[] = [
  { id: '1', name: 'News', icon: Newspaper, count: 24 },
  { id: '2', name: 'Reviews', icon: Star, count: 18 },
  { id: '3', name: 'Tech', icon: Zap, count: 12 },
  { id: '4', name: 'Interviews', icon: Users, count: 8 },
  { id: '5', name: 'Guides', icon: Lightbulb, count: 15 },
  { id: '6', name: 'Community', icon: HeartHandshake, count: 10 }
];

const initialBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Digital Ticketing in Theater',
    slug: 'future-digital-ticketing',
    excerpt: 'Discover how blockchain technology is revolutionizing theater ticketing.',
    featuredImage: 'https://images.unsplash.com/photo-1503095396549-8070c434c0a2?w=800',
    author: mockAuthors[0],
    categories: [mockCategories[2], mockCategories[0]],
    publishedAt: '2024-03-15T10:00:00Z',
    readTime: 8,
    views: 3450,
    likes: 234,
    bookmarks: 123,
    isTrending: true,
    status: 'published',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Behind the Scenes: Phantom of the Opera',
    slug: 'behind-scenes-phantom',
    excerpt: 'An exclusive look at the technical marvels behind this timeless classic.',
    featuredImage: 'https://images.unsplash.com/photo-1507924538820-ede3a2f080d7?w=800',
    author: mockAuthors[1],
    categories: [mockCategories[1], mockCategories[3]],
    publishedAt: '2024-03-12T14:30:00Z',
    readTime: 12,
    views: 2890,
    likes: 456,
    bookmarks: 234,
    isTrending: true,
    status: 'published',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    updatedAt: '2024-03-12T14:30:00Z'
  },
  {
    id: '3',
    title: 'How AI is Transforming Script Writing',
    slug: 'ai-script-writing',
    excerpt: 'Exploring the role of artificial intelligence in modern theater creation.',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    author: mockAuthors[2],
    categories: [mockCategories[3], mockCategories[2]],
    publishedAt: '2024-03-10T09:15:00Z',
    readTime: 10,
    views: 2100,
    likes: 189,
    bookmarks: 98,
    isTrending: true,
    status: 'draft',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updatedAt: '2024-03-10T09:15:00Z'
  }
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

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryIds: [] as string[],
    authorId: '1',
    readTime: 5,
    isTrending: false,
    status: 'draft' as 'published' | 'draft' | 'archived'
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
    return matchesSearch && matchesStatus;
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

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'title') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.slug.trim()) errors.slug = 'Slug is required';
    if (!formData.excerpt.trim()) errors.excerpt = 'Excerpt is required';
    if (formData.excerpt.length > 200) errors.excerpt = 'Excerpt must not exceed 200 characters';
    if (!formData.content.trim()) errors.content = 'Content is required';
    if (formData.content.length < 50) errors.content = 'Content must be at least 50 characters';
    if (formData.categoryIds.length === 0) errors.categories = 'At least one category is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      categoryIds: [],
      authorId: '1',
      readTime: 5,
      isTrending: false,
      status: 'draft'
    });
    setImagePreview('');
    setImageFile(null);
    setFormErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Add Blog
  const handleAddBlog = () => {
    if (!validateForm()) return;

    const selectedCategories = mockCategories.filter(cat => formData.categoryIds.includes(cat.id));
    const selectedAuthor = mockAuthors.find(author => author.id === formData.authorId)!;

    const newBlog: BlogPost = {
      id: Date.now().toString(),
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featuredImage: imagePreview || 'https://images.unsplash.com/photo-1507924538820-ede3a2f080d7?w=800',
      author: selectedAuthor,
      categories: selectedCategories,
      publishedAt: new Date().toISOString(),
      readTime: formData.readTime,
      views: 0,
      likes: 0,
      bookmarks: 0,
      isTrending: formData.isTrending,
      status: formData.status,
      updatedAt: new Date().toISOString()
    };

    setBlogs([newBlog, ...blogs]);
    setPopupMessage({
      title: 'Blog Created',
      message: `${formData.title} has been created successfully`,
      type: 'success'
    });
    setShowModal(false);
    setShowSuccessPopup(true);
    resetForm();
  };

  // Handle Update Blog
  const handleUpdateBlog = () => {
    if (!selectedBlog || !validateForm()) return;

    const selectedCategories = mockCategories.filter(cat => formData.categoryIds.includes(cat.id));
    const selectedAuthor = mockAuthors.find(author => author.id === formData.authorId)!;

    const updatedBlogs = blogs.map(b => b.id === selectedBlog.id ? {
      ...b,
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featuredImage: imagePreview || b.featuredImage,
      author: selectedAuthor,
      categories: selectedCategories,
      readTime: formData.readTime,
      isTrending: formData.isTrending,
      status: formData.status,
      updatedAt: new Date().toISOString(),
      publishedAt: formData.status === 'published' && b.status !== 'published' ? new Date().toISOString() : b.publishedAt
    } : b);

    setBlogs(updatedBlogs);
    setPopupMessage({
      title: 'Blog Updated',
      message: `${formData.title} has been updated successfully`,
      type: 'success'
    });
    setShowModal(false);
    setShowSuccessPopup(true);
    resetForm();
    setSelectedBlog(null);
  };

  const handleDeleteBlog = () => {
    if (selectedBlog) {
      setBlogs(blogs.filter(b => b.id !== selectedBlog.id));
      setShowDeleteConfirm(false);
      setSelectedBlog(null);
      setPopupMessage({
        title: 'Blog Deleted',
        message: `${selectedBlog.title} has been deleted successfully`,
        type: 'success'
      });
      setShowSuccessPopup(true);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    resetForm();
    setSelectedBlog(null);
    setShowModal(true);
  };

  const openEditModal = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setModalMode('edit');
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      categoryIds: blog.categories.map(c => c.id),
      authorId: blog.author.id,
      readTime: blog.readTime,
      isTrending: blog.isTrending,
      status: blog.status
    });
    setImagePreview(blog.featuredImage);
    setImageFile(null);
    setShowModal(true);
  };

  const openViewModal = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setModalMode('view');
    setShowModal(true);
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    draft: blogs.filter(b => b.status === 'draft').length,
    archived: blogs.filter(b => b.status === 'archived').length,
    totalViews: blogs.reduce((sum, b) => sum + b.views, 0)
  };

  const dashboardCards = [
    { title: 'Total Posts', value: stats.total, icon: FileText, color: 'from-purple-500 to-purple-600', delay: 0.1, notification: true, notificationCount: stats.total },
    { title: 'Published', value: stats.published, icon: CheckCircle, color: 'from-emerald-500 to-green-600', delay: 0.15, notification: true, notificationCount: stats.published },
    { title: 'Draft', value: stats.draft, icon: Clock, color: 'from-yellow-500 to-orange-600', delay: 0.2, notification: true, notificationCount: stats.draft },
    { title: 'Archived', value: stats.archived, icon: Archive, color: 'from-gray-500 to-gray-600', delay: 0.22, notification: true, notificationCount: stats.archived },
    { title: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'from-blue-500 to-cyan-600', delay: 0.25 }
  ];

  const columns = [
    {
      Header: 'Title',
      accessor: 'title',
      sortable: true,
      Cell: (row: BlogPost) => (
        <div>
          <p className="font-medium text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500">Slug: {row.slug}</p>
        </div>
      )
    },
    { Header: 'Author', accessor: (row: BlogPost) => row.author.name, sortable: true },
    {
      Header: 'Categories',
      accessor: (row: BlogPost) => row.categories.map(c => c.name).join(', '),
      sortable: true
    },
    { Header: 'Views', accessor: 'views', sortable: true, Cell: (row: BlogPost) => <p className="font-semibold">{row.views.toLocaleString()}</p> },
    { Header: 'Status', accessor: 'status', sortable: true, Cell: (row: BlogPost) => getStatusBadge(row.status) },
    { Header: 'Date', accessor: 'publishedAt', sortable: true, Cell: (row: BlogPost) => formatDate(row.publishedAt) },
    {
      Header: 'Actions',
      accessor: 'id',
      sortable: false,
      Cell: (row: BlogPost) => (
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
          <button
            onClick={() => { setSelectedBlog(row); setShowDeleteConfirm(true); }}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  // Add/Edit Modal with Form
  const FormModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${modalMode === 'add' ? 'bg-teal-100' : 'bg-blue-100'}`}>
              {modalMode === 'add' ? <Plus className="h-5 w-5 text-teal-600" /> : <Edit className="h-5 w-5 text-blue-600" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'add' ? 'Add New Post' : 'Edit Post'}
              </h2>
              <p className="text-xs text-gray-500">
                {modalMode === 'add' ? 'Create a new blog post' : 'Update your blog post'}
              </p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); modalMode === 'add' ? handleAddBlog() : handleUpdateBlog(); }} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
                className={`w-full px-4 py-2.5 border ${formErrors.title ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none`}
              />
              {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="enter-blog-slug"
                className={`w-full px-4 py-2.5 border ${formErrors.slug ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none`}
              />
              <p className="text-xs text-gray-400 mt-1">URL-friendly version of the title</p>
              {formErrors.slug && <p className="text-xs text-red-500 mt-1">{formErrors.slug}</p>}
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Featured Image
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all duration-200 flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload Image</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                </div>
              )}
            </div>

            {/* Author and Read Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Author <span className="text-red-500">*</span>
                </label>
                <select
                  name="authorId"
                  value={formData.authorId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  {mockAuthors.map(author => (
                    <option key={author.id} value={author.id}>{author.name} - {author.role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Read Time (minutes)
                </label>
                <input
                  type="number"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  min={1}
                  max={30}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Categories <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {mockCategories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${formData.categoryIds.includes(category.id)
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              {formErrors.categories && <p className="text-xs text-red-500 mt-1">{formErrors.categories}</p>}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary of the blog..."
                rows={3}
                className={`w-full px-4 py-2.5 border ${formErrors.excerpt ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none`}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-400">Short description shown in blog listings</p>
                <p className={`text-xs ${formData.excerpt.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.excerpt.length}/200 characters
                </p>
              </div>
              {formErrors.excerpt && <p className="text-xs text-red-500 mt-1">{formErrors.excerpt}</p>}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Full blog content..."
                rows={10}
                className={`w-full px-4 py-2.5 border ${formErrors.content ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none font-mono text-sm`}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-400">Full blog content (minimum 50 characters)</p>
                <p className={`text-xs ${formData.content.length < 50 && formData.content.length > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.content.length} characters
                </p>
              </div>
              {formErrors.content && <p className="text-xs text-red-500 mt-1">{formErrors.content}</p>}
            </div>

            {/* Trending and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={formData.isTrending}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Mark as Trending
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Form Actions - BUTTONS */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <ReusableButton type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                Cancel
              </ReusableButton>
              <ReusableButton type="submit" className="flex-1">
                <Save className="h-4 w-4" />
                {modalMode === 'add' ? 'Create Post' : 'Update Post'}
              </ReusableButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // View Modal
  const ViewModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">View Post</h2>
              <p className="text-xs text-gray-500">Blog post details</p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {selectedBlog?.featuredImage && (
            <div className="border-b border-gray-200 pb-3">
              <p className="text-xs text-gray-500 uppercase mb-1">Featured Image</p>
              <img src={selectedBlog.featuredImage} alt={selectedBlog.title} className="w-full max-h-64 object-cover rounded-lg" />
            </div>
          )}
          <div className="border-b border-gray-200 pb-3">
            <p className="text-xs text-gray-500 uppercase mb-1">Title</p>
            <p className="font-semibold text-lg">{selectedBlog?.title}</p>
          </div>
          <div className="border-b border-gray-200 pb-3">
            <p className="text-xs text-gray-500 uppercase mb-1">Slug</p>
            <p className="text-sm">{selectedBlog?.slug}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Author</p>
              <p className="text-sm">{selectedBlog?.author.name}</p>
              <p className="text-xs text-gray-400">{selectedBlog?.author.role}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Read Time</p>
              <p className="text-sm">{selectedBlog?.readTime} minutes</p>
            </div>
          </div>
          <div className="border-b border-gray-200 pb-3">
            <p className="text-xs text-gray-500 uppercase mb-1">Categories</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedBlog?.categories.map(cat => (
                <span key={cat.id} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{cat.name}</span>
              ))}
            </div>
          </div>
          <div className="border-b border-gray-200 pb-3">
            <p className="text-xs text-gray-500 uppercase mb-1">Excerpt</p>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedBlog?.excerpt}</p>
          </div>
          <div className="border-b border-gray-200 pb-3">
            <p className="text-xs text-gray-500 uppercase mb-1">Content</p>
            <div className="bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">{selectedBlog?.content}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Views</p>
              <p className="text-sm font-semibold">{selectedBlog?.views.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Likes</p>
              <p className="text-sm font-semibold">{selectedBlog?.likes.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Bookmarks</p>
              <p className="text-sm font-semibold">{selectedBlog?.bookmarks.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
              {selectedBlog && getStatusBadge(selectedBlog.status)}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Trending</p>
              <p className="text-sm">{selectedBlog?.isTrending ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <ReusableButton onClick={() => { setShowModal(false); openEditModal(selectedBlog!); }} label="Edit Post" className="flex-1" />
            <ReusableButton variant="secondary" onClick={() => setShowModal(false)} label="Close" className="flex-1" />
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
      {/* Stats Cards */}
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

      {/* Search and Add Button */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author..."
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <ReusableButton onClick={openAddModal} icon={Plus} label="Add New Post" />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <ReusableTable
          columns={columns}
          data={filteredBlogs}
          title="Blog Posts"
          icon={FileText}
          showSearch={false}
          showExport={true}
          showPrint={false}
          itemsPerPage={10}
        />
      </motion.div>

      {/* Modals */}
      {showModal && modalMode !== 'view' && <FormModal />}
      {showModal && modalMode === 'view' && <ViewModal />}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && selectedBlog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Post</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{selectedBlog.title}</strong>"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDeleteBlog} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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

export default BlogManagement;