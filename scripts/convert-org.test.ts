import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import { getEmbeddedChecksum } from './convert-org';

// Mock fs for testing
vi.mock('fs');

describe('convert-org', () => {
  describe('getEmbeddedChecksum', () => {
    it('should extract checksum from frontmatter YAML comment', () => {
      const mockContent = `---
# checksum: a0b6a68009987f8122035f21fe0d3262
title: Test
---

Content here`;

      (fs.existsSync as any).mockReturnValue(true);
      (fs.readFileSync as any).mockReturnValue(mockContent);

      const result = getEmbeddedChecksum('/path/to/file.mdx');
      expect(result).toBe('a0b6a68009987f8122035f21fe0d3262');
    });

    it('should extract checksum from JSX comment (backward compatibility)', () => {
      const mockContent = `---
title: Test
---

{/* This file is auto-generated. checksum: b1c7b89019987f8122035f21fe0d3263 */}

Content here`;

      (fs.existsSync as any).mockReturnValue(true);
      (fs.readFileSync as any).mockReturnValue(mockContent);

      const result = getEmbeddedChecksum('/path/to/file.mdx');
      expect(result).toBe('b1c7b89019987f8122035f21fe0d3263');
    });

    it('should return null if file does not exist', () => {
      (fs.existsSync as any).mockReturnValue(false);

      const result = getEmbeddedChecksum('/path/to/nonexistent.mdx');
      expect(result).toBeNull();
    });

    it('should return null if no checksum found', () => {
      const mockContent = `---
title: Test
---

Content without checksum`;

      (fs.existsSync as any).mockReturnValue(true);
      (fs.readFileSync as any).mockReturnValue(mockContent);

      const result = getEmbeddedChecksum('/path/to/file.mdx');
      expect(result).toBeNull();
    });
  });
});
