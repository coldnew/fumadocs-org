import type {
  MetaData,
  PageData,
  Source,
  VirtualFile,
} from 'fumadocs-core/source';

export interface FileInfo {
  path: string;
  fullPath: string;
}

export interface RuntimeFile {
  info: FileInfo;
  data: Record<string, unknown>;
}

export interface DocOut extends PageData {
  info: FileInfo;
  _exports: Record<string, unknown>;
  body: unknown;
  toc: unknown[];
  structuredData: unknown;
}

export interface MetaOut extends MetaData {
  info: FileInfo;
}

export interface Runtime {
  doc: (files: RuntimeFile[]) => DocOut[];
  meta: (files: RuntimeFile[]) => MetaOut[];
  docs: (
    docs: RuntimeFile[],
    metas: RuntimeFile[],
  ) => {
    docs: DocOut[];
    meta: MetaOut[];
    toFumadocsSource: () => Source<{
      pageData: DocOut;
      metaData: MetaOut;
    }>;
  };
}

export interface AnyCollectionEntry {
  info: FileInfo;
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
