// Frontend/src/pages/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    Building, Users, Ticket, Award, Globe, Heart,
    Star, Calendar, Clock, MapPin, Sparkles, Trophy,
    Shield, Zap, TrendingUp, Phone, Mail, MessageCircle,
    CheckCircle, ArrowRight, Quote, Smartphone,
    Linkedin, Twitter, Facebook, Instagram, Youtube,
    Rocket, Target, Eye, Compass, Flag, Milestone,
    Headphones, Gift, Target as TargetIcon, Eye as EyeIcon,
    Compass as CompassIcon, Rocket as RocketIcon, Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import local images
import g1 from '/g1.jpg';
import g2 from '/g2.jpg';
import g3 from '/g3.jpg';

const About: React.FC = () => {
    const { t } = useTranslation();

    // Company Stats – using translation keys
    const stats = [
        { icon: Building, valueKey: 'about.stats.theatersValue', labelKey: 'about.stats.theatersLabel', color: 'from-deepTeal to-teal-600' },
        { icon: Users, valueKey: 'about.stats.customersValue', labelKey: 'about.stats.customersLabel', color: 'from-deepBlue to-blue-600' }
    ];

    // Team Members - Updated with correct roles and local images
    const teamMembers = [
        {
            name: 'Birehanu Kassa',
            role: 'Project Manager',
            responsibility: 'Project planning, coordination, documentation, and review',
            image: g1,
            social: { linkedin: '#', telegram: '#', phone: '+251-11-558-1234' }
        },
        {
            name: 'Gebreslassie Desie',
            role: 'Backend Developer',
            responsibility: 'Server-side logic, APIs, system integration',
            image: g2,
            social: { linkedin: '#', telegram: '#', phone: '+251-11-558-1235' }
        },
        {
            name: 'Gemechis Debelo',
            role: 'Frontend Developer',
            responsibility: 'User interface design and client-side development',
            image: g3,
            social: { linkedin: '#', telegram: '#', phone: '+251-11-558-1236' }
        },
        {
            name: 'Lelisa Abraham',
            role: 'Database Designer & Tester',
            responsibility: 'Database design and system testing',
            image: g1, // Using g1 again for the fourth member, or you can add g4.jpg if available
            social: { linkedin: '#', telegram: '#', phone: '+251-11-558-1237' }
        }
    ];

    // Values – using translation keys
    const values = [
        {
            icon: Shield,
            titleKey: 'about.values.trust.title',
            descriptionKey: 'about.values.trust.description',
            color: 'from-deepBlue to-blue-500'
        },
        {
            icon: Zap,
            titleKey: 'about.values.innovation.title',
            descriptionKey: 'about.values.innovation.description',
            color: 'from-deepTeal to-emerald-500'
        },
        {
            icon: Users,
            titleKey: 'about.values.customerFirst.title',
            descriptionKey: 'about.values.customerFirst.description',
            color: 'from-deepBlue to-cyan-500'
        }
    ];

    // Features – using translation keys
    const features = [
        { icon: Calendar, titleKey: 'about.features.easyBooking.title', descriptionKey: 'about.features.easyBooking.description' },
        { icon: MapPin, titleKey: 'about.features.multipleVenues.title', descriptionKey: 'about.features.multipleVenues.description' },
        { icon: Smartphone, titleKey: 'about.features.mobileTickets.title', descriptionKey: 'about.features.mobileTickets.description' },
        { icon: Star, titleKey: 'about.features.bestSelection.title', descriptionKey: 'about.features.bestSelection.description' },
        { icon: Clock, titleKey: 'about.features.support247.title', descriptionKey: 'about.features.support247.description' },
        { icon: Shield, titleKey: 'about.features.securePayments.title', descriptionKey: 'about.features.securePayments.description' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-deepTeal via-deepBlue to-deepTeal text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6"
                        >
                            <Building className="h-5 w-5" />
                            <span className="text-sm font-medium">{t('about.hero.badge')}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            {t('about.hero.title')}
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/90 mb-8"
                        >
                            {t('about.hero.subtitle')}
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-4 justify-center"
                        >
                            <Link
                                to="/contact"
                                className="px-8 py-3 bg-white text-deepTeal rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                {t('about.hero.contactButton')} <ArrowRight className="h-5 w-5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.labelKey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{t(stat.valueKey)}</div>
                            <div className="text-sm text-gray-600">{t(stat.labelKey)}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('about.missionVision.title')}</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            {t('about.missionVision.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Mission Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-deepTeal/5 to-deepBlue/5 rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-deepTeal to-teal-500">
                                    <TargetIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{t('about.mission')}</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                {t('about.missionText')}
                            </p>
                        </motion.div>

                        {/* Vision Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-deepTeal/5 to-deepBlue/5 rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-deepBlue to-blue-500">
                                    <EyeIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{t('about.vision')}</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                {t('about.visionText')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Our Values */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('about.values.title')}</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            {t('about.values.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.titleKey}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${value.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <value.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(value.titleKey)}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{t(value.descriptionKey)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('about.features.title')}</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            {t('about.features.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.titleKey}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all group border border-gray-100"
                            >
                                <div className="p-3 rounded-xl bg-gradient-to-r from-deepTeal to-deepBlue group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{t(feature.titleKey)}</h3>
                                    <p className="text-sm text-gray-600">{t(feature.descriptionKey)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section - Updated with local images */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Meet the talented individuals behind Theatre Hub Ethiopia
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all group"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-deepTeal text-sm font-medium mb-2">{member.role}</p>
                                    <p className="text-gray-500 text-xs mb-4">{member.responsibility}</p>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                        Dedicated professional committed to delivering excellence in {member.role.toLowerCase()}.
                                    </p>

                                    <div className="flex gap-3">
                                        <a href={member.social.linkedin} className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md" style={{ backgroundColor: '#0077B5', color: 'white' }} aria-label="LinkedIn">
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                        <a href={member.social.telegram} className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md" style={{ backgroundColor: '#0088cc', color: 'white' }} aria-label="Telegram">
                                            <Send className="h-4 w-4" />
                                        </a>
                                        <a href={`tel:${member.social.phone}`} className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md" style={{ backgroundColor: '#25D366', color: 'white' }} aria-label="Phone">
                                            <Phone className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-deepTeal to-deepBlue text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-4">{t('about.cta.title')}</h2>
                        <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                            {t('about.cta.subtitle')}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/theaters" className="px-8 py-3 bg-white text-deepTeal rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                                {t('about.cta.findTheaters')} <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link to="/contact" className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                                {t('about.cta.contactUs')}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;