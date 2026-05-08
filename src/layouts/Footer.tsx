// frontend/src/layouts/Footer.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Shield,
  HelpCircle,
  FileText,
  Star,
  Lock,
  Film,
  Gift,
  XCircle,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Types
interface SocialLink {
  icon: React.ElementType;
  href: string;
  brandColor: string;
  label: string;
  bgHover: string;
}

interface NavLink {
  to: string;
  labelKey: string;          // <-- changed from label to translation key
  icon: React.ElementType;
}

interface PopupMessage {
  type: "success" | "error";
  title: string;
  message: string;
  icon: React.ElementType | null;
}

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<PopupMessage>({
    type: "success",
    title: "",
    message: "",
    icon: null,
  });

  // Quick links – using translation keys
  const quickLinks: NavLink[] = [
    { to: "/about", labelKey: "footer.quickLinks.about", icon: Star },
    { to: "/blogs", labelKey: "footer.quickLinks.blog", icon: FileText },
    { to: "/gallery", labelKey: "footer.quickLinks.gallery", icon: Film },
  ];

  const supportLinks: NavLink[] = [
    { to: "/help", labelKey: "footer.support.helpCenter", icon: HelpCircle },
    { to: "/contact", labelKey: "footer.support.contactUs", icon: Mail },
  ];

  const legalLinks: NavLink[] = [
    { to: "/terms", labelKey: "footer.legal.terms", icon: FileText },
    { to: "/privacy", labelKey: "footer.legal.privacy", icon: Shield },
    { to: "/cookies", labelKey: "footer.legal.cookies", icon: Lock },
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: Facebook,
      href: "#",
      brandColor: "#1877F2",
      label: "Facebook",
      bgHover: "hover:bg-[#1877F2]",
    },
    {
      icon: Twitter,
      href: "#",
      brandColor: "#1DA1F2",
      label: "Twitter",
      bgHover: "hover:bg-[#1DA1F2]",
    },
    {
      icon: Instagram,
      href: "#",
      brandColor: "#E4405F",
      label: "Instagram",
      bgHover: "hover:bg-[#E4405F]",
    },
    {
      icon: Youtube,
      href: "#",
      brandColor: "#FF0000",
      label: "YouTube",
      bgHover: "hover:bg-[#FF0000]",
    },
    {
      icon: Linkedin,
      href: "#",
      brandColor: "#0A66C2",
      label: "LinkedIn",
      bgHover: "hover:bg-[#0A66C2]",
    },
  ];

  const showSuccessPopup = (): void => {
    setPopupMessage({
      type: "success",
      title: t("footer.popup.successTitle"),
      message: t("footer.popup.successMessage"),
      icon: PartyPopper,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
  };

  const showErrorPopup = (errorMessage: string): void => {
    setPopupMessage({
      type: "error",
      title: t("footer.popup.errorTitle"),
      message: errorMessage,
      icon: XCircle,
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 4000);
  };

  const handleSubscribe = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!email) {
      showErrorPopup(t("footer.errors.emailRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorPopup(t("footer.errors.invalidEmail"));
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const subscriptions: string[] = JSON.parse(
        localStorage.getItem("newsletter_subscriptions") || "[]",
      );

      if (subscriptions.includes(email)) {
        showErrorPopup(t("footer.errors.alreadySubscribed"));
      } else {
        subscriptions.push(email);
        localStorage.setItem(
          "newsletter_subscriptions",
          JSON.stringify(subscriptions),
        );
        setEmail("");
        showSuccessPopup();
      }

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
            {/* Column 1: Brand & Contact */}
            <div className="space-y-6">
              <Link to="/" className="block group">
                <div className="relative">
                  <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-500 group-hover:w-full transition-all duration-500"></div>
                  <h2 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                      {t("footer.brand.name")}
                    </span>
                    <span className="block text-xs text-teal-400/70 mt-0.5 tracking-wide">
                      {t("footer.brand.tagline")}
                    </span>
                  </h2>
                </div>
              </Link>

              <div className="space-y-3">
                {/* Location Card */}
                <div className="group relative overflow-hidden bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-3 border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/5 group-hover:to-emerald-500/5 transition-all duration-500"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                      <MapPin className="h-4 w-4 text-teal-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-teal-400/70 font-mono tracking-wider">
                        {t("footer.contact.locationLabel")}
                      </p>
                      <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {t("footer.contact.locationValue")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="group relative overflow-hidden bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-3 border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/5 group-hover:to-emerald-500/5 transition-all duration-500"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                      <Phone className="h-4 w-4 text-teal-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-teal-400/70 font-mono tracking-wider">
                        {t("footer.contact.phoneLabel")}
                      </p>
                      <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {t("footer.contact.phoneValue")}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t("footer.contact.supportHours")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="group relative overflow-hidden bg-gray-800/40 hover:bg-gray-800/60 rounded-xl p-3 border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/5 group-hover:to-emerald-500/5 transition-all duration-500"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                      <Mail className="h-4 w-4 text-teal-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-teal-400/70 font-mono tracking-wider">
                        {t("footer.contact.emailLabel")}
                      </p>
                      <p className="text-sm text-gray-300 group-hover:text-white transition-colors break-all">
                        {t("footer.contact.emailValue")}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t("footer.contact.responseTime")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-white relative inline-block">
                {t("footer.quickLinks.title")}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-all duration-300 group"
                      >
                        <Icon className="h-4 w-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
                        <span className="group-hover:translate-x-1 transition-transform inline-block">
                          {t(link.labelKey)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 3: Support & Legal */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-white relative inline-block">
                {t("footer.support.title")}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3 mb-6">
                {supportLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-all duration-300 group"
                      >
                        <Icon className="h-4 w-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
                        <span className="group-hover:translate-x-1 transition-transform inline-block">
                          {t(link.labelKey)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <h3 className="text-lg font-bold text-white relative inline-block">
                {t("footer.legal.title")}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-all duration-300 group"
                      >
                        <Icon className="h-4 w-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
                        <span className="group-hover:translate-x-1 transition-transform inline-block">
                          {t(link.labelKey)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 4: Newsletter & Social */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-white relative inline-block">
                {t("footer.newsletter.title")}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></span>
              </h3>
              <p className="text-gray-400 text-sm bg-gradient-to-r from-teal-500/10 to-emerald-500/10 p-3 rounded-lg border border-teal-500/20">
                📧 {t("footer.newsletter.description")}
              </p>

              <form
                onSubmit={handleSubscribe}
                className="flex flex-col space-y-3"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("footer.newsletter.placeholder")}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-teal-500 hover:to-emerald-500 transition-all font-medium shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t("footer.newsletter.subscribing")}</span>
                    </>
                  ) : (
                    <>
                      <Gift className="h-5 w-5" />
                      <span>{t("footer.newsletter.subscribe")}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4">
                <h3 className="text-lg font-bold text-white mb-4">
                  {t("footer.social.title")}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 bg-gray-800 ${social.bgHover} group`}
                        style={{ backgroundColor: "#1F2937" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            social.brandColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#1F2937";
                        }}
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400 text-center md:text-left">
                <span>© {currentYear} {t("footer.copyright")}</span>
              </div>
              <div className="flex items-center flex-wrap justify-center gap-6">
                <Link
                  to="/terms"
                  className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                >
                  {t("footer.bottomLinks.terms")}
                </Link>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                >
                  {t("footer.bottomLinks.privacy")}
                </Link>
                <Link
                  to="/cookies"
                  className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                >
                  {t("footer.bottomLinks.cookies")}
                </Link>
                <Link
                  to="/accessibility"
                  className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                >
                  {t("footer.bottomLinks.accessibility")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          ></div>
          <div
            className={`relative bg-gradient-to-br ${
              popupMessage.type === "success"
                ? "from-teal-500 to-emerald-600"
                : "from-red-500 to-rose-600"
            } rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-slideUp`}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-white/20 p-4 rounded-full">
                  {popupMessage.icon && (
                    <popupMessage.icon className="h-12 w-12 text-white" />
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                {popupMessage.title}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                {popupMessage.message}
              </p>

              {popupMessage.type === "success" && (
                <div className="bg-white/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-2 text-white text-sm">
                    <Sparkles className="h-4 w-4" />
                    <span>{t("footer.popup.successBadge")}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowPopup(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  popupMessage.type === "success"
                    ? "bg-white text-teal-600 hover:bg-gray-100"
                    : "bg-white text-red-600 hover:bg-gray-100"
                }`}
              >
                {popupMessage.type === "success"
                  ? t("footer.popup.buttonSuccess")
                  : t("footer.popup.buttonError")}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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