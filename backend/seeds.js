import mongoose from 'mongoose';
import { Organizer, Volunteer, Contribution } from './models/index.js';

// Sample data for seeding the database
const sampleOrganizers = [
  {
    walletAddress: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    profile: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@greenearthfoundation.org',
      phone: '+1234567890'
    },
    organization: {
      name: 'Green Earth Foundation',
      type: 'nonprofit',
      description: 'Dedicated to environmental conservation and sustainability education.',
      website: 'https://greenearthfoundation.org',
      taxId: '12-3456789',
      establishedDate: new Date('2018-03-15'),
      isVerified: true
    },
    address: {
      street: '123 Eco Street',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94105',
      country: 'US'
    },
    verification: {
      status: 'verified',
      verifiedAt: new Date('2024-01-15T10:00:00Z'),
      identityVerified: true,
      documentVerified: true
    }
  },
  {
    walletAddress: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    profile: {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@communityfirst.org',
      phone: '+1987654321'
    },
    organization: {
      name: 'Community First Initiative',
      type: 'community-group',
      description: 'Building stronger communities through volunteer engagement and local projects.',
      website: 'https://communityfirst.org',
      establishedDate: new Date('2020-07-01')
    },
    address: {
      street: '456 Community Ave',
      city: 'Austin',
      state: 'Texas',
      zipCode: '73301',
      country: 'US'
    },
    verification: {
      status: 'verified',
      verifiedAt: new Date('2024-02-01T14:30:00Z'),
      identityVerified: true,
      documentVerified: false
    }
  }
];

const sampleVolunteers = [
  {
    walletAddress: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    profile: {
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1555123456',
      dateOfBirth: new Date('1995-08-22'),
      bio: 'Passionate about environmental conservation and community service. Love working with children and outdoor activities.'
    },
    address: {
      street: '789 Volunteer Lane',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94102',
      country: 'US'
    },
    skills: ['environmental-cleanup', 'childcare', 'event-planning', 'photography'],
    interests: ['environment', 'education', 'community-service', 'outdoor-activities'],
    availability: {
      weekdays: ['saturday', 'sunday'],
      timeSlots: ['morning', 'afternoon'],
      maxHoursPerWeek: 10
    },
    emergencyContact: {
      name: 'Maria Rodriguez',
      phone: '+1555123457',
      relationship: 'Mother'
    },
    verification: {
      status: 'verified',
      verifiedAt: new Date('2024-01-20T09:00:00Z'),
      identityVerified: true
    },
    stats: {
      totalContributions: 12,
      totalHours: 48,
      verifiedHours: 45,
      organizationsHelped: 3,
      reputationScore: 850,
      badges: [
        {
          name: 'Eco Warrior',
          description: 'Completed 10+ environmental activities',
          earnedDate: new Date('2024-10-01')
        }
      ]
    }
  },
  {
    walletAddress: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
    profile: {
      firstName: 'James',
      lastName: 'Thompson',
      email: 'james.thompson@email.com',
      phone: '+1555987654',
      dateOfBirth: new Date('1988-12-10'),
      bio: 'Tech professional who loves giving back to the community. Experienced in mentoring and teaching.'
    },
    address: {
      street: '321 Helper Street',
      city: 'Austin',
      state: 'Texas',
      zipCode: '73301',
      country: 'US'
    },
    skills: ['teaching', 'mentoring', 'technology', 'project-management'],
    interests: ['education', 'technology', 'youth-development'],
    availability: {
      weekdays: ['friday', 'saturday'],
      timeSlots: ['evening'],
      maxHoursPerWeek: 8
    },
    emergencyContact: {
      name: 'Lisa Thompson',
      phone: '+1555987655',
      relationship: 'Spouse'
    },
    verification: {
      status: 'verified',
      verifiedAt: new Date('2024-02-05T16:00:00Z'),
      identityVerified: true
    },
    stats: {
      totalContributions: 8,
      totalHours: 32,
      verifiedHours: 30,
      organizationsHelped: 2,
      reputationScore: 720,
      badges: [
        {
          name: 'Mentor',
          description: 'Completed 5+ mentoring activities',
          earnedDate: new Date('2024-09-15')
        }
      ]
    }
  }
];

const sampleContributions = [
  {
    volunteerWallet: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    organizerWallet: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    activity: {
      title: 'Beach Cleanup at Ocean Park',
      description: 'Community cleanup event removing plastic waste and debris from the beach. Collected over 200 pounds of trash and recyclables.',
      category: 'environmental',
      type: 'cleanup'
    },
    time: {
      startTime: new Date('2024-11-15T08:00:00Z'),
      endTime: new Date('2024-11-15T12:00:00Z'),
      totalHours: 4
    },
    location: {
      name: 'Ocean Park Beach',
      address: 'Ocean Park, San Francisco, CA',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    skillsUsed: ['environmental-cleanup', 'teamwork'],
    impactMetrics: {
      peopleServed: 25,
      itemsCollected: 200,
      description: '200 pounds of trash and recyclables collected, 25 volunteers participated'
    },
    evidence: {
      photos: ['beach_before.jpg', 'cleanup_action.jpg', 'beach_after.jpg'],
      documents: ['waste_collection_log.pdf']
    },
    verification: {
      status: 'verified',
      organizerApproval: {
        approved: true,
        approvedAt: new Date('2024-11-16T10:00:00Z'),
        notes: 'Excellent work! Emily was very dedicated and helped coordinate other volunteers.'
      }
    },
    blockchain: {
      status: 'confirmed',
      transactionId: 'TXN123456789',
      blockNumber: 12345,
      timestamp: new Date('2024-11-16T11:30:00Z')
    }
  },
  {
    volunteerWallet: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
    organizerWallet: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    activity: {
      title: 'Youth Coding Workshop',
      description: 'Teaching basic programming concepts to middle school students using Scratch and Python.',
      category: 'education',
      type: 'teaching'
    },
    time: {
      startTime: new Date('2024-11-10T14:00:00Z'),
      endTime: new Date('2024-11-10T17:00:00Z'),
      totalHours: 3
    },
    location: {
      name: 'Community Center',
      address: '456 Community Ave, Austin, TX',
      coordinates: {
        latitude: 30.2672,
        longitude: -97.7431
      }
    },
    skillsUsed: ['teaching', 'technology', 'mentoring'],
    impactMetrics: {
      peopleServed: 15,
      description: '15 students learned basic programming concepts'
    },
    evidence: {
      photos: ['workshop_setup.jpg', 'students_coding.jpg'],
      documents: ['curriculum_outline.pdf', 'student_feedback.pdf']
    },
    verification: {
      status: 'verified',
      organizerApproval: {
        approved: true,
        approvedAt: new Date('2024-11-11T09:00:00Z'),
        notes: 'James did an excellent job engaging the students and making programming fun and accessible.'
      }
    },
    blockchain: {
      status: 'confirmed',
      transactionId: 'TXN987654321',
      blockNumber: 12346,
      timestamp: new Date('2024-11-11T10:15:00Z')
    }
  },
  {
    volunteerWallet: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    organizerWallet: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    activity: {
      title: 'Tree Planting Initiative',
      description: 'Planting native trees in the community park to improve air quality and provide shade.',
      category: 'environmental',
      type: 'conservation'
    },
    time: {
      startTime: new Date('2024-11-08T09:00:00Z'),
      endTime: new Date('2024-11-08T13:00:00Z'),
      totalHours: 4
    },
    location: {
      name: 'Golden Gate Park',
      address: 'Golden Gate Park, San Francisco, CA',
      coordinates: {
        latitude: 37.7694,
        longitude: -122.4862
      }
    },
    skillsUsed: ['environmental-cleanup', 'physical-labor'],
    impactMetrics: {
      itemsCollected: 50,
      description: '50 native trees planted'
    },
    evidence: {
      photos: ['tree_planting1.jpg', 'tree_planting2.jpg', 'planted_area.jpg']
    },
    verification: {
      status: 'pending',
      submittedAt: new Date('2024-11-08T14:00:00Z')
    },
    blockchain: {
      status: 'pending'
    }
  }
];

/**
 * Seed the database with sample data
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/algoverse-log-track';
    await mongoose.connect(mongoUri);
    console.log('📊 Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Organizer.deleteMany({}),
      Volunteer.deleteMany({}),
      Contribution.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Insert sample data
    const organizers = await Organizer.insertMany(sampleOrganizers);
    console.log(`👔 Created ${organizers.length} organizers`);

    const volunteers = await Volunteer.insertMany(sampleVolunteers);
    console.log(`🙋 Created ${volunteers.length} volunteers`);

    const contributions = await Contribution.insertMany(sampleContributions);
    console.log(`📝 Created ${contributions.length} contributions`);

    console.log(`
✅ Database seeding completed successfully!

📊 Summary:
   - Organizers: ${organizers.length}
   - Volunteers: ${volunteers.length}
   - Contributions: ${contributions.length}

🔍 Sample Wallet Addresses:
   Organizers:
   - Green Earth Foundation: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
   - Community First: BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
   
   Volunteers:
   - Emily Rodriguez: CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
   - James Thompson: DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD

🚀 You can now test the API endpoints with this sample data!
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
    process.exit(0);
  }
}

/**
 * Clear all data from the database
 */
async function clearDatabase() {
  try {
    console.log('🗑️  Starting database clearing...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/algoverse-log-track';
    await mongoose.connect(mongoUri);
    console.log('📊 Connected to MongoDB');

    // Clear all data
    const results = await Promise.all([
      Organizer.deleteMany({}),
      Volunteer.deleteMany({}),
      Contribution.deleteMany({})
    ]);

    console.log(`
✅ Database cleared successfully!

📊 Deleted:
   - Organizers: ${results[0].deletedCount}
   - Volunteers: ${results[1].deletedCount}
   - Contributions: ${results[2].deletedCount}
    `);

  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'seed') {
  seedDatabase();
} else if (command === 'clear') {
  clearDatabase();
} else {
  console.log(`
📚 Database Seeding Script

Usage:
  npm run seed        - Seed database with sample data
  npm run seed:clear  - Clear all data from database

Commands:
  node seeds.js seed    - Seed database
  node seeds.js clear   - Clear database
  `);
  process.exit(1);
}