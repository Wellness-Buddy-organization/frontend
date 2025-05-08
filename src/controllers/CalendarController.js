// src/controllers/calendarController.js

import calendarService from '../services/CalendarService';
import CalendarEvent from '../models/CalendarEvent';

/**
 * Controller for handling calendar-related operations
 */
const calendarController = {
  /**
   * Fetch events for a specific week
   * @param {Date} weekStart - Start date of the week
   * @returns {Promise<Array>} List of events
   */
  fetchWeekEvents: async (weekStart) => {
    try {
      // Create date range for the week (Monday to Sunday)
      const start = new Date(weekStart);
      const end = new Date(weekStart);
      end.setDate(end.getDate() + 6); // Add 6 days to get to Sunday
      
      // Set time to start and end of day
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      // Fetch events for the week
      const events = await calendarService.fetchEvents(start, end);
      
      return events;
    } catch (error) {
      console.error('Error fetching week events:', error);
      throw error;
    }
  },
  
  /**
   * Create a new calendar event
   * @param {Object} eventData - Event data
   * @returns {Promise<CalendarEvent>} Created event
   */
  createEvent: async (eventData) => {
    try {
      return await calendarService.createEvent(eventData);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing calendar event
   * @param {string} id - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise<CalendarEvent>} Updated event
   */
  updateEvent: async (id, eventData) => {
    try {
      return await calendarService.updateEvent(id, eventData);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },
  
  /**
   * Delete a calendar event
   * @param {string} id - Event ID
   * @returns {Promise<Object>} Response data
   */
  deleteEvent: async (id) => {
    try {
      return await calendarService.deleteEvent(id);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },
  
  /**
   * Format date string for date input field
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string (YYYY-MM-DD)
   */
  formatDateForInput: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
  
  /**
   * Format time string for time input field
   * @param {Date} date - Date to format
   * @returns {string} Formatted time string (HH:MM)
   */
  formatTimeForInput: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  },
  
  /**
   * Format display time (12-hour format)
   * @param {Date} date - Date to format
   * @returns {string} Formatted time string (e.g., "10:30 AM")
   */
  formatDisplayTime: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  },
  
  /**
   * Get color for category
   * @param {string} category - Event category
   * @returns {string} CSS class for category
   */
  getCategoryColor: (category) => {
    switch (category) {
      case 'work': return 'bg-emerald-100 text-emerald-800';
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'wellness': return 'bg-purple-100 text-purple-800';
      case 'health': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
};

export default calendarController;