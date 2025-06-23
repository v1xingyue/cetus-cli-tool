# Cetus Tools Monorepo

This is a monorepo containing both CLI and Web tools for interacting with the Cetus Protocol on the Sui blockchain.

## 📦 Packages

### 🔧 CLI Tool (`packages/cli`)
A command-line interface tool for interacting with the Cetus Protocol on the Sui blockchain.

- **Location**: `packages/cli/`
- **Package Name**: `cetus-cli-tool`
- **Technology**: Node.js, TypeScript, Yargs

#### Features
- 🔧 **Token Management**: Create, mint, and manage custom tokens
- 🏊 **Liquidity Pool Operations**: Create, query, and manage Cetus protocol liquidity pools
- 💰 **Wallet Integration**: Built-in wallet management and balance checking
- 🌐 **Multi-Network Support**: Supports mainnet, testnet, and devnet
- 📦 **Smart Contract Management**: Deploy and freeze Move smart contract packages
- 🔄 **Token Swapping**: Execute token swaps through Cetus liquidity pools
- 📊 **Liquidity Position Management**: View and manage liquidity positions

### 🌐 Web Tool (`packages/web`)
A modern web interface for Cetus Protocol operations with the same functionality as the CLI tool.

- **Location**: `packages/web/`
- **Package Name**: `cetus-web-tool`
- **Technology**: Next.js 14, React, TypeScript, Tailwind CSS
- **Deployment**: Optimized for Vercel

#### Features
- 🎨 **Modern UI**: Beautiful and responsive web interface
- 🔗 **Wallet Connection**: Integration with Sui wallets
- 📱 **Mobile Friendly**: Responsive design for all devices
- 🌙 **Dark Mode**: Light and dark theme support
- ⚡ **Real-time Updates**: Live data from Sui blockchain

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation
```bash
# Install all dependencies
pnpm install

# Or using npm
npm install
```

### Development

#### CLI Tool
```bash
# Run CLI tool in development mode
pnpm dev:cli

# Build CLI tool
pnpm build:cli
```

#### Web Tool
```bash
# Run web tool in development mode
pnpm dev:web

# Build web tool
pnpm build:web
```

### Build All
```bash
# Build both packages
pnpm build:all
```

## 📁 Project Structure

```
cetus-tools-monorepo/
├── packages/
│   ├── cli/                    # CLI Tool
│   │   ├── src/
│   │   │   ├── commands/       # CLI commands
│   │   │   └── ...
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                    # Web Tool
│       ├── src/
│       │   ├── app/            # Next.js app directory
│       │   ├── components/     # React components
│       │   └── lib/            # Utility functions
│       ├── package.json
│       ├── next.config.js
│       └── tailwind.config.js
├── package.json                # Root package.json (monorepo config)
└── README.md
```

## 🛠️ Technologies Used

### CLI Tool
- **Node.js & TypeScript**: Core runtime and language
- **Yargs**: Command-line argument parsing
- **Chalk**: Terminal styling
- **@mysten/sui**: Sui blockchain SDK
- **@cetusprotocol/cetus-sui-clmm-sdk**: Cetus protocol SDK

### Web Tool
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components
- **@mysten/wallet-kit**: Sui wallet integration
- **Lucide React**: Icon library

## 🚀 Deployment

### CLI Tool
The CLI tool can be published to npm or installed globally:
```bash
cd packages/cli
npm publish
```

### Web Tool (Vercel)
The web tool is optimized for Vercel deployment:
```bash
cd packages/web
vercel deploy
```

## 📖 Documentation

### CLI Tool
For detailed CLI documentation, see the original README sections or run:
```bash
cetus-cli-tool --help
```

### Web Tool
The web interface provides an intuitive GUI for all CLI operations with additional features:
- Visual transaction history
- Interactive pool management
- Real-time price feeds
- Drag-and-drop token creation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**v1xingyue** <qixingyue@gmail.com>

## 🙏 Acknowledgments

- Cetus Protocol team for the excellent SDK
- Sui Foundation for blockchain infrastructure
- Next.js team for the amazing framework 
