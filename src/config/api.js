// API Configuration v4.0 - BUILD TIMESTAMP: ${new Date().toISOString()}
// COMPLETELY HARDCODED - This bypasses ALL environment variables and caching issues
const API_BASE_URL = 'https://makuagencybackendproject.vercel.app/api';

// Debug: Force logging to verify correct URL
console.log('🔗🔗🔗🔗 API BASE URL (HARDCODED v4.0):', API_BASE_URL);
console.log('🔗🔗🔗🔗 Current window origin:', window.location.origin);
console.log('🔗🔗🔗🔗 Environment variable override:', process.env.REACT_APP_API_URL);
console.log('🔗🔗🔗🔗 Build timestamp:', new Date().toISOString());

// Override any attempts to use window.location
const HARDCODED_API_BASE = 'https://makuagencybackendproject.vercel.app/api';

console.log('🔗 API Base URL:', API_BASE_URL);

export const api = {
  // Companies
  getCompanies: async () => {
    try {
      const url = `${HARDCODED_API_BASE}/companies`;
      console.log('🔗🔗🔗 Fetching companies from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },
  addCompany: async (company) => {
    try {
      const url = `${HARDCODED_API_BASE}/companies`;
      console.log('🔗🔗🔗 Adding company to:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(company),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding company:', error);
      throw error;
    }
  },
  updateCompany: async (id, data) => {
    try {
      const url = `${HARDCODED_API_BASE}/companies/${id}`;
      console.log('🔗🔗🔗 Updating company at:', url);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },
  deleteCompany: async (id) => {
    try {
      const url = `${HARDCODED_API_BASE}/companies/${id}`;
      console.log('🔗🔗🔗 Deleting company at:', url);
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  },

  // Contacts
  getContacts: () => fetch(`${HARDCODED_API_BASE}/contacts`).then(res => res.json()),
  createContact: (data) => fetch(`${HARDCODED_API_BASE}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateContact: (id, data) => fetch(`${HARDCODED_API_BASE}/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteContact: (id) => fetch(`${HARDCODED_API_BASE}/contacts/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),

  // Selling Points
  getSellingPoints: () => fetch(`${HARDCODED_API_BASE}/selling-points`).then(res => res.json()),
  createSellingPoint: (data) => fetch(`${HARDCODED_API_BASE}/selling-points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateSellingPoint: (id, data) => fetch(`${HARDCODED_API_BASE}/selling-points/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteSellingPoint: (id) => fetch(`${HARDCODED_API_BASE}/selling-points/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),

  // Activities
  getActivities: () => fetch(`${HARDCODED_API_BASE}/activities`).then(res => res.json()),
  logActivity: (data) => fetch(`${HARDCODED_API_BASE}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // Minisites
  getMinisites: () => fetch(`${HARDCODED_API_BASE}/minisites`).then(res => res.json()),

  // Schedules
  getSchedules: () => fetch(`${HARDCODED_API_BASE}/schedules`).then(res => res.json()),

  // Assignments
  getAssignments: () => fetch(`${HARDCODED_API_BASE}/assignments`).then(res => res.json()),

  // Inventory
  getInventory: () => fetch(`${HARDCODED_API_BASE}/inventory`).then(res => res.json())
};
