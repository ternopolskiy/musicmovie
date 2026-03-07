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
