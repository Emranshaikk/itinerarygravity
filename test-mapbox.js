const { generateStaticMapUrl } = require('./src/lib/map-utils');
require('dotenv').config({ path: '.env.local' });

const coords = [
    [18.4026, -33.9482],
    [18.3712, -33.8066],
    [18.4208, -33.9036]
];

const url = generateStaticMapUrl(coords);
console.log("Generated URL:", url);

async function testFetch() {
    try {
        const res = await fetch(url);
        console.log("Status:", res.status, res.statusText);
        if (!res.ok) {
            const body = await res.text();
            console.log("Error body:", body);
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
testFetch();
