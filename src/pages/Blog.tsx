// Frontend/src/pages/Blog.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Search, Calendar, Clock, Eye, TrendingUp, ChevronRight,
    Heart, Bookmark, LayoutGrid, List, CheckCircle, Loader2, Plus,
    ChevronDown, Star, Users, Zap, Lightbulb, HeartHandshake, Newspaper, X,
    ArrowRight, BookOpen, Sparkles
} from 'lucide-react';
import ReusableButton from '../components/Reusable/ReusableButton';
import ShowCard from '../components/UI/ShowCard';

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
    isTrending: boolean;
}

// Convert BlogPost to Show format for ShowCard compatibility
const convertToShowFormat = (post: BlogPost) => {
    return {
        id: post.id,
        title: post.title,
        description: post.excerpt,
        genre: post.categories[0]?.name || 'Article',
        category: 'Blog',
        duration: post.readTime * 10,
        ageRating: 'All',
        venue: post.author.name,
        images: {
            poster: post.featuredImage,
            gallery: []
        },
        dates: [{ date: post.publishedAt, time: '10:00', availableSeats: 100, price: 0 }],
        priceRange: { min: 0, max: 0 },
        isFeatured: post.isTrending,
        rating: 4.5,
        reviews: post.views,
        isBlog: true
    };
};

// Mock Data
const mockAuthors: Author[] = [
    { id: '1', name: 'Sarah Johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=007590&color=fff', role: 'Theater Critic' },
    { id: '2', name: 'Michael Chen', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=007590&color=fff', role: 'Technical Director' },
    { id: '3', name: 'Emma Rodriguez', avatar: 'https://ui-avatars.com/api/?name=Emma+Rodriguez&background=007590&color=fff', role: 'Arts Journalist' }
];

const mockCategories: Category[] = [
    { id: '1', name: 'News', icon: Newspaper, count: 24 },
    { id: '2', name: 'Reviews', icon: Star, count: 18 },
    { id: '3', name: 'Tech', icon: Zap, count: 12 },
    { id: '4', name: 'Interviews', icon: Users, count: 8 },
    { id: '5', name: 'Guides', icon: Lightbulb, count: 15 },
    { id: '6', name: 'Community', icon: HeartHandshake, count: 10 }
];

const mockBlogPosts: BlogPost[] = [
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
        isTrending: true
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
        isTrending: true
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
        isTrending: true
    },
    {
        id: '4',
        title: 'Top 10 Theater Venues to Visit in 2024',
        slug: 'top-10-venues-2024',
        excerpt: 'Discover the must-visit performance spaces around the world.',
        featuredImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
        author: mockAuthors[0],
        categories: [mockCategories[4], mockCategories[5]],
        publishedAt: '2024-03-08T16:45:00Z',
        readTime: 15,
        views: 5670,
        likes: 892,
        bookmarks: 445,
        isTrending: false
    },
    {
        id: '5',
        title: 'Sustainable Theater: How Venues Are Going Green',
        slug: 'sustainable-theater',
        excerpt: 'Learn about innovative eco-friendly practices being adopted by theaters worldwide.',
        featuredImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        author: mockAuthors[1],
        categories: [mockCategories[0], mockCategories[5]],
        publishedAt: '2024-03-05T11:20:00Z',
        readTime: 7,
        views: 1890,
        likes: 267,
        bookmarks: 89,
        isTrending: false
    },
    {
        id: '6',
        title: 'Stage Lighting Techniques for Beginners',
        slug: 'stage-lighting-beginners',
        excerpt: 'A comprehensive guide to professional stage lighting designs.',
        featuredImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        author: mockAuthors[1],
        categories: [mockCategories[4], mockCategories[2]],
        publishedAt: '2024-03-03T13:00:00Z',
        readTime: 20,
        views: 3420,
        likes: 567,
        bookmarks: 234,
        isTrending: false
    }
];

// Generate more posts for load more
const generateMorePosts = (): BlogPost[] => {
    const morePosts: BlogPost[] = [];
    for (let i = 7; i <= 30; i++) {
        const basePost = mockBlogPosts[i % mockBlogPosts.length];
        morePosts.push({
            ...basePost,
            id: i.toString(),
            title: `${basePost.title} - Part ${Math.floor(i / 6) + 1}`,
            slug: `${basePost.slug}-${i}`,
            publishedAt: `2024-03-${(i % 28) + 1}T10:00:00Z`,
            views: Math.floor(Math.random() * 5000),
            likes: Math.floor(Math.random() * 500),
            bookmarks: Math.floor(Math.random() * 200),
            isTrending: i % 5 === 0,
        });
    }
    return morePosts;
};

const allPosts = [...mockBlogPosts, ...generateMorePosts()];

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>(allPosts);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(allPosts);
    const [displayedShows, setDisplayedShows] = useState<BlogPost[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
    const [visibleCount, setVisibleCount] = useState(6);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const itemsPerPage = 6;

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
        setVisibleCount(itemsPerPage);
    }, [posts, selectedCategory, searchQuery, sortBy]);

    useEffect(() => {
        setDisplayedShows(filteredPosts.slice(0, visibleCount));
    }, [filteredPosts, visibleCount]);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + itemsPerPage, filteredPosts.length));
            setIsLoadingMore(false);
        }, 500);
    };

    const handleClearFilters = () => {
        setSelectedCategory(null);
        setSearchQuery('');
        setSortBy('newest');
    };

    const hasMore = visibleCount < filteredPosts.length;
    const remainingItems = filteredPosts.length - visibleCount;
    const nextLoadAmount = Math.min(itemsPerPage, remainingItems);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-deepTeal to-deepBlue py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Behind the Curtain
                        </h1>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Discover insights, interviews, and inspiration from the world of theater
                        </p>
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory
                            ? 'bg-deepTeal text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All
                    </button>
                    {mockCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id
                                ? 'bg-deepTeal text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                    </div>
                    <div className="flex items-center gap-3">
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
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
                        >
                            <option value="newest">Newest</option>
                            <option value="popular">Most Popular</option>
                            <option value="trending">Trending</option>
                        </select>
                    </div>
                </div>

                {/* Posts Grid - Same as Home page (3 columns, 6 items initially) */}
                {displayedShows.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedShows.map((post) => (
                                <Link key={post.id} to={`/blog/${post.slug}`}>
                                    <ShowCard show={convertToShowFormat(post)} />
                                </Link>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center mt-12">
                                <ReusableButton
                                    variant="primary"
                                    onClick={handleLoadMore}
                                    isLoading={isLoadingMore}
                                    className="px-8 py-3 text-base min-w-[200px]"
                                >
                                    {isLoadingMore ? (
                                        <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Loading more articles...</>
                                    ) : (
                                        <><Plus className="h-5 w-5 mr-2" /> Load More ({nextLoadAmount} more)</>
                                    )}
                                </ReusableButton>
                            </div>
                        )}

                        {/* Progress Indicator */}
                        {hasMore && (
                            <div className="mt-6 text-center">
                                <div className="text-sm text-gray-500">
                                    {visibleCount} of {filteredPosts.length} articles loaded
                                </div>
                                <div className="w-48 h-1 bg-gray-200 rounded-full mt-2 mx-auto overflow-hidden">
                                    <div
                                        className="h-full bg-deepTeal rounded-full transition-all"
                                        style={{ width: `${(visibleCount / filteredPosts.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Completion Message */}
                        {!hasMore && filteredPosts.length > 0 && (
                            <div className="text-center mt-12 p-6 bg-gray-50 rounded-xl">
                                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-gray-600">You've seen all {filteredPosts.length} articles!</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search or filter</p>
                        <button onClick={handleClearFilters} className="px-4 py-2 bg-deepTeal text-white rounded-lg">Clear all filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;