# Shared Library for Panther Backend
This repository contains source of shared functionalities across Panther backend services.

## Installation (DEV)
- Install Node and NPM
- Install YALC by `npm install -g yalc`
- Clone the package repository.
- Open terminal in package root.
- Run `npm i` and `npm run build` to install dependencies and make a build of the NPM package.
- Run `npm run yalc:publish` for local publishing the package into yalc repository. 
- Now you can add this package for local development by opening the target application repository and run `yalc add @gisatcz/ptr-be-core`
- Run `npm run dev` for development mode with Rollup build watcher and auto yalc publishing.

## Usage in Applications
- FE based apps should use imports from `@gisatcz/ptr-be-core/browser`
- NodeJS based apps should use imports from `@gisatcz/ptr-be-core/node`

## Resources
- YALC (local NPM): https://github.com/wclr/yalc
- Vitest (testing): https://vitest.dev
- Barrelsby (TS Imports into one `index.ts`): https://github.com/bencoveney/barrelsby
- Rollup (NPM package build): https://rollupjs.org
