import mongoose from 'mongoose';

/**
 * MongoDB Database Configuration
 * Handles connection, error handling, and connection events
 */

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('📦 MongoDB already connected');
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/algoverse';
    
    const options = {
      // Connection options
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close connections after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      
      // Deprecated options that should be avoided in newer versions
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    };

    const conn = await mongoose.connect(mongoURI, options);
    
    isConnected = true;
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    
    // Log connection status
    console.log(`📊 Connection State: ${getConnectionState(conn.connection.readyState)}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Helper function to get readable connection state
const getConnectionState = (state) => {
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  return states[state] || 'Unknown';
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 MongoDB disconnected');
  isConnected = false;
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

// Health check function
const checkDBHealth = async () => {
  try {
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();
    return { status: 'healthy', ping: result };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

// Get database statistics
const getDBStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      database: mongoose.connection.name,
      collections: stats.collections,
      documents: stats.objects,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
      storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`,
      indexes: stats.indexes,
      avgObjSize: `${(stats.avgObjSize || 0).toFixed(2)} bytes`
    };
  } catch (error) {
    throw new Error(`Failed to get database statistics: ${error.message}`);
  }
};

export { 
  connectDB, 
  checkDBHealth, 
  getDBStats, 
  isConnected 
};