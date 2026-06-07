const express = require('express');
const router = express.Router();

const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getHotels);
router.get('/:id', getHotel);
router.post('/', protect, admin, createHotel);
router.put('/:id', protect, admin, updateHotel);
router.delete('/:id', protect, admin, deleteHotel);

module.exports = router;
