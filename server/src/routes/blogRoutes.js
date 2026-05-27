import express from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, authorize('admin', 'superadmin'), createBlog);

router.route('/:slug')
  .get(getBlogBySlug);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateBlog)
  .delete(protect, authorize('admin', 'superadmin'), deleteBlog);

export default router;
