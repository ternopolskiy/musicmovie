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

A full-stack web platform that combines music and movies into a seamless entertainment experience. Built with FastAPI backend and React frontend.

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11.4** or higher - [Download](https://www.python.org/downloads/)
- **Node.js 20+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

## 📁 Project Structure

```
MusicMovie/
├── backend/                 # FastAPI backend
│   ├── app/                # Application source code
│   ├── alembic/            # Database migrations
│   ├── tests/              # Test files
│   ├── alembic.ini         # Alembic configuration
│   ├── requirements.txt    # Python dependencies
│   └── seed.py             # Database seeding script
├── frontend/               # React frontend
│   ├── src/               # Source files
│   ├── public/            # Public assets
│   ├── package.json       # Node dependencies
│   └── .env               # Environment variables
└── README.md
```

## 🚀 Installation

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   ```

3. **Activate the virtual environment:**

   **Windows:**
   ```bash
   .venv\Scripts\activate
   ```

   **macOS/Linux:**
   ```bash
   source .venv/bin/activate
   ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up the database:**
   ```bash
   alembic upgrade head
   ```

6. **(Optional) Seed the database with initial data:**
   ```bash
   python seed.py
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy the `.env` file and adjust settings if needed:
   ```bash
   # The .env file should contain:
   VITE_API_URL=http://localhost:8000
   ```

## 🏃 Running the Application

### Running the Backend

1. **Activate the virtual environment** (if not already active):
   ```bash
   # Windows
   .venv\Scripts\activate
   
   # macOS/Linux
   source .venv/bin/activate
   ```

2. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend API will be available at `http://localhost:8000`

### Running the Frontend

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## 📚 API Documentation

Once the backend is running, you can access:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

Run with coverage:
```bash
pytest --cov=app
```

### Frontend Tests

```bash
cd frontend
npm test
```

## ⚙️ Environment Variables

### Backend (.env in backend/app/)

```env
DATABASE_URL=sqlite:///./musicmovie.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env in frontend/)

```env
VITE_API_URL=http://localhost:8000
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
