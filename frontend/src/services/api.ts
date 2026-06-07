const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const authAPI = {
  register: (name: string, email: string, password: string) =>
    request('/users', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    request('/users/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getCurrentUser: () => request('/users/current'),
};

export const hotelAPI = {
  getAll: () => request('/hotels'),
  getById: (id: number) => request(`/hotels/${id}`),
  create: (data: Partial<import('../types').Hotel>) =>
    request('/hotels', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<import('../types').Hotel>) =>
    request(`/hotels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request(`/hotels/${id}`, { method: 'DELETE' }),
};

export const roomAPI = {
  getByHotel: (hotelId: number, availableOnly = false) =>
    request(`/rooms/hotel/${hotelId}${availableOnly ? '?available=true' : ''}`),
  create: (data: { hotelId: number; roomNumber: string; type: string; price: number; available?: boolean }) =>
    request('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<{ roomNumber: string; type: string; price: number; available: boolean }>) =>
    request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request(`/rooms/${id}`, { method: 'DELETE' }),
};

export const bookingAPI = {
  create: (data: { hotelId: number; roomId: number; checkInDate: string; checkOutDate: string }) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getMy: () => request('/bookings/my'),
  getAll: () => request('/bookings'),
  updateStatus: (id: number, status: string) =>
    request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  cancel: (id: number) => request(`/bookings/${id}`, { method: 'DELETE' }),
};

export const userAPI = {
  getAll: () => request('/users'),
};

export const dashboardAPI = {
  getStats: () => request('/dashboard/stats'),
};
