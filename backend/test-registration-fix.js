const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

// Test data
const testEmail = 'aliasgermanpur53@gmail.com';
const testPassword = 'Ali@123456';
const testName = 'Aliasger';

async function testRegistration() {
  console.log('=== Testing Registration Flow ===\n');

  try {
    // Test 1: Try registering with existing email (should get 409 if verified, or 200 if unverified)
    console.log('Test 1: Register with existing email');
    console.log(`Email: ${testEmail}`);
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      name: testName,
      email: testEmail,
      password: testPassword,
    });

    console.log('Response Status:', registerResponse.status);
    console.log('Response Data:', JSON.stringify(registerResponse.data, null, 2));
    
    if (registerResponse.status === 200) {
      console.log('✓ Test 1 PASSED: Unverified user - verification email resent');
    } else if (registerResponse.status === 201) {
      console.log('✓ Test 1 PASSED: New user registered successfully');
    } else {
      console.log('✗ Test 1 FAILED: Unexpected status code');
    }

  } catch (error) {
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 409) {
        const message = error.response.data?.message || '';
        if (message.includes('Please sign in')) {
          console.log('✓ Test 1 PASSED: Verified user gets proper 409 with sign-in message');
        } else {
          console.log('✗ Test 1 FAILED: Wrong 409 message');
        }
      } else {
        console.log('✗ Test 1 FAILED: Unexpected error');
      }
    } else {
      console.log('✗ Test 1 FAILED: Network error or server not running');
      console.log('Error:', error.message);
    }
  }

  console.log('\n=== Test Complete ===');
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('Checking if backend server is running...');
  const isRunning = await checkServer();
  
  if (!isRunning) {
    console.log('❌ Backend server is not running on port 5000');
    console.log('Please start the backend server first with: npm start');
    process.exit(1);
  }
  
  console.log('✓ Backend server is running\n');
  await testRegistration();
}

main().catch(console.error);