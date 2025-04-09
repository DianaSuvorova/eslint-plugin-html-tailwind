import { RuleTester } from '@typescript-eslint/rule-tester';
import { describe, it, afterAll } from 'vitest';
import htmlParser from '@html-eslint/parser';
import rule from '../src/rules/no-style-attribute';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.afterAll = afterAll;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: htmlParser,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-style-attribute', rule, {
  valid: [
    `<div :style="'color: red'"></div>`,
    `<div x-bind:style="'display: none'"></div>`,
    `<div class="text-center" x-cloak></div>`,
    `<div class="text-sm" :style="dynamicStyles"></div>`,
    `<div :style="'width:' + progress + '%'"></div>`,
  ],

  invalid: [
    {
      code: `<div style="color: red;"></div>`,
      errors: [{ messageId: 'noStyleAttr' }],
    },
    {
      code: `<body style="display: none;"></body>`,
      errors: [{ messageId: 'noStyleAttr' }],
    },
    {
      code: `<span style="width: 50%"></span>`,
      errors: [{ messageId: 'noStyleAttr' }],
    },
  ],
});
