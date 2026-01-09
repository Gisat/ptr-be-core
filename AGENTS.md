# Copilot / AI Agent Instructions — ptr-be-core
Shared TypeScript library for backend and frontend applications of the Panther project.

## Important Rule
Read and folow all `.github/instructions/*` files for code and practises clarity.

## Repository Summary
- This repo is a shared TypeScript library used by backend and frontend apps. 
- It builds two entrypoints: `browser` and `node` (see `src/index.browser.ts` and `src/index.node.ts`). 
- Node entrypoint includes server-only APIs and helpers (e.g., logging, API response models, Arrows.json parsing).
- As build system, it uses `rollup` to produce ESM bundles in `dist/`.
- The package is published locally with `yalc` for local integration and testing.

## Mandatory folders / files
- `src/`: main source code in TypeScript.
- `tests/`: unit tests using Vitest.
- `src/globals/`: global types and interfaces for both frontend and backend.
- `src/node/`: Node.js specific code
- `src/index.browser.ts`: exports for browser runtime.
- `src/index.node.ts`: exports for Node.js runtime.
- `dist/`: built artifacts (do not edit directly).
- `package.json`: project metadata, scripts, and dependencies.
- `rollup.config.js`: build configuration for rollup.
- `tsconfig.json`: TypeScript configuration.
- `vitest.config.ts`: configuration for Vitest test runner.
- `docs/`: documentation files (if any).
- `.github/`: GitHub-specific files including workflows and instructions.

# Testing and Linting
- Using Vitest as the test framework and typescript for type safety.
- Please folow `.github/instructions/testing.instructions.md` for testing-related guidelines.
- This project uses ESLint major version 8 for code linting.
- Read `eslint.config.js` for detailed linting rules and configurations.

# Build and Publish goals
- Always build two bundles: browser and node.
- Use `rollup` for bundling.
- Build declaration files (`.d.ts`) for type safety.
- Publish the package locally using `yalc` for testing in other projects before actual publishing.
- Read `.github/instructions/build.instructions.md` for detailed build and publish guidelines.
