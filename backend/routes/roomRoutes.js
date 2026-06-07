const express = require('express');
const router = express.Router();

const {
  getRoomsByHotel,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/hotel/:hotelId', getRoomsByHotel);
router.get('/:id', getRoom);
router.post('/', protect, admin, createRoom);
router.put('/:id', protect, admin, updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;
