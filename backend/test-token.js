const http = require('http');
const jwt = require('jsonwebtoken');

async function test() {
  // Read the env file directly to get JWT_SECRET
  const fs = require('fs');
  const envContent = fs.readFileSync('.env', 'utf8');
  const jwtMatch = envContent.match(/JWT_SECRET="([^"]+)"/);
  const jwtSecret = jwtMatch ? jwtMatch[1] : null;
  console.log('JWT_SECRET from .env:', jwtSecret ? 'Found (length: ' + jwtSecret.length + ')' : 'Not found');
  
  // Create a test token
  const testPayload = { userId: 'test-user-id' };
  const testToken = jwt.sign(testPayload, jwtSecret, { expiresIn: '15m' });
  console.log('Test token created');
  
  // Verify it
  try {
    const decoded = jwt.verify(testToken, jwtSecret);
    console.log('Token verification: OK, userId:', decoded.userId);
  } catch (error) {
    console.log('Token verification failed:', error.message);
  }
  
  // Now test with the actual API
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
  console.log('\nLogin token obtained');
  
  // Decode without verifying to see payload
  const decoded = jwt.decode(token);
  console.log('Token payload:', decoded);
  
  // Verify with the same secret
  const verified = jwt.verify(token, jwtSecret);
  console.log('Token verified with .env secret, userId:', verified.userId);
  
  // Test profile
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
        console.log('Profile body:', body.substring(0, 500));
        resolve(JSON.parse(body));
      });
    });
    req.on('error', reject);
    req.end();
  });
}

test().catch(console.error);
