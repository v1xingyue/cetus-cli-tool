"use client";

interface CetusOperationsProps {
  network: string;
}

export function CetusOperations({ network }: CetusOperationsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        🌊 Cetus Operations
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pool Operations */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              💧 Pool Operations
            </h3>
            <div className="space-y-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
                List Pools
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
                Create Pool
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
                Add Liquidity
              </button>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
                Remove Liquidity
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              🔄 Swap Operations
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  From Token
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <option>SUI</option>
                  <option>USDC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  To Token
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <option>USDC</option>
                  <option>SUI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Execute Swap
              </button>
            </div>
          </div>
        </div>

        {/* Position Management */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              📊 Position Management
            </h3>
            <div className="space-y-4">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
                View Positions
              </button>
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
                Close Position
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              💰 Active Positions
            </h3>
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-600 p-3 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    SUI/USDC
                  </span>
                  <span className="text-green-600 font-semibold">+$24.50</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Range: $0.85 - $1.25</p>
                  <p>Liquidity: $1,250.00</p>
                </div>
              </div>
            </div>
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
