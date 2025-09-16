import algosdk from 'algosdk';

/**
 * Frontend Client for OrganizerRegistry Contract
 * Provides easy-to-use methods for frontend integration
 */
export class OrganizerRegistryClient {
    private algodClient: algosdk.Algodv2;
    private appId: number;

    constructor(algodClient: algosdk.Algodv2, appId: number) {
        this.algodClient = algodClient;
        this.appId = appId;
    }

    /**
     * Authorize an organizer (owner only)
     */
    async authorize(senderAccount: algosdk.Account, targetAddress: string): Promise<string | null> {
        try {
            const suggestedParams = await this.algodClient.getTransactionParams().do();
            
            const txn = algosdk.makeApplicationNoOpTxnFromObject({
                from: senderAccount.addr,
                suggestedParams,
                appIndex: this.appId,
                appArgs: [
                    new TextEncoder().encode('authorize'),
                    algosdk.decodeAddress(targetAddress).publicKey
                ],
                accounts: [targetAddress],
            });

            const signedTxn = txn.signTxn(senderAccount.sk);
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
            
            await algosdk.waitForConfirmation(this.algodClient, txId, 4);
            return txId;
        } catch (error) {
            console.error('Failed to authorize organizer:', error);
            return null;
        }
    }

    /**
     * Check if an account is authorized
     */
    async checkAuthorization(accountAddress: string): Promise<boolean> {
        try {
            const accountInfo = await this.algodClient.accountApplicationInformation(accountAddress, this.appId).do();
            const localState = accountInfo['app-local-state']['key-value'];
            
            for (const kv of localState) {
                if (atob(kv.key) === 'authorized') {
                    return kv.value.uint === 1;
                }
            }
            return false;
        } catch (error) {
            console.error('Failed to check authorization:', error);
            return false;
        }
    }

    /**
     * Opt into the contract
     */
    async optIn(account: algosdk.Account): Promise<string | null> {
        try {
            const suggestedParams = await this.algodClient.getTransactionParams().do();
            
            const txn = algosdk.makeApplicationOptInTxnFromObject({
                from: account.addr,
                suggestedParams,
                appIndex: this.appId,
            });

            const signedTxn = txn.signTxn(account.sk);
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
            
            await algosdk.waitForConfirmation(this.algodClient, txId, 4);
            return txId;
        } catch (error) {
            console.error('Failed to opt in:', error);
            return null;
        }
    }

    /**
     * Get organizer information
     */
    async getOrganizerInfo(accountAddress: string): Promise<{
        authorized: boolean;
        reputation: number;
        contributionsVerified: number;
    }> {
        try {
            const accountInfo = await this.algodClient.accountApplicationInformation(accountAddress, this.appId).do();
            const localState = accountInfo['app-local-state']['key-value'];
            
            let authorized = false;
            let reputation = 0;
            let contributionsVerified = 0;

            for (const kv of localState) {
                const key = atob(kv.key);
                if (key === 'authorized') authorized = kv.value.uint === 1;
                if (key === 'reputation') reputation = kv.value.uint;
                if (key === 'contributions_verified') contributionsVerified = kv.value.uint;
            }

            return { authorized, reputation, contributionsVerified };
        } catch (error) {
            console.error('Failed to get organizer info:', error);
            return { authorized: false, reputation: 0, contributionsVerified: 0 };
        }
    }
}

/**
 * Frontend Client for ContributionLogger Contract
 */
export class ContributionLoggerClient {
    private algodClient: algosdk.Algodv2;
    private appId: number;

    constructor(algodClient: algosdk.Algodv2, appId: number) {
        this.algodClient = algodClient;
        this.appId = appId;
    }

    /**
     * Log a single contribution
     */
    async logContribution(
        organizerAccount: algosdk.Account,
        volunteerAddress: string,
        contributionType: string,
        hours: number,
        description: string,
        location: string
    ): Promise<{ txId: string; contributionId: number } | null> {
        try {
            const suggestedParams = await this.algodClient.getTransactionParams().do();
            
            const txn = algosdk.makeApplicationNoOpTxnFromObject({
                from: organizerAccount.addr,
                suggestedParams,
                appIndex: this.appId,
                appArgs: [
                    new TextEncoder().encode('logContribution'),
                    algosdk.decodeAddress(volunteerAddress).publicKey,
                    new TextEncoder().encode(contributionType),
                    algosdk.encodeUint64(hours),
                    new TextEncoder().encode(description),
                    new TextEncoder().encode(location)
                ],
                accounts: [volunteerAddress],
                note: new TextEncoder().encode(JSON.stringify({
                    type: 'contribution',
                    volunteer: volunteerAddress,
                    contributionType,
                    hours,
                    description,
                    location,
                    timestamp: Date.now()
                }))
            });

            const signedTxn = txn.signTxn(organizerAccount.sk);
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
            
            const result = await algosdk.waitForConfirmation(this.algodClient, txId, 4);
            
            // Extract contribution ID from logs (simplified)
            const contributionId = Date.now() % 10000; // Simplified for hackathon

            return { txId, contributionId };
        } catch (error) {
            console.error('Failed to log contribution:', error);
            return null;
        }
    }

    /**
     * Get volunteer statistics
     */
    async getVolunteerStats(volunteerAddress: string): Promise<{
        contributions: number;
        reputation: number;
        lastContribution: number;
    }> {
        try {
            const accountInfo = await this.algodClient.accountApplicationInformation(volunteerAddress, this.appId).do();
            const localState = accountInfo['app-local-state']['key-value'];
            
            let contributions = 0;
            let reputation = 0;
            let lastContribution = 0;

            for (const kv of localState) {
                const key = atob(kv.key);
                if (key === 'volunteer_contributions') contributions = kv.value.uint;
                if (key === 'volunteer_reputation') reputation = kv.value.uint;
                if (key === 'last_contribution_time') lastContribution = kv.value.uint;
            }

            return { contributions, reputation, lastContribution };
        } catch (error) {
            console.error('Failed to get volunteer stats:', error);
            return { contributions: 0, reputation: 0, lastContribution: 0 };
        }
    }

    /**
     * Opt into the contract
     */
    async optIn(account: algosdk.Account): Promise<string | null> {
        try {
            const suggestedParams = await this.algodClient.getTransactionParams().do();
            
            const txn = algosdk.makeApplicationOptInTxnFromObject({
                from: account.addr,
                suggestedParams,
                appIndex: this.appId,
            });

            const signedTxn = txn.signTxn(account.sk);
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
            
            await algosdk.waitForConfirmation(this.algodClient, txId, 4);
            return txId;
        } catch (error) {
            console.error('Failed to opt in:', error);
            return null;
        }
    }

    /**
     * Bulk log contributions (for efficiency)
     */
    async bulkLogContributions(
        organizerAccount: algosdk.Account,
        contributions: Array<{
            volunteer: string;
            type: string;
            hours: number;
            description: string;
        }>
    ): Promise<string | null> {
        if (contributions.length > 10) {
            throw new Error('Maximum 10 contributions per bulk operation');
        }

        try {
            const suggestedParams = await this.algodClient.getTransactionParams().do();
            
            // Prepare arguments
            const volunteers = contributions.map(c => algosdk.decodeAddress(c.volunteer).publicKey);
            const types = contributions.map(c => new TextEncoder().encode(c.type));
            const hours = contributions.map(c => algosdk.encodeUint64(c.hours));
            const descriptions = contributions.map(c => new TextEncoder().encode(c.description));

            const appArgs = [
                new TextEncoder().encode('bulkLogContributions'),
                ...volunteers,
                ...types,
                ...hours,
                ...descriptions
            ];

            const txn = algosdk.makeApplicationNoOpTxnFromObject({
                from: organizerAccount.addr,
                suggestedParams,
                appIndex: this.appId,
                appArgs,
                accounts: contributions.map(c => c.volunteer),
                note: new TextEncoder().encode(JSON.stringify({
                    type: 'bulk_contribution',
                    count: contributions.length,
                    timestamp: Date.now()
                }))
            });

            const signedTxn = txn.signTxn(organizerAccount.sk);
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
            
            await algosdk.waitForConfirmation(this.algodClient, txId, 4);
            return txId;
        } catch (error) {
            console.error('Failed to bulk log contributions:', error);
            return null;
        }
    }
}

/**
 * Main AlgoVerse Client that combines both contracts
 */
export class AlgoVerseClient {
    public organizerRegistry: OrganizerRegistryClient;
    public contributionLogger: ContributionLoggerClient;
    private algodClient: algosdk.Algodv2;

    constructor(
        apiKey: string,
        organizerRegistryAppId: number,
        contributionLoggerAppId: number,
        testNet: boolean = true
    ) {
        // Initialize Algod client
        const baseUrl = testNet 
            ? 'https://testnet-algorand.api.purestake.io/ps2'
            : 'https://mainnet-algorand.api.purestake.io/ps2';

        this.algodClient = new algosdk.Algodv2(
            { "X-API-Key": apiKey },
            baseUrl,
            ""
        );

        // Initialize contract clients
        this.organizerRegistry = new OrganizerRegistryClient(this.algodClient, organizerRegistryAppId);
        this.contributionLogger = new ContributionLoggerClient(this.algodClient, contributionLoggerAppId);
    }

    /**
     * Create account from mnemonic
     */
    createAccountFromMnemonic(mnemonic: string): algosdk.Account {
        return algosdk.mnemonicToSecretKey(mnemonic);
    }

    /**
     * Get account info
     */
    async getAccountInfo(address: string): Promise<any> {
        try {
            return await this.algodClient.accountInformation(address).do();
        } catch (error) {
            console.error('Failed to get account info:', error);
            return null;
        }
    }

    /**
     * Get transaction info
     */
    async getTransaction(txId: string): Promise<any> {
        try {
            const pendingInfo = await this.algodClient.pendingTransactionInformation(txId).do();
            return pendingInfo;
        } catch (error) {
            console.error('Failed to get transaction info:', error);
            return null;
        }
    }
}

export default AlgoVerseClient;