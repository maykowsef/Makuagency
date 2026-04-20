const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Create a Company
  const company1 = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Elite Motors Group',
      industry: 'Automotive',
      city: 'Beverly Hills',
      country: 'USA',
      email: 'hq@elitemotors.com',
      status: 'Active'
    }
  });

  const company2 = await prisma.company.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Parisian Bistro Group',
      industry: 'Restaurant',
      city: 'Paris',
      country: 'France',
      email: 'contact@bistrogroup.fr',
      status: 'Active'
    }
  });

  // 2. Create Selling Points
  const sp1 = await prisma.sellingPoint.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyId: company1.id,
      name: 'Elite Motors Beverly Hills',
      businessType: 'Used Car Dealer',
      industry: 'automotive',
      street: '123 Luxury Avenue',
      city: 'Beverly Hills',
      postalCode: '90210',
      country: 'USA',
      email: 'sales@elitemotors.com',
      description: 'Premium used car dealership specializing in luxury vehicles.',
      status: 'Active',
      priority: 'High',
      phones: [
        { id: 1, number: '+1 555 123 4567', type: 'Work', isPrimary: true }
      ]
    }
  });

  const sp2 = await prisma.sellingPoint.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      companyId: company2.id,
      name: 'Bistro Le Paris',
      businessType: 'Restaurant',
      industry: 'restaurant',
      street: '15 Rue de la République',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      email: 'contact@bistroparis.fr',
      description: 'Authentic French bistro in the heart of Paris.',
      status: 'Active',
      priority: 'Medium',
      phones: [
        { id: 1, number: '+33 1 42 86 82 00', type: 'Work', isPrimary: true }
      ]
    }
  });

  // 3. Create a Minisite for Elite Motors
  await prisma.minisite.upsert({
    where: { domain: 'elitemotors.minisite.io' },
    update: {},
    create: {
      sellingPointId: sp1.id,
      domain: 'elitemotors.minisite.io',
      templateId: 'car-dealer-modern',
      businessType: 'Used Car Dealer',
      isActive: true,
      overrides: { primaryColor: '#000000' }
    }
  });

  // 4. Create Announcement Profile and Stock for Elite Motors
  const profile1 = await prisma.announcementProfile.create({
    data: {
      sellingPointId: sp1.id,
      siteId: 'autotrader',
      platform: 'AutoTrader',
      url: 'https://autotrader.com/elitemotors',
      targetListings: 10,
      isPrimary: true
    }
  });

  await prisma.stockListing.create({
    data: {
      profileId: profile1.id,
      reference: 'CAR-001',
      name: 'BMW M4 Competition',
      price: 85000,
      url: 'https://autotrader.com/listing/12345',
      description: 'Stunning BMW M4 in Alpine White.',
      attributes: {
        vehicleType: 'Coupe',
        mileage: 15000,
        fuelType: 'Petrol',
        year: 2022
      }
    }
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
