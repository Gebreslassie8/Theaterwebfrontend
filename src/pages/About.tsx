import React from 'react';
import { motion } from 'framer-motion';
import {
    Building, Users, Ticket, Award, Globe, Heart,
    Star, Calendar, Clock, MapPin, Coffee, Music,
    Film, Camera, Mic, Speaker, Sparkles, Trophy,
    Shield, Zap, TrendingUp, Phone, Mail, MessageCircle,
    CheckCircle, ArrowRight, Play, Quote, Smartphone,
    Linkedin, Twitter, Facebook, Instagram, Youtube,
    Rocket, Target, Eye, Compass, Flag, Milestone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
    // Company Stats
    const stats = [
        { icon: Building, value: '50+', label: 'Partner Theaters', color: 'from-deepTeal to-teal-600' },
        { icon: Users, value: '100K+', label: 'Happy Customers', color: 'from-deepBlue to-blue-600' },
        { icon: Ticket, value: '500K+', label: 'Tickets Sold', color: 'from-deepTeal to-emerald-600' },
        { icon: Award, value: '4.9', label: 'Customer Rating', color: 'from-deepBlue to-cyan-600' }
    ];

    // Team Members
    const teamMembers = [
        {
            name: 'Alex Johnson',
            role: 'Founder & CEO',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
            bio: 'Visionary leader with 15+ years in entertainment industry',
            social: { linkedin: '#', twitter: '#' }
        },
        {
            name: 'Sarah Chen',
            role: 'Head of Operations',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
            bio: 'Operations expert ensuring smooth theater experiences',
            social: { linkedin: '#', twitter: '#' }
        },
        {
            name: 'Michael Rodriguez',
            role: 'Technical Director',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
            bio: 'Tech innovator building cutting-edge platforms',
            social: { linkedin: '#', twitter: '#' }
        },
        {
            name: 'Emily Watson',
            role: 'Customer Experience',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
            bio: 'Passionate about creating memorable experiences',
            social: { linkedin: '#', twitter: '#' }
        }
    ];

    // Milestones - Enhanced with more details
    const milestones = [
        {
            year: '2020',
            title: 'TheaterHUB Founded',
            description: 'Started with a vision to revolutionize theater booking across Ethiopia',
            icon: Star,
            achievements: ['Seed funding secured', 'Team of 5 founded', 'MVP development started'],
            color: 'from-deepTeal to-teal-500'
        },
        {
            year: '2021',
            title: 'First 10 Theaters',
            description: 'Successfully partnered with 10 premier theaters in Addis Ababa',
            icon: Building,
            achievements: ['10 theater partners', '500+ shows listed', '10,000+ tickets sold'],
            color: 'from-deepBlue to-blue-500'
        },
        {
            year: '2022',
            title: 'Mobile App Launch',
            description: 'Launched iOS and Android apps for seamless mobile booking experience',
            icon: Smartphone,
            achievements: ['App Store launch', '4.8+ rating', '50,000+ downloads'],
            color: 'from-deepTeal to-emerald-500'
        },
        {
            year: '2023',
            title: '100K Users',
            description: 'Celebrated reaching 100,000 happy customers milestone',
            icon: Users,
            achievements: ['100K active users', 'Expanded to 5 cities', '24/7 support launched'],
            color: 'from-deepBlue to-cyan-500'
        },
        {
            year: '2024',
            title: 'Expansion Nationwide',
            description: 'Expanded services to major cities across Ethiopia',
            icon: Globe,
            achievements: ['10+ cities covered', '200+ shows monthly', 'Partnership with 50+ theaters'],
            color: 'from-deepTeal to-teal-600'
        }
    ];

    // Values
    const values = [
        {
            icon: Heart,
            title: 'Passion for Arts',
            description: 'We believe in the transformative power of theater and performing arts.',
            color: 'from-rose-500 to-pink-500'
        },
        {
            icon: Shield,
            title: 'Trust & Security',
            description: 'Your data and payments are protected with enterprise-grade security.',
            color: 'from-deepTeal to-teal-500'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'Constantly improving to bring you the best booking experience.',
            color: 'from-deepBlue to-blue-500'
        },
        {
            icon: Users,
            title: 'Customer First',
            description: 'Your satisfaction is our top priority. We\'re here for you 24/7.',
            color: 'from-amber-500 to-orange-500'
        }
    ];

    // Features
    const features = [
        { icon: Calendar, title: 'Easy Booking', description: 'Book tickets in just a few clicks' },
        { icon: MapPin, title: 'Multiple Venues', description: 'Access to theaters across Ethiopia' },
        { icon: Smartphone, title: 'Mobile Tickets', description: 'Digital tickets on your phone' },
        { icon: Star, title: 'Loyalty Rewards', description: 'Earn points and get exclusive benefits' },
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-6"
                        >
                            <Building className="h-5 w-5" />
                            <span className="text-sm font-medium">Our Story</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            Revolutionizing the Way You Experience Theater
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/90 mb-8"
                        >
                            We're on a mission to connect people with unforgettable theatrical experiences, making every show accessible to everyone.
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
                                Get in Touch <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                to="/theaters"
                                className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                            >
                                Find Theaters
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

            {/* Our Story Section - Enhanced */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-teal-500 mb-6"></div>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                TheaterHUB was born from a simple idea: make theater experiences accessible to everyone. Founded in 2020, we started as a small startup with a big dream to transform how people discover and book shows.
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Today, we're proud to be Ethiopia's leading theater booking platform, connecting thousands of theater lovers with the best shows across the country. Our platform partners with over 50 theaters, offering a seamless booking experience.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                We believe in the power of live performances to inspire, entertain, and bring communities together. Every day, we work to make that magic accessible to more people.
                            </p>
                            <div className="mt-6 flex gap-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-deepTeal" />
                                    <span className="text-sm text-gray-600">Trusted Platform</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-deepTeal" />
                                    <span className="text-sm text-gray-600">Secure Payments</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-deepTeal/5 to-deepBlue/5 rounded-3xl p-8 shadow-xl">
                                <div className="absolute -top-4 -left-4">
                                    <Quote className="h-12 w-12 text-deepTeal/30" />
                                </div>
                                <p className="text-xl italic text-gray-700 mb-6 relative z-10">
                                    "We're not just booking tickets; we're creating memories that last a lifetime. Every show is an opportunity to bring joy and inspiration to our community."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-deepTeal to-deepBlue flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        AJ
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">Alex Johnson</p>
                                        <p className="text-sm text-gray-500">Founder & CEO</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Enhanced Journey Timeline */}
            <div className="bg-gradient-to-br from-gray-50 to-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-deepTeal/10 rounded-full mb-4"
                        >
                            <Milestone className="h-4 w-4 text-deepTeal" />
                            <span className="text-sm font-medium text-deepTeal">Timeline</span>
                        </motion.div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Milestones</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Key moments that shaped our journey to revolutionize theater experiences
                        </p>
                    </div>

                    <div className="relative">
                        {/* Central Timeline Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-deepTeal via-deepBlue to-deepTeal rounded-full hidden lg:block"></div>

                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={milestone.year}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative flex flex-col lg:flex-row items-center mb-16 last:mb-0 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    }`}
                            >
                                {/* Timeline Node */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
                                    <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        className="w-16 h-16 rounded-full bg-gradient-to-r from-deepTeal to-deepBlue flex items-center justify-center shadow-xl z-10 relative"
                                    >
                                        <milestone.icon className="h-7 w-7 text-white" />
                                    </motion.div>
                                </div>

                                {/* Content Card */}
                                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'} w-full mb-8 lg:mb-0`}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
                                    >
                                        <div className={`h-2 bg-gradient-to-r ${milestone.color}`}></div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-deepTeal/10 rounded-full">
                                                    <milestone.icon className="h-4 w-4 text-deepTeal" />
                                                    <span className="text-sm font-semibold text-deepTeal">{milestone.year}</span>
                                                </div>
                                                <div className="text-3xl font-bold bg-gradient-to-r from-deepTeal to-deepBlue bg-clip-text text-transparent">
                                                    {milestone.year}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                                            <p className="text-gray-600 mb-4 leading-relaxed">{milestone.description}</p>
                                            <div className="space-y-2">
                                                {milestone.achievements.map((achievement, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                                                        <CheckCircle className="h-4 w-4 text-deepTeal" />
                                                        <span>{achievement}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Empty spacer for alignment */}
                                <div className="lg:w-1/2 hidden lg:block"></div>

                                {/* Mobile Timeline Dot */}
                                <div className="lg:hidden absolute left-0 top-6">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-deepTeal to-deepBlue flex items-center justify-center shadow-lg">
                                        <milestone.icon className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Values */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            These core principles guide everything we do at TheaterHUB
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="bg-gradient-to-br from-gray-50 to-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TheaterHUB</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            We're dedicated to providing the best theater booking experience
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
                                className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
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

            {/* Team Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Passionate individuals dedicated to bringing you the best theater experience
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
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all group"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-deepTeal text-sm font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                                    <div className="flex gap-3">
                                        <a href={member.social.linkedin} className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-deepTeal hover:text-white transition-all">
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                        <a href={member.social.twitter} className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-deepTeal hover:text-white transition-all">
                                            <Twitter className="h-4 w-4" />
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
                        <h2 className="text-4xl font-bold mb-4">Ready to Experience Theater Like Never Before?</h2>
                        <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                            Join thousands of theater lovers who trust TheaterHUB for their entertainment needs.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/theaters"
                                className="px-8 py-3 bg-white text-deepTeal rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                Find Shows Near You <ArrowRight className="h-5 w-5" />
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