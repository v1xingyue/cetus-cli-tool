import { Transaction } from "@mysten/sui/transactions";
import {
  getSuiClient,
  Network,
  getCreatedObject,
  waitForTransaction,
  getTransactionLink,
} from "./sui-client";

// 从CLI项目移植的核心逻辑
export interface PublishParams {
  modules: number[][] | string[];
  dependencies: string[];
}

// 从CLI项目移植SVG生成函数
function generateTokenIconSVG(
  text: string,
  options: {
    width?: number;
    height?: number;
    fontColor?: string;
    fontFamily?: string;
    backgroundColors?: string[];
  } = {}
): string {
  const {
    width = 200,
    height = 200,
    fontColor = "white",
    fontFamily = "Arial",
    backgroundColors = [
      "#e74c3c",
      "#3498db",
      "#2ecc71",
      "#f1c40f",
      "#9b59b6",
      "#1abc9c",
      "#e67e22",
    ],
  } = options;

  let fontSize: number;
  const length = text.length;
  if (length === 1) fontSize = 150;
  else if (length === 2) fontSize = 120;
  else if (length === 3) fontSize = 80;
  else if (length <= 6) fontSize = 48;
  else fontSize = 32;

  const bgColor =
    backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="${bgColor}" rx="16" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-size="${fontSize}" fill="${fontColor}" font-family="${fontFamily}">
          ${text}
        </text>
      </svg>
    `.trim();

  return svg;
}

function svgToBase64(svg: string): string {
  // 去除换行和多余空白，避免编码异常
  const cleanedSvg = svg
    .replace(/\n+/g, "")
    .replace(/\t+/g, "")
    .replace(/\s{2,}/g, " ");

  // 浏览器环境
  if (typeof window !== "undefined" && window.btoa) {
    // btoa 只能编码 ASCII，需要先把 Unicode 转成 UTF-8
    const utf8Svg = unescape(encodeURIComponent(cleanedSvg));
    const base64 = window.btoa(utf8Svg);
    return `data:image/svg+xml;base64,${base64}`;
  }

  // Node.js 环境
  if (typeof Buffer !== "undefined") {
    const base64 = Buffer.from(cleanedSvg, "utf-8").toString("base64");
    return `data:image/svg+xml;base64,${base64}`;
  }

  throw new Error("No Base64 encoding method available.");
}

// 从CLI项目移植字节码修补函数
function patch492thByte(base64Input: string, newValue: number): string {
  if (newValue < 0 || newValue > 255) {
    throw new Error("newValue must be between 0 and 255");
  }

  let byteArray: Uint8Array;

  // Decode base64 to Uint8Array
  if (typeof atob !== "undefined") {
    // Browser
    const binaryStr = atob(base64Input);
    byteArray = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      byteArray[i] = binaryStr.charCodeAt(i);
    }
  } else {
    throw new Error("Base64 decoding not supported in this environment");
  }

  if (byteArray.length <= 492) {
    throw new Error("Input is too short. Needs at least 493 bytes.");
  }

  // Modify byte at position 492
  byteArray[492] = newValue;

  // Encode back to base64 (Browser)
  let binaryStr = "";
  for (let i = 0; i < byteArray.length; i++) {
    binaryStr += String.fromCharCode(byteArray[i]);
  }
  return btoa(binaryStr);
}

// 动态导入JSON文件的函数
async function getDeployJson(decimal: number): Promise<PublishParams | null> {
  try {
    // 动态导入基础的fast_coin_6_tx.json
    const fastCoinTx6 = await import("../deploy_jsons/fast_coin_6_tx.json");
    const baseJson = fastCoinTx6.default;

    // 修补字节码
    const newModules = patch492thByte(baseJson.modules[0], decimal);

    return {
      modules: [newModules],
      dependencies: baseJson.dependencies,
    };
  } catch (error) {
    console.error("Failed to load deploy JSON:", error);
    return null;
  }
}

export interface CreateTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  iconUrl?: string;
}

export interface TokenCreationResult {
  success: boolean;
  digest?: string;
  packageId?: string;
  treasuryCapId?: string;
  coinMetadataId?: string;
  transactionLink?: string;
  coinType?: string;
  error?: string;
}

export class RealTokenOperations {
  private client: ReturnType<typeof getSuiClient>;
  private network: Network;

  constructor(network: Network = "mainnet") {
    this.network = network;
    this.client = getSuiClient(network);
  }

  // 创建代币的主要方法 (真实实现)
  async createToken(
    params: CreateTokenParams,
    walletAddress: string,
    signAndExecute: (tx: Transaction) => Promise<{ digest: string }>
  ): Promise<TokenCreationResult> {
    try {
      console.log("Creating token with params:", params);
      console.log("Target wallet:", walletAddress);

      // 1. 获取包数据
      const packageData = await getDeployJson(params.decimals);
      if (!packageData) {
        throw new Error("Failed to load package data");
      }

      // 2. 创建发布包的交易
      const tx = new Transaction();
      const [upgradeCap] = tx.publish({
        modules: packageData.modules,
        dependencies: packageData.dependencies,
      });

      // 转移UpgradeCap给调用者
      tx.transferObjects([upgradeCap], tx.pure.address(walletAddress));

      // 设置Gas预算
      tx.setGasBudget(200_000_000);

      // 3. 签名并执行发布交易
      console.log("Publishing package...");
      const publishResp = await signAndExecute(tx);
      console.log("Package published, digest:", publishResp.digest);

      // 4. 等待交易完成并获取结果
      const publishResult = await waitForTransaction(
        this.client,
        publishResp.digest
      );

      // 5. 提取创建的对象
      const treasuryCap = getCreatedObject(publishResult, {
        expectPrefix: "0x2::coin::TreasuryCap",
      });

      const coinMetadata = getCreatedObject(publishResult, {
        expectPrefix: "0x2::coin::CoinMetadata",
      });

      if (!treasuryCap || !coinMetadata) {
        throw new Error("Failed to create treasury cap or coin metadata");
      }

      console.log("Treasury Cap:", treasuryCap.objectID);
      console.log("Coin Metadata:", coinMetadata.objectID);

      // 6. 提取代币类型
      const coinType = coinMetadata.objectType.substring(
        24,
        coinMetadata.objectType.length - 1
      );

      console.log("Coin Type:", coinType);

      // 7. 更新元数据
      const updateTx = this.createUpdateMetadataTransaction(
        treasuryCap.objectID,
        coinMetadata.objectID,
        params,
        coinType
      );

      updateTx.setGasBudget(200_000_000);

      console.log("Updating metadata...");
      const updateResp = await signAndExecute(updateTx);
      console.log("Metadata updated, digest:", updateResp.digest);

      // 8. 提取packageId (从第一个包发布交易获取)
      const publishedChange = publishResult.objectChanges?.find(
        (change: any) => change.type === "published"
      ) as any;
      const packageId = publishedChange?.packageId || "unknown";

      // 9. 返回成功结果
      return {
        success: true,
        digest: updateResp.digest,
        packageId: packageId,
        treasuryCapId: treasuryCap.objectID,
        coinMetadataId: coinMetadata.objectID,
        coinType: coinType,
        transactionLink: getTransactionLink(updateResp.digest, this.network),
      };
    } catch (error) {
      console.error("Token creation failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // 更新代币元数据的交易
  private createUpdateMetadataTransaction(
    treasuryCapId: string,
    coinMetadataId: string,
    params: CreateTokenParams,
    coinType: string
  ): Transaction {
    const tx = new Transaction();

    const iconUrl =
      params.iconUrl || svgToBase64(generateTokenIconSVG(params.symbol));

    // 更新代币名称
    tx.moveCall({
      target: "0x2::coin::update_name",
      typeArguments: [coinType],
      arguments: [
        tx.object(treasuryCapId),
        tx.object(coinMetadataId),
        tx.pure.string(params.name),
      ],
    });

    // 更新代币符号
    tx.moveCall({
      target: "0x2::coin::update_symbol",
      typeArguments: [coinType],
      arguments: [
        tx.object(treasuryCapId),
        tx.object(coinMetadataId),
        tx.pure.string(params.symbol),
      ],
    });

    // 更新描述
    tx.moveCall({
      target: "0x2::coin::update_description",
      typeArguments: [coinType],
      arguments: [
        tx.object(treasuryCapId),
        tx.object(coinMetadataId),
        tx.pure.string(params.description),
      ],
    });

    // 更新图标
    tx.moveCall({
      target: "0x2::coin::update_icon_url",
      typeArguments: [coinType],
      arguments: [
        tx.object(treasuryCapId),
        tx.object(coinMetadataId),
        tx.pure.string(iconUrl),
      ],
    });

    // 冻结元数据对象
    tx.moveCall({
      target: "0x2::transfer::public_freeze_object",
      typeArguments: [`0x2::coin::CoinMetadata<${coinType}>`],
      arguments: [tx.object(coinMetadataId)],
    });

    return tx;
  }

  // 铸造代币 (真实实现)
  async mintToken(
    treasuryCapId: string,
    coinType: string,
    amount: string,
    recipient: string,
    freeze: boolean,
    signAndExecute: (tx: Transaction) => Promise<{ digest: string }>
  ): Promise<{ success: boolean; digest?: string; error?: string }> {
    try {
      const tx = new Transaction();

      // 铸造代币
      const [minted] = tx.moveCall({
        target: "0x2::coin::mint",
        typeArguments: [coinType],
        arguments: [tx.object(treasuryCapId), tx.pure.u64(amount)],
      });

      // 转移给接收者
      tx.transferObjects([minted], tx.pure.address(recipient));

      // 如果需要，冻结treasury cap
      if (freeze) {
        tx.moveCall({
          target: "0x2::transfer::public_freeze_object",
          typeArguments: [`0x2::coin::TreasuryCap<${coinType}>`],
          arguments: [tx.object(treasuryCapId)],
        });
      }

      tx.setGasBudget(200_000_000);
      const response = await signAndExecute(tx);

      return {
        success: true,
        digest: response.digest,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
