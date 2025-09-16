import mongoose from 'mongoose';

/**
 * Database Models Index
 * Central export point for all MongoDB models
 */

import Organizer from './Organizer.js';
import Volunteer from './Volunteer.js';
import Contribution from './Contribution.js';

// Model validation and initialization
const initializeModels = async () => {
  try {
    // Ensure indexes are created
    await Promise.all([
      Organizer.createIndexes(),
      Volunteer.createIndexes(),
      Contribution.createIndexes()
    ]);
    
    console.log('✅ Database models initialized and indexes created');
  } catch (error) {
    console.error('❌ Error initializing database models:', error);
    throw error;
  }
};

export {
  Organizer,
  Volunteer,
  Contribution,
  initializeModels
};