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
  Clock,
} from "lucide-react";
import ReusableTable from "../../../components/Reusable/ReusableTable";
import SuccessPopup from "../../../components/Reusable/SuccessPopup";
import CreateEventForm from "../../../components/EventForm/CreateEventForm";
import UpdateEventForm from "../../../components/EventForm/UpdateEventForm";
import { DeleteConfirmModal } from "../../../components/EmployeeForm/DeleteConfirmModal";
import { ViewEventModal } from "../../../components/EventForm/ViewEventModals";
import supabase from "@/config/supabaseClient";

interface Event {
  id: string;
  title: string;
  description: string | null;
  genre: string | null;
  category: string | null;
  duration_minutes: number | null;
  director: string | null;
  cast: string[];
  poster_url: string | null;
  status: "coming-soon" | "now-showing" | "ended" | "cancelled";
  is_featured: boolean;
  rating: number;
  review_count: number;
  view_count: number;
  theater_id: string;
  created_at: string;
  updated_at: string;
  published_by: string | null;
  schedules?: Schedule[];
}

interface Schedule {
  id: string;
  event_id: string;
  hall_id: string;
  show_date: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  hall?: {
    id: string;
    name: string;
  };
}

interface UserData {
  id: string;
  email?: string;
  role?: string;
  theater_id?: string;
}

interface Column {
  Header: string;
  accessor: string;
  Cell?: (row: Event) => React.ReactNode;
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
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [userTheater, setUserTheater] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [selectedEventForView, setSelectedEventForView] =
    useState<Event | null>(null);
  const [selectedEventForEdit, setSelectedEventForEdit] =
    useState<Event | null>(null);
  const [selectedEventForDelete, setSelectedEventForDelete] =
    useState<Event | null>(null);
  const [selectedEventForReactivate, setSelectedEventForReactivate] =
    useState<Event | null>(null);
  const [eventToCancel, setEventToCancel] = useState<Event | null>(null);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);

  // Helper functions
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  // Get current user from storage
  const getCurrentUser = useCallback(async () => {
    try {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (!userStr) return null;
      const user = JSON.parse(userStr) as UserData;
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }, []);

  // Get theater ID based on user role
  const getTheaterIdByRole = useCallback(async (user: UserData) => {
    const role = user.role;

    if (role === "admin") {
      const { data: theater } = await supabase
        .from("theaters")
        .select("id")
        .limit(1)
        .maybeSingle();
      return theater?.id || null;
    }

    if (role === "theater_owner" || role === "owner") {
      const { data: theaterData } = await supabase
        .from("theaters")
        .select("id")
        .eq("owner_user_id", user.id)
        .maybeSingle();
      return theaterData?.id || null;
    }

    if (
      [
        "manager",
        "sales",
        "qr_scanner",
        "employee",
        "theater_manager",
      ].includes(role || "")
    ) {
      const { data: employeeData } = await supabase
        .from("employees")
        .select("theater_id")
        .eq("user_id", user.id)
        .maybeSingle();
      return employeeData?.theater_id || user.theater_id || null;
    }

    return user.theater_id || null;
  }, []);

  // Fetch theater details
  const fetchTheaterDetails = useCallback(async (theaterId: string) => {
    const { data: theater } = await supabase
      .from("theaters")
      .select("id, legal_business_name")
      .eq("id", theaterId)
      .single();
    return theater
      ? { id: theater.id, name: theater.legal_business_name }
      : null;
  }, []);

  // Fetch events with their schedules
  const fetchEventsWithSchedules = useCallback(async (theaterId: string) => {
    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("theater_id", theaterId)
        .order("created_at", { ascending: false });

      if (eventsError) throw eventsError;

      if (!eventsData || eventsData.length === 0) return [];

      // Fetch schedules for all events
      const eventIds = eventsData.map((e) => e.id);
      const { data: schedulesData } = await supabase
        .from("show_schedules")
        .select(
          `
          *,
          hall:halls(id, name)
        `,
        )
        .in("event_id", eventIds)
        .eq("is_active", true)
        .order("show_date", { ascending: true });

      // Group schedules by event_id
      const schedulesMap = new Map<string, Schedule[]>();
      schedulesData?.forEach((schedule: any) => {
        if (!schedulesMap.has(schedule.event_id)) {
          schedulesMap.set(schedule.event_id, []);
        }
        schedulesMap.get(schedule.event_id)!.push({
          ...schedule,
          hall: schedule.hall,
        });
      });

      // Combine events with their schedules
      return eventsData.map((event) => ({
        ...event,
        schedules: schedulesMap.get(event.id) || [],
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
      const user = await getCurrentUser();
      if (!user) {
        setUserTheater(null);
        setEvents([]);
        return;
      }

      const theaterId = await getTheaterIdByRole(user);
      if (!theaterId) {
        setUserTheater(null);
        setEvents([]);
        return;
      }

      if (!user.theater_id) {
        const updatedUser = { ...user, theater_id: theaterId };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      const theater = await fetchTheaterDetails(theaterId);
      setUserTheater(theater);

      const eventsList = await fetchEventsWithSchedules(theaterId);
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
    fetchEventsWithSchedules,
  ]);

  useEffect(() => {
    fetchUserAndEvents();
  }, [fetchUserAndEvents]);

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || event.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total: events.length,
    nowShowing: events.filter((e) => e.status === "now-showing").length,
    comingSoon: events.filter((e) => e.status === "coming-soon").length,
    ended: events.filter((e) => e.status === "ended").length,
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

  // Create event handler
  const handleCreateEvent = async (formData: any, posterUrl: string | null) => {
    if (!userTheater || !currentUser) {
      setSuccessMessage(
        "Cannot create event: No theater assigned or user not found.",
      );
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      return;
    }

    try {
      const { schedules: eventSchedules, ...eventData } = formData;

      // Create the event
      const newEvent = {
        title: eventData.title,
        description: eventData.description || null,
        genre: eventData.genre || null,
        category: eventData.category || null,
        duration_minutes: eventData.duration_minutes || null,
        director: eventData.director || null,
        cast: eventData.cast || [],
        poster_url: posterUrl || eventData.poster_url || null,
        status: eventData.status || "coming-soon",
        is_featured: eventData.is_featured || false,
        theater_id: userTheater.id,
        published_by: currentUser.id,
        rating: 0,
        review_count: 0,
        view_count: 0,
      };

      const { data: createdEvent, error: eventError } = await supabase
        .from("events")
        .insert([newEvent])
        .select()
        .single();

      if (eventError) throw eventError;

      // Create show schedules
      if (eventSchedules && eventSchedules.length > 0) {
        const scheduleRecords = eventSchedules.map((schedule: any) => ({
          event_id: createdEvent.id,
          hall_id: schedule.hallId,
          show_date: schedule.date,
          start_time: schedule.startTime,
          end_time: schedule.endTime,
          is_active: true,
        }));

        const { error: scheduleError } = await supabase
          .from("show_schedules")
          .insert(scheduleRecords);

        if (scheduleError) {
          console.error("Error creating schedules:", scheduleError);
        }
      }

      await fetchUserAndEvents();
      closeAllModals();
      setSuccessMessage(`✨ Event "${eventData.title}" created successfully!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error creating event:", error);
      setSuccessMessage("Failed to create event. Please try again.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleCreateEventSubmit = async (formData: any) => {
    if (!userTheater) {
      setSuccessMessage("No theater assigned to your account.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      return;
    }
    const posterUrl = formData.poster_url || null;
    await handleCreateEvent(formData, posterUrl);
  };

  // Update event handler
  const handleUpdateEvent = async (formData: any) => {
    if (!selectedEventForEdit) return;

    try {
      const { schedules: eventSchedules, ...eventData } = formData;

      // Update event
      const { error: eventError } = await supabase
        .from("events")
        .update({
          title: eventData.title,
          description: eventData.description || null,
          genre: eventData.genre || null,
          category: eventData.category || null,
          duration_minutes: eventData.duration_minutes || null,
          director: eventData.director || null,
          cast: eventData.cast || [],
          poster_url: eventData.poster_url || null,
          status: eventData.status,
          is_featured: eventData.is_featured || false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedEventForEdit.id);

      if (eventError) throw eventError;

      // Delete existing schedules and recreate
      if (eventSchedules) {
        await supabase
          .from("show_schedules")
          .delete()
          .eq("event_id", selectedEventForEdit.id);

        if (eventSchedules.length > 0) {
          const scheduleRecords = eventSchedules.map((schedule: any) => ({
            event_id: selectedEventForEdit.id,
            hall_id: schedule.hallId,
            show_date: schedule.date,
            start_time: schedule.startTime,
            end_time: schedule.endTime,
            is_active: true,
          }));

          const { error: scheduleError } = await supabase
            .from("show_schedules")
            .insert(scheduleRecords);

          if (scheduleError) {
            console.error("Error updating schedules:", scheduleError);
          }
        }
      }

      await fetchUserAndEvents();
      closeAllModals();
      setSuccessMessage(`✏️ Event "${eventData.title}" updated successfully!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error updating event:", error);
      setSuccessMessage("Failed to update event. Please try again.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  // Delete event handler
  const handleDeleteEvent = async () => {
    if (!selectedEventForDelete) return;

    try {
      // Delete schedules first
      await supabase
        .from("show_schedules")
        .delete()
        .eq("event_id", selectedEventForDelete.id);

      // Delete event
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

  // Cancel event handler
  const handleCancelEvent = async () => {
    if (!eventToCancel) return;

    try {
      const { error } = await supabase
        .from("events")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventToCancel.id);

      if (error) throw error;

      await fetchUserAndEvents();
      closeAllModals();
      setSuccessMessage(
        `⚠️ Event "${eventToCancel.title}" has been cancelled.`,
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

  // Reactivate event handler
  const handleReactivateEvent = async () => {
    if (!selectedEventForReactivate) return;

    try {
      const { error } = await supabase
        .from("events")
        .update({
          status: "coming-soon",
          updated_at: new Date().toISOString(),
        })
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

  // Modal handlers
  const openViewModal = (event: Event) => {
    setSelectedEventForView(event);
    setShowViewModal(true);
  };

  const openEditModal = (event: Event) => {
    setSelectedEventForEdit(event);
    setShowUpdateModal(true);
  };

  const openCancelModal = (event: Event) => {
    setEventToCancel(event);
    setCancelReason("");
    setShowReasonModal(true);
  };

  const openReactivateModal = (event: Event) => {
    setSelectedEventForReactivate(event);
    setShowCancelModal(true);
  };

  const openDeleteModal = (event: Event) => {
    setSelectedEventForDelete(event);
    setShowDeleteModal(true);
  };

  // UI helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case "now-showing":
        return "bg-green-100 text-green-700";
      case "coming-soon":
        return "bg-blue-100 text-blue-700";
      case "ended":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "now-showing":
        return <Activity className="h-3 w-3" />;
      case "coming-soon":
        return <Calendar className="h-3 w-3" />;
      case "ended":
        return <CheckCircle className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "now-showing":
        return "Now Showing";
      case "coming-soon":
        return "Coming Soon";
      case "ended":
        return "Ended";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  // Table columns
  const columns: Column[] = [
    {
      Header: "Event",
      accessor: "title",
      Cell: (row: Event) => (
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
            <p className="font-medium text-gray-900">{row.title}</p>
            <p className="text-xs text-gray-500">{row.genre || "No genre"}</p>
          </div>
        </div>
      ),
    },
    {
      Header: "Schedule",
      accessor: "schedules",
      Cell: (row: Event) => {
        const schedules = row.schedules || [];
        if (schedules.length === 0)
          return <span className="text-gray-400">No schedule</span>;
        const first = schedules[0];
        return (
          <div className="text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(first.show_date)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
              <Clock className="h-3 w-3" />
              <span>
                {formatTime(first.start_time)} - {formatTime(first.end_time)}
              </span>
            </div>
            {schedules.length > 1 && (
              <span className="text-xs text-gray-400">
                +{schedules.length - 1} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Venue",
      accessor: "schedules",
      Cell: (row: Event) => {
        const schedules = row.schedules || [];
        const firstHall = schedules[0]?.hall?.name;
        return (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{firstHall || "TBD"}</span>
          </div>
        );
      },
    },
    {
      Header: "Duration",
      accessor: "duration_minutes",
      Cell: (row: Event) => (
        <span className="text-sm">{row.duration_minutes || 0} min</span>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row: Event) => (
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
      Cell: (row: Event) => (
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

  // Stat Card Component
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // No theater assigned state
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
            Your account doesn't have a theater assigned yet.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg text-left">
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
        {/* Header */}
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Events"
            value={stats.total}
            icon={Calendar}
            color="from-teal-500 to-teal-600"
          />
          <StatCard
            title="Now Showing"
            value={stats.nowShowing}
            icon={Activity}
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Coming Soon"
            value={stats.comingSoon}
            icon={Calendar}
            color="from-blue-500 to-cyan-600"
          />
          <StatCard
            title="Ended"
            value={stats.ended}
            icon={CheckCircle}
            color="from-gray-500 to-gray-600"
          />
          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            icon={XCircle}
            color="from-red-500 to-rose-600"
          />
        </div>

        {/* Search, Filter, and Create */}
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
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" /> Create Event
          </button>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <ReusableTable
            columns={columns}
            data={filteredEvents}
            icon={LayoutGrid}
            showSearch={false}
            showExport={false}
            showPrint={false}
            itemsPerPage={10}
          />
        </div>

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
            event={selectedEventForEdit as any}
            onSubmit={handleUpdateEvent}
            onCancel={() => closeAllModals()}
          />
        )}

        {showViewModal && selectedEventForView && (
          <ViewEventModal
            event={selectedEventForView as any}
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
          title="Delete Event"
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
                  placeholder="Please provide a reason..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
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
                  onClick={handleCancelEvent}
                  disabled={!cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reactivate Modal */}
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