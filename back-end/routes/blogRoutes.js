const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

// Create a new blog
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user.userId;

  const newBlog = new Blog({ content, author: userId });
  await newBlog.save();
  res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
}));

// Update a blog by ID
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user.userId;
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  if (blog.author.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  blog.content = content;
  await blog.save();
  res.json({ message: 'Blog updated successfully', blog });
}));

// Delete a blog by ID
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  if (blog.author.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await blog.remove();
  res.json({ message: 'Blog deleted successfully' });
}));

module.exports = router;
