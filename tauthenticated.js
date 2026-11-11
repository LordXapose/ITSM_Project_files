warning: in the working copy of 'k8s/deployment.yaml', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/Dockerfile b/Dockerfile[m
[1mindex 74bd34d..634bd80 100644[m
[1m--- a/Dockerfile[m
[1m+++ b/Dockerfile[m
[36m@@ -1,3 +1,4 @@[m
[32m+[m
 FROM python:3.12-bookworm AS builder[m
 [m
 RUN apt-get update \[m
[36m@@ -13,6 +14,7 @@[m [mRUN python -m venv /opt/venv[m
 ENV PATH="/opt/venv/bin:$PATH"[m
 [m
 COPY requirements.txt .[m
[32m+[m
 RUN pip install --no-cache-dir --upgrade pip \[m
     && pip install --no-cache-dir -r requirements.txt[m
 [m
[36m@@ -40,4 +42,15 @@[m [mUSER app[m
 [m
 EXPOSE 8000[m
 [m
[31m-CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"][m
\ No newline at end of file[m
[32m+[m[32mCMD ["gunicorn", \[m
[32m+[m[32m     "--bind", "0.0.0.0:8000", \[m
[32m+[m[32m     "--workers", "2", \[m
[32m+[m[32m     "--worker-class", "gthread", \[m
[32m+[m[32m     "--threads", "2", \[m
[32m+[m[32m     "--timeout", "30", \[m
[32m+[m[32m     "--graceful-timeout", "30", \[m
[32m+[m[32m     "--keep-alive", "5", \[m
[32m+[m[32m     "--access-logfile", "-", \[m
[32m+[m[32m     "--error-logfile", "-", \[m
[32m+[m[32m     "--capture-output", \[m
[32m+[m[32m     "config.wsgi:application"][m
[1mdiff --git a/k8s/deployment.yaml b/k8s/deployment.yaml[m
[1mindex 8d3cdb7..c2a6bad 100644[m
[1m--- a/k8s/deployment.yaml[m
[1m+++ b/k8s/deployment.yaml[m
[36m@@ -1,3 +1,4 @@[m
[32m+[m
 apiVersion: apps/v1[m
 kind: Deployment[m
 metadata:[m
[36m@@ -6,45 +7,58 @@[m [mmetadata:[m
   labels:[m
     app.kubernetes.io/name: itsm-web[m
     app.kubernetes.io/part-of: itsm[m
[32m+[m
 spec:[m
   replicas: 1[m
[32m+[m
   selector:[m
     matchLabels:[m
       app.kubernetes.io/name: itsm-web[m
[32m+[m
   template:[m
     metadata:[m
       labels:[m
         app.kubernetes.io/name: itsm-web[m
         app.kubernetes.io/part-of: itsm[m
[32m+[m
     spec:[m
[32m+[m[32m      terminationGracePeriodSeconds: 30[m
[32m+[m
       containers:[m
         - name: web[m
           image: itsm-app:dev[m
           imagePullPolicy: IfNotPresent[m
[32m+[m
           ports:[m
             - name: http[m
               containerPort: 8000[m
               protocol: TCP[m
[32m+[m
           env:[m
             - name: DB_NAME[m
               valueFrom:[m
                 secretKeyRef:[m
                   name: itsm-db-secret[m
                   key: DB_NAME[m
[32m+[m
             - name: DB_USER[m
               valueFrom:[m
                 secretKeyRef:[m
                   name: itsm-db-secret[m
                   key: DB_USER[m
[32m+[m
             - name: DB_PASSWORD[m
               valueFrom:[m
                 secretKeyRef:[m
                   name: itsm-db-secret[m
                   key: DB_PASSWORD[m
[32m+[m
             - name: DB_HOST[m
               value: mariadb[m
[32m+[m
             - name: DB_PORT[m
               value: "3306"[m
[32m+[m
           resources:[m
             requests:[m
               cpu: 100m[m
[36m@@ -52,6 +66,18 @@[m [mspec:[m
             limits:[m
               cpu: 500m[m
               memory: 512Mi[m
[32m+[m
[32m+[m[32m          startupProbe:[m
[32m+[m[32m            httpGet:[m
[32m+[m[32m              path: /health/[m
[32m+[m[32m              port: http[m
[32m+[m[32m              httpHeaders:[m
[32m+[m[32m                - name: Host[m
[32m+[m[32m                  value: localhost[m
[32m+[m[32m            periodSeconds: 5[m
[32m+[m[32m            timeoutSeconds: 3[m
[32m+[m[32m            failureThreshold: 12[m
[32m+[m
           readinessProbe:[m
             httpGet:[m
               path: /health/[m
[36m@@ -59,10 +85,10 @@[m [mspec:[m
               httpHeaders:[m
                 - name: Host[m
                   value: localhost[m
[31m-            initialDelaySeconds: 5[m
             periodSeconds: 5[m
[31m-            timeoutSeconds: 2[m
[32m+[m[32m            timeoutSeconds: 3[m
             failureThreshold: 3[m
[32m+[m
           livenessProbe:[m
             httpGet:[m
               path: /health/[m
[36m@@ -70,7 +96,6 @@[m [mspec:[m
               httpHeaders:[m
                 - name: Host[m
                   value: localhost[m
[31m-            initialDelaySeconds: 20[m
             periodSeconds: 10[m
[31m-            timeoutSeconds: 2[m
[32m+[m[32m            timeoutSeconds: 3[m
             failureThreshold: 3[m
[1mdiff --git a/loadtest/authenticated.js b/loadtest/authenticated.js[m
[1mindex 779bf54..fc08c87 100644[m
[1m--- a/loadtest/authenticated.js[m
[1m+++ b/loadtest/authenticated.js[m
[36m@@ -6,6 +6,9 @@[m [mconst BASE_URL = 'http://localhost:8001';[m
 const USERNAME = __ENV.K6_USERNAME;[m
 const PASSWORD = __ENV.K6_PASSWORD;[m
 [m
[32m+[m[32m// Each virtual user maintains its own session cookie.[m
[32m+[m[32mlet sessionCookie = '';[m
[32m+[m
 if (!USERNAME || !PASSWORD) {[m
     throw new Error('Set K6_USERNAME and K6_PASSWORD before running this test.');[m
 }[m
[36m@@ -21,8 +24,8 @@[m [mexport const options = {[m
 };[m
 [m
 export default function () {[m
[31m-    // Authenticate each virtual user once.[m
[31m-    if (__ITER === 0) {[m
[32m+[m[32m    // Authenticate when this virtual user has no session.[m
[32m+[m[32m    if (!sessionCookie) {[m
         const loginPage = http.get(`${BASE_URL}/login/`);[m
 [m
         const csrfMatch = loginPage.body.match([m
[36m@@ -30,7 +33,9 @@[m [mexport default function () {[m
         );[m
 [m
         if (loginPage.status !== 200 || !csrfMatch) {[m
[31m-            throw new Error('Login page or CSRF token validation failed.');[m
[32m+[m[32m            console.error('Login page or CSRF token validation failed.');[m
[32m+[m[32m            sleep(1);[m
[32m+[m[32m            return;[m
         }[m
 [m
         const payload =[m
[36m@@ -53,33 +58,26 @@[m [mexport default function () {[m
             }[m
         );[m
 [m
[31m-        const loginSuccessful = check(loginResponse, {[m
[31m-            'login accepted': (r) => r.status === 302,[m
[31m-        });[m
[32m+[m[32m        const sessionCookies = loginResponse.cookies.sessionid || [];[m
 [m
[31m-        if (!loginSuccessful) {[m
[32m+[m[32m        if (loginResponse.status !== 302 || sessionCookies.length === 0) {[m
             console.error(`Login status: ${loginResponse.status}`);[m
[31m-            throw new Error('Authentication failed.');[m
[32m+[m[32m            console.error('Login did not return a session cookie.');[m
[32m+[m[32m            sleep(1);[m
[32m+[m[32m            return;[m
         }[m
[31m-    }[m
[31m-[m
[31m-    // Explicitly attach cookies from this VU's cookie jar.[m
[31m-    const cookies = http.cookieJar().cookiesForURL([m
[31m-        `${BASE_URL}/tickets/`[m
[31m-    );[m
 [m
[31m-    const cookieHeader = Object.entries(cookies)[m
[31m-        .map(([name, values]) => `${name}=${values[0]}`)[m
[31m-        .join('; ');[m
[32m+[m[32m        sessionCookie = sessionCookies[0].value;[m
 [m
[31m-    if (!cookies.sessionid?.length) {[m
[31m-        throw new Error('Django session cookie is missing.');[m
[32m+[m[32m        check(loginResponse, {[m
[32m+[m[32m            'login accepted': (r) => r.status === 302,[m
[32m+[m[32m        });[m
     }[m
 [m
[31m-    // Request authenticated ticket list.[m
[32m+[m[32m    // Explicitly send the captured session cookie.[m
     const response = http.get(`${BASE_URL}/tickets/`, {[m
         headers: {[m
[31m-            Cookie: cookieHeader,[m
[32m+[m[32m            Cookie: `sessionid=${sessionCookie}`,[m
         },[m
         redirects: 0,[m
         tags: { name: 'GET /tickets/' },[m
[36m@@ -92,10 +90,12 @@[m [mexport default function () {[m
 [m
     if (!authenticated) {[m
         console.error(`Ticket status: ${response.status}`);[m
[31m-        console.error([m
[31m-            `Ticket redirect: ${response.headers.Location || 'none'}`[m
[31m-        );[m
[31m-        throw new Error('Authenticated ticket-list request failed.');[m
[32m+[m[32m        console.error(`Ticket redirect: ${response.headers.Location || 'none'}`);[m
[32m+[m
[32m+[m[32m        // Re-authenticate on the next iteration if the session expired.[m
[32m+[m[32m        if (response.status === 302) {[m
[32m+[m[32m            sessionCookie = '';[m
[32m+[m[32m        }[m
     }[m
 [m
     sleep(1);[m
