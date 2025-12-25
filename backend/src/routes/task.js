const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getTasks, createTask, updateTask, deleteTask, getTaskById } = require('../controllers/taskController');

router.use(protect);

router.get('/', getTasks);
router.post('/', authorize('admin', 'member'), createTask);
router.get('/:id', getTaskById);
router.put('/:id', authorize('admin', 'member'), updateTask);
router.delete('/:id', authorize('admin'), deleteTask);

module.exports = router;
