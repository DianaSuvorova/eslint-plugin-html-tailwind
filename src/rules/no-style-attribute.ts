import { TSESLint } from '@typescript-eslint/utils';
import type { Attribute } from '@html-eslint/types';

const rule: TSESLint.RuleModule<'noStyleAttr', []> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow use of static `style` attribute; allow Alpine-style bindings like `:style` or `x-bind:style`.',
    },
    messages: {
      noStyleAttr: 'Static `style` attributes are not allowed. Use Alpine bindings like `:style` or `x-bind:style` instead.',
    },
    schema: [],
  },

  defaultOptions: [],

  create(context) {
    return {
      Attribute(node: Attribute) {
        const name = node.key?.value;
        if (!name) return;

        // Block only static "style", not dynamic bindings
        if (name === 'style') {
          context.report({
            node,
            messageId: 'noStyleAttr',
          });
        }
      },
    };
  },
};

export default rule;
