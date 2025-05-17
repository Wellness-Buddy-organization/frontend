# Wellness Buddy: A Holistic Wellness Tracking Application

## Overview

Wellness Buddy is a comprehensive wellness tracking application designed to help users maintain a healthy work-life balance. The application follows the MVC (Model-View-Controller) architecture pattern and offers features such as wellness tracking, reminders, mental health support, and work-life balance monitoring.

## Problem Statement

In today's fast-paced digital environment, individuals often struggle to maintain a healthy balance between work demands and personal well-being. This imbalance leads to stress, reduced productivity, and negative health outcomes. Wellness Buddy addresses this problem by providing an integrated platform for tracking wellness metrics, setting reminders for healthy habits, offering mental health support, and promoting work-life balance.

## Target Audience

- Knowledge workers who spend significant time on computers
- Remote and hybrid workers managing their own schedules
- Individuals seeking to improve work-life balance and mental well-being
- People with sedentary jobs looking to incorporate healthy habits

## Core Features

- *Wellness Tracking*: Monitor mood, sleep, hydration, and work hours with visual analytics
- *Smart Reminders*: Set customizable reminders for water intake, breaks, posture checks, and meditation
- *Mental Health Support*: Guided meditation, breathing exercises, reflective journaling, and crisis resources
- *Work-Life Balance Tools*: Time allocation tracking, balance challenges, work hour monitoring, and achievement recognition

## Architecture

The application follows the MVC (Model-View-Controller) architecture pattern:

- *Models*: Data structures that define wellness metrics, reminders, user information (see src/models/)
- *Views*: React components handling user interface and rendering (see src/views/)
- *Controllers*: Logic for handling user actions and data manipulation (see src/controllers/)

## Tech Stack

### Frontend
- *Framework*: React.js (v19.0.0)
- *Routing*: React Router (v7.5.2)
- *Styling*: Tailwind CSS
- *Animations*: Framer Motion
- *Build Tool*: Vite
- *HTTP Client*: Axios

### Backend
- *API*: RESTful API endpoints (hosted on Railway)
- *Authentication*: JWT-based authentication

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   bash
   git clone https://github.com/yourusername/wellness-buddy.git
   cd wellness-buddy
   

2. Install dependencies
   bash
   npm install
   

3. Environment Setup
   - Create a .env file in the root directory and add:
     
     VITE_API_URL=https://localhost:5000
     

4. Start the development server
   bash
   npm run dev
   

5. Build for production
   bash
   npm run build
   

## Project Structure


wellness-buddy/
├── .github/               # GitHub related files (workflows, templates)
├── public/                # Static files
├── src/                   # Source code
│   ├── controllers/       # Application logic
│   │   ├── AuthController.js
│   │   ├── CalendarController.js
│   │   ├── DashboardController.js
│   │   ├── ReminderController.js
│   │   ├── WellnessController.js
│   │   └── index.js
│   ├── models/            # Data models
│   │   ├── CalendarEvent.js
│   │   ├── Reminder.js
│   │   ├── User.js
│   │   ├── WellnessData.js
│   │   ├── WorkLifeBalance.js
│   │   └── index.js
│   ├── services/          # API service layers
│   │   ├── ApiService.js
│   │   ├── AuthService.js
│   │   ├── CalendarService.js
│   │   ├── ReminderService.js
│   │   ├── WellnessService.js
│   │   └── index.js
│   ├── styles/            # CSS and Tailwind styles
│   │   └── index.css
│   ├── views/             # UI components and pages
│   │   ├── auth/          # Authentication views
│   │   ├── components/    # Reusable components
│   │   ├── dashboard/     # Dashboard views
│   │   ├── errors/        # Error pages
│   │   ├── layouts/       # Layout components
│   │   ├── mentalhealth/  # Mental health features
│   │   ├── reminders/     # Reminder management
│   │   ├── settings/      # User settings
│   │   ├── wellness/      # Wellness tracking features
│   │   └── worklife/      # Work-life balance features
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Entry point
├── .env                   # Environment variables
├── .eslintrc.js           # ESLint configuration
├── .gitignore             # Git ignore file
├── LICENSE.md             # MIT License
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration


## Architectural Patterns

### MVC Architecture
The application implements the Model-View-Controller pattern:
- *Models*: Define data structures and business rules
- *Views*: Handle rendering and user interface
- *Controllers*: Manage application logic and data flow

### Additional Patterns
- *Repository Pattern*: For data access abstraction (in service layers)
- *Observer Pattern*: For state management and UI updates
- *Component-Based Architecture*: For building reusable UI elements

## Documentation

- [Blog 01: Your Wellness Buddy; A Must-Have App for Sri Lankan Tech Heroes](https://medium.com/@kodithuwakkumadhumini12/your-wellness-buddy-c2d99080a4ef)
- [Blog 02: Wellness Buddy: Revolutionizing Well-Being for Sri Lanka’s Tech Industry](https://medium.com/@hashansooriyage/wellness-buddy-revolutionizing-well-being-for-sri-lankas-tech-industry-738c03a4c84c)
- [Blog 03: Deep Dive into Software Architecture](https://medium.com/@kodithuwakkumadhumini12/deep-dive-into-software-architecture-38dbf2e52145)
- [Blog 04: Why MVC? Unraveling the Magic Behind Modern Web Development](https://medium.com/@kodithuwakkumadhumini12/why-mvc-58f87a673593)
- [Blog 05: Creating User-Friendly Health and Wellness Apps](https://medium.com/@kodithuwakkumadhumini12/creating-user-friendly-health-and-wellness-apps-080f3c307464)
- [Blog 06: Designing Your Wellness Journey; The Power of UI/UX in Wellness Buddy](https://medium.com/@kodithuwakkumadhumini12/designing-your-wellness-journey-dc2038cdb429)
- [Blog 07: Building a Scalable Node.js Backend for Wellness Buddy Application: Architecture Overview](https://medium.com/@hashansooriyage/building-a-scalable-node-js-backend-for-wellness-buddy-application-architecture-overview-7aea26cec113)
- [Blog 08: The Controller-First Architecture; How We Structured Wellness-Buddy’s Frontend](https://medium.com/@kodithuwakkumadhumini12/the-controller-first-architecture-6e80dde97c5a)
- [Blog 09: Authentication Strategies in Wellness Applications: Implementing JWT and OAuth with Passport.js](https://medium.com/@hashansooriyage/authentication-strategies-in-wellness-applications-implementing-jwt-and-oauth-with-passport-js-a737ef44f037)
- [Blog 10: Building a Responsive Dashboard with React and Framer Motion in Wellness-Buddy](https://medium.com/@kodithuwakkumadhumini12/building-a-responsive-dashboard-with-react-and-framer-motion-in-wellness-buddy-32ffb58e962d)
- [Blog 11: State Management and Data Flow in Wellness-Buddy](https://medium.com/@kodithuwakkumadhumini12/state-management-and-data-flow-in-wellness-buddy-e3cce3fe7389)
- [Blog 12: Designing Effective REST APIs for Health Tracking: Lessons from the Wellness-Buddy Project](https://medium.com/@hashansooriyage/designing-effective-rest-apis-for-health-tracking-lessons-from-the-wellness-buddy-project-68d675c44a59)
- [Blog 13: Reusable UI Component Design for Wellness Apps](https://medium.com/@kodithuwakkumadhumini12/reusable-ui-component-design-for-wellness-apps-d0879235739b)
- [API Documentation](./docs/api.md)
- [Architecture Diagrams](./docs/architecture.md)
- [Development Guidelines](./docs/development.md)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contributors

- [Hashan Sooriyage](https://github.com/hashan1998-it)
- [Madhumini Kodithuwakku](https://github.com/Madhumini98)