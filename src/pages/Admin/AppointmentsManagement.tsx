import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  X,
  Users,
  Video,
  MapPin,
  Check,
  Ban,
  RotateCcw,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  useGetAppointmentsQuery,
  useGetAppointmentsByDateQuery,
  useGetTodayAppointmentsQuery,
  useGetAppointmentStatisticsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useMarkAppointmentCompletedMutation,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
  useCheckAppointmentConflictsMutation,
  type Appointment,
} from "../../features/Appointments/appointmentsApi";
import { useGetCasesQuery } from "@/features/Cases/casesApi";
import { useGetClientsQuery } from "@/features/Clients/clientApi";
import {toast, Toaster} from 'react-hot-toast';

const AppointmentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // RTK Query hooks
  const { data: appointmentsByDate = [], isLoading: isLoadingByDate } =
    useGetAppointmentsByDateQuery(selectedDate);
  const { data: todayAppointments = [] } = useGetTodayAppointmentsQuery();
  const { data: statistics } = useGetAppointmentStatisticsQuery();
  const [createAppointment] = useCreateAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();
  const [markCompleted] = useMarkAppointmentCompletedMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();
  const [rescheduleAppointment] = useRescheduleAppointmentMutation();
  const [checkConflicts] = useCheckAppointmentConflictsMutation();

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointmentsByDate.filter((apt) => {
      const matchesSearch =
        apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || apt.status === filterStatus;
      const matchesType =
        filterType === "all" || apt.appointment_type === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [appointmentsByDate, searchTerm, filterStatus, filterType]);

  // Count virtual meetings and court hearings from today's appointments
  const virtualMeetings = todayAppointments.filter(
    (apt) => apt.meeting_url
  ).length;
  const courtHearings = todayAppointments.filter(
    (apt) => apt.appointment_type === "court_hearing"
  ).length;

  const handleMarkComplete = async (id: number) => {
    try {
      await markCompleted(id).unwrap();
      toast.success("Appointment marked as completed");
    } catch (error) {
      toast.error("Failed to mark appointment as completed");
    }
  };

  const handleCancel = async (id: number) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id).unwrap();
        toast.success("Appointment cancelled");
      } catch (error) {
        toast.error("Failed to cancel appointment");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this appointment? This cannot be undone."
      )
    ) {
      try {
        await deleteAppointment(id).unwrap();
        setShowDetailsModal(false);
        toast.success("Appointment deleted");
      } catch (error) {
        toast.error("Failed to delete appointment");
      }
    }
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-700",
      confirmed: "bg-green-100 text-green-700",
      completed: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
      rescheduled: "bg-amber-100 text-amber-700",
      no_show: "bg-purple-100 text-purple-700",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const formatAppointmentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Appointments Management
        </h1>
        <p className="text-gray-600 mt-1">
          Schedule and manage client appointments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayAppointments.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics?.total_appointments || 0}
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Virtual Meetings</p>
              <p className="text-2xl font-bold text-gray-900">
                {virtualMeetings}
              </p>
            </div>
            <Video className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Court Hearings</p>
              <p className="text-2xl font-bold text-gray-900">
                {courtHearings}
              </p>
            </div>
            <Users className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="no_show">No Show</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="all">All Types</option>
                <option value="consultation">Consultation</option>
                <option value="meeting">Meeting</option>
                <option value="court_hearing">Court Hearing</option>
                <option value="deposition">Deposition</option>
                <option value="mediation">Mediation</option>
                <option value="arbitration">Arbitration</option>
                <option value="phone_call">Phone Call</option>
                <option value="video_conference">Video Conference</option>
                <option value="other">Other</option>
              </select>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <button
              onClick={() => setShowNewModal(true)}
              className="px-2 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {isLoadingByDate ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div
                key={apt.appointment_id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {apt.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatAppointmentType(apt.appointment_type)}
                        </p>
                        {apt.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {apt.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          apt.status
                        )}`}
                      >
                        {apt.status.charAt(0).toUpperCase() +
                          apt.status.slice(1).replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(apt.start_time)} (
                          {calculateDuration(apt.start_time, apt.end_time)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(apt.start_time)}</span>
                      </div>
                      {apt.meeting_url ? (
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-purple-600" />
                          <span>Virtual Meeting</span>
                        </div>
                      ) : (
                        apt.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{apt.location}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {apt.status !== "completed" &&
                      apt.status !== "cancelled" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setShowRescheduleModal(true);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Reschedule
                          </button>
                          <button
                            onClick={() =>
                              handleMarkComplete(apt.appointment_id)
                            }
                            className="px-3 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 text-sm flex items-center gap-1"
                          >
                            <Check className="h-4 w-4" />
                            Complete
                          </button>
                          <button
                            onClick={() => handleCancel(apt.appointment_id)}
                            className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm flex items-center gap-1"
                          >
                            <Ban className="h-4 w-4" />
                            Cancel
                          </button>
                        </>
                      )}
                    <button
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setShowDetailsModal(true);
                      }}
                      className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No appointments found for the selected date
              </p>
              {/* <button 
                onClick={() => setShowNewModal(true)}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create New Appointment
              </button> */}
            </div>
          )}
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewModal && (
        <NewAppointmentModal
          onClose={() => setShowNewModal(false)}
          onCreate={createAppointment}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <DetailsModal
          appointment={selectedAppointment}
          onClose={() => setShowDetailsModal(false)}
          onDelete={handleDelete}
        />
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onClose={() => setShowRescheduleModal(false)}
          onReschedule={rescheduleAppointment}
        />
      )}
    </div>
  );
};

// New Appointment Modal Component
const NewAppointmentModal = ({ onClose, onCreate }: any) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    appointment_type: "consultation" as const,
    start_time: "",
    end_time: "",
    location: "",
    meeting_url: "",
    case_id: "",
    client_id: "",
  });

  const { data: cases = [] } = useGetCasesQuery();
  const { data: clients = [] } = useGetClientsQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: any = {
        title: formData.title,
        appointment_type: formData.appointment_type,
        start_time: formData.start_time,
        end_time: formData.end_time,
      };

      if (formData.description) data.description = formData.description;
      if (formData.location) data.location = formData.location;
      if (formData.meeting_url) data.meeting_url = formData.meeting_url;
      if (formData.case_id) data.case_id = parseInt(formData.case_id);
      if (formData.client_id) data.client_id = parseInt(formData.client_id);

      await onCreate(data).unwrap();
      toast.success("Appointment created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create appointment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">New Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              required
              value={formData.appointment_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  appointment_type: e.target.value as any,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="consultation">Consultation</option>
              <option value="meeting">Meeting</option>
              <option value="court_hearing">Court Hearing</option>
              <option value="deposition">Deposition</option>
              <option value="mediation">Mediation</option>
              <option value="arbitration">Arbitration</option>
              <option value="phone_call">Phone Call</option>
              <option value="video_conference">Video Conference</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              placeholder="Office address or venue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting URL
            </label>
            <input
              type="url"
              value={formData.meeting_url}
              onChange={(e) =>
                setFormData({ ...formData, meeting_url: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case
              </label>
              <select
                value={formData.case_id}
                onChange={(e) =>
                  setFormData({ ...formData, case_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="">Select a case (optional)</option>
                {cases.map((c) => (
                  <option key={c.case_id} value={c.case_id}>
                    {c.case_number} - {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client *
              </label>
              <select
                value={formData.client_id}
                onChange={(e) =>
                  setFormData({ ...formData, client_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="">Select a client (optional)</option>
                {clients.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.client_type === "individual"
                      ? `${client.first_name} ${client.last_name} (${client.client_number})`
                      : `${client.company_name} (${client.client_number})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Create Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Details Modal Component
const DetailsModal = ({ appointment, onClose, onDelete }: any) => {
  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Appointment Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Title
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {appointment.title}
            </p>
          </div>

          {appointment.description && (
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Description
              </label>
              <p className="text-gray-900">{appointment.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Type
              </label>
              <p className="text-gray-900 capitalize">
                {appointment.appointment_type.replace("_", " ")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Status
              </label>
              <p className="text-gray-900 capitalize">
                {appointment.status.replace("_", " ")}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Start Time
            </label>
            <p className="text-gray-900">
              {formatTime(appointment.start_time)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              End Time
            </label>
            <p className="text-gray-900">{formatTime(appointment.end_time)}</p>
          </div>

          {appointment.location && (
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Location
              </label>
              <p className="text-gray-900">{appointment.location}</p>
            </div>
          )}

          {appointment.meeting_url && (
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Meeting URL
              </label>
              <a
                href={appointment.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:underline"
              >
                {appointment.meeting_url}
              </a>
            </div>
          )}

          {appointment.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Notes
              </label>
              <p className="text-gray-900">{appointment.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => onDelete(appointment.appointment_id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reschedule Modal Component
const RescheduleModal = ({ appointment, onClose, onReschedule }: any) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onReschedule({
        appointment_id: appointment.appointment_id,
        start_time: startTime,
        end_time: endTime,
      }).unwrap();
      toast.success("Appointment rescheduled successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to reschedule appointment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Reschedule Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800">
              <strong>Current:</strong> {appointment.title}
            </p>
            <p className="text-sm text-amber-700 mt-1">
              {new Date(appointment.start_time).toLocaleString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Start Time *
            </label>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New End Time *
            </label>
            <input
              type="datetime-local"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentsManagement;
