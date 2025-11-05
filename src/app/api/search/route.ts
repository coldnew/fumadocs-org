import { NextResponse } from 'next/server';
import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const dynamic = 'auto';
export const revalidate = false;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query =
      (searchParams.get('q') || searchParams.get('query'))?.trim() || '';

    if (!query) {
      return createFromSource(source).staticGET();
    }

    return createFromSource(source).GET(request);
  } catch (error) {
    console.error('Search API error:', error);

    return NextResponse.json(
      {
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 500,
      },
      { status: 500 },
    );
  }
}
