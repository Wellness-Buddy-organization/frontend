/**
 * User model representing the user data and related business logic
 */
class User {
    constructor(data = {}) {
      this.id = data.id || '';
      this.fullName = data.fullName || '';
      this.email = data.email || '';
      this.token = data.token || '';
      this.createdAt = data.createdAt || null;
      this.lastLogin = data.lastLogin || null;
    }
  
    /**
     * Check if the user is authenticated
     * @returns {boolean} True if the user has a token
     */
    isAuthenticated() {
      return !!this.token;
    }
  
    /**
     * Get user initials for avatar display
     * @returns {string} User initials
     */
    getInitials() {
      if (!this.fullName) return '';
      
      return this.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase();
    }
  
    /**
     * Create a user instance from API response
     * @param {Object} data - User data from API
     * @returns {User} User instance
     */
    static fromApiResponse(data) {
      return new User({
        id: data._id || data.id,
        fullName: data.fullName,
        email: data.email,
        createdAt: data.createdAt ? new Date(data.createdAt) : null,
        lastLogin: data.lastLogin ? new Date(data.lastLogin) : null
      });
    }
  }
  
  export default User;