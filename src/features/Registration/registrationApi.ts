import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ==================== TYPES & INTERFACES ====================

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  contact_phone: string;
  role: 'client' | 'senior_advocate' | 'advocate' | 'paralegal' | 'legal_assistant' | 'secretary' | 'accountant' | 'admin';
  county?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  bio?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  client_id: number;
  user_id: number;
  client_type: 'individual' | 'corporate' | 'government' | 'ngo' | 'partnership' | 'trust';
  client_number: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  national_id?: string;
  passport_number?: string;
  company_name?: string;
  registration_number?: string;
  tax_id?: string;
  industry?: string;
  email: string;
  phone_number: string;
  alternative_phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  contact_person_name?: string;
  contact_person_title?: string;
  contact_person_email?: string;
  contact_person_phone?: string;
  referred_by?: number;
  source?: string;
  notes?: string;
  billing_type?: 'hourly' | 'fixed' | 'retainer' | 'contingency';
  status: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

// ==================== REQUEST INTERFACES ====================

export interface BasicRegisterRequest {
  username: string;
  email: string;
  contact_phone: string;
  password: string;
  role?: 'client' | 'admin';
  county?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  bio?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ClientRegistrationRequest {
  // Client Type
  client_type: 'individual' | 'corporate' | 'government' | 'ngo' | 'partnership' | 'trust';
  
  // Authentication
  email: string;
  contact_phone: string;
  password: string;

  // Individual Client Fields
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  national_id?: string;
  passport_number?: string;

  // Corporate Client Fields
  company_name?: string;
  registration_number?: string;
  tax_id?: string;
  industry?: string;

  // Contact Information
  alternative_phone?: string;

  // Address
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;

  // Corporate Contact Person
  contact_person_name?: string;
  contact_person_title?: string;
  contact_person_email?: string;
  contact_person_phone?: string;

  // Additional
  source?: string;
  referred_by?: number;
  notes?: string;

  // Agreements
  termsAccepted: boolean;
  dataProcessingAccepted: boolean;
  marketingConsent?: boolean;
}

export interface AdvocateRegistrationRequest {
  // Personal Information
  full_name: string;
  email: string;
  contact_phone: string;
  password: string;
  
  // Professional Information
  role: 'senior_advocate' | 'advocate' | 'paralegal' | 'legal_assistant' | 'secretary' | 'accountant' | 'admin';
  bar_license_number?: string;
  bar_admission_date?: string;
  specialization?: string[];
  department?: string;
  position?: string;
  hourly_rate?: string;
  
  // Address
  county?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  
  // Additional
  bio?: string;
  
  // Agreements
  termsAccepted: boolean;
  dataProcessingAccepted: boolean;
}

// ==================== RESPONSE INTERFACES ====================

export interface BasicRegisterResponse {
  msg: User;
  'Email sent': boolean;
}

export interface LoginResponse {
  token: string;
  user: User & {
    role: string;
  };
}

export interface ClientRegistrationResponse {
  msg: string;
  data: {
    userId: number;
    clientId: number;
    clientNumber: string;
    status: string;
  };
}

export interface AdvocateRegistrationResponse {
  msg: string;
  data: {
    userId: number;
    role: string;
  };
}

export interface ErrorResponse {
  error: string | string[];
}

// ==================== API DEFINITION ====================

export const registrationApi = createApi({
  reducerPath: 'registrationApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000', // Replace with your actual API URL
    prepareHeaders: (headers) => {
      // Add any default headers here
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth', 'Users', 'Clients', 'Advocates'],
  endpoints: (builder) => ({
    
    // ==================== BASIC AUTHENTICATION ====================
    
    registerBasicUser: builder.mutation<BasicRegisterResponse, BasicRegisterRequest>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // ==================== CLIENT REGISTRATION ====================
    
    registerClient: builder.mutation<ClientRegistrationResponse, ClientRegistrationRequest>({
      query: (clientData) => ({
        url: '/register-client',
        method: 'POST',
        body: clientData,
      }),
      invalidatesTags: ['Clients', 'Users'],
    }),

    // ==================== ADVOCATE/STAFF REGISTRATION ====================
    
    registerAdvocate: builder.mutation<AdvocateRegistrationResponse, AdvocateRegistrationRequest>({
      query: (advocateData) => ({
        url: '/register-advocate',
        method: 'POST',
        body: advocateData,
      }),
      invalidatesTags: ['Advocates', 'Users'],
    }),

    // ==================== OTP AUTHENTICATION (Commented - Ready to enable) ====================
    
    // sendRegistrationOTP: builder.mutation<{ message: string }, { contact_phone: string }>({
    //   query: (data) => ({
    //     url: '/send-registration-otp',
    //     method: 'POST',
    //     body: data,
    //   }),
    // }),

    // registerUserWithOTP: builder.mutation<{ msg: User }, {
    //   contact_phone: string;
    //   otp_code: string;
    //   password: string;
    //   full_name?: string;
    //   email?: string;
    //   role?: string;
    // }>({
    //   query: (data) => ({
    //     url: '/register-with-otp',
    //     method: 'POST',
    //     body: data,
    //   }),
    //   invalidatesTags: ['Users'],
    // }),

    // sendLoginOTP: builder.mutation<{ message: string }, { contact_phone: string }>({
    //   query: (data) => ({
    //     url: '/send-login-otp',
    //     method: 'POST',
    //     body: data,
    //   }),
    // }),

    // loginWithOTP: builder.mutation<LoginResponse, {
    //   contact_phone: string;
    //   otp_code: string;
    // }>({
    //   query: (data) => ({
    //     url: '/login-with-otp',
    //     method: 'POST',
    //     body: data,
    //   }),
    //   invalidatesTags: ['Auth'],
    // }),
  }),
});

// ==================== EXPORT HOOKS ====================

export const {
  // Basic Authentication
  useRegisterBasicUserMutation,
  useLoginMutation,
  
  // Client Registration
  useRegisterClientMutation,
  
  // Advocate Registration
  useRegisterAdvocateMutation,
  
  // OTP Authentication (Uncomment when needed)
  // useSendRegistrationOTPMutation,
  // useRegisterUserWithOTPMutation,
  // useSendLoginOTPMutation,
  // useLoginWithOTPMutation,
} = registrationApi;