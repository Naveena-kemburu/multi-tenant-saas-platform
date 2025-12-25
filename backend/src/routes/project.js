const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getProjects, createProject, updateProject, deleteProject, getProjectById } = require('../controllers/projectController');

router.use(protect);

router.get('/', getProjects);
router.post('/', authorize('admin', 'member'), createProject);
router.get('/:id', getProjectById);
router.put('/:id', authorize('admin'), updateProject);
router.delete('/:id', authorize('admin'), deleteProject);

module.exports = router;
