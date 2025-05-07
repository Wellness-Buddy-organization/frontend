/**
 * WorkLifeBalance model for tracking work-life metrics
 */
class WorkLifeBalance {
    constructor(data = {}) {
      this.timeAllocation = data.timeAllocation || this.getDefaultTimeAllocation();
      this.challenges = data.challenges || [];
      this.achievements = data.achievements || [];
    }
  
    /**
     * Get default time allocation data
     * @returns {Array} Default time allocation
     */
    getDefaultTimeAllocation() {
      return [
        { category: "work", hours: 40, target: 40 },
        { category: "family", hours: 25, target: 35 },
        { category: "personal", hours: 15, target: 20 },
        { category: "learning", hours: 5, target: 7 },
        { category: "social", hours: 10, target: 12 },
        { category: "rest", hours: 73, target: 56 },
      ];
    }
  
    /**
     * Calculate balance score (0-100)
     * @returns {number} Balance score
     */
    calculateBalanceScore() {
      if (!this.timeAllocation.length) {
        return 50; // Default middle score
      }
      
      let score = 0;
      const totalWeight = this.timeAllocation.length;
      
      // For each category, calculate how close actual hours are to target
      this.timeAllocation.forEach(item => {
        const targetHours = item.target;
        const actualHours = item.hours;
        
        // Perfect match gets full points
        if (actualHours === targetHours) {
          score += 100;
          return;
        }
        
        // Calculate points based on percentage difference
        const difference = Math.abs(actualHours - targetHours);
        const percentDifference = difference / targetHours;
        
        // Apply a penalty based on the percentage difference
        // The bigger the difference, the bigger the penalty
        let categoryScore = 100 - (percentDifference * 100);
        
        // Extra penalty for overworking
        if (item.category === "work" && actualHours > targetHours) {
          categoryScore -= 10;
        }
        
        // Extra penalty for not resting enough
        if (item.category === "rest" && actualHours < targetHours) {
          categoryScore -= 10;
        }
        
        // Ensure score is between 0 and 100
        categoryScore = Math.max(0, Math.min(100, categoryScore));
        
        score += categoryScore;
      });
      
      // Return average score
      return Math.round(score / totalWeight);
    }
  
    /**
     * Get recommendations based on balance data
     * @returns {Array} Array of recommendation objects
     */
    getRecommendations() {
      const recommendations = [];
      
      // Check work hours
      const workData = this.timeAllocation.find(item => item.category === "work");
      if (workData && workData.hours > workData.target + 5) {
        recommendations.push({
          category: "work",
          title: "Reduce Work Hours",
          description: "You're working significantly more than your target. Consider setting stricter boundaries."
        });
      }
      
      // Check rest hours
      const restData = this.timeAllocation.find(item => item.category === "rest");
      if (restData && restData.hours < restData.target - 5) {
        recommendations.push({
          category: "rest",
          title: "Increase Rest Time",
          description: "You're not getting enough rest. Try to allocate more time for sleep and relaxation."
        });
      }
      
      // Check family hours
      const familyData = this.timeAllocation.find(item => item.category === "family");
      if (familyData && familyData.hours < familyData.target - 5) {
        recommendations.push({
          category: "family",
          title: "Prioritize Family Time",
          description: "You're spending less time with family than targeted. Consider scheduling dedicated family time."
        });
      }
      
      return recommendations;
    }
    
    /**
     * Create a WorkLifeBalance instance from API response
     * @param {Object} data - WorkLifeBalance data from API
     * @returns {WorkLifeBalance} WorkLifeBalance instance
     */
    static fromApiResponse(data) {
      if (!data) return new WorkLifeBalance();
      
      return new WorkLifeBalance({
        timeAllocation: data.timeAllocation || [],
        challenges: data.challenges || [],
        achievements: data.achievements || []
      });
    }
  }
  
  export default WorkLifeBalance;