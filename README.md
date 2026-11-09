# ITSM Ticket Management System

A web-based **IT Service Management (ITSM) Ticket Management System** built with Django, MariaDB, and Bootstrap. The application provides basic ticket lifecycle management through a browser-based interface.

This project is being developed as part of the **IT Security Management & DevOps** course. The broader assignment covers application development, database integration, containerization, service orchestration, Kubernetes deployment, load testing, observability, and fault tolerance.

---

## 1. Project Overview

The application allows authenticated users to create, view, search, update, and delete IT support tickets.

### Implemented features

- User authentication using Django authentication.
- Login-protected dashboard and ticket pages.
- Create, read, update, and delete (CRUD) operations for tickets.
- Ticket categorization.
- Ticket priorities: Low, Medium, High, and Critical.
- Ticket statuses: Open, In Progress, Pending, Resolved, and Closed.
- Search tickets by title, description, and category.
- Automatic ticket creation timestamps.
- Django administration interface.
- JSON health-check endpoint.
- Responsive user interface using Bootstrap.
- MariaDB database integration through Django ORM.

### Project development status

| Component | Status |
|---|---|
| Django application | Implemented |
| Ticket CRUD | Implemented and manually tested |
| MariaDB integration | Implemented |
| Login and authentication | Implemented |
| Bootstrap interface | Implemented |
| Django health endpoint | Implemented |
| Docker image build and runtime | Requires verification |
| Docker Compose | Pending |
| Kubernetes and Minikube | Pending |
| Load testing | Pending |
| Observability and fault tolerance | Pending |
| Final assignment report | Pending |

The original Node.js application's routes and behavior must still be compared against the Django implementation to confirm assignment compatibility.

---

## 2. System Architecture

### Application architecture

The project follows Django's Model-View-Template (MVT) architecture.

```text
                    USER / WEB BROWSER
                           |
                           |
                    HTTP Requests
                           |
                           v
                 +-------------------+
                 |    Django URLs    |
                 |   URL Routing     |
                 +-------------------+
                           |
                           v
                 +-------------------+
                 |    Django Views   |
                 | Business Logic    |
                 +-------------------+
                      |         |
                      |         |
                      v         v
              +-----------+  +-------------+
              | Django    |  | Django      |
              | Forms     |  | Templates   |
              +-----------+  +-------------+
                      |         |
                      |         v
                      |    Bootstrap UI
                      |
                      v
              +-------------------+
              |    Django ORM     |
              +-------------------+
                      |
                      v
              +-------------------+
              |     MariaDB       |
              |   itsm_db         |
              +-------------------+
```

### Request lifecycle

1. A user accesses the application through a web browser.
2. Django URL routing identifies the requested endpoint.
3. Authentication middleware and login decorators protect application pages.
4. Django views process the request.
5. Django forms validate user input.
6. Django ORM communicates with MariaDB.
7. Django templates render the response.
8. Bootstrap provides the user interface.

### Database architecture

The application uses Django ORM with MariaDB as its relational database.

The main application models are:

| Model | Purpose |
|---|---|
| Category | Stores ticket categories |
| Ticket | Stores ticket details, priority, status, and ownership |
| Comment | Stores ticket comments in the database schema |
| ActivityLog | Stores ticket activity records in the database schema |

The current application interface focuses on ticket CRUD. Comment and ActivityLog models are retained in the existing database schema but are not part of the current user-facing feature scope.

The Django authentication system also maintains its standard user, group, permission, and session tables.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Programming language | Python 3.11 (local development) | Application development |
| Web framework | Django 5.2.19 | Backend and request handling |
| Database | MariaDB 13.0.2 | Relational data storage |
| Database driver | mysqlclient 2.3.0 | Django-to-MariaDB connection |
| Frontend | HTML5 and CSS3 | Page structure and styling |
| UI framework | Bootstrap 5.3.3 | Responsive interface |
| Icons | Bootstrap Icons | Interface icons |
| Templates | Django Template Language | Dynamic HTML rendering |
| ORM | Django ORM | Database operations |
| Authentication | Django Authentication | Login and session management |
| Development server | Django runserver | Local development |
| Container runtime | Docker | Planned application containerization |
| Container orchestration | Docker Compose | Planned multi-container setup |
| Container registry/image | Docker image | Application packaging |
| Orchestration platform | Kubernetes | Planned deployment |
| Local Kubernetes | Minikube | Planned local cluster |
| Load testing | k6 (proposed) | Planned performance testing |
| Version control | Git and GitHub | Source code management |

**Version distinction:** The current Windows development environment uses Python 3.11.9. The documented Docker build design uses Python 3.12 images. These are separate environments and should be validated independently.

---

## 4. Requirements and Prerequisites

### Hardware

Recommended development environment:

- 8 GB RAM minimum; 16 GB or more recommended.
- Dual-core processor or better.
- At least 10 GB of available disk space.
- Internet connection for downloading packages and container images.

### Software

| Software | Purpose |
|---|---|
| Windows 10/11 | Development operating system |
| Python 3.11 | Django application |
| MariaDB Server | Database |
| Git | Version control |
| Visual Studio Code | Code editor |
| Docker Desktop | Container development |
| kubectl | Kubernetes command-line client |
| Minikube | Local Kubernetes cluster |
| k6 | Load testing |

Docker, Kubernetes, Minikube, and k6 are required for the broader assignment workflow, but their implementation and validation remain separate from the completed Django application.

---

## 5. Installation Guide — Windows

### Step 1: Install Python

Download Python 3.11 from:

https://www.python.org/downloads/

During installation:

- Enable **Add Python to PATH**.
- Install Python for your Windows user or all users.

Verify installation in PowerShell:

```powershell
python --version
pip --version
```

The development environment used for this project:

```text
Python 3.11.9
```

### Step 2: Install MariaDB

Download MariaDB Community Server:

https://mariadb.org/download/

Install MariaDB Server using the Windows installer.

During installation:

1. Configure the root password.
2. Keep the database service enabled.
3. Use the default port `3306`, unless another service is already using it.
4. Complete the installation.

Verify the MariaDB Windows service:

```powershell
Get-Service MariaDB
```

If the service is stopped, start it:

```powershell
Start-Service MariaDB
```

Verify the database client:

```powershell
& "C:\Program Files\MariaDB 13.0\bin\mariadb.exe" --version
```

The exact executable path may differ depending on the installed MariaDB version.

### Step 3: Install Git

Download Git for Windows:

https://git-scm.com/downloads/win

Verify:

```powershell
git --version
```

### Step 4: Install Visual Studio Code

Download:

https://code.visualstudio.com/

Recommended extensions:

- Python
- Django
- Python Debugger
- GitLens

These extensions are optional but useful for development.

### Step 5: Clone the repository

Open PowerShell and run:

```powershell
cd $HOME\Desktop

git clone https://github.com/LordXapose/ITSM_Project_files.git

cd ITSM_Project_files
```

### Step 6: Create a Python virtual environment

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use the following command for the current terminal session only:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate the environment again.

### Step 7: Install Python dependencies

```powershell
python -m pip install --upgrade pip

pip install -r requirements.txt
```

The project dependencies include Django, mysqlclient, and the environment configuration package.

---

## 6. Database Configuration

### Step 1: Create the database

Open the MariaDB client:

```powershell
& "C:\Program Files\MariaDB 13.0\bin\mariadb.exe" -u root -p
```

Enter the MariaDB root password.

Create the application database:

```sql
CREATE DATABASE itsm_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Create a dedicated database user:

```sql
CREATE USER 'itsm_user'@'localhost'
IDENTIFIED BY 'CHANGE_THIS_PASSWORD';

GRANT ALL PRIVILEGES ON itsm_db.*
TO 'itsm_user'@'localhost';

FLUSH PRIVILEGES;
```

Use a strong password of your own choosing.

Exit:

```sql
EXIT;
```

### Step 2: Configure environment variables

Create a file named `.env` in the project root.

The file should contain:

```env
DB_NAME=itsm_db
DB_USER=itsm_user
DB_PASSWORD=CHANGE_THIS_PASSWORD
DB_HOST=localhost
DB_PORT=3306
```

Replace the placeholder password with the password configured in MariaDB.

**Security requirements:**

- Never commit `.env` to GitHub.
- Never put database passwords in source code.
- Do not include `.env` in a Docker image.
- Use runtime environment variables or an appropriate secrets mechanism for deployment.

### Step 3: Verify database connectivity

Activate the virtual environment and run:

```powershell
python manage.py check
```

Test the database connection:

```powershell
python manage.py shell -c "from django.db import connection; connection.ensure_connection(); print('Database:', connection.vendor)"
```

Expected output:

```text
Database: mysql
```

---

## 7. Database Migration and Application Setup

Django migrations create and update the database schema.

Run:

```powershell
python manage.py makemigrations
python manage.py migrate
```

Check migration status:

```powershell
python manage.py showmigrations
```

Check application configuration:

```powershell
python manage.py check
```

Create an administrator account:

```powershell
python manage.py createsuperuser
```

Follow the prompts to configure the username, email, and password.

The administrator can access the Django administration interface at:

```text
http://127.0.0.1:8000/admin/
```

Ticket categories can be managed through the Django administration interface.

---

## 8. Running the Application

Start the local development server:

```powershell
python manage.py runserver
```

Open the application:

http://127.0.0.1:8000/

### Application URLs

| URL | Method | Description |
|---|---|---|
| `/` | GET | Dashboard |
| `/login/` | GET, POST | User login |
| `/logout/` | POST | User logout |
| `/tickets/` | GET | Ticket listing and search |
| `/tickets/create/` | GET, POST | Create ticket |
| `/tickets/<id>/edit/` | GET, POST | Update ticket |
| `/tickets/<id>/delete/` | GET, POST | Delete confirmation and deletion |
| `/admin/` | GET and POST | Django administration |
| `/health/` | GET | Application health endpoint |

Ticket pages require authentication.

### Health endpoint

The application exposes a simple health-check endpoint:

```text
http://127.0.0.1:8000/health/
```

Example response:

```json
{
  "status": "healthy",
  "application": "ITSM Project"
}
```

This endpoint is intended to support basic application availability checks and future container orchestration probes. It does not independently verify MariaDB connectivity.

---

## 9. Repository Structure

```text
ITSM_Project_files/
│
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── core/
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── templates/
│   └── core/
│       ├── base.html
│       ├── dashboard.html
│       ├── login.html
│       ├── ticket_confirm_delete.html
│       ├── ticket_form.html
│       ├── ticket_list.html
│       └── ticket_update.html
│
├── static/
│   ├── css/
│   └── js/
│
├── .gitignore
├── .env                 # Local only; not committed
├── manage.py
├── README.md
└── requirements.txt
```

The structure above describes the Django application. Add Docker, Compose, Kubernetes, and load-testing files only when those assignment stages are completed and verified.

---

## 10. Application Testing

### Django system checks

```powershell
python manage.py check
```

### Migration consistency

```powershell
python manage.py makemigrations --check --dry-run
```

### Database migration status

```powershell
python manage.py migrate
```

### Manual functional tests

| Test | Expected result |
|---|---|
| Login with valid credentials | User can access the dashboard |
| Access ticket pages without login | Redirected to login |
| Create a ticket | Ticket is stored in MariaDB |
| View tickets | Existing tickets are displayed |
| Search for a ticket | Matching tickets are displayed |
| Update a ticket | Updated details are saved |
| Delete a ticket | Confirmation is required before deletion |
| Access `/health/` | JSON health response is returned |

Manual CRUD operations have been tested during development. Automated acceptance testing and full endpoint parity testing against the original Node.js application remain to be completed.

---

## 11. Containerization — Docker

Docker is intended to package the Django application and its runtime dependencies into a portable image.

The planned container architecture is:

```text
             Docker Host
                  |
          +-------+-------+
          |               |
          v               v
     Django Web        MariaDB
     Container         Container
          |               |
          |               v
          |          Persistent
          |          Data Volume
          |
          v
      Port 8000
          |
          v
      Web Browser
```

### Required tooling

Install Docker Desktop:

https://www.docker.com/products/docker-desktop/

For Windows:

1. Download Docker Desktop.
2. Follow the installation instructions.
3. Enable the WSL 2 backend if required by your system.
4. Start Docker Desktop.
5. Confirm that the Linux container engine is running.

Verify:

```powershell
docker --version
docker compose version
docker info
```

### Planned container requirements

The containerization stage must account for:

- Multi-stage image construction.
- A suitable Python runtime image.
- Installation of Python dependencies.
- Gunicorn as the application server.
- A non-root runtime user.
- Environment-based application configuration.
- Database connectivity.
- Health-check support.
- Exclusion of secrets and local development files from the build context.

The current Dockerfile design uses Python 3.12 images. Gunicorn must be present in the Python dependencies before the configured runtime command can work.

### Deployment configuration requirements

Before running the application in a production-like container, configure:

- `SECRET_KEY` through the environment.
- `DEBUG=False`.
- Appropriate `ALLOWED_HOSTS`.
- Database connection variables.
- Runtime secrets.
- Database migration execution.

The Django development server should not be used as the production container server.

**Status:** Docker Desktop is installed and running. The Docker image build and container runtime still require verification.

---

## 12. Docker Compose — Planned

Docker Compose will coordinate the Django and MariaDB services.

The planned architecture contains:

| Component | Responsibility |
|---|---|
| Django service | Runs the web application |
| MariaDB service | Stores application data |
| Named volume | Persists MariaDB data |
| Network | Enables communication between services |
| Health checks | Monitor service readiness |
| Environment configuration | Supplies application and database settings |

The Django application must use the database service name as its database host when both services run on the Compose network.

The Compose stage must validate:

- Database readiness before application startup.
- Application health.
- Database persistence across container restarts.
- Correct migration execution.
- Login and ticket CRUD through the containerized application.

**Status:** Pending implementation and validation.

---

## 13. Kubernetes and Minikube — Planned

Kubernetes will be used to deploy and manage the application containers.

Minikube provides a local Kubernetes cluster for development and demonstration.

### Required tools

Install `kubectl`:

https://kubernetes.io/docs/tasks/tools/

Install Minikube:

https://minikube.sigs.k8s.io/docs/start/

Verify installations:

```powershell
kubectl version --client
minikube version
```

Start the local cluster:

```powershell
minikube start
```

Verify:

```powershell
kubectl cluster-info
kubectl get nodes
```

### Planned Kubernetes architecture

```text
                 Minikube Cluster
                        |
                        v
                   Kubernetes
                     Service
                        |
                        v
                 Django Deployment
                        |
                 +------+------+
                 |             |
                 v             v
              Django Pod    Django Pod
                 |
                 v
              MariaDB
                 |
                 v
           Persistent Storage
```

The final database placement and persistence design must be selected before deployment. The Django pods need a reliable route to MariaDB.

### Deployment requirements

The Kubernetes stage must address:

- Namespace configuration.
- Deployment and matching pod labels.
- Replica configuration.
- CPU and memory requests.
- CPU and memory limits.
- Readiness probes.
- Liveness probes.
- Service exposure.
- Database connectivity.
- Persistent storage.
- Application configuration and secrets.

The health endpoint `/health/` can be used for HTTP health probes, subject to testing.

### Deployment verification

The assignment evidence should include:

```powershell
kubectl get pods
kubectl get services
kubectl get deployments
kubectl get events
```

Application logs should also be collected during verification.

**Status:** Minikube deployment and Kubernetes manifests remain pending.

---

## 14. Load Testing — Planned

Load testing will measure the application's behavior under concurrent requests.

**Proposed tool:** k6.

Install instructions:

https://grafana.com/docs/k6/latest/set-up/install-k6/

Verify:

```powershell
k6 version
```

### Assignment load-testing requirements

The planned test must meet the assignment's stated requirement of at least:

- 500 concurrent virtual users or requests, according to the assignment's exact interpretation.
- 60 seconds of sustained testing.

The test plan should define:

1. Target application URL.
2. Test scenario and HTTP endpoints.
3. Virtual user configuration.
4. Test duration.
5. Test account and data strategy.
6. Expected behavior and failure conditions.

### Measurements to collect

| Metric | Description |
|---|---|
| Average response time | Mean request latency |
| p50 latency | Median response time |
| p90 latency | 90th percentile response time |
| p95 latency | 95th percentile response time |
| p99 latency | 99th percentile response time |
| Error rate | Percentage of failed requests |
| Throughput | Requests per second |
| CPU usage | Application pod CPU consumption |
| Memory usage | Application pod memory consumption |

The final report should explain bottlenecks, resource utilization, test limitations, and whether the load generator or Minikube host became a limiting factor.

Do not claim that the concurrency or performance requirement has been achieved until the test results demonstrate it.

**Status:** Pending.

---

## 15. Observability and Fault Tolerance — Planned

The observability stage will collect information about application health and resource consumption.

### Observability evidence

- Kubernetes pod status.
- Application logs.
- Kubernetes events.
- CPU utilization.
- Memory utilization.
- Health probe results.
- Restart counts.

### Fault-tolerance demonstration

A controlled failure should be introduced to demonstrate that Kubernetes can recover an application container.

Evidence should include:

- The initial pod status.
- The controlled failure.
- The container restart.
- The resulting restart count.
- Application recovery.
- Successful health checks after recovery.

A deleted pod being recreated by a Deployment is not the same as a container restart within the same pod. The demonstration should match the exact evidence required by the course.

If Horizontal Pod Autoscaling is included, document the selected metric, threshold, and rationale.

**Status:** Pending.

---

## 16. Security Considerations

Security measures relevant to the application include:

- Django authentication.
- Login protection for ticket views.
- CSRF protection on POST forms.
- Django ORM parameterized database operations.
- Environment-based database configuration.
- Separation of local development secrets from source control.
- Database access through a dedicated application user.
- Confirmation before destructive ticket deletion.

Additional deployment security work includes:

- Production `SECRET_KEY` management.
- Disabling debug mode.
- Restricting allowed hosts.
- Running the container as a non-root user.
- Using appropriate Kubernetes Secrets.
- Restricting network access.
- Avoiding credentials in Git history and container images.

This is a course project, not a production security certification. Security controls must be tested rather than assumed.

---

## 17. Troubleshooting

### MariaDB service is not running

Check:

```powershell
Get-Service MariaDB
```

Start:

```powershell
Start-Service MariaDB
```

### Django cannot connect to MariaDB

Check:

- MariaDB service status.
- Database name.
- Database username.
- Database password.
- Host and port.
- `.env` file location.
- Database user privileges.

### Python dependency installation fails

Confirm that the virtual environment is activated:

```powershell
.\.venv\Scripts\Activate.ps1
```

Upgrade pip:

```powershell
python -m pip install --upgrade pip
```

Reinstall dependencies:

```powershell
pip install -r requirements.txt
```

### Port 8000 is already in use

Start Django on another port:

```powershell
python manage.py runserver 8001
```

### Database migrations are pending

Run:

```powershell
python manage.py makemigrations
python manage.py migrate
```

Do not delete migration files or reset the database to resolve an ordinary migration error.

---

## 18. Version Control

The project is maintained using Git and GitHub.

Repository:

https://github.com/LordXapose/ITSM_Project_files

Check working-tree status:

```powershell
git status
```

Review changes:

```powershell
git diff
git diff --check
```

Stage application files:

```powershell
git add config core templates static requirements.txt README.md
```

Commit:

```powershell
git commit -m "Update ITSM Django application and documentation"
```

Push:

```powershell
git push origin main
```

Before committing, verify that `.env`, database credentials, local virtual environments, and other sensitive files are excluded.

---

## 19. Assignment Completion Checklist

| Deliverable | Status |
|---|---|
| Django application | Implemented |
| Database integration | Implemented |
| CRUD functionality | Implemented and manually tested |
| Authentication | Implemented |
| Bootstrap interface | Implemented |
| Original Node.js endpoint comparison | Pending |
| Docker image build | Pending verification |
| Docker container runtime | Pending verification |
| Docker Compose | Pending |
| Kubernetes Deployment | Pending |
| Kubernetes Service | Pending |
| Minikube deployment | Pending |
| Application health probes | Pending |
| Load testing | Pending |
| CPU and memory measurements | Pending |
| Fault-tolerance demonstration | Pending |
| Final report and evidence | Pending |

---

## 20. Conclusion

The current project establishes a working Django-based ITSM ticket management application backed by MariaDB.

The application provides the essential ticket CRUD operations, authentication, search, database persistence, and a Bootstrap interface.

The remaining work focuses on validating compatibility with the original application and completing the DevOps requirements: Docker, Docker Compose, Kubernetes, Minikube, load testing, observability, and fault tolerance.

All implementation claims and performance results in the final submission should be supported by reproducible tests and captured evidence.
