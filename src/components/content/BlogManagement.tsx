// src/components/content/BlogManagement.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Newspaper,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Calendar as CalendarIcon,
  AlertCircle,
  Send,
  Save,
  LayoutGrid,
  Upload,
  X,
  Loader2,
  ChevronDown,
  Sparkles,
  Clock,
  TrendingUp,
  Heart,
  MessageCircle,
  Star,
  ArrowRight,
  RefreshCw,
  User,
} from "lucide-react";
import ReusableTable from "../Reusable/ReusableTable";
import ReusableButton from "../Reusable/ReusableButton";
import SuccessPopup from "../Reusable/SuccessPopup";
import { useFormik } from "formik";
import * as Yup from "yup";
import supabase from "@/config/supabaseClient";

// ==================== Types ====================
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: "latest" | "events" | "updates";
  published_at: string;
  read_time: number;
  views: number;
  likes: number;
  comments_count: number;
  is_trending: boolean;
  is_featured: boolean;
  is_active: boolean;
  published_by: string | null;
  published_by_name: string | null;
  published_by_role: string | null;
  created_at: string;
  updated_at: string;
}

// ==================== Validation Schema ====================
const blogValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),
  excerpt: Yup.string()
    .required("Excerpt is required")
    .min(20, "Excerpt must be at least 20 characters")
    .max(500, "Excerpt must not exceed 500 characters"),
  content: Yup.string()
    .required("Content is required")
    .min(50, "Content must be at least 50 characters"),
  featured_image: Yup.string(),
  category: Yup.string()
    .oneOf(["latest", "events", "updates"], "Invalid category")
    .required("Category is required"),
  read_time: Yup.number()
    .min(1, "Read time must be at least 1 minute")
    .max(30, "Read time must not exceed 30 minutes")
    .required("Read time is required"),
  is_trending: Yup.boolean(),
  is_featured: Yup.boolean(),
});

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
  link?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  delay,
  link,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const CardContent = () => (
    <div
      className="relative overflow-hidden cursor-pointer transition-all duration-300"
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
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
        {link && (
          <div
            className={`transform transition-all duration-300 ${isHovered ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"}`}
          >
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

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath);

      setPreview(publicUrl);
      onChange(publicUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {!preview ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
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
      {touched && error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-gray-500">Upload JPG, PNG or GIF (Max 5MB)</p>
    </div>
  );
};

// ==================== Main Component ====================
const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "latest" | "events" | "updates"
  >("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    title: "",
    message: "",
    type: "success" as any,
  });

  // Get current user from session
  useEffect(() => {
    const getCurrentUser = () => {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    };
    getCurrentUser();
  }, []);

  // Load blog posts from database
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_active", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || post.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = {
    total: posts.length,
    news: posts.filter((p) => p.category === "latest").length,
    events: posts.filter((p) => p.category === "events").length,
    updates: posts.filter((p) => p.category === "updates").length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
  };

  // Form handling with Formik
  const formik = useFormik({
    initialValues: {
      title: "",
      excerpt: "",
      content: "",
      featured_image: "",
      category: "latest" as "latest" | "events" | "updates",
      read_time: 5,
      is_trending: false,
      is_featured: false,
    },
    validationSchema: blogValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (selectedPost) {
          // Update existing post
          const { error } = await supabase
            .from("blog_posts")
            .update({
              title: values.title,
              slug: generateSlug(values.title),
              excerpt: values.excerpt,
              content: values.content,
              featured_image: values.featured_image,
              category: values.category,
              read_time: values.read_time,
              is_trending: values.is_trending,
              is_featured: values.is_featured,
              updated_at: new Date().toISOString(),
            })
            .eq("id", selectedPost.id);

          if (error) throw error;

          setPopupMessage({
            title: "Post Updated!",
            message: `${values.title} has been updated successfully`,
            type: "success",
          });
        } else {
          // Create new post
          const { error } = await supabase.from("blog_posts").insert({
            title: values.title,
            slug: generateSlug(values.title),
            excerpt: values.excerpt,
            content: values.content,
            featured_image: values.featured_image,
            category: values.category,
            read_time: values.read_time,
            is_trending: values.is_trending,
            is_featured: values.is_featured,
            published_by: currentUser?.id,
            published_by_name: currentUser?.name || currentUser?.full_name,
            published_by_role: currentUser?.role,
            published_at: new Date().toISOString(),
            is_active: true,
          });

          if (error) throw error;

          setPopupMessage({
            title: "Post Created!",
            message: `${values.title} has been created successfully`,
            type: "success",
          });
        }

        await loadPosts();
        setShowSuccessPopup(true);
        resetForm();
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedPost(null);
      } catch (error: any) {
        console.error("Error saving post:", error);
        setPopupMessage({
          title: "Error!",
          message: error.message,
          type: "error",
        });
        setShowSuccessPopup(true);
      }
    },
  });

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    formik.setValues({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image || "",
      category: post.category,
      read_time: post.read_time,
      is_trending: post.is_trending,
      is_featured: post.is_featured,
    });
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      // Soft delete - just mark as inactive
      const { error } = await supabase
        .from("blog_posts")
        .update({ is_active: false })
        .eq("id", postToDelete.id);

      if (error) throw error;

      await loadPosts();
      setShowDeleteConfirm(false);
      setPostToDelete(null);
      setPopupMessage({
        title: "Post Deleted!",
        message: `${postToDelete.title} has been removed successfully`,
        type: "success",
      });
      setShowSuccessPopup(true);
    } catch (error: any) {
      console.error("Error deleting post:", error);
      setPopupMessage({
        title: "Error!",
        message: error.message,
        type: "error",
      });
      setShowSuccessPopup(true);
    }
  };

  const getCategoryBadge = (category: string) => {
    const config = {
      latest: {
        icon: Sparkles,
        color: "bg-blue-100 text-blue-700",
        label: "News",
      },
      events: {
        icon: CalendarIcon,
        color: "bg-green-100 text-green-700",
        label: "Events",
      },
      updates: {
        icon: Clock,
        color: "bg-purple-100 text-purple-700",
        label: "Recent Updates",
      },
    };
    const c = config[category as keyof typeof config];
    const Icon = c.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.color}`}
      >
        <Icon className="h-3 w-3" />
        {c.label}
      </span>
    );
  };

  // Column definitions
  const columns = [
    {
      Header: "Blog Post",
      accessor: "title",
      sortable: true,
      Cell: (row: BlogPost) => (
        <div className="flex items-center gap-3">
          {row.featured_image ? (
            <img
              src={row.featured_image}
              alt={row.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Newspaper className="h-5 w-5 text-white" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 line-clamp-1">
              {row.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {new Date(row.published_at).toLocaleDateString()}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {row.read_time} min read
              </span>
              {row.published_by_name && (
                <>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {row.published_by_name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      Header: "Category",
      accessor: "category",
      sortable: true,
      Cell: (row: BlogPost) => getCategoryBadge(row.category),
    },
    {
      Header: "Engagement",
      accessor: "views",
      sortable: true,
      Cell: (row: BlogPost) => (
        <div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3 text-gray-400" />
            <span className="text-sm text-gray-600">
              {row.views.toLocaleString()} views
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Heart className="h-3 w-3 text-pink-500" />
            <span className="text-xs text-gray-500">{row.likes}</span>
            <MessageCircle className="h-3 w-3 text-blue-500 ml-1" />
            <span className="text-xs text-gray-500">{row.comments_count}</span>
          </div>
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "is_trending",
      sortable: true,
      Cell: (row: BlogPost) => (
        <div className="flex flex-col gap-1">
          {row.is_trending && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
              <TrendingUp className="h-3 w-3" />
              Trending
            </span>
          )}
          {row.is_featured && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              <Star className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>
      ),
    },
  ];

  const renderActions = (row: BlogPost) => (
    <div className="flex items-center justify-start gap-2">
      <button
        onClick={() => {
          setViewingPost(row);
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
        title="Edit Post"
      >
        <Edit className="h-4 w-4 text-teal-600" />
      </button>

      <button
        onClick={() => {
          setPostToDelete(row);
          setShowDeleteConfirm(true);
        }}
        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200"
        title="Delete Post"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </button>
    </div>
  );

  const columnsWithActions = [
    ...columns,
    {
      Header: "Actions",
      accessor: "actions",
      Cell: renderActions,
      width: "120px",
      align: "left" as const,
    },
  ];

  // Dashboard Cards
  const dashboardCards = [
    {
      title: "Total Posts",
      value: stats.total,
      icon: Newspaper,
      color: "from-indigo-500 to-indigo-600",
      delay: 0.1,
    },
    {
      title: "News",
      value: stats.news,
      icon: Sparkles,
      color: "from-blue-500 to-blue-600",
      delay: 0.15,
    },
    {
      title: "Events",
      value: stats.events,
      icon: CalendarIcon,
      color: "from-green-500 to-emerald-600",
      delay: 0.2,
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "from-purple-500 to-purple-600",
      delay: 0.25,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog posts...</p>
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
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Blog Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your theater blog posts and content
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPost(null);
                formik.resetForm();
                setShowAddModal(true);
              }}
              className="px-5 py-2.5 text-sm whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Post
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
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
                placeholder="Search by title or excerpt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl flex items-center gap-2 bg-white hover:bg-gray-50 transition-all"
              >
                <span className="text-gray-700">
                  {selectedFilter === "all"
                    ? "All Categories"
                    : selectedFilter === "latest"
                      ? "News"
                      : selectedFilter === "events"
                        ? "Events"
                        : "Recent Updates"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedFilter("all");
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
                  >
                    <span>All Categories</span>
                    <span className="text-xs text-gray-500">{stats.total}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("latest");
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center border-t border-gray-100"
                  >
                    <span>News</span>
                    <span className="text-xs text-gray-500">{stats.news}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("events");
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center border-t border-gray-100"
                  >
                    <span>Events</span>
                    <span className="text-xs text-gray-500">
                      {stats.events}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("updates");
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center border-t border-gray-100"
                  >
                    <span>Recent Updates</span>
                    <span className="text-xs text-gray-500">
                      {stats.updates}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilter("all");
                loadPosts();
              }}
              className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Blog Posts Found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first blog post.
            </p>
            <button
              onClick={() => {
                setSelectedPost(null);
                formik.resetForm();
                setShowAddModal(true);
              }}
              className="px-5 py-2.5 text-sm whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create New Post
            </button>
          </div>
        ) : (
          <ReusableTable
            columns={columnsWithActions}
            data={filteredPosts}
            icon={LayoutGrid}
            showSearch={false}
            showExport={true}
            showPrint={false}
          />
        )}

        {/* Create/Edit Blog Modal */}
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
                  {showEditModal ? "Edit Blog Post" : "Create New Blog Post"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedPost(null);
                    formik.resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter post title"
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  <ImageUpload
                    value={formik.values.featured_image}
                    onChange={(url) =>
                      formik.setFieldValue("featured_image", url)
                    }
                    onBlur={() =>
                      formik.setFieldTouched("featured_image", true)
                    }
                    error={formik.errors.featured_image}
                    touched={formik.touched.featured_image}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="excerpt"
                    rows={3}
                    value={formik.values.excerpt}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="Brief summary of the post"
                  />
                  <div className="flex justify-between mt-1">
                    {formik.touched.excerpt && formik.errors.excerpt && (
                      <p className="text-sm text-red-600">
                        {formik.errors.excerpt}
                      </p>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">
                      {formik.values.excerpt.length}/500
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    rows={10}
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="Write your blog content here..."
                  />
                  {formik.touched.content && formik.errors.content && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.content}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="latest">News</option>
                      <option value="events">Events</option>
                      <option value="updates">Recent Updates</option>
                    </select>
                    {formik.touched.category && formik.errors.category && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Read Time (minutes){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="read_time"
                      value={formik.values.read_time}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      min="1"
                      max="30"
                    />
                    {formik.touched.read_time && formik.errors.read_time && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.read_time}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formik.values.is_trending}
                      onChange={(e) =>
                        formik.setFieldValue("is_trending", e.target.checked)
                      }
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">
                      Mark as Trending
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formik.values.is_featured}
                      onChange={(e) =>
                        formik.setFieldValue("is_featured", e.target.checked)
                      }
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">
                      Mark as Featured
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedPost(null);
                      formik.resetForm();
                    }}
                    className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {showEditModal ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {showEditModal ? "Update Post" : "Create Post"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* View Post Modal */}
        {showViewModal && viewingPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{viewingPost.title}</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {viewingPost.featured_image && (
                  <img
                    src={viewingPost.featured_image}
                    alt={viewingPost.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(viewingPost.published_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {viewingPost.read_time} min read
                  </span>
                  {getCategoryBadge(viewingPost.category)}
                  {viewingPost.published_by_name && (
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      By {viewingPost.published_by_name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-2 pb-4 border-y border-gray-100">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {viewingPost.views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span>{viewingPost.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span>{viewingPost.comments_count} comments</span>
                  </div>
                  {viewingPost.is_trending && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <TrendingUp className="h-4 w-4" />
                      Trending
                    </span>
                  )}
                  {viewingPost.is_featured && (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Star className="h-4 w-4" />
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-gray-600 italic border-l-4 border-indigo-300 pl-4">
                  {viewingPost.excerpt}
                </p>

                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {viewingPost.content}
                  </p>
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
        {showDeleteConfirm && postToDelete && (
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
                <h3 className="text-xl font-bold text-gray-900">
                  Delete Blog Post
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete{" "}
                <strong>{postToDelete.title}</strong>? This action cannot be
                undone.
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
        />
      </div>
    </motion.div>
  );
};

export default BlogManagement;