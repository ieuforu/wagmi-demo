'use client'

import { useState, useEffect, useRef } from 'react'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi' // ✅ 新增 hook
import { parseEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface TransferETHProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function TransferETH({ onSuccess, onError }: TransferETHProps) {
  const [recipientAddress, setRecipientAddress] = useState('')
  const [ethValue, setEthValue] = useState('')
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>() // ✅ 存储交易哈希

  const {
    sendTransaction,
    isPending: isSending,
    data: sentTx, // ✅ wagmi 也会返回 tx hash
    isError,
    error: txError,
  } = useSendTransaction()

  // ✅ 监听交易是否上链确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    })

  const hasHandledSuccess = useRef(false)

  // ✅ 当交易被确认时，触发 onSuccess
  useEffect(() => {
    if (isConfirmed && !hasHandledSuccess.current) {
      hasHandledSuccess.current = true
      onSuccess?.()
      setRecipientAddress('')
      setEthValue('')
      setTxHash(undefined) // 清理
    }
  }, [isConfirmed, onSuccess])

  // ✅ 发送交易
  const transferETH = () => {
    if (!recipientAddress || !ethValue) {
      toast('请输入接受金额和地址')
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      toast('请输入有效的以太坊地址')
      return
    }

    sendTransaction({
      to: recipientAddress as `0x${string}`,
      value: parseEther(ethValue),
    })
  }

  useEffect(() => {
    if (sentTx) {
      setTxHash(sentTx)
      toast.success('📬 交易已提交，等待确认...')
      // 立即清空表单
      setRecipientAddress('')
      setEthValue('')
    }
  }, [sentTx])

  useEffect(() => {
    if (isError && txError) {
      onError?.(txError)
    }
  }, [isError, txError, onError])

  return (
    <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-1">Send ETH</h3>

      <Input
        placeholder="接收地址 (0x...)"
        className="bg-gray-900 border-gray-700 text-white"
        value={recipientAddress}
        onChange={e => setRecipientAddress(e.target.value)}
      />

      <Input
        placeholder="ETH数量"
        className="bg-gray-900 border-gray-700 text-white mt-2"
        value={ethValue}
        onChange={e => setEthValue(e.target.value)}
      />

      <Button
        onClick={transferETH}
        disabled={isSending || isConfirming || !recipientAddress || !ethValue}
        className="w-full py-3 text-base font-semibold bg-gray-800 hover:bg-gray-800/60 mt-3"
      >
        {isSending
          ? '⏳ 发送中...'
          : isConfirming
          ? '🔍 等待确认...'
          : '发送ETH'}
      </Button>

      {isSending && (
        <p className="text-yellow-400 mt-2">⏳ 交易已提交，等待签名</p>
      )}
      {isConfirming && <p className="text-blue-400 mt-2">🔗 等待区块确认...</p>}
      {isConfirmed && <p className="text-green-500 mt-2">✅ 交易已上链！</p>}
      {isError && <p className="text-red-500 mt-2">❌ {txError?.message}</p>}
    </div>
  )
}
