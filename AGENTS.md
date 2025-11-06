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
- **Convert MDX to Org**: `npm run org2mdx <mdx-file> [output-org-file]`

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
- **Pre-commit Checks**: Run `npm run format` and `npm run build` before committing to ensure code style consistency and no build errors
- **Debug Code Removal**: Remove any debug statements like console.log or printf that output to stdout before committing or after debugging is complete
- **Commit Policy**: Do not proactively git commit unless explicitly instructed by the user

## Task Management

- **New Tasks**: Always confirm with the user before creating a new task file in the tasks/ folder
- **Task Numbering**: If creating a new task, use sequential numbering (e.g., 0002-xxx.md after 0001-xxx.md)
- **Task Creation**: Only create task files when explicitly approved by the user
- **Task File Access**: Only read task files in the tasks/ folder that have not been committed yet
- **Task Format**: Use checkbox format (- [X]) for completed tasks and (- [ ]) for pending tasks in the Tasks section
- **Pre-commit Review**: Before committing implementation, re-review whether the task description matches the current implementation. If deciding not to follow the task implementation, report the reason
- **Session Summary**: Before committing, update the current uncommitted task file with a detailed session summary and implement any remaining details

- **Task Planning**: Before starting any task, present the task plan to the user and wait for approval before proceeding with development

- **Task Completion**: When completing a task, provide a summary of what was done and suggestions for future improvements

## Plan Management

- **Plan Folder**: plans/ folder stores planning prototypes for future features and improvements
- **Numbering**: Sequential numbering starting from 0001-xxx.md, same as tasks
- **Purpose**: High-level planning and ideation, not detailed implementation tasks
- **Implementation Process**: When user requests to implement a specific plan, convert the plan file content into a suitable task format, create the task in tasks/ folder, and remove the original plan file
- **Confirmation**: Always confirm with user before creating plan files or converting plans to tasks

## Testing

- **Framework**: Vitest with UI support
- **Test Scripts**: `npm run test` (watch mode), `npm run test:ui` (UI mode), `npm run test:run` (single run)
- **Test Location**: Unit tests in `src/**/*.test.ts`
- **Coverage**: Aim for high coverage on critical functions
- **Mocking**: Use Vitest's mocking capabilities for external dependencies
- **Workflow**: Confirm `npm run test:run` passes before committing changes
- **New Features**: Always consider adding unit tests for new code modifications and features

## Project Goals

- **MDX First**: Regardless of input formats like org-mode or others, the ultimate goal is to generate MDX that this project can use

## Library Structure

The `packages/org2mdx/` library is organized into clear modules for bidirectional conversion:

### Core Modules

- **`serialize.ts`** - Org → MDX conversion (serialization)
- **`deserialize.ts`** - MDX → Org conversion (deserialization)
- **`converter.ts`** - Legacy converter (deprecated, functions moved to serialize/deserialize)

### Supporting Modules

- **`types.ts`** - TypeScript type definitions
- **`keywords.ts`** - Org keyword extraction and processing
- **`constants.ts`** - Library constants and patterns
- **`time.ts`** - Time parsing and formatting utilities for org-mode and Hugo formats
- **`utils.ts`** - General utility functions

### Submodules

- **`blocks/`** - Modular block processing system
- **`plugins/`** - Unified plugins for AST transformations

### API Usage

```typescript
import { convertOrgToMdx, convertMdxToOrg } from '@/packages/org2mdx';

// Serialize: Org → MDX
const mdx = await convertOrgToMdx(orgContent, filename);

// Deserialize: MDX → Org
const org = await convertMdxToOrg(mdxContent, filename);
```
