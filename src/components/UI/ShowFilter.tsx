// ShowFilter.tsx - Simplified Smart Filter (No Active Filters Section)
import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Music,
  Clapperboard,
  Mic2,
  Laugh,
  Heart,
  Sparkles,
  VenetianMask,
  Filter
} from 'lucide-react';

interface ShowFilterProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  onClearFilters: () => void;
  categories?: string[];
}

const ShowFilter: React.FC<ShowFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
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
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-dark-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-deepTeal" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filter by Category
          </h3>
        </div>
        {selectedCategory !== 'All' && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Category Filter - Horizontal Buttons */}
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
    </motion.div>
  );
};

export default ShowFilter;