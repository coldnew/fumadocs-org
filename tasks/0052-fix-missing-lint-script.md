# 0052-fix-missing-lint-script

Fix the missing "lint" script in package.json that is causing the GitHub Action to fail.

The script should validate titles as required by Fumadocs.

## Implementation Details

The lint script (`scripts/lint.ts`) validates titles in content files:

- Scans all `.mdx` and `.org` files in the `content/` directory
- For `.mdx` files, parses frontmatter using `gray-matter` and checks the `title` field
- For `.org` files, extracts the title from `#+TITLE:` lines
- Ensures titles exist and are not empty
- Exits with an error if any titles are missing or empty

This ensures Fumadocs-required titles are present before building.

## Tasks

- [x] Create scripts/lint.ts to validate titles in content frontmatter
- [x] Add "lint" script to package.json pointing to the new script
- [x] Test the lint script
- [x] Verify CI passes after fix
