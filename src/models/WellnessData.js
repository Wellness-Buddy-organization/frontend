/**
 * WellnessData model for tracking various wellness metrics
 */
class WellnessData {
    constructor(data = {}) {
      this.mood = data.mood || [];
      this.sleep = data.sleep || [];
      this.hydration = data.hydration || [];
      this.work = data.work || [];
      this.breaks = data.breaks || [];
    }
  
    /**
     * Calculate the average mood score
     * @returns {number} Average mood score (1-5)
     */
    getAverageMood() {
      if (!this.mood.length) return 0;
      
      const moodMap = { 'happy': 5, 'neutral': 4, 'anxious': 3, 'sad': 2, 'angry': 1 };
      const sum = this.mood.reduce((acc, entry) => {
        return acc + (moodMap[entry.mood] || 3);
      }, 0);
      
      return sum / this.mood.length;
    }
  
    /**
     * Calculate the average sleep hours
     * @returns {number} Average sleep hours
     */
    getAverageSleep() {
      if (!this.sleep.length) return 0;
      
      const sum = this.sleep.reduce((acc, entry) => acc + entry.hours, 0);
      return sum / this.sleep.length;
    }
  
    /**
     * Calculate the average work hours
     * @returns {number} Average work hours
     */
    getAverageWorkHours() {
      if (!this.work.length) return 0;
      
      const sum = this.work.reduce((acc, entry) => acc + entry.hours, 0);
      return sum / this.work.length;
    }
  
    /**
     * Calculate the average hydration (glasses of water)
     * @returns {number} Average hydration
     */
    getAverageHydration() {
      if (!this.hydration.length) return 0;
      
      const sum = this.hydration.reduce((acc, entry) => acc + entry.glasses, 0);
      return sum / this.hydration.length;
    }
  
    /**
     * Calculate overall wellness score (0-100)
     * @returns {number} Wellness score
     */
    calculateWellnessScore() {
      if (!this.mood.length && !this.sleep.length && !this.hydration.length && !this.work.length) {
        return 0;
      }
      
      let score = 0;
      let factors = 0;
      
      // Add mood score (1-5 scale to 0-20 scale)
      if (this.mood.length > 0) {
        const moodScore = this.getAverageMood() * 4;
        score += moodScore;
        factors++;
      }
      
      // Add sleep score (compare to ideal 7-9 hours)
      if (this.sleep.length > 0) {
        const avgSleep = this.getAverageSleep();
        // 8 hours is optimal (20 points), less than 6 or more than 10 is poor (5 points)
        const sleepScore = avgSleep >= 7 && avgSleep <= 9 
          ? 20 
          : (avgSleep >= 6 && avgSleep <= 10 ? 15 : 5);
        score += sleepScore;
        factors++;
      }
      
      // Add hydration score (ideal is 2-3L)
      if (this.hydration.length > 0) {
        const avgGlasses = this.getAverageHydration();
        // Convert glasses to liters (1 glass = 0.25L)
        const liters = avgGlasses * 0.25;
        const hydrationScore = liters >= 2 ? 20 : (liters >= 1 ? 15 : 5);
        score += hydrationScore;
        factors++;
      }
      
      // Add work balance score (ideal is 7-8 hours)
      if (this.work.length > 0) {
        const avgWork = this.getAverageWorkHours();
        // Work balance: 7-8 hours is optimal, >10 or <4 is poor
        const workScore = (avgWork >= 7 && avgWork <= 8) 
          ? 20 
          : (avgWork > 10 || avgWork < 4) ? 5 : 15;
        score += workScore;
        factors++;
      }
      
      // Calculate average and round to nearest whole number
      return Math.round(factors > 0 ? score / factors : 0);
    }
    
    /**
     * Create a WellnessData instance from API response
     * @param {Object} data - Wellness data from API
     * @returns {WellnessData} WellnessData instance
     */
    static fromApiResponse(data) {
      if (!data) return new WellnessData();
      
      return new WellnessData({
        mood: data.mood || [],
        sleep: data.sleep || [],
        hydration: data.hydration || [],
        work: data.work || [],
        breaks: data.breaks || []
      });
    }
  }
  
  export default WellnessData;