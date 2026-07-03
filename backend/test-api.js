const http = require('http');

async function testRegister() {
  const data = JSON.stringify({ email: 'test@example.com', password: 'testpass123', name: 'Test User' });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Body:', body);
        resolve();
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function testLogin() {
  const data = JSON.stringify({ email: 'test@example.com', password: 'testpass123' });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        const parsed = JSON.parse(body);
        console.log('Has accessToken:', !!parsed.data?.accessToken);
        console.log('Has user:', !!parsed.data?.user);
        console.log('User name:', parsed.data?.user?.name);
        resolve(parsed);
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('--- Testing API endpoints ---');
  
  try {
    console.log('\n1. Testing GET /api/health...');
    const health = await new Promise((resolve, reject) => {
      http.get('http://localhost:5000/api/health', (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });
    console.log('Health:', health.success ? 'OK' : 'FAIL');
    
    console.log('\n2. Testing POST /api/v1/auth/register...');
    await testRegister();
    
    console.log('\n3. Testing POST /api/v1/auth/login...');
    const loginResult = await testLogin();
    const accessToken = loginResult.data?.accessToken;
    
    if (accessToken) {
      console.log('\n4. Testing GET /api/v1/auth/profile with token...');
      const profile = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/v1/auth/profile',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };
        const req = http.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', reject);
        req.end();
      });
      console.log('Profile status:', profile.success ? 'OK' : 'FAIL');
      console.log('Profile user:', profile.data?.name);
    }
    
    console.log('\n5. Testing GET /api/v1/resumes (empty)...');
    const resumes = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/resumes',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      });
      req.on('error', reject);
      req.end();
    });
    console.log('Resumes status:', resumes.success ? 'OK' : 'FAIL');
    console.log('Resumes count:', resumes.data?.resumes?.length);
    
    console.log('\n6. Testing GET /api/v1/settings...');
    const settings = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/settings',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      });
      req.on('error', reject);
      req.end();
    });
    console.log('Settings status:', settings.success ? 'OK' : 'FAIL');
    
    console.log('\n7. Testing GET /api/v1/billing...');
    const billing = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/billing',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      });
      req.on('error', reject);
      req.end();
    });
    console.log('Billing status:', billing.success ? 'OK' : 'FAIL');
    
    console.log('\n--- All tests completed ---');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

main();
