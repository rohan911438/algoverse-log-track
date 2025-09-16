import express from 'express';
import { Volunteer } from '../models/index.js';

const router = express.Router();

/**
 * @route   GET /api/volunteers
 * @desc    Get volunteers with filtering
 * @access  Public (with privacy controls)
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      city,
      state,
      skills,
      interests,
      availability,
      verified = false
    } = req.query;

    // Build query
    const query = { 
      isActive: true,
      'preferences.profileVisibility': { $in: ['public', 'organizations-only'] }
    };
    
    if (verified === 'true') {
      query['verification.status'] = 'verified';
    }
    
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      query['address.state'] = new RegExp(state, 'i');
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }

    if (interests) {
      const interestsArray = interests.split(',').map(i => i.trim());
      query.interests = { $in: interestsArray };
    }

    if (availability) {
      query['availability.weekdays'] = { $in: [availability] };
    }

    const options = {
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 50),
      sort: { 'stats.reputationScore': -1, createdAt: -1 },
      // Only return public information for volunteer listings
      select: `
        walletAddress profile.firstName profile.lastName profile.email
        address.city address.state skills interests 
        stats.reputationScore stats.totalContributions stats.verifiedHours
        verification.status availability.weekdays createdAt
      `.replace(/\s+/g, ' ').trim()
    };

    const volunteers = await Volunteer.find(query)
      .select(options.select)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const total = await Volunteer.countDocuments(query);

    res.json({
      success: true,
      data: volunteers,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });

  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/volunteers/:walletAddress
 * @desc    Get volunteer by wallet address
 * @access  Public (with privacy controls)
 */
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Validate wallet address format
    if (!/^[A-Z2-7]{58}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address format'
      });
    }

    const volunteer = await Volunteer.findOne({ 
      walletAddress, 
      isActive: true 
    }).select('-__v');

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    // Respect privacy settings
    let responseData = volunteer.toObject();
    
    if (volunteer.preferences.profileVisibility === 'private') {
      // Only return basic info for private profiles
      responseData = {
        walletAddress: volunteer.walletAddress,
        profile: {
          firstName: volunteer.profile.firstName,
          lastName: volunteer.profile.lastName
        },
        stats: volunteer.stats,
        verification: volunteer.verification
      };
    } else if (volunteer.preferences.profileVisibility === 'organizations-only') {
      // Remove sensitive personal information
      delete responseData.profile.phone;
      delete responseData.emergencyContact;
      delete responseData.address.street;
    }

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching volunteer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/volunteers
 * @desc    Register new volunteer
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const volunteerData = req.body;

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({
      $or: [
        { walletAddress: volunteerData.walletAddress },
        { 'profile.email': volunteerData.profile?.email }
      ]
    });

    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer with this wallet address or email already exists'
      });
    }

    const volunteer = new Volunteer(volunteerData);
    await volunteer.save();

    res.status(201).json({
      success: true,
      message: 'Volunteer registered successfully',
      data: volunteer
    });

  } catch (error) {
    console.error('Error creating volunteer:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to register volunteer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/volunteers/:walletAddress
 * @desc    Update volunteer profile
 * @access  Private (should be protected by auth middleware)
 */
router.put('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.walletAddress;
    delete updates.verification;
    delete updates.stats;
    delete updates.createdAt;

    const volunteer = await Volunteer.findOneAndUpdate(
      { walletAddress, isActive: true },
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      message: 'Volunteer updated successfully',
      data: volunteer
    });

  } catch (error) {
    console.error('Error updating volunteer:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update volunteer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/volunteers/search
 * @desc    Advanced volunteer search
 * @access  Public (Organizations)
 */
router.post('/search', async (req, res) => {
  try {
    const {
      location,
      skills,
      interests,
      availability,
      experience,
      maxDistance = 25,
      page = 1,
      limit = 10
    } = req.body;

    const query = {
      isActive: true,
      'preferences.profileVisibility': { $in: ['public', 'organizations-only'] }
    };

    // Location-based filtering
    if (location) {
      if (location.city) {
        query['address.city'] = new RegExp(location.city, 'i');
      }
      if (location.state) {
        query['address.state'] = new RegExp(location.state, 'i');
      }
    }

    // Skills matching
    if (skills && skills.length > 0) {
      query.skills = { $in: skills };
    }

    // Interests matching
    if (interests && interests.length > 0) {
      query.interests = { $in: interests };
    }

    // Availability filtering
    if (availability) {
      if (availability.weekdays && availability.weekdays.length > 0) {
        query['availability.weekdays'] = { $in: availability.weekdays };
      }
      if (availability.maxHours) {
        query['availability.maxHoursPerWeek'] = { $gte: availability.maxHours };
      }
    }

    // Experience level filtering
    if (experience) {
      if (experience.minHours) {
        query['stats.verifiedHours'] = { $gte: experience.minHours };
      }
      if (experience.minReputation) {
        query['stats.reputationScore'] = { $gte: experience.minReputation };
      }
    }

    const options = {
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 50),
      sort: { 'stats.reputationScore': -1, 'stats.verifiedHours': -1 }
    };

    const volunteers = await Volunteer.find(query)
      .select(`
        walletAddress profile.firstName profile.lastName profile.email
        address.city address.state skills interests 
        stats availability verification.status createdAt
      `.replace(/\s+/g, ' ').trim())
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const total = await Volunteer.countDocuments(query);

    res.json({
      success: true,
      data: volunteers,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      },
      searchCriteria: req.body
    });

  } catch (error) {
    console.error('Error searching volunteers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search volunteers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/volunteers/:walletAddress/verify
 * @desc    Update volunteer verification status
 * @access  Private (Admin)
 */
router.put('/:walletAddress/verify', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { status, identityVerified } = req.body;

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status'
      });
    }

    const updateData = {
      'verification.status': status
    };

    if (status === 'verified') {
      updateData['verification.verifiedAt'] = new Date();
      updateData['verification.identityVerified'] = identityVerified || false;
    }

    const volunteer = await Volunteer.findOneAndUpdate(
      { walletAddress, isActive: true },
      updateData,
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      message: 'Volunteer verification status updated',
      data: volunteer
    });

  } catch (error) {
    console.error('Error updating volunteer verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update verification status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/volunteers/:walletAddress/stats
 * @desc    Update volunteer statistics
 * @access  Private (System)
 */
router.put('/:walletAddress/stats', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { 
      totalContributions,
      totalHours, 
      verifiedHours,
      organizationsHelped,
      reputationScore,
      badge 
    } = req.body;

    const updateData = {};
    
    if (typeof totalContributions === 'number') {
      updateData['stats.totalContributions'] = totalContributions;
    }
    if (typeof totalHours === 'number') {
      updateData['stats.totalHours'] = totalHours;
    }
    if (typeof verifiedHours === 'number') {
      updateData['stats.verifiedHours'] = verifiedHours;
    }
    if (typeof organizationsHelped === 'number') {
      updateData['stats.organizationsHelped'] = organizationsHelped;
    }
    if (typeof reputationScore === 'number') {
      updateData['stats.reputationScore'] = Math.min(1000, Math.max(0, reputationScore));
    }

    // Add badge if provided
    if (badge) {
      updateData.$push = { 'stats.badges': badge };
    }

    const volunteer = await Volunteer.findOneAndUpdate(
      { walletAddress, isActive: true },
      updateData,
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      message: 'Volunteer statistics updated',
      data: volunteer
    });

  } catch (error) {
    console.error('Error updating volunteer stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update volunteer statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   DELETE /api/volunteers/:walletAddress
 * @desc    Deactivate volunteer (soft delete)
 * @access  Private (Admin or Self)
 */
router.delete('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const volunteer = await Volunteer.findOneAndUpdate(
      { walletAddress },
      { 
        isActive: false,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      message: 'Volunteer deactivated successfully'
    });

  } catch (error) {
    console.error('Error deactivating volunteer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate volunteer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;