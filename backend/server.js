const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../build')));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2).substring(0, 500));
  }
  next();
});

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── UTILS ──────────────────────────────────────────────────────────

const handlePrismaError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal Server Error' });
};

// ─── COMPANIES ──────────────────────────────────────────────────────

app.get('/api/companies', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: { sellingPoints: true }
    });
    res.json(companies);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/api/companies', async (req, res) => {
  try {
    const company = await prisma.company.create({ data: req.body });
    res.json(company);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/api/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, ...data } = req.body;
    const company = await prisma.company.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(company);
  } catch (error) { handlePrismaError(res, error); }
});

app.delete('/api/companies/:id', async (req, res) => {
  try {
    await prisma.company.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── CONTACTS ───────────────────────────────────────────────────────

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      include: { assignments: { include: { sellingPoint: true } } }
    });
    res.json(contacts);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = await prisma.contact.create({ data: req.body });
    res.json(contact);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, assignments, ...data } = req.body;
    const contact = await prisma.contact.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(contact);
  } catch (error) { handlePrismaError(res, error); }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await prisma.contact.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── SELLING POINTS ──────────────────────────────────────────────────

app.get('/api/selling-points', async (req, res) => {
  try {
    const points = await prisma.sellingPoint.findMany({
      include: {
        announcementProfiles: { include: { stockListings: true } },
        assignments: { include: { contact: true } },
        company: true
      }
    });
    res.json(points);
  } catch (error) { handlePrismaError(res, error); }
});

app.get('/api/contact-assignments', async (req, res) => {
  try {
    const list = await prisma.contactAssignment.findMany();
    res.json(list);
  } catch (error) { handlePrismaError(res, error); }
});

app.get('/api/inventory', async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany();
    res.json(items);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const { sellingPointId, year, mileage, price, ...data } = req.body;
    const item = await prisma.inventoryItem.create({
      data: {
        ...data,
        year: year ? parseInt(year) : null,
        mileage: mileage ? parseInt(mileage) : null,
        price: price ? parseFloat(price) : null,
        ...(sellingPointId ? { sellingPointId: parseInt(sellingPointId) } : {})
      }
    });
    res.json(item);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, sellingPointId, year, mileage, price, ...data } = req.body;
    const item = await prisma.inventoryItem.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        year: year ? parseInt(year) : null,
        mileage: mileage ? parseInt(mileage) : null,
        price: price ? parseFloat(price) : null,
        ...(sellingPointId ? { sellingPointId: parseInt(sellingPointId) } : {})
      }
    });
    res.json(item);
  } catch (error) { handlePrismaError(res, error); }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    await prisma.inventoryItem.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/api/selling-points', async (req, res) => {
  try {
    const { 
      companyId, 
      announcementProfiles, 
      assignments, 
      address, 
      companyName,
      contacts,
      ...data 
    } = req.body;
    
    // Mapping nested address if it exists
    const mappedData = { ...data };
    if (address) {
      if (address.street) mappedData.street = address.street;
      if (address.city) mappedData.city = address.city;
      if (address.postalCode) mappedData.postalCode = address.postalCode;
      if (address.country) mappedData.country = address.country;
    }

    const createData = {
      ...mappedData,
      company: { connect: { id: parseInt(companyId) || 1 } }
    };

    if (announcementProfiles && announcementProfiles.length > 0) {
      createData.announcementProfiles = {
        create: announcementProfiles.map(ap => ({
          siteId: ap.siteId || 'unknown',
          platform: ap.platform || ap.siteId || 'unknown',
          url: ap.url || '',
          targetListings: parseInt(ap.targetListings) || 0,
          stockListings: ap.stockListings && ap.stockListings.length > 0 ? {
            create: ap.stockListings.map(sl => {
                const { id, reference, name, price, url, description, imageUrls, ...attributes } = sl;
                return {
                    reference: reference || '',
                    name: name || 'Listing',
                    price: (price && !isNaN(parseFloat(price))) ? parseFloat(price) : null,
                    url: url || '',
                    description: description || '',
                    imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
                    attributes: attributes || {}
                };
            })
          } : undefined
        }))
      };
    }

    if (contacts && contacts.length > 0) {
      createData.assignments = {
        create: contacts.map(c => ({
          contact: { connect: { id: parseInt(c.id) } },
          role: c.role || 'Contact'
        }))
      };
    }

    // Ensure company exists
    const point = await prisma.sellingPoint.create({
      data: createData,
      include: {
        announcementProfiles: { include: { stockListings: true } },
        assignments: { include: { contact: true } },
        company: true
      }
    });
    res.json(point);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/api/selling-points/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      id: _, 
      companyId, 
      announcementProfiles, 
      assignments, 
      company,
      address,
      companyName,
      contacts,
      ...data 
    } = req.body;

    const mappedData = { ...data };
    // Flatten nested objects from frontend if they exist
    // Note: announcementProfiles are now managed by their dedicated endpoints.
    // Do not delete and recreate them here.
    if (address) {
      if (address.street) mappedData.street = address.street;
      if (address.city) mappedData.city = address.city;
      if (address.postalCode) mappedData.postalCode = address.postalCode;
      if (address.country) mappedData.country = address.country;
    }

    const updateData = {
      ...mappedData,
      ...(companyId ? { company: { connect: { id: parseInt(companyId) } } } : {})
    };

    if (contacts) {
      await prisma.contactAssignment.deleteMany({ where: { sellingPointId: parseInt(id) } });
      if (contacts.length > 0) {
        updateData.assignments = {
          create: contacts.map(c => ({
            contact: { connect: { id: parseInt(c.id) } },
            role: c.role || 'Contact'
          }))
        };
      }
    }

    const point = await prisma.sellingPoint.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        announcementProfiles: { include: { stockListings: true } },
        assignments: { include: { contact: true } },
        company: true
      }
    });
    res.json(point);
  } catch (error) { handlePrismaError(res, error); }
});

app.delete('/api/selling-points/:id', async (req, res) => {
  try {
    await prisma.sellingPoint.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── ANNOUNCEMENT PROFILES (dedicated endpoints) ──────────────────────

// Add a new announcement profile to a selling point
app.post('/api/selling-points/:spId/announcement-profiles', async (req, res) => {
  try {
    const { spId } = req.params;
    const { siteId, platform, url, targetListings, isPrimary } = req.body;
    const profile = await prisma.announcementProfile.create({
      data: {
        sellingPointId: parseInt(spId),
        siteId: siteId || 'unknown',
        platform: platform || siteId || 'unknown',
        url: url || '',
        targetListings: parseInt(targetListings) || 0,
        isPrimary: !!isPrimary
      },
      include: { stockListings: true }
    });
    res.json(profile);
  } catch (error) { handlePrismaError(res, error); }
});

// Update an announcement profile
app.put('/api/announcement-profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { siteId, platform, url, targetListings, isPrimary } = req.body;
    const profile = await prisma.announcementProfile.update({
      where: { id: parseInt(id) },
      data: {
        siteId: siteId || 'unknown',
        platform: platform || siteId || 'unknown',
        url: url || '',
        targetListings: parseInt(targetListings) || 0,
        isPrimary: !!isPrimary
      },
      include: { stockListings: true }
    });
    res.json(profile);
  } catch (error) { handlePrismaError(res, error); }
});

// Delete an announcement profile
app.delete('/api/announcement-profiles/:id', async (req, res) => {
  try {
    await prisma.announcementProfile.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── STOCK LISTINGS (dedicated endpoints) ────────────────────────────

// Add a stock listing to an announcement profile
app.post('/api/announcement-profiles/:profileId/stock-listings', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { reference, name, price, url, description, imageUrls, ...attributes } = req.body;
    const listing = await prisma.stockListing.create({
      data: {
        profileId: parseInt(profileId),
        reference: reference || '',
        name: name || 'Listing',
        price: (price && !isNaN(parseFloat(price))) ? parseFloat(price) : null,
        url: url || '',
        description: description || '',
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
        attributes: attributes || {}
      }
    });
    res.json(listing);
  } catch (error) { handlePrismaError(res, error); }
});

// Update a stock listing
app.put('/api/stock-listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reference, name, price, url, description, imageUrls, profileId, ...attributes } = req.body;
    const listing = await prisma.stockListing.update({
      where: { id: parseInt(id) },
      data: {
        reference: reference || '',
        name: name || 'Listing',
        price: (price && !isNaN(parseFloat(price))) ? parseFloat(price) : null,
        url: url || '',
        description: description || '',
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
        attributes: attributes || {}
      }
    });
    res.json(listing);
  } catch (error) { handlePrismaError(res, error); }
});

// Delete a stock listing
app.delete('/api/stock-listings/:id', async (req, res) => {
  try {
    await prisma.stockListing.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── MINISITES ──────────────────────────────────────────────────────

app.get('/api/minisites', async (req, res) => {
  try {
    const sites = await prisma.minisite.findMany();
    res.json(sites);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/api/minisites', async (req, res) => {
  try {
    const { sellingPointId, ...data } = req.body;
    const site = await prisma.minisite.create({
      data: {
        ...data,
        sellingPoint: { connect: { id: parseInt(sellingPointId) } }
      }
    });
    res.json(site);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/api/minisites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, sellingPointId, ...data } = req.body;
    const site = await prisma.minisite.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(site);
  } catch (error) { handlePrismaError(res, error); }
});

app.delete('/api/minisites/:id', async (req, res) => {
  try {
    await prisma.minisite.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── SCHEDULES ──────────────────────────────────────────────────────

app.get('/api/schedules', async (req, res) => {
  try {
    const schedules = await prisma.schedule.findMany();
    res.json(schedules);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/api/schedules', async (req, res) => {
  try {
    const data = req.body;
    if (data.date) data.date = new Date(data.date);
    const schedule = await prisma.schedule.create({ data });
    res.json(schedule);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/api/schedules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, ...data } = req.body;
    if (data.date) data.date = new Date(data.date);
    const schedule = await prisma.schedule.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(schedule);
  } catch (error) { handlePrismaError(res, error); }
});

app.delete('/api/schedules/:id', async (req, res) => {
  try {
    await prisma.schedule.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── TASKS ─────────────────────────────────────────────────────────

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(tasks);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = await prisma.task.create({ data: req.body });
    res.json(task);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, ...data } = req.body;
    const task = await prisma.task.update({ where: { id: parseInt(id) }, data });
    res.json(task);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── WORK ASSIGNMENTS ──────────────────────────────────────────────

app.get('/api/work-assignments', async (req, res) => {
  try {
    const assignments = await prisma.workAssignment.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(assignments);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/api/work-assignments', async (req, res) => {
  try {
    const assignment = await prisma.workAssignment.create({ data: req.body });
    res.json(assignment);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/api/work-assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, ...data } = req.body;
    const assignment = await prisma.workAssignment.update({ where: { id: parseInt(id) }, data });
    res.json(assignment);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── ACTIVITIES ────────────────────────────────────────────────────

app.get('/api/activities', async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({ orderBy: { timestamp: 'desc' }, take: 100 });
    res.json(activities);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/api/activities', async (req, res) => {
  try {
    const activity = await prisma.activity.create({ data: req.body });
    res.json(activity);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── SEEDING & STARTUP ──────────────────────────────────────────────

const seedDatabase = async () => {
  const count = await prisma.sellingPoint.count();
  if (count === 0) {
    console.log('Seeding database with initial data...');
    // Create a default company first
    const company = await prisma.company.create({
      data: {
        name: 'Default Automotive Group',
        industry: 'automotive',
        status: 'Active'
      }
    });

    // Create a few selling points
    const sp = await prisma.sellingPoint.create({
      data: {
        name: 'Paris Luxury Cars',
        companyId: company.id,
        businessType: 'Used Car Dealer',
        industry: 'automotive',
        city: 'Paris',
        country: 'France',
        status: 'Active',
        priority: 'High',
        description: 'Premium used cars in the heart of Paris.'
      }
    });

    // Create a default contact
    await prisma.contact.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CEO',
        company: 'Default Automotive Group',
        status: 'Active'
      }
    });

    // Create a default inventory item
    await prisma.inventoryItem.create({
      data: {
        name: 'Mercedes-Benz S-Class',
        make: 'Mercedes-Benz',
        model: 'S-Class',
        year: 2022,
        price: 89900,
        sellingPointId: sp.id
      }
    });
    console.log('Seed completed.');
  }
};

// Catch-all route to serve the React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await seedDatabase();
  } catch (err) {
    console.error('Seeding failed:', err);
  }
});
