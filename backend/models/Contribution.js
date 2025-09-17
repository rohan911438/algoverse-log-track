import mongoose from 'mongoose';

/**
 * Contribution Model Schema
 * Stores detailed information about volunteer contributions and their verification status
 */
const contributionSchema = new mongoose.Schema({
  // Unique contribution identifier
  contributionId: {
    type: String,
    unique: true,
    index: true
  },

  // Volunteer Information
  volunteer: {
    walletAddress: {
      type: String,
      required: [true, 'Volunteer wallet address is required'],
      validate: {
        validator: function(address) {
          return /^[A-Z2-7]{58}$/.test(address);
        },
        message: 'Invalid volunteer wallet address format'
      }
    },
    name: {
      type: String,
      required: [true, 'Volunteer name is required']
    },
    email: String,
    phone: String
  },

  // Organizer Information
  organizer: {
    walletAddress: {
      type: String,
      required: [true, 'Organizer wallet address is required'],
      validate: {
        validator: function(address) {
          return /^[A-Z2-7]{58}$/.test(address);
        },
        message: 'Invalid organizer wallet address format'
      }
    },
    name: String,
    organization: String,
    email: String
  },

  // Contribution Details
  activity: {
    type: {
      type: String,
      required: [true, 'Contribution type is required'],
      enum: [
        'community-service', 'environmental', 'education', 'healthcare',
        'disaster-relief', 'food-security', 'elderly-care', 'youth-programs',
        'arts-culture', 'technology', 'animal-welfare', 'homelessness',
        'mental-health', 'disability-support', 'fundraising', 'administrative',
        'event-support', 'construction', 'transportation', 'other'
      ]
    },
    
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
      maxLength: [200, 'Activity title cannot exceed 200 characters']
    },

    description: {
      type: String,
      required: [true, 'Activity description is required'],
      maxLength: [2000, 'Activity description cannot exceed 2000 characters']
    },

    skillsUsed: [{
      type: String,
      enum: [
        'teaching', 'healthcare', 'construction', 'cooking', 'cleaning',
        'childcare', 'elderly-care', 'fundraising', 'event-planning',
        'technology', 'translation', 'transportation', 'administration',
        'counseling', 'legal', 'financial', 'marketing', 'arts', 'music',
        'sports', 'gardening', 'other'
      ]
    }],

    impact: {
      peopleHelped: {
        type: Number,
        min: 0
      },
      description: String,
      metrics: [{
        name: String,
        value: Number,
        unit: String
      }]
    }
  },

  // Time and Location
  timeLog: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(endDate) {
          return endDate >= this.timeLog.startDate;
        },
        message: 'End date must be after start date'
      }
    },

    hoursWorked: {
      type: Number,
      required: [true, 'Hours worked is required'],
      min: [0.25, 'Minimum contribution is 15 minutes (0.25 hours)'],
      max: [24, 'Maximum single contribution is 24 hours']
    },

    breaks: [{
      start: Date,
      end: Date,
      reason: String
    }]
  },

  location: {
    venue: {
      type: String,
      required: [true, 'Venue name is required']
    },
    
    address: {
      street: String,
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      zipCode: String,
      country: {
        type: String,
        default: 'US'
      }
    },

    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },

  // Verification and Status
  verification: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'disputed'],
      default: 'pending',
      index: true
    },

    submittedAt: {
      type: Date,
      default: Date.now
    },

    reviewedAt: Date,

    reviewedBy: String, // Organizer wallet address

    approvalNotes: String,

    rejectionReason: {
      type: String,
      enum: [
        'invalid-hours', 'insufficient-evidence', 'duplicate-submission',
        'unauthorized-organizer', 'incomplete-information', 'suspicious-activity',
        'other'
      ]
    },

    evidence: [{
      type: {
        type: String,
        enum: ['photo', 'document', 'witness', 'supervisor-contact', 'other']
      },
      url: String,
      description: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],

    witnesses: [{
      name: String,
      email: String,
      phone: String,
      relationship: String, // supervisor, colleague, beneficiary, etc.
      contactVerified: {
        type: Boolean,
        default: false
      }
    }]
  },

  // Blockchain Integration
  blockchain: {
    txId: {
      type: String
    },
    
    blockNumber: Number,
    
    contractAppId: Number,
    
    recordedAt: Date,
    
    verified: {
      type: Boolean,
      default: false
    },

    syncStatus: {
      type: String,
      enum: ['pending', 'synced', 'failed', 'retry'],
      default: 'pending'
    },

    lastSyncAttempt: Date,
    
    errorMessage: String
  },

  // Additional Information
  tags: [{
    type: String,
    trim: true
  }],

  isRecurring: {
    type: Boolean,
    default: false
  },

  parentContribution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contribution'
  },

  relatedContributions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contribution'
  }],

  // Rating and Feedback
  rating: {
    volunteer: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String
    },
    
    organizer: {
      score: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String
    }
  },

  // System Fields
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api', 'import'],
      default: 'web'
    },
    
    ipAddress: String,
    
    userAgent: String,
    
    version: {
      type: String,
      default: '1.0'
    }
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
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

// Indexes for performance and querying
contributionSchema.index({ 'volunteer.walletAddress': 1, createdAt: -1 });
contributionSchema.index({ 'organizer.walletAddress': 1, 'verification.status': 1 });
contributionSchema.index({ 'activity.type': 1, 'verification.status': 1 });
contributionSchema.index({ 'location.address.city': 1, 'location.address.state': 1 });
contributionSchema.index({ 'timeLog.startDate': 1, 'timeLog.endDate': 1 });
contributionSchema.index({ 'verification.submittedAt': -1 });
contributionSchema.index({ 'blockchain.txId': 1 });

// Generate unique contribution ID before saving
contributionSchema.pre('save', function(next) {
  if (!this.contributionId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    this.contributionId = `CONTRIB_${timestamp}_${random}`.toUpperCase();
  }
  
  this.updatedAt = new Date();
  next();
});

// Virtual for total contribution time including breaks
contributionSchema.virtual('timeLog.effectiveHours').get(function() {
  if (!this.timeLog.breaks || this.timeLog.breaks.length === 0) {
    return this.timeLog.hoursWorked;
  }
  
  const breakTime = this.timeLog.breaks.reduce((total, brk) => {
    if (brk.start && brk.end) {
      return total + (brk.end - brk.start) / (1000 * 60 * 60); // Convert ms to hours
    }
    return total;
  }, 0);
  
  return Math.max(0, this.timeLog.hoursWorked - breakTime);
});

// Virtual for contribution age in days
contributionSchema.virtual('ageInDays').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Static method to find contributions by status
contributionSchema.statics.findByStatus = function(status) {
  return this.find({ 'verification.status': status, isActive: true })
              .sort({ 'verification.submittedAt': -1 });
};

// Static method to find contributions for a volunteer
contributionSchema.statics.findByVolunteer = function(walletAddress) {
  return this.find({ 'volunteer.walletAddress': walletAddress, isActive: true })
              .sort({ createdAt: -1 });
};

// Static method to find contributions for an organizer to review
contributionSchema.statics.findForOrganizer = function(walletAddress) {
  return this.find({ 
    'organizer.walletAddress': walletAddress,
    'verification.status': 'pending',
    isActive: true 
  }).sort({ 'verification.submittedAt': 1 });
};

// Instance method to check if contribution can be verified
contributionSchema.methods.canBeVerified = function() {
  return this.verification.status === 'pending' && 
         this.isActive &&
         !this.blockchain.txId; // Not already on blockchain
};

// Instance method to calculate verification urgency (days since submission)
contributionSchema.methods.getVerificationUrgency = function() {
  const daysOld = this.ageInDays;
  if (daysOld > 30) return 'critical';
  if (daysOld > 14) return 'high';
  if (daysOld > 7) return 'medium';
  return 'low';
};

const Contribution = mongoose.model('Contribution', contributionSchema);

export default Contribution;