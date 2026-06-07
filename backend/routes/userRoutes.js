const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getCurrentUser, getAllUsers } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/current', protect, getCurrentUser);
router.get('/', protect, admin, getAllUsers);

module.exports = router;
