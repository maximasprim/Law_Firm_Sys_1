import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  contact_phone?: string;
  role: 'super_admin' | 'admin' | 'senior_advocate' | 'advocate' | 'paralegal' | 'client';
  department?: string;
  county?: string;
  is_active: boolean;
  phone_verified: boolean;
  preferences?: any;
  notification_settings?: any;
  created_at?: string;
  updated_at?: string;
}

export interface UserWithDetails extends User {
  authentication?: {
    auth_id: number;
    username: string;
    role: string;
    two_factor_enabled: boolean;
    last_login_at: string;
  };
  client?: {
    client_id: number;
    client_number: string;
    client_type: string;
    status: string;
    billing_type: string;
    outstanding_balance: string;
  };
  primaryAdvocateCases?: Array<{
    case_id: number;
    case_number: string;
    title: string;
    case_type: string;
    status: string;
    priority: string;
  }>;
  createdCases?: Array<{
    case_id: number;
    case_number: string;
    title: string;
    status: string;
  }>;
}

export interface UserWithCases extends User {
  primaryAdvocateCases?: Array<{
    case_id: number;
    case_number: string;
    title: string;
    status: string;
    client?: {
      client_id: number;
      first_name: string;
      last_name: string;
      company_name?: string;
      email: string;
    };
  }>;
  caseTeamMembers?: Array<{
    case: {
      case_id: number;
      case_number: string;
      title: string;
      status: string;
    };
  }>;
}

export interface UserWithTasks extends User {
  assignedTasks?: Array<{
    task_id: number;
    title: string;
    status: string;
    priority: string;
    due_date: string;
  }>;
}

export interface UserWithAppointments extends User {
  createdAppointments?: Array<{
    appointment_id: number;
    title: string;
    appointment_type: string;
    start_time: string;
    status: string;
  }>;
}

export interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  verified_phones: number;
  super_admins: number;
  admins: number;
  advocates: number;
  paralegals: number;
  clients: number;
  staff: number;
}

export interface UserRoleBreakdown {
  role: string;
  count: number;
}

interface UpdateUser {
  user_id: number;
  full_name?: string;
  email?: string;
  contact_phone?: string;
  role?: 'super_admin' | 'admin' | 'senior_advocate' | 'advocate' | 'paralegal' | 'client';
  department?: string;
  county?: string;
  is_active?: boolean;
  phone_verified?: boolean;
  preferences?: any;
  notification_settings?: any;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // ==================== BASIC CRUD ====================
    
    // Get all users
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['Users']
    }),

    // Get single user by ID
    getSingleUser: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: ['Users']
    }),

    // Get user by email
    getUserByEmail: builder.query<User, string>({
      query: (email) => `/users/email/${email}`,
      providesTags: ['Users']
    }),

    // Get user by phone
    getUserByPhone: builder.query<User, string>({
      query: (phone) => `/users/phone/${phone}`,
      providesTags: ['Users']
    }),

    // Create new user
    createUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    // Update user
    updateUser: builder.mutation<User, UpdateUser>({
      query: ({ user_id, ...patch }) => ({
        url: `/users/${user_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Users"],
    }),

    // Delete user
    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (user_id) => ({
        url: `/users/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // ==================== RELATIONSHIPS & DETAILS ====================

    // Get user with full details (authentication, client profile, cases, etc.)
    getUserWithDetails: builder.query<UserWithDetails, number>({
      query: (id) => `/users/${id}/details`,
      providesTags: ['Users']
    }),

    // Get user with cases
    getUserWithCases: builder.query<UserWithCases, number>({
      query: (id) => `/users/${id}/cases`,
      providesTags: ['Users']
    }),

    // Get user with tasks
    getUserWithTasks: builder.query<UserWithTasks, number>({
      query: (id) => `/users/${id}/tasks`,
      providesTags: ['Users']
    }),

    // Get user with appointments
    getUserWithAppointments: builder.query<UserWithAppointments, number>({
      query: (id) => `/users/${id}/appointments`,
      providesTags: ['Users']
    }),

    // Get user notifications
    getUserNotifications: builder.query<any, number>({
      query: (id) => `/users/${id}/notifications`,
      providesTags: ['Users']
    }),

    // ==================== FILTERING ====================

    // Get users by role
    getUsersByRole: builder.query<User[], User['role']>({
      query: (role) => `/users/role/${role}`,
      providesTags: ['Users']
    }),

    // Get all advocates
    getAdvocates: builder.query<User[], void>({
      query: () => '/users/filter/advocates',
      providesTags: ['Users']
    }),

    // Get all staff
    getStaff: builder.query<User[], void>({
      query: () => '/users/filter/staff',
      providesTags: ['Users']
    }),

    // Get active users
    getActiveUsers: builder.query<User[], void>({
      query: () => '/users/filter/active',
      providesTags: ['Users']
    }),

    // Get inactive users
    getInactiveUsers: builder.query<User[], void>({
      query: () => '/users/filter/inactive',
      providesTags: ['Users']
    }),

    // Get users by department
    getUsersByDepartment: builder.query<User[], string>({
      query: (department) => `/users/department/${department}`,
      providesTags: ['Users']
    }),

    // Get users by county
    getUsersByCounty: builder.query<User[], string>({
      query: (county) => `/users/county/${county}`,
      providesTags: ['Users']
    }),

    // ==================== SEARCH ====================

    // Search users (query parameter: ?q=search_term)
    searchUsers: builder.query<User[], string>({
      query: (searchTerm) => `/users/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Users']
    }),

    // ==================== ANALYTICS ====================

    // Get user statistics
    getUserStatistics: builder.query<UserStatistics, void>({
      query: () => '/users/analytics/statistics',
      providesTags: ['Users']
    }),

    // Get user role breakdown
    getUserRoleBreakdown: builder.query<UserRoleBreakdown[], void>({
      query: () => '/users/analytics/role-breakdown',
      providesTags: ['Users']
    }),

    // ==================== ACTIONS ====================

    // Activate user
    activateUser: builder.mutation<{ message: string }, number>({
      query: (user_id) => ({
        url: `/users/${user_id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    // Deactivate user
    deactivateUser: builder.mutation<{ message: string }, number>({
      query: (user_id) => ({
        url: `/users/${user_id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    // Update user role
    updateUserRole: builder.mutation<{ message: string }, { user_id: number; role: User['role'] }>({
      query: ({ user_id, role }) => ({
        url: `/users/${user_id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    // Update user preferences
    updateUserPreferences: builder.mutation<{ message: string }, { user_id: number; preferences: any }>({
      query: ({ user_id, preferences }) => ({
        url: `/users/${user_id}/preferences`,
        method: "PATCH",
        body: { preferences },
      }),
      invalidatesTags: ["Users"],
    }),

    // Update notification settings
    updateNotificationSettings: builder.mutation<{ message: string }, { user_id: number; notification_settings: any }>({
      query: ({ user_id, notification_settings }) => ({
        url: `/users/${user_id}/notification-settings`,
        method: "PATCH",
        body: { notification_settings },
      }),
      invalidatesTags: ["Users"],
    }),

    // Verify phone
    verifyPhone: builder.mutation<{ message: string }, number>({
      query: (user_id) => ({
        url: `/users/${user_id}/verify-phone`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetSingleUserQuery,
  useGetUserByEmailQuery,
  useGetUserByPhoneQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserWithDetailsQuery,
  useGetUserWithCasesQuery,
  useGetUserWithTasksQuery,
  useGetUserWithAppointmentsQuery,
  useGetUserNotificationsQuery,
  useGetUsersByRoleQuery,
  useGetAdvocatesQuery,
  useGetStaffQuery,
  useGetActiveUsersQuery,
  useGetInactiveUsersQuery,
  useGetUsersByDepartmentQuery,
  useGetUsersByCountyQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useGetUserStatisticsQuery,
  useGetUserRoleBreakdownQuery,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useUpdateUserRoleMutation,
  useUpdateUserPreferencesMutation,
  useUpdateNotificationSettingsMutation,
  useVerifyPhoneMutation,
} = usersApi;