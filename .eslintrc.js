const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    // ! 解决 ESLint 和 Prettier 的规范冲突，放在最后。
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
    'prettier/unicorn'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: ['react', 'unicorn', 'promise', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.js', '.json']
      },
      webpack: {
        config: './scripts/config/webpack.common.js'
      },
      typescript: {}
    }
  },
  rules: {
    // ! 解决在 ts、tsx 文件中引入其他文件模块报错。
    'import/extensions': [
      ERROR,
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never'
      }
    ],
    // ! 解决 webpack-merge 报错：'webpack-merge' should be listed in the project's dependencies, not devDependencies.
    'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }],
    'import/prefer-default-export': OFF,
    'import/no-unresolved': ERROR,

    'unicorn/better-regex': ERROR,
    'unicorn/prevent-abbreviations': OFF,
    'unicorn/filename-case': [
      ERROR,
      {
        cases: {
          // 中划线
          kebabCase: true,
          // 小驼峰
          camelCase: true,
          // 下划线
          snakeCase: false,
          // 大驼峰
          pascalCase: true
        }
      }
    ],
    'unicorn/no-array-instanceof': WARN,
    'unicorn/no-for-loop': WARN,
    'unicorn/prefer-add-event-listener': [
      ERROR,
      {
        excludedPackages: ['koa', 'sax']
      }
    ],
    'unicorn/prefer-query-selector': ERROR,
    'unicorn/no-null': OFF,

    '@typescript-eslint/no-useless-constructor': ERROR,
    '@typescript-eslint/no-empty-function': WARN,
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-explicit-any': OFF,

    'react/jsx-filename-extension': [ERROR, { extensions: ['.tsx', 'ts', '.jsx', 'js'] }],
    'react/jsx-indent-props': [ERROR, 2],
    'react/jsx-indent': [ERROR, 2],
    'react/jsx-one-expression-per-line': OFF,
    'react/destructuring-assignment': OFF,
    'react/state-in-constructor': OFF,
    'react/jsx-props-no-spreading': OFF,
    'react/prop-types': OFF,

    'jsx-a11y/click-events-have-key-events': OFF,
    'jsx-a11y/no-noninteractive-element-interactions': OFF,

    'class-methods-use-this': ERROR,
    'comma-dangle': [ERROR, 'never'],
    'global-require': OFF,
    // indent: [ERROR, 2, { SwitchCase: 1 }],
    'jsx-quotes': [ERROR, 'prefer-single'],
    'lines-between-class-members': [ERROR, 'always'],
    'linebreak-style': [OFF, 'windows'],
    'no-unused-expressions': OFF,
    'no-plusplus': OFF,
    'no-console': OFF,
    'no-shadow': OFF,
    quotes: [ERROR, 'single'],
    semi: [ERROR, 'always'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'react/prefer-stateless-function': OFF,
    'jsx-a11y/anchor-is-valid': OFF,
    'jsx-a11y/no-static-element-interactions': OFF,
    'unicorn/consistent-function-scoping': OFF,
    'promise/catch-or-return': OFF,
    'promise/always-return': OFF,
    'no-restricted-syntax': OFF
  }
};
