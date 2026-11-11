import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 5,
    duration: '30s',

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000'],
    },
};

export default function () {
    const response = http.get('http://localhost:8001/health/');

    check(response, {
        'status is 200': (r) => r.status === 200,
        'response is healthy': (r) =>
            r.json('status') === 'healthy',
    });

    sleep(1);
}