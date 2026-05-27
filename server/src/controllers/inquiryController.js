import Inquiry from '../models/Inquiry.js';
import Newsletter from '../models/Newsletter.js';
import { sendInquiryNotification } from '../services/emailService.js';
import { logger } from '../config/logger.js';

/**
 * @desc    Submit contact form inquiry
 * @route   POST /api/inquiries
 * @access  Public
 */
export const submitInquiry = async (req, res, next) => {
  try {
    const { name, email, company, subject, message, category } = req.body;

    if (!name || !email || !subject || !message || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      company,
      subject,
      message,
      category
    });

    logger.info(`New client inquiry submitted by: ${name} (${email}) - [${category}]`);

    // Send email alert to admin asynchronously
    sendInquiryNotification(name, email, subject, message, category);

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully sent! Our consulting division will contact you shortly.',
      inquiryId: inquiry._id
    });
  } catch (error) {
    logger.error(`Error submitting inquiry: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all inquiries
 * @route   GET /api/inquiries
 * @access  Private/Admin
 */
export const getInquiries = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries
    });
  } catch (error) {
    logger.error(`Error fetching inquiries: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update inquiry ticket status
 * @route   PATCH /api/inquiries/:id
 * @access  Private/Admin
 */
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['New', 'In-Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid ticket status value' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry record not found' });
    }

    logger.info(`Inquiry ticket ID ${inquiry._id} status updated to ${status}`);

    res.status(200).json({
      success: true,
      inquiry
    });
  } catch (error) {
    logger.error(`Error updating inquiry: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/newsletter/subscribe
 * @access  Public
 */
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    // Check if already subscribed
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'This email is already subscribed to our newsletter!' });
    }

    await Newsletter.create({ email });
    logger.info(`New newsletter subscriber: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our enterprise technology insights!'
    });
  } catch (error) {
    logger.error(`Error in newsletter subscription: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all newsletter subscribers
 * @route   GET /api/newsletter
 * @access  Private/Admin
 */
export const getNewsletters = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers
    });
  } catch (error) {
    logger.error(`Error fetching newsletter subscribers: ${error.message}`);
    next(error);
  }
};
