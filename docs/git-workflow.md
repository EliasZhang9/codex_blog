# Git Workflow

## Git Safety Rules

- `master` is protected and treated as read-only.
- Never run work directly on `master`.
- Never commit on `master`.
- Never push to `master`.
- Never merge or rebase while checked out on `master`.
- Always use a task branch named with a conventional type prefix, for example: `fix/<short-task-name>`, `chore/<short-task-name>`, `feat/<short-task-name>`.
- If the task is tied to a GitHub issue the user explicitly asked to work on, append the issue number at the end of the branch name, for example: `fix/<short-task-name>#4`.
- If the task is not tied to a GitHub issue the user explicitly asked to work on, do not include an issue number in the branch name.
- If the task is not a new issue, continue on the current working non-`master` task branch when appropriate and do not create a new branch.

## Required Branch Workflow

1. Sync base branch:
   - `git fetch --all --prune`
   - `git switch master`
   - `git pull --ff-only`
2. Create a task branch:
   - `git switch -c <type>/<short-task-name>`
   - Examples: `git switch -c fix/login-timeout`, `git switch -c chore/update-readme`
3. Do all edits and commits on that non-`master` task branch only.
4. Push branch and open a PR into `master`:
   - `git push -u origin <type>/<short-task-name>`

## Issue Workflow

1. Confirm the issue is OPEN before starting.
2. Switch to `master` and update it before creating the issue branch:
   - `git switch master`
   - `git pull --ff-only`
3. If the user explicitly asked to work on GitHub issue `#4`, create a branch from updated `master` that includes the branch type and ends with the issue number:
   - `git switch -c <type>/<short-task-name>#4`
   - Example: `git switch -c fix/login-timeout#4`
   - When using an issue number, explicitly show the full branch name to the user before or when starting work.
4. Commit with messages that reference the issue:
   - `git commit -m "feat: <change summary> (#4)"`
5. Open a PR into `master` and include an auto-close keyword in the PR body at creation time only when the PR is explicitly tied to a GitHub issue:
   - `Closes #4`
   - Example: `gh pr create --base master --title "feat: <change summary>" --body "Closes #4"`
   - If the user does not explicitly say the PR is issue-related, do not add `Closes #...`, `Fixes #...`, or `Resolves #...`.
6. After merge, delete branch:
   - local: `git branch -d <type>/<short-task-name>#4`
   - remote: `git push origin --delete <type>/<short-task-name>#4`

## Safety Stops

- If currently on `master`, do not edit files until a non-`master` task branch is created.
- If a command would modify `master` directly, stop and choose a task branch such as `fix/*`, `chore/*`, or `feat/*` instead.
- Do not use destructive git commands such as `git reset --hard`, force push, or `git checkout -- .` unless the user explicitly requests them.

## Remote Protection

- Enable branch protection on `master` in the Git host:
  - block direct pushes
  - require pull requests
  - require status checks or review before merge
