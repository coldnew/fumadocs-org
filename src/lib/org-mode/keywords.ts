import type { OrgKeywords } from './types';
import { PATTERNS, SKIP_KEYWORDS } from './constants';

/**
 * Extract all Org-mode keywords from content
 */
export function extractOrgKeywords(content: string): OrgKeywords {
  const keywords: OrgKeywords = {};

  // Split content into lines and process each line
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(/^#\+(\w+):\s*(.*)$/);
    if (match) {
      const key = match[1].toLowerCase();
      const value = match[2].trim();

      // Skip keywords that may cause issues
      if (!SKIP_KEYWORDS.has(key)) {
        keywords[key] = value;
      }
    }
  }

  return keywords;
}

/**
 * Get callout type from org-mode callout type
 */
export function getCalloutTypeFromOrgType(orgType: string): string | null {
  const calloutMap: Record<string, string> = {
    warning: 'warning',
    error: 'error',
    info: 'info',
    note: 'note',
    tip: 'tip',
    caution: 'caution',
  };

  return calloutMap[orgType.toLowerCase()] || null;
}
