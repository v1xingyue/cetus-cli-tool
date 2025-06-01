# Cetus CLI Tool

A command-line interface tool for interacting with the Cetus Protocol on the Sui blockchain. This tool provides functionality for token management, pool operations, and various blockchain interactions.

## Features

- 🔧 **Token Management**: Create, mint, and manage tokens
- 🏊 **Pool Operations**: Create and list Cetus protocol pools
- 💰 **Wallet Integration**: Built-in wallet management and balance checking
- 🌐 **Multi-Network Support**: Works with mainnet, testnet, and devnet
- 📦 **Package Management**: Deploy and freeze Move packages

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
Update configuration settings:
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
- `-d, --decimal`: Token decimals (6-18, default: 9)
- `--description`: Token description (default: "No description")

#### `tokens`
List and manage your tokens:
```bash
cetus-cli-tool tokens
```

#### `mint`
Mint tokens to an address:
```bash
cetus-cli-tool mint
```

### Package Management

#### `freeze-package`
Freeze a Move package to prevent further upgrades:
```bash
cetus-cli-tool freeze-package
```

### Cetus Protocol Commands

All Cetus-specific commands are under the `cetus` subcommand:

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
Create a new liquidity pool:
```bash
cetus-cli-tool cetus create-pool
```

### Utility Commands

#### `compare`
Compare different values or states:
```bash
cetus-cli-tool compare
```

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
│   ├── create-token.ts
│   ├── init.ts
│   └── ...
├── utils.ts           # Utility functions
├── runtime.ts         # Runtime configuration
└── cetus_tool.ts      # Cetus SDK integration
```

### Building

```bash
# Build TypeScript to JavaScript
npm run build

# Build Move package bytecode
npm run build:tx_json
```

### Adding New Commands

1. Create a new command file in `src/commands/`
2. Implement the `CommandModule` interface
3. Export the command in `src/commands/index.ts`

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

### Getting Help

For any command, use the `--help` flag:
```bash
cetus-cli-tool --help
cetus-cli-tool init --help
cetus-cli-tool cetus list-pool --help
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