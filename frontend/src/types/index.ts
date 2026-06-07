export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token?: string;
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  image: string;
}

export interface Room {
  id: number;
  hotel_id: number;
  room_number: string;
  type: string;
  price: number;
  available: boolean;
}

export interface Booking {
  id: number;
  user_id: number;
  hotel_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  hotel_name?: string;
  city?: string;
  room_number?: string;
  room_type?: string;
  user_name?: string;
  user_email?: string;
  created_at?: string;
}

export interface DashboardStats {
  hotels: number;
  rooms: number;
  users: number;
  reservations: number;
  recentBookings: Booking[];
}
