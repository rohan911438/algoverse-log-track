import algosdk from 'algosdk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.testnet' });

/**
 * TestNet Client Configuration
 */
export class TestNetClient {
    public algodClient: algosdk.Algodv2;
    public indexerClient: algosdk.Indexer;
    
    constructor() {
        // Initialize Algod client for TestNet
        this.algodClient = new algosdk.Algodv2(
            { "X-API-Key": process.env.PURESTAKE_API_KEY || "" },
            process.env.TESTNET_ALGOD_URL || "https://testnet-algorand.api.purestake.io/ps2",
            ""
        );

        // Initialize Indexer client for TestNet
        this.indexerClient = new algosdk.Indexer(
            { "X-API-Key": process.env.PURESTAKE_API_KEY || "" },
            process.env.TESTNET_INDEXER_URL || "https://testnet-algorand.api.purestake.io/idx2",
            ""
        );
    }

    /**
     * Test connection to TestNet
     */
    async testConnection(): Promise<boolean> {
        try {
            const status = await this.algodClient.status().do();
            console.log('✅ Connected to TestNet successfully');
            console.log(`Current round: ${status['last-round']}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to connect to TestNet:', error);
            return false;
        }
    }

    /**
     * Get deployer account from mnemonic
     */
    getDeployerAccount(): algosdk.Account | null {
        const mnemonic = process.env.DEPLOYER_MNEMONIC;
        if (!mnemonic) {
            console.error('❌ DEPLOYER_MNEMONIC not set in .env.testnet');
            return null;
        }

        try {
            return algosdk.mnemonicToSecretKey(mnemonic);
        } catch (error) {
            console.error('❌ Invalid mnemonic in DEPLOYER_MNEMONIC:', error);
            return null;
        }
    }

    /**
     * Check account balance
     */
    async checkBalance(address: string): Promise<number> {
        try {
            const accountInfo = await this.algodClient.accountInformation(address).do();
            const balance = accountInfo.amount / 1000000; // Convert microAlgos to Algos
            console.log(`💰 Account balance: ${balance} ALGO`);
            return balance;
        } catch (error) {
            console.error('❌ Failed to check balance:', error);
            return 0;
        }
    }

    /**
     * Deploy a contract to TestNet
     */
    async deployContract(
        contractName: string,
        approvalProgram: Uint8Array,
        clearProgram: Uint8Array,
        globalSchema: algosdk.StateSchema,
        localSchema: algosdk.StateSchema,
        appArgs?: Uint8Array[]
    ): Promise<number | null> {
        const account = this.getDeployerAccount();
        if (!account) return null;

        try {
            console.log(`🚀 Deploying ${contractName} to TestNet...`);

            // Get suggested parameters
            const suggestedParams = await this.algodClient.getTransactionParams().do();

            // Create the application creation transaction
            const txn = algosdk.makeApplicationCreateTxnFromObject({
                from: account.addr,
                suggestedParams,
                approvalProgram,
                clearProgram,
                numGlobalInts: globalSchema.numUint,
                numGlobalByteSlices: globalSchema.numByteSlice,
                numLocalInts: localSchema.numUint,
                numLocalByteSlices: localSchema.numByteSlice,
                appArgs: appArgs || [],
                onComplete: algosdk.OnApplicationComplete.NoOpOC,
            });

            // Sign the transaction
            const signedTxn = txn.signTxn(account.sk);

            // Submit the transaction
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
            console.log(`📋 Transaction ID: ${txId}`);

            // Wait for confirmation
            const result = await algosdk.waitForConfirmation(this.algodClient, txId, 4);
            const appId = result['application-index'];

            console.log(`✅ ${contractName} deployed successfully!`);
            console.log(`📱 Application ID: ${appId}`);
            console.log(`🔗 TestNet Explorer: https://testnet.algoexplorer.io/application/${appId}`);

            return appId;
        } catch (error) {
            console.error(`❌ Failed to deploy ${contractName}:`, error);
            return null;
        }
    }

    /**
     * Call a contract method
     */
    async callContractMethod(
        appId: number,
        methodName: string,
        args: any[] = [],
        accounts: string[] = [],
        sender?: algosdk.Account
    ): Promise<any> {
        const account = sender || this.getDeployerAccount();
        if (!account) return null;

        try {
            const suggestedParams = await this.algodClient.getTransactionParams().do();

            // Convert args to proper format
            const appArgs = args.map(arg => {
                if (typeof arg === 'string') {
                    return new TextEncoder().encode(arg);
                } else if (typeof arg === 'number') {
                    return algosdk.encodeUint64(arg);
                }
                return arg;
            });

            // Add method name as first argument
            appArgs.unshift(new TextEncoder().encode(methodName));

            const txn = algosdk.makeApplicationNoOpTxnFromObject({
                from: account.addr,
                suggestedParams,
                appIndex: appId,
                appArgs,
                accounts: accounts,
            });

            const signedTxn = txn.signTxn(account.sk);
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
            
            console.log(`📋 Method call transaction ID: ${txId}`);
            
            const result = await algosdk.waitForConfirmation(this.algodClient, txId, 4);
            return result;
        } catch (error) {
            console.error(`❌ Failed to call method ${methodName}:`, error);
            return null;
        }
    }

    /**
     * Opt into an application
     */
    async optInToApp(appId: number, account?: algosdk.Account): Promise<boolean> {
        const senderAccount = account || this.getDeployerAccount();
        if (!senderAccount) return false;

        try {
            const suggestedParams = await this.algodClient.getTransactionParams().do();

            const txn = algosdk.makeApplicationOptInTxnFromObject({
                from: senderAccount.addr,
                suggestedParams,
                appIndex: appId,
            });

            const signedTxn = txn.signTxn(senderAccount.sk);
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
            
            console.log(`📋 Opt-in transaction ID: ${txId}`);
            
            await algosdk.waitForConfirmation(this.algodClient, txId, 4);
            console.log(`✅ Successfully opted into app ${appId}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to opt into app ${appId}:`, error);
            return false;
        }
    }

    /**
     * Save deployed app IDs to environment file
     */
    updateEnvFile(organizerRegistryAppId?: number, contributionLoggerAppId?: number): void {
        const envPath = '.env.testnet';
        let envContent = fs.readFileSync(envPath, 'utf8');

        if (organizerRegistryAppId) {
            envContent = envContent.replace(
                /ORGANIZER_REGISTRY_APP_ID=.*/,
                `ORGANIZER_REGISTRY_APP_ID=${organizerRegistryAppId}`
            );
            envContent = envContent.replace(
                /REACT_APP_ORGANIZER_REGISTRY_APP_ID=.*/,
                `REACT_APP_ORGANIZER_REGISTRY_APP_ID=${organizerRegistryAppId}`
            );
        }

        if (contributionLoggerAppId) {
            envContent = envContent.replace(
                /CONTRIBUTION_LOGGER_APP_ID=.*/,
                `CONTRIBUTION_LOGGER_APP_ID=${contributionLoggerAppId}`
            );
            envContent = envContent.replace(
                /REACT_APP_CONTRIBUTION_LOGGER_APP_ID=.*/,
                `REACT_APP_CONTRIBUTION_LOGGER_APP_ID=${contributionLoggerAppId}`
            );
        }

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Updated .env.testnet with app IDs');
    }
}

export default TestNetClient;