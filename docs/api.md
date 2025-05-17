# API Documentation

This document provides detailed information about the Wellness Buddy API endpoints, request/response formats, and authentication requirements.

## Base URL

```
https://backend-production-e89cc.up.railway.app/api
```

## Authentication

Most API endpoints require authentication. The API uses JWT (JSON Web Token) for authentication.

### Authentication Headers

Include the JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

### Authentication Endpoints

#### Login

```
POST /users/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user123",
    "fullName": "John Doe",
    "email": "user@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "lastLogin": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Signup

```
POST /users/signup
```

Request body:
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user123",
    "fullName": "John Doe",
    "email": "user@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "lastLogin": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Google OAuth

```
GET /auth/google
```

Optional query parameters:
```
?signup=true
```

This endpoint redirects to Google OAuth flow.

## Dashboard

### Get Dashboard Data

```
GET /dashboard/me
```

Response:
```json
{
  "user": {
    "_id": "user123",
    "fullName": "John Doe",
    "email": "user@example.com"
  },
  "wellness": {
    "mood": [
      { "mood": "happy", "date": "2023-01-01T00:00:00.000Z", "notes": "Stress: 2" }
    ],
    "sleep": [
      { "hours": 7, "quality": "good", "date": "2023-01-01T00:00:00.000Z" }
    ],
    "hydration": [
      { "glasses": 8, "date": "2023-01-01T00:00:00.000Z" }
    ],
    "work": [
      { "hours": 8, "date": "2023-01-01T00:00:00.000Z" }
    ],
    "breaks": [
      { "duration": 10, "type": "short", "date": "2023-01-01T00:00:00.000Z" }
    ],
    "score": 75
  },
  "workLifeBalance": {
    "timeAllocation": [
      { "category": "work", "hours": 40, "target": 40 },
      { "category": "family", "hours": 25, "target": 35 },
      { "category": "personal", "hours": 15, "target": 20 },
      { "category": "learning", "hours": 5, "target": 7 },
      { "category": "social", "hours": 10, "target": 12 },
      { "category": "rest", "hours": 73, "target": 56 }
    ],
    "challenges": [],
    "achievements": []
  },
  "reminders": [
    {
      "_id": "reminder123",
      "type": "water",
      "time": "09:00",
      "days": ["mon", "tue", "wed", "thu", "fri"],
      "enabled": true,
      "message": "Time to drink water!",
      "sound": "drop"
    }
  ]
}
```

## Wellness Tracking

### Mood

#### Save Mood

```
POST /mood
```

Request body:
```json
{
  "mood": "happy",
  "notes": "Stress: 2"
}
```

Response:
```json
{
  "_id": "mood123",
  "mood": "happy",
  "notes": "Stress: 2",
  "date": "2023-01-01T00:00:00.000Z",
  "userId": "user123"
}
```

### Sleep

#### Save Sleep

```
POST /sleep
```

Request body:
```json
{
  "hours": 7,
  "quality": "good"
}
```

Response:
```json
{
  "_id": "sleep123",
  "hours": 7,
  "quality": "good",
  "date": "2023-01-01T00:00:00.000Z",
  "userId": "user123"
}
```

### Work

#### Save Work

```
POST /work
```

Request body:
```json
{
  "hours": 8
}
```

Response:
```json
{
  "_id": "work123",
  "hours": 8,
  "date": "2023-01-01T00:00:00.000Z",
  "userId": "user123"
}
```

### Breaks

#### Log Break

```
POST /break
```

Request body:
```json
{
  "duration": 5,
  "type": "short"
}
```

Response:
```json
{
  "_id": "break123",
  "duration": 5,
  "type": "short",
  "date": "2023-01-01T00:00:00.000Z",
  "userId": "user123"
}
```

### Hydration

#### Save Hydration

```
POST /hydration
```

Request body:
```json
{
  "glasses": 8
}
```

Response:
```json
{
  "_id": "hydration123",
  "glasses": 8,
  "date": "2023-01-01T00:00:00.000Z",
  "userId": "user123"
}
```

### Work-Life Balance

#### Save Work-Life Balance

```
POST /work-life-balance
```

Request body:
```json
{
  "timeAllocation": [
    { "category": "work", "hours": 40, "target": 40 },
    { "category": "family", "hours": 25, "target": 35 },
    { "category": "personal", "hours": 15, "target": 20 },
    { "category": "learning", "hours": 5, "target": 7 },
    { "category": "social", "hours": 10, "target": 12 },
    { "category": "rest", "hours": 73, "target": 56 }
  ]
}
```

Response:
```json
{
  "_id": "balance123",
  "timeAllocation": [
    { "category": "work", "hours": 40, "target": 40 },
    { "category": "family", "hours": 25, "target": 35 },
    { "category": "personal", "hours": 15, "target": 20 },
    { "category": "learning", "hours": 5, "target": 7 },
    { "category": "social", "hours": 10, "target": 12 },
    { "category": "rest", "hours": 73, "target": 56 }
  ],
  "date": "2023-01-01T00:00:00.000Z",
  "userId": "user123"
}
```

## Reminders

### Get All Reminders

```
GET /reminder
```

Response:
```json
[
  {
    "_id": "reminder123",
    "type": "water",
    "time": "09:00",
    "days": ["mon", "tue", "wed", "thu", "fri"],
    "enabled": true,
    "message": "Time to drink water!",
    "sound": "drop",
    "userId": "user123"
  }
]
```

### Get Upcoming Reminders

```
GET /reminder?upcoming=true&limit=5
```

Response:
```json
[
  {
    "_id": "reminder123",
    "type": "water",
    "time": "09:00",
    "days": ["mon", "tue", "wed", "thu", "fri"],
    "enabled": true,
    "message": "Time to drink water!",
    "sound": "drop",
    "userId": "user123",
    "nextOccurrence": "2023-01-01T09:00:00.000Z"
  }
]
```

### Add Reminder

```
POST /reminder
```

Request body:
```json
{
  "type": "water",
  "time": "09:00",
  "days": ["mon", "tue", "wed", "thu", "fri"],
  "enabled": true,
  "message": "Time to drink water!",
  "sound": "drop"
}
```

Response:
```json
{
  "_id": "reminder123",
  "type": "water",
  "time": "09:00",
  "days": ["mon", "tue", "wed", "thu", "fri"],
  "enabled": true,
  "message": "Time to drink water!",
  "sound": "drop",
  "userId": "user123"
}
```

### Update Reminder

```
PUT /reminder/:id
```

Request body:
```json
{
  "type": "water",
  "time": "10:00",
  "days": ["mon", "tue", "wed", "thu", "fri"],
  "enabled": true,
  "message": "Stay hydrated!",
  "sound": "drop"
}
```

Response:
```json
{
  "_id": "reminder123",
  "type": "water",
  "time": "10:00",
  "days": ["mon", "tue", "wed", "thu", "fri"],
  "enabled": true,
  "message": "Stay hydrated!",
  "sound": "drop",
  "userId": "user123"
}
```

### Delete Reminder

```
DELETE /reminder/:id
```

Response:
```json
{
  "message": "Reminder deleted successfully"
}
```

## Calendar

### Get Events

```
GET /calendar?startDate=2023-01-01T00:00:00.000Z&endDate=2023-01-07T23:59:59.999Z
```

Response:
```json
[
  {
    "_id": "event123",
    "title": "Team Meeting",
    "startDate": "2023-01-01T10:30:00.000Z",
    "endDate": "2023-01-01T11:30:00.000Z",
    "category": "work",
    "description": "Weekly team sync",
    "userId": "user123"
  }
]
```

### Create Event

```
POST /calendar
```

Request body:
```json
{
  "title": "Team Meeting",
  "startDate": "2023-01-01T10:30:00.000Z",
  "endDate": "2023-01-01T11:30:00.000Z",
  "category": "work",
  "description": "Weekly team sync"
}
```

Response:
```json
{
  "_id": "event123",
  "title": "Team Meeting",
  "startDate": "2023-01-01T10:30:00.000Z",
  "endDate": "2023-01-01T11:30:00.000Z",
  "category": "work",
  "description": "Weekly team sync",
  "userId": "user123"
}
```

### Update Event

```
PUT /calendar/:id
```

Request body:
```json
{
  "title": "Team Meeting",
  "startDate": "2023-01-01T11:00:00.000Z",
  "endDate": "2023-01-01T12:00:00.000Z",
  "category": "work",
  "description": "Weekly team sync"
}
```

Response:
```json
{
  "_id": "event123",
  "title": "Team Meeting",
  "startDate": "2023-01-01T11:00:00.000Z",
  "endDate": "2023-01-01T12:00:00.000Z",
  "category": "work",
  "description": "Weekly team sync",
  "userId": "user123"
}
```

### Delete Event

```
DELETE /calendar/:id
```

Response:
```json
{
  "message": "Event deleted successfully"
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "message": "Error message description",
  "errors": [
    {
      "param": "email",
      "msg": "Invalid email format"
    }
  ]
}
```

### Common Error Codes

- `400` - Bad Request (Invalid parameters or validation errors)
- `401` - Unauthorized (Missing or invalid authentication)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource not found)
- `419` - Authentication Timeout (Token expired)
- `440` - Session Timeout
- `500` - Internal Server Error

## Rate Limiting

API requests are subject to rate limiting to ensure system stability. Current limits are:

- 100 requests per minute per user
- 1000 requests per hour per user

Exceeding these limits will result in a `429 Too Many Requests` response.

## API Versioning

The current API version is v1. All endpoints are prefixed with `/api` but do not require an explicit version in the path.

Future API versions will be accessed via `/api/v2/`, etc.