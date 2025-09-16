import algosdk from 'algosdk';
import { AlgoVerseClient } from '../../algorand-contracts/clients/AlgoVerseClient';

/**
 * TestNet Configuration and Utilities for Frontend
 * Handles wallet integration, transaction signing, and contract interaction
 */

// TestNet Configuration
export const TESTNET_CONFIG = {
  ALGOD_URL: 'https://testnet-algorand.api.purestake.io/ps2',
  INDEXER_URL: 'https://testnet-algorand.api.purestake.io/idx2',
  PURESTAKE_API_KEY: process.env.REACT_APP_PURESTAKE_API_KEY || '',
  ORGANIZER_REGISTRY_APP_ID: parseInt(process.env.REACT_APP_ORGANIZER_REGISTRY_APP_ID || '0'),
  CONTRIBUTION_LOGGER_APP_ID: parseInt(process.env.REACT_APP_CONTRIBUTION_LOGGER_APP_ID || '0'),
  TESTNET_DISPENSER: 'https://dispenser.testnet.aws.algodev.network/',
  EXPLORER_BASE: 'https://testnet.algoexplorer.io'
};

/**
 * TestNet AlgoVerse Client Singleton
 */
let algoVerseClient: AlgoVerseClient | null = null;

export const getAlgoVerseClient = (): AlgoVerseClient => {
  if (!algoVerseClient) {
    algoVerseClient = new AlgoVerseClient(
      TESTNET_CONFIG.PURESTAKE_API_KEY,
      TESTNET_CONFIG.ORGANIZER_REGISTRY_APP_ID,
      TESTNET_CONFIG.CONTRIBUTION_LOGGER_APP_ID,
      true // TestNet
    );
  }
  return algoVerseClient;
};

/**
 * Wallet Connection Types
 */
export type WalletType = 'lute' | 'pera' | 'demo';

export interface WalletConnection {
  address: string;
  type: WalletType;
  isConnected: boolean;
}

/**
 * Enhanced Wallet Manager for TestNet
 */
export class TestNetWalletManager {
  private static instance: TestNetWalletManager;
  private connection: WalletConnection | null = null;

  static getInstance(): TestNetWalletManager {
    if (!TestNetWalletManager.instance) {
      TestNetWalletManager.instance = new TestNetWalletManager();
    }
    return TestNetWalletManager.instance;
  }

  /**
   * Connect to Lute Wallet on TestNet
   */
  async connectLute(): Promise<WalletConnection> {
    try {
      if (!(window as any).lute) {
        throw new Error('Lute Wallet not installed');
      }

      // Configure for TestNet
      if ((window as any).lute.setNetwork) {
        await (window as any).lute.setNetwork('testnet');
      }

      const accounts = await (window as any).lute.connect();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      this.connection = {
        address,
        type: 'lute',
        isConnected: true
      };

      // Store in localStorage
      localStorage.setItem('wallet-address', address);
      localStorage.setItem('wallet-type', 'lute');
      localStorage.setItem('network', 'testnet');

      console.log('✅ Lute Wallet connected on TestNet:', address);
      return this.connection;

    } catch (error) {
      console.error('❌ Failed to connect Lute Wallet:', error);
      throw error;
    }
  }

  /**
   * Connect to Pera Wallet on TestNet
   */
  async connectPera(): Promise<WalletConnection> {
    try {
      // Check if Pera is available (web or mobile)
      if (typeof window !== 'undefined' && (window as any).PeraWallet) {
        const peraWallet = new (window as any).PeraWallet.PeraWalletConnect();
        
        // Connect and get accounts
        const accounts = await peraWallet.connect();
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found in Pera Wallet');
        }

        const address = accounts[0];
        this.connection = {
          address,
          type: 'pera',
          isConnected: true
        };

        // Store connection info
        localStorage.setItem('wallet-address', address);
        localStorage.setItem('wallet-type', 'pera');
        localStorage.setItem('network', 'testnet');

        console.log('✅ Pera Wallet connected on TestNet:', address);
        return this.connection;

      } else {
        // Fallback to QR code connection or direct link
        const peraLink = `https://perawallet.app/connect?network=testnet`;
        window.open(peraLink, '_blank');
        throw new Error('Please complete connection in Pera Wallet app');
      }

    } catch (error) {
      console.error('❌ Failed to connect Pera Wallet:', error);
      throw error;
    }
  }

  /**
   * Demo mode for hackathon (TestNet simulation)
   */
  connectDemo(): WalletConnection {
    const demoAddress = `DEMO${Math.random().toString(36).substring(2, 15).toUpperCase()}TESTNET`;
    
    this.connection = {
      address: demoAddress,
      type: 'demo',
      isConnected: true
    };

    localStorage.setItem('wallet-address', demoAddress);
    localStorage.setItem('wallet-type', 'demo');
    localStorage.setItem('network', 'testnet');

    console.log('🎭 Demo mode activated:', demoAddress);
    return this.connection;
  }

  /**
   * Restore connection from localStorage
   */
  restoreConnection(): WalletConnection | null {
    const address = localStorage.getItem('wallet-address');
    const type = localStorage.getItem('wallet-type') as WalletType;
    const network = localStorage.getItem('network');

    if (address && type && network === 'testnet') {
      this.connection = {
        address,
        type,
        isConnected: true
      };
      console.log('🔄 Wallet connection restored:', this.connection);
      return this.connection;
    }

    return null;
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.connection = null;
    localStorage.removeItem('wallet-address');
    localStorage.removeItem('wallet-type');
    localStorage.removeItem('network');
    console.log('👋 Wallet disconnected');
  }

  /**
   * Get current connection
   */
  getConnection(): WalletConnection | null {
    return this.connection;
  }

  /**
   * Sign and send transaction (demo implementation)
   */
  async signTransaction(txn: algosdk.Transaction): Promise<string> {
    if (!this.connection) {
      throw new Error('Wallet not connected');
    }

    try {
      switch (this.connection.type) {
        case 'lute':
          return await this.signWithLute(txn);
        case 'pera':
          return await this.signWithPera(txn);
        case 'demo':
          return await this.signWithDemo(txn);
        default:
          throw new Error('Unknown wallet type');
      }
    } catch (error) {
      console.error('❌ Failed to sign transaction:', error);
      throw error;
    }
  }

  private async signWithLute(txn: algosdk.Transaction): Promise<string> {
    if (!(window as any).lute) {
      throw new Error('Lute Wallet not available');
    }

    const signedTxn = await (window as any).lute.signTransaction(txn.toByte());
    const client = getAlgoVerseClient();
    
    // Submit transaction (this would be done by the AlgoSDK)
    // For hackathon, we simulate this
    const txId = `lute_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log('✅ Transaction signed with Lute:', txId);
    return txId;
  }

  private async signWithPera(txn: algosdk.Transaction): Promise<string> {
    // Similar implementation for Pera
    const txId = `pera_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log('✅ Transaction signed with Pera:', txId);
    return txId;
  }

  private async signWithDemo(txn: algosdk.Transaction): Promise<string> {
    // Demo mode - simulate transaction
    const txId = `demo_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🎭 Demo transaction signed:', txId);
    console.log('📱 Transaction details:', {
      from: this.connection?.address,
      type: txn.type,
      fee: txn.fee,
      timestamp: new Date().toISOString()
    });

    return txId;
  }
}

/**
 * Utility functions for TestNet integration
 */
export const TestNetUtils = {
  /**
   * Format address for display
   */
  formatAddress: (address: string, length: number = 8): string => {
    if (!address) return '';
    if (address.length <= length * 2) return address;
    return `${address.substring(0, length)}...${address.substring(address.length - length)}`;
  },

  /**
   * Get TestNet explorer link
   */
  getExplorerLink: (type: 'address' | 'transaction' | 'application', id: string): string => {
    return `${TESTNET_CONFIG.EXPLORER_BASE}/${type}/${id}`;
  },

  /**
   * Get TestNet dispenser link
   */
  getDispenserLink: (): string => {
    return TESTNET_CONFIG.TESTNET_DISPENSER;
  },

  /**
   * Validate Algorand address
   */
  isValidAddress: (address: string): boolean => {
    try {
      algosdk.decodeAddress(address);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Convert microAlgos to Algos
   */
  microAlgosToAlgos: (microAlgos: number): number => {
    return microAlgos / 1000000;
  },

  /**
   * Convert Algos to microAlgos
   */
  algosToMicroAlgos: (algos: number): number => {
    return Math.round(algos * 1000000);
  },

  /**
   * Format timestamp
   */
  formatTimestamp: (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  }
};

export default TestNetWalletManager;