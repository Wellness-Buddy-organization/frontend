import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { authController } from '../../controllers';

/**
 * Login view component
 */
const LoginView = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  /**
   * Handle form input changes
   * @param {Event} e - Form event
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrors({ ...errors, [name]: '', general: '' });
  };

  /**
   * Validate form inputs
   * @returns {boolean} Is form valid
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email';
    if (!formData.password)
      newErrors.password = 'Password is required';
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
      await authController.login(
        {
          email: formData.email,
          password: formData.password,
        },
        // Success callback
        () => {
          navigate('/dashboard');
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
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Google login
   */
  const handleGoogleLogin = () => {
    authController.googleAuth('login');
  };

  return (
    <div className="min-h-screen font-poppins flex flex-col lg:flex-row overflow-x-hidden relative">
      {/* Left Panel - Form */}
      <motion.div
        className="lg:w-1/2 w-full flex items-center justify-center py-12 lg:py-0 bg-white"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 font-amaranth mb-2 text-center">
            Sign In
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Enter the information you entered while registering.
          </p>
          {errors.general && (
            <p className="text-red-500 text-center mb-4">{errors.general}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-green-600 transition-all duration-300"
              />
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-green-600 transition-all duration-300"
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
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            {/* Remember Me and Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-custom-green-600 focus:ring-custom-green-600 border-gray-300 rounded"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-custom-green-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            {/* Sign In Button */}
            <motion.button
              type="submit"
              className="w-full bg-custom-green-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-custom-green-800 transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(72, 155, 110, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : null}
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          {/* Google Sign-In Button */}
          <motion.button
            onClick={handleGoogleLogin}
            className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
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
            Sign In with Google
          </motion.button>
          {/* Sign Up Link */}
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-custom-green-600 hover:underline">
              Create
            </Link>
          </p>
        </div>
      </motion.div>
      {/* Right Panel - Image and Text */}
      <motion.div
        className="lg:w-1/2 w-full h-64 lg:h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(45deg, #A8D5BA, #6BBF8A, #489B6E, #A8D5BA)`,
        }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center px-6 text-white">
          <motion.h1
            className="text-3xl font-bold font-amaranth mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            New Here?
          </motion.h1>
          <motion.p
            className="text-lg leading-relaxed max-w-md mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            Enter your personal details and start your journey with us.
          </motion.p>
          <Link
            to="/signup"
            className="inline-block bg-custom-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-custom-green-800 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;