import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
    CalendarDays,
    X,
    Compass,
    PlayCircle,
    SlidersHorizontal,
    ChevronRight,
    ChevronLeft,
    SortAsc,
    SortDesc
} from 'lucide-react';
import HeroBanner from '../components/UI/HeroBanner';
import ShowCard from '../components/UI/ShowCard';
import ShowFilter from '../components/UI/ShowFilter';

// ============================================
// TYPES
// ============================================

export interface ShowDate {
    date: string;
    time: string;
    availableSeats: number;
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
        cast: ['Lin-Manuel Miranda', 'Leslie Odom Jr.'],
        images: {
            poster: 'https://images.unsplash.com/photo-1511193311914-034c8c8a8f16?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-12-20', time: '19:30', availableSeats: 45 },
            { date: '2024-12-21', time: '14:00', availableSeats: 12 }
        ],
        priceRange: { min: 199, max: 499 },
        status: 'now-showing',
        isFeatured: true,
        rating: 4.8,
        reviews: 1280
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
        cast: ['L. Steven Taylor', 'Brandon A. McCall'],
        images: {
            poster: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-12-22', time: '19:30', availableSeats: 67 },
            { date: '2024-12-23', time: '14:00', availableSeats: 89 }
        ],
        priceRange: { min: 129, max: 399 },
        status: 'now-showing',
        isFeatured: true,
        rating: 4.7,
        reviews: 2150
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
        images: {
            poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-12-25', time: '19:00', availableSeats: 23 },
            { date: '2024-12-26', time: '14:30', availableSeats: 45 }
        ],
        priceRange: { min: 89, max: 299 },
        status: 'upcoming',
        isFeatured: false,
        rating: 4.9,
        reviews: 890
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
        images: {
            poster: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-12-18', time: '20:00', availableSeats: 15 },
            { date: '2024-12-19', time: '19:30', availableSeats: 32 }
        ],
        priceRange: { min: 79, max: 199 },
        status: 'now-showing',
        isFeatured: false,
        rating: 4.6,
        reviews: 1780
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
        images: {
            poster: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-12-27', time: '19:30', availableSeats: 156 },
            { date: '2024-12-28', time: '14:00', availableSeats: 203 }
        ],
        priceRange: { min: 45, max: 120 },
        status: 'upcoming',
        isFeatured: true,
        rating: 4.4,
        reviews: 230
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
        images: {
            poster: 'https://images.unsplash.com/photo-1572700432885-19bb32ea6b3c?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2025-01-05', time: '19:00', availableSeats: 89 },
            { date: '2025-01-06', time: '19:00', availableSeats: 67 }
        ],
        priceRange: { min: 150, max: 450 },
        status: 'upcoming',
        isFeatured: false,
        rating: 4.8,
        reviews: 670
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
        images: {
            poster: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2024-12-29', time: '19:30', availableSeats: 34 },
            { date: '2024-12-30', time: '14:00', availableSeats: 56 }
        ],
        priceRange: { min: 149, max: 399 },
        status: 'now-showing',
        isFeatured: true,
        rating: 4.9,
        reviews: 2450
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
        images: {
            poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2025-01-10', time: '19:30', availableSeats: 78 },
            { date: '2025-01-11', time: '14:30', availableSeats: 92 }
        ],
        priceRange: { min: 129, max: 359 },
        status: 'upcoming',
        isFeatured: false,
        rating: 4.8,
        reviews: 1890
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
        images: {
            poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2025-01-15', time: '20:00', availableSeats: 45 },
            { date: '2025-01-16', time: '20:00', availableSeats: 67 }
        ],
        priceRange: { min: 99, max: 299 },
        status: 'now-showing',
        isFeatured: false,
        rating: 4.6,
        reviews: 1560
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
        images: {
            poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2025-01-20', time: '19:30', availableSeats: 23 },
            { date: '2025-01-21', time: '14:00', availableSeats: 45 }
        ],
        priceRange: { min: 119, max: 349 },
        status: 'now-showing',
        isFeatured: true,
        rating: 4.9,
        reviews: 3120
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
        images: {
            poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2025-02-01', time: '19:30', availableSeats: 67 },
            { date: '2025-02-02', time: '14:00', availableSeats: 89 }
        ],
        priceRange: { min: 89, max: 299 },
        status: 'upcoming',
        isFeatured: false,
        rating: 4.5,
        reviews: 980
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
        images: {
            poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            gallery: []
        },
        dates: [
            { date: '2025-02-15', time: '19:30', availableSeats: 34 },
            { date: '2025-02-16', time: '14:00', availableSeats: 56 }
        ],
        priceRange: { min: 119, max: 349 },
        status: 'upcoming',
        isFeatured: true,
        rating: 4.7,
        reviews: 1450
    }
];

const categories = ['All', 'Musical', 'Play', 'Ballet', 'Opera', 'Comedy', 'Drama'];

// Sort options
const sortOptions = [
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'name', label: 'Name', icon: SortAsc },
    { value: 'price-low', label: 'Price: Low to High', icon: SortAsc },
    { value: 'price-high', label: 'Price: High to Low', icon: SortDesc },
    { value: 'rating', label: 'Rating', icon: Star },
];

// ============================================
// HOME PAGE COMPONENT
// ============================================

const Home = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [filteredShows, setFilteredShows] = useState<Show[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [showFilters, setShowFilters] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Horizontal scroll states
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load mock data and sort by date (recent first)
        const sortedShows = [...showsData].sort((a, b) => {
            const dateA = a.dates?.[0]?.date ? new Date(a.dates[0].date).getTime() : 0;
            const dateB = b.dates?.[0]?.date ? new Date(b.dates[0].date).getTime() : 0;
            return dateB - dateA; // Recent first
        });

        setShows(sortedShows);
        setFilteredShows(sortedShows);
    }, []);

    useEffect(() => {
        let results = [...shows];

        // Apply filters
        if (selectedCategory !== 'All') {
            results = results.filter(show => show.genre === selectedCategory);
        }
        if (selectedStatus !== 'All') {
            results = results.filter(show => show.status === selectedStatus);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(show =>
                show.title.toLowerCase().includes(query) ||
                show.description.toLowerCase().includes(query) ||
                show.venue.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        results.sort((a, b) => {
            switch (sortBy) {
                case 'date': {
                    const dateA = a.dates?.[0]?.date ? new Date(a.dates[0].date).getTime() : 0;
                    const dateB = b.dates?.[0]?.date ? new Date(b.dates[0].date).getTime() : 0;
                    return dateB - dateA; // Recent first
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
    }, [selectedCategory, selectedStatus, searchQuery, sortBy, shows]);

    // Check scroll position to show/hide arrows
    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollButtons();
        window.addEventListener('resize', checkScrollButtons);
        return () => window.removeEventListener('resize', checkScrollButtons);
    }, [filteredShows]);

    // Close sort dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollLeft = scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });

            setTimeout(checkScrollButtons, 300);
        }
    };

    const handleClearFilters = () => {
        setSelectedCategory('All');
        setSelectedStatus('All');
        setSearchQuery('');
        setSortBy('date');
    };

    const handleSearch = () => {
        // Search is already applied via useEffect
        console.log('Searching for:', searchQuery);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const getCurrentSortLabel = () => {
        const option = sortOptions.find(opt => opt.value === sortBy);
        return option ? option.label : 'Sort by';
    };

    const featuredShows = shows.filter(show => show.isFeatured);
    const recentShows = filteredShows.filter(show => show.status === 'now-showing').slice(0, 8);
    const upcomingShows = filteredShows.filter(show => show.status === 'upcoming').slice(0, 8);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
            {/* Hero Banner - Full Width */}
            <HeroBanner featuredShows={featuredShows} />

            {/* Main Content Container */}
            <div className="container mx-auto px-4 py-12">
                {/* Search & Filter Section */}
                <div className="mb-10">
                    <div className="max-w-5xl mx-auto">
                        {/* Search Bar with Sort and Filter */}
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

                            {/* Sort Dropdown */}
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
                                                            ? 'bg-deepTeal/10 text-deepTeal dark:bg-deepTeal/20'
                                                            : 'text-gray-700 dark:text-gray-300'
                                                            }`}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                        <span className="flex-1">{option.label}</span>
                                                        {sortBy === option.value && (
                                                            <span className="text-deepTeal">✓</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Filter Button */}
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
                        {(selectedCategory !== 'All' || selectedStatus !== 'All' || searchQuery) && (
                            <div className="flex items-center justify-between bg-deepTeal/5 rounded-lg p-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-deepTeal">Active filters:</span>
                                    {selectedCategory !== 'All' && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-deepTeal/10 text-deepTeal rounded-full text-sm">
                                            Category: {selectedCategory}
                                        </span>
                                    )}
                                    {selectedStatus !== 'All' && (
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${selectedStatus === 'now-showing'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {selectedStatus === 'now-showing' ? 'Now Showing' : 'Upcoming'}
                                        </span>
                                    )}
                                    {searchQuery && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                                            "{searchQuery}"
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleClearFilters}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                >
                                    <X className="h-4 w-4" />
                                    Clear All
                                </button>
                            </div>
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
                                selectedStatus={selectedStatus}
                                setSelectedStatus={setSelectedStatus}
                                onClearFilters={handleClearFilters}
                                categories={categories}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Now Showing Section - Horizontal Scroll */}
                {recentShows.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Now Showing
                                </h2>
                                <span className="px-3 py-1 bg-deepTeal/10 text-deepTeal rounded-full text-sm font-medium">
                                    {recentShows.length} shows
                                </span>
                            </div>

                            {/* Scroll Controls */}
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => scroll('left')}
                                    disabled={!canScrollLeft}
                                    className={`p-2 rounded-full transition-colors ${canScrollLeft
                                        ? 'bg-white dark:bg-dark-800 text-deepTeal hover:bg-gray-100 dark:hover:bg-dark-700 shadow-md'
                                        : 'bg-gray-100 dark:bg-dark-900 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => scroll('right')}
                                    disabled={!canScrollRight}
                                    className={`p-2 rounded-full transition-colors ${canScrollRight
                                        ? 'bg-white dark:bg-dark-800 text-deepTeal hover:bg-gray-100 dark:hover:bg-dark-700 shadow-md'
                                        : 'bg-gray-100 dark:bg-dark-900 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={checkScrollButtons}
                            className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            <div className="flex gap-6" style={{ width: 'max-content' }}>
                                {recentShows.map((show) => (
                                    <div key={show.id} style={{ width: '280px' }}>
                                        <ShowCard show={show} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Upcoming Shows Section - Grid */}
                {upcomingShows.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Coming Soon
                                </h2>
                                <span className="px-3 py-1 bg-deepTeal/10 text-deepTeal rounded-full text-sm font-medium">
                                    {upcomingShows.length} shows
                                </span>
                            </div>

                            <Link
                                to="/upcoming"
                                className="text-deepTeal hover:text-deepTeal/80 font-medium flex items-center gap-1"
                            >
                                View All
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Grid Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {upcomingShows.slice(0, 4).map((show) => (
                                <ShowCard key={show.id} show={show} />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Shows Grid - Fallback */}
                {filteredShows.length > 0 && recentShows.length === 0 && upcomingShows.length === 0 && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    All Shows
                                </h2>
                                <span className="px-3 py-1 bg-deepTeal/10 text-deepTeal rounded-full text-sm font-medium">
                                    {filteredShows.length} shows
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredShows.slice(0, 8).map((show) => (
                                <ShowCard key={show.id} show={show} />
                            ))}
                        </div>

                        {filteredShows.length > 8 && (
                            <div className="text-center mt-8">
                                <Link
                                    to="/all-shows"
                                    className="inline-flex items-center gap-2 text-deepTeal hover:text-deepTeal/80 font-medium"
                                >
                                    View All {filteredShows.length} Shows
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {/* No Results */}
                {filteredShows.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="bg-gray-100 dark:bg-dark-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <Ticket className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                                No shows found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">
                                We couldn't find any shows matching your current filters. Try adjusting your search criteria.
                            </p>
                            <button
                                onClick={handleClearFilters}
                                className="px-8 py-3 bg-gradient-to-r from-deepTeal to-deepTeal text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;