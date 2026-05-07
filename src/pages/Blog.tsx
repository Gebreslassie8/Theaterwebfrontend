// Frontend/src/pages/Blog.tsx
import supabase from "@/config/supabaseClient";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  TrendingUp,
  Heart,
  Bookmark,
  LayoutGrid,
  List,
  CheckCircle,
  ChevronDown,
  Star,
  Users,
  Zap,
  Lightbulb,
  HeartHandshake,
  Newspaper,
  X,
  ArrowRight,
  BookOpen,
  Sparkles,
  Filter,
  SortAsc,
  SortDesc,
  Theater,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ChevronUp,
} from "lucide-react";
import BlogShowCard from "../components/UI/BlogShowCard";

// Types for Blog from Supabase
interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  status: string;
  views: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  // Additional fields for UI
  slug?: string;
  excerpt?: string;
  author?: Author;
  readTime?: number;
  likes?: number;
  comments?: number;
  isNew?: boolean;
  category?: "latest" | "events" | "updates";
  isTrending?: boolean;
  isFeatured?: boolean;
}

// Mock authors for now (you can replace with real authors later)
const mockAuthors: Author[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar:
      "https://ui-avatars.com/api/?name=Sarah+Johnson&background=007590&color=fff",
    role: "Theater Journalist",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar:
      "https://ui-avatars.com/api/?name=Michael+Chen&background=007590&color=fff",
    role: "Arts Correspondent",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    avatar:
      "https://ui-avatars.com/api/?name=Emma+Rodriguez&background=007590&color=fff",
    role: "Cultural Reporter",
  },
  {
    id: "4",
    name: "David Kim",
    avatar:
      "https://ui-avatars.com/api/?name=David+Kim&background=007590&color=fff",
    role: "Entertainment Writer",
  },
  {
    id: "5",
    name: "Lisa Wong",
    avatar:
      "https://ui-avatars.com/api/?name=Lisa+Wong&background=007590&color=fff",
    role: "Theater Critic",
  },
];

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const itemsPerPage = 6;

  // Fetch real data from Supabase
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("status", "published") // Only get published blogs
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
        alert("Failed to load blogs");
      } else if (data) {
        // Transform Supabase data to match BlogPost format
        const transformedPosts = data.map((blog: any, index: number) => ({
          id: blog.id.toString(),
          title: blog.title,
          content: blog.content,
          image_url: blog.image_url,
          status: blog.status,
          views: blog.views || 0,
          created_at: blog.created_at,
          updated_at: blog.updated_at,
          user_id: blog.user_id,
          // Generate excerpt from content (first 150 characters)
          excerpt:
            blog.content.substring(0, 150) +
            (blog.content.length > 150 ? "..." : ""),
          slug: blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          // Assign category based on some logic or random for now
          category: getCategoryForBlog(index),
          // Calculate read time (average 200 words per minute)
          readTime: Math.max(
            1,
            Math.ceil(blog.content.split(" ").length / 200),
          ),
          // Random likes and comments for demo (you can remove this)
          likes: Math.floor(Math.random() * 500) + 50,
          comments: Math.floor(Math.random() * 100) + 10,
          // Determine if new (within last 7 days)
          isNew:
            new Date(blog.created_at) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          // Random trending/featured for demo
          isTrending: blog.views > 1000,
          isFeatured: blog.views > 2000,
          // Assign random author for demo
          author: mockAuthors[Math.floor(Math.random() * mockAuthors.length)],
        }));

        setPosts(transformedPosts);
        setFilteredPosts(transformedPosts);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to assign categories based on content or random
  const getCategoryForBlog = (
    index: number,
  ): "latest" | "events" | "updates" => {
    const categories: ("latest" | "events" | "updates")[] = [
      "latest",
      "events",
      "updates",
    ];
    // Use index to distribute evenly
    return categories[index % categories.length];
  };

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let filtered = [...posts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
          post.content.toLowerCase().includes(query),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Apply sorting - only newest and oldest by date
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("newest");
  };

  // Get category badge color and label
  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case "latest":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          label: "Latest News",
        };
      case "events":
        return { bg: "bg-green-100", text: "text-green-700", label: "Events" };
      case "updates":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          label: "Updates",
        };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", label: "Blog Post" };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mb-8 mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-96 mb-12 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-deepTeal to-deepBlue">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="bg-white/20 backdrop-blur-lg rounded-full p-3">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Latest News & Updates
            </h1>

            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Stay updated with the latest stories from Ethiopia's vibrant
              theater scene
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10" id="blog-content">
        {/* Category Filters and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              { id: "all", label: "All Blogs", icon: Newspaper },
              { id: "latest", label: "Latest News", icon: Sparkles },
              { id: "updates", label: "Updates", icon: Clock },
            ].map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              const categoryCount =
                category.id === "all"
                  ? filteredPosts.length
                  : posts.filter((p) => p.category === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-gradient-to-r from-deepTeal to-deepBlue text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                  <span
                    className={`text-xs ${isActive ? "text-white/80" : "text-gray-400"}`}
                  >
                    ({categoryCount})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar and Sort Dropdown */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-deepTeal focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown - Only Newest and Oldest */}
            <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-4 py-2 shadow-sm">
              <SortDesc className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500 font-medium">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest")
                }
                className="text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {(searchQuery ||
              selectedCategory !== "all" ||
              sortBy !== "newest") && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Posts Grid - USING BlogShowCard COMPONENT */}
        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.map((post, index) => {
                const categoryBadge = getCategoryBadge(post.category);
                // Transform the post to match BlogShowCard's expected format
                const cardPost = {
                  id: post.id,
                  title: post.title,
                  slug: post.slug || post.id,
                  excerpt: post.excerpt || post.content.substring(0, 150),
                  featuredImage: post.image_url,
                  author: post.author || mockAuthors[0],
                  categories: [],
                  publishedAt: post.created_at,
                  readTime: post.readTime || 3,
                  views: post.views,
                  likes: post.likes || 0,
                  bookmarks: 0,
                  comments: post.comments || 0,
                  isTrending: post.isTrending || false,
                  isFeatured: post.isFeatured || false,
                  isNew: post.isNew || false,
                  category: post.category || "latest",
                  categoryBadge: categoryBadge,
                };
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BlogShowCard post={cardPost} />
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                    scrollToTop();
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex gap-2">
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => {
                          setCurrentPage(1);
                          scrollToTop();
                        }}
                        className="w-9 h-9 rounded-lg font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="w-9 h-9 flex items-center justify-center text-gray-400">
                          ...
                        </span>
                      )}
                    </>
                  )}

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          scrollToTop();
                        }}
                        className={`w-9 h-9 rounded-lg font-medium transition ${
                          currentPage === pageNum
                            ? "bg-deepTeal text-white shadow-md"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="w-9 h-9 flex items-center justify-center text-gray-400">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setCurrentPage(totalPages);
                          scrollToTop();
                        }}
                        className="w-9 h-9 rounded-lg font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    scrollToTop();
                  }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Showing info */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredPosts.length)} of{" "}
              {filteredPosts.length} articles
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-deepTeal text-white rounded-lg"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* SCROLL TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-deepTeal text-white rounded-full shadow-lg hover:bg-deepTeal/80 transition-all duration-200"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
