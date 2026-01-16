import React, { useEffect, useState, useRef } from 'react';
import { Search, Plus, Download, Eye, Edit2, Trash2, Users, UserCheck, Phone, Mail, X, Calendar, Building, User, MapPin, CreditCard, FileText, AlertCircle, Briefcase } from 'lucide-react';
import { 
  useGetClientsQuery, 
  useGetClientStatisticsQuery,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientWithDetailsQuery,
  useLazySearchClientsQuery,
  Client,
  ClientWithDetails
} from '../../features/Clients/clientApi';
import { useRegisterClientMutation, ClientRegistrationRequest } from '../../features/Registration/registrationApi';
import {toast, Toaster} from 'react-hot-toast';

interface ClientsManagementProps {
  triggerNewClient: boolean;
  onNewClientTriggered: () => void;
}

const ClientsManagement: React.FC<ClientsManagementProps> = ({ triggerNewClient, onNewClientTriggered }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const { data: clients = [], isLoading, error, refetch: refetchClients } = useGetClientsQuery();
  const { data: statistics, refetch: refetchStatistics } = useGetClientStatisticsQuery();
  const { data: clientDetails } = useGetClientWithDetailsQuery(selectedClientId || 0, {
    skip: !selectedClientId
  });
  const [registerClient, { isLoading: isRegistering }] = useRegisterClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  const [searchClients] = useLazySearchClientsQuery();

  useEffect(() => {
    if (triggerNewClient) {
      setShowAddModal(true);
      onNewClientTriggered();
    }
  }, [triggerNewClient, onNewClientTriggered]);

  const filteredClients = searchTerm 
    ? clients.filter(client => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${client.first_name || ''} ${client.last_name || ''}`.toLowerCase();
        const companyName = client.company_name?.toLowerCase() || '';
        return (
          fullName.includes(searchLower) ||
          companyName.includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.client_number.toLowerCase().includes(searchLower)
        );
      })
    : clients;

  // Generate a secure random password
  const generatePassword = (): string => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleAddClient = async (formData: Partial<Client>) => {
    try {
      // Generate a secure password automatically
      const generatedPassword = generatePassword();

      // Prepare registration data according to ClientRegistrationRequest interface
      const registrationData: ClientRegistrationRequest = {
        client_type: formData.client_type as 'individual' | 'corporate' | 'government' | 'ngo' | 'partnership' | 'trust',
        email: formData.email?.trim().toLowerCase() || '',
        contact_phone: formData.phone_number?.trim() || '',
        password: generatedPassword,
        
        // Individual fields
        first_name: formData.first_name?.trim(),
        middle_name: formData.middle_name?.trim(),
        last_name: formData.last_name?.trim(),
        date_of_birth: formData.date_of_birth,
        gender: formData.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say' | undefined,
        national_id: formData.national_id?.trim(),
        passport_number: formData.passport_number?.trim(),
        
        // Corporate fields
        company_name: formData.company_name?.trim(),
        registration_number: formData.registration_number?.trim(),
        tax_id: formData.tax_id?.trim(),
        industry: formData.industry?.trim(),
        
        // Contact
        alternative_phone: formData.alternative_phone?.trim(),
        
        // Address
        address_line1: formData.address_line1?.trim(),
        address_line2: formData.address_line2?.trim(),
        city: formData.city?.trim(),
        state: formData.state?.trim(),
        country: formData.country?.trim() || 'Kenya',
        postal_code: formData.postal_code?.trim(),
        
        // Corporate contact person
        contact_person_name: formData.contact_person_name?.trim(),
        contact_person_title: formData.contact_person_title?.trim(),
        contact_person_email: formData.contact_person_email?.trim(),
        contact_person_phone: formData.contact_person_phone?.trim(),
        
        // Additional
        source: formData.source?.trim(),
        referred_by: formData.referred_by,
        notes: formData.notes?.trim(),
        
        // Agreements - default to true since this is internal registration
        termsAccepted: true,
        dataProcessingAccepted: true,
        marketingConsent: false,
      };

      const result = await registerClient(registrationData).unwrap();
      
      // Show success message with credentials
      alert(
        `Client registered successfully!\n\n` +
        `Client Number: ${result.data.clientNumber}\n` +
        `Email: ${formData.email}\n` +
        `Temporary Password: ${generatedPassword}\n\n` +
        `Please share these credentials with the client securely.`
      );
      refetchClients();
      refetchStatistics();
      setShowAddModal(false);
    } catch (err: any) {
      console.error('Failed to register client:', err);
      const errorMsg = err.data?.error 
        ? (Array.isArray(err.data.error) ? err.data.error.join(', ') : err.data.error)
        : 'Failed to register client. Please try again.';
      toast.error(errorMsg);
    }
  };

  const handleUpdateClient = async (formData: Partial<Client>) => {
    if (!selectedClient) return;
    try {
      await updateClient({ client_id: selectedClient.client_id, ...formData }).unwrap();
      refetchClients();
      refetchStatistics();
      setShowEditModal(false);
      setSelectedClient(null);
      toast.success('Client updated successfully');
    } catch (err) {
      console.error('Failed to update client:', err);
      toast.error('Failed to update client. Please try again.');
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      await deleteClient(selectedClient.client_id).unwrap();
      refetchClients();
      refetchStatistics();
      setShowDeleteModal(false);
      setSelectedClient(null);
      toast.success('Client deleted successfully');
    } catch (err) {
      console.error('Failed to delete client:', err);
      toast.error('Failed to delete client. Please try again.');
    }
  };

  const getClientDisplayName = (client: Client) => {
    if (client.client_type === 'individual') {
      return `${client.first_name || ''} ${client.last_name || ''}`.trim();
    }
    return client.company_name || 'Unknown';
  };

  const exportToCSV = () => {
    const headers = ['Client ID', 'Name', 'Type', 'Email', 'Phone', 'Status', 'Created'];
    const rows = filteredClients.map(client => [
      client.client_number,
      getClientDisplayName(client),
      client.client_type,
      client.email,
      client.phone_number,
      client.status,
      client.created_at || ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients.csv';
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>Error loading clients. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Clients Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage client information and relationships</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Clients</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistics?.total_clients || clients.length}</p>
            </div>
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Active Clients</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistics?.active_clients || 0}</p>
            </div>
            <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Individual</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistics?.individual_clients || 0}</p>
            </div>
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Corporate</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistics?.corporate_clients || 0}</p>
            </div>
            <Building className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Add Client</span>
            </button>
            <button 
              onClick={exportToCSV}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {filteredClients.map((client) => (
          <div key={client.client_id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 font-semibold">
                    {getClientDisplayName(client).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{getClientDisplayName(client)}</div>
                  <div className="text-xs text-gray-500">{client.client_number}</div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                client.client_type === 'corporate' ? 'bg-blue-100 text-blue-700' :
                client.client_type === 'ngo' ? 'bg-purple-100 text-purple-700' :
                client.client_type === 'government' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {client.client_type}
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{client.phone_number}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                client.status === 'active' ? 'bg-green-100 text-green-700' : 
                client.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                client.status === 'prospective' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {client.status}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedClientId(client.client_id);
                    setSelectedClient(client);
                    setShowViewModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedClient(client);
                    setShowEditModal(true);
                  }}
                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedClient(client);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No clients found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.client_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{client.client_number}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-600 font-semibold">
                          {getClientDisplayName(client).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{getClientDisplayName(client)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.client_type === 'corporate' ? 'bg-blue-100 text-blue-700' :
                      client.client_type === 'ngo' ? 'bg-purple-100 text-purple-700' :
                      client.client_type === 'government' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {client.client_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {client.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {client.phone_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.status === 'active' ? 'bg-green-100 text-green-700' : 
                      client.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                      client.status === 'prospective' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {client.created_at ? new Date(client.created_at).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedClientId(client.client_id);
                          setSelectedClient(client);
                          setShowViewModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No clients found</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <ClientFormModal
          title="Add New Client"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddClient}
          isLoading={isRegistering}
        />
      )}

      {showEditModal && selectedClient && (
        <ClientFormModal
          title="Edit Client"
          client={selectedClient}
          onClose={() => {
            setShowEditModal(false);
            setSelectedClient(null);
          }}
          onSubmit={handleUpdateClient}
          isLoading={isUpdating}
        />
      )}

      {showViewModal && selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          clientDetails={clientDetails}
          onClose={() => {
            setShowViewModal(false);
            setSelectedClient(null);
            setSelectedClientId(null);
          }}
        />
      )}

      {showDeleteModal && selectedClient && (
        <DeleteConfirmModal
          client={selectedClient}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedClient(null);
          }}
          onConfirm={handleDeleteClient}
          isDeleting={isDeleting}
          getClientDisplayName={getClientDisplayName}
        />
      )}
    </div>
  );
};

const ClientFormModal = ({ title, client, onClose, onSubmit, isLoading }: {
  title: string;
  client?: Client;
  onClose: () => void;
  onSubmit: (data: Partial<Client>) => void;
  isLoading: boolean;
}) => {
  const isEditMode = !!client;
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<Partial<Client>>(client || {
    client_type: 'individual',
    email: '',
    phone_number: '',
    status: 'active'
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Email validation
    if (!formData.email?.trim()) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('Invalid email format');
    }

    // Phone validation
    if (!formData.phone_number?.trim()) {
      errors.push('Phone number is required');
    }

    // Type-specific validation
    if (formData.client_type === 'individual') {
      if (!formData.first_name?.trim()) errors.push('First name is required');
      if (!formData.last_name?.trim()) errors.push('Last name is required');
    } else {
      if (!formData.company_name?.trim()) errors.push('Company name is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-4 sm:my-8 max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={isLoading}>
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <h4 className="text-red-800 font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Please correct the following errors:
              </h4>
              <ul className="list-disc list-inside text-red-700 text-xs sm:text-sm space-y-1">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Password Auto-generation Notice - Only for new clients */}
          {!isEditMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-800 font-semibold mb-1 text-sm sm:text-base">Automatic Password Generation</h4>
                  <p className="text-blue-700 text-xs sm:text-sm">
                    A secure password will be automatically generated for this client. 
                    You will receive the credentials after registration to share with the client securely.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Client Type</label>
            <select
              value={formData.client_type}
              onChange={(e) => setFormData({ ...formData, client_type: e.target.value as any })}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              required
              disabled={isEditMode || isLoading}
            >
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
              <option value="government">Government</option>
              <option value="ngo">NGO</option>
              <option value="partnership">Partnership</option>
              <option value="trust">Trust</option>
            </select>
            {isEditMode && (
              <p className="text-xs text-gray-500 mt-1">Client type cannot be changed</p>
            )}
          </div>

          {formData.client_type === 'individual' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                <input
                  type="text"
                  value={formData.middle_name || ''}
                  onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                  disabled={isLoading}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">National ID</label>
                <input
                  type="text"
                  value={formData.national_id || ''}
                  onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                <input
                  type="text"
                  value={formData.passport_number || ''}
                  onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {formData.client_type !== 'individual' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.company_name || ''}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registration_number || ''}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <input
                    type="text"
                    value={formData.tax_id || ''}
                    onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <input
                    type="text"
                    value={formData.industry || ''}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Contact Person Information</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Contact Person Name</label>
                  <input
                    type="text"
                    value={formData.contact_person_name || ''}
                    onChange={(e) => setFormData({ ...formData, contact_person_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Contact Person Title</label>
                  <input
                    type="text"
                    value={formData.contact_person_title || ''}
                    onChange={(e) => setFormData({ ...formData, contact_person_title: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Contact Person Email</label>
                  <input
                    type="email"
                    value={formData.contact_person_email || ''}
                    onChange={(e) => setFormData({ ...formData, contact_person_email: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Contact Person Phone</label>
                  <input
                    type="tel"
                    value={formData.contact_person_phone || ''}
                    onChange={(e) => setFormData({ ...formData, contact_person_phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                required
                disabled={isEditMode || isLoading}
              />
              {isEditMode && (
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone_number || ''}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                placeholder="+254..."
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Alternative Phone</label>
              <input
                type="tel"
                value={formData.alternative_phone || ''}
                onChange={(e) => setFormData({ ...formData, alternative_phone: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
              <input
                type="text"
                value={formData.address_line1 || ''}
                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
              <input
                type="text"
                value={formData.address_line2 || ''}
                onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">State/County</label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.postal_code || ''}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospective">Prospective</option>
              <option value="former">Former</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (client ? 'Updating...' : 'Creating...') : (client ? 'Update Client' : 'Create Client')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClientDetailsModal = ({ client, clientDetails, onClose }: {
  client: Client;
  clientDetails?: ClientWithDetails;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getClientDisplayName = (c: Client) => {
    if (c.client_type === 'individual') {
      return `${c.first_name || ''} ${c.last_name || ''}`.trim();
    }
    return c.company_name || 'Unknown';
  };

  return (
    <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-4 sm:my-8 max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Client Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 sm:pb-6 border-b">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 font-bold text-lg sm:text-2xl">
                {getClientDisplayName(client).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{getClientDisplayName(client)}</h3>
              <p className="text-sm sm:text-base text-gray-600">{client.client_number}</p>
            </div>
            <span className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
              client.status === 'active' ? 'bg-green-100 text-green-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {client.status}
            </span>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Client Type</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 capitalize">{client.client_type}</p>
              </div>
              {client.client_type === 'individual' ? (
                <>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Full Name</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">
                      {`${client.first_name || ''} ${client.middle_name || ''} ${client.last_name || ''}`.trim()}
                    </p>
                  </div>
                  {client.national_id && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">National ID</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900">{client.national_id}</p>
                    </div>
                  )}
                  {client.date_of_birth && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Date of Birth</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900">{client.date_of_birth}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Company Name</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{client.company_name}</p>
                  </div>
                  {client.registration_number && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Registration Number</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900">{client.registration_number}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Email</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 break-all">{client.email}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Phone Number</p>
                <p className="text-sm sm:text-base font-medium text-gray-900">{client.phone_number}</p>
              </div>
              {client.alternative_phone && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Alternative Phone</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{client.alternative_phone}</p>
                </div>
              )}
            </div>
          </div>

          {(client.city || client.country) && (
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                Address
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                {client.address_line1 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Address Line 1</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{client.address_line1}</p>
                  </div>
                )}
                {client.city && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">City</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{client.city}</p>
                  </div>
                )}
                {client.state && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">State</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{client.state}</p>
                  </div>
                )}
                {client.country && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Country</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{client.country}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {client.billing_type && (
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                Billing Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Billing Type</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900 capitalize">{client.billing_type}</p>
                </div>
                {client.rate && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Rate</p>
                    // Continuation from the ClientDetailsModal - Rate display section

                  <p className="text-sm sm:text-base font-medium text-gray-900">{client.rate}</p>
                  </div>
                )}
                {client.outstanding_balance && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Outstanding Balance</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{client.outstanding_balance}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {clientDetails?.cases && clientDetails.cases.length > 0 && (
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                Cases
              </h4>
              <div className="space-y-2">
                {clientDetails.cases.map((c) => (
                  <div key={c.case_id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.case_number}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{c.title}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {client.notes && (
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Notes
              </h4>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-700">{client.notes}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm sm:text-base transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ client, onClose, onConfirm, isDeleting, getClientDisplayName }: {
  client: Client;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  getClientDisplayName: (client: Client) => string;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, isDeleting]);

  return (
    <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete Client</h3>
            <p className="text-xs sm:text-sm text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mb-6">
          Are you sure you want to delete <strong>{getClientDisplayName(client)}</strong>?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientsManagement;
