"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Network } from "./sui-client";

interface WalletContextType {
  address: string | null;
  network: Network;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  setNetwork: (network: Network) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetworkState] = useState<Network>("mainnet");
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      // 模拟钱包连接，在实际应用中这里会调用真实的钱包API
      // 例如 @mysten/wallet-kit
      const mockAddress = "0x1234567890abcdef1234567890abcdef12345678";
      setAddress(mockAddress);
      setIsConnected(true);

      // 在真实应用中，这里会是：
      // const { account } = await wallet.connect()
      // setAddress(account.address)
      // setIsConnected(true)
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  const setNetwork = (newNetwork: Network) => {
    setNetworkState(newNetwork);
  };

  const value = {
    address,
    network,
    isConnected,
    connect,
    disconnect,
    setNetwork,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
