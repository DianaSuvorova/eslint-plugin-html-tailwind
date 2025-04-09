import noContradictingClassNames from './rules/no-contradicting-classnames';
import classnameOrder from './rules/classname-order';
import noStyleAttribute from './rules/no-style-attribute';

export const rules = {
  'no-contradicting-classnames': noContradictingClassNames,
  'classname-order': classnameOrder,
  'no-style-attribute':  noStyleAttribute
};

export const configs = {
  recommended: {
    plugins: ['html-tailwind'],
    rules: {
      'html-tailwind/no-contradicting-classnames': 'error',
      'html-tailwind/no-style-attribute': 'error',
      'html-tailwind/classname-order': 'warn',
    },
  },
};
