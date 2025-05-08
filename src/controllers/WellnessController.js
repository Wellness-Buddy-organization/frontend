import { wellnessService } from '../services';

/**
 * Controller for wellness tracking operations
 */
class WellnessController {
  /**
   * Handle daily check-in submission
   * @param {Object} formData - Check-in form data
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   * @param {Function} onFinally - Callback that runs regardless of outcome
   */
  async submitDailyCheckin(formData, onSuccess, onError, onFinally) {
    try {
      // Process and save each component of the check-in
      const results = {};
      
      // Save mood data if provided
      if (formData.mood) {
        results.mood = await wellnessService.saveMood(
          this._getMoodLabel(formData.mood),
          formData.stress
        );
      }
      
      // Save sleep data if provided
      if (formData.sleepHours) {
        results.sleep = await wellnessService.saveSleep(
          formData.sleepHours,
          formData.sleepQuality
        );
      }
      
      // Save work data if provided
      if (formData.workHours) {
        results.work = await wellnessService.saveWork(formData.workHours);
        
        // Log breaks if taken
        if (formData.breaksTaken > 0) {
          results.breaks = [];
          for (let i = 0; i < formData.breaksTaken; i++) {
            const breakResult = await wellnessService.logBreak();
            results.breaks.push(breakResult);
          }
        }
      }
      
      if (onSuccess) {
        onSuccess(results);
      }
      
      return results;
    } catch (error) {
      if (onError) {
        onError(error.message || 'Failed to save check-in data');
      }
      
      throw error;
    } finally {
      if (onFinally) {
        onFinally();
      }
    }
  }

  /**
   * Log a break
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  async logBreak(onSuccess, onError) {
    try {
      const result = await wellnessService.logBreak();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      if (onError) {
        onError('Failed to log break');
      }
      
      throw error;
    }
  }

  /**
   * Save work-life balance data
   * @param {Object} balanceData - Work-life balance data
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  async saveWorkLifeBalance(balanceData, onSuccess, onError) {
    try {
      const result = await wellnessService.saveWorkLifeBalance(balanceData);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      if (onError) {
        onError('Failed to save work-life balance data');
      }
      
      throw error;
    }
  }

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
    const workLifeBalance = response.data.workLifeBalance ? 
      WorkLifeBalance.fromApiResponse(response.data.workLifeBalance) : 
      null;
    
    // Format reminders if they exist
    const reminders = response.data.reminders ? 
      response.data.reminders.map(item => Reminder.fromApiResponse(item)) : 
      [];
    
    return {
      user: response.data.user,
      wellness: wellnessData,
      workLifeBalance,
      reminders
    };
  } catch (error) {
    throw error;
  }
}

  /**
   * Convert mood value to label
   * @private
   * @param {number} moodValue - Mood value (1-5)
   * @returns {string} Mood label
   */
  _getMoodLabel(moodValue) {
    const moodMap = {
      1: 'angry',
      2: 'sad',
      3: 'anxious',
      4: 'neutral',
      5: 'happy'
    };
    
    return moodMap[moodValue] || 'neutral';
  }
}

// Create singleton instance
const wellnessController = new WellnessController();

export default wellnessController;