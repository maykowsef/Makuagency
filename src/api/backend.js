// NEW API FILE v5.0 - COMPLETELY BYPASSES CACHE
// This file replaces src/config/api.js to force fresh build

const BACKEND_URL = 'https://makuagencybackendproject.vercel.app/api';

console.log('🚀🚀🚀🚀 NEW API FILE v5.0 LOADED');
console.log('🚀🚀🚀🚀 BACKEND URL:', BACKEND_URL);
console.log('🚀🚀🚀🚀 WINDOW ORIGIN:', window.location.origin);
console.log('🚀🚀🚀🚀 TIMESTAMP:', new Date().toISOString());

export const api = {
  // Companies
  getCompanies: async () => {
    try {
      const url = `${BACKEND_URL}/companies`;
      console.log('🚀🚀🚀🚀 GET companies from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('🚀🚀🚀🚀 Error fetching companies:', error);
      throw error;
    }
  },

  addCompany: async (company) => {
    try {
      const url = `${BACKEND_URL}/companies`;
      console.log('🚀🚀🚀🚀 POST company to:', url);
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
      console.error('🚀🚀🚀🚀 Error adding company:', error);
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    try {
      const url = `${BACKEND_URL}/companies/${id}`;
      console.log('🚀🚀🚀🚀 PUT company at:', url);
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
      console.error('🚀🚀🚀🚀 Error updating company:', error);
      throw error;
    }
  },

  deleteCompany: async (id) => {
    try {
      const url = `${BACKEND_URL}/companies/${id}`;
      console.log('🚀🚀🚀🚀 DELETE company at:', url);
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('🚀🚀🚀🚀 Error deleting company:', error);
      throw error;
    }
  },

  // Contacts
  getContacts: () => fetch(`${BACKEND_URL}/contacts`).then(res => res.json()),
  createContact: (data) => fetch(`${BACKEND_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateContact: (id, data) => fetch(`${BACKEND_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteContact: (id) => fetch(`${BACKEND_URL}/contacts/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),

  // Selling Points
  getSellingPoints: () => fetch(`${BACKEND_URL}/selling-points`).then(res => res.json()),
  createSellingPoint: (data) => fetch(`${BACKEND_URL}/selling-points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateSellingPoint: (id, data) => fetch(`${BACKEND_URL}/selling-points/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteSellingPoint: (id) => fetch(`${BACKEND_URL}/selling-points/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),

  // Activities
  getActivities: () => fetch(`${BACKEND_URL}/activities`).then(res => res.json()),
  logActivity: (data) => fetch(`${BACKEND_URL}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // Minisites
  getMinisites: () => fetch(`${BACKEND_URL}/minisites`).then(res => res.json()),

  // Schedules
  getSchedules: () => fetch(`${BACKEND_URL}/schedules`).then(res => res.json()),

  // Assignments
  getAssignments: () => fetch(`${BACKEND_URL}/assignments`).then(res => res.json()),

  // Inventory
  getInventory: () => fetch(`${BACKEND_URL}/inventory`).then(res => res.json())
};

export default api;
