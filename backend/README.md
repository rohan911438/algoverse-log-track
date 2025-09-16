# AlgoVerse Log Track - MongoDB Backend

A comprehensive MongoDB backend API for the AlgoVerse volunteer contribution tracking system, built with Node.js, Express.js, and Mongoose ODM. This backend provides robust APIs for managing organizers, volunteers, and contributions with blockchain integration capabilities.

## 🚀 Features

- **Complete REST API** - Full CRUD operations for organizers, volunteers, and contributions
- **MongoDB Integration** - Robust data models with validation and indexing
- **Blockchain Ready** - Algorand wallet address validation and blockchain status tracking
- **Advanced Search** - Location-based and skills-based volunteer matching
- **Verification System** - Multi-step verification workflows for organizers and volunteers
- **Statistics & Analytics** - Comprehensive contribution tracking and impact metrics
- **Security First** - JWT authentication, rate limiting, input validation, and CORS protection
- **Production Ready** - Error handling, logging, compression, and graceful shutdown

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone or navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/algoverse-log-track
   
   # Server
   PORT=3000
   NODE_ENV=development
   
   # Security
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   
   # CORS
   FRONTEND_URL=http://localhost:5173
   
   # Algorand (Optional - for future blockchain integration)
   ALGORAND_NODE_URL=https://testnet-api.algonode.cloud
   ALGORAND_INDEXER_URL=https://testnet-idx.algonode.cloud
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or start MongoDB service (Linux/macOS)
   sudo systemctl start mongod
   # or
   brew services start mongodb/brew/mongodb-community
   ```

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```

3. **Visit the API documentation:**
   ```
   http://localhost:3000/api
   ```

4. **Check server health:**
   ```
   http://localhost:3000/health
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── validation.js       # Request validation middleware
├── models/
│   ├── index.js            # Model exports
│   ├── Organizer.js        # Organizer schema and model
│   ├── Volunteer.js        # Volunteer schema and model
│   └── Contribution.js     # Contribution schema and model
├── routes/
│   ├── organizers.js       # Organizer API endpoints
│   ├── volunteers.js       # Volunteer API endpoints
│   └── contributions.js    # Contribution API endpoints
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── seeds.js                # Database seeding script
├── server.js               # Express server configuration
└── README.md               # This file
```

## 🔌 API Endpoints

### 🏢 Organizers API (`/api/organizers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/organizers` | List all organizers |
| `GET` | `/api/organizers/:walletAddress` | Get organizer by wallet address |
| `POST` | `/api/organizers` | Register new organizer |
| `PUT` | `/api/organizers/:walletAddress` | Update organizer |
| `PUT` | `/api/organizers/:walletAddress/verify` | Update verification status |
| `DELETE` | `/api/organizers/:walletAddress` | Deactivate organizer |

### 🙋 Volunteers API (`/api/volunteers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/volunteers` | List volunteers with filtering |
| `GET` | `/api/volunteers/:walletAddress` | Get volunteer by wallet address |
| `POST` | `/api/volunteers` | Register new volunteer |
| `POST` | `/api/volunteers/search` | Advanced volunteer search |
| `PUT` | `/api/volunteers/:walletAddress` | Update volunteer profile |
| `PUT` | `/api/volunteers/:walletAddress/verify` | Update verification status |
| `PUT` | `/api/volunteers/:walletAddress/stats` | Update statistics |
| `DELETE` | `/api/volunteers/:walletAddress` | Deactivate volunteer |

### 📝 Contributions API (`/api/contributions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/contributions` | List contributions with filtering |
| `GET` | `/api/contributions/:id` | Get contribution by ID |
| `POST` | `/api/contributions` | Create new contribution |
| `PUT` | `/api/contributions/:id` | Update contribution |
| `PUT` | `/api/contributions/:id/verify` | Verify contribution |
| `PUT` | `/api/contributions/:id/blockchain` | Update blockchain status |
| `GET` | `/api/contributions/stats/summary` | Get contribution statistics |
| `DELETE` | `/api/contributions/:id` | Soft delete contribution |

## 🗃️ Database Models

### Organizer Model
```javascript
{
  walletAddress: String,        // Algorand wallet address
  profile: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  organization: {
    name: String,
    type: String,               // nonprofit, charity, etc.
    description: String,
    website: String,
    taxId: String,
    establishedDate: Date,
    isVerified: Boolean
  },
  verification: {
    status: String,             // pending, verified, rejected
    verifiedAt: Date,
    identityVerified: Boolean,
    documentVerified: Boolean
  }
  // ... more fields
}
```

### Volunteer Model
```javascript
{
  walletAddress: String,        // Algorand wallet address
  profile: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateOfBirth: Date,
    bio: String
  },
  skills: [String],            // Array of skills
  interests: [String],         // Array of interests
  availability: {
    weekdays: [String],
    timeSlots: [String],
    maxHoursPerWeek: Number
  },
  stats: {
    totalContributions: Number,
    totalHours: Number,
    verifiedHours: Number,
    reputationScore: Number,
    badges: [Object]
  }
  // ... more fields
}
```

### Contribution Model
```javascript
{
  volunteerWallet: String,      // Reference to volunteer
  organizerWallet: String,      // Reference to organizer
  activity: {
    title: String,
    description: String,
    category: String,           // environmental, education, etc.
    type: String
  },
  time: {
    startTime: Date,
    endTime: Date,
    totalHours: Number
  },
  location: {
    name: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  verification: {
    status: String,             // pending, verified, rejected
    organizerApproval: Object
  },
  blockchain: {
    status: String,             // pending, confirmed, failed
    transactionId: String,
    blockNumber: Number
  }
  // ... more fields
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Protection against API abuse (100 requests per 15 minutes)
- **CORS Protection** - Configurable cross-origin request handling
- **Input Validation** - Comprehensive request validation using express-validator
- **Helmet Security** - Security headers for production deployment
- **Data Sanitization** - Protection against injection attacks

## 📊 Development Scripts

```bash
# Development server with hot reload
npm run dev

# Production server
npm start

# Seed database with sample data
npm run seed

# Clear all data from database
npm run seed:clear

# Run tests (when implemented)
npm test
```

## 🌱 Database Seeding

The backend includes a comprehensive seeding script with sample data:

```bash
# Seed with sample organizers, volunteers, and contributions
npm run seed

# Clear all data
npm run seed:clear
```

**Sample Data Includes:**
- 2 verified organizers (Green Earth Foundation, Community First Initiative)
- 2 verified volunteers with different skills and availability
- 3 contributions with various verification and blockchain statuses

## 🔍 Testing the API

### Using curl:

```bash
# Get all volunteers
curl http://localhost:3000/api/volunteers

# Get specific organizer
curl http://localhost:3000/api/organizers/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

# Create new contribution
curl -X POST http://localhost:3000/api/contributions \
  -H "Content-Type: application/json" \
  -d '{
    "volunteerWallet": "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    "organizerWallet": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "activity": {
      "title": "Community Garden Planting",
      "description": "Planting vegetables and herbs in the community garden",
      "category": "environmental"
    },
    "time": {
      "startTime": "2024-12-01T09:00:00Z",
      "endTime": "2024-12-01T12:00:00Z"
    }
  }'
```

### Using Postman or Insomnia:

Import the API collection or manually test endpoints using the documentation at `http://localhost:3000/api`

## 🚀 Production Deployment

### Environment Setup:
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db/algoverse
JWT_SECRET=your-very-secure-production-jwt-secret
PORT=3000
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 Process Manager:
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "algoverse-api"

# Monitor
pm2 monit

# Restart
pm2 restart algoverse-api
```

### Docker Deployment:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration Options

### Database Configuration:
- Connection pooling for high concurrency
- Automatic reconnection handling
- Index optimization for query performance

### Security Configuration:
- JWT token expiration (default: 24 hours)
- Rate limiting thresholds
- CORS allowed origins
- Request size limits

### Performance Configuration:
- Response compression
- Query pagination limits
- Database connection pool size

## 📚 API Response Format

All API responses follow a consistent format:

```javascript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "errors": [/* validation errors */]
}

// Paginated Response
{
  "success": true,
  "data": [/* array of items */],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🔗 Frontend Integration

This backend is designed to work seamlessly with the AlgoVerse frontend. Key integration points:

- **Wallet Connection**: Algorand wallet address as primary identifier
- **Real-time Updates**: WebSocket support for live contribution updates (future feature)
- **File Uploads**: Support for contribution evidence (photos, documents)
- **Search & Filtering**: Advanced search capabilities for volunteer matching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## 📄 License

This project is part of the AlgoVerse ecosystem and follows the same licensing terms.

## 🆘 Support & Documentation

- **API Documentation**: Visit `http://localhost:3000/api` when server is running
- **Health Check**: `http://localhost:3000/health`
- **MongoDB Compass**: Connect to `mongodb://localhost:27017/algoverse-log-track` to view data
- **Logs**: Check console output for detailed request/error logging

---

🌟 **AlgoVerse Log Track Backend - Empowering Volunteer Communities with Blockchain Technology** 🌟