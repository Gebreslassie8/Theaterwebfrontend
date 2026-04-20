// src/pages/Admin/content/GalleryManagement.tsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Image,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  MapPin,
  Camera,
  Heart,
  Share2,
  Download,
  Maximize2,
  Award,
  Theater,
  Users,
  X,
  Upload,
  XCircle,
  Save,
  AlertCircle,
  Grid,
  Columns,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types matching frontend Gallery.tsx
interface GalleryImage {
  id: number;
  src: string;
  title: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  photographer: string;
  likes: number;
  views: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
}

// Mock Gallery Images
const mockImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=1200&h=800&fit=crop',
    title: 'The Lion King - Grand Opening',
    description: 'Spectacular performance of The Lion King at Grand Theater.',
    category: 'performances',
    date: 'March 15, 2024',
    venue: 'Grand Theater',
    photographer: 'Sarah Johnson',
    likes: 234,
    views: 1245
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&h=800&fit=crop',
    title: 'Hamilton - Backstage Moments',
    description: 'Behind the scenes of Hamilton. Exclusive look at the cast.',
    category: 'behind-scenes',
    date: 'March 10, 2024',
    venue: 'City Cinema',
    photographer: 'Michael Chen',
    likes: 189,
    views: 987
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=800&fit=crop',
    title: 'Wicked - Magical Moments',
    description: 'The magical world of Wicked comes to life on stage.',
    category: 'performances',
    date: 'March 5, 2024',
    venue: 'Star Theater',
    photographer: 'Emma Williams',
    likes: 312,
    views: 1567
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&h=800&fit=crop',
    title: 'Chicago - Jazz Era',
    description: 'All that jazz! Chicago brings the roaring 20s to life.',
    category: 'performances',
    date: 'February 28, 2024',
    venue: 'Grand Theater',
    photographer: 'David Rodriguez',
    likes: 267,
    views: 1342
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&h=800&fit=crop',
    title: 'Phantom of Opera - Masked Ball',
    description: 'The iconic masked ball scene from Phantom of Opera.',
    category: 'performances',
    date: 'February 20, 2024',
    venue: 'Royal Opera',
    photographer: 'Lisa Anderson',
    likes: 423,
    views: 2100
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop',
    title: 'Cast Rehearsal - Behind the Scenes',
    description: 'Exclusive look at cast rehearsal for upcoming production.',
    category: 'behind-scenes',
    date: 'February 15, 2024',
    venue: 'City Cinema',
    photographer: 'Mark Thompson',
    likes: 145,
    views: 678
  }
];

// Categories matching frontend
const categories: Category[] = [
  { id: 'performances', name: 'Performances', icon: Theater, count: 0 },
  { id: 'behind-scenes', name: 'Behind Scenes', icon: Camera, count: 0 },
  { id: 'venues', name: 'Venues', icon: MapPin, count: 0 },
  { id: 'audience', name: 'Audience', icon: Users, count: 0 },
  { id: 'costumes', name: 'Costumes', icon: Award, count: 0 }
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

const GalleryManagement: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>(mockImages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'performances',
    date: new Date().toISOString().split('T')[0],
    venue: '',
    photographer: ''
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update category counts
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return images.length;
    return images.filter(img => img.category === categoryId).length;
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.photographer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || image.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      performances: 'bg-purple-100 text-purple-700',
      'behind-scenes': 'bg-blue-100 text-blue-700',
      venues: 'bg-green-100 text-green-700',
      audience: 'bg-yellow-100 text-yellow-700',
      costumes: 'bg-pink-100 text-pink-700'
    };
    const names: Record<string, string> = {
      performances: 'Performances',
      'behind-scenes': 'Behind Scenes',
      venues: 'Venues',
      audience: 'Audience',
      costumes: 'Costumes'
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[category] || 'bg-gray-100 text-gray-700'}`}>
        {names[category] || category}
      </span>
    );
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
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
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.venue.trim()) errors.venue = 'Venue is required';
    if (!formData.photographer.trim()) errors.photographer = 'Photographer name is required';
    if (!imagePreview && modalMode === 'add') errors.image = 'Image is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'performances',
      date: new Date().toISOString().split('T')[0],
      venue: '',
      photographer: ''
    });
    setImagePreview('');
    setImageFile(null);
    setFormErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Add Image
  const handleAddImage = () => {
    if (!validateForm()) return;

    const newImage: GalleryImage = {
      id: Date.now(),
      src: imagePreview,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: new Date(formData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      venue: formData.venue,
      photographer: formData.photographer,
      likes: 0,
      views: 0
    };

    setImages([newImage, ...images]);
    setPopupMessage({
      title: 'Image Added',
      message: `${formData.title} has been added to gallery`,
      type: 'success'
    });
    setShowModal(false);
    setShowSuccessPopup(true);
    resetForm();
  };

  // Handle Update Image
  const handleUpdateImage = () => {
    if (!selectedImage || !validateForm()) return;

    const updatedImages = images.map(img => img.id === selectedImage.id ? {
      ...img,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: new Date(formData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      venue: formData.venue,
      photographer: formData.photographer,
      src: imagePreview || img.src
    } : img);

    setImages(updatedImages);
    setPopupMessage({
      title: 'Image Updated',
      message: `${formData.title} has been updated successfully`,
      type: 'success'
    });
    setShowModal(false);
    setShowSuccessPopup(true);
    resetForm();
    setSelectedImage(null);
  };

  const handleDeleteImage = () => {
    if (selectedImage) {
      setImages(images.filter(img => img.id !== selectedImage.id));
      setShowDeleteConfirm(false);
      setSelectedImage(null);
      setPopupMessage({
        title: 'Image Deleted',
        message: `${selectedImage.title} has been deleted successfully`,
        type: 'success'
      });
      setShowSuccessPopup(true);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    resetForm();
    setSelectedImage(null);
    setShowModal(true);
  };

  const openEditModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setModalMode('edit');
    setFormData({
      title: image.title,
      description: image.description,
      category: image.category,
      date: new Date(image.date).toISOString().split('T')[0],
      venue: image.venue,
      photographer: image.photographer
    });
    setImagePreview(image.src);
    setImageFile(null);
    setShowModal(true);
  };

  const openViewModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setModalMode('view');
    setShowModal(true);
  };

  const stats = {
    total: images.length,
    performances: images.filter(i => i.category === 'performances').length,
    behindScenes: images.filter(i => i.category === 'behind-scenes').length,
    venues: images.filter(i => i.category === 'venues').length,
    audience: images.filter(i => i.category === 'audience').length,
    costumes: images.filter(i => i.category === 'costumes').length,
    totalLikes: images.reduce((sum, i) => sum + i.likes, 0),
    totalViews: images.reduce((sum, i) => sum + i.views, 0)
  };

  const dashboardCards = [
    { title: 'Total Images', value: stats.total, icon: Image, color: 'from-purple-500 to-purple-600', delay: 0.1, notification: true, notificationCount: stats.total },
    { title: 'Performances', value: stats.performances, icon: Theater, color: 'from-emerald-500 to-green-600', delay: 0.15, notification: true, notificationCount: stats.performances },
    { title: 'Behind Scenes', value: stats.behindScenes, icon: Camera, color: 'from-blue-500 to-cyan-600', delay: 0.2, notification: true, notificationCount: stats.behindScenes },
    { title: 'Venues', value: stats.venues, icon: MapPin, color: 'from-yellow-500 to-orange-600', delay: 0.25, notification: true, notificationCount: stats.venues },
    { title: 'Audience', value: stats.audience, icon: Users, color: 'from-pink-500 to-rose-600', delay: 0.3, notification: true, notificationCount: stats.audience },
    { title: 'Costumes', value: stats.costumes, icon: Award, color: 'from-indigo-500 to-purple-600', delay: 0.35, notification: true, notificationCount: stats.costumes }
  ];

  const columns = [
    {
      Header: 'Image',
      accessor: 'src',
      sortable: false,
      Cell: (row: GalleryImage) => (
        <img src={row.src} alt={row.title} className="w-16 h-16 object-cover rounded-lg" />
      )
    },
    {
      Header: 'Title',
      accessor: 'title',
      sortable: true,
      Cell: (row: GalleryImage) => (
        <div>
          <p className="font-medium text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{row.description}</p>
        </div>
      )
    },
    { Header: 'Venue', accessor: 'venue', sortable: true },
    { Header: 'Photographer', accessor: 'photographer', sortable: true },
    { Header: 'Category', accessor: 'category', sortable: true, Cell: (row: GalleryImage) => getCategoryBadge(row.category) },
    { Header: 'Date', accessor: 'date', sortable: true },
    { Header: 'Likes', accessor: 'likes', sortable: true, Cell: (row: GalleryImage) => <p className="font-semibold text-red-500">{row.likes}</p> },
    { Header: 'Views', accessor: 'views', sortable: true, Cell: (row: GalleryImage) => <p className="font-semibold text-blue-500">{row.views}</p> },
    {
      Header: 'Actions',
      accessor: 'id',
      sortable: false,
      Cell: (row: GalleryImage) => (
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
            onClick={() => { setSelectedImage(row); setShowDeleteConfirm(true); }}
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
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${modalMode === 'add' ? 'bg-teal-100' : 'bg-blue-100'}`}>
              {modalMode === 'add' ? <Plus className="h-5 w-5 text-teal-600" /> : <Edit className="h-5 w-5 text-blue-600" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'add' ? 'Add New Image' : 'Edit Image'}
              </h2>
              <p className="text-xs text-gray-500">
                {modalMode === 'add' ? 'Add a new image to the gallery' : 'Update image information'}
              </p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); modalMode === 'add' ? handleAddImage() : handleUpdateImage(); }} className="space-y-5">
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
                placeholder="Enter image title"
                className={`w-full px-4 py-2.5 border ${formErrors.title ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none`}
              />
              {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter image description"
                rows={3}
                className={`w-full px-4 py-2.5 border ${formErrors.description ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none`}
              />
              {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Image <span className="text-red-500">*</span>
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
              {formErrors.image && <p className="text-xs text-red-500 mt-1">{formErrors.image}</p>}
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                </div>
              )}
            </div>

            {/* Category and Date Row */}
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
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Venue and Photographer Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="Enter venue name"
                  className={`w-full px-4 py-2.5 border ${formErrors.venue ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none`}
                />
                {formErrors.venue && <p className="text-xs text-red-500 mt-1">{formErrors.venue}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Photographer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="photographer"
                  value={formData.photographer}
                  onChange={handleInputChange}
                  placeholder="Enter photographer name"
                  className={`w-full px-4 py-2.5 border ${formErrors.photographer ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none`}
                />
                {formErrors.photographer && <p className="text-xs text-red-500 mt-1">{formErrors.photographer}</p>}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <ReusableButton type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                Cancel
              </ReusableButton>
              <ReusableButton type="submit" className="flex-1">
                <Save className="h-4 w-4" />
                {modalMode === 'add' ? 'Add Image' : 'Update Image'}
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
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Image Details</h2>
              <p className="text-xs text-gray-500">Gallery image information</p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <img src={selectedImage?.src} alt={selectedImage?.title} className="w-full h-auto object-cover" />
            </div>

            {/* Image Info */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Title</p>
                <p className="font-semibold text-lg">{selectedImage?.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Description</p>
                <p className="text-sm text-gray-600">{selectedImage?.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
                  {selectedImage && getCategoryBadge(selectedImage.category)}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Date</p>
                  <p className="text-sm">{selectedImage?.date}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Venue</p>
                <p className="text-sm">{selectedImage?.venue}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Photographer</p>
                <p className="text-sm">{selectedImage?.photographer}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Likes</p>
                    <p className="font-semibold">{selectedImage?.likes.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="font-semibold">{selectedImage?.views.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <ReusableButton onClick={() => { setShowModal(false); openEditModal(selectedImage!); }} label="Edit Image" className="flex-1" />
                <ReusableButton variant="secondary" onClick={() => setShowModal(false)} label="Close" className="flex-1" />
              </div>
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
      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
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
              placeholder="Search by title, venue, photographer..."
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
          <ReusableButton onClick={openAddModal} icon={Plus} label="Add New Image" />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <ReusableTable
          columns={columns}
          data={filteredImages}
          title="Gallery Images"
          icon={Image}
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
      {showDeleteConfirm && selectedImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Image</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{selectedImage.title}</strong>"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDeleteImage} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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

export default GalleryManagement;