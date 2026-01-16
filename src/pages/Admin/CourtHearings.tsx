import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Gavel, Calendar, Clock, MapPin, FileText, Plus, AlertCircle, Trash2, Edit, X, Check } from 'lucide-react';
import {
  useGetCourtHearingsQuery,
  useGetCourtHearingStatisticsQuery,
  useGetUpcomingCourtHearingsQuery,
  useDeleteCourtHearingMutation,
  useMarkHearingCompletedMutation,
  useCancelHearingMutation,
  useRescheduleHearingMutation,
  useUpdateHearingOutcomeMutation,
  useCreateCourtHearingMutation,
} from '@/features/Hearings/hearingsApi';
import { useGetCasesQuery } from '@/features/Cases/casesApi';
import {toast, Toaster} from 'react-hot-toast';

interface CourtHearingsProps {
  triggerAddHearing?: boolean;
  onAddHearingTriggered?: () => void;
}

const CourtHearings: React.FC<CourtHearingsProps> = ({ triggerAddHearing, onAddHearingTriggered }) => {
  const [filter, setFilter] = useState('upcoming');
  const [selectedHearing, setSelectedHearing] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [outcome, setOutcome] = useState('');
  const [nextHearingDate, setNextHearingDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHearing, setNewHearing] = useState({
    case_id: '',
    hearing_type: 'other',
    title: '',
    description: '',
    court_name: '',
    court_room: '',
    judge_name: '',
    hearing_date: '',
    duration_minutes: '',
    notes: ''
  });

  // Refs for modal content
  const rescheduleModalRef = useRef<HTMLDivElement>(null);
  const outcomeModalRef = useRef<HTMLDivElement>(null);
  const addModalRef = useRef<HTMLDivElement>(null);

  // RTK Query hooks
  const { data: allHearings = [], isLoading, error } = useGetCourtHearingsQuery();
  const { data: upcomingHearings = [] } = useGetUpcomingCourtHearingsQuery(7);
  const { data: statistics } = useGetCourtHearingStatisticsQuery();
  
  // Mutation hooks
  const [deleteHearing, { isLoading: isDeleting }] = useDeleteCourtHearingMutation();
  const [markCompleted, { isLoading: isMarkingCompleted }] = useMarkHearingCompletedMutation();
  const [cancelHearing, { isLoading: isCancelling }] = useCancelHearingMutation();
  const [rescheduleHearing, { isLoading: isRescheduling }] = useRescheduleHearingMutation();
  const [updateOutcome, { isLoading: isUpdatingOutcome }] = useUpdateHearingOutcomeMutation();
  const [createHearing, { isLoading: isCreating }] = useCreateCourtHearingMutation();
  const { data: cases = [] } = useGetCasesQuery();

  // Track which hearing is being processed
  const [processingHearingId, setProcessingHearingId] = useState<number | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    if (triggerAddHearing && onAddHearingTriggered) {
      setShowAddModal(true);
      onAddHearingTriggered();
    }
  }, [triggerAddHearing, onAddHearingTriggered]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showRescheduleModal && rescheduleModalRef.current && !rescheduleModalRef.current.contains(event.target as Node)) {
        setShowRescheduleModal(false);
        setNewDate('');
        setSelectedHearing(null);
      }
      if (showOutcomeModal && outcomeModalRef.current && !outcomeModalRef.current.contains(event.target as Node)) {
        setShowOutcomeModal(false);
        setOutcome('');
        setNextHearingDate('');
        setSelectedHearing(null);
      }
      if (showAddModal && addModalRef.current && !addModalRef.current.contains(event.target as Node)) {
        setShowAddModal(false);
        setNewHearing({
          case_id: '',
          hearing_type: 'other',
          title: '',
          description: '',
          court_name: '',
          court_room: '',
          judge_name: '',
          hearing_date: '',
          duration_minutes: '',
          notes: ''
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRescheduleModal, showOutcomeModal, showAddModal]);

  // Filter hearings based on selected filter
  const filteredHearings = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'upcoming':
        return allHearings.filter(h => {
          const hearingDate = new Date(h.hearing_date);
          return (h.status === 'scheduled' || h.status === 'confirmed') && hearingDate >= now;
        });
      case 'completed':
        return allHearings.filter(h => h.status === 'completed');
      case 'cancelled':
        return allHearings.filter(h => h.status === 'cancelled');
      case 'today':
        return allHearings.filter(h => {
          const hearingDate = new Date(h.hearing_date);
          hearingDate.setHours(0, 0, 0, 0);
          return hearingDate.getTime() === now.getTime();
        });
      default:
        return allHearings;
    }
  }, [allHearings, filter]);

  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Check if hearing is within 48 hours
  const isWithin48Hours = (dateString: string) => {
    const hearingDate = new Date(dateString);
    const now = new Date();
    const hoursDiff = (hearingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 0 && hoursDiff <= 48;
  };

  const urgentHearings = allHearings.filter(h => 
    (h.status === 'scheduled' || h.status === 'confirmed' || h.status === 'rescheduled') && isWithin48Hours(h.hearing_date)
  );

  // Handle actions
  const handleDelete = async (hearingId) => {
    if (window.confirm('Are you sure you want to delete this hearing?')) {
      try {
        setProcessingHearingId(hearingId);
        setProcessingAction('delete');
        await deleteHearing(hearingId).unwrap();
        toast.success('Hearing deleted successfully');
      } catch (err) {
        toast.error('Failed to delete hearing');
      } finally {
        setProcessingHearingId(null);
        setProcessingAction(null);
      }
    }
  };

  const handleMarkCompleted = async (hearingId) => {
    try {
      setProcessingHearingId(hearingId);
      setProcessingAction('complete');
      await markCompleted(hearingId).unwrap();
      toast.success('Hearing marked as completed');
    } catch (err) {
      toast.error('Failed to mark as completed');
    } finally {
      setProcessingHearingId(null);
      setProcessingAction(null);
    }
  };

  const handleCancel = async (hearingId) => {
    if (window.confirm('Are you sure you want to cancel this hearing?')) {
      try {
        setProcessingHearingId(hearingId);
        setProcessingAction('cancel');
        await cancelHearing(hearingId).unwrap();
        toast.success('Hearing cancelled successfully');
      } catch (err) {
        toast.error('Failed to cancel hearing');
      } finally {
        setProcessingHearingId(null);
        setProcessingAction(null);
      }
    }
  };

  const handleReschedule = async () => {
    if (!newDate) {
      alert('Please select a new date');
      return;
    }
    try {
      await rescheduleHearing({ 
        hearing_id: selectedHearing.hearing_id, 
        hearing_date: newDate 
      }).unwrap();
      setShowRescheduleModal(false);
      setNewDate('');
      toast.success('Hearing rescheduled successfully');
      setSelectedHearing(null);
    } catch (err) {
      toast.error('Failed to reschedule hearing');
    }
  };

  const handleUpdateOutcome = async () => {
    if (!outcome) {
      alert('Please enter an outcome');
      return;
    }
    try {
      await updateOutcome({
        hearing_id: selectedHearing.hearing_id,
        outcome,
        next_hearing_date: nextHearingDate || undefined
      }).unwrap();
      setShowOutcomeModal(false);
      setOutcome('');
      setNextHearingDate('');
      toast.success('Hearing outcome updated successfully');
      setSelectedHearing(null);
    } catch (err) {
      toast.error('Failed to update outcome');
    }
  };

  const handleAddHearing = async () => {
    if (!newHearing.case_id || !newHearing.title || !newHearing.court_name || !newHearing.hearing_date) {
      alert('Please fill in all required fields (Case ID, Title, Court Name, and Date)');
      return;
    }
    try {
      const hearingData = {
        ...newHearing,
        case_id: parseInt(newHearing.case_id),
        duration_minutes: newHearing.duration_minutes ? parseInt(newHearing.duration_minutes) : undefined,
        status: 'scheduled'
      };
      await createHearing(hearingData as any).unwrap();
      setShowAddModal(false);
      toast.success('Hearing created successfully');
      setNewHearing({
        case_id: '',
        hearing_type: 'other',
        title: '',
        description: '',
        court_name: '',
        court_room: '',
        judge_name: '',
        hearing_date: '',
        duration_minutes: '',
        notes: ''
      });
    } catch (err) {
      toast.error('Failed to create hearing');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-700';
      case 'no_show':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'trial':
        return 'bg-red-100 text-red-700';
      case 'appeal':
        return 'bg-purple-100 text-purple-700';
      case 'motion':
        return 'bg-blue-100 text-blue-700';
      case 'preliminary':
        return 'bg-cyan-100 text-cyan-700';
      case 'sentencing':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hearings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading hearings. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <Toaster position="top-right" />
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Court Hearings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Track and manage all court proceedings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Upcoming</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {statistics?.scheduled || 0}
              </p>
            </div>
            <Gavel className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">This Week</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {upcomingHearings.length}
              </p>
            </div>
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {statistics?.completed || 0}
              </p>
            </div>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {statistics?.total_hearings || 0}
              </p>
            </div>
            <Gavel className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-amber-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
            >
              All ({allHearings.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm ${filter === 'upcoming' ? 'bg-amber-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm ${filter === 'today' ? 'bg-amber-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm ${filter === 'completed' ? 'bg-amber-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm ${filter === 'cancelled' ? 'bg-amber-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
            >
              Cancelled
            </button>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Add Hearing</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Urgent Alert */}
      {urgentHearings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-900 text-sm sm:text-base">Upcoming Deadline</h3>
            <p className="text-xs sm:text-sm text-yellow-800 mt-1">
              You have {urgentHearings.length} hearing{urgentHearings.length > 1 ? 's' : ''} scheduled within the next 48 hours. Ensure all preparations are complete.
            </p>
          </div>
        </div>
      )}

      {/* Hearings List */}
      {filteredHearings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
          <Gavel className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">No hearings found for this filter</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredHearings.map((hearing) => (
            <div key={hearing.hearing_id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs sm:text-sm font-medium text-gray-500">#{hearing.hearing_id}</span>
                        <span className={`px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full ${getTypeColor(hearing.hearing_type)}`}>
                          {hearing.hearing_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{hearing.title}</h3>
                      {hearing.description && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{hearing.description}</p>
                      )}
                    </div>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(hearing.status)}`}>
                      {hearing.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="break-words">{hearing.court_name}{hearing.court_room ? ` - ${hearing.court_room}` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{formatDate(hearing.hearing_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{formatTime(hearing.hearing_date)}{hearing.duration_minutes ? ` (${hearing.duration_minutes} min)` : ''}</span>
                    </div>
                    {hearing.judge_name && (
                      <div className="flex items-center gap-2">
                        <Gavel className="h-4 w-4 flex-shrink-0" />
                        <span className="break-words">{hearing.judge_name}</span>
                      </div>
                    )}
                  </div>

                  {hearing.outcome && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs sm:text-sm text-gray-600">
                        <span className="font-medium">Outcome:</span> {hearing.outcome}
                      </p>
                      {hearing.next_hearing_date && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          <span className="font-medium">Next Hearing:</span> {formatDate(hearing.next_hearing_date)}
                        </p>
                      )}
                    </div>
                  )}

                  {hearing.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs sm:text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {hearing.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(hearing.status === 'scheduled' || hearing.status === 'confirmed' || hearing.status === 'rescheduled') && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedHearing(hearing);
                          setShowRescheduleModal(true);
                        }}
                        className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm flex items-center justify-center gap-2"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleMarkCompleted(hearing.hearing_id)}
                        disabled={processingHearingId === hearing.hearing_id && processingAction === 'complete'}
                        className="flex-1 min-w-[140px] px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingHearingId === hearing.hearing_id && processingAction === 'complete' ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                            Completing...
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                            Complete
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedHearing(hearing);
                          setShowOutcomeModal(true);
                        }}
                        className="flex-1 min-w-[140px] px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm"
                      >
                        Add Outcome
                      </button>
                      <button
                        onClick={() => handleCancel(hearing.hearing_id)}
                        disabled={processingHearingId === hearing.hearing_id && processingAction === 'cancel'}
                        className="flex-1 min-w-[140px] px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingHearingId === hearing.hearing_id && processingAction === 'cancel' ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                            Cancelling...
                          </>
                        ) : (
                          'Cancel'
                        )}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(hearing.hearing_id)}
                    disabled={processingHearingId === hearing.hearing_id && processingAction === 'delete'}
                    className="flex-1 min-w-[140px] px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingHearingId === hearing.hearing_id && processingAction === 'delete' ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-red-600"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedHearing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={rescheduleModalRef} className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Reschedule Hearing</h3>
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setNewDate('');
                  setSelectedHearing(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 break-words">{selectedHearing.title}</p>
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                New Date & Time
              </label>
              <input
                type="datetime-local"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setNewDate('');
                  setSelectedHearing(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={isRescheduling}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRescheduling ? 'RESCHEDULING...' : 'RESCHEDULE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Outcome Modal */}
      {showOutcomeModal && selectedHearing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={outcomeModalRef} className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Add Hearing Outcome</h3>
              <button
                onClick={() => {
                  setShowOutcomeModal(false);
                  setOutcome('');
                  setNextHearingDate('');
                  setSelectedHearing(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 break-words">{selectedHearing.title}</p>
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Outcome
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                placeholder="Enter the hearing outcome..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Next Hearing Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={nextHearingDate}
                onChange={(e) => setNextHearingDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowOutcomeModal(false);
                  setOutcome('');
                  setNextHearingDate('');
                  setSelectedHearing(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOutcome}
                disabled={isUpdatingOutcome}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingOutcome ? 'SAVING...' : 'SAVE OUTCOME'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Hearing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={addModalRef} className="bg-white rounded-lg max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Add New Hearing</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewHearing({
                    case_id: '',
                    hearing_type: 'other',
                    title: '',
                    description: '',
                    court_name: '',
                    court_room: '',
                    judge_name: '',
                    hearing_date: '',
                    duration_minutes: '',
                    notes: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
               <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Case <span className="text-red-500">*</span>
                </label>
                <select
                  value={newHearing.case_id}
                  onChange={(e) => setNewHearing({...newHearing, case_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                >
                  <option value="">Select a case</option>
                  {cases.map((c) => (
                    <option key={c.case_id} value={c.case_id}>
                      {c.case_number} - {c.title}
                    </option>
                  ))}
                </select>
              </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Hearing Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newHearing.hearing_type}
                    onChange={(e) => setNewHearing({...newHearing, hearing_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  >
                    <option value="other">Other</option>
                    <option value="preliminary">Preliminary</option>
                    <option value="trial">Trial</option>
                    <option value="sentencing">Sentencing</option>
                    <option value="appeal">Appeal</option>
                    <option value="motion">Motion</option>
                    <option value="status_conference">Status Conference</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newHearing.title}
                  onChange={(e) => setNewHearing({...newHearing, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="Enter hearing title"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newHearing.description}
                  onChange={(e) => setNewHearing({...newHearing, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="Enter hearing description"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Court Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newHearing.court_name}
                    onChange={(e) => setNewHearing({...newHearing, court_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    placeholder="Enter court name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Court Room
                  </label>
                  <input
                    type="text"
                    value={newHearing.court_room}
                    onChange={(e) => setNewHearing({...newHearing, court_room: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    placeholder="Enter court room"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Judge Name
                </label>
                <input
                  type="text"
                  value={newHearing.judge_name}
                  onChange={(e) => setNewHearing({...newHearing, judge_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="Enter judge name"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Hearing Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newHearing.hearing_date}
                    onChange={(e) => setNewHearing({...newHearing, hearing_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newHearing.duration_minutes}
                    onChange={(e) => setNewHearing({...newHearing, duration_minutes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    placeholder="Enter duration"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newHearing.notes}
                  onChange={(e) => setNewHearing({...newHearing, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  placeholder="Enter any additional notes"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewHearing({
                    case_id: '',
                    hearing_type: 'other',
                    title: '',
                    description: '',
                    court_name: '',
                    court_room: '',
                    judge_name: '',
                    hearing_date: '',
                    duration_minutes: '',
                    notes: ''
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHearing}
                disabled={isCreating}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'ADDING...' : 'ADD HEARING'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtHearings;