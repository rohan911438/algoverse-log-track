import express from 'express';
import { Contribution, Organizer, Volunteer } from '../models/index.js';

const router = express.Router();

/**
 * @route   GET /api/contributions
 * @desc    Get contributions with filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      volunteer,
      organizer,
      type,
      city,
      state,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (status) {
      query['verification.status'] = status;
    }
    
    if (volunteer) {
      query['volunteer.walletAddress'] = volunteer;
    }
    
    if (organizer) {
      query['organizer.walletAddress'] = organizer;
    }
    
    if (type) {
      query['activity.type'] = type;
    }
    
    if (city) {
      query['location.address.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      query['location.address.state'] = new RegExp(state, 'i');
    }

    // Date range filtering
    if (startDate || endDate) {
      query['timeLog.startDate'] = {};
      if (startDate) {
        query['timeLog.startDate']['$gte'] = new Date(startDate);
      }
      if (endDate) {
        query['timeLog.startDate']['$lte'] = new Date(endDate);
      }
    }

    const options = {
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 50),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    };

    const contributions = await Contribution.find(query)
      .select('-metadata -__v')
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const total = await Contribution.countDocuments(query);

    res.json({
      success: true,
      data: contributions,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });

  } catch (error) {
    console.error('Error fetching contributions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contributions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/contributions/:id
 * @desc    Get contribution by ID or contributionId
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by MongoDB _id first, then by contributionId
    let contribution = await Contribution.findOne({ 
      _id: id, 
      isActive: true 
    });
    
    if (!contribution) {
      contribution = await Contribution.findOne({ 
        contributionId: id, 
        isActive: true 
      });
    }

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    res.json({
      success: true,
      data: contribution
    });

  } catch (error) {
    console.error('Error fetching contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contribution',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/contributions
 * @desc    Submit new contribution
 * @access  Public (should be protected by volunteer auth)
 */
router.post('/', async (req, res) => {
  try {
    const contributionData = req.body;

    // Validate volunteer exists
    const volunteer = await Volunteer.findOne({ 
      walletAddress: contributionData.volunteer.walletAddress,
      isActive: true 
    });

    if (!volunteer) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer not found or inactive'
      });
    }

    // Validate organizer exists and is verified
    const organizer = await Organizer.findOne({ 
      walletAddress: contributionData.organizer.walletAddress,
      isActive: true,
      'verification.status': 'verified'
    });

    if (!organizer) {
      return res.status(400).json({
        success: false,
        message: 'Organizer not found or not verified'
      });
    }

    // Enrich data from volunteer and organizer profiles
    contributionData.volunteer.name = volunteer.profile.fullName;
    contributionData.volunteer.email = volunteer.profile.email;
    contributionData.organizer.name = organizer.name;
    contributionData.organizer.organization = organizer.organization.name;
    contributionData.organizer.email = organizer.email;

    const contribution = new Contribution(contributionData);
    await contribution.save();

    res.status(201).json({
      success: true,
      message: 'Contribution submitted successfully',
      data: contribution
    });

  } catch (error) {
    console.error('Error creating contribution:', error);
    
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
      message: 'Failed to submit contribution',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/contributions/:id/verify
 * @desc    Verify contribution (approve/reject)
 * @access  Private (Organizer)
 */
router.put('/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      status, 
      approvalNotes, 
      rejectionReason, 
      reviewedBy 
    } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status'
      });
    }

    // Find contribution
    const contribution = await Contribution.findOne({
      $or: [{ _id: id }, { contributionId: id }],
      isActive: true
    });

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    // Check if contribution can be verified
    if (!contribution.canBeVerified()) {
      return res.status(400).json({
        success: false,
        message: 'Contribution cannot be verified in its current state'
      });
    }

    // Verify the reviewer is the assigned organizer
    if (contribution.organizer.walletAddress !== reviewedBy) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned organizer can verify this contribution'
      });
    }

    // Update verification status
    const updateData = {
      'verification.status': status,
      'verification.reviewedAt': new Date(),
      'verification.reviewedBy': reviewedBy
    };

    if (status === 'approved') {
      updateData['verification.approvalNotes'] = approvalNotes;
    } else {
      updateData['verification.rejectionReason'] = rejectionReason;
    }

    const updatedContribution = await Contribution.findByIdAndUpdate(
      contribution._id,
      updateData,
      { new: true, runValidators: true }
    );

    // Update organizer stats
    if (status === 'approved') {
      await Organizer.findOneAndUpdate(
        { walletAddress: reviewedBy },
        {
          $inc: {
            'stats.contributionsVerified': 1,
            'stats.totalHoursVerified': updatedContribution.timeLog.hoursWorked
          }
        }
      );
    }

    // Update volunteer stats
    if (status === 'approved') {
      await Volunteer.findOneAndUpdate(
        { walletAddress: updatedContribution.volunteer.walletAddress },
        {
          $inc: {
            'stats.verifiedHours': updatedContribution.timeLog.hoursWorked,
            'stats.reputationScore': 10 // Award points for verified contribution
          }
        }
      );
    }

    res.json({
      success: true,
      message: `Contribution ${status} successfully`,
      data: updatedContribution
    });

  } catch (error) {
    console.error('Error verifying contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify contribution',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/contributions/:id/blockchain
 * @desc    Update contribution blockchain status
 * @access  Private (System)
 */
router.put('/:id/blockchain', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      txId, 
      blockNumber, 
      contractAppId, 
      verified, 
      syncStatus,
      errorMessage 
    } = req.body;

    const contribution = await Contribution.findOne({
      $or: [{ _id: id }, { contributionId: id }],
      isActive: true
    });

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    const updateData = {
      'blockchain.lastSyncAttempt': new Date(),
      'blockchain.syncStatus': syncStatus || 'synced'
    };

    if (txId) {
      updateData['blockchain.txId'] = txId;
      updateData['blockchain.recordedAt'] = new Date();
    }

    if (blockNumber) {
      updateData['blockchain.blockNumber'] = blockNumber;
    }

    if (contractAppId) {
      updateData['blockchain.contractAppId'] = contractAppId;
    }

    if (typeof verified === 'boolean') {
      updateData['blockchain.verified'] = verified;
    }

    if (errorMessage) {
      updateData['blockchain.errorMessage'] = errorMessage;
      updateData['blockchain.syncStatus'] = 'failed';
    }

    const updatedContribution = await Contribution.findByIdAndUpdate(
      contribution._id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Contribution blockchain status updated',
      data: updatedContribution
    });

  } catch (error) {
    console.error('Error updating contribution blockchain status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blockchain status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/contributions/stats/summary
 * @desc    Get contribution statistics summary
 * @access  Public
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Contribution.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: null,
          totalContributions: { $sum: 1 },
          totalHours: { $sum: '$timeLog.hoursWorked' },
          approvedContributions: {
            $sum: {
              $cond: [{ $eq: ['$verification.status', 'approved'] }, 1, 0]
            }
          },
          approvedHours: {
            $sum: {
              $cond: [
                { $eq: ['$verification.status', 'approved'] },
                '$timeLog.hoursWorked',
                0
              ]
            }
          },
          pendingContributions: {
            $sum: {
              $cond: [{ $eq: ['$verification.status', 'pending'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const summary = stats[0] || {
      totalContributions: 0,
      totalHours: 0,
      approvedContributions: 0,
      approvedHours: 0,
      pendingContributions: 0
    };

    // Get activity type breakdown
    const activityStats = await Contribution.aggregate([
      {
        $match: { 
          isActive: true,
          'verification.status': 'approved'
        }
      },
      {
        $group: {
          _id: '$activity.type',
          count: { $sum: 1 },
          hours: { $sum: '$timeLog.hoursWorked' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary,
        activityBreakdown: activityStats
      }
    });

  } catch (error) {
    console.error('Error fetching contribution stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contribution statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   DELETE /api/contributions/:id
 * @desc    Deactivate contribution (soft delete)
 * @access  Private (Admin or Volunteer who submitted)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { requestedBy } = req.body; // Wallet address of requester

    const contribution = await Contribution.findOne({
      $or: [{ _id: id }, { contributionId: id }],
      isActive: true
    });

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    // Only allow deletion by the volunteer who submitted it (or admin)
    if (contribution.volunteer.walletAddress !== requestedBy) {
      return res.status(403).json({
        success: false,
        message: 'Only the volunteer who submitted this contribution can delete it'
      });
    }

    // Don't allow deletion of approved contributions that are on blockchain
    if (contribution.verification.status === 'approved' && contribution.blockchain.txId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete contribution that has been recorded on blockchain'
      });
    }

    await Contribution.findByIdAndUpdate(
      contribution._id,
      { 
        isActive: false,
        updatedAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Contribution deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contribution',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;