## Project Overview
This project demonstrates the development of a Django-based CRUD (Create, Read, Update, Delete) application backed by a MariaDB relational database.
The application will subsequently be prepared for containerization and deployment using Docker, Docker Compose and Kubernetes (Minikube).

## Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Python |
| Web Framework | Django |
| Database | MariaDB |
| Database Interface | Django ORM |
| Frontend | HTML, CSS, JavaScript, Bootstrap |
| Application Server | Gunicorn |
| Containerization | Docker |
| Service Orchestration | Docker Compose |
| Container Orchestration | Kubernetes |
| Local Kubernetes Cluster | Minikube |
| Load Testing | k6 / Locust |

## Planned Features

### CRUD Operations

- **Create:** Add new records to the database.
- **Read:** Retrieve and display existing records.
- **Update:** Modify existing database records.
- **Delete:** Remove records from the database.

### Database Management

- MariaDB relational database integration.
- Django ORM for database operations.
- Database migrations and schema management.
- Persistent database storage.
- Environment-based database configuration.

### Application Health

A dedicated `/health/` endpoint will provide application health information for deployment health checks.

## Project Structure

```text
crud-management-system/
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── records/
│   ├── migrations/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── forms.py
│   └── admin.py
│
├── templates/
│   ├── base.html
│   └── records/
│
├── static/
│   ├── css/
│   └── js/
│
├── manage.py
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```
## Local Development

### Prerequisites

- Python 3.12 or compatible supported version.
- MariaDB.
- Git.
- Linux, macOS or Windows.

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd crud-management-system
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Linux:

```bash
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file using `.env.example` as a reference.

Configure the following:

```env
DJANGO_SECRET_KEY=
DEBUG=True

DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

Do not commit your actual `.env` file or production secrets to GitHub.

### 5. Database setup

Create the required MariaDB database and configure the database credentials.

Database migrations will be applied using:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Start the development server

```bash
python manage.py runserver
```

Application URL:

```text
http://127.0.0.1:8000/
```

Health endpoint:

```text
http://127.0.0.1:8000/health/
```

The Django development server is intended for local development. The deployment configuration will use Gunicorn.

## Testing

The project will include validation of:

- Create, Read, Update and Delete operations.
- Database connectivity.
- Input validation.
- Application health endpoint.
- Database persistence.
- API endpoint behaviour.

## Deployment Roadmap

The project will be developed in the following stages:

1. Django application development.
2. MariaDB database integration.
3. Functional testing and CRUD validation.
4. Dockerfile development.
5. Docker Compose configuration.
6. Kubernetes Deployment and Service manifests.
7. Minikube deployment.
8. Load testing and performance analysis.
9. Observability and fault-tolerance validation.
10. Technical documentation and final report.

## Academic Context

**Course:** IT Security Management & DevOps  
**Project:** Containerization, Kubernetes Deployment & Observability  
**Framework:** Django (Python)  
**Database:** MariaDB  
**Academic Year:** 2025–2026

## Author

**Kaushal Patidar**

---
