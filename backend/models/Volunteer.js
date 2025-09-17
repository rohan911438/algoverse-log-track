import mongoose from 'mongoose';
import validator from 'validator';

/**
 * Volunteer Model Schema
 * Stores information about volunteers and their profile data
 */
const volunteerSchema = new mongoose.Schema({
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
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxLength: [50, 'First name cannot exceed 50 characters']
    },
    
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxLength: [50, 'Last name cannot exceed 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      lowercase: true
    },

    phone: {
      type: String,
      validate: {
        validator: function(phone) {
          return !phone || validator.isMobilePhone(phone);
        },
        message: 'Please provide a valid phone number'
      }
    },

    dateOfBirth: {
      type: Date,
      validate: {
        validator: function(date) {
          // Must be at least 13 years old
          const minAge = new Date();
          minAge.setFullYear(minAge.getFullYear() - 13);
          return date <= minAge;
        },
        message: 'Volunteer must be at least 13 years old'
      }
    },

    avatar: {
      type: String,
      validate: {
        validator: function(url) {
          return !url || validator.isURL(url);
        },
        message: 'Please provide a valid avatar URL'
      }
    }
  },

  // Address Information
  address: {
    street: String,
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'US',
      trim: true
    }
  },

  // Skills and Interests
  skills: [{
    type: String,
    enum: [
      'teaching', 'healthcare', 'construction', 'cooking', 'cleaning',
      'childcare', 'elderly-care', 'fundraising', 'event-planning',
      'technology', 'translation', 'transportation', 'administration',
      'counseling', 'legal', 'financial', 'marketing', 'arts', 'music',
      'sports', 'gardening', 'other'
    ]
  }],

  interests: [{
    type: String,
    enum: [
      'community-service', 'environmental', 'education', 'healthcare',
      'disaster-relief', 'food-security', 'elderly-care', 'youth-programs',
      'arts-culture', 'technology', 'animal-welfare', 'homelessness',
      'mental-health', 'disability-support', 'other'
    ]
  }],

  // Availability
  availability: {
    weekdays: {
      type: [String],
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    timeSlots: [{
      start: String, // Format: "HH:MM"
      end: String,   // Format: "HH:MM"
      days: [String] // Days this time slot applies to
    }],
    maxHoursPerWeek: {
      type: Number,
      min: 0,
      max: 168
    }
  },

  // Emergency Contact
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required']
    },
    relationship: {
      type: String,
      required: [true, 'Emergency contact relationship is required']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      validate: [validator.isMobilePhone, 'Please provide a valid emergency contact phone']
    }
  },

  // Verification and Background Check
  verification: {
    status: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified'
    },
    backgroundCheck: {
      status: {
        type: String,
        enum: ['not-required', 'pending', 'cleared', 'rejected'],
        default: 'not-required'
      },
      completedAt: Date,
      provider: String
    },
    identityVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date
  },

  // Statistics and Achievements
  stats: {
    totalContributions: {
      type: Number,
      default: 0
    },
    totalHours: {
      type: Number,
      default: 0
    },
    verifiedHours: {
      type: Number,
      default: 0
    },
    organizationsHelped: {
      type: Number,
      default: 0
    },
    reputationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 1000
    },
    badges: [{
      name: String,
      description: String,
      iconUrl: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'organizations-only', 'private'],
      default: 'organizations-only'
    },
    travelRadius: {
      type: Number, // Miles
      default: 25,
      min: 0,
      max: 500
    }
  },

  // System Fields
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLoginAt: Date,
  
  registrationSource: {
    type: String,
    enum: ['web', 'mobile', 'referral', 'event', 'other'],
    default: 'web'
  },

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
volunteerSchema.index({ 'profile.email': 1 });
volunteerSchema.index({ 'address.city': 1, 'address.state': 1 });
volunteerSchema.index({ skills: 1 });
volunteerSchema.index({ interests: 1 });
volunteerSchema.index({ 'stats.reputationScore': -1 });
volunteerSchema.index({ 'verification.status': 1 });
volunteerSchema.index({ createdAt: -1 });

// Virtual for full name
volunteerSchema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for age calculation
volunteerSchema.virtual('profile.age').get(function() {
  if (!this.profile.dateOfBirth) return null;
  
  const today = new Date();
  const birth = new Date(this.profile.dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for contribution count via contributions model
volunteerSchema.virtual('contributionCount', {
  ref: 'Contribution',
  localField: 'walletAddress',
  foreignField: 'volunteer.walletAddress',
  count: true
});

// Update the updatedAt field before saving
volunteerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find volunteers by location
volunteerSchema.statics.findByLocation = function(city, state, radius = 25) {
  return this.find({
    'address.city': new RegExp(city, 'i'),
    'address.state': new RegExp(state, 'i'),
    'preferences.travelRadius': { $gte: radius },
    isActive: true
  });
};

// Static method to find volunteers by skills
volunteerSchema.statics.findBySkills = function(skills) {
  return this.find({
    skills: { $in: skills },
    isActive: true,
    'verification.status': { $in: ['verified', 'pending'] }
  });
};

// Instance method to calculate reputation level
volunteerSchema.methods.getReputationLevel = function() {
  const score = this.stats.reputationScore;
  if (score >= 800) return 'Champion';
  if (score >= 600) return 'Expert';
  if (score >= 400) return 'Experienced';
  if (score >= 200) return 'Active';
  return 'Newcomer';
};

// Instance method to check if volunteer can accept new contributions
volunteerSchema.methods.canAcceptContributions = function() {
  return this.isActive && 
         this.verification.status !== 'rejected' &&
         (!this.availability.maxHoursPerWeek || 
          this.stats.totalHours < this.availability.maxHoursPerWeek);
};

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;