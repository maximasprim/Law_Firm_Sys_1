import React from 'react';
import { 
  TrendingUp, Clock, CheckCircle2, AlertCircle, Briefcase,
  Users, DollarSign, Calendar, Plus, UserCheck, Building2
} from 'lucide-react';

const DashboardAnalytics = () => {
  const stats = {
    totalCases: 156,
    activeCases: 89,
    totalClients: 243,
    newClients: 12,
    upcomingHearings: 8,
    totalRevenue: 'KES 2.4M',
    pendingInvoices: 15,
    teamMembers: 12
  };

  const recentCases = [
    { id: 'CAS001', title: 'Tech Solutions Ltd vs. Competitor', client: 'Tech Solutions Ltd', attorney: 'Dr. Michael Ochieng', status: 'In Progress', priority: 'High', nextHearing: '2025-01-15' },
    { id: 'CAS002', title: 'Property Dispute - Nairobi', client: 'James Kamau', attorney: 'Lucy Kariuki', status: 'Pending Court', priority: 'Medium', nextHearing: '2025-01-20' },
    { id: 'CAS003', title: 'Employment Contract Review', client: 'Helping Hands Kenya', attorney: 'Dr. Michael Ochieng', status: 'Open', priority: 'Low', nextHearing: '-' },
  ];

  const upcomingAppointments = [
    { id: 1, client: 'Mary Wanjiku', type: 'Consultation', attorney: 'Lucy Kariuki', time: '10:00 AM', date: 'Today' },
    { id: 2, client: 'Tech Solutions Ltd', type: 'Meeting', attorney: 'Dr. Michael Ochieng', time: '2:00 PM', date: 'Today' },
    { id: 3, client: 'Peter Omondi', type: 'Court Hearing', attorney: 'Lucy Kariuki', time: '9:00 AM', date: 'Tomorrow' },
  ];

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {change.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Cases" 
          value={stats.totalCases} 
          change={{ value: '+12% this month', positive: true }}
          icon={Briefcase}
          color="bg-amber-600"
        />
        <StatCard 
          title="Active Cases" 
          value={stats.activeCases} 
          icon={Clock}
          color="bg-blue-600"
        />
        <StatCard 
          title="Total Clients" 
          value={stats.totalClients} 
          change={{ value: '+5 new this week', positive: true }}
          icon={Users}
          color="bg-green-600"
        />
        <StatCard 
          title="Revenue (Monthly)" 
          value={stats.totalRevenue} 
          icon={DollarSign}
          color="bg-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'New Case', icon: Plus, color: 'bg-amber-600' },
            { label: 'Add Client', icon: UserCheck, color: 'bg-blue-600' },
            { label: 'Schedule Appointment', icon: Calendar, color: 'bg-green-600' },
            { label: 'Create Invoice', icon: DollarSign, color: 'bg-purple-600' },
          ].map((action, idx) => (
            <button
              key={idx}
              className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-amber-600 hover:bg-amber-50 transition-all group"
            >
              <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Cases</h3>
              <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                View All →
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentCases.map((case_) => (
              <div key={case_.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-medium text-gray-500">{case_.id}</span>
                    <h4 className="text-sm font-semibold text-gray-900 mt-1">{case_.title}</h4>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    case_.priority === 'High' ? 'bg-red-100 text-red-700' :
                    case_.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {case_.priority}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Client: {case_.client}</p>
                  <p>Attorney: {case_.attorney}</p>
                  <p>Next Hearing: {case_.nextHearing}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
              <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                View Calendar →
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {apt.type}
                  </span>
                  <span className="text-xs text-gray-500">{apt.date}</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{apt.client}</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>With: {apt.attorney}</p>
                  <p className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {apt.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {[
            { type: 'warning', message: 'Case CAS045 - Filing deadline in 2 days', time: '1 hour ago' },
            { type: 'success', message: 'Payment received from Tech Solutions Ltd - KES 150,000', time: '3 hours ago' },
            { type: 'info', message: 'New client registration: Grace Njeri', time: '5 hours ago' },
          ].map((alert, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
              <div className={`p-2 rounded-full ${
                alert.type === 'warning' ? 'bg-yellow-100' :
                alert.type === 'success' ? 'bg-green-100' :
                'bg-blue-100'
              }`}>
                <AlertCircle className={`h-4 w-4 ${
                  alert.type === 'warning' ? 'text-yellow-600' :
                  alert.type === 'success' ? 'text-green-600' :
                  'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;