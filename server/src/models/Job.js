import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  workplace: {
    type: String,
    required: [true, 'Workplace model is required'],
    enum: ['Remote', 'Hybrid', 'Onsite']
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['Junior', 'Mid', 'Senior', 'Lead']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'] // Supports Markdown
  },
  requirements: {
    type: [String],
    required: [true, 'Job requirements are required'],
    default: []
  },
  responsibilities: {
    type: [String],
    required: [true, 'Job responsibilities are required'],
    default: []
  },
  skillsRequired: {
    type: [String],
    required: [true, 'Skills required are required'],
    default: []
  },
  salaryRange: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', JobSchema);
export default Job;
