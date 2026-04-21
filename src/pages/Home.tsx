// src/pages/Home.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    MapPin,
    Star,
    Filter,
    Search,
    Ticket,
    ChevronDown,
    Sparkles,
    TrendingUp,
    Award,
    Eye,
    SlidersHorizontal,
    ChevronRight,
    ChevronLeft,
    SortAsc,
    SortDesc,
    Crown,
    Gift,
    CheckCircle,
    Plus,
    PlayCircle,
    CalendarDays,
    Flame,
    Zap,
    Heart,
    Shield,
    Users,
    Music,
    Theater,
    Gem,
    Home as HomeIcon,
    Compass,
    Calendar as CalendarIcon,
    User,
    ShoppingBag,
    Menu,
    X,
    ChevronUp
} from 'lucide-react';
import HeroBanner from '../components/UI/HeroBanner';
import ShowCard from '../components/UI/ShowCard';
import ShowFilter from '../components/UI/ShowFilter';
import { Link, useLocation } from 'react-router-dom';

// ============================================
// TYPES
// ============================================

export interface ShowDate {
    date: string;
    time: string;
    availableSeats: number;
    price?: number;
}

export interface Show {
    id: string;
    title: string;
    description: string;
    genre: string;
    category: string;
    duration: number;
    ageRating: string;
    venue: string;
    director?: string;
    cast?: string[];
    images: {
        poster: string;
        gallery: string[];
    };
    dates: ShowDate[];
    priceRange: {
        min: number;
        max: number;
    };
    status: 'now-showing' | 'upcoming';
    isFeatured: boolean;
    rating?: number;
    reviews?: number;
    viewCount?: number;
}

// ============================================
// MOCK DATA
// ============================================

const showsData: Show[] = [
    {
        id: '1',
        title: 'Hamilton',
        description: 'The story of America\'s Founding Father Alexander Hamilton.',
        genre: 'Musical',
        category: 'Broadway',
        duration: 160,
        ageRating: 'PG-13',
        venue: 'Richard Rodgers Theatre',
        director: 'Thomas Kail',
        cast: ['Lin-Manuel Miranda', 'Leslie Odom Jr.', 'Phillipa Soo'],
        images: {
            poster: 'https://images.unsplash.com/photo-1511193311914-034c8c8a8f16?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-04-05', time: '19:30', availableSeats: 45, price: 599 },
            { date: '2024-04-06', time: '14:00', availableSeats: 12, price: 599 },
            { date: '2024-04-07', time: '19:30', availableSeats: 89, price: 599 }
        ],
        priceRange: { min: 599, max: 1499 },
        status: 'now-showing',
        isFeatured: true,
        rating: 4.9,
        reviews: 1280,
        viewCount: 1250
    },
    {
        id: '2',
        title: 'The Lion King',
        description: 'Disney\'s beloved film comes to life on stage.',
        genre: 'Musical',
        category: 'Broadway',
        duration: 150,
        ageRating: 'G',
        venue: 'Minskoff Theatre',
        director: 'Julie Taymor',
        cast: ['L. Steven Taylor', 'Brandon A. McCall', 'Adrienne Walker'],
        images: {
            poster: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-04-08', time: '19:30', availableSeats: 67, price: 399 },
            { date: '2024-04-09', time: '14:00', availableSeats: 89, price: 399 },
            { date: '2024-04-10', time: '19:30', availableSeats: 34, price: 399 }
        ],
        priceRange: { min: 399, max: 999 },
        status: 'now-showing',
        isFeatured: true,
        rating: 4.8,
        reviews: 2150,
        viewCount: 980
    },
    {
        id: '3',
        title: 'Swan Lake',
        description: 'Tchaikovsky\'s classic ballet of tragic romance.',
        genre: 'Ballet',
        category: 'Touring',
        duration: 135,
        ageRating: 'PG',
        venue: 'Royal Opera House',
        director: 'Marius Petipa',
        cast: ['Natalia Osipova', 'Sergei Polunin'],
        images: {
            poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-04-15', time: '19:00', availableSeats: 23, price: 299 },
            { date: '2024-04-16', time: '14:30', availableSeats: 45, price: 299 }
        ],
        priceRange: { min: 299, max: 599 },
        status: 'upcoming',
        isFeatured: false,
        rating: 4.9,
        reviews: 890,
        viewCount: 450
    },
    {
        id: '4',
        title: 'The Book of Mormon',
        description: 'A satirical religious musical.',
        genre: 'Comedy',
        category: 'West End',
        duration: 155,
        ageRating: 'R',
        venue: 'Prince of Wales Theatre',
        cast: ['Andrew Rannells', 'Josh Gad'],
        images: {
            poster: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-04-10', time: '20:00', availableSeats: 15, price: 349 },
            { date: '2024-04-11', time: '19:30', availableSeats: 32, price: 349 }
        ],
        priceRange: { min: 349, max: 799 },
        status: 'now-showing',
        isFeatured: false,
        rating: 4.6,
        reviews: 1780,
        viewCount: 560
    },
    {
        id: '5',
        title: 'Romeo and Juliet',
        description: 'Shakespeare\'s timeless tragedy.',
        genre: 'Drama',
        category: 'Local',
        duration: 140,
        ageRating: 'PG-13',
        venue: 'City Arts Theatre',
        director: 'Sarah Johnson',
        cast: ['James Smith', 'Emma Watson'],
        images: {
            poster: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-04-20', time: '19:30', availableSeats: 156, price: 199 },
            { date: '2024-04-21', time: '14:00', availableSeats: 203, price: 199 }
        ],
        priceRange: { min: 199, max: 399 },
        status: 'upcoming',
        isFeatured: true,
        rating: 4.4,
        reviews: 230,
        viewCount: 320
    },
    {
        id: '6',
        title: 'La Bohème',
        description: 'Puccini\'s passionate opera.',
        genre: 'Opera',
        category: 'Special Event',
        duration: 165,
        ageRating: 'PG',
        venue: 'Metropolitan Opera House',
        cast: ['Anna Netrebko', 'Rolando Villazón'],
        images: {
            poster: 'https://images.unsplash.com/photo-1572700432885-19bb32ea6b3c?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-05-05', time: '19:00', availableSeats: 89, price: 450 },
            { date: '2024-05-06', time: '19:00', availableSeats: 67, price: 450 }
        ],
        priceRange: { min: 450, max: 899 },
        status: 'upcoming',
        isFeatured: false,
        rating: 4.8,
        reviews: 670,
        viewCount: 280
    },
    {
        id: '7',
        title: 'Wicked',
        description: 'The untold story of the witches of Oz.',
        genre: 'Musical',
        category: 'Broadway',
        duration: 165,
        ageRating: 'PG',
        venue: 'Gershwin Theatre',
        cast: ['Idina Menzel', 'Kristin Chenoweth'],
        images: {
            poster: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-04-12', time: '19:30', availableSeats: 34, price: 499 },
            { date: '2024-04-13', time: '14:00', availableSeats: 56, price: 499 }
        ],
        priceRange: { min: 499, max: 1199 },
        status: 'now-showing',
        isFeatured: true,
        rating: 4.9,
        reviews: 2450,
        viewCount: 2100
    },
    {
        id: '8',
        title: 'Les Misérables',
        description: 'The world\'s longest-running musical.',
        genre: 'Musical',
        category: 'West End',
        duration: 175,
        ageRating: 'PG-13',
        venue: 'Queen\'s Theatre',
        cast: ['Alfie Boe', 'Ramin Karimloo'],
        images: {
            poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-05-10', time: '19:30', availableSeats: 78, price: 549 },
            { date: '2024-05-11', time: '14:30', availableSeats: 92, price: 549 }
        ],
        priceRange: { min: 549, max: 1299 },
        status: 'upcoming',
        isFeatured: false,
        rating: 4.8,
        reviews: 1890,
        viewCount: 890
    },
    {
        id: '9',
        title: 'Chicago',
        description: 'The award-winning musical about murder, greed, and all that jazz.',
        genre: 'Musical',
        category: 'Broadway',
        duration: 150,
        ageRating: 'PG-13',
        venue: 'Ambassador Theatre',
        cast: ['Bebe Neuwirth', 'Ann Reinking'],
        images: {
            poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-04-14', time: '20:00', availableSeats: 45, price: 399 },
            { date: '2024-04-15', time: '20:00', availableSeats: 67, price: 399 }
        ],
        priceRange: { min: 399, max: 899 },
        status: 'now-showing',
        isFeatured: false,
        rating: 4.6,
        reviews: 1560,
        viewCount: 670
    },
    {
        id: '10',
        title: 'The Phantom of the Opera',
        description: 'The longest-running Broadway show in history.',
        genre: 'Musical',
        category: 'Broadway',
        duration: 155,
        ageRating: 'PG',
        venue: 'Majestic Theatre',
        cast: ['Ramin Karimloo', 'Sierra Boggess'],
        images: {
            poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-04-18', time: '19:30', availableSeats: 23, price: 599 },
            { date: '2024-04-19', time: '14:00', availableSeats: 45, price: 599 }
        ],
        priceRange: { min: 599, max: 1499 },
        status: 'now-showing',
        isFeatured: true,
        rating: 4.9,
        reviews: 3120,
        viewCount: 1850
    },
    {
        id: '11',
        title: 'Mamma Mia!',
        description: 'The feel-good musical based on the songs of ABBA.',
        genre: 'Musical',
        category: 'Broadway',
        duration: 145,
        ageRating: 'PG',
        venue: 'Winter Garden Theatre',
        cast: ['Louise Pitre', 'Tina Maddigan'],
        images: {
            poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-05-20', time: '19:30', availableSeats: 67, price: 349 },
            { date: '2024-05-21', time: '14:00', availableSeats: 89, price: 349 }
        ],
        priceRange: { min: 349, max: 799 },
        status: 'upcoming',
        isFeatured: false,
        rating: 4.5,
        reviews: 980,
        viewCount: 340
    },
    {
        id: '12',
        title: 'Dear Evan Hansen',
        description: 'A powerful musical about a high school student\'s journey of self-discovery.',
        genre: 'Musical',
        category: 'Broadway',
        duration: 155,
        ageRating: 'PG-13',
        venue: 'Music Box Theatre',
        cast: ['Ben Platt', 'Laura Dreyfuss'],
        images: {
            poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-05-25', time: '19:30', availableSeats: 34, price: 449 },
            { date: '2024-05-26', time: '14:00', availableSeats: 56, price: 449 }
        ],
        priceRange: { min: 449, max: 1099 },
        status: 'upcoming',
        isFeatured: true,
        rating: 4.7,
        reviews: 1450,
        viewCount: 520
    }
];

const categories = ['All', 'Musical', 'Ballet', 'Opera', 'Comedy', 'Drama'];

// Sort options
const sortOptions = [
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'name', label: 'Name', icon: SortAsc },
    { value: 'price-low', label: 'Price: Low to High', icon: SortAsc },
    { value: 'price-high', label: 'Price: High to Low', icon: SortDesc },
    { value: 'rating', label: 'Rating', icon: Star },
];

// Items per page for load more - load 6 items per click
const ITEMS_PER_PAGE = 6;

// ============================================
// HOME PAGE COMPONENT
// ============================================

const Home: React.FC = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [filteredShows, setFilteredShows] = useState<Show[]>([]);
    const [displayedShows, setDisplayedShows] = useState<Show[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [showFilters, setShowFilters] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [hasMore, setHasMore] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showMostPopularAll, setShowMostPopularAll] = useState(false);
    const [showFeaturedAll, setShowFeaturedAll] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Load data immediately (no loading delay)
    useEffect(() => {
        const sortedShows = [...showsData].sort((a, b) => {
            const dateA = a.dates?.[0]?.date ? new Date(a.dates[0].date).getTime() : 0;
            const dateB = b.dates?.[0]?.date ? new Date(b.dates[0].date).getTime() : 0;
            return dateB - dateA;
        });
        setShows(sortedShows);
        setFilteredShows(sortedShows);
    }, []);

    // Infinite scroll observer
    useEffect(() => {
        if (!hasMore || isLoadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    handleLoadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoadingMore, displayedShows.length]);

    // Filter and sort shows
    useEffect(() => {
        let results = [...shows];

        if (selectedCategory !== 'All') {
            results = results.filter(show => show.genre === selectedCategory);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(show =>
                show.title.toLowerCase().includes(query) ||
                show.description.toLowerCase().includes(query) ||
                show.venue.toLowerCase().includes(query) ||
                show.cast?.some(actor => actor.toLowerCase().includes(query))
            );
        }

        results.sort((a, b) => {
            switch (sortBy) {
                case 'date': {
                    const dateA = a.dates?.[0]?.date ? new Date(a.dates[0].date).getTime() : 0;
                    const dateB = b.dates?.[0]?.date ? new Date(b.dates[0].date).getTime() : 0;
                    return dateB - dateA;
                }
                case 'price-low':
                    return (a.priceRange?.min || 0) - (b.priceRange?.min || 0);
                case 'price-high':
                    return (b.priceRange?.max || 0) - (a.priceRange?.max || 0);
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'name':
                    return (a.title || '').localeCompare(b.title || '');
                default:
                    return 0;
            }
        });

        setFilteredShows(results);
        setVisibleCount(ITEMS_PER_PAGE);
        setHasMore(results.length > ITEMS_PER_PAGE);
    }, [selectedCategory, searchQuery, sortBy, shows]);

    // Update displayed shows
    useEffect(() => {
        const newDisplayedShows = filteredShows.slice(0, visibleCount);
        setDisplayedShows(newDisplayedShows);
        setHasMore(visibleCount < filteredShows.length);
    }, [filteredShows, visibleCount]);

    const handleLoadMore = () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        setTimeout(() => {
            const newVisibleCount = Math.min(visibleCount + ITEMS_PER_PAGE, filteredShows.length);
            setVisibleCount(newVisibleCount);
            setIsLoadingMore(false);
        }, 800);
    };

    const handleClearFilters = () => {
        setSelectedCategory('All');
        setSearchQuery('');
        setSortBy('date');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            console.log('Searching for:', searchQuery);
        }
    };

    const getCurrentSortLabel = () => {
        const option = sortOptions.find(opt => opt.value === sortBy);
        return option ? option.label : 'Sort by';
    };

    // Get most viewed shows (top 4 or all if showAll)
    const getMostViewedShows = () => {
        const sorted = [...shows].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        return showMostPopularAll ? sorted : sorted.slice(0, 4);
    };

    // Get featured shows (top 4 or all if showAll)
    const getFeaturedShows = () => {
        const featured = shows.filter(show => show.isFeatured);
        return showFeaturedAll ? featured : featured.slice(0, 4);
    };

    // Scroll to top button visibility
    const [showScrollTop, setShowScrollTop] = useState(false);

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

    // Handle View All click for Most Popular
    const handleViewAllMostPopular = () => {
        setShowMostPopularAll(true);
        setTimeout(() => {
            document.getElementById('most-popular-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // Handle View All click for Featured Picks
    const handleViewAllFeatured = () => {
        setShowFeaturedAll(true);
        setTimeout(() => {
            document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const mostViewedShows = getMostViewedShows();
    const featuredShows = getFeaturedShows();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pb-20">
            {/* Hero Banner */}
            <HeroBanner featuredShows={shows.filter(show => show.isFeatured)} />

            <div className="container mx-auto px-4 py-12">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome to <span className="text-deepTeal">Theatre Hub Ethiopia</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Experience the best of Ethiopian and international theatre, musicals, and performances
                    </p>
                </motion.div>

                {/* Search & Filter Section */}
                <div className="mb-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search for shows, venues, artists, or descriptions..."
                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent dark:text-white placeholder:text-gray-400 shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>

                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="w-full sm:w-48 px-4 py-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors shadow-sm flex items-center justify-between gap-2"
                                >
                                    <span className="truncate">{getCurrentSortLabel()}</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isSortOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 sm:left-0 mt-2 w-full sm:w-64 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 z-50 overflow-hidden"
                                        >
                                            {sortOptions.map((option) => {
                                                const Icon = option.icon;
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => {
                                                            setSortBy(option.value);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center gap-3 ${sortBy === option.value
                                                                ? 'bg-deepTeal/10 text-deepTeal'
                                                                : 'text-gray-700 dark:text-gray-300'
                                                            }`}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                        <span className="flex-1">{option.label}</span>
                                                        {sortBy === option.value && (
                                                            <CheckCircle className="h-4 w-4 text-deepTeal" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-6 py-4 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap ${showFilters
                                        ? 'bg-deepTeal text-white'
                                        : 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                                    }`}
                            >
                                <Filter className="h-5 w-5" />
                                <span>Filters</span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Active Filter Indicator */}
                        {(selectedCategory !== 'All' || searchQuery) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between bg-deepTeal/5 rounded-lg p-3"
                            >
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-deepTeal">Active filters:</span>
                                    {selectedCategory !== 'All' && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-deepTeal/10 text-deepTeal rounded-full text-sm">
                                            Category: {selectedCategory}
                                        </span>
                                    )}
                                    {searchQuery && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm">
                                            "{searchQuery}"
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleClearFilters}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                                >
                                    Clear All
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mb-8"
                        >
                            <ShowFilter
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                onClearFilters={handleClearFilters}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MOST POPULAR SECTION */}
                {mostViewedShows.length > 0 && (
                    <section id="most-popular-section" className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                    <Heart className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Most Popular
                                </h2>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-sm font-medium">
                                    Fan Favorites
                                </span>
                            </div>
                            {!showMostPopularAll && mostViewedShows.length >= 4 && (
                                <button
                                    onClick={handleViewAllMostPopular}
                                    className="text-deepTeal hover:text-deepTeal/80 text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    View All <ChevronRight className="h-4 w-4" />
                                </button>
                            )}
                            {showMostPopularAll && (
                                <button
                                    onClick={() => setShowMostPopularAll(false)}
                                    className="text-deepTeal hover:text-deepTeal/80 text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    Show Less <ChevronRight className="h-4 w-4 rotate-90" />
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {mostViewedShows.map((show) => (
                                <ShowCard key={show.id} show={show} compact={true} />
                            ))}
                        </div>
                    </section>
                )}

                {/* FEATURED PICKS SECTION */}
                {featuredShows.length > 0 && (
                    <section id="featured-section" className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                                    <Crown className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Featured Picks
                                </h2>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-sm font-medium">
                                    Editor's Choice
                                </span>
                            </div>
                            {!showFeaturedAll && featuredShows.length >= 4 && (
                                <button
                                    onClick={handleViewAllFeatured}
                                    className="text-deepTeal hover:text-deepTeal/80 text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    View All <ChevronRight className="h-4 w-4" />
                                </button>
                            )}
                            {showFeaturedAll && (
                                <button
                                    onClick={() => setShowFeaturedAll(false)}
                                    className="text-deepTeal hover:text-deepTeal/80 text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    Show Less <ChevronRight className="h-4 w-4 rotate-90" />
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredShows.map((show) => (
                                <ShowCard key={show.id} show={show} compact={true} />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Shows Grid */}
                {displayedShows.length > 0 ? (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    All Shows
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Showing {displayedShows.length} of {filteredShows.length} shows
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedShows.map((show, index) => (
                                <motion.div
                                    key={show.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ShowCard show={show} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Infinite Scroll Loader - Skeleton Cards */}
                        {hasMore && (
                            <div ref={loadMoreRef} className="mt-8">
                                {isLoadingMore && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                                                <div className="h-56 bg-gray-200 dark:bg-dark-700"></div>
                                                <div className="p-4">
                                                    <div className="h-5 bg-gray-200 dark:bg-dark-700 rounded w-3/4 mb-2"></div>
                                                    <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/2 mb-3"></div>
                                                    <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full mb-3"></div>
                                                    <div className="h-9 bg-gray-200 dark:bg-dark-700 rounded-lg w-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Completion message */}
                        {!hasMore && filteredShows.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center mt-12 p-6 bg-gray-50 dark:bg-dark-800 rounded-xl"
                            >
                                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    You've seen all {filteredShows.length} shows!
                                </p>
                            </motion.div>
                        )}
                    </section>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 dark:bg-dark-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <Ticket className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No shows found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Try adjusting your filters or search criteria
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="mt-4 px-4 py-2 bg-deepTeal text-white rounded-lg hover:bg-deepTeal/80 transition-colors"
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

export default Home;