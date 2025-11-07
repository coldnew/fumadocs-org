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
