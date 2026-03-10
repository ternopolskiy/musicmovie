# MusicMovie

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![Pydantic](https://img.shields.io/badge/Pydantic-2.5-E92063?style=for-the-badge&logo=pydantic&logoColor=white)](https://docs.pydantic.dev/)
[![Pytest](https://img.shields.io/badge/Pytest-8.3-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white)](https://pytest.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

A full-stack web platform that combines music and movies into a seamless entertainment experience.

---

## 📸 Project Showcase

### Main Interface

![Главный экран](image/Главный%20экран.jpg)

### Dashboard & Statistics

![Счетчик фильмов, треков и кол-во пользователей](image/1.%20счетчик%20фильмов,%20треков%20и%20кол-во%20пользователей.jpg)

### Browse Movies

![Каталог фильмов](image/каталог%20+%20поиск%20фильмов.png)

![Список популярных фильмов](image/1.%20список%20популярных%20фильмов.jpg)

### Browse Music

![Каталог треков](image/каталог%20+%20поиск%20треков.png)

### User Features

![Избранное](image/избранное%20с%20фильмами%20и%20треками.png)

![Новости](image/новости.png)

### Community

![Форум](image/форум.png)

![Создать пост](image/создать%20пост%20на%20форуме.png)

### Admin Panel

![Редактирование фильмов](image/админ-паннель,%20редактирование%20инф.%20о%20фильмах.png)

![Редактирование треков](image/админ-паннель,%20редактирование%20инф.%20о%20треках.png)

![Редактирование новостей](image/админ-паннель,%20редактирование%20новостей.png)

![Редактирование комментариев](image/админ-паннель,%20редактирование%20комментариев.png)

![Управление пользователями](image/отображение%20пользователей.png)

![Контактная информация](image/контактная%20информация.png)

### Authentication

![Вход](image/окно%20входа.jpg)

![Регистрация](image/окно%20регистраци.jpg)

---

## 🚀 Quick Start

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
alembic upgrade head

# (Optional) Seed database
python seed.py

# Run backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### DOCKER BUILD
```bash
docker-compose up --build
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 📋 Prerequisites

- **Python 3.11.4+** - [Download](https://www.python.org/downloads/)
- **Node.js 20+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```
