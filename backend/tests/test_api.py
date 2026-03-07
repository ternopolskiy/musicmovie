import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.movie import Movie
from app.models.track import Track


class TestAuth:
    """Tests for authentication endpoints."""

    def test_register_success(self, client: TestClient):
        """Test successful user registration."""
        response = client.post(
            "/auth/register",
            json={
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["username"] == "newuser"
        assert data["email"] == "newuser@example.com"
        assert data["role"] == "user"
        assert "id" in data

    def test_register_duplicate_email(self, client: TestClient, test_user):
        """Test registration with existing email."""
        response = client.post(
            "/auth/register",
            json={
                "username": "anotheruser",
                "email": "test@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]

    def test_register_duplicate_username(self, client: TestClient, test_user):
        """Test registration with existing username."""
        response = client.post(
            "/auth/register",
            json={
                "username": "testuser",
                "email": "another@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 400
        assert "Username already taken" in response.json()["detail"]

    def test_login_success(self, client: TestClient, test_user):
        """Test successful login."""
        response = client.post(
            "/auth/login",
            json={"email": "test@example.com", "password": "pass123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client: TestClient):
        """Test login with invalid credentials."""
        response = client.post(
            "/auth/login",
            json={"email": "nonexistent@example.com", "password": "wrongpass"}
        )
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]

    def test_login_wrong_password(self, client: TestClient, test_user):
        """Test login with wrong password."""
        response = client.post(
            "/auth/login",
            json={"email": "test@example.com", "password": "wrongpass"}
        )
        assert response.status_code == 401

    def test_get_current_user(self, client: TestClient, auth_token: str):
        """Test getting current user."""
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testuser"
        assert data["email"] == "test@example.com"

    def test_get_current_user_unauthorized(self, client: TestClient):
        """Test getting current user without token."""
        response = client.get("/auth/me")
        assert response.status_code == 401

    def test_refresh_token(self, client: TestClient, auth_token: str):
        """Test token refresh."""
        # First get refresh token from login
        login_response = client.post(
            "/auth/login",
            json={"email": "test@example.com", "password": "pass123"}
        )
        refresh_token = login_response.json()["refresh_token"]

        response = client.post(
            "/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data


class TestStats:
    """Tests for stats endpoint."""

    def test_get_stats(self, client: TestClient, db_session: Session):
        """Test getting statistics."""
        # Create some test data
        db_session.add(Movie(title="Test Movie"))
        db_session.add(Track(title="Test Track"))
        db_session.commit()

        response = client.get("/stats")
        assert response.status_code == 200
        data = response.json()
        assert data["movies"] >= 1
        assert data["tracks"] >= 1
        assert "users" in data


class TestSearch:
    """Tests for search endpoint."""

    def test_search_movies(self, client: TestClient, db_session: Session):
        """Test searching for movies."""
        db_session.add(Movie(title="The Matrix", director="Wachowski"))
        db_session.commit()

        response = client.get("/search?q=matrix")
        assert response.status_code == 200
        data = response.json()
        assert len(data["movies"]) >= 1
        assert "Matrix" in data["movies"][0]["title"]

    def test_search_tracks(self, client: TestClient, db_session: Session):
        """Test searching for tracks."""
        db_session.add(Track(title="Bohemian Rhapsody", artist="Queen"))
        db_session.commit()

        response = client.get("/search?q=bohemian")
        assert response.status_code == 200
        data = response.json()
        assert len(data["tracks"]) >= 1

    def test_search_no_results(self, client: TestClient):
        """Test search with no results."""
        response = client.get("/search?q=nonexistent")
        assert response.status_code == 200
        data = response.json()
        assert data["movies"] == []
        assert data["tracks"] == []

    def test_search_empty_query(self, client: TestClient):
        """Test search with empty query."""
        response = client.get("/search?q=")
        assert response.status_code == 422  # Validation error


class TestMovies:
    """Tests for movies endpoints."""

    def test_list_movies_empty(self, client: TestClient):
        """Test listing movies when empty."""
        response = client.get("/movies")
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0

    def test_list_movies(self, client: TestClient, db_session: Session):
        """Test listing movies."""
        movie = Movie(title="Test Movie", year=2023, director="Test Director")
        db_session.add(movie)
        db_session.commit()

        response = client.get("/movies")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["items"][0]["title"] == "Test Movie"

    def test_get_movie(self, client: TestClient, db_session: Session):
        """Test getting a single movie."""
        movie = Movie(title="Test Movie", year=2023)
        db_session.add(movie)
        db_session.commit()

        response = client.get(f"/movies/{movie.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Movie"

    def test_get_movie_not_found(self, client: TestClient):
        """Test getting non-existent movie."""
        response = client.get("/movies/999")
        assert response.status_code == 404

    def test_create_movie_admin(self, client: TestClient, admin_token: str):
        """Test creating a movie as admin."""
        response = client.post(
            "/movies",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "title": "New Movie",
                "year": 2024,
                "director": "Director Name"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "New Movie"

    def test_create_movie_unauthorized(self, client: TestClient, auth_token: str):
        """Test creating movie without admin rights."""
        response = client.post(
            "/movies",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "New Movie"}
        )
        assert response.status_code == 403

    def test_update_movie_admin(self, client: TestClient, db_session: Session, admin_token: str):
        """Test updating a movie as admin."""
        movie = Movie(title="Old Title")
        db_session.add(movie)
        db_session.commit()

        response = client.put(
            f"/movies/{movie.id}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"title": "Updated Title"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"

    def test_delete_movie_admin(self, client: TestClient, db_session: Session, admin_token: str):
        """Test deleting a movie as admin."""
        movie = Movie(title="To Delete")
        db_session.add(movie)
        db_session.commit()

        response = client.delete(
            f"/movies/{movie.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 204

        # Verify deletion
        response = client.get(f"/movies/{movie.id}")
        assert response.status_code == 404

    def test_search_movies(self, client: TestClient, db_session: Session):
        """Test searching movies."""
        movie = Movie(title="The Matrix", director="Wachowski")
        db_session.add(movie)
        db_session.commit()

        response = client.get("/movies?search=matrix")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1


class TestTracks:
    """Tests for tracks endpoints."""

    def test_list_tracks_empty(self, client: TestClient):
        """Test listing tracks when empty."""
        response = client.get("/tracks")
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []

    def test_list_tracks(self, client: TestClient, db_session: Session):
        """Test listing tracks."""
        track = Track(title="Test Track", artist="Test Artist")
        db_session.add(track)
        db_session.commit()

        response = client.get("/tracks")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["items"][0]["title"] == "Test Track"

    def test_get_track(self, client: TestClient, db_session: Session):
        """Test getting a single track."""
        track = Track(title="Test Track", artist="Artist")
        db_session.add(track)
        db_session.commit()

        response = client.get(f"/tracks/{track.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Track"

    def test_get_track_not_found(self, client: TestClient):
        """Test getting non-existent track."""
        response = client.get("/tracks/999")
        assert response.status_code == 404

    def test_create_track_admin(self, client: TestClient, admin_token: str):
        """Test creating a track as admin."""
        response = client.post(
            "/tracks",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "title": "New Track",
                "artist": "Artist Name"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "New Track"

    def test_update_track_admin(self, client: TestClient, db_session: Session, admin_token: str):
        """Test updating a track as admin."""
        track = Track(title="Old Title")
        db_session.add(track)
        db_session.commit()

        response = client.put(
            f"/tracks/{track.id}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"title": "Updated Title"}
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Updated Title"

    def test_delete_track_admin(self, client: TestClient, db_session: Session, admin_token: str):
        """Test deleting a track as admin."""
        track = Track(title="To Delete")
        db_session.add(track)
        db_session.commit()

        response = client.delete(
            f"/tracks/{track.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 204


class TestFavorites:
    """Tests for favorites endpoints."""

    def test_add_favorite_movie(self, client: TestClient, db_session: Session, auth_token: str):
        """Test adding a movie to favorites."""
        movie = Movie(title="Favorite Movie")
        db_session.add(movie)
        db_session.commit()

        response = client.post(
            "/favorites/toggle",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"item_type": "movie", "item_id": movie.id}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_favorite"] is True
        assert data["status"] == "added"

    def test_add_favorite_track(self, client: TestClient, db_session: Session, auth_token: str):
        """Test adding a track to favorites."""
        track = Track(title="Favorite Track")
        db_session.add(track)
        db_session.commit()

        response = client.post(
            "/favorites/toggle",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"item_type": "track", "item_id": track.id}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_favorite"] is True

    def test_remove_favorite(self, client: TestClient, db_session: Session, auth_token: str):
        """Test removing from favorites."""
        movie = Movie(title="Favorite Movie")
        db_session.add(movie)
        db_session.commit()

        # Add to favorites
        client.post(
            "/favorites/toggle",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"item_type": "movie", "item_id": movie.id}
        )

        # Remove from favorites
        response = client.post(
            "/favorites/toggle",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"item_type": "movie", "item_id": movie.id}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_favorite"] is False
        assert data["status"] == "removed"

    def test_list_favorites(self, client: TestClient, db_session: Session, auth_token: str):
        """Test listing favorites."""
        movie = Movie(title="Favorite Movie")
        db_session.add(movie)
        db_session.commit()

        client.post(
            "/favorites/toggle",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"item_type": "movie", "item_id": movie.id}
        )

        response = client.get(
            "/favorites",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1

    def test_check_favorite(self, client: TestClient, db_session: Session, auth_token: str):
        """Test checking favorite status."""
        movie = Movie(title="Favorite Movie")
        db_session.add(movie)
        db_session.commit()

        client.post(
            "/favorites/toggle",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"item_type": "movie", "item_id": movie.id}
        )

        response = client.get(
            f"/favorites/check?item_type=movie&item_id={movie.id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        assert response.json()["is_favorite"] is True

    def test_favorite_unauthorized(self, client: TestClient, db_session: Session):
        """Test favorites without authentication."""
        movie = Movie(title="Movie")
        db_session.add(movie)
        db_session.commit()

        response = client.post(
            "/favorites/toggle",
            json={"item_type": "movie", "item_id": movie.id}
        )
        assert response.status_code == 401


class TestComments:
    """Tests for comments endpoints."""

    def test_list_comments_empty(self, client: TestClient, db_session: Session):
        """Test listing comments when empty."""
        movie = Movie(title="Test Movie")
        db_session.add(movie)
        db_session.commit()

        response = client.get(f"/comments/movie/{movie.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []

    def test_create_comment(self, client: TestClient, db_session: Session, auth_token: str):
        """Test creating a comment."""
        movie = Movie(title="Test Movie")
        db_session.add(movie)
        db_session.commit()

        response = client.post(
            "/comments",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "item_type": "movie",
                "item_id": movie.id,
                "text": "Great movie!"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["text"] == "Great movie!"

    def test_create_comment_invalid_item(self, client: TestClient, auth_token: str):
        """Test creating comment for non-existent item."""
        response = client.post(
            "/comments",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "item_type": "movie",
                "item_id": 999,
                "text": "Comment"
            }
        )
        assert response.status_code == 404

    def test_delete_comment_owner(self, client: TestClient, db_session: Session, auth_token: str):
        """Test deleting own comment."""
        movie = Movie(title="Test Movie")
        db_session.add(movie)
        db_session.commit()

        # Create comment
        response = client.post(
            "/comments",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"item_type": "movie", "item_id": movie.id, "text": "Comment"}
        )
        comment_id = response.json()["id"]

        # Delete comment
        response = client.delete(
            f"/comments/{comment_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 204

    def test_delete_comment_admin(self, client: TestClient, db_session: Session, admin_token: str):
        """Test admin deleting comment."""
        movie = Movie(title="Test Movie")
        db_session.add(movie)
        db_session.commit()

        # Create comment (as different user)
        response = client.post(
            "/comments",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"item_type": "movie", "item_id": movie.id, "text": "Comment"}
        )
        comment_id = response.json()["id"]

        # Delete as admin
        response = client.delete(
            f"/comments/{comment_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 204


class TestForum:
    """Tests for forum endpoints."""

    def test_list_posts_empty(self, client: TestClient):
        """Test listing forum posts when empty."""
        response = client.get("/forum/posts")
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []

    def test_create_post(self, client: TestClient, auth_token: str):
        """Test creating a forum post."""
        response = client.post(
            "/forum/posts",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "title": "Test Post",
                "content": "This is test content"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Post"
        assert data["rating"] == 0

    def test_get_post(self, client: TestClient, auth_token: str):
        """Test getting a single post."""
        # Create post
        response = client.post(
            "/forum/posts",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "Test Post", "content": "Content"}
        )
        post_id = response.json()["id"]

        # Get post
        response = client.get(f"/forum/posts/{post_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Post"
        assert "comments" in data

    def test_vote_post(self, client: TestClient, auth_token: str):
        """Test voting on a post."""
        # Create post
        response = client.post(
            "/forum/posts",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "Test Post", "content": "Content"}
        )
        post_id = response.json()["id"]

        # Upvote
        response = client.post(
            f"/forum/posts/{post_id}/vote",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"value": 1}
        )
        assert response.status_code == 200
        assert response.json()["rating"] == 1
        assert response.json()["user_vote"] == 1

        # Downvote (switch)
        response = client.post(
            f"/forum/posts/{post_id}/vote",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"value": -1}
        )
        assert response.status_code == 200
        assert response.json()["rating"] == -1

        # Remove vote
        response = client.post(
            f"/forum/posts/{post_id}/vote",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"value": -1}
        )
        assert response.status_code == 200
        assert response.json()["user_vote"] is None

    def test_create_post_comment(self, client: TestClient, auth_token: str):
        """Test creating a comment on a forum post."""
        # Create post
        response = client.post(
            "/forum/posts",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "Test Post", "content": "Content"}
        )
        post_id = response.json()["id"]

        # Create comment
        response = client.post(
            f"/forum/posts/{post_id}/comments",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"text": "Great post!"}
        )
        assert response.status_code == 201
        data = response.json()
        assert data["text"] == "Great post!"

    def test_list_post_comments(self, client: TestClient, auth_token: str):
        """Test listing comments on a forum post."""
        # Create post
        response = client.post(
            "/forum/posts",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "Test Post", "content": "Content"}
        )
        post_id = response.json()["id"]

        # Create comment
        client.post(
            f"/forum/posts/{post_id}/comments",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"text": "Comment"}
        )

        # List comments
        response = client.get(f"/forum/posts/{post_id}/comments")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1

    def test_update_post(self, client: TestClient, auth_token: str):
        """Test updating a forum post."""
        # Create post
        response = client.post(
            "/forum/posts",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "Original Title", "content": "Content"}
        )
        post_id = response.json()["id"]

        # Update post
        response = client.put(
            f"/forum/posts/{post_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "Updated Title"}
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Updated Title"

    def test_delete_post(self, client: TestClient, auth_token: str):
        """Test deleting a forum post."""
        # Create post
        response = client.post(
            "/forum/posts",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "To Delete", "content": "Content"}
        )
        post_id = response.json()["id"]

        # Delete post
        response = client.delete(
            f"/forum/posts/{post_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 204


class TestNews:
    """Tests for news endpoints."""

    def test_list_news_empty(self, client: TestClient):
        """Test listing news when empty."""
        response = client.get("/news")
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []

    def test_create_news_admin(self, client: TestClient, admin_token: str):
        """Test creating news as admin."""
        response = client.post(
            "/news",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "title": "Breaking News",
                "description": "Important update"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Breaking News"

    def test_get_news(self, client: TestClient, db_session: Session):
        """Test getting a news item."""
        from app.models.news import News
        news = News(title="Test News", description="Description")
        db_session.add(news)
        db_session.commit()

        response = client.get(f"/news/{news.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test News"

    def test_get_news_not_found(self, client: TestClient):
        """Test getting non-existent news."""
        response = client.get("/news/999")
        assert response.status_code == 404

    def test_update_news_admin(self, client: TestClient, db_session: Session, admin_token: str):
        """Test updating news as admin."""
        from app.models.news import News
        news = News(title="Old Title")
        db_session.add(news)
        db_session.commit()

        response = client.put(
            f"/news/{news.id}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"title": "Updated Title"}
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Updated Title"

    def test_delete_news_admin(self, client: TestClient, db_session: Session, admin_token: str):
        """Test deleting news as admin."""
        from app.models.news import News
        news = News(title="To Delete")
        db_session.add(news)
        db_session.commit()

        response = client.delete(
            f"/news/{news.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 204

    def test_create_news_unauthorized(self, client: TestClient, auth_token: str):
        """Test creating news without admin rights."""
        response = client.post(
            "/news",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "News"}
        )
        assert response.status_code == 403


class TestAdmin:
    """Tests for admin endpoints."""

    def test_list_users_admin(self, client: TestClient, admin_token: str):
        """Test listing users as admin."""
        response = client.get(
            "/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "users" in data

    def test_list_users_unauthorized(self, client: TestClient, auth_token: str):
        """Test listing users without admin rights."""
        response = client.get(
            "/admin/users",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 403

    def test_list_moderation_comments_admin(self, client: TestClient, admin_token: str):
        """Test listing comments for moderation."""
        response = client.get(
            "/admin/moderation/comments",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "items" in data

    def test_list_moderation_forum_posts_admin(self, client: TestClient, admin_token: str):
        """Test listing forum posts for moderation."""
        response = client.get(
            "/admin/moderation/forum/posts",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "items" in data

    def test_list_moderation_forum_comments_admin(self, client: TestClient, admin_token: str):
        """Test listing forum comments for moderation."""
        response = client.get(
            "/admin/moderation/forum/comments",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "items" in data


class TestContact:
    """Tests for contact endpoint."""

    def test_submit_contact_form(self, client: TestClient):
        """Test submitting contact form."""
        response = client.post(
            "/contact",
            json={
                "name": "John Doe",
                "email": "john@example.com",
                "message": "Hello, I have a question!"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"

    def test_submit_contact_form_invalid_email(self, client: TestClient):
        """Test contact form with invalid email."""
        response = client.post(
            "/contact",
            json={
                "name": "John Doe",
                "email": "invalid-email",
                "message": "Hello"
            }
        )
        assert response.status_code == 422

    def test_submit_contact_form_empty(self, client: TestClient):
        """Test contact form with empty fields."""
        response = client.post(
            "/contact",
            json={
                "name": "",
                "email": "test@example.com",
                "message": "Hello"
            }
        )
        assert response.status_code == 422


class TestHealth:
    """Tests for health check endpoint."""

    def test_health_check(self, client: TestClient):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_root(self, client: TestClient):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "docs" in data
