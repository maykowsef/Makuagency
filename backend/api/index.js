const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2).substring(0, 500));
  }
  next();
});

// Database connection
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Error handler
const handlePrismaError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal Server Error' });
};

// ─── COMPANIES ──────────────────────────────────────────────────────

app.get('/companies', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: { sellingPoints: true }
    });
    res.json(companies);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/companies', async (req, res) => {
  try {
    const company = await prisma.company.create({ data: req.body });
    res.json(company);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/companies/:id', async (req, res) => {
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

app.delete('/companies/:id', async (req, res) => {
  try {
    await prisma.company.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── CONTACTS ───────────────────────────────────────────────────────

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      include: { assignments: { include: { sellingPoint: true } } }
    });
    res.json(contacts);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/contacts', async (req, res) => {
  try {
    const contact = await prisma.contact.create({ data: req.body });
    res.json(contact);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/contacts/:id', async (req, res) => {
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

app.delete('/contacts/:id', async (req, res) => {
  try {
    await prisma.contact.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

// ─── SELLING POINTS ───────────────────────────────────────────────────

app.get('/selling-points', async (req, res) => {
  try {
    const sellingPoints = await prisma.sellingPoint.findMany({
      include: { company: true, contacts: true }
    });
    res.json(sellingPoints);
  } catch (error) { handlePrismaError(res, error); }
});

app.post('/selling-points', async (req, res) => {
  try {
    const sellingPoint = await prisma.sellingPoint.create({ data: req.body });
    res.json(sellingPoint);
  } catch (error) { handlePrismaError(res, error); }
});

app.put('/selling-points/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, ...data } = req.body;
    const sellingPoint = await prisma.sellingPoint.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(sellingPoint);
  } catch (error) { handlePrismaError(res, error); }
});

app.delete('/selling-points/:id', async (req, res) => {
  try {
    await prisma.sellingPoint.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (error) { handlePrismaError(res, error); }
});

// Export for Vercel
module.exports = (req, res) => {
  app(req, res);
};
