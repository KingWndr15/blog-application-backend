const Blog = require('../models/blogModel');
const Joi = require('joi');

// Validation schema
const blogSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

exports.createBlog = async (req, res) => {
  try {
    const { error } = blogSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, content } = req.body;
    const newBlog = new Blog({ title, content, author: req.user.id });
    await newBlog.save();

    res.status(201).json({ message: 'Blog created successfully.', blog: newBlog });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id });
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = blogSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const blog = await Blog.findOneAndUpdate(
      { _id: id, author: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found or unauthorized.' });

    res.status(200).json({ message: 'Blog updated successfully.', blog });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOneAndDelete({ _id: id, author: req.user.id });
    if (!blog) return res.status(404).json({ message: 'Blog not found or unauthorized.' });

    res.status(200).json({ message: 'Blog deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
