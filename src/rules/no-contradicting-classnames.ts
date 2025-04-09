import { TSESLint } from '@typescript-eslint/utils';
import type { Attribute } from '@html-eslint/types';

const SIMPLE_NUMERIC_PREFIXES = new Set([
  // Sizing
  'w', 'h', 'min-w', 'max-w', 'min-h', 'max-h',
  // Spacing
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  // borders
  'border-t', 'border-r', 'border-b', 'border-l',
  // Layout
  'z', 'order', 'columns', 'grid-cols', 'gap', 'gap-x', 'gap-y',
  // Effects
  'blur', 'brightness', 'contrast', 'opacity', 'saturate', 'sepia',
  // Other
  'scale', 'indent', 'aspect',
]);

function getUtilityGroupParts(className: string): { group: string | null; hasNumericModifier: boolean } {
  const base = className.replace(/^.*:/, '').trim();
  const parts = base.split('-');

  let group = parts[0];
  if (parts.length > 2 && SIMPLE_NUMERIC_PREFIXES.has(`${parts[0]}-${parts[1]}`)) {
    group = `${parts[0]}-${parts[1]}`;
  }

  const finalGroup = SIMPLE_NUMERIC_PREFIXES.has(group) ? group : null;

  const lastPart = parts[parts.length - 1];
  const hasNumericModifier = /^\d+$/.test(lastPart); // only true if last part is a number

  return {
    group: finalGroup,
    hasNumericModifier,
  };
}

const rule: TSESLint.RuleModule<'duplicateGroup'> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow contradicting Tailwind utility classes with the same numeric group prefix',
    },
    messages: {
      duplicateGroup: 'Multiple classes use the same utility group "{{group}}": {{conflicts}}',
    },
    schema: [],
  },

  create(context) {
    const checkClassNames = (classNames: string[], node: Attribute) => {
      const seenGroups = new Map<string, Set<{ cls: string; hasNumericModifier: boolean }>>();

      for (const raw of classNames) {
        const cls = raw.trim().replace(/^,+|,+$/g, '');
        const [variant, baseClass] = cls.includes(':')
          ? cls.split(/:(.+)/)
          : [null, cls];

        if (variant) continue;

        const { group, hasNumericModifier } = getUtilityGroupParts(baseClass);
        if (!group) continue;

        const entries = seenGroups.get(group) || new Set();
        entries.add({ cls, hasNumericModifier });
        seenGroups.set(group, entries);
      }

      for (const [group, entries] of seenGroups.entries()) {
        const entriesArr = Array.from(entries);
        if (entriesArr.length <= 1) continue;

        const hasBare = entriesArr.some((e) => !e.hasNumericModifier);
        const hasWithModifier = entriesArr.some((e) => e.hasNumericModifier);

        if (hasBare && hasWithModifier && entriesArr.length === 2) {
          // e.g., border + border-gray-200 → ignore
          continue;
        }

        context.report({
          node,
          messageId: 'duplicateGroup',
          data: {
            group,
            conflicts: entriesArr.map((e) => e.cls).join(', '),
          },
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
            .map((name) => name.trim())
            .filter((name) => name && !ALPINE_MARKERS.has(name));
          checkClassNames(classNames, node);
        }

        if (attrName === ':class') {
          // Match all string keys in object syntax like: { 'foo bar': condition }
          const matches = rawValue.match(/'([^']+?)'\s*:/g) || [];
        
          for (const match of matches) {
            const rawKey = match.replace(/['":]/g, '').trim();
            const classNames: string[] = [];
        
            rawKey.split(/\s+/).forEach((name) => {
              const clean = name.trim();
              if (clean && !ALPINE_MARKERS.has(clean)) {
                classNames.push(clean);
              }
            });
        
            checkClassNames(classNames, node);
          }
        }
      },
    };
  },
};

export default rule;
