import express from 'express';
import { 
  applyToJob, 
  atsCheckStandalone, 
  getApplications, 
  getApplication, 
  updateApplicationStatus,
  downloadResume
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public apply & stand-alone parser routes with rate limits & upload guards
router.post('/apply', uploadLimiter, upload.single('resume'), applyToJob);
router.post('/ats-check-standalone', uploadLimiter, upload.single('resume'), atsCheckStandalone);

// Admin candidate checking routes
router.get('/', protect, authorize('admin', 'superadmin'), getApplications);
router.get('/:id', protect, authorize('admin', 'superadmin'), getApplication);
router.patch('/:id/status', protect, authorize('admin', 'superadmin'), updateApplicationStatus);
router.get('/:id/resume', protect, authorize('admin', 'superadmin'), downloadResume);

export default router;
