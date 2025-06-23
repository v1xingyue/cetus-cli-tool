"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader2, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import {
  RealTokenOperations,
  CreateTokenParams,
  TokenCreationResult,
} from "../lib/real-token-operations";
import { useRealWallet } from "../lib/real-wallet-context";

interface CreatedToken {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  packageId: string;
  treasuryCapId: string;
  coinType: string;
  digest: string;
  transactionLink: string;
  createdAt: Date;
}

export function RealTokenManagement() {
  const { address, isConnected, network, signAndExecuteTransaction } =
    useRealWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [createdTokens, setCreatedTokens] = useState<CreatedToken[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Token creation form state
  const [tokenForm, setTokenForm] = useState<CreateTokenParams>({
    name: "",
    symbol: "",
    decimals: 6,
    description: "",
    iconUrl: "",
  });

  // Mint form state
  const [mintForm, setMintForm] = useState({
    tokenId: "",
    amount: "",
    recipient: "",
    freeze: false,
  });

  const tokenOps = new RealTokenOperations(network);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    setIsCreating(true);

    try {
      console.log("Creating token with real CLI functionality...");

      const result: TokenCreationResult = await tokenOps.createToken(
        tokenForm,
        address,
        signAndExecuteTransaction
      );

      if (result.success) {
        console.log("Token created successfully:", result);

        // Add to created tokens list
        const newToken: CreatedToken = {
          id: result.digest!,
          name: tokenForm.name,
          symbol: tokenForm.symbol,
          decimals: tokenForm.decimals,
          packageId: result.packageId!,
          treasuryCapId: result.treasuryCapId!,
          coinType: result.coinType!,
          digest: result.digest!,
          transactionLink: result.transactionLink!,
          createdAt: new Date(),
        };

        setCreatedTokens((prev) => [newToken, ...prev]);

        // Reset form
        setTokenForm({
          name: "",
          symbol: "",
          decimals: 6,
          description: "",
          iconUrl: "",
        });

        alert(
          `Token "${tokenForm.symbol}" created successfully!\nTransaction: ${result.digest}`
        );
      } else {
        console.error("Token creation failed:", result.error);
        alert(`Token creation failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating token:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleMintToken = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    const selectedToken = createdTokens.find(
      (token) => token.id === mintForm.tokenId
    );
    if (!selectedToken) {
      alert("Please select a token to mint");
      return;
    }

    setIsMinting(true);

    try {
      console.log("Minting tokens with real functionality...");

      const result = await tokenOps.mintToken(
        selectedToken.treasuryCapId,
        selectedToken.coinType,
        mintForm.amount,
        mintForm.recipient || address,
        mintForm.freeze,
        signAndExecuteTransaction
      );

      if (result.success) {
        alert(
          `Successfully minted ${mintForm.amount} ${selectedToken.symbol} tokens!\nTransaction: ${result.digest}`
        );
        setMintForm({
          tokenId: "",
          amount: "",
          recipient: "",
          freeze: false,
        });
      } else {
        alert(`Minting failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsMinting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>🔗 Real Wallet Connection</CardTitle>
          <CardDescription>
            This uses real CLI functionality to create and manage tokens on Sui
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Connected: {formatAddress(address!)}</span>
              <span className="text-sm text-gray-500">({network})</span>
            </div>
          ) : (
            <div className="text-orange-600">
              ⚠️ Please connect your wallet to use real functionality
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Token Form */}
      <Card>
        <CardHeader>
          <CardTitle>🪙 Create New Token (Real Implementation)</CardTitle>
          <CardDescription>
            Deploy a real Move package and create a token on Sui blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateToken} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  value={tokenForm.name}
                  onChange={(e) =>
                    setTokenForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="My Token"
                  required
                />
              </div>
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={tokenForm.symbol}
                  onChange={(e) =>
                    setTokenForm((prev) => ({
                      ...prev,
                      symbol: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="MTK"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="decimals">Decimals</Label>
              <Input
                id="decimals"
                type="number"
                min="0"
                max="18"
                value={tokenForm.decimals}
                onChange={(e) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    decimals: parseInt(e.target.value) || 6,
                  }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={tokenForm.description}
                onChange={(e) =>
                  setTokenForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your token..."
                required
              />
            </div>

            <div>
              <Label htmlFor="iconUrl">Icon URL (optional)</Label>
              <Input
                id="iconUrl"
                value={tokenForm.iconUrl}
                onChange={(e) =>
                  setTokenForm((prev) => ({ ...prev, iconUrl: e.target.value }))
                }
                placeholder="https://example.com/icon.png"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to auto-generate an SVG icon
              </p>
            </div>

            <Button
              type="submit"
              disabled={!isConnected || isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Token (Publishing Move Package)...
                </>
              ) : (
                "Create Real Token"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Created Tokens List */}
      {createdTokens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🎉 Your Created Tokens</CardTitle>
            <CardDescription>
              Real tokens deployed on Sui blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {createdTokens.map((token) => (
                <div key={token.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {token.name} ({token.symbol})
                    </h3>
                    <span className="text-sm text-gray-500">
                      {token.decimals} decimals
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Package ID:</span>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        {formatAddress(token.packageId)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(token.packageId, `pkg-${token.id}`)
                        }
                      >
                        {copiedId === `pkg-${token.id}` ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Treasury:</span>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        {formatAddress(token.treasuryCapId)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            token.treasuryCapId,
                            `treasury-${token.id}`
                          )
                        }
                      >
                        {copiedId === `treasury-${token.id}` ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={token.transactionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      View Transaction <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      Created {token.createdAt.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mint Tokens Form */}
      {createdTokens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🔨 Mint Tokens (Real Implementation)</CardTitle>
            <CardDescription>
              Mint tokens from your created treasury caps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMintToken} className="space-y-4">
              <div>
                <Label htmlFor="tokenSelect">Select Token</Label>
                <select
                  id="tokenSelect"
                  value={mintForm.tokenId}
                  onChange={(e) =>
                    setMintForm((prev) => ({
                      ...prev,
                      tokenId: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a token to mint</option>
                  {createdTokens.map((token) => (
                    <option key={token.id} value={token.id}>
                      {token.name} ({token.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="amount">Amount to Mint</Label>
                <Input
                  id="amount"
                  type="number"
                  value={mintForm.amount}
                  onChange={(e) =>
                    setMintForm((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  placeholder="1000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="recipient">Recipient (optional)</Label>
                <Input
                  id="recipient"
                  value={mintForm.recipient}
                  onChange={(e) =>
                    setMintForm((prev) => ({
                      ...prev,
                      recipient: e.target.value,
                    }))
                  }
                  placeholder="Leave empty to mint to your wallet"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="freeze"
                  checked={mintForm.freeze}
                  onChange={(e) =>
                    setMintForm((prev) => ({
                      ...prev,
                      freeze: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor="freeze">
                  Freeze Treasury Cap after minting
                </Label>
              </div>

              <Button
                type="submit"
                disabled={!isConnected || isMinting || !mintForm.tokenId}
                className="w-full"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Minting Tokens...
                  </>
                ) : (
                  "Mint Real Tokens"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
