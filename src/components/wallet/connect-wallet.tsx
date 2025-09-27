'use client'

import { useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ConnectWalletProps {
  onConnect?: () => void
}

export function ConnectWallet({ onConnect }: ConnectWalletProps) {
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="space-y-3">
      {connectors.map(connector => (
        <Button
          key={connector.uid}
          className="w-full py-3 text-base font-medium bg-blue-500 hover:bg-blue-500/50"
          onClick={() => {
            connect({ connector })
            onConnect?.()
          }}
        >
          {connector.icon && (
            <Image
              src={connector.icon}
              width={20}
              height={20}
              alt="icon"
            ></Image>
          )}
          {connector.name}
        </Button>
      ))}
      {status && <p className="text-center text-sm text-gray-400">{status}</p>}
      {error && (
        <p className="text-center text-sm text-red-500">{error.message}</p>
      )}
    </div>
  )
}
