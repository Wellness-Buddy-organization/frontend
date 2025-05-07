// src/controllers/DashboardController.js - Fixed

import { wellnessService } from '../services';

/**
 * Controller for dashboard-related operations
 */
class DashboardController {
  /**
   * Fetch dashboard data
   * @param {AbortSignal} signal - Optional abort signal for cancellation
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   * @param {Function} onFinally - Callback that runs regardless of outcome
   */
  async fetchDashboardData(signal, onSuccess, onError, onFinally) {
    try {
      const data = await wellnessService.fetchDashboard(signal);
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      if (error.name === 'AbortError' || error.message === 'canceled') {
        // Request was canceled, no need to handle
        return;
      }
      
      if (onError) {
        if (error.response) {
          // Handle specific error statuses
          if (error.response.status === 401) {
            onError('Unauthorized', 'auth');
          } else if (error.response.status === 419 || error.response.status === 440) {
            onError('Session timeout', 'timeout');
          } else {
            onError(error.response.data?.message || 'Failed to load dashboard data');
          }
        } else {
          onError(error.message || 'Failed to load dashboard data');
        }
      }
      
      throw error;
    } finally {
      if (onFinally) {
        onFinally();
      }
    }
  }

  /**
   * Process dashboard data for UI consumption
   * @param {Object} dashboardData - Raw dashboard data
   * @returns {Object} Processed data
   */
  processDashboardData(dashboardData) {
    if (!dashboardData) return {};
    
    // Extract user name
    const userName = dashboardData.user?.fullName || 'User';
    
    // Create wellness data
    const wellnessData = dashboardData.wellness || {};
    
    // Calculate wellness score
    const wellnessScore = wellnessData.score || 
      (wellnessData.calculateWellnessScore ? wellnessData.calculateWellnessScore() : 0);
    
    // Process work-life balance data
    const workLifeBalanceData = dashboardData.workLifeBalance || {};
    const balanceScore = workLifeBalanceData.calculateBalanceScore ?
      workLifeBalanceData.calculateBalanceScore() : 0;
    
    return {
      userName,
      wellnessData,
      wellnessScore,
      workLifeBalanceData,
      balanceScore
    };
  }
}

// Create singleton instance
const dashboardController = new DashboardController();

export default dashboardController;