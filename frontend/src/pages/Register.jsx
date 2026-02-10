import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  UserIcon,
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowRightIcon,
  SparklesIcon,
  AcademicCapIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'student' ? '/student/dashboard' : '/company/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    const { confirmPassword, ...dataToSend } = formData;
    const result = await register(dataToSend);
    
    if (result.success) {
      // Navigation handled by useEffect
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative h-full flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center space-y-6 animate-slide-up">
            <h2 className="text-5xl font-bold mb-4">
              Start Your Journey
            </h2>
            <p className="text-xl text-gray-100">
              Join thousands of students and companies finding success on InternConnect
            </p>
            
            <div className="space-y-4 mt-12 text-left">
              <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <AcademicCapIcon className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">For Students</h4>
                  <p className="text-sm text-gray-200">Build your profile, discover opportunities, and grow your career</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <BuildingOfficeIcon className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">For Companies</h4>
                  <p className="text-sm text-gray-200">Post internships, find talent, and build your team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-3 rounded-2xl">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Get started with InternConnect today
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.role === 'student'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <AcademicCapIcon className={`h-8 w-8 mx-auto mb-2 ${
                formData.role === 'student' ? 'text-primary-600' : 'text-gray-400'
              }`} />
              <div className={`font-semibold ${
                formData.role === 'student' ? 'text-primary-600' : 'text-gray-700'
              }`}>
                Student
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'company' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.role === 'company'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <BuildingOfficeIcon className={`h-8 w-8 mx-auto mb-2 ${
                formData.role === 'company' ? 'text-primary-600' : 'text-gray-400'
              }`} />
              <div className={`font-semibold ${
                formData.role === 'company' ? 'text-primary-600' : 'text-gray-700'
              }`}>
                Company
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <Link 
                to="/login"
                className="inline-flex items-center space-x-1 font-medium text-primary-600 hover:text-primary-500 transition"
              >
                <span>Sign in instead</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;