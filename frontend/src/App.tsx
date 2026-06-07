import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelsList from './pages/HotelsList';
import HotelDetails from './pages/HotelDetails';
import BookingForm from './pages/BookingForm';
import MyReservations from './pages/MyReservations';
import Profile from './pages/Profile';

import Dashboard from './pages/admin/Dashboard';
import ManageHotels from './pages/admin/ManageHotels';
import ManageRooms from './pages/admin/ManageRooms';
import ManageReservations from './pages/admin/ManageReservations';
import UsersList from './pages/admin/UsersList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotels" element={<HotelsList />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/hotels/:hotelId/book/:roomId" element={
              <ProtectedRoute><BookingForm /></ProtectedRoute>
            } />
            <Route path="/my-reservations" element={
              <ProtectedRoute><MyReservations /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>
            } />
            <Route path="/admin/hotels" element={
              <ProtectedRoute adminOnly><ManageHotels /></ProtectedRoute>
            } />
            <Route path="/admin/rooms" element={
              <ProtectedRoute adminOnly><ManageRooms /></ProtectedRoute>
            } />
            <Route path="/admin/reservations" element={
              <ProtectedRoute adminOnly><ManageReservations /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly><UsersList /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
