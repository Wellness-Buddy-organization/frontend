import apiService from './ApiService';
import { Reminder } from '../models';

/**
 * Service for handling reminder-related API calls
 */
class ReminderService {
  /**
   * Fetch all reminders
   * @returns {Promise<Array>} List of reminders
   */
  async fetchReminders() {
    try {
      const response = await apiService.get('/reminder');
      
      // Convert API data to model instances
      return response.data.map(item => Reminder.fromApiResponse(item));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add a new reminder
   * @param {Object} reminderData - Reminder data
   * @returns {Promise<Reminder>} Created reminder
   */
  async addReminder(reminderData) {
    try {
      const response = await apiService.post('/reminder', reminderData);
      return Reminder.fromApiResponse(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing reminder
   * @param {string} id - Reminder ID
   * @param {Object} reminderData - Updated reminder data
   * @returns {Promise<Reminder>} Updated reminder
   */
  async updateReminder(id, reminderData) {
    try {
      const response = await apiService.put(`/reminder/${id}`, reminderData);
      return Reminder.fromApiResponse(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a reminder
   * @param {string} id - Reminder ID
   * @returns {Promise<Object>} API response
   */
  async deleteReminder(id) {
    try {
      const response = await apiService.delete(`/reminder/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Apply a template pack of reminders
   * @param {Array} reminders - Array of reminder templates
   * @returns {Promise<Array>} Created reminders
   */
  async applyTemplatePack(reminders) {
    try {
      // Create reminders sequentially
      const createdReminders = [];
      
      for (const reminder of reminders) {
        const response = await this.addReminder(reminder);
        createdReminders.push(response);
      }
      
      return createdReminders;
    } catch (error) {
      throw error;
    }
  }
}

// Create singleton instance
const reminderService = new ReminderService();

export default reminderService;