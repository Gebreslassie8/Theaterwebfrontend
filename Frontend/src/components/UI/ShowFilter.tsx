import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Music,
  Clapperboard,
  Mic2,
  Laugh,
  Heart,
  Users,
  Calendar,
  Clock,
  Filter,
  Sparkles,
  VenetianMask
} from 'lucide-react';

interface ShowFilterProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  onClearFilters: () => void;
  categories?: string[];
}

const ShowFilter: React.FC<ShowFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  onClearFilters,
  categories = ['All', 'Musical', 'Play', 'Ballet', 'Opera', 'Comedy', 'Drama']
}) => {
  const categoryIcons: Record<string, React.ElementType> = {
    'All': Filter,
    'Musical': Music,
    'Play': Clapperboard,
    'Ballet': VenetianMask,
    'Opera': Mic2,
    'Comedy': Laugh,
    'Drama': VenetianMask,
    'Family': Heart,
    'Classic': Sparkles,
    'Contemporary': Users
  };

  const statuses = [
    { id: 'All', label: 'All Shows', icon: Calendar },
    { id: 'now-showing', label: 'Now Showing', icon: Calendar },
    { id: 'upcoming', label: 'Upcoming', icon: Clock },
  ];

  const getStatusColor = (status: string, isSelected: boolean) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      'now-showing': {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800'
      },
      'upcoming': {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800'
      }
    };

    if (status === 'All') {
      return isSelected
        ? 'bg-deepTeal text-white border-deepTeal'
        : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-dark-600 hover:bg-gray-200 dark:hover:bg-dark-600';
    }

    return isSelected
      ? `${colors[status]?.bg} ${colors[status]?.text} border-2 ${colors[status]?.border}`
      : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  const statusLabels: Record<string, string> = {
    'now-showing': 'Now Showing',
    'upcoming': 'Upcoming'
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-dark-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-deepTeal" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filters
          </h3>
        </div>
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <X className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>

      {/* Category Filter - Horizontal Buttons */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Category
        </h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = categoryIcons[category] || Filter;
            const isSelected = selectedCategory === category;

            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category)}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200 border
                  ${isSelected
                    ? 'bg-deepTeal text-white border-deepTeal shadow-md'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-dark-600 hover:bg-gray-200 dark:hover:bg-dark-600'
                  }
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{category}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Status Filter - Horizontal Buttons */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Status
        </h4>
        <div className="flex flex-wrap gap-3">
          {statuses.map((status) => {
            const Icon = status.icon;
            const isSelected = selectedStatus === status.id;

            return (
              <motion.button
                key={status.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStatus(status.id)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200 border-2
                  ${getStatusColor(status.id, isSelected)}
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{status.label}</span>
                {status.id !== 'All' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected
                    ? 'bg-white/30 text-white'
                    : 'bg-gray-200 dark:bg-dark-600 text-gray-600 dark:text-gray-400'
                    }`}>
                    {status.id === 'now-showing' ? 'Now' : 'Soon'}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
        <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Quick Filters
        </h5>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedStatus('now-showing');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            Currently Playing
          </button>
          <button
            onClick={() => {
              setSelectedStatus('upcoming');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            Coming Soon
          </button>
          <button
            onClick={() => {
              setSelectedCategory('Musical');
              setSelectedStatus('All');
            }}
            className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            Musicals
          </button>
          <button
            onClick={() => {
              setSelectedCategory('Drama');
              setSelectedStatus('All');
            }}
            className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            Drama
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ShowFilter;