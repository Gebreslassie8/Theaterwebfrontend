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

const About: React.FC = () => {
    // Company Stats
    const stats = [
        { icon: Building, value: '50+', label: 'Partner Theaters', color: 'from-deepTeal to-teal-600' },
        { icon: Users, value: '100K+', label: 'Happy Customers', color: 'from-deepBlue to-blue-600' }
    ];

    // Team Members with updated social links
    const teamMembers = [
        {
            name: 'Alex Johnson',
            role: 'Founder & CEO',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
            bio: 'Visionary leader with 15+ years in entertainment industry',
            social: {
                facebook: '#',
                telegram: '#',
                phone: '+251-11-558-1234'
            }
        },
        {
            name: 'Sarah Chen',
            role: 'Head of Operations',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
            bio: 'Operations expert ensuring smooth theater experiences',
            social: {
                facebook: '#',
                telegram: '#',
                phone: '+251-11-558-1235'
            }
        },
        {
            name: 'Michael Rodriguez',
            role: 'Technical Director',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
            bio: 'Tech innovator building cutting-edge platforms',
            social: {
                facebook: '#',
                telegram: '#',
                phone: '+251-11-558-1236'
            }
        },
        {
            name: 'Emily Watson',
            role: 'Customer Experience',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
            bio: 'Passionate about creating memorable experiences',
            social: {
                facebook: '#',
                telegram: '#',
                phone: '+251-11-558-1237'
            }
        }
    ];

    // Values
    const values = [
        {
            icon: Shield,
            title: 'Trust & Security',
            description: 'Your data and payments are protected with enterprise-grade security.',
            color: 'from-deepBlue to-blue-500'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'Constantly improving to bring you the best booking experience.',
            color: 'from-deepTeal to-emerald-500'
        },
        {
            icon: Users,
            title: 'Customer First',
            description: 'Your satisfaction is our top priority. We\'re here for you 24/7.',
            color: 'from-deepBlue to-cyan-500'
        }
    ];

    // Features
    const features = [
        { icon: Calendar, title: 'Easy Booking', description: 'Book tickets in just a few clicks' },
        { icon: MapPin, title: 'Multiple Venues', description: 'Access to theaters across Ethiopia' },
        { icon: Smartphone, title: 'Mobile Tickets', description: 'Digital tickets on your phone' },
        { icon: Star, title: 'Best Selection', description: 'Wide variety of shows and performances' },
        { icon: Clock, title: '24/7 Support', description: 'Round-the-clock customer service' },
        { icon: Shield, title: 'Secure Payments', description: 'Safe and encrypted transactions' }
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
                            <span className="text-sm font-medium">About Us</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            Ethiopia’s Modern Theater Booking Platform
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/90 mb-8"
                        >
                            Seamless booking, secure reservations, and unforgettable theater experiences across Ethiopia
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
                                Contact Us <ArrowRight className="h-5 w-5" />
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
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Dedicated to making theater booking and reservation seamless for everyone in Ethiopia
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
                                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                To provide a seamless, secure, and innovative platform for booking and reserving
                                theater experiences, making online accessible to everyone across Ethiopia.
                                make Simple booking, secure reservations
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
                                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                To become Ethiopia's leading theater booking and reservation platform, revolutionizing
                                how audiences discover, book, and experience performances with ease and confidence.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Our Values */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            The principles that guide our booking and reservation platform
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TheaterHUB</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            We're dedicated to providing the best theater booking and reservation experience in Ethiopia
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
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
                                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section - Icons with their own brand colors */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Passionate professionals dedicated to bringing you the best theater booking experience in Ethiopia
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
                                    <p className="text-deepTeal text-sm font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>

                                    {/* Social Icons with Brand Colors - Always showing brand colors */}
                                    <div className="flex gap-3">
                                        {/* Facebook - Brand Color #1877F2 */}
                                        <a
                                            href={member.social.facebook}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md"
                                            style={{ backgroundColor: '#1877F2', color: 'white' }}
                                            aria-label="Facebook"
                                        >
                                            <Facebook className="h-4 w-4" />
                                        </a>

                                        {/* Telegram - Brand Color #0088cc */}
                                        <a
                                            href={member.social.telegram}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md"
                                            style={{ backgroundColor: '#0088cc', color: 'white' }}
                                            aria-label="Telegram"
                                        >
                                            <Send className="h-4 w-4" />
                                        </a>

                                        {/* Phone - Brand Color #25D366 */}
                                        <a
                                            href={`tel:${member.social.phone}`}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md"
                                            style={{ backgroundColor: '#25D366', color: 'white' }}
                                            aria-label="Phone"
                                        >
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
                        <h2 className="text-4xl font-bold mb-4">Ready to Book Your Next Theater Experience?</h2>
                        <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                            Join thousands of theater lovers across Ethiopia who trust TheaterHUB for seamless booking and secure reservations.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/theaters"
                                className="px-8 py-3 bg-white text-deepTeal rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                Find Theaters Near You <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                to="/contact"
                                className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;