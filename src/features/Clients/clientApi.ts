import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Client {
  client_id: number;
  user_id?: number;
  
  // Basic Information
  client_type: 'individual' | 'corporate' | 'government' | 'ngo' | 'partnership' | 'trust';
  client_number: string;
  
  // Individual Client
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  national_id?: string;
  passport_number?: string;
  
  // Corporate Client
  company_name?: string;
  registration_number?: string;
  tax_id?: string;
  industry?: string;
  
  // Contact Information
  email: string;
  phone_number: string;
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
  
  // Client Relationship
  referred_by?: number;
  source?: string;
  primary_advocate_id?: number;
  
  // Financial
  billing_type?: 'hourly' | 'flat_fee' | 'contingency' | 'retainer' | 'mixed';
  rate?: string;
  retainer_amount?: string;
  outstanding_balance?: string;
  
  // Additional Information
  notes?: string;
  tags?: any;
  custom_fields?: any;
  
  // Status
  status: 'active' | 'inactive' | 'prospective' | 'former' | 'blacklisted';
  is_active?: boolean;
  conflict_checked?: boolean;
  conflict_check_date?: string;
  
  // Metadata
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClientWithDetails extends Client {
  user?: {
    user_id: number;
    full_name: string;
    email: string;
    contact_phone: string;
    role: string;
    is_active: boolean;
  };
  primaryAdvocate?: {
    user_id: number;
    full_name: string;
    email: string;
    contact_phone: string;
    role: string;
    specialization?: string;
  };
  creator?: {
    user_id: number;
    full_name: string;
    role: string;
  };
  referrer?: {
    client_id: number;
    client_number: string;
    first_name?: string;
    last_name?: string;
    company_name?: string;
  };
  cases?: Array<{
    case_id: number;
    case_number: string;
    title: string;
    case_type: string;
    status: string;
    priority: string;
    filing_date?: string;
  }>;
  invoices?: Array<{
    invoice_id: number;
    invoice_number: string;
    invoice_date: string;
    due_date: string;
    total_amount: string;
    balance_due: string;
    status: string;
  }>;
  transactions?: Array<{
    transaction_id: number;
    amount: string;
    type: string;
    payment_method: string;
    status: string;
    transaction_date: string;
  }>;
}

export interface ClientStatistics {
  total_clients: number;
  active_clients: number;
  inactive_clients: number;
  prospective_clients: number;
  former_clients: number;
  individual_clients: number;
  corporate_clients: number;
  clients_with_balance: number;
  total_outstanding: string;
  conflict_checked: number;
}

export interface ClientTypeBreakdown {
  client_type: string;
  count: number;
}

export interface ClientSourceBreakdown {
  source: string;
  count: number;
}

interface UpdateClient {
  client_id: number;
  user_id?: number;
  client_type?: 'individual' | 'corporate' | 'government' | 'ngo' | 'partnership' | 'trust';
  client_number?: string;
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
  email?: string;
  phone_number?: string;
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
  primary_advocate_id?: number;
  billing_type?: 'hourly' | 'flat_fee' | 'contingency' | 'retainer' | 'mixed';
  rate?: string;
  retainer_amount?: string;
  outstanding_balance?: string;
  notes?: string;
  tags?: any;
  custom_fields?: any;
  status?: 'active' | 'inactive' | 'prospective' | 'former' | 'blacklisted';
  is_active?: boolean;
  conflict_checked?: boolean;
  conflict_check_date?: string;
}

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Clients'],
  endpoints: (builder) => ({
    // ==================== BASIC CRUD ====================
    
    // Get all clients
    getClients: builder.query<Client[], void>({
      query: () => '/clients',
      providesTags: ['Clients']
    }),

    // Get single client by ID
    getSingleClient: builder.query<Client, number>({
      query: (id) => `/clients/${id}`,
      providesTags: ['Clients']
    }),

    // Get client by client number
    getClientByNumber: builder.query<Client, string>({
      query: (clientNumber) => `/clients/client-number/${clientNumber}`,
      providesTags: ['Clients']
    }),

    // Get client by user ID
    getClientByUserId: builder.query<Client, number>({
      query: (userId) => `/clients/user/${userId}`,
      providesTags: ['Clients']
    }),

    // Get client by email
    getClientByEmail: builder.query<Client, string>({
      query: (email) => `/clients/email/${email}`,
      providesTags: ['Clients']
    }),

    // Create new client
    createClient: builder.mutation<Client, Partial<Client>>({
      query: (newClient) => ({
        url: "/clients",
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: ["Clients"],
    }),

    // Update client
    updateClient: builder.mutation<Client, UpdateClient>({
      query: ({ client_id, ...patch }) => ({
        url: `/clients/${client_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Clients"],
    }),

    // Delete client
    deleteClient: builder.mutation<{ success: boolean }, number>({
      query: (client_id) => ({
        url: `/clients/${client_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),

    // ==================== RELATIONSHIPS & DETAILS ====================

    // Get client with full details
    getClientWithDetails: builder.query<ClientWithDetails, number>({
      query: (id) => `/clients/${id}/details`,
      providesTags: ['Clients']
    }),

    // Get client with cases
    getClientWithCases: builder.query<ClientWithDetails, number>({
      query: (id) => `/clients/${id}/cases`,
      providesTags: ['Clients']
    }),

    // Get client with invoices
    getClientWithInvoices: builder.query<ClientWithDetails, number>({
      query: (id) => `/clients/${id}/invoices`,
      providesTags: ['Clients']
    }),

    // Get client with transactions
    getClientWithTransactions: builder.query<ClientWithDetails, number>({
      query: (id) => `/clients/${id}/transactions`,
      providesTags: ['Clients']
    }),

    // Get client with trust accounts
    getClientWithTrustAccounts: builder.query<ClientWithDetails, number>({
      query: (id) => `/clients/${id}/trust-accounts`,
      providesTags: ['Clients']
    }),

    // Get client referrals
    getClientReferrals: builder.query<ClientWithDetails, number>({
      query: (id) => `/clients/${id}/referrals`,
      providesTags: ['Clients']
    }),

    // ==================== FILTERING ====================

    // Get clients by type
    getClientsByType: builder.query<Client[], Client['client_type']>({
      query: (type) => `/clients/type/${type}`,
      providesTags: ['Clients']
    }),

    // Get clients by status
    getClientsByStatus: builder.query<Client[], Client['status']>({
      query: (status) => `/clients/status/${status}`,
      providesTags: ['Clients']
    }),

    // Get active clients
    getActiveClients: builder.query<Client[], void>({
      query: () => '/clients/filter/active',
      providesTags: ['Clients']
    }),

    // Get clients by advocate
    getClientsByAdvocate: builder.query<Client[], number>({
      query: (advocateId) => `/clients/advocate/${advocateId}`,
      providesTags: ['Clients']
    }),

    // Get clients by billing type
    getClientsByBillingType: builder.query<Client[], Client['billing_type']>({
      query: (billingType) => `/clients/billing/${billingType}`,
      providesTags: ['Clients']
    }),

    // Get clients by source
    getClientsBySource: builder.query<Client[], string>({
      query: (source) => `/clients/source/${source}`,
      providesTags: ['Clients']
    }),

    // Get clients with outstanding balance
    getClientsWithBalance: builder.query<Client[], void>({
      query: () => '/clients/filter/with-balance',
      providesTags: ['Clients']
    }),

    // Get clients by country
    getClientsByCountry: builder.query<Client[], string>({
      query: (country) => `/clients/country/${country}`,
      providesTags: ['Clients']
    }),

    // Get clients by city
    getClientsByCity: builder.query<Client[], string>({
      query: (city) => `/clients/city/${city}`,
      providesTags: ['Clients']
    }),

    // Get recent clients (query parameter: ?days=30)
    getRecentClients: builder.query<Client[], number | void>({
      query: (days) => `/clients/filter/recent${days ? `?days=${days}` : ''}`,
      providesTags: ['Clients']
    }),

    // ==================== SEARCH ====================

    // Search clients (query parameter: ?q=search_term)
    searchClients: builder.query<Client[], string>({
      query: (searchTerm) => `/clients/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Clients']
    }),

    // ==================== ANALYTICS ====================

    // Get client statistics
    getClientStatistics: builder.query<ClientStatistics, void>({
      query: () => '/clients/analytics/statistics',
      providesTags: ['Clients']
    }),

    // Get client type breakdown
    getClientTypeBreakdown: builder.query<ClientTypeBreakdown[], void>({
      query: () => '/clients/analytics/type-breakdown',
      providesTags: ['Clients']
    }),

    // Get client source breakdown
    getClientSourceBreakdown: builder.query<ClientSourceBreakdown[], void>({
      query: () => '/clients/analytics/source-breakdown',
      providesTags: ['Clients']
    }),

    // ==================== ACTIONS ====================

    // Update client status
    updateClientStatus: builder.mutation<{ message: string }, { client_id: number; status: Client['status'] }>({
      query: ({ client_id, status }) => ({
        url: `/clients/${client_id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Clients"],
    }),

    // Update outstanding balance
    updateOutstandingBalance: builder.mutation<{ message: string }, { client_id: number; balance: string }>({
      query: ({ client_id, balance }) => ({
        url: `/clients/${client_id}/balance`,
        method: "PATCH",
        body: { balance },
      }),
      invalidatesTags: ["Clients"],
    }),

    // Mark conflict checked
    markConflictChecked: builder.mutation<{ message: string }, number>({
      query: (client_id) => ({
        url: `/clients/${client_id}/conflict-check`,
        method: "PATCH",
      }),
      invalidatesTags: ["Clients"],
    }),

    // Assign primary advocate
    assignPrimaryAdvocate: builder.mutation<{ message: string }, { client_id: number; advocate_id: number }>({
      query: ({ client_id, advocate_id }) => ({
        url: `/clients/${client_id}/assign-advocate`,
        method: "PATCH",
        body: { advocate_id },
      }),
      invalidatesTags: ["Clients"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetSingleClientQuery,
  useGetClientByNumberQuery,
  useGetClientByUserIdQuery,
  useGetClientByEmailQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientWithDetailsQuery,
  useGetClientWithCasesQuery,
  useGetClientWithInvoicesQuery,
  useGetClientWithTransactionsQuery,
  useGetClientWithTrustAccountsQuery,
  useGetClientReferralsQuery,
  useGetClientsByTypeQuery,
  useGetClientsByStatusQuery,
  useGetActiveClientsQuery,
  useGetClientsByAdvocateQuery,
  useGetClientsByBillingTypeQuery,
  useGetClientsBySourceQuery,
  useGetClientsWithBalanceQuery,
  useGetClientsByCountryQuery,
  useGetClientsByCityQuery,
  useGetRecentClientsQuery,
  useSearchClientsQuery,
  useLazySearchClientsQuery,
  useGetClientStatisticsQuery,
  useGetClientTypeBreakdownQuery,
  useGetClientSourceBreakdownQuery,
  useUpdateClientStatusMutation,
  useUpdateOutstandingBalanceMutation,
  useMarkConflictCheckedMutation,
  useAssignPrimaryAdvocateMutation,
} = clientsApi;