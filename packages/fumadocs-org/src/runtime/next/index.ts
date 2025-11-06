import type { VirtualFile } from 'fumadocs-core/source';
import {
  type MetaData,
  type PageData,
  type Source,
} from 'fumadocs-core/source';
import type { DocOut, MetaOut, Runtime } from './types';

export const _runtime: Runtime = {
  doc(files) {
    return files.map((file) => {
      // For runtime, we expect pre-processed data
      // The actual org-to-mdx conversion happens in the loader
      return {
        _exports: {} as Record<string, unknown>,
        body: () => null, // Will be replaced by actual component
        toc: [],
        structuredData: {},
        ...file.data,
        info: file.info,
      } satisfies DocOut;
    });
  },
  meta(files) {
    return files.map((file) => {
      return {
        info: file.info,
        ...file.data,
      } satisfies MetaOut;
    });
  },
  docs(docs, metas) {
    const parsedDocs = this.doc(docs);
    const parsedMetas = this.meta(metas);

    return {
      docs: parsedDocs,
      meta: parsedMetas,
      toFumadocsSource() {
        return createOrgSource(parsedDocs, parsedMetas);
      },
    };
  },
};

export interface AnyCollectionEntry {
  info: {
    path: string;
    fullPath: string;
  };
}

export function createOrgSource<
  Doc extends PageData & AnyCollectionEntry,
  Meta extends MetaData & AnyCollectionEntry,
>(
  docs: Doc[],
  meta: Meta[] = [],
): Source<{
  pageData: Doc;
  metaData: Meta;
}> {
  return {
    files: resolveFiles({
      docs,
      meta,
    }) as VirtualFile<{
      pageData: Doc;
      metaData: Meta;
    }>[],
  };
}

interface ResolveOptions {
  docs: (PageData & AnyCollectionEntry)[];
  meta: (MetaData & AnyCollectionEntry)[];

  rootDir?: string;
}

export function resolveFiles({ docs, meta }: ResolveOptions): VirtualFile[] {
  const outputs: VirtualFile[] = [];

  for (const entry of docs) {
    outputs.push({
      type: 'page',
      absolutePath: entry.info.fullPath,
      path: entry.info.path,
      data: entry,
    });
  }

  for (const entry of meta) {
    outputs.push({
      type: 'meta',
      absolutePath: entry.info.fullPath,
      path: entry.info.path,
      data: entry,
    });
  }

  return outputs;
}

export type * from './types';
