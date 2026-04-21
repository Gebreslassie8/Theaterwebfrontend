// Frontend/src/components/UI/BlogShowCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Bookmark,
  User,
  Tag,
  TrendingUp,
  Crown,
  Sparkles,
  ChevronRight,
  MessageCircle,
  Share2
} from 'lucide-react';

interface BlogAuthor {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface BlogCategory {
  id: string;
  name: string;
  icon?: any;
}

interface BlogPostCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  author: BlogAuthor;
  categories: BlogCategory[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  bookmarks: number;
  comments: number;
  isTrending: boolean;
  isFeatured?: boolean;
}

interface BlogShowCardProps {
  post: BlogPostCard;
  compact?: boolean;
}

const BlogShowCard: React.FC<BlogShowCardProps> = ({ post, compact = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const getTrendingStatus = () => {
    if (post.isTrending) return { text: 'Trending', icon: TrendingUp, color: 'from-red-500 to-orange-500' };
    if (post.isFeatured) return { text: 'Featured', icon: Crown, color: 'from-amber-500 to-orange-500' };
    return null;
  };

  const trendingStatus = getTrendingStatus();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-dark-700 h-full flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/blog/${post.slug}`} className="block h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-dark-900 flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-dark-700 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70" />
            </div>
          )}
          <img
            src={post.featuredImage}
            alt={post.title}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70" />

          {/* Trending/Featured Badge */}
          {trendingStatus && (
            <div className="absolute top-3 left-3">
              <div className={`bg-gradient-to-r ${trendingStatus.color} px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xl flex items-center gap-1`}>
                {React.createElement(trendingStatus.icon, { className: "h-2.5 w-2.5" })}
                {trendingStatus.text}
              </div>
            </div>
          )}

          {/* Read Time Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg border border-white/20 shadow-lg flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {post.readTime} min read
            </span>
          </div>

          {/* Views Badge */}
          <div className="absolute bottom-3 right-3">
            <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg border border-white/20 shadow-lg flex items-center gap-1">
              <Eye className="h-2.5 w-2.5" />
              {post.views.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-deepTeal/10 text-deepTeal"
              >
                {category.name}
              </span>
            ))}
          </div>

          {/* Title */}
          <div className="mb-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-deepTeal transition-colors line-clamp-2">
              {post.title}
            </h3>
          </div>

          {/* Excerpt */}
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Author & Date */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {post.author.name}
                </p>
                <p className="text-[10px] text-gray-500">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-dark-700">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              >
                <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>

              {/* Comment Button */}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-deepTeal transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{post.comments || 0}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-1 text-xs transition-colors ${isBookmarked ? 'text-deepTeal' : 'text-gray-500 hover:text-deepTeal'}`}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Read More Link */}
            <div className="flex items-center gap-1 text-deepTeal text-xs font-medium group-hover:gap-2 transition-all">
              <span>Read More</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogShowCard;