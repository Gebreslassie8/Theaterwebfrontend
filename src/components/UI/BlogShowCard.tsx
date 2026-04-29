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
  Share2,
  ArrowRight
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
  isNew?: boolean;
  categoryBadge?: {
    bg: string;
    text: string;
    label: string;
  };
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

  // Only show "New" badge for new posts
  const getNewStatus = () => {
    if (post.isNew) return { text: 'New', icon: Sparkles, color: 'from-green-500 to-emerald-500', bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500' };
    return null;
  };

  const newStatus = getNewStatus();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/blog/${post.slug}`} className="block h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>
          )}
          <img
            src={post.featuredImage}
            alt={post.title}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100" />

          {/* New Badge - Only for new posts */}
          {newStatus && (
            <div className="absolute top-3 left-3 z-10">
              <div className={`${newStatus.bgColor} px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 text-white`}>
                {React.createElement(newStatus.icon, { className: "h-2.5 w-2.5" })}
                <span>{newStatus.text}</span>
              </div>
            </div>
          )}

          {/* Category Badge from parent */}
          {post.categoryBadge && (
            <div className="absolute top-3 right-3 z-10">
              <span className={`text-xs px-2.5 py-1 rounded-lg font-medium shadow-lg ${post.categoryBadge.bg} ${post.categoryBadge.text}`}>
                {post.categoryBadge.label}
              </span>
            </div>
          )}

          {/* Date and Read Time Overlay */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  {post.readTime} min read
                </span>
              </div>
              <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                <Eye className="h-2.5 w-2.5" />
                {post.views.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-deepTeal/20"
            />
            <div>
              <p className="text-xs font-semibold text-gray-800">
                {post.author.name}
              </p>
              <p className="text-[10px] text-gray-500">{post.author.role}</p>
            </div>
          </div>

          {/* Title */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-deepTeal transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h3>
          </div>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
            {/* Stats */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs transition-all duration-200 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
              >
                <Heart className={`h-3.5 w-3.5 transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} />
                <span className="font-medium">{likesCount}</span>
              </button>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="font-medium">{post.comments}</span>
              </div>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-1 text-xs transition-all duration-200 ${isBookmarked ? 'text-deepTeal' : 'text-gray-500 hover:text-deepTeal'
                  }`}
              >
                <Bookmark className={`h-3.5 w-3.5 transition-transform ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Read More Link */}
            <div className="group/link">
              <span className="flex items-center gap-1 text-deepTeal text-xs font-semibold transition-all duration-300 group-hover/link:gap-2 cursor-pointer">
                Read More
                <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-deepTeal/0 rounded-xl group-hover:border-deepTeal/20 transition-all duration-500 pointer-events-none" />
      </Link>
    </motion.article>
  );
};

export default BlogShowCard;