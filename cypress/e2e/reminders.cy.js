describe('Reminder Management', () => {
  beforeEach(() => {
    cy.mockApiCalls();
    
    // Mock adding a reminder
    cy.intercept('POST', '/api/reminder', {
      statusCode: 200,
      body: {
        _id: 'new-reminder',
        type: 'meal',
        time: '12:00',
        days: ['mon', 'wed', 'fri'],
        enabled: true,
        message: 'Time for lunch!',
        sound: 'bell',
        userId: 'user123'
      }
    }).as('addReminderRequest');
    
    // Set token to simulate logged in state
    window.localStorage.setItem('token', 'mock-token');
    
    // Navigate to reminders page
    cy.visit('/dashboard/reminders');
    
    // Wait for reminders to load
    cy.wait('@getRemindersRequest');
  });

  it('should allow adding a new reminder', () => {
    // Click the New Reminder button
    cy.contains('New Reminder').click();
    
    // Select reminder type (meal)
    cy.contains('Meal').click();
    
    // Set message
    cy.get('input[placeholder="Reminder message..."]').type('Time for lunch!');
    
    // Submit form
    cy.contains('Add Reminder').click();
    
    // Wait for API call
    cy.wait('@addReminderRequest');
    
    // Success message should appear
    cy.contains('Reminder added successfully').should('be.visible');
  });
});
