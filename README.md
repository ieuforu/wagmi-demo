# 连接 / 断开钱包

```tsx
// 连接钱包
const { connectors, connect } = useConnect()
connect({ connector })

// 断开钱包
const { disconnect } = useDisconnect()
disconnect()
```

# 读取指定地址的余额

```tsx
const { data: balance } = useBalance({ address })
```

# 使用 formatEther 和 parseEther 处理单位转换

```tsx
// formatEther - 用于显示余额（来自 WalletInfo.tsx）
const formattedBalance =
  balance?.value !== undefined ? formatEther(balance.value) : null

// parseEther - 用于ETH转账（来自 TransferETH.tsx）
value: parseEther(ethValue)

// parseEther - 用于ETH转换器（来自 ETHConverter.tsx）
weiValue = parseEther(value).toString()
```

# 根据代币地址获取一个代币的信息（全称、简称等）

```tsx
// 来自 TokenInfo.tsx
const { data, isLoading, error } = useReadContracts({
  contracts: [
    { abi: erc20Abi, address, functionName: 'name', chainId: 1 },
    { abi: erc20Abi, address, functionName: 'symbol', chainId: 1 },
    { abi: erc20Abi, address, functionName: 'decimals', chainId: 1 },
  ],
})
```

# 多个钱包相互切换

```tsx
const { connectors, connect } = useConnect()
connect({ connector })
```

# 多链相互切换

```tsx
// 来自 NetworkSwitcher.tsx
const { chain } = useAccount()
const { chains, switchChain } = useSwitchChain()

// 切换链
switchChain({ chainId: c.id })
```

# 转账 ETH 给另外一个账户

```tsx
const { sendTransaction } = useSendTransaction()

sendTransaction({
  to: recipientAddress as `0x${string}`,
  value: parseEther(ethValue),
})
```

# 签名消息 “Hello ETH” 得到 hash，并验证签名正确性

```tsx
// 签名消息（来自 MessageSigner.tsx）
const { signMessage } = useSignMessage()
signMessage({ message: 'Hello ETH' })

// 验证签名（来自 SignatureVerifier.tsx）
const { data: isValid } = useVerifyMessage({
  address: addressToVerify as `0x${string}`,
  message: 'Hello ETH',
  signature: signature as `0x${string}`,
})
```

# 转账某个 ERC-20 代币给另一个账户

```tsx
const { writeContract } = useWriteContract()

writeContract({
  address: tokenAddress as `0x${string}`,
  abi: erc20Abi,
  functionName: 'transfer',
  args: [toAddress as `0x${string}`, amountAsBigInt],
})
```

# 授权并转账某个 ERC-20 代币给某合约

```tsx
// 来自 TransferToken2.tsx
const { writeContract } = useWriteContract()

// 先授权
writeContract({
  address: tokenAddress as `0x${string}`,
  abi: erc20Abi,
  functionName: 'approve',
  args: [toAddress as `0x${string}`, amountInSmallestUnit],
})

// 后转账（在同一个逻辑分支中，但需钱包两次确认）
writeContract({
  address: tokenAddress as `0x${string}`,
  abi: erc20Abi,
  functionName: 'transfer',
  args: [toAddress as `0x${string}`, amountInSmallestUnit],
})
```

# 取消授权 ERC-20 代币给某合约

```tsx
writeContract({
  address: tokenAddress as `0x${string}`,
  abi: erc20Abi,
  functionName: 'approve',
  args: [spenderAddress as `0x${string}`, 0n], // 设置为 0 表示取消授权
})
```

# 转账 ERC-721 给另一个账户

```tsx
writeContract({
  address: nftAddress as `0x${string}`,
  abi: erc721Abi, // 需要引入 ERC721 ABI
  functionName: 'transferFrom',
  args: [ownerAddress as `0x${string}`, toAddress as `0x${string}`, tokenId],
})
```

# 授权并转账 ERC-721 给某合约

```tsx
// 先授权
writeContract({
  address: nftAddress as `0x${string}`,
  abi: erc721Abi,
  functionName: 'approve',
  args: [operatorAddress as `0x${string}`, tokenId],
})

// 或批量授权
writeContract({
  address: nftAddress as `0x${string}`,
  abi: erc721Abi,
  functionName: 'setApprovalForAll',
  args: [operatorAddress as `0x${string}`, true],
})
```

# 完成一次读取合约交易

```tsx
// 来自 TokenInfo.tsx 或 TransferToken.tsx
const { data: symbol } = useReadContract({
  address: tokenAddress as `0x${string}`,
  abi: erc20Abi,
  functionName: 'symbol',
})
```

# 完成一次写入合约交易

```tsx
// 来自 TransferToken.tsx 或 TransferToken2.tsx
const { writeContract } = useWriteContract()

writeContract({
  address: tokenAddress as `0x${string}`,
  abi: erc20Abi,
  functionName: 'transfer',
  args: [toAddress as `0x${string}`, amountAsBigInt],
})
```

# 等待写合约交易的最终确认

```tsx
const { data: hash, writeContract } = useWriteContract()
const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  })
```

# 完成在写合约之前模拟写合约交易的结果

```tsx
import { simulateContract } from '@wagmi/core'

// 需配合 config 使用，非 Hook
const result = await simulateContract(config, {
  address: tokenAddress,
  abi: erc20Abi,
  functionName: 'transfer',
  args: [toAddress, amountAsBigInt],
})
```

# 监听一个合约事件，并能得到正确的结果

```tsx
import { useWatchContractEvent } from 'wagmi'

useWatchContractEvent({
  address: tokenAddress as `0x${string}`,
  abi: erc20Abi,
  eventName: 'Transfer',
  onLogs(logs) {
    console.log('Transfer event:', logs)
  },
})
```

# 预估一笔交易的 Gas

```tsx
import { estimateGas } from '@wagmi/core'

const gas = await estimateGas(config, {
  to: recipientAddress,
  value: parseEther(ethValue),
})
```

# 完成批量交易

```tsx
// 来自 TokenInfo.tsx —— 批量读取，非写入
useReadContracts({
  contracts: [
    { abi: erc20Abi, address, functionName: 'name' },
    { abi: erc20Abi, address, functionName: 'symbol' },
    { abi: erc20Abi, address, functionName: 'decimals' },
  ],
})
```
