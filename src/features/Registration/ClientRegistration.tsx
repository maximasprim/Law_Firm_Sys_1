import React, { useState } from 'react';
import { useRegisterClientMutation, ClientRegistrationRequest } from './registrationApi';
import { useNavigate } from 'react-router-dom';

type ClientType = 'individual' | 'corporate' | 'government' | 'ngo' | 'partnership' | 'trust';

const ClientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [registerClient, { isLoading, error }] = useRegisterClientMutation();

  // Form state
  const [clientType, setClientType] = useState<ClientType>('individual');
  const [formData, setFormData] = useState({
    // Authentication
    email: '',
    contact_phone: '',
    password: '',
    confirmPassword: '',

    // Individual fields
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '' as 'male' | 'female' | 'other' | 'prefer_not_to_say' | '',
    national_id: '',
    passport_number: '',

    // Corporate fields
    company_name: '',
    registration_number: '',
    tax_id: '',
    industry: '',

    // Contact
    alternative_phone: '',

    // Address
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: 'Kenya',
    postal_code: '',

    // Corporate contact person
    contact_person_name: '',
    contact_person_title: '',
    contact_person_email: '',
    contact_person_phone: '',

    // Additional
    source: '',
    referred_by: '',
    notes: '',

    // Agreements
    termsAccepted: false,
    dataProcessingAccepted: false,
    marketingConsent: false,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Basic validation
    if (!formData.email.trim()) errors.push('Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.push('Invalid email format');
    
    if (!formData.contact_phone.trim()) errors.push('Phone number is required');
    if (!formData.password) errors.push('Password is required');
    else if (formData.password.length < 8) errors.push('Password must be at least 8 characters');
    
    if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');

    // Type-specific validation
    if (clientType === 'individual') {
      if (!formData.first_name.trim()) errors.push('First name is required');
      if (!formData.last_name.trim()) errors.push('Last name is required');
    } else if (clientType === 'corporate') {
      if (!formData.company_name.trim()) errors.push('Company name is required');
    }

    // Agreement validation
    if (!formData.termsAccepted) errors.push('You must accept the terms of service');
    if (!formData.dataProcessingAccepted) errors.push('You must accept data processing terms');

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const registrationData: ClientRegistrationRequest = {
      client_type: clientType,
      email: formData.email.trim().toLowerCase(),
      contact_phone: formData.contact_phone.trim(),
      password: formData.password,

      // Individual
      first_name: formData.first_name.trim() || undefined,
      middle_name: formData.middle_name.trim() || undefined,
      last_name: formData.last_name.trim() || undefined,
      date_of_birth: formData.date_of_birth || undefined,
      gender: formData.gender || undefined,
      national_id: formData.national_id.trim() || undefined,
      passport_number: formData.passport_number.trim() || undefined,

      // Corporate
      company_name: formData.company_name.trim() || undefined,
      registration_number: formData.registration_number.trim() || undefined,
      tax_id: formData.tax_id.trim() || undefined,
      industry: formData.industry.trim() || undefined,

      // Contact
      alternative_phone: formData.alternative_phone.trim() || undefined,

      // Address
      address_line1: formData.address_line1.trim() || undefined,
      address_line2: formData.address_line2.trim() || undefined,
      city: formData.city.trim() || undefined,
      state: formData.state.trim() || undefined,
      country: formData.country || 'Kenya',
      postal_code: formData.postal_code.trim() || undefined,

      // Corporate contact person
      contact_person_name: formData.contact_person_name.trim() || undefined,
      contact_person_title: formData.contact_person_title.trim() || undefined,
      contact_person_email: formData.contact_person_email.trim() || undefined,
      contact_person_phone: formData.contact_person_phone.trim() || undefined,

      // Additional
      source: formData.source.trim() || undefined,
      referred_by: formData.referred_by ? parseInt(formData.referred_by) : undefined,
      notes: formData.notes.trim() || undefined,

      // Agreements
      termsAccepted: formData.termsAccepted,
      dataProcessingAccepted: formData.dataProcessingAccepted,
      marketingConsent: formData.marketingConsent,
    };

    try {
      const result = await registerClient(registrationData).unwrap();
      
      alert(`Registration successful! Your client number is: ${result.data.clientNumber}`);
      navigate('/login');
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.data?.error) {
        const errorMsg = Array.isArray(err.data.error) 
          ? err.data.error.join(', ') 
          : err.data.error;
        setValidationErrors([errorMsg]);
      }
    }
  };

  const nextStep = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Client Registration</h2>
            <p className="mt-2 text-center text-gray-600">Join our legal case management system</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex-1">
                  <div className={`h-2 rounded-full ${step <= activeStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  <p className={`mt-2 text-xs text-center ${step <= activeStep ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                    {step === 1 && 'Client Type'}
                    {step === 2 && 'Personal Info'}
                    {step === 3 && 'Contact & Address'}
                    {step === 4 && 'Review & Submit'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Error Messages */}
          {validationErrors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-semibold mb-2">Please correct the following errors:</h3>
              <ul className="list-disc list-inside text-red-700 text-sm">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Client Type */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Select Client Type</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {(['individual', 'corporate', 'government', 'ngo', 'partnership', 'trust'] as ClientType[]).map((type) => (
                    <label key={type} className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                      clientType === type ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="client_type"
                        value={type}
                        checked={clientType === type}
                        onChange={(e) => setClientType(e.target.value as ClientType)}
                        className="sr-only"
                      />
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900 capitalize">{type}</span>
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal/Company Information */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {clientType === 'individual' ? 'Personal Information' : 'Company Information'}
                </h3>

                {clientType === 'individual' ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                      <input
                        type="text"
                        name="middle_name"
                        value={formData.middle_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">National ID</label>
                      <input
                        type="text"
                        name="national_id"
                        value={formData.national_id}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                      <input
                        type="text"
                        name="passport_number"
                        value={formData.passport_number}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Company Name *</label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                      <input
                        type="text"
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tax ID</label>
                      <input
                        type="text"
                        name="tax_id"
                        value={formData.tax_id}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2 border-t pt-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Person</h4>
                      
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="contact_person_name"
                            value={formData.contact_person_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            name="contact_person_title"
                            value={formData.contact_person_title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="contact_person_email"
                            value={formData.contact_person_email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="tel"
                            name="contact_person_phone"
                            value={formData.contact_person_phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    Previous
                  </button>
                  <button type="button" onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Address */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Contact & Address Information</h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleInputChange}
                      placeholder="+254..."
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alternative Phone</label>
                    <input
                      type="tel"
                      name="alternative_phone"
                      value={formData.alternative_phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                    <input
                      type="text"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                    <input
                      type="text"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">State/County</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    Previous
                  </button>
                  <button type="button" onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Additional Information & Agreements</h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">How did you hear about us?</label>
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Referred By (Client ID)</label>
                    <input
                      type="number"
                      name="referred_by"
                      value={formData.referred_by}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      I accept the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> *
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="dataProcessingAccepted"
                      checked={formData.dataProcessingAccepted}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      I consent to <a href="#" className="text-blue-600 hover:underline">data processing</a> as described in the Privacy Policy *
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="marketingConsent"
                      checked={formData.marketingConsent}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      I would like to receive marketing communications and updates
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    Previous
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Already have an account */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/legal-login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientRegistration;