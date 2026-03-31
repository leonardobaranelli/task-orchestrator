# AI Task Orchestrator

Enterprise-grade AI-powered task management system built with NestJS.

A production-ready backend featuring clean architecture, performant caching strategies, and an extensible AI integration layer.

## Highlights

- JWT authentication with access and refresh tokens
- Redis-backed caching strategy for high-read workloads
- Modular architecture following SOLID and Clean Architecture principles
- Global exception handling and consistent API response transformation
- Extensible AI service layer designed for seamless LLM integration (OpenAI, Grok, Claude, etc.)
- Fully containerized development environment with PostgreSQL and Redis
- OpenAPI documentation with Swagger

## Tech Stack

- **Framework**: NestJS + TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Security**: JWT + bcrypt
- **Validation**: class-validator + DTOs
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Modular, Clean Architecture, Repository pattern

## Project Structure

```bash
src/
├── common/
│   ├── filters/           # Global exception handling
│   ├── interceptors/      # Response transformation
│   └── redis/             # Redis service & caching logic
├── auth/
│   ├── dto/
│   ├── strategies/
│   └── guards/
├── tasks/
│   ├── dto/
│   └── ai.service.ts      # AI categorization layer
├── prisma/
├── app.module.ts
└── main.ts
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start infrastructure services
docker compose up -d

# 3. Configure environment variables
cp .env.example .env

# 4. Database setup
npx prisma generate
npx prisma migrate dev --name init

# 5. Start development server
npm run start:dev
```

The application will be available at `http://localhost:3000` with interactive Swagger documentation at `/api`.

## Development Commands

```bash
npm run docker:up          # Start PostgreSQL and Redis
npm run prisma:studio      # Open Prisma Studio
npx prisma migrate dev     # Run migrations
npm run db:test:setup      # Setup test database
npm run build              # Production build
```

## Architecture & Design Decisions

- **Layered Architecture** with strict dependency rule and inversion of control
- **Caching Strategy** using Redis as primary source for frequent read operations with automatic cache invalidation on writes
- **Cross-cutting Concerns** implemented via global Exception Filter and Response Interceptor
- **AI Abstraction Layer** built as a replaceable service, ready for production LLM providers
- **Type-safe** and fully validated request/response flow
- Strong emphasis on testability, maintainability and scalability

## Testing

Comprehensive test suite following best practices:

### Unit Tests
- `npm run test:unit` - Run unit tests
- `npm run test:cov` - Generate coverage report

**Covered:**
- `AuthService` (registration, login, error cases)
- `AiService` (categorization logic with multiple scenarios)
- `TasksService` (business logic and caching behavior)

### End-to-End Tests
- `npm run test:e2e` - Run e2e tests (uses dedicated test database)

**Covered:**
- Authentication flow
- Protected endpoints with JWT
- AI service integration

### Test Stack
- **Jest** + **Supertest**
- Dedicated test database
- Mocked external services

---

Focus on clean architecture, testability and maintainability.

