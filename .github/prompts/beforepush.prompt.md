---
agent: agent
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'agent', 'todo']
description: 'Run all steps needed for clean push to the repository like linting, building, testing, etc.'
---
Before we push code to the repository, we need to ensure that everything is in order.

Process:
1. In terminal run `npm run before:push` to check if linting, building, and testing pass successfully.
2. If any of the steps fail, fix the issues:
   - For linting issues, refer to ESLint output and fix code style or errors.
   - For build issues, check TypeScript errors and fix them.
   - For test failures, review test output, identify failing tests, and fix the underlying issues.
3. After fixing issues, repeat step 1 until all steps pass successfully.
4. Once all checks pass, proceed to commit and push the code to the repository.