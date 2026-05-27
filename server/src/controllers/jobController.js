import Job from '../models/Job.js';
import { logger } from '../config/logger.js';

/**
 * @desc    Get all jobs (with query filters)
 * @route   GET /api/jobs
 * @access  Public / Admin
 */
export const getJobs = async (req, res, next) => {
  try {
    const { department, location, type, experienceLevel, workplace, search, status } = req.query;
    
    // Base query
    const query = {};

    // For public users, only show Published. Admin can filter by status or see all.
    // We determine if admin by checking authorization token presence or explicitly passing status.
    const isAdmin = req.query.isAdminFlow === 'true'; // Set by dashboard requests
    if (!isAdmin) {
      query.status = 'Published';
    } else if (status) {
      query.status = status;
    }

    // Apply filters
    if (department) query.department = department;
    if (location) query.location = location;
    if (type) query.type = type;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (workplace) query.workplace = workplace;

    // Search query matches title or required skills
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { skillsRequired: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    logger.error(`Error fetching jobs: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    logger.error(`Error fetching job ${req.params.id}: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Create a new job opening
 * @route   POST /api/jobs
 * @access  Private/Admin
 */
export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    logger.info(`Job created by admin: ${job.title} (${job._id})`);

    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    logger.error(`Error creating job: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update a job opening
 * @route   PUT /api/jobs/:id
 * @access  Private/Admin
 */
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    logger.info(`Job updated by admin: ${job.title} (${job._id})`);

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    logger.error(`Error updating job ${req.params.id}: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Delete a job opening
 * @route   DELETE /api/jobs/:id
 * @access  Private/Admin
 */
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    await Job.findByIdAndDelete(req.params.id);
    logger.info(`Job deleted by admin: ${job.title} (${req.params.id})`);

    res.status(200).json({
      success: true,
      message: 'Job posting removed successfully'
    });
  } catch (error) {
    logger.error(`Error deleting job ${req.params.id}: ${error.message}`);
    next(error);
  }
};
