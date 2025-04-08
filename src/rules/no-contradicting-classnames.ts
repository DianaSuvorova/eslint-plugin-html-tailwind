import { TSESLint } from '@typescript-eslint/utils';
import type { Attribute } from '@html-eslint/types';

const rule: TSESLint.RuleModule<'duplicatePrefix', []> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Tailwind classes that repeat the same property (e.g., w-1 w-2)',
    },
    messages: {
      duplicatePrefix: 'Multiple classes use the same property prefix "{{prefix}}": {{classes}}',
    },
    schema: [],
  },

  defaultOptions: [],

  create(context) {
    const ALPINE_MARKERS = new Set(['x-transition', 'x-cloak']);

    const checkDuplicatePrefixes = (classNames: string[], node: Attribute) => {
      const byPrefix: Record<string, string[]> = {};

      for (const className of classNames) {
        const prefix = className.includes('-') ? className.split('-')[0] : className;

        if (!byPrefix[prefix]) {
          byPrefix[prefix] = [];
        }

        byPrefix[prefix].push(className);
      }

      for (const [prefix, group] of Object.entries(byPrefix)) {
        if (group.length > 1) {
          context.report({
            node,
            messageId: 'duplicatePrefix',
            data: {
              prefix,
              classes: group.join(', '),
            },
          });
        }
      }
    };

    return {
      Attribute(node: Attribute) {
        const attrName = node.key?.value;
        const rawValue = node.value?.value;

        if (!attrName || attrName.startsWith('x-') || typeof rawValue !== 'string') return;

        if (attrName === 'class') {
          const classNames = rawValue
            .split(/\s+/)
            .filter((name) => name && !ALPINE_MARKERS.has(name));
          checkDuplicatePrefixes(classNames, node);
        }

        if (attrName === ':class') {
          const matches = rawValue.match(/'([^']+?)'\s*:/g) || [];
          const classNames: string[] = [];

          for (const match of matches) {
            const rawKey = match.replace(/['":]/g, '').trim();
            rawKey.split(/\s+/).forEach((name) => {
              if (name && !ALPINE_MARKERS.has(name)) {
                classNames.push(name);
              }
            });
          }

          checkDuplicatePrefixes(classNames, node);
        }
      },
    };
  },
};

export default rule;
