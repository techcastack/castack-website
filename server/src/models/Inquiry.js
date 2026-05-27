import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  company: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Development', 'Consulting', 'AI Solutions', 'Careers', 'Other']
  },
  status: {
    type: String,
    enum: ['New', 'In-Progress', 'Resolved'],
    default: 'New'
  }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', InquirySchema);
export default Inquiry;
