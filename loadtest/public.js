
import http from 'k6/http';
import { check, sleep } from 'k6';

// Use Kubernetes service URL when supplied, otherwise use localhost.
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8001';

export const options = {
    vus: 25,
    duration: '60s',

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000'],
        checks: ['rate>0.99'],
    },
};

export default function () {
    // Test the public login page.
    const loginPage = http.get(`${BASE_URL}/login/`);

    check(loginPage, {
        'website login page returns 200': (r) => r.status === 200,
        'website login page has content': (r) =>
            !!r.body && r.body.length > 0,
    });

    // Test the application health endpoint.
    const health = http.get(`${BASE_URL}/health/`);

    check(health, {
        'health endpoint returns 200': (r) => r.status === 200,
    });

    sleep(1);
}
