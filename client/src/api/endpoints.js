import api from "./axios";

// ---- Auth ----
export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
};

// ---- Dashboard ----
export const dashboardApi = {
  summary: () => api.get("/dashboard/summary"),
  revenueTrend: () => api.get("/dashboard/revenue-trend"),
  membershipDistribution: () => api.get("/dashboard/membership-distribution"),
  recentActivity: () => api.get("/dashboard/recent-activity"),
};

// ---- Members ----
export const memberApi = {
  list: (params) => api.get("/members", { params }),
  get: (id) => api.get(`/members/${id}`),
  create: (data) => api.post("/members", data),
  update: (id, data) => api.put(`/members/${id}`, data),
  remove: (id) => api.delete(`/members/${id}`),
  renew: (id, data) => api.post(`/members/${id}/renew`, data),
  expiryAlerts: () => api.get("/members/expiry/alerts"),
};

// ---- Plans ----
export const planApi = {
  list: (params) => api.get("/plans", { params }),
  get: (id) => api.get(`/plans/${id}`),
  create: (data) => api.post("/plans", data),
  update: (id, data) => api.put(`/plans/${id}`, data),
  remove: (id) => api.delete(`/plans/${id}`),
};

// ---- Payments ----
export const paymentApi = {
  list: (params) => api.get("/payments", { params }),
  get: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post("/payments", data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  remove: (id) => api.delete(`/payments/${id}`),
  invoiceUrl: (id) => `/api/payments/${id}/invoice`,
};

// ---- Trainers ----
export const trainerApi = {
  list: () => api.get("/trainers"),
  get: (id) => api.get(`/trainers/${id}`),
  create: (data) => api.post("/trainers", data),
  update: (id, data) => api.put(`/trainers/${id}`, data),
  remove: (id) => api.delete(`/trainers/${id}`),
};

// ---- Attendance ----
export const attendanceApi = {
  checkIn: (code, method) => api.post("/attendance/check-in", { code, method }),
  checkOut: (code) => api.post("/attendance/check-out", { code }),
  today: () => api.get("/attendance/today"),
  history: (params) => api.get("/attendance", { params }),
};
