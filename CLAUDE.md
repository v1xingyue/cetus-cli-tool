# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Monorepo Commands (run from root)
- `pnpm install` - Install all dependencies for both packages
- `pnpm build:all` - Build both CLI and web packages
- `pnpm dev:cli` - Run CLI tool in development mode
- `pnpm dev:web` - Run web tool in development mode
- `pnpm build:cli` - Build CLI package only
- `pnpm build:web` - Build web package only

### CLI Tool Commands (packages/cli)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run CLI in development mode with ts-node
- `npm run build:tx_json` - Build Move contract and generate transaction JSON

### Web Tool Commands (packages/web)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build production Next.js app
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Architecture Overview

This is a monorepo containing two packages that share common functionality for interacting with the Cetus Protocol on Sui blockchain:

### CLI Tool (packages/cli)
- **Entry point**: `src/cli.ts` - Main CLI application using yargs
- **Commands**: `src/commands/` - All CLI commands organized by functionality
  - General commands: `init`, `info`, `create-token`, `mint`, `tokens`, etc.
  - Cetus-specific commands: `src/commands/cetus/` (pools, swaps, liquidity)
- **Core classes**:
  - `Runtime` (`src/runtime.ts`) - Main runtime class handling Sui client, wallet, transactions
  - `MemoryCache` (`src/memory_cache.ts`) - Caching layer for blockchain data
- **Common utilities**: `src/common.ts`, `src/utils.ts`

### Web Tool (packages/web)
- **Framework**: Next.js 14 with App Router
- **Entry point**: `src/app/page.tsx` - Main web interface
- **Components**: `src/components/` - React components for UI
- **Shared logic**: `src/lib/` - Utilities and context providers
- **Wallet integration**: Uses `@mysten/wallet-kit` for Sui wallet connection

### Shared Concepts
Both packages interact with:
- **Sui blockchain**: Using `@mysten/sui` SDK
- **Cetus Protocol**: Using `@cetusprotocol/cetus-sui-clmm-sdk`
- **Move contracts**: Custom token contract in `packages/cli/fast_coin/`

## Key Components

### Runtime Class (CLI)
The `Runtime` class is the core of CLI operations:
- Manages Ed25519 keypair and network configuration
- Provides transaction building and execution methods
- Handles coin metadata caching
- Saves configuration to `.env` file

### Command Structure (CLI)
Commands are organized as yargs modules in `src/commands/`:
- Each command exports a `CommandModule` object
- Commands are registered in `src/commands/index.ts`
- Cetus-specific commands are grouped in `src/commands/cetus/`

### Network Support
- Supports mainnet, testnet, and devnet
- Network configuration stored in Runtime class
- Different coin addresses for different networks (see `SuiCoin` enum)

## Development Notes

### TypeScript Configuration
- Both packages use TypeScript with strict settings
- CLI uses ES modules (`"type": "module"` in package.json)
- Web uses standard Next.js TypeScript setup

### Move Contract Development
- Move contracts in `packages/cli/fast_coin/`
- Use `npm run build:tx_json` to rebuild Move contract and generate transaction data
- Contract artifacts are committed to repo in `src/deploy_jsons/`

### Testing
- CLI: Uses Mocha (test framework configured but no tests found)
- Web: Uses Next.js built-in testing capabilities

### Environment Variables
- CLI stores private key and network in `.env` file
- Both packages support multiple Sui networks
- Use `init` command to set up initial configuration

## Important File Locations

- **CLI entry**: `packages/cli/src/cli.ts`
- **Web entry**: `packages/web/src/app/page.tsx`
- **Shared types**: `packages/cli/src/common.ts`
- **Move contract**: `packages/cli/fast_coin/sources/token.move`
- **Transaction templates**: `packages/cli/src/deploy_jsons/`