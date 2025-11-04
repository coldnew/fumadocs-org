# Plan: Map Org-mode SRC Block Tangle to MDX Code Block Title

## Description

Map Org-mode source blocks with `:tangle` and `:exports none` attributes to MDX code blocks with titles. Since `:exports none` means the code is not exported to the document, we use the tangle filename as the code block title. Convert tangle filename to title attribute and handle special comment syntax.

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

```

## Additional Transformations

- Convert `[[!code highlight]]` to `{/* [!code highlight] */}`

## Implementation Steps

- Parse `:tangle` and `:exports` attributes in Org-mode SRC blocks
- Convert to MDX code block with title
- Handle special comment syntax transformations
- Preserve code content and formatting
```
