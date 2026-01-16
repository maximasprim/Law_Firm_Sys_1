import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, Calendar, FileText, 
  DollarSign, Scale, Bell, Settings, LogOut, Menu, X,
  TrendingUp, Gavel, UserCheck, MessageSquare, ChevronDown, Search
} from 'lucide-react';

// Import individual components
import DashboardAnalytics from './DashboardAnalytics';
import CasesManagement from './CasesManagement';
import ClientsManagement from './ClientsManagement';
import AppointmentsManagement from './AppointmentsManagement';
import CourtHearings from './CourtHearings';
import DocumentsManagement from './DocumentsManagement';
import BillingManagement from './BillingManagement';
import TeamManagement from './TeamManagement';
import ReportsAnalytics from './Reports';
import logo from '../../assets/logo.png';
import { useGetCaseStatisticsQuery } from "../../features/Cases/casesApi"
import {useGetClientStatisticsQuery} from "../../features/Clients/clientApi"
import {useGetAppointmentStatisticsQuery} from "../../features/Appointments/appointmentsApi"

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  component: React.ReactNode;
}

const LawFirmDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [triggerNewCase, setTriggerNewCase] = useState(false);
  const [triggerNewClient, setTriggerAddClient] = useState(false);
  const [triggerScheduleAppointment, setTriggerScheduleAppointment] = useState(false);
  const [triggerAddHearing, setTriggerAddHearing] = useState(false);

  const { data: statistics, isLoading: statsLoading } = useGetCaseStatisticsQuery();
  const { data: clientStatistics, isLoading: clientStatsLoading } = useGetClientStatisticsQuery();
  const { data: appointmentStatistics, isLoading: appointmentStatsLoading } = useGetAppointmentStatisticsQuery();

  const handleOpenNewCase = () => {
    setActiveTab('cases');
    setTriggerNewCase(true);
    setSidebarOpen(false);
  };
  const handleViewAllCases = () => {
    setActiveTab('cases');
    setSidebarOpen(false);
  };

  const handleViewCalendar = () => {
    setActiveTab('appointments');
    setSidebarOpen(false);
  }

  const handleAddClient = () => {
    setActiveTab('clients');
    setTriggerAddClient(true);
    setSidebarOpen(false);
  }
  const handleScheduleAppointment = () => {
    setActiveTab('appointments');
    setTriggerScheduleAppointment(true);
    setSidebarOpen(false);
  }
  const handleAddHearing = () => {
    setActiveTab('hearings');
    setTriggerAddHearing(true);
    setSidebarOpen(false);
  }

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: <DashboardAnalytics onOpenNewCase={handleOpenNewCase} onAddClient={handleAddClient} onScheduleAppointment={handleScheduleAppointment} onAddHearing={handleAddHearing} onViewAllCases={handleViewAllCases} onViewCalendar={handleViewCalendar} /> },
    { id: 'cases', label: 'Cases', icon: Briefcase, badge: statsLoading ? "..." : statistics?.total_cases, component: <CasesManagement triggerNewCase={triggerNewCase} onNewCaseTriggered={() => setTriggerNewCase(false)} />  },
    { id: 'clients', label: 'Clients', icon: Users, badge: clientStatsLoading ? "..." : clientStatistics?.total_clients, component: <ClientsManagement triggerNewClient={triggerNewClient} onNewClientTriggered={() => setTriggerAddClient(false)} /> },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: appointmentStatsLoading ? "..." : appointmentStatistics?.total_appointments, component: <AppointmentsManagement triggerScheduleAppointment={triggerScheduleAppointment} onScheduleAppointmentTriggered={() => setTriggerScheduleAppointment(false)} /> },
    { id: 'hearings', label: 'Court Hearings', icon: Gavel, component: <CourtHearings triggerAddHearing={triggerAddHearing} onAddHearingTriggered={() => setTriggerAddHearing(false)} /> },
    { id: 'documents', label: 'Documents', icon: FileText, component: <DocumentsManagement /> },
    // { id: 'billing', label: 'Billing & Invoices', icon: DollarSign, badge: 15, component: <BillingManagement /> },
    // { id: 'team', label: 'Team Management', icon: UserCheck, component: <TeamManagement /> },
    // { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp, component: <ReportsAnalytics /> },
  ];

  const currentComponent = menuItems.find(item => item.id === activeTab)?.component || <DashboardAnalytics onOpenNewCase={handleOpenNewCase} onAddClient={handleAddClient} onScheduleAppointment={handleScheduleAppointment} onAddHearing={handleAddHearing} onViewAllCases={handleViewAllCases} onViewCalendar={handleViewCalendar} />;

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveTab(itemId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
        <div className="px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
              <div className="ml-2 sm:ml-4 flex items-center">
                <img
              src={logo}
              alt="Owino Kojo Advocates Logo"
              className="h-7 w-7 sm:h-8 sm:w-8"
            />
                {/* <span className="ml-2 text-xl font-display text-primary">Owino Kojo & Co.</span> */}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cases, clients..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <button className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 hover:bg-gray-100 rounded-lg">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-semibold text-sm">
                    A
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600 hidden md:block" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 transition-transform duration-300 z-30 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 lg:translate-x-0`}
      >
        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  activeTab === item.id ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="pt-14 lg:ml-64 transition-all duration-300"
      >
        <div className="min-h-[calc(100vh-3.5rem)]">
          {currentComponent}
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default LawFirmDashboard;