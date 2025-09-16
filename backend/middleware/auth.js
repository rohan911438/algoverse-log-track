// Middleware for authentication (JWT validation)
import jwt from 'jsonwebtoken';
import { Organizer, Volunteer } from '../models/index.js';

/**
 * Authenticate user using JWT token
 * Sets req.user with authenticated user data
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No valid token provided.'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in either organizers or volunteers
    let user = await Organizer.findOne({ 
      walletAddress: decoded.walletAddress,
      isActive: true 
    }).select('-__v');
    
    if (!user) {
      user = await Volunteer.findOne({ 
        walletAddress: decoded.walletAddress,
        isActive: true 
      }).select('-__v');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = {
      ...user.toObject(),
      userType: user.organization ? 'organizer' : 'volunteer'
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Authorize organizer access only
 */
export const authorizeOrganizer = (req, res, next) => {
  if (req.user?.userType !== 'organizer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Organizer privileges required.'
    });
  }
  next();
};

/**
 * Authorize volunteer access only
 */
export const authorizeVolunteer = (req, res, next) => {
  if (req.user?.userType !== 'volunteer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Volunteer privileges required.'
    });
  }
  next();
};

/**
 * Authorize verified users only
 */
export const authorizeVerified = (req, res, next) => {
  if (req.user?.verification?.status !== 'verified') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Account verification required.'
    });
  }
  next();
};

/**
 * Authorize admin access (verified organizers with admin flag)
 */
export const authorizeAdmin = async (req, res, next) => {
  try {
    if (req.user?.userType !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const organizer = await Organizer.findOne({
      walletAddress: req.user.walletAddress,
      isActive: true,
      'verification.status': 'verified'
    });

    // Check if organizer has admin privileges
    // This could be based on organization type, special flag, or other criteria
    if (!organizer?.organization?.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Verified organization required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization failed'
    });
  }
};

/**
 * Authorize resource owner (user can access their own data)
 */
export const authorizeOwner = (req, res, next) => {
  const resourceWallet = req.params.walletAddress;
  const userWallet = req.user?.walletAddress;

  if (resourceWallet !== userWallet) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  }

  next();
};

/**
 * Authorize organizer or admin for resource access
 */
export const authorizeOrganizerOrAdmin = async (req, res, next) => {
  try {
    if (req.user?.userType !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Organizer privileges required.'
      });
    }

    // Allow verified organizers to access
    if (req.user.verification?.status === 'verified') {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. Verified organizer status required.'
    });

  } catch (error) {
    console.error('Organizer/Admin authorization error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization failed'
    });
  }
};

/**
 * Optional authentication - sets user if token is valid but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token provided, continue without user
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in either organizers or volunteers
    let user = await Organizer.findOne({ 
      walletAddress: decoded.walletAddress,
      isActive: true 
    }).select('-__v');
    
    if (!user) {
      user = await Volunteer.findOne({ 
        walletAddress: decoded.walletAddress,
        isActive: true 
      }).select('-__v');
    }

    if (user) {
      req.user = {
        ...user.toObject(),
        userType: user.organization ? 'organizer' : 'volunteer'
      };
    }
    
    next();
  } catch (error) {
    // Invalid token, but don't fail - just continue without user
    next();
  }
};