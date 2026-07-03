const http = require('http');

async function test() {
  // First login to get a token
  const loginData = JSON.stringify({ email: 'test@example.com', password: 'testpass123' });
  
  const loginResult = await new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(loginData);
    req.end();
  });
  
  const token = loginResult.data.accessToken;
  console.log('Token:', token ? 'Obtained' : 'Missing');
  
  // Now test profile endpoint
  const profile = await new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/profile',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log('Profile status:', res.statusCode);
        console.log('Profile body:', body.substring(0, 200));
        resolve(JSON.parse(body));
      });
    });
    req.on('error', reject);
    req.end();
  });
}

test().catch(console.error);
