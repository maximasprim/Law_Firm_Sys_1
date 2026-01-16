import React from 'react';
import { 
  TrendingUp, Clock, CheckCircle2, AlertCircle, Briefcase,
  Users, DollarSign, Calendar, Plus, UserCheck, Building2, Scale,
  Loader2, Bell, FileText, CreditCard, UserPlus
} from 'lucide-react';
import { 
  useGetCaseStatisticsQuery,
  useGetCasesQuery 
} from '../../features/Cases/casesApi';
import { 
  useGetClientStatisticsQuery 
} from '../../features/Clients/clientApi';
import { 
  useGetUpcomingAppointmentsQuery,
  useGetTodayAppointmentsQuery 
} from '../../features/Appointments/appointmentsApi';
import { 
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation 
} from '../../features/Alerts/alertApi';

interface DashboardAnalyticsProps {
  onOpenNewCase: () => void;
  onAddClient: () => void;
  onScheduleAppointment: () => void;
  onAddHearing: () => void;
  onViewAllCases: () => void;
  onViewCalendar?: () => void;
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ 
  onOpenNewCase, 
  onAddClient, 
  onScheduleAppointment, 
  onAddHearing, 
  onViewAllCases, 
  onViewCalendar,
}) => {
  // Fetch data from APIs
  const { data: caseStats, isLoading: caseStatsLoading } = useGetCaseStatisticsQuery();
  const { data: clientStats, isLoading: clientStatsLoading } = useGetClientStatisticsQuery();
  const { data: allCases, isLoading: casesLoading } = useGetCasesQuery();
  const { data: upcomingAppointments, isLoading: appointmentsLoading } = useGetUpcomingAppointmentsQuery();
  const { data: notifications, isLoading: notificationsLoading } = useGetNotificationsQuery();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  // Get recent cases (last 3)
  const recentCases = allCases?.slice(0, 3) || [];

  // Get today's appointments (first 3)
  const latestUpcomingAppointments = upcomingAppointments?.slice(0, 3) || [];

  // Get recent unread notifications (last 5)
  const recentNotifications = notifications?.filter(n => !n.is_read).slice(0, 5) || [];
  console.log('Recent Notifications:', recentNotifications);

  type StatCardProps = {
    title: React.ReactNode;
    value: React.ReactNode;
    change?: { value: React.ReactNode; positive?: boolean } | null;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
    isLoading?: boolean;
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color = 'bg-gray-600', isLoading = false }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
              {change && (
                <p className={`text-sm mt-2 flex items-center ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {change.value}
                </p>
              )}
            </>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString || dateString === '-') return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      'system': Bell,
      'case_update': Briefcase,
      'task_assigned': CheckCircle2,
      'task_due': Clock,
      'appointment_reminder': Calendar,
      'document_uploaded': FileText,
      'payment_received': CreditCard,
      'invoice_sent': DollarSign,
      'message_received': Bell,
      'deadline_approaching': AlertCircle,
    };
    return iconMap[type] || Bell;
  };

  const getNotificationColor = (type: string) => {
    const colorMap = {
      'system': { bg: 'bg-blue-100', text: 'text-blue-600' },
      'case_update': { bg: 'bg-purple-100', text: 'text-purple-600' },
      'task_assigned': { bg: 'bg-green-100', text: 'text-green-600' },
      'task_due': { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      'appointment_reminder': { bg: 'bg-indigo-100', text: 'text-indigo-600' },
      'document_uploaded': { bg: 'bg-cyan-100', text: 'text-cyan-600' },
      'payment_received': { bg: 'bg-green-100', text: 'text-green-600' },
      'invoice_sent': { bg: 'bg-orange-100', text: 'text-orange-600' },
      'message_received': { bg: 'bg-blue-100', text: 'text-blue-600' },
      'deadline_approaching': { bg: 'bg-red-100', text: 'text-red-600' },
    };
    return colorMap[type] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'open': 'bg-blue-100 text-blue-700',
      'in_progress': 'bg-yellow-100 text-yellow-700',
      'pending_court': 'bg-orange-100 text-orange-700',
      'settled': 'bg-green-100 text-green-700',
      'closed': 'bg-gray-100 text-gray-700',
      'consultation': 'bg-purple-100 text-purple-700',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      'high': 'bg-red-100 text-red-700',
      'urgent': 'bg-red-100 text-red-700',
      'critical': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-green-100 text-green-700',
    };
    return priorityColors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getAppointmentTypeColor = (type) => {
    const typeColors = {
      'consultation': 'bg-blue-100 text-blue-700',
      'meeting': 'bg-purple-100 text-purple-700',
      'court_hearing': 'bg-red-100 text-red-700',
      'phone_call': 'bg-green-100 text-green-700',
      'video_conference': 'bg-indigo-100 text-indigo-700',
    };
    return typeColors[type] || 'bg-gray-100 text-gray-700';
  };

  const handleNotificationClick = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const isLoading = caseStatsLoading || clientStatsLoading || casesLoading || appointmentsLoading;

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Cases" 
          value={caseStats?.total_cases || 0}
          change={{ value: `${caseStats?.open_cases || 0} open cases`, positive: true }}
          icon={Briefcase}
          color="bg-amber-600"
          isLoading={caseStatsLoading}
        />
        <StatCard 
          title="Upcoming Appointments" 
          value={upcomingAppointments?.length || 0}
          icon={Clock}
          color="bg-blue-600"
          isLoading={appointmentsLoading}
        />
        <StatCard 
          title="Total Clients" 
          value={clientStats?.total_clients || 0}
          change={{ value: `${clientStats?.active_clients || 0} active`, positive: true }}
          icon={Users}
          color="bg-green-600"
          isLoading={clientStatsLoading}
        />
        <StatCard 
          title="High Priority Cases" 
          value={caseStats?.high_priority_cases || 0}
          icon={AlertCircle}
          color="bg-purple-600"
          isLoading={caseStatsLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'New Case', icon: Plus, color: 'bg-amber-600', onClick: onOpenNewCase },
            { label: 'Add Client', icon: UserCheck, color: 'bg-blue-600', onClick: onAddClient },
            { label: 'Schedule Appointment', icon: Calendar, color: 'bg-green-600', onClick: onScheduleAppointment },
            { label: 'Add Hearing', icon: Scale, color: 'bg-purple-600', onClick: onAddHearing },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border-2 border-gray-200 hover:border-amber-600 hover:bg-amber-50 transition-all group"
            >
              <div className={`p-2 sm:p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="mt-2 text-xs sm:text-sm font-medium text-gray-700 text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Cases */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Cases</h3>
              <button className="text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-medium"
                onClick={onViewAllCases}>
                View All →
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {casesLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : recentCases.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No cases found
              </div>
            ) : (
              recentCases.map((case_) => (
                <div key={case_.case_id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">{case_.case_number}</span>
                      <h4 className="text-sm font-semibold text-gray-900 mt-1">{case_.title}</h4>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(case_.priority)}`}>
                      {case_.priority?.charAt(0).toUpperCase() + case_.priority?.slice(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Type: {case_.case_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p className="flex items-center gap-1">
                      Status: 
                      <span className={`px-2 py-0.5 rounded-full ${getStatusColor(case_.status)}`}>
                        {case_.status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </p>
                    <p>Filing Date: {formatDate(case_.filing_date)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Today's Appointments</h3>
              <button className="text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-medium"
                onClick={onViewCalendar}>
                View Calendar →
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {appointmentsLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : latestUpcomingAppointments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No appointments scheduled for today
              </div>
            ) : (
              latestUpcomingAppointments.map((apt) => (
                <div key={apt.appointment_id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAppointmentTypeColor(apt.appointment_type)}`}>
                      {apt.appointment_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apt.status)}`}>
                      {apt.status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{apt.title}</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    {apt.location && <p>Location: {apt.location}</p>}
                    <p className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(apt.start_time)} - {formatTime(apt.end_time)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Notifications - Now Dynamic */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Alerts</h3>
          {!notificationsLoading && recentNotifications.length > 0 && (
            <span className="text-xs text-gray-500">
              {recentNotifications.filter(n => !n.is_read).length} unread
            </span>
          )}
        </div>
        <div className="space-y-2 sm:space-y-3">
          {notificationsLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No Alerts Yet</p>
            </div>
          ) : (
            recentNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colors = getNotificationColor(notification.type);
              
              return (
                <div 
                  key={notification.notification_id} 
                  onClick={() => handleNotificationClick(notification.notification_id!)}
                  className={`flex items-start gap-2 sm:gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                    notification.is_read 
                      ? 'border-gray-200 bg-white' 
                      : 'border-amber-200 bg-amber-50'
                  }`}
                >
                  <div className={`p-1.5 sm:p-2 rounded-full ${colors.bg} flex-shrink-0`}>
                    <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs sm:text-sm font-medium ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-amber-600 rounded-full mt-1"></span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 line-clamp-2 ${notification.is_read ? 'text-gray-500' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getTimeAgo(notification.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;