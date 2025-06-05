# Cetus CLI Tool

A command-line interface tool for interacting with the Cetus Protocol on the Sui blockchain. This tool provides functionality for token management, liquidity pool operations, liquidity management, and various blockchain interactions.

## 🌟 Main Features

- 🔧 **Token Management**: Create, mint, and manage custom tokens
- 🏊 **Liquidity Pool Operations**: Create, query, and manage Cetus protocol liquidity pools
- 💰 **Wallet Integration**: Built-in wallet management and balance checking
- 🌐 **Multi-Network Support**: Supports mainnet, testnet, and devnet
- 📦 **Smart Contract Management**: Deploy and freeze Move smart contract packages
- 🔄 **Token Swapping**: Execute token swaps through Cetus liquidity pools
- 📊 **Liquidity Position Management**: View and manage liquidity positions
- ➕ **Liquidity Management**: Add and remove liquidity
- 🎯 **Position Operations**: Create and close liquidity positions
- 🔒 **Security Features**: Package freezing and token minting control

## Installation

### System Requirements

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

### Global Installation (Optional)

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

## 📋 All Available Commands

### 🔧 Basic Commands

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

#### `compare`
Compare different values or states:
```bash
cetus-cli-tool compare
```

### 🪙 Token Management

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
- `--icon`: Token icon URL or base64 encoded (default: auto-generated)

#### `tokens`
List and manage your created tokens:
```bash
cetus-cli-tool tokens
```

#### `mint [options]`
Mint tokens to a specified address:
```bash
cetus-cli-tool mint --package 0x123... --amount 100 --recipient 0xabc...
```

**Options:**
- `-p, --package`: Token package ID (required)
- `-r, --recipient`: Recipient address (default: current wallet address)
- `-a, --amount`: Amount to mint in human-readable format (default: 1)
- `-f, --freeze`: Freeze TreasuryCap after minting (default: false)

### 📦 Smart Contract Package Management

#### `freeze-package`
Freeze a Move smart contract package to prevent further upgrades:
```bash
cetus-cli-tool freeze-package
```

## 🏊 Cetus Protocol Commands

All Cetus-specific commands are under the `cetus` subcommand:

### 🔍 Basic Cetus Commands

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

### 🏊‍♂️ Liquidity Pool Management

#### `cetus list-pool [options]`
List liquidity pools for specific coin pairs:
```bash
# List SUI/USDC pools (default)
cetus-cli-tool cetus list-pool

# List pools for custom coin pairs
cetus-cli-tool cetus list-pool --coins 0x2::sui::SUI 0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN
```

**Options:**
- `--coins`: Array of coin types to query (minimum 2 required)

#### `cetus create-pool [options]`
Create a new liquidity pool:
```bash
cetus-cli-tool cetus create-pool --coin-a 0x2::sui::SUI --coin-b 0x123::token::TOKEN --init-price 1.5 --amount-a 10
```

**Options:**
- `--coin-a`: Coin A type or alias (required)
- `--coin-b`: Coin B type or alias (default: "sui")
- `--init-price`: Initial price of coin A (default: 1)
- `--amount-a`: Amount of coin A in human-readable format (default: "0.1")

### 📊 Liquidity Position Management

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

### ➕ Liquidity Operations

#### `cetus add-liquidity [options]`
Add liquidity to existing positions or create new positions:
```bash
# Create new position and add liquidity
cetus-cli-tool cetus add-liquidity --pool 0x123... --amount 1.0

# Add liquidity to existing position
cetus-cli-tool cetus add-liquidity --pool 0x123... --amount 1.0 --position 0xabc...
```

**Options:**
- `--pool`: Liquidity pool address (required)
- `--amount`: Amount of coin A in human-readable format (required)
- `--position`: Position ID (optional, creates new position if not provided)

#### `cetus remove-liquidity [options]`
Remove liquidity from a position:
```bash
cetus-cli-tool cetus remove-liquidity --position 0xabc... --liquidity 1000000
```

**Options:**
- `--position`: Position object ID (required)
- `--liquidity`: Amount of liquidity to remove (required)

#### `cetus close-position [options]`
Completely close a liquidity position:
```bash
cetus-cli-tool cetus close-position --position 0xabc...
```

**Options:**
- `--position`: Position ID (required)

### 🔄 Token Swap Operations

#### `cetus swap [options]`
Execute token swaps through Cetus liquidity pools:
```bash
# Swap 0.1 token A for token B with 5% slippage
cetus-cli-tool cetus swap --pool-address 0x1234... --amount 0.1 --a2b true --slippage 5

# Swap 1.0 token B for token A with 3% slippage
cetus-cli-tool cetus swap --pool-address 0x1234... --amount 1.0 --b2a true --slippage 3
```

**Options:**
- `--pool-address`: Liquidity pool address (required)
- `--amount`: Amount to swap in human-readable format (default: "0.1")
- `--a2b`: Swap direction - true for A to B (default: true)
- `--b2a`: Swap direction - true for B to A (default: false)
- `--slippage`: Slippage tolerance percentage (default: 5)

## ⚙️ Configuration

The tool stores configuration in a local cache file (`.cache.json`) which includes:
- Network settings
- Wallet keypair
- Runtime configuration

## 🌐 Environment Variables

You can use a `.env` file to set environment variables. Create a `.env` file in the project root:

```env
# Example environment variables
SUI_NETWORK=mainnet
# Add other configuration as needed
```

## 🚀 Development Guide

### Project Structure

```
src/
├── cli.ts              # Main CLI entry point
├── commands/           # Command implementations
│   ├── cetus/         # Cetus protocol commands
│   │   ├── hello.ts   # Test Cetus integration
│   │   ├── info.ts    # Cetus protocol info
│   │   ├── list-pool.ts # List liquidity pools
│   │   ├── create-pool.ts # Create liquidity pools
│   │   ├── positions.ts # Manage positions
│   │   ├── add-liquidity.ts # Add liquidity
│   │   ├── remove-liquidity.ts # Remove liquidity
│   │   ├── close-position.ts # Close positions
│   │   └── swap.ts    # Execute swaps
│   ├── create-token.ts # Token creation
│   ├── tokens.ts      # Token management
│   ├── mint.ts        # Token minting
│   ├── init.ts        # CLI initialization
│   ├── info.ts        # System information
│   ├── config-set.ts  # Configuration management
│   ├── freeze-package.ts # Package freezing
│   ├── compare.ts     # Utility comparisons
│   └── hello.ts       # Test command
├── utils.ts           # Utility functions
├── runtime.ts         # Runtime configuration
├── cetus_tool.ts      # Cetus SDK integration
├── memory_cache.ts    # Memory cache
├── svg.ts             # SVG icon generation
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

## 📚 Command Help

For any command, use the `--help` flag to see detailed usage information:
```bash
cetus-cli-tool --help
cetus-cli-tool init --help
cetus-cli-tool create-token --help
cetus-cli-tool cetus --help
cetus-cli-tool cetus swap --help
cetus-cli-tool cetus positions --help
```

## 🔧 Troubleshooting

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

6. **Liquidity operation failures**
   - Confirm the position ID is correct
   - Check if you have sufficient tokens for the operation
   - Verify the liquidity pool status

### Getting Help

For any command, use the `--help` flag:
```bash
cetus-cli-tool --help
cetus-cli-tool init --help
cetus-cli-tool cetus list-pool --help
```

## 💡 Usage Examples

### Complete Workflow Example

```bash
# 1. Initialize the tool
cetus-cli-tool init --network testnet

# 2. Check your setup
cetus-cli-tool info

# 3. Create a custom token
cetus-cli-tool create-token --name "MyToken" --symbol "MTK" --decimal 9

# 4. Mint some tokens
cetus-cli-tool mint --package 0x123... --amount 1000

# 5. List available liquidity pools
cetus-cli-tool cetus list-pool

# 6. Create a liquidity pool
cetus-cli-tool cetus create-pool --coin-a 0x123::token::TOKEN --coin-b sui --init-price 0.1 --amount-a 100

# 7. Add liquidity
cetus-cli-tool cetus add-liquidity --pool 0xabc... --amount 10

# 8. Check your positions
cetus-cli-tool cetus positions

# 9. Execute a swap
cetus-cli-tool cetus swap --pool-address 0xabc... --amount 1 --a2b true --slippage 5

# 10. Remove partial liquidity
cetus-cli-tool cetus remove-liquidity --position 0xdef... --liquidity 500000

# 11. Close position
cetus-cli-tool cetus close-position --position 0xdef...
```

### Token Management Examples

```bash
# Create a token
cetus-cli-tool create-token --name "GameCoin" --symbol "GAME" --decimal 8 --description "Token for gaming"

# Mint tokens to a specific address
cetus-cli-tool mint --package 0x123... --amount 10000 --recipient 0xabc...

# Mint and freeze TreasuryCap afterwards
cetus-cli-tool mint --package 0x123... --amount 5000 --freeze true

# View created tokens
cetus-cli-tool tokens
```

### Liquidity Management Examples

```bash
# View all available pools
cetus-cli-tool cetus list-pool

# View pools for specific coin pairs
cetus-cli-tool cetus list-pool --coins 0x2::sui::SUI 0x123::token::TOKEN

# Create a new pool
cetus-cli-tool cetus create-pool --coin-a 0x123::token::TOKEN --coin-b sui --init-price 2.5 --amount-a 50

# Add liquidity to create new position
cetus-cli-tool cetus add-liquidity --pool 0xpool123... --amount 5

# Add liquidity to existing position
cetus-cli-tool cetus add-liquidity --pool 0xpool123... --amount 3 --position 0xpos456...

# View all your positions
cetus-cli-tool cetus positions --width

# Partially remove liquidity
cetus-cli-tool cetus remove-liquidity --position 0xpos456... --liquidity 1000000

# Completely close position
cetus-cli-tool cetus close-position --position 0xpos456...
```

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

For more information about the Cetus Protocol, visit [Cetus Protocol Documentation](https://cetus-1.gitbook.io/cetus-docs). 