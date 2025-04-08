import noContradictingClassNames from './src/rules/no-contradicting-classnames';
import classnameOrder from './src/rules/classname-order';

export const rules = {
  'no-contradicting-class-names': noContradictingClassNames,
  'classname-order': classnameOrder,
};

export const configs = {
  recommended: {
    plugins: ['html-tailwind'],
    rules: {
      'html-tailwind/no-contradicting-class-names': 'error',
      'html-tailwind/classname-order': 'warn',
    },
  },
};
