import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  // User-provided fields
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    maxlength: [255, 'Email cannot exceed 255 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  // AI-generated fields
  category: {
    type: String,
    enum: {
      values: ['Billing', 'Technical Support', 'Sales', 'General Inquiry', 'Bug Report', 'Feature Request'],
      message: 'Invalid category. Must be one of: Billing, Technical Support, Sales, General Inquiry, Bug Report, Feature Request'
    },
    default: 'General Inquiry',
    index: true
  },
  priority: {
    type: String,
    enum: {
      values: ['Critical', 'High', 'Medium', 'Low'],
      message: 'Invalid priority. Must be one of: Critical, High, Medium, Low'
    },
    default: 'Medium',
    index: true
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  
  // System fields
  status: {
    type: String,
    enum: {
      values: ['New', 'Processing', 'In Progress', 'Resolved', 'Closed'],
      message: 'Invalid status'
    },
    default: 'New',
    index: true
  },
  assignedTeam: {
    type: String,
    trim: true,
    maxlength: [100, 'Assigned team cannot exceed 100 characters']
  },
  
  // AI metadata
  aiConfidence: {
    type: Number,
    min: [0, 'AI confidence must be between 0 and 1'],
    max: [1, 'AI confidence must be between 0 and 1']
  },
  aiProcessingError: {
    type: String,
    trim: true
  },
  aiProcessedAt: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'tickets'
});

// Indexes for performance
ticketSchema.index({ category: 1, priority: -1 });
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ email: 1 });

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;

