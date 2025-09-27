'use client'

import { useState, useEffect, useRef } from 'react'
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContract,
} from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { erc20Abi } from '@/lib/abi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface TransferTokenProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function TransferToken({ onSuccess, onError }: TransferTokenProps) {
  const { address } = useAccount()
  const [tokenAddress, setTokenAddress] = useState(
    '0x779877A7B0D9E8603169DdbD7836e478b4624789'
  )
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')

  const hasTriggeredSuccess = useRef(false)

  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'decimals',
  })
  const { data: symbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'symbol',
  })
  const { data: balance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
  } = useWriteContract()

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // ... (handleSubmit 逻辑保持不变) ...
    if (!toAddress || !amount || !tokenAddress || !decimals) {
      toast.error('请填写所有字段或等待代币信息加载')
      return
    }
    try {
      const amountAsBigInt = parseUnits(amount, decimals)
      if (balance && amountAsBigInt > balance) {
        toast.error('代币余额不足')
        return
      }
      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [toAddress as `0x${string}`, amountAsBigInt],
      })
    } catch (err) {
      toast.error('输入格式错误')
    }
  }

  useEffect(() => {
    if (isConfirmed && !hasTriggeredSuccess.current) {
      console.log('✅ Transaction confirmed! Receipt:', receipt)
      toast.success(
        `代币转账成功！交易哈希: ${receipt.transactionHash.slice(0, 10)}...`
      )
      onSuccess?.()
      setToAddress('')
      setAmount('')

      hasTriggeredSuccess.current = true
    }
  }, [isConfirmed, receipt, onSuccess])

  useEffect(() => {
    if (hash) {
      hasTriggeredSuccess.current = false
    }
  }, [hash])

  useEffect(() => {
    const error = writeError || receiptError
    if (error) {
      toast.error(`交易失败: ${error.shortMessage || error.message}`)
      onError?.(error)
    }
  }, [writeError, receiptError, onError])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-center text-gray-200">
        Transfer ERC-20 Token
      </h3>

      <div>
        <label className="text-sm font-medium text-gray-400">
          Token Contract Address
        </label>
        <Input
          type="text"
          value={tokenAddress}
          onChange={e => setTokenAddress(e.target.value)}
          placeholder="0x..."
          disabled
          className="mt-1 bg-gray-800 border-gray-700 text-white"
        />
        {symbol && (
          <p className="text-xs text-gray-500 mt-1">
            代币: {symbol} | 余额:{' '}
            {balance ? formatUnits(balance, decimals || 18) : '0'}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-400">
          Recipient Address
        </label>
        <Input
          type="text"
          value={toAddress}
          onChange={e => setToAddress(e.target.value)}
          placeholder="0x..."
          className="mt-1 bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-400">
          Amount {symbol && `(${symbol})`}
        </label>
        <Input
          type="text"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="e.g., 1.5"
          className="mt-1 bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || isConfirming || !address}
        className="w-full py-3 text-base font-semibold bg-gray-600 hover:bg-gray-600/50"
      >
        {!address
          ? '请先连接钱包'
          : isPending
          ? '等待钱包确认...'
          : isConfirming
          ? '正在转账...'
          : '发送代币'}
      </Button>
    </form>
  )
}
