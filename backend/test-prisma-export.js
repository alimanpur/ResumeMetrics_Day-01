const prisma = require('./src/lib/prisma.js');

async function test() {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('OK:', result);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
