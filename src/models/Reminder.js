/**
 * Reminder model for wellness notifications
 */
class Reminder {
    constructor(data = {}) {
      this._id = data._id || '';
      this.type = data.type || 'water';
      this.time = data.time || '09:00';
      this.days = data.days || ['mon', 'tue', 'wed', 'thu', 'fri'];
      this.enabled = data.enabled !== undefined ? data.enabled : true;
      this.message = data.message || '';
      this.sound = data.sound || 'chime';
    }
  
    /**
     * Get readable days of week
     * @returns {string} Formatted days
     */
    getFormattedDays() {
      const allDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      
      // Check if it's every day
      if (this.days.length === 7) {
        return 'Every day';
      }
      
      // Check if it's weekdays
      if (this.days.length === 5 && 
          this.days.every(day => ['mon', 'tue', 'wed', 'thu', 'fri'].includes(day))) {
        return 'Weekdays';
      }
      
      // Check if it's weekends
      if (this.days.length === 2 && 
          this.days.every(day => ['sat', 'sun'].includes(day))) {
        return 'Weekends';
      }
      
      // Otherwise, list the days
      return this.days.map(day => day.charAt(0).toUpperCase()).join(', ');
    }
  
    /**
     * Get the next occurrence of this reminder
     * @returns {Date} Next occurrence date
     */
    getNextOccurrence() {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][now.getDay()];
      
      // Parse reminder time
      const [hour, minute] = this.time.split(':').map(Number);
      
      // Check if the reminder is scheduled for today and hasn't occurred yet
      if (this.days.includes(currentDay) && 
          (hour > currentHour || (hour === currentHour && minute > currentMinute))) {
        const nextDate = new Date();
        nextDate.setHours(hour, minute, 0, 0);
        return nextDate;
      }
      
      // Find the next day when the reminder is scheduled
      let daysToAdd = 1;
      let nextDayIndex = (now.getDay() + daysToAdd) % 7;
      let nextDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][nextDayIndex];
      
      while (!this.days.includes(nextDay)) {
        daysToAdd++;
        nextDayIndex = (now.getDay() + daysToAdd) % 7;
        nextDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][nextDayIndex];
      }
      
      const nextDate = new Date();
      nextDate.setDate(now.getDate() + daysToAdd);
      nextDate.setHours(hour, minute, 0, 0);
      
      return nextDate;
    }
    
    /**
     * Create a Reminder instance from API response
     * @param {Object} data - Reminder data from API
     * @returns {Reminder} Reminder instance
     */
    static fromApiResponse(data) {
      return new Reminder({
        _id: data._id,
        type: data.type,
        time: data.time,
        days: data.days,
        enabled: data.enabled,
        message: data.message,
        sound: data.sound
      });
    }
  }
  
  export default Reminder;