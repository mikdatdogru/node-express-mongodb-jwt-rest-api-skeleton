import eslintJs from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  eslintJs.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: await import('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env']
        }
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        Promise: 'readonly',
        async: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        test: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly'
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'callback-return': 'off',
      camelcase: [
        'warn',
        {
          properties: 'always'
        }
      ],
      'comma-style': ['warn', 'last'],
      curly: ['error'],
      eqeqeq: ['error', 'always'],
      'eol-last': ['warn'],
      'no-undef': 'error',
      'handle-callback-err': ['error'],
      'arrow-body-style': ['off'],
      indent: ['off'],
      'linebreak-style': ['error', 'unix'],
      'no-dupe-keys': ['error'],
      'no-duplicate-case': ['error'],
      'no-extra-semi': ['warn'],
      'no-labels': ['error'],
      'no-mixed-spaces-and-tabs': ['error'],
      'no-redeclare': ['warn'],
      'no-return-assign': ['error', 'always'],
      'no-sequences': ['error'],
      'no-trailing-spaces': ['warn'],
      'no-unexpected-multiline': ['warn'],
      'no-unreachable': ['warn'],
      'no-magic-numbers': ['off'],
      'max-params': ['off'],
      'max-len': ['off'],
      'max-nested-callbacks': ['off'],
      'new-cap': ['off'],
      'consistent-this': ['error', 'that'],
      'no-unused-vars': [
        'error',
        {
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^unused($|[A-Z].*$)'
        }
      ],
      'no-use-before-define': [
        'error',
        {
          functions: false
        }
      ],
      'no-var': 'error',
      'no-useless-catch': 'off',
      'no-async-promise-executor': 'off',
      'one-var': ['warn', 'never'],
      'prefer-arrow-callback': [
        'warn',
        {
          allowNamedFunctions: true
        }
      ],
      quotes: [
        'warn',
        'single',
        {
          avoidEscape: false,
          allowTemplateLiterals: true
        }
      ],
      'semi-spacing': [
        'warn',
        {
          before: false,
          after: true
        }
      ],
      'semi-style': ['warn', 'last'],
      'space-before-function-paren': ['off'],
      'prettier/prettier': 'error'
    }
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        test: 'readonly'
      }
    }
  }
]
