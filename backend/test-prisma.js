require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const points = await prisma.sellingPoint.findMany({
      include: {
        announcementProfiles: { include: { stockListings: true } },
        assignments: { include: { contact: true } },
        company: true
      }
    });
    console.log("SUCCESS:", JSON.stringify(points).slice(0, 100));
  } catch (error) {
    console.log("JSON ERROR:");
    console.error(error);
  }
}
main().finally(() => prisma.$disconnect());
