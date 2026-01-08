import React, { useState } from "react";
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
import {toast, Toaster} from "react-hot-toast";

const CasesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [viewingCaseId, setViewingCaseId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // console.log("Cases:", cases);
  // Handle search with debounce effect
  // React.useEffect(() => {
  //   if (searchTerm.length > 2) {
  //     const timer = setTimeout(() => {
  //       searchCases(searchTerm);
  //     }, 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [searchTerm, searchCases]);

  // // Use search results if searching, otherwise use all cases
  // const casesToDisplay =
  //   searchTerm.length > 2 && searchResults ? searchResults : cases;

  // // Filter cases based on status
  // const filteredCases = casesToDisplay.filter((case_) => {
  //   if (filterStatus === "all") return true;
  //   return case_.status === filterStatus;
  // });
  const filterCasesBySearch = (casesArray, search) => {
    if (!search || search.trim() === "") return casesArray;
    
    const searchLower = search.toLowerCase().trim();
    return casesArray.filter(case_ => 
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
      }finally {
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
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-600">Loading cases...</div>
      </div>
    );
  }

  if (casesError && (!cases || cases.length === 0)) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading cases. Please check your API connection.
          {/* <div className="mt-2 text-sm">{casesError?.message || 'Unknown error'}</div> */}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      {(isDeleting || isCreating || isUpdating) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-xl">
            <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
            <span className="text-gray-900 font-medium">
              {isDeleting && "Deleting case..."}
              {isCreating && "Creating case..."}
              {isUpdating && "Updating case..."}
            </span>
          </div>
        </div>
      )}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all legal cases</p>
        </div>
        <button
          onClick={() => refetchCases()}
          disabled={isFetching}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : statistics?.total_cases || cases.length}
              </p>
            </div>
            <Briefcase className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : statistics?.in_progress_cases || 0}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Court</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : statistics?.pending_court_cases || 0}
              </p>
            </div>
            <Gavel className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Closed Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? "..." : statistics?.closed_cases || 0}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases by title, case number, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
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
            {/* {searchTerm && (
              <p className="text-xs text-gray-500 mt-1">
                Found {searchFilteredCases.length} case(s)
              </p>
            )} */}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
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
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden md:inline">New Case</span>
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                // Clean the data: remove empty strings
                const cleanedData = Object.entries(caseData).reduce(
                  (acc, [key, value]) => {
                    if (value !== "") {
                      acc[key] = value;
                    }
                    return acc;
                  },
                  {} as any
                );

                // console.log("Cleaned data being sent:", cleanedData);

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
              // console.error("Update error:", error);
              toast.error("Failed to save case");
            }
            finally {
              setIsProcessing(false);
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-gray-600">Loading case details...</div>
        </div>
      </div>
    );
  }

  if (!caseDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {caseDetails.case_number}
            </h2>
            <p className="text-gray-600 mt-1">{caseDetails.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${
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
                className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${
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
              <span className="px-3 py-1 text-sm font-medium rounded-full capitalize bg-gray-100 text-gray-700">
                {caseDetails.case_type.replace("_", " ")}
              </span>
            </div>

            {/* Client Information */}
            {caseDetails.client && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-amber-600" />
                  Client Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Client Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseDetails.client.company_name ||
                        `${caseDetails.client.first_name} ${caseDetails.client.last_name}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Client Number</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseDetails.client.client_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseDetails.client.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseDetails.client.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Attorney */}
            {caseDetails.primaryAdvocate && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-amber-600" />
                  Primary Attorney
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseDetails.primaryAdvocate.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {caseDetails.primaryAdvocate.role.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseDetails.primaryAdvocate.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseDetails.primaryAdvocate.contact_phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Case Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-amber-600" />
                Case Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {caseDetails.description && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {caseDetails.description}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Filing Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(caseDetails.filing_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trial Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(caseDetails.trial_date)}
                  </p>
                </div>
                {caseDetails.opposing_party && (
                  <div>
                    <p className="text-sm text-gray-600">Opposing Party</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseDetails.opposing_party}
                    </p>
                  </div>
                )}
                {caseDetails.court_name && (
                  <div>
                    <p className="text-sm text-gray-600">Court Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseDetails.court_name}
                    </p>
                  </div>
                )}
                {caseDetails.judge_name && (
                  <div>
                    <p className="text-sm text-gray-600">Judge Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {caseDetails.judge_name}
                    </p>
                  </div>
                )}
                {caseDetails.billing_type && (
                  <div>
                    <p className="text-sm text-gray-600">Billing Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {caseDetails.billing_type.replace("_", " ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Team Members */}
            {caseDetails.team && caseDetails.team.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-600" />
                  Case Team ({caseDetails.team.length})
                </h3>
                <div className="space-y-2">
                  {caseDetails.team.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-white rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
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

            {/* Documents */}
            {caseDetails.documents && caseDetails.documents.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  Documents ({caseDetails.documents.length})
                </h3>
                <div className="space-y-2">
                  {caseDetails.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-white rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.title}
                        </p>
                        <p className="text-xs text-gray-600">{doc.file_name}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Court Hearings */}
            {caseDetails.hearings && caseDetails.hearings.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-amber-600" />
                  Court Hearings ({caseDetails.hearings.length})
                </h3>
                <div className="space-y-2">
                  {caseDetails.hearings.map((hearing, idx) => (
                    <div key={idx} className="p-2 bg-white rounded">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {hearing.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {hearing.court_name} •{" "}
                            {formatDate(hearing.hearing_date)}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full capitalize">
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

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {case_ ? "Edit Case" : "New Case"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Number *
              </label>
              <input
                type="text"
                value={formData.case_number}
                onChange={(e) =>
                  setFormData({ ...formData, case_number: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client ID
              </label>
              <input
                type="number"
                value={formData.client_id}
                onChange={(e) =>
                  setFormData({ ...formData, client_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Type *
              </label>
              <select
                value={formData.case_type}
                onChange={(e) =>
                  setFormData({ ...formData, case_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opposing Party
              </label>
              <input
                type="text"
                value={formData.opposing_party}
                onChange={(e) =>
                  setFormData({ ...formData, opposing_party: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opposing Counsel
              </label>
              <input
                type="text"
                value={formData.opposing_counsel}
                onChange={(e) =>
                  setFormData({ ...formData, opposing_counsel: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Court Name
              </label>
              <input
                type="text"
                value={formData.court_name}
                onChange={(e) =>
                  setFormData({ ...formData, court_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judge Name
              </label>
              <input
                type="text"
                value={formData.judge_name}
                onChange={(e) =>
                  setFormData({ ...formData, judge_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Type
              </label>
              <select
                value={formData.billing_type}
                onChange={(e) =>
                  setFormData({ ...formData, billing_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="hourly">Hourly</option>
                <option value="flat_fee">Flat Fee</option>
                <option value="contingency">Contingency</option>
                <option value="retainer">Retainer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filing Date
              </label>
              <input
                type="date"
                value={formData.filing_date}
                onChange={(e) =>
                  setFormData({ ...formData, filing_date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trial Date
              </label>
              <input
                type="date"
                value={formData.trial_date}
                onChange={(e) =>
                  setFormData({ ...formData, trial_date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              rows={2}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              {case_ ? "Update Case" : "Create Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CasesManagement;
