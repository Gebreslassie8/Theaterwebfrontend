// src/pages/Gallery.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Camera,
    Calendar,
    MapPin,
    Users,
    Heart,
    Share2,
    Download,
    Award,
    Theater,
    Grid,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    ChevronUp
} from 'lucide-react';
import GalleryCard from '../components/UI/GalleryCard';

// Types
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

interface Category {
    id: string;
    name: string;
    icon: React.ElementType;
    count: number;
}

const Gallery: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const itemsPerPage = 12;

    // Mock Gallery Images - Unique entries only
    const images: GalleryImage[] = [
        {
            id: 1,
            src: 'https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=1600&h=1200&fit=crop',
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
            src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600&h=1200&fit=crop',
            title: 'Hamilton - Behind the Scenes',
            description: 'Exclusive behind the scenes look at the hit musical Hamilton.',
            category: 'behind-scenes',
            date: 'March 10, 2024',
            venue: 'City Cinema',
            photographer: 'Michael Chen',
            likes: 189,
            views: 987
        },
        {
            id: 3,
            src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&h=1200&fit=crop',
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
            src: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1600&h=1200&fit=crop',
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
            src: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1600&h=1200&fit=crop',
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
            src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&h=1200&fit=crop',
            title: 'Cast Rehearsal - Behind the Scenes',
            description: 'Exclusive look at cast rehearsal for upcoming production.',
            category: 'behind-scenes',
            date: 'February 15, 2024',
            venue: 'City Cinema',
            photographer: 'Mark Thompson',
            likes: 145,
            views: 678
        },
        {
            id: 7,
            src: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&h=1200&fit=crop',
            title: 'Stage Design - Architectural Beauty',
            description: 'The stunning stage design and architecture of our theaters.',
            category: 'venues',
            date: 'February 10, 2024',
            venue: 'Grand Theater',
            photographer: 'Anna Martinez',
            likes: 198,
            views: 890
        },
        {
            id: 8,
            src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1600&h=1200&fit=crop',
            title: 'Audience Reactions - Pure Joy',
            description: 'Capturing the magic through audience reactions.',
            category: 'audience',
            date: 'February 5, 2024',
            venue: 'Star Theater',
            photographer: 'Robert Kim',
            likes: 321,
            views: 1543
        },
        {
            id: 9,
            src: 'https://images.unsplash.com/photo-1508615070457-7baeba4008fc?w=1600&h=1200&fit=crop',
            title: 'Costume Design - Artistic Masterpiece',
            description: 'Intricate costume designs that bring characters to life.',
            category: 'performances',
            date: 'January 28, 2024',
            venue: 'Costume Workshop',
            photographer: 'Patricia White',
            likes: 256,
            views: 1120
        },
        {
            id: 10,
            src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&h=1200&fit=crop',
            title: 'Les Misérables - The Final Scene',
            description: 'The emotional final scene of Les Misérables.',
            category: 'performances',
            date: 'January 20, 2024',
            venue: 'Grand Theater',
            photographer: 'Thomas Brown',
            likes: 389,
            views: 1876
        },
        {
            id: 11,
            src: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1600&h=1200&fit=crop',
            title: 'Stage Setup - Technical Excellence',
            description: 'Behind the scenes of the technical stage setup.',
            category: 'behind-scenes',
            date: 'January 15, 2024',
            venue: 'Royal Opera',
            photographer: 'James Wilson',
            likes: 167,
            views: 789
        },
        {
            id: 12,
            src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1600&h=1200&fit=crop',
            title: 'Opening Night - Celebrations',
            description: 'Cast and crew celebrating opening night success.',
            category: 'audience',
            date: 'January 10, 2024',
            venue: 'Star Theater',
            photographer: 'Emily Davis',
            likes: 432,
            views: 2100
        }
    ];

    // Categories
    const categories: Category[] = [
        { id: 'all', name: 'All', icon: Grid, count: images.length },
        { id: 'performances', name: 'Performances', icon: Theater, count: images.filter(i => i.category === 'performances').length },
        { id: 'behind-scenes', name: 'Behind Scenes', icon: Camera, count: images.filter(i => i.category === 'behind-scenes').length },
        { id: 'venues', name: 'Venues', icon: MapPin, count: images.filter(i => i.category === 'venues').length },
        { id: 'audience', name: 'Audience', icon: Users, count: images.filter(i => i.category === 'audience').length }
    ];

    const filteredImages = selectedCategory === 'all'
        ? images
        : images.filter(img => img.category === selectedCategory);

    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
    const paginatedImages = filteredImages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 800);
        setCurrentPage(1);
    }, [selectedCategory]);

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

    const handleImageClick = (image: GalleryImage) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    // Get page numbers for pagination with ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
                <div className="max-w-full px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-lg w-64 mb-8 mx-auto"></div>
                        <div className="h-8 bg-gray-200 rounded-lg w-96 mb-12 mx-auto"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="bg-gray-200 rounded-2xl h-80"></div>
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
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Theater Gallery
                        </h1>

                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Explore performances, behind-the-scenes moments, venues, and audience experiences from our organized theater collection.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Gallery Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12" id="gallery">
                {/* Category Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap gap-3 justify-center mb-6">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isActive = selectedCategory === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${isActive
                                            ? 'bg-gradient-to-r from-deepTeal to-deepBlue text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{category.name}</span>
                                    <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                        ({category.count})
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Images Grid */}
                {paginatedImages.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedImages.map((image, index) => (
                                <GalleryCard
                                    key={image.id}
                                    image={image}
                                    onClick={() => handleImageClick(image)}
                                    index={index}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(1, prev - 1));
                                        scrollToTop();
                                    }}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <div className="flex gap-2">
                                    {getPageNumbers().map((page, idx) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-500">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => {
                                                    setCurrentPage(page as number);
                                                    scrollToTop();
                                                }}
                                                className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === page
                                                        ? 'bg-deepTeal text-white shadow-md'
                                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
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
                        {totalPages > 1 && (
                            <div className="text-center mt-4 text-sm text-gray-500">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredImages.length)} of {filteredImages.length} images
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No images found</h3>
                        <p className="text-gray-500">Try selecting a different category</p>
                    </div>
                )}
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-2/3 bg-black flex items-center justify-center p-4 min-h-[300px]">
                                    <img
                                        src={selectedImage.src}
                                        alt={selectedImage.title}
                                        className="max-w-full max-h-[70vh] object-contain"
                                    />
                                </div>
                                <div className="md:w-1/3 p-6 overflow-y-auto bg-white dark:bg-gray-900">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {selectedImage.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                        {selectedImage.description}
                                    </p>
                                    <div className="space-y-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            <span>{selectedImage.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            <span>{selectedImage.venue}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Camera className="h-4 w-4" />
                                            <span>Photographer: {selectedImage.photographer}</span>
                                        </div>
                                        <div className="flex items-center gap-3 pt-4">
                                            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition">
                                                <Heart className="h-4 w-4 text-red-500" />
                                                <span>{selectedImage.likes}</span>
                                            </button>
                                            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition">
                                                <Share2 className="h-4 w-4" />
                                                <span>Share</span>
                                            </button>
                                            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition">
                                                <Download className="h-4 w-4" />
                                                <span>Download</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

export default Gallery;