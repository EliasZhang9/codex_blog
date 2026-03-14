# Playful Forum (Full Stack)

A humorous community forum/blog with a playful React UI and a production-leaning FastAPI backend.

## Project structure

```text
project-root/
  frontend/
  backend/
```

## Backend setup

```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Backend URL: `http://localhost:8000`

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

If backend runs on another host/port:

```bash
set VITE_API_URL=http://localhost:8000
npm run dev
```

## Features

- Register / login / logout with JWT auth.
- Create, edit, delete posts (author-only edits/deletes).
- Comment on posts, edit/delete own comments.
- Emoji reactions (`fire`, `laugh`, `mindblown`) persisted in backend.
- Multilingual UI (English, German, Spanish) via `react-i18next`.
- Playful styling, motion effects, chaos mode toggle, and toast notifications.

## API overview

- `POST /register`
- `POST /login`
- `GET /me`
- `GET /posts`
- `GET /posts/{id}`
- `POST /posts`
- `PUT /posts/{id}`
- `DELETE /posts/{id}`
- `POST /posts/{id}/comments`
- `PUT /comments/{id}`
- `DELETE /comments/{id}`
- `POST /posts/{id}/react`
- `GET /users/{username}`

## Tests

```bash
cd backend
pytest
```
