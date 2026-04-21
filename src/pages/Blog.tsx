// Frontend/src/pages/Blog.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Search, Calendar, Clock, Eye, TrendingUp,
    Heart, Bookmark, LayoutGrid, List, CheckCircle,
    ChevronDown, Star, Users, Zap, Lightbulb, HeartHandshake, Newspaper, X,
    ArrowRight, BookOpen, Sparkles, Filter, SortAsc, SortDesc, Theater,
    ChevronLeft, ChevronRight, MessageCircle, ChevronUp
} from 'lucide-react';
import BlogShowCard from '../components/UI/BlogShowCard';

// Types for Blog
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
    comments: number;
    isTrending: boolean;
    isFeatured?: boolean;
}

// Mock Data - Professional blog posts
const mockAuthors: Author[] = [
    { id: '1', name: 'Sarah Johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=007590&color=fff', role: 'Theater Critic' },
    { id: '2', name: 'Michael Chen', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=007590&color=fff', role: 'Technical Director' },
    { id: '3', name: 'Emma Rodriguez', avatar: 'https://ui-avatars.com/api/?name=Emma+Rodriguez&background=007590&color=fff', role: 'Arts Journalist' },
    { id: '4', name: 'David Kim', avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=007590&color=fff', role: 'Creative Director' },
    { id: '5', name: 'Lisa Wong', avatar: 'https://ui-avatars.com/api/?name=Lisa+Wong&background=007590&color=fff', role: 'Stage Designer' }
];

const mockCategories: Category[] = [
    { id: '1', name: 'News', icon: Newspaper, count: 24 },
    { id: '2', name: 'Reviews', icon: Star, count: 18 },
    { id: '3', name: 'Tech', icon: Zap, count: 12 },
    { id: '4', name: 'Interviews', icon: Users, count: 8 },
    { id: '5', name: 'Guides', icon: Lightbulb, count: 15 },
    { id: '6', name: 'Community', icon: HeartHandshake, count: 10 }
];

// Professional blog posts
const mockBlogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'The Art of Stage Design in Modern Theater',
        slug: 'art-of-stage-design',
        excerpt: 'Exploring the creative process behind bringing theatrical productions to life through innovative stage design and visual storytelling.',
        featuredImage: 'https://images.unsplash.com/photo-1503095396549-8070c434c0a2?w=800&auto=format&fit=crop',
        author: mockAuthors[0],
        categories: [mockCategories[2], mockCategories[0]],
        publishedAt: '2024-03-15T10:00:00Z',
        readTime: 8,
        views: 3450,
        likes: 234,
        bookmarks: 123,
        comments: 45,
        isTrending: true,
        isFeatured: true
    },
    {
        id: '2',
        title: 'Interview with Award-Winning Director',
        slug: 'director-interview',
        excerpt: 'An exclusive conversation with a Tony Award-winning director about their creative journey and vision for modern theater.',
        featuredImage: 'https://images.unsplash.com/photo-1507924538820-ede3a2f080d7?w=800&auto=format&fit=crop',
        author: mockAuthors[1],
        categories: [mockCategories[1], mockCategories[3]],
        publishedAt: '2024-03-12T14:30:00Z',
        readTime: 12,
        views: 2890,
        likes: 456,
        bookmarks: 234,
        comments: 67,
        isTrending: true,
        isFeatured: true
    },
    {
        id: '3',
        title: 'Sustainable Practices in Theater Production',
        slug: 'sustainable-theater',
        excerpt: 'How theaters are adopting eco-friendly practices to reduce their environmental impact while maintaining production quality.',
        featuredImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop',
        author: mockAuthors[2],
        categories: [mockCategories[0], mockCategories[5]],
        publishedAt: '2024-03-10T09:15:00Z',
        readTime: 7,
        views: 1890,
        likes: 267,
        bookmarks: 89,
        comments: 23,
        isTrending: false,
        isFeatured: false
    },
    {
        id: '4',
        title: 'Mastering Stage Lighting Techniques',
        slug: 'stage-lighting-techniques',
        excerpt: 'A comprehensive guide to professional stage lighting designs, equipment, and techniques for creating magical moments.',
        featuredImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop',
        author: mockAuthors[1],
        categories: [mockCategories[4], mockCategories[2]],
        publishedAt: '2024-03-05T11:20:00Z',
        readTime: 20,
        views: 3420,
        likes: 567,
        bookmarks: 234,
        comments: 89,
        isTrending: false,
        isFeatured: false
    },
    {
        id: '5',
        title: 'The Psychology of Audience Engagement',
        slug: 'audience-engagement',
        excerpt: 'Understanding what makes theater audiences connect with performances on an emotional and psychological level.',
        featuredImage: 'https://images.unsplash.com/photo-1507924538820-ede3a2f080d7?w=800&auto=format&fit=crop',
        author: mockAuthors[0],
        categories: [mockCategories[1], mockCategories[5]],
        publishedAt: '2024-02-28T10:00:00Z',
        readTime: 14,
        views: 2450,
        likes: 345,
        bookmarks: 156,
        comments: 56,
        isTrending: false,
        isFeatured: true
    },
    {
        id: '6',
        title: 'How Technology is Transforming Theater',
        slug: 'technology-transforming-theater',
        excerpt: 'From augmented reality to immersive sound, discover how cutting-edge technology is changing live performances forever.',
        featuredImage: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=800&auto=format&fit=crop',
        author: mockAuthors[1],
        categories: [mockCategories[2], mockCategories[0]],
        publishedAt: '2024-02-25T14:30:00Z',
        readTime: 11,
        views: 2890,
        likes: 423,
        bookmarks: 178,
        comments: 34,
        isTrending: true,
        isFeatured: false
    },
    {
        id: '7',
        title: 'The Art of Costume Design',
        slug: 'costume-design-art',
        excerpt: 'Exploring the creative process behind bringing characters to life through intricate costume design and fabric selection.',
        featuredImage: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&auto=format&fit=crop',
        author: mockAuthors[4],
        categories: [mockCategories[1], mockCategories[4]],
        publishedAt: '2024-02-20T09:00:00Z',
        readTime: 9,
        views: 2150,
        likes: 345,
        bookmarks: 156,
        comments: 28,
        isTrending: false,
        isFeatured: false
    },
    {
        id: '8',
        title: 'Inclusive Casting: A New Era',
        slug: 'inclusive-casting',
        excerpt: 'How theaters are embracing diversity and inclusion in casting decisions to create more representative storytelling.',
        featuredImage: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&auto=format&fit=crop',
        author: mockAuthors[0],
        categories: [mockCategories[0], mockCategories[5]],
        publishedAt: '2024-02-15T14:30:00Z',
        readTime: 12,
        views: 2980,
        likes: 567,
        bookmarks: 234,
        comments: 78,
        isTrending: true,
        isFeatured: true
    },
    {
        id: '9',
        title: 'The Business of Broadway Economics',
        slug: 'broadway-economics',
        excerpt: 'An in-depth analysis of the financial landscape of professional theater and what makes a production successful.',
        featuredImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
        author: mockAuthors[1],
        categories: [mockCategories[0], mockCategories[2]],
        publishedAt: '2024-02-10T10:00:00Z',
        readTime: 16,
        views: 3240,
        likes: 456,
        bookmarks: 234,
        comments: 45,
        isTrending: true,
        isFeatured: false
    },
    {
        id: '10',
        title: 'Reviving Classic Plays for Modern Audiences',
        slug: 'reviving-classic-plays',
        excerpt: 'How directors are reimagining timeless classics for today\'s viewers while preserving their original essence.',
        featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
        author: mockAuthors[2],
        categories: [mockCategories[1], mockCategories[4]],
        publishedAt: '2024-02-05T11:30:00Z',
        readTime: 11,
        views: 2450,
        likes: 345,
        bookmarks: 156,
        comments: 34,
        isTrending: false,
        isFeatured: true
    },
    {
        id: '11',
        title: 'The Magic of Puppetry in Modern Theater',
        slug: 'puppetry-modern-theater',
        excerpt: 'Exploring how puppetry is being reinvented for contemporary audiences with innovative techniques and storytelling.',
        featuredImage: 'https://images.unsplash.com/photo-1511193311914-034c8c8a8f16?w=800&auto=format&fit=crop',
        author: mockAuthors[4],
        categories: [mockCategories[1], mockCategories[5]],
        publishedAt: '2024-01-28T10:00:00Z',
        readTime: 10,
        views: 1870,
        likes: 234,
        bookmarks: 98,
        comments: 23,
        isTrending: false,
        isFeatured: false
    },
    {
        id: '12',
        title: 'Sound Design: The Unseen Hero',
        slug: 'sound-design-hero',
        excerpt: 'Behind the scenes of professional sound design and how it shapes the audience\'s emotional experience.',
        featuredImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
        author: mockAuthors[1],
        categories: [mockCategories[2], mockCategories[4]],
        publishedAt: '2024-01-20T14:30:00Z',
        readTime: 9,
        views: 2340,
        likes: 345,
        bookmarks: 123,
        comments: 31,
        isTrending: false,
        isFeatured: false
    }
];

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(mockBlogPosts);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const itemsPerPage = 12;

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    // Scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        let filtered = [...posts];

        if (selectedCategory) {
            filtered = filtered.filter(post =>
                post.categories.some(cat => cat.id === selectedCategory)
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query)
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

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleClearFilters = () => {
        setSelectedCategory(null);
        setSearchQuery('');
        setSortBy('newest');
    };

    const getGridClass = () => {
        if (viewMode === 'list') return 'grid-cols-1';
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-lg w-64 mb-8 mx-auto"></div>
                        <div className="h-8 bg-gray-200 rounded-lg w-96 mb-12 mx-auto"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Behind the Curtain
                        </h1>

                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Discover insights, interviews, and inspiration from the world of theater
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center">
                            <a
                                href="#blog-content"
                                className="group px-8 py-3 bg-white text-deepTeal rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                Explore Articles
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <Link
                                to="/theaters"
                                className="group px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                            >
                                <Theater className="h-5 w-5" />
                                Find Shows
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Blog Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12" id="blog-content">
                {/* Category Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap gap-3 justify-center mb-6">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                                !selectedCategory
                                    ? 'bg-gradient-to-r from-deepTeal to-deepBlue text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            <Sparkles className="h-4 w-4" />
                            <span>All</span>
                            <span className={`text-xs ${!selectedCategory ? 'text-white/80' : 'text-gray-400'}`}>
                                ({filteredPosts.length})
                            </span>
                        </button>
                        {mockCategories.map((category) => {
                            const Icon = category.icon;
                            const isActive = selectedCategory === category.id;
                            const count = filteredPosts.filter(p => p.categories.some(c => c.id === category.id)).length;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                                    className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-deepTeal to-deepBlue text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{category.name}</span>
                                    <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                        ({count})
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search and Controls */}
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-deepTeal focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-2 shadow-sm">
                            <SortAsc className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="text-sm text-gray-700 bg-transparent focus:outline-none"
                            >
                                <option value="newest">Newest</option>
                                <option value="popular">Most Popular</option>
                                <option value="trending">Trending</option>
                            </select>
                        </div>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 rounded-md text-sm transition ${viewMode === 'grid' ? 'bg-deepTeal text-white' : 'text-gray-600'}`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1.5 rounded-md text-sm transition ${viewMode === 'list' ? 'bg-deepTeal text-white' : 'text-gray-600'}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                        {(selectedCategory || searchQuery || sortBy !== 'newest') && (
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

                {/* Posts Grid - Using BlogShowCard */}
                {paginatedPosts.length > 0 ? (
                    <>
                        <div className={`grid gap-6 ${getGridClass()}`}>
                            {paginatedPosts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <BlogShowCard post={post} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <div className="flex gap-2">
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
                                                className={`w-10 h-10 rounded-lg font-medium transition ${
                                                    currentPage === pageNum
                                                        ? 'bg-deepTeal text-white shadow-md'
                                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <>
                                            <span className="w-10 h-10 flex items-center justify-center">...</span>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className="w-10 h-10 rounded-lg font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        {/* Showing info */}
                        <div className="text-center mt-6 text-sm text-gray-500">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredPosts.length)} of {filteredPosts.length} articles
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search or filter</p>
                        <button onClick={handleClearFilters} className="px-4 py-2 bg-deepTeal text-white rounded-lg">Clear all filters</button>
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