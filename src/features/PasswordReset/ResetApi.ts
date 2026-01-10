import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Interface for forgot password request
export interface ForgotPasswordRequest {
  email: string;
}

// Interface for forgot password response
export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

// Interface for reset password request
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Interface for reset password response
export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

// Interface for token verification response
export interface TokenVerificationResponse {
  valid: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
} 

export const passwordResetApi = createApi({
  reducerPath: "passwordResetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000" // Replace with your actual API URL
  }),
  tagTypes: ["PasswordReset"],
  endpoints: (builder) => ({
    // Send forgot password email
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    
    // Verify reset token
    verifyResetToken: builder.query<TokenVerificationResponse, string>({
      query: (token) => `/verify-reset-token/${token}`,
    }),
    
    // Reset password
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    
    // Cleanup expired tokens
    cleanupExpiredTokens: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/cleanup-expired-tokens",
        method: "POST",
      }),
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (data) => ({
        url: "/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useVerifyResetTokenQuery,
  useResetPasswordMutation,
  useCleanupExpiredTokensMutation,
  useChangePasswordMutation,
} = passwordResetApi;