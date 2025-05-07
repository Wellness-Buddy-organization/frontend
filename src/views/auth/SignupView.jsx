import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { authController } from '../../controllers';

/**
 * SignupView component for user registration
 */
const SignupView = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  /**
   * Validate form inputs
   * @returns {boolean} Is form valid
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email';
    if (!formData.password || formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await authController.signup(
        formData,
        // Success callback
        (user) => {
          setIsSubmitting(false);
          setIsSubmitted(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        },
        // Error callback
        (message, apiErrors) => {
          if (apiErrors) {
            const errorMap = {};
            apiErrors.forEach((err) => {
              errorMap[err.param] = err.msg;
            });
            setErrors(errorMap);
          } else {
            setErrors({ general: message });
          }
        }
      );
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form input changes
   * @param {Event} e - Form event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '', general: '' });
  };

  /**
   * Handle Google signup
   */
  const handleGoogleSignup = () => {
    authController.googleAuth('signup');
  };

  return (
    <div className="min-h-screen font-poppins flex flex-col lg:flex-row overflow-x-hidden relative">
      {/* Left Panel */}
      <motion.div
        className="lg:w-1/2 w-full h-64 lg:h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(45deg, #A8D5BA, #6BBF8A, #489B6E, #A8D5BA)',
          backgroundSize: '400% 400%',
          animation: 'gradientFlow 15s ease infinite',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
        <div className="relative z-10 text-center px-6 text-white">
          <motion.h1
            className="text-4xl font-bold font-amaranth mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Join Wellness Buddy
          </motion.h1>
          <motion.p
            className="text-lg leading-relaxed max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            Prioritize your well-being with daily tracking, smart reminders, and mental health support. Achieve balance effortlessly.
          </motion.p>
          <motion.Link
            to="/login"
            className="mt-6 inline-block bg-custom-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-custom-green-700 transition initiative duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.Link>
        </div>
      </motion.div>

      {/* Right Panel */}
      <div className="lg:w-1/2 w-full flex items-center justify-center py-12 lg:py-0 bg-gray-50">
        <motion.div
          className="w-full max-w-md p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="text-3xl font-bold text-gray-900 font-amaranth mb-8 text-center">
            Create Your Account
          </h2>
          {errors.general && (
            <p className="text-red-500 text-center mb-4">{errors.general}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-green-600 transition-all duration-300"
                />
                {formData.fullName && !errors.fullName && (
                  <CheckCircleIcon className="absolute right-3 top-3 h-6 w-6 text-custom-green-600" />
                )}
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            {/* Email */}
            <div className="relative">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-green-600 transition-all duration-300"
                />
                {formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <CheckCircleIcon className="absolute right-3 top-3 h-6 w-6 text-custom-green-600" />
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            {/* Password */}
            <div className="relative">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-green-600 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-6 w-6" />
                  ) : (
                    <EyeIcon className="h-6 w-6" />
                  )}
                </button>
                {formData.password && !errors.password && formData.password.length >= 8 && (
                  <CheckCircleIcon className="absolute right-10 top-3 h-6 w-6 text-custom-green-600" />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            {/* Create Account Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-custom-green-600 to-custom-green-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(72, 155, 110, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting || isSubmitted}
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : isSubmitted ? (
                <CheckCircleIcon className="h-5 w-5 mr-2 text-white" />
              ) : null}
              {isSubmitting
                ? 'Creating...'
                : isSubmitted
                ? 'Account Created!'
                : 'Create Account'}
            </motion.button>
          </form>
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          {/* Google Sign-Up Button */}
          <motion.button
            onClick={handleGoogleSignup}
            className="w-full bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-20 text-gray-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-custom-green-100 transition-all duration-300"
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.62 7.77 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.77 1 4.01 3.38 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign Up with Google
          </motion.button>
          {/* Sign In Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-custom-green-600 hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupView;