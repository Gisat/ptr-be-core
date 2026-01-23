# NPM Refresh Commands

Short description: commands to reinstall peer and dev dependencies using the newest published majors. The peer-dependency install uses `--no-save` to avoid moving peer entries into `dependencies`.

1) Install peer dependencies (use latest published versions, do not modify package.json):

```
npm install lodash@latest luxon@latest pino@latest sqlite@latest sqlite3@latest --no-save
```

2) Install devDependencies (use latest published versions and save to `devDependencies`):

```
npm install @rollup/plugin-json@latest @rollup/plugin-node-resolve@latest @rollup/plugin-typescript@latest @types/lodash@latest @types/luxon@latest @types/node@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest eslint-plugin-node@latest rollup@latest rollup-plugin-dts@latest ts-node@latest tsc-alias@latest tsconfig-paths@latest tslib@latest tsx@latest typescript@latest typescript-eslint@latest vite@latest vite-tsconfig-paths@latest vitest@latest --save-dev
```

Run these two commands from the repository root to refresh packages.
