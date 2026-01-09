---
applyTo: "**/*"
---

# Build strategy for this repository
- This repository product is NPM package (library) written in TypeScript.
- The package targets two runtimes: browser and Node.js.
- The build system uses `rollup` to create two separate bundles: one for browser and one for Node.js.
- Each bundle has its own entrypoint: `src/index.browser.ts` for browser and `src/index.node.ts` for Node.js.
- The build process also generates TypeScript declaration files (`.d.ts`) for type safety.
- The built artifacts are placed in the `dist/` directory.
- The package is published locally using `yalc` for testing in other projects before actual publishing to a package registry.
- The build and publish process is automated using NPM scripts defined in `package.json`.
- Check the `rollup.config.js` for detailed build configuration and options.
- Check all tsconfig*.json files for TypeScript compilation settings.