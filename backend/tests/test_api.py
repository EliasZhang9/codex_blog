from __future__ import annotations
import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.api.deps import get_db
from app.db.base import Base
from app.main import app

TEST_DB = "sqlite:///./test_forum.db"


def _auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}


def _register(client: TestClient, username: str, email: str, password: str = "password123"):
    return client.post(
        "/register",
        json={"username": username, "email": email, "password": password},
    )


@pytest.fixture()
def client():
    if os.path.exists("test_forum.db"):
        os.remove("test_forum.db")

    engine = create_engine(TEST_DB, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    engine.dispose()
    if os.path.exists("test_forum.db"):
        os.remove("test_forum.db")


def test_auth_register_login_me(client: TestClient):
    register = _register(client, "alice", "alice@example.com")
    assert register.status_code == 201
    token = register.json()["access_token"]

    me = client.get("/me", headers=_auth_headers(token))
    assert me.status_code == 200
    assert me.json()["username"] == "alice"

    login = client.post("/login", json={"email": "alice@example.com", "password": "password123"})
    assert login.status_code == 200
    assert "access_token" in login.json()


def test_duplicate_and_invalid_login(client: TestClient):
    first = _register(client, "bob", "bob@example.com")
    assert first.status_code == 201

    duplicate_email = _register(client, "bobby", "bob@example.com")
    assert duplicate_email.status_code == 400

    bad_login = client.post("/login", json={"email": "bob@example.com", "password": "wrong"})
    assert bad_login.status_code == 401


def test_post_comment_crud_permissions_and_reactions(client: TestClient):
    user_a = _register(client, "charlie", "charlie@example.com").json()
    user_b = _register(client, "dana", "dana@example.com").json()

    headers_a = _auth_headers(user_a["access_token"])
    headers_b = _auth_headers(user_b["access_token"])

    created_post = client.post("/posts", json={"title": "Hello", "content": "World"}, headers=headers_a)
    assert created_post.status_code == 201
    post_id = created_post.json()["id"]

    list_posts = client.get("/posts")
    assert list_posts.status_code == 200
    assert len(list_posts.json()) == 1

    forbidden_edit = client.put(
        f"/posts/{post_id}", json={"title": "Hack", "content": "No"}, headers=headers_b
    )
    assert forbidden_edit.status_code == 403

    comment = client.post(
        f"/posts/{post_id}/comments", json={"content": "Nice post"}, headers=headers_b
    )
    assert comment.status_code == 201
    comment_id = comment.json()["id"]

    forbidden_comment_delete = client.delete(f"/comments/{comment_id}", headers=headers_a)
    assert forbidden_comment_delete.status_code == 403

    react = client.post(f"/posts/{post_id}/react", json={"emoji": "fire"}, headers=headers_a)
    assert react.status_code == 200
    assert react.json()["reactions"]["fire"] == 1

    delete_comment = client.delete(f"/comments/{comment_id}", headers=headers_b)
    assert delete_comment.status_code == 204

    delete_post = client.delete(f"/posts/{post_id}", headers=headers_a)
    assert delete_post.status_code == 204


def test_weight_tracker_upsert_and_auth(client: TestClient):
    user_a = _register(client, "eve", "eve@example.com").json()
    user_b = _register(client, "frank", "frank@example.com").json()
    headers_a = _auth_headers(user_a["access_token"])
    headers_b = _auth_headers(user_b["access_token"])

    unauth = client.get("/weights/me")
    assert unauth.status_code == 401

    first = client.put("/weights/me/2026-03-14", json={"weight_kg": 70.5}, headers=headers_a)
    assert first.status_code == 200
    assert first.json()["entry_date"] == "2026-03-14"
    assert first.json()["weight_kg"] == 70.5

    update_same_day = client.put("/weights/me/2026-03-14", json={"weight_kg": 71.0}, headers=headers_a)
    assert update_same_day.status_code == 200
    assert update_same_day.json()["weight_kg"] == 71.0

    second_day = client.put("/weights/me/2026-03-15", json={"weight_kg": 70.8}, headers=headers_a)
    assert second_day.status_code == 200

    list_a = client.get("/weights/me", headers=headers_a)
    assert list_a.status_code == 200
    assert len(list_a.json()) == 2
    assert [entry["entry_date"] for entry in list_a.json()] == ["2026-03-14", "2026-03-15"]
    assert list_a.json()[0]["weight_kg"] == 71.0

    list_b = client.get("/weights/me", headers=headers_b)
    assert list_b.status_code == 200
    assert list_b.json() == []

    delete_unauth = client.delete("/weights/me/2026-03-14")
    assert delete_unauth.status_code == 401

    delete_existing = client.delete("/weights/me/2026-03-14", headers=headers_a)
    assert delete_existing.status_code == 204

    list_after_delete = client.get("/weights/me", headers=headers_a)
    assert list_after_delete.status_code == 200
    assert [entry["entry_date"] for entry in list_after_delete.json()] == ["2026-03-15"]


def test_bmr_is_user_scoped(client: TestClient):
    user_a = _register(client, "gina", "gina@example.com").json()
    user_b = _register(client, "hank", "hank@example.com").json()
    headers_a = _auth_headers(user_a["access_token"])
    headers_b = _auth_headers(user_b["access_token"])

    update_missing_auth = client.put("/me/bmr", json={"bmr": 1500})
    assert update_missing_auth.status_code == 401

    set_bmr_a = client.put(
        "/me/bmr",
        json={"bmr": 1500, "inputs": {"age": 30, "sex": "female", "weight": 70, "height": 170}},
        headers=headers_a,
    )
    assert set_bmr_a.status_code == 200
    assert set_bmr_a.json()["bmr_value"] == 1500
    assert set_bmr_a.json()["bmr_inputs"]["age"] == 30

    me_a = client.get("/me", headers=headers_a)
    assert me_a.json()["bmr_value"] == 1500

    me_b = client.get("/me", headers=headers_b)
    assert me_b.json()["bmr_value"] is None

    delete_missing = client.delete("/weights/me/2026-03-14", headers=headers_a)
    assert delete_missing.status_code == 204

    user_b_entry = client.put("/weights/me/2026-03-14", json={"weight_kg": 81.2}, headers=headers_b)
    assert user_b_entry.status_code == 200

    list_b_after = client.get("/weights/me", headers=headers_b)
    assert list_b_after.status_code == 200
    assert [entry["entry_date"] for entry in list_b_after.json()] == ["2026-03-14"]
