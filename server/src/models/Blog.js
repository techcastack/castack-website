import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'] // Supports Markdown
  },
  coverImage: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  readTime: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Auto generate read time based on content length
BlogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const words = this.content ? this.content.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.round(words / wordsPerMinute));
    this.readTime = `${minutes} min read`;
  }
  next();
});

const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;
