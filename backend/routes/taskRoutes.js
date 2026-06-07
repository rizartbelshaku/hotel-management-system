const express = require('express');
const router = express.Router();

const { getTasks, setTask, updateTask, deleteTask } = require('../controllers/taskControllers')
const { protect } = require('../middlewares/authMiddleware')

router.get('/', protect, getTasks)
router.post('/', protect, setTask)
router.put('/:id', protect, updateTask)
router.delete('/:id', protect, deleteTask)

module.exports = router;