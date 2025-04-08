# no-contradicting-class-names

Disallow multiple Tailwind CSS class names that modify the same exact property (e.g. `w-1 w-2`).

## Rule Details

This rule flags cases where two or more Tailwind classes targeting the **same property** (determined by prefix) are used together, which often results in the later class overriding the previous one.

✅ **Good:**
```html
<div class="w-1 min-w-full"></div>
<div class="p-4 py-2"></div>
<div class="block w-full" x-cloak></div>
```

🚫 **Bad:**
```html
<div class="w-1 w-2"></div>
<div class="p-4 p-6"></div>
<div :class="{ 'w-1 w-2': true }"></div>
<div :class="{ 'p-4 p-6': condition }"></div>
```

In each of the invalid examples above, two classes share the same **base prefix** (like `w-` or `p-`), which means they are likely meant to modify the same CSS property (e.g., `width` or `padding`). This rule helps catch accidental overlap and encourages a single clear declaration.

## When Not To Use It
You can disable this rule if you intentionally layer multiple classes that override one another based on conditionals or variants.

## Compatibility
✅ Supports plain HTML, AlpineJS `:class` bindings in object style.
