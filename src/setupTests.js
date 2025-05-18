import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Start the mock server before all tests
beforeAll(() => server.listen());

// Reset request handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests finish
afterAll(() => server.close());
