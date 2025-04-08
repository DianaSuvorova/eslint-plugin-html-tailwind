# Rule: classname-order

Enforces a consistent order of class names in HTML based on Tailwind CSS conventions.

This rule ensures that Tailwind class names appear in a predictable order that mirrors how Tailwind generates its styles in CSS. The sorting behavior follows Tailwind's [recommended ordering](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted), improving readability, preventing overrides bugs, and making diffs more stable.

---

## ✅ **Correct class order**

### Components come first
```html
<!-- `container` is a component so it comes first -->
<div class="container mx-auto px-6">
  <!-- ... -->
</div>
```

---

### Utilities with override potential come later
```html
<!-- Padding override example -->
<div class="p-4 pt-2"></div>
```

---

### General order: box-model and layout first, visual styles later
```html
<!-- Good order -->
<div class="ml-4 flex h-24 border-2 border-gray-300 p-3 text-gray-700 shadow-md"></div>
```

---

### Modifiers come after base utilities
```html
<!-- Plain utilities first, modifiers second -->
<div class="scale-125 opacity-50 hover:scale-150 hover:opacity-75"></div>
```

---

### Responsive modifiers come last, from smallest to largest
```html
<!-- Ordered by mobile-first breakpoint: base → sm → lg -->
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"></div>
```

---

### Custom classes appear before Tailwind classes
```html
<!-- Custom class `select2-dropdown` appears first -->
<div class="select2-dropdown p-3 shadow-xl"></div>
```

---

## 🚫 **Incorrect order examples**

```html
<!-- Incorrect: utility before component -->
<div class="mx-auto container px-6"></div>

<!-- Incorrect: overridden class appears first -->
<div class="pt-2 p-4"></div>

<!-- Incorrect: visual classes before layout -->
<div class="text-gray-700 shadow-md p-3 border-gray-300 ml-4 h-24 flex border-2"></div>

<!-- Incorrect: modifiers appear before base -->
<div class="hover:opacity-75 opacity-50 hover:scale-150 scale-125"></div>

<!-- Incorrect: breakpoints out of order -->
<div class="lg:grid-cols-4 grid sm:grid-cols-3 grid-cols-2"></div>

<!-- Incorrect: custom class not at the front -->
<div class="p-3 shadow-xl select2-dropdown"></div>
```

---

## 🤝 Credit

This rule uses [`@shufo/tailwindcss-class-sorter`](https://www.npmjs.com/package/@shufo/tailwindcss-class-sorter) under the hood for accurate, Tailwind-aware sorting.

Big thanks to [@shufo](https://github.com/shufo) for the excellent utility!

---

## 🧬 Alpine.js Compatibility

This rule works with HTML files that use [Alpine.js](https://alpinejs.dev/), including attributes like `x-cloak`, `x-transition`, and `:class` bindings. It safely ignores Alpine directives and still enforces correct Tailwind class ordering within your class attributes.

---

## 💡 Usage
This rule is included in `eslint-plugin-html-tailwind`.

You can enable it like so:
```json
{
  "rules": {
    "html-tailwind/classname-order": "warn"
  }
}
```
