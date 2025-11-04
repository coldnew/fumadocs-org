# Task: Map Org-mode SRC Block Tangle to MDX Code Block Title

## Description

Map Org-mode source blocks with `:tangle` attribute to MDX code blocks with titles, but only if `:exports` is not `none`. If `:exports none`, the code block is not rendered in the MDX output.

## Reference

Fumadocs codeblock documentation: https://fumadocs.dev/docs/ui/components/codeblock

## Example Mapping

Org-mode:

```
#+BEGIN_SRC tsx :tangle mdx-components.tsx :exports code
import defaultComponents from 'fumadocs-ui/mdx';
// ...
#+END_SRC
```

To MDX:

````
```tsx title="mdx-components.tsx"
import defaultComponents from 'fumadocs-ui/mdx';
// ...
````

For `:exports none`, no output.

## Tasks

- [x] Parse `:tangle` and `:exports` attributes in Org-mode SRC blocks
- [x] Convert to MDX code block with title if exports not none
- [x] Skip rendering for exports none
- [x] Preserve code content and formatting
