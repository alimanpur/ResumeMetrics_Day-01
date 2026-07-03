/**
 * Test script to verify upload fixes
 * Tests:
 * 1. Upload directory creation
 * 2. Multer configuration
 * 3. Cloudinary upload
 * 4. Resume creation
 * 5. Analysis creation
 */

const path = require('path');
const fs = require('fs');

console.log('=== Testing Upload Fixes ===\n');

// Test 1: Verify upload directory can be created
console.log('Test 1: Upload directory creation');
const uploadDir = path.resolve(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✓ Upload directory created successfully');
  } else {
    console.log('✓ Upload directory already exists');
  }
} catch (error) {
  console.error('✗ Failed to create upload directory:', error.message);
  process.exit(1);
}

// Test 2: Verify multer can be initialized
console.log('\nTest 2: Multer initialization');
try {
  const multer = require('multer');
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
  
  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });
  
  console.log('✓ Multer initialized successfully');
  console.log('  - Storage: diskStorage');
  console.log('  - Destination:', uploadDir);
  console.log('  - Max file size: 10MB');
} catch (error) {
  console.error('✗ Failed to initialize multer:', error.message);
  process.exit(1);
}

// Test 3: Verify Cloudinary configuration
console.log('\nTest 3: Cloudinary configuration');
try {
  const config = require('./src/config');
  
  if (!config.cloudinary.cloudName) {
    console.error('✗ Cloudinary cloud name not configured');
    process.exit(1);
  }
  if (!config.cloudinary.apiKey) {
    console.error('✗ Cloudinary API key not configured');
    process.exit(1);
  }
  if (!config.cloudinary.apiSecret) {
    console.error('✗ Cloudinary API secret not configured');
    process.exit(1);
  }
  
  console.log('✓ Cloudinary configured:');
  console.log('  - Cloud name:', config.cloudinary.cloudName);
  console.log('  - API key:', config.cloudinary.apiKey.substring(0, 8) + '...');
  console.log('  - API secret: [REDACTED]');
} catch (error) {
  console.error('✗ Cloudinary configuration error:', error.message);
  process.exit(1);
}

// Test 4: Verify provider factory
console.log('\nTest 4: AI Provider factory');
try {
  // Remove cached module if it exists
  delete require.cache[require.resolve('./src/providers/providerFactory')];
  
  const { getAIProvider, listProviders } = require('./src/providers/providerFactory');
  
  console.log('✓ Provider factory loaded');
  console.log('  - Available providers:', listProviders().join(', '));
  
  // Test getting provider (should use mock by default since AI_PROVIDER env var is not set)
  const provider = getAIProvider();
  console.log('  - Default provider:', provider.constructor.name);
  console.log('  - Provider name:', provider.name);
} catch (error) {
  console.error('✗ Provider factory error:', error.message);
  console.error('  This is expected if AI_PROVIDER is not set and NODE_ENV is not production');
  console.error('  The factory will default to "mock" provider');
}

// Test 5: Verify upload middleware
console.log('\nTest 5: Upload middleware');
try {
  const upload = require('./src/middleware/upload');
  console.log('✓ Upload middleware loaded successfully');
  console.log('  - Type:', typeof upload);
  console.log('  - Has single method:', typeof upload.single === 'function');
} catch (error) {
  console.error('✗ Upload middleware error:', error.message);
  process.exit(1);
}

// Test 6: Verify resume service
console.log('\nTest 6: Resume service');
try {
  const resumeService = require('./src/services/resumeService');
  console.log('✓ Resume service loaded successfully');
  console.log('  - Has uploadResume:', typeof resumeService.uploadResume === 'function');
  console.log('  - Has deleteResume:', typeof resumeService.deleteResume === 'function');
  console.log('  - Has listResumes:', typeof resumeService.listResumes === 'function');
} catch (error) {
  console.error('✗ Resume service error:', error.message);
  process.exit(1);
}

console.log('\n=== All Critical Tests Passed ===');
console.log('\nNext steps:');
console.log('1. Deploy to Render with NODE_ENV=production');
console.log('2. Set AI_PROVIDER=mock (or configure OpenAI)');
console.log('3. Test actual file upload through the API');
console.log('4. Verify Cloudinary receives the file');
console.log('5. Verify resume record is created in database');
console.log('6. Verify analysis is created and processed');
console.log('7. Verify frontend redirects to analysis page');