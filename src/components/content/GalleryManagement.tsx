// src/pages/Admin/content/GalleryManagement.tsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Image,
    Eye,
    Edit,
    Trash2,
    Plus,
    Search,
    Calendar as CalendarIcon,
    MapPin,
    Camera,
    Heart,
    Award,
    Theater,
    Users,
    XCircle,
    Save,
    AlertCircle,
    LayoutGrid,
    ArrowRight,
    RefreshCw,
    X,
    Upload,
    Loader2,
    ChevronDown,
    Sparkles,
    Clock
} from 'lucide-react';
import ReusableTable from '../../components/Reusable/ReusableTable';
import ReusableButton from '../../components/Reusable/ReusableButton';
import SuccessPopup from '../../components/Reusable/SuccessPopup';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// ==================== Types ====================
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

// ==================== Mock Data ====================
const mockImages: GalleryImage[] = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=800&auto=format&fit=crop',
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
        src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop',
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
        src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop',
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
        src: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
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
        src: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop',
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
        src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
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

// ==================== Validation Schema ====================
const galleryValidationSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must not exceed 500 characters'),
    category: Yup.string()
        .required('Category is required'),
    venue: Yup.string()
        .required('Venue is required')
        .min(2, 'Venue must be at least 2 characters'),
    photographer: Yup.string()
        .required('Photographer name is required')
        .min(2, 'Photographer name must be at least 2 characters'),
    date: Yup.string()
        .required('Date is required'),
    image: Yup.string()
        .required('Image is required')
});

// ==================== Animation Variants ====================
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

// ==================== Stat Card Component ====================
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link }) => {
    const [isHovered, setIsHovered] = useState(false);

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
                    <p className="text-xs text-gray-500">{title}</p>
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

// ==================== Image Upload Component ====================
interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onBlur?: () => void;
    error?: string;
    touched?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, onBlur, error, touched }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string>(value);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            await new Promise(resolve => setTimeout(resolve, 1000));
            onChange(previewUrl);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                {!preview ? (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                        ) : (
                            <Upload className="h-5 w-5 text-gray-500" />
                        )}
                        <span className="text-sm text-gray-600">Upload Image</span>
                    </button>
                ) : (
                    <div className="relative inline-block">
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    onBlur={onBlur}
                />
            </div>
            {touched && error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
            <p className="text-xs text-gray-500">Upload JPG, PNG or GIF (Max 5MB)</p>
        </div>
    );
};

// ==================== Main Component ====================
const GalleryManagement: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>(mockImages);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [viewingImage, setViewingImage] = useState<GalleryImage | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
    
    // Popup state
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Filtered images
    const filteredImages = images.filter(image => {
        const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.photographer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || image.category === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    // Stats
    const stats = {
        total: images.length,
        performances: images.filter(i => i.category === 'performances').length,
        behindScenes: images.filter(i => i.category === 'behind-scenes').length,
        venues: images.filter(i => i.category === 'venues').length,
        audience: images.filter(i => i.category === 'audience').length,
        costumes: images.filter(i => i.category === 'costumes').length,
        totalViews: images.reduce((sum, i) => sum + i.views, 0)
    };

    // Form handling with Formik
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            category: 'performances',
            date: new Date().toISOString().split('T')[0],
            venue: '',
            photographer: '',
            image: ''
        },
        validationSchema: galleryValidationSchema,
        onSubmit: (values, { resetForm }) => {
            if (selectedImage) {
                const updatedImages = images.map(img =>
                    img.id === selectedImage.id
                        ? {
                            ...img,
                            title: values.title,
                            description: values.description,
                            category: values.category,
                            date: new Date(values.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                            venue: values.venue,
                            photographer: values.photographer,
                            src: values.image
                        }
                        : img
                );
                setImages(updatedImages);
                setPopupMessage({
                    title: 'Image Updated!',
                    message: `${values.title} has been updated successfully`,
                    type: 'success'
                });
            } else {
                const newImage: GalleryImage = {
                    id: Date.now(),
                    title: values.title,
                    description: values.description,
                    category: values.category,
                    date: new Date(values.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    venue: values.venue,
                    photographer: values.photographer,
                    src: values.image,
                    likes: 0,
                    views: 0
                };
                setImages([newImage, ...images]);
                setPopupMessage({
                    title: 'Image Added!',
                    message: `${values.title} has been added successfully`,
                    type: 'success'
                });
            }
            setShowSuccessPopup(true);
            resetForm();
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedImage(null);
        }
    });

    const handleEdit = (image: GalleryImage) => {
        setSelectedImage(image);
        formik.setValues({
            title: image.title,
            description: image.description,
            category: image.category,
            date: new Date(image.date).toISOString().split('T')[0],
            venue: image.venue,
            photographer: image.photographer,
            image: image.src
        });
        setShowEditModal(true);
    };

    const handleDelete = () => {
        if (imageToDelete) {
            setImages(images.filter(i => i.id !== imageToDelete.id));
            setShowDeleteConfirm(false);
            setImageToDelete(null);
            setPopupMessage({
                title: 'Image Deleted!',
                message: `${imageToDelete.title} has been removed successfully`,
                type: 'success'
            });
            setShowSuccessPopup(true);
        }
    };

    const getCategoryBadge = (category: string) => {
        const config: Record<string, { icon: React.ElementType; color: string; label: string }> = {
            performances: { icon: Theater, color: 'bg-purple-100 text-purple-700', label: 'Performances' },
            'behind-scenes': { icon: Camera, color: 'bg-blue-100 text-blue-700', label: 'Behind Scenes' },
            venues: { icon: MapPin, color: 'bg-green-100 text-green-700', label: 'Venues' },
            audience: { icon: Users, color: 'bg-yellow-100 text-yellow-700', label: 'Audience' },
            costumes: { icon: Award, color: 'bg-pink-100 text-pink-700', label: 'Costumes' }
        };
        const c = config[category] || { icon: Image, color: 'bg-gray-100 text-gray-700', label: category };
        const Icon = c.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>
                <Icon className="h-3 w-3" />
                {c.label}
            </span>
        );
    };

    // Column definitions
    const columns = [
        {
            Header: 'Image',
            accessor: 'src',
            sortable: false,
            Cell: (row: GalleryImage) => (
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                    <img src={row.src} alt={row.title} className="w-full h-full object-cover" />
                </div>
            )
        },
        {
            Header: 'Title & Info',
            accessor: 'title',
            sortable: true,
            Cell: (row: GalleryImage) => (
                <div>
                    <p className="font-medium text-gray-900">{row.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{row.venue}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <Camera className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{row.photographer}</span>
                    </div>
                </div>
            )
        },
        {
            Header: 'Category',
            accessor: 'category',
            sortable: true,
            Cell: (row: GalleryImage) => getCategoryBadge(row.category)
        },
        {
            Header: 'Date',
            accessor: 'date',
            sortable: true,
            Cell: (row: GalleryImage) => (
                <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{row.date}</span>
                </div>
            )
        },
        {
            Header: 'Engagement',
            accessor: 'likes',
            sortable: true,
            Cell: (row: GalleryImage) => (
                <div>
                    <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span className="text-sm text-gray-600">{row.likes.toLocaleString()} likes</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        <Eye className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{row.views.toLocaleString()} views</span>
                    </div>
                </div>
            )
        }
    ];

    const renderActions = (row: GalleryImage) => (
        <div className="flex items-center justify-start gap-2">
            <button
                onClick={() => {
                    setViewingImage(row);
                    setShowViewModal(true);
                }}
                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                title="View Details"
            >
                <Eye className="h-4 w-4 text-blue-600" />
            </button>

            <button
                onClick={() => handleEdit(row)}
                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-all duration-200"
                title="Edit Image"
            >
                <Edit className="h-4 w-4 text-teal-600" />
            </button>

            <button
                onClick={() => {
                    setImageToDelete(row);
                    setShowDeleteConfirm(true);
                }}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200"
                title="Delete Image"
            >
                <Trash2 className="h-4 w-4 text-red-600" />
            </button>
        </div>
    );

    const columnsWithActions = [
        ...columns,
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: renderActions,
            width: '120px',
            align: 'left' as const
        }
    ];

    // Dashboard Cards
    const dashboardCards = [
        { title: 'Total Images', value: stats.total, icon: Image, color: 'from-purple-500 to-purple-600', delay: 0.1 },
        { title: 'Performances', value: stats.performances, icon: Theater, color: 'from-emerald-500 to-green-600', delay: 0.15 },
        { title: 'Behind Scenes', value: stats.behindScenes, icon: Camera, color: 'from-blue-500 to-cyan-600', delay: 0.2 },
        { title: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'from-rose-500 to-pink-600', delay: 0.25 }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 p-6 bg-gray-50 min-h-screen"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                            <p className="text-gray-600 mt-1">Manage event photos and gallery images</p>
                        </div>
                        <ReusableButton
                            onClick={() => {
                                setSelectedImage(null);
                                formik.resetForm();
                                setShowAddModal(true);
                            }}
                            icon={<Plus className="h-4 w-4" />}
                            label="Add New Image"
                            className="px-5 py-2.5 text-sm whitespace-nowrap bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                        />
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, venue or photographer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            />
                        </div>
                        
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl flex items-center gap-2 bg-white hover:bg-gray-50 transition-all"
                            >
                                <span className="text-gray-700">
                                    {selectedFilter === 'all' ? 'All Categories' : 
                                     selectedFilter === 'performances' ? 'Performances' :
                                     selectedFilter === 'behind-scenes' ? 'Behind Scenes' :
                                     selectedFilter === 'venues' ? 'Venues' :
                                     selectedFilter === 'audience' ? 'Audience' : 'Costumes'}
                                </span>
                                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isFilterOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setSelectedFilter('all');
                                            setIsFilterOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
                                    >
                                        <span>All Categories</span>
                                        <span className="text-xs text-gray-500">{stats.total}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedFilter('performances');
                                            setIsFilterOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center border-t border-gray-100"
                                    >
                                        <span>Performances</span>
                                        <span className="text-xs text-gray-500">{stats.performances}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedFilter('behind-scenes');
                                            setIsFilterOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center border-t border-gray-100"
                                    >
                                        <span>Behind Scenes</span>
                                        <span className="text-xs text-gray-500">{stats.behindScenes}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedFilter('venues');
                                            setIsFilterOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center border-t border-gray-100"
                                    >
                                        <span>Venues</span>
                                        <span className="text-xs text-gray-500">{stats.venues}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedFilter('all');
                            }}
                            className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                            title="Reset Filters"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <ReusableTable
                    columns={columnsWithActions}
                    data={filteredImages}
                    icon={LayoutGrid}
                    showSearch={false}
                    showExport={true}
                    showPrint={false}
                />

                {/* Create/Edit Gallery Modal */}
                {(showAddModal || showEditModal) && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                                <h2 className="text-2xl font-bold">
                                    {showEditModal ? 'Edit Image' : 'Add New Image'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        setSelectedImage(null);
                                        formik.resetForm();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <XCircle className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter image title"
                                    />
                                    {formik.touched.title && formik.errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image <span className="text-red-500">*</span>
                                    </label>
                                    <ImageUpload
                                        value={formik.values.image}
                                        onChange={(url) => formik.setFieldValue('image', url)}
                                        onBlur={() => formik.setFieldTouched('image', true)}
                                        error={formik.errors.image}
                                        touched={formik.touched.image}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter image description"
                                    />
                                    <div className="flex justify-between mt-1">
                                        {formik.touched.description && formik.errors.description && (
                                            <p className="text-sm text-red-600">{formik.errors.description}</p>
                                        )}
                                        <span className="text-xs text-gray-500 ml-auto">
                                            {formik.values.description.length}/500
                                        </span>
                                    </div>
                                </div>

                                {/* Category and Date Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="category"
                                            value={formik.values.category}
                                            onChange={formik.handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="performances">Performances</option>
                                            <option value="behind-scenes">Behind Scenes</option>
                                            <option value="venues">Venues</option>
                                            <option value="audience">Audience</option>
                                            <option value="costumes">Costumes</option>
                                        </select>
                                        {formik.touched.category && formik.errors.category && (
                                            <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formik.values.date}
                                            onChange={formik.handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                        />
                                        {formik.touched.date && formik.errors.date && (
                                            <p className="mt-1 text-sm text-red-600">{formik.errors.date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Venue and Photographer Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Venue <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="venue"
                                            value={formik.values.venue}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter venue name"
                                        />
                                        {formik.touched.venue && formik.errors.venue && (
                                            <p className="mt-1 text-sm text-red-600">{formik.errors.venue}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Photographer <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="photographer"
                                            value={formik.values.photographer}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter photographer name"
                                        />
                                        {formik.touched.photographer && formik.errors.photographer && (
                                            <p className="mt-1 text-sm text-red-600">{formik.errors.photographer}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <ReusableButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setShowEditModal(false);
                                            setSelectedImage(null);
                                            formik.resetForm();
                                        }}
                                        label="Cancel"
                                        className="px-6 py-2.5"
                                    />
                                    <ReusableButton
                                        type="submit"
                                        variant="primary"
                                        loading={false}
                                        icon={showEditModal ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                        label={showEditModal ? 'Update Image' : 'Add Image'}
                                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700"
                                    />
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* View Image Modal */}
                {showViewModal && viewingImage && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                                <h2 className="text-2xl font-bold">{viewingImage.title}</h2>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <XCircle className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <img
                                    src={viewingImage.src}
                                    alt={viewingImage.title}
                                    className="w-full h-64 object-cover rounded-xl"
                                />

                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        {viewingImage.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {viewingImage.venue}
                                    </span>
                                    {getCategoryBadge(viewingImage.category)}
                                </div>

                                <div className="flex items-center gap-4 pt-2 pb-4 border-y border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-red-500" />
                                        <span className="font-medium">{viewingImage.likes.toLocaleString()} likes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-gray-500" />
                                        <span>{viewingImage.views.toLocaleString()} views</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Camera className="h-4 w-4 text-gray-500" />
                                        <span>{viewingImage.photographer}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{viewingImage.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{viewingImage.description}</p>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && imageToDelete && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Delete Image</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to delete <strong>{imageToDelete.title}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
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

export default GalleryManagement;