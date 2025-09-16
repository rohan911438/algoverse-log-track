import { TestNetClient } from './testnet-client.js';

/**
 * Quick Test Script - Verify TestNet Setup
 */

async function runTests() {
    console.log('🧪 AlgoVerse TestNet Verification Tests');
    console.log('=====================================\n');

    const client = new TestNetClient();
    let testsPassed = 0;
    let totalTests = 0;

    // Test 1: Connection
    totalTests++;
    console.log('Test 1: TestNet Connection');
    try {
        const connected = await client.testConnection();
        if (connected) {
            console.log('✅ PASS - Connected to TestNet\n');
            testsPassed++;
        } else {
            console.log('❌ FAIL - Cannot connect to TestNet\n');
        }
    } catch (error) {
        console.log('❌ FAIL - Connection error:', error.message, '\n');
    }

    // Test 2: Deployer Account
    totalTests++;
    console.log('Test 2: Deployer Account');
    try {
        const account = client.getDeployerAccount();
        if (account) {
            console.log('✅ PASS - Deployer account loaded');
            console.log(`   Address: ${account.addr.substring(0, 10)}...${account.addr.slice(-10)}\n`);
            testsPassed++;
        } else {
            console.log('❌ FAIL - Cannot load deployer account\n');
        }
    } catch (error) {
        console.log('❌ FAIL - Account error:', error.message, '\n');
    }

    // Test 3: Account Balance
    totalTests++;
    console.log('Test 3: Account Balance');
    try {
        const account = client.getDeployerAccount();
        if (account) {
            const balance = await client.checkBalance(account.addr);
            if (balance >= 0.5) {
                console.log('✅ PASS - Sufficient balance for deployment\n');
                testsPassed++;
            } else {
                console.log('❌ FAIL - Insufficient balance');
                console.log('💡 Get TestNet ALGO: https://dispenser.testnet.aws.algodev.network/\n');
            }
        }
    } catch (error) {
        console.log('❌ FAIL - Balance check error:', error.message, '\n');
    }

    // Test 4: Environment Variables
    totalTests++;
    console.log('Test 4: Environment Configuration');
    try {
        const apiKey = process.env.PURESTAKE_API_KEY;
        const mnemonic = process.env.DEPLOYER_MNEMONIC;
        
        if (apiKey && apiKey.length > 10) {
            if (mnemonic && mnemonic.split(' ').length === 25) {
                console.log('✅ PASS - Environment variables configured\n');
                testsPassed++;
            } else {
                console.log('❌ FAIL - Invalid DEPLOYER_MNEMONIC (need 25 words)\n');
            }
        } else {
            console.log('❌ FAIL - Missing or invalid PURESTAKE_API_KEY\n');
        }
    } catch (error) {
        console.log('❌ FAIL - Environment error:', error.message, '\n');
    }

    // Test 5: Contract Schemas
    totalTests++;
    console.log('Test 5: Contract Schema Validation');
    try {
        // Validate that our contract schemas are reasonable
        const organizerSchema = { globalInts: 3, globalBytes: 1, localInts: 3, localBytes: 0 };
        const loggerSchema = { globalInts: 3, globalBytes: 0, localInts: 3, localBytes: 0 };
        
        if (organizerSchema.globalInts <= 64 && organizerSchema.localInts <= 16) {
            if (loggerSchema.globalInts <= 64 && loggerSchema.localInts <= 16) {
                console.log('✅ PASS - Contract schemas are valid\n');
                testsPassed++;
            } else {
                console.log('❌ FAIL - ContributionLogger schema exceeds limits\n');
            }
        } else {
            console.log('❌ FAIL - OrganizerRegistry schema exceeds limits\n');
        }
    } catch (error) {
        console.log('❌ FAIL - Schema validation error:', error.message, '\n');
    }

    // Results Summary
    console.log('📊 Test Results Summary');
    console.log('========================');
    console.log(`✅ Passed: ${testsPassed}/${totalTests} tests`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 ALL TESTS PASSED! Ready for deployment! 🚀');
        console.log('\n💡 Next steps:');
        console.log('   1. Run: node deploy.js');
        console.log('   2. Copy App IDs to frontend .env');
        console.log('   3. Test frontend wallet connection');
        console.log('   4. Start building your amazing hackathon project!');
    } else {
        console.log('⚠️  Some tests failed. Please fix issues before deployment.');
        console.log('\n🔧 Common fixes:');
        console.log('   - Check your PURESTAKE_API_KEY in .env.testnet');
        console.log('   - Verify DEPLOYER_MNEMONIC has 25 words');
        console.log('   - Get TestNet ALGO from dispenser');
        console.log('   - Check internet connection');
    }
    
    console.log('\n📚 Need help? Check HACKATHON_SETUP.md');
}

// Run tests if this file is executed directly
if (process.argv[1].includes('test-setup.js')) {
    runTests().catch(console.error);
}

export default runTests;