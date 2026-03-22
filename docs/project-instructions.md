# Project Instructions

## Project Overview

- This repository is a full-stack forum and blog project with a React frontend in `frontend/` and a FastAPI backend in `backend/`.
- The product is a playful community app with authentication, posts, comments, emoji reactions, and multilingual UI support.

## Repository Structure

- `frontend/`: Vite + React application UI.
- `frontend/src/`: application source including pages, components, API helpers, context, hooks, and translations.
- `backend/`: FastAPI application, tests, environment files, and local database files.
- `backend/app/`: backend API, core config, database, models, and schemas.
- `backend/tests/`: backend test suite.
- `docs/`: operational and project documentation.

## Working Rules For This Project

- Preserve the split between frontend and backend responsibilities.
- Keep API changes aligned with the frontend behavior that depends on them.
- Treat multilingual UI support as part of the product, not an optional add-on.
- Do not commit generated artifacts, local virtual environments, or local database files.
- Prefer changes that fit the existing playful forum/blog product instead of introducing unrelated patterns.

## Common Local Entry Points

- Frontend dev server: run from `frontend/` with `npm run dev`.
- Backend dev server: run from `backend/` with `uvicorn main:app --reload`.
- Backend tests: run from `backend/` with `pytest`.
