import express from 'express';
import { 
  submitInquiry, 
  getInquiries, 
  updateInquiryStatus, 
  subscribeNewsletter, 
  getNewsletters 
} from '../controllers/inquiryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public forms
router.post('/', submitInquiry);
router.post('/newsletter/subscribe', subscribeNewsletter);

// Admin dashboard inquiry tracking
router.get('/', protect, authorize('admin', 'superadmin'), getInquiries);
router.patch('/:id', protect, authorize('admin', 'superadmin'), updateInquiryStatus);
router.get('/newsletter', protect, authorize('admin', 'superadmin'), getNewsletters);

export default router;
