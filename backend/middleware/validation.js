// Validation middleware for request data
import { body, param, query, validationResult } from 'express-validator';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

/**
 * Algorand wallet address validation
 */
export const validateWalletAddress = param('walletAddress')
  .matches(/^[A-Z2-7]{58}$/)
  .withMessage('Invalid Algorand wallet address format');

/**
 * MongoDB ObjectId validation
 */
export const validateObjectId = param('id')
  .isMongoId()
  .withMessage('Invalid ID format');

/**
 * Organizer registration validation
 */
export const validateOrganizerRegistration = [
  body('walletAddress')
    .matches(/^[A-Z2-7]{58}$/)
    .withMessage('Invalid Algorand wallet address format'),
  
  body('profile.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('profile.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('profile.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email address is required'),
  
  body('profile.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  
  body('organization.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization name must be between 2 and 100 characters'),
  
  body('organization.type')
    .isIn(['nonprofit', 'charity', 'community-group', 'educational', 'government', 'other'])
    .withMessage('Invalid organization type'),
  
  body('organization.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Organization description cannot exceed 500 characters'),
  
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Street address cannot exceed 100 characters'),
  
  body('address.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('address.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  
  body('address.zipCode')
    .optional()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Invalid ZIP code format'),
  
  body('address.country')
    .optional()
    .isISO31661Alpha2()
    .withMessage('Invalid country code'),

  handleValidationErrors
];

/**
 * Volunteer registration validation
 */
export const validateVolunteerRegistration = [
  body('walletAddress')
    .matches(/^[A-Z2-7]{58}$/)
    .withMessage('Invalid Algorand wallet address format'),
  
  body('profile.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('profile.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('profile.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email address is required'),
  
  body('profile.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  
  body('profile.dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for date of birth'),
  
  body('profile.bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skills.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each skill must be between 2 and 50 characters'),
  
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  
  body('interests.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each interest must be between 2 and 50 characters'),
  
  body('availability.weekdays')
    .optional()
    .isArray()
    .withMessage('Weekdays must be an array'),
  
  body('availability.weekdays.*')
    .optional()
    .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid weekday'),
  
  body('availability.timeSlots')
    .optional()
    .isArray()
    .withMessage('Time slots must be an array'),
  
  body('availability.maxHoursPerWeek')
    .optional()
    .isInt({ min: 1, max: 168 })
    .withMessage('Max hours per week must be between 1 and 168'),
  
  body('emergencyContact.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Emergency contact name must be between 2 and 100 characters'),
  
  body('emergencyContact.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid emergency contact phone number is required'),
  
  body('emergencyContact.relationship')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Emergency contact relationship must be between 2 and 50 characters'),

  handleValidationErrors
];

/**
 * Contribution creation validation
 */
export const validateContributionCreation = [
  body('volunteerWallet')
    .matches(/^[A-Z2-7]{58}$/)
    .withMessage('Invalid volunteer wallet address format'),
  
  body('organizerWallet')
    .matches(/^[A-Z2-7]{58}$/)
    .withMessage('Invalid organizer wallet address format'),
  
  body('activity.title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Activity title must be between 5 and 100 characters'),
  
  body('activity.description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Activity description must be between 10 and 1000 characters'),
  
  body('activity.category')
    .isIn(['environmental', 'education', 'healthcare', 'community-service', 'disaster-relief', 'elderly-care', 'animal-welfare', 'other'])
    .withMessage('Invalid activity category'),
  
  body('time.startTime')
    .isISO8601()
    .withMessage('Invalid start time format'),
  
  body('time.endTime')
    .isISO8601()
    .withMessage('Invalid end time format')
    .custom((endTime, { req }) => {
      const startTime = new Date(req.body.time?.startTime);
      const end = new Date(endTime);
      
      if (end <= startTime) {
        throw new Error('End time must be after start time');
      }
      
      // Check if duration is reasonable (max 24 hours)
      const duration = (end - startTime) / (1000 * 60 * 60);
      if (duration > 24) {
        throw new Error('Activity duration cannot exceed 24 hours');
      }
      
      return true;
    }),
  
  body('location.name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location name cannot exceed 100 characters'),
  
  body('location.address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location address cannot exceed 200 characters'),
  
  body('location.coordinates.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  
  body('location.coordinates.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  
  body('skillsUsed')
    .optional()
    .isArray()
    .withMessage('Skills used must be an array'),
  
  body('skillsUsed.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each skill must be between 2 and 50 characters'),
  
  body('impactMetrics.peopleServed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('People served must be a non-negative integer'),
  
  body('impactMetrics.itemsCollected')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Items collected must be a non-negative integer'),
  
  body('impactMetrics.moneyRaised')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Money raised must be a non-negative number'),

  handleValidationErrors
];

/**
 * Pagination validation
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  handleValidationErrors
];

/**
 * Date range validation
 */
export const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format')
    .custom((endDate, { req }) => {
      const startDate = req.query.startDate;
      if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  handleValidationErrors
];

/**
 * Verification status validation
 */
export const validateVerificationUpdate = [
  body('status')
    .isIn(['verified', 'rejected', 'pending'])
    .withMessage('Invalid verification status'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Verification notes cannot exceed 500 characters'),

  handleValidationErrors
];

/**
 * Blockchain status validation
 */
export const validateBlockchainUpdate = [
  body('status')
    .isIn(['pending', 'submitted', 'confirmed', 'failed'])
    .withMessage('Invalid blockchain status'),
  
  body('transactionId')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Transaction ID must be provided if status is submitted or confirmed'),
  
  body('blockNumber')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Block number must be a non-negative integer'),
  
  body('gasUsed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Gas used must be a non-negative integer'),

  handleValidationErrors
];

/**
 * Search validation
 */
export const validateSearch = [
  body('location.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('location.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  
  body('maxDistance')
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage('Max distance must be between 1 and 500 miles'),

  handleValidationErrors
];