// src/services/ApiService.js - update interceptors

import axios from 'axios';

/**
 * Base API service for handling HTTP requests
 */
class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Add response interceptor for common error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Don't process canceled requests as errors
        if (axios.isCancel(error)) {
          return Promise.reject(error);
        }
        
        // Handle session timeout or unauthorized access
        if (error.response && (error.response.status === 401 || error.response.status === 419 || error.response.status === 440)) {
          // Clear token and redirect to login page if needed
          localStorage.removeItem('token');
          
          // We don't directly navigate here to avoid coupling with router
          // Controllers will handle navigation based on error status
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Additional axios config
   * @returns {Promise} API response
   */
  get(endpoint, config = {}) {
    return this.client.get(endpoint, config);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {Object} config - Additional axios config
   * @returns {Promise} API response
   */
  post(endpoint, data = {}, config = {}) {
    return this.client.post(endpoint, data, config);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {Object} config - Additional axios config
   * @returns {Promise} API response
   */
  put(endpoint, data = {}, config = {}) {
    return this.client.put(endpoint, data, config);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} config - Additional axios config
   * @returns {Promise} API response
   */
  delete(endpoint, config = {}) {
    return this.client.delete(endpoint, config);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;