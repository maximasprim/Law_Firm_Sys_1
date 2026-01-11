import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CaseTeamMember {
  team_id: number;
  case_id: number;
  user_id: number;
  role: string;
  hourly_rate?: string;
  responsibilities?: string;
  assigned_at?: string;
  removed_at?: string;
  is_active?: boolean;
}

export interface CaseTeamMemberWithDetails extends CaseTeamMember {
  user?: {
    user_id: number;
    full_name: string;
    email: string;
    contact_phone: string;
    role: string;
    specialization?: any;
    hourly_rate?: string;
    profile_picture_url?: string;
  };
  case?: {
    case_id: number;
    case_number: string;
    title: string;
    description?: string;
    case_type: string;
    status: string;
    priority: string;
    client_id?: number;
    client?: {
      client_id: number;
      client_number: string;
      first_name?: string;
      last_name?: string;
      company_name?: string;
      email: string;
    };
  };
}

export interface CasesByTeamMember extends CaseTeamMember {
  case?: {
    case_id: number;
    case_number: string;
    title: string;
    case_type: string;
    status: string;
    priority: string;
    client_id?: number;
    client?: {
      client_id: number;
      client_number: string;
      first_name?: string;
      last_name?: string;
      company_name?: string;
    };
  };
  user?: {
    user_id: number;
    full_name: string;
    email: string;
    role: string;
  };
}

export interface TeamMembersByCase extends CaseTeamMember {
  user?: {
    user_id: number;
    full_name: string;
    email: string;
    contact_phone: string;
    role: string;
    specialization?: any;
    profile_picture_url?: string;
  };
  case?: {
    case_id: number;
    case_number: string;
    title: string;
    case_type: string;
    status: string;
  };
}

export interface CheckUserOnTeamResponse {
  message: string;
  isOnTeam: boolean;
  data?: CaseTeamMember;
}

interface UpdateCaseTeamMember {
  team_id: number;
  case_id?: number;
  user_id?: number;
  role?: string;
  hourly_rate?: string;
  responsibilities?: string;
  is_active?: boolean;
}

export const caseTeamApi = createApi({
  reducerPath: 'caseTeamApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['CaseTeam'],
  endpoints: (builder) => ({
    // ==================== BASIC CRUD ====================
    
    // Get all case team members
    getCaseTeamMembers: builder.query<CaseTeamMember[], void>({
      query: () => '/case-team',
      providesTags: ['CaseTeam']
    }),

    // Get single case team member by ID
    getSingleCaseTeamMember: builder.query<CaseTeamMember, number>({
      query: (id) => `/case-team/${id}`,
      providesTags: ['CaseTeam']
    }),

    // Create new case team member
    createCaseTeamMember: builder.mutation<CaseTeamMember, Partial<CaseTeamMember>>({
      query: (newMember) => ({
        url: "/case-team",
        method: "POST",
        body: newMember,
      }),
      invalidatesTags: ["CaseTeam"],
    }),

    // Update case team member
    updateCaseTeamMember: builder.mutation<CaseTeamMember, UpdateCaseTeamMember>({
      query: ({ team_id, ...patch }) => ({
        url: `/case-team/${team_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["CaseTeam"],
    }),

    // Remove case team member (soft delete)
    removeCaseTeamMember: builder.mutation<{ message: string }, number>({
      query: (team_id) => ({
        url: `/case-team/${team_id}/remove`,
        method: "PATCH",
      }),
      invalidatesTags: ["CaseTeam"],
    }),

    // Delete case team member (hard delete)
    deleteCaseTeamMember: builder.mutation<{ success: boolean }, number>({
      query: (team_id) => ({
        url: `/case-team/${team_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CaseTeam"],
    }),

    // ==================== RELATIONSHIPS & DETAILS ====================

    // Get case team member with full details
    getCaseTeamMemberWithDetails: builder.query<CaseTeamMemberWithDetails, number>({
      query: (id) => `/case-team/${id}/details`,
      providesTags: ['CaseTeam']
    }),

    // ==================== FILTERING & SEARCH ====================

    // Get team members by case
    getTeamMembersByCase: builder.query<TeamMembersByCase[], number>({
      query: (caseId) => `/case-team/case/${caseId}`,
      providesTags: ['CaseTeam']
    }),

    // Get active team members by case
    getActiveTeamMembersByCase: builder.query<TeamMembersByCase[], number>({
      query: (caseId) => `/case-team/case/${caseId}/active`,
      providesTags: ['CaseTeam']
    }),

    // Get removed team members by case
    getRemovedTeamMembersByCase: builder.query<TeamMembersByCase[], number>({
      query: (caseId) => `/case-team/case/${caseId}/removed`,
      providesTags: ['CaseTeam']
    }),

    // Get team members by role for a specific case
    getTeamMembersByRole: builder.query<TeamMembersByCase[], { caseId: number; role: string }>({
      query: ({ caseId, role }) => `/case-team/case/${caseId}/role/${role}`,
      providesTags: ['CaseTeam']
    }),

    // Get cases by team member (user)
    getCasesByTeamMember: builder.query<CasesByTeamMember[], number>({
      query: (userId) => `/case-team/user/${userId}/cases`,
      providesTags: ['CaseTeam']
    }),

    // ==================== UTILITY ====================

    // Check if user is on case team
    checkUserOnCaseTeam: builder.query<CheckUserOnTeamResponse, { caseId: number; userId: number }>({
      query: ({ caseId, userId }) => `/case-team/case/${caseId}/user/${userId}/check`,
      providesTags: ['CaseTeam']
    }),
  }),
});

export const {
  useGetCaseTeamMembersQuery,
  useGetSingleCaseTeamMemberQuery,
  useCreateCaseTeamMemberMutation,
  useUpdateCaseTeamMemberMutation,
  useRemoveCaseTeamMemberMutation,
  useDeleteCaseTeamMemberMutation,
  useGetCaseTeamMemberWithDetailsQuery,
  useGetTeamMembersByCaseQuery,
  useGetActiveTeamMembersByCaseQuery,
  useGetRemovedTeamMembersByCaseQuery,
  useGetTeamMembersByRoleQuery,
  useGetCasesByTeamMemberQuery,
  useCheckUserOnCaseTeamQuery,
  useLazyCheckUserOnCaseTeamQuery,
} = caseTeamApi;