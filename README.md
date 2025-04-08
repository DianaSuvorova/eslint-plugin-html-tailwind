# eslint-plugin-html-tailwind

An ESLint plugin for tailwind in HTML


## 🚀 Installation

```bash
npm install --save-dev eslint-plugin-html-tailwind @html-eslint/parser
```

## 📦 Usage

In your ESLint config:

```js

// eslint.config.js
import htmlParser from '@html-eslint/parser';
import tailwind from 'eslint-plugin-html-tailwind';

export default [
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: htmlParser,
    },
    plugins: {
      tailwind,
    },
    rules: {
      "html-tailwind/classname-order": "warn"
    },
  },
];

```

## 🧬 Alpine.js Compatibility

This plugin safely ignores Alpine.js directives like:

```html
<div x-cloak class="block w-full"></div>
<div x-transition="fade" class="hidden"></div>
<div :class="{'p-4 pt-2': condition}"></div>
```

Your Alpine attributes remain untouched while Tailwind classes are checked.


Made with ❤️ for teams using Tailwind + Alpine.js
