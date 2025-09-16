import express from 'express';
import { Organizer } from '../models/index.js';

const router = express.Router();

/**
 * @route   GET /api/organizers
 * @desc    Get all verified organizers
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      city, 
      state, 
      verified = true 
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (verified === 'true') {
      query['verification.status'] = 'verified';
    }
    
    if (type) {
      query['organization.type'] = type;
    }
    
    if (city) {
      query['contact.address.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      query['contact.address.state'] = new RegExp(state, 'i');
    }

    const options = {
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 50), // Max 50 per page
      sort: { 'stats.reputationScore': -1, createdAt: -1 },
      select: 'walletAddress name email organization verification.status stats contact.address isActive'
    };

    const organizers = await Organizer.find(query)
      .select(options.select)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const total = await Organizer.countDocuments(query);

    res.json({
      success: true,
      data: organizers,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });

  } catch (error) {
    console.error('Error fetching organizers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organizers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/organizers/:walletAddress
 * @desc    Get organizer by wallet address
 * @access  Public
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

    const organizer = await Organizer.findOne({ 
      walletAddress, 
      isActive: true 
    }).select('-__v');

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      data: organizer
    });

  } catch (error) {
    console.error('Error fetching organizer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organizer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/organizers
 * @desc    Register new organizer
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const organizerData = req.body;

    // Check if organizer already exists
    const existingOrganizer = await Organizer.findOne({
      $or: [
        { walletAddress: organizerData.walletAddress },
        { email: organizerData.email }
      ]
    });

    if (existingOrganizer) {
      return res.status(400).json({
        success: false,
        message: 'Organizer with this wallet address or email already exists'
      });
    }

    const organizer = new Organizer(organizerData);
    await organizer.save();

    res.status(201).json({
      success: true,
      message: 'Organizer registered successfully',
      data: organizer
    });

  } catch (error) {
    console.error('Error creating organizer:', error);
    
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
      message: 'Failed to register organizer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/organizers/:walletAddress
 * @desc    Update organizer profile
 * @access  Private (should be protected by auth middleware)
 */
router.put('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.walletAddress;
    delete updates.verification;
    delete updates.blockchain;
    delete updates.stats;
    delete updates.createdAt;

    const organizer = await Organizer.findOneAndUpdate(
      { walletAddress, isActive: true },
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      message: 'Organizer updated successfully',
      data: organizer
    });

  } catch (error) {
    console.error('Error updating organizer:', error);
    
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
      message: 'Failed to update organizer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/organizers/:walletAddress/verify
 * @desc    Update organizer verification status (Admin only)
 * @access  Private (Admin)
 */
router.put('/:walletAddress/verify', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { status, notes, verifiedBy } = req.body;

    if (!['verified', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status'
      });
    }

    const updateData = {
      'verification.status': status,
      'verification.notes': notes
    };

    if (status === 'verified') {
      updateData['verification.verifiedAt'] = new Date();
      updateData['verification.verifiedBy'] = verifiedBy;
    }

    const organizer = await Organizer.findOneAndUpdate(
      { walletAddress, isActive: true },
      updateData,
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      message: 'Organizer verification status updated',
      data: organizer
    });

  } catch (error) {
    console.error('Error updating organizer verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update verification status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/organizers/:walletAddress/blockchain
 * @desc    Update organizer blockchain status
 * @access  Private (System/Admin)
 */
router.put('/:walletAddress/blockchain', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { authorized, authorizationTxId, contractAppId } = req.body;

    const updateData = {
      'blockchain.authorized': authorized,
      'blockchain.lastSyncAt': new Date()
    };

    if (authorizationTxId) {
      updateData['blockchain.authorizationTxId'] = authorizationTxId;
    }

    if (contractAppId) {
      updateData['blockchain.contractAppId'] = contractAppId;
    }

    const organizer = await Organizer.findOneAndUpdate(
      { walletAddress, isActive: true },
      updateData,
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      message: 'Organizer blockchain status updated',
      data: organizer
    });

  } catch (error) {
    console.error('Error updating organizer blockchain status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blockchain status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   DELETE /api/organizers/:walletAddress
 * @desc    Deactivate organizer (soft delete)
 * @access  Private (Admin)
 */
router.delete('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const organizer = await Organizer.findOneAndUpdate(
      { walletAddress },
      { 
        isActive: false,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      message: 'Organizer deactivated successfully'
    });

  } catch (error) {
    console.error('Error deactivating organizer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate organizer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;