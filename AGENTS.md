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
