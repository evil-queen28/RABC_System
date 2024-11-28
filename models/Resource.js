// models/Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['DOCUMENT', 'PROJECT', 'TASK', 'MISC'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  accessibleRoles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  status: {
    type: String,
    enum: ['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'],
    default: 'DRAFT'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);