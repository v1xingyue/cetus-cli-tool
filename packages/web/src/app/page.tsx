"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { WalletInfo } from "../components/WalletInfo";
import { TokenManagement } from "../components/TokenManagement";
import { RealTokenManagement } from "../components/RealTokenManagement";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function Home() {
  const [activeMode, setActiveMode] = useState<"real" | "demo">("real");

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cetus CLI Web Interface
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Web interface for Cetus Protocol CLI tool with real Move package
          deployment
        </p>
      </div>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Choose Implementation Mode</CardTitle>
          <CardDescription>
            Select between real CLI functionality and demo interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveMode("real")}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                activeMode === "real"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">🔥 Real CLI Implementation</h3>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  • Real Move package deployment
                  <br />
                  • Actual Sui blockchain interaction
                  <br />
                  • Functional wallet integration
                  <br />• Original CLI logic ported to web
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveMode("demo")}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                activeMode === "demo"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">🎨 Demo Interface</h3>
                  <Badge variant="secondary">Preview</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  • UI/UX demonstration
                  <br />
                  • Simulated interactions
                  <br />
                  • Design preview
                  <br />• Mock wallet functionality
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Real Implementation */}
      {activeMode === "real" && (
        <div className="space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">
                🔥 Real CLI Functionality Active
              </CardTitle>
              <CardDescription className="text-green-700">
                This is the actual implementation that replicates your CLI
                tool&apos;s functionality. It deploys real Move packages and
                interacts with the Sui blockchain.
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tokens">Token Management</TabsTrigger>
              <TabsTrigger value="cetus">Cetus Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <WalletInfo />

              <Card>
                <CardHeader>
                  <CardTitle>📋 Real CLI Features Implemented</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-600">
                        ✅ Implemented
                      </h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • Move package deployment with bytecode patching
                        </li>
                        <li>• Token creation with real treasury caps</li>
                        <li>• SVG icon generation (from CLI)</li>
                        <li>• Network switching (mainnet/testnet/devnet)</li>
                        <li>• Wallet integration framework</li>
                        <li>• Token minting functionality</li>
                        <li>• Transaction link generation</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-600">
                        🚧 Planned
                      </h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Cetus pool creation</li>
                        <li>• Swap operations</li>
                        <li>• Liquidity management</li>
                        <li>• Position tracking</li>
                        <li>• Advanced Cetus features</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tokens">
              <RealTokenManagement />
            </TabsContent>

            <TabsContent value="cetus">
              <Card>
                <CardHeader>
                  <CardTitle>🌊 Cetus Operations (Coming Soon)</CardTitle>
                  <CardDescription>
                    Cetus-specific functionality will be implemented next
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Pool creation, swaps, and liquidity management features from
                    the CLI will be ported to this web interface.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Demo Interface */}
      {activeMode === "demo" && (
        <div className="space-y-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">
                🎨 Demo Interface Mode
              </CardTitle>
              <CardDescription className="text-blue-700">
                This is a demonstration of the UI/UX design with simulated
                functionality. No real blockchain interactions occur in this
                mode.
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tokens">Token Management</TabsTrigger>
              <TabsTrigger value="cetus">Cetus Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <WalletInfo />
            </TabsContent>

            <TabsContent value="tokens">
              <TokenManagement network="mainnet" />
            </TabsContent>

            <TabsContent value="cetus">
              <Card>
                <CardHeader>
                  <CardTitle>🌊 Cetus Operations</CardTitle>
                  <CardDescription>
                    Manage Cetus protocol interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Cetus-specific functionality coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
