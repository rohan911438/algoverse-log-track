 import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";

const WalletMenu: React.FC = () => {
  const { 
    address, 
    connect, 
    disconnect, 
    connecting, 
    qrDataUrl, 
    showQR, 
    setShowQR 
  } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        {address ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
              <Wallet className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400 font-mono">
                {formatAddress(address)}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={disconnect}
              className="text-gray-400 border-gray-600 hover:bg-gray-700"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button 
            onClick={connect} 
            disabled={connecting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2"
          >
            {connecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Pera Wallet
              </>
            )}
          </Button>
        )}
      </div>

      {/* Simple QR Display - no modal */}
      {showQR && qrDataUrl && (
        <div className="flex flex-col items-center space-y-4 p-6 bg-gray-800 border border-gray-600 rounded-lg">
          <h3 className="text-white font-semibold">Scan with Pera Wallet</h3>
          <div className="bg-white p-4 rounded-lg">
            <img 
              src={qrDataUrl} 
              alt="Pera Wallet QR Code" 
              className="w-48 h-48"
            />
          </div>
          <p className="text-gray-300 text-sm text-center max-w-xs">
            Open Pera Wallet on your phone and scan this QR code
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowQR(false)}
            className="text-gray-400 border-gray-600 hover:bg-gray-700"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalletMenu;