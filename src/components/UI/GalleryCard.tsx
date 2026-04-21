// src/components/UI/GalleryCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    MapPin,
    Heart,
    Share2,
    Maximize2,
    Eye
} from 'lucide-react';

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

interface GalleryCardProps {
    image: GalleryImage;
    onClick: () => void;
    index?: number;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ image, onClick, index = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(image.likes);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLiked) {
            setLikesCount(likesCount - 1);
        } else {
            setLikesCount(likesCount + 1);
        }
        setIsLiked(!isLiked);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Share functionality
        navigator.clipboard.writeText(window.location.href + `?image=${image.id}`);
        alert('Link copied to clipboard!');
    };

    const handleMaximize = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick();
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            performances: 'bg-purple-500',
            'behind-scenes': 'bg-blue-500',
            venues: 'bg-green-500',
            audience: 'bg-orange-500',
            costumes: 'bg-pink-500'
        };
        return colors[category] || 'bg-gray-500';
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            performances: '🎭 Performance',
            'behind-scenes': '🎬 Behind Scenes',
            venues: '🏛️ Venue',
            audience: '👥 Audience',
            costumes: '👗 Costume'
        };
        return labels[category] || category;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group cursor-pointer"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                    )}
                    <img
                        src={image.src}
                        alt={image.title}
                        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Action Buttons on Hover */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLike}
                                    className={`p-2 backdrop-blur rounded-full transition transform hover:scale-110 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                >
                                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition transform hover:scale-110"
                                >
                                    <Share2 className="h-4 w-4 text-white" />
                                </button>
                            </div>
                            <button
                                onClick={handleMaximize}
                                className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition transform hover:scale-110"
                            >
                                <Maximize2 className="h-4 w-4 text-white" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`${getCategoryColor(image.category)} text-white text-[10px] font-medium px-2 py-1 rounded-lg shadow-lg flex items-center gap-1`}>
                            {getCategoryLabel(image.category)}
                        </span>
                    </div>

                    {/* Views Badge */}
                    <div className="absolute top-3 right-3">
                        <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {image.views.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-grow">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-deepTeal transition-colors line-clamp-1">
                        {image.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {image.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {image.venue}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Heart className={`h-3 w-3 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                            {likesCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                            👁️ {image.views.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GalleryCard;