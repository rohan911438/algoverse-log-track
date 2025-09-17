# AlgoVerse Log Track Backend Setup

This document will help you get the backend server running properly.

## ✅ Current Status

Your backend is now properly configured and ready to run! The server starts successfully on port 3000 with the following features:

- ✅ Express.js server with proper middleware setup
- ✅ CORS configuration for frontend communication
- ✅ Security middleware (Helmet, Rate limiting)
- ✅ Environment variables configuration
- ✅ Database models and routes properly implemented
- ✅ Schema index warnings fixed
- ✅ Error handling and graceful shutdown

## 🔄 What's Missing: MongoDB Database

The only thing preventing full functionality is that MongoDB is not running. Here are your options:

### Option 1: Install MongoDB Locally (Recommended for Development)

#### For Windows:
1. **Download MongoDB Community Edition:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select "Windows" and "msi" package
   - Download and install

2. **Start MongoDB:**
   ```cmd
   # Open Command Prompt as Administrator and run:
   mongod
   ```
   
3. **Or use MongoDB as a Windows Service:**
   ```cmd
   # Install as service (during installation, check "Install MongoDB as Service")
   net start MongoDB
   ```

### Option 2: Use MongoDB Atlas (Cloud Database)

1. **Create a free account:**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a cluster:**
   - Create a new cluster (free tier available)
   - Set up database access credentials
   - Configure network access (allow your IP)

3. **Update your .env file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/algoverse
   ```

### Option 3: Use Docker (Alternative)

```bash
# Run MongoDB in a Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🚀 Running the Backend

Once MongoDB is available, start your backend:

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

## 📊 Server Endpoints

Your backend provides these endpoints:

### Health & Documentation
- `GET /health` - Server health check
- `GET /api` - API documentation and endpoint listing

### Organizers
- `GET /api/organizers` - List all organizers
- `GET /api/organizers/:walletAddress` - Get organizer by wallet
- `POST /api/organizers` - Register new organizer
- `PUT /api/organizers/:walletAddress` - Update organizer
- `PUT /api/organizers/:walletAddress/verify` - Update verification
- `DELETE /api/organizers/:walletAddress` - Deactivate organizer

### Volunteers
- `GET /api/volunteers` - List volunteers with filtering
- `GET /api/volunteers/:walletAddress` - Get volunteer by wallet
- `POST /api/volunteers` - Register new volunteer
- `POST /api/volunteers/search` - Advanced volunteer search
- `PUT /api/volunteers/:walletAddress` - Update volunteer profile
- `PUT /api/volunteers/:walletAddress/verify` - Update verification
- `PUT /api/volunteers/:walletAddress/stats` - Update statistics
- `DELETE /api/volunteers/:walletAddress` - Deactivate volunteer

### Contributions
- `GET /api/contributions` - List contributions with filtering
- `GET /api/contributions/:id` - Get contribution by ID
- `POST /api/contributions` - Create new contribution
- `PUT /api/contributions/:id` - Update contribution
- `PUT /api/contributions/:id/verify` - Verify contribution
- `PUT /api/contributions/:id/blockchain` - Update blockchain status
- `GET /api/contributions/stats/summary` - Get statistics
- `DELETE /api/contributions/:id` - Soft delete contribution

## 🔧 Environment Configuration

Your `.env` file is configured with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/algoverse

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production_algoverse_2024
JWT_EXPIRE=7d

# Algorand Configuration
ALGORAND_NETWORK=testnet
# ... (Algorand settings for blockchain integration)
```

## 🧪 Testing Your Backend

Once MongoDB is running, you can test your backend:

1. **Start the server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```

3. **View API documentation:**
   Visit: http://localhost:3000/api in your browser

## 🔍 Troubleshooting

### Common Issues:

1. **Port already in use:**
   - Change the PORT in your `.env` file
   - Or stop the process using that port

2. **MongoDB connection refused:**
   - Ensure MongoDB is installed and running
   - Check if the MONGODB_URI in `.env` is correct

3. **Missing dependencies:**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🎉 You're Ready!

Your backend is properly configured and ready to go. Just install and start MongoDB, then run your server!

The server includes:
- ✅ Robust error handling
- ✅ Input validation
- ✅ Security best practices
- ✅ Proper logging
- ✅ API documentation
- ✅ Database schema design
- ✅ RESTful endpoints

Happy coding! 🚀