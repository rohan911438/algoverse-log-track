# AlgoVerse Log Track - Deployment Information

This document contains all the deployment details, wallet addresses, and contract information for the AlgoVerse Log Track project.

## 🔑 Deployment Wallet Information

### Lute Wallet Address (Primary Deployment Wallet)
```
LUTE_WALLET_ADDRESS=I7N2JND35J2QNBO4XYDYRDUWPP7X7LJUMGDRBHQOTRPTQGZTOBFG7ZON7U
```

**Network**: Algorand TestNet  
**Purpose**: Primary wallet used for contract deployment and system management  
**Type**: Development/Testing Wallet  

> ⚠️ **Note**: This is a TestNet wallet address used for development purposes only. Never use TestNet wallets in production environments.

## 📋 Smart Contract Deployment Details

### Contract #1: Organizer Registry
- **Contract Name**: `OrganizerRegistry`
- **File**: `algorand-contracts/contracts/OrganizerRegistry.algo.ts`
- **App ID**: `[TO BE UPDATED AFTER DEPLOYMENT]`
- **Purpose**: Manages registration and verification of volunteer organizations
- **Status**: Ready for deployment
- **Deployment Command**: 
  ```bash
  cd algorand-contracts
  npm run deploy:organizer-registry
  ```

### Contract #2: Contribution Logger
- **Contract Name**: `ContributionLogger`
- **File**: `algorand-contracts/contracts/ContributionLogger.algo.ts`
- **App ID**: `[TO BE UPDATED AFTER DEPLOYMENT]`
- **Purpose**: Records and verifies volunteer contributions on the blockchain
- **Status**: Ready for deployment
- **Deployment Command**: 
  ```bash
  cd algorand-contracts
  npm run deploy:contribution-logger
  ```

## 🌐 Network Configuration

### Algorand TestNet Settings
```bash
# API Configuration
TESTNET_ALGOD_URL=https://testnet-algorand.api.purestake.io/ps2
TESTNET_INDEXER_URL=https://testnet-algorand.api.purestake.io/idx2

# Network Details
NETWORK=testnet
GENESIS_ID=testnet-v1.0
GENESIS_HASH=SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=
```

### Required Accounts and Roles
1. **Deployer Account**: `I7N2JND35J2QNBO4XYDYRDUWPP7X7LJUMGDRBHQOTRPTQGZTOBFG7ZON7U`
   - Role: Contract deployment and system administration
   - Required Balance: Minimum 10 ALGO for deployment costs
   
2. **Test Organizer Account**: `[TO BE CREATED]`
   - Role: Testing organizer functionalities
   
3. **Test Volunteer Account**: `[TO BE CREATED]`
   - Role: Testing volunteer contribution logging

## 🚀 Deployment Process

### Pre-Deployment Checklist
- [ ] TestNet wallet funded with sufficient ALGO
- [ ] PureStake API key configured
- [ ] Contract compilation successful
- [ ] Unit tests passing
- [ ] Backend API server ready

### Deployment Steps

1. **Compile Contracts**
   ```bash
   cd algorand-contracts
   npm run compile
   ```

2. **Deploy Organizer Registry Contract**
   ```bash
   npm run deploy:organizer-registry
   # Update ORGANIZER_REGISTRY_APP_ID in .env files
   ```

3. **Deploy Contribution Logger Contract**
   ```bash
   npm run deploy:contribution-logger
   # Update CONTRIBUTION_LOGGER_APP_ID in .env files
   ```

4. **Update Configuration Files**
   - Update `algorand-contracts/.env.testnet`
   - Update `backend/.env`
   - Update frontend environment variables

5. **Verify Deployment**
   ```bash
   npm run test:deployment
   ```

## 📊 Post-Deployment Information

### Contract Addresses (To be updated after deployment)
```bash
# Organizer Registry Contract
ORGANIZER_REGISTRY_APP_ID=
ORGANIZER_REGISTRY_ADDRESS=

# Contribution Logger Contract  
CONTRIBUTION_LOGGER_APP_ID=
CONTRIBUTION_LOGGER_ADDRESS=

# Deployment Transaction IDs
ORGANIZER_REGISTRY_DEPLOY_TXID=
CONTRIBUTION_LOGGER_DEPLOY_TXID=
```

### Verification Links
- **Organizer Registry on AlgoExplorer**: `https://testnet.algoexplorer.io/application/[APP_ID]`
- **Contribution Logger on AlgoExplorer**: `https://testnet.algoexplorer.io/application/[APP_ID]`
- **Deployer Wallet on AlgoExplorer**: `https://testnet.algoexplorer.io/address/I7N2JND35J2QNBO4XYDYRDUWPP7X7LJUMGDRBHQOTRPTQGZTOBFG7ZON7U`

## 🔧 Integration Configuration

### Frontend Environment Variables
```bash
# Add to .env.local in root directory
VITE_ALGORAND_NETWORK=testnet
VITE_ALGOD_URL=https://testnet-algorand.api.purestake.io/ps2
VITE_INDEXER_URL=https://testnet-algorand.api.purestake.io/idx2
VITE_ORGANIZER_REGISTRY_APP_ID=[UPDATE_AFTER_DEPLOYMENT]
VITE_CONTRIBUTION_LOGGER_APP_ID=[UPDATE_AFTER_DEPLOYMENT]
```

### Backend Environment Variables
```bash
# Already configured in backend/.env
ALGORAND_NETWORK=testnet
TESTNET_ALGOD_URL=https://testnet-algorand.api.purestake.io/ps2
TESTNET_INDEXER_URL=https://testnet-algorand.api.purestake.io/idx2
ORGANIZER_REGISTRY_APP_ID=[UPDATE_AFTER_DEPLOYMENT]
CONTRIBUTION_LOGGER_APP_ID=[UPDATE_AFTER_DEPLOYMENT]
```

## 📈 Monitoring and Maintenance

### Key Metrics to Monitor
- Contract call success rate
- Transaction throughput
- Gas costs and optimization
- User adoption metrics

### Maintenance Tasks
- Regular balance checks on deployment wallet
- Contract upgrade procedures
- Performance monitoring
- Security audits

## 🔒 Security Considerations

### Wallet Security
- Lute wallet is for TestNet development only
- Never share private keys or mnemonics
- Use hardware wallets for MainNet deployments
- Implement multi-sig for production contracts

### Contract Security
- All contracts undergo thorough testing
- Use of established patterns and best practices
- Regular security audits recommended
- Gradual rollout strategy

## 📞 Support and Contact

### Team Information
- **Team Name**: BROTHERHOOD
- **Lead Developer**: Rohan Kumar
- **Repository**: https://github.com/rohan911438/algoverse-log-track

### Getting Help
- Check documentation in respective directories
- Review error logs and debugging guides
- Contact team for deployment assistance

---

## 📝 Deployment Log

| Date | Action | Status | Details |
|------|--------|--------|---------|
| 2025-09-17 | Initial Setup | ✅ Complete | Repository structure and configuration |
| TBD | Contract Deployment | ⏳ Pending | Awaiting final testing |
| TBD | Integration Testing | ⏳ Pending | End-to-end functionality testing |
| TBD | Production Deployment | ⏳ Pending | MainNet deployment (future) |

---

**Last Updated**: September 17, 2025  
**Version**: 1.0.0  
**Status**: Development Phase