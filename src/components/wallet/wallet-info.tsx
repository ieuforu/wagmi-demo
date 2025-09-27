'use client'

import { useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WalletInfoProps {
  onDisconnect: () => void
  shouldRefetchBalance?: boolean
  onBalanceRefetch?: () => void
}

export function WalletInfo({
  onDisconnect,
  shouldRefetchBalance,
  onBalanceRefetch,
}: WalletInfoProps) {
  const { address, status: accountStatus, chain, chainId } = useAccount()
  const { data: balance, isLoading, refetch } = useBalance({ address })

  const formattedBalance =
    balance?.value !== undefined ? formatEther(balance.value) : null

  useEffect(() => {
    if (shouldRefetchBalance) {
      refetch()
        .then(() => {
          onBalanceRefetch?.() // 告诉父组件：我刷新完了
        })
        .catch(err => {
          console.error('余额刷新失败:', err)
        })
    }
  }, [shouldRefetchBalance, refetch, onBalanceRefetch])
  return (
    <div className="space-y-6">
      {/* Account Info */}
      <div className="space-y-2 text-sm">
        <p className="flex items-center gap-2">
          <span className="text-gray-400">Status:</span>
          <Badge>{accountStatus}</Badge>
        </p>
        <p className="text-gray-400">
          Address:
          <span className="ml-1 text-gray-200 text-xs break-all">
            {address}
          </span>
        </p>
        <p className="text-gray-400">
          Chain ID: <span className="text-gray-200">{chainId ?? '--'}</span>
        </p>
      </div>

      {/* Balance */}
      <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-1">Balance</h3>
        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <p className="text-2xl font-mono">{formattedBalance} ETH</p>
        )}
      </div>
    </div>
  )
}
