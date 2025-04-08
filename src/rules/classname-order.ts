import { TSESLint } from '@typescript-eslint/utils';
import type { Attribute } from '@html-eslint/types';
import { sortClasses } from '@shufo/tailwindcss-class-sorter';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindDefault from 'tailwindcss/defaultConfig'; 
import path from 'path';
import fs from 'fs';

type Options = [{
  tailwindConfigPath?: string;
}];

const rule: TSESLint.RuleModule<'incorrectOrder', Options> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce a consistent order of Tailwind CSS class names',
    },
    messages: {
      incorrectOrder: 'Class names are not ordered correctly. Expected: {{expected}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          tailwindConfigPath: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
  },

  defaultOptions: [{}],

  create(context) {
    const options = context.options[0] ?? {};
    const tailwindConfigPath = options.tailwindConfigPath;

    let resolvedConfig = resolveConfig(tailwindDefault); // fallback

    if (tailwindConfigPath) {
      const resolvedPath = path.resolve(process.cwd(), tailwindConfigPath);
      if (fs.existsSync(resolvedPath)) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const loadedConfig = require(resolvedPath);
          resolvedConfig = resolveConfig(loadedConfig);
        } catch (err) {
          context.report({
            loc: { line: 1, column: 0 },
            message: `Failed to load Tailwind config at "${tailwindConfigPath}": ${err.message}`,
          });
        }
      } else {
        context.report({
          loc: { line: 1, column: 0 },
          message: `Tailwind config file "${tailwindConfigPath}" does not exist.`,
        });
      }
    }

    const classNameOrderCheck = (classNames: string[], node: Attribute) => {
      const classNamesString = classNames.join(' ');
      const sorted = sortClasses(classNamesString, { tailwindConfig: resolvedConfig });

      if (classNamesString !== sorted) {
        context.report({
          node,
          messageId: 'incorrectOrder',
          data: { expected: sorted },
        });
      }
    };

    return {
      Attribute(node: Attribute) {
        const attrName = node.key?.value;
        const rawValue = node.value?.value;

        const ALPINE_MARKERS = new Set(['x-transition', 'x-cloak']);

        if (!attrName || attrName.startsWith('x-')) return;
        if (typeof rawValue !== 'string') return;

        if (attrName === 'class') {
          const classNames = rawValue
            .split(/\s+/)
            .filter((name) => name && !ALPINE_MARKERS.has(name));
          classNameOrderCheck(classNames, node);
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

          classNameOrderCheck(classNames, node);
        }
      },
    };
  },
};

export default rule;
