import apiService from './ApiService';
import { WellnessData, WorkLifeBalance } from '../models';

/**
 * Service for handling wellness-related API calls
 */
class WellnessService {
  /**
   * Fetch dashboard data
   * @param {AbortSignal} signal - Optional abort signal for cancellation
   * @returns {Promise<Object>} Dashboard data
   */
  async fetchDashboard(signal) {
    try {
      const response = await apiService.get('/dashboard/me', { signal });
      
      // Convert API data to model instances
      const wellnessData = WellnessData.fromApiResponse(response.data.wellness);
      const workLifeBalance = WorkLifeBalance.fromApiResponse(response.data.workLifeBalance);
      
      return {
        user: response.data.user,
        wellness: wellnessData,
        workLifeBalance
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save mood entry
   * @param {string} mood - Mood value
   * @param {number} stress - Stress level (1-5)
   * @returns {Promise<Object>} API response
   */
  async saveMood(mood, stress) {
    try {
      const response = await apiService.post('/mood', { 
        mood, 
        notes: `Stress: ${stress}` 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save sleep entry
   * @param {number} hours - Sleep hours
   * @param {string} quality - Sleep quality
   * @returns {Promise<Object>} API response
   */
  async saveSleep(hours, quality = 'good') {
    try {
      const response = await apiService.post('/sleep', { hours, quality });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save work hours entry
   * @param {number} hours - Work hours
   * @returns {Promise<Object>} API response
   */
  async saveWork(hours) {
    try {
      const response = await apiService.post('/work', { hours });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log a break
   * @param {number} duration - Break duration in minutes
   * @param {string} type - Break type
   * @returns {Promise<Object>} API response
   */
  async logBreak(duration = 5, type = 'short') {
    try {
      const response = await apiService.post('/break', { duration, type });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save hydration data
   * @param {number} glasses - Number of water glasses
   * @returns {Promise<Object>} API response
   */
  async saveHydration(glasses) {
    try {
      const response = await apiService.post('/hydration', { glasses });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save work-life balance data
   * @param {Object} data - Work-life balance data
   * @returns {Promise<Object>} API response
   */
  async saveWorkLifeBalance(data) {
    try {
      const response = await apiService.post('/work-life-balance', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Create singleton instance
const wellnessService = new WellnessService();

export default wellnessService;