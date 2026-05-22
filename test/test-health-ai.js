async function check(url, method='GET', body) {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const text = await res.text();
    console.log(`${url} -> ${res.status}`);
    console.log(text.slice(0, 1000));
    return res.status;
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message || err);
    return 0;
  }
}

async function run() {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  console.log('Using base URL:', base);
  // Public health endpoints - retry simple health endpoint until ready
  const endpoints = [
    '/api/health',
    '/api/health/openrouter',
    '/api/health/email',
    '/api/health/email-queue'
  ];

  let failures = 0;
  for (const ep of endpoints) {
    const url = `${base}${ep}`;
    // retry a few times for transient startup delays
    let ok = false;
    for (let i = 0; i < 5; i++) {
      const status = await check(url);
      if (status >= 200 && status < 300) { ok = true; break; }
      await new Promise((r) => setTimeout(r, 1000));
    }
    if (!ok) {
      console.error(`Endpoint ${url} failed health checks`);
      failures++;
    }
  }

  // Optional: test test-email endpoint (POST)
  const testEmailStatus = await check(`${base}/api/test-email`, 'POST', { email: process.env.TEST_EMAIL || 'test@example.com' });
  if (!(testEmailStatus >= 200 && testEmailStatus < 300)) {
    console.warn('test-email endpoint did not return 2xx; continuing (optional)');
  }

  if (failures > 0) {
    console.error(`${failures} endpoint(s) failed`);
    process.exit(2);
  }

  console.log('Health & AI checks complete');
}

run().catch((e) => {
  console.error('Test runner error', e);
  process.exit(1);
});
