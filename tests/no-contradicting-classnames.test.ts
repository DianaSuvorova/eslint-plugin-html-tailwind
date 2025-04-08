import { RuleTester } from '@typescript-eslint/rule-tester';
import { describe, it, afterAll } from 'vitest';
import htmlParser from '@html-eslint/parser';
import rule from '../src/rules/no-contradicting-classnames';

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

ruleTester.run('no-contradicting-class-names', rule, {
  valid: [
    { code: `<div class="w-1 min-w-full"></div>` },
    { code: `<div class="px-4 py-2"></div>` },
    { code: `<div class="block w-full" x-cloak></div>` },
    { code: `<div class="hidden" x-transition></div>` },
    { code: `<div :class="{ 'w-1': isSmall, 'min-w-full': isLarge }"></div>` },
  ],

  invalid: [
    {
      code: `<div class="w-1 w-2"></div>`,
      errors: [
        {
          messageId: 'duplicateGroup',
          data: {
            group: 'w',
            conflicts: 'w-1, w-2',
          },
        },
      ],
    },
    {
      code: `<div class="p-4 p-6"></div>`,
      errors: [
        {
          messageId: 'duplicateGroup',
          data: {
            group: 'p',
            conflicts: 'p-4, p-6',
          },
        },
      ],
    },
    {
      code: `<div :class="{ 'w-1 w-2': true }"></div>`,
      errors: [
        {
          messageId: 'duplicateGroup',
          data: {
            group: 'w',
            conflicts: 'w-1, w-2',
          },
        },
      ],
    },
    {
      code: `<div :class="{ 'p-4 p-6': condition }"></div>`,
      errors: [
        {
          messageId: 'duplicateGroup',
          data: {
            group: 'p',
            conflicts: 'p-4, p-6',
          },
        },
      ],
    },
  ],
});
