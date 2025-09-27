import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

export function TokenInfo({ address }: { address: `0x${string}` }) {
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      { abi: erc20Abi, address, functionName: 'name', chainId: 1 },
      { abi: erc20Abi, address, functionName: 'symbol', chainId: 1 },
      { abi: erc20Abi, address, functionName: 'decimals', chainId: 1 },
    ],
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <p>Name: {data?.[0]?.result as string}</p>
      <p>Symbol: {data?.[1]?.result as string}</p>
      <p>Decimals: {data?.[2]?.result?.toString()}</p>
    </div>
  )
}
