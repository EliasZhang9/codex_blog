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

## Safety Stops

- If currently on `master`, do not edit files until a `codex/*` branch is created.
- If a command would modify `master` directly, stop and choose a `codex/*` branch instead.
- Do not use destructive git commands (for example: `git reset --hard`, force push, `git checkout -- .`) unless the user explicitly requests them.

## Remote Protection (Recommended)

- Enable branch protection on `master` in the Git host:
  - block direct pushes
  - require pull requests
  - require status checks/review before merge
