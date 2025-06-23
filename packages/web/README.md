# Cetus CLI Web Interface

## 📋 概述

这是Cetus CLI工具的Web界面版本，**真正实现了CLI的核心功能**，而不仅仅是UI演示。

## 🔥 真实CLI功能实现

### ✅ 已实现的核心功能

1. **真实Move包部署**
   - 从CLI项目复制的Move字节码 (`deploy_jsons/`)
   - 字节码修补功能 (`patch492thByte`)
   - 根据decimals动态修改包
   - 真实的Sui网络包发布

2. **代币创建与管理**
   - 完整的Token创建流程
   - Treasury Cap 管理
   - 代币元数据更新
   - SVG图标自动生成 (从CLI移植)
   - 代币铸造功能

3. **钱包集成**
   - 真实的钱包连接接口
   - 交易签名和执行
   - 多网络支持 (mainnet/testnet/devnet)

4. **Sui网络交互**
   - 真实的Sui客户端连接
   - 交易状态跟踪
   - 对象创建监听
   - 网络链接生成

### 🗂️ 项目结构

```
packages/web/
├── src/
│   ├── deploy_jsons/          # 从CLI复制的Move包字节码
│   │   ├── fast_coin_6_tx.json
│   │   ├── fast_coin_12_tx.json
│   │   ├── index.ts           # 包部署逻辑
│   │   └── tool.ts            # 字节码修补工具
│   ├── lib/
│   │   ├── real-token-operations.ts    # 真实Token操作
│   │   ├── real-wallet-context.tsx     # 真实钱包上下文
│   │   ├── sui-client.ts               # Sui客户端工具
│   │   └── wallet-context.tsx          # 模拟钱包(演示用)
│   └── components/
│       ├── RealTokenManagement.tsx     # 真实Token管理界面
│       └── TokenManagement.tsx         # 演示UI
```

### 🚀 使用方式

1. **真实模式** - 使用实际的CLI功能
   - 连接钱包 → 真实的区块链交互
   - 创建代币 → 部署真实的Move包
   - 铸造代币 → 实际的链上操作

2. **演示模式** - UI/UX预览
   - 模拟钱包连接
   - 界面设计展示
   - 无真实区块链交互

### 🔧 核心实现文件

#### `real-token-operations.ts`
```typescript
// 真实的Token操作类
export class RealTokenOperations {
  async createToken(params, walletAddress, signAndExecute) {
    // 1. 获取Move包数据 (从CLI)
    const packageData = await getDeployJson(params.decimals);
    
    // 2. 发布Move包
    const tx = new Transaction();
    const [upgradeCap] = tx.publish({
      modules: packageData.modules,
      dependencies: packageData.dependencies,
    });
    
    // 3. 签名并执行
    const result = await signAndExecute(tx);
    
    // 4. 更新代币元数据
    // ... 实际的链上操作
  }
}
```

#### `deploy_jsons/index.ts`
```typescript
// 从CLI移植的包部署逻辑
export const getDeployJson = (decimal: number): PublishParams | null => {
  let baseJson = fastCoinTx6;
  const newModules = patch492thByte(baseJson.modules[0], decimal);
  baseJson.modules = [newModules];
  return baseJson;
};
```

### 📊 功能对比

| 功能 | CLI工具 | Web界面 |
|------|---------|---------|
| Move包部署 | ✅ | ✅ |
| Token创建 | ✅ | ✅ |
| Token铸造 | ✅ | ✅ |
| SVG图标生成 | ✅ | ✅ |
| 多网络支持 | ✅ | ✅ |
| 钱包集成 | CLI签名 | Web钱包 |
| 用户界面 | 命令行 | 现代Web UI |

### 🎯 技术栈

- **Frontend**: Next.js 14, React, TypeScript
- **Blockchain**: Sui SDK, Move字节码
- **UI**: Tailwind CSS, 自定义组件
- **钱包**: Web钱包适配器接口

### 🚧 后续计划

1. **Cetus协议集成**
   - 池子创建和管理
   - 交换操作
   - 流动性管理

2. **高级功能**
   - 批量操作
   - 交易历史
   - 高级钱包功能

## 🔗 总结

这不是一个简单的UI演示，而是**真正将CLI工具的功能移植到Web界面**的完整实现。用户可以通过现代化的Web界面完成与CLI工具相同的区块链操作。

## 🌟 Features

- 🎨 **Modern UI**: Beautiful and responsive web interface built with Next.js and Tailwind CSS
- 🔗 **Wallet Integration**: Connect with Sui wallets seamlessly
- 🪙 **Token Management**: Create, mint, and manage custom tokens with visual forms
- 🌊 **Cetus Operations**: Interact with liquidity pools, swaps, and positions
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices
- 🌙 **Dark Mode**: Automatic dark/light theme support
- 🌐 **Multi-Network**: Support for Mainnet, Testnet, and Devnet
- ⚡ **Real-time**: Live updates from the Sui blockchain

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

```bash
# From the monorepo root
pnpm install

# Or install for web package only
cd packages/web
pnpm install
```

### Development

```bash
# From monorepo root
pnpm dev:web

# Or from packages/web directory
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# From monorepo root
pnpm build:web

# Or from packages/web directory
pnpm build
```

## 🚀 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Connect to Vercel**:
   ```bash
   vercel
   ```

2. **Set up project**:
   - Root Directory: `packages/web`
   - Framework Preset: `Next.js`
   - Build Command: `next build`
   - Output Directory: `.next`

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js plugin
- **Railway**: Connect your GitHub repository
- **Digital Ocean Apps**: Deploy with one click

## 📁 Project Structure

```
packages/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── TokenManagement.tsx
│   │   ├── CetusOperations.tsx
│   │   ├── WalletInfo.tsx
│   │   └── NetworkSelector.tsx
│   ├── lib/                   # Utility functions
│   │   └── utils.ts
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
├── vercel.json               # Vercel deployment configuration
└── package.json              # Dependencies and scripts
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Blockchain**: 
  - @mysten/sui (Sui SDK)
  - @cetusprotocol/cetus-sui-clmm-sdk (Cetus Protocol SDK)
  - @mysten/wallet-kit (Wallet integration)

## 🎨 UI Components

The web interface includes several key components:

### Token Management
- Create new tokens with visual forms
- Mint tokens to specified addresses
- Manage treasury capabilities
- View token portfolio

### Cetus Operations
- Pool creation and management
- Liquidity provision/removal
- Token swapping interface
- Position management dashboard

### Wallet Integration
- Multi-wallet support (Sui Wallet, Suiet, etc.)
- Real-time balance updates
- Network switching
- Transaction history

## 🌐 Network Support

- **Mainnet**: Production environment
- **Testnet**: Testing environment with test tokens
- **Devnet**: Development environment for testing

## 📱 Responsive Design

The interface is fully responsive and works perfectly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the `packages/web` directory:

```env
# Optional: Customize RPC endpoints
NEXT_PUBLIC_SUI_MAINNET_RPC=https://fullnode.mainnet.sui.io:443
NEXT_PUBLIC_SUI_TESTNET_RPC=https://fullnode.testnet.sui.io:443
NEXT_PUBLIC_SUI_DEVNET_RPC=https://fullnode.devnet.sui.io:443

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Customization

- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Fonts**: Update `layout.tsx` to change typography
- **Components**: Extend components in `src/components/`

## 🧪 Development

### Scripts

```bash
# Development server
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code quality checks
- **Prettier**: Code formatting (via Next.js)

## 🔄 CLI Equivalent

This web interface provides the same functionality as the CLI tool:

| CLI Command | Web Interface |
|-------------|---------------|
| `cetus-cli-tool init` | Network selector |
| `cetus-cli-tool create-token` | Token creation form |
| `cetus-cli-tool tokens` | Token management dashboard |
| `cetus-cli-tool mint` | Mint token interface |
| `cetus-cli-tool cetus list-pool` | Pool browser |
| `cetus-cli-tool cetus swap` | Swap interface |
| `cetus-cli-tool cetus positions` | Position dashboard |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](../../LICENSE) file for details.

## 👨‍💻 Author

**v1xingyue** <qixingyue@gmail.com>

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Vercel](https://vercel.com/) for seamless deployment
- [Sui Foundation](https://sui.io/) for the blockchain infrastructure
- [Cetus Protocol](https://www.cetus.zone/) for the DEX protocol 