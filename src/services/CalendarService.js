// src/services/calendarService.js

import apiService from './ApiService';
import CalendarEvent from '../models/CalendarEvent';

/**
 * Service for handling calendar events API calls
 */
class CalendarService {
  /**
   * Fetch events for a date range
   * @param {Date} startDate - Range start date
   * @param {Date} endDate - Range end date
   * @returns {Promise<Array<CalendarEvent>>} List of calendar events
   */
  async fetchEvents(startDate, endDate) {
    try {
      // Format dates for the API
      const start = startDate.toISOString();
      const end = endDate.toISOString();
      
      const response = await apiService.get(`/calendar?startDate=${start}&endDate=${end}`);
      
      // Convert API data to model instances
      return response.data.map(event => CalendarEvent.fromApiResponse(event));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  /**
   * Create a new calendar event
   * @param {CalendarEvent} eventData - Event data
   * @returns {Promise<CalendarEvent>} Created event
   */
  async createEvent(eventData) {
    try {
      const apiData = eventData instanceof CalendarEvent 
        ? eventData.toApiFormat() 
        : new CalendarEvent(eventData).toApiFormat();
      
      const response = await apiService.post('/calendar', apiData);
      
      return CalendarEvent.fromApiResponse(response.data);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Update an existing calendar event
   * @param {string} id - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise<CalendarEvent>} Updated event
   */
  async updateEvent(id, eventData) {
    try {
      const apiData = eventData instanceof CalendarEvent 
        ? eventData.toApiFormat() 
        : new CalendarEvent(eventData).toApiFormat();
      
      const response = await apiService.put(`/calendar/${id}`, apiData);
      
      return CalendarEvent.fromApiResponse(response.data);
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  /**
   * Delete a calendar event
   * @param {string} id - Event ID
   * @returns {Promise<Object>} API response
   */
  async deleteEvent(id) {
    try {
      const response = await apiService.delete(`/calendar/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }
}

// Create singleton instance
const calendarService = new CalendarService();

export default calendarService;