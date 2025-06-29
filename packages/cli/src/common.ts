export interface PublishParams {
  modules: number[][] | string[];
  dependencies: string[];
}

export enum CetusNetwork {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

export enum SuiCoin {
  SUI = "0x2::sui::SUI",
  USDC = "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
}
