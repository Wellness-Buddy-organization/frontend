// src/controllers/dashboardController.js

import { wellnessService, reminderService } from '../services';

/**
 * Dashboard controller to handle data fetching and processing for the Dashboard view
 */
const dashboardController = {
  /**
   * Fetch dashboard data from the API
   * @param {AbortSignal} abortSignal - Signal for request cancellation
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   * @param {Function} onFinally - Finally callback
   * @returns {Promise<Object>} Processed dashboard data
   */
  fetchDashboardData: async (abortSignal, onSuccess, onError, onFinally) => {
    try {
      const data = await wellnessService.fetchDashboard(abortSignal);
      
      // Process data for the UI
      const processedData = dashboardController.processDashboardData(data);
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return processedData;
    } catch (error) {
      // Check if the request was canceled (aborted)
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        console.log('Request was canceled due to component unmount or navigation');
        // Don't call onError for canceled requests
        return null;
      }
      
      console.error('Dashboard data error:', error);
      
      // Handle different types of errors
      let errorType = 'general';
      let message = 'Failed to load dashboard data';
      
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 419) {
          errorType = 'auth';
          message = 'Your session has expired. Please log in again.';
        } else if (error.response.status === 440) {
          errorType = 'timeout';
          message = 'Your session timed out. Please log in again.';
        } else if (error.response.data && error.response.data.message) {
          message = error.response.data.message;
        }
      } else if (error.request) {
        message = 'Cannot connect to the server. Please check your internet connection.';
      }
      
      if (onError) {
        onError(message, errorType);
      }
      
      throw error;
    } finally {
      if (onFinally) {
        onFinally();
      }
    }
  },
  
  /**
   * Process dashboard data for UI display
   * @param {Object} data - Raw dashboard data from API
   * @returns {Object} Processed data for UI
   */
  processDashboardData: (data) => {
    return {
      userName: data.user.fullName,
      wellnessScore: data.wellness.score,
      reminders: data.reminders || [],
      insights: dashboardController.generateInsights(data.wellness)
    };
  },
  
  /**
   * Generate user insights based on wellness data
   * @param {Object} wellnessData - Wellness data object
   * @returns {Object|null} Top insight or null if none
   */
  generateInsights: (wellnessData) => {
    const insights = [];
    
    // Sleep insights
    if (wellnessData.sleep && wellnessData.sleep.length > 0) {
      const avgSleep = wellnessData.sleep.reduce((acc, entry) => 
        acc + entry.hours, 0) / wellnessData.sleep.length;
      
      if (avgSleep < 7) {
        insights.push({
          category: 'sleep',
          title: 'Sleep Focus',
          description: 'You\'re averaging less than 7 hours of sleep. Try going to bed 30 minutes earlier this week.',
          icon: 'HeartIcon',
          priority: 3,
          action: 'View Sleep Tips',
          actionPath: '/dashboard/mental-health',
          color: 'bg-purple-50 border-purple-200'
        });
      }
    }
    
    // Hydration insights
    if (wellnessData.hydration && wellnessData.hydration.length > 0) {
      const avgGlasses = wellnessData.hydration.reduce((acc, entry) => 
        acc + entry.glasses, 0) / wellnessData.hydration.length;
      const avgLiters = avgGlasses * 0.25;
      
      if (avgLiters < 2) {
        insights.push({
          category: 'hydration',
          title: 'Hydration Alert',
          description: 'Your recent water intake is below the recommended 2 liters. Set reminders to drink more water.',
          icon: 'WaterIcon',
          priority: 2,
          action: 'Add Reminder',
          actionPath: '/dashboard/reminders',
          color: 'bg-blue-50 border-blue-200'
        });
      }
    }
    
    // Work-life balance insights
    if (wellnessData.work && wellnessData.work.length > 0) {
      const avgWork = wellnessData.work.reduce((acc, entry) => 
        acc + entry.hours, 0) / wellnessData.work.length;
      
      if (avgWork > 9) {
        insights.push({
          category: 'work',
          title: 'Work-Life Balance',
          description: 'You\'re working more than 9 hours on average. Consider scheduling more breaks.',
          icon: 'BriefcaseIcon',
          priority: 1,
          action: 'View Balance',
          actionPath: '/dashboard/work-life',
          color: 'bg-amber-50 border-amber-200'
        });
      }
    }
    
    // Mood patterns
    if (wellnessData.mood && wellnessData.mood.length > 1) {
      const moodMap = { 'happy': 5, 'neutral': 4, 'anxious': 3, 'sad': 2, 'angry': 1 };
      const avgMood = wellnessData.mood.reduce((acc, entry) => 
        acc + (moodMap[entry.mood] || 3), 0) / wellnessData.mood.length;
      
      if (avgMood <= 3) {
        insights.push({
          category: 'mood',
          title: 'Mood Support',
          description: 'Your recent mood entries indicate stress. Try a meditation session in the Mental Health section.',
          icon: 'ChartBarIcon',
          priority: 4,
          action: 'Try Meditation',
          actionPath: '/dashboard/mental-health',
          color: 'bg-red-50 border-red-200'
        });
      }
    }
    
    // Sort by priority (highest first) and return the top insight
    insights.sort((a, b) => b.priority - a.priority);
    
    return insights.length > 0 
      ? insights[0] 
      : { 
          title: 'On Track!', 
          description: 'Your wellness metrics look good. Keep up the great work!',
          icon: 'HeartIcon',
          action: 'View Details',
          actionPath: '/dashboard/tracking',
          color: 'bg-emerald-50 border-emerald-200'
        };
  },
  
  /**
   * Fetch upcoming reminders
   * @returns {Promise<Array>} List of upcoming reminders
   */
  fetchUpcomingReminders: async () => {
    try {
      const reminders = await reminderService.getUpcomingReminders();
      return reminders;
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }
  }
};

export default dashboardController;