import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, User, Eye, Heart, MessageCircle, Share2,
    Bookmark, ArrowRight, Search, Filter, ChevronRight, ChevronLeft,
    TrendingUp, Award, Star, Music, Film, Camera, Mic, Speaker,
    Tag, Facebook, Twitter, Linkedin, Link as LinkIcon,
    Play, Quote, Sparkles, Newspaper, PenTool, Video, Image,
    Headphones, Globe, Users, Building, Ticket, Crown,
    Mail // ← This was missing - FIXED
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Types
interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: {
        name: string;
        avatar: string;
        role: string;
    };
    date: string;
    readTime: number;
    category: string;
    tags: string[];
    views: number;
    likes: number;
    comments: number;
    featured: boolean;
    trending: boolean;
    relatedPosts?: number[];
}

// Popular Tags Data
const popularTags = [
    { name: 'Ethiopian Theater', count: 12 },
    { name: 'Musical', count: 8 },
    { name: 'Reviews', count: 15 },
    { name: 'Interviews', count: 6 },
    { name: 'Behind the Scenes', count: 4 },
    { name: 'Technology', count: 5 },
    { name: 'Culture', count: 10 },
    { name: 'Events', count: 7 }
];

// Trending Topics
const trendingTopics = [
    'The Lion King',
    'Hamilton Ethiopia',
    'Digital Ticketing',
    'Ethiopian Artists',
    'Theater Technology'
];

const Blog: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
    const [newsletterEmail, setNewsletterEmail] = useState<string>('');
    const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const itemsPerPage = 6;

    // Categories
    const categories = [
        { id: 'all', name: 'All Posts', count: 24, icon: Newspaper },
        { id: 'reviews', name: 'Show Reviews', count: 8, icon: Star },
        { id: 'news', name: 'Theater News', count: 6, icon: Globe },
        { id: 'interviews', name: 'Artist Interviews', count: 4, icon: Mic },
        { id: 'tips', name: 'Tips & Guides', count: 3, icon: PenTool },
        { id: 'behind', name: 'Behind the Scenes', count: 2, icon: Camera },
        { id: 'events', name: 'Events', count: 1, icon: Calendar }
    ];

    // Blog Posts Data
    const blogPosts: BlogPost[] = [
        {
            id: 1,
            title: "The Rise of Ethiopian Theater: A Cultural Renaissance",
            excerpt: "Explore how Ethiopian theater is experiencing a remarkable revival, blending traditional storytelling with contemporary themes. From Addis Ababa to regional cities, discover the vibrant movement reshaping the performing arts scene.",
            content: "",
            image: "https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=800&h=500&fit=crop",
            author: {
                name: "Birehanu Kassa",
                avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
                role: "Cultural Critic"
            },
            date: "2024-03-15",
            readTime: 8,
            category: "news",
            tags: ["Ethiopian Theater", "Culture", "Renaissance"],
            views: 3420,
            likes: 245,
            comments: 48,
            featured: true,
            trending: true
        },
        {
            id: 2,
            title: "The Lion King: A Spectacular Stage Adaptation Review",
            excerpt: "A comprehensive review of the highly anticipated stage adaptation of Disney's The Lion King, now playing at Grand National Theater. Discover the magic behind the costumes, music, and performances.",
            content: "",
            image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=500&fit=crop",
            author: {
                name: "Gebreslassie Dessie",
                avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
                role: "Theater Critic"
            },
            date: "2024-03-10",
            readTime: 6,
            category: "reviews",
            tags: ["Review", "The Lion King", "Musical"],
            views: 2850,
            likes: 189,
            comments: 32,
            featured: true,
            trending: true
        },
        {
            id: 3,
            title: "Behind the Scenes: Creating the Magic of Hamilton",
            excerpt: "An exclusive look at the making of Hamilton in Ethiopia, featuring interviews with the cast and creative team. Learn about the challenges and triumphs of bringing this Broadway hit to Ethiopian audiences.",
            content: "",
            image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=500&fit=crop",
            author: {
                name: "Gemechis Debelo",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                role: "Backstage Correspondent"
            },
            date: "2024-03-05",
            readTime: 10,
            category: "behind",
            tags: ["Behind the Scenes", "Hamilton", "Production"],
            views: 1890,
            likes: 156,
            comments: 23,
            featured: false,
            trending: true
        },
        {
            id: 4,
            title: "10 Tips for First-Time Theater Goers",
            excerpt: "Planning to attend your first theater show? Here's everything you need to know for an unforgettable experience. From etiquette to choosing the best seats, we've got you covered.",
            content: "",
            image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=500&fit=crop",
            author: {
                name: "Lelisa Abreham",
                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
                role: "Theater Guide"
            },
            date: "2024-02-28",
            readTime: 5,
            category: "tips",
            tags: ["Tips", "First Time", "Guide"],
            views: 4230,
            likes: 312,
            comments: 67,
            featured: false,
            trending: false
        },
        {
            id: 5,
            title: "Interview with Alemitu Bekele: Ethiopia's Rising Star",
            excerpt: "In-depth conversation with the acclaimed actress about her journey, challenges, and vision for Ethiopian theater. Discover what inspires her and what's next for this talented performer.",
            content: "",
            image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=500&fit=crop",
            author: {
                name: "Birehanu Kassa",
                avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
                role: "Cultural Critic"
            },
            date: "2024-02-20",
            readTime: 12,
            category: "interviews",
            tags: ["Interview", "Actor", "Rising Star"],
            views: 1560,
            likes: 178,
            comments: 45,
            featured: true,
            trending: false
        },
        {
            id: 6,
            title: "The Future of Digital Ticketing in Ethiopian Theaters",
            excerpt: "How technology is transforming the way we book and experience theater performances across the country. Explore the benefits of digital ticketing and what it means for theater lovers.",
            content: "",
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop",
            author: {
                name: "Gebreslassie Dessie",
                avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
                role: "Tech Editor"
            },
            date: "2024-02-15",
            readTime: 7,
            category: "news",
            tags: ["Technology", "Digital", "Ticketing"],
            views: 2340,
            likes: 198,
            comments: 34,
            featured: false,
            trending: true
        }
    ];

    // Filter and sort posts
    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort posts
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortBy === 'latest') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (sortBy === 'popular') {
            return b.views - a.views;
        } else {
            return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPosts = sortedPosts.slice(startIndex, startIndex + itemsPerPage);

    // Featured posts
    const featuredPosts = blogPosts.filter(p => p.featured);
    const trendingPosts = blogPosts.filter(p => p.trending);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const handleNewsletterSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        setNewsletterStatus('loading');

        // Simulate API call
        setTimeout(() => {
            if (newsletterEmail.includes('@') && newsletterEmail.includes('.')) {
                setNewsletterStatus('success');
                setNewsletterEmail('');
                setTimeout(() => setNewsletterStatus('idle'), 3000);
            } else {
                setNewsletterStatus('error');
                setTimeout(() => setNewsletterStatus('idle'), 3000);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-deepTeal via-deepBlue to-deepTeal text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6"
                        >
                            <PenTool className="h-5 w-5" />
                            <span className="text-sm font-medium">Theater Stories</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            Theater Stories & Insights
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-white/90 mb-8"
                        >
                            Discover the latest news, reviews, and behind-the-scenes stories from Ethiopia's vibrant theater scene
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative max-w-2xl mx-auto"
                        >
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search articles, reviews, or topics..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white shadow-lg"
                            />
                        </motion.div>

                        {/* Trending Topics */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-2 justify-center mt-6"
                        >
                            {trendingTopics.map((topic, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSearchQuery(topic)}
                                    className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm hover:bg-white/30 transition-colors"
                                >
                                    {topic}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* Categories Filter - Scrollable on mobile */}
                        <div className="mb-8 overflow-x-auto pb-2">
                            <div className="flex gap-2 min-w-max">
                                {categories.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => {
                                                setSelectedCategory(category.id);
                                                setCurrentPage(1);
                                            }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${selectedCategory === category.id
                                                    ? 'bg-deepTeal text-white shadow-lg shadow-deepTeal/30'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span>{category.name}</span>
                                            <span className={`text-xs ${selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'
                                                }`}>
                                                ({category.count})
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-semibold text-deepTeal">{paginatedPosts.length}</span> of{' '}
                                <span className="font-semibold text-deepTeal">{sortedPosts.length}</span> articles
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                                    aria-label="Toggle view mode"
                                >
                                    {viewMode === 'grid' ? (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    )}
                                </button>
                                <div className="flex gap-1">
                                    {[
                                        { id: 'latest', label: 'Latest' },
                                        { id: 'popular', label: 'Popular' },
                                        { id: 'trending', label: 'Trending' }
                                    ].map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setSortBy(option.id as any)}
                                            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${sortBy === option.id
                                                    ? 'bg-deepTeal text-white'
                                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Blog Posts Grid/List */}
                        {paginatedPosts.length > 0 ? (
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                                : 'space-y-6'
                            }>
                                {paginatedPosts.map((post, index) => (
                                    <motion.article
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (index % itemsPerPage) * 0.05 }}
                                        className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all group ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                                            }`}
                                    >
                                        {/* Image */}
                                        <div className={viewMode === 'list' ? 'md:w-64 h-48 md:h-auto flex-shrink-0 relative' : 'relative h-48'}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {post.trending && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3" /> Trending
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                <span className="text-xs font-medium text-deepTeal bg-deepTeal/10 px-2 py-1 rounded-full">
                                                    {categories.find(c => c.id === post.category)?.name}
                                                </span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock className="h-3 w-3" />
                                                    {post.readTime} min read
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-deepTeal transition-colors line-clamp-2">
                                                <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                            </h3>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={post.author.avatar}
                                                        alt={post.author.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-900">{post.author.name}</p>
                                                        <p className="text-[10px] text-gray-500">{formatDate(post.date)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Eye className="h-3 w-3" />
                                                        {post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Heart className="h-3 w-3" />
                                                        {post.likes}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <MessageCircle className="h-3 w-3" />
                                                        {post.comments}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                                <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    {getPageNumbers().map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${currentPage === page
                                                    ? 'bg-deepTeal text-white shadow-lg shadow-deepTeal/30'
                                                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Trending Posts */}
                        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-red-500" />
                                Trending Now
                            </h3>
                            <div className="space-y-4">
                                {trendingPosts.slice(0, 5).map((post, index) => (
                                    <Link
                                        key={post.id}
                                        to={`/blog/${post.id}`}
                                        className="flex items-start gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                    >
                                        <span className="text-2xl font-bold text-gray-300 group-hover:text-deepTeal transition-colors">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-deepTeal transition-colors line-clamp-2">
                                                {post.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(post.date)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Popular Tags */}
                        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Tag className="h-5 w-5 text-deepTeal" />
                                Popular Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map((tag, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSearchQuery(tag.name)}
                                        className="px-3 py-1.5 bg-gray-100 hover:bg-deepTeal hover:text-white rounded-full text-xs font-medium transition-colors"
                                    >
                                        {tag.name} ({tag.count})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-gradient-to-br from-deepTeal/10 to-deepBlue/10 rounded-2xl p-5 border border-deepTeal/20">
                            <Mail className="h-10 w-10 text-deepTeal mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                                Subscribe to Newsletter
                            </h3>
                            <p className="text-sm text-gray-600 text-center mb-4">
                                Get the latest theater news delivered to your inbox
                            </p>
                            <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-deepTeal focus:border-transparent outline-none"
                                    disabled={newsletterStatus === 'loading'}
                                />
                                <button
                                    type="submit"
                                    disabled={newsletterStatus === 'loading'}
                                    className="w-full bg-deepTeal text-white py-2 rounded-xl font-semibold hover:bg-deepTeal/90 transition-all disabled:opacity-50"
                                >
                                    {newsletterStatus === 'loading' ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Subscribing...
                                        </div>
                                    ) : newsletterStatus === 'success' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            ✓ Subscribed!
                                        </span>
                                    ) : newsletterStatus === 'error' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            ❌ Try again
                                        </span>
                                    ) : (
                                        'Subscribe'
                                    )}
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 text-center mt-3">
                                No spam, unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;