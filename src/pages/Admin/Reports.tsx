import React, { useState } from 'react';
import { TrendingUp, Download, FileText, DollarSign, Briefcase, Users, Calendar } from 'lucide-react';

const ReportsAnalytics = () => {
  const [reportType, setReportType] = useState('financial');
  const [period, setPeriod] = useState('month');

  const financialData = [
    { month: 'July', revenue: 1800000, expenses: 800000, profit: 1000000 },
    { month: 'August', revenue: 2100000, expenses: 850000, profit: 1250000 },
    { month: 'September', revenue: 1950000, expenses: 820000, profit: 1130000 },
    { month: 'October', revenue: 2300000, expenses: 900000, profit: 1400000 },
    { month: 'November', revenue: 2200000, expenses: 880000, profit: 1320000 },
    { month: 'December', revenue: 2500000, expenses: 950000, profit: 1550000 },
  ];

  const caseStats = [
    { category: 'Corporate Law', cases: 45, percentage: 29 },
    { category: 'Family Law', cases: 38, percentage: 24 },
    { category: 'Criminal Law', cases: 32, percentage: 21 },
    { category: 'Property Law', cases: 25, percentage: 16 },
    { category: 'Employment Law', cases: 16, percentage: 10 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Generate insights and business reports</p>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-4 flex-wrap">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="financial">Financial Report</option>
              <option value="cases">Cases Report</option>
              <option value="clients">Clients Report</option>
              <option value="team">Team Performance</option>
            </select>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">KES 2.5M</p>
              <p className="text-xs text-green-600 mt-1">+15% vs last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cases Closed</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-xs text-blue-600 mt-1">+8% vs last month</p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Clients</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-purple-600 mt-1">+20% vs last month</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Billable Hours</p>
              <p className="text-2xl font-bold text-gray-900">856</p>
              <p className="text-xs text-amber-600 mt-1">+12% vs last month</p>
            </div>
            <Calendar className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Financial Overview (Last 6 Months)</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-4">
            {financialData.map((data) => (
              <div key={data.month}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900">{data.month}</span>
                  <span className="text-gray-600">KES {(data.revenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all"
                    style={{ width: `${(data.revenue / 2500000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cases by Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Cases by Practice Area</h3>
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {caseStats.map((stat) => (
              <div key={stat.category}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900">{stat.category}</span>
                  <span className="text-gray-600">{stat.cases} cases ({stat.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${stat.percentage * 3.33}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'Monthly Financial Summary', icon: DollarSign, color: 'bg-green-100 text-green-600' },
            { title: 'Case Status Report', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
            { title: 'Client Activity Report', icon: Users, color: 'bg-purple-100 text-purple-600' },
            { title: 'Team Performance Report', icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
            { title: 'Billing Summary', icon: FileText, color: 'bg-red-100 text-red-600' },
            { title: 'Court Schedule Report', icon: Calendar, color: 'bg-indigo-100 text-indigo-600' },
          ].map((report, idx) => (
            <button
              key={idx}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
            >
              <div className={`inline-flex p-3 rounded-lg ${report.color} mb-3`}>
                <report.icon className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{report.title}</h4>
              <p className="text-sm text-gray-600 mb-3">Generate detailed {report.title.toLowerCase()}</p>
              <span className="text-sm text-amber-600 font-medium">Generate →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;