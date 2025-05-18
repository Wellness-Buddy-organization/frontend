import { rest } from 'msw';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-production-e89cc.up.railway.app/api';

export const handlers = [
  // User authentication
  rest.post(`${API_URL}/users/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-token-123',
        user: {
          _id: 'user123',
          fullName: 'Test User',
          email: 'test@example.com',
          createdAt: '2023-01-01T00:00:00.000Z',
          lastLogin: '2023-01-01T00:00:00.000Z'
        }
      })
    );
  }),
  
  rest.post(`${API_URL}/users/signup`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-token-123',
        user: {
          _id: 'user123',
          fullName: 'Test User',
          email: 'test@example.com',
          createdAt: '2023-01-01T00:00:00.000Z',
          lastLogin: '2023-01-01T00:00:00.000Z'
        }
      })
    );
  }),
  
  // Dashboard data
  rest.get(`${API_URL}/dashboard/me`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          _id: 'user123',
          fullName: 'Test User',
          email: 'test@example.com'
        },
        wellness: {
          mood: [
            { mood: 'happy', date: '2023-01-01T00:00:00.000Z', notes: 'Stress: 2' }
          ],
          sleep: [
            { hours: 7, quality: 'good', date: '2023-01-01T00:00:00.000Z' }
          ],
          hydration: [
            { glasses: 8, date: '2023-01-01T00:00:00.000Z' }
          ],
          work: [
            { hours: 8, date: '2023-01-01T00:00:00.000Z' }
          ],
          breaks: [
            { duration: 10, type: 'short', date: '2023-01-01T00:00:00.000Z' }
          ],
          score: 75
        },
        workLifeBalance: {
          timeAllocation: [
            { category: 'work', hours: 40, target: 40 },
            { category: 'family', hours: 25, target: 35 },
            { category: 'personal', hours: 15, target: 20 },
            { category: 'learning', hours: 5, target: 7 },
            { category: 'social', hours: 10, target: 12 },
            { category: 'rest', hours: 73, target: 56 }
          ],
          challenges: [],
          achievements: []
        },
        reminders: [
          {
            _id: 'reminder123',
            type: 'water',
            time: '09:00',
            days: ['mon', 'tue', 'wed', 'thu', 'fri'],
            enabled: true,
            message: 'Time to drink water!',
            sound: 'drop'
          }
        ]
      })
    );
  }),
  
  // Reminders
  rest.get(`${API_URL}/reminder`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          _id: 'reminder123',
          type: 'water',
          time: '09:00',
          days: ['mon', 'tue', 'wed', 'thu', 'fri'],
          enabled: true,
          message: 'Time to drink water!',
          sound: 'drop',
          userId: 'user123'
        }
      ])
    );
  }),
  
  rest.post(`${API_URL}/reminder`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _id: 'new-reminder-id',
        type: 'water',
        time: '09:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        enabled: true,
        message: 'Time to drink water!',
        sound: 'drop',
        userId: 'user123'
      })
    );
  }),
  
  rest.put(`${API_URL}/reminder/:id`, (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        _id: id,
        type: 'water',
        time: '09:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        enabled: true,
        message: 'Updated reminder message',
        sound: 'drop',
        userId: 'user123'
      })
    );
  }),
  
  rest.delete(`${API_URL}/reminder/:id`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Reminder deleted successfully' })
    );
  }),
  
  // Wellness tracking
  rest.post(`${API_URL}/mood`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _id: 'mood-id',
        mood: 'happy',
        notes: 'Stress: 2',
        date: '2023-01-01T00:00:00.000Z',
        userId: 'user123'
      })
    );
  }),
  
  rest.post(`${API_URL}/sleep`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _id: 'sleep-id',
        hours: 7,
        quality: 'good',
        date: '2023-01-01T00:00:00.000Z',
        userId: 'user123'
      })
    );
  }),
  
  rest.post(`${API_URL}/work`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _id: 'work-id',
        hours: 8,
        date: '2023-01-01T00:00:00.000Z',
        userId: 'user123'
      })
    );
  }),
  
  rest.post(`${API_URL}/break`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _id: 'break-id',
        duration: 10,
        type: 'short',
        date: '2023-01-01T00:00:00.000Z',
        userId: 'user123'
      })
    );
  }),
  
  rest.post(`${API_URL}/hydration`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _id: 'hydration-id',
        glasses: 8,
        date: '2023-01-01T00:00:00.000Z',
        userId: 'user123'
      })
    );
  }),
];
