import mongoose from 'mongoose';
import validator from 'validator';

/**
 * Organizer Model Schema
 * Stores information about registered organizers and their verification status
 */
const organizerSchema = new mongoose.Schema({
  // Algorand wallet address (primary identifier)
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    validate: {
      validator: function(address) {
        // Basic Algorand address validation (58 characters, alphanumeric)
        return /^[A-Z2-7]{58}$/.test(address);
      },
      message: 'Invalid Algorand wallet address format'
    },
    index: true
  },

  // Personal Information
  name: {
    type: String,
    required: [true, 'Organizer name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    lowercase: true
  },

  // Organization Details
  organization: {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      maxLength: [200, 'Organization name cannot exceed 200 characters']
    },
    type: {
      type: String,
      enum: ['ngo', 'charity', 'government', 'educational', 'religious', 'community', 'other'],
      required: [true, 'Organization type is required']
    },
    website: {
      type: String,
      validate: {
        validator: function(url) {
          return !url || validator.isURL(url);
        },
        message: 'Please provide a valid website URL'
      }
    },
    taxId: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      maxLength: [1000, 'Description cannot exceed 1000 characters']
    }
  },

  // Verification Status
  verification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'suspended'],
      default: 'pending'
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    documents: [{
      type: {
        type: String,
        enum: ['registration', 'tax_exempt', 'identity', 'authorization']
      },
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    notes: String
  },

  // Blockchain Integration
  blockchain: {
    authorized: {
      type: Boolean,
      default: false
    },
    authorizationTxId: String,
    contractAppId: Number,
    lastSyncAt: Date
  },

  // Statistics
  stats: {
    contributionsVerified: {
      type: Number,
      default: 0
    },
    totalVolunteersHelped: {
      type: Number,
      default: 0
    },
    totalHoursVerified: {
      type: Number,
      default: 0
    },
    reputationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 1000
    }
  },

  // Contact and Preferences
  contact: {
    phone: {
      type: String,
      validate: {
        validator: function(phone) {
          return !phone || validator.isMobilePhone(phone);
        },
        message: 'Please provide a valid phone number'
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'US'
      }
    }
  },

  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    contributionTypes: [{
      type: String,
      enum: [
        'community-service', 'environmental', 'education', 'healthcare',
        'disaster-relief', 'food-security', 'elderly-care', 'youth-programs',
        'arts-culture', 'technology', 'other'
      ]
    }]
  },

  // System Fields
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLoginAt: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
organizerSchema.index({ 'verification.status': 1 });
organizerSchema.index({ 'organization.type': 1 });
organizerSchema.index({ 'stats.reputationScore': -1 });
organizerSchema.index({ createdAt: -1 });

// Virtual for contribution count via contributions model
organizerSchema.virtual('contributionCount', {
  ref: 'Contribution',
  localField: 'walletAddress',
  foreignField: 'organizer.walletAddress',
  count: true
});

// Update the updatedAt field before saving
organizerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find verified organizers
organizerSchema.statics.findVerified = function() {
  return this.find({ 'verification.status': 'verified', isActive: true });
};

// Instance method to check if organizer can verify contributions
organizerSchema.methods.canVerifyContributions = function() {
  return this.verification.status === 'verified' && 
         this.blockchain.authorized && 
         this.isActive;
};

const Organizer = mongoose.model('Organizer', organizerSchema);

export default Organizer;