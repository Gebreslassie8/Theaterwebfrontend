// Frontend/src/components/blog/Blog.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, Calendar, User, Tag, Heart, Bookmark, Share2,
    Eye, MessageCircle, TrendingUp, Clock, ChevronRight,
    Play, X, Filter, Award, Star, Globe, Users, Sparkles,
    ImageIcon, Video, Newspaper, Quote, ArrowRight,
    ThumbsUp, BookOpen, Lightbulb, Zap, Coffee, HeartHandshake,
    Menu, Home, Info, Mail, ChevronDown, ChevronUp,
    LayoutGrid, List, LogIn, UserPlus, Settings, Bell, UserCircle,
    ChevronLeft
} from 'lucide-react';

// Types
interface Author {
    id: string;
    name: string;
    avatar: string;
    role: string;
    bio: string;
    socialLinks: {
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: any;
    count: number;
    color: string;
    description: string;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: Author;
    categories: Category[];
    tags: string[];
    publishedAt: string;
    readTime: number;
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
    isFeatured: boolean;
    isTrending: boolean;
    videoUrl?: string;
    galleryImages?: string[];
    status: 'published' | 'draft';
}

// Mock Data
const mockAuthors: Author[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=007590&color=fff',
        role: 'Senior Theater Critic',
        bio: 'Award-winning theater critic with 15 years of experience in performing arts journalism.',
        socialLinks: {
            twitter: 'https://twitter.com/sarahj',
            linkedin: 'https://linkedin.com/in/sarahj',
            instagram: 'https://instagram.com/sarahj'
        }
    },
    {
        id: '2',
        name: 'Michael Chen',
        avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=007590&color=fff',
        role: 'Technical Director',
        bio: 'Theater technology expert specializing in stage automation and sound design.',
        socialLinks: {
            twitter: 'https://twitter.com/michaelc',
            linkedin: 'https://linkedin.com/in/michaelc'
        }
    },
    {
        id: '3',
        name: 'Emma Rodriguez',
        avatar: 'https://ui-avatars.com/api/?name=Emma+Rodriguez&background=007590&color=fff',
        role: 'Arts & Culture Journalist',
        bio: 'Covering the intersection of technology and performing arts.',
        socialLinks: {
            twitter: 'https://twitter.com/emmar',
            instagram: 'https://instagram.com/emmar'
        }
    }
];

const mockCategories: Category[] = [
    { id: '1', name: 'Theater News', slug: 'news', icon: Newspaper, count: 24, color: 'deepTeal', description: 'Latest updates from the theater world' },
    { id: '2', name: 'Reviews', slug: 'reviews', icon: Star, count: 18, color: 'deepTeal', description: 'Expert reviews of current productions' },
    { id: '3', name: 'Technology', slug: 'tech', icon: Zap, count: 12, color: 'deepTeal', description: 'Theater tech innovations' },
    { id: '4', name: 'Interviews', slug: 'interviews', icon: Users, count: 8, color: 'deepTeal', description: 'Conversations with theater professionals' },
    { id: '5', name: 'Guides', slug: 'guides', icon: Lightbulb, count: 15, color: 'deepTeal', description: 'Helpful resources and tutorials' },
    { id: '6', name: 'Community', slug: 'community', icon: HeartHandshake, count: 10, color: 'deepTeal', description: 'Community stories and events' }
];

const mockBlogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'The Future of Digital Ticketing: How Blockchain is Revolutionizing Theater',
        slug: 'future-digital-ticketing-blockchain',
        excerpt: 'Discover how blockchain technology is making ticket fraud a thing of the past and creating new opportunities for theaters and audiences alike.',
        content: 'Lorem ipsum...',
        featuredImage: 'https://images.unsplash.com/photo-1503095396549-8070c434c0a2?w=800',
        author: mockAuthors[0],
        categories: [mockCategories[2], mockCategories[0]],
        tags: ['blockchain', 'ticketing', 'innovation'],
        publishedAt: '2024-03-15T10:00:00Z',
        readTime: 8,
        views: 3450,
        likes: 234,
        comments: 45,
        bookmarks: 123,
        isFeatured: false,
        isTrending: true,
        status: 'published'
    },
    {
        id: '2',
        title: 'Behind the Scenes: The Making of "The Phantom of the Opera"',
        slug: 'behind-scenes-phantom-opera',
        excerpt: 'An exclusive look at the technical marvels and artistic decisions that bring this timeless classic to life on stage.',
        content: 'Lorem ipsum...',
        featuredImage: 'https://images.unsplash.com/photo-1507924538820-ede3a2f080d7?w=800',
        author: mockAuthors[1],
        categories: [mockCategories[1], mockCategories[4]],
        tags: ['phantom', 'behind-scenes', 'production'],
        publishedAt: '2024-03-12T14:30:00Z',
        readTime: 12,
        views: 2890,
        likes: 456,
        comments: 78,
        bookmarks: 234,
        isFeatured: false,
        isTrending: true,
        status: 'published'
    },
    {
        id: '3',
        title: 'Interview: How AI is Transforming Script Writing and Character Development',
        slug: 'interview-ai-script-writing',
        excerpt: 'We sit down with renowned playwright Sarah Chen to discuss the role of artificial intelligence in modern theater creation.',
        content: 'Lorem ipsum...',
        featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        author: mockAuthors[2],
        categories: [mockCategories[3], mockCategories[2]],
        tags: ['AI', 'writing', 'innovation'],
        publishedAt: '2024-03-10T09:15:00Z',
        readTime: 10,
        views: 2100,
        likes: 189,
        comments: 34,
        bookmarks: 98,
        isFeatured: false,
        isTrending: true,
        status: 'published'
    },
    {
        id: '4',
        title: 'Top 10 Theater Venues to Visit in 2024',
        slug: 'top-10-theater-venues-2024',
        excerpt: 'From historic opera houses to modern black box theaters, discover the must-visit performance spaces around the world.',
        content: 'Lorem ipsum...',
        featuredImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
        author: mockAuthors[0],
        categories: [mockCategories[4], mockCategories[5]],
        tags: ['venues', 'travel', 'guide'],
        publishedAt: '2024-03-08T16:45:00Z',
        readTime: 15,
        views: 5670,
        likes: 892,
        comments: 156,
        bookmarks: 445,
        isFeatured: false,
        isTrending: false,
        status: 'published'
    },
    {
        id: '5',
        title: 'Sustainable Theater: How Venues are Going Green',
        slug: 'sustainable-theater-green-venues',
        excerpt: 'Learn about the innovative eco-friendly practices being adopted by theaters worldwide to reduce their environmental impact.',
        content: 'Lorem ipsum...',
        featuredImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        author: mockAuthors[1],
        categories: [mockCategories[0], mockCategories[5]],
        tags: ['sustainability', 'green', 'eco-friendly'],
        publishedAt: '2024-03-05T11:20:00Z',
        readTime: 7,
        views: 1890,
        likes: 267,
        comments: 43,
        bookmarks: 89,
        isFeatured: false,
        isTrending: false,
        status: 'published'
    },
    {
        id: '6',
        title: 'Masterclass: Stage Lighting Techniques for Beginners',
        slug: 'stage-lighting-techniques-beginners',
        excerpt: 'A comprehensive guide to understanding and implementing professional stage lighting designs.',
        content: 'Lorem ipsum...',
        featuredImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        author: mockAuthors[1],
        categories: [mockCategories[4], mockCategories[2]],
        tags: ['lighting', 'techniques', 'tutorial'],
        publishedAt: '2024-03-03T13:00:00Z',
        readTime: 20,
        views: 3420,
        likes: 567,
        comments: 89,
        bookmarks: 234,
        isFeatured: false,
        isTrending: false,
        status: 'published'
    }
];

// Add more posts for demonstration
const allPosts = [...mockBlogPosts];
for (let i = 7; i <= 40; i++) {
    allPosts.push({
        ...mockBlogPosts[i % mockBlogPosts.length],
        id: i.toString(),
        title: `Theater Article ${i}: ${mockBlogPosts[i % mockBlogPosts.length].title.substring(0, 50)}`,
        slug: `theater-article-${i}`,
        isFeatured: false,
        isTrending: i % 4 === 0,
        publishedAt: `2024-03-${(i % 28) + 1}T10:00:00Z`,
        views: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
    });
}

const Blog = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<BlogPost[]>(allPosts);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(allPosts);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
    const [likedPosts, setLikedPosts] = useState<string[]>([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 12; // Changed to 12 for 4x3 grid (4 cards per row, 3 rows)

    // Filter and sort posts
    useEffect(() => {
        let filtered = [...posts];

        if (selectedCategory) {
            filtered = filtered.filter(post =>
                post.categories.some(cat => cat.id === selectedCategory)
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        filtered.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
            } else if (sortBy === 'popular') {
                return b.views - a.views;
            } else {
                return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
            }
        });

        setFilteredPosts(filtered);
        setCurrentPage(1);
    }, [posts, selectedCategory, searchQuery, sortBy]);

    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handleLike = (postId: string) => {
        if (likedPosts.includes(postId)) {
            setLikedPosts(likedPosts.filter(id => id !== postId));
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, likes: post.likes - 1 } : post
            ));
        } else {
            setLikedPosts([...likedPosts, postId]);
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            ));
        }
    };

    const handleBookmark = (postId: string) => {
        if (bookmarkedPosts.includes(postId)) {
            setBookmarkedPosts(bookmarkedPosts.filter(id => id !== postId));
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, bookmarks: post.bookmarks - 1 } : post
            ));
        } else {
            setBookmarkedPosts([...bookmarkedPosts, postId]);
            setPosts(posts.map(post =>
                post.id === postId ? { ...post, bookmarks: post.bookmarks + 1 } : post
            ));
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section with Search */}
            <section className="relative overflow-hidden bg-gradient-to-r from-deepTeal to-deepBlue w-full">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503095396549-8070c434c0a2?w=1600')] bg-cover bg-center opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
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
                            <div className="bg-white/20 backdrop-blur-lg rounded-full p-4">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Behind the Curtain
                        </h1>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Discover insights, interviews, and inspiration from the world of theater
                        </p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative max-w-2xl mx-auto"
                        >
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles, topics, or authors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Blog Content - Full Width with same container as hero */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12" >
                {/* Categories Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="flex flex-col items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Explore Topics</h2>

                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${!selectedCategory
                                    ? 'bg-deepTeal text-white shadow-md'
                                    : 'bg-deepTeal/10 text-deepTeal hover:bg-deepTeal hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-1.5">
                                    <Newspaper className="h-3.5 w-3.5" />
                                    <span>All</span>
                                </div>
                            </button>

                            {mockCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                                    className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                                        ? 'bg-deepTeal text-white shadow-md'
                                        : 'bg-deepTeal/10 text-deepTeal hover:bg-deepTeal hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-1.5">
                                        <category.icon className="h-3.5 w-3.5" />
                                        <span>{category.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Newspaper className="h-4 w-4" />
                            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                        </span>
                        {selectedCategory && (
                            <span className="px-2 py-1 bg-deepTeal/10 text-deepTeal rounded-lg text-xs flex items-center gap-1">
                                {mockCategories.find(c => c.id === selectedCategory)?.icon &&
                                    React.createElement(mockCategories.find(c => c.id === selectedCategory)?.icon as any, { className: "h-3 w-3" })}
                                {mockCategories.find(c => c.id === selectedCategory)?.name}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${viewMode === 'grid'
                                    ? 'text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-deepTeal'
                                    }`}
                            >
                                {viewMode === 'grid' && (
                                    <motion.div
                                        layoutId="viewMode"
                                        className="absolute inset-0 bg-deepTeal rounded-lg"
                                        transition={{ type: "spring", duration: 0.3 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <LayoutGrid className="h-4 w-4" />
                                    <span className="hidden sm:inline">Grid</span>
                                </span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${viewMode === 'list'
                                    ? 'text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-deepTeal'
                                    }`}
                            >
                                {viewMode === 'list' && (
                                    <motion.div
                                        layoutId="viewMode"
                                        className="absolute inset-0 bg-deepTeal rounded-lg"
                                        transition={{ type: "spring", duration: 0.3 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <List className="h-4 w-4" />
                                    <span className="hidden sm:inline">List</span>
                                </span>
                            </button>
                        </div>

                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-deepTeal cursor-pointer appearance-none pl-4 pr-10"
                            >
                                <option value="newest">📅 Newest First</option>
                                <option value="popular">🔥 Most Popular</option>
                                <option value="trending">⚡ Trending</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </motion.div>

                {/* Posts Grid - 4 cards per row */}
                <div className="relative">
                    {/* Left Chevron Navigation */}
                    {totalPages > 1 && currentPage > 1 && (
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-20 bg-deepTeal shadow-2xl rounded-full p-3 hover:bg-teal-700 transition-all duration-300 group border border-gray-200 dark:border-gray-700"
                            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        >
                            <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    )}

                    {/* Right Chevron Navigation */}
                    {totalPages > 1 && currentPage < totalPages && (
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-20 bg-deepTeal shadow-2xl rounded-full p-3 hover:bg-teal-700 transition-all duration-300 group border border-gray-200 dark:border-gray-700"
                            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        >
                            <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    )}

                    {/* Posts Grid/List - 4 cards per row on desktop */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-6'
                        }
                    >
                        <AnimatePresence mode="wait">
                            {currentPosts.map((post) => (
                                <motion.article
                                    key={post.id}
                                    variants={itemVariants}
                                    layout
                                    exit={{ opacity: 0, y: 20 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-deepTeal/20 ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                                        }`}
                                >
                                    {/* Image Container */}
                                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-72 h-56' : 'h-48'}`}>
                                        <img
                                            src={post.featuredImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {post.isTrending && (
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2 py-1 bg-gradient-to-r from-deepTeal to-deepBlue text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                                                    <TrendingUp className="h-3 w-3" />
                                                    Trending
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                                            <Link
                                                to={`/blog/${post.slug}`}
                                                className="text-white text-sm font-medium flex items-center gap-1 bg-deepTeal px-3 py-1.5 rounded-lg"
                                            >
                                                Read More <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col' : ''}`}>
                                        {/* Categories */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {post.categories.slice(0, 2).map((category) => (
                                                <button
                                                    key={category.id}
                                                    onClick={() => setSelectedCategory(category.id)}
                                                    className="px-2 py-0.5 bg-deepTeal/10 text-deepTeal text-xs rounded-lg hover:bg-deepTeal hover:text-white transition-all duration-300"
                                                >
                                                    {category.name}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Title */}
                                        <Link to={`/blog/${post.slug}`}>
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-deepTeal transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        {/* Excerpt - hidden on mobile for compact view */}
                                        <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm line-clamp-2 hidden sm:block">
                                            {post.excerpt}
                                        </p>

                                        {/* Author & Engagement - compact */}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1.5">
                                                <img
                                                    src={post.author.avatar}
                                                    alt={post.author.name}
                                                    className="w-6 h-6 rounded-full ring-1 ring-deepTeal/20"
                                                />
                                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px]">
                                                    {post.author.name.split(' ')[0]}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs transition-all duration-300 ${likedPosts.includes(post.id)
                                                        ? 'bg-error/10 text-error'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-error/10 hover:text-error'
                                                        }`}
                                                >
                                                    <ThumbsUp className={`h-3 w-3 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                                                    <span className="text-xs">{post.likes}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleBookmark(post.id)}
                                                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs transition-all duration-300 ${bookmarkedPosts.includes(post.id)
                                                        ? 'bg-deepTeal/10 text-deepTeal'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-deepTeal/10 hover:text-deepTeal'
                                                        }`}
                                                >
                                                    <Bookmark className={`h-3 w-3 ${bookmarkedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                                                    <span className="text-xs">{post.bookmarks}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Metadata - compact */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(post.publishedAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {post.readTime} min
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {post.views.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Page Indicator */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex gap-1 ml-4">
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
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-sm transition-all duration-300 ${currentPage === pageNum
                                            ? 'bg-deepTeal text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-deepTeal/20'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                            <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No articles found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Try adjusting your search or filter to find what you're looking for.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory(null);
                            }}
                            className="px-6 py-2.5 bg-gradient-to-r from-deepTeal to-deepBlue text-white rounded-xl font-medium hover:shadow-lg hover:shadow-deepTeal/30 transition-all duration-300"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Blog;