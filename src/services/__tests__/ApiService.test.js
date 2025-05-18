import ApiService from '../ApiService';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

describe('ApiService', () => {
  test('creates axios instance with correct configuration', () => {
    const axios = require('axios');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
});
