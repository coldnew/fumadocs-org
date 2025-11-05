import { describe, it, expect } from 'vitest';
import { processDrawerBlocks, restoreDrawerBlocks } from './drawer-blocks';
import { createBlockContext } from './types';

describe('processDrawerBlocks', () => {
  it('should process basic drawer blocks', () => {
    const content = `:notes:
Some notes content here
:end:`;

    const context = createBlockContext();

    const result = processDrawerBlocks(content, context);

    const expected = `<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>Notes</AccordionTrigger>
    <AccordionContent>
Some notes content here
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

    expect(result).toBe(expected);
  });

  it('should convert drawer names to title case', () => {
    const content = `:my_custom_drawer:
Content here
:end:`;

    const context = createBlockContext();

    const result = processDrawerBlocks(content, context);

    const expected = `<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>My Custom Drawer</AccordionTrigger>
    <AccordionContent>
Content here
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

    expect(result).toBe(expected);
  });

  it('should handle multiple drawers', () => {
    const content = `:first:
First content
:end:

:second:
Second content
:end:`;

    const context = createBlockContext();

    const result = processDrawerBlocks(content, context);

    const expected = `<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>First</AccordionTrigger>
    <AccordionContent>
First content
    </AccordionContent>
  </AccordionItem>
</Accordion>

<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-1">
    <AccordionTrigger>Second</AccordionTrigger>
    <AccordionContent>
Second content
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

    expect(result).toBe(expected);
  });

  it('should skip special drawers', () => {
    const content = `:properties:
:key: value
:end:

:logbook:
Some log entries
:end:

:clock:
Clock data
:end:

:effort:
Effort data
:end:`;

    const context = createBlockContext();

    const result = processDrawerBlocks(content, context);

    // Special drawers should not be converted
    expect(result).toBe(content);
  });

  it('should handle drawers with mixed case names', () => {
    const content = `:MyDrawer:
Content
:end:`;

    const context = createBlockContext();

    const result = processDrawerBlocks(content, context);

    const expected = `<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>My Drawer</AccordionTrigger>
    <AccordionContent>
Content
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

    expect(result).toBe(expected);
  });

  it('should process drawer content with indentation', () => {
    const content = `:notes:
  This is indented content
    More indentation
:end:`;

    const context = createBlockContext();

    const result = processDrawerBlocks(content, context);

    const expected = `<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>Notes</AccordionTrigger>
    <AccordionContent>
  This is indented content
    More indentation
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

    expect(result).toBe(expected);
  });

  it('should handle empty drawer content', () => {
    const content = `:empty:
:end:`;

    const context = createBlockContext();

    const result = processDrawerBlocks(content, context);

    const expected = `<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>Empty</AccordionTrigger>
    <AccordionContent>

    </AccordionContent>
  </AccordionItem>
</Accordion>`;

    expect(result).toBe(expected);
  });

  it('should handle drawers with org markup in content', () => {
    const content = `:details:
* Heading in drawer
- List item 1
- List item 2
:end:`;

    const context = createBlockContext();

    const result = processDrawerBlocks(content, context);

    const expected = `<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>Details</AccordionTrigger>
    <AccordionContent>
* Heading in drawer
- List item 1
- List item 2
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

    expect(result).toBe(expected);
  });

  it('should preserve content outside drawers', () => {
    const content = `Some text before

:notes:
Drawer content
:end:

Some text after`;

    const context = createBlockContext();

    const result = processDrawerBlocks(content, context);

    const expected = `Some text before

<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>Notes</AccordionTrigger>
    <AccordionContent>
Drawer content
    </AccordionContent>
  </AccordionItem>
</Accordion>

Some text after`;

    expect(result).toBe(expected);
  });

  it('should handle nested content within drawers', () => {
    const content = `:complex:
This is a drawer with
multiple lines and
different content types.

* A heading
- List item
  - Nested item

Some more text.
:end:`;

    const context = createBlockContext();

    const result = processDrawerBlocks(content, context);

    const expected = `<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>Complex</AccordionTrigger>
    <AccordionContent>
This is a drawer with
multiple lines and
different content types.

* A heading
- List item
  - Nested item

Some more text.
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

    expect(result).toBe(expected);
  });
});

describe('restoreDrawerBlocks', () => {
  it('should be a no-op for accordions', () => {
    const markdown = `<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>Notes</AccordionTrigger>
    <AccordionContent>
Some content
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

    const context = createBlockContext();

    const result = restoreDrawerBlocks(markdown, context);

    expect(result).toBe(markdown);
  });

  it('should handle multiple accordions', () => {
    const markdown = `<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-0">
    <AccordionTrigger>First</AccordionTrigger>
    <AccordionContent>
First content
    </AccordionContent>
  </AccordionItem>
</Accordion>

<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="drawer-1">
    <AccordionTrigger>Second</AccordionTrigger>
    <AccordionContent>
Second content
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

    const context = createBlockContext();

    const result = restoreDrawerBlocks(markdown, context);

    expect(result).toBe(markdown);
  });
});
