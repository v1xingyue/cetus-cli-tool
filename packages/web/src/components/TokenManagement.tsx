"use client";

import { useState } from "react";
import { useWallet } from "@/lib/wallet-context";
import { TokenOperations, CreateTokenParams } from "@/lib/token-operations";
import { Transaction } from "@mysten/sui/transactions";

interface TokenManagementProps {
  network: string;
}

interface CreatedToken {
  name: string;
  symbol: string;
  decimals: number;
  treasuryCapId: string;
  coinType: string;
  transactionLink: string;
  createdAt: string;
}

export function TokenManagement({ network }: TokenManagementProps) {
  const { address, isConnected } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [createdTokens, setCreatedTokens] = useState<CreatedToken[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    decimals: 9,
    description: "",
    iconUrl: "",
  });

  // 模拟签名和执行交易的函数
  const mockSignAndExecute = async (tx: Transaction) => {
    // 在真实应用中，这里会调用钱包的signAndExecuteTransaction方法
    console.log("Transaction to sign:", tx);
    return {
      digest: "mock_digest_" + Date.now(),
    };
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!formData.name || !formData.symbol) {
      alert("Please fill in token name and symbol");
      return;
    }

    setIsCreating(true);

    try {
      const tokenOps = new TokenOperations(network as any);
      const params: CreateTokenParams = {
        name: formData.name,
        symbol: formData.symbol,
        decimals: formData.decimals,
        description: formData.description || "No description",
        iconUrl: formData.iconUrl,
      };

      const result = await tokenOps.createToken(
        params,
        address,
        mockSignAndExecute
      );

      if (result.success) {
        // 添加到已创建代币列表
        const newToken: CreatedToken = {
          name: params.name,
          symbol: params.symbol,
          decimals: params.decimals,
          treasuryCapId: result.treasuryCapId!,
          coinType: `${result.packageId}::token::TOKEN`,
          transactionLink: result.transactionLink!,
          createdAt: new Date().toISOString(),
        };

        setCreatedTokens((prev) => [newToken, ...prev]);

        // 重置表单
        setFormData({
          name: "",
          symbol: "",
          decimals: 9,
          description: "",
          iconUrl: "",
        });

        alert(`Token "${params.name}" created successfully!`);
      } else {
        alert(`Token creation failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Token creation error:", error);
      alert("Token creation failed");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "decimals" ? parseInt(value) : value,
    }));
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        🪙 Token Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Token Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Create New Token
          </h3>
          <form onSubmit={handleCreateToken} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Token Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="MyToken"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Symbol
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                placeholder="MTK"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Token description (optional)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Decimals
              </label>
              <select
                name="decimals"
                value={formData.decimals}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((dec) => (
                  <option key={dec} value={dec}>
                    {dec}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isCreating || !isConnected}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isCreating ? "Creating..." : "Create Token"}
            </button>
            {!isConnected && (
              <p className="text-sm text-orange-600 text-center">
                Please connect your wallet to create tokens
              </p>
            )}
          </form>
        </div>

        {/* Token List Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Your Tokens ({createdTokens.length})
          </h3>
          <div className="space-y-3">
            {createdTokens.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No tokens created yet</p>
                <p className="text-sm mt-1">Create your first token above</p>
              </div>
            ) : (
              createdTokens.map((token, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-600 p-3 rounded border"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {token.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {token.symbol} • {token.decimals} decimals
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Created:{" "}
                        {new Date(token.createdAt).toLocaleDateString()}
                      </p>
                      <a
                        href={token.transactionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        View Transaction
                      </a>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() =>
                          alert(`Mint feature coming soon for ${token.symbol}`)
                        }
                      >
                        Mint
                      </button>
                      <button
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(token.treasuryCapId);
                          alert("Treasury Cap ID copied to clipboard");
                        }}
                      >
                        Copy ID
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        Active Network:{" "}
        <span className="font-medium text-blue-600">{network}</span>
      </div>
    </div>
  );
}
