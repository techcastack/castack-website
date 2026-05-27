import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job reference is required']
  },
  candidateName: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true
  },
  candidateEmail: {
    type: String,
    required: [true, 'Candidate email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  candidatePhone: {
    type: String,
    trim: true
  },
  resumePath: {
    type: String,
    required: [true, 'Resume file path is required']
  },
  coverLetter: {
    type: String,
    trim: true
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  atsReport: {
    matchPercentage: { type: Number, default: 0 },
    skillsScore: { type: Number, default: 0 },
    experienceScore: { type: Number, default: 0 },
    readabilityScore: { type: Number, default: 0 },
    keywordDensity: [{
      word: { type: String },
      count: { type: Number },
      density: { type: Number }
    }],
    missingKeywords: [{ type: String }],
    recommendations: [{ type: String }]
  },
  status: {
    type: String,
    enum: ['Applied', 'Reviewing', 'Shortlisted', 'Rejected'],
    default: 'Applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;
