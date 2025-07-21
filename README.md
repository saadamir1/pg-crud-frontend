# NestJS CRUD Frontend

A React frontend application for the NestJS PostgreSQL CRUD API.

## Features

- JWT Authentication with access and refresh tokens
- Role-based access control (Admin/User)
- Cities management (CRUD operations)
- User management (Admin only)
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NestJS backend running on http://localhost:3000

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pg-crud-frontend.git
cd pg-crud-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000.

## Usage

### Authentication

- Login with your credentials
- The app will automatically handle token refresh

### Cities Management

- View all cities with pagination
- Create new cities
- Edit existing cities
- Delete cities (soft delete)

### User Management (Admin only)

- View all users
- Create new users with different roles

## API Integration

This frontend is designed to work with the NestJS PostgreSQL CRUD API. Make sure the backend is running at http://localhost:3000.

## Folder Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React context for state management
├── pages/            # Page components
├── services/         # API services
├── App.js            # Main application component
└── index.js          # Entry point
```

## Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App