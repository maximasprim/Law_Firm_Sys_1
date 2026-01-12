import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Appointment {
  appointment_id: number;
  title: string;
  description?: string;
  appointment_type: 'consultation' | 'meeting' | 'court_hearing' | 'deposition' | 'mediation' | 'arbitration' | 'phone_call' | 'video_conference' | 'other';
  case_id?: number;
  client_id?: number;
  start_time: string;
  end_time: string;
  location?: string;
  meeting_url?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
  participants?: any;
  reminder_sent?: boolean;
  notes?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AppointmentWithDetails extends Appointment {
  case?: {
    case_id: number;
    case_number: string;
    title: string;
    case_type: string;
    status: string;
  };
  client?: {
    client_id: number;
    client_number: string;
    first_name?: string;
    last_name?: string;
    company_name?: string;
    email: string;
    phone_number?: string;
  };
  creator?: {
    user_id: number;
    full_name: string;
    email: string;
    role: string;
  };
}

export interface AppointmentStatistics {
  total_appointments: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  no_show: number;
  consultations: number;
  meetings: number;
  court_hearings: number;
}

export interface AppointmentConflict {
  has_conflicts: boolean;
  conflicts: Appointment[];
}

interface UpdateAppointment {
  appointment_id: number;
  title?: string;
  description?: string;
  appointment_type?: 'consultation' | 'meeting' | 'court_hearing' | 'deposition' | 'mediation' | 'arbitration' | 'phone_call' | 'video_conference' | 'other';
  case_id?: number;
  client_id?: number;
  start_time?: string;
  end_time?: string;
  location?: string;
  meeting_url?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
  participants?: any;
  reminder_sent?: boolean;
  notes?: string;
}

interface RescheduleAppointment {
  start_time: string;
  end_time: string;
}

interface CheckConflicts {
  start_time: string;
  end_time: string;
  participants: number[];
}

export const appointmentsApi = createApi({
  reducerPath: 'appointmentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Appointments'],
  endpoints: (builder) => ({
    // ==================== BASIC CRUD ====================
    
    // Get all appointments
    getAppointments: builder.query<Appointment[], void>({
      query: () => '/appointments',
      providesTags: ['Appointments']
    }),

    // Get single appointment by ID
    getSingleAppointment: builder.query<Appointment, number>({
      query: (id) => `/appointments/${id}`,
      providesTags: ['Appointments']
    }),

    // Create new appointment
    createAppointment: builder.mutation<Appointment, Partial<Appointment>>({
      query: (newAppointment) => ({
        url: "/appointments",
        method: "POST",
        body: newAppointment,
      }),
      invalidatesTags: ["Appointments"],
    }),

    // Update appointment
    updateAppointment: builder.mutation<Appointment, UpdateAppointment>({
      query: ({ appointment_id, ...patch }) => ({
        url: `/appointments/${appointment_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Appointments"],
    }),

    // Delete appointment
    deleteAppointment: builder.mutation<{ message: string }, number>({
      query: (appointment_id) => ({
        url: `/appointments/${appointment_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointments"],
    }),

    // ==================== RELATIONSHIPS & DETAILS ====================

    // Get appointment with full details (case, client, creator)
    getAppointmentWithDetails: builder.query<AppointmentWithDetails, number>({
      query: (id) => `/appointments/${id}/details`,
      providesTags: ['Appointments']
    }),

    // ==================== FILTERING ====================

    // Get appointments by case
    getAppointmentsByCase: builder.query<Appointment[], number>({
      query: (caseId) => `/appointments/case/${caseId}`,
      providesTags: ['Appointments']
    }),

    // Get appointments by client
    getAppointmentsByClient: builder.query<Appointment[], number>({
      query: (clientId) => `/appointments/client/${clientId}`,
      providesTags: ['Appointments']
    }),

    // Get appointments by status
    getAppointmentsByStatus: builder.query<Appointment[], Appointment['status']>({
      query: (status) => `/appointments/status/${status}`,
      providesTags: ['Appointments']
    }),

    // Get appointments by type
    getAppointmentsByType: builder.query<Appointment[], Appointment['appointment_type']>({
      query: (type) => `/appointments/type/${type}`,
      providesTags: ['Appointments']
    }),

    // Get appointments by user (participant)
    getAppointmentsByUser: builder.query<Appointment[], number>({
      query: (userId) => `/appointments/user/${userId}`,
      providesTags: ['Appointments']
    }),

    // ==================== DATE-BASED QUERIES ====================

    // Get upcoming appointments (query parameter: ?days=7)
    getUpcomingAppointments: builder.query<Appointment[], number | void>({
      query: (days = 7) => `/appointments/calendar/upcoming?days=${days}`,
      providesTags: ['Appointments']
    }),

    // Get today's appointments
    getTodayAppointments: builder.query<Appointment[], void>({
      query: () => '/appointments/calendar/today',
      providesTags: ['Appointments']
    }),

    // Get appointments by specific date
    getAppointmentsByDate: builder.query<Appointment[], string>({
      query: (date) => `/appointments/calendar/date/${date}`,
      providesTags: ['Appointments']
    }),

    // Get appointments in date range (query parameters: ?start=YYYY-MM-DD&end=YYYY-MM-DD)
    getAppointmentsInRange: builder.query<Appointment[], { start: string; end: string }>({
      query: ({ start, end }) => `/appointments/calendar/range?start=${start}&end=${end}`,
      providesTags: ['Appointments']
    }),

    // ==================== UTILITIES ====================

    // Check for appointment conflicts
    checkAppointmentConflicts: builder.mutation<AppointmentConflict, CheckConflicts>({
      query: (conflictData) => ({
        url: "/appointments/check-conflicts",
        method: "POST",
        body: conflictData,
      }),
    }),

    // ==================== ACTIONS ====================

    // Mark appointment as completed
    markAppointmentCompleted: builder.mutation<{ message: string }, number>({
      query: (appointment_id) => ({
        url: `/appointments/${appointment_id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Appointments"],
    }),

    // Cancel appointment
    cancelAppointment: builder.mutation<{ message: string }, number>({
      query: (appointment_id) => ({
        url: `/appointments/${appointment_id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Appointments"],
    }),

    // Reschedule appointment
    rescheduleAppointment: builder.mutation<{ message: string }, { appointment_id: number } & RescheduleAppointment>({
      query: ({ appointment_id, ...body }) => ({
        url: `/appointments/${appointment_id}/reschedule`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Appointments"],
    }),

    // ==================== ANALYTICS ====================

    // Get appointment statistics
    getAppointmentStatistics: builder.query<AppointmentStatistics, void>({
      query: () => '/appointments/analytics/statistics',
      providesTags: ['Appointments']
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetSingleAppointmentQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentWithDetailsQuery,
  useGetAppointmentsByCaseQuery,
  useGetAppointmentsByClientQuery,
  useGetAppointmentsByStatusQuery,
  useGetAppointmentsByTypeQuery,
  useGetAppointmentsByUserQuery,
  useGetUpcomingAppointmentsQuery,
  useGetTodayAppointmentsQuery,
  useGetAppointmentsByDateQuery,
  useGetAppointmentsInRangeQuery,
  useCheckAppointmentConflictsMutation,
  useMarkAppointmentCompletedMutation,
  useCancelAppointmentMutation,
  useRescheduleAppointmentMutation,
  useGetAppointmentStatisticsQuery,
} = appointmentsApi;