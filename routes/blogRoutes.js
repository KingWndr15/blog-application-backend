const express = require('express');
const { createBlog, getUserBlogs, updateBlog, deleteBlog } = require('../controllers/blogController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Blog CRUD Routes
router.post('/', authMiddleware, createBlog);
router.get('/', authMiddleware, getUserBlogs);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
