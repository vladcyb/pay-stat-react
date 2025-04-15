import js from '@eslint/js'
import pluginImport from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    plugins: {
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
    },
    rules: {
      // Сортировка импортов по группам
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. react и сторонние библиотеки
            ['^react', '^@?\\w'],

            // 2. абсолютные алиасы (@/...)
            ['^@/'],

            // 3. относительные импорты
            ['^\\.'],

            // 4. стили
            ['\\.s?css$'],
          ],
        },
      ],

      // Сортировка экспортов
      'simple-import-sort/exports': 'error',

      // Правила от eslint-plugin-import для надёжности
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  }
)
