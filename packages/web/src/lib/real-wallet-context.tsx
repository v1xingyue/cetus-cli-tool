"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Transaction } from "@mysten/sui/transactions";
import { Network } from "./sui-client";

// 真实钱包接口 (模拟)
interface WalletAccount {
  address: string;
  publicKey: string;
}

interface WalletContextType {
  address: string | null;
  network: Network;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  setNetwork: (network: Network) => void;
  signAndExecuteTransaction: (tx: Transaction) => Promise<{ digest: string }>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// 模拟钱包适配器
class MockWalletAdapter {
  private account: WalletAccount | null = null;

  async connect(): Promise<WalletAccount> {
    // 模拟连接延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 生成模拟钱包地址
    const mockAddress =
      "0x" + Math.random().toString(16).substring(2, 42).padStart(40, "0");

    this.account = {
      address: mockAddress,
      publicKey: "mock_public_key",
    };

    return this.account;
  }

  disconnect(): void {
    this.account = null;
  }

  getAccount(): WalletAccount | null {
    return this.account;
  }

  async signAndExecuteTransaction(
    tx: Transaction
  ): Promise<{ digest: string }> {
    if (!this.account) {
      throw new Error("Wallet not connected");
    }

    // 模拟交易签名和执行
    console.log("Signing transaction:", tx);

    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 生成模拟交易哈希
    const digest = "0x" + Math.random().toString(16).substring(2, 66);

    console.log("Transaction executed with digest:", digest);

    return { digest };
  }
}

export function RealWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetworkState] = useState<Network>("mainnet");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet] = useState(new MockWalletAdapter());

  // 检查是否已经连接
  useEffect(() => {
    const account = wallet.getAccount();
    if (account) {
      setAddress(account.address);
      setIsConnected(true);
    }
  }, [wallet]);

  const connect = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      console.log("Connecting to wallet...");
      const account = await wallet.connect();
      setAddress(account.address);
      setIsConnected(true);
      console.log("Wallet connected:", account.address);

      // 在真实应用中，这里会调用实际的钱包连接
      // 例如：
      // import { useWallet } from '@mysten/wallet-kit'
      // const { connect } = useWallet()
      // await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    wallet.disconnect();
    setAddress(null);
    setIsConnected(false);
    console.log("Wallet disconnected");
  };

  const setNetwork = (newNetwork: Network) => {
    setNetworkState(newNetwork);
    console.log("Network changed to:", newNetwork);
  };

  const signAndExecuteTransaction = async (tx: Transaction) => {
    if (!isConnected) {
      throw new Error("Wallet not connected");
    }

    return await wallet.signAndExecuteTransaction(tx);
  };

  const value = {
    address,
    network,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    setNetwork,
    signAndExecuteTransaction,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useRealWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useRealWallet must be used within a RealWalletProvider");
  }
  return context;
}
