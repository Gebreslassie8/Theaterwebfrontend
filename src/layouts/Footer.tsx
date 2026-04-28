import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, Clock, ChevronRight, Shield, HelpCircle, FileText, CreditCard, Truck, Star, Globe, Lock, Award, Film, Gift, CheckCircle, XCircle, Sparkles, PartyPopper, Smile, ThumbsUp } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ type: '', title: '', message: '', icon: null });

  const quickLinks = [
    { to: '/about', label: 'About Us', icon: Star },
    { to: '/blog', label: 'Blog', icon: FileText },
    { to: '/gallery', label: 'Gallery', icon: Film },
  ];

  const supportLinks = [
    { to: '/help', label: 'Help Center', icon: HelpCircle },
    { to: '/contact', label: 'Contact Us', icon: Mail },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },

  ];

  const legalLinks = [
    { to: '/terms', label: 'Terms of Service', icon: FileText },
    { to: '/privacy', label: 'Privacy Policy', icon: Shield },
    { to: '/cookies', label: 'Cookie Policy', icon: Lock }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', brandColor: '#1877F2', label: 'Facebook' },
    { icon: Twitter, href: '#', brandColor: '#1DA1F2', label: 'Twitter' },
    { icon: Instagram, href: '#', brandColor: '#E4405F', label: 'Instagram' },
    { icon: Youtube, href: '#', brandColor: '#FF0000', label: 'YouTube' },
    { icon: Linkedin, href: '#', brandColor: '#0A66C2', label: 'LinkedIn' }
  ];

  const chapaPaymentMethods = [
    { name: 'Tele Birr', icon: '📱', description: 'Mobile Money' },
    { name: 'CBE Birr', icon: '🏦', description: 'Commercial Bank' },
    { name: 'HelloCash', icon: '💸', description: 'Cash' }
  ];

  const showSuccessPopup = () => {
    setPopupMessage({
      type: 'success',
      title: '🎉 Welcome to TheaterHUB Family!',
      message: 'You\'ve successfully subscribed! Get ready for exclusive deals, early bird tickets, and amazing giveaways delivered straight to your inbox.',
      icon: PartyPopper
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
  };

  const showErrorPopup = (errorMessage: string) => {
    setPopupMessage({
      type: 'error',
      title: '❌ Oops! Something went wrong',
      message: errorMessage,
      icon: XCircle
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 4000);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      showErrorPopup('Please enter your email address to receive amazing offers!');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showErrorPopup('Please enter a valid email address. Example: name@domain.com');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');

      if (subscriptions.includes(email)) {
        showErrorPopup('This email is already subscribed! You\'re already part of our VIP family 🎭');
      } else {
        subscriptions.push(email);
        localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));

        setSubscriptionStatus({
          type: 'success',
          message: 'Successfully subscribed! Check your email for confirmation.'
        });
        setEmail('');
        showSuccessPopup();
      }

      setIsSubmitting(false);
      setTimeout(() => setSubscriptionStatus(null), 5000);
    }, 1000);
  };

  return (
    <>
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">

            {/* Column 1: Brand & Contact */}
            <div className="space-y-5">
              <Link to="/" className="flex items-center space-x-2 group">
                <span className="text-4xl transform group-hover:scale-110 transition-transform">🎭</span>
                <span className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  TheaterHUB
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your premier destination for movie tickets and theater experiences. Book your seats online with ease.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-gray-400 hover:text-teal-400 transition-colors group">
                  <MapPin className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">123 Broadway, New York, NY 10001, USA</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 hover:text-teal-400 transition-colors group">
                  <Phone className="h-5 w-5 text-teal-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 hover:text-teal-400 transition-colors group">
                  <Mail className="h-5 w-5 text-teal-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">support@theaterhub.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 hover:text-teal-400 transition-colors group">
                  <Clock className="h-5 w-5 text-teal-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Mon-Sun: 9:00 AM - 11:00 PM</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-white relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-teal-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-colors group"
                      >
                        <Icon className="h-4 w-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 3: Support & Legal */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-white relative inline-block">
                Support
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-teal-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3 mb-6">
                {supportLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-colors group"
                      >
                        <Icon className="h-4 w-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <h3 className="text-lg font-bold text-white relative inline-block">
                Legal
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-teal-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-colors group"
                      >
                        <Icon className="h-4 w-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 4: Newsletter & Social */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-white relative inline-block">
                Newsletter
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-teal-500 rounded-full"></span>
              </h3>
              <p className="text-gray-400 text-sm">
                Subscribe to get special offers, free giveaways, and exclusive deals.
              </p>

              {/* Subscription Form */}
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-3 rounded-lg hover:from-teal-500 hover:to-teal-600 transition-all font-medium shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Gift className="h-5 w-5" />
                      <span>Subscribe & Get 10% Off</span>
                    </>
                  )}
                </button>
              </form>

              {/* Social Media Icons */}
              <div className="pt-4">
                <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className="bg-gray-800 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group"
                        style={{
                          hover: { backgroundColor: social.brandColor }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = social.brandColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#1F2937';
                        }}
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods & Trust Badges */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">We Accept:</span>
                <div className="flex flex-wrap gap-3">
                  {chapaPaymentMethods.map((method) => (
                    <div key={method.name} className="group relative">
                      <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm text-gray-400 border border-gray-700 hover:border-teal-500 hover:text-teal-400 transition-all cursor-help flex items-center gap-2">
                        <span className="text-lg">{method.icon}</span>
                        <span>{method.name}</span>
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {method.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400 text-center md:text-left">
                © {currentYear} TheaterHUB. All rights reserved.
              </div>
              <div className="flex items-center flex-wrap justify-center gap-6">
                <Link to="/terms" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                  Terms
                </Link>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                  Privacy
                </Link>
                <Link to="/cookies" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">
                  Cookies
                </Link>

              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Attractive Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPopup(false)}></div>
          <div className={`relative bg-gradient-to-br ${popupMessage.type === 'success'
            ? 'from-teal-500 to-emerald-600'
            : 'from-red-500 to-rose-600'
            } rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-slideUp`}>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-white/20 p-4 rounded-full">
                  {popupMessage.icon && <popupMessage.icon className="h-12 w-12 text-white" />}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                {popupMessage.title}
              </h3>

              <p className="text-white/90 text-sm leading-relaxed mb-6">
                {popupMessage.message}
              </p>

              {popupMessage.type === 'success' && (
                <div className="bg-white/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-2 text-white text-sm">
                    <Sparkles className="h-4 w-4" />
                    <span>🎁 You've earned a 10% discount code: <strong className="font-mono">WELCOME10</strong></span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowPopup(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${popupMessage.type === 'success'
                  ? 'bg-white text-teal-600 hover:bg-gray-100'
                  : 'bg-white text-red-600 hover:bg-gray-100'
                  }`}
              >
                {popupMessage.type === 'success' ? 'Start Exploring 🎭' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIXED: Removed the jsx attribute from style tag */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  );
};

export default Footer;