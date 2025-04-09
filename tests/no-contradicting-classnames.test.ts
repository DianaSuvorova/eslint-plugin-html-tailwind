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
    `<div class="w-1 min-w-full"></div>`,
    `<div class="px-4 py-2"></div>`,
    `<div class="block w-full" x-cloak></div>`,
    `<div class="hidden" x-transition></div>`,
    `<div :class="{ 'w-1': isSmall, 'min-w-full': isLarge}"></div>`,
    `<div class="w-full, md:w-full"></div>`,
    `<div class="border, border-gray-200"></div>`,
    `<div class="border, border-2"></div>`,
    `<div class="text-xs, text-neutral-500"></div>`,
    `<div class="flex, flex-col"></div>`,
    `<div class="object-contain, object-center"></div>`,
    `<div class="border, border-neutral-200/70 border-transparent"></div>`,
    `<div class ="border-[2px], border-white"></div>`,
    `<div :class="{ 'opacity-0 z-10' : preview, 'z-30': !preview }"></div>`
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
