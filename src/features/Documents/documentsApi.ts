import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Document {
  document_id: number;
  title: string;
  description?: string;
  document_type: 'contract' | 'court_filing' | 'evidence' | 'correspondence' | 'legal_memo' | 'pleading' | 'motion' | 'brief' | 'affidavit' | 'deposition' | 'settlement_agreement' | 'power_of_attorney' | 'will' | 'invoice' | 'receipt' | 'identification' | 'other';
  file_name: string;
  file_size?: number;
  file_extension?: string;
  mime_type?: string;
  file_url: string;
  storage_path?: string;
  case_id?: number;
  client_id?: number;
  version?: number;
  is_latest_version?: boolean;
  parent_document_id?: number;
  access_level: 'public' | 'internal' | 'confidential' | 'highly_confidential' | 'attorney_client_privileged';
  is_template?: boolean;
  status: 'draft' | 'pending_review' | 'reviewed' | 'approved' | 'filed' | 'archived' | 'deleted';
  date_filed?: string;
  tags?: any;
  metadata?: any;
  uploaded_by: number;
  reviewed_by?: number;
  reviewed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentWithDetails extends Document {
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
  };
  uploader?: {
    user_id: number;
    full_name: string;
    email: string;
    role: string;
  };
  reviewer?: {
    user_id: number;
    full_name: string;
    email: string;
    role: string;
  };
  parentDocument?: {
    document_id: number;
    title: string;
    version: number;
  };
}

export interface DocumentStatistics {
  total_documents: number;
  draft_documents: number;
  pending_review_documents: number;
  reviewed_documents: number;
  approved_documents: number;
  filed_documents: number;
  total_file_size: number;
  templates_count: number;
}

interface UpdateDocument {
  document_id: number;
  title?: string;
  description?: string;
  document_type?: 'contract' | 'court_filing' | 'evidence' | 'correspondence' | 'legal_memo' | 'pleading' | 'motion' | 'brief' | 'affidavit' | 'deposition' | 'settlement_agreement' | 'power_of_attorney' | 'will' | 'invoice' | 'receipt' | 'identification' | 'other';
  file_name?: string;
  file_size?: number;
  file_extension?: string;
  mime_type?: string;
  file_url?: string;
  storage_path?: string;
  case_id?: number;
  client_id?: number;
  version?: number;
  is_latest_version?: boolean;
  parent_document_id?: number;
  access_level?: 'public' | 'internal' | 'confidential' | 'highly_confidential' | 'attorney_client_privileged';
  is_template?: boolean;
  status?: 'draft' | 'pending_review' | 'reviewed' | 'approved' | 'filed' | 'archived' | 'deleted';
  date_filed?: string;
  tags?: any;
  metadata?: any;
  reviewed_by?: number;
  reviewed_at?: string;
}

export const documentsApi = createApi({
  reducerPath: 'documentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Documents'],
  endpoints: (builder) => ({
    // ==================== BASIC CRUD ====================
    
    // Get all documents
    getDocuments: builder.query<Document[], void>({
      query: () => '/documents',
      providesTags: ['Documents']
    }),

    // Get single document by ID
    getSingleDocument: builder.query<Document, number>({
      query: (id) => `/documents/${id}`,
      providesTags: ['Documents']
    }),

    // Create new document
    createDocument: builder.mutation<Document, Partial<Document>>({
      query: (newDocument) => ({
        url: "/documents",
        method: "POST",
        body: newDocument,
      }),
      invalidatesTags: ["Documents"],
    }),

    // Update document
    updateDocument: builder.mutation<Document, UpdateDocument>({
      query: ({ document_id, ...patch }) => ({
        url: `/documents/${document_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Documents"],
    }),

    // Delete document
    deleteDocument: builder.mutation<{ success: boolean }, number>({
      query: (document_id) => ({
        url: `/documents/${document_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents"],
    }),

    // ==================== RELATIONSHIPS & DETAILS ====================

    // Get document with full details (case, client, uploader, reviewer)
    getDocumentWithDetails: builder.query<DocumentWithDetails, number>({
      query: (id) => `/documents/${id}/details`,
      providesTags: ['Documents']
    }),

    // ==================== FILTERING & SEARCH ====================

    // Get documents by case
    getDocumentsByCase: builder.query<Document[], number>({
      query: (caseId) => `/documents/case/${caseId}`,
      providesTags: ['Documents']
    }),

    // Get documents by client
    getDocumentsByClient: builder.query<Document[], number>({
      query: (clientId) => `/documents/client/${clientId}`,
      providesTags: ['Documents']
    }),

    // Get documents by uploader
    getDocumentsByUploader: builder.query<Document[], number>({
      query: (uploaderId) => `/documents/uploader/${uploaderId}`,
      providesTags: ['Documents']
    }),

    // Get documents by type
    getDocumentsByType: builder.query<Document[], Document['document_type']>({
      query: (type) => `/documents/type/${type}`,
      providesTags: ['Documents']
    }),

    // Get documents by status
    getDocumentsByStatus: builder.query<Document[], Document['status']>({
      query: (status) => `/documents/status/${status}`,
      providesTags: ['Documents']
    }),

    // Get documents by access level
    getDocumentsByAccessLevel: builder.query<Document[], Document['access_level']>({
      query: (accessLevel) => `/documents/access-level/${accessLevel}`,
      providesTags: ['Documents']
    }),

    // Get documents by case and type
    getDocumentsByCaseAndType: builder.query<Document[], { caseId: number; type: Document['document_type'] }>({
      query: ({ caseId, type }) => `/documents/case/${caseId}/type/${type}`,
      providesTags: ['Documents']
    }),

    // Search documents (query parameter: ?q=search_term)
    searchDocuments: builder.query<Document[], string>({
      query: (searchTerm) => `/documents/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Documents']
    }),

    // ==================== VERSION CONTROL ====================

    // Get document versions
    getDocumentVersions: builder.query<Document[], number>({
      query: (parentDocumentId) => `/documents/${parentDocumentId}/versions`,
      providesTags: ['Documents']
    }),

    // Get latest document versions only
    getLatestDocumentVersions: builder.query<Document[], void>({
      query: () => '/documents/versions/latest',
      providesTags: ['Documents']
    }),

    // ==================== TEMPLATES & WORKFLOWS ====================

    // Get document templates
    getDocumentTemplates: builder.query<Document[], void>({
      query: () => '/documents/templates/all',
      providesTags: ['Documents']
    }),

    // Get documents pending review
    getDocumentsPendingReview: builder.query<Document[], void>({
      query: () => '/documents/workflow/pending-review',
      providesTags: ['Documents']
    }),

    // ==================== ANALYTICS & REPORTS ====================

    // Get document statistics
    getDocumentStatistics: builder.query<DocumentStatistics, void>({
      query: () => '/documents/analytics/statistics',
      providesTags: ['Documents']
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetSingleDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentWithDetailsQuery,
  useGetDocumentsByCaseQuery,
  useGetDocumentsByClientQuery,
  useGetDocumentsByUploaderQuery,
  useGetDocumentsByTypeQuery,
  useGetDocumentsByStatusQuery,
  useGetDocumentsByAccessLevelQuery,
  useGetDocumentsByCaseAndTypeQuery,
  useSearchDocumentsQuery,
  useLazySearchDocumentsQuery,
  useGetDocumentVersionsQuery,
  useGetLatestDocumentVersionsQuery,
  useGetDocumentTemplatesQuery,
  useGetDocumentsPendingReviewQuery,
  useGetDocumentStatisticsQuery,
} = documentsApi;