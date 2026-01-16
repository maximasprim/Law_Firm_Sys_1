import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Folder,
  Upload,
  Download,
  Search,
  File,
  Loader2,
  X,
  Eye,
  Trash2,
  Filter,
  GitBranch,
  Copy,
  RefreshCw,
} from "lucide-react";
import {
  useGetDocumentsQuery,
  useGetDocumentStatisticsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useLazySearchDocumentsQuery,
  useGetDocumentVersionsQuery,
  Document,
} from "../../features/Documents/documentsApi";
import { useGetCasesQuery } from "@/features/Cases/casesApi";
import { useGetClientsQuery } from "@/features/Clients/clientApi";

const DocumentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedParentDoc, setSelectedParentDoc] = useState<
    number | undefined
  >(undefined);
  const [showVersionsFor, setShowVersionsFor] = useState<number | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Form state for new document
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    document_type: "other" as Document["document_type"],
    case_id: undefined as number | undefined,
    uploaded_by: userId,
    client_id: undefined as number | undefined,
    access_level: "internal" as Document["access_level"],
    status: "draft" as Document["status"],
    parent_document_id: undefined as number | undefined,
    is_template: false,
    version: 1,
  });

  // Get user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
  }, []);

  // Fetch documents data
  const {
    data: documents = [],
    isLoading: loadingDocuments,
    refetch,
    isFetching,
  } = useGetDocumentsQuery();
  const { data: statistics } = useGetDocumentStatisticsQuery();

  const { data: cases = [] } = useGetCasesQuery();
  const { data: clients = [] } = useGetClientsQuery();

  // Search documents
  const [triggerSearch, { data: searchResults }] =
    useLazySearchDocumentsQuery();

  // Mutations
  const [createDocument, { isLoading: isCreating }] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  // Get versions for selected document
  const { data: documentVersions = [] } = useGetDocumentVersionsQuery(
    showVersionsFor!,
    {
      skip: !showVersionsFor,
    }
  );

  // Document type folders
  const folders = [
    "all",
    "contract",
    "court_filing",
    "evidence",
    "correspondence",
    "legal_memo",
    "pleading",
    "motion",
    "brief",
    "affidavit",
    "deposition",
    "settlement_agreement",
    "power_of_attorney",
    "will",
    "invoice",
    "receipt",
    "identification",
    "other",
  ];

  const statuses = [
    "all",
    "draft",
    "pending_review",
    "reviewed",
    "approved",
    "filed",
    "archived",
  ];

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsUploadModalOpen(false);
        setUploadedFileUrl("");
        setSelectedParentDoc(undefined);
      }
    };

    if (isUploadModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUploadModalOpen]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimer = setTimeout(() => {
        triggerSearch(searchTerm);
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, triggerSearch]);

  // Filter documents
  const filteredDocuments = (
    searchTerm.trim() && searchResults ? searchResults : documents
  ).filter((doc) => {
    const matchesFolder =
      selectedFolder === "all" || doc.document_type === selectedFolder;
    const matchesStatus =
      selectedStatus === "all" || doc.status === selectedStatus;
    return matchesFolder && matchesStatus;
  });

  // Get parent documents (for version selection dropdown)
  const parentDocuments = documents.filter((doc) => !doc.parent_document_id);

  // Handle file upload to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ALL_Files");
      formData.append("cloud_name", "dcwglllgt");
      formData.append("folder", "LegalDocuments");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dcwglllgt/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadedFileUrl(data.secure_url);

      // Auto-fill document details from file
      setNewDocument((prev) => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
        file_name: file.name,
        file_extension: file.name.split(".").pop() || "",
        mime_type: file.type,
        file_size: file.size,
      }));

      console.log("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Calculate next version number for a parent document
  const getNextVersionNumber = (parentDocId?: number): number => {
    if (!parentDocId) return 1;

    const versions = documents.filter(
      (doc) =>
        doc.parent_document_id === parentDocId ||
        doc.document_id === parentDocId
    );

    if (versions.length === 0) {
      const parentDoc = documents.find((d) => d.document_id === parentDocId);
      return parentDoc ? (parentDoc.version || 1) + 1 : 1;
    }

    const maxVersion = Math.max(...versions.map((v) => v.version || 1));
    return maxVersion + 1;
  };

  // Handle parent document selection
  const handleParentDocumentChange = (parentDocId: string) => {
    const parentId = parentDocId ? parseInt(parentDocId) : undefined;
    const nextVersion = parentId ? getNextVersionNumber(parentId) : 1;

    setNewDocument((prev) => ({
      ...prev,
      parent_document_id: parentId,
      version: nextVersion,
      is_latest_version: true,
    }));

    setSelectedParentDoc(parentId);
  };

  // Handle creating new version from existing document
  const handleCreateVersion = (doc: Document) => {
    const parentId = doc.parent_document_id || doc.document_id;
    const nextVersion = getNextVersionNumber(parentId);

    setNewDocument({
      title: `${doc.title} (v${nextVersion})`,
      description: doc.description || "",
      document_type: doc.document_type,
      case_id: doc.case_id,
      uploaded_by: userId,
      client_id: doc.client_id,
      access_level: doc.access_level,
      status: "draft",
      parent_document_id: parentId,
      is_template: false,
      version: nextVersion,
    });

    setSelectedParentDoc(parentId);
    setIsUploadModalOpen(true);
  };

  // Handle document submission
  const handleSubmitDocument = async () => {
    if (!uploadedFileUrl || !newDocument.title || !userId) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // If this is a new version, update the parent's is_latest_version to false
      if (newDocument.parent_document_id) {
        const parentId = newDocument.parent_document_id;

        // Find all versions of this document and set is_latest_version to false
        const relatedDocs = documents.filter(
          (doc) =>
            doc.document_id === parentId || doc.parent_document_id === parentId
        );

        for (const doc of relatedDocs) {
          if (doc.is_latest_version) {
            await updateDocument({
              document_id: doc.document_id,
              is_latest_version: false,
            }).unwrap();
          }
        }
      }

      await createDocument({
        ...newDocument,
        file_url: uploadedFileUrl,
        uploaded_by: userId,
        is_latest_version: true,
      }).unwrap();

      // Reset form
      setNewDocument({
        title: "",
        description: "",
        document_type: "other",
        case_id: undefined,
        uploaded_by: userId,
        client_id: undefined,
        access_level: "internal",
        status: "draft",
        parent_document_id: undefined,
        is_template: false,
        version: 1,
      });
      setUploadedFileUrl("");
      setSelectedParentDoc(undefined);
      setIsUploadModalOpen(false);

      // Refetch documents
      refetch();
      alert("Document uploaded successfully!");
    } catch (error) {
      console.error("Failed to create document:", error);
      alert("Failed to upload document. Please try again.");
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    setDeletingDocId(documentId);
    try {
      await deleteDocument(documentId).unwrap();
      refetch();
      alert("Document deleted successfully!");
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document. Please try again.");
    } finally {
      setDeletingDocId(null);
    }
  };

  // Format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get file icon color
  const getFileIconColor = (extension?: string): string => {
    const ext = extension?.toLowerCase();
    if (ext === "pdf") return "text-red-600 bg-red-100";
    if (["doc", "docx"].includes(ext || "")) return "text-blue-600 bg-blue-100";
    if (["xls", "xlsx"].includes(ext || ""))
      return "text-green-600 bg-green-100";
    if (["jpg", "jpeg", "png", "gif"].includes(ext || ""))
      return "text-purple-600 bg-purple-100";
    return "text-gray-600 bg-gray-100";
  };

  // Get parent document title
  const getParentDocTitle = (parentId?: number): string => {
    if (!parentId) return "N/A";
    const parent = documents.find((doc) => doc.document_id === parentId);
    return parent ? parent.title : "Unknown";
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
      />

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Documents Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Organize and manage case documents with version control
          </p>
        </div>
        <div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
            title="Refresh documents"
          >
            <RefreshCw
              className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Documents</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {loadingDocuments
                  ? "..."
                  : statistics?.total_documents || documents.length}
              </p>
            </div>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Pending Review</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {statistics?.pending_review_documents || 0}
              </p>
            </div>
            <Folder className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Storage Used</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {formatFileSize(statistics?.total_file_size)}
              </p>
            </div>
            <File className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Templates</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {statistics?.templates_count || 0}
              </p>
            </div>
            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
          

          
        </div>
      </div> */}

      {/* Search and Upload */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>
          <div className="flex gap-3">
          <div>
            {/* <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Folder className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                Document Type
              </div>
            </label> */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder === "all"
                  ? "All document types"
                  : folder.charAt(0).toUpperCase() +
                    folder.slice(1).replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            {/* <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                Status
              </div>
            </label> */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                  ? "All Status"
                  : status.charAt(0).toUpperCase() +
                    status.slice(1).replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          </div>
          <button
            onClick={() => {
              setSelectedParentDoc(undefined);
              setNewDocument({
                ...newDocument,
                parent_document_id: undefined,
                version: 1,
                is_template: false,
              });
              setIsUploadModalOpen(true);
            }}
            className="px-3 sm:px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 text-sm sm:text-base transition-colors"
          >
            <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Upload Document</span>
            <span className="sm:hidden">Upload</span>
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loadingDocuments ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full hidden md:table">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Name
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No documents found
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.document_id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded ${getFileIconColor(
                              doc.file_extension
                            )}`}
                          >
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {doc.title}
                              </span>
                              {doc.is_template && (
                                <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded">
                                  Template
                                </span>
                              )}
                              {doc.is_latest_version &&
                                doc.parent_document_id && (
                                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                    Latest
                                  </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {doc.file_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Folder className="h-4 w-4 text-yellow-600" />
                          {doc.document_type.replace("_", " ")}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">
                            v{doc.version || 1}
                          </span>
                          {doc.parent_document_id && (
                            <span
                              title={`Child of: ${getParentDocTitle(
                                doc.parent_document_id
                              )}`}
                            >
                              <GitBranch
                                className="h-4 w-4 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            doc.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : doc.status === "pending_review"
                              ? "bg-yellow-100 text-yellow-800"
                              : doc.status === "draft"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {doc.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {formatFileSize(doc.file_size)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {formatDate(doc.created_at)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="View document"
                          >
                            <Eye className="h-5 w-5 text-gray-600" />
                          </a>
                          <a
                            href={doc.file_url}
                            download
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Download document"
                          >
                            <Download className="h-5 w-5 text-gray-600" />
                          </a>
                          <button
                            onClick={() => handleCreateVersion(doc)}
                            className="p-1 hover:bg-blue-100 rounded transition-colors"
                            title="Create new version"
                          >
                            <Copy className="h-5 w-5 text-blue-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteDocument(doc.document_id)
                            }
                            disabled={deletingDocId === doc.document_id}
                            className="p-1 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title={deletingDocId === doc.document_id ? "Deleting..." : "Delete document"}
                          >
                            {deletingDocId === doc.document_id ? (
                              <Loader2 className="h-5 w-5 text-red-600 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5 text-red-600" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredDocuments.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No documents found
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                  <div key={doc.document_id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`p-2 rounded ${getFileIconColor(
                          doc.file_extension
                        )}`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 break-words">
                            {doc.title}
                          </span>
                          {doc.is_template && (
                            <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded whitespace-nowrap">
                              Template
                            </span>
                          )}
                          {doc.is_latest_version &&
                            doc.parent_document_id && (
                              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                                Latest
                              </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 break-words">
                          {doc.file_name}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Folder className="h-4 w-4 text-yellow-600" />
                          Type:
                        </span>
                        <span className="text-gray-900 font-medium">
                          {doc.document_type.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <GitBranch className="h-4 w-4 text-gray-400" />
                          Version:
                        </span>
                        <span className="text-gray-900 font-medium">
                          v{doc.version || 1}
                          {doc.parent_document_id && (
                            <span className="text-xs text-gray-500 ml-1">
                              (of {getParentDocTitle(doc.parent_document_id)})
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            doc.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : doc.status === "pending_review"
                              ? "bg-yellow-100 text-yellow-800"
                              : doc.status === "draft"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {doc.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Size:</span>
                        <span className="text-gray-900 font-medium">
                          {formatFileSize(doc.file_size)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Date:</span>
                        <span className="text-gray-900 font-medium">
                          {formatDate(doc.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Eye className="h-5 w-5 text-gray-600" />
                        <span className="text-xs text-gray-600">View</span>
                      </a>
                      <a
                        href={doc.file_url}
                        download
                        className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Download className="h-5 w-5 text-gray-600" />
                        <span className="text-xs text-gray-600">Download</span>
                      </a>
                      <button
                        onClick={() => handleCreateVersion(doc)}
                        className="flex flex-col items-center gap-1 p-2 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Copy className="h-5 w-5 text-blue-600" />
                        <span className="text-xs text-blue-600">Version</span>
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.document_id)}
                        disabled={deletingDocId === doc.document_id}
                        className="flex flex-col items-center gap-1 p-2 hover:bg-red-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deletingDocId === doc.document_id ? (
                          <>
                            <Loader2 className="h-5 w-5 text-red-600 animate-spin" />
                            <span className="text-xs text-red-600">Deleting</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-5 w-5 text-red-600" />
                            <span className="text-xs text-red-600">Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div ref={modalRef} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {selectedParentDoc ? "Upload New Version" : "Upload Document"}
                </h2>
                <button
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setUploadedFileUrl("");
                    setSelectedParentDoc(undefined);
                  }}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* File Upload Area */}
              <div className="mb-4 sm:mb-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-amber-600 transition-colors"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-amber-600 animate-spin mb-4" />
                      <p className="text-sm sm:text-base text-gray-600 font-medium">Uploading file...</p>
                    </div>
                  ) : uploadedFileUrl ? (
                    <div className="flex flex-col items-center">
                      <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mb-4" />
                      <p className="text-sm sm:text-base text-green-600 font-medium">
                        File uploaded successfully!
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        Click to upload a different file
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
                      <p className="text-sm sm:text-base text-gray-600 font-medium">
                        Click to upload a document
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        PDF, DOC, DOCX, XLS, XLSX, or images
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Details Form */}
              <div className="space-y-3 sm:space-y-4">
                {/* Parent Document Selection */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      Parent Document (Optional - For Versioning)
                    </div>
                  </label>
                  <select
                    value={selectedParentDoc || ""}
                    onChange={(e) => handleParentDocumentChange(e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    <option value="">None - New Document</option>
                    {parentDocuments.map((doc) => (
                      <option key={doc.document_id} value={doc.document_id}>
                        {doc.title} (v{doc.version || 1})
                      </option>
                    ))}
                  </select>
                  {selectedParentDoc && (
                    <p className="text-xs text-gray-500 mt-1">
                      This will be saved as version {newDocument.version}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newDocument.title}
                    onChange={(e) =>
                      setNewDocument({ ...newDocument, title: e.target.value })
                    }
                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    placeholder="Document title"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newDocument.description}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    rows={3}
                    placeholder="Document description"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Document Type
                    </label>
                    <select
                      value={newDocument.document_type}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          document_type: e.target
                            .value as Document["document_type"],
                        })
                      }
                      className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      <option value="contract">Contract</option>
                      <option value="court_filing">Court Filing</option>
                      <option value="evidence">Evidence</option>
                      <option value="correspondence">Correspondence</option>
                      <option value="legal_memo">Legal Memo</option>
                      <option value="pleading">Pleading</option>
                      <option value="motion">Motion</option>
                      <option value="brief">Brief</option>
                      <option value="affidavit">Affidavit</option>
                      <option value="deposition">Deposition</option>
                      <option value="settlement_agreement">
                        Settlement Agreement
                      </option>
                      <option value="power_of_attorney">
                        Power of Attorney
                      </option>
                      <option value="will">Will</option>
                      <option value="invoice">Invoice</option>
                      <option value="receipt">Receipt</option>
                      <option value="identification">Identification</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Access Level
                    </label>
                    <select
                      value={newDocument.access_level}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          access_level: e.target
                            .value as Document["access_level"],
                        })
                      }
                      className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      <option value="public">Public</option>
                      <option value="internal">Internal</option>
                      <option value="confidential">Confidential</option>
                      <option value="highly_confidential">
                        Highly Confidential
                      </option>
                      <option value="attorney_client_privileged">
                        Attorney-Client Privileged
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Link Case (Optional)
                    </label>
                    <select
                      value={newDocument.case_id || ""}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          case_id: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      <option value="">Select a case</option>
                      {cases.map((case_) => (
                        <option key={case_.case_id} value={case_.case_id}>
                          {case_.case_number} - {case_.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Link Client (Optional)
                    </label>
                    <select
                      value={newDocument.client_id || ""}
                      onChange={(e) =>
                        setNewDocument({
                          ...newDocument,
                          client_id: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      <option value="">Select a client</option>
                      {clients.map((client) => (
                        <option key={client.client_id} value={client.client_id}>
                          {client.client_number} -{" "}
                          {client.first_name || client.company_name}{" "}
                          {client.last_name || ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newDocument.status}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        status: e.target.value as Document["status"],
                      })
                    }
                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="filed">Filed</option>
                  </select>
                </div>

                {/* Template Checkbox */}
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <input
                    type="checkbox"
                    id="is_template"
                    checked={newDocument.is_template}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        is_template: e.target.checked,
                      })
                    }
                    className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="is_template"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        Mark as Template
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Save this document as a reusable template for future use
                    </p>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
                <button
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setUploadedFileUrl("");
                    setSelectedParentDoc(undefined);
                  }}
                  className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitDocument}
                  disabled={
                    !uploadedFileUrl || !newDocument.title || isUploading || isCreating
                  }
                  className="flex-1 px-4 py-2 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium transition-colors"
                >
                  {isCreating || isUploading
                    ? selectedParentDoc
                      ? "UPLOADING NEW VERSION..."
                      : "UPLOADING DOCUMENT..."
                    : selectedParentDoc
                    ? "Upload New Version"
                    : "Upload Document"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsManagement;