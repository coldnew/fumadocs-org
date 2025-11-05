import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Static export configuration for search
export const dynamic = 'force-static';

// Use staticGET for build-time search indexing
export const { staticGET: GET } = createFromSource(source);
