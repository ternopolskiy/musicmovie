backend/
├── alembic.ini
├── requirements.txt
├── seed.py
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── movie.py
│   │   ├── track.py
│   │   ├── favorite.py
│   │   ├── comment.py
│   │   ├── forum.py
│   │   └── news.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── movie.py
│   │   ├── track.py
│   │   ├── favorite.py
│   │   ├── comment.py
│   │   ├── forum.py
│   │   └── news.py
│   └── routers/
│       ├── __init__.py
│       ├── auth.py
│       ├── movies.py
│       ├── tracks.py
│       ├── favorites.py
│       ├── comments.py
│       ├── forum.py
│       ├── news.py
│       ├── stats.py
│       ├── search.py
│       ├── admin.py
│       └── contact.py
└── alembic/
    ├── env.py
    ├── script.py.mako
    └── versions/
requirements.txt
txt

fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
alembic==1.13.1
pydantic==2.5.3
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
app/__init__.py
Python

undefined
app/config.py
Python

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./musicmovie.db"
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
app/database.py
Python

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

connect_args = {}
if "sqlite" in settings.DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False,
)


@event.listens_for(engine, "connect")
def _enable_sqlite_fk(dbapi_connection, connection_record):
    if "sqlite" in settings.DATABASE_URL:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass
app/models/__init__.py
Python

from app.models.user import User
from app.models.movie import Movie
from app.models.track import Track
from app.models.favorite import Favorite
from app.models.comment import Comment
from app.models.forum import ForumPost, ForumVote, ForumComment
from app.models.news import News

__all__ = [
    "User",
    "Movie",
    "Track",
    "Favorite",
    "Comment",
    "ForumPost",
    "ForumVote",
    "ForumComment",
    "News",
]
app/models/user.py
Python

from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(10), default="user", nullable=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    forum_posts = relationship("ForumPost", back_populates="author", cascade="all, delete-orphan")
    forum_comments = relationship("ForumComment", back_populates="author", cascade="all, delete-orphan")
    forum_votes = relationship("ForumVote", back_populates="user", cascade="all, delete-orphan")
app/models/movie.py
Python

from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    poster_url = Column(String(500), nullable=True)
    year = Column(Integer, nullable=True)
    director = Column(String(150), nullable=True)
    genres = Column(String(300), nullable=True)
    description = Column(Text, nullable=True)
    trailer_query = Column(String(300), nullable=True)
    watch_query = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    tracks = relationship("Track", back_populates="movie", cascade="all, delete-orphan")
app/models/track.py
Python

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.database import Base


class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    cover_url = Column(String(500), nullable=True)
    artist = Column(String(150), nullable=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="SET NULL"), nullable=True)
    spotify_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    movie = relationship("Movie", back_populates="tracks")

    @property
    def movie_title(self) -> str | None:
        return self.movie.title if self.movie else None
app/models/favorite.py
Python

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import relationship

from app.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    item_type = Column(String(10), nullable=False)  # "movie" | "track"
    item_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    user = relationship("User", back_populates="favorites")

    __table_args__ = (
        UniqueConstraint("user_id", "item_type", "item_id", name="uq_user_item"),
    )
app/models/comment.py
Python

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    item_type = Column(String(10), nullable=False)  # "movie" | "track"
    item_id = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    user = relationship("User", back_populates="comments")
app/models/forum.py
Python

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import relationship

from app.database import Base


class ForumPost(Base):
    __tablename__ = "forum_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(300), nullable=False)
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author = relationship("User", back_populates="forum_posts")
    comments = relationship("ForumComment", back_populates="post", cascade="all, delete-orphan")
    votes = relationship("ForumVote", back_populates="post", cascade="all, delete-orphan")


class ForumVote(Base):
    __tablename__ = "forum_votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    post_id = Column(Integer, ForeignKey("forum_posts.id", ondelete="CASCADE"), nullable=False)
    value = Column(Integer, nullable=False)  # +1 or -1

    user = relationship("User", back_populates="forum_votes")
    post = relationship("ForumPost", back_populates="votes")

    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_user_post_vote"),
    )


class ForumComment(Base):
    __tablename__ = "forum_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("forum_posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    post = relationship("ForumPost", back_populates="comments")
    author = relationship("User", back_populates="forum_comments")
app/models/news.py
Python

from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.database import Base


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    date = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    source_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
app/schemas/__init__.py
Python

undefined
app/schemas/auth.py
Python

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str
app/schemas/user.py
Python

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class UserBrief(BaseModel):
    id: int
    username: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
app/schemas/movie.py
Python

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class MovieCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    poster_url: Optional[str] = None
    year: Optional[int] = None
    director: Optional[str] = None
    genres: Optional[str] = None
    description: Optional[str] = None
    trailer_query: Optional[str] = None
    watch_query: Optional[str] = None


class MovieUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    poster_url: Optional[str] = None
    year: Optional[int] = None
    director: Optional[str] = None
    genres: Optional[str] = None
    description: Optional[str] = None
    trailer_query: Optional[str] = None
    watch_query: Optional[str] = None


class MovieResponse(BaseModel):
    id: int
    title: str
    poster_url: Optional[str] = None
    year: Optional[int] = None
    director: Optional[str] = None
    genres: Optional[str] = None
    description: Optional[str] = None
    trailer_query: Optional[str] = None
    watch_query: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
app/schemas/track.py
Python

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TrackCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    cover_url: Optional[str] = None
    artist: Optional[str] = None
    movie_id: Optional[int] = None
    spotify_url: Optional[str] = None


class TrackUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    cover_url: Optional[str] = None
    artist: Optional[str] = None
    movie_id: Optional[int] = None
    spotify_url: Optional[str] = None


class TrackResponse(BaseModel):
    id: int
    title: str
    cover_url: Optional[str] = None
    artist: Optional[str] = None
    movie_id: Optional[int] = None
    movie_title: Optional[str] = None
    spotify_url: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
app/schemas/favorite.py
Python

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class FavoriteToggle(BaseModel):
    item_type: str = Field(..., pattern="^(movie|track)$")
    item_id: int


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    item_type: str
    item_id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
app/schemas/comment.py
Python

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.user import UserBrief


class CommentCreate(BaseModel):
    item_type: str = Field(..., pattern="^(movie|track)$")
    item_id: int
    text: str = Field(..., min_length=1, max_length=2000)


class CommentResponse(BaseModel):
    id: int
    user_id: int
    item_type: str
    item_id: int
    text: str
    created_at: Optional[datetime] = None
    author: Optional[UserBrief] = None

    model_config = ConfigDict(from_attributes=True)
app/schemas/forum.py
Python

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.user import UserBrief


class ForumPostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    content: str = Field(..., min_length=1)


class ForumPostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    content: Optional[str] = Field(None, min_length=1)


class ForumCommentCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class ForumCommentResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    text: str
    created_at: Optional[datetime] = None
    author: Optional[UserBrief] = None

    model_config = ConfigDict(from_attributes=True)


class ForumPostResponse(BaseModel):
    id: int
    title: str
    content: str
    rating: int = 0
    author: Optional[UserBrief] = None
    comments_count: int = 0
    user_vote: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ForumPostDetail(ForumPostResponse):
    comments: list[ForumCommentResponse] = []


class VoteRequest(BaseModel):
    value: int = Field(..., ge=-1, le=1)
app/schemas/news.py
Python

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class NewsCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: Optional[str] = None
    image_url: Optional[str] = None
    date: Optional[datetime] = None
    source_url: Optional[str] = None


class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    description: Optional[str] = None
    image_url: Optional[str] = None
    date: Optional[datetime] = None
    source_url: Optional[str] = None


class NewsResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    date: Optional[datetime] = None
    source_url: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
app/dependencies.py
Python

from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import SessionLocal
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token", auto_error=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str | None = payload.get("sub")
        token_type: str | None = payload.get("type")
        if user_id is None or token_type != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    if token is None:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str | None = payload.get("sub")
        token_type: str | None = payload.get("type")
        if user_id is None or token_type != "access":
            return None
    except JWTError:
        return None
    return db.query(User).filter(User.id == int(user_id)).first()


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user
app/routers/__init__.py
Python

undefined
app/routers/auth.py
Python

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _hash_password(password: str) -> str:
    return pwd_context.hash(password)


def _verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def _create_token(data: dict, expires_delta: timedelta) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + expires_delta
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def _generate_tokens(user_id: int) -> dict:
    access = _create_token(
        {"sub": str(user_id), "type": "access"},
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    refresh = _create_token(
        {"sub": str(user_id), "type": "refresh"},
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}


# ---------- Registration ----------
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == body.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        username=body.username,
        email=body.email,
        password_hash=_hash_password(body.password),
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ---------- JSON Login (for frontend) ----------
@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not _verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return _generate_tokens(user.id)


# ---------- Form Login (for Swagger UI) ----------
@router.post("/token", response_model=TokenResponse)
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not _verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return _generate_tokens(user.id)


# ---------- Refresh ----------
@router.post("/refresh", response_model=TokenResponse)
def refresh_token(body: RefreshRequest, db: Session = Depends(get_db)):
    from jose import JWTError

    try:
        payload = jwt.decode(body.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return _generate_tokens(user.id)


# ---------- Current user ----------
@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user
app/routers/movies.py
Python

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_admin
from app.models.movie import Movie
from app.schemas.movie import MovieCreate, MovieResponse, MovieUpdate

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("", response_model=dict)
def list_movies(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Movie)
    if search:
        pattern = f"%{search}%"
        q = q.filter(Movie.title.ilike(pattern) | Movie.director.ilike(pattern))
    total = q.count()
    movies = q.order_by(Movie.created_at.desc()).offset(skip).limit(limit).all()
    return {
        "items": [MovieResponse.model_validate(m).model_dump() for m in movies],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/{movie_id}")
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    from app.schemas.track import TrackResponse
    from sqlalchemy.orm import joinedload
    from app.models.track import Track

    tracks = db.query(Track).filter(Track.movie_id == movie_id).all()
    track_list = []
    for t in tracks:
        td = TrackResponse.model_validate(t).model_dump()
        td["movie_title"] = movie.title
        track_list.append(td)

    data = MovieResponse.model_validate(movie).model_dump()
    data["tracks"] = track_list
    return data


@router.post("", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
def create_movie(body: MovieCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    movie = Movie(**body.model_dump())
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie


@router.put("/{movie_id}", response_model=MovieResponse)
def update_movie(movie_id: int, body: MovieUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(movie, key, value)
    db.commit()
    db.refresh(movie)
    return movie


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_movie(movie_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    db.delete(movie)
    db.commit()
app/routers/tracks.py
Python

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_db, require_admin
from app.models.movie import Movie
from app.models.track import Track
from app.schemas.track import TrackCreate, TrackResponse, TrackUpdate

router = APIRouter(prefix="/tracks", tags=["Tracks"])


def _serialize_track(t: Track) -> dict:
    d = TrackResponse.model_validate(t).model_dump()
    d["movie_title"] = t.movie.title if t.movie else None
    return d


@router.get("", response_model=dict)
def list_tracks(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    movie_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Track).options(joinedload(Track.movie))
    if search:
        pattern = f"%{search}%"
        q = q.filter(Track.title.ilike(pattern) | Track.artist.ilike(pattern))
    if movie_id is not None:
        q = q.filter(Track.movie_id == movie_id)
    total = q.count()
    tracks = q.order_by(Track.created_at.desc()).offset(skip).limit(limit).all()
    return {
        "items": [_serialize_track(t) for t in tracks],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/{track_id}")
def get_track(track_id: int, db: Session = Depends(get_db)):
    track = db.query(Track).options(joinedload(Track.movie)).filter(Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    return _serialize_track(track)


@router.post("", response_model=TrackResponse, status_code=status.HTTP_201_CREATED)
def create_track(body: TrackCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    if body.movie_id:
        if not db.query(Movie).filter(Movie.id == body.movie_id).first():
            raise HTTPException(status_code=404, detail="Movie not found")
    track = Track(**body.model_dump())
    db.add(track)
    db.commit()
    db.refresh(track)
    return track


@router.put("/{track_id}", response_model=TrackResponse)
def update_track(track_id: int, body: TrackUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    track = db.query(Track).filter(Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    update_data = body.model_dump(exclude_unset=True)
    if "movie_id" in update_data and update_data["movie_id"] is not None:
        if not db.query(Movie).filter(Movie.id == update_data["movie_id"]).first():
            raise HTTPException(status_code=404, detail="Movie not found")
    for key, value in update_data.items():
        setattr(track, key, value)
    db.commit()
    db.refresh(track)
    return track


@router.delete("/{track_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_track(track_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    track = db.query(Track).filter(Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    db.delete(track)
    db.commit()
app/routers/favorites.py
Python

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.favorite import Favorite
from app.models.movie import Movie
from app.models.track import Track
from app.models.user import User
from app.schemas.favorite import FavoriteResponse, FavoriteToggle

router = APIRouter(prefix="/favorites", tags=["Favorites"])


def _validate_item_exists(db: Session, item_type: str, item_id: int):
    if item_type == "movie":
        if not db.query(Movie).filter(Movie.id == item_id).first():
            raise HTTPException(status_code=404, detail="Movie not found")
    elif item_type == "track":
        if not db.query(Track).filter(Track.id == item_id).first():
            raise HTTPException(status_code=404, detail="Track not found")


@router.get("", response_model=dict)
def list_favorites(
    item_type: Optional[str] = Query(None, pattern="^(movie|track)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Favorite).filter(Favorite.user_id == current_user.id)
    if item_type:
        q = q.filter(Favorite.item_type == item_type)
    total = q.count()
    favs = q.order_by(Favorite.created_at.desc()).offset(skip).limit(limit).all()

    items = []
    for f in favs:
        fd = FavoriteResponse.model_validate(f).model_dump()
        # Append basic item info
        if f.item_type == "movie":
            movie = db.query(Movie).filter(Movie.id == f.item_id).first()
            fd["item_title"] = movie.title if movie else None
            fd["item_poster"] = movie.poster_url if movie else None
        else:
            track = db.query(Track).filter(Track.id == f.item_id).first()
            fd["item_title"] = track.title if track else None
            fd["item_poster"] = track.cover_url if track else None
        items.append(fd)

    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("/toggle")
def toggle_favorite(
    body: FavoriteToggle,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _validate_item_exists(db, body.item_type, body.item_id)
    existing = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.item_type == body.item_type,
            Favorite.item_id == body.item_id,
        )
        .first()
    )
    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "removed", "is_favorite": False}

    fav = Favorite(user_id=current_user.id, item_type=body.item_type, item_id=body.item_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return {"status": "added", "is_favorite": True, "id": fav.id}


@router.get("/check")
def check_favorite(
    item_type: str = Query(..., pattern="^(movie|track)$"),
    item_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exists = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.item_type == item_type,
            Favorite.item_id == item_id,
        )
        .first()
    )
    return {"is_favorite": exists is not None}


@router.get("/ids")
def get_favorite_ids(
    item_type: str = Query(..., pattern="^(movie|track)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ids = (
        db.query(Favorite.item_id)
        .filter(Favorite.user_id == current_user.id, Favorite.item_type == item_type)
        .all()
    )
    return {"ids": [row[0] for row in ids]}
app/routers/comments.py
Python

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.comment import Comment
from app.models.movie import Movie
from app.models.track import Track
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentResponse
from app.schemas.user import UserBrief

router = APIRouter(prefix="/comments", tags=["Comments"])


def _enrich_comment(c: Comment, db: Session) -> dict:
    d = CommentResponse.model_validate(c).model_dump()
    author = db.query(User).filter(User.id == c.user_id).first()
    d["author"] = UserBrief.model_validate(author).model_dump() if author else None
    return d


@router.get("/{item_type}/{item_id}", response_model=dict)
def list_comments(
    item_type: str,
    item_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    if item_type not in ("movie", "track"):
        raise HTTPException(status_code=400, detail="item_type must be 'movie' or 'track'")

    q = db.query(Comment).filter(Comment.item_type == item_type, Comment.item_id == item_id)
    total = q.count()
    comments = q.order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()

    return {
        "items": [_enrich_comment(c, db) for c in comments],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.post("", status_code=status.HTTP_201_CREATED)
def create_comment(
    body: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.item_type == "movie":
        if not db.query(Movie).filter(Movie.id == body.item_id).first():
            raise HTTPException(status_code=404, detail="Movie not found")
    elif body.item_type == "track":
        if not db.query(Track).filter(Track.id == body.item_id).first():
            raise HTTPException(status_code=404, detail="Track not found")

    comment = Comment(user_id=current_user.id, **body.model_dump())
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return _enrich_comment(comment, db)


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(comment)
    db.commit()
app/routers/forum.py
Python

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func as sa_func
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_current_user_optional, get_db
from app.models.forum import ForumComment, ForumPost, ForumVote
from app.models.user import User
from app.schemas.forum import (
    ForumCommentCreate,
    ForumCommentResponse,
    ForumPostCreate,
    ForumPostDetail,
    ForumPostResponse,
    ForumPostUpdate,
    VoteRequest,
)
from app.schemas.user import UserBrief

router = APIRouter(prefix="/forum", tags=["Forum"])


# ---- helpers ----

def _post_to_dict(
    post: ForumPost,
    comments_count: int,
    user_vote: Optional[int],
    db: Session,
) -> dict:
    author = db.query(User).filter(User.id == post.user_id).first()
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "rating": post.rating,
        "author": UserBrief.model_validate(author).model_dump() if author else None,
        "comments_count": comments_count,
        "user_vote": user_vote,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }


def _comment_to_dict(c: ForumComment, db: Session) -> dict:
    author = db.query(User).filter(User.id == c.user_id).first()
    return {
        "id": c.id,
        "post_id": c.post_id,
        "user_id": c.user_id,
        "text": c.text,
        "created_at": c.created_at,
        "author": UserBrief.model_validate(author).model_dump() if author else None,
    }


# ---- posts CRUD ----

@router.get("/posts", response_model=dict)
def list_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sort: str = Query("new", pattern="^(new|top|old)$"),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    q = db.query(ForumPost)

    if search:
        pattern = f"%{search}%"
        q = q.filter(ForumPost.title.ilike(pattern) | ForumPost.content.ilike(pattern))

    if sort == "new":
        q = q.order_by(ForumPost.created_at.desc())
    elif sort == "top":
        q = q.order_by(ForumPost.rating.desc(), ForumPost.created_at.desc())
    else:
        q = q.order_by(ForumPost.created_at.asc())

    total = q.count()
    posts = q.offset(skip).limit(limit).all()

    post_ids = [p.id for p in posts]

    # comments counts
    cc_rows = (
        db.query(ForumComment.post_id, sa_func.count(ForumComment.id))
        .filter(ForumComment.post_id.in_(post_ids))
        .group_by(ForumComment.post_id)
        .all()
    )
    cc_map: dict[int, int] = dict(cc_rows)

    # user votes
    uv_map: dict[int, int] = {}
    if current_user:
        vote_rows = (
            db.query(ForumVote)
            .filter(ForumVote.post_id.in_(post_ids), ForumVote.user_id == current_user.id)
            .all()
        )
        uv_map = {v.post_id: v.value for v in vote_rows}

    items = [
        _post_to_dict(p, cc_map.get(p.id, 0), uv_map.get(p.id), db)
        for p in posts
    ]
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/posts/{post_id}")
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comments = (
        db.query(ForumComment)
        .filter(ForumComment.post_id == post_id)
        .order_by(ForumComment.created_at.asc())
        .all()
    )
    comments_count = len(comments)

    user_vote = None
    if current_user:
        vote = (
            db.query(ForumVote)
            .filter(ForumVote.post_id == post_id, ForumVote.user_id == current_user.id)
            .first()
        )
        user_vote = vote.value if vote else None

    data = _post_to_dict(post, comments_count, user_vote, db)
    data["comments"] = [_comment_to_dict(c, db) for c in comments]
    return data


@router.post("/posts", status_code=status.HTTP_201_CREATED)
def create_post(
    body: ForumPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = ForumPost(user_id=current_user.id, title=body.title, content=body.content)
    db.add(post)
    db.commit()
    db.refresh(post)
    return _post_to_dict(post, 0, None, db)


@router.put("/posts/{post_id}")
def update_post(
    post_id: int,
    body: ForumPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(post, key, value)
    post.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(post)

    cc = db.query(ForumComment).filter(ForumComment.post_id == post_id).count()
    uv = db.query(ForumVote).filter(ForumVote.post_id == post_id, ForumVote.user_id == current_user.id).first()
    return _post_to_dict(post, cc, uv.value if uv else None, db)


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(post)
    db.commit()


# ---- voting ----

@router.post("/posts/{post_id}/vote")
def vote_post(
    post_id: int,
    body: VoteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.value not in (1, -1):
        raise HTTPException(status_code=400, detail="Vote value must be 1 or -1")

    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing = (
        db.query(ForumVote)
        .filter(ForumVote.user_id == current_user.id, ForumVote.post_id == post_id)
        .first()
    )

    result_vote: Optional[int] = None

    if existing:
        if existing.value == body.value:
            # toggle off
            post.rating -= existing.value
            db.delete(existing)
            result_vote = None
        else:
            # switch vote
            post.rating -= existing.value
            existing.value = body.value
            post.rating += body.value
            result_vote = body.value
    else:
        new_vote = ForumVote(user_id=current_user.id, post_id=post_id, value=body.value)
        db.add(new_vote)
        post.rating += body.value
        result_vote = body.value

    db.commit()
    db.refresh(post)
    return {"rating": post.rating, "user_vote": result_vote}


# ---- post comments ----

@router.get("/posts/{post_id}/comments")
def list_post_comments(
    post_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    if not db.query(ForumPost).filter(ForumPost.id == post_id).first():
        raise HTTPException(status_code=404, detail="Post not found")

    q = db.query(ForumComment).filter(ForumComment.post_id == post_id)
    total = q.count()
    comments = q.order_by(ForumComment.created_at.asc()).offset(skip).limit(limit).all()
    return {
        "items": [_comment_to_dict(c, db) for c in comments],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.post("/posts/{post_id}/comments", status_code=status.HTTP_201_CREATED)
def create_post_comment(
    post_id: int,
    body: ForumCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.query(ForumPost).filter(ForumPost.id == post_id).first():
        raise HTTPException(status_code=404, detail="Post not found")

    comment = ForumComment(post_id=post_id, user_id=current_user.id, text=body.text)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return _comment_to_dict(comment, db)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_forum_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = db.query(ForumComment).filter(ForumComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(comment)
    db.commit()
app/routers/news.py
Python

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_admin
from app.models.news import News
from app.schemas.news import NewsCreate, NewsResponse, NewsUpdate

router = APIRouter(prefix="/news", tags=["News"])


@router.get("", response_model=dict)
def list_news(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(News)
    total = q.count()
    items = q.order_by(News.date.desc()).offset(skip).limit(limit).all()
    return {
        "items": [NewsResponse.model_validate(n).model_dump() for n in items],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/{news_id}", response_model=NewsResponse)
def get_news(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news


@router.post("", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
def create_news(body: NewsCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    news = News(**body.model_dump())
    db.add(news)
    db.commit()
    db.refresh(news)
    return news


@router.put("/{news_id}", response_model=NewsResponse)
def update_news(news_id: int, body: NewsUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(news, key, value)
    db.commit()
    db.refresh(news)
    return news


@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_news(news_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    db.delete(news)
    db.commit()
app/routers/stats.py
Python

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.movie import Movie
from app.models.track import Track
from app.models.user import User

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("")
def get_stats(db: Session = Depends(get_db)):
    return {
        "movies": db.query(Movie).count(),
        "tracks": db.query(Track).count(),
        "users": db.query(User).count(),
    }
app/routers/search.py
Python

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_db
from app.models.movie import Movie
from app.models.track import Track
from app.schemas.movie import MovieResponse
from app.schemas.track import TrackResponse

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("")
def search(
    q: str = Query(..., 