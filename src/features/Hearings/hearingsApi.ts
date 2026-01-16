import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CourtHearing {
  hearing_id: number;
  case_id: number;
  hearing_type: 'other' | 'preliminary' | 'trial' | 'sentencing' | 'appeal' | 'motion' | 'status_conference';
  title: string;
  description?: string;
  court_name: string;
  court_room?: string;
  judge_name?: string;
  hearing_date: string;
  duration_minutes?: number;
  outcome?: string;
  next_hearing_date?: string;
  status: 'scheduled' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CourtHearingWithDetails extends CourtHearing {
  case?: {
    case_id: number;
    case_number: string;
    title: string;
    case_type: string;
    status: string;
    opposing_party?: string;
    opposing_counsel?: string;
    client?: {
      client_id: number;
      client_number: string;
      first_name?: string;
      last_name?: string;
      company_name?: string;
      email: string;
      phone_number?: string;
    };
    primaryAdvocate?: {
      user_id: number;
      full_name: string;
      email: string;
      contact_phone?: string;
      role: string;
    };
  };
  creator?: {
    user_id: number;
    full_name: string;
    email: string;
    role: string;
  };
}

export interface CourtHearingStatistics {
  total_hearings: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  preliminary: number;
  trial: number;
  appeal: number;
  motion: number;
}

interface UpdateCourtHearing {
  hearing_id: number;
  case_id?: number;
  hearing_type?: 'other' | 'preliminary' | 'trial' | 'sentencing' | 'appeal' | 'motion' | 'status_conference';
  title?: string;
  description?: string;
  court_name?: string;
  court_room?: string;
  judge_name?: string;
  hearing_date?: string;
  duration_minutes?: number;
  outcome?: string;
  next_hearing_date?: string;
  status?: 'scheduled' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
}

interface UpdateHearingOutcome {
  outcome: string;
  next_hearing_date?: string;
}

interface RescheduleHearing {
  hearing_date: string;
}

export const hearingsApi = createApi({
  reducerPath: 'hearingsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['CourtHearings'],
  endpoints: (builder) => ({
    // ==================== BASIC CRUD ====================
    
    // Get all court hearings
    getCourtHearings: builder.query<CourtHearing[], void>({
      query: () => '/court-hearings',
      providesTags: ['CourtHearings']
    }),

    // Get single court hearing by ID
    getSingleCourtHearing: builder.query<CourtHearing, number>({
      query: (id) => `/court-hearings/${id}`,
      providesTags: ['CourtHearings']
    }),

    // Create new court hearing
    createCourtHearing: builder.mutation<CourtHearing, Partial<CourtHearing>>({
      query: (newHearing) => ({
        url: "/court-hearings",
        method: "POST",
        body: newHearing,
      }),
      invalidatesTags: ["CourtHearings"],
    }),

    // Update court hearing
    updateCourtHearing: builder.mutation<CourtHearing, UpdateCourtHearing>({
      query: ({ hearing_id, ...patch }) => ({
        url: `/court-hearings/${hearing_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["CourtHearings"],
    }),

    // Delete court hearing
    deleteCourtHearing: builder.mutation<{ success: boolean }, number>({
      query: (hearing_id) => ({
        url: `/court-hearings/${hearing_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CourtHearings"],
    }),

    // ==================== RELATIONSHIPS & DETAILS ====================

    // Get court hearing with full details (case, client, advocate, creator)
    getCourtHearingWithDetails: builder.query<CourtHearingWithDetails, number>({
      query: (id) => `/court-hearings/${id}/details`,
      providesTags: ['CourtHearings']
    }),

    // ==================== FILTERING ====================

    // Get court hearings by case
    getCourtHearingsByCase: builder.query<CourtHearing[], number>({
      query: (caseId) => `/court-hearings/case/${caseId}`,
      providesTags: ['CourtHearings']
    }),

    // Get court hearings by status
    getCourtHearingsByStatus: builder.query<CourtHearing[], CourtHearing['status']>({
      query: (status) => `/court-hearings/status/${status}`,
      providesTags: ['CourtHearings']
    }),

    // Get court hearings by type
    getCourtHearingsByType: builder.query<CourtHearing[], CourtHearing['hearing_type']>({
      query: (type) => `/court-hearings/type/${type}`,
      providesTags: ['CourtHearings']
    }),

    // Get court hearings by court
    getCourtHearingsByCourt: builder.query<CourtHearing[], string>({
      query: (courtName) => `/court-hearings/court/${courtName}`,
      providesTags: ['CourtHearings']
    }),

    // Get court hearings by judge
    getCourtHearingsByJudge: builder.query<CourtHearing[], string>({
      query: (judgeName) => `/court-hearings/judge/${judgeName}`,
      providesTags: ['CourtHearings']
    }),

    // ==================== DATE-BASED QUERIES ====================

    // Get upcoming court hearings (query parameter: ?days=30)
    getUpcomingCourtHearings: builder.query<CourtHearing[], number | void>({
      query: (days = 30) => `/court-hearings/calendar/upcoming?days=${days}`,
      providesTags: ['CourtHearings']
    }),

    // Get today's court hearings
    getTodayCourtHearings: builder.query<CourtHearing[], void>({
      query: () => '/court-hearings/calendar/today',
      providesTags: ['CourtHearings']
    }),

    // Get court hearings by specific date
    getCourtHearingsByDate: builder.query<CourtHearing[], string>({
      query: (date) => `/court-hearings/calendar/date/${date}`,
      providesTags: ['CourtHearings']
    }),

    // Get court hearings in date range (query parameters: ?start=YYYY-MM-DD&end=YYYY-MM-DD)
    getCourtHearingsInRange: builder.query<CourtHearing[], { start: string; end: string }>({
      query: ({ start, end }) => `/court-hearings/calendar/range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      providesTags: ['CourtHearings']
    }),

    // ==================== ACTIONS ====================

    // Update hearing outcome
    updateHearingOutcome: builder.mutation<{ message: string }, { hearing_id: number } & UpdateHearingOutcome>({
      query: ({ hearing_id, ...body }) => ({
        url: `/court-hearings/${hearing_id}/outcome`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CourtHearings"],
    }),

    // Mark hearing as completed
    markHearingCompleted: builder.mutation<{ message: string }, number>({
      query: (hearing_id) => ({
        url: `/court-hearings/${hearing_id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["CourtHearings"],
    }),

    // Cancel hearing
    cancelHearing: builder.mutation<{ message: string }, number>({
      query: (hearing_id) => ({
        url: `/court-hearings/${hearing_id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["CourtHearings"],
    }),

    // Reschedule hearing
    rescheduleHearing: builder.mutation<{ message: string }, { hearing_id: number } & RescheduleHearing>({
      query: ({ hearing_id, ...body }) => ({
        url: `/court-hearings/${hearing_id}/reschedule`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CourtHearings"],
    }),

    // ==================== FOLLOW-UP ====================

    // Get hearings needing follow-up
    getHearingsNeedingFollowUp: builder.query<CourtHearing[], void>({
      query: () => '/court-hearings/follow-up/pending',
      providesTags: ['CourtHearings']
    }),

    // ==================== ANALYTICS ====================

    // Get court hearing statistics
    getCourtHearingStatistics: builder.query<CourtHearingStatistics, void>({
      query: () => '/court-hearings/analytics/statistics',
      providesTags: ['CourtHearings']
    }),
  }),
});

export const {
  useGetCourtHearingsQuery,
  useGetSingleCourtHearingQuery,
  useCreateCourtHearingMutation,
  useUpdateCourtHearingMutation,
  useDeleteCourtHearingMutation,
  useGetCourtHearingWithDetailsQuery,
  useGetCourtHearingsByCaseQuery,
  useGetCourtHearingsByStatusQuery,
  useGetCourtHearingsByTypeQuery,
  useGetCourtHearingsByCourtQuery,
  useGetCourtHearingsByJudgeQuery,
  useGetUpcomingCourtHearingsQuery,
  useGetTodayCourtHearingsQuery,
  useGetCourtHearingsByDateQuery,
  useGetCourtHearingsInRangeQuery,
  useUpdateHearingOutcomeMutation,
  useMarkHearingCompletedMutation,
  useCancelHearingMutation,
  useRescheduleHearingMutation,
  useGetHearingsNeedingFollowUpQuery,
  useGetCourtHearingStatisticsQuery,
} = hearingsApi;