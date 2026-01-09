---
applyTo: "src/tests/**/*.spec.ts, src/tests/**/*.test.ts"
---

# Testing Instructions for this repository
- All tests are located in the `src/tests/` directory.
- Use Vitest as the testing framework.
- Write tests in TypeScript for type safety.
- Try to avoid mocking libraries. Prefer to create own mocks or stubs as needed.

## Test content folder structure
- Test files should have a `.spec.ts` suffix.
- Test cases, that do not require external dependencies as databases or APIs, should be placed in `src/tests/functional/`.
- Integration tests, that require external dependencies, should be placed in `src/tests/integration/`.
- Test-only helpers should be placed in `src/tests/tools/`.
- Fixtures as test data or test files should be placed in `src/tests/fixtures/`.

## Test file structure
- Name each test file with the name of the module structure it is testing, followed by `.spec.ts`. Example: `parsing.dates.spec.ts`, `api.errors.spec.ts` etc.
- Inside the test file, use single `describe` block with human-readable description.
- Each `it` block should have human readable description and test a single behavior or scenario.
- Use `beforeAll`, `beforeEach`, `afterAll`, and `afterEach` hooks as needed for setup and teardown.
- In the case of async operations, use `async/await` syntax for clarity in `it` blocks.
