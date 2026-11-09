# ITSM Ticket Management Application

A Django-based IT Service Management (ITSM) ticket application backed by MariaDB. This repository is being developed for the IT Security Management & DevOps course deliverables covering containerization, Kubernetes, load testing, observability, and fault tolerance.

## Project status

The Django application and local MariaDB integration are implemented. Docker Desktop is running, and a multi-stage Dockerfile and .dockerignore are present. The image build has not yet been confirmed, and the Compose, Kubernetes, load-testing, and final-report deliverables remain to be completed.

| Work area | Status |
|---|---|
| Django ticket CRUD application | Implemented; manual CRUD use was reported working |
| MariaDB application configuration | Implemented through Django's MySQL backend and environment-based DB connection values |
| Django checks and migrations | Previously reported passing; no pending migrations at that time |
| Docker Desktop | Running on the development machine |
| Dockerfile and .dockerignore | Present; image build and container run still need verification |
| Gunicorn dependency | Not yet listed in requirements.txt; required by the Dockerfile command |
| Docker Compose | Not started; no docker-compose.yaml or compose.yaml is present yet |
| Kubernetes manifests and Minikube deployment | Not started |
| Load test script and measurements | Not started |
| Fault-tolerance evidence and final report | Not started |

The original Node.js application's endpoint list has not been compared with the Django routes yet. Confirm endpoint and behavior parity before treating the rewrite as complete for grading.

## Application features

- Login-protected dashboard and ticket pages.
- Ticket creation, listing, search, editing, and deletion.
- Ticket categories, priorities, and statuses.
- Dashboard counts for open, in-progress, pending, resolved/closed tickets and active categories.
- Django health endpoint at /health/.
- Bootstrap-based responsive interface.
- Django ORM with MariaDB configured through mysqlclient.

Ticket views require authentication. Ticket deletion uses a confirmation page and performs the deletion on a POST request.

## Routes

| Route | Methods | Purpose |
|---|---|---|
| /health/ | GET | Returns a JSON health response |
| /login/ | GET, POST | Django login |
| /logout/ | POST | Django logout |
| / | GET | Login-protected dashboard |
| /tickets/ | GET | Ticket list and search |
| /tickets/create/ | GET, POST | Create a ticket |
| /tickets/<id>/edit/ | GET, POST | Update a ticket |
| /tickets/<id>/delete/ | GET, POST | Confirm and delete a ticket |
| /admin/ | Django admin methods | Django administration site |

The assignment requires the Django rewrite to preserve the original Node.js application's endpoints and behavior. Record the original routes and compare them with this table; add or adjust routes only as needed to meet that requirement.

## Technology

| Component | Current or planned technology |
|---|---|
| Language | Python |
| Web framework | Django 5.2.19 |
| Database | MariaDB |
| Database driver | mysqlclient 2.3.0 |
| Front end | Django templates, Bootstrap 5.3.3 CDN, Bootstrap Icons CDN |
| Development server | Django runserver for local development |
| Container server | Gunicorn, configured as the Dockerfile command; dependency still needs adding |
| Container build | Docker multi-stage build using Python 3.12 full and slim Bookworm images |
| Service orchestration | Docker Compose; planned |
| Kubernetes | Kubernetes manifests deployed to Minikube; planned |
| Load testing | k6, Locust, hey, or JMeter; tool not selected yet |

See requirements.txt for the exact Python packages currently pinned.

## Repository layout

Current application files include:

    config/                 Django project configuration
    core/                   Ticket, category, form, URL, and view code
    templates/core/         Login, dashboard, and ticket templates
    static/                 Static assets
    manage.py               Django management entry point
    requirements.txt        Python dependencies
    Dockerfile              Multi-stage container build
    .dockerignore           Excludes local and sensitive files from build context
    .gitignore              Excludes local environment and generated files

Planned files required to complete the assignment include:

    docker-compose.yaml     Django and MariaDB services, network, volumes, health check
    k8s/deployment.yaml     Django Deployment with probes and resource requests/limits
    k8s/service.yaml        Service exposing the Django pods
    k8s/                    Additional MariaDB resources if the Minikube app uses an in-cluster database
    load-test/              Committed load-test script and supporting notes
    report/                 Final report and evidence, if permitted by the course template

The actual repository does not currently contain .env.example; add a placeholder-only example file before documenting it as available. Never commit the real .env file or credentials.

## Local development

Run these commands from the project folder in Windows PowerShell. Start MariaDB first and ensure the local .env contains the connection values required by config/settings.py.

    py -m venv .venv
    .\.venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    python manage.py check
    python manage.py makemigrations --check --dry-run
    python manage.py migrate
    python manage.py runserver

Open the application at http://127.0.0.1:8000/. The health endpoint is http://127.0.0.1:8000/health/.

The local settings currently load .env and use these database variables:

    DB_NAME
    DB_USER
    DB_PASSWORD
    DB_HOST
    DB_PORT

Do not put real values in this README. The current config/settings.py still contains a development placeholder SECRET_KEY, sets DEBUG = True, and hardcodes ALLOWED_HOSTS. Before running a production-like container, update settings to read the secret key, debug flag, and allowed hosts from environment configuration, and supply suitable values at runtime.

## Validation completed so far

The following results were provided during development:

- python manage.py check reported no system-check issues.
- python manage.py makemigrations --check --dry-run reported no changes detected.
- python manage.py migrate reported no migrations to apply.
- Manual use of the application was reported working.
- git diff --check emitted Windows LF/CRLF conversion warnings. These are line-ending notices; the output did not show whitespace errors.

These are development checks, not a complete acceptance test of every route against the original Node.js application.

## Docker progress and next steps

Docker Desktop's Linux engine was started successfully on the development machine. The project currently has:

- A multi-stage Dockerfile using an official Python 3.12 full image to build dependencies and a Python 3.12 slim image to run the application.
- Runtime MariaDB client library installation.
- A non-root application user.
- Port 8000 exposed.
- A Gunicorn command targeting config.wsgi:application.
- A .dockerignore that excludes .env, the virtual environment, Git metadata, the local SQLite database, and generated files.

Before building the image:

1. Add Gunicorn to requirements.txt; the Dockerfile's runtime command depends on it.
2. Update Django's deployment settings to use environment-provided SECRET_KEY, DEBUG, and ALLOWED_HOSTS.
3. Confirm that the Dockerfile and .dockerignore have the exact filenames shown above; remove any accidental empty Dockerfile.txt.
4. Build and inspect the image:

       docker build -t itsm-app:dev .
       docker image ls itsm-app

5. Run the image with a reachable MariaDB database and verify login, ticket CRUD, and /health/.

Do not include .env in the image or commit it to GitHub.

## Docker Compose roadmap

Create docker-compose.yaml to match the assignment's expected filename. It should define:

- A Django web service built from the Dockerfile.
- A MariaDB service using the official mariadb image.
- A named network for service-to-service communication.
- A named volume for persistent MariaDB data.
- Environment configuration for Django and MariaDB, with Django using the database service name as DB_HOST.
- An application health check that requests /health/.
- A database health check and startup dependency handling so the web service waits for MariaDB readiness.

Decide and document the host-to-container application port, database configuration, how migrations are run, and how local secrets are supplied. Validate the Compose configuration, start both services, run migrations, create a login, and verify the application and persistence across container restarts.

## Kubernetes and Minikube roadmap

The assignment calls for a Kubernetes Deployment with apiVersion: apps/v1, one replica, matching selectors and pod labels, CPU and memory requests and limits, and HTTP probes using /health/. Kubernetes calls the restart probe livenessProbe; the brief's phrase “AlivenessProbe” refers to that liveness behavior.

Prepare and document the image delivery method to Minikube, then:

1. Create a namespace and labels that are consistent across the Deployment and Service.
2. Write the Django Deployment and Service manifests.
3. Decide how the Django pods will reach MariaDB. For a self-contained Minikube deployment, plan MariaDB resources and persistence as well.
4. Apply the manifests and inspect pods, services, events, and logs.
5. Verify readiness, liveness, application health, database connectivity, and ticket operations.
6. Capture the required kubectl get pods and kubectl get services evidence.
7. Explain the chosen Service type. ClusterIP is internal to the cluster; NodePort exposes a port on a node. Choose based on how the demonstration will be accessed.

For a locally built image, Minikube documents minikube image load and minikube image build as ways to make an image available to the cluster.

## Functional and load testing roadmap

The assignment asks for at least 500 concurrent virtual users or requests for at least 60 seconds. Select a tool such as k6 or Locust and commit the script to the repository.

Before the main run:

- Define the target URL and a repeatable scenario.
- Use test data and accounts that are safe to create and modify.
- Confirm the test exercises the intended application routes.
- Run a small trial to confirm connectivity and script behavior.

For the required run, record latency percentiles, error rate, and throughput in requests per second. Also collect CPU and memory usage per pod during the test. Explain whether the Django pod appears CPU-bound or memory-bound, and relate results to the Gunicorn worker/thread configuration. Include a table or chart and discuss limitations, including Minikube host capacity and whether the load generator became a bottleneck. Do not claim a performance target was met unless the recorded results support it.

## Observability and fault-tolerance roadmap

- Capture normal pod status, application logs, and resource usage.
- Demonstrate Kubernetes recovery by causing a controlled container-process failure and recording the same pod's restart count increasing.
- A deleted Pod is replaced by a Deployment, but a replacement Pod starts with a new restart count; use a controlled container restart if the assessment specifically requires the restart counter to increase.
- If configuring an HPA, include its manifest and evidence. If only discussing an HPA, give a specific metric and threshold rationale based on the load-test results and resource requests.
- Write an honest reflection that includes partial successes, failures, and environment blockers.

## Report and submission checklist

Use the provided report template and include a cover page. Document assumptions and reasoning for:

- Python and Django versions.
- Application and database ports.
- MariaDB connection and persistence.
- Environment variables and secret handling.
- Migration strategy.
- Docker image stages and runtime server.
- Kubernetes resource values, probes, and Service type.
- Load-test scenario, measurements, and limitations.
- Fault injection and recovery evidence.

