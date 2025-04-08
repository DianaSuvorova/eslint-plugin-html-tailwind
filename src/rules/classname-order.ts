import { TSESLint } from '@typescript-eslint/utils';
import type { Attribute } from '@html-eslint/types';
import  { sortClasses }  from "@shufo/tailwindcss-class-sorter";

const rule: TSESLint.RuleModule<'incorrectOrder', []> = {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce a consistent order of Tailwind CSS class names',
      },
      messages: {
        incorrectOrder: 'Class names are not ordered correctly. Expected: {{expected}}',
      },
      schema: [],
    },

    defaultOptions: [],

  create(context) {

    const classNameOrderCheck = (classNames: string[], node: Attribute) => {
      const classNamesString = classNames.join(' ') 
      const sortedClasses = sortClasses(classNamesString);
        if (classNamesString !== sortedClasses) {;
            context.report({
              node,
              messageId: 'incorrectOrder',
              data: { expected: sortedClasses },
            });
          }
    };
    return {
        Attribute(node: Attribute) {
            const attrName = node.key?.value;
            const rawValue = node.value?.value;
      
            const ALPINE_MARKERS = new Set(['x-transition', 'x-cloak']);
      
            // alpinejs attributes, to be ignored 
            if (!attrName || attrName.startsWith('x-')) return;
            if (typeof rawValue !== 'string') return;
      
            if (attrName === 'class') {
              const classNames = rawValue
                .split(/\s+/)
                .filter((name) => name && !ALPINE_MARKERS.has(name));
                classNameOrderCheck(classNames, node)
            }
      
            if (attrName === ':class') {
              // Only extract keys in object-style bindings: { 'foo bar': condition }
              const matches = rawValue.match(/'([^']+?)'\s*:/g) || [];
              const classNames = [];
      
              for (const match of matches) {
                const rawKey = match.replace(/['":]/g, '').trim();
                rawKey.split(/\s+/).forEach((name) => {
                  if (name && !ALPINE_MARKERS.has(name)) {
                    classNames.push(name);
                  }
                });
              }
              classNameOrderCheck(classNames, node);
        }
      },
    };
  },
};

export default rule;
