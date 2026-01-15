---
agent: agent
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'agent', 'todo']
description: 'Run all steps needed for clean push to the repository like linting, building, testing, etc.'
---

- Make code review of all unstaged and uncommitted changes in the working directory using rules defined in `.github/instructions/coding.instructions.md` .
- Add your comments and suggestions for improvements directly in the code using inline comments.
- Fix any issues found during the code review.
- After fixing issues, run `npm run before:push` to ensure linting, building, and testing pass successfully.
- If any of the steps fail, fix the issues:
  - For linting issues, refer to ESLint output and fix code style or errors.
  - For build issues, check TypeScript errors and fix them.
  - For test failures, review test output, identify failing tests, and fix the underlying issues.
- After fixing issues, repeat the `npm run before:push` step until all steps pass successfully.
- Once all checks pass, proceed to commit and push the code to the repository.