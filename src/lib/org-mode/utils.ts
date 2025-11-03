import type { OrgKeywords } from './types';

/**
 * Extract all Org-mode keywords from content
 */
export function extractOrgKeywords(content: string): OrgKeywords {
  const keywordRegex = /^#\+(\w+):\s*(.+)$/gm;
  const keywords: OrgKeywords = {};
  let match;

  while ((match = keywordRegex.exec(content)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    keywords[key] = value;
  }

  return keywords;
}

/**
 * Generate default title from filename
 */
export function generateDefaultTitle(filename: string): string {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}