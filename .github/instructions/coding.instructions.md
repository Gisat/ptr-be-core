---
applyTo: "src/**/*.ts"
---

# General programming style guidelines for this repository
- Code is written in TypeScript.
- Use ES modules (`import` / `export`) for module management.
- Prefer functional programming paradigms where possible.
- Write small, single-responsibility functions.
- Use explicit types for function parameters and return types.
- Use async/await for asynchronous operations.
- Handle errors gracefully using try/catch blocks.
- Write JSDoc comments for all public functions and classes.
- Prefer arrow functions for anonymous functions.
- Use modern ECMAScript features (e.g., destructuring, spread/rest operators).
- Keep code DRY (Don't Repeat Yourself) by reusing functions and modules.
- Use function prefixes to group them by purpose (e.g., `parse`, `validate`, `fetch`, `calculate`).