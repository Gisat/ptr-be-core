---
agent: agent
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'agent', 'todo']
description: 'Refresh all NPM packages to newest major version'
---
We need to make clean reinstall of all NPM packages. We expect need to solve futher compatibility issues. 

Process:
1. delete `node_modules` folder
2. delete `package-lock.json` file
3. read `package.json` and prepare two CLIs:
    - one for installing all dependencies in `peerDependencies` with `npm install <packages_in_peerDependencies> --save`
    - second for installing all devDependencies in `devDependencies` with `npm install <packages_in_devDependencies> --save-dev`
5. save both CLIs into `docs/npm-refresh-commands.md` file with header "NPM Refresh Commands" and short description of the process
6. execute both CLIs
7. check if `package.json` needs to be restructured according to `.github/instructions/package-json.instructions.md` file, if yes, restructure it
8. run `npm run before:push` to check if everything is fine
9. if there are any issues, fix them (like compatibility issues, missing types, etc.)
10. repeat from step 8 until everything is fine
11. finally create a summary of all changes made in this process, including major version updates and any issues encountered and how they were resolved.