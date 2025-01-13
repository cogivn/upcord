# Product Requirements Document (PRD): Discord Personal Status Management with Telegram Notifications

## Project Overview

This project aims to develop a system that manages a Discord account's status to remain "online" during configurable working hours while handling the issue of missed notifications by forwarding them to Telegram. The solution will include an admin panel built with Next.js for configuration and management.

## Goals and Objectives

- Always Online Status: Ensure the Discord account is online during defined working hours and offline outside these hours.
- Notification Forwarding: Forward missed notifications from Discord to Telegram during online status.
- Flexible Scheduling: Provide a scheduling system to define working hours per day, including weekends and holidays.
- Admin Configuration: Enable users to configure Discord and Telegram tokens, notification settings, and working hours via an admin panel.
- System Health Check Commands: Allow users to interact with the Telegram bot to check the system's operational status.
- OAuth2 Integration: Use OAuth2 for authenticating Discord accounts and obtaining API tokens securely.

## Key Features

### 1. Discord Status Management

- Keep the Discord account status as "online" during specified working hours.
- Automatically switch status to "offline" outside working hours by disconnecting from the Discord server.

### 2. Notification Forwarding

Monitor Discord notifications while the account is online.

Selective Forwarding:
- Forward notifications to Telegram only when the user is mentioned or tagged in a group or direct message.
- Forward private messages (DMs) to the user with specific rules:
  - Notify the user only on the first message of a new DM conversation.
  - Ignore messages while the user is actively engaged in the conversation.
  - Notify again if the conversation is inactive for 5 minutes and a new message is received.
- Ignore other types of messages not directly related to the user.
- Provide a fallback option to directly notify the Discord app if forwarding fails.

[Previous sections remain the same until "Admin Panel" under "Key Features"]

### 3. Admin Panel

Technology Stack: 
- Next.js (App Router) for the frontend, integrated with REST or GraphQL APIs for backend services
- shadcn/ui component library for consistent, accessible UI components
- Tailwind CSS for styling

Configuration Options:
- Discord Bot/API token
- Telegram Bot token and target chat/channel ID
- Notification preferences (e.g., types of notifications to forward)
- Working hour schedules with support for daily customization
- User Management: Allow account authentication and configuration management per user

UI Components (using shadcn/ui):
- Form components for configuration settings
  - Input fields for API tokens
  - Time pickers for schedule management
  - Toggle switches for notification preferences
  - Select dropdowns for various options
- Alert dialogs for important actions and confirmations
- Toast notifications for system updates and changes
- Cards for organizing different sections of the admin panel
- Tables for displaying logs and notification history
- Navigation menu for different sections
- Tabs for organizing related content
- Command palette for quick actions
- Calendar for schedule management
- Loading spinners and progress indicators

[Previous sections continue unchanged until "Technical Requirements"]

## Technical Requirements

- Languages: TypeScript, JavaScript
- Frameworks/Libraries: 
  - Next.js
  - Node.js
  - Discord.js
  - Telegram Bot API
  - shadcn/ui for component library
  - Tailwind CSS for styling
  - Radix UI (via shadcn/ui) for accessible primitives
- Database: SQLite for lightweight storage needs
- Hosting: Vercel for the frontend, AWS/GCP/Azure for the backend
- Authentication: OAuth2 (Discord), JWT for app sessions
- APIs: Discord API, Telegram Bot API
- Deployment: Docker for containerization

## Development Setup

### Frontend Setup
1. Install Next.js and configure the App Router
2. Set up Tailwind CSS
3. Install and configure shadcn/ui:
   ```bash
   npx shadcn-ui@latest init
   ```
4. Install required shadcn/ui components:
   ```bash
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add input
   npx shadcn-ui@latest add form
   npx shadcn-ui@latest add select
   npx shadcn-ui@latest add alert
   npx shadcn-ui@latest add alert-dialog
   npx shadcn-ui@latest add toast
   npx shadcn-ui@latest add card
   npx shadcn-ui@latest add table
   npx shadcn-ui@latest add navigation-menu
   npx shadcn-ui@latest add tabs
   npx shadcn-ui@latest add command
   npx shadcn-ui@latest add calendar
   ```

[Rest of the document remains the same]

### 4. Customizable Schedules

- Enable users to define working hours for each day of the week
- Support different schedules for weekends and weekdays
- Allow temporary overrides for holidays or special occasions

### 5. OAuth2 Integration

Implement OAuth2 flow for Discord authentication:
- Users log in to the admin panel using the app's internal authentication system
- Users click "Connect Discord Account" to initiate the OAuth2 flow
- Redirect to Discord's OAuth2 authorization page to obtain user consent for necessary scopes (e.g., identify, messages.read, presence.update)
- Exchange the authorization code for an access token and refresh token
- Securely store tokens for use in managing status and notifications
- Refresh tokens automatically when the access token expires

### 6. Logging and Monitoring

- Track notification forwarding activity and errors
- Provide logs for debugging and system health monitoring

### 7. System Health Check Commands

Define Telegram bot commands to monitor the system's status:
- `/status` - Check if the system is running
- `/uptime` - Display the system's uptime
- `/logs` - Retrieve the latest activity logs
- `/restart` - Request a system restart (admin-only)

### 8. Docker Deployment

- Provide a Docker configuration for simplified deployment and scalability
- Dockerfile for the backend and frontend services
- Docker Compose file to manage multi-container deployment, including the database (SQLite) and any additional services
- Instructions for building and running the application in a Dockerized environment

## System Architecture

### 1. Frontend (Admin Panel)

- Built with Next.js (App Router)
- Responsive design for desktop and mobile
- Authentication using OAuth2 or JWT

### 2. Backend

- Server: Node.js with Express or Fastify
- Database: SQLite for storing user configurations and logs
- APIs:
  - Discord API for managing status and receiving notifications
  - Telegram Bot API for sending notifications

### 3. Discord Integration

- Use Discord WebSocket or REST APIs to manage status and receive events
- Implement a bot or script that ensures the account remains online

### 4. Telegram Integration

- Use Telegram Bot API to send notifications to users
- Optionally implement bidirectional communication for user feedback

### 5. Docker Configuration

Multi-stage Dockerfile for efficient builds.

Docker Compose setup for linking services:
- Frontend (Next.js)
- Backend (Node.js server)
- SQLite database
- Optional Nginx reverse proxy for handling HTTPS and routing
- Environment variable management using .env files for API tokens and configurations

## Source Code Structure

```
project-root/
├── apps/
│   ├── admin/                  # Next.js (App Router) application for admin panel
│   │   ├── app/                # Next.js app router directory
│   │   │   ├── page.tsx        # Home page for admin
│   │   │   ├── api/            # API routes (if applicable)
│   │   │   └── ...             # Additional routes and components
│   │   ├── components/         # Reusable UI components
│   │   ├── styles/             # CSS/SCSS for styling
│   │   ├── public/             # Static assets
│   │   └── package.json        # Dependencies for the admin app
│
├── services/
│   ├── discord/                # Discord integration services
│   │   ├── bot.js              # Bot logic for managing status and events
│   │   └── api.js              # API wrapper for Discord
│   ├── telegram/               # Telegram integration services
│   │   ├── bot.js              # Telegram bot logic
│   │   └── api.js              # API wrapper for Telegram
│   └── scheduler/              # Scheduler service for managing working hours
│       └── scheduler.js        # Logic for scheduling online/offline status
│
├── db/                         # SQLite database and migrations
│   ├── migrations/             # Database migration files
│   └── db.sqlite               # SQLite database file
│
├── docker/                     # Docker configuration
│   ├── Dockerfile              # Multi-stage Dockerfile
│   ├── docker-compose.yml      # Docker Compose file
│   └── .env                    # Environment variables
│
├── tests/                      # Automated tests
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
│
└── package.json                # Root dependencies and scripts
```

## Workflow

### User Setup

1. User logs in to the admin panel using the app's authentication system
2. Configures Discord and Telegram API tokens
3. Sets working hour schedules

### OAuth2 Authorization

1. User clicks "Connect Discord Account" in the admin panel
2. Redirects to Discord's OAuth2 authorization page to log in and grant permissions
3. Backend exchanges the authorization code for access and refresh tokens
4. Tokens are securely stored for API interactions

### Discord Status Management

1. The system maintains "online" status during working hours
2. Disconnects from the Discord server during offline periods

### Notification Handling

1. During online status, the system monitors Discord events
2. Selectively forwards notifications based on mentions, tags, or private messages to Telegram
3. For private messages (DMs):
   - Notify on the first message of a new conversation
   - Ignore messages during active conversations
   - Notify again if the conversation is inactive for 5 minutes and a new message is received
4. Ignores irrelevant messages to reduce noise

### Admin Panel Usage

- Users view logs, update settings, and manage schedules via the admin panel

### System Health Check Commands

- `/status` - Check if the system is running
- `/uptime` - Display the system's uptime
- `/logs` - Retrieve the latest activity logs
- `/restart` - Request a system restart (admin-only)

## Technical Requirements

- Languages: TypeScript, JavaScript
- Frameworks/Libraries: Next.js, Node.js, Discord.js, Telegram Bot API
- Database: SQLite for lightweight storage needs
- Hosting: Vercel for the frontend, AWS/GCP/Azure for the backend
- Authentication: OAuth2 (Discord), JWT for app sessions
- APIs: Discord API, Telegram Bot API
- Deployment: Docker for containerization

## Constraints and Considerations

- Rate Limits: Adhere to Discord and Telegram API rate limits to avoid bans
- Security: Secure API tokens and sensitive data using encryption
- Scalability: Ensure the system can handle multiple users concurrently
- Reliability: Implement retries and error handling for API calls
- Docker Compatibility: Ensure the application runs smoothly in a containerized environment

## Success Metrics

- Discord account remains online during configured hours
- Notifications are forwarded to Telegram without delays
- Admin panel provides an intuitive and reliable user experience
- High uptime and minimal errors in production
- Docker deployment is seamless and reliable

## Timeline

### Phase 1: Research and Planning (2 weeks)
- Gather requirements and finalize architecture
- Test Discord and Telegram APIs

### Phase 2: Core Development (6 weeks)
- Develop backend services for Discord and Telegram integration
- Build admin panel with Next.js
- Implement Docker configuration

### Phase 3: Testing and Optimization (2 weeks)
- Conduct unit and integration testing
- Optimize API interactions and address edge cases
- Test Docker deployment

### Phase 4: Deployment and Feedback (2 weeks)
- Deploy the system
- Collect user feedback and implement refinements

## Future Enhancements

- Support for additional platforms (e.g., Slack, Microsoft Teams)
- Advanced notification filtering based on keywords or priority
- Analytics dashboard for user activity and notifications
- Mobile app for direct configuration and notifications