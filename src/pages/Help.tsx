// Frontend/src/pages/Help.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, HelpCircle, ChevronDown, ChevronUp,
    Ticket, CreditCard, User, Shield,
    QrCode, Wallet, Users, XCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Types
interface FAQItem {
    id: number;
    questionKey: string;     // translation key
    answerKey: string;       // translation key
    category: string;
    icon: React.ElementType;
}

const Help: React.FC = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [searchResults, setSearchResults] = useState<FAQItem[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // FAQ Data with translation keys
    const faqs: FAQItem[] = [
        {
            id: 1,
            category: 'tickets',
            questionKey: 'help.faq.tickets.bookQuestion',
            answerKey: 'help.faq.tickets.bookAnswer',
            icon: Ticket
        },
        {
            id: 2,
            category: 'tickets',
            questionKey: 'help.faq.tickets.getQuestion',
            answerKey: 'help.faq.tickets.getAnswer',
            icon: QrCode
        },
        {
            id: 3,
            category: 'tickets',
            questionKey: 'help.faq.tickets.limitQuestion',
            answerKey: 'help.faq.tickets.limitAnswer',
            icon: Users
        },
        {
            id: 4,
            category: 'payments',
            questionKey: 'help.faq.payments.methodsQuestion',
            answerKey: 'help.faq.payments.methodsAnswer',
            icon: CreditCard
        },
        {
            id: 5,
            category: 'account',
            questionKey: 'help.faq.account.createQuestion',
            answerKey: 'help.faq.account.createAnswer',
            icon: User
        },
        {
            id: 6,
            category: 'wallet',
            questionKey: 'help.faq.wallet.walletQuestion',
            answerKey: 'help.faq.wallet.walletAnswer',
            icon: Wallet
        },
        {
            id: 7,
            category: 'technical',
            questionKey: 'help.faq.technical.troubleQuestion',
            answerKey: 'help.faq.technical.troubleAnswer',
            icon: HelpCircle
        },
        {
            id: 8,
            category: 'tickets',
            questionKey: 'help.faq.tickets.transferQuestion',
            answerKey: 'help.faq.tickets.transferAnswer',
            icon: Users
        },
        {
            id: 9,
            category: 'technical',
            questionKey: 'help.faq.technical.resetPasswordQuestion',
            answerKey: 'help.faq.technical.resetPasswordAnswer',
            icon: Shield
        }
    ];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setIsSearching(query.length > 0);
        if (query.length === 0) {
            setSearchResults([]);
            return;
        }
        const results = faqs.filter(faq =>
            t(faq.questionKey).toLowerCase().includes(query.toLowerCase()) ||
            t(faq.answerKey).toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearching(false);
    };

    const filteredFAQs = searchQuery.length > 0
        ? searchResults
        : faqs.filter(faq => activeCategory === 'all' || faq.category === activeCategory);

    const categories = ['all', 'tickets', 'payments', 'account', 'wallet', 'technical'];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-deepTeal via-deepBlue to-deepTeal text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6"
                        >
                            <HelpCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">{t('help.hero.badge')}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            {t('help.hero.title')}
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/90 mb-8"
                        >
                            {t('help.hero.subtitle')}
                        </motion.p>

                        {isSearching && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 text-sm text-white/80"
                            >
                                {t('help.search.resultCount', { count: searchResults.length, query: searchQuery })}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content - Only FAQ */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                                ? 'bg-deepTeal text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {category === 'all' ? t('help.categories.all') : t(`help.categories.${category}`)}
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-deepTeal/10">
                                        <faq.icon className="h-5 w-5 text-deepTeal" />
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        {t(faq.questionKey)}
                                    </span>
                                </div>
                                {openFAQ === faq.id ? (
                                    <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openFAQ === faq.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-5"
                                    >
                                        <div className="pl-12 border-l-2 border-deepTeal/30">
                                            <p className="text-gray-600 leading-relaxed">
                                                {t(faq.answerKey)}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* No Results */}
                {filteredFAQs.length === 0 && (
                    <div className="text-center py-12">
                        <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('help.noResults.title')}</h3>
                        <p className="text-gray-500">{t('help.noResults.message')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Help;