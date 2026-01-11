# Copilot Instructions for enqntra-backend

## Project Overview
- This is a NestJS (TypeScript) backend for managing appointments, businesses, users, and services.
- Core modules: `appointments`, `businesses`, `users`, `services`, and `auth` (see `src/`).
- Data access is via Prisma ORM (`prisma/schema.prisma`, generated client in `prisma/generated/`).
- Business logic is organized into service classes (e.g., `appointments.service.ts`), with controllers handling HTTP requests.

## Architecture & Patterns
- Follows NestJS conventions: modules, controllers, services, DTOs, and guards.
- DTOs are in `dto/` folders within each module; use them for request validation and typing.
- Guards and decorators in `common/` and `auth/guards/` enforce authentication, authorization, and ownership.
- Cross-module communication is via dependency injection (NestJS providers).
- Prisma models map directly to business entities; see `prisma/models/` for generated types.

## Developer Workflows
- **Install dependencies:** `npm install`
- **Run development server:** `npm run start:dev`
- **Build for production:** `npm run start:prod`
- **Run unit tests:** `npm run test`
- **Run e2e tests:** `npm run test:e2e`
- **Check test coverage:** `npm run test:cov`
- **Prisma migrations:**
  - Edit `prisma/schema.prisma` and run `npx prisma migrate dev --name <desc>`
  - Generated client is in `prisma/generated/`

## Conventions & Patterns
- Use DTOs for all controller inputs/outputs; validate with class-validator decorators.
- Service classes encapsulate business logic; controllers should be thin.
- Use guards and decorators for access control (see `common/guards/`, `auth/guards/`).
- Organize new features as NestJS modules with their own controller, service, and DTOs.
- Prefer dependency injection for cross-service calls.
- Use Prisma client for all DB access; avoid raw SQL unless necessary.

## Integration Points
- External authentication via JWT (see `auth/strategies/`).
- Prisma ORM for database access; models/types in `prisma/models/` and `prisma/generated/`.
- No custom build/test scripts; use standard npm commands.

## Key Files & Directories
- `src/` — main application code
- `prisma/schema.prisma` — database schema
- `prisma/generated/` — Prisma client/types
- `src/common/` — shared decorators, guards, types
- `src/auth/` — authentication logic

## Example Patterns
- To add a new entity: create a module, controller, service, DTOs, and update `schema.prisma`.
- For access control: use `@Roles()` and `RolesGuard` for role-based permissions.
- For current user: use `@CurrentUser()` decorator in controllers.

---

If any section is unclear or missing, please provide feedback to improve these instructions.
