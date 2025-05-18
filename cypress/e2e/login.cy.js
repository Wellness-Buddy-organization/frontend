describe('Login Flow', () => {
  beforeEach(() => {
    // Intercept API calls
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'mock-token',
        user: {
          _id: 'user123',
          fullName: 'Test User',
          email: 'test@example.com'
        }
      }
    }).as('loginRequest');
    
    cy.intercept('GET', '/api/dashboard/me', {
      statusCode: 200,
      body: {
        user: { fullName: 'Test User' },
        wellness: { score: 75 },
        reminders: []
      }
    }).as('dashboardRequest');
  });

  it('should log in successfully and redirect to dashboard', () => {
    cy.visit('/login');
    
    // Fill in login form
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    
    // Submit form
    cy.contains('Sign In').click();
    
    // Wait for API call
    cy.wait('@loginRequest');
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Dashboard should load
    cy.wait('@dashboardRequest');
    
    // Verify dashboard elements are present
    cy.contains('Wellness Score').should('be.visible');
  });

  it('should display error message on login failure', () => {
    // Override the login intercept for this test
    cy.intercept('POST', '/api/users/login', {
      statusCode: 401,
      body: {
        message: 'Invalid email or password'
      }
    }).as('failedLoginRequest');
    
    cy.visit('/login');
    
    // Fill in login form
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    // Submit form
    cy.contains('Sign In').click();
    
    // Wait for API call
    cy.wait('@failedLoginRequest');
    
    // Should stay on login page
    cy.url().should('include', '/login');
    
    // Should display error message
    cy.contains('Invalid email or password').should('be.visible');
  });
});
