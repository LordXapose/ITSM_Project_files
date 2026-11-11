
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8001';
const USERNAME = __ENV.K6_USERNAME;
const PASSWORD = __ENV.K6_PASSWORD;

// Each virtual user maintains its own session cookie.
let sessionCookie = '';

if (!USERNAME || !PASSWORD) {
    throw new Error('Set K6_USERNAME and K6_PASSWORD before running this test.');
}

export const options = {
    vus: 50,
    duration: '60s',

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000'],
        checks: ['rate>0.99'],
    },
};

export default function () {
    // Authenticate when this virtual user has no session.
    if (!sessionCookie) {
        const loginPage = http.get(`${BASE_URL}/login/`, {
            tags: { name: 'GET /login/' },
        });

        const validLoginPage = check(loginPage, {
            'login page returns 200': (r) => r.status === 200,
            'login page has a response body': (r) =>
                typeof r.body === 'string',
        });

        if (!validLoginPage || typeof loginPage.body !== 'string') {
            console.error(`Login page request failed. Status: ${loginPage.status}`);
            sleep(1);
            return;
        }

        const csrfMatch = loginPage.body.match(
            /name=["']csrfmiddlewaretoken["'][^>]*value=["']([^"']+)["']/i
        );

        if (!check(loginPage, {
            'CSRF token exists': () => csrfMatch !== null,
        })) {
            console.error('CSRF token was not found.');
            sleep(1);
            return;
        }

        const payload =
            'csrfmiddlewaretoken=' + encodeURIComponent(csrfMatch[1]) +
            '&next=' +
            '&username=' + encodeURIComponent(USERNAME) +
            '&password=' + encodeURIComponent(PASSWORD);

        const loginResponse = http.post(
            `${BASE_URL}/login/`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': `${BASE_URL}/login/`,
                    'Origin': BASE_URL,
                },
                redirects: 0,
                tags: { name: 'POST /login/' },
            }
        );

        const sessionCookies = loginResponse.cookies.sessionid || [];

        const loginAccepted = check(loginResponse, {
            'login accepted': (r) => r.status === 302,
            'session cookie returned': () => sessionCookies.length > 0,
        });

        if (!loginAccepted) {
            console.error(`Login status: ${loginResponse.status}`);
            console.error('Login failed or session cookie was missing.');
            sleep(1);
            return;
        }

        sessionCookie = sessionCookies[0].value;
    }

    // Request the authenticated ticket list.
    const response = http.get(`${BASE_URL}/tickets/`, {
        headers: {
            Cookie: `sessionid=${sessionCookie}`,
        },
        redirects: 0,
        tags: { name: 'GET /tickets/' },
    });

    const authenticated = check(response, {
        'authenticated ticket list returns 200': (r) =>
            r.status === 200 && r.url.endsWith('/tickets/'),
    });

    if (!authenticated) {
        console.error(`Ticket status: ${response.status}`);
        console.error(`Ticket redirect: ${response.headers.Location || 'none'}`);

        // Clear expired sessions and authenticate again next iteration.
        if (response.status === 302) {
            sessionCookie = '';
        }
    }

    sleep(1);
}
