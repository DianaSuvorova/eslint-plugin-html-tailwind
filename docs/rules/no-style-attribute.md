# Disallow Static style Attributes (no-style-attribute)
💡 Rule type: Suggestion

This rule disallows the use of static style="..." attributes in HTML templates in favor of utility classes.

## Rule Details
It is recommended to use `class` attribute to list all utility classes for Alpine.js dynamic style use se dynamic bindings like `:style` or `x-bind:style`.

### ✅ Good

```html
<div :style="'color: red'"></div>
<div x-bind:style="'display: none'"></div>
<span :style="'width:' + progress + '%'"></span>
```
### 🚫 Bad
```html
<div style="color: red;"></div>
<body style="display: none;"></body>
<span style="width: 50%"></span>
```