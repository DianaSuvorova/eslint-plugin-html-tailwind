# eslint-plugin-html-tailwind

An ESLint plugin for [tailwindcss](https://tailwindcss.com/) in HTML.


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
      'html-tailwind/no-contradicting-classnames': 'error',
      'html-tailwind/no-style-attribute': 'error',
      'html-tailwind/classname-order': 'warn',
    },
  },
];

```

## Rules 

* [html-tailwind/no-contradicting-classnames](https://github.com/DianaSuvorova/eslint-plugin-alpinejs/blob/main/docs/rules/no-contradicting-classnames.md)
* [html-tailwind/no-style-attribute](https://github.com/DianaSuvorova/eslint-plugin-alpinejs/blob/main/docs/rules/no-style-attribute.md)
* [html-tailwind/classname-order](https://github.com/DianaSuvorova/eslint-plugin-alpinejs/blob/main/docs/rules/classname-order.md)


##  Alpine.js Compatibility

This plugin works with vanilla HTML and safely integrates with [Alpine.js](https://alpinejs.dev/) directives and code. It has a special handling for dynamic binding and attribues specific to Alpine.js. 


## Motivation and Vision

 HTML-driven and lightweight component libraries like [Pines](https://devdojo.com/pines), go-based [templUI](https://templui.io/docs/introduction) are becoming more common. These setups often pair well with Tailwind CSS, offering a simple and expressive way to build UI.

At the same time, tools like [@html-eslint/parser](https://html-eslint.org/docs/rules) have made it easier to lint and analyze raw HTML, including things like accessibility and SEO. That’s been a great step forward.

But when working with Tailwind and Alpine in .html files, the tooling support starts to fall short - existing Tailwind lint plugins are designed for JavaScript or JSX, and don’t work well with Alpine-specific syntax or the HTML parser.

This plugin is an attempt to help fill that gap.

It aims to bring some useful static checks — like catching obvious class conflicts or enforcing consistent class order — to HTML and Alpine.js projects using Tailwind. It’s not trying to cover everything, just to be a helpful tool for folks who prefer writing components this way.

## Static Analysis for Tailwind + Alpine.js

There is a separate project, [eslint-plugin-alpinejs(https://www.npmjs.com/package/eslint-plugin-alpinejs), that aims to provide linting rules specifically for Alpine.js. It’s still in the very early stages, and currently under active development — but if you’re using Alpine, we’d love for you to try it out and share feedback as an early adopter.

With that the recommended setup for static check  for `Tailwind+Alpinejs` web looks like below:

```js
//eslint.config.js
const htmlPlugin = require("@html-eslint/eslint-plugin");
const eslintHTMLParser =require( "@html-eslint/parser");
const tailwind = require("eslint-plugin-html-tailwind");
const alpinje = require("eslint-plugin-alpinejs");

module.exports = [
{
    "files": [ "**/*.html" ],
    "languageOptions": {
      parser: eslintHTMLParser,
    },
    "plugins": {
      "@html-eslint": htmlPlugin,
      "html-tailwind": tailwind
    },
    "rules": {
      ...htmlPlugin.configs.recommended.rules,
      ...tailwind.configs.recommended.rules,
      ...alpinejs.configs.recommended.rules, 
    }
  },
]
```

installation:

```bash

npm install --save-dev \
  eslint \
  @html-eslint/eslint-plugin \
  @html-eslint/parser \
  eslint-plugin-html-tailwind \
  eslint-plugin-alpinejs

```

---

Made with ❤️ for teams using Tailwind + Alpine.js

