import type { OrgKeywords } from './types';
import { PATTERNS, SKIP_KEYWORDS } from './constants';

/**
 * Extract all Org-mode keywords from content
 */
export function extractOrgKeywords(content: string): OrgKeywords {
  const keywords: OrgKeywords = {};
  let match;

  while ((match = PATTERNS.KEYWORD.exec(content)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2].trim();

    // Skip keywords that may cause issues
    if (!SKIP_KEYWORDS.has(key)) {
      keywords[key] = value;
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
