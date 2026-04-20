// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app/api';

export const api = {
  // Companies
  getCompanies: () => fetch(`${API_BASE_URL}/companies`).then(res => res.json()),
  createCompany: (data) => fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateCompany: (id, data) => fetch(`${API_BASE_URL}/companies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteCompany: (id) => fetch(`${API_BASE_URL}/companies/${id}`, {
    method: 'DELETE'
  }),

  // Contacts
  getContacts: () => fetch(`${API_BASE_URL}/contacts`).then(res => res.json()),
  createContact: (data) => fetch(`${API_BASE_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateContact: (id, data) => fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteContact: (id) => fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'DELETE'
  }),

  // Selling Points
  getSellingPoints: () => fetch(`${API_BASE_URL}/selling-points`).then(res => res.json()),
  createSellingPoint: (data) => fetch(`${API_BASE_URL}/selling-points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateSellingPoint: (id, data) => fetch(`${API_BASE_URL}/selling-points/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteSellingPoint: (id) => fetch(`${API_BASE_URL}/selling-points/${id}`, {
    method: 'DELETE'
  })
};
