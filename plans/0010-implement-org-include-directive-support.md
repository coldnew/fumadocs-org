# Implement Org-mode #INCLUDE Directive Support

## Overview

Add support for Org-mode's `#INCLUDE:` directive in the Org-to-MDX conversion pipeline, similar to Fumadocs' `<include>` tag functionality.

## Requirements

- Parse `#INCLUDE:` directives in Org files during conversion
- If included file is an Org-mode file (`.org`), convert it to MDX first
- Generate `<include>.shared.org.mdx</include>` syntax in the final MDX output
- Ensure included files are processed before the including file to maintain dependency order
- Support bidirectional conversion: convert `<include>` tags in MDX back to `#INCLUDE:` directives in Org

## Benefits

- Enables modular Org-mode content organization
- Maintains compatibility with Fumadocs shared content patterns
- Supports complex documentation structures with reusable components

## Implementation Considerations

- Update the Org parser to recognize and extract `#INCLUDE` directives
- Integrate with existing MDX conversion pipeline
- Handle circular dependencies and missing files gracefully
- Consider caching converted includes for performance

## References

- Fumadocs documentation: https://raw.githubusercontent.com/fuma-nama/fumadocs/refs/heads/dev/apps/docs/content/docs/ui/search/orama.mdx
