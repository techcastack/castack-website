import Blog from '../models/Blog.js';
import { logger } from '../config/logger.js';

/**
 * @desc    Get all blogs (published only by default)
 * @route   GET /api/blogs
 * @access  Public / Admin
 */
export const getBlogs = async (req, res, next) => {
  try {
    const { status, tag, search } = req.query;
    const query = {};

    const isAdmin = req.query.isAdminFlow === 'true';
    if (!isAdmin) {
      query.status = 'Published';
    } else if (status) {
      query.status = status;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(query).sort({ publishedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    logger.error(`Error fetching blogs: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get single blog by slug
 * @route   GET /api/blogs/:slug
 * @access  Public
 */
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    logger.error(`Error fetching blog ${req.params.slug}: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Create a new blog article
 * @route   POST /api/blogs
 * @access  Private/Admin
 */
export const createBlog = async (req, res, next) => {
  try {
    const { title, summary, content, coverImage, tags, author, status } = req.body;
    
    // Auto generate unique slug
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Resolve duplicate slugs just in case
    let slugExists = await Blog.findOne({ slug });
    let suffix = 1;
    let finalSlug = slug;
    while (slugExists) {
      finalSlug = `${slug}-${suffix}`;
      slugExists = await Blog.findOne({ slug: finalSlug });
      suffix++;
    }

    const blogData = {
      title,
      slug: finalSlug,
      summary,
      content,
      coverImage,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [],
      author,
      status,
      publishedAt: status === 'Published' ? new Date() : null
    };

    const blog = await Blog.create(blogData);
    logger.info(`Blog created by admin: ${blog.title} (Slug: ${blog.slug})`);

    res.status(201).json({
      success: true,
      blog
    });
  } catch (error) {
    logger.error(`Error creating blog: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update a blog article
 * @route   PUT /api/blogs/:id
 * @access  Private/Admin
 */
export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    const updates = { ...req.body };
    
    // Handle status change
    if (updates.status === 'Published' && blog.status !== 'Published') {
      updates.publishedAt = new Date();
    }

    if (updates.tags && !Array.isArray(updates.tags)) {
      updates.tags = updates.tags.split(',').map(t => t.trim());
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    logger.info(`Blog updated by admin: ${blog.title} (${blog._id})`);

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    logger.error(`Error updating blog ${req.params.id}: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Delete a blog article
 * @route   DELETE /api/blogs/:id
 * @access  Private/Admin
 */
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    logger.info(`Blog deleted by admin: ${blog.title} (${req.params.id})`);

    res.status(200).json({
      success: true,
      message: 'Blog article removed successfully'
    });
  } catch (error) {
    logger.error(`Error deleting blog ${req.params.id}: ${error.message}`);
    next(error);
  }
};
