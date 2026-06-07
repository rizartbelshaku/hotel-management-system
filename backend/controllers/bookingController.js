const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const Hotel = require('../models/hotelModel');

const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end - start;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const createBooking = asyncHandler(async (req, res) => {
  const { hotelId, roomId, checkInDate, checkOutDate } = req.body;

  if (!hotelId || !roomId || !checkInDate || !checkOutDate) {
    res.status(400);
    throw new Error('All booking fields are required');
  }

  const nights = calculateNights(checkInDate, checkOutDate);
  if (nights <= 0) {
    res.status(400);
    throw new Error('Check-out date must be after check-in date');
  }

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }

  const room = await Room.findById(roomId);
  if (!room || room.hotel_id !== parseInt(hotelId, 10)) {
    res.status(404);
    throw new Error('Room not found in this hotel');
  }

  if (!room.available) {
    res.status(400);
    throw new Error('Room is not available');
  }

  const totalPrice = parseFloat(room.price) * nights;

  const booking = await Booking.create({
    userId: req.user.id,
    hotelId,
    roomId,
    checkInDate,
    checkOutDate,
    totalPrice,
  });

  res.status(201).json(booking);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.findByUserId(req.user.id);
  res.json(bookings);
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.findAll();
  res.json(bookings);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Approved', 'Rejected', 'Completed'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Use: Pending, Approved, Rejected, Completed');
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const updated = await Booking.updateStatus(req.params.id, status);
  res.json(updated);
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user_id !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  if (booking.status !== 'Pending') {
    res.status(400);
    throw new Error('Only pending bookings can be cancelled');
  }

  await Booking.remove(req.params.id);
  res.json({ id: req.params.id, message: 'Booking cancelled' });
});

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
};
