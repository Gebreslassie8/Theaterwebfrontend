// src/pages/Owner/events/ManageEvent.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  Search,
  LayoutGrid,
  Activity,
  CheckCircle,
  XCircle,
  MapPin,
  Film,
  Eye,
  Edit,
  Ban,
  RefreshCw,
  Trash2,
  Building,
  AlertCircle,
} from "lucide-react";
import ReusableTable from "../../../components/Reusable/ReusableTable";
import SuccessPopup from "../../../components/Reusable/SuccessPopup";
import CreateEventForm from "../../../components/EventForm/CreateEventForm";
import UpdateEventForm from "../../../components/EventForm/UpdateEventForm";
import { DeleteConfirmModal } from "../../../components/EmployeeForm/DeleteConfirmModal";
import { ViewEventModal } from "../../../components/EventForm/ViewEventModals";
import {
  EventData,
  halls,
  FormData,
} from "../../../components/EventForm/types";
import supabase from "@/config/supabaseClient";

interface Column {
  Header: string;
  accessor: string;
  Cell?: (row: EventData) => React.ReactNode;
}

interface UserData {
  id: string;
  email?: string;
  role?: string;
  theater_id?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ManageEvent: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [userTheater, setUserTheater] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Separate states for different actions
  const [selectedEventForView, setSelectedEventForView] =
    useState<EventData | null>(null);
  const [selectedEventForEdit, setSelectedEventForEdit] =
    useState<EventData | null>(null);
  const [selectedEventForDelete, setSelectedEventForDelete] =
    useState<EventData | null>(null);
  const [selectedEventForReactivate, setSelectedEventForReactivate] =
    useState<EventData | null>(null);
  const [eventToCancel, setEventToCancel] = useState<EventData | null>(null);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);

  // Get current user from session/local storage
  const getCurrentUser = useCallback(async () => {
    try {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (!userStr) {
        console.error("No user found in storage");
        return null;
      }

      const user = JSON.parse(userStr) as UserData;
      console.log("User found:", user);
      setCurrentUser(user);
      setUserRole(user.role || "");
      return user;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }, []);

  // Get theater ID based on user role
  const getTheaterIdByRole = useCallback(async (user: UserData) => {
    const role = user.role;
    console.log("User role:", role);

    // Case 1: Admin - can access all theaters (for now, return first theater or handle differently)
    if (role === "admin") {
      console.log("Admin user - fetching first available theater");
      const { data: theater, error } = await supabase
        .from("theaters")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching theater for admin:", error);
        return null;
      }
      return theater?.id || null;
    }

    // Case 2: Theater Owner or Owner - get theater_id from theaters table using owner_user_id
    if (role === "theater_owner" || role === "owner") {
      console.log(
        "Theater owner user - fetching from theaters table using owner_user_id",
      );
      const { data: theaterData, error: theaterError } = await supabase
        .from("theaters")
        .select("id, legal_business_name")
        .eq("owner_user_id", user.id)
        .maybeSingle();

      if (theaterError) {
        console.error("Error fetching theater for owner:", theaterError);
      }

      if (theaterData?.id) {
        console.log("Found theater_id from theaters table:", theaterData.id);
        // Also store the theater name for later use
        return theaterData.id;
      }
    }

    // Case 3: Manager, Sales, QR Scanner, or other employees - get theater_id from employees table
    if (["manager", "sales", "qr_scanner", "employee"].includes(role || "")) {
      console.log("Employee user - fetching from employees table");
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("theater_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (employeeError) {
        console.error("Error fetching employee:", employeeError);
      }

      if (employeeData?.theater_id) {
        console.log(
          "Found theater_id from employees table:",
          employeeData.theater_id,
        );
        return employeeData.theater_id;
      }
    }

    // Fallback: Check if user object has theater_id directly
    if (user.theater_id) {
      console.log("Found theater_id in user session:", user.theater_id);
      return user.theater_id;
    }

    console.warn("No theater ID found for user with role:", role);
    return null;
  }, []);

  // Fetch theater details by ID
  const fetchTheaterDetails = useCallback(async (theaterId: string) => {
    try {
      const { data: theater, error } = await supabase
        .from("theaters")
        .select("id, legal_business_name")
        .eq("id", theaterId)
        .single();

      if (error) {
        console.error("Error fetching theater details:", error);
        return null;
      }

      return {
        id: theater.id,
        name: theater.legal_business_name,
      };
    } catch (error) {
      console.error("Error fetching theater details:", error);
      return null;
    }
  }, []);

  // Fetch events for a theater
  const fetchEventsForTheater = useCallback(async (theaterId: string) => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("theater_id", theaterId)
        .order("created_at", { ascending: false });

      if (eventsError) throw eventsError;

      // Transform to EventData format with UI fields
      return (eventsData || []).map((event) => ({
        ...event,
        id: event.id,
        title: event.title,
        description: event.description || "",
        genre: event.genre || "",
        category: event.category || "",
        duration_minutes: event.duration_minutes || 0,
        director: event.director || "",
        cast: event.cast || [],
        poster_url: event.poster_url || "",
        price_min: event.price_min || 0,
        price_max: event.price_max || 0,
        status: event.status || "coming-soon",
        is_featured: event.is_featured || false,
        rating: event.rating || 0,
        review_count: event.review_count || 0,
        view_count: event.view_count || 0,
        theater_id: event.theater_id,
        created_at: event.created_at,
        updated_at: event.updated_at,
        timeSlots: [
          {
            id: "1",
            date: new Date().toISOString().split("T")[0],
            startTime: "19:00",
            endTime: "22:00",
          },
        ],
        hall: "Grand Hall",
        seatCategories:
          halls[0]?.seatTypes.map((st, idx) => ({
            id: `seat-${idx}`,
            name: st.name,
            price: event.price_min || 50,
            capacity: st.capacity,
            booked: Math.floor(Math.random() * st.capacity),
            commissionPercent: 10,
          })) || [],
        ageRestriction: "All Ages",
        contactEmail: "contact@example.com",
        contactPhone: "+251-11-123-4567",
        website: "",
        organizer: event.director || "Theater Owner",
        contractDate: new Date().toISOString().split("T")[0],
        contractReference: `CTR-${event.id?.slice(0, 8)}`,
        totalBookedSeats: Math.floor(Math.random() * 500),
        totalRevenue: Math.floor(Math.random() * 50000),
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }, []);

  // Main fetch function
  const fetchUserAndEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get user from storage
      const user = await getCurrentUser();
      if (!user) {
        console.log("No user found, skipping fetch");
        setUserTheater(null);
        setEvents([]);
        setIsLoading(false);
        return;
      }

      // Get theater ID based on role
      const theaterId = await getTheaterIdByRole(user);

      if (!theaterId) {
        console.log("No theater assigned to this user");
        setUserTheater(null);
        setEvents([]);
        setIsLoading(false);
        return;
      }

      // Update user session with theater_id if not present
      if (!user.theater_id) {
        const updatedUser = { ...user, theater_id: theaterId };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      // Fetch theater details
      const theater = await fetchTheaterDetails(theaterId);
      if (theater) {
        setUserTheater(theater);
      } else {
        setUserTheater(null);
        setEvents([]);
        setIsLoading(false);
        return;
      }

      // Fetch events for this theater
      const eventsList = await fetchEventsForTheater(theaterId);
      setEvents(eventsList);
    } catch (error) {
      console.error("Error fetching data:", error);
      setUserTheater(null);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    getCurrentUser,
    getTheaterIdByRole,
    fetchTheaterDetails,
    fetchEventsForTheater,
  ]);

  useEffect(() => {
    fetchUserAndEvents();
  }, [fetchUserAndEvents]);

  const filteredEvents = events.filter((e) => {
    const matchSearch = e.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: events.length,
    ongoing: events.filter((e) => e.status === "now-showing").length,
    completed: events.filter((e) => e.status === "ended").length,
    cancelled: events.filter((e) => e.status === "cancelled").length,
  };

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setShowCancelModal(false);
    setShowReasonModal(false);
    setSelectedEventForView(null);
    setSelectedEventForEdit(null);
    setSelectedEventForDelete(null);
    setSelectedEventForReactivate(null);
    setEventToCancel(null);
    setCancelReason("");
  };

  const handleCreateEventSubmit = async (formData: FormData) => {
    if (!userTheater) {
      setSuccessMessage(
        "No theater assigned to your account. Please contact administrator.",
      );
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      return;
    }
    const posterUrl = formData.poster_url || null;
    await handleCreateEvent(formData, posterUrl);
  };

  const handleCreateEvent = async (
    formData: FormData,
    posterUrl: string | null,
  ) => {
    if (!userTheater || !currentUser) {
      setSuccessMessage(
        "Cannot create event: No theater assigned or user not found.",
      );
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      return;
    }

    try {
      const newEvent = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        category: formData.category,
        duration_minutes: formData.duration_minutes,
        director: formData.director,
        cast: formData.cast,
        poster_url: posterUrl || formData.poster_url,
        price_min: formData.price_min,
        price_max: formData.price_max,
        status: formData.status,
        is_featured: formData.is_featured,
        theater_id: userTheater.id,
        published_by: currentUser.id,
        rating: 0,
        review_count: 0,
        view_count: 0,
      };

      const { error } = await supabase.from("events").insert([newEvent]);

      if (error) throw error;

      await fetchUserAndEvents();
      closeAllModals();
      setSuccessMessage(`✨ Event "${formData.title}" created successfully!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error creating event:", error);
      setSuccessMessage("Failed to create event. Please try again.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleUpdateEvent = async (formData: FormData) => {
    if (!selectedEventForEdit) return;

    try {
      const { error } = await supabase
        .from("events")
        .update({
          title: formData.title,
          description: formData.description,
          genre: formData.genre,
          category: formData.category,
          duration_minutes: formData.duration_minutes,
          director: formData.director,
          cast: formData.cast,
          price_min: formData.price_min,
          price_max: formData.price_max,
          status: formData.status,
          is_featured: formData.is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedEventForEdit.id);

      if (error) throw error;

      await fetchUserAndEvents();
      closeAllModals();
      setSuccessMessage(`✏️ Event "${formData.title}" updated successfully!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error updating event:", error);
      setSuccessMessage("Failed to update event. Please try again.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEventForDelete) return;

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", selectedEventForDelete.id);

      if (error) throw error;

      await fetchUserAndEvents();
      closeAllModals();
      setSuccessMessage(
        `🗑️ Event "${selectedEventForDelete.title}" deleted successfully!`,
      );
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error deleting event:", error);
      setSuccessMessage("Failed to delete event. Please try again.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleCancelWithReason = async () => {
    if (!eventToCancel) return;

    try {
      const { error } = await supabase
        .from("events")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", eventToCancel.id);

      if (error) throw error;

      await fetchUserAndEvents();
      closeAllModals();
      setSuccessMessage(
        `⚠️ Event "${eventToCancel.title}" has been cancelled. Reason: ${cancelReason}`,
      );
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error cancelling event:", error);
      setSuccessMessage("Failed to cancel event. Please try again.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleReactivateEvent = async () => {
    if (!selectedEventForReactivate) return;

    try {
      const { error } = await supabase
        .from("events")
        .update({ status: "coming-soon", updated_at: new Date().toISOString() })
        .eq("id", selectedEventForReactivate.id);

      if (error) throw error;

      await fetchUserAndEvents();
      closeAllModals();
      setSuccessMessage(
        `✅ Event "${selectedEventForReactivate.title}" has been reactivated!`,
      );
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error reactivating event:", error);
      setSuccessMessage("Failed to reactivate event. Please try again.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const openViewModal = (event: EventData) => {
    setSelectedEventForView(event);
    setShowViewModal(true);
  };

  const openEditModal = (event: EventData) => {
    setSelectedEventForEdit(event);
    setShowUpdateModal(true);
  };

  const openCancelModal = (event: EventData) => {
    setEventToCancel(event);
    setCancelReason("");
    setShowReasonModal(true);
  };

  const openReactivateModal = (event: EventData) => {
    setSelectedEventForReactivate(event);
    setShowCancelModal(true);
  };

  const openDeleteModal = (event: EventData) => {
    setSelectedEventForDelete(event);
    setShowDeleteModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "now-showing":
        return "bg-green-100 text-green-700";
      case "ended":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "coming-soon":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "now-showing":
        return <Activity className="h-3 w-3" />;
      case "ended":
        return <CheckCircle className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      case "coming-soon":
        return <Calendar className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "now-showing":
        return "Now Showing";
      case "ended":
        return "Ended";
      case "cancelled":
        return "Cancelled";
      case "coming-soon":
        return "Coming Soon";
      default:
        return status;
    }
  };

  const columns: Column[] = [
    {
      Header: "Event Name",
      accessor: "title",
      Cell: (row: EventData) => (
        <div className="flex items-center gap-3">
          {row.poster_url ? (
            <img
              src={row.poster_url}
              alt={row.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <Film className="h-5 w-5 text-white" />
            </div>
          )}
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-gray-500">{row.genre}</p>
          </div>
        </div>
      ),
    },
    {
      Header: "Schedule",
      accessor: "timeSlots",
      Cell: (row: EventData) => (
        <div>
          {row.timeSlots && row.timeSlots[0] ? (
            <>
              {new Date(row.timeSlots[0].date).toLocaleDateString()}
              <br />
              <span className="text-xs text-gray-500">
                {row.timeSlots[0].startTime} - {row.timeSlots[0].endTime}
              </span>
            </>
          ) : (
            "TBD"
          )}
        </div>
      ),
    },
    {
      Header: "Venue",
      accessor: "hall",
      Cell: (row: EventData) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{row.hall || "Main Hall"}</span>
        </div>
      ),
    },
    {
      Header: "Revenue",
      accessor: "totalRevenue",
      Cell: (row: EventData) => (
        <span className="text-green-600 font-semibold">
          ETB {(row.totalRevenue || 0).toLocaleString()}
        </span>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row: EventData) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}
        >
          {getStatusIcon(row.status)} {getStatusLabel(row.status)}
        </span>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (row: EventData) => (
        <div className="flex gap-2">
          <button
            onClick={() => openViewModal(row)}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition"
            title="Edit Event"
          >
            <Edit className="h-4 w-4 text-teal-600" />
          </button>
          {row.status === "cancelled" ? (
            <button
              onClick={() => openReactivateModal(row)}
              className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition"
              title="Reactivate Event"
            >
              <RefreshCw className="h-4 w-4 text-green-600" />
            </button>
          ) : (
            row.status !== "ended" && (
              <button
                onClick={() => openCancelModal(row)}
                className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition"
                title="Cancel Event"
              >
                <Ban className="h-4 w-4 text-orange-600" />
              </button>
            )
          )}
          <button
            onClick={() => openDeleteModal(row)}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition"
            title="Delete Event"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Show no theater assigned message
  if (!userTheater) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="h-10 w-10 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Theater Assigned
          </h2>
          <p className="text-gray-600 mb-4">
            Your account doesn't have a theater assigned yet. Please contact
            your administrator to assign a theater to your account.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg text-left">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Need Help?</span>
            </div>
            <p className="text-sm text-yellow-700">
              Contact your system administrator to get your account linked to a
              theater.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Theater Info */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Event Management
                </h1>
                <p className="text-sm text-gray-500">
                  Create, manage and track all events
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <Building className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">
                {userTheater.name}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Events"
            value={stats.total}
            icon={Calendar}
            color="from-teal-500 to-teal-600"
          />
          <StatCard
            title="Now Showing"
            value={stats.ongoing}
            icon={Activity}
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Ended"
            value={stats.completed}
            icon={CheckCircle}
            color="from-purple-500 to-pink-600"
          />
          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            icon={XCircle}
            color="from-red-500 to-rose-600"
          />
        </div>

        {/* Search, Filter, and Create Event */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="now-showing">Now Showing</option>
              <option value="coming-soon">Coming Soon</option>
              <option value="ended">Ended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>

        {/* Events Table */}
        <ReusableTable
          columns={columns}
          data={filteredEvents}
          icon={LayoutGrid}
          showSearch={false}
          showExport={false}
          itemsPerPage={10}
        />

        {/* Modals */}
        {showCreateModal && (
          <CreateEventForm
            onSubmit={handleCreateEventSubmit}
            onCancel={() => closeAllModals()}
            theaters={[
              {
                id: userTheater.id,
                legal_business_name: userTheater.name,
                trade_name: userTheater.name,
                city: "",
              },
            ]}
            selectedTheaterId={userTheater.id}
          />
        )}

        {showUpdateModal && selectedEventForEdit && (
          <UpdateEventForm
            event={selectedEventForEdit}
            onSubmit={handleUpdateEvent}
            onCancel={() => closeAllModals()}
          />
        )}

        {showViewModal && selectedEventForView && (
          <ViewEventModal
            event={selectedEventForView}
            isOpen={showViewModal}
            onClose={() => closeAllModals()}
          />
        )}

        {/* Delete Modal */}
        <DeleteConfirmModal
          employee={
            selectedEventForDelete
              ? {
                  id: selectedEventForDelete.id,
                  name: selectedEventForDelete.title,
                }
              : null
          }
          onConfirm={handleDeleteEvent}
          onCancel={() => closeAllModals()}
        />

        {/* Cancel with Reason Modal */}
        {showReasonModal && eventToCancel && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Ban className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Cancel Event
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel{" "}
                <strong>{eventToCancel.title}</strong>?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this event..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => closeAllModals()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelWithReason}
                  disabled={!cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reactivate/Restore Modal */}
        {showCancelModal && selectedEventForReactivate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Reactivate Event
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reactivate{" "}
                <strong>{selectedEventForReactivate.title}</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => closeAllModals()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReactivateEvent}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Reactivate Event
                </button>
              </div>
            </div>
          </div>
        )}

        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          type="success"
          title="Success"
          message={successMessage}
          duration={3000}
        />
      </div>
    </motion.div>
  );
};

export default ManageEvent;