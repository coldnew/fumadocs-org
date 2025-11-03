# Agent Guidelines for coldnew's Blog

## Commands

- **Build**: `npm run build`
- **Static Build**: `npm run build:static`
- **Dev Server**: `npm run dev`
- **Lint**: `npm run lint` (validates dates)
- **Format**: `npm run format`
- **Format Check**: `npm run format:check`
- **Type Check**: `npx tsc --noEmit`
- **Single Test**: `node scripts/test-<name>.js` or `tsx scripts/test-<name>.ts`

## Code Style

- **TypeScript**: Strict mode, absolute imports with `@/` prefix
- **Formatting**: Prettier (semi: true, singleQuote: true, tabWidth: 2, printWidth: 80, jsxSingleQuote: true)
- **Linting**: ESLint with Next.js rules + Prettier
- **Naming**: camelCase variables/functions, PascalCase components/interfaces
- **Error Handling**: Throw descriptive errors with validation messages
- **Types**: Strict typing with interfaces for props and parameters
- **Imports**: Group external libs first, then internal with `@/` paths
- **Comments**: All code comments must be in English

## Git Conventions

- **Commits**: Use Conventional Commits format (e.g., `feat: add new feature`, `fix: resolve bug`)
- **Pre-commit Checks**: Run `npm run format` before committing to ensure code style consistency
- **Commit Policy**: Do not proactively git commit unless explicitly instructed by the user

## Task Management

- **New Tasks**: Always confirm with the user before creating a new task file in the tasks/ folder
- **Task Numbering**: If creating a new task, use sequential numbering (e.g., 0002-xxx.md after 0001-xxx.md)
- **Task Creation**: Only create task files when explicitly approved by the user
- **Task File Access**: Only read task files in the tasks/ folder that have not been committed yet

## Testing

- **Framework**: Vitest with UI support
- **Test Scripts**: `npm run test` (watch mode), `npm run test:ui` (UI mode), `npm run test:run` (single run)
- **Test Location**: Unit tests in `src/**/*.test.ts`
- **Coverage**: Aim for high coverage on critical functions
- **Mocking**: Use Vitest's mocking capabilities for external dependencies
- **Workflow**: Run `npm run test:run` after every code modification to ensure all unit tests pass
