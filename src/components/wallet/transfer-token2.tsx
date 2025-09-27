'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useReadContract, useWriteContract } from 'wagmi'
import { erc20Abi } from '@/lib/abi'
import { toast } from 'sonner'

interface TransferToken2Props {
  account: `0x${string}`
}

export const TransferToken2 = ({ account }: TransferToken2Props) => {
  const [tokenAddress, setTokenAddress] = useState(
    '0xf08a50178dfcde18524640ea6618a1f965821715'
  )
  const [toAddress, setToAddress] = useState(
    '0x65669FE35312947050C450Bd5d36e6361f85ec12'
  )
  const [amount, setAmount] = useState('0.001')

  // 读取 allowance
  const { data: allowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'allowance',
    args: toAddress ? [account, toAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!toAddress,
    },
  })

  const { writeContract } = useWriteContract()

  const handleTransfer = async () => {
    if (!tokenAddress || !toAddress || !amount) {
      toast.error('请填写所有字段')
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('请输入有效数量')
      return
    }

    try {
      const amountInSmallestUnit = BigInt(Math.floor(numAmount * 1e6)) // USDC 6位精度
      const currentAllowance = allowance || 0n

      if (currentAllowance < amountInSmallestUnit) {
        // allowance 不足，先执行 approve
        writeContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [toAddress as `0x${string}`, amountInSmallestUnit],
          account,
        })
        toast.success('⚡ 已发起授权交易，请在钱包中确认')
      } else {
        // allowance 足够，直接转账
        writeContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [toAddress as `0x${string}`, amountInSmallestUnit],
          account,
        })
        toast.success('🚀 已发起转账交易，请在钱包中确认')
      }
    } catch (err: any) {
      console.error('❌ 操作失败:', err)
      toast.error(`操作失败: ${err.message || '未知错误'}`)
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white font-semibold">ERC-20 授权 + 转账</h3>

      <Input
        placeholder="代币合约地址 (如 Sepolia USDC)"
        value={tokenAddress}
        onChange={e => setTokenAddress(e.target.value)}
        className="bg-gray-900 text-white border-gray-700"
      />

      <Input
        placeholder="接收方/合约地址"
        value={toAddress}
        onChange={e => setToAddress(e.target.value)}
        className="bg-gray-900 text-white border-gray-700"
      />

      <Input
        placeholder="数量"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="bg-gray-900 text-white border-gray-700"
      />

      {allowance !== undefined && (
        <div className="text-sm text-gray-300">
          当前授权额度: {(Number(allowance) / 1e6).toFixed(2)} Tokens
        </div>
      )}

      <Button
        onClick={handleTransfer}
        className="bg-blue-600 hover:bg-blue-700"
        disabled={!tokenAddress || !toAddress || !amount}
      >
        授权 / 转账
      </Button>
    </div>
  )
}
