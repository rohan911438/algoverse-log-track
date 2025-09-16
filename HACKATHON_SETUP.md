# 🌟 AlgoVerse Log Track - Hackathon TestNet Setup

## 🚀 Quick Setup Guide (Skip Local Compilation)

This guide helps you deploy AlgoVerse directly to TestNet, bypassing local compilation issues and getting your hackathon demo running fast!

### ⚡ What This Hackathon Workaround Provides

1. **Modern TealScript Contracts** - Ready-to-deploy smart contracts
2. **Direct TestNet Deployment** - No localhost sandbox needed
3. **PureStake API Integration** - Professional API access
4. **Wallet Integration** - Lute/Pera wallet support + Demo mode
5. **Real Transaction IDs** - Live TestNet transactions
6. **Frontend Integration** - TypeScript clients for React

---

## 📋 Prerequisites

### 1. Get PureStake API Key (FREE)
- Visit: https://www.purestake.com/technology/algorand-api/
- Sign up for free account
- Get your API key

### 2. Create TestNet Wallet
- **Option A**: Install [Lute Wallet](https://lute.app/) extension
- **Option B**: Install [Pera Wallet](https://perawallet.app/)
- **Option C**: Use Demo Mode (for hackathon presentation)

### 3. Get TestNet ALGO (FREE)
- Visit: https://dispenser.testnet.aws.algodev.network/
- Enter your wallet address
- Get 10 FREE TestNet ALGO

---

## 🛠️ Installation & Deployment

### Step 1: Configure Environment
```bash
cd algorand-contracts
cp .env.testnet .env
```

Edit `.env` file:
```env
PURESTAKE_API_KEY=your_api_key_here
DEPLOYER_MNEMONIC=your 25 word mnemonic from wallet
```

### Step 2: Install Dependencies
```bash
# Install TestNet deployment dependencies
npm install algosdk dotenv @algorandfoundation/tealscript

# Or if you prefer yarn
yarn add algosdk dotenv @algorandfoundation/tealscript
```

### Step 3: Test Connection
```bash
node deploy.js test
```
Should show:
```
✅ Connected to TestNet successfully
👤 Deployer: YOUR_ADDRESS
💰 Account balance: 10.0 ALGO
```

### Step 4: Deploy Contracts
```bash
node deploy.js
```

Expected output:
```
🌟 AlgoVerse Log Track - TestNet Deployment
==========================================

✅ Connected to TestNet successfully
👤 Deployer: ABCD...XYZ
💰 Account balance: 10.0 ALGO

🏗️  Starting Contract Deployment...

1️⃣  Deploying OrganizerRegistry...
📋 Transaction ID: ABC123...
✅ OrganizerRegistry deployed successfully!
📱 Application ID: 12345

2️⃣  Deploying ContributionLogger...
📋 Transaction ID: DEF456...
✅ ContributionLogger deployed successfully!
📱 Application ID: 67890

🎉 DEPLOYMENT SUCCESSFUL! 🎉
================================
📱 OrganizerRegistry App ID: 12345
📱 ContributionLogger App ID: 67890
🔗 Explorer: https://testnet.algoexplorer.io/
```

---

## 🌐 Frontend Integration

### Step 1: Copy App IDs to Frontend
The deployment automatically updates your `.env.testnet` with:
```env
REACT_APP_ORGANIZER_REGISTRY_APP_ID=12345
REACT_APP_CONTRIBUTION_LOGGER_APP_ID=67890
REACT_APP_PURESTAKE_API_KEY=your_api_key
```

Copy these to your main project's `.env`:
```bash
cd ..
echo "REACT_APP_ORGANIZER_REGISTRY_APP_ID=12345" >> .env
echo "REACT_APP_CONTRIBUTION_LOGGER_APP_ID=67890" >> .env
echo "REACT_APP_PURESTAKE_API_KEY=your_api_key" >> .env
```

### Step 2: Install Frontend Dependencies
```bash
npm install algosdk
```

### Step 3: Test Frontend Connection
Your enhanced `Landing.tsx` now includes:
- ✅ TestNet wallet connection
- ✅ Demo mode for presentations
- ✅ Real transaction handling
- ✅ Error handling and user feedback

---

## 🎮 Demo Mode (Perfect for Hackathon Presentations)

When Lute Wallet is not installed, the app offers **TestNet Demo Mode**:

1. **Simulated Wallet**: Generates realistic TestNet address
2. **Mock Transactions**: Creates transaction IDs for demonstration
3. **Full UI Flow**: Complete user experience without real wallet
4. **Easy Switch**: Can connect real wallet anytime

Demo Flow:
```
🌟 TestNet Demo Mode Activated!
📱 Demo Address: TESTNET7ALG...DEMO
🌐 Network: TestNet
💡 Simulated transactions for hackathon
```

---

## 📱 Contract Usage Examples

### Authorize an Organizer
```typescript
import { getAlgoVerseClient, TestNetWalletManager } from './lib/testnet-utils';

const client = getAlgoVerseClient();
const wallet = TestNetWalletManager.getInstance();

// Authorize organizer (owner only)
const txId = await client.organizerRegistry.authorize(
  deployerAccount, 
  "ORGANIZER_ADDRESS_HERE"
);

console.log("Organizer authorized:", txId);
```

### Log a Contribution
```typescript
// Log volunteer contribution
const result = await client.contributionLogger.logContribution(
  organizerAccount,
  "VOLUNTEER_ADDRESS",
  "Beach Cleanup",
  4, // hours
  "Cleaned 2km of coastline",
  "Santa Monica Beach"
);

console.log("Contribution logged:", result.txId);
console.log("Contribution ID:", result.contributionId);
```

### Check Authorization Status
```typescript
const isAuthorized = await client.organizerRegistry.checkAuthorization(
  "ORGANIZER_ADDRESS"
);

console.log("Is authorized:", isAuthorized);
```

---

## 🔍 Testing & Verification

### View on TestNet Explorer
- **Transactions**: `https://testnet.algoexplorer.io/tx/YOUR_TX_ID`
- **Applications**: `https://testnet.algoexplorer.io/application/YOUR_APP_ID`
- **Addresses**: `https://testnet.algoexplorer.io/address/YOUR_ADDRESS`

### Check Contract State
```typescript
// Get organizer info
const info = await client.organizerRegistry.getOrganizerInfo("ADDRESS");
console.log("Organizer Info:", info);

// Get volunteer stats  
const stats = await client.contributionLogger.getVolunteerStats("ADDRESS");
console.log("Volunteer Stats:", stats);
```

---

## 🏆 Hackathon Presentation Tips

1. **Start with Demo Mode** - Show full flow without wallet setup
2. **Switch to Real Wallet** - Connect Lute/Pera for live transactions
3. **Show Explorer Links** - Prove transactions are real on TestNet
4. **Highlight Features**:
   - ✅ Real blockchain transactions
   - ✅ Smart contract verification
   - ✅ Transparent contribution tracking
   - ✅ Multi-wallet support

---

## 🚨 Troubleshooting

### Connection Issues
```bash
# Test API key
node -e "console.log(process.env.PURESTAKE_API_KEY)"

# Test network connection
curl -H "X-API-Key: YOUR_API_KEY" https://testnet-algorand.api.purestake.io/ps2/v2/status
```

### Insufficient Balance
- Visit TestNet dispenser: https://dispenser.testnet.aws.algodev.network/
- Each deployment costs ~0.1 ALGO
- Get 10 ALGO free per request

### Wallet Issues
- Try Demo Mode first
- Ensure wallet is on TestNet
- Check wallet has ALGO balance

---

## 🎯 What You Get

✅ **Two deployed smart contracts** on Algorand TestNet
✅ **Real transaction IDs** for demonstrations  
✅ **Professional API integration** via PureStake
✅ **Multi-wallet support** (Lute, Pera, Demo)
✅ **TypeScript clients** for easy integration
✅ **Explorer verification** of all transactions
✅ **Production-ready architecture** scalable to MainNet

---

## 🌟 Next Steps

1. **Deploy your contracts** using this guide
2. **Test the full flow** in Demo Mode
3. **Connect real wallets** for live demo
4. **Show TestNet explorer** to prove blockchain integration
5. **Demonstrate scalability** - ready for MainNet!

**Perfect for hackathons** - skip the local setup headaches and focus on building your amazing idea! 🚀

---

*Made with ❤️ for hackathon success*