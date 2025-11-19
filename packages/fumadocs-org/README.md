# fumadocs-org

Fumadocs integration for Org-mode files.

## Installation

```bash
npm install fumadocs-org
```

## Usage

### Option 1: Drop-in Replacement (Recommended)

Simply replace your `fumadocs-mdx` import with `fumadocs-org`:

```typescript
// Before
import { createMDX } from 'fumadocs-mdx/next';
const withMDX = createMDX();

// After - just change the import!
import { createMDX } from 'fumadocs-org/next';
const withMDX = createMDX();
```

### Option 2: Explicit Org Support

Use the explicit `createOrg` function:

```typescript
import { createOrg } from 'fumadocs-org/next';
const withMDX = createOrg();
```

### Next.js Configuration

```typescript
// next.config.mjs
import { createMDX } from 'fumadocs-org/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // your Next.js config
};

export default withMDX(config);
```

Both approaches automatically enable:

- ✅ Org file processing and conversion to MDX
- ✅ Seamless integration with existing fumadocs-mdx features
- ✅ Support for `.org`, `.mdx`, and `.md` files
- ✅ All existing fumadocs-mdx functionality

## Schema Validation

fumadocs-org supports schema validation for org-mode frontmatter using Zod or Standard Schema V1 compatible libraries.

### Basic Schema Validation

```typescript
// source.config.ts
import { defineDocs } from 'fumadocs-org';
import { z } from 'zod';

const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().optional(),
  author: z.string().optional(),
});

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
  },
});
```

### Advanced Schema Validation

```typescript
// source.config.ts
import { defineDocs } from 'fumadocs-org';
import { z } from 'zod';

const frontmatterSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title too long')
    .refine((title) => !title.includes('Invalid'), {
      message: 'Title cannot contain "Invalid"',
    }),
  date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false),
});

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
  },
});
```

### Error Handling

When validation fails, the build will stop with a descriptive error message:

```
Error: [MDX] invalid frontmatter in content/docs/example.org:
- title: Title is required
- date: Invalid datetime format
```

### Supported Schema Libraries

- **Zod** (recommended): `import { z } from 'zod'`
- **Standard Schema V1**: Any library implementing the Standard Schema V1 interface
- **Custom schemas**: Objects with a `.parse()` method for validation

## Development

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Build package
npm run build

# Development mode
npm run dev
```

## License

MIT
