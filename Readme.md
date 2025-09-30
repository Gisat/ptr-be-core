# Shared Library for Panther Backend
This repository contains source of shared functionalities across Panther backend services.

## Installation
- Install Node and NPM
- Install YALC by `npm install -g yalc`
- Clone the geoimage package repository (https://github.com/Gisat/deck.gl-geotiff-dev)
- Open terminal in package root.
- Run `npm i` and `npm run build` to install dependencies and make a build of the NPM package.
- Run `npm run yalc:publish` for local publishing the package into yalc repository. 
- ...or `npm run dev` for development mode with Rollup build watcher and auto yalc publishing.
- Now you can add this package for local development by opening the target application repository and run `yalc add @gisatcz/ptr-be-core`