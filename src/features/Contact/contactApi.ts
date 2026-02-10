import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Contact form data interface
export interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

// Contact information interfaces
export interface ContactInfo {
    subjects: string[];
    contacts: {
        phone: string[];
        email: string[];
        address: string;
    };
    officeHours: {
        weekdays: string;
        saturday: string;
    };
}

// Contact submission response interface
export interface ContactSubmissionResponse {
    referenceNumber: string;
    submittedAt: string;
    subject: string;
    estimatedResponse: string;
}

// Service status interface
export interface ServiceStatus {
    status: string;
    timestamp: string;
    version: string;
    firm: string;
}

// Health status interface
export interface HealthStatus {
    status: string;
    service: string;
    firm: string;
    timestamp: string;
}

// API Response wrappers
export interface ContactInfoResponse {
    success: boolean;
    data: ContactInfo;
}

export interface ContactSubmissionSuccessResponse {
    success: boolean;
    message: string;
    data: ContactSubmissionResponse;
}

export interface ContactSubmissionErrorResponse {
    success: boolean;
    error: string;
    supportPhone?: string;
    supportEmail?: string;
}

export interface ServiceStatusResponse {
    success: boolean;
    status: string;
    timestamp: string;
    version: string;
    firm: string;
}

export interface ValidationErrorResponse {
    success: boolean;
    error: string;
}

// Create the contact us API
export const contactUsApi = createApi({
    reducerPath: 'contactUsApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:8000', // Update with your actual backend URL
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['ContactInfo', 'ServiceStatus'],
    endpoints: (builder) => ({
        // GET /contact/info - Retrieve contact information
        getContactInfo: builder.query<ContactInfoResponse, void>({
            query: () => '/info',
            providesTags: ['ContactInfo']
        }),

        // POST /contact/submit - Submit contact form
        submitContactForm: builder.mutation<
            ContactSubmissionSuccessResponse, 
            ContactFormData
        >({
            query: (formData) => ({
                url: '/submit',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['ContactInfo']
        }),

        // GET /contact/status - Check service status
        getServiceStatus: builder.query<ServiceStatusResponse, void>({
            query: () => '/status',
            providesTags: ['ServiceStatus']
        }),

        // GET /contact/health - Health check
        getHealthStatus: builder.query<HealthStatus, void>({
            query: () => '/health',
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetContactInfoQuery,
    useSubmitContactFormMutation,
    useGetServiceStatusQuery,
    useGetHealthStatusQuery,
} = contactUsApi;