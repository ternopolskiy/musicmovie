"""
Seed script to populate the database with initial data.
Run this after creating the database with: python seed.py
"""

from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import engine, SessionLocal, Base
from app.models import User, Movie, Track, News, ForumPost

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_database(db: Session):
    # Check if data already exists
    if db.query(User).first():
        print("Database already seeded. Skipping...")
        return

    # Create admin user
    admin = User(
        username="admin",
        email="admin@musicmovie.com",
        password_hash=pwd_context.hash("admin123"),
        role="admin",
        avatar_url=None,
    )
    db.add(admin)

    # Create regular user
    user = User(
        username="john_doe",
        email="john@example.com",
        password_hash=pwd_context.hash("password123"),
        role="user",
        avatar_url=None,
    )
    db.add(user)
    
    # Commit users first to get their IDs
    db.commit()
    db.refresh(admin)
    db.refresh(user)

    # Create movies
    movie1 = Movie(
        title="The Shawshank Redemption",
        poster_url="https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        year=1994,
        director="Frank Darabont",
        genres="Drama",
        description="Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        trailer_query="Shawshank Redemption trailer",
        watch_query="Shawshank Redemption watch",
    )
    db.add(movie1)

    movie2 = Movie(
        title="The Godfather",
        poster_url="https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        year=1972,
        director="Francis Ford Coppola",
        genres="Crime, Drama",
        description="The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        trailer_query="The Godfather trailer",
        watch_query="The Godfather watch",
    )
    db.add(movie2)

    movie3 = Movie(
        title="Pulp Fiction",
        poster_url="https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        year=1994,
        director="Quentin Tarantino",
        genres="Crime, Drama",
        description="The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
        trailer_query="Pulp Fiction trailer",
        watch_query="Pulp Fiction watch",
    )
    db.add(movie3)

    # Create tracks
    track1 = Track(
        title="The Shawshank Redemption Theme",
        cover_url="https://i.scdn.co/image/ab67616d0000b273e3e3b64cea45265469d4cafa",
        artist="Thomas Newman",
        movie_id=movie1.id,
        spotify_url="https://open.spotify.com/search/The%20Shawshank%20Redemption%20soundtrack",
    )
    db.add(track1)

    track2 = Track(
        title="The Godfather Waltz",
        cover_url="https://i.scdn.co/image/ab67616d0000b273a0e5a32b1f3f8717e0a5e6c6",
        artist="Nino Rota",
        movie_id=movie2.id,
        spotify_url="https://open.spotify.com/search/The%20Godfather%20soundtrack",
    )
    db.add(track2)

    track3 = Track(
        title="Misirlou",
        cover_url="https://i.scdn.co/image/ab67616d0000b273c8b444df0f45b5b25a5e7a2c",
        artist="Dick Dale",
        movie_id=movie3.id,
        spotify_url="https://open.spotify.com/search/Pulp%20Fiction%20soundtrack",
    )
    db.add(track3)

    track4 = Track(
        title="Bohemian Rhapsody",
        cover_url="https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a",
        artist="Queen",
        movie_id=None,
        spotify_url="https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv",
    )
    db.add(track4)

    # Create news
    news1 = News(
        title="New Soundtrack Album Released",
        description="The latest soundtrack from the hit movie has been released on all streaming platforms.",
        image_url="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
        source_url="https://example.com/news/soundtrack-released",
    )
    db.add(news1)

    news2 = News(
        title="Classic Film Anniversary",
        description="Today marks the 50th anniversary of one of the greatest films ever made.",
        image_url="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
        source_url="https://example.com/news/film-anniversary",
    )
    db.add(news2)

    # Create forum posts
    post1 = ForumPost(
        user_id=user.id,
        title="Best movie soundtracks of all time?",
        content="What do you think are the best movie soundtracks ever created? I'll start with The Godfather and Pulp Fiction!",
        rating=5,
    )
    db.add(post1)

    post2 = ForumPost(
        user_id=admin.id,
        title="Welcome to MusicMovie Forum!",
        content="This is the official forum for discussing all things related to music and movies. Feel free to share your favorites!",
        rating=10,
    )
    db.add(post2)

    db.commit()

    print("Database seeded successfully!")
    print("\nCreated users:")
    print("  Admin: admin@musicmovie.com / admin123")
    print("  User: john@example.com / password123")
    print(f"\nCreated {db.query(Movie).count()} movies")
    print(f"Created {db.query(Track).count()} tracks")
    print(f"Created {db.query(News).count()} news items")
    print(f"Created {db.query(ForumPost).count()} forum posts")


if __name__ == "__main__":
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Seed data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
