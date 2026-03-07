from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    auth,
    movies,
    tracks,
    favorites,
    comments,
    forum,
    news,
    stats,
    search,
    admin,
    contact,
)

app = FastAPI(
    title="MusicMovie API",
    description="Backend API for MusicMovie - a platform combining music and movies",
    version="1.0.0",
)

# CORS configuration
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(tracks.router)
app.include_router(favorites.router)
app.include_router(comments.router)
app.include_router(forum.router)
app.include_router(news.router)
app.include_router(stats.router)
app.include_router(search.router)
app.include_router(admin.router)
app.include_router(contact.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to MusicMovie API",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
