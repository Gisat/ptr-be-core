# Bepack NPM
Shared backend functionality like logging, general database methods, parsing, code helpers etc.

Main output is NPM package `bepack`, which can be imported into other backend projects.

Rest of the project works as sandbox and backend demo field.

## Structure of the NPM part

Here is the main structure of the project:

- src (code content)
- `index.ts` (generated automaticly by `barrelsby`)
- doc (NPM documentation)
- config files


## Build of the NPM
- Open terminal in the `/bepack`
- Run `npm run build`

Check `package.json` for build steps.

## Technologies
- Typescript (https://www.typescriptlang.org/docs/)
- Barrelsby for indexing (https://github.com/bencoveney/barrelsby)