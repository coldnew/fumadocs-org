# Split Org-mode Demo into Multiple Pages

## Description

Split the single org-mode-demo.org file into multiple specialized .org files under content/docs/org-mode-support/ for better demonstration of individual features.

## Tasks

- [x] Remove content/docs/org-mode-support/index.mdx
- [x] Create separate .org files for each feature: math, code-blocks, tables, lists, properties, links, callouts, footnotes, special-characters
- [x] Populate each file with explanation, syntax examples in text blocks, and actual org syntax demonstrations
- [x] Run prebuild to generate corresponding .mdx files

## Implementation Details

- Deleted index.mdx from org-mode-support directory
- Created 9 feature-specific .org files
- Each file includes syntax examples wrapped in text code blocks and live demonstrations
- Prebuild script successfully converted all files to .cache/docs/org-mode-support/
