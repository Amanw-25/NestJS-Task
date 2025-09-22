# Nest.js Backend Project

A complete backend application built with Nest.js, featuring user authentication, CRUD operations, and comprehensive testing.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with protected routes
- 👤 **User Management**: Complete CRUD operations for user entities
- 🛡️ **Security**: Password hashing with bcrypt, input validation
- 🏗️ **Architecture**: Modular design with proper separation of concerns
- 🧪 **Testing**: Comprehensive unit tests with Jest
- 📊 **Database**: PostgreSQL integration with TypeORM
- ⚡ **Validation**: Request validation using class-validator
- 🌍 **Environment**: Configuration management with environment variables

## Tech Stack

- **Framework**: Nest.js (TypeScript)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **Testing**: Jest
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nestjs-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database configuration:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASS=postgres
   DB_NAME=testdb
   JWT_SECRET=supersecretkey
   JWT_EXPIRES_IN=3600s
   PORT=3000
   ```

4. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE testdb;
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

The application will be running at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/signup` - Create a new user account
- `POST /auth/login` - Login with email and password

### Users (Protected Routes)

- `GET /users` - Get all users (requires authentication)
- `GET /users/:id` - Get user by ID (requires authentication)
- `PUT /users/:id` - Update user (requires authentication)
- `DELETE /users/:id` - Delete user (requires authentication)

### Example Requests

#### Signup
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get Users (with JWT token)
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
src/
├── app.module.ts          # Main application module
├── main.ts               # Application entry point
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt-auth.guard.ts
│   └── jwt.strategy.ts
└── users/                # Users module
    ├── dto/              # Data Transfer Objects
    │   ├── create-user.dto.ts
    │   ├── update-user.dto.ts
    │   └── login-user.dto.ts
    ├── entities/         # Database entities
    │   └── user.entity.ts
    ├── users.controller.ts
    ├── users.service.ts
    └── users.module.ts
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## Database Schema

### Users Table

| Field     | Type      | Description                    |
|-----------|-----------|--------------------------------|
| id        | number    | Primary key (auto-generated)  |
| name      | string    | User's full name               |
| email     | string    | User's email (unique)          |
| password  | string    | Hashed password                |
| createdAt | timestamp | Record creation time           |
| updatedAt | timestamp | Record last update time        |

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated using class-validator decorators
- **Protected Routes**: Sensitive endpoints require valid JWT tokens
- **Email Uniqueness**: Prevents duplicate user registrations

## Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: Invalid input data returns 400 Bad Request
- **Authentication Errors**: Invalid credentials return 401 Unauthorized
- **Not Found Errors**: Missing resources return 404 Not Found
- **Conflict Errors**: Duplicate email registration returns 409 Conflict

## Development

```bash
# Start in development mode with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Lint code
npm run lint

# Format code
npm run format
```

## Environment Variables

| Variable       | Description                    | Default Value    |
|----------------|--------------------------------|------------------|
| DB_HOST        | Database host                  | localhost        |
| DB_PORT        | Database port                  | 5432             |
| DB_USER        | Database username              | postgres         |
| DB_PASS        | Database password              | postgres         |
| DB_NAME        | Database name                  | testdb           |
| JWT_SECRET     | JWT signing secret             | supersecretkey   |
| JWT_EXPIRES_IN | JWT token expiration time      | 3600s            |
| PORT           | Application port               | 3000             |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.