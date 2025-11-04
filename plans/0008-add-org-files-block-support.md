# Plan: Add Support for Org-mode Files Blocks

## Description

Add support for `#+begin_files` or `#+begin_export files` blocks in Org-mode to convert file/folder structures to Fumadocs Files components.

## Reference

Fumadocs Files component documentation: https://fumadocs.dev/docs/ui/components/files

## Example Mapping

Org-mode:

```
#+begin_export files
- app/ [folder]
  - layout.tsx
  - page.tsx
  - global.css
- components/ [folder]
  - button.tsx
  - tabs.tsx
  - dialog.tsx
- package.json
#+end_export
```

To MDX:

```tsx
import { File, Folder, Files } from 'fumadocs-ui/components/files';

<Files>
  <Folder name='app' defaultOpen>
    <File name='layout.tsx' />
    <File name='page.tsx' />
    <File name='global.css' />
  </Folder>
  <Folder name='components'>
    <File name='button.tsx' />
    <File name='tabs.tsx' />
    <File name='dialog.tsx' />
  </Folder>
  <File name='package.json' />
</Files>;
```

## Implementation Steps

- Parse `#+begin_export files` blocks in Org-mode
- Convert hierarchical list to Files component structure
- Handle folder and file distinctions
- Support attributes like `defaultOpen` for folders
- Add tests for file structure conversion
