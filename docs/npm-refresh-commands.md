# NPM Refresh Commands

Clean reinstall of every declared NPM package to its newest major version. Remove the existing install and lockfile first, then reinstall.

## Process

1. Delete `node_modules` and `package-lock.json`.
2. Install `peerDependencies` (runtime packages) so they stay peer dependencies.
3. Install `devDependencies` (development-only packages).
4. Rebuild and verify with `npm run before:push`.

Packages required at runtime belong in `peerDependencies`; everything else belongs in `devDependencies`. This package currently has no runtime packages (the code only relies on Node.js built-ins), so the peer-dependency step installs nothing.

## Clean existing install

```sh
rm -rf node_modules && rm -f package-lock.json
```

## Install peer dependencies

There are currently no packages in `peerDependencies`, so no peer-dependency install command is needed. When runtime peer dependencies are added, install them with `npm install <packages> --save-peer` so they remain in `peerDependencies` rather than `dependencies`.

## Install development dependencies

```sh
npm install @types/node@latest vitest@latest @stylistic/eslint-plugin@latest eslint@latest typescript-eslint@latest @rollup/plugin-node-resolve@latest @rollup/plugin-typescript@latest rollup@latest tslib@latest --save-dev
npm install typescript@6.0.3 --save-dev
```

TypeScript is pinned to the newest 6.x release because `typescript-eslint` requires TypeScript `<6.1.0`, while the latest release is 7.x.
