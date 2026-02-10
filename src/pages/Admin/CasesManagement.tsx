import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Briefcase,
  Clock,
  CheckCircle2,
  X,
  Calendar,
  FileText,
  Users,
  Scale,
  MapPin,
  DollarSign,
  AlertCircle,
  User,
  Building2,
  Gavel,
  Loader2,
  FilePlusIcon,
  UserPlus,
  Upload,
  Folder,
  Menu,
} from "lucide-react";
import {
  useGetCasesQuery,
  useGetCaseStatisticsQuery,
  useDeleteCaseMutation,
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useLazySearchCasesQuery,
  useGetCaseWithDetailsQuery,
} from "../../features/Cases/casesApi";
import {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
} from "../../features/Documents/documentsApi";
import { useCreateCaseTeamMemberMutation } from "../../features/Team/teamApi";
import { useGetDocumentsQuery } from "../../features/Documents/documentsApi";
import { toast, Toaster } from "react-hot-toast";
import { useGetClientsQuery } from "../../features/Clients/clientApi";
import { useGetUsersQuery } from "../../features/Users/usersApi";
import { parse } from "path";

interface CasesManagementProps {
  triggerNewCase?: boolean;
  onNewCaseTriggered?: () => void;
}

const CasesManagement: React.FC<CasesManagementProps> = ({
  triggerNewCase,
  onNewCaseTriggered,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [viewingCaseId, setViewingCaseId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // New states for team and document modals
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [selectedCaseForTeam, setSelectedCaseForTeam] = useState(null);
  const [selectedCaseForDocument, setSelectedCaseForDocument] = useState(null);

  useEffect(() => {
    if (triggerNewCase) {
      setShowNewCaseModal(true);
      if (onNewCaseTriggered) {
        onNewCaseTriggered();
      }
    }
  }, [triggerNewCase, onNewCaseTriggered]);

  // RTK Query hooks
  const {
    data: cases = [],
    isLoading: casesLoading,
    isFetching,
    refetch: refetchCases,
    error: casesError,
  } = useGetCasesQuery();
  const { data: statistics, isLoading: statsLoading } =
    useGetCaseStatisticsQuery();
  const [deleteCase, { isLoading: isDeleting }] = useDeleteCaseMutation();
  const [createCase, { isLoading: isCreating }] = useCreateCaseMutation();
  const [updateCase, { isLoading: isUpdating }] = useUpdateCaseMutation();
  const [searchCases, { data: searchResults }] = useLazySearchCasesQuery();

  // New mutations
  const [createDocument, { isLoading: isCreatingDocument }] =
    useCreateDocumentMutation();
  const [createCaseTeamMember, { isLoading: isCreatingTeamMember }] =
    useCreateCaseTeamMemberMutation();

  const filterCasesBySearch = (casesArray, search) => {
    if (!search || search.trim() === "") return casesArray;

    const searchLower = search.toLowerCase().trim();
    return casesArray.filter(
      (case_) =>
        case_.case_number?.toLowerCase().includes(searchLower) ||
        case_.title?.toLowerCase().includes(searchLower) ||
        case_.description?.toLowerCase().includes(searchLower) ||
        case_.opposing_party?.toLowerCase().includes(searchLower) ||
        case_.court_name?.toLowerCase().includes(searchLower)
    );
  };

  // Apply search filter
  const searchFilteredCases = filterCasesBySearch(cases, searchTerm);

  // Filter cases based on status
  const filteredCases = searchFilteredCases.filter((case_) => {
    if (filterStatus === "all") return true;
    return case_.status === filterStatus;
  });

  // Handle case deletion
  const handleDelete = async (caseId) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      setIsProcessing(true);
      try {
        await deleteCase(caseId).unwrap();
        toast.success("Case deleted successfully");
      } catch (error) {
        toast.error("Failed to delete case");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle export to CSV
  const handleExport = () => {
    const headers = [
      "Case Number",
      "Title",
      "Client ID",
      "Status",
      "Priority",
      "Case Type",
      "Filing Date",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredCases.map((c) =>
        [
          c.case_number,
          `"${c.title}"`,
          c.client_id || "",
          c.status,
          c.priority,
          c.case_type,
          c.filing_date || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cases_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "pending_court":
        return "bg-yellow-100 text-yellow-700";
      case "open":
        return "bg-green-100 text-green-700";
      case "settled":
        return "bg-purple-100 text-purple-700";
      case "won":
        return "bg-emerald-100 text-emerald-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 text-white";
      case "urgent":
        return "bg-orange-100 text-orange-700";
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (casesLoading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center h-64">
        <div className="text-gray-600">Loading cases...</div>
      </div>
    );
  }

  if (casesError && (!cases || cases.length === 0)) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm sm:text-base">
          Error loading cases. Please check your API connection.
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <Toaster position="top-right" />
      {(isDeleting ||
        isCreating ||
        isUpdating ||
        isCreatingDocument ||
        isCreatingTeamMember) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 flex items-center gap-3 shadow-xl max-w-sm mx-auto">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-amber-600 flex-shrink-0" />
            <span className="text-gray-900 font-medium text-sm sm:text-base">
              {isDeleting && "Deleting case..."}
              {isCreating && "Creating case..."}
              {isUpdating && "Updating case..."}
              {isCreatingDocument && "Adding document..."}
              {isCreatingTeamMember && "Adding team member..."}
            </span>
          </div>
        </div>
      )}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Cases Management
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage and track all legal cases
          </p>
        </div>
        <button
          onClick={() => refetchCases()}
          disabled={isFetching}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 self-end sm:self-auto"
        >
          <RefreshCw
            className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Total Cases
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : statistics?.total_cases || cases.length}
              </p>
            </div>
            <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                In Progress
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : statistics?.in_progress_cases || 0}
              </p>
            </div>
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Pending Court
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : statistics?.pending_court_cases || 0}
              </p>
            </div>
            <Gavel className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Closed Cases
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : statistics?.closed_cases || 0}
              </p>
            </div>
            <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 w-full items-stretch">
          <div className="w-full lg:flex-1">
            <div className="relative h-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-full pl-9 sm:pl-10 pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:flex-shrink-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="all">All Status</option>
              <option value="consultation">Consultation</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_court">Pending Court</option>
              <option value="on_hold">On Hold</option>
              <option value="settled">Settled</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="dismissed">Dismissed</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
            <button
              onClick={() => setShowNewCaseModal(true)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>New Case</span>
            </button>
            <button
              onClick={handleExport}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cases Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filing Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trial Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No cases found. {searchTerm && "Try adjusting your search."}
                  </td>
                </tr>
              ) : (
                filteredCases.map((case_) => (
                  <tr key={case_.case_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {case_.case_number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {case_.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 capitalize">
                        {case_.case_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                          case_.status
                        )}`}
                      >
                        {case_.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(
                          case_.priority
                        )}`}
                      >
                        {case_.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatDate(case_.filing_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatDate(case_.trial_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingCaseId(case_.case_id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCase(case_);
                            setShowNewCaseModal(true);
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Case"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(case_.case_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Case"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCaseForTeam(case_);
                            setShowAddTeamModal(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Add Case Team"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCaseForDocument(case_);
                            setShowAddDocumentModal(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Add Case Documents"
                        >
                          <FilePlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cases Cards - Mobile & Tablet */}
      <div className="lg:hidden space-y-3">
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            No cases found. {searchTerm && "Try adjusting your search."}
          </div>
        ) : (
          filteredCases.map((case_) => (
            <div
              key={case_.case_id}
              className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {case_.case_number}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {case_.title}
                  </p>
                </div>
                <button
                  onClick={() => setViewingCaseId(case_.case_id)}
                  className="flex-shrink-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                    case_.status
                  )}`}
                >
                  {case_.status.replace("_", " ")}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(
                    case_.priority
                  )}`}
                >
                  {case_.priority}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                  {case_.case_type.replace("_", " ")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Filing:</span>
                  <span className="ml-1 text-gray-900 font-medium">
                    {formatDate(case_.filing_date)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Trial:</span>
                  <span className="ml-1 text-gray-900 font-medium">
                    {formatDate(case_.trial_date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    setEditingCase(case_);
                    setShowNewCaseModal(true);
                  }}
                  className="flex-1 px-3 py-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedCaseForTeam(case_);
                    setShowAddTeamModal(true);
                  }}
                  className="flex-1 px-3 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Team</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedCaseForDocument(case_);
                    setShowAddDocumentModal(true);
                  }}
                  className="flex-1 px-3 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FilePlusIcon className="h-4 w-4" />
                  <span>Docs</span>
                </button>
                <button
                  onClick={() => handleDelete(case_.case_id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Case Details Modal */}
      {viewingCaseId && (
        <CaseDetailsModal
          caseId={viewingCaseId}
          onClose={() => setViewingCaseId(null)}
        />
      )}

      {/* New/Edit Case Modal */}
      {showNewCaseModal && (
        <CaseModal
          case_={editingCase}
          onClose={() => {
            setShowNewCaseModal(false);
            setEditingCase(null);
          }}
          onSave={async (caseData) => {
            setIsProcessing(true);
            try {
              if (editingCase) {
                const cleanedData = Object.entries(caseData).reduce(
                  (acc, [key, value]) => {
                    if (value !== "") {
                      acc[key] = value;
                    }
                    return acc;
                  },
                  {}
                );

                await updateCase({
                  ...cleanedData,
                  case_id: editingCase.case_id,
                }).unwrap();
                toast.success("Case updated successfully");
              } else {
                await createCase(caseData).unwrap();
                toast.success("Case created successfully");
              }
              setShowNewCaseModal(false);
              setEditingCase(null);
            } catch (error) {
              toast.error("Failed to save case");
            } finally {
              setIsProcessing(false);
            }
          }}
        />
      )}

      {/* Add Team Member Modal */}
      {showAddTeamModal && selectedCaseForTeam && (
        <AddTeamMemberModal
          case_={selectedCaseForTeam}
          onClose={() => {
            setShowAddTeamModal(false);
            setSelectedCaseForTeam(null);
          }}
          onSave={async (teamData) => {
            try {
              await createCaseTeamMember(teamData).unwrap();
              toast.success("Team member added successfully");
              setShowAddTeamModal(false);
              setSelectedCaseForTeam(null);
              refetchCases();
            } catch (error) {
              toast.error("Failed to add team member");
            }
          }}
        />
      )}

      {/* Add Document Modal */}
      {showAddDocumentModal && selectedCaseForDocument && (
        <AddDocumentModal
          case_={selectedCaseForDocument}
          onClose={() => {
            setShowAddDocumentModal(false);
            setSelectedCaseForDocument(null);
          }}
          onSave={async (documentData) => {
            try {
              await createDocument(documentData).unwrap();
              toast.success("Document added successfully");
              setShowAddDocumentModal(false);
              setSelectedCaseForDocument(null);
              refetchCases();
            } catch (error) {
              toast.error("Failed to add document");
            }
          }}
        />
      )}
    </div>
  );
};

// Case Details Modal Component
const CaseDetailsModal = ({ caseId, onClose }) => {
  const { data: caseDetails, isLoading } = useGetCaseWithDetailsQuery(caseId);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 sm:p-8">
          <div className="text-gray-600 text-sm sm:text-base">
            Loading case details...
          </div>
        </div>
      </div>
    );
  }

  if (!caseDetails) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              {caseDetails.case_number}
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base line-clamp-2">
              {caseDetails.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full capitalize ${
                  caseDetails.status === "in_progress"
                    ? "bg-blue-100 text-blue-700"
                    : caseDetails.status === "pending_court"
                    ? "bg-yellow-100 text-yellow-700"
                    : caseDetails.status === "open"
                    ? "bg-green-100 text-green-700"
                    : caseDetails.status === "settled"
                    ? "bg-purple-100 text-purple-700"
                    : caseDetails.status === "won"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {caseDetails.status.replace("_", " ")}
              </span>
              <span
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full capitalize ${
                  caseDetails.priority === "critical"
                    ? "bg-red-600 text-white"
                    : caseDetails.priority === "urgent"
                    ? "bg-orange-100 text-orange-700"
                    : caseDetails.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : caseDetails.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {caseDetails.priority} Priority
              </span>
              <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full capitalize bg-gray-100 text-gray-700">
                {caseDetails.case_type.replace("_", " ")}
              </span>
            </div>

            {caseDetails.client && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {caseDetails.primaryAdvocate.contact_phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                Case Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {caseDetails.description && (
                  <div className="sm:col-span-2">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Description
                    </p>
                    <p className="text-xs sm:text-sm text-gray-900 mt-1">
                      {caseDetails.description}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Filing Date
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    {formatDate(caseDetails.filing_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Trial Date</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    {formatDate(caseDetails.trial_date)}
                  </p>
                </div>
                {caseDetails.opposing_party && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Opposing Party
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {caseDetails.opposing_party}
                    </p>
                  </div>
                )}
                {caseDetails.court_name && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Court Name
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {caseDetails.court_name}
                    </p>
                  </div>
                )}
                {caseDetails.judge_name && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Judge Name
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {caseDetails.judge_name}
                    </p>
                  </div>
                )}
                {caseDetails.billing_type && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Billing Type
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 capitalize">
                      {caseDetails.billing_type.replace("_", " ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {caseDetails.team && caseDetails.team.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  Case Team ({caseDetails.team.length})
                </h3>
                <div className="space-y-2">
                  {caseDetails.team.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-white rounded"
                    >
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {member.user.full_name}
                        </p>
                        <p className="text-xs text-gray-600 capitalize">
                          {member.user.role.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {caseDetails.documents && caseDetails.documents.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  Documents ({caseDetails.documents.length})
                </h3>
                <div className="space-y-2">
                  {caseDetails.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-white rounded gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {doc.title}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {doc.file_name}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize flex-shrink-0">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {caseDetails.hearings && caseDetails.hearings.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Gavel className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  Court Hearings ({caseDetails.hearings.length})
                </h3>
                <div className="space-y-2">
                  {caseDetails.hearings.map((hearing, idx) => (
                    <div key={idx} className="p-2 bg-white rounded">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            {hearing.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {hearing.court_name} •{" "}
                            {formatDate(hearing.hearing_date)}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full capitalize flex-shrink-0 self-start">
                          {hearing.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 sm:py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm sm:text-base font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Case Modal Component
const CaseModal = ({ case_, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    case_number: case_?.case_number || "",
    title: case_?.title || "",
    description: case_?.description || "",
    case_type: case_?.case_type || "civil",
    status: case_?.status || "open",
    priority: case_?.priority || "medium",
    client_id: case_?.client_id || "",
    primary_advocate_id: case_?.primary_advocate_id || "",
    opposing_party: case_?.opposing_party || "",
    opposing_counsel: case_?.opposing_counsel || "",
    court_name: case_?.court_name || "",
    court_case_number: case_?.court_case_number || "",
    judge_name: case_?.judge_name || "",
    filing_date: case_?.filing_date || "",
    trial_date: case_?.trial_date || "",
    billing_type: case_?.billing_type || "hourly",
    estimated_value: case_?.estimated_value || "",
    notes: case_?.notes || "",
  });

  const { data: clients = [] } = useGetClientsQuery();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {case_ ? "Edit Case" : "New Case"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Case Number *
              </label>
              <input
                type="text"
                value={formData.case_number}
                onChange={(e) =>
                  setFormData({ ...formData, case_number: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <select
                value={formData.client_id}
                onChange={(e) =>
                  setFormData({ ...formData, client_id: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select a Client</option>
                {clients.map((c) => (
                  <option key={c.client_id} value={c.client_id}>
                    {c.client_number} - {c.first_name} {c.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Case Type *
              </label>
              <select
                value={formData.case_type}
                onChange={(e) =>
                  setFormData({ ...formData, case_type: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              >
                <option value="civil">Civil</option>
                <option value="criminal">Criminal</option>
                <option value="family">Family</option>
                <option value="corporate">Corporate</option>
                <option value="real_estate">Real Estate</option>
                <option value="intellectual_property">
                  Intellectual Property
                </option>
                <option value="employment">Employment</option>
                <option value="immigration">Immigration</option>
                <option value="tax">Tax</option>
                <option value="bankruptcy">Bankruptcy</option>
                <option value="personal_injury">Personal Injury</option>
                <option value="contract_dispute">Contract Dispute</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              >
                <option value="consultation">Consultation</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending_court">Pending Court</option>
                <option value="on_hold">On Hold</option>
                <option value="settled">Settled</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="dismissed">Dismissed</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Opposing Party
              </label>
              <input
                type="text"
                value={formData.opposing_party}
                onChange={(e) =>
                  setFormData({ ...formData, opposing_party: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Opposing Counsel
              </label>
              <input
                type="text"
                value={formData.opposing_counsel}
                onChange={(e) =>
                  setFormData({ ...formData, opposing_counsel: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Court Name
              </label>
              <input
                type="text"
                value={formData.court_name}
                onChange={(e) =>
                  setFormData({ ...formData, court_name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Court Case Number
              </label>
              <input
                type="text"
                value={formData.court_case_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    court_case_number: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Judge Name
              </label>
              <input
                type="text"
                value={formData.judge_name}
                onChange={(e) =>
                  setFormData({ ...formData, judge_name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Billing Type
              </label>
              <select
                value={formData.billing_type}
                onChange={(e) =>
                  setFormData({ ...formData, billing_type: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="hourly">Hourly</option>
                <option value="flat_fee">Flat Fee</option>
                <option value="contingency">Contingency</option>
                <option value="retainer">Retainer</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Filing Date
              </label>
              <input
                type="date"
                value={formData.filing_date}
                onChange={(e) =>
                  setFormData({ ...formData, filing_date: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Trial Date
              </label>
              <input
                type="date"
                value={formData.trial_date}
                onChange={(e) =>
                  setFormData({ ...formData, trial_date: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              rows={2}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm sm:text-base font-medium"
            >
              {case_ ? "Update Case" : "Create Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Team Member Modal Component
const AddTeamMemberModal = ({ case_, onClose, onSave }) => {
  const { data: users, error, isLoading } = useGetUsersQuery();

  const [formData, setFormData] = useState({
    case_id: case_.case_id,
    user_id: "",
    role: "",
    hourly_rate: "",
    responsibilities: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate that user_id is selected and is a valid number
    if (!formData.user_id || formData.user_id === "" || formData.user_id === "0") {
      toast.error("Please select a team member");
      return;
    }

    if (!formData.user_id || !formData.role) {
      toast.error("Please fill in required fields");
      return;
    }
    // Create the data object with proper types
    const submitData = {
      case_id: case_.case_id,
      user_id: parseInt(formData.user_id), // Parse to integer here
      role: formData.role,
      ...(formData.hourly_rate && { hourly_rate: formData.hourly_rate }),
      ...(formData.responsibilities && { responsibilities: formData.responsibilities }),
    };
    
    onSave(submitData);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Add Team Member
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
              Case: {case_.case_number} - {case_.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              New Team Member <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
              required
            >
              <option value="">Select a member</option>
              {isLoading && <option value="">Loading users...</option>}
              {error && <option value="">Error loading users</option>}
              {users?.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.full_name} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              placeholder="e.g., Lead Attorney, Paralegal, Associate"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Hourly Rate (Optional)
            </label>
            <input
              type="text"
              value={formData.hourly_rate}
              onChange={(e) =>
                setFormData({ ...formData, hourly_rate: e.target.value })
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              placeholder="e.g., 150.00"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Responsibilities (Optional)
            </label>
            <textarea
              value={formData.responsibilities}
              onChange={(e) =>
                setFormData({ ...formData, responsibilities: e.target.value })
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              rows={3}
              placeholder="Describe the team member's responsibilities..."
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm sm:text-base font-medium"
            >
              Add Team Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Document Modal Component
const AddDocumentModal = ({ case_, onClose, onSave }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [userId, setUserId] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedParentDoc, setSelectedParentDoc] = useState(undefined);
  const [documents, setDocuments] = useState([]);

  const { data: allDocuments = [] } = useGetDocumentsQuery();
  const [updateDocument] = useUpdateDocumentMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    document_type: "other",
    case_id: case_.case_id,
    client_id: case_.client_id || undefined,
    uploaded_by: userId || undefined,
    access_level: "internal",
    status: "draft",
    parent_document_id: undefined,
    is_template: false,
    version: 1,
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
  }, []);

  const parentDocuments = allDocuments.filter((doc) => !doc.parent_document_id);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "ALL_Files");
      formDataUpload.append("cloud_name", "dcwglllgt");
      formDataUpload.append("folder", "LegalDocuments");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dcwglllgt/auto/upload",
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadedFileUrl(data.secure_url);

      setFormData((prev) => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
        file_name: file.name,
        file_extension: file.name.split(".").pop() || "",
        mime_type: file.type,
        file_size: file.size,
      }));

      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getNextVersionNumber = (parentDocId) => {
    if (!parentDocId) return 1;

    const versions = allDocuments.filter(
      (doc) =>
        doc.parent_document_id === parentDocId ||
        doc.document_id === parentDocId
    );

    if (versions.length === 0) {
      const parentDoc = allDocuments.find((d) => d.document_id === parentDocId);
      return parentDoc ? (parentDoc.version || 1) + 1 : 1;
    }

    const maxVersion = Math.max(...versions.map((v) => v.version || 1));
    return maxVersion + 1;
  };

  const handleParentDocumentChange = (parentDocId) => {
    const parentId = parentDocId ? parseInt(parentDocId) : undefined;
    const nextVersion = parentId ? getNextVersionNumber(parentId) : 1;

    setFormData((prev) => ({
      ...prev,
      parent_document_id: parentId,
      version: nextVersion,
      is_latest_version: true,
    }));

    setSelectedParentDoc(parentId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedFileUrl || !formData.title || !userId) {
      toast.error("Please fill in all required fields and upload a file");
      return;
    }

    if (formData.parent_document_id) {
      const parentId = formData.parent_document_id;

      const relatedDocs = allDocuments.filter(
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

    onSave({
      ...formData,
      file_url: uploadedFileUrl,
      uploaded_by: userId,
      is_latest_version: true,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
        />

        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Add Document
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
              Case: {case_.case_number} - {case_.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="mb-4 sm:mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-amber-600 transition-colors"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-amber-600 animate-spin mb-3 sm:mb-4" />
                  <p className="text-gray-600 text-sm sm:text-base">
                    Uploading file...
                  </p>
                </div>
              ) : uploadedFileUrl ? (
                <div className="flex flex-col items-center">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mb-3 sm:mb-4" />
                  <p className="text-green-600 font-medium text-sm sm:text-base">
                    File uploaded successfully!
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Click to upload a different file
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                  <p className="text-gray-600 font-medium text-sm sm:text-base">
                    Click to upload a document
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    PDF, DOC, DOCX, XLS, XLSX, or images
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Folder className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                <span>Parent Document (Optional - For Versioning)</span>
              </div>
            </label>
            <select
              value={selectedParentDoc || ""}
              onChange={(e) => handleParentDocumentChange(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
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
                This will be saved as version {formData.version}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              placeholder="Enter document title"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              rows={3}
              placeholder="Enter document description..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.document_type}
                onChange={(e) =>
                  setFormData({ ...formData, document_type: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
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
                <option value="power_of_attorney">Power of Attorney</option>
                <option value="will">Will</option>
                <option value="invoice">Invoice</option>
                <option value="receipt">Receipt</option>
                <option value="identification">Identification</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Access Level <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.access_level}
                onChange={(e) =>
                  setFormData({ ...formData, access_level: e.target.value })
                }
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              >
                <option value="internal">Internal</option>
                <option value="public">Public</option>
                <option value="confidential">Confidential</option>
                <option value="highly_confidential">Highly Confidential</option>
                <option value="attorney_client_privileged">
                  Attorney-Client Privileged
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            >
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="filed">Filed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
            <input
              type="checkbox"
              id="is_template"
              checked={formData.is_template}
              onChange={(e) =>
                setFormData({ ...formData, is_template: e.target.checked })
              }
              className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 flex-shrink-0"
            />
            <label
              htmlFor="is_template"
              className="flex-1 cursor-pointer min-w-0"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  Mark as Template
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Save this document as a reusable template for future use
              </p>
            </label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!uploadedFileUrl || isUploading}
              className="w-full sm:w-auto px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
            >
              Add Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CasesManagement;
