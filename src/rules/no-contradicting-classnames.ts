import { TSESLint } from '@typescript-eslint/utils';
import type { Attribute } from '@html-eslint/types';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindDefault from 'tailwindcss/defaultConfig'; 
import path from 'path';
import fs from 'fs';

// Utility: Extract the core utility from a Tailwind class (e.g. "border" from "border", "border-neutral-200")
function getUtilityGroup(className: string): string {
  const [base] = className.split(':').pop()?.split('-') ?? [];
  return base || className;
}

type Options = [{
  tailwindConfigPath?: string;
}];

const rule: TSESLint.RuleModule<'incorrectOrder' | 'duplicateGroup', Options> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce a consistent order of Tailwind CSS class names and disallow contradicting utility groups',
    },
    messages: {
      duplicateGroup: 'Multiple classes use the same utility group "{{group}}": {{conflicts}}',
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

    let resolvedConfig = resolveConfig(tailwindDefault);

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

    const checkClassNames = (classNames: string[], node: Attribute) => {
      // Only check for utility group collisions (ignore sorting)
      const seenGroups = new Map<string, string[]>();
    
      for (const cls of classNames) {
        const [variant, baseClass] = cls.includes(':')
          ? cls.split(/:(.+)/) // split at first colon to handle things like `md:w-1`
          : [null, cls];
    
        // Skip variant-prefixed classes
        if (variant) continue;
    
        const group = getUtilityGroup(baseClass);
        if (!seenGroups.has(group)) {
          seenGroups.set(group, [cls]);
        } else {
          seenGroups.get(group)?.push(cls);
        }
      }
    
      for (const [group, names] of seenGroups) {
        if (names.length > 1) {
          context.report({
            node,
            messageId: 'duplicateGroup',
            data: {
              group,
              conflicts: names.join(', '),
            },
          });
        }
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
          checkClassNames(classNames, node);
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

          checkClassNames(classNames, node);
        }
      },
    };
  },
};

export default rule;
