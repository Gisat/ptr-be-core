---
applyTo: "package.json"
---

# How to structure `package.json`
- As this is a NPM package, use no `dependencies`. Only `peerDependencies` and `devDependencies` are allowed. 
- Keep dependencies in `peerDependencies` and `devDependencies` properly separated. Only packages required at runtime should be in `peerDependencies`.
- Ensure that ESLint and its plugins are listed under `devDependencies` since they are only needed during development.

## NPM Structure Rules
- Type must be set to `module`
- Use `exports` field to define entry points for the package
- Use `files` field to specify which files should be included when the package is published

## Overall Structure of the `package.json` file
- Should contain at least these fields in this order from top to bottom:
  1. name
  2. version
  3. description
  4. type

- After this header shold be be `files` definition pointing to `dist` folder

- After `files` should be `exports` part defining entry points:

    - browser part with name `./browser` contains: 
      - import entry point: `./dist/index.browser.js`
      - default entry point: `./dist/index.browser.js`
      - types entry point: `./dist/index.browser.d.ts`

    - nodejs part with name `./node` contains: 
      - require entry point: `./dist/index.node.cjs`
      - default entry point: `./dist/index.node.js`
      - types entry point: `./dist/index.node.d.ts`

    - "./package.json": "./package.json"

- After this header should be:
  1. scripts part
  2. peerDependencies part
  3. devDependencies part

- Than can be other parts (like repository, keywords, author, license, etc.)

## PeerDependencies part
Structure of dependencies should be:
  1. Anything starts with `@gisatcz/` (internal packages)
  2. Database related (like `mongoose`, `neo4j`, `ioredis`, etc.)
  3. Security related parts (like `bcrypt`, `jsonwebtoken`, `openid-client` etc.)
  4. Other production dependencies 

## DevDependencies part
Structure of DEV dependencies should be:
  1. All packages starting with `@types/` (TypeScript type definitions) 
  2. Anything related to testing (like `vitest`, `jest`, etc.)
  3. Anything related to linting (like `eslint`, `typescript-eslint`, etc.)
  4. Eerything related to building/bundling (like `rollup`, `esbuild`, etc.)
  5. All related with typescript and building (like `typescript`, `tsc-alias`, `tsx`, etc.)
  6. Other development dependencies

## Scripts part
Scripts part should be structured as:
  1. dev related scripts (like `dev`, `dev:watch`, etc.)
  2. build related scripts (like `build`, `build:prod`, etc.)
  3. lint related scripts (like `lint`, `lint:fix`, etc.)
  4. test related scripts (like `test`, `test:watch`, etc.)
  5. `yalc` related scripts (like `yalc:publish`, `yalc:publish:push`, etc.)
  6. before push script (combination of lint, build and test. Example is `before:push`)
  7. other scripts