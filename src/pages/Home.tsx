// Home.tsx - Updated with carousel navigation (3 cards visible by default)
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
    SortDesc,
    Crown,
    Gift,
    CheckCircle
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
        viewCount: 0
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
        viewCount: 0
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
        viewCount: 0
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
        viewCount: 0
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
        viewCount: 0
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
        viewCount: 0
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
        viewCount: 0
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
        viewCount: 0
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
        viewCount: 0
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
        viewCount: 0
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
        viewCount: 0
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
        viewCount: 0
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
    const [isLoading, setIsLoading] = useState(true);
    const [viewedShows, setViewedShows] = useState<Set<string>>(new Set());

    // Carousel state for Now Showing
    const [nowShowingStartIndex, setNowShowingStartIndex] = useState(0);
    const [upcomingStartIndex, setUpcomingStartIndex] = useState(0);
    const cardsPerPage = 3; // Show 3 cards by default

    const sortDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load mock data
        setTimeout(() => {
            const sortedShows = [...showsData].sort((a, b) => {
                const dateA = a.dates?.[0]?.date ? new Date(a.dates[0].date).getTime() : 0;
                const dateB = b.dates?.[0]?.date ? new Date(b.dates[0].date).getTime() : 0;
                return dateB - dateA;
            });
            setShows(sortedShows);
            setFilteredShows(sortedShows);
            setIsLoading(false);
        }, 500);
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
                show.venue.toLowerCase().includes(query) ||
                show.cast?.some(actor => actor.toLowerCase().includes(query))
            );
        }

        // Apply sorting
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
        // Reset pagination when filters change
        setNowShowingStartIndex(0);
        setUpcomingStartIndex(0);
    }, [selectedCategory, selectedStatus, searchQuery, sortBy, shows]);

    // Function to increment view count for Now Showing shows
    const incrementViewCount = (showId: string) => {
        if (!viewedShows.has(showId)) {
            setShows(prevShows =>
                prevShows.map(show =>
                    show.id === showId
                        ? { ...show, viewCount: (show.viewCount || 0) + 1 }
                        : show
                )
            );
            setViewedShows(prev => new Set(prev).add(showId));
        }
    };

    const handleClearFilters = () => {
        setSelectedCategory('All');
        setSelectedStatus('All');
        setSearchQuery('');
        setSortBy('date');
    };

    const handleSearch = () => {
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

    // Carousel navigation functions
    const handleNowShowingNext = () => {
        const maxStartIndex = Math.max(0, nowShowingShows.length - cardsPerPage);
        if (nowShowingStartIndex + cardsPerPage < nowShowingShows.length) {
            setNowShowingStartIndex(prev => Math.min(prev + cardsPerPage, maxStartIndex));
        }
    };

    const handleNowShowingPrev = () => {
        setNowShowingStartIndex(prev => Math.max(prev - cardsPerPage, 0));
    };

    const handleUpcomingNext = () => {
        const maxStartIndex = Math.max(0, upcomingShows.length - cardsPerPage);
        if (upcomingStartIndex + cardsPerPage < upcomingShows.length) {
            setUpcomingStartIndex(prev => Math.min(prev + cardsPerPage, maxStartIndex));
        }
    };

    const handleUpcomingPrev = () => {
        setUpcomingStartIndex(prev => Math.max(prev - cardsPerPage, 0));
    };

    // Get current visible shows for carousel
    const getVisibleNowShowing = () => {
        return nowShowingShows.slice(nowShowingStartIndex, nowShowingStartIndex + cardsPerPage);
    };

    const getVisibleUpcoming = () => {
        return upcomingShows.slice(upcomingStartIndex, upcomingStartIndex + cardsPerPage);
    };

    // Get shows for different sections
    const featuredShows = shows.filter(show => show.isFeatured);
    const nowShowingShows = filteredShows.filter(show => show.status === 'now-showing');
    const upcomingShows = filteredShows.filter(show => show.status === 'upcoming');

    // Check if navigation buttons should be disabled
    const isNowShowingPrevDisabled = nowShowingStartIndex === 0;
    const isNowShowingNextDisabled = nowShowingStartIndex + cardsPerPage >= nowShowingShows.length;
    const isUpcomingPrevDisabled = upcomingStartIndex === 0;
    const isUpcomingNextDisabled = upcomingStartIndex + cardsPerPage >= upcomingShows.length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-deepTeal border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading Theatre Hub Ethiopia...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
            {/* Hero Banner */}
            <HeroBanner featuredShows={featuredShows} />

            {/* Main Content Container */}
            <div className="container mx-auto px-4 py-12">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-deepTeal mb-2">
                        Welcome to <span className="text-deepTeal">Theatre Hub Ethiopia</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Experience the best of Ethiopian and international theatre, musicals, and performances
                    </p>
                </motion.div>

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
                                                            <CheckCircle className="h-4 w-4 text-deepTeal" />
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
                                    : 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                                    }`}
                            >
                                <Filter className="h-5 w-5" />
                                <span>Filters</span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Active Filter Indicator */}
                        {(selectedCategory !== 'All' || selectedStatus !== 'All' || searchQuery) && (
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
                                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                                >
                                    <X className="h-4 w-4" />
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
                                selectedStatus={selectedStatus}
                                setSelectedStatus={setSelectedStatus}
                                onClearFilters={handleClearFilters}
                                categories={categories}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Now Showing Section - Carousel with 3 cards */}
                {nowShowingShows.length > 0 ? (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                                    <PlayCircle className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-black">
                                    Now Showing
                                </h2>
                                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium">
                                    {nowShowingShows.length} shows
                                </span>
                            </div>

                            {/* Navigation Buttons */}
                            {nowShowingShows.length > cardsPerPage && (
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleNowShowingPrev}
                                        disabled={isNowShowingPrevDisabled}
                                        className={`p-2 rounded-full transition-all ${!isNowShowingPrevDisabled
                                            ? 'bg-white dark:bg-dark-800 text-deepTeal hover:bg-gray-100 dark:hover:bg-dark-700 shadow-md hover:shadow-lg'
                                            : 'bg-gray-100 dark:bg-dark-900 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleNowShowingNext}
                                        disabled={isNowShowingNextDisabled}
                                        className={`p-2 rounded-full transition-all ${!isNowShowingNextDisabled
                                            ? 'bg-white dark:bg-dark-800 text-deepTeal hover:bg-gray-100 dark:hover:bg-dark-700 shadow-md hover:shadow-lg'
                                            : 'bg-gray-100 dark:bg-dark-900 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Carousel Grid - 3 cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getVisibleNowShowing().map((show) => (
                                <ShowCard
                                    key={show.id}
                                    show={show}
                                    compact={true}
                                    onViewDetail={() => incrementViewCount(show.id)}
                                />
                            ))}
                        </div>

                        {/* Page Indicator */}
                        {nowShowingShows.length > cardsPerPage && (
                            <div className="flex justify-center mt-4 gap-2">
                                {Array.from({ length: Math.ceil(nowShowingShows.length / cardsPerPage) }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setNowShowingStartIndex(idx * cardsPerPage)}
                                        className={`h-2 rounded-full transition-all ${Math.floor(nowShowingStartIndex / cardsPerPage) === idx
                                                ? 'w-8 bg-deepTeal'
                                                : 'w-2 bg-gray-300 dark:bg-dark-600 hover:bg-deepTeal/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                ) : (
                    <div className="mb-12 text-center py-8">
                        <div className="bg-gray-100 dark:bg-dark-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <PlayCircle className="h-10 w-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No shows currently playing</p>
                    </div>
                )}

                {/* Coming Soon Section - Carousel with 3 cards */}
                {upcomingShows.length > 0 ? (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                                    <CalendarDays className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-black">
                                    Coming Soon
                                </h2>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-sm font-medium">
                                    {upcomingShows.length} shows
                                </span>
                            </div>

                            {/* Navigation Buttons */}
                            {upcomingShows.length > cardsPerPage && (
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleUpcomingPrev}
                                        disabled={isUpcomingPrevDisabled}
                                        className={`p-2 rounded-full transition-all ${!isUpcomingPrevDisabled
                                            ? 'bg-white dark:bg-dark-800 text-deepTeal hover:bg-gray-100 dark:hover:bg-dark-700 shadow-md hover:shadow-lg'
                                            : 'bg-gray-100 dark:bg-dark-900 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleUpcomingNext}
                                        disabled={isUpcomingNextDisabled}
                                        className={`p-2 rounded-full transition-all ${!isUpcomingNextDisabled
                                            ? 'bg-white dark:bg-dark-800 text-deepTeal hover:bg-gray-100 dark:hover:bg-dark-700 shadow-md hover:shadow-lg'
                                            : 'bg-gray-100 dark:bg-dark-900 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Carousel Grid - 3 cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getVisibleUpcoming().map((show) => (
                                <ShowCard key={show.id} show={show} compact={true} />
                            ))}
                        </div>

                        {/* Page Indicator */}
                        {upcomingShows.length > cardsPerPage && (
                            <div className="flex justify-center mt-4 gap-2">
                                {Array.from({ length: Math.ceil(upcomingShows.length / cardsPerPage) }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setUpcomingStartIndex(idx * cardsPerPage)}
                                        className={`h-2 rounded-full transition-all ${Math.floor(upcomingStartIndex / cardsPerPage) === idx
                                                ? 'w-8 bg-deepTeal'
                                                : 'w-2 bg-gray-300 dark:bg-dark-600 hover:bg-deepTeal/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                ) : (
                    <div className="mb-12 text-center py-8">
                        <div className="bg-gray-100 dark:bg-dark-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <CalendarDays className="h-10 w-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No upcoming shows scheduled</p>
                    </div>
                )}

                {/* Newsletter Section */}
                {filteredShows.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-16 bg-gradient-to-r from-deepTeal to-teal-600 rounded-2xl p-8 text-center"
                    >
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
                            <p className="text-white/80 mb-6">
                                Get the latest updates on new shows, exclusive offers, and early bird discounts
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white"
                                />
                                <button className="px-6 py-3 bg-white text-deepTeal rounded-lg font-medium hover:shadow-lg transition-all">
                                    Subscribe
                                </button>
                            </div>
                            <p className="text-white/60 text-xs mt-4">
                                No spam, unsubscribe anytime
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Home;