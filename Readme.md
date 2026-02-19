# NPM Library for Panther Backends
NPM package with shared functionalities across Panther projects (FE and BE).

## Build and Outputs
The NPM contains two standalone builds made from Typescript by Rollup. 

- Globals NPM (FE + BE): 
    - From `index.browser.ts` containing exports from `src/globals/**/*`. 
    - This is shared functionality between FE and BE services like models, code helpers etc.. 

- Node NPM: 
    - Containes all from globals
    - By `index.node.ts` containing exports from `src/node/**/*`. This is Node JS only funtionality. Everything with peer dependency to Node.js packages should be here. 

Production build and publishing is realised by Github Workflow.

### Rollup and Package.json
As mentioned, Rollup set up in `rollup.config.js` make two standalone builds named by purpose. 

Important is setup in `package.json`
- `type` with value `module`
- `exports`, each for one NPM target 

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
- FE apps (in browser) should use imports from `@gisatcz/ptr-be-core/browser`
- Node.js apps and NextJS backend routes should use imports from `@gisatcz/ptr-be-core/node`

## Resources
- YALC (local NPM): https://github.com/wclr/yalc
- Vitest (testing): https://vitest.dev
- Barrelsby (TS Imports into one `index.ts`): https://github.com/bencoveney/barrelsby
- Rollup (NPM package build): https://rollupjs.org

## AI Agents (Important)
Please folow instructions in `.github/` for better code results.