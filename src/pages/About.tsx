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
    Compass as CompassIcon, Rocket as RocketIcon
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

    // Values
    const values = [
        {
            icon: Heart,
            title: 'Passion for Arts',
            description: 'We believe in the transformative power of theater and performing arts.',
            color: 'from-deepTeal to-teal-500'
        },
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

    // Contact Options
    const contactOptions = [
        { icon: Phone, title: 'Phone Support', details: '+251 911 234 567', description: 'Available 24/7 for urgent inquiries' },
        { icon: Mail, title: 'Email Us', details: 'hello@theatrehub.com', description: 'We respond within 24 hours' },
        { icon: MessageCircle, title: 'Live Chat', details: 'Chat with our team', description: 'Available 9 AM - 9 PM' },
        { icon: Headphones, title: 'Customer Support', details: 'Dedicated support team', description: 'Always here to help' }
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
                            Revolutionizing Theater Experience in Ethiopia
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/90 mb-8"
                        >
                            Connecting theater lovers with unforgettable performances across the nation
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-4 justify-center"
                        >
                            <Link
                                to="/theaters"
                                className="px-8 py-3 bg-white text-deepTeal rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                Explore Shows <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                to="/contact"
                                className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                            >
                                Contact Us
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

            {/* Mission & Vision Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Guiding our path to transform theater experiences in Ethiopia and beyond
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
                                To democratize access to theater experiences by providing a seamless, 
                                innovative, and inclusive platform that connects audiences with the magic 
                                of live performances across Ethiopia and beyond.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-deepTeal">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Making theater accessible to all</span>
                            </div>
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
                                To become the premier theater booking platform in Africa, revolutionizing 
                                how people discover, book, and experience live performances while fostering 
                                a vibrant theater culture that enriches communities.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-deepTeal">
                                <RocketIcon className="h-5 w-5" />
                                <span className="text-sm font-medium">Leading theater innovation in Africa</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Our Story Section - Simplified */}
            <div className="bg-gray-50 py-20">
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
                                TheaterHUB was founded with a simple yet powerful vision: to make exceptional 
                                theater experiences accessible to everyone. What started as a small startup in 
                                2020 has grown into Ethiopia's leading theater booking platform.
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Today, we proudly partner with over 50 theaters across the country, serving 
                                thousands of theater lovers and processing hundreds of thousands of tickets 
                                annually. Our platform continues to evolve, bringing innovation and convenience 
                                to the theater industry.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                We believe in the transformative power of live performances to inspire, 
                                entertain, and unite communities. Every day, we work passionately to make 
                                that magic accessible to more people.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-deepTeal/5 to-deepBlue/5 rounded-3xl p-8 shadow-xl border border-gray-100">
                                <div className="absolute -top-4 -left-4">
                                    <Quote className="h-12 w-12 text-deepTeal/30" />
                                </div>
                                <p className="text-xl italic text-gray-700 mb-6 relative z-10">
                                    "We're not just booking tickets; we're creating memories that last a lifetime. 
                                    Every show is an opportunity to bring joy and inspiration to our community."
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

            {/* Our Values */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            These principles guide everything we do at TheaterHUB
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
                                className="bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all group"
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
            <div className="bg-gray-50 py-20">
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
                                className="flex items-start gap-4 p-6 bg-white rounded-2xl hover:bg-white hover:shadow-xl transition-all group border border-gray-100"
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

            {/* Contact Options Section - Professional */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-deepTeal to-deepBlue mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            We're here to help! Choose how you'd like to reach us
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactOptions.map((option, index) => (
                            <motion.div
                                key={option.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200 hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-deepTeal to-deepBlue flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <option.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                                <p className="text-deepTeal font-medium mb-1">{option.details}</p>
                                <p className="text-xs text-gray-500">{option.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
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