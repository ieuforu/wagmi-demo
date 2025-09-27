'use client'

import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ConnectWallet,
  WalletInfo,
  NetworkSwitcher,
  ETHConverter,
  TransferETH,
  MessageSigner,
  SignatureVerifier,
  TokenInfo,
  TransferToken,
  TransferToken2,
} from '@/components/wallet'
import { toast } from 'sonner'

export default function Home() {
  const { status: accountStatus, address: account } = useAccount()
  const { disconnect } = useDisconnect()
  const [ethValue, setEthValue] = useState('')
  const [signature, setSignature] = useState('')
  const [message, setMessage] = useState('')
  const [shouldRefetchBalance, setShouldRefetchBalance] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-800 bg-gray-900 text-gray-100">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-white">
            Wallet Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {accountStatus === 'connected' ? (
            <>
              <WalletInfo
                shouldRefetchBalance={shouldRefetchBalance}
                onBalanceRefetch={() => setShouldRefetchBalance(false)}
                onDisconnect={disconnect}
              />
              <hr className="border-gray-700" />
              <NetworkSwitcher />
              <hr className="border-gray-700" />
              <ETHConverter value={ethValue} onChange={setEthValue} />
              <hr className="border-gray-700" />
              <TransferETH
                onSuccess={() => {
                  setShouldRefetchBalance(true)
                }}
                onError={error => toast(`转账失败：${error.message}`)}
              />
              <hr className="border-gray-700" />
              <TransferToken
                onSuccess={() => {
                  setShouldRefetchBalance(true)
                }}
              />
              <TransferToken2 account={account} />
              <hr className="border-gray-700" />
              <MessageSigner
                onSignature={(sig, msg) => {
                  setSignature(sig)
                  setMessage(msg)
                }}
              />
              <SignatureVerifier message={message} signature={signature} />
              <hr className="border-gray-700" />
              <Button
                variant="destructive"
                className="w-full py-3 text-base font-semibold"
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <ConnectWallet onConnect={() => console.log('钱包已连接')} />
          )}
          <hr />
          <TokenInfo address="0x1CDD2EaB61112697626F7b4bB0e23Da4FeBF7B7C" />
        </CardContent>
      </Card>
    </div>
  )
}
