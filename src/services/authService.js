import apiService from './ApiService';
import { User } from '../models';

/**
 * Service for handling authentication-related API calls
 */
class AuthService {
  /**
   * Log in a user
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise<User>} User object with token
   */
  async login(credentials) {
    try {
      const response = await apiService.post('/users/login', credentials);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Create and return user model
      const user = User.fromApiResponse(response.data.user || {});
      user.token = response.data.token;
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<User>} User object with token
   */
  async signup(userData) {
    try {
      const response = await apiService.post('/users/signup', userData);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Create and return user model
      const user = User.fromApiResponse(response.data.user || {});
      user.token = response.data.token;
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log out the current user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Call logout endpoint if exists
      // await apiService.post('/users/logout');
      
      // Remove token from localStorage
      localStorage.removeItem('token');
    } catch (error) {
      // Still remove token even if API call fails
      localStorage.removeItem('token');
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  /**
   * Initiate Google OAuth flow
   * @param {string} type - 'login' or 'signup'
   */
  googleAuth(type = 'login') {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google${type === 'signup' ? '?signup=true' : ''}`;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;