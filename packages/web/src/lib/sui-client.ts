import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'

export const NETWORKS = {
  mainnet: 'mainnet',
  testnet: 'testnet',
  devnet: 'devnet',
} as const

export type Network = keyof typeof NETWORKS

export function getSuiClient(network: Network = 'mainnet'): SuiClient {
  const url = getFullnodeUrl(network as any)
  return new SuiClient({ url })
}

export function getTransactionLink(digest: string, network: Network): string {
  if (network === 'mainnet') {
    return `https://suivision.xyz/txblock/${digest}`
  } else {
    return `https://suivision.xyz/txblock/${digest}?network=${network}`
  }
}

export async function waitForTransaction(
  client: SuiClient,
  digest: string
) {
  await client.waitForTransaction({ digest })
  
  const transaction = await client.getTransactionBlock({
    digest,
    options: {
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
    },
  })
  
  return transaction
}

export function getCreatedObject(
  transactionBlock: any,
  options: { expectPrefix: string }
) {
  const created = transactionBlock.objectChanges?.filter(
    (change: any) => change.type === 'created'
  )
  
  const targetObject = created?.find((obj: any) =>
    obj.objectType.startsWith(options.expectPrefix)
  )
  
  return targetObject ? {
    objectID: targetObject.objectId,
    objectType: targetObject.objectType,
  } : null
} 