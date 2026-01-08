import React, { useState } from 'react';
import { Calendar, Clock, Plus, Search, Filter, Users, Video, MapPin } from 'lucide-react';

const AppointmentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-01-08');

  const appointments = [
    { id: 1, client: 'Mary Wanjiku', type: 'Consultation', attorney: 'Lucy Kariuki', time: '10:00 AM', date: '2025-01-08', duration: '1 hour', location: 'Office', status: 'Confirmed' },
    { id: 2, client: 'Tech Solutions Ltd', type: 'Meeting', attorney: 'Dr. Michael Ochieng', time: '2:00 PM', date: '2025-01-08', duration: '2 hours', location: 'Virtual', status: 'Confirmed' },
    { id: 3, client: 'Peter Omondi', type: 'Court Hearing', attorney: 'Lucy Kariuki', time: '9:00 AM', date: '2025-01-09', duration: '3 hours', location: 'Nairobi Courts', status: 'Scheduled' },
    { id: 4, client: 'James Kamau', type: 'Document Signing', attorney: 'Dr. Michael Ochieng', time: '11:00 AM', date: '2025-01-09', duration: '30 mins', location: 'Office', status: 'Pending' },
    { id: 5, client: 'Helping Hands Kenya', type: 'Consultation', attorney: 'Lucy Kariuki', time: '3:00 PM', date: '2025-01-10', duration: '1 hour', location: 'Virtual', status: 'Confirmed' },
  ];

  const filteredAppointments = appointments.filter(apt =>
    (apt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.attorney.toLowerCase().includes(searchTerm.toLowerCase())) &&
    apt.date === selectedDate
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments Management</h1>
        <p className="text-gray-600 mt-1">Schedule and manage client appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">34</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Virtual Meetings</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Video className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Court Hearings</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <Users className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-4 flex-1 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 w-full md:w-auto">
            <Plus className="h-5 w-5" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid gap-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{apt.client}</h3>
                      <p className="text-sm text-gray-600 mt-1">with {apt.attorney}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{apt.time} ({apt.duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {apt.location === 'Virtual' ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      <span>{apt.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No appointments found for the selected date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsManagement;