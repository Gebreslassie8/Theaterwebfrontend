// src/pages/Home.tsx
import supabase from "../config/supabaseClient";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Star,
  Filter,
  Search,
  Ticket,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  SortAsc,
  SortDesc,
  CheckCircle,
  ChevronUp,
  Cookie,
} from "lucide-react";
import HeroBanner from "../components/UI/HeroBanner";
import EventCard from "../components/UI/EventCard";
import ShowFilter from "../components/UI/ShowFilter";

// i18n
import { useTranslation } from "react-i18next";

// Types
export interface ShowDate {
  date: string;
  time: string;
  availableSeats: number;
  price?: number;
}

export interface PosterUrls {
  poster: string;
  gallery: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: number;
  theater_id: string;
  venue?: string;
  poster_url: PosterUrls;
  images: {
    poster: string;
    gallery: string[];
  };
  cast?: string[];
  dates: ShowDate[];
  priceRange: {
    min: number;
    max: number;
  };
  status: string;
  isFeatured: boolean;
  rating?: number;
  reviews?: number;
  viewCount?: number;
}

interface SupabaseEvent {
  id: string;
  title: string;
  description: string | null;
  genre: string | null;
  duration_minutes: number | null;
  theater_id: string;
  poster_url: string | null;
  cast: string[] | null;
  price_min: number | null;
  price_max: number | null;
  status: string | null;
  is_featured: boolean | null;
  rating: number | null;
  review_count: number | null;
  view_count: number | null;
  theaters?: {
    legal_business_name: string;
  };
}

const ITEMS_PER_PAGE = 6;

// Transform function (unchanged)
const transformSupabaseEvent = (event: SupabaseEvent): Event => {
  const sampleDates: ShowDate[] = [
    {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      time: "19:30",
      availableSeats: Math.floor(Math.random() * 100) + 20,
      price: event.price_min || 50,
    },
    {
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      time: "14:00",
      availableSeats: Math.floor(Math.random() * 100) + 20,
      price: event.price_min || 50,
    },
  ];

  const posterUrl =
    event.poster_url ||
    "https://images.unsplash.com/photo-1511193311914-034c8c8a8f16?w=800&auto=format&fit=crop";

  return {
    id: event.id,
    title: event.title,
    description: event.description || "No description available",
    genre: event.genre || "General",
    duration: event.duration_minutes || 120,
    theater_id: event.theater_id,
    venue: event.theaters?.legal_business_name || "Unknown Theater",
    cast: event.cast || [],
    poster_url: {
      poster: posterUrl,
      gallery: [],
    },
    images: {
      poster: posterUrl,
      gallery: [],
    },
    dates: sampleDates,
    priceRange: {
      min: event.price_min || 0,
      max: event.price_max || 0,
    },
    status: event.status || "coming-soon",
    isFeatured: event.is_featured || false,
    rating: event.rating || undefined,
    reviews: event.review_count || undefined,
    viewCount: event.view_count || undefined,
  };
};

const Home: React.FC = () => {
  const { t } = useTranslation();   // <-- translation hook

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ------- Sort options with translated labels -------
  const sortOptions = [
    { value: "date", label: t("sortOptions.date"), icon: Calendar },
    { value: "name", label: t("sortOptions.name"), icon: SortAsc },
    { value: "price-low", label: t("sortOptions.priceLow"), icon: SortAsc },
    { value: "price-high", label: t("sortOptions.priceHigh"), icon: SortDesc },
    { value: "rating", label: t("sortOptions.rating"), icon: Star },
  ];

  // Fetch data from Supabase (unchanged)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: supabaseEvents, error: supabaseError } = await supabase
          .from("events")
          .select(
            `
            *,
            theaters:theater_id (
              legal_business_name
            )
            `,
          )
          .order("created_at", { ascending: false });

        if (supabaseError) throw supabaseError;

        if (supabaseEvents && supabaseEvents.length > 0) {
          const transformedEvents = supabaseEvents.map(transformSupabaseEvent);
          setEvents(transformedEvents);
          setFilteredEvents(transformedEvents);
        } else {
          setEvents([]);
          setFilteredEvents([]);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Cookie handlers (unchanged)
  const acceptAllCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({ functional: true, analytics: true, marketing: true })
    );
    setShowCookieConsent(false);
  };

  const rejectAllCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({ functional: false, analytics: false, marketing: false })
    );
    setShowCookieConsent(false);
  };

  const customizeCookies = () => {
    window.location.href = "/cookies";
  };

  // Filter & sort logic (unchanged)
  useEffect(() => {
    let results = [...events];

    if (selectedCategory !== "All") {
      results = results.filter((event) => event.genre === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((event) => {
        const title = event.title?.toLowerCase() || "";
        const description = event.description?.toLowerCase() || "";
        const venue = event.venue?.toLowerCase() || "";
        const castMatch =
          event.cast?.some((actor) => actor.toLowerCase().includes(query)) ||
          false;
        return (
          title.includes(query) ||
          description.includes(query) ||
          venue.includes(query) ||
          castMatch
        );
      });
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            (new Date(b.dates?.[0]?.date || 0).getTime() -
              new Date(a.dates?.[0]?.date || 0).getTime())
          );
        case "price-low":
          return (a.priceRange?.min ?? 0) - (b.priceRange?.min ?? 0);
        case "price-high":
          return (b.priceRange?.max ?? 0) - (a.priceRange?.max ?? 0);
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "name":
          return (a.title ?? "").localeCompare(b.title ?? "");
        default:
          return 0;
      }
    });

    setFilteredEvents(results);
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy, events]);

  // Pagination helpers
  const getCurrentPageEvents = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const currentEvents = getCurrentPageEvents();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 600, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 600, behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("date");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("Searching for:", searchQuery);
    }
  };

  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortBy);
    return option ? option.label : t("common.sortBy");
  };

  // Scroll to top
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Cookie consent timer
  useEffect(() => {
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setTimeout(() => setShowCookieConsent(true), 1000);
    }
  }, []);

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepTeal mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t("common.loadingEvents")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Ticket className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t("common.errorLoadingEvents")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-deepTeal text-white rounded-lg hover:bg-deepTeal/80 transition-colors"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pb-20">
      {/* Hero Section (dynamic, not translated because titles come from DB) */}
      <HeroBanner
        featuredShows={events
          .filter((event) => event.isFeatured)
          .map((event) => ({
            id: event.id,
            title: event.title,
            image: event.poster_url.poster,
            genre: event.genre,
            rating: event.rating || 0,
          }))}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Search & Filter Section */}
        <div className="mb-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* Search input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={t("common.searchPlaceholder")}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-deepTeal focus:border-transparent dark:text-white placeholder:text-gray-400 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full sm:w-48 px-4 py-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors shadow-sm flex items-center justify-between gap-2"
                >
                  <span className="truncate">{getCurrentSortLabel()}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 sm:left-0 mt-2 w-full sm:w-64 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 z-50 overflow-hidden"
                    >
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setIsSortOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center gap-3 ${
                              sortBy === option.value
                                ? "bg-deepTeal/10 text-deepTeal"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="flex-1">{option.label}</span>
                            {sortBy === option.value && <CheckCircle className="h-4 w-4 text-deepTeal" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filters Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-4 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap ${
                  showFilters
                    ? "bg-deepTeal text-white"
                    : "bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
                }`}
              >
                <Filter className="h-5 w-5" />
                <span>{t("common.filters")}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Active Filters (translatable) */}
            {(selectedCategory !== "All" || searchQuery) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-deepTeal/5 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-deepTeal">{t("common.activeFilters")}</span>
                  {selectedCategory !== "All" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-deepTeal/10 text-deepTeal rounded-full text-sm">
                      {t("common.category")}: {selectedCategory}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm">
                      "{searchQuery}"
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                >
                  {t("common.clearAll")}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <ShowFilter
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onClearFilters={handleClearFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events Grid */}
        {currentEvents.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("common.allEvents")}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("common.showing")} {(currentPage - 1) * ITEMS_PER_PAGE + 1} {t("common.to")}{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)} {t("common.of")}{" "}
                  {filteredEvents.length} {t("common.events")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                      currentPage === 1
                        ? "bg-gray-100 dark:bg-dark-800 text-gray-400 cursor-not-allowed"
                        : "bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-deepTeal"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{t("common.prev")}</span>
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span key={`dots-${idx}`} className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? "bg-deepTeal text-white shadow-md"
                            : "bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-deepTeal"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-100 dark:bg-dark-800 text-gray-400 cursor-not-allowed"
                        : "bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-deepTeal"
                    }`}
                  >
                    <span>{t("common.next")}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            )}
          </section>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 dark:bg-dark-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Ticket className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t("common.noEventsFound")}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t("common.tryAdjusting")}</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-deepTeal text-white rounded-lg hover:bg-deepTeal/80 transition-colors"
            >
              {t("common.clearFilters")}
            </button>
          </div>
        )}
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-deepTeal text-white rounded-full shadow-lg hover:bg-deepTeal/80 transition-all duration-200"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cookie Consent (fully translatable) */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
          >
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-deepTeal to-teal-600 rounded-lg">
                    <Cookie className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                      {t("cookieConsent.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t("cookieConsent.message")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={acceptAllCookies}
                    className="flex-1 px-4 py-2 bg-deepTeal text-white rounded-lg text-sm font-medium hover:bg-deepTeal/80 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {t("cookieConsent.acceptAll")}
                  </button>
                  <button
                    onClick={rejectAllCookies}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-200"
                  >
                    {t("cookieConsent.rejectAll")}
                  </button>
                  <button
                    onClick={customizeCookies}
                    className="px-4 py-2 text-deepTeal rounded-lg text-sm font-medium hover:bg-deepTeal/5 transition-all duration-200"
                  >
                    {t("cookieConsent.customize")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;