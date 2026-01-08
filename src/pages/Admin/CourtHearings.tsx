import React, { useState } from 'react';
import { Gavel, Calendar, Clock, MapPin, FileText, Plus, AlertCircle } from 'lucide-react';

const CourtHearings = () => {
  const [filter, setFilter] = useState('upcoming');

  const hearings = [
    { id: 1, caseId: 'CAS001', caseName: 'Tech Solutions Ltd vs. Competitor', court: 'High Court of Kenya, Nairobi', date: '2025-01-15', time: '9:00 AM', judge: 'Hon. Justice Mwangi', attorney: 'Dr. Michael Ochieng', status: 'Scheduled', type: 'Main Hearing' },
    { id: 2, caseId: 'CAS002', caseName: 'Property Dispute - Nairobi', court: 'Milimani Commercial Courts', date: '2025-01-20', time: '10:30 AM', judge: 'Hon. Justice Kamau', attorney: 'Lucy Kariuki', status: 'Scheduled', type: 'Mention' },
    { id: 3, caseId: 'CAS004', caseName: 'Family Law - Custody Case', court: 'Nairobi Family Court', date: '2025-01-18', time: '11:00 AM', judge: 'Hon. Justice Wanjiru', attorney: 'Lucy Kariuki', status: 'Scheduled', type: 'Ruling' },
    { id: 4, caseId: 'CAS007', caseName: 'Criminal Defense Matter', court: 'Magistrate Court', date: '2025-01-10', time: '9:30 AM', judge: 'Hon. Magistrate Ouma', attorney: 'Dr. Michael Ochieng', status: 'Completed', type: 'Main Hearing' },
  ];

  const filteredHearings = hearings.filter(hearing => {
    if (filter === 'upcoming') return hearing.status === 'Scheduled';
    if (filter === 'completed') return hearing.status === 'Completed';
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Court Hearings</h1>
        <p className="text-gray-600 mt-1">Track and manage all court proceedings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Hearings</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Gavel className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-amber-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
            >
              All Hearings
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg ${filter === 'upcoming' ? 'bg-amber-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-amber-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
            >
              Completed
            </button>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Hearing
          </button>
        </div>
      </div>

      {/* Urgent Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-yellow-900">Upcoming Deadline</h3>
          <p className="text-sm text-yellow-800 mt-1">You have 2 hearings scheduled within the next 48 hours. Ensure all preparations are complete.</p>
        </div>
      </div>

      {/* Hearings List */}
      <div className="space-y-4">
        {filteredHearings.map((hearing) => (
          <div key={hearing.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-500">{hearing.caseId}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        hearing.type === 'Main Hearing' ? 'bg-red-100 text-red-700' :
                        hearing.type === 'Ruling' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {hearing.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{hearing.caseName}</h3>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    hearing.status === 'Scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {hearing.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{hearing.court}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{hearing.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{hearing.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gavel className="h-4 w-4" />
                    <span>{hearing.judge}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Representing Attorney:</span> {hearing.attorney}
                  </p>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  View Case
                </button>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">
                  Prepare Documents
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtHearings;