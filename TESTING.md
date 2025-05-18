# Testing Strategy for Wellness Buddy

This document outlines the testing strategy for the Wellness Buddy application.

## Types of Tests

### Unit Tests
- **Purpose**: Test individual components, models, and controllers in isolation
- **Tools**: Jest, React Testing Library
- **Location**: `src/**/__tests__/*.test.js`
- **Run Command**: `npm test`

### Integration Tests
- **Purpose**: Test interactions between multiple components
- **Tools**: Jest, React Testing Library, MSW (for API mocking)
- **Location**: `src/**/__tests__/*.test.js`
- **Run Command**: `npm test`

### End-to-End Tests
- **Purpose**: Test complete user flows
- **Tools**: Cypress
- **Location**: `cypress/e2e/*.cy.js`
- **Run Command**: `npm run cypress:open` or `npm run cypress:run`

## Test Coverage

We aim for at least 70% code coverage across the application. Check coverage reports with:

```bash
npm run test:coverage
```

## Mock Implementation

- **Models**: Tested directly with sample data
- **Services**: Mocked in controller tests
- **API Calls**: Mocked using Mock Service Worker (MSW)
- **Controllers**: Mocked in component tests

## Running Tests

### Development
```bash
# Run all tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Open Cypress for E2E tests
npm run cypress:open
```

### CI/CD
```bash
# Run all tests once (for CI)
npm run test:ci

# Run Cypress tests headlessly
npm run cypress:run
```

## Continuous Integration

Tests are automatically run on every push and pull request to the `main` and `develop` branches. The workflow is defined in `.github/workflows/tests.yml`.

## Testing Best Practices

1. **Test Function, Not Implementation**: Focus on testing what the code does, not how it does it
2. **One Assert Per Test**: Each test should verify one specific behavior
3. **Arrange-Act-Assert**: Structure tests with setup, action, and verification
4. **Use Descriptive Test Names**: Names should describe the expected behavior
5. **Keep Tests Independent**: Tests should not depend on other tests
6. **Test Edge Cases**: Include tests for boundary conditions and error handling

## Adding New Tests

When adding new features, follow these steps:

1. Write unit tests for models and controllers
2. Write tests for React components
3. Add integration tests for complex interactions
4. Add end-to-end tests for critical user flows

## Mock API Handlers

API responses are mocked using MSW (Mock Service Worker). Handlers are defined in `src/mocks/handlers.js`.

To add new mock handlers:

1. Add handler to `src/mocks/handlers.js`
2. Handler will automatically be used in tests
3. For Cypress tests, use `cy.intercept()` for specific test cases

## Custom Cypress Commands

Custom Cypress commands are defined in `cypress/support/commands.js`:

- `cy.login()` - Log in with test credentials
- `cy.mockApiCalls()` - Set up common API mocks

## Debugging Tests

### Jest Tests
- Use `console.log()` in tests to debug
- Run with `--verbose` flag for detailed output
- Use `screen.debug()` to see rendered component

### Cypress Tests
- Use `cy.debug()` to pause execution
- Open Cypress Test Runner for interactive debugging
- Check Network tab for API calls

## File Structure

```
src/
├── models/
│   └── __tests__/           # Model unit tests
├── controllers/
│   └── __tests__/           # Controller unit tests
├── views/
│   └── components/
│       └── __tests__/       # Component tests
├── mocks/                   # MSW mock handlers
└── setupTests.js           # Jest setup file

cypress/
├── e2e/                    # End-to-end tests
└── support/                # Cypress configuration and commands
```
