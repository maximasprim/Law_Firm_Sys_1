import React, { useState } from 'react';
import { UserCheck, Mail, Phone, Briefcase, Plus, Search, MoreVertical } from 'lucide-react';

const TeamManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const teamMembers = [
    { id: 1, name: 'Dr. Michael Ochieng', role: 'Senior Partner', email: 'michael.o@firm.com', phone: '+254 712 345 678', activeCases: 15, status: 'Active', specialty: 'Corporate Law', joined: '2015-03-10' },
    { id: 2, name: 'Lucy Kariuki', role: 'Partner', email: 'lucy.k@firm.com', phone: '+254 723 456 789', activeCases: 12, status: 'Active', specialty: 'Family Law', joined: '2017-08-15' },
    { id: 3, name: 'John Mwangi', role: 'Associate Attorney', email: 'john.m@firm.com', phone: '+254 734 567 890', activeCases: 8, status: 'Active', specialty: 'Criminal Law', joined: '2020-01-20' },
    { id: 4, name: 'Sarah Njeri', role: 'Junior Attorney', email: 'sarah.n@firm.com', phone: '+254 745 678 901', activeCases: 5, status: 'Active', specialty: 'Property Law', joined: '2022-06-01' },
    { id: 5, name: 'David Kamau', role: 'Legal Assistant', email: 'david.k@firm.com', phone: '+254 756 789 012', activeCases: 0, status: 'Active', specialty: 'Research', joined: '2023-02-15' },
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <p className="text-gray-600 mt-1">Manage attorneys and staff members</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Team Members</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attorneys</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Briefcase className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Support Staff</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <Briefcase className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 w-full md:w-auto">
            <Plus className="h-5 w-5" />
            Add Team Member
          </button>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-amber-600">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                    member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
              <button className="text-gray-600 hover:text-gray-900">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4" />
                <span>{member.specialty}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{member.phone}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Active Cases</p>
                  <p className="text-lg font-bold text-gray-900">{member.activeCases}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-gray-900">{member.joined}</p>
                </div>
                <button className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManagement;