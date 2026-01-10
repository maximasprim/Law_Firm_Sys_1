import React, { useState } from 'react';
import { useRegisterAdvocateMutation, AdvocateRegistrationRequest } from './registrationApi';
import { useNavigate } from 'react-router-dom';
import { Scale, User, Mail, Phone, Lock, Briefcase, Award, MapPin } from 'lucide-react';
import logo from '../../assets/logo.png';

type RoleType = 'senior_advocate' | 'advocate' | 'paralegal' | 'legal_assistant' | 'secretary' | 'accountant' | 'admin';

const AdvocateRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [registerAdvocate, { isLoading, error }] = useRegisterAdvocateMutation();

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: '',
    email: '',
    contact_phone: '',
    password: '',
    confirmPassword: '',
    
    // Professional Information
    role: '' as RoleType | '',
    bar_license_number: '',
    bar_admission_date: '',
    specialization: [] as string[],
    department: '',
    position: '',
    hourly_rate: '',
    
    // Address
    county: '',
    address: '',
    city: '',
    country: 'Kenya',
    postal_code: '',
    
    // Additional
    bio: '',
    
    // Agreements
    termsAccepted: false,
    dataProcessingAccepted: false,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [specializationInput, setSpecializationInput] = useState('');

  // Specialization options
  const specializationOptions = [
    'Criminal Law',
    'Corporate Law',
    'Family Law',
    'Constitutional Law',
    'Property Law',
    'Employment Law',
    'Tax Law',
    'Intellectual Property',
    'Human Rights',
    'Environmental Law',
    'Banking & Finance',
    'Insurance Law',
    'Maritime Law',
    'Aviation Law',
    'Sports Law',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Basic validation
    if (!formData.full_name.trim()) errors.push('Full name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.push('Invalid email format');
    
    if (!formData.contact_phone.trim()) errors.push('Phone number is required');
    if (!formData.password) errors.push('Password is required');
    else if (formData.password.length < 8) errors.push('Password must be at least 8 characters');
    
    if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');
    if (!formData.role) errors.push('Role is required');

    // Role-specific validation
    if (['senior_advocate', 'advocate'].includes(formData.role) && !formData.bar_license_number.trim()) {
      errors.push('Bar license number is required for advocates');
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

    const registrationData: AdvocateRegistrationRequest = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      contact_phone: formData.contact_phone.trim(),
      password: formData.password,
      role: formData.role as RoleType,
      bar_license_number: formData.bar_license_number.trim() || undefined,
      bar_admission_date: formData.bar_admission_date || undefined,
      specialization: formData.specialization.length > 0 ? formData.specialization : undefined,
      department: formData.department.trim() || undefined,
      position: formData.position.trim() || undefined,
      hourly_rate: formData.hourly_rate || undefined,
      county: formData.county.trim() || undefined,
      address: formData.address.trim() || undefined,
      city: formData.city.trim() || undefined,
      country: formData.country || 'Kenya',
      postal_code: formData.postal_code.trim() || undefined,
      bio: formData.bio.trim() || undefined,
      termsAccepted: formData.termsAccepted,
      dataProcessingAccepted: formData.dataProcessingAccepted,
    };

    try {
      const result = await registerAdvocate(registrationData).unwrap();
      
      alert(`Registration successful! Welcome to the team, ${formData.full_name}!`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-full shadow-lg">
                <img
              src={logo}
              alt="Owino Kojo Advocates Logo"
              className="h-12 w-12 sm:h-12 sm:w-12 lg:h-20 lg:w-20"
            />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Advocate/Staff Registration</h2>
            <p className="mt-2 text-gray-600">Join our legal team</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex-1">
                  <div className={`h-2 rounded-full transition-all ${step <= activeStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  <p className={`mt-2 text-xs text-center font-medium ${step <= activeStep ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step === 1 && 'Role & Personal'}
                    {step === 2 && 'Professional Info'}
                    {step === 3 && 'Contact & Address'}
                    {step === 4 && 'Review & Submit'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Error Messages */}
          {validationErrors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2 flex items-center">
                <span className="mr-2">⚠️</span>
                Please correct the following errors:
              </h3>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Role & Personal Information */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
                  Role & Personal Information
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="">Choose your role...</option>
                      <option value="senior_advocate">Senior Advocate</option>
                      <option value="advocate">Advocate</option>
                      <option value="paralegal">Paralegal</option>
                      <option value="legal_assistant">Legal Assistant</option>
                      <option value="secretary">Secretary</option>
                      <option value="accountant">Accountant</option>
                      {/* <option value="admin">Admin</option> */}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        placeholder="+254..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="w-4 h-4 inline mr-1" />
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Min. 8 characters"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="w-4 h-4 inline mr-1" />
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Re-enter password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-blue-600" />
                  Professional Information
                </h3>

                {['senior_advocate', 'advocate'].includes(formData.role) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bar License Number *
                        </label>
                        <input
                          type="text"
                          name="bar_license_number"
                          value={formData.bar_license_number}
                          onChange={handleInputChange}
                          placeholder="LSK/12345"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bar Admission Date
                        </label>
                        <input
                          type="date"
                          name="bar_admission_date"
                          value={formData.bar_admission_date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Specialization
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {specializationOptions.map((spec) => (
                      <label
                        key={spec}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.specialization.includes(spec)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.specialization.includes(spec)}
                          onChange={() => handleSpecializationToggle(spec)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 mr-2"
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Selected: {formData.specialization.length} areas</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., Litigation"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position/Title
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="e.g., Associate Advocate"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (KES)
                  </label>
                  <input
                    type="number"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleInputChange}
                    placeholder="5000"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors">
                    Previous
                  </button>
                  <button type="button" onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Address */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                  Contact & Address Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Nairobi"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      County
                    </label>
                    <input
                      type="text"
                      name="county"
                      value={formData.county}
                      onChange={handleInputChange}
                      placeholder="Nairobi County"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      placeholder="00100"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Brief description of your professional background and expertise..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors">
                    Previous
                  </button>
                  <button type="button" onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Review & Submit</h3>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{formData.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium text-gray-900 capitalize">{formData.role.replace('_', ' ') || 'Not selected'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{formData.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{formData.contact_phone || 'Not provided'}</p>
                  </div>
                  {formData.bar_license_number && (
                    <div>
                      <p className="text-sm text-gray-600">Bar License</p>
                      <p className="font-medium text-gray-900">{formData.bar_license_number}</p>
                    </div>
                  )}
                  {formData.specialization.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Specializations</p>
                      <p className="font-medium text-gray-900">{formData.specialization.join(', ')}</p>
                    </div>
                  )}
                </div>

                {/* Agreements */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      I accept the <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a> and confirm that all information provided is accurate *
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="dataProcessingAccepted"
                      checked={formData.dataProcessingAccepted}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      I consent to <a href="#" className="text-blue-600 hover:underline font-medium">data processing</a> as described in the Privacy Policy *
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors">
                    Previous
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
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
                      <>
                        <Award className="w-5 h-5 mr-2" />
                        Complete Registration
                      </>
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
            <a href="/legal-login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvocateRegistration;