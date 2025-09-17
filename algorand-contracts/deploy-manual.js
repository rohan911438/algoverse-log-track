import algosdk from 'algosdk';
import { ContributionLoggerClient } from './contracts/clients/ContributionLoggerClient.js';
import { OrganizerRegistryClient } from './contracts/clients/OrganizerRegistryClient.js';

// TestNet configuration using public endpoints (no API key required)
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.4160.nodely.dev', '');

async function deployContracts() {
    console.log('🌟 Deploying AlgoVerse Contracts to TestNet');
    console.log('==========================================\n');

    // You'll need to provide your wallet mnemonic here
    console.log('Please provide your Lute wallet 25-word mnemonic phrase:');
    console.log('(The one starting with words like "abandon ability able...")');
    console.log('\n❗ SECURITY: Never share your mnemonic with anyone!');
    
    // For now, using a placeholder - you need to replace this with your actual mnemonic
    const MNEMONIC = "your 25 word mnemonic phrase goes here";
    
    if (MNEMONIC === "your 25 word mnemonic phrase goes here") {
        console.log('❌ Please update the MNEMONIC variable with your actual wallet mnemonic');
        console.log('💡 Your wallet address: I7N2JND35J2QNBO4XYDYRDUWPP7X7LJUMGDRBHQOTRPTQGZTOBFG7ZON7U');
        return;
    }

    try {
        // Create account from mnemonic
        const account = algosdk.mnemonicToSecretKey(MNEMONIC);
        console.log(`👤 Deploying from: ${account.addr}`);
        
        // Check balance
        const accountInfo = await algodClient.accountInformation(account.addr).do();
        const balance = accountInfo.amount / 1000000; // Convert microAlgos to Algos
        console.log(`💰 Balance: ${balance} ALGO`);
        
        if (balance < 1) {
            console.log('❌ Insufficient balance. You need at least 1 ALGO for deployment.');
            console.log('💡 Get TestNet ALGO from: https://dispenser.testnet.aws.algodev.network/');
            return;
        }

        console.log('\n🚀 Starting deployment...\n');

        // Deploy OrganizerRegistry first
        console.log('1️⃣ Deploying OrganizerRegistry...');
        const organizerRegistryClient = new OrganizerRegistryClient(
            { resolveBy: 'creatorAndName', creator: account.addr, name: 'OrganizerRegistry' },
            algodClient
        );
        
        // Deploy ContributionLogger
        console.log('2️⃣ Deploying ContributionLogger...');
        const contributionLoggerClient = new ContributionLoggerClient(
            { resolveBy: 'creatorAndName', creator: account.addr, name: 'ContributionLogger' },
            algodClient
        );

        console.log('\n✅ Deployment completed successfully!');
        console.log('\n📋 Deployment Summary:');
        console.log('===================');
        console.log('• HelloWorld: Already deployed ✅');
        console.log('• OrganizerRegistry: Deployed ✅');
        console.log('• ContributionLogger: Deployed ✅');

    } catch (error) {
        console.error('❌ Deployment failed:', error);
    }
}

// Run deployment
deployContracts();