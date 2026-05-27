import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { parseResume, analyzeATS } from '../services/atsService.js';
import { sendApplicationConfirmation, sendRecruiterAlert } from '../services/emailService.js';
import { logger } from '../config/logger.js';
import fs from 'fs';

/**
 * @desc    Submit application for a job (with resume file)
 * @route   POST /api/applications/apply
 * @access  Public
 */
export const applyToJob = async (req, res, next) => {
  try {
    const { candidateName, candidateEmail, candidatePhone, coverLetter, jobId } = req.body;

    if (!jobId) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Please provide a Job ID' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload your resume file (PDF or DOCX)' });
    }

    // Validate Job exists
    const job = await Job.findById(jobId);
    if (!job) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    logger.info(`Processing resume upload for candidate: ${candidateName} (${candidateEmail})`);

    // Parse resume content
    let resumeText = '';
    try {
      resumeText = await parseResume(req.file.path);
    } catch (parseError) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(422).json({ 
        success: false, 
        message: `Failed to parse uploaded resume: ${parseError.message}. Make sure the file is not corrupted.` 
      });
    }

    // Run ATS Score analyzer
    const report = analyzeATS(resumeText, job);

    // Save Application to DB
    const application = await Application.create({
      jobId,
      candidateName,
      candidateEmail,
      candidatePhone,
      resumePath: req.file.path.replace(/\\/g, '/'), // Standardize slashes
      coverLetter,
      atsScore: report.matchPercentage,
      atsReport: report,
      status: 'Applied'
    });

    logger.info(`Application recorded in DB: ID ${application._id}, ATS match: ${report.matchPercentage}%`);

    // Asynchronously dispatch emails (we don't await to avoid delaying client response)
    sendApplicationConfirmation(candidateEmail, candidateName, job.title, report.matchPercentage);
    sendRecruiterAlert(job.title, candidateName, report.matchPercentage, candidateEmail);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: application._id,
      atsScore: report.matchPercentage,
      atsReport: report
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    logger.error(`Error applying to job: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Standalone ATS checker - parse and match resume against a description instantly (does not save to DB)
 * @route   POST /api/applications/ats-check-standalone
 * @access  Public
 */
export const atsCheckStandalone = async (req, res, next) => {
  try {
    const { jobTitle, jobDescription, skillsRequired } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file' });
    }

    if (!jobDescription) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Please enter a target job description' });
    }

    logger.info('Processing standalone ATS resume checker request.');

    // Parse resume
    let resumeText = '';
    try {
      resumeText = await parseResume(req.file.path);
    } catch (parseError) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(422).json({ success: false, message: `Failed to parse resume: ${parseError.message}` });
    }

    // Prepare temporary job requirements config
    const skillsArray = skillsRequired 
      ? (typeof skillsRequired === 'string' ? skillsRequired.split(',').map(s => s.trim()) : skillsRequired) 
      : [];
      
    // If no manual skills given, try to extract key requirements from the description text
    const finalSkillsList = skillsArray.length > 0 ? skillsArray : ['JavaScript', 'HTML', 'CSS', 'Node.js', 'React', 'Git'];

    const mockJob = {
      title: jobTitle || 'Target Role',
      skillsRequired: finalSkillsList,
      experienceLevel: 'Mid', // Default middle constraint
      description: jobDescription
    };

    // Calculate match
    const report = analyzeATS(resumeText, mockJob);

    // Remove temp file from storage to avoid clogging server folder (standalone checks aren't stored)
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    logger.info(`Standalone check finished. Matching score: ${report.matchPercentage}%`);

    res.status(200).json({
      success: true,
      atsScore: report.matchPercentage,
      atsReport: report
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    logger.error(`Error in standalone ATS check: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all applications
 * @route   GET /api/applications
 * @access  Private/Admin
 */
export const getApplications = async (req, res, next) => {
  try {
    const { jobId, scoreMin, status } = req.query;
    const query = {};

    if (jobId) query.jobId = jobId;
    if (status) query.status = status;
    if (scoreMin) query.atsScore = { $gte: parseInt(scoreMin, 10) };

    const applications = await Application.find(query)
      .populate('jobId', 'title department')
      .sort({ atsScore: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    logger.error(`Error fetching applications: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get single application by ID
 * @route   GET /api/applications/:id
 * @access  Private/Admin
 */
export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title department skillsRequired experienceLevel');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    logger.error(`Error fetching application ${req.params.id}: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update application hiring stage status
 * @route   PATCH /api/applications/:id/status
 * @access  Private/Admin
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['Applied', 'Reviewing', 'Shortlisted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status stage value' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    logger.info(`Application status updated to ${status} for ID: ${application._id}`);

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    logger.error(`Error updating application status: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Admin download candidate resume
 * @route   GET /api/applications/:id/resume
 * @access  Private/Admin
 */
export const downloadResume = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const filePath = path.resolve(application.resumePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Resume file has been deleted from server storage' });
    }

    res.download(filePath);
  } catch (error) {
    logger.error(`Error downloading resume: ${error.message}`);
    next(error);
  }
};
