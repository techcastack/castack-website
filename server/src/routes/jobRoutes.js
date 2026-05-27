import express from 'express';
import { getJobs, getJob, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('admin', 'superadmin'), createJob);

router.route('/:id')
  .get(getJob)
  .put(protect, authorize('admin', 'superadmin'), updateJob)
  .delete(protect, authorize('admin', 'superadmin'), deleteJob);

export default router;
