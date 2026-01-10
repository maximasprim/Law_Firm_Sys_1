import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from './registrationApi';
import { setCredentials } from './registrationSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import { Scale, User, Lock, Phone, Shield, Home } from 'lucide-react';
import logo from '../../assets/logo.png';

interface CustomJwtPayload {
  sub: string;
  user_id: number;
  fullName: string;
  role: string;
  exp: number;
}

// OTP API functions (if you enable OTP authentication)
const sendLoginOTP = async (contactPhone: string) => {
  const response = await fetch('https://your-api-url.com/send-login-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contact_phone: contactPhone }),
  });
  return response.json();
};

const loginWithOTP = async (contactPhone: string, otpCode: string) => {
  const response = await fetch('https://your-api-url.com/login-with-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contact_phone: contactPhone, otp_code: otpCode }),
  });
  return response.json();
};

// Helper function for post-login navigation based on role
const handlePostLoginNavigation = (decoded: CustomJwtPayload, navigate: any) => {
  // Check if there's a redirect URL stored
  const redirectUrl = localStorage.getItem('redirectAfterLogin');
  
  if (redirectUrl) {
    localStorage.removeItem('redirectAfterLogin');
    navigate(redirectUrl);
    return;
  }
  
  // Role-based navigation for legal system
  const role = decoded.role.toLowerCase();
  
  if (role === 'admin') {
    navigate('/admin-dashboard');
  } else if (role === 'senior_advocate' || role === 'advocate') {
    navigate('/advocate-dashboard');
  } else if (role === 'client') {
    navigate('/client-dashboard');
  } else if (role === 'paralegal' || role === 'legal_assistant') {
    navigate('/staff-dashboard');
  } else if (role === 'secretary' || role === 'accountant') {
    navigate('/office-dashboard');
  } else {
    navigate('/dashboard');
  }
};

const LegalLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoadingOTP, setIsLoadingOTP] = useState(false);
  
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle password-based login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login({ username, password }).unwrap();
      const token = userData.token;
      const decoded = jwtDecode<CustomJwtPayload>(token);

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('decoded_token', JSON.stringify(decoded));
      
      // Store in Redux
      dispatch(setCredentials(userData));
      
      setMessage('Login successful!');
      
      // Navigate based on role
      setTimeout(() => {
        handlePostLoginNavigation(decoded, navigate);
      }, 500);
      
    } catch (error: any) {
      if (error?.data?.error) {
        setMessage(error.data.error);
      } else {
        setMessage('Login failed! Please check your credentials.');
      }
      console.error('Failed to login:', error);
    }
  };

  // Handle sending OTP
  const handleSendOTP = async () => {
    if (!contactPhone.trim()) {
      setMessage('Please enter your phone number');
      return;
    }
    
    setIsLoadingOTP(true);
    try {
      await sendLoginOTP(contactPhone);
      setOtpSent(true);
      setMessage('OTP sent to your phone!');
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.');
      console.error('Failed to send OTP:', error);
    } finally {
      setIsLoadingOTP(false);
    }
  };

  // Handle OTP login
  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await loginWithOTP(contactPhone, otpCode);
      const token = userData.token;
      const decoded = jwtDecode<CustomJwtPayload>(token);

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('decoded_token', JSON.stringify(decoded));
      
      // Store in Redux
      dispatch(setCredentials(userData));
      
      setMessage('Login successful!');
      
      // Navigate based on role
      setTimeout(() => {
        handlePostLoginNavigation(decoded, navigate);
      }, 500);
      
    } catch (error) {
      setMessage('OTP verification failed! Please try again.');
      console.error('Failed to verify OTP:', error);
    }
  };

  // Reset OTP form
  const resetOTPForm = () => {
    setOtpSent(false);
    setContactPhone('');
    setOtpCode('');
    setMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-6">
      <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md lg:max-w-lg border border-white/20">
        
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white  p-4 sm:p-2 rounded-full shadow-lg">
            <img
              src={logo}
              alt="Owino Kojo Advocates Logo"
              className="h-12 w-12 sm:h-12 sm:w-12 lg:h-20 lg:w-20"
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Legal Case Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Mode Toggle */}
        {/* <div className="flex mb-4 sm:mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => {
              setLoginMode('password');
              resetOTPForm();
            }}
            className={`flex-1 py-2 sm:py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all ${
              loginMode === 'password'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('otp');
              setMessage(null);
            }}
            className={`flex-1 py-2 sm:py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all ${
              loginMode === 'otp'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            OTP Login
          </button>
        </div> */}

        {/* Password Login Form */}
        {loginMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 sm:space-y-6">
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Email Address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 placeholder-gray-400 text-xs sm:text-sm"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 placeholder-gray-400 text-xs sm:text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-xs sm:text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-blue-600 hover:underline text-center sm:text-right">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-lg text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        )}

        {/* OTP Login Form */}
        {loginMode === 'otp' && (
          <div className="space-y-4 sm:space-y-6">
            {!otpSent ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="tel"
                    placeholder="Phone Number (+254...)"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 placeholder-gray-400 text-xs sm:text-sm"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isLoadingOTP}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-lg text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingOTP ? 'SENDING OTP...' : 'SEND OTP'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleOTPLogin} className="space-y-4 sm:space-y-6">
                <div className="text-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 px-2 bg-blue-50 py-3 rounded-lg">
                  OTP sent to {contactPhone}
                </div>
                
                <div className="relative">
                  <Shield className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Enter OTP Code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 placeholder-gray-400 text-xs sm:text-sm text-center tracking-widest font-semibold"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={resetOTPForm}
                    className="w-full sm:flex-1 py-3 sm:py-4 bg-gray-500 hover:bg-gray-600 rounded-lg text-white font-bold text-xs sm:text-sm transition-all duration-300"
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:flex-1 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-lg text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`text-center mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium mx-2 sm:mx-0 ${
            message.includes('successful') || message.includes('sent')
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Registration Links */}
        <div className="mt-6 sm:mt-8 space-y-4">
          <div className="text-center">
            <p className="text-gray-600 text-xs sm:text-sm mb-3">
              Don't have an account?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/client-registration"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all text-xs sm:text-sm font-medium"
              >
                Register as Client
              </a>
              <a
                href="/advocate-registration"
                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-all text-xs sm:text-sm font-medium"
              >
                Register as Advocate
              </a>
            </div>
          </div>
        </div>

        {/* Home Link */}
        <div className="flex justify-center mt-4 sm:mt-6 px-2">
          <NavLink
            to="/"
            className={({ isActive, isPending }) =>
              `flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                isPending
                  ? "bg-gray-200 text-gray-500 cursor-wait"
                  : isActive
                    ? "bg-blue-50 text-blue-600 font-medium border border-blue-200"
                    : "text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-200 hover:border-blue-300"
              }`
            }
          >
            <Home className="w-4 h-4" />
            <span className="font-medium">Back to Home</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default LegalLogin;