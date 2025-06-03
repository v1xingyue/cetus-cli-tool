# Cetus CLI Tool

A command-line interface tool for interacting with the Cetus Protocol on the Sui blockchain. This tool provides functionality for token management, pool operations, liquidity management, and various blockchain interactions.

## Features

- 🔧 **Token Management**: Create, mint, and manage tokens
- 🏊 **Pool Operations**: Create and list Cetus protocol pools
- 💰 **Wallet Integration**: Built-in wallet management and balance checking
- 🌐 **Multi-Network Support**: Works with mainnet, testnet, and devnet
- 📦 **Package Management**: Deploy and freeze Move packages
- 🔄 **Swap Operations**: Execute token swaps through Cetus pools
- 📊 **Position Management**: View and manage liquidity positions

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

### Install Dependencies

```bash
# Using npm
npm install

# Using pnpm
pnpm install
```

### Build the Project

```bash
npm run build
# or
pnpm run build
```

### Install Globally (Optional)

After building, you can install the CLI tool globally:

```bash
npm install -g .
```

## Quick Start

### 1. Initialize the CLI Tool

First, initialize the tool with your preferred network:

```bash
# Initialize with mainnet (default)
cetus-cli-tool init

# Initialize with testnet
cetus-cli-tool init --network testnet

# Initialize with devnet
cetus-cli-tool init --network devnet
```

This will:
- Generate a new wallet if one doesn't exist
- Set up the network configuration
- Display your wallet address and cluster URL

### 2. Check Your Setup

```bash
cetus-cli-tool info
```

This displays:
- Current network
- Cluster URL
- Wallet address
- Account balances

## Available Commands

### General Commands

#### `hello`
Simple test command to verify the tool is working:
```bash
cetus-cli-tool hello
```

#### `init [options]`
Initialize the CLI tool with network configuration:
```bash
cetus-cli-tool init --network mainnet
```

**Options:**
- `-n, --network`: Network to use (mainnet, testnet, devnet) - default: mainnet

#### `info`
Display current configuration and wallet information:
```bash
cetus-cli-tool info
```

#### `config-set`
Update configuration settings interactively:
```bash
cetus-cli-tool config-set
```

### Token Management

#### `create-token [options]`
Create a new token on the Sui blockchain:
```bash
cetus-cli-tool create-token --name "MyToken" --symbol "MTK" --decimal 9 --description "My custom token"
```

**Options:**
- `-n, --name`: Token name (default: "x")
- `-s, --symbol`: Token symbol (default: "X")
- `-d, --decimal`: Token decimals (choices: 6-18, default: 9)
- `--description`: Token description (default: "No description")

#### `tokens`
List and manage your created tokens:
```bash
cetus-cli-tool tokens
```

#### `mint`
Mint tokens to an address (interactive command):
```bash
cetus-cli-tool mint
```

### Package Management

#### `freeze-package`
Freeze a Move package to prevent further upgrades:
```bash
cetus-cli-tool freeze-package
```

### Utility Commands

#### `compare`
Compare different values or states:
```bash
cetus-cli-tool compare
```

## Cetus Protocol Commands

All Cetus-specific commands are under the `cetus` subcommand:

### Basic Cetus Commands

#### `cetus hello`
Test Cetus integration:
```bash
cetus-cli-tool cetus hello
```

#### `cetus info`
Display Cetus protocol information:
```bash
cetus-cli-tool cetus info
```

### Pool Management

#### `cetus list-pool [options]`
List pools for specific coin pairs:
```bash
# List pools for SUI/USDC (default)
cetus-cli-tool cetus list-pool

# List pools for custom coin pairs
cetus-cli-tool cetus list-pool --coins 0x2::sui::SUI 0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN
```

**Options:**
- `--coins`: Array of coin types to query (minimum 2 required)

#### `cetus create-pool`
Create a new liquidity pool (interactive command):
```bash
cetus-cli-tool cetus create-pool
```

### Position Management

#### `cetus positions [options]`
List liquidity positions by owner:
```bash
# List your own positions
cetus-cli-tool cetus positions

# List positions for a specific owner
cetus-cli-tool cetus positions --owner 0x1234...

# Show detailed position information
cetus-cli-tool cetus positions --width
```

**Options:**
- `--owner`: Owner address (default: your wallet address)
- `--width`: Show detailed position information (default: false)

### Swap Operations

#### `cetus swap [options]`
Execute token swaps through Cetus pools:
```bash
# Swap 0.1 token A for token B with 5% slippage
cetus-cli-tool cetus swap --pool-address 0x1234... --amount 0.1 --a2b true --slippage 5

# Swap 1.0 token B for token A with 3% slippage
cetus-cli-tool cetus swap --pool-address 0x1234... --amount 1.0 --a2b false --slippage 3
```

**Options:**
- `--pool-address`: Pool address (required)
- `--amount`: Amount to swap in human-readable format (default: "0.1")
- `--a2b`: Swap direction - true for A to B, false for B to A (default: true)
- `--slippage`: Slippage tolerance in percentage (default: 5)

## Configuration

The tool stores configuration in a local cache file (`.cache.json`) which includes:
- Network settings
- Wallet keypair
- Runtime configuration

## Environment Variables

You can use a `.env` file to set environment variables. Create a `.env` file in the project root:

```env
# Example environment variables
SUI_NETWORK=mainnet
# Add other configuration as needed
```

## Development

### Project Structure

```
src/
├── cli.ts              # Main CLI entry point
├── commands/           # Command implementations
│   ├── cetus/         # Cetus protocol commands
│   │   ├── hello.ts   # Test Cetus integration
│   │   ├── info.ts    # Cetus protocol info
│   │   ├── list-pool.ts # List pools
│   │   ├── create-pool.ts # Create pools
│   │   ├── positions.ts # Manage positions
│   │   └── swap.ts    # Execute swaps
│   ├── create-token.ts # Token creation
│   ├── tokens.ts      # Token management
│   ├── mint.ts        # Token minting
│   ├── init.ts        # CLI initialization
│   ├── info.ts        # System information
│   ├── config-set.ts  # Configuration
│   ├── freeze-package.ts # Package freezing
│   ├── compare.ts     # Utility comparisons
│   └── hello.ts       # Test command
├── utils.ts           # Utility functions
├── runtime.ts         # Runtime configuration
├── cetus_tool.ts      # Cetus SDK integration
└── common.ts          # Common types and constants
```

### Building

```bash
# Build TypeScript to JavaScript
npm run build

# Build Move package bytecode
npm run build:tx_json

# Development mode with hot reload
npm run dev
```

### Adding New Commands

1. Create a new command file in `src/commands/` or `src/commands/cetus/`
2. Implement the `CommandModule` interface from yargs
3. Export the command in the appropriate `index.ts` file

## Command Help

For any command, use the `--help` flag to see detailed usage information:
```bash
cetus-cli-tool --help
cetus-cli-tool init --help
cetus-cli-tool create-token --help
cetus-cli-tool cetus --help
cetus-cli-tool cetus swap --help
cetus-cli-tool cetus positions --help
```

## Troubleshooting

### Common Issues

1. **"load failed, please run init first!!"**
   - Run `cetus-cli-tool init` to initialize the tool

2. **Network connection issues**
   - Check your internet connection
   - Verify the network is accessible
   - Try switching networks with `init --network <network>`

3. **Insufficient balance**
   - Ensure your wallet has enough SUI for gas fees
   - Check balance with `cetus-cli-tool info`

4. **Pool not found errors**
   - Verify the pool address is correct
   - Ensure you're on the correct network
   - Check if the pool exists using `cetus list-pool`

5. **Swap failures**
   - Check if you have sufficient token balance
   - Verify slippage tolerance is appropriate
   - Ensure the pool has enough liquidity

### Getting Help

For any command, use the `--help` flag:
```bash
cetus-cli-tool --help
cetus-cli-tool init --help
cetus-cli-tool cetus list-pool --help
```

## Examples

### Complete Workflow Example

```bash
# 1. Initialize the tool
cetus-cli-tool init --network testnet

# 2. Check your setup
cetus-cli-tool info

# 3. Create a custom token
cetus-cli-tool create-token --name "MyToken" --symbol "MTK" --decimal 9

# 4. List available pools
cetus-cli-tool cetus list-pool

# 5. Check your positions
cetus-cli-tool cetus positions

# 6. Execute a swap
cetus-cli-tool cetus swap --pool-address 0x... --amount 0.1 --a2b true --slippage 5
```

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

For more information about the Cetus Protocol, visit [Cetus Protocol Documentation](https://cetus-1.gitbook.io/cetus-docs). 