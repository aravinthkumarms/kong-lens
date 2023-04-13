module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    ecmaVersion: 2021
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    'no-unused-expressions': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['warn'],
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
      },
    ],
    'max-len': ['off', { code: 80 }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/function-component-definition': 'off',
    'react/react-in-jsx-scope': 'off',
    'camelcase':'off',
    'no-nested-ternary': 'warn'
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
