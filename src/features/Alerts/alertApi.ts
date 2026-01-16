import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Notification {
  notification_id?: number;
  user_id: number;
  title: string;
  message: string;
  type: 'system' | 'case_update' | 'task_assigned' | 'task_due' | 'appointment_reminder' | 'document_uploaded' | 'payment_received' | 'invoice_sent' | 'message_received' | 'deadline_approaching';
  is_read: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationWithUser extends Notification {
  user?: {
    user_id: number;
    full_name: string;
    email: string;
    role: string;
  };
}

interface UpdateNotification {
  notification_id: number;
  user_id?: number;
  title?: string;
  message?: string;
  type?: Notification['type'];
  is_read?: boolean;
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    // ==================== BASIC CRUD ====================
    
    // Get all notifications
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notifications']
    }),

    // Get single notification by ID
    getSingleNotification: builder.query<Notification, number>({
      query: (id) => `/notifications/${id}`,
      providesTags: ['Notifications']
    }),

    // Create new notification
    createNotification: builder.mutation<Notification, Partial<Notification>>({
      query: (newNotification) => ({
        url: "/notifications",
        method: "POST",
        body: newNotification,
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Update notification
    updateNotification: builder.mutation<Notification, UpdateNotification>({
      query: ({ notification_id, ...patch }) => ({
        url: `/notifications/${notification_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Delete notification
    deleteNotification: builder.mutation<{ message: string }, number>({
      query: (notification_id) => ({
        url: `/notifications/${notification_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ==================== USER-SPECIFIC QUERIES ====================

    // Get notifications by user ID
    getNotificationsByUser: builder.query<Notification[], number>({
      query: (userId) => `/notifications/user/${userId}`,
      providesTags: ['Notifications']
    }),

    // Get unread notifications by user ID
    getUnreadNotificationsByUser: builder.query<Notification[], number>({
      query: (userId) => `/notifications/user/${userId}/unread`,
      providesTags: ['Notifications']
    }),

    // ==================== ACTIONS ====================

    // Mark notification as read
    markNotificationAsRead: builder.mutation<{ message: string }, number>({
      query: (notification_id) => ({
        url: `/notifications/${notification_id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Mark all user notifications as read
    markAllUserNotificationsAsRead: builder.mutation<{ message: string }, number>({
      query: (userId) => ({
        url: `/notifications/user/${userId}/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetSingleNotificationQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useGetNotificationsByUserQuery,
  useGetUnreadNotificationsByUserQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllUserNotificationsAsReadMutation,
} = notificationsApi;