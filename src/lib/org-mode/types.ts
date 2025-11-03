export interface OrgKeywords {
  title?: string;
  author?: string;
  email?: string;
  date?: string;
  description?: string;
  [key: string]: string | undefined;
}

export interface ConversionOptions {
  defaultTitle?: string;
  defaultDescription?: string;
}

export interface ConversionResult {
  frontmatter: string;
  markdown: string;
}