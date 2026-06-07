const express = require('express');
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, admin, getAllBookings);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
