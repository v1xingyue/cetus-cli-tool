# Cetus CLI Tool

A command-line interface tool for interacting with the Cetus Protocol on the Sui blockchain. This tool provides functionality for token management, pool operations, liquidity management, and various blockchain interactions.

## Features

- 🔧 **Token Management**: Create, mint, and manage tokens with customizable metadata
- 🏊 **Pool Operations**: Create and list Cetus protocol pools
- 💰 **Wallet Integration**: Built-in wallet management and balance checking
- 🌐 **Multi-Network Support**: Works with mainnet, testnet, and devnet
- 📦 **Package Management**: Deploy and freeze Move packages
- 🔄 **Swap Operations**: Execute token swaps through Cetus pools
- 📊 **Position Management**: Create, view, manage, and close liquidity positions
- 💧 **Liquidity Management**: Add and remove liquidity from existing positions
- ⚙️ **Configuration Management**: Dynamic network and setting configuration
- 🔍 **Information Display**: Comprehensive wallet and protocol information
- 🧪 **Development Tools**: Testing commands and utility functions

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
Display current configuration and wallet information including all token balances:
```bash
cetus-cli-tool info
```

#### `config-set [options]`
Update configuration settings like network:
```bash
cetus-cli-tool config-set --network testnet
```

**Options:**
- `-n, --network`: Network to use (mainnet, testnet, devnet) - default: mainnet

### Token Management

#### `create-token [options]`
Create a new token on the Sui blockchain with customizable metadata:
```bash
cetus-cli-tool create-token --name "MyToken" --symbol "MTK" --decimal 9 --description "My custom token"
```

**Options:**
- `-n, --name`: Token name (default: "x")
- `-s, --symbol`: Token symbol (default: "X")  
- `-d, --decimal`: Token decimals (choices: 6-18, default: 9)
- `--description`: Token description (default: "No description")
- `--icon`: Token icon URL or base64 (auto-generated if not provided)

#### `tokens`
List and manage your created tokens:
```bash
cetus-cli-tool tokens
```

#### `mint [options]`
Mint tokens to an address:
```bash
cetus-cli-tool mint --package <package_id> --amount 100 --recipient <address>
```

**Options:**
- `-p, --package`: Package ID (required)
- `-r, --recipient`: Recipient address (default: your wallet address)
- `-a, --amount`: Amount to mint in human readable format (default: 1)
- `-f, --freeze`: Freeze the treasury cap after minting (default: false)

### Package Management

#### `freeze-package`
Freeze a Move package to prevent further upgrades:
```bash
cetus-cli-tool freeze-package
```

### Utility Commands

#### `compare`
Compare different deployment modules and configurations:
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

#### `cetus create-pool [options]`
Create a new liquidity pool:
```bash
cetus-cli-tool cetus create-pool --coin-a <coin_type> --coin-b sui --init-price 1.5 --amount-a 100
```

**Options:**
- `--coin-a`: Coin A type or alias name (required)
- `--coin-b`: Coin B type or alias name (default: "sui")
- `--init-price`: Initial price of coin A (default: 1)
- `--amount-a`: Amount of coin A in human readable format (default: "0.1")

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
- `-w, --width`: Show detailed position information (default: false)

#### `cetus create-liquidity [options]`
Add liquidity to create a new position or add to existing position:
```bash
# Create new position
cetus-cli-tool cetus create-liquidity --pool <pool_address> --amount 10

# Add to existing position
cetus-cli-tool cetus create-liquidity --pool <pool_address> --amount 10 --position <position_id>
```

**Options:**
- `--pool`: Pool address (required)
- `--amount`: Amount of coin A in human readable format (required)
- `--position`: Position ID to add liquidity to (optional, creates new position if not provided)

#### `cetus remove-liquidity [options]`
Remove liquidity from an existing position:
```bash
cetus-cli-tool cetus remove-liquidity --position <position_id> --liquidity 1000000
```

**Options:**
- `--position`: Position object ID to remove liquidity from (required)
- `--liquidity`: Amount of liquidity to remove (required)

#### `cetus close-position [options]`
Close a position completely:
```bash
cetus-cli-tool cetus close-position --position <position_id>
```

**Options:**
- `--position`: Position ID to close (required)

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
- Network settings (mainnet, testnet, devnet)
- Wallet keypair
- Runtime configuration
- Token metadata cache

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
│   │   ├── positions.ts # View positions
│   │   ├── create-liquidity.ts # Add liquidity
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
├── memory_cache.ts    # Memory caching system
├── cetus_tool.ts      # Cetus SDK integration
├── svg.ts            # SVG icon generation
├── common.ts          # Common types and constants
└── deploy_jsons/      # Move package deployment data
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
cetus-cli-tool cetus create-liquidity --help
```

## Troubleshooting

### Common Issues

1. **"load failed, please run init first!!"**
   - Run `cetus-cli-tool init` to initialize the tool

2. **Network connection issues**
   - Check your internet connection
   - Verify the network is accessible
   - Try switching networks with `config-set --network <network>`

3. **Insufficient balance**
   - Ensure your wallet has enough SUI for gas fees
   - Check balance with `cetus-cli-tool info`
   - For testnet/devnet, get faucet from https://faucet.testnet.sui.io/

4. **Pool not found errors**
   - Verify the pool address is correct
   - Ensure you're on the correct network
   - Check if the pool exists using `cetus list-pool`

5. **Swap failures**
   - Check if you have sufficient token balance
   - Verify slippage tolerance is appropriate
   - Ensure the pool has enough liquidity

6. **Position management errors**
   - Verify position ID is correct and exists
   - Ensure you own the position
   - Check if position has sufficient liquidity for operations

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

# 4. Mint some tokens
cetus-cli-tool mint --package <package_id> --amount 1000

# 5. List available pools
cetus-cli-tool cetus list-pool

# 6. Create a new pool
cetus-cli-tool cetus create-pool --coin-a <your_token> --coin-b sui --init-price 0.1 --amount-a 100

# 7. Add liquidity (create position)
cetus-cli-tool cetus create-liquidity --pool <pool_address> --amount 50

# 8. Check your positions
cetus-cli-tool cetus positions

# 9. Execute a swap
cetus-cli-tool cetus swap --pool-address <pool_address> --amount 1 --a2b true --slippage 5

# 10. Remove some liquidity
cetus-cli-tool cetus remove-liquidity --position <position_id> --liquidity 500000

# 11. Close position when done
cetus-cli-tool cetus close-position --position <position_id>
```

### Advanced Usage

```bash
# Switch networks
cetus-cli-tool config-set --network mainnet

# Create token with custom icon
cetus-cli-tool create-token --name "Premium Token" --symbol "PREM" --decimal 18 --description "A premium DeFi token" --icon "data:image/svg+xml;base64,..."

# View detailed position information
cetus-cli-tool cetus positions --width

# Add liquidity to existing position
cetus-cli-tool cetus create-liquidity --pool <pool_address> --amount 25 --position <existing_position_id>
```

## Key Features Details

### Token Creation
- Supports decimals from 6 to 18
- Auto-generates SVG icons if not provided
- Creates treasury cap for minting control
- Updates metadata with comprehensive information

### Pool Management
- Creates Concentrated Liquidity Market Maker (CLMM) pools
- Supports any token pair combinations
- Configurable tick spacing and price ranges
- Real-time pool information and statistics

### Position Management
- Full lifecycle management (create, view, modify, close)
- Support for adding/removing liquidity
- Position rewards collection
- Detailed position analytics

### Swap Operations
- Supports both A→B and B→A swaps
- Configurable slippage protection
- Real-time price estimation
- Transaction link generation for tracking

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

For more information about the Cetus Protocol, visit [Cetus Protocol Documentation](https://cetus-1.gitbook.io/cetus-docs). 