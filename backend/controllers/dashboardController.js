const asyncHandler = require('express-async-handler');
const User = require('../models/usermodels');
const Hotel = require('../models/hotelModel');
const Room = require('../models/roomModel');
const Booking = require('../models/bookingModel');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [hotels, rooms, users, reservations, recentBookings] = await Promise.all([
    Hotel.count(),
    Room.count(),
    User.count(),
    Booking.count(),
    Booking.findRecent(5),
  ]);

  res.json({
    hotels,
    rooms,
    users,
    reservations,
    recentBookings,
  });
});

module.exports = { getDashboardStats };
