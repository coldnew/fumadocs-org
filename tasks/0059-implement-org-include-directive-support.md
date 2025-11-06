# Implement Org-mode #INCLUDE Directive Support

## Overview
Add support for Org-mode's `#INCLUDE:` directive in the Org-to-MDX conversion pipeline, similar to Fumadocs' `<include>` tag functionality.

## Requirements
- [x] Parse `#INCLUDE:` directives in Org files during conversion
- [x] If included file is an Org-mode file (`.org`), convert it to MDX first
- [x] Generate `<include>.shared.org.mdx</include>` syntax in the final MDX output
- [x] Ensure included files are processed before the including file to maintain dependency order
- [x] Support bidirectional conversion: convert `<include>` tags in MDX back to `#INCLUDE:` directives in Org

## Implementation Steps
- [x] Update the Org parser to recognize and extract `#INCLUDE` directives
- [x] Integrate with existing MDX conversion pipeline
- [x] Handle circular dependencies and missing files gracefully
- [x] Consider caching converted includes for performance
- [x] Add unit tests for the new functionality
- [x] Update documentation and examples

## Benefits
- Enables modular Org-mode content organization
- Maintains compatibility with Fumadocs shared content patterns
- Supports complex documentation structures with reusable components