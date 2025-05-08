import { reminderService } from '../services';
import { Reminder } from '../models';

/**
 * Controller for reminder-related operations
 */
class ReminderController {
  /**
   * Fetch all reminders
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   * @param {Function} onFinally - Callback that runs regardless of outcome
   */
  async fetchReminders(onSuccess, onError, onFinally) {
    try {
      const reminders = await reminderService.fetchReminders();
      
      if (onSuccess) {
        onSuccess(reminders);
      }
      
      return reminders;
    } catch (error) {
      if (onError) {
        if (error.response && error.response.status === 401) {
          onError('Unauthorized', 'auth');
        } else {
          onError(error.message || 'Failed to load reminders');
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
   * Add a new reminder
   * @param {Object} reminderData - Reminder data
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  async addReminder(reminderData, onSuccess, onError) {
    try {
      const reminder = await reminderService.addReminder(reminderData);
      
      if (onSuccess) {
        onSuccess(reminder);
      }
      
      return reminder;
    } catch (error) {
      if (onError) {
        onError('Failed to add reminder');
      }
      
      throw error;
    }
  }

  /**
   * Update an existing reminder
   * @param {string} id - Reminder ID
   * @param {Object} reminderData - Updated reminder data
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  async updateReminder(id, reminderData, onSuccess, onError) {
    try {
      const reminder = await reminderService.updateReminder(id, reminderData);
      
      if (onSuccess) {
        onSuccess(reminder);
      }
      
      return reminder;
    } catch (error) {
      if (onError) {
        onError('Failed to update reminder');
      }
      
      throw error;
    }
  }

  /**
   * Delete a reminder
   * @param {string} id - Reminder ID
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   */
  async deleteReminder(id, onSuccess, onError) {
    try {
      await reminderService.deleteReminder(id);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (onError) {
        onError('Failed to delete reminder');
      }
      
      throw error;
    }
  }

  /**
   * Apply a template pack of reminders
   * @param {Object} templatePack - Template pack object
   * @param {Function} onSuccess - Success callback for each reminder
   * @param {Function} onComplete - Callback when all reminders are created
   * @param {Function} onError - Error callback
   */
  async applyTemplatePack(templatePack, onSuccess, onComplete, onError) {
    try {
      const results = [];
      
      // Process each reminder template
      for (let i = 0; i < templatePack.reminders.length; i++) {
        const reminderTemplate = templatePack.reminders[i];
        
        try {
          // Create the reminder
          const reminder = await reminderService.addReminder({
            type: reminderTemplate.type,
            time: reminderTemplate.time,
            days: reminderTemplate.days,
            enabled: true,
            message: '',
            sound: this._getDefaultSoundForType(reminderTemplate.type)
          });
          
          results.push(reminder);
          
          // Call success callback for each created reminder
          if (onSuccess) {
            onSuccess(reminder, i, templatePack.reminders.length);
          }
        } catch (error) {
          // Log error but continue with remaining reminders
          console.error(`Failed to create reminder ${i}:`, error);
        }
      }
      
      // Call complete callback when all done
      if (onComplete) {
        onComplete(results);
      }
      
      return results;
    } catch (error) {
      if (onError) {
        onError('Failed to apply template pack');
      }
      
      throw error;
    }
  }

  /**
 * Get upcoming reminders
 * @param {Object} options - Query options
 * @returns {Promise<Array>} List of upcoming reminders
 */
async getUpcomingReminders(options = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // Add upcoming flag
    queryParams.append('upcoming', 'true');
    
    // Add limit if provided
    if (options.limit) {
      queryParams.append('limit', options.limit);
    }
    
    const response = await apiService.get(`/reminder?${queryParams.toString()}`);
    
    // Convert API data to model instances
    return response.data.map(item => Reminder.fromApiResponse(item));
  } catch (error) {
    throw error;
  }
}

  /**
   * Get default sound for reminder type
   * @private
   * @param {string} type - Reminder type
   * @returns {string} Default sound
   */
  _getDefaultSoundForType(type) {
    const soundMap = {
      water: 'drop',
      meal: 'bell',
      eye_rest: 'chime',
      stretch: 'soft',
      posture: 'ping',
      meditation: 'calm'
    };
    
    return soundMap[type] || 'chime';
  }
}

// Create singleton instance
const reminderController = new ReminderController();

export default reminderController;