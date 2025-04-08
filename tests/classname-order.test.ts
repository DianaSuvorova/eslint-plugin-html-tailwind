import { RuleTester } from '@typescript-eslint/rule-tester';
import { describe, it, afterAll } from 'vitest';
import htmlParser from '@html-eslint/parser';
import classnameOrderRule from '../src/rules/classname-order';

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

ruleTester.run('classname-order', classnameOrderRule, {
  valid: [
    `<div class="container mx-auto px-6">"container is a component so it comes first"</div>`,
    `<div class="ml-4 flex h-24 border-2 border-gray-300 p-3 text-gray-700 shadow-md">Examples are from <a>https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted</a></div>`,
    `<div class="scale-125 opacity-50 hover:scale-150 hover:opacity-75">Modifiers</div>`,
    `<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">"Responsive Modifies"</div>`,
    `<div class="select2-dropdown p-3 shadow-xl">Custom</div>`,
    `<div class="block w-full" x-cloak>Alpine x-cloak attribute should be ignored</div>`,
    `<div class="hidden" x-transition>Alpine x-transition attribute should be ignored</div>`
  ],

  invalid: [
    {
      code: `<div class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800"></div>`,
      errors: [{ messageId: 'incorrectOrder', data: { expected: 'bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3' } }],
    },
    {
      code: `<div class="pt-2 p-4">"SHould be p-4 pt-2"</div>`,
      errors: [{ messageId: 'incorrectOrder', data: { expected: 'p-4 pt-2' } }],
    },
    {
      code: `<div class="text-gray-700 shadow-md p-3 border-gray-300 ml-4 h-24 flex border-2"></div>`,
      errors: [{ messageId: 'incorrectOrder', data: { expected: 'ml-4 flex h-24 border-2 border-gray-300 p-3 text-gray-700 shadow-md' } }],
    },
    {
      code: `<div class="hover:opacity-75 opacity-50 hover:scale-150 scale-125"></div>`,
      errors: [{ messageId: 'incorrectOrder', data: { expected: 'scale-125 opacity-50 hover:scale-150 hover:opacity-75' } }],
    },
    {
      code: `<div class="lg:grid-cols-4 grid sm:grid-cols-3 grid-cols-2"></div>`,
      errors: [{ messageId: 'incorrectOrder', data: { expected: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' } }],
    },
    {
      code: `<div class="p-3 shadow-xl select2-dropdown"></div>`,
      errors: [{ messageId: 'incorrectOrder', data: { expected: 'select2-dropdown p-3 shadow-xl' } }],
    },
    {
      code: `<div class="w-full block" x-cloak></div>`,
      errors: [{ messageId: 'incorrectOrder', data: { expected: 'block w-full' } }],
    },
    {
      code: `<div class="w-full block" x-transition="fade"></div>`,
      errors: [{ messageId: 'incorrectOrder', data: { expected: 'block w-full' } }],
    },
  ],
});
