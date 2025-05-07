import { authService } from '../services';
import { User } from '../models';

/**
 * Controller for authentication-related operations
 */
class AuthController {
  /**
   * Handle user login
   * @param {Object} credentials - User credentials (email, password)
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  async login(credentials, onSuccess, onError) {
    try {
      const user = await authService.login(credentials);
      
      if (onSuccess) {
        onSuccess(user);
      }
      
      return user;
    } catch (error) {
      if (onError) {
        if (error.response) {
          const { message, errors } = error.response.data;
          onError(message || 'Login failed', errors);
        } else {
          onError('An error occurred. Please try again.');
        }
      }
      
      throw error;
    }
  }

  /**
   * Handle user signup
   * @param {Object} userData - User registration data
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  async signup(userData, onSuccess, onError) {
    try {
      const user = await authService.signup(userData);
      
      if (onSuccess) {
        onSuccess(user);
      }
      
      return user;
    } catch (error) {
      if (onError) {
        if (error.response) {
          const { message, errors } = error.response.data;
          onError(message || 'Signup failed', errors);
        } else {
          onError('An error occurred. Please try again.');
        }
      }
      
      throw error;
    }
  }

  /**
   * Handle Google authentication
   * @param {string} type - 'login' or 'signup'
   */
  googleAuth(type) {
    authService.googleAuth(type);
  }

  /**
   * Handle user logout
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  async logout(onSuccess, onError) {
    try {
      await authService.logout();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (onError) {
        onError('Logout failed');
      }
      
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return authService.isAuthenticated();
  }

  /**
   * Process OAuth callback
   * @param {URLSearchParams} urlParams - URL query parameters
   * @returns {Object} Extracted data
   */
  processAuthCallback(urlParams) {
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      return { success: true, token };
    }
    
    return { success: false };
  }
}

// Create singleton instance
const authController = new AuthController();

export default authController;