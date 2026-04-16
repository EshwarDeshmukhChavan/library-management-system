import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401/403 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/' && !window.location.pathname.includes('login')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  verify: () => api.get('/auth/verify')
};

// Books
export const booksAPI = {
  getAll: (params) => api.get('/books', { params }),
  search: (params) => api.get('/books/search', { params }),
  getNames: () => api.get('/books/names'),
  getCategories: () => api.get('/books/categories'),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data)
};

// Members
export const membersAPI = {
  getAll: (params) => api.get('/members', { params }),
  getById: (membershipId) => api.get(`/members/${membershipId}`),
  create: (data) => api.post('/members', data),
  update: (membershipId, data) => api.put(`/members/${membershipId}`, data)
};

// Transactions
export const transactionsAPI = {
  issue: (data) => api.post('/transactions/issue', data),
  returnBook: (data) => api.post('/transactions/return', data),
  payFine: (data) => api.post('/transactions/pay-fine', data),
  getActive: (params) => api.get('/transactions/active', { params }),
  getByBook: (bookMovieId) => api.get('/transactions/by-book', { params: { bookMovieId } })
};

// Reports
export const reportsAPI = {
  getBooks: () => api.get('/reports/books'),
  getMovies: () => api.get('/reports/movies'),
  getMemberships: () => api.get('/reports/memberships'),
  getActiveIssues: () => api.get('/reports/active-issues'),
  getOverdueReturns: () => api.get('/reports/overdue-returns'),
  getIssueRequests: () => api.get('/reports/issue-requests')
};

// Users
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data)
};

export default api;
