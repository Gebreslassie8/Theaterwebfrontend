// src/components/Overview/Card.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CardProps {
    // Basic props
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    
    // Style variants
    variant?: 'default' | 'gradient' | 'bordered' | 'elevated' | 'transparent';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    
    // Colors
    color?: 'teal' | 'blue' | 'green' | 'orange' | 'red' | 'gray' | 'purple' | 'pink';
    gradient?: string;
    
    // Interactive
    clickable?: boolean;
    href?: string;
    onClick?: () => void;
    
    // Header elements
    headerIcon?: React.ReactNode;
    headerAction?: React.ReactNode;
    showMoreLink?: string;
    showMoreText?: string;
    onShowMore?: () => void;
    
    // Footer
    footer?: React.ReactNode;
    
    // Loading state
    loading?: boolean;
    
    // Animation
    animated?: boolean;
    animationDelay?: number;
    
    // Badge
    badge?: {
        text: string;
        color?: 'teal' | 'blue' | 'green' | 'orange' | 'red' | 'gray' | 'purple' | 'pink';
    };
    
    // Trend indicator
    trend?: {
        value: number;
        label?: string;
    };
}

// Style variants matching FinancialAnalytics
const variantStyles = {
    default: `bg-white rounded-2xl shadow-lg border border-gray-100`,
    gradient: `bg-gradient-to-br rounded-2xl shadow-lg text-white`,
    bordered: `bg-white rounded-2xl border-2 border-gray-200`,
    elevated: `bg-white rounded-2xl shadow-xl`,
    transparent: `bg-transparent rounded-2xl border border-gray-100`,
};

const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
};

// Gradient styles matching FinancialAnalytics
const getGradientStyle = (color: string) => {
    switch(color) {
        case 'teal':
            return 'from-teal-600 to-teal-700';
        case 'blue':
            return 'from-blue-500 to-blue-600';
        case 'green':
            return 'from-green-500 to-green-600';
        case 'orange':
            return 'from-orange-500 to-orange-600';
        case 'red':
            return 'from-red-500 to-red-600';
        case 'purple':
            return 'from-purple-500 to-pink-600';
        case 'pink':
            return 'from-pink-500 to-rose-600';
        default:
            return 'from-teal-600 to-teal-700';
    }
};

const badgeColors = {
    teal: 'bg-teal-100 text-teal-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-700',
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
};

export const Card: React.FC<CardProps> = ({
    title,
    subtitle,
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    color = 'teal',
    gradient,
    clickable = false,
    href,
    onClick,
    headerIcon,
    headerAction,
    showMoreLink,
    showMoreText = 'View All',
    onShowMore,
    footer,
    loading = false,
    animated = true,
    animationDelay = 0,
    badge,
    trend,
}) => {
    const gradientClass = variant === 'gradient' ? getGradientStyle(color) : '';
    
    const handleClick = () => {
        if (href) {
            window.location.href = href;
        } else if (onClick) {
            onClick();
        }
    };
    
    const animationVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.4, 
                delay: animationDelay,
                type: 'spring',
                stiffness: 100,
                damping: 12,
            }
        },
        hover: {
            y: -2,
            transition: { duration: 0.2 }
        }
    };
    
    const CardContent = () => (
        <>
            {(title || subtitle || headerIcon || headerAction || badge || trend) && (
                <div className={`flex items-start justify-between mb-4 ${padding === 'none' ? 'px-6 pt-6' : ''}`}>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            {headerIcon && (
                                <div className="p-2 rounded-lg" style={{ backgroundColor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : '#f3f4f6' }}>
                                    {headerIcon}
                                </div>
                            )}
                            {title && (
                                <h3 className={`text-lg font-semibold ${variant === 'gradient' ? 'text-white' : 'text-gray-900'}`}>
                                    {title}
                                </h3>
                            )}
                            {badge && (
                                <span className={`px-2 py-1 text-xs rounded-full ${badgeColors[badge.color || 'teal']}`}>
                                    {badge.text}
                                </span>
                            )}
                            {trend && (
                                <div className={`flex items-center gap-1 text-xs font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {trend.value >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    <span>{Math.abs(trend.value)}%</span>
                                    {trend.label && <span className="text-gray-500">{trend.label}</span>}
                                </div>
                            )}
                        </div>
                        {subtitle && (
                            <p className={`text-sm mt-1 ${variant === 'gradient' ? 'text-white/80' : 'text-gray-500'}`}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                    
                    {headerAction && (
                        <div className="flex items-center gap-2">
                            {headerAction}
                        </div>
                    )}
                    
                    {(showMoreLink || onShowMore) && (
                        <a
                            href={showMoreLink}
                            onClick={(e) => {
                                if (onShowMore) {
                                    e.preventDefault();
                                    onShowMore();
                                }
                            }}
                            className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-80"
                            style={{ color: variant === 'gradient' ? 'white' : '#14b8a6' }}
                        >
                            {showMoreText}
                            <ChevronRight className="h-4 w-4" />
                        </a>
                    )}
                </div>
            )}
            
            {loading ? (
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
            ) : (
                <div className={padding === 'none' ? 'px-6 pb-6' : ''}>
                    {children}
                </div>
            )}
            
            {footer && !loading && (
                <div className={`mt-4 pt-4 border-t ${variant === 'gradient' ? 'border-white/20' : 'border-gray-100'}`}>
                    {footer}
                </div>
            )}
        </>
    );
    
    const Wrapper = animated ? motion.div : 'div';
    const wrapperProps = animated ? {
        initial: 'hidden',
        animate: 'visible',
        whileHover: clickable || href || onClick ? 'hover' : undefined,
        variants: animationVariants,
        className: `
            ${variantStyles[variant]}
            ${variant === 'gradient' ? gradientClass : ''}
            ${clickable || href || onClick ? 'cursor-pointer transition-all duration-300 hover:shadow-xl' : ''}
            ${className}
        `,
    } : {
        className: `
            ${variantStyles[variant]}
            ${variant === 'gradient' ? gradientClass : ''}
            ${clickable || href || onClick ? 'cursor-pointer transition-all duration-300 hover:shadow-xl' : ''}
            ${className}
        `,
    };
    
    if (clickable || href || onClick) {
        return (
            <Wrapper {...wrapperProps} onClick={handleClick}>
                <div className={paddingStyles[padding]}>
                    <CardContent />
                </div>
            </Wrapper>
        );
    }
    
    return (
        <Wrapper {...wrapperProps}>
            <div className={paddingStyles[padding]}>
                <CardContent />
            </div>
        </Wrapper>
    );
};

// StatCard Component - Matching FinancialAnalytics style
export const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
    link?: string;
    onClick?: () => void;
}> = ({ title, value, icon: Icon, color, subtitle, link, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const CardContent = () => (
        <div
            className="relative overflow-hidden transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 mb-1">{title}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
            </div>
            {link && (
                <div className={`absolute right-0 bottom-2 transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            {link ? (
                <Link to={link} className="block">
                    <CardContent />
                </Link>
            ) : (
                <div onClick={onClick}>
                    <CardContent />
                </div>
            )}
        </div>
    );
};

// MetricCard Component
export const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: number;
    prefix?: string;
    suffix?: string;
    onClick?: () => void;
}> = ({ title, value, icon, trend, prefix = '', suffix = '', onClick }) => (
    <Card
        variant="default"
        padding="md"
        clickable={!!onClick}
        onClick={onClick}
    >
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">{title}</p>
                <p className="text-xl font-bold text-gray-900">
                    {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                </p>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            {icon && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md">
                    {icon}
                </div>
            )}
        </div>
    </Card>
);

// ChartCard Component - Matching FinancialAnalytics style
export const ChartCard: React.FC<{
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    height?: string | number;
    actions?: React.ReactNode;
}> = ({ title, subtitle, children, height = 350, actions }) => (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
        <div style={{ height: typeof height === 'number' ? `${height}px` : height }}>
            {children}
        </div>
    </div>
);

// RevenueCard Component - Matching FinancialAnalytics StatCard style
export const RevenueCard: React.FC<{
    title: string;
    amount: number;
    subtitle?: string;
    icon: React.ElementType;
    color: string;
}> = ({ title, amount, subtitle, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-500 mb-1">{title}</p>
                <p className="text-xl font-bold text-gray-900">{amount.toLocaleString()}</p>
                {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
        </div>
    </div>
);