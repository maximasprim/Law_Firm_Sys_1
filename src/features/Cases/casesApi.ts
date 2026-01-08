import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Case {
  case_id: number;
  case_number: string;
  title: string;
  description?: string;
  case_type: 'civil' | 'criminal' | 'family' | 'corporate' | 'real_estate' | 'intellectual_property' | 'employment' | 'immigration' | 'tax' | 'bankruptcy' | 'personal_injury' | 'contract_dispute' | 'other';
  client_id?: number;
  primary_advocate_id?: number;
  opposing_party?: string;
  opposing_counsel?: string;
  opposing_counsel_contact?: string;
  court_name?: string;
  court_type?: string;
  court_case_number?: string;
  judge_name?: string;
  filing_date?: string;
  statute_of_limitations?: string;
  trial_date?: string;
  closed_date?: string;
  status: 'consultation' | 'open' | 'in_progress' | 'pending_court' | 'on_hold' | 'settled' | 'won' | 'lost' | 'dismissed' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  billing_type?: 'hourly' | 'flat_fee' | 'contingency' | 'retainer';
  estimated_value?: string;
  settlement_amount?: string;
  outcome?: string;
  outcome_notes?: string;
  notes?: string;
  tags?: any;
  custom_fields?: any;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CaseWithDetails extends Case {
  client?: {
    client_id: number;
    client_number: string;
    first_name: string;
    last_name: string;
    company_name?: string;
    email: string;
    phone_number: string;
    client_type: string;
    status: string;
  };
  primaryAdvocate?: {
    user_id: number;
    full_name: string;
    email: string;
    contact_phone: string;
    role: string;
    specialization?: string;
  };
  team?: Array<{
    user: {
      user_id: number;
      full_name: string;
      email: string;
      role: string;
    };
  }>;
  documents?: Array<{
    document_id: number;
    title: string;
    document_type: string;
    file_name: string;
    status: string;
    created_at: string;
  }>;
  tasks?: Array<{
    task_id: number;
    title: string;
    status: string;
    priority: string;
    due_date: string;
  }>;
  appointments?: Array<{
    appointment_id: number;
    title: string;
    appointment_type: string;
    start_time: string;
    status: string;
  }>;
  hearings?: Array<{
    hearing_id: number;
    title: string;
    hearing_type: string;
    hearing_date: string;
    court_name: string;
    status: string;
  }>;
}

export interface CaseStatistics {
  total_cases: number;
  open_cases: number;
  in_progress_cases: number;
  pending_court_cases: number;
  settled_cases: number;
  closed_cases: number;
  high_priority_cases: number;
  urgent_cases: number;
}

interface UpdateCase {
  case_id: number;
  case_number?: string;
  title?: string;
  description?: string;
  case_type?: 'civil' | 'criminal' | 'family' | 'corporate' | 'real_estate' | 'intellectual_property' | 'employment' | 'immigration' | 'tax' | 'bankruptcy' | 'personal_injury' | 'contract_dispute' | 'other';
  client_id?: number;
  primary_advocate_id?: number;
  opposing_party?: string;
  opposing_counsel?: string;
  opposing_counsel_contact?: string;
  court_name?: string;
  court_type?: string;
  court_case_number?: string;
  judge_name?: string;
  filing_date?: string;
  statute_of_limitations?: string;
  trial_date?: string;
  closed_date?: string;
  status?: 'consultation' | 'open' | 'in_progress' | 'pending_court' | 'on_hold' | 'settled' | 'won' | 'lost' | 'dismissed' | 'closed' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  billing_type?: 'hourly' | 'flat_fee' | 'contingency' | 'retainer';
  estimated_value?: string;
  settlement_amount?: string;
  outcome?: string;
  outcome_notes?: string;
  notes?: string;
  tags?: any;
  custom_fields?: any;
}

export const casesApi = createApi({
  reducerPath: 'casesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Cases'],
  endpoints: (builder) => ({
    // ==================== BASIC CRUD ====================
    
    // Get all cases
    getCases: builder.query<Case[], void>({
      query: () => '/cases',
      providesTags: ['Cases']
    }),

    // Get single case by ID
    getSingleCase: builder.query<Case, number>({
      query: (id) => `/cases/${id}`,
      providesTags: ['Cases']
    }),

    // Get case by case number
    getCaseByCaseNumber: builder.query<Case, string>({
      query: (caseNumber) => `/cases/case-number/${caseNumber}`,
      providesTags: ['Cases']
    }),

    // Create new case
    createCase: builder.mutation<Case, Partial<Case>>({
      query: (newCase) => ({
        url: "/cases",
        method: "POST",
        body: newCase,
      }),
      invalidatesTags: ["Cases"],
    }),

    // Update case
    updateCase: builder.mutation<Case, UpdateCase>({
      query: ({ case_id, ...patch }) => ({
        url: `/cases/${case_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Cases"],
    }),

    // Delete case
    deleteCase: builder.mutation<{ success: boolean }, number>({
      query: (case_id) => ({
        url: `/cases/${case_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cases"],
    }),

    // ==================== RELATIONSHIPS & DETAILS ====================

    // Get case with full details (client, advocate, team, documents, etc.)
    getCaseWithDetails: builder.query<CaseWithDetails, number>({
      query: (id) => `/cases/${id}/details`,
      providesTags: ['Cases']
    }),

    // ==================== FILTERING & SEARCH ====================

    // Get cases by client
    getCasesByClient: builder.query<Case[], number>({
      query: (clientId) => `/cases/client/${clientId}`,
      providesTags: ['Cases']
    }),

    // Get cases by advocate
    getCasesByAdvocate: builder.query<Case[], number>({
      query: (advocateId) => `/cases/advocate/${advocateId}`,
      providesTags: ['Cases']
    }),

    // Get cases by status
    getCasesByStatus: builder.query<Case[], Case['status']>({
      query: (status) => `/cases/status/${status}`,
      providesTags: ['Cases']
    }),

    // Get cases by type
    getCasesByType: builder.query<Case[], Case['case_type']>({
      query: (type) => `/cases/type/${type}`,
      providesTags: ['Cases']
    }),

    // Get cases by priority
    getCasesByPriority: builder.query<Case[], Case['priority']>({
      query: (priority) => `/cases/priority/${priority}`,
      providesTags: ['Cases']
    }),

    // Search cases (query parameter: ?q=search_term)
    searchCases: builder.query<Case[], string>({
      query: (searchTerm) => `/cases/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Cases']
    }),

    // ==================== ANALYTICS & REPORTS ====================

    // Get case statistics
    getCaseStatistics: builder.query<CaseStatistics, void>({
      query: () => '/cases/analytics/statistics',
      providesTags: ['Cases']
    }),

    // Get cases with upcoming trials (query parameter: ?days=30)
    getCasesWithUpcomingTrials: builder.query<Case[], number | void>({
      query: (days = 30) => `/cases/analytics/upcoming-trials?days=${days}`,
      providesTags: ['Cases']
    }),
  }),
});

export const {
  useGetCasesQuery,
  useGetSingleCaseQuery,
  useGetCaseByCaseNumberQuery,
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useDeleteCaseMutation,
  useGetCaseWithDetailsQuery,
  useGetCasesByClientQuery,
  useGetCasesByAdvocateQuery,
  useGetCasesByStatusQuery,
  useGetCasesByTypeQuery,
  useGetCasesByPriorityQuery,
  useSearchCasesQuery,
  useLazySearchCasesQuery,
  useGetCaseStatisticsQuery,
  useGetCasesWithUpcomingTrialsQuery,
} = casesApi;