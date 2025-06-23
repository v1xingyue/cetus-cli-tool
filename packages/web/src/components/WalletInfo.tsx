"use client";

import { useWallet } from "@/lib/wallet-context";

export function WalletInfo() {
  const { address, isConnected, connect, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {isConnected ? "Wallet Connected" : "Wallet Disconnected"}
          </p>
          {address && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatAddress(address)}
            </p>
          )}
        </div>
        <button
          onClick={isConnected ? disconnect : connect}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            isConnected
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}
