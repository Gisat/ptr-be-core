## [58.4.0](https://github.com/Gisat/ptr-be-core/compare/v58.3.0...v58.4.0) (2026-08-27)

### Features

* add attributeSet node type ([b9244ad](https://github.com/Gisat/ptr-be-core/commit/b9244ad9ecb755b9c4015987e1c0174edd06baf3))

## [58.3.0](https://github.com/Gisat/ptr-be-core/compare/v58.2.0...v58.3.0) (2026-08-25)

### Features

* add equalMany filter to SQL builder and CSV format ([4c5d98d](https://github.com/Gisat/ptr-be-core/commit/4c5d98db5531848cd53cc8c835a7a287e937dfd7))
* add optional polygon geometry to filter chain and CSV format ([1771510](https://github.com/Gisat/ptr-be-core/commit/1771510aa39e91efb8dea5bf784da684f69c1b00))

## [58.2.0](https://github.com/Gisat/ptr-be-core/compare/v58.1.0...v58.2.0) (2026-08-22)

### Features

* add Base64url encoding/decoding for URL-safe filter CSV transport ([d618bf7](https://github.com/Gisat/ptr-be-core/commit/d618bf7d344b096dfca956449ad0c8fdde59a39c))
* add chaining support to filter builder with nextAttribute and multi-line CSV ([b0ba682](https://github.com/Gisat/ptr-be-core/commit/b0ba6820e39b3df66ff500f6fc1b12fa32be7fe6))
* add returnLineCSV and parseFilterCSV for CSV transport format ([5b995e7](https://github.com/Gisat/ptr-be-core/commit/5b995e7a689c2a7ae4746400737b27ceb63e663a))
* export PantherFilter, parsePantherFilterCSV and PantherAttributeQuery from browser entry ([93c4643](https://github.com/Gisat/ptr-be-core/commit/93c4643898826250f65121a15f0b060fe8ffa359))

## [58.1.0](https://github.com/Gisat/ptr-be-core/compare/v58.0.3...v58.1.0) (2026-08-14)

### Features

* Added enums for HTTP headers used across services ([7d8cb63](https://github.com/Gisat/ptr-be-core/commit/7d8cb63bc57ed9a6a32eefa18b0767d52a3cc90e))
* implement staging changes for ptr-be-core ([8aaf119](https://github.com/Gisat/ptr-be-core/commit/8aaf119af98e3813c837496f443b6ef01a9e17c9))

### Bug Fixes

* **feedback file:** remove unused dependencies and fixed eslint rules ([d8eb3a7](https://github.com/Gisat/ptr-be-core/commit/d8eb3a7936799e55a7a67777f4acef0851098d2e))
* npm cleaning ([a02263c](https://github.com/Gisat/ptr-be-core/commit/a02263ce60134a0d167743fb93e5934682c1caa8))

## [58.0.3](https://github.com/Gisat/ptr-be-core/compare/v58.0.2...v58.0.3) (2026-07-29)

### Bug Fixes

* Merge pull request [#62](https://github.com/Gisat/ptr-be-core/issues/62) from Gisat/jul26-remove-sqlite ([34f4466](https://github.com/Gisat/ptr-be-core/commit/34f4466e3aea7e8841bbffbbf13f19d18c893873))

## [58.0.2](https://github.com/Gisat/ptr-be-core/compare/v58.0.1...v58.0.2) (2026-07-02)

## [58.0.1](https://github.com/Gisat/ptr-be-core/compare/v58.0.0...v58.0.1) (2026-07-02)

## [58.0.0](https://github.com/Gisat/ptr-be-core/compare/v57.1.2...v58.0.0) (2026-06-02)

### ⚠ BREAKING CHANGES

* resolve moderate npm audit vulnerabilities

### security

* resolve moderate npm audit vulnerabilities ([b3f0d73](https://github.com/Gisat/ptr-be-core/commit/b3f0d736f7bc8a7786c01829232459a0f4e02912))

## [57.1.2](https://github.com/Gisat/ptr-be-core/compare/v57.1.1...v57.1.2) (2026-05-27)

### Bug Fixes

* lazy load sqlite3 native module to prevent GLIBC errors at import time ([47f183e](https://github.com/Gisat/ptr-be-core/commit/47f183e3bb71b230db9c20e8b8ddbe44409f6e80))

## [57.1.1](https://github.com/Gisat/ptr-be-core/compare/v57.1.0...v57.1.1) (2026-05-12)

### Bug Fixes

* types in build ([5352909](https://github.com/Gisat/ptr-be-core/commit/53529090ae8ef394096bdaaefb562d8c16d5e6b1))
* update .gitignore and TypeScript config files to include rootDir and include paths ([2b00f38](https://github.com/Gisat/ptr-be-core/commit/2b00f38338d6b92d01393ac9c2c75f6eb81e043b))

## [57.1.0](https://github.com/Gisat/ptr-be-core/compare/v57.0.0...v57.1.0) (2026-05-06)

### Features

* edit commands ([39cf0ec](https://github.com/Gisat/ptr-be-core/commit/39cf0ec7cc5e639128c2330466b59645e0fc96eb))

# [57.0.0](https://github.com/Gisat/ptr-be-core/compare/v56.0.0...v57.0.0) (2026-04-14)


* refactor!: use semantic-release for automated releases ([b63096c](https://github.com/Gisat/ptr-be-core/commit/b63096c3b42da67647dcdbcb5fc43d5d14fd2cd8))


### Bug Fixes

* update actions/create-github-app-token to v3 ([559c291](https://github.com/Gisat/ptr-be-core/commit/559c291c418b7366b37a55af807fef5c2713aad1))


### Features

* add semantic-release configuration ([c1134fb](https://github.com/Gisat/ptr-be-core/commit/c1134fb038e8f8ad01ac2d7e10ca4f1c2a100b6e))


### BREAKING CHANGES

* Replace manual npm publish and version bump workflows with semantic-release for automated releases. Version 56.0.0 has been released.
