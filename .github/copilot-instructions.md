- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements (ask for project type, language, and frameworks if not specified)

- [x] Scaffold the Project (ensure prior step is completed, call project setup tool, scaffold in current directory)

- [x] Customize the Project (plan modifications per requirements and apply them)

- [x] Install Required Extensions (only those returned by get_project_setup_info)

- [x] Compile the Project (install dependencies, run diagnostics, resolve issues)

- [x] Create and Run Task (create tasks.json if needed and execute it based on project structure)

- [x] Launch the Project (confirm with user before running the dev server)

- [x] Ensure Documentation is Complete (keep README and this file current)

Execution guidelines
- Track progress with the todo list, mark each step complete with a short summary, and reread status before new work.
- Keep explanations concise and avoid dumping command output unless necessary.
- Work in the project root, avoid unnecessary folders or media, and only install extensions specified by get_project_setup_info.
- Assume Hello World only if the user gives no details; otherwise confirm features before building them.
- Use VS Code API references only for extension projects.
- The task is complete when the project scaffolds and compiles without errors, README and this file are up to date, and the user knows how to launch/debug the app.
