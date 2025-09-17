import React, { createContext, useContext, useEffect, useState } from "react";

type WalletContextType = {
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  connecting: boolean;
  qrDataUrl: string | null;
  showQR: boolean;
  setShowQR: (show: boolean) => void;
  error: string | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing wallet connection
    const savedAddress = localStorage.getItem("pera-wallet-address");
    if (savedAddress) {
      console.log("Restored wallet connection:", savedAddress);
      setAddress(savedAddress);
    }
  }, []);

  const connect = async () => {
    setConnecting(true);
    setError(null);
    setQrDataUrl(null);
    setShowQR(false);
    
    try {
      console.log("Attempting wallet connection...");
      
      // For now, simulate a successful connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const demoAddress = "DEMO" + Math.random().toString(36).substring(2, 15).toUpperCase() + "WALLET";
      console.log("Connected to wallet:", demoAddress);
      
      setAddress(demoAddress);
      localStorage.setItem("pera-wallet-address", demoAddress);
      
    } catch (error: any) {
      console.error("Connection failed:", error);
      setError(`Connection failed: ${error.message || "Unknown error"}`);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      console.log("Disconnecting wallet...");
      setAddress(null);
      setShowQR(false);
      setQrDataUrl(null);
      setError(null);
      localStorage.removeItem("pera-wallet-address");
      console.log("Disconnected successfully");
    } catch (error: any) {
      console.error("Disconnect error:", error);
      setAddress(null);
      setShowQR(false);
      setQrDataUrl(null);
    }
  };

  return (
    <WalletContext.Provider value={{ 
      address, 
      connect, 
      disconnect, 
      connecting, 
      qrDataUrl, 
      showQR, 
      setShowQR, 
      error 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};