# ITSM Ticket Management System

**A containerized IT Service Management application built with Django,
MariaDB, Bootstrap, Docker, Docker Compose, and Kubernetes.**

![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-blue)
![Django](https://img.shields.io/badge/Django-5.2.19-green)
![MariaDB](https://img.shields.io/badge/Database-MariaDB-003545)
![Bootstrap](https://img.shields.io/badge/Frontend-Bootstrap%205.3.3-purple)
![Docker](https://img.shields.io/badge/Container-Docker-blue)
![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5)
![Load testing](https://img.shields.io/badge/Load%20testing-k6-7D64FF)
![Status](https://img.shields.io/badge/Project-In%20Progress-orange)

------------------------------------------------------------------------

## 1. Project overview

The **ITSM Ticket Management System** is a browser-based application for
managing IT support tickets through a centralized interface.

The application follows Django's Model-View-Template (MVT) architecture
and uses MariaDB as its relational database. Bootstrap provides the
frontend interface. Docker, Docker Compose, and Kubernetes are used to
package, run, and orchestrate the application.

The project was developed for the **IT Security Management & DevOps**
course. Its scope includes application development, database
integration, containerization, orchestration, deployment validation,
performance testing, resource observation, and fault-tolerance
evaluation.

### Objectives and implementation

  -----------------------------------------------------------------------
  Objective                           Implementation
  ----------------------------------- -----------------------------------
  Web application                     Django MVT

  Database integration                MariaDB and Django ORM

  Authentication                      Django Authentication Framework

  Frontend                            HTML5, CSS3, Bootstrap

  Containerization                    Docker multi-stage image

  Multi-container deployment          Docker Compose

  Container orchestration             Kubernetes

  Local Kubernetes cluster            Minikube

  Persistent database storage         Kubernetes PersistentVolumeClaim

  Health monitoring                   Django health endpoint and
                                      Kubernetes probes

  Performance evaluation              k6 HTTP load tests

  Fault-tolerance evaluation          Kubernetes restart and recovery
                                      experiment (still to be documented)
  -----------------------------------------------------------------------

### Implementation status

Implementation, deployment, and verification are different things. A
successful deployment does not by itself prove CRUD correctness,
performance under load, or fault tolerance.

  -----------------------------------------------------------------------
  Component               Current status          Evidence / remaining
                                                  work
  ----------------------- ----------------------- -----------------------
  Django application and  Implemented             Local application and
  authentication                                  login verified

  Ticket CRUD and search  Implemented             Local verification
                                                  completed; capture
                                                  separate Kubernetes
                                                  CRUD evidence

  MariaDB integration     Implemented             Local connection and
                                                  migrations verified

  Docker image and        Implemented             Image built and used by
  Gunicorn runtime                                Compose and Minikube

  Docker Compose          Implemented             Deployment commands and
                                                  service checks
                                                  completed

  Kubernetes namespace,   Implemented             Applied to Minikube
  Deployment, Services                            profile `itsm`

  MariaDB StatefulSet and Implemented             Pod readiness and PVC
  PVC                                             binding observed

  Kubernetes health       Configured              `/health/` returned
  probes                                          HTTP 200

  In-cluster              Completed               1, 100, 200, 300, and
  public-endpoint load                            500 VU runs recorded
  test                                            

  Performance analysis    Completed for public    CPU quota/throttling
                          GET workload            evidence and
                                                  latency/throughput
                                                  analysis included below

  Kubernetes CRUD         Pending                 Demonstrate create,
  evidence                                        list/search, update,
                                                  and delete against
                                                  Kubernetes

  Original Node.js        Pending                 Compare behavior and
  comparison                                      functionality against
                                                  the supplied Node.js
                                                  application

  Controlled              Pending                 Run and document a
  fault/recovery                                  deliberate failure and
  experiment                                      recovery sequence

  Final report            In progress             Add
                                                  screenshots/evidence,
                                                  Node.js comparison, and
                                                  fault-tolerance
                                                  findings
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 2. Functional specifications

### Application features

  -----------------------------------------------------------------------
  Feature                 Description             Technology
  ----------------------- ----------------------- -----------------------
  Authentication          User login and logout   Django Auth

  Dashboard               Displays ticket         Django Views
                          information             

  Ticket creation         Creates support tickets Django ModelForm

  Ticket listing          Displays stored tickets Django ORM

  Ticket search           Searches ticket data    Django QuerySet

  Ticket modification     Updates an existing     Django ModelForm
                          ticket                  

  Ticket deletion         Deletes a ticket after  HTTP POST
                          confirmation            

  Categories              Classifies support      MariaDB
                          tickets                 

  Priority                LOW, MEDIUM, HIGH,      Django model choices
                          CRITICAL                

  Status                  OPEN, IN_PROGRESS,      Django model choices
                          PENDING, RESOLVED,      
                          CLOSED                  

  Administration          Database administration Django Admin
                          interface               

  Health endpoint         Returns application     JSON response
                          health information      
  -----------------------------------------------------------------------

### Application endpoints

  Endpoint                  HTTP method   Purpose
  ------------------------- ------------- -----------------------------
  `/`                       GET           Dashboard
  `/login/`                 GET, POST     User authentication
  `/logout/`                POST          User logout
  `/tickets/`               GET           List and search tickets
  `/tickets/create/`        GET, POST     Create a ticket
  `/tickets/<id>/edit/`     GET, POST     Update a ticket
  `/tickets/<id>/delete/`   GET, POST     Confirm and delete a ticket
  `/admin/`                 GET, POST     Django administration
  `/health/`                GET           Application health response

Ticket-management views require authentication through Django's
`login_required` decorator. The health endpoint is intended for health
checks and does not require an authenticated browser session.

------------------------------------------------------------------------

## 3. Technology stack

  Layer                       Technology               Version / notes
  --------------------------- ------------------------ ------------------------------------------
  Local development runtime   Python                   3.11.9
  Container runtime           Python                   3.12.x
  Web framework               Django                   5.2.19
  WSGI server                 Gunicorn                 Used by the container runtime
  Database                    MariaDB                  13.0.2 local; 11.4 container
  Database driver             mysqlclient              2.3.0
  Frontend                    HTML5, CSS3, Bootstrap   Bootstrap 5.3.3
  Container engine            Docker                   Local installation
  Multi-container runtime     Docker Compose           Compose plugin
  Orchestration               Kubernetes               Local Minikube cluster
  Cluster tooling             Minikube, kubectl        Profile/context `itsm`
  Load generator              k6                       2.3.0 in the temporary in-cluster runner

Exact installed versions can be checked with the version commands in the
command reference. Do not assume the local and container environments
use identical Python or MariaDB versions.

------------------------------------------------------------------------

## 4. System architecture

### 4.1 Docker Compose architecture

The Compose deployment uses separate web and database services connected
through a private Docker network. MariaDB data is stored in a named
volume.

``` mermaid
flowchart TD
    A[Client Browser] -->|HTTP :8000| B[Django Web Container]
    B --> C[Gunicorn WSGI Server]
    C -->|Database connection| D[MariaDB Container]
    D --> E[Named volume: mariadb_data]
```

Request flow:

1.  The browser sends an HTTP request to the Django web container.
2.  Gunicorn receives the request and invokes the Django application.
3.  Django processes the request through URL routing, views, forms, and
    models.
4.  Django ORM communicates with MariaDB over the Compose network.
5.  MariaDB reads or updates the required records.
6.  Django returns the HTTP response.

### 4.2 Kubernetes architecture

The Kubernetes deployment separates the web workload, database workload,
Services, and persistent storage.

``` mermaid
flowchart TD
    A[Client Browser] -->|localhost:8001| B[kubectl port-forward]
    B --> C[ClusterIP Service: itsm-web]
    C --> D[Django Deployment]
    D --> E[Django Pod]
    E -->|TCP 3306| F[MariaDB Service]
    F --> G[MariaDB StatefulSet]
    G --> H[MariaDB Pod]
    H --> I[PersistentVolumeClaim]
```

### 4.3 Network configuration

  ------------------------------------------------------------------------
  Component                                     Port Description
  --------------------- ---------------------------- ---------------------
  Django/Gunicorn                               8000 Application listener

  MariaDB                                       3306 Database listener

  Docker Compose web                       Host 8000 Browser access

  Kubernetes web                                8000 Cluster-internal
  Service                                            application access

  Kubernetes                               Host 8001 Local browser and
  port-forward                                       host-side test access

  MariaDB Service                               3306 Cluster-internal
                                                     database access
  ------------------------------------------------------------------------

The Kubernetes web Service is a `ClusterIP`; it is not directly exposed
outside the cluster. `kubectl port-forward` provides local access for
development, demonstration, and host-side validation. The clean
performance results in this README were generated from inside the
cluster using the Kubernetes Service DNS name, not through the host
port-forward tunnel.

------------------------------------------------------------------------

## 5. Application and database architecture

### 5.1 Django MVT layers

  -----------------------------------------------------------------------
  Layer                   Responsibility          Components
  ----------------------- ----------------------- -----------------------
  Presentation            User interface and form HTML, Bootstrap
                          rendering               

  Routing                 Maps HTTP requests to   Django URL
                          views                   configuration

  Application logic       Request processing      Django views

  Validation              Input validation and    Django ModelForms
                          form processing         

  Data access             Database operations     Django ORM

  Persistence             Relational data storage MariaDB
  -----------------------------------------------------------------------

### 5.2 Main database entities

  Entity        Responsibility
  ------------- ------------------------------------------
  User          Application user accounts
  Category      Ticket classifications
  Ticket        Ticket details and lifecycle information
  Comment       Model retained for possible future use
  ActivityLog   Model retained for possible future use

The current user interface focuses on ticket CRUD. Comment and
activity-log functionality is not exposed through the current interface.

``` mermaid
erDiagram
    USER ||--o{ TICKET : creates
    USER o|--o{ TICKET : assigned_to
    CATEGORY ||--o{ TICKET : categorizes

    USER {
        int id PK
        string username
        string email
    }
    CATEGORY {
        int id PK
        string name
        boolean is_active
    }
    TICKET {
        int id PK
        string title
        text description
        string priority
        string status
        datetime created_at
        datetime updated_at
        datetime resolved_at
        int category_id FK
        int created_by_id FK
        int assigned_to_id FK
    }
```

The diagram shows the principal relationships. The actual schema is
defined by the Django models and applied migrations.

------------------------------------------------------------------------

## 6. Configuration and security

### 6.1 Local environment variables

The local application reads database settings from a `.env` file using
`python-dotenv`.

Example only --- replace placeholders with values configured on your
machine:

``` dotenv
DB_NAME=itsm_db
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306
MARIADB_ROOT_PASSWORD=your_local_root_password
```

Never commit a real `.env` file or paste credentials into screenshots,
logs, reports, or issue trackers.

### 6.2 Database hostnames by environment

  Environment      `DB_HOST`       `DB_PORT`
  ---------------- ------------- -----------
  Local Windows    `localhost`          3306
  Docker Compose   `db`                 3306
  Kubernetes       `mariadb`            3306

Inside a container or Pod, `localhost` refers to that same container or
Pod. Use the database Service name to reach MariaDB from the web
workload.

### 6.3 Kubernetes Secret

The Kubernetes database Secret is named `itsm-db-secret` in namespace
`itsm`. The application receives database configuration through
Kubernetes environment configuration.

Do not print decoded Secret values. Do not commit `.env` files, decoded
Kubernetes Secret data, administrator passwords, or real Django secret
keys.

### 6.4 Security requirements and limitations

Before any production deployment, configure and verify:

-   A unique, secret Django `SECRET_KEY` supplied through secure
    configuration.
-   `DEBUG=False`.
-   Explicit, minimal `ALLOWED_HOSTS`.
-   Secure session and CSRF cookie settings.
-   HTTPS and correct reverse-proxy settings.
-   Least-privilege database credentials.
-   Secure secret storage, access control, and rotation.
-   Updated dependencies and an appropriate image vulnerability review.

The development configuration previously used `DEBUG=True` and a
placeholder Django secret key. That is not production-ready. A debug
error page was observed during development; do not expose debug pages
publicly. The current health endpoint checks application responsiveness
only and does not independently prove database availability.

------------------------------------------------------------------------

## 7. Local development setup (Windows PowerShell)

### 7.1 Prerequisites

-   Windows 10/11
-   Python 3.11.9 for the local development environment
-   MariaDB service
-   Git
-   PowerShell
-   Visual Studio Code (recommended)

### 7.2 Clone and enter the repository

``` powershell
git clone https://github.com/LordXapose/ITSM_Project_files.git
cd ITSM_Project_files
```

### 7.3 Create and activate a virtual environment

``` powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use the activation command permitted by
your machine's execution policy or run the virtual-environment Python
executable directly.

### 7.4 Install dependencies

``` powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 7.5 Configure MariaDB

Create the `itsm_db` database and a dedicated database user using your
local MariaDB administration method. Put the corresponding values in the
local `.env` file. Do not copy credentials into this README.

### 7.6 Validate, migrate, and create an administrator

``` powershell
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py migrate
python manage.py createsuperuser
```

### 7.7 Start the development server

``` powershell
python manage.py runserver
```

Local URLs:

-   Application: <http://127.0.0.1:8000/>
-   Administration: <http://127.0.0.1:8000/admin/>
-   Health endpoint: <http://127.0.0.1:8000/health/>

The Django development server is for local development. The
containerized deployment uses Gunicorn.

------------------------------------------------------------------------

## 8. Docker image build

### 8.1 Image design

The project uses a multi-stage Docker build.

  -----------------------------------------------------------------------------
  Stage                   Base image                    Responsibility
  ----------------------- ----------------------------- -----------------------
  Build                   `python:3.12-bookworm`        Dependency installation
                                                        and build preparation

  Runtime                 `python:3.12-slim-bookworm`   Application execution
  -----------------------------------------------------------------------------

The runtime image runs the application through Gunicorn using a non-root
`app` user.

### 8.2 Build and inspect

Run from the project root:

``` powershell
docker build -t itsm-app:dev .
docker images itsm-app
docker image inspect itsm-app:dev
```

The image was built successfully and used by Docker Compose and
Minikube.

------------------------------------------------------------------------

## 9. Docker Compose deployment

### 9.1 Validate and start

``` powershell
docker compose -f docker-compose.yaml config --quiet
docker compose -f docker-compose.yaml up --build -d
```

### 9.2 Check containers and logs

``` powershell
docker compose -f docker-compose.yaml ps
docker compose -f docker-compose.yaml logs --tail=100
docker compose -f docker-compose.yaml logs web
docker compose -f docker-compose.yaml logs db
```

### 9.3 Run migrations and create an administrator

``` powershell
docker compose -f docker-compose.yaml exec web python manage.py migrate
docker compose -f docker-compose.yaml exec web python manage.py createsuperuser
```

### 9.4 Access and stop

Open <http://localhost:8000/>.

``` powershell
docker compose -f docker-compose.yaml down
```

This removes the containers but retains the named database volume. **Do
not use `docker compose down -v` unless you intentionally want to delete
the associated volumes and their database data.**

------------------------------------------------------------------------

## 10. Kubernetes deployment (Minikube)

### 10.1 Cluster configuration

  Configuration                        Value
  ------------------------------------ ------------------
  Minikube profile / kubectl context   `itsm`
  Namespace                            `itsm`
  Application image                    `itsm-app:dev`
  Application Deployment               `itsm-web`
  Application Service                  `itsm-web`
  Database StatefulSet                 `mariadb`
  Database Service                     `mariadb`
  Database Secret                      `itsm-db-secret`
  Application Service type             `ClusterIP`

### 10.2 Check the cluster

``` powershell
minikube status -p itsm
kubectl --context=itsm get nodes
```

### 10.3 Build the image into Minikube

The image was rebuilt inside the Minikube profile during the Django
`ALLOWED_HOSTS` troubleshooting:

``` powershell
minikube -p itsm image build -t itsm-app:dev .
```

Alternatively, if the image was built by the host Docker daemon and is
available there:

``` powershell
minikube image load -p itsm itsm-app:dev
```

Use the method that matches where the image was built. Do not assume an
image built in one Docker environment is automatically available in
Minikube.

### 10.4 Create or update the database Secret

Run from the project root. This uses the local `.env` file as input and
does not intentionally print decoded values:

``` powershell
kubectl --context=itsm create secret generic itsm-db-secret `
  --namespace=itsm `
  --from-env-file=.env `
  --dry-run=client -o yaml |
  kubectl --context=itsm apply -f -
```

Ensure the `.env` file contains only the environment variables expected
by the Kubernetes Secret and application configuration.

### 10.5 Apply manifests and run migrations

``` powershell
kubectl --context=itsm apply -f .\k8s\
kubectl --context=itsm -n itsm rollout status deployment/itsm-web
kubectl --context=itsm -n itsm exec deployment/itsm-web -- python manage.py migrate
```

Create an administrator if the Kubernetes database does not already
contain one:

``` powershell
kubectl --context=itsm -n itsm exec -it deployment/itsm-web -- python manage.py createsuperuser
```

Local, Compose, and Kubernetes deployments use separate database
instances/volumes. An administrator created in one environment is not
automatically present in another.

### 10.6 Inspect resources

``` powershell
kubectl --context=itsm -n itsm get pods
kubectl --context=itsm -n itsm get deployments
kubectl --context=itsm -n itsm get statefulsets
kubectl --context=itsm -n itsm get services
kubectl --context=itsm -n itsm get pvc
kubectl --context=itsm -n itsm get events --sort-by=.lastTimestamp
```

### 10.7 Access the application

Run in a separate PowerShell window and leave the process running:

``` powershell
kubectl --context=itsm -n itsm port-forward service/itsm-web 8001:8000
```

Open <http://localhost:8001/>.

Host port `8001` is used because host port `8000` was already occupied
by another application environment. A port-forward process must remain
active while using this host URL.

------------------------------------------------------------------------

## 11. Health checks and application validation

### 11.1 Health endpoint

The application exposes:

``` http
GET /health/
```

Expected response:

``` json
{
  "status": "healthy",
  "application": "ITSM Project"
}
```

Validate through the host port-forward:

``` powershell
Invoke-WebRequest http://localhost:8001/health/ -UseBasicParsing
```

The observed Kubernetes response was HTTP 200 with a healthy JSON
status.

### 11.2 Kubernetes probes

The web Deployment configures readiness and liveness probes against
`/health/`.

  -----------------------------------------------------------------------
  Probe                               Purpose
  ----------------------------------- -----------------------------------
  Readiness                           Determines whether a container
                                      should receive Service traffic

  Liveness                            Determines whether Kubernetes
                                      should restart an unhealthy
                                      container

  `/health/`                          Returns application-level health
                                      information
  -----------------------------------------------------------------------

**Important limitation:** `/health/` does not independently test MariaDB
connectivity. An HTTP 200 therefore confirms that the health endpoint
responded; it does not prove every application dependency is available.

### 11.3 Django checks

``` powershell
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py migrate
```

Previously observed local check output:

``` text
System check identified no issues (0 silenced).
No changes detected
```

### 11.4 Functional evidence still required

Capture separate evidence for the Kubernetes deployment showing:

-   Successful login.
-   Ticket creation.
-   Ticket listing and search.
-   Ticket update.
-   Ticket deletion.
-   Django administration access.
-   Kubernetes health endpoint returning HTTP 200.

Local CRUD verification is not a substitute for Kubernetes CRUD
evidence.

------------------------------------------------------------------------

## 12. Load testing

`<badge>`{=html}Completed --- public GET workload`</badge>`{=html}

### 12.1 Test design and scope

The clean performance series was run **inside the Kubernetes cluster**
using k6 against:

``` text
http://itsm-web.itsm.svc.cluster.local:8000
```

The script is `loadtest/public.js`. Each iteration sends two GET
requests:

1.  `GET /login/` --- checks that the login page returns HTTP 200 and
    has a response body.
2.  `GET /health/` --- checks that the health endpoint returns HTTP 200.

The script uses a one-second sleep between iterations. The tests are
therefore a **public endpoint / read-only HTTP workload**. They do not
log in, perform authenticated ticket CRUD, create database records, or
measure write-heavy database performance. Do not describe these results
as an authenticated CRUD benchmark.

The test script defines a default of 25 VUs, a 60-second duration, and
thresholds of less than 1% failed HTTP requests, p95 latency below 1,000
ms, and checks above 99%. CLI `--vus` values override the default VU
count. The 1-VU smoke test used a 5-second duration.

### 12.2 Test execution

A temporary in-cluster runner used the `grafana/k6` image (k6 v2.3.0).
The test script was copied into the runner at `/tmp/public.js`.

Example execution command for a runner that already exists:

``` powershell
kubectl --context=itsm -n itsm exec k6-runner -- env BASE_URL=http://itsm-web.itsm.svc.cluster.local:8000 k6 run --vus 100 --duration 60s /tmp/public.js
```

Repeat with `--vus 200`, `--vus 300`, and `--vus 500` for the
corresponding test cases. The runner is temporary test infrastructure,
not part of the application deployment.

### 12.3 Clean in-cluster results

The following table consolidates the recorded clean runs. Values are
rounded for readability.

  -------------------------------------------------------------------------------------------------------------------------------------------
    Configured   Duration   Iterations       HTTP   Throughput   Average    Median       p90       p95       Max     Failed            Checks
           VUs                           requests      (req/s)   latency   latency   latency   latency   latency       HTTP 
                                                                                                                   requests 
  ------------ ---------- ------------ ---------- ------------ --------- --------- --------- --------- --------- ---------- -----------------
             1        5 s            5         10         1.98    5.3 ms   1.67 ms       ---  22.01 ms       ---         0%      100% (15/15)

           100       60 s        5,922     11,844       194.22   9.75 ms   2.61 ms   6.65 ms  14.48 ms 388.84 ms         0%              100%
                                                                                                                              (17,766/17,766)

           200       60 s       10,765     21,530       352.52  60.76 ms  24.91 ms 134.67 ms 192.54 ms 959.97 ms         0%              100%
                                                                                                                              (32,295/32,295)

           300       60 s       10,022     20,044       325.97 407.74 ms 308.69 ms 667.27 ms 693.02 ms    1.36 s         0%              100%
                                                                                                                              (30,066/30,066)

           500       60 s       10,014     20,028       321.49    1.02 s    1.00 s    1.12 s    1.20 s    2.29 s         0%              100%
                                                                                                                              (30,042/30,042)
  -------------------------------------------------------------------------------------------------------------------------------------------

**Interpretation of the results**

-   All five clean runs recorded zero failed HTTP requests and 100%
    successful checks.
-   The 200-VU run produced the highest measured throughput:
    approximately **352.52 requests/second**, with p95 latency of
    **192.54 ms**.
-   At 300 VUs, throughput fell to approximately **325.97
    requests/second** while p95 latency increased to **693.02 ms**. This
    is clear performance degradation, even though the 1-second p95
    threshold was still met.
-   At 500 VUs, throughput did not increase; it was approximately
    **321.49 requests/second**. Average latency rose to **1.02 seconds**
    and p95 to **1.20 seconds**, breaching the configured p95 threshold.
-   The 500-VU run's k6 threshold failure is a **performance/SLO
    threshold failure**, not evidence that Kubernetes or the application
    process crashed. The HTTP request failure rate remained zero and all
    checks passed.

### 12.4 Performance charts

The following Mermaid charts visualize the recorded data. Latency is
shown in milliseconds; the values are not interpolated between test
points.

``` mermaid
xychart-beta
    title "Average and p95 latency by configured VUs"
    x-axis ["1", "100", "200", "300", "500"]
    y-axis "Latency (ms)" 0 --> 1250
    line [5.3, 9.75, 60.76, 407.74, 1020]
    line [22.01, 14.48, 192.54, 693.02, 1200]
```

``` mermaid
xychart-beta
    title "HTTP throughput by configured VUs"
    x-axis ["1", "100", "200", "300", "500"]
    y-axis "Requests per second" 0 --> 400
    bar [1.98, 194.22, 352.52, 325.97, 321.49]
```

Legend for the latency chart: first line = average latency; second line
= p95 latency. The configured p95 threshold was 1,000 ms.

### 12.5 Capacity interpretation

  -----------------------------------------------------------------------
  Load level              Observed behavior       Interpretation
  ----------------------- ----------------------- -----------------------
  100 VUs                 Low latency, 194.22     Comfortable for this
                          req/s                   specific read-only
                                                  workload

  200 VUs                 Highest throughput, p95 Best observed balance
                          192.54 ms               in this test series

  300 VUs                 Latency rises sharply;  Degradation region
                          throughput declines     

  500 VUs                 p95 exceeds 1 second;   p95 SLO breach and
                          throughput remains near throughput plateau
                          321 req/s               
  -----------------------------------------------------------------------

**Practical conclusion:** 200 configured VUs is the best-performing
point in this test series, not a proven production-safe capacity limit.
The 300-VU result already shows substantial degradation. These VU values
are k6 virtual users, not simultaneous database connections or a
guaranteed number of real human users. A production capacity claim would
require longer repeated tests, realistic authenticated workflows,
CRUD/database workloads, and representative infrastructure.

### 12.6 Kubernetes resource configuration and observations

The current web Deployment configuration observed in the manifest is:

  Resource     Request           Limit
  ---------- --------- ---------------
  CPU             250m   1000m (1 CPU)
  Memory         256Mi             1Gi

Post-test `kubectl top pods` snapshots showed the web Pod at
approximately 600--720m CPU and 88--90Mi memory in the recorded
observations. MariaDB CPU was approximately 6--9m and memory
approximately 120Mi in those snapshots.

These `kubectl top` values are point-in-time observations after test
runs, **not guaranteed peak values** and not a complete time series. The
low observed MariaDB CPU suggests the web workload was more
CPU-constrained than the database during those snapshots, but it does
not prove the database cannot become a bottleneck under other workloads.

### 12.7 CPU quota and throttling evidence

The web container's cgroup reported:

``` text
cpu.max = 100000 100000
```

This represents a quota of 100,000 microseconds of CPU time per
100,000-microsecond period: a hard limit of approximately **one CPU
core**.

A before/after cgroup counter comparison around the 300-VU run recorded:

  Counter                  Before         After         Delta
  ------------------ ------------ ------------- -------------
  `usage_usec`         88,510,786   148,938,053   +60,427,267
  `nr_periods`              1,362         2,018          +656
  `nr_throttled`              580         1,181          +601
  `throttled_usec`     50,175,340   129,504,721   +79,329,381

During that measurement interval, approximately **91.6% of CPU quota
periods** were throttled (601 / 656). CPU usage increased by roughly
60.4 CPU-seconds during an interval of about 60 wall-clock seconds,
consistent with the container consuming approximately one core of CPU
capacity.

A later cumulative snapshot at the 500-VU stage reported 1,789 throttled
periods out of 2,785 total periods (approximately 64.2%). **This is a
cumulative counter ratio, not a clean 500-VU-only interval
measurement.** A comparison of the later snapshot against the 300-VU
snapshot showed 608 additional throttled periods out of 767 additional
periods (approximately 79.3%), but the interval between snapshots may
include time outside the exact 500-VU run. Treat these counters as
supporting evidence of CPU quota pressure, not as a precise per-run
throttling percentage.

``` mermaid
xychart-beta
    title "CPU quota periods during the measured 300-VU interval"
    x-axis ["All periods", "Throttled periods"]
    y-axis "Periods" 0 --> 700
    bar [656, 601]
```

### 12.8 Bottleneck analysis

The evidence is consistent with the web container reaching its one-core
CPU quota:

1.  Throughput peaks at the 200-VU test and then falls at 300 and 500
    VUs.
2.  Average and p95 latency increase sharply as configured load rises.
3.  The container has a hard one-core CPU limit.
4.  Cgroup counters show frequent CPU throttling during the measured
    high-load interval.
5.  The post-test memory observations are far below the 1Gi limit.
6.  MariaDB CPU observations are low in the recorded snapshots.

The most defensible interpretation is that **web-application CPU
capacity is the leading bottleneck indicated by this test series**. This
is evidence-based but not a complete profiling diagnosis. Application
profiling and a more realistic authenticated workload would be needed to
identify the exact Django/Gunicorn code path responsible.

### 12.9 Limitations of the load test

-   Only public GET endpoints were tested.
-   No authenticated ticket creation, update, deletion, or search
    workflow was exercised under load.
-   The tests were conducted on a local, single-node Minikube
    environment.
-   The reported resource values include post-test snapshots rather than
    continuous peak monitoring.
-   The tests were short (60 seconds for the main series).
-   The results describe this environment and workload only; they should
    not be generalized to production or to a different cluster.

------------------------------------------------------------------------

## 13. Observability and fault tolerance

### 13.1 Monitoring commands

``` powershell
kubectl --context=itsm -n itsm get pods
kubectl --context=itsm -n itsm get events --sort-by=.lastTimestamp
kubectl --context=itsm -n itsm logs deployment/itsm-web --tail=100
kubectl --context=itsm -n itsm top pods
```

To watch Pod resource usage repeatedly:

``` powershell
while ($true) {
    Get-Date -Format "HH:mm:ss"
    kubectl --context=itsm -n itsm top pods
    Start-Sleep -Seconds 2
}
```

Stop the loop with `Ctrl+C`.

### 13.2 Fault-tolerance experiment status

A previous Pod restart was observed during earlier troubleshooting, with
probe-related connection errors in the event/log history. That
observation was not a deliberately controlled experiment and must not be
presented as proof of a completed fault-tolerance test.

A controlled experiment remains required. Record:

  -----------------------------------------------------------------------
  Step                                What to capture
  ----------------------------------- -----------------------------------
  1\. Baseline                        Pod name, readiness, restart count,
                                      health response

  2\. Controlled failure              Exact action used to terminate/fail
                                      the application container

  3\. Detection                       Kubernetes event and restart-count
                                      change

  4\. Recovery                        Pod returns to Ready state

  5\. Service recovery                Health endpoint returns HTTP 200
                                      again

  6\. Data check                      Verify ticket data remains
                                      available if persistence is part of
                                      the experiment
  -----------------------------------------------------------------------

A container restart demonstrates container-level recovery only. It does
not prove database failover, multi-node high availability, backup
recovery, or disaster recovery.

### 13.3 Scaling and HPA

No Horizontal Pod Autoscaler (HPA) is currently configured. The current
web Deployment has one replica. Its observed resource configuration is
250m CPU request / 1000m CPU limit and 256Mi memory request / 1Gi memory
limit.

Any future HPA threshold should be justified using measured resource
usage, response latency, replica behavior, and database connection
capacity. Adding replicas may improve web-tier concurrency, but it does
not automatically scale the MariaDB StatefulSet or remove a database
bottleneck. A single-node Minikube environment also cannot demonstrate
high availability across independent worker nodes.

------------------------------------------------------------------------

## 14. Troubleshooting record

This section records issues encountered during implementation and the
practical checks used to isolate them.

  --------------------------------------------------------------------------------------------------
  Symptom                 Likely cause /          Resolution or check
                          diagnosis               
  ----------------------- ----------------------- --------------------------------------------------
  Django cannot connect   Incorrect credentials,  Verify `.env`, MariaDB service, database name, and
  to MariaDB              service state, or       port
                          database hostname       

  MariaDB connection      Database service is     Check the MariaDB Windows service and port 3306
  refused                 stopped or not          
                          listening               

  Container cannot reach  `localhost` points to   Use Compose service name `db` or Kubernetes
  database using          the web container       Service name `mariadb`
  `localhost`             itself                  

  Django migration fails  Database unavailable or Check DB connectivity and inspect the full
                          migration state         migration error before retrying
                          inconsistent            

  Docker image            Image exists in host    Use
  unavailable to Minikube Docker but not in       `minikube -p itsm image build -t itsm-app:dev .`
                          Minikube's image store  or `minikube image load -p itsm itsm-app:dev`

  Kubernetes Pod does not Scheduling, image,      Use `describe pod`, events, and container logs
  become Ready            startup, probe, or      
                          dependency problem      

  Kubernetes HTTP 400     Django rejected the     Add the exact internal hostname to the
  from in-cluster         Service DNS hostname    environment's allowed-host configuration, rebuild
  requests                because it was missing  the image, and restart the Deployment
                          from `ALLOWED_HOSTS`    

  Kubernetes rollout uses The image was rebuilt   Rebuild/load the image and restart/roll out the
  an old image            but the Pod was not     Deployment; verify the running image
                          replaced, or the image  
                          pull policy/tag         
                          behavior is             
                          inconsistent            

  `kubectl top pods`      Metrics API is not      Check Minikube metrics components and allow
  unavailable             ready or enabled        metrics to initialize

  `k6` is not recognized  k6 is not installed on  Use the in-cluster k6 runner or install k6 locally
  in PowerShell           the Windows host        if permitted

  Host-side load test     Port-forward stopped or Confirm the port-forward process is running;
  reports connection      host tunnel failed      distinguish tunnel failure from an application
  refused                                         response

  k6 exits with code 99   A configured threshold  Inspect the summary; in the clean run p95 exceeded
  after 500 VUs           was breached            1,000 ms while HTTP failures remained 0%

  Earlier Pod restart /   Historical              Inspect events and logs; do not attribute these to
  probe failures          readiness/liveness      the later clean load tests without matching
                          connection errors       timestamps
  --------------------------------------------------------------------------------------------------

### Useful diagnostic commands

``` powershell
kubectl --context=itsm -n itsm describe pod <pod-name>
kubectl --context=itsm -n itsm logs deployment/itsm-web --tail=200
kubectl --context=itsm -n itsm get events --sort-by=.lastTimestamp
kubectl --context=itsm -n itsm rollout status deployment/itsm-web
kubectl --context=itsm -n itsm get deployment itsm-web -o yaml
```

Replace `<pod-name>` with the actual Pod name. These commands inspect
state; they do not modify the deployment.

------------------------------------------------------------------------

## 15. Repository structure

The main project structure is:

``` text
ITSM_Project_files/
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── core/
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── templates/
│   └── core/
├── static/
│   ├── css/
│   └── js/
├── k8s/
│   ├── deployment.yaml
│   ├── mariadb.yaml
│   ├── namespace.yaml
│   └── service.yaml
├── loadtest/
│   ├── public.js
│   ├── authenticated.js
│   ├── baseline.js
│   └── concurrency.js
├── Dockerfile
├── .dockerignore
├── .gitignore
├── docker-compose.yaml
├── manage.py
├── README.md
└── requirements.txt
```

The repository may contain additional project files. Do not commit
`.env`, virtual environments, generated debug/error output, database
files, caches, or machine-specific files.

------------------------------------------------------------------------

## 16. Git and GitHub workflow

### 16.1 Inspect changes

``` powershell
git status -sb
git branch --show-current
git remote -v
git diff --check
git diff
```

### 16.2 Stage relevant project files

Stage only files intended for submission. For example:

``` powershell
git add README.md Dockerfile .dockerignore docker-compose.yaml k8s config core templates static requirements.txt loadtest
git status
```

Before committing, inspect staged changes:

``` powershell
git diff --cached --check
git diff --cached --stat
git diff --cached
```

Never stage `.env`, credentials, virtual environments, local database
files, or generated test logs.

### 16.3 Commit and push

``` powershell
git commit -m "Finalize ITSM deployment and performance documentation"
git push origin main
```

If the push is rejected because the remote branch has new commits, first
fetch/rebase carefully, resolve any conflicts, then push:

``` powershell
git pull --rebase origin main
git push origin main
```

Repository: <https://github.com/LordXapose/ITSM_Project_files>

------------------------------------------------------------------------

## 17. Assignment completion matrix

  -----------------------------------------------------------------------
  Deliverable             Current state           Remaining work
  ----------------------- ----------------------- -----------------------
  1\. Containerization    Django app, Docker      Verify parity with the
  and setup               image, and Compose      original Node.js
                          deployment implemented  application; harden
                                                  runtime settings

  2\. Kubernetes          Minikube deployment     Capture Kubernetes CRUD
  deployment              operational             and deployment evidence

  3\. Functional          Public endpoint load    Capture Kubernetes CRUD
  validation and load     tests completed         evidence; add realistic
  testing                                         authenticated workload
                                                  if required

  4\. Observability and   Resource and            Complete controlled
  fault tolerance         performance             failure/recovery
                          observations recorded   experiment and document
                                                  evidence

  5\. Final report and    README and project      Add evidence, Node.js
  repository              documentation present   comparison,
                                                  fault-tolerance
                                                  results, and final
                                                  reflection
  -----------------------------------------------------------------------

### Final submission checklist

-   [x] Django application source code and database models/migrations.
-   [x] Dockerfile and Docker Compose configuration.
-   [x] Kubernetes manifests.
-   [x] Minikube deployment and health endpoint validation.
-   [x] In-cluster public endpoint load-test script and recorded
    results.
-   [x] Performance analysis with latency, throughput, and CPU quota
    observations.
-   [ ] Kubernetes CRUD verification evidence.
-   [ ] Comparison against the original Node.js application.
-   [ ] Controlled fault-tolerance experiment and recovery evidence.
-   [ ] Final technical report, screenshots, and reflection.

------------------------------------------------------------------------

## 18. Project information

  -----------------------------------------------------------------------------------------------------------------------
  Field                               Details
  ----------------------------------- -----------------------------------------------------------------------------------
  Project                             ITSM Ticket Management System

  Course                              IT Security Management & DevOps

  Backend                             Django

  Database                            MariaDB

  Frontend                            Bootstrap

  Containerization                    Docker

  Orchestration                       Docker Compose and Kubernetes

  Local cluster                       Minikube

  Load testing                        k6

  Repository                          [LordXapose/ITSM_Project_files](https://github.com/LordXapose/ITSM_Project_files)
  -----------------------------------------------------------------------------------------------------------------------

**Performance conclusion:** In the measured public GET workload,
throughput peaked at approximately 352.52 requests/second at 200
configured VUs. Throughput then plateaued while latency increased; the
500-VU run breached the 1-second p95 threshold. CPU quota/throttling
observations indicate that the one-core web-container limit is a likely
constraint. These results are specific to the local Minikube setup and
do not establish production capacity.
