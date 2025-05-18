// Custom commands for Cypress

Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.contains('Sign In').click();
});

Cypress.Commands.add('mockApiCalls', () => {
  cy.intercept('GET', '/api/dashboard/me', {
    statusCode: 200,
    body: {
      user: { fullName: 'Test User' },
      wellness: { score: 75 },
      reminders: []
    }
  }).as('dashboardRequest');
  
  cy.intercept('GET', '/api/reminder', {
    statusCode: 200,
    body: []
  }).as('getRemindersRequest');
});
