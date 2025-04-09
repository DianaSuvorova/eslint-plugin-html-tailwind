# no-contradicting-class-names

Disallow multiple Tailwind CSS class names that modify the same exact property (e.g. `w-1 w-2`).

## Rule Details

This rule flags a limited set of Tailwind utility classes when multiple numeric variations of the same property (based on known prefixes) are used together, which often results in one class overriding the other.

It does not attempt to detect all overlapping or conflicting classes—only obvious cases like:

* w-1 w-2 (duplicate widths)
* p-4 p-6 (duplicate padding)
* border-2 border-4 (duplicate border width)

## ✅ Good (allowed):

```html

<div class="w-1 min-w-full"></div>
<div class="p-4 py-2"></div>
<div class="block w-full" x-cloak></div>
<div class="border border-gray-200"></div>
```
## 🚫 Bad (flagged):

```html
<div class="w-1 w-2"></div>
<div class="p-4 p-6"></div>
<div class="border-2 border-4"></div>
<div :class="{ 'w-1 w-2': true }"></div>
<div :class="{ 'p-4 p-6': condition }"></div>
```
In each invalid example above, two classes share the same utility group and both use numeric modifiers, which suggests an unintentional override.

## What It Doesn’t Flag
This rule intentionally ignores:

Valid combinations like `border` `border-gray-200`
Classes with different variants (e.g., `w-1` `md:w-2`)
More complex semantic utilities like `text-sm` `text-gray-600`

## Compatibility
✅ Supports plain HTML, AlpineJS `:class` bindings in object style.
