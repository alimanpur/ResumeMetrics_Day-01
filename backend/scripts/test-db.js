const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const st = Date.now()
    await prisma.analysis.findMany({ take: 0 })
    console.log('DB OK in ' + (Date.now() - st) + 'ms')
    await prisma.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('DB FAIL:', err.message)
    try { await prisma.disconnect() } catch {}
    process.exit(1)
  }
}

main()
