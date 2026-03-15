# AGENTS.md

## Git Safety Rules (Mandatory)

- `master` is protected and treated as read-only.
- Never run work directly on `master`.
- Never commit on `master`.
- Never push to `master`.
- Never merge or rebase while checked out on `master`.
- Always use a feature branch named: `codex/<short-task-name>`.

## Required Branch Workflow

1. Sync base branch:
   - `git fetch --all --prune`
   - `git switch master`
   - `git pull --ff-only`
2. Create a task branch:
   - `git switch -c codex/<short-task-name>`
3. Do all edits and commits on that `codex/*` branch only.
4. Push branch and open a PR into `master`:
   - `git push -u origin codex/<short-task-name>`

## Issue Workflow (for new OPEN issues, e.g. `#4`)

1. Confirm the issue is OPEN before starting.
2. Create a branch from updated `master` using the issue number:
   - `git switch -c codex/issue-4-<short-task-name>`
3. Commit with messages that reference the issue:
   - `git commit -m "feat: <change summary> (#4)"`
4. Open a PR into `master` and include an auto-close keyword in PR body:
   - `Closes #4`
5. After merge, delete branch:
   - local: `git branch -d codex/issue-4-<short-task-name>`
   - remote: `git push origin --delete codex/issue-4-<short-task-name>`

## Safety Stops

- If currently on `master`, do not edit files until a `codex/*` branch is created.
- If a command would modify `master` directly, stop and choose a `codex/*` branch instead.
- Do not use destructive git commands (for example: `git reset --hard`, force push, `git checkout -- .`) unless the user explicitly requests them.

## Remote Protection (Recommended)

- Enable branch protection on `master` in the Git host:
  - block direct pushes
  - require pull requests
  - require status checks/review before merge
