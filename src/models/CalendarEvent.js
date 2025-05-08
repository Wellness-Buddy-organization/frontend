// src/models/CalendarEvent.js

/**
 * CalendarEvent model for managing event data
 */
class CalendarEvent {
    constructor(data = {}) {
      this.id = data.id || data._id || '';
      this.title = data.title || '';
      this.startDate = data.startDate || data.date || new Date();
      this.endDate = data.endDate || data.endTime || new Date();
      this.category = data.category || 'personal';
      this.description = data.description || '';
    }
  
    /**
     * Get formatted time for display
     * @returns {string} Formatted time string (e.g., "10:30 AM - 11:30 AM")
     */
    getFormattedTime() {
      const startOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
      const endOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
      
      const start = new Date(this.startDate).toLocaleTimeString('en-US', startOptions);
      const end = new Date(this.endDate).toLocaleTimeString('en-US', endOptions);
      
      return `${start} - ${end}`;
    }
  
    /**
     * Check if event is happening today
     * @returns {boolean} True if event is today
     */
    isToday() {
      const today = new Date();
      const eventDate = new Date(this.startDate);
      
      return today.toDateString() === eventDate.toDateString();
    }
    
    /**
     * Get category color class
     * @returns {string} CSS class for category
     */
    getCategoryColorClass() {
      switch (this.category) {
        case 'work': return 'bg-emerald-100 text-emerald-800';
        case 'personal': return 'bg-blue-100 text-blue-800';
        case 'wellness': return 'bg-purple-100 text-purple-800';
        case 'health': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  
    /**
     * Convert to API format for sending to server
     * @returns {Object} API formatted event
     */
    toApiFormat() {
      return {
        title: this.title,
        startDate: new Date(this.startDate).toISOString(),
        endDate: new Date(this.endDate).toISOString(),
        category: this.category,
        description: this.description
      };
    }
  
    /**
     * Create a CalendarEvent instance from API data
     * @param {Object} data - Calendar event data from API
     * @returns {CalendarEvent} CalendarEvent instance
     */
    static fromApiResponse(data) {
      return new CalendarEvent({
        id: data._id,
        title: data.title,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        category: data.category,
        description: data.description
      });
    }
  }
  
  export default CalendarEvent;