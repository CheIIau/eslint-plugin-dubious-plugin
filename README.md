# eslint-plugin-dubious-plugin [![npm](https://img.shields.io/badge/npm-v1.5.2-blue.svg)](https://www.npmjs.com/package/eslint-plugin-dubious-plugin)

## Check import paths according to FSD

The plugin contain 4 rules:

1. different-layer-absolute-import (Prevents the use of relative import to import from other layers)
2. underlying-layer-imports (Prevents to import a layer from underlying layer)
3. public-api-import-slice (Check if a module was imported using a public API)
4. different-layer-export (Prevents exporting a module from another layer)
5. same-slice-local-import (Prevents the use of absolute import within one slice)

## Rule options

First 4 rules (**different-layer-absolute-import**, **underlying-layer-imports**, **public-api-import-slice**, **different-layer-export**) have all the options below. The last one (same-slice-local-import) has only **_alias_** option. Also **public-api-import-slice**, **public-api-import-slice** and **same-slice-local-import** rules have autofix.

```
{
        alias: string, // alias for absolute import folder (e.g. "src" or "@")
        ignoreFiles: string[], // ignored files to check with the given pattern (e.g. '**/*.test.*')
        ignoreImportPatterns: string[] // ignored import declaration string to check with the given pattern (e.g. '**/StoreProvider/**')
},
```

## Example of use

```js
// .eslintrc.js

{
       'dubious-plugin/public-api-import-slice': [
            'error',
            { alias: 'src', ignoreFiles: ['**/*.test.*', '**/*.stories.*'] },
        ],
        'dubious-plugin/underlying-layer-imports': [
            'error',
            {
                alias: 'src',
                ignoreImportPatterns: ['**.scss', '**/StoreProvider/**'],
                ignoreFiles: ['**/*.test.*', '**/*.stories.*'],
            },
        ],
        'dubious-plugin/different-layer-absolute-import': [
            'error',
            {
                alias: 'src',
                ignoreFiles: ['**/*.test.*', '**/*.stories.*'],
            },
        ],
},
```
